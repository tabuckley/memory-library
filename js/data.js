// Memory Library — data layer.
// Structural content (projects, places, strands, locations, opening hours)
// ships as bundled JSON, since it barely changes and defines how the rest
// of the model fits together.
//
// Artists, events and occurrences change often and are edited by non-
// developers, so they instead come from a published Google Sheet (one tab
// per table, published as CSV — see docs/cms-setup.md for how that's wired
// up). If a tab's URL isn't configured yet, or the fetch fails for any
// reason (offline, sheet unpublished, Google unreachable), each table
// falls back to its last-known-good bundled JSON copy in data/*.json —
// the site never depends on Google Sheets being up to render.
import { parseCSV } from "./csv.js";

// Paste the "Publish to web" CSV link for each tab here once the sheet is
// set up (Sheet > File > Share > Publish to web > select tab > CSV).
// Leave empty to use the bundled JSON for that table.
const SHEET_CSV_URLS = {
  artists: "",
  events: "",
  occurrences: "",
};

const FETCH_TIMEOUT_MS = 6000;

let _cache = null;

export async function loadData() {
  if (_cache) return _cache;

  const [artists, projects, events, occurrences, locations, strands, places, openingHours] = await Promise.all([
    loadSheetTable("artists", normalizeArtist),
    fetchJSON("projects"),
    loadSheetTable("events", normalizeEvent),
    loadSheetTable("occurrences", normalizeOccurrence),
    fetchJSON("locations"),
    fetchJSON("strands"),
    fetchJSON("places"),
    fetchJSON("opening-hours"),
  ]);

  _cache = {
    artists, projects, events, occurrences, locations, strands, places, openingHours,
    byId: {
      artist: indexBy(artists, "id"),
      project: indexBy(projects, "id"),
      event: indexBy(events, "id"),
      location: indexBy(locations, "id"),
      strand: indexBy(strands, "id"),
      place: indexBy(places, "id"),
    },
  };
  return _cache;
}

function indexBy(arr, key) {
  const map = {};
  for (const item of arr) map[item[key]] = item;
  return map;
}

function fetchJSON(name) {
  return fetch(`data/${name}.json`).then((r) => {
    if (!r.ok) throw new Error(`Failed to load ${name}.json`);
    return r.json();
  });
}

// Fetches a published-CSV tab and normalizes it into the same shape the
// bundled JSON uses. Falls back to data/<name>.json if the sheet URL is
// blank, unreachable, or times out.
async function loadSheetTable(name, normalize) {
  const url = SHEET_CSV_URLS[name];
  if (!url) return fetchJSON(name);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Sheet fetch failed for ${name}: ${res.status}`);
    const text = await res.text();
    return parseCSV(text).map(normalize).filter((row) => row.id);
  } catch (err) {
    console.warn(`[data] Falling back to bundled ${name}.json —`, err.message);
    return fetchJSON(name);
  } finally {
    clearTimeout(timer);
  }
}

// -- CSV row → content-model normalization --------------------------------
// Sheet cells are always strings; these coerce them into the same field
// types the bundled JSON already uses, so every page renders identically
// regardless of which source the data came from.

function list(value) {
  return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function bool(value) {
  return String(value).trim().toUpperCase() === "TRUE";
}

function orNull(value) {
  return value && value.trim() ? value.trim() : null;
}

function normalizeArtist(row) {
  return {
    id: row.id,
    name: row.name,
    discipline: row.discipline,
    placeId: row.placeId,
    bio: row.bio,
    portraitCaption: orNull(row.portraitCaption),
    projectIds: list(row.projectIds),
  };
}

function normalizeEvent(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    strandId: row.strandId,
    locationIds: list(row.locationIds),
    artistIds: list(row.artistIds),
    projectIds: list(row.projectIds),
    summary: row.summary,
    blurb: row.blurb,
    bookingStatus: row.bookingStatus,
    bookingUrl: orNull(row.bookingUrl),
    ageGuidance: orNull(row.ageGuidance),
    mode: row.mode,
    dateStart: orNull(row.dateStart),
    dateEnd: orNull(row.dateEnd),
    confirmed: bool(row.confirmed),
  };
}

function normalizeOccurrence(row) {
  return {
    id: row.id,
    eventId: row.eventId,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    locationId: row.locationId,
    note: orNull(row.note),
    confirmed: bool(row.confirmed),
  };
}

// Resolves the "now" used across the site. A ?at=YYYY-MM-DDTHH:mm query
// parameter lets the live programme states (Happening Now / Next / Upcoming)
// be previewed before the real festival dates — production behaviour is
// simply `new Date()`.
export function getNow() {
  const params = new URLSearchParams(location.search);
  const at = params.get("at");
  if (at) {
    const d = new Date(at);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

export function occurrenceDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

// Deterministic placeholder photography. Real photography is limited to a
// handful of documentary images (see assets/img/*.jpg); everywhere else a
// toned, high-resolution abstract placeholder stands in so scale, crop and
// hover behaviour can be judged for real rather than against a flat colour
// swatch. Same seed always resolves to the same image.
const PLACEHOLDERS_LANDSCAPE = ["ph-blue", "ph-mint", "ph-foxed", "ph-dust"];
const PLACEHOLDERS_PORTRAIT = ["ph-blue-p", "ph-dust-p"];

function hashSeed(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

export function placeholderSrc(seed, orientation = "landscape") {
  const set = orientation === "portrait" ? PLACEHOLDERS_PORTRAIT : PLACEHOLDERS_LANDSCAPE;
  const name = set[hashSeed(String(seed)) % set.length];
  return `assets/img/placeholder/${name}.jpg`;
}

export function plateImg(seed, orientation = "landscape") {
  return `<img class="plate-photo" src="${placeholderSrc(seed, orientation)}" alt="" loading="lazy" />`;
}

// A shared name lets the browser's cross-document View Transition morph
// this exact image from an index/teaser position into its detail-page
// hero position, instead of the page hard-cutting. Only meaningful when
// the same name is used on both the teaser and the detail page for a
// given item — see css/motion.css for the opt-in `@view-transition` rule.
export function vtName(kind, id) {
  return `${kind}-${String(id).replace(/[^a-zA-Z0-9-]/g, "")}`;
}
