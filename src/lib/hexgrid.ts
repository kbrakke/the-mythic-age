/**
 * Hex grid geometry for the world map.
 *
 * Every coordinate here is in *source image pixels* of src/assets/WorldMap-01.png
 * (7105 x 10184). The interactive map uses the same coordinate space, so data can be
 * authored once and reused for tiles at any zoom.
 *
 * The printed map uses flat-top hexes in columns A..T (left to right); even columns
 * (A, C, E, ...) sit half a hex higher than odd columns.
 *
 * Hex ids look like "F23". The letter is the column. The NUMBER IS NOT A ROW: it names a
 * diagonal that runs from the bottom edge of the map up and to the left, ending on the
 * left edge. The numbers printed on the left edge of the map (11 at the bottom, 35 at the
 * top) label these diagonals where they exit. Consequences:
 *   - in columns A and B the number reads like a row (A35 top ... A11 bottom);
 *   - every two columns to the right the numbers shift up by one (C36..C12, E37..E13,
 *     ... T44..T20), so the top-right hex is T44 and the bottom-right is T20;
 *   - moving one column right and half a hex DOWN keeps the same number.
 * (The right edge of the printed map carries a different 1..25 sequence; it is ignored.)
 */

/** Circumradius of one hex (centre to vertex), measured from the source image. */
export const HEX_R = 221;
/** Horizontal distance between the centres of adjacent columns (1.5 * R). */
export const COL_PITCH = 331.5;
/** Vertical distance between the centres of adjacent hexes in one column (R * sqrt(3)). */
export const ROW_PITCH = 382.8;
/** Centre x of column A. */
export const COL_A_X = 402.5;
/** Centre y of the top hex in an ODD column (B, D, ...). Even columns sit ROW_PITCH/2 higher. */
export const TOP_Y_ODD = 594.5;

export const COLUMNS = 'ABCDEFGHIJKLMNOPQRST'.split('');
/** Hexes per column. */
export const ROW_COUNT = 25;
/** Diagonal number of the top hex of column A (printed at the top of the left edge). */
export const TOP_LEFT_NUMBER = 35;

export const MAP_WIDTH = 7105;
export const MAP_HEIGHT = 10184;

export interface HexCoord {
	/** 0-based column index, A = 0. */
	col: number;
	/** Diagonal number, as printed on the map. */
	num: number;
}

export interface Point {
	x: number;
	y: number;
}

/* ---------- id helpers ---------- */

export function hexId({ col, num }: HexCoord): string {
	return `${COLUMNS[col]}${num}`;
}

/** Diagonal number of the top hex in a column. */
export function topNumber(col: number): number {
	return TOP_LEFT_NUMBER + Math.floor(col / 2);
}

/** Diagonal number of the bottom hex in a column. */
export function bottomNumber(col: number): number {
	return topNumber(col) - (ROW_COUNT - 1);
}

/** 0-based position of a hex within its column, counted from the top. */
export function rowIndex({ col, num }: HexCoord): number {
	return topNumber(col) - num;
}

export function hexFromRowIndex(col: number, rowIndex: number): HexCoord {
	return { col, num: topNumber(col) - rowIndex };
}

export function isOnMap({ col, num }: HexCoord): boolean {
	if (col < 0 || col >= COLUMNS.length) return false;
	return num >= bottomNumber(col) && num <= topNumber(col);
}

/** Parse "F23" / "f23" / "F-23" into a coordinate, or null if malformed / off the map. */
export function parseHexId(id: string): HexCoord | null {
	const m = /^([A-Ta-t])[-\s]?(\d{1,2})$/.exec(id.trim());
	if (!m) return null;
	const coord = { col: COLUMNS.indexOf(m[1].toUpperCase()), num: Number(m[2]) };
	return isOnMap(coord) ? coord : null;
}

export function isEvenColumn(col: number): boolean {
	return col % 2 === 0;
}

/* ---------- geometry ---------- */

/** Centre of a hex in source pixels. */
export function hexCenter(coord: HexCoord): Point {
	const x = COL_A_X + coord.col * COL_PITCH;
	const y = TOP_Y_ODD + rowIndex(coord) * ROW_PITCH - (isEvenColumn(coord.col) ? ROW_PITCH / 2 : 0);
	return { x, y };
}

/** The six corners of a flat-top hex, starting at the right-most vertex, clockwise on screen. */
export function hexCorners(coord: HexCoord, radius = HEX_R): Point[] {
	const c = hexCenter(coord);
	const pts: Point[] = [];
	for (let i = 0; i < 6; i++) {
		const angle = (Math.PI / 3) * i;
		pts.push({ x: c.x + radius * Math.cos(angle), y: c.y + radius * Math.sin(angle) });
	}
	return pts;
}

/**
 * Which hex contains a source-pixel point: the nearest hex centre among the candidate
 * columns around the point. Returns null when the point lies outside the printed grid.
 */
export function pointToHex(p: Point): HexCoord | null {
	const approxCol = Math.round((p.x - COL_A_X) / COL_PITCH);
	let best: { coord: HexCoord; d2: number } | null = null;
	for (let col = approxCol - 1; col <= approxCol + 1; col++) {
		if (col < 0 || col >= COLUMNS.length) continue;
		const evenShift = isEvenColumn(col) ? ROW_PITCH / 2 : 0;
		const approxRow = Math.round((p.y - TOP_Y_ODD + evenShift) / ROW_PITCH);
		for (let dr = -1; dr <= 1; dr++) {
			const row = approxRow + dr;
			if (row < 0 || row >= ROW_COUNT) continue;
			const coord = hexFromRowIndex(col, row);
			const c = hexCenter(coord);
			const d2 = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
			if (!best || d2 < best.d2) best = { coord, d2 };
		}
	}
	// A point further than the circumradius from every centre is off the grid.
	if (!best || best.d2 > HEX_R * HEX_R) return null;
	return best.coord;
}

/** Every hex on the printed grid, column-major, top to bottom. */
export function allHexes(): HexCoord[] {
	const out: HexCoord[] = [];
	for (let col = 0; col < COLUMNS.length; col++) {
		for (let row = 0; row < ROW_COUNT; row++) out.push(hexFromRowIndex(col, row));
	}
	return out;
}

/* ---------- navigation lines ---------- */

/** Smallest and largest diagonal numbers anywhere on the map. */
export const MIN_NUMBER = bottomNumber(0); // 11
export const MAX_NUMBER = topNumber(COLUMNS.length - 1); // 44

/** All hexes on one diagonal, left to right. Empty if the number is not on the map. */
export function diagonalHexes(num: number): HexCoord[] {
	const out: HexCoord[] = [];
	for (let col = 0; col < COLUMNS.length; col++) {
		const coord = { col, num };
		if (isOnMap(coord)) out.push(coord);
	}
	return out;
}

/** All hexes in one column, top to bottom. */
export function columnHexes(col: number): HexCoord[] {
	const out: HexCoord[] = [];
	for (let row = 0; row < ROW_COUNT; row++) out.push(hexFromRowIndex(col, row));
	return out;
}

/**
 * A straight line through the centres of a run of hexes, extended by `overshoot` hexes
 * past each end so labels can sit just outside the map. Returns [start, end].
 */
export function lineThrough(hexes: HexCoord[], overshoot = 0.7): [Point, Point] {
	const first = hexCenter(hexes[0]);
	const last = hexCenter(hexes[hexes.length - 1]);
	if (hexes.length === 1) return [first, last];
	const n = hexes.length - 1;
	const dx = (last.x - first.x) / n;
	const dy = (last.y - first.y) / n;
	return [
		{ x: first.x - dx * overshoot, y: first.y - dy * overshoot },
		{ x: last.x + dx * overshoot, y: last.y + dy * overshoot },
	];
}

/** Ray-casting point-in-polygon test in source pixels. */
export function pointInPolygon(p: Point, polygon: Point[]): boolean {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const a = polygon[i];
		const b = polygon[j];
		const crosses = a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x;
		if (crosses) inside = !inside;
	}
	return inside;
}
