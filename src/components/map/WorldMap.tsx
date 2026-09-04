/**
 * Interactive world map.
 *
 * Renders the tile pyramid built by scripts/build-map-tiles.mjs with Leaflet, overlays
 * nations, places and explored hexes from /map/data.json, and shows details for whatever
 * is selected in a side panel. Everything is addressed in source-image pixels via
 * src/lib/hexgrid.ts, so the same coordinates work at every zoom level.
 *
 * Deep links: #hex=F23, #place=ostia, #nation=lycia.
 *
 * Must be rendered with `client:only="react"`; Leaflet needs `window` at import time.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';
import {
	allHexes,
	COLUMNS,
	columnHexes,
	diagonalHexes,
	hexCenter,
	hexCorners,
	hexId,
	lineThrough,
	MAP_HEIGHT,
	MAP_WIDTH,
	MAX_NUMBER,
	MIN_NUMBER,
	parseHexId,
	pointToHex,
	type HexCoord,
} from '../../lib/hexgrid';
import type { HexNote, MapData, Nation, Place, PlaceType, Selection } from './types';

const TILE_URL = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/map-tiles/{z}/{y}/{x}.webp`;
const DATA_URL = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/map/data.json`;
const MAX_NATIVE_ZOOM = 6; // from public/map-tiles/meta.json
const LABEL_ZOOM = 4; // hex ids appear at this zoom and above

/** Map units are source pixels: at zoom MAX_NATIVE_ZOOM one unit is one screen pixel. */
const PixelCRS = L.extend({}, L.CRS.Simple, {
	transformation: new L.Transformation(1 / 2 ** MAX_NATIVE_ZOOM, 0, 1 / 2 ** MAX_NATIVE_ZOOM, 0),
});

const toLatLng = (p: { x: number; y: number }) => L.latLng(p.y, p.x);
const hexRing = (coord: HexCoord) => hexCorners(coord).map(toLatLng);
const MAP_BOUNDS = L.latLngBounds(toLatLng({ x: 0, y: 0 }), toLatLng({ x: MAP_WIDTH, y: MAP_HEIGHT }));

const PLACE_STYLE: Record<PlaceType, { radius: number; color: string; label: 'always' | 'zoomed' | 'hover' }> = {
	capital: { radius: 9, color: '#111', label: 'always' },
	city: { radius: 7, color: '#111', label: 'always' },
	town: { radius: 5, color: '#333', label: 'zoomed' },
	port: { radius: 5, color: '#1d5fa8', label: 'zoomed' },
	landmark: { radius: 5, color: '#b8860b', label: 'zoomed' },
	ruin: { radius: 5, color: '#666', label: 'zoomed' },
	monster: { radius: 6, color: '#c0392b', label: 'zoomed' },
	sea: { radius: 0, color: 'transparent', label: 'hover' },
};

const PLACE_TYPE_LABEL: Record<PlaceType, string> = {
	capital: 'Capital',
	city: 'City',
	town: 'Town',
	port: 'Port',
	landmark: 'Landmark',
	ruin: 'Ruin',
	monster: 'Monster lair',
	sea: 'Sea',
};

function readHash(): Selection | null {
	const m = /^#(hex|place|nation)=([^&]+)/.exec(window.location.hash);
	if (!m) return null;
	const kind = m[1] as Selection['kind'];
	const id = decodeURIComponent(m[2]);
	return { kind, id: kind === 'hex' ? id.toUpperCase() : id };
}

function writeHash(sel: Selection | null) {
	const next = sel ? `#${sel.kind}=${encodeURIComponent(sel.id)}` : window.location.pathname + window.location.search;
	if (sel ? window.location.hash !== next : window.location.hash !== '') history.replaceState(null, '', next);
}

interface Layers {
	map: L.Map;
	nations: L.LayerGroup;
	explored: L.LayerGroup;
	grid: L.LayerGroup;
	gridLabels: L.LayerGroup;
	coords: L.LayerGroup;
	places: L.LayerGroup;
	highlight: L.LayerGroup;
}

export default function WorldMap() {
	const canvasRef = useRef<HTMLDivElement>(null);
	const layersRef = useRef<Layers | null>(null);
	const [data, setData] = useState<MapData | null>(null);
	const [error, setError] = useState<string | null>(null);
	// Seeded from the URL hash so a deep link survives the first render.
	const [selection, setSelection] = useState<Selection | null>(() => readHash());
	const [showNations, setShowNations] = useState(true);
	const [showPlaces, setShowPlaces] = useState(true);
	const [showExplored, setShowExplored] = useState(true);
	const [showGrid, setShowGrid] = useState(false);
	const [showCoords, setShowCoords] = useState(true);
	const [zoom, setZoom] = useState(0);

	// Lookups derived from the data.
	const index = useMemo(() => {
		const nationOfHex = new Map<string, Nation>();
		const noteOfHex = new Map<string, HexNote>();
		const placesOfHex = new Map<string, Place[]>();
		if (data) {
			for (const n of data.nations) for (const h of n.hexes) nationOfHex.set(h, n);
			for (const h of data.hexes) noteOfHex.set(h.id, h);
			for (const p of data.places) placesOfHex.set(p.hex, [...(placesOfHex.get(p.hex) ?? []), p]);
		}
		return { nationOfHex, noteOfHex, placesOfHex };
	}, [data]);

	// Load data once.
	useEffect(() => {
		fetch(DATA_URL)
			.then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.statusText}`))))
			.then((d: MapData) => setData(d))
			.catch((e: Error) => setError(`Could not load map data: ${e.message}`));
	}, []);

	// Create the Leaflet map once.
	useEffect(() => {
		if (!canvasRef.current || layersRef.current) return;
		const map = L.map(canvasRef.current, {
			crs: PixelCRS,
			minZoom: 1,
			maxZoom: MAX_NATIVE_ZOOM + 1,
			zoomSnap: 0.5,
			maxBounds: MAP_BOUNDS.pad(0.25),
			maxBoundsViscosity: 0.8,
			attributionControl: false,
		});
		L.tileLayer(TILE_URL, {
			tileSize: 256,
			minNativeZoom: 0,
			maxNativeZoom: MAX_NATIVE_ZOOM,
			noWrap: true,
			bounds: MAP_BOUNDS,
			keepBuffer: 4,
		}).addTo(map);
		map.fitBounds(MAP_BOUNDS);

		const canvas = L.canvas({ padding: 0.5 });
		const layers: Layers = {
			map,
			nations: L.layerGroup().addTo(map),
			explored: L.layerGroup().addTo(map),
			grid: L.layerGroup(),
			gridLabels: L.layerGroup(),
			coords: L.layerGroup().addTo(map),
			places: L.layerGroup().addTo(map),
			highlight: L.layerGroup().addTo(map),
		};

		// Grid outlines are static; build them once.
		for (const coord of allHexes()) {
			L.polygon(hexRing(coord), { renderer: canvas, interactive: false, color: '#000', weight: 1, opacity: 0.25, fill: false }).addTo(layers.grid);
			L.marker(toLatLng(hexCenter(coord)), {
				interactive: false,
				icon: L.divIcon({ className: 'world-map__hex-label', html: hexId(coord), iconSize: [40, 12], iconAnchor: [20, 6] }),
			}).addTo(layers.gridLabels);
		}

		// Coordinate lines: one per column (letter) and one per diagonal (number), labelled at
		// both ends. A hex is where its column line and its diagonal line cross.
		const coordLabel = (p: { x: number; y: number }, text: string, kind: 'col' | 'diag') =>
			L.marker(toLatLng(p), {
				interactive: false,
				icon: L.divIcon({ className: `world-map__coord-label world-map__coord-label--${kind}`, html: text, iconSize: [28, 16], iconAnchor: [14, 8] }),
			}).addTo(layers.coords);
		for (let col = 0; col < COLUMNS.length; col++) {
			const [a, b] = lineThrough(columnHexes(col), 0.9);
			L.polyline([toLatLng(a), toLatLng(b)], { renderer: canvas, interactive: false, color: '#1d3557', weight: 1, opacity: 0.45, dashArray: '6 6' }).addTo(layers.coords);
			coordLabel(a, COLUMNS[col], 'col');
			coordLabel(b, COLUMNS[col], 'col');
		}
		for (let num = MIN_NUMBER; num <= MAX_NUMBER; num++) {
			// Longer overshoot so the numbers sit outside the row of column letters.
			const [a, b] = lineThrough(diagonalHexes(num), 1.5);
			L.polyline([toLatLng(a), toLatLng(b)], { renderer: canvas, interactive: false, color: '#9d0208', weight: 1, opacity: 0.45 }).addTo(layers.coords);
			coordLabel(a, String(num), 'diag');
			coordLabel(b, String(num), 'diag');
		}

		map.on('click', (e: L.LeafletMouseEvent) => {
			const hex = pointToHex({ x: e.latlng.lng, y: e.latlng.lat });
			setSelection(hex ? { kind: 'hex', id: hexId(hex) } : null);
		});
		map.on('zoomend', () => setZoom(map.getZoom()));
		setZoom(map.getZoom());

		layersRef.current = layers;
		return () => {
			map.remove();
			layersRef.current = null;
		};
	}, []);

	// Draw data layers whenever data arrives.
	useEffect(() => {
		const layers = layersRef.current;
		if (!layers || !data) return;
		const canvas = L.canvas({ padding: 0.5 });

		layers.nations.clearLayers();
		for (const nation of data.nations) {
			const rings = nation.hexes.map(parseHexId).filter((c): c is HexCoord => !!c).map(hexRing);
			L.polygon(rings, { renderer: canvas, interactive: false, stroke: false, fillColor: nation.color, fillOpacity: 0.12 }).addTo(layers.nations);
		}

		layers.explored.clearLayers();
		for (const note of data.hexes) {
			const coord = parseHexId(note.id);
			if (!coord) continue;
			L.polygon(hexRing(coord), { renderer: canvas, interactive: false, color: '#ffffff', weight: 3, opacity: 0.9, fillColor: '#ffd166', fillOpacity: 0.25 }).addTo(layers.explored);
		}

		layers.places.clearLayers();
		for (const place of data.places) {
			const coord = parseHexId(place.hex);
			if (!coord || place.type === 'sea') continue;
			const style = PLACE_STYLE[place.type];
			const nationColor = data.nations.find((n) => n.id === place.nation)?.color ?? '#ffffff';
			const marker = L.circleMarker(toLatLng(hexCenter(coord)), {
				radius: style.radius,
				color: '#ffffff',
				weight: 2,
				fillColor: place.type === 'capital' || place.type === 'city' ? nationColor : style.color,
				fillOpacity: 1,
			});
			marker.on('click', (e) => {
				L.DomEvent.stopPropagation(e.originalEvent);
				setSelection({ kind: 'place', id: place.id });
			});
			marker.bindTooltip(place.name, { className: 'world-map__place-label', direction: 'top', offset: [0, -style.radius], permanent: false });
			(marker as L.CircleMarker & { placeType: PlaceType }).placeType = place.type;
			marker.addTo(layers.places);
		}
	}, [data]);

	// Show/hide toggleable layers.
	useEffect(() => {
		const layers = layersRef.current;
		if (!layers) return;
		const sync = (group: L.LayerGroup, on: boolean) => (on ? group.addTo(layers.map) : layers.map.removeLayer(group));
		sync(layers.nations, showNations);
		sync(layers.places, showPlaces);
		sync(layers.explored, showExplored);
		sync(layers.grid, showGrid);
		sync(layers.gridLabels, showGrid && zoom >= LABEL_ZOOM);
		sync(layers.coords, showCoords);
	}, [showNations, showPlaces, showExplored, showGrid, showCoords, zoom]);

	// Place labels: capitals and cities always, other places once zoomed in.
	useEffect(() => {
		const layers = layersRef.current;
		if (!layers) return;
		layers.places.eachLayer((layer) => {
			const marker = layer as L.CircleMarker & { placeType?: PlaceType };
			const tooltip = marker.getTooltip();
			if (!tooltip || !marker.placeType) return;
			const mode = PLACE_STYLE[marker.placeType].label;
			const permanent = mode === 'always' ? zoom >= 2.5 : mode === 'zoomed' ? zoom >= LABEL_ZOOM : false;
			if (tooltip.options.permanent !== permanent) {
				marker.unbindTooltip();
				marker.bindTooltip(tooltip.getContent() as string, { ...tooltip.options, permanent });
			}
		});
	}, [zoom, data]);

	// Selection: highlight on the map, sync the URL hash, and pan into view.
	useEffect(() => {
		const layers = layersRef.current;
		if (!layers) return;
		layers.highlight.clearLayers();
		writeHash(selection);
		if (!selection || !data) return;

		const focusHex = (id: string, pan: boolean) => {
			const coord = parseHexId(id);
			if (!coord) return;
			// Crosshair: the selected hex's column line and diagonal line, so it can be found
			// from the letters and numbers on the map edges.
			for (const run of [columnHexes(coord.col), diagonalHexes(coord.num)]) {
				const [a, b] = lineThrough(run, 0.9);
				L.polyline([toLatLng(a), toLatLng(b)], { interactive: false, color: '#fff', weight: 5, opacity: 0.8 }).addTo(layers.highlight);
				L.polyline([toLatLng(a), toLatLng(b)], { interactive: false, color: '#e63946', weight: 2, opacity: 0.9 }).addTo(layers.highlight);
			}
			L.polygon(hexRing(coord), { interactive: false, color: '#fff', weight: 4, opacity: 1, fill: false }).addTo(layers.highlight);
			L.polygon(hexRing(coord), { interactive: false, color: '#e63946', weight: 2, opacity: 1, fill: false }).addTo(layers.highlight);
			if (pan) {
				const center = toLatLng(hexCenter(coord));
				const inView = layers.map.getBounds().pad(-0.2).contains(center);
				const tooFar = layers.map.getZoom() < LABEL_ZOOM - 1;
				if (!inView || tooFar) layers.map.flyTo(center, Math.max(layers.map.getZoom(), LABEL_ZOOM), { duration: 0.6 });
			}
		};

		if (selection.kind === 'hex') focusHex(selection.id, true);
		if (selection.kind === 'place') {
			const place = data.places.find((p) => p.id === selection.id);
			if (place) focusHex(place.hex, true);
		}
		if (selection.kind === 'nation') {
			const nation = data.nations.find((n) => n.id === selection.id);
			if (nation) {
				const rings = nation.hexes.map(parseHexId).filter((c): c is HexCoord => !!c).map(hexRing);
				const outline = L.polygon(rings, { interactive: false, stroke: false, fillColor: nation.color, fillOpacity: 0.35 }).addTo(layers.highlight);
				layers.map.flyToBounds(outline.getBounds(), { duration: 0.6, padding: [20, 20] });
			}
		}
	}, [selection, data]);

	// Follow hash changes made after load (browser back/forward, links on the page).
	useEffect(() => {
		const apply = () => setSelection(readHash());
		window.addEventListener('hashchange', apply);
		return () => window.removeEventListener('hashchange', apply);
	}, []);

	return (
		<div className="world-map not-content">
			<div className="world-map__canvas">
				<div ref={canvasRef} style={{ height: '100%' }} />
				<div className="world-map__layers">
					<label><input type="checkbox" checked={showNations} onChange={(e) => setShowNations(e.target.checked)} /> Nations</label>
					<label><input type="checkbox" checked={showPlaces} onChange={(e) => setShowPlaces(e.target.checked)} /> Places</label>
					<label><input type="checkbox" checked={showExplored} onChange={(e) => setShowExplored(e.target.checked)} /> Explored hexes</label>
					<label><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Hex grid</label>
					<label><input type="checkbox" checked={showCoords} onChange={(e) => setShowCoords(e.target.checked)} /> Coordinate lines</label>
				</div>
			</div>
			<aside className="world-map__panel" aria-live="polite">
				{error && <p role="alert">{error}</p>}
				{!error && !data && <p className="world-map__muted">Loading map data…</p>}
				{data && <Panel data={data} index={index} selection={selection} select={setSelection} />}
			</aside>
		</div>
	);
}

/* ---------- Side panel ---------- */

interface PanelProps {
	data: MapData;
	index: { nationOfHex: Map<string, Nation>; noteOfHex: Map<string, HexNote>; placesOfHex: Map<string, Place[]> };
	selection: Selection | null;
	select: (s: Selection | null) => void;
}

function Panel({ data, index, selection, select }: PanelProps) {
	if (!selection) return <Overview data={data} select={select} />;
	const back = (
		<button type="button" className="world-map__linkbtn world-map__back" onClick={() => select(null)}>
			← Back to overview
		</button>
	);
	if (selection.kind === 'hex') return <>{back}<HexDetails id={selection.id} data={data} index={index} select={select} /></>;
	if (selection.kind === 'place') {
		const place = data.places.find((p) => p.id === selection.id);
		return <>{back}{place ? <PlaceDetails place={place} data={data} select={select} /> : <p>Unknown place "{selection.id}".</p>}</>;
	}
	const nation = data.nations.find((n) => n.id === selection.id);
	return <>{back}{nation ? <NationDetails nation={nation} data={data} index={index} select={select} /> : <p>Unknown nation "{selection.id}".</p>}</>;
}

function Overview({ data, select }: { data: MapData; select: (s: Selection) => void }) {
	const [query, setQuery] = useState('');
	const q = query.trim().toLowerCase();
	const matches = q ? data.places.filter((p) => p.name.toLowerCase().includes(q) || p.hex.toLowerCase() === q) : [];
	const hexMatch = q && parseHexId(q.toUpperCase()) ? q.toUpperCase() : null;
	return (
		<>
			<p className="world-map__kicker">The Mythic Age</p>
			<h2>World map</h2>
			<p>Click a city for details, or click any hex to see what is known about it. A hex id is its column letter plus the number of the diagonal running up-left through it; the coordinate lines show both, and selecting a hex draws its crosshair.</p>
			<h3>Find</h3>
			<input className="world-map__search" type="search" placeholder="Place name or hex id (e.g. F23)" value={query} onChange={(e) => setQuery(e.target.value)} />
			{(matches.length > 0 || hexMatch) && (
				<ul>
					{hexMatch && <li><button type="button" className="world-map__linkbtn" onClick={() => select({ kind: 'hex', id: hexMatch })}>Hex {hexMatch}</button></li>}
					{matches.slice(0, 12).map((p) => (
						<li key={p.id}><PlaceLink place={p} select={select} /> <span className="world-map__muted">{p.hex}</span></li>
					))}
				</ul>
			)}
			<h3>Nations</h3>
			<ul>
				{data.nations.map((n) => (
					<li key={n.id}>
						<span className="world-map__swatch" style={{ background: n.color }} />
						<button type="button" className="world-map__linkbtn" onClick={() => select({ kind: 'nation', id: n.id })}>{n.name}</button>
					</li>
				))}
			</ul>
			<h3>Explored hexes</h3>
			{data.hexes.length === 0 && <p className="world-map__muted">No hex notes yet.</p>}
			<ul>
				{[...data.hexes].sort((a, b) => a.id.localeCompare(b.id)).map((h) => (
					<li key={h.id}>
						<button type="button" className="world-map__linkbtn" onClick={() => select({ kind: 'hex', id: h.id })}>{h.id}</button>
						{h.title && <> · {h.title}</>}
						{h.campaign && <span className="world-map__muted"> ({h.campaign})</span>}
					</li>
				))}
			</ul>
		</>
	);
}

function PlaceLink({ place, select }: { place: Place; select: (s: Selection) => void }) {
	return <button type="button" className="world-map__linkbtn" onClick={() => select({ kind: 'place', id: place.id })}>{place.name}</button>;
}

function NationLink({ nation, select }: { nation: Nation; select: (s: Selection) => void }) {
	return (
		<button type="button" className="world-map__linkbtn" onClick={() => select({ kind: 'nation', id: nation.id })}>
			<span className="world-map__swatch" style={{ background: nation.color }} />{nation.name}
		</button>
	);
}

function HexDetails({ id, data, index, select }: { id: string } & Omit<PanelProps, 'selection'>) {
	const note = index.noteOfHex.get(id);
	const nation = index.nationOfHex.get(id);
	const places = index.placesOfHex.get(id) ?? [];
	return (
		<>
			<p className="world-map__kicker">Hex</p>
			<h2>{note?.title ? `${note.title} (${id})` : `Hex ${id}`}</h2>
			<p>
				{nation ? <NationLink nation={nation} select={select} /> : <span className="world-map__muted">Unclaimed wilderness</span>}
				{note?.terrain && <> · {note.terrain}</>}
			</p>
			{note?.campaign && <p><strong>{note.campaign}</strong>{note.sessions?.length ? <> · {note.sessions.join(', ')}</> : null}</p>}
			{note?.tags?.length ? <p>{note.tags.map((t) => <span key={t} className="world-map__tag">{t}</span>)}</p> : null}
			{places.length > 0 && (
				<>
					<h3>Here</h3>
					<ul>{places.map((p) => <li key={p.id}><PlaceLink place={p} select={select} /> <span className="world-map__muted">{PLACE_TYPE_LABEL[p.type]}</span></li>)}</ul>
				</>
			)}
			{note ? (
				<div className="world-map__note sl-markdown-content" dangerouslySetInnerHTML={{ __html: note.html }} />
			) : (
				<p className="world-map__muted">Nothing has been recorded about this hex yet. Add <code>src/content/hexes/{id}.md</code> to describe it.</p>
			)}
		</>
	);
}

function PlaceDetails({ place, data, select }: { place: Place; data: MapData; select: (s: Selection) => void }) {
	const nation = data.nations.find((n) => n.id === place.nation);
	return (
		<>
			<p className="world-map__kicker">{PLACE_TYPE_LABEL[place.type]}</p>
			<h2>{place.name}</h2>
			<p>
				<button type="button" className="world-map__linkbtn" onClick={() => select({ kind: 'hex', id: place.hex })}>Hex {place.hex}</button>
				{nation && <> · <NationLink nation={nation} select={select} /></>}
			</p>
			{place.summary && <p>{place.summary}</p>}
			{place.page && <p><a href={place.page}>Read more →</a></p>}
		</>
	);
}

function NationDetails({ nation, data, index, select }: { nation: Nation } & Omit<PanelProps, 'selection'>) {
	const places = data.places.filter((p) => p.nation === nation.id);
	const explored = nation.hexes.filter((h) => index.noteOfHex.has(h));
	return (
		<>
			<p className="world-map__kicker">Nation</p>
			<h2><span className="world-map__swatch" style={{ background: nation.color }} />{nation.name}</h2>
			{nation.summary && <p>{nation.summary}</p>}
			{nation.page && <p><a href={nation.page}>Read more →</a></p>}
			<p className="world-map__muted">{nation.hexes.length} hexes, {explored.length} with notes.</p>
			{places.length > 0 && (
				<>
					<h3>Places</h3>
					<ul>{places.map((p) => <li key={p.id}><PlaceLink place={p} select={select} /> <span className="world-map__muted">{p.hex}</span></li>)}</ul>
				</>
			)}
		</>
	);
}
