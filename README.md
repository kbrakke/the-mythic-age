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

Requires Node 22.12 or newer.

## Where things live

| Path | What |
| --- | --- |
| `src/content/docs/` | All wiki pages (Markdown/MDX). Sidebar sections are the sub-folders. |
| `src/content/hexes/` | One markdown file per explored hex, e.g. `G34.md`. Shown on the interactive map. |
| `src/data/map/nations.json` | Nation borders as hex ranges, colours, summaries. |
| `src/data/map/places.json` | Cities, ruins and landmarks pinned to hexes. |
| `src/components/` | React islands (weapon builder, astrolabe puzzle, contract cards, world map). |
| `src/lib/hexgrid.ts` | Hex grid geometry: hex id ⇄ pixel maths for the world map. |
| `src/pages/map/data.json.ts` | Build-time JSON endpoint feeding the map. |
| `src/styles/global.css` | Tailwind 4 + Starlight + daisyUI setup. |
| `scripts/build-map-tiles.mjs` | Slices the 7105×10184 map into a tile pyramid. |
| `docs/interactive-features.md` | How interactive features are built, and the roadmap. |

## Adding to the map

- **A new explored hex:** copy `src/content/hexes/_TEMPLATE.md` to `<HEX>.md` (for example
  `F23.md`), fill in the frontmatter and write what happened there in the body.
- **A new city or landmark:** add an entry to `src/data/map/places.json` with its hex id.
- **Border changes:** edit the hex ranges in `src/data/map/nations.json`. Ranges are written
  per column, e.g. `"F20-F25"`.
- **Linking to the map from a page:** `/world/map/#hex=F23`, `/world/map/#place=ostia`,
  `/world/map/#nation=lycia`.

Hex ids use the row numbers printed on the *left* edge of the map (11 at the bottom, 35 at
the top). The right edge of the printed map is numbered 1–25 instead; if you would rather use
that numbering, change `BOTTOM_ROW` in `src/lib/hexgrid.ts` to `1` and renumber the data files.

## Styling notes

daisyUI classes are prefixed with `d-` (`d-btn`, `d-badge`, `d-dropdown`, …) so they can never
collide with Starlight's own class names. Only the components listed in
`src/styles/global.css` are included; add to that list before using a new one.
