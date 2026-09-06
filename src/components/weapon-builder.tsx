import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleDollarSign,
  Hammer,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Swords,
} from "lucide-react";
import {
  advancedWeapons,
  applyMonsterStats,
  basicWeapons,
  formatGold,
  modDescription,
  modificationCost,
  mods,
  monsterInfusionCost,
  monsterCompatibility,
  weapons,
  type Weapon,
} from "./weapon-data";
import { apexRequirement, monsterWeapons, rulesForWeapon, type MonsterTier } from "./monster-weapon-data";
import { ruleName, ruleText } from "../data/game-rules";
import RulePill from "./RulePill";
import { splitNamedAbilities } from "./rule-sections";
import WeaponExport from "./WeaponExport";
import { makeWeaponCard } from "./weapon-export";
import { resolveTreeBuild, type TreeBuildPreset } from "./weapon-build-links";
import "./weapon-builder.css";

type View = "builder" | "reference";

type WeaponWorkbenchProps = {
  initialView?: View;
};

const kindLabels = { melee: "Melee", ranged: "Ranged", focus: "Spell focus" } as const;
const tierNames = ["Mundane", "Minor", "Major", "Apex"];

function ChoiceButton({
  active,
  children,
  detail,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <button className={`wb-choice${active ? " is-active" : ""}`} onClick={onClick} type="button">
      <span>{children}</span>
      {detail && <small>{detail}</small>}
      {active && <Check aria-hidden="true" size={16} />}
    </button>
  );
}

function StepHeader({ number, title, optional }: { number: number; title: string; optional?: boolean }) {
  return (
    <div className="wb-step-heading">
      <span>{number}</span>
      <strong>{title}</strong>
      {optional && <small>Optional</small>}
    </div>
  );
}

function cleanInline(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function RuleText({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) return null;

  return (
    <div className="wb-rule-text">
      {blocks.map((block, index) => {
        const lines = block.split("\n").filter(Boolean);
        if (lines.every((line) => /^\s*(?:[-*]|\d+[.)])\s+/.test(line))) {
          return (
            <ul key={index}>
              {lines.map((line) => <li key={line}>{cleanInline(line.replace(/^\s*(?:[-*]|\d+[.)])\s+/, ""))}</li>)}
            </ul>
          );
        }

        const feature = block.match(/^\*{3}(.+?)\*{3}\s*(.*)$/s);
        if (feature) {
          return <p key={index}><strong>{cleanInline(feature[1])}</strong> {cleanInline(feature[2])}</p>;
        }
        return <p key={index}>{cleanInline(block)}</p>;
      })}
    </div>
  );
}

function Builder({ preset, clearPreset }: { preset?: TreeBuildPreset; clearPreset: () => void }) {
  const [hasChosenWeapon, setHasChosenWeapon] = useState(!preset);
  const [baseId, setBaseId] = useState("bow");
  const [weaponId, setWeaponId] = useState("longbow");
  const [modId, setModId] = useState<string | undefined>(preset ? undefined : "recurve");
  const [monsterId, setMonsterId] = useState<string | undefined>(preset?.monsterId ?? "hydra");
  const [treeName, setTreeName] = useState(preset?.treeName ?? "Northern Swarm");
  const [tier, setTier] = useState(preset?.tier ?? 2);
  const presetMonster = monsterWeapons.find((item) => item.id === preset?.monsterId);
  const compatibleWeapons = advancedWeapons.filter((item) => preset && monsterCompatibility[preset.monsterId]?.includes(item.family));

  const base = basicWeapons.find((item) => item.id === baseId) ?? basicWeapons[0];
  const upgradeOptions = advancedWeapons.filter((item) => item.family === base.family);
  const weapon = upgradeOptions.find((item) => item.id === weaponId) ?? upgradeOptions[0];
  const availableMods = mods.filter((mod) => weapon.mods.includes(mod.id));
  const availableMonsters = monsterWeapons.filter((monster) =>
    monsterCompatibility[monster.id]?.includes(weapon.family),
  );
  const monster = availableMonsters.find((item) => item.id === monsterId);
  const tree = monster?.trees.find((item) => item.name === treeName) ?? monster?.trees[0];
  const chosenMod = mods.find((item) => item.id === modId);
  const stats = applyMonsterStats(weapon, modId, monster?.id, tree?.name, monster ? tier : 0);
  const modCost = chosenMod ? modificationCost(weapon) : 0;
  const infusionCost = monster ? monsterInfusionCost(tier) : 0;
  const totalGold = weapon.cost + modCost + infusionCost;
  const selectedTier = tree?.tiers.find((item) => item.rank === tier);

  const selectBase = (nextBase: Weapon) => {
    const nextWeapon = advancedWeapons.find((item) => item.family === nextBase.family)!;
    setBaseId(nextBase.id);
    setWeaponId(nextWeapon.id);
    setModId(undefined);
    setMonsterId(undefined);
    setTreeName("");
    setTier(0);
  };

  const selectWeapon = (nextWeapon: Weapon) => {
    setBaseId(basicWeapons.find((item) => item.family === nextWeapon.family)!.id);
    setWeaponId(nextWeapon.id);
    setHasChosenWeapon(true);
    if (!nextWeapon.mods.includes(modId ?? "")) setModId(undefined);
    if (preset) return;
    setMonsterId(undefined);
    setTreeName("");
    setTier(0);
  };

  const selectMonster = (nextId?: string) => {
    const nextMonster = monsterWeapons.find((item) => item.id === nextId);
    setMonsterId(nextId);
    setTreeName(nextMonster?.trees[0]?.name ?? "");
    setTier(nextId ? 1 : 0);
  };

  const reset = () => {
    setBaseId("bow");
    setWeaponId("longbow");
    setModId(undefined);
    setMonsterId(undefined);
    setTreeName("");
    setTier(0);
  };

  const weaponDescription = [
    monster?.name,
    chosenMod?.name,
    weapon.name,
  ].filter(Boolean).join(" ");

  return (
    <div className="wb-builder-grid">
      <div className="wb-build-controls">
        {preset && <section className="wb-step">
          <p className="wb-weapon-description">Building from {presetMonster?.name} · {preset.treeName}</p>
          <StepHeader number={1} title={`Choose a weapon for ${preset.treeName}`} />
          <p className="wb-weapon-description">This tree is already selected. Choose a compatible weapon to see its version of the abilities.</p>
          <div className="wb-choice-grid">
            {compatibleWeapons.map((item) => <ChoiceButton key={item.id} active={hasChosenWeapon && item.id === weapon.id} detail={`${item.damage} · ${formatGold(item.cost)}`} onClick={() => selectWeapon(item)}>{item.name}</ChoiceButton>)}
          </div>
          <button className="wb-reset" onClick={clearPreset} type="button">Start a different build</button>
        </section>}
        {!preset && <>
        <section className="wb-step">
          <StepHeader number={1} title="Choose a foundation" />
          <div className="wb-choice-grid wb-family-grid">
            {basicWeapons.map((item) => (
              <ChoiceButton
                active={item.id === base.id}
                detail={`${item.damage} · ${kindLabels[item.kind]}`}
                key={item.id}
                onClick={() => selectBase(item)}
              >
                {item.name}
              </ChoiceButton>
            ))}
          </div>
        </section>

        <section className="wb-step">
          <StepHeader number={2} title="Choose its advanced form" />
          <div className="wb-choice-grid">
            {upgradeOptions.map((item) => (
              <ChoiceButton
                active={item.id === weapon.id}
                detail={`${item.damage} · ${formatGold(item.cost)} total`}
                key={item.id}
                onClick={() => selectWeapon(item)}
              >
                {item.name}
              </ChoiceButton>
            ))}
          </div>
        </section>

        </>}
        {hasChosenWeapon && <>
        <section className="wb-step">
          <StepHeader number={preset ? 2 : 3} title="Add a modification" optional />
          <div className="wb-choice-grid">
            <ChoiceButton active={!modId} detail="No additional cost" onClick={() => setModId(undefined)}>None</ChoiceButton>
            {availableMods.map((mod) => (
              <ChoiceButton
                active={mod.id === modId}
                detail={formatGold(modificationCost(weapon))}
                key={mod.id}
                onClick={() => setModId(mod.id)}
              >
                {mod.name}
              </ChoiceButton>
            ))}
          </div>
          {chosenMod && <p className="wb-selection-note">{modDescription(chosenMod)}</p>}
        </section>

        {!preset && <section className="wb-step">
          <StepHeader number={4} title="Infuse it with a monster" optional />
          <div className="wb-choice-grid">
            <ChoiceButton active={!monster} detail="Remain mundane" onClick={() => selectMonster(undefined)}>Uninfused</ChoiceButton>
            {availableMonsters.map((item) => (
              <ChoiceButton
                active={item.id === monster?.id}
                detail={`${item.trees.length} ${item.trees.length === 1 ? "path" : "paths"}`}
                key={item.id}
                onClick={() => selectMonster(item.id)}
              >
                {item.name}
              </ChoiceButton>
            ))}
          </div>
          {!availableMonsters.length && <p className="wb-empty">No monster weapon paths are documented for this weapon family yet.</p>}
        </section>}

        {monster && tree && (
          <section className="wb-step">
            <StepHeader number={preset ? 3 : 5} title={preset ? `Explore ${preset.treeName}` : "Follow an infusion path"} />
            {!preset && <div className="wb-choice-grid">
              {monster.trees.map((item) => (
                <ChoiceButton
                  active={item.name === tree.name}
                  detail={`${item.tiers.length} named infusions`}
                  key={item.name}
                  onClick={() => { setTreeName(item.name); if (!item.tiers.some((entry) => entry.rank === tier)) setTier(item.tiers[0]?.rank ?? 0); }}
                >
                  {item.name}
                </ChoiceButton>
              ))}
            </div>}
            <div className="wb-tier-track" aria-label="Infusion tier">
              {[1, 2, 3].map((rank) => {
                const tierData = tree.tiers.find((item) => item.rank === rank);
                return (
                  <button
                    className={tier === rank ? "is-active" : tier > rank ? "is-complete" : ""}
                    disabled={!tierData}
                    aria-pressed={tier === rank}
                    key={rank}
                    onClick={() => setTier(rank)}
                    type="button"
                  >
                    <span>{rank}</span>
                    <strong>{tierData?.name ?? "Not documented"}</strong>
                    <small>{tierData ? `${tierData.rankName} infusion` : tierNames[rank]}</small>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        </>}
      </div>

      <aside className="wb-sheet-wrap">
        {hasChosenWeapon ? <>
        <WeaponExport card={makeWeaponCard({ weapon, modName: chosenMod?.name, ...stats, totalGold, modCost, infusionCost, monster, tree, tier })} />
        <div className="wb-sheet" style={{ "--monster-accent": monster?.accent ?? "#a16207" } as React.CSSProperties}>
          <div className="wb-sheet-kicker"><Swords size={16} /> Finished weapon</div>
          <h2>{selectedTier?.name ?? weaponDescription}</h2>
          {selectedTier && <p className="wb-weapon-description">{weaponDescription} · {tree?.name} · {selectedTier.rankName}</p>}
          <p className="wb-progression">{base.name} <ArrowRight size={14} /> {weapon.name}{monster && <><ArrowRight size={14} /> {monster.name}</>}</p>

          <div className="wb-stat-grid">
            <div><span>Weapon dice</span><strong>{stats.damage}</strong></div>
            <div><span>Magic bonus</span><strong>{stats.bonus ? `+${stats.bonus}` : "—"}</strong></div>
            <div><span>Total gold cost</span><strong>{formatGold(totalGold)}</strong></div>
            <div><span>Category</span><strong>{kindLabels[weapon.kind]}</strong></div>
          </div>

          {monster && <p className="wb-calculation-note">Weapon dice exclude ability modifiers and the magic bonus. Conditional attacks, spell bonuses, saves, and player-chosen features are detailed in the rules below, not fully calculated here.</p>}

          <div className="wb-sheet-section">
            <h3><ShieldCheck size={17} /> Properties</h3>
            <div className="wb-property-list">
              {stats.properties.map((property) => <RulePill key={`${property.ruleId}-${JSON.stringify(property.values)}`} rule={property} />)}
            </div>
          </div>

          <div className="wb-sheet-section wb-cost-block">
            <h3><CircleDollarSign size={17} /> Cost</h3>
            <dl>
              <div><dt>{weapon.name} (includes {base.name})</dt><dd>{formatGold(weapon.cost)}</dd></div>
              {chosenMod && <div><dt>{chosenMod.name} modification</dt><dd>{formatGold(modCost)}</dd></div>}
              {monster && <div><dt>{tierNames[tier]} {monster.name} infusion</dt><dd>{formatGold(infusionCost)} + parts</dd></div>}
              <div className="wb-cost-total"><dt>Total gold cost</dt><dd>{formatGold(totalGold)}</dd></div>
            </dl>
            {monster && tier === 3 && tree && <p className="wb-apex-requirement"><strong>Apex requirement:</strong> {apexRequirement(monster, tree)}</p>}
            {monster && tier < 3 && <p>Monster parts are required in addition to the gold cost.</p>}
          </div>

          {monster && tree && (
            <div className="wb-sheet-section">
              <h3><Sparkles size={17} /> {monster.name} base features</h3>
              <RuleText text={monster.baseRules} />
              <div className="wb-tree-intro">
                <strong>{tree.name} path</strong>
                <RuleText text={tree.description} />
              </div>
              {tree.tiers.filter((item) => item.rank <= tier).map((item) => (
                <TierRules key={item.rank} tier={item} weapon={weapon} />
              ))}
              <a className="wb-rules-link" href={`/weapons/${monster.sourcePath}/`}>Read the complete {monster.name} rules <ArrowRight size={14} /></a>
            </div>
          )}
        </div>
        <button className="wb-reset" onClick={preset ? () => { setHasChosenWeapon(false); setModId(undefined); } : reset} type="button"><RotateCcw size={15} /> {preset ? "Choose another weapon" : "Start over"}</button>
        </> : <section className="wb-step"><h2>{preset?.treeName}</h2><p>Pick a weapon to reveal its stat sheet, named abilities, and crafting costs. Your monster tree stays selected as you compare weapons.</p></section>}
      </aside>
    </div>
  );
}

function TierRules({ tier, weapon }: { tier: MonsterTier; weapon: Weapon }) {
  const variants = rulesForWeapon(tier, weapon.id, weapon.name);
  return (
    <details className="wb-tier-rules" open={tier.rank === 1}>
      <summary>
        <span>Tier {tier.rank} · {tier.rankName}</span>
        <strong>{tier.name}</strong>
        <ChevronDown size={16} />
      </summary>
      <RuleText text={tier.rules} />
      {variants.map((variant) => (
        <div className="wb-variant-rule" key={variant.label}>
          {splitNamedAbilities(variant.rules).map((ability, index) => <div key={index}>
            {ability.heading && <small>{ability.heading}</small>}
            <RuleText text={ability.text} />
          </div>)}
        </div>
      ))}
    </details>
  );
}

function ReferenceTable() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<"all" | Weapon["stage"]>("all");
  const [kind, setKind] = useState<"all" | Weapon["kind"]>("all");
  const [family, setFamily] = useState("all");
  const [expanded, setExpanded] = useState<string | undefined>();

  const filtered = useMemo(() => weapons.filter((weapon) => {
    const propertyTerms = weapon.properties.flatMap((property) => [ruleName(property), ruleText(property)]);
    const modTerms = weapon.mods.flatMap((id) => {
      const item = mods.find((candidate) => candidate.id === id);
      return item ? [item.name, modDescription(item)] : [];
    });
    const haystack = [weapon.name, weapon.familyName, weapon.damage, ...propertyTerms, ...modTerms].join(" ").toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (stage === "all" || weapon.stage === stage)
      && (kind === "all" || weapon.kind === kind)
      && (family === "all" || weapon.family === family);
  }), [query, stage, kind, family]);

  return (
    <div className="wb-reference">
      <div className="wb-filter-bar">
        <label className="wb-search"><Search size={17} /><input aria-label="Search weapons" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names, properties, mods…" /></label>
        <select aria-label="Weapon stage" value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>
          <option value="all">All stages</option><option value="basic">Basic</option><option value="advanced">Advanced</option>
        </select>
        <select aria-label="Weapon category" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}>
          <option value="all">All categories</option><option value="melee">Melee</option><option value="ranged">Ranged</option><option value="focus">Spell focus</option>
        </select>
        <select aria-label="Weapon family" value={family} onChange={(event) => setFamily(event.target.value)}>
          <option value="all">All families</option>
          {basicWeapons.map((weapon) => <option value={weapon.family} key={weapon.family}>{weapon.familyName}</option>)}
        </select>
        <span className="wb-result-count">{filtered.length} {filtered.length === 1 ? "weapon" : "weapons"}</span>
      </div>

      <div className="wb-table-scroll">
        <table className="wb-table">
          <thead><tr><th>Weapon</th><th>Stage</th><th>Family</th><th>Damage</th><th>Cost</th><th>Properties</th><th aria-label="Expand" /></tr></thead>
          <tbody>
            {filtered.map((weapon) => (
              <Fragment key={weapon.id}>
                <tr className={expanded === weapon.id ? "is-expanded" : ""} onClick={() => setExpanded(expanded === weapon.id ? undefined : weapon.id)}>
                  <td><strong>{weapon.name}</strong><small>{kindLabels[weapon.kind]}</small></td>
                  <td><span className={`wb-stage wb-stage-${weapon.stage}`}>{weapon.stage}</span></td>
                  <td>{weapon.familyName}</td><td>{weapon.damage}</td><td>{formatGold(weapon.cost)}</td>
                  <td><div className="wb-table-properties">{weapon.properties.map((property) => <RulePill key={`${property.ruleId}-${JSON.stringify(property.values)}`} rule={property} />)}</div></td>
                  <td><button className="wb-expand-button" type="button" aria-label={`Modifications for ${weapon.name}`} aria-expanded={expanded === weapon.id} onClick={(event) => { event.stopPropagation(); setExpanded(expanded === weapon.id ? undefined : weapon.id); }}><ChevronDown className="wb-row-chevron" size={17} /></button></td>
                </tr>
                {expanded === weapon.id && (
                  <tr className="wb-expanded-row" key={`${weapon.id}-detail`}>
                    <td colSpan={7}>
                      <strong>Available modifications</strong>
                      <div>{weapon.mods.map((id) => {
                        const mod = mods.find((item) => item.id === id)!;
                        return <RulePill rule={{ ...mod.rule, label: mod.name }} key={id} />;
                      })}</div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && <div className="wb-no-results"><Hammer size={26} /><strong>No weapons match those filters.</strong><button onClick={() => { setQuery(""); setStage("all"); setKind("all"); setFamily("all"); }}>Clear filters</button></div>}
    </div>
  );
}

export default function WeaponWorkbench({ initialView = "builder" }: WeaponWorkbenchProps) {
  const [view, setView] = useState<View>(initialView);
  const [preset, setPreset] = useState<TreeBuildPreset>();
  const [invalidLink, setInvalidLink] = useState(false);
  useEffect(() => {
    const readLink = () => {
      const selection = resolveTreeBuild(window.location.search);
      setPreset(selection);
      setInvalidLink(!selection && new URLSearchParams(window.location.search).has("tree"));
      if (selection) setView("builder");
    };
    readLink();
    window.addEventListener("popstate", readLink);
    return () => window.removeEventListener("popstate", readLink);
  }, []);
  const clearPreset = () => {
    const url = new URL(window.location.href);
    ["monster", "tree", "tier"].forEach((key) => url.searchParams.delete(key));
    window.history.replaceState(null, "", url);
    setPreset(undefined);
    setInvalidLink(false);
  };
  return (
    <div className="weapon-workbench not-content">
      <header className="wb-hero">
        <div><span className="wb-eyebrow">The Mythic Age armory</span><h1>Forge a legend.</h1><p>Start with steel. Choose its form. Then see what it could become.</p></div>
        <Swords aria-hidden="true" />
      </header>
      <nav className="wb-view-tabs" aria-label="Weapon tools">
        <button className={view === "builder" ? "is-active" : ""} onClick={() => setView("builder")}><Sparkles size={17} /> Build a weapon</button>
        <button className={view === "reference" ? "is-active" : ""} onClick={() => setView("reference")}><Search size={17} /> Weapon reference</button>
      </nav>
      {invalidLink && <p className="wb-selection-note">That monster tree link is not recognized. You can start a new build below.</p>}
      {view === "builder" ? <Builder key={preset ? `${preset.monsterId}:${preset.treeName}:${preset.tier}` : "normal"} preset={preset} clearPreset={clearPreset} /> : <ReferenceTable />}
    </div>
  );
}
