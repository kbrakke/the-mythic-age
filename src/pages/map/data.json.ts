/**
 * Static JSON consumed by the interactive world map (src/components/map/WorldMap.tsx).
 * Built once at build time from the `nations`, `places` and `hexes` content collections.
 * Hex note bodies are rendered from markdown to HTML here so the client never needs a
 * markdown parser.
 */
import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { COLUMNS, hexId, parseHexId } from '../../lib/hexgrid';

/** "F20-F25" -> ["F20", "F21", ..., "F25"]; "F23" -> ["F23"]. Ranges must stay in one column. */
function expandHexRange(range: string): string[] {
	const [from, to = from] = range.split('-');
	const a = parseHexId(from);
	const b = parseHexId(to);
	if (!a || !b) throw new Error(`nations.json: "${range}" is not a hex on the map`);
	if (a.col !== b.col) throw new Error(`nations.json: range "${range}" must stay within one column`);
	const out: string[] = [];
	for (let num = Math.min(a.num, b.num); num <= Math.max(a.num, b.num); num++) {
		out.push(hexId({ col: a.col, num }));
	}
	return out;
}

export const GET: APIRoute = async () => {
	const container = await AstroContainer.create();

	const nations = (await getCollection('nations')).map((n) => ({
		id: n.id,
		...n.data,
		hexes: n.data.hexes.flatMap(expandHexRange),
	}));

	const places = (await getCollection('places')).map((p) => {
		if (!parseHexId(p.data.hex)) throw new Error(`places.json: "${p.id}" has hex "${p.data.hex}" which is not on the map`);
		return { id: p.id, ...p.data };
	});

	const hexes = await Promise.all(
		(await getCollection('hexes')).map(async (h) => {
			if (!parseHexId(h.id)) throw new Error(`src/content/hexes/${h.id}.md: file name is not a hex id (expected e.g. F23.md)`);
			const { Content } = await render(h);
			const html = await container.renderToString(Content);
			return { id: h.id, ...h.data, html };
		}),
	);

	return new Response(JSON.stringify({ columns: COLUMNS, nations, places, hexes }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
