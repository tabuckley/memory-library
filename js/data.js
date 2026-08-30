// Memory Library — data layer.
// Structural content (projects, places, strands, locations, opening hours)
// ships as bundled JSON, since it barely changes and defines how the rest
// of the model fits together.
//
// Artists, events and occurrences change often and are edited by non-
// developers, so they instead come from a Google Sheet (one tab per
// table, fetched as CSV — see docs/cms-setup.md for how that's wired up).
// If a tab's URL isn't configured yet, or the fetch fails for any reason
// (offline, sharing revoked, Google unreachable), each table falls back
// to its last-known-good bundled JSON copy in data/*.json — the site
// never depends on Google Sheets being up to render.
import { parseCSV } from "./csv.js";

// Sheet "Memory Library CMS" — shared as "Anyone with the link: Viewer",
// fetched by tab name via Google's gviz CSV export (works for any tab
// without needing to know its gid, and keeps working if tabs are
// reordered). Leave a URL empty to use the bundled JSON for that table.
const SHEET_ID = "1JD9vrjS9WqepJdaBktEzZmq_x4CteULc3xacCfyEuno";
const sheetTabUrl = (tab) => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tab}`;
const SHEET_CSV_URLS = {
  artists: sheetTabUrl("artists"),
  events: sheetTabUrl("events"),
  occurrences: sheetTabUrl("occurrences"),
  "pmf-sessions": sheetTabUrl("pmf-sessions"),
};

const FETCH_TIMEOUT_MS = 6000;

let _cache = null;

export async function loadData() {
  if (_cache) return _cache;

  const [artists, projects, events, occurrences, pmfSessions, locations, strands, places, openingHours] = await Promise.all([
    loadSheetTable("artists", normalizeArtist, "artists", "discipline"),
    fetchJSON("projects"),
    loadSheetTable("events", normalizeEvent, "events", "bookingStatus"),
    loadSheetTable("occurrences", normalizeOccurrence, "occurrences", "startTime"),
    loadSheetTable("pmf-sessions", normalizePmfSession, "past-makes-future", "section"),
    fetchJSON("locations"),
    fetchJSON("strands"),
    fetchJSON("places"),
    fetchJSON("opening-hours"),
  ]);

  _cache = {
    artists, projects, events, occurrences, pmfSessions, locations, strands, places, openingHours,
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
// bundled JSON uses. Falls back to data/<localName ?? name>.json if the
// sheet URL is blank, unreachable, times out, or — importantly — doesn't
// look like the right tab at all. `normalize` should return null/undefined
// for a row that should be skipped (e.g. blank id, blank title); those are
// filtered out here.
//
// `expectedField` guards against a real gotcha in Google's gviz CSV
// endpoint: requesting a `sheet=` name that doesn't exist on the
// spreadsheet does NOT fail — it silently returns the first tab's data
// instead, with a normal 200 status. Without this check, a typo'd or
// renamed tab would serve some other table's content with no error at
// all. Pick a column name unique to this table (present in its header
// row) and every fetch is checked against it before being trusted.
async function loadSheetTable(name, normalize, localName = name, expectedField) {
  const url = SHEET_CSV_URLS[name];
  if (!url) return fetchJSON(localName);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Sheet fetch failed for ${name}: ${res.status}`);
    const text = await res.text();
    const rows = parseCSV(text);
    if (expectedField && rows.length && !(expectedField in rows[0])) {
      throw new Error(`Sheet response for "${name}" doesn't look like that tab (missing "${expectedField}" column) — wrong/renamed tab?`);
    }
    return rows.map(normalize).filter(Boolean);
  } catch (err) {
    console.warn(`[data] Falling back to bundled ${localName}.json —`, err.message);
    return fetchJSON(localName);
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

// Resolves a pasted Google Drive share link (any of the common formats, or
// a bare file id) into a direct, embeddable image URL. Non-Drive URLs
// (e.g. a link to some other image host) pass through unchanged, so this
// is safe to run on any photoUrl/imageUrl cell regardless of where the
// image is actually hosted.
function extractDriveFileId(value) {
  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]{15,})/, /[?&]id=([a-zA-Z0-9_-]{15,})/];
  for (const p of patterns) {
    const m = value.match(p);
    if (m) return m[1];
  }
  return null;
}

function driveImageUrl(value, size = 1600) {
  const url = orNull(value);
  if (!url) return null;
  const id = extractDriveFileId(url);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}

function normalizeArtist(row) {
  if (!row.id) return null;
  return {
    id: row.id,
    name: row.name,
    discipline: row.discipline,
    placeId: row.placeId,
    bio: row.bio,
    portraitCaption: orNull(row.portraitCaption),
    projectIds: list(row.projectIds),
    photoUrl: driveImageUrl(row.photoUrl),
    portfolioUrl: orNull(row.portfolioUrl),
    instagramUrl: orNull(row.instagramUrl),
  };
}

function normalizeEvent(row) {
  if (!row.id) return null;
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
    imageUrl: driveImageUrl(row.imageUrl),
    ageGuidance: orNull(row.ageGuidance),
    mode: row.mode,
    dateStart: orNull(row.dateStart),
    dateEnd: orNull(row.dateEnd),
    confirmed: bool(row.confirmed),
  };
}

function normalizeOccurrence(row) {
  if (!row.id) return null;
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

function normalizePmfSession(row) {
  if (!row.section || !row.title) return null;
  return {
    section: row.section.trim().toLowerCase(),
    time: row.time,
    title: row.title,
    purpose: row.purpose || "",
    who: row.who || "",
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

// Resolves a list of ids (e.g. an event's artistIds) against a byId map,
// dropping — rather than crashing on — any id that doesn't match a real
// record. Sheet-entered ids are hand-typed, so a typo or a reference to
// the wrong table (an event id pasted into a projectIds cell, say) is
// expected to happen occasionally; that should quietly omit the broken
// reference, not take down the whole page. Logs a console warning so it's
// still easy to spot and fix in the sheet.
export function resolveRefs(ids, map, kind) {
  return (ids || [])
    .map((id) => {
      const item = map[id];
      if (!item) console.warn(`[data] ${kind} id "${id}" not found — check the sheet for a typo, or a reference to the wrong table.`);
      return item;
    })
    .filter(Boolean);
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

export function plateImg(seed, orientation = "landscape", realUrl = null) {
  const src = realUrl || placeholderSrc(seed, orientation);
  return `<img class="plate-photo" src="${src}" alt="" loading="lazy" />`;
}

// A shared name lets the browser's cross-document View Transition morph
// this exact image from an index/teaser position into its detail-page
// hero position, instead of the page hard-cutting. Only meaningful when
// the same name is used on both the teaser and the detail page for a
// given item — see css/motion.css for the opt-in `@view-transition` rule.
export function vtName(kind, id) {
  return `${kind}-${String(id).replace(/[^a-zA-Z0-9-]/g, "")}`;
}
