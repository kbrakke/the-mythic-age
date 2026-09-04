/**
 * Hex grid geometry for the world map.
 *
 * Every coordinate here is in *source image pixels* of src/assets/WorldMap-01.png
 * (7105 x 10184). The interactive map uses the same coordinate space, so data can be
 * authored once and reused for tiles at any zoom.
 *
 * The printed map uses flat-top hexes in columns A..T (left to right). Even columns
 * (A, C, E, ...) sit half a hex higher than odd columns. Rows are numbered from the
 * bottom of the map upward. The printed map carries two row numberings: the left edge
 * reads 11..35 and the right edge reads 1..25. This module uses the LEFT-edge numbering;
 * change `BOTTOM_ROW` to 1 to switch to the right-edge numbering.
 *
 * Hex ids look like "F23": column letter followed by row number.
 */

/** Circumradius of one hex (centre to vertex), measured from the source image. */
export const HEX_R = 221;
/** Horizontal distance between the centres of adjacent columns (1.5 * R). */
export const COL_PITCH = 331.5;
/** Vertical distance between the centres of adjacent rows in one column (R * sqrt(3)). */
export const ROW_PITCH = 382.8;
/** Centre x of column A. */
export const COL_A_X = 402.5;
/** Centre y of the top row in an ODD column (B, D, ...). Even columns sit ROW_PITCH/2 higher. */
export const TOP_ROW_Y_ODD = 594.5;

export const COLUMNS = 'ABCDEFGHIJKLMNOPQRST'.split('');
export const ROW_COUNT = 25;
export const BOTTOM_ROW = 11;
export const TOP_ROW = BOTTOM_ROW + ROW_COUNT - 1; // 35

export const MAP_WIDTH = 7105;
export const MAP_HEIGHT = 10184;

export interface HexCoord {
  /** 0-based column index, A = 0. */
  col: number;
  /** Printed row number (BOTTOM_ROW..TOP_ROW). */
  row: number;
}

export interface Point {
  x: number;
  y: number;
}

export function hexId({ col, row }: HexCoord): string {
  return `${COLUMNS[col]}${row}`;
}

/** Parse "F23" / "f23" / "F-23" into a coordinate, or null if malformed / off the map. */
export function parseHexId(id: string): HexCoord | null {
  const m = /^([A-Ta-t])[-\s]?(\d{1,2})$/.exec(id.trim());
  if (!m) return null;
  const col = COLUMNS.indexOf(m[1].toUpperCase());
  const row = Number(m[2]);
  if (col < 0 || row < BOTTOM_ROW || row > TOP_ROW) return null;
  return { col, row };
}

export function isEvenColumn(col: number): boolean {
  return col % 2 === 0;
}

/** Centre of a hex in source pixels. */
export function hexCenter({ col, row }: HexCoord): Point {
  const x = COL_A_X + col * COL_PITCH;
  const rowsFromTop = TOP_ROW - row;
  const y = TOP_ROW_Y_ODD + rowsFromTop * ROW_PITCH - (isEvenColumn(col) ? ROW_PITCH / 2 : 0);
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
 * Which hex contains a source-pixel point. Works by finding the nearest hex centre
 * among the candidate columns around the point; returns null when the point lies
 * outside the printed grid.
 */
export function pointToHex(p: Point): HexCoord | null {
  const approxCol = Math.round((p.x - COL_A_X) / COL_PITCH);
  let best: { coord: HexCoord; d2: number } | null = null;
  for (let col = approxCol - 1; col <= approxCol + 1; col++) {
    if (col < 0 || col >= COLUMNS.length) continue;
    const evenShift = isEvenColumn(col) ? ROW_PITCH / 2 : 0;
    const rowsFromTop = Math.round((p.y - TOP_ROW_Y_ODD + evenShift) / ROW_PITCH);
    for (let dr = -1; dr <= 1; dr++) {
      const row = TOP_ROW - (rowsFromTop + dr);
      if (row < BOTTOM_ROW || row > TOP_ROW) continue;
      const c = hexCenter({ col, row });
      const d2 = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
      if (!best || d2 < best.d2) best = { coord: { col, row }, d2 };
    }
  }
  // A point further than the circumradius from every centre is off the grid.
  if (!best || best.d2 > HEX_R * HEX_R) return null;
  return best.coord;
}

/** Every hex on the printed grid, column-major. */
export function allHexes(): HexCoord[] {
  const out: HexCoord[] = [];
  for (let col = 0; col < COLUMNS.length; col++) {
    for (let row = BOTTOM_ROW; row <= TOP_ROW; row++) out.push({ col, row });
  }
  return out;
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
