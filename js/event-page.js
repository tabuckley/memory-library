import { loadData, plateImg, vtName, resolveRefs } from "./data.js";
import { expandOccurrences, dateLabel, timeRange, agendaRow } from "./programme.js";

// Ongoing events (exhibitions, installations) don't have discrete
// occurrence rows — they're just open whenever the venue is. Rather than
// a single vague sentence, build the same day-by-day list a timed event
// gets, deriving each row from the real published opening hours instead
// of occurrences — so an ongoing exhibition and a scheduled thing like
// People Library read the same way on their own pages.
function openDaysFor(event, data) {
  if (!event.dateStart || !event.dateEnd) return [];
  return data.openingHours.filter((h) => h.date >= event.dateStart && h.date <= event.dateEnd);
}

// A handful of events carry their own wordmark (matching the treatment
// Past Makes Future already gets on its dedicated page) rather than
// rendering the title as plain text.
const EVENT_LOGOS = {
  "ev-exhibition": "assets/logo/resonate-logo-black.png",
};

// A small inline mark before the title, same touch the Programme rows and
// the Past Makes Future page already give these two linked events.
const EVENT_TITLE_MARKS = {
  "ev-pageant": `<img src="assets/logo/pmf-star-black.png" alt="" style="display:inline-block; height:0.6em; width:auto; margin-right:0.25em; vertical-align:baseline;" />`,
};

// Pageant's own running order lives in pmf-sessions rather than as a
// property of the event row itself — this is the one place outside the
// Past Makes Future page itself that needs to know how to find it.
// Empty for now: Pageant's exact timings aren't settled, so its page
// shows no schedule at all (same treatment as an event like Queer at
// Sea) until there's a real running order to publish.
const PMF_SECTION_FOR_EVENT = {};

// Pageant and the Conference are a deliberate pair (same day, same strand)
// — rather than leaving it to chance which strand-mates the generic
// "also in this strand" pick turns up, make sure Pageant's page always
// links straight back to the Conference, and via its real URL rather than
// the generic event.html route it doesn't actually live at.
function relatedHref(e) {
  if (e.id === "ev-past-makes-future") return "past-makes-future.html";
  return `event.html?slug=${e.id}`;
}

async function main() {
  const data = await loadData();
  const params = new URLSearchParams(location.search);
  const event = data.byId.event[params.get("slug")] || data.events[0];
  const host = document.getElementById("event-content");
  document.title = `${event.title} - Memory Library`;

  const artists = resolveRefs(event.artistIds, data.byId.artist, "artist");
  const place = event.placeId ? data.byId.place[event.placeId] : null;
  const strand = data.byId.strand[event.strandId];
  const expanded = expandOccurrences(data).filter((x) => x.event.id === event.id);
  const openDays = expanded.length ? [] : openDaysFor(event, data);
  const pmfSection = PMF_SECTION_FOR_EVENT[event.id];
  const runningOrder = pmfSection ? data.pmfSessions.filter((s) => s.section === pmfSection) : [];
  const related = event.id === "ev-pageant" && data.byId.event["ev-past-makes-future"]
    ? [data.byId.event["ev-past-makes-future"]]
    : data.events.filter((e) => e.id !== event.id && e.strandId === event.strandId).slice(0, 2);

  host.innerHTML = `
    <section class="section-pad-sm">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-4);">${event.type}${strand ? ` · ${strand.name}` : ""}${place ? ` · ${place.name}` : ""}</p>
        <div class="grid" style="align-items:start;">
          <h1 class="t-display" style="grid-column: 1 / span 9; font-size: clamp(2.25rem, 1.5rem + 4.5vw, 6rem); margin-bottom: var(--space-6);">
            ${EVENT_LOGOS[event.id] ? `<img src="${EVENT_LOGOS[event.id]}" alt="${event.title}" style="width: 100%; max-width: 320px; height: auto; display: block;" />` : `${EVENT_TITLE_MARKS[event.id] || ""}${event.title}`}
          </h1>
          <div style="grid-column: 10 / span 3;" class="t-meta">
            ${artists.length ? `
            <p style="opacity:.55; margin-bottom: var(--space-1);">Artist</p>
            <p style="margin-bottom: var(--space-4);">${artists.map((a) => `<a class="link-underline" href="artist.html?slug=${a.id}">${a.name}</a>`).join(", ")}</p>` : ""}
            ${event.year ? `<p style="opacity:.55; margin-bottom: var(--space-1);">Year</p><p style="margin-bottom: var(--space-4);">${event.year}</p>` : ""}
            <p style="opacity:.55; margin-bottom: var(--space-1);">Booking</p>
            <p>${event.bookingStatus}</p>
            ${event.bookingUrl ? `<a class="link-underline" href="${event.bookingUrl}" target="_blank" rel="noopener" style="display:inline-block; margin-top: var(--space-1);">Book &rarr;</a>` : ""}
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad-sm">
      <div class="wrap">
        <div class="media-plate media-plate--hero" style="--plate-ratio: 21/9; view-transition-name: ${vtName("event", event.id)};">
          ${plateImg(event.id, "landscape", event.imageUrl)}
        </div>
        ${event.mediaCaption ? `<p class="media-plate--hero-caption">${event.mediaCaption}</p>` : ""}
      </div>
    </section>

    <section class="section-pad-sm reveal">
      <div class="wrap grid">
        <p class="t-intro measure" style="grid-column: 1 / span 6;">${event.summary}</p>
        ${event.body ? `<p class="t-body measure" style="grid-column: 7 / span 6; opacity:.85;">${event.body}</p>` : ""}
      </div>
    </section>

    ${event.bookingUrl ? `
    <section class="section-pad-sm reveal">
      <div class="wrap">
        <a class="btn-primary" href="${event.bookingUrl}" target="_blank" rel="noopener">Book now &rarr;</a>
      </div>
    </section>` : ""}

    ${runningOrder.length ? `
    <section class="section-pad-sm reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">Running order</p>
        <div>${runningOrder.map((s) => agendaRow(s, data)).join("")}</div>
      </div>
    </section>` : ""}

    <section class="section-pad-sm tone-paper reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">On the programme</p>
        ${(expanded.length || openDays.length) ? `<div class="open-days-grid">
          ${expanded.map((x) => `
          <a href="programme.html?date=${x.occ.date}">
            <span class="open-day__date">${dateLabel(x.occ.date, { short: true })}</span>
            <span class="open-day__time">${timeRange(x.occ)}</span>
          </a>`).join("")}
          ${openDays.map((h) => `
          <a href="programme.html?date=${h.date}">
            <span class="open-day__date">${dateLabel(h.date, { short: true })}</span>
            <span class="open-day__time">${h.open}–${h.close}</span>
            ${h.note ? `<span class="open-day__note">${h.note}</span>` : ""}
          </a>`).join("")}
        </div>` : `<p class="t-small" style="opacity:.6;">Part of the continuous programme - see Programme for opening hours.</p>`}
      </div>
    </section>

    ${related.length && strand ? `
    <section class="section-pad-sm reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">Also in ${strand.name}</p>
        <div class="grid">
          ${related.map((e, i) => `
            <a href="${relatedHref(e)}" style="grid-column: ${i === 0 ? "1 / span 5" : "7 / span 5"};">
              <div class="media-plate" style="--plate-ratio: 4/3;">
                ${plateImg(e.id, "landscape", e.imageUrl)}
                ${e.mediaCaption ? `<span class="plate-caption">${e.mediaCaption}</span>` : ""}
              </div>
              <p class="t-intro" style="margin-top: var(--space-3);">${e.title}</p>
            </a>`).join("")}
        </div>
      </div>
    </section>` : ""}

    <section class="section-pad-sm">
      <div class="wrap">
        <a class="btn-line" href="programme.html">← Back to Programme</a>
      </div>
    </section>`;

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
