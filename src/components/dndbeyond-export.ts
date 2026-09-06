import { plainRuleText, type WeaponCard } from "./weapon-export";

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

/** For Beyond's visible Source code editor, not an undocumented API.
 * Description text does not configure its separate character-sheet modifiers. */
export function beyondDescription(card: WeaponCard): string {
  const paragraph = (text: string) => `<p>${escapeHtml(plainRuleText(text)).replace(/\n/g, "<br />")}</p>`;
  return [
    paragraph(card.subtitle),
    paragraph(`Weapon dice: ${card.damage}. Magic bonus: ${card.bonus ? `+${card.bonus}` : "none"}. Range and properties follow below.`),
    paragraph(`Total gold cost: ${card.cost}. ${card.crafting}`),
    ...card.sections.flatMap((section) => [section.heading ? `<h3>${escapeHtml(section.heading)}</h3>` : "", paragraph(section.text)]),
    paragraph("Weapon dice exclude ability modifiers and the magic bonus. Conditional features follow the rules above. These rules describe the campaign weapon; D&D Beyond's separate modifiers and character-sheet customizations must also be configured to match."),
  ].join("\n");
}
