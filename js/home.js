import { loadData, getNow, plateImg, vtName } from "./data.js";
import { computeNowNext, dateLabel, timeRange, festivalDates } from "./programme.js";

function occTeaser(x) {
  const place = x.location ? x.location.name : "";
  return `${dateLabel(x.occ.date)} · ${x.occ.startTime} · ${place}`;
}

function ordinal(n) {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

// "13th–21st November 2026" — derived from the actual festival dates
// rather than hardcoded, so this can't drift out of sync if they change.
function festivalRunLabel(data) {
  const dates = festivalDates(data);
  const start = new Date(`${dates[0]}T00:00:00`);
  const end = new Date(`${dates[dates.length - 1]}T00:00:00`);
  const month = end.toLocaleDateString("en-GB", { month: "long" });
  return `${ordinal(start.getDate())}–${ordinal(end.getDate())} ${month} ${end.getFullYear()}`;
}

function renderLive(data, now) {
  const host = document.getElementById("live-programme");
  const result = computeNowNext(data, now);
  let cellA, cellB;

  if (result.phase === "before") {
    cellA = { label: "Open", title: festivalRunLabel(data), body: "Boathouse 5, Portsmouth Historic Dockyard." };
    cellB = result.next
      ? { label: "What's next", title: result.next.event.title, body: occTeaser(result.next) }
      : { label: "Programme", title: "Coming soon", body: "" };
  } else if (result.phase === "during") {
    const nowItem = (result.now && result.now[0]) || (result.ongoing && result.ongoing[0] && { event: result.ongoing[0].event, isOngoing: true });
    cellA = nowItem
      ? { label: "Happening now", title: nowItem.event.title, body: nowItem.isOngoing ? "Open now · see Programme for full listing" : occTeaser(nowItem) }
      : { label: "Happening now", title: "Between events", body: "See what's next." };
    cellB = result.next
      ? { label: "Next", title: result.next.event.title, body: occTeaser(result.next) }
      : { label: "Next", title: "That's the day", body: "" };
  } else {
    cellA = { label: "Memory Library", title: "This edition has closed", body: "Thank you to everyone who took part." };
    cellB = { label: "Archive", title: "The programme lives on", body: "Browse what was made, said and collected." };
  }

  host.innerHTML = `
    <div class="now-next">
      <div class="now-next__cell">
        <p class="now-next__label">${cellA.label}</p>
        <p class="now-next__title">${cellA.title}</p>
        <p class="t-small" style="opacity:.75;">${cellA.body}</p>
      </div>
      <div class="now-next__cell">
        <p class="now-next__label">${cellB.label}</p>
        <p class="now-next__title">${cellB.title}</p>
        <p class="t-small" style="opacity:.75;">${cellB.body}</p>
      </div>
    </div>`;
}

function renderSelectedWork(data) {
  const host = document.getElementById("selected-work");
  const feature = data.byId.event["ev-queer-at-sea"];
  if (!feature) { host.innerHTML = ""; return; }

  const artistName = (e) => (e.artistIds || []).map((id) => data.byId.artist[id]?.name).filter(Boolean).join(", ");
  const placeName = (e) => (e.placeId && data.byId.place[e.placeId]?.name) || "";

  host.innerHTML = `
    <div class="wrap">
      <p class="t-meta reveal" style="opacity:.55; margin-bottom: var(--space-8);">Selected work</p>
      <a href="event.html?slug=${feature.id}" class="grid reveal" style="align-items:center; text-decoration:none;">
        <div style="grid-column: 1 / span 7;">
          <div class="media-plate" style="--plate-ratio: 16/10; view-transition-name: ${vtName("event", feature.id)};">
            ${plateImg(feature.id, "landscape", feature.imageUrl)}
            ${feature.mediaCaption ? `<span class="plate-caption">${feature.mediaCaption}</span>` : ""}
          </div>
        </div>
        <div style="grid-column: 9 / span 4;">
          <p class="t-meta" style="opacity:.6; margin-bottom: var(--space-2);">${feature.type}${placeName(feature) ? " · " + placeName(feature) : ""}</p>
          <p class="t-title" style="margin-bottom: var(--space-3);">${feature.title}</p>
          <p class="t-body" style="opacity:.8;">${feature.summary}</p>
          ${artistName(feature) ? `<p class="t-meta" style="margin-top: var(--space-4); opacity:.6;">${artistName(feature)}</p>` : ""}
        </div>
      </a>
    </div>`;
}

(async function initHome() {
  const data = await loadData();
  const now = getNow();
  renderLive(data, now);
  renderSelectedWork(data);
  document.dispatchEvent(new CustomEvent("content:rendered"));
})();
