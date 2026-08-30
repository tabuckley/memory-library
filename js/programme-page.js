import { loadData, getNow, plateImg } from "./data.js";
import {
  expandOccurrences, ongoingForDate, occurrencesForDate, festivalDates,
  dateLabel, timeRange, computeNowNext, toDateStr, EVENT_TYPES,
} from "./programme.js";
import { attachSlider } from "./slider.js";

const TIMETABLE_LOCATIONS = ["main", "cinema", "exterior"];

// Past Makes Future's individual conference talks have their own running
// order on a dedicated page rather than exploding into separate rows here.
// Pageant is a linked but separate event on the same day, so it keeps its
// own row in the main Programme — only the talks within the conference
// itself are folded into the single "Past Makes Future" entry.
const CONFERENCE_SUB_EVENT_IDS = new Set([
  "ev-bangladesh-presentation", "ev-cairo-presentation", "ev-engine-creativity",
]);

// Past Makes Future and Pageant carry their own small mark inline, so the
// pair reads as one linked identity in an otherwise plain-text list.
const PMF_MARK_EVENT_IDS = new Set(["ev-past-makes-future", "ev-pageant"]);
const pmfMark = () => `<img src="assets/logo/pmf-star-black.png" alt="" style="display:inline-block; height:0.9em; width:auto; margin-right:0.4em; vertical-align:baseline; transform:translateY(0.08em);" />`;

const resonateMark = () => `<img src="assets/logo/resonate-blob-black.png" alt="" style="display:inline-block; height:0.85em; width:auto; margin-right:0.4em; vertical-align:baseline; transform:translateY(0.08em);" />`;

const weShineMark = () => `<img src="assets/logo/partners/we-shine-star.png" alt="" style="display:inline-block; height:0.9em; width:auto; margin-right:0.4em; vertical-align:baseline; transform:translateY(0.08em);" />`;

function rowTitle(event) {
  if (event.id === "ev-exhibition") return `${resonateMark()}${event.title}`;
  if (event.id === "ev-we-shine-lates") return `${weShineMark()}${event.title}`;
  return `${PMF_MARK_EVENT_IDS.has(event.id) ? pmfMark() : ""}${event.title}`;
}

function statusClass(status) {
  if (status === "SOLD OUT" || status === "CANCELLED") return "status--closed";
  if (status === "18+" || status === "LIMITED CAPACITY") return "status--attention";
  return "";
}

// Brief transition when content is about to change, so filtered/re-dated
// lists cross-fade rather than snapping — cheap enough not to need a
// FLIP-style position animation for a first pass.
function withFade(el, render) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { render(); return; }
  el.classList.add("is-updating");
  window.setTimeout(() => {
    render();
    requestAnimationFrame(() => el.classList.remove("is-updating"));
  }, 90);
}

async function main() {
  const data = await loadData();
  const dates = festivalDates(data);
  const expanded = expandOccurrences(data);
  const now = getNow();

  const params = new URLSearchParams(location.search);
  const today = toDateStr(now);
  const defaultDate = dates.includes(today) ? today : (now < new Date(`${dates[0]}T00:00:00`) ? dates[0] : dates[dates.length - 1]);

  const state = {
    date: dates.includes(params.get("date")) ? params.get("date") : defaultDate,
    view: params.get("view") === "timetable" ? "timetable" : "list",
    types: new Set(),
    strands: new Set(),
  };

  let updateDateSlider = () => {};
  let updateViewSlider = () => {};

  renderLiveStrip(data, now);
  renderDateNav();
  renderFilters();
  applyView();
  renderAll();
  wireExpansion();

  function syncUrl() {
    const p = new URLSearchParams();
    p.set("date", state.date);
    if (state.view === "timetable") p.set("view", "timetable");
    history.replaceState(null, "", `${location.pathname}?${p.toString()}`);
  }

  function renderDateNav() {
    const host = document.getElementById("date-nav-inner");
    host.innerHTML = dates.map((d) => {
      const [day, num] = dateLabel(d, { short: true }).split(" ");
      return `<button type="button" data-date="${d}" aria-pressed="${d === state.date}">${day}<span class="d-day">${num}</span></button>`;
    }).join("");
    host.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.getAttribute("aria-pressed") === "true") return;
        state.date = btn.dataset.date;
        host.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        updateDateSlider();
        syncUrl();
        renderAll();
      });
    });
    updateDateSlider = attachSlider(host);
  }

  function renderFilters() {
    const typeHost = document.getElementById("filter-type");
    typeHost.innerHTML = EVENT_TYPES.map((t) => `<button type="button" class="filter-chip" data-type="${t}" aria-pressed="false">${t}</button>`).join("");
    typeHost.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.type;
        if (state.types.has(t)) { state.types.delete(t); btn.setAttribute("aria-pressed", "false"); }
        else { state.types.add(t); btn.setAttribute("aria-pressed", "true"); }
        renderAll();
      });
    });

    const strandHost = document.getElementById("filter-strand");
    const strands = data.strands.filter((s) => s.kind !== "umbrella");
    strandHost.innerHTML = strands.map((s) => `<button type="button" class="filter-chip" data-strand="${s.id}" aria-pressed="false">${s.name}</button>`).join("");
    strandHost.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = btn.dataset.strand;
        if (state.strands.has(s)) { state.strands.delete(s); btn.setAttribute("aria-pressed", "false"); }
        else { state.strands.add(s); btn.setAttribute("aria-pressed", "true"); }
        renderAll();
      });
    });

    const viewToggle = document.getElementById("view-toggle");
    viewToggle.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.getAttribute("aria-pressed") === "true") return;
        state.view = btn.dataset.view;
        viewToggle.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        updateViewSlider();
        syncUrl();
        applyView();
      });
    });
    document.querySelector(`#view-toggle button[data-view="${state.view}"]`)?.setAttribute("aria-pressed", "true");
    if (state.view === "timetable") document.querySelector('#view-toggle button[data-view="list"]').setAttribute("aria-pressed", "false");
    updateViewSlider = attachSlider(viewToggle);
  }

  function applyView() {
    document.getElementById("view-list").hidden = state.view !== "list";
    document.getElementById("view-timetable").hidden = state.view !== "timetable";
  }

  function passesFilter(item) {
    const typeOk = state.types.size === 0 || state.types.has(item.event.type);
    const strandOk = state.strands.size === 0 || state.strands.has(item.strand.id);
    return typeOk && strandOk;
  }

  function renderAll() {
    renderOpeningHours();
    withFade(document.getElementById("view-list"), renderList);
    withFade(document.getElementById("view-timetable"), renderTimetable);
  }

  function renderOpeningHours() {
    const oh = data.openingHours.find((h) => h.date === state.date);
    const host = document.getElementById("opening-hours-note");
    if (!oh) { host.textContent = ""; return; }
    host.textContent = `Open ${oh.open}–${oh.close}${oh.note ? " · " + oh.note : ""}`;
  }

  function detailHref(x) {
    if (x.event.id === "ev-past-makes-future") return "past-makes-future.html";
    if (x.event.id === "ev-pageant") return "past-makes-future.html#pageant";
    if (x.projects[0]) return `project.html?slug=${x.projects[0].id}`;
    if (x.artists[0]) return `artist.html?slug=${x.artists[0].id}`;
    return null;
  }

  function renderList() {
    const host = document.getElementById("view-list");
    const ongoing = ongoingForDate(data, state.date).filter((o) => passesFilter({ event: o.event, strand: o.strand }));
    const timed = occurrencesForDate(expanded, state.date).filter(passesFilter).filter((x) => !CONFERENCE_SUB_EVENT_IDS.has(x.event.id));

    if (ongoing.length === 0 && timed.length === 0) {
      host.innerHTML = `<p class="t-body" style="opacity:.6; padding-block: var(--space-8);">Nothing matches this filter on ${dateLabel(state.date)}.</p>`;
      return;
    }

    const ongoingHtml = ongoing.map((o, i) => {
      const id = `ongoing-${i}`;
      const href = o.projects?.[0] ? `project.html?slug=${o.projects[0].id}` : null;
      const body = `
          <span class="prog-row__time t-meta">All day</span>
          <span class="prog-row__body">
            <span class="prog-row__title">${rowTitle(o.event)}</span>
            <span class="prog-row__desc">${o.event.blurb}</span>
            <span class="prog-row__sub">${o.event.type} · ${o.locations.map((l) => l.shortName).join(" · ")}</span>
          </span>
          <span class="prog-row__status"><span class="status">${o.event.bookingStatus}</span></span>`;
      if (!href && !o.event.bookingUrl && !o.event.imageUrl) {
        return `<div class="prog-row prog-row--ongoing"><div class="prog-row__trigger" style="cursor:default;">${body}</div></div>`;
      }
      return `
      <div class="prog-row prog-row--ongoing">
        <button class="prog-row__trigger" type="button" aria-expanded="false" aria-controls="detail-${id}">
          ${body}
          <span class="prog-row__chevron" aria-hidden="true">⌄</span>
        </button>
        <div class="prog-row__detail" id="detail-${id}">
          <div class="prog-row__detail-inner">
            <div class="prog-row__detail-content">
              ${o.event.imageUrl ? `<div class="media-plate" style="--plate-ratio: 16/10; max-width: 320px; margin-bottom: var(--space-3);">${plateImg(o.event.id, "landscape", o.event.imageUrl)}</div>` : ""}
              ${href ? `<p style="margin-top: 0;"><a class="btn-line" href="${href}">More detail →</a></p>` : ""}
              ${o.event.bookingUrl ? `<p style="margin-top: ${href ? "var(--space-3)" : "0"};"><a class="btn-line" href="${o.event.bookingUrl}" target="_blank" rel="noopener">Book →</a></p>` : ""}
            </div>
          </div>
        </div>
      </div>`;
    }).join("");

    const timedHtml = timed.map((x, i) => {
      const id = `timed-${i}`;
      const href = detailHref(x);
      const isPast = x.end < now;
      return `
      <div class="prog-row${isPast ? " prog-row--past" : ""}">
        <button class="prog-row__trigger" type="button" aria-expanded="false" aria-controls="detail-${id}">
          <span class="prog-row__time t-meta">${x.occ.startTime}</span>
          <span class="prog-row__body">
            <span class="prog-row__title">${rowTitle(x.event)}</span>
            <span class="prog-row__desc">${x.event.blurb}</span>
            <span class="prog-row__sub">${x.event.type} · ${timeRange(x.occ)} · ${x.location.shortName}${x.event.ageGuidance ? " · " + x.event.ageGuidance : ""}</span>
          </span>
          <span class="prog-row__status"><span class="status ${statusClass(x.status)}">${x.status}</span></span>
          <span class="prog-row__chevron" aria-hidden="true">⌄</span>
        </button>
        <div class="prog-row__detail" id="detail-${id}">
          <div class="prog-row__detail-inner">
            <div class="prog-row__detail-content">
              ${x.event.imageUrl ? `<div class="media-plate" style="--plate-ratio: 16/10; max-width: 320px; margin-bottom: var(--space-3);">${plateImg(x.event.id, "landscape", x.event.imageUrl)}</div>` : ""}
              ${x.occ.note ? `<p class="t-meta" style="opacity:.6;">${x.occ.note}</p>` : ""}
              ${x.artists.length ? `<p class="t-meta" style="opacity:.6; margin-top: var(--space-3);">${x.artists.map((a) => a.name).join(", ")}</p>` : ""}
              ${href ? `<p style="margin-top: var(--space-3);"><a class="btn-line" href="${href}">More detail →</a></p>` : ""}
              ${x.event.bookingUrl ? `<p style="margin-top: var(--space-3);"><a class="btn-line" href="${x.event.bookingUrl}" target="_blank" rel="noopener">Book →</a></p>` : ""}
            </div>
          </div>
        </div>
      </div>`;
    }).join("");

    host.innerHTML = ongoingHtml + timedHtml;
  }

  function wireExpansion() {
    // Event delegation: rows are re-rendered wholesale on every filter or
    // date change, so a single listener on the container avoids re-binding.
    document.getElementById("view-list").addEventListener("click", (e) => {
      const trigger = e.target.closest(".prog-row__trigger");
      if (!trigger) return;
      const row = trigger.closest(".prog-row");
      const open = row.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
    });
  }

  function renderTimetable() {
    const host = document.getElementById("view-timetable");
    const ongoing = ongoingForDate(data, state.date).filter((o) => passesFilter({ event: o.event, strand: o.strand }));
    const timed = occurrencesForDate(expanded, state.date).filter(passesFilter).filter((x) => !CONFERENCE_SUB_EVENT_IDS.has(x.event.id));

    const times = [...new Set(timed.map((x) => x.occ.startTime))].sort();
    const cols = TIMETABLE_LOCATIONS.map((id) => data.byId.location[id]);

    if (ongoing.length === 0 && times.length === 0) {
      host.innerHTML = `<p class="t-body" style="opacity:.6; padding-block: var(--space-8);">Nothing matches this filter on ${dateLabel(state.date)}.</p>`;
      return;
    }

    let rows = "";

    if (ongoing.length) {
      rows += `<div class="timetable__time">All day</div>`;
      rows += cols.map((c) => {
        const here = ongoing.filter((o) => o.locations.some((l) => l.id === c.id));
        return `<div class="timetable__cell">${here.map((o) => `
          <div class="timetable__block" data-strand="${o.strand.id}">
            <span class="timetable__block-title">${o.event.title}</span>
            <span class="t-meta">${o.event.bookingStatus}</span>
          </div>`).join("")}</div>`;
      }).join("");
    }

    for (const t of times) {
      rows += `<div class="timetable__time">${t}</div>`;
      rows += cols.map((c) => {
        const here = timed.filter((x) => x.occ.startTime === t && x.location.id === c.id);
        return `<div class="timetable__cell">${here.map((x) => `
          <div class="timetable__block" data-strand="${x.strand.id}">
            <span class="timetable__block-title">${x.event.title}</span>
            <span class="t-meta">${timeRange(x.occ)}</span>
          </div>`).join("")}</div>`;
      }).join("");
    }

    host.innerHTML = `
      <div class="timetable-scroll">
        <div class="timetable" style="grid-template-columns: 6rem repeat(${cols.length}, 1fr);">
          <div class="timetable__head">Time</div>
          ${cols.map((c) => `<div class="timetable__head">${c.name}</div>`).join("")}
          ${rows}
        </div>
      </div>`;

    // Hovering/focusing a block quietly highlights every other block from
    // the same strand currently on screen — a restrained way to surface
    // "these belong together" without colouring the whole timetable.
    const blocks = host.querySelectorAll(".timetable__block");
    blocks.forEach((b) => {
      const on = () => blocks.forEach((o) => { if (o.dataset.strand === b.dataset.strand) o.classList.add("is-linked"); });
      const off = () => blocks.forEach((o) => o.classList.remove("is-linked"));
      b.addEventListener("mouseenter", on);
      b.addEventListener("mouseleave", off);
      b.addEventListener("focus", on);
      b.addEventListener("blur", off);
    });
  }

  function renderLiveStrip(data, now) {
    const host = document.getElementById("live-strip");
    const result = computeNowNext(data, now);
    if (result.phase !== "during") { host.innerHTML = ""; return; }
    const nowItem = (result.now && result.now[0]) || null;
    const nextItem = result.next;
    host.innerHTML = `
      <div class="now-next">
        <div class="now-next__cell">
          <p class="now-next__label">Happening now</p>
          <p class="now-next__title">${nowItem ? nowItem.event.title : "Between events"}</p>
        </div>
        <div class="now-next__cell">
          <p class="now-next__label">Next</p>
          <p class="now-next__title">${nextItem ? nextItem.event.title : "—"}</p>
        </div>
      </div>`;
  }

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
