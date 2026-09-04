# Interactive features: how they are built and what comes next

This site is a Starlight documentation site, which is static HTML by default. Interactive
pieces are added as **islands**: small React components dropped into an MDX page that
hydrate in the browser while the rest of the page stays static. The world map is the first
feature built on the pattern below; everything else on the roadmap can reuse the same parts.

## The pattern

```
 authoring (git)                 build time (Astro)                     browser
 ───────────────                 ──────────────────                     ───────
 src/content/hexes/*.md   ─┐
 src/data/map/*.json      ─┼─▶ content collections ─▶ src/pages/*.json.ts ─▶ fetch() ─▶ React island
 src/content/docs/*.mdx   ─┘   (zod-validated)         (static JSON)                    (client:only /
                                                                                          client:load)
```

1. **Author data as content, not code.** Markdown files and JSON in `src/content/` and
   `src/data/` are registered as [content collections](https://docs.astro.build/en/guides/content-collections/)
   in `src/content.config.ts`. The zod schema there validates every entry at build time, so a
   typo in a hex id fails the build instead of silently vanishing from the map.
2. **Expose it as static JSON.** A file in `src/pages/` ending in `.json.ts` becomes a JSON file
   in the build output. It runs at build time, so it can use `getCollection()` and even render
   markdown to HTML (the map endpoint does this with Astro's container API). The browser only
   ever sees plain JSON.
3. **Render with a React island.** The component lives in `src/components/`, is imported from an
   MDX page, and gets a `client:*` directive. Use `client:load` for components that can render
   on the server, and `client:only="react"` (via a small `.astro` wrapper, see
   `src/components/map/WorldMapIsland.astro`) for libraries that touch `window` on import.
4. **Style with Starlight variables.** Panels and controls use `--sl-color-*` and `--sl-text-*`
   so they follow light/dark mode. Tailwind utilities are available everywhere; daisyUI
   components are available with the `d-` prefix. Wrap islands in a `not-content` div so
   Starlight's markdown typography does not leak into them.
5. **Make state linkable.** Selections that matter get written into the URL hash
   (`#hex=F23`) so pages can link into a specific state of a feature and browser history works.

## The world map in detail

| Piece | File |
| --- | --- |
| Geometry (hex id ⇄ pixel) | `src/lib/hexgrid.ts` |
| Tile pyramid | `scripts/build-map-tiles.mjs` → `public/map-tiles/` (generated, not committed) |
| Data | `src/data/map/nations.json`, `src/data/map/places.json`, `src/content/hexes/*.md` |
| Endpoint | `src/pages/map/data.json.ts` → `/map/data.json` |
| Component | `src/components/map/WorldMap.tsx` (+ `.css`, `types.ts`) |
| Page | `src/content/docs/world/map.mdx` |

Every coordinate is expressed in **source-image pixels** (7105 × 10184). Leaflet is configured
with a custom CRS so that one map unit equals one source pixel at the deepest zoom, which means
the same numbers work at every zoom level and would keep working if the map were re-exported at
the same size. The hex grid was measured from the printed edges: radius 221 px, column pitch
331.5 px, row pitch 382.8 px, column A centred at x = 402.5, top hex of odd columns at y = 594.5,
even columns half a hex higher.

Hex ids use the map's own notation: column letter plus a *diagonal* number. Diagonals run from
the bottom edge up-left to the left edge, where the printed 11..35 labels name them. In code,
`topNumber(col) = 35 + floor(col / 2)` and a hex's position within its column is
`topNumber(col) - num`. Moving one column right and half a hex down keeps the number.

Layers, from bottom to top: tiles → nation fills (multi-polygon of hexes, canvas renderer) →
explored-hex highlights → optional grid + hex id labels → coordinate lines (column and diagonal
lines with letters/numbers at both ends) → place markers → selection outline plus the selected
hex's column and diagonal as a crosshair.
Clicking anywhere resolves the hex under the cursor with `pointToHex()`; markers stop
propagation so a city click selects the place rather than the hex.

### Ideas for the map itself

- **Per-campaign layers.** Hex notes already carry a `campaign` field; add a campaign filter so
  each party sees only its own explored hexes, or colour them per campaign.
- **Party position and travel log.** A `travel.json` (list of hex ids with dates) rendered as a
  polyline, with a marker at the current hex.
- **Fog of war / player view.** Build a second endpoint that omits hexes tagged `gm-only`,
  and a `?view=player` toggle. Since everything is static, "secret" data must simply not be
  emitted for the player build.
- **Hex-note pages.** Each hex note could also get its own URL under `/hexes/F23/` (a dynamic
  route reading the same collection) so search indexes it and it can be linked directly.
- **Distances and travel time.** Hex distance is trivial in cube coordinates; a "measure" mode
  that reports hexes-between and days at a given pace would suit the hex-crawl rules.
- **Regions beyond nations.** Seas, forests, satraps and trade routes can all be extra entries
  in `nations.json` (or a parallel `regions.json`) using the same hex-range syntax.

## Roadmap for other interactive features

Each of these fits the pattern above.

| Feature | Data | Island | Notes |
| --- | --- | --- | --- |
| **Timeline** of world history and campaign events | `src/content/events/*.md` with `date`, `campaign`, `hex` | Scrollable timeline with filters | Cross-link events to hexes on the map (`#hex=` links) |
| **Session log** per campaign | `src/content/sessions/*.md` with `campaign`, `number`, `hexes: []` | Filterable list/cards | Feeds the map's "explored" layer automatically if sessions list their hexes |
| **Bestiary / monster hunt tracker** | `src/data/monsters.json` (name, hex, status, weapon page) | Table with status filter | Monster lairs become map markers; slain monsters change icon |
| **Faction / relationship tracker** | `src/data/factions.json` with standing per campaign | Graph or matrix | |
| **Random tables and dice tools** | `src/data/tables/*.json` | Roller widget | Pure client-side; no endpoint needed |
| **Character roster** | `src/content/characters/*.md` | Cards with search | Same shape as ContractCard |
| **Contract board** | move `<ContractCard>` content into `src/data/contracts.json` | Filter by tag/status | Existing cards keep working; data becomes reusable |
| **Weapon builder** (exists) | inline in `weapon-builder.tsx` | | Could move weapon/mod tables into `src/data/weapons.json` so the weapon pages and the builder share one source |

### Shared building blocks worth extracting as they get reused

- `src/lib/hexgrid.ts` already provides id parsing and geometry; add cube-coordinate helpers
  when distance or pathing is needed.
- A `useCollectionJson(url)` hook (fetch + loading/error state) once a second island needs an
  endpoint.
- A `HexLink` component (`<HexLink id="F23" />` → `/world/map/#hex=F23`) for use inside MDX.

### What to avoid

- **Server-side or runtime data.** The site is fully static on Netlify; anything that needs a
  database or authentication (player-editable notes, live initiative) would need Netlify
  Functions or an external service and is a different architecture. Prefer "edit a markdown
  file, push, redeploy".
- **Leaking GM secrets.** Every JSON endpoint is public. Keep GM-only material out of the data
  files, or add an explicit `gmOnly` flag and filter it in the endpoint.
- **Committing generated files.** Map tiles are rebuilt on every deploy from the source PNG;
  keep it that way so the source image remains the single source of truth.
