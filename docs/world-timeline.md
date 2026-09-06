# Editing the world timeline

Route: `/world/timeline/`. Add one plain Markdown file per player-facing event in
`src/content/timeline/`. No JSX is needed in event documentation.

Required frontmatter: `title`, `summary`, `date` (human-readable), `era`, `order`
(reading order, not a year), `regions` (list), `kind`, `source` (world page URL),
and `sourceLabel`. The collection schema validates entries during build.

Current eras: `Undated history`, `The world in living memory`.
Kinds: `Turning point`, `Conflict`, `Civilization`.
Regions are gathered from events, so new regions automatically enter the filter.
Markdown body appears when the bubble expands. The filename is the stable event
ID used by shareable `#event-filename` links; keep it stable when renaming titles.

Seed events summarize existing world pages. Relative dates refer to the campaign
present, not the computer's date. Min's death has an explicitly derived date.
Undated/approximate events must not be assigned invented calendar years.
Spacing is sequential, not proportional to elapsed time.

This is a public content collection: do not put GM secrets in event bodies or
frontmatter. Filters hide rendered content, not protect it. Details work without
JavaScript; search, region filtering, bulk expansion, and fragment auto-opening
progressively enhance the page.

Future: agree on calendar and era conventions, add more canonical events, then
consider campaign-specific overlays and map/location cross-links.
