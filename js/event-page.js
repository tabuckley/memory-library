import { loadData, plateImg, vtName, resolveRefs } from "./data.js";
import { expandOccurrences, dateLabel } from "./programme.js";

function ongoingRunNote(event) {
  if (!event.dateStart || !event.dateEnd) return "Part of the continuous programme — see Programme for opening hours.";
  return `Showing daily, ${dateLabel(event.dateStart)} – ${dateLabel(event.dateEnd)} — see Programme for opening hours.`;
}

async function main() {
  const data = await loadData();
  const params = new URLSearchParams(location.search);
  const event = data.byId.event[params.get("slug")] || data.events[0];
  const host = document.getElementById("event-content");
  document.title = `${event.title} — Memory Library`;

  const artists = resolveRefs(event.artistIds, data.byId.artist, "artist");
  const place = event.placeId ? data.byId.place[event.placeId] : null;
  const strand = data.byId.strand[event.strandId];
  const expanded = expandOccurrences(data).filter((x) => x.event.id === event.id);
  const related = data.events.filter((e) => e.id !== event.id && e.strandId === event.strandId).slice(0, 2);

  host.innerHTML = `
    <section class="section-pad-sm">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-4);">${event.type}${strand ? ` · ${strand.name}` : ""}${place ? ` · ${place.name}` : ""}</p>
        <div class="grid" style="align-items:start;">
          <h1 class="t-display" style="grid-column: 1 / span 9; font-size: clamp(2.25rem, 1.5rem + 4.5vw, 6rem); margin-bottom: var(--space-6);">${event.title}</h1>
          <div style="grid-column: 10 / span 3;" class="t-meta">
            ${artists.length ? `
            <p style="opacity:.55; margin-bottom: var(--space-1);">Artist</p>
            <p style="margin-bottom: var(--space-4);">${artists.map((a) => `<a class="link-underline" href="artist.html?slug=${a.id}">${a.name}</a>`).join(", ")}</p>` : ""}
            ${event.year ? `<p style="opacity:.55; margin-bottom: var(--space-1);">Year</p><p>${event.year}</p>` : ""}
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

    <section class="section-pad-sm tone-paper reveal">
      <div class="wrap grid">
        <div style="grid-column: 1 / span 6;">
          <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-4);">On the programme</p>
          ${expanded.length ? `<div class="related-list">${expanded.map((x) => `
            <a class="related-item" href="programme.html?date=${x.occ.date}">
              <span>${x.event.title}</span>
              <span class="t-meta" style="opacity:.6;">${dateLabel(x.occ.date)} · ${x.occ.startTime}</span>
            </a>`).join("")}</div>` : `<p class="t-small" style="opacity:.6;">${ongoingRunNote(event)}</p>`}
        </div>
      </div>
    </section>

    ${related.length && strand ? `
    <section class="section-pad-sm reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">Also in ${strand.name}</p>
        <div class="grid">
          ${related.map((e, i) => `
            <a href="event.html?slug=${e.id}" style="grid-column: ${i === 0 ? "1 / span 5" : "7 / span 5"};">
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
