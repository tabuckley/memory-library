import { loadData, plateImg } from "./data.js";
import { expandOccurrences, dateLabel, timeRange, dateTextForOngoing, dateTextForGroup, mostCommonOcc } from "./programme.js";

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
  }).join("");

  document.getElementById("programme-dated").innerHTML = datedGroups.map((group) => {
    const event = group[0].event;
    const strand = group[0].strand;
    const location = [...new Set(group.map((x) => x.location.shortName))].join(" / ");
    const status = mostCommonOcc(group).status;
    return card(event, strand, dateTextForGroup(group), location, status);
  }).join("");

  document.getElementById("opening-hours-list").innerHTML = data.openingHours.map((h) => `
    <div class="opening-hours-row">
      <span class="t-meta">${dateLabel(h.date, { short: true })}</span>
      <span class="t-meta" style="opacity:.6;">${h.open}–${h.close}${h.note ? ` · ${h.note}` : ""}</span>
    </div>`).join("");

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
