import { ruleName, ruleText, type RuleRef } from "../data/game-rules";
import { apexRequirement, rulesForWeapon, type MonsterWeapon, type MonsterTree } from "./monster-weapon-data";
import { formatGold, type Weapon } from "./weapon-data";
import { splitNamedAbilities } from "./rule-sections";

export type WeaponCard = {
  name: string;
  subtitle: string;
  damage: string;
  bonus: number;
  cost: string;
  crafting: string;
  sections: { heading: string; text: string }[];
};

export function makeWeaponCard(input: {
  weapon: Weapon; modName?: string; damage: string; bonus: number;
  properties: RuleRef[]; totalGold: number; modCost: number; infusionCost: number;
  monster?: MonsterWeapon; tree?: MonsterTree; tier: number;
}): WeaponCard {
  const { weapon, monster, tree, tier } = input;
  const selected = tree?.tiers.find((item) => item.rank === tier);
  const descriptor = [monster?.name, input.modName, weapon.name].filter(Boolean).join(" ");
  const sections = input.properties.map((ref) => ({ heading: ruleName(ref), text: ruleText(ref) }));
  if (monster && tree) {
    sections.push({ heading: `${monster.name} · Innate features`, text: monster.baseRules });
    if (tree.description.trim()) sections.push({ heading: `${tree.name} path`, text: tree.description });
    for (const entry of tree.tiers.filter((item) => item.rank <= tier)) {
      sections.push({ heading: `${entry.name} · ${entry.rankName}`, text: entry.rules });
      for (const variant of rulesForWeapon(entry, weapon.id, weapon.name)) {
        sections.push(...splitNamedAbilities(variant.rules));
      }
    }
  }
  return {
    name: selected?.name ?? descriptor,
    subtitle: `${monster ? "Magic weapon" : weapon.kind === "focus" ? "Spell focus" : "Weapon"} (${descriptor})${selected ? ` · ${selected.rankName} infusion` : ""}`,
    damage: input.damage, bonus: input.bonus, cost: formatGold(input.totalGold),
    crafting: [
      `${weapon.name}: ${formatGold(weapon.cost)} (includes its mundane foundation).`,
      input.modName && `${input.modName}: ${formatGold(input.modCost)}.`,
      monster && `Infusion: ${formatGold(input.infusionCost)} plus monster parts.`,
      monster && tree && tier === 3 && apexRequirement(monster, tree),
    ].filter(Boolean).join(" "),
    sections,
  };
}

export function plainRuleText(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "").replace(/\*{1,3}|__/g, "")
    .replace(/\\([\[\]])/g, "$1").replace(/^\s*[-*]\s+/gm, "• ").trim();
}

/** Paint from the data, not the responsive DOM: collapsed rules and dark mode
 * cannot change the exported content. No network fonts or screenshot dependency. */
export async function renderWeaponPng(card: WeaponCard): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  const width = 1400, margin = 76, gap = 54;
  const columnWidth = (width - margin * 2 - gap) / 2;
  const ink = "#302319", red = "#772b25", gold = "#a17c40";
  const wrap = (text: string, max: number, font: string) => {
    ctx.font = font;
    const lines: string[] = [];
    for (const paragraph of plainRuleText(text).split(/\n+/)) {
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        if (ctx.measureText(line ? `${line} ${word}` : word).width > max && line) { lines.push(line); line = ""; }
        // Even an unusually long custom name must fit within the card.
        if (ctx.measureText(word).width > max) {
          if (line) { lines.push(line); line = ""; }
          for (const char of word) {
            if (ctx.measureText(line + char).width > max) { lines.push(line); line = ""; }
            line += char;
          }
        } else line = line ? `${line} ${word}` : word;
      }
      if (line) lines.push(line);
    }
    return lines;
  };
  const title = wrap(card.name, width - 2 * margin, "bold 58px Georgia");
  const subtitle = wrap(card.subtitle, width - 2 * margin, "italic 25px Georgia");
  const damage = wrap(card.damage, 650, "bold 25px Georgia");
  const crafting = wrap(card.crafting, width - 2 * margin, "23px Georgia");
  const headerHeight = 160 + title.length * 66 + subtitle.length * 34;
  const statsHeight = Math.max(100, 60 + damage.length * 32);
  const bodyTop = headerHeight + statsHeight + 100 + crafting.length * 31;
  const blocks = card.sections.map((section) => {
    const heading = wrap(section.heading, columnWidth, "bold 26px Georgia");
    const lines = wrap(section.text, columnWidth, "24px Georgia");
    return { heading, lines, height: heading.length * 34 + lines.length * 33 + 28 };
  });
  const total = blocks.reduce((sum, block) => sum + block.height, 0);
  let split = 0, leftHeight = 0;
  while (split < blocks.length && leftHeight + blocks[split].height / 2 < total / 2) leftHeight += blocks[split++].height;
  const bodyHeight = Math.max(leftHeight, total - leftHeight);
  const height = Math.ceil(bodyTop + bodyHeight + 145);
  if (height > 16000) throw new Error("This weapon has too much text for a single PNG. Please export a lower tier.");
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = "#f6ecd3";
  ctx.fillRect(0, 0, width, height);
  const wash = ctx.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, "#b8925328"); wash.addColorStop(.5, "#fff9e400"); wash.addColorStop(1, "#b8925328");
  ctx.fillStyle = wash; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = gold; ctx.lineWidth = 3; ctx.strokeRect(24, 24, width - 48, height - 48);
  ctx.lineWidth = 1; ctx.strokeRect(35, 35, width - 70, height - 70);
  const line = (y: number) => { ctx.strokeStyle = red; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(margin, y); ctx.lineTo(width - margin, y); ctx.stroke(); };
  const paintLines = (lines: string[], x: number, y: number, font: string, color: string, leading: number) => {
    ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = "top";
    for (const text of lines) { ctx.fillText(text, x, y); y += leading; }
    return y;
  };
  paintLines(["THE MYTHIC AGE  /  ARMORY"], margin, 68, "bold 19px Georgia", gold, 25);
  let y = paintLines(title, margin, 112, "bold 58px Georgia", red, 66);
  y = paintLines(subtitle, margin, y + 16, "italic 25px Georgia", ink, 34);
  line(headerHeight - 22);
  paintLines(["WEAPON DICE"], margin, headerHeight, "bold 17px Georgia", red, 24);
  paintLines(damage, margin, headerHeight + 31, "bold 25px Georgia", ink, 32);
  paintLines(["MAGIC BONUS"], 805, headerHeight, "bold 17px Georgia", red, 24);
  paintLines([card.bonus ? `+${card.bonus}` : "—"], 805, headerHeight + 31, "bold 25px Georgia", ink, 32);
  paintLines(["GOLD COST"], 1080, headerHeight, "bold 17px Georgia", red, 24);
  paintLines([card.cost], 1080, headerHeight + 31, "bold 25px Georgia", ink, 32);
  y = headerHeight + statsHeight;
  line(y);
  paintLines(["CRAFTING REQUIREMENTS"], margin, y + 22, "bold 18px Georgia", red, 25);
  paintLines(crafting, margin, y + 53, "23px Georgia", ink, 31);
  [blocks.slice(0, split), blocks.slice(split)].forEach((column, index) => {
    let top = bodyTop;
    const x = margin + index * (columnWidth + gap);
    for (const block of column) {
      top = paintLines(block.heading, x, top, "bold 26px Georgia", red, 34);
      top = paintLines(block.lines, x, top, "24px Georgia", ink, 33) + 28;
    }
  });
  line(height - 111);
  paintLines(["Weapon dice exclude ability modifiers and the magic bonus. Conditional features follow the rules above.", "Homebrew magic item • The Mythic Age"], margin, height - 88, "18px Georgia", ink, 27);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG export failed. Please try again.")), "image/png"));
}
