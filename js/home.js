import { loadData, getNow } from "./data.js";
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

// The Conference has its own dedicated page rather than a generic
// event.html entry — same routing programme-page.js uses for this id.
// Pageant gets a real event.html page like everything else, linked to the
// Conference (and vice versa) via the "also in this strand" mechanism.
function eventHref(event) {
  if (!event) return null;
  if (event.id === "ev-past-makes-future") return "past-makes-future.html";
  return `event.html?slug=${event.id}`;
}

function renderLive(data, now) {
  const host = document.getElementById("live-programme");
  const result = computeNowNext(data, now);
  let cellA, cellB;

  if (result.phase === "before") {
    cellA = { label: "Open", title: festivalRunLabel(data), body: "Boathouse 5, Portsmouth Historic Dockyard.", href: "programme.html" };
    cellB = result.next
      ? { label: "What's next", title: result.next.event.title, body: occTeaser(result.next), href: eventHref(result.next.event) }
      : { label: "Programme", title: "Coming soon", body: "" };
  } else if (result.phase === "during") {
    const nowItem = (result.now && result.now[0]) || (result.ongoing && result.ongoing[0] && { event: result.ongoing[0].event, isOngoing: true });
    cellA = nowItem
      ? { label: "Happening now", title: nowItem.event.title, body: nowItem.isOngoing ? "Open now · see Programme for full listing" : occTeaser(nowItem), href: eventHref(nowItem.event) }
      : { label: "Happening now", title: "Between events", body: "See what's next.", href: "programme.html" };
    cellB = result.next
      ? { label: "Next", title: result.next.event.title, body: occTeaser(result.next), href: eventHref(result.next.event) }
      : { label: "Next", title: "That's the day", body: "" };
  } else {
    cellA = { label: "Memory Library", title: "This edition has closed", body: "Thank you to everyone who took part." };
    cellB = { label: "Archive", title: "The programme lives on", body: "Browse what was made, said and collected." };
  }

  const cell = (c) => {
    const tag = c.href ? "a" : "div";
    const hrefAttr = c.href ? ` href="${c.href}"` : "";
    return `
      <${tag} class="now-next__cell"${hrefAttr}>
        <p class="now-next__label">${c.label}</p>
        <p class="now-next__title">${c.title}</p>
        <p class="t-small" style="opacity:.75;">${c.body}</p>
      </${tag}>`;
  };

  host.innerHTML = `<div class="now-next">${cell(cellA)}${cell(cellB)}</div>`;
}

(async function initHome() {
  const data = await loadData();
  const now = getNow();
  renderLive(data, now);
  document.dispatchEvent(new CustomEvent("content:rendered"));
})();
