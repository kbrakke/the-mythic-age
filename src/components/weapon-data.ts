import {
  ruleRef,
  resolveRule,
  ruleText,
  type GameRuleId,
  type RuleRef,
} from "../data/game-rules";

export type WeaponKind = "melee" | "ranged" | "focus";

export type Weapon = {
  id: string;
  name: string;
  family: string;
  familyName: string;
  stage: "basic" | "advanced";
  kind: WeaponKind;
  cost: number;
  damage: string;
  properties: RuleRef[];
  mods: string[];
};

export type WeaponMod = {
  id: string;
  name: string;
  rule: RuleRef;
};

const mod = (id: GameRuleId, name?: string): WeaponMod => ({ id, name: name ?? id, rule: ruleRef(id) });

export const mods: WeaponMod[] = [
  mod("bone", "Bone"),
  mod("concealable", "Concealable"),
  mod("cross-guard", "Cross Guard"),
  mod("dense", "Dense Head"),
  mod("dual-head", "Dual Head"),
  mod("keen", "Keen"),
  mod("metal", "Metal"),
  mod("recurve", "Recurve"),
  mod("sauroter", "Sauroter"),
  mod("penetrating", "Steel Tipped"),
  mod("weighted-haft", "Weighted Haft"),
  mod("wood", "Wood"),
];

export function modDescription(item: WeaponMod) {
  return ruleText(item.rule);
}

const familyMods: Record<string, string[]> = {
  axe: ["dual-head", "keen", "recurve", "sauroter", "weighted-haft"],
  bow: ["dense", "recurve", "weighted-haft"],
  club: ["bone", "dense", "wood"],
  crystal: ["bone", "concealable", "metal"],
  dagger: ["concealable", "cross-guard", "sauroter", "penetrating"],
  hammer: ["dense", "dual-head"],
  longsword: ["cross-guard", "keen", "penetrating"],
  shortsword: ["cross-guard", "concealable", "keen", "penetrating"],
  spear: ["dual-head", "sauroter", "penetrating", "weighted-haft"],
  staff: ["bone", "concealable", "wood"],
};

const p = ruleRef;
const range = (ruleId: "ammunition" | "thrown", normal: number, long: number) => p(ruleId, { normal, long });
const versatile = (damage: string) => p("versatile", { damage });

const w = (
  id: string,
  name: string,
  family: string,
  familyName: string,
  stage: Weapon["stage"],
  kind: WeaponKind,
  cost: number,
  damage: string,
  properties: RuleRef[],
): Weapon => ({ id, name, family, familyName, stage, kind, cost, damage, properties, mods: familyMods[family] });

export const weapons: Weapon[] = [
  w("axe", "Axe", "axe", "Axe", "basic", "melee", 10, "1d8 slashing", [versatile("1d10")]),
  w("bow", "Bow", "bow", "Bow", "basic", "ranged", 25, "1d6 piercing", [range("ammunition", 80, 320), p("two-handed")]),
  w("club", "Club", "club", "Club", "basic", "melee", 0.1, "1d4 bludgeoning", [p("cheap")]),
  w("crystal", "Crystal", "crystal", "Crystal", "basic", "focus", 25, "—", [p("volatile")]),
  w("dagger", "Dagger", "dagger", "Dagger", "basic", "melee", 2, "1d4 piercing", [p("finesse"), p("light"), range("thrown", 20, 60)]),
  w("hammer", "Hammer", "hammer", "Hammer", "basic", "melee", 15, "1d8 bludgeoning", [versatile("1d10")]),
  w("longsword", "Longsword", "longsword", "Longsword", "basic", "melee", 15, "1d8 slashing", [versatile("1d10")]),
  w("shortsword", "Short Sword", "shortsword", "Short Sword", "basic", "melee", 10, "1d6 slashing", [p("finesse"), p("light")]),
  w("spear", "Spear", "spear", "Spear", "basic", "melee", 1, "1d6 piercing", [range("thrown", 20, 60), versatile("1d8")]),
  w("staff", "Staff", "staff", "Staff", "basic", "focus", 25, "1d6 bludgeoning", [p("empowering")]),

  w("labrys", "Labrys", "axe", "Axe", "advanced", "melee", 60, "1d12 slashing", [p("heavy"), p("two-handed")]),
  w("tabarzin", "Tabarzin", "axe", "Axe", "advanced", "melee", 60, "1d8 slashing", [p("brutal"), versatile("1d10")]),
  w("dolabra", "Dolabra", "axe", "Axe", "advanced", "melee", 60, "1d6 slashing", [p("light"), range("thrown", 30, 90)]),
  w("shortbow", "Shortbow", "bow", "Bow", "advanced", "ranged", 75, "1d6 piercing", [range("ammunition", 80, 320), p("two-handed"), p("fast")]),
  w("longbow", "Longbow", "bow", "Bow", "advanced", "ranged", 75, "1d8 piercing", [range("ammunition", 150, 600), p("two-handed")]),
  w("greatclub", "Greatclub", "club", "Club", "advanced", "melee", 5, "1d6 bludgeoning", [versatile("1d8"), p("cheap")]),
  w("quarterstaff", "Quarterstaff", "club", "Club", "advanced", "melee", 5, "1d8 bludgeoning", [p("heavy"), versatile("1d10"), p("cheap")]),
  w("amulet", "Amulet", "crystal", "Crystal", "advanced", "focus", 75, "—", [p("volatile"), p("penetrating")]),
  w("orb", "Orb", "crystal", "Crystal", "advanced", "focus", 75, "—", [p("volatile"), p("rejuvenating")]),
  w("pugio", "Pugio", "dagger", "Dagger", "advanced", "melee", 52, "1d4 piercing", [p("finesse"), p("light"), versatile("1d6")]),
  w("khanjar", "Khanjar", "dagger", "Dagger", "advanced", "melee", 52, "1d4 piercing", [p("fast"), p("finesse"), p("brutal"), p("light"), range("thrown", 20, 60)]),
  w("maul", "Maul", "hammer", "Hammer", "advanced", "melee", 65, "2d6 bludgeoning", [p("heavy"), p("two-handed")]),
  w("thrown-hammer", "Thrown Hammer", "hammer", "Hammer", "advanced", "melee", 65, "1d6 bludgeoning", [p("light"), range("thrown", 20, 60)]),
  w("warhammer", "Warhammer", "hammer", "Hammer", "advanced", "melee", 65, "1d8 bludgeoning", [versatile("1d10"), p("unrelenting")]),
  w("shotel", "Shotel", "longsword", "Longsword", "advanced", "melee", 65, "2d6 slashing", [p("heavy"), p("two-handed")]),
  w("spatha", "Spatha", "longsword", "Longsword", "advanced", "melee", 65, "2d4 slashing", [versatile("1d6 + 1d4")]),
  w("gladius", "Gladius", "shortsword", "Short Sword", "advanced", "melee", 60, "1d6 slashing", [p("finesse"), versatile("1d8")]),
  w("kopesh", "Kopesh", "shortsword", "Short Sword", "advanced", "melee", 60, "1d6 slashing", [p("fast"), p("finesse"), p("light")]),
  w("javelin", "Javelin", "spear", "Spear", "advanced", "melee", 51, "1d6 piercing", [p("reach"), versatile("1d8"), range("thrown", 40, 120)]),
  w("doru", "Doru", "spear", "Spear", "advanced", "melee", 51, "1d8 piercing", [p("reach"), range("thrown", 20, 60), versatile("Heavy, 1d10")]),
  w("rod", "Rod", "staff", "Staff", "advanced", "focus", 75, "1d6 bludgeoning", [p("empowering"), p("pummeling")]),
  w("wand", "Wand", "staff", "Staff", "advanced", "focus", 75, "1d4 bludgeoning", [p("empowering"), p("penetrating")]),
];

export const basicWeapons = weapons.filter((weapon) => weapon.stage === "basic");
export const advancedWeapons = weapons.filter((weapon) => weapon.stage === "advanced");

export const monsterCompatibility: Record<string, string[]> = {
  chimera: ["axe", "dagger"], dryad: ["crystal"], hydra: ["bow", "spear"],
  karkhadan: ["staff"], leucrotta: ["hammer", "spear"], manticore: ["longsword", "shortsword"],
  medusa: ["bow", "club", "dagger"], roc: ["axe", "longsword"], serpopard: ["crystal"],
  siren: ["hammer", "shortsword"], sphynx: ["staff"],
};

export function formatGold(cost: number) {
  return cost < 1 ? `${cost * 10} sp` : `${cost.toLocaleString()} gp`;
}

export function hasProperty(properties: RuleRef[], ruleId: string) {
  return properties.some((property) => property.ruleId === ruleId);
}

export function applyMod(weapon: Weapon, modId?: string) {
  const properties: RuleRef[] = weapon.properties.map((property) => ({ ...property, values: property.values ? { ...property.values } : undefined }));
  const chosen = mods.find((item) => item.id === modId);

  if (chosen && !weapon.mods.includes(chosen.id)) throw new Error(`${chosen.name} is not available for ${weapon.name}`);
  if (modId && !chosen) throw new Error(`Unknown modification: ${modId}`);
  for (const mechanic of chosen ? resolveRule(chosen.rule).mechanics ?? [] : []) {
    if (mechanic.type !== "increase-range") continue;
    properties.forEach((property) => {
      if ((property.ruleId === "ammunition" || property.ruleId === "thrown") && property.values) {
        property.values.normal = Number(property.values.normal) + mechanic.normal;
        property.values.long = Number(property.values.long) + mechanic.long;
      }
    });
  }

  if (chosen && !hasProperty(properties, chosen.rule.ruleId)) properties.push({ ...chosen.rule });
  return { damage: weapon.damage, properties };
}

export function applyMonsterStats(weapon: Weapon, modId?: string, monsterId?: string, branchName?: string, tier = 0) {
  const modded = applyMod(weapon, modId);
  let { damage } = modded;
  let properties = [...modded.properties];
  let bonus = tier >= 3 ? 2 : tier >= 2 ? 1 : 0;

  if (monsterId === "medusa" && branchName?.toLowerCase().includes("gaze")) bonus = 0;
  if (monsterId === "leucrotta" && branchName?.toLowerCase().includes("mimicry") && tier === 2) bonus = 0;

  if (monsterId === "hydra" && branchName?.toLowerCase().includes("northern") && tier >= 1) {
    const dieSteps = [12, 10, 8, 6, 4, 3, 2];
    const reduceDice = (value: string) => value.replace(/(\d+)d(\d+)/g, (_, count, sides) => {
      const current = dieSteps.indexOf(Number(sides));
      return current < 0 ? `${count}d${sides}` : `${count}d${dieSteps[Math.min(current + 1, dieSteps.length - 1)]}`;
    });
    damage = reduceDice(damage);
    properties = properties.map((property) => property.ruleId === "versatile" ? { ...property, values: { ...property.values, damage: reduceDice(String(property.values?.damage)) } } : property);
  }

  if (monsterId === "medusa" && branchName?.toLowerCase() === "snake" && tier >= 1) {
    damage += " + 1d6 poison";
    if (tier >= 2 && ["shortbow", "pugio", "quarterstaff"].includes(weapon.id) && !hasProperty(properties, "brutal")) properties.push(p("brutal"));
  }

  if (monsterId === "roc" && tier >= 1) {
    const twoHanded = properties.find((property) => property.ruleId === "versatile")?.values?.damage;
    const dice = String(twoHanded ?? damage).match(/\d+d\d+/g)?.join(" + ");
    const physicalType = damage.match(/slashing|piercing|bludgeoning/)?.[0] ?? "";
    const elementalType = branchName?.toLowerCase() === "fire" ? "fire" : "cold";
    if (dice) damage = `${dice} ${physicalType} + ${dice} ${elementalType}`;
    const wasHeavy = hasProperty(properties, "heavy");
    properties = properties.filter((property) => property.ruleId !== "versatile" && property.ruleId !== "finesse");
    if (!hasProperty(properties, "heavy")) properties.push(p("heavy"));
    if (!hasProperty(properties, "two-handed")) properties.push(p("two-handed"));
    if (wasHeavy) properties.push(p("unwieldy"));
  }

  return { damage, properties, bonus };
}

export function monsterInfusionCost(tier: number) {
  if (!Number.isInteger(tier) || tier < 0 || tier > 3) throw new Error(`Invalid infusion tier: ${tier}`);
  return tier > 0 ? 1000 * (2 ** tier) : 0;
}

export function modificationCost(weapon: Weapon) {
  return weapon.properties.flatMap((ref) => resolveRule(ref).mechanics ?? [])
    .reduce((cost, mechanic) => mechanic.type === "cost-multiplier" ? cost * mechanic.value : cost, 100);
}
