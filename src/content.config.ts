import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/** A hex id such as "F23": column letter A-T then the printed row number. */
const hexIdSchema = z.string().regex(/^[A-T]\d{1,2}$/, 'Hex ids look like "F23"');
/** A single hex ("F23") or an inclusive range within one column ("F20-F25"). */
const hexRangeSchema = z.string().regex(/^[A-T]\d{1,2}(-[A-T]\d{1,2})?$/, 'Hex ranges look like "F20-F25"');

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

	/** Nations drawn on the interactive map. Edit src/data/map/nations.json. */
	nations: defineCollection({
		loader: file('src/data/map/nations.json'),
		schema: z.object({
			name: z.string(),
			/** CSS colour used for the region fill and outline. */
			color: z.string(),
			/** Site-relative link to the nation's page. */
			page: z.string().optional(),
			summary: z.string().optional(),
			hexes: z.array(hexRangeSchema),
		}),
	}),

	/** Cities, ruins and landmarks pinned to a hex. Edit src/data/map/places.json. */
	places: defineCollection({
		loader: file('src/data/map/places.json'),
		schema: z.object({
			name: z.string(),
			hex: hexIdSchema,
			type: z.enum(['capital', 'city', 'town', 'port', 'landmark', 'ruin', 'monster', 'sea']),
			/** id of the nation this place belongs to, if any. */
			nation: z.string().optional(),
			summary: z.string().optional(),
			/** Site-relative link to a page with more detail. */
			page: z.string().optional(),
		}),
	}),

	/**
	 * Notes about individual hexes: what the parties found or did there.
	 * One markdown file per hex in src/content/hexes/, named after the hex (G34.md).
	 * The markdown body is rendered into the map's side panel.
	 */
	hexes: defineCollection({
		loader: glob({
			pattern: '[^_]*.md',
			base: './src/content/hexes',
			generateId: ({ entry }) => entry.replace(/\.md$/i, '').toUpperCase(),
		}),
		schema: z.object({
			title: z.string().optional(),
			terrain: z.string().optional(),
			/** Which campaign explored this hex, e.g. "Company of the Golden Lion". */
			campaign: z.string().optional(),
			/** Free-form session references, e.g. ["Session 12", "Session 13"]. */
			sessions: z.array(z.string()).optional(),
			tags: z.array(z.string()).optional(),
		}),
	}),
};
