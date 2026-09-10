import { loadData, plateImg } from "./data.js";
import { expandOccurrences, dateLabel, timeRange, toDateStr } from "./programme.js";

// Past Makes Future's individual conference talks have their own running
// order on the Past Makes Future page rather than becoming separate
// programme cards — only the conference itself (and Pageant, its linked
// but separate evening event) appear here.
const CONFERENCE_SUB_EVENT_IDS = new Set([
  "ev-bangladesh-presentation", "ev-cairo-presentation", "ev-engine-creativity",
]);

// Past Makes Future carries its own small mark inline; Pageant is linked
// to it (via "Also in Past Makes Future") but doesn't repeat the mark.
const PMF_MARK_EVENT_IDS = new Set(["ev-past-makes-future"]);
const pmfMark = () => `<img src="assets/logo/pmf-star-black.png" alt="" style="display:inline-block; height:0.9em; width:auto; margin-right:0.4em; vertical-align:baseline; transform:translateY(0.08em);" />`;
const resonateMark = () => `<img src="assets/logo/resonate-blob-black.png" alt="" style="display:inline-block; height:0.85em; width:auto; margin-right:0.4em; vertical-align:baseline; transform:translateY(0.08em);" />`;
const weShineMark = () => `<img src="assets/logo/partners/we-shine-star.png" alt="" style="display:inline-block; height:0.9em; width:auto; margin-right:0.4em; vertical-align:baseline; transform:translateY(0.08em);" />`;

function cardTitle(event) {
  if (event.id === "ev-exhibition") return `${resonateMark()}${event.title}`;
  if (event.id === "ev-we-shine-lates") return `${weShineMark()}${event.title}`;
  return `${PMF_MARK_EVENT_IDS.has(event.id) ? pmfMark() : ""}${event.title}`;
}

function statusClass(status) {
  if (status === "SOLD OUT" || status === "CANCELLED") return "status--closed";
  if (status === "18+" || status === "LIMITED CAPACITY") return "status--attention";
  return "";
}

function hrefFor(event) {
  if (event.id === "ev-past-makes-future") return "past-makes-future.html";
  return `event.html?slug=${event.id}`;
}

// A daily/near-daily strand (e.g. People Library) shouldn't read as a wall
// of near-identical occurrences — pick the time range most of its
// occurrences actually share, so the card gives an honest "usually this
// time" summary and leaves exact per-day times to the event's own page.
function mostCommonOcc(group) {
  const counts = new Map();
  for (const x of group) {
    const key = `${x.occ.startTime}-${x.occ.endTime}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let best = group[0], bestCount = 0;
  for (const x of group) {
    const key = `${x.occ.startTime}-${x.occ.endTime}`;
    const c = counts.get(key);
    if (c > bestCount) { bestCount = c; best = x; }
  }
  return best;
}

function dateTextForOngoing(event) {
  return `Daily · ${dateLabel(event.dateStart, { short: true })}–${dateLabel(event.dateEnd, { short: true })}`;
}

function dateTextForGroup(group) {
  const first = group[0];
  const last = group[group.length - 1];
  if (group.length === 1) return `${dateLabel(first.occ.date)} · ${timeRange(first.occ)}`;
  const sameTime = group.every((x) => x.occ.startTime === first.occ.startTime && x.occ.endTime === first.occ.endTime);
  if (group.length >= 5) return `Most days · ${timeRange(mostCommonOcc(group).occ)}`;
  // A "13–15 Nov" range reads as every day in between - only true it if the
  // dates are actually back to back (e.g. We Shine's Thu-Fri-Sat run).
  // A same-time event with gaps (e.g. a workshop repeated on two separate
  // dates) needs each date spelled out instead, or it implies days it
  // doesn't actually run on.
  const oneDayMs = 24 * 60 * 60 * 1000;
  const isContiguous = group.every((x, i) => i === 0 || x.occ.date === toDateStr(new Date(new Date(`${group[i - 1].occ.date}T00:00:00`).getTime() + oneDayMs)));
  if (sameTime && isContiguous) return `${dateLabel(first.occ.date, { short: true })}–${dateLabel(last.occ.date, { short: true })} · ${timeRange(first.occ)}`;
  if (sameTime) return `${group.map((x) => dateLabel(x.occ.date, { short: true })).join(", ")} · ${timeRange(first.occ)}`;
  return group.map((x) => dateLabel(x.occ.date, { short: true })).join(", ");
}

function card(event, strand, dateText, location, status) {
  return `
  <a class="programme-card" href="${hrefFor(event)}">
    <div class="media-plate" style="--plate-ratio: 4/3;">
      ${plateImg(event.id, "landscape", event.imageUrl)}
    </div>
    <div class="programme-card__body">
      <p class="t-meta programme-card__meta">${event.type}${strand ? ` · ${strand.name}` : ""}</p>
      <p class="t-intro programme-card__title">${cardTitle(event)}</p>
      <p class="t-body programme-card__blurb">${event.blurb}</p>
      <p class="t-meta programme-card__status">${dateText}${location ? ` · ${location}` : ""} · <span class="status ${statusClass(status)}">${status}</span></p>
    </div>
  </a>`;
}

// See the comment on .programme-grid in components.css - these pad an
// under-full last row so it doesn't gap or misalign with the rows above.
const GRID_FILLERS = `<div class="programme-grid__filler" aria-hidden="true"></div>`.repeat(6);

async function main() {
  const data = await loadData();
  const expanded = expandOccurrences(data);

  const ongoingEvents = data.events.filter((e) => e.mode === "ongoing");

  const groups = new Map();
  for (const x of expanded) {
    if (x.event.mode === "ongoing") continue;
    if (CONFERENCE_SUB_EVENT_IDS.has(x.event.id)) continue;
    if (!groups.has(x.event.id)) groups.set(x.event.id, []);
    groups.get(x.event.id).push(x);
  }
  const datedGroups = [...groups.values()]
    .map((g) => g.slice().sort((a, b) => a.start - b.start))
    .sort((a, b) => a[0].start - b[0].start);

  document.getElementById("programme-ongoing").innerHTML = ongoingEvents.map((event) => {
    const strand = data.byId.strand[event.strandId];
    return card(event, strand, dateTextForOngoing(event), null, event.bookingStatus);
  }).join("") + GRID_FILLERS;

  document.getElementById("programme-dated").innerHTML = datedGroups.map((group) => {
    const event = group[0].event;
    const strand = group[0].strand;
    const location = [...new Set(group.map((x) => x.location.shortName))].join(" / ");
    const status = mostCommonOcc(group).status;
    return card(event, strand, dateTextForGroup(group), location, status);
  }).join("") + GRID_FILLERS;

  document.getElementById("opening-hours-list").innerHTML = data.openingHours.map((h) => `
    <div class="opening-hours-row">
      <span class="t-meta">${dateLabel(h.date, { short: true })}</span>
      <span class="t-meta" style="opacity:.6;">${h.open}–${h.close}${h.note ? ` · ${h.note}` : ""}</span>
    </div>`).join("");

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
