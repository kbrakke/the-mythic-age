import chimeraSource from "../content/docs/weapons/chimera-weapons.md?raw";
import dryadSource from "../content/docs/weapons/dryad-weapons.md?raw";
import hydraSource from "../content/docs/weapons/hydra-weapons.md?raw";
import karkhadanSource from "../content/docs/weapons/karkhadan-weapons.md?raw";
import leucrottaSource from "../content/docs/weapons/leucrotta-weapons.md?raw";
import manticoreSource from "../content/docs/weapons/manticore-weapons.md?raw";
import medusaSource from "../content/docs/weapons/medusa-weapons.md?raw";
import rocSource from "../content/docs/weapons/roc-weapons.md?raw";
import serpopardSource from "../content/docs/weapons/serpopard-weapons.md?raw";
import sirenSource from "../content/docs/weapons/siren-weapons.md?raw";
import sphynxSource from "../content/docs/weapons/sphynx-weapons.md?raw";

export type MonsterTier = {
  rank: 1 | 2 | 3;
  rankName: "Minor" | "Major" | "Apex";
  name: string;
  rules: string;
  variants: { label: string; rules: string }[];
};

export type MonsterTree = {
  name: string;
  description: string;
  tiers: MonsterTier[];
  apexTarget?: string;
};

export type MonsterWeapon = {
  id: string;
  name: string;
  accent: string;
  sourcePath: string;
  baseRules: string;
  trees: MonsterTree[];
};

const sources = [
  ["chimera", "Chimera", "#ca8a04", "chimera-weapons", chimeraSource],
  ["dryad", "Dryad", "#65a30d", "dryad-weapons", dryadSource],
  ["hydra", "Hydra", "#059669", "hydra-weapons", hydraSource],
  ["karkhadan", "Karkhadan", "#7c3aed", "karkhadan-weapons", karkhadanSource],
  ["leucrotta", "Leucrotta", "#be123c", "leucrotta-weapons", leucrottaSource],
  ["manticore", "Manticore", "#dc2626", "manticore-weapons", manticoreSource],
  ["medusa", "Medusa", "#16a34a", "medusa-weapons", medusaSource],
  ["roc", "Roc", "#ea580c", "roc-weapons", rocSource],
  ["serpopard", "Serpopard", "#0891b2", "serpopard-weapons", serpopardSource],
  ["siren", "Siren", "#2563eb", "siren-weapons", sirenSource],
  ["sphynx", "Sphynx", "#d97706", "sphynx-weapons", sphynxSource],
] as const;

function append(existing: string, line: string) {
  return `${existing}${existing ? "\n" : ""}${line}`;
}

function parseMonster(id: string, name: string, accent: string, sourcePath: string, source: string): MonsterWeapon {
  const body = source.replace(/^---[\s\S]*?---\s*/, "");
  const lines = body.split("\n");
  let baseRules = "";
  let tree: MonsterTree | undefined;
  let tier: MonsterTier | undefined;
  let variant: MonsterTier["variants"][number] | undefined;
  const trees: MonsterTree[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    // Documentation navigation is not a weapon feature.
    if (/^\[Build with this tree\]\(/.test(line)) continue;
    const treeMatch = line.match(/^##\s+(.+?)\s+Tree\s*$/i);
    const tierMatch = line.match(/^###\s+(Minor|Major|Apex)(?:\s+Infusion)?(?:\s*-?\s*(.*))?$/i);
    const variantMatch = line.match(/^#{4,5}\s+(.+)$/);

    if (treeMatch) {
      tree = { name: treeMatch[1].trim(), description: "", tiers: [] };
      trees.push(tree);
      tier = undefined;
      variant = undefined;
      continue;
    }

    if (tierMatch && tree) {
      const rankName = `${tierMatch[1][0].toUpperCase()}${tierMatch[1].slice(1).toLowerCase()}` as MonsterTier["rankName"];
      const rank = rankName === "Minor" ? 1 : rankName === "Major" ? 2 : 3;
      tier = {
        rank,
        rankName,
        name: tierMatch[2]?.trim() || `${rankName} Infusion`,
        rules: "",
        variants: [],
      };
      tree.tiers.push(tier);
      variant = undefined;
      continue;
    }

    if (variantMatch && tier) {
      const label = variantMatch[1].trim();
      if (/\b(labrys|shotel|tabarzin|spatha|sapatha|dolabra|hand axe|shortbow|shorbow|short bow|longbow|long bow|doru|javelin|pugio|khanjar|kanjar|quarterstaff|greatclub|warhammer|maul|thrown hammer|throwing hammer|gladus|gladius|kopesh|wand|rod|orb|amulet)\b/i.test(label)) {
        variant = { label, rules: "" };
        tier.variants.push(variant);
      } else {
        variant = undefined;
        tier.rules = append(tier.rules, `\n***${label.replace(/\*/g, "")}***\n`);
      }
      continue;
    }

    if (/^#\s+/.test(line) || /^##\s+Base Features/i.test(line) || line === "___") continue;

    if (variant) variant.rules = append(variant.rules, line);
    else if (tier) tier.rules = append(tier.rules, line);
    else if (tree) tree.description = append(tree.description, line);
    else baseRules = append(baseRules, line);
  }

  return { id, name, accent, sourcePath, baseRules: baseRules.trim(), trees };
}

export const monsterWeapons = sources.map(([id, name, accent, path, source]) =>
  parseMonster(id, name, accent, path, source),
);

const apexTargets: Record<string, string> = {
  "dryad:shepard": "Hamaledies",
  "dryad:fury": "Melinoe",
  "manticore:spike": "Mukhwzaq",
  "manticore:teeth": "Almuftaras",
  "medusa:snake": "Cymenerid",
  "medusa:gaze": "Clytemnestra",
  "roc:fire": "Simurgh",
  "roc:ice": "Skymoriax",
  "sphynx:fate": "Ahnuket",
  "sphynx:free-will": "Senmanat",
};

monsterWeapons.forEach((monster) => {
  monster.trees.forEach((tree) => {
    tree.apexTarget = apexTargets[`${monster.id}:${tree.name.toLowerCase()}`];
  });
});

export function apexRequirement(monster: MonsterWeapon, tree: MonsterTree) {
  return tree.apexTarget
    ? `Slay ${tree.apexTarget}, the unique apex ${monster.name}.`
    : `Slay the unique named apex ${monster.name} for this path (its name is not yet documented).`;
}

const weaponAliases: Record<string, string[]> = {
  gladius: ["gladius", "gladus"],
  "thrown-hammer": ["thrown hammer", "throwing hammer"],
  shortbow: ["shortbow", "short bow", "shorbow"],
  longbow: ["longbow", "long bow"],
  khanjar: ["khanjar", "kanjar"],
  spatha: ["spatha", "sapatha"],
  dolabra: ["dolabra", "hand axe"],
};

export function rulesForWeapon(tier: MonsterTier, weaponId: string, weaponName: string) {
  const terms = weaponAliases[weaponId] ?? [weaponName.toLowerCase()];
  return tier.variants.filter((variant) => {
    const label = variant.label.toLowerCase();
    return terms.some((term) => label.includes(term));
  });
}
