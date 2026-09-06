/** Extract named abilities without exposing weapon-compatibility labels.
 * Unnamed prose is retained, not replaced with an invented ability name. */
export function splitNamedAbilities(rules: string): { heading: string; text: string }[] {
  const matches = [...rules.matchAll(/^\s*(?:[-*]\s+)?\*{2,3}([^\n]+?)\*{2,3}[.:]?\s*/gm)];
  if (!matches.length) return rules.trim() ? [{ heading: "", text: rules.trim() }] : [];
  const sections: { heading: string; text: string }[] = [];
  const intro = rules.slice(0, matches[0].index).trim();
  if (intro) sections.push({ heading: "", text: intro });
  matches.forEach((match, index) => {
    sections.push({
      heading: match[1].replace(/[*_`]/g, "").replace(/[.:]\s*$/, "").trim(),
      text: rules.slice(match.index! + match[0].length, matches[index + 1]?.index ?? rules.length).trim(),
    });
  });
  return sections;
}
