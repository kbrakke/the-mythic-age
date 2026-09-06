# TODO: D&D Beyond weapon transfer — parked

Resume only when requested. Current priority is campaign/world tooling.

## What works

- Generate formatted description HTML from the forge's shared WeaponCard.
- Populate a private homebrew weapon through the signed-in browser UI.
- Save Bonus → Magic +1 on the item.
- Create a companion custom attack with the correct die and independent ranges.

## Current prototype and limitations

The private prototype is **101 Heads — Hydra Recurve Longbow** (item 11957016).
The authorized test character has one companion **Forge attack**: 1d6+2 piercing,
200/700 range, Dexterity and proficiency scaling. Its +3 attack button still
needs the magic +1 manually; the inventory bow's +4 attack button is correct.
The original inventory bow retains incorrect 1d8 damage and 150/600 range.
No other equipment was changed. Nothing was publicly published.

## Remaining work

- [ ] Find a faithful, item-scoped base-die/range override, if one exists.
- [ ] Investigate a separate +1 to-hit bonus on custom attacks without affecting
  other weapons or hard-coding ability/proficiency totals.
- [ ] Check equip state, magic damage handling, properties/mastery, conditional
  Hydra attacks, and grapples; test actual dice rolls with permission.
- [ ] Decide campaign rarity/attunement policy; current defaults are placeholders.
- [ ] Design on-demand transfer with duplicate detection and saved Beyond links,
  not hundreds of pre-generated combinations.
- [ ] Evaluate a user-operated browser helper after the workflow is reliable.
- [ ] Provide update/remove behavior for companion attacks when a build changes.

Detailed observed controls and test findings: [prototype notes](dndbeyond-prototype.md).
Prototype formatter: `src/components/dndbeyond-export.ts`. No public forge export
button or supported write API integration has been implemented.
