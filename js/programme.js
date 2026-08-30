// Memory Library — programme logic.
// Shared between the homepage (Now/Next) and the Programme page
// (What's On list + Timetable). Occurrences are the schedulable unit;
// Events carry the descriptive content; Ongoing events (exhibitions,
// installations) are not exploded into repeated occurrences.
import { resolveRefs } from "./data.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export function pad(n) { return String(n).padStart(2, "0"); }

export function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function festivalDates(data) {
  const umbrella = data.byId.strand["memory-library"];
  const dates = [];
  let d = new Date(`${umbrella.dateStart}T00:00:00`);
  const end = new Date(`${umbrella.dateEnd}T00:00:00`);
  while (d <= end) {
    dates.push(toDateStr(d));
    d = new Date(d.getTime() + DAY_MS);
  }
  return dates;
}

export function dateLabel(dateStr, opts = {}) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
  const date = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  if (opts.short) return `${day} ${date}`;
  return `${day} ${date} ${month}`;
}

export function timeRange(occ) {
  if (occ.doorsTime) return `DOORS ${occ.startTime === occ.doorsTime ? "" : occ.doorsTime + " · "}${occ.startTime}–${occ.endTime}`;
  return `${occ.startTime}–${occ.endTime}`;
}

// Merge occurrences with their parent event + resolved refs. An occurrence
// or event carrying a hand-typed id that doesn't resolve (wrong table,
// typo, since-deleted record) is dropped rather than crashing every page
// that calls this — see resolveRefs in data.js for the same philosophy
// applied to list fields.
export function expandOccurrences(data) {
  return data.occurrences.map((occ) => {
    const event = data.byId.event[occ.eventId];
    if (!event) { console.warn(`[programme] occurrence "${occ.id}" references missing event id "${occ.eventId}" — skipping.`); return null; }
    const location = data.byId.location[occ.locationId];
    if (!location) { console.warn(`[programme] occurrence "${occ.id}" references missing location id "${occ.locationId}" — skipping.`); return null; }
    const strand = data.byId.strand[event.strandId];
    if (!strand) { console.warn(`[programme] event "${event.id}" references missing strand id "${event.strandId}" — skipping its occurrence "${occ.id}".`); return null; }
    const artists = resolveRefs(event.artistIds, data.byId.artist, "artist");
    const projects = resolveRefs(event.projectIds, data.byId.project, "project");
    return {
      occ, event, location, strand, artists, projects,
      start: new Date(`${occ.date}T${occ.startTime}:00`),
      end: new Date(`${occ.date}T${occ.endTime}:00`),
      doors: occ.doorsTime ? new Date(`${occ.date}T${occ.doorsTime}:00`) : null,
      status: occ.bookingStatusOverride || event.bookingStatus,
    };
  }).filter(Boolean).sort((a, b) => a.start - b.start);
}

export function ongoingForDate(data, dateStr) {
  return data.events
    .filter((e) => e.mode === "ongoing" && dateStr >= e.dateStart && dateStr <= e.dateEnd)
    .map((event) => {
      const strand = data.byId.strand[event.strandId];
      if (!strand) { console.warn(`[programme] event "${event.id}" references missing strand id "${event.strandId}" — skipping.`); return null; }
      return {
        event,
        strand,
        locations: resolveRefs(event.locationIds, data.byId.location, "location"),
        projects: resolveRefs(event.projectIds, data.byId.project, "project"),
      };
    })
    .filter(Boolean);
}

export function occurrencesForDate(expanded, dateStr) {
  return expanded.filter((x) => x.occ.date === dateStr);
}

export function groupByDate(expanded) {
  const map = new Map();
  for (const item of expanded) {
    if (!map.has(item.occ.date)) map.set(item.occ.date, []);
    map.get(item.occ.date).push(item);
  }
  for (const arr of map.values()) arr.sort((a, b) => a.start - b.start);
  return map;
}

// Determine festival phase + Now/Next for a given instant.
export function computeNowNext(data, now) {
  const expanded = expandOccurrences(data);
  const dates = festivalDates(data);
  const first = new Date(`${dates[0]}T00:00:00`);
  const last = new Date(`${dates[dates.length - 1]}T23:59:59`);

  if (now < first) {
    const next = expanded.find((x) => x.start >= now) || expanded[0];
    return { phase: "before", now: null, next };
  }
  if (now > last) {
    return { phase: "after", now: null, next: null };
  }

  // A broad container occurrence (e.g. the Past Makes Future conference
  // block) can overlap a more specific one nested inside it (e.g. a single
  // presentation within that afternoon). Sort so the most recently-started
  // — i.e. most specific — occurrence is what Now/Next actually surfaces.
  const happening = expanded
    .filter((x) => x.start <= now && now < x.end)
    .sort((a, b) => b.start - a.start);
  const dateStr = toDateStr(now);
  const ongoingToday = ongoingForDate(data, dateStr);
  const next = expanded.find((x) => x.start > now) || null;

  return { phase: "during", now: happening, ongoing: ongoingToday, next };
}

export const EVENT_TYPES = [
  "Exhibition", "Talk", "Workshop", "Screening",
  "Performance", "Participatory", "Social", "Special Event",
];
