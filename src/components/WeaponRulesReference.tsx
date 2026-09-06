import { gameRules, type GameRule } from "../data/game-rules";
import { basicWeapons, mods, modDescription } from "./weapon-data";

// These campaign rules are shared with the forge; standard parameterized
// properties remain attached to individual weapons, with their actual values.
export function WeaponProperties() {
  return <>{Object.values(gameRules).filter((rule) => !["ammunition", "thrown", "versatile", "heavy", "light", "finesse", "reach", "two-handed", "unwieldy"].includes(rule.id)).map((rule: GameRule) =>
    <section key={rule.id}><h3 id={rule.id}>{rule.name}</h3><p>{rule.rules}</p></section>
  )}</>;
}

export function WeaponModifications() {
  return <table><thead><tr><th>Modification</th><th>Rules</th><th>Base weapons</th></tr></thead><tbody>
    {mods.map((mod) => <tr key={mod.id}><td>{mod.name}</td><td>{modDescription(mod)}</td><td>{basicWeapons.filter((weapon) => weapon.mods.includes(mod.id)).map((weapon) => weapon.name).join(", ")}</td></tr>)}
  </tbody></table>;
}
