/** Shape of /map/data.json, produced by src/pages/map/data.json.ts. */
export interface Nation {
	id: string;
	name: string;
	color: string;
	page?: string;
	summary?: string;
	/** Fully expanded hex ids, e.g. ["A23", "A24", ...]. */
	hexes: string[];
}

export type PlaceType = 'capital' | 'city' | 'town' | 'port' | 'landmark' | 'ruin' | 'monster' | 'sea';

export interface Place {
	id: string;
	name: string;
	hex: string;
	type: PlaceType;
	nation?: string;
	summary?: string;
	page?: string;
}

export interface HexNote {
	id: string;
	title?: string;
	terrain?: string;
	campaign?: string;
	sessions?: string[];
	tags?: string[];
	/** Rendered markdown body. */
	html: string;
}

export interface MapData {
	columns: string[];
	nations: Nation[];
	places: Place[];
	hexes: HexNote[];
}

export type Selection =
	| { kind: 'hex'; id: string }
	| { kind: 'place'; id: string }
	| { kind: 'nation'; id: string };
