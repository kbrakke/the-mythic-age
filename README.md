# The Mythic Age

Campaign wiki and tools for a hex-based D&D campaign set in a mythic Mediterranean.
Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), React
islands for interactive pieces, Tailwind 4 and daisyUI. Deployed on Netlify.

## Working on the site

```sh
npm install
npm run dev        # http://localhost:4321 (builds map tiles on first run)
npm run build      # production build into dist/
npm run preview    # serve dist/
npm run check      # type-check .astro/.ts/.tsx
npm run map:tiles  # re-slice src/assets/WorldMap-01.png into public/map-tiles/
```

Use Node 24 LTS, or Node 22.19+ (the locked dependencies require a newer Node
than Astro's minimum). Use `npm ci` for a clean install matching the lockfile.

## Where things live

| Path | What |
| --- | --- |
| `src/content/docs/` | All wiki pages (Markdown/MDX). Sidebar sections are the sub-folders. |
| `src/content/hexes/` | One markdown file per explored hex, e.g. `G34.md`. Shown on the interactive map. |
| `src/content/timeline/` | One plain Markdown file per world event; frontmatter drives the timeline. |
| `src/data/map/nations.json` | Nation borders as hex ranges, colours, summaries. |
| `src/data/map/places.json` | Cities, ruins and landmarks pinned to hexes. |
| `src/components/` | React islands (weapon builder, astrolabe puzzle, contract cards, world map). |
| `src/lib/hexgrid.ts` | Hex grid geometry: hex id ⇄ pixel maths for the world map. |
| `src/pages/map/data.json.ts` | Build-time JSON endpoint feeding the map. |
| `src/styles/global.css` | Tailwind 4 + Starlight + daisyUI setup. |
| `scripts/build-map-tiles.mjs` | Slices the 7105×10184 map into a tile pyramid. |
| `docs/interactive-features.md` | How interactive features are built, and the roadmap. |
| `src/content.config.ts` | Validated schemas for wiki pages, timeline events, nations, places, and hex notes. |
| `docs/world-timeline.md` | Timeline authoring conventions and chronology limits. |

## Adding to the timeline

Open `/world/timeline/` to review the result. Create a plain `.md` file directly
inside `src/content/timeline/`, or copy an existing event. No React or MDX needed.
For example, `godsfall.md` uses:

```yaml
---
title: Godsfall
summary: The Pontinate pantheon falls, and Lycia begins its experiment in government without gods.
date: 25 years ago
era: The world in living memory
order: 100
regions: [Lycia]
kind: Turning point
source: /world/lycia/
sourceLabel: Lycia
---
```

Write the expanded account below the closing `---`, using normal Markdown.
Keep the summary short; it appears while the event is collapsed.

| Field | What it controls |
| --- | --- |
| `title` | The event bubble's title. |
| `summary` | The always-visible introduction. |
| `date` | Display text, not a parsed calendar date. Quote unusual dates or text containing `: `. |
| `era` | Must be `Undated history` or `The world in living memory`. |
| `order` | Numeric reading order within the era, smallest first. Use gaps such as 100, 110, 120 to leave room for additions. Ties sort by event ID. |
| `regions` | One or more region names. The region filter is generated automatically; use consistent spelling. |
| `kind` | `Turning point`, `Conflict`, or `Civilization`. Turning points receive an accented border. |
| `source` | Supporting world-page URL; currently must start with `/world/`. |
| `sourceLabel` | Text used for the supporting-page link. |

All these fields are required. The filename supplies the event ID:
`godsfall.md` becomes `/world/timeline/#event-godsfall`. Keep filenames stable
when changing titles so existing links continue working.

The timeline automatically discovers files, groups and sorts entries, builds
region choices, and searches titles, summaries, regions, and Markdown bodies.
Adding a file requires no change to a central event array or page component.
Adding a new **era** requires updating both the schema and the era list in
`src/pages/world/timeline.astro`; a new **kind** requires updating the schema.

Dates refer to the **campaign present**, not today's real-world date. Spacing is
not proportional to elapsed time. Mark unknown or derived dates explicitly;
`order` is for presentation and must not be treated as a canonical year.

## Adding to the map

Open `/world/map/` to review the result. The map combines three collections:
Markdown hex notes, JSON place pins, and JSON nation borders.

- **A new explored hex:** copy `src/content/hexes/_TEMPLATE.md` to `<HEX>.md` (for example
  `F23.md`), fill in the frontmatter and write what happened there in the body.
- **A new city or landmark:** add an entry to `src/data/map/places.json` with its hex id.
- **Border changes:** edit the hex ranges in `src/data/map/nations.json`. Ranges are written
  per column, e.g. `"F20-F25"`.
- **Linking to the map from a page:** `/world/map/#hex=F23`, `/world/map/#place=ostia`,
  `/world/map/#nation=lycia`.

### Explored hex notes: Markdown and frontmatter

Copy `src/content/hexes/_TEMPLATE.md` to a real hex filename. Files beginning
with `_` are ignored **in the hex collection**. For example, `G37.md`:

```markdown
---
title: Godsfall
terrain: plains
campaign: Company of the Golden Lion
sessions: ["Session 12"]
tags: [ruins, history]
---

Write the player-facing account of what happened here.

See [Godsfall on the timeline](/world/timeline/#event-godsfall).
```

The session number above is an authoring example, not campaign history. All hex
frontmatter fields are optional. The **filename**, not a `hex:` field, chooses
the location. A note automatically adds the hex to the explored overlay and
explored-hex list; its Markdown body appears when the hex is selected.
`title` replaces the default hex heading, `terrain` describes it, and `tags`
become badges. `campaign` and `sessions` identify the source of the notes
(sessions currently display only when `campaign` is supplied).

Adding a note does **not** create a place pin or assign national ownership.
Ownership comes from nation borders; pins come from the places collection.

### Place pins: JSON

Add an object to the array in `src/data/map/places.json`. This is the shape of
the existing Godsfall pin, with an optional supporting page:

```json
{
  "id": "godsfall",
  "name": "Godsfall",
  "hex": "G37",
  "type": "ruin",
  "nation": "lycia",
  "summary": "Where the Pontinate gods died twenty-five years ago.",
  "page": "/world/lycia/"
}
```

Keep IDs unique and stable. `id`, `name`, `hex`, and `type` are required;
`nation`, `summary`, and `page` are optional. `nation` references an ID from
`nations.json`, not its display name. Allowed types are `capital`, `city`,
`town`, `port`, `landmark`, `ruin`, `monster`, and `sea`. The optional `page`
adds a “Read more” link. Multiple places can share a hex.

### Nation borders: JSON

Edit the existing object's `hexes` list in `src/data/map/nations.json`. A
nation requires a stable `id`, `name`, CSS `color`, and `hexes` array; `page`
and `summary` are optional. Lists combine single hexes and inclusive ranges:

```json
"hexes": ["F20-F25", "G23", "H24-H26"]
```

Each range must stay within one column. These are syntax examples, not proposed
border changes. Check the map for actual coordinates and avoid overlapping
nation claims: overlapping membership is not a supported disputed-border model.

### Coordinates and map artwork

Hex ids follow the notation printed on the map: the column letter plus a **diagonal number**.
The number is not a row: it names the diagonal that runs from the bottom edge up and to the
left, and the numbers on the left edge of the map (11 at the bottom, 35 at the top) label
those diagonals. In columns A and B the number reads like a row, and every two columns to the
right it shifts up by one, so the top-right hex is T44. Switch on "Coordinate lines" on the map
page to see the lines, or select a hex to get its crosshair. The maths lives in
`src/lib/hexgrid.ts`.

Content changes do not need new image tiles. Only re-slice tiles when changing
`src/assets/WorldMap-01.png`; `npm run map:tiles` does that locally, and the
Netlify build runs it automatically. A differently aligned or sized map may
also require recalibrating the geometry in `src/lib/hexgrid.ts`.

## Frontmatter automation: today and next

**Already implemented:** timeline Markdown → event bubbles; hex Markdown →
explored hexes and map notes; JSON records → pins and borders. Astro discovers
the files and validates their schema. The map's `/map/data.json` is generated
at build time—never edit that output or `dist/` directly. A production update
requires a new Netlify deploy; this is not a live sync with Obsidian or OneDrive.

**Proposed next step, not implemented:** give timeline events an optional place
reference, using stable IDs instead of copying coordinates and place prose:

```yaml
# Future schema proposal only — these fields do nothing today.
location:
  place: godsfall
# For an event without a named place, an alternative could be:
# location:
#   hex: G37
```

That single reference could generate “Show on map” on an event and “History
here” in the matching map panel. The event remains the source of its account;
the place remains the source of its coordinates. Implement schema validation,
reference checks, and both views together before using these fields.

A later option is `map:` metadata on ordinary location documentation pages to
generate their pins automatically. If added, migrate each pin out of JSON rather
than maintaining two competing records. Frontmatter is structured metadata, not
magic: arbitrary fields alone do not create UI behavior.

## Review and publish content changes

1. Edit source Markdown or JSON, then review the timeline/map with `npm run dev`.
2. Run `npm run check` and `npm run build`. The build also checks map coordinates
   and produces the static content; it does not verify historical accuracy or
   every cross-reference for you.
3. Check event expansion, source links, map pins, hex notes, and coordinates.
4. Commit and push to the branch Netlify is configured to deploy.

**Player-facing only:** do not put GM secrets in these collections. Collapsed
bubbles, filters, and disabled overlays do not protect content; it is present in
the generated pages or map JSON. There is no private/draft flag wired up here.

## Styling notes

daisyUI classes are prefixed with `d-` (`d-btn`, `d-badge`, `d-dropdown`, …) so they can never
collide with Starlight's own class names. Only the components listed in
`src/styles/global.css` are included; add to that list before using a new one.
