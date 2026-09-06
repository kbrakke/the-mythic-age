# Rules model and extension boundaries

## One definition, many views

`src/data/game-rules.ts` owns reusable rule identities, names, prose, summaries,
source links, tags, optional parameterized labels, and optional typed mechanics.
`RuleRef` attaches a rule to an item with local values (range, versatile dice) or
a presentation-only label override. Never identify a mechanic by its display name.
Unknown references fail loudly rather than silently presenting an ID as rules.

The forge, property popovers, mundane property reference, modification table, and
weapon catalog now share these records. To add a property, create one registry
entry and reference it from the catalog. Parameterized rules must supply every
placeholder; the regression suite checks all current catalog references.

## Executable rules are deliberately limited

`RuleMechanic` is a discriminated union, not an arbitrary bag of values. Currently
the executable shared mechanics are range increases and mundane cost multipliers.
Adding a new mechanic requires a typed variant, an evaluator, and a regression
test. A new prose-only feature needs none of those. Prose must remain readable even
when the builder cannot calculate a feature. Do not invent an all-purpose formula
language or execute code stored in content.

Weapon evaluation clones source data. Application order is mundane form, mod,
then monster effects. Infusion pricing is independent of Cheap: the selected
rank costs 2,000/4,000/8,000 gp, plus mundane cost and parts, not the sum of all
previous ranks. Apex also requires killing the unique named monster. A missing
name is shown explicitly, never replaced by a generic purchasable ingredient.

## Migration boundary: monster content

`monster-weapon-data.ts` is a legacy Markdown adapter, NOT a universal rule engine.
It preserves common tier features separately from weapon-specific variants and
normalizes historical weapon spellings. The `.md` files are now the single source
for both public monster documentation and forge rules. Previous `.mdx` versions
are historical snapshots under `src/archive/docs/weapons`, outside the content
collection. Do not update those snapshots. The Hydra snapshot is rendered only on
the layout comparison page, never as a canonical weapon route.

Each Markdown tree has a plain “Build with this tree” link. Query parameters
`monster` and `tree` select a validated tree-first build; optional `tier` selects
an available rank (falling back to the first documented rank). The player must
choose a compatible advanced weapon before any stat sheet is shown. Changing
weapons preserves that tree and tier. Documentation links are excluded from rule
parsing. Tree query keys currently normalize heading names; if a heading is
renamed, update its link and add an alias if old links need to remain valid.

Monster stat calculations still have bespoke handlers in `weapon-data.ts`.
The next extension should give branches/features explicit author-owned stable IDs,
typed prerequisites, and structured effects, leaving long-form rules in Markdown.
Do not persist generated heading slugs or branch names as permanent save IDs.
Migrate one monster at a time, comparing every tier and variant with the source.

The sheet is not a combat simulator: character ability modifiers, proficiency,
conditional damage, resources, chosen Chimera forms, and distinct spell/healing/DC
bonuses remain in the rules text. The UI states that boundary rather than implying
that its generic magic-bonus field computes all those separate statistics.

## Content decisions to resolve

- Heavy is listed but not fully defined in the local campaign notes; clarify the
  campaign's edition/size rule before replacing its provisional definition.
- Dagger Keen availability conflicts between the original modification table and
  weapon table. The catalog retains the weapon table's selection pending a ruling.
- Medusa Gaze has named tiers but no effects; Siren has only Minor tiers. Missing
  tiers stay unavailable, while empty effects should not be invented.
- Hydra's “die size reduced by two” is interpreted as d8→d6, d6→d4, with its
  explicit d4→d3 and d3→d2 exceptions, not two steps down the dice ladder.

## PNG weapon cards

`weapon-export.ts` builds a serializable card from the same resolved weapon,
properties, selected monster tree, and unlocked tiers as the forge. Rendering uses
a local canvas with system serif fonts, not a screenshot of the page: closed
accordions and site theme do not alter the result. All applicable lower-tier rules
are included, while other weapon variants and future tiers are excluded. Rarity
and attunement are deliberately not invented. Cards are 1400 pixels wide with
content-sized height, and previewed before downloading. Browser object URLs are
revoked when replaced or when the export component unmounts.

## Verification commands

Run `node --test tests/weapon-rules.test.mjs`, `npm run astro -- check`, and
`npm run build`. The test loader has a separate Vite cache so it cannot invalidate
the running Astro preview's dependency modules. Check light/dark themes, narrow
viewports, keyboard/touch rule popovers, and all rank costs in the browser.
