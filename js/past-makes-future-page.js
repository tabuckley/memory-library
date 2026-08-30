import { loadData, resolveIfAllIds } from "./data.js";

// The "who" column is normally free text (a name, "TB hosts", "Judges: CP,
// Mistly & TBC"). It can also carry real artist ids instead — if every
// token in the cell resolves to a confirmed artist, show them as linked
// names; otherwise the cell is shown exactly as typed, so nothing breaks
// for the many rows that are legitimately just plain text.
function whoDisplay(who, data) {
  const artists = resolveIfAllIds(who, data.byId.artist);
  if (!artists) return who || "";
  return artists.map((a) => `<a class="link-underline" href="artist.html?slug=${a.id}">${a.name}</a>`).join(" &amp; ");
}

function agendaRow(s, data) {
  const isBreak = /break/i.test(s.title);
  return `
    <div class="agenda-row${isBreak ? " agenda-row--break" : ""}">
      <span class="agenda-row__time">${s.time}</span>
      <span>
        <span class="agenda-row__title" style="display:block;">${s.title}</span>
        ${s.purpose ? `<span class="agenda-row__purpose" style="display:block;">${s.purpose}</span>` : ""}
      </span>
      <span class="agenda-row__who">${whoDisplay(s.who, data)}</span>
    </div>`;
}

async function main() {
  const data = await loadData();
  const conferenceSessions = data.pmfSessions.filter((s) => s.section === "conference");
  const pageantSessions = data.pmfSessions.filter((s) => s.section === "pageant");

  const strand = data.byId.strand["past-makes-future"];
  const confEvent = data.byId.event["ev-past-makes-future"];
  const pageantEvent = data.byId.event["ev-pageant"];
  const host = document.getElementById("pmf-content");

  host.innerHTML = `
    <section class="section-pad-sm">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-4);"><a class="link-underline" href="programme.html">Programme</a> · Special Event</p>
        <div class="grid" style="align-items:start;">
          <h1 style="grid-column: 1 / span 8; margin: 0 0 var(--space-6);">
            <img src="assets/logo/pmf-logo-black.png" alt="${strand.name}" style="width: 100%; max-width: 300px; height: auto; display:block;" />
          </h1>
          <div style="grid-column: 10 / span 3;" class="t-meta">
            <p style="opacity:.55; margin-bottom: var(--space-1);">Date</p>
            <p style="margin-bottom: var(--space-4);">Sat 14 Nov 2026</p>
            <p style="opacity:.55; margin-bottom: var(--space-1);">Location</p>
            <p>Main Space</p>
          </div>
        </div>
        <p class="t-intro measure" style="margin-top: var(--space-4); opacity:.85;">${strand.description}</p>
      </div>
    </section>

    <section class="section-pad-sm">
      <div class="wrap">
        <div class="media-plate media-plate--hero" style="--plate-ratio: 21/9; view-transition-name: pmf-hero;">
          <img class="plate-photo" src="assets/img/past-makes-future.jpg" alt="Audience members listening intently at a past Play Office artist development conference." loading="lazy" />
        </div>
      </div>
    </section>

    <section class="section-pad-sm reveal">
      <div class="wrap">
        <div class="grid" style="align-items:baseline; margin-bottom: var(--space-6);">
          <p class="t-title" style="grid-column: 1 / span 6;">Conference</p>
          <p class="t-meta" style="grid-column: 8 / span 5; opacity:.6; justify-self:end;">${confEvent.bookingStatus} · 13:00–18:00${confEvent.bookingUrl ? ` · <a class="link-underline" href="${confEvent.bookingUrl}" target="_blank" rel="noopener">Book →</a>` : ""}</p>
        </div>
        <div>${conferenceSessions.map((s) => agendaRow(s, data)).join("")}</div>
      </div>
    </section>

    <section class="section-pad tone-black reveal" id="pageant">
      <div class="wrap">
        <div class="grid" style="align-items:baseline; margin-bottom: var(--space-6);">
          <p class="t-title" style="grid-column: 1 / span 6;"><img src="assets/logo/pmf-star-white.png" alt="" style="display:inline-block; height:0.75em; width:auto; margin-right:0.3em; vertical-align:baseline;" />Pageant</p>
          <p class="t-meta" style="grid-column: 8 / span 5; opacity:.6; justify-self:end;">${pageantEvent.bookingStatus}${pageantEvent.ageGuidance ? " · " + pageantEvent.ageGuidance : ""} · Doors 19:30${pageantEvent.bookingUrl ? ` · <a class="link-underline" href="${pageantEvent.bookingUrl}" target="_blank" rel="noopener">Book →</a>` : ""}</p>
        </div>
        <div>${pageantSessions.map((s) => agendaRow(s, data)).join("")}</div>
      </div>
    </section>

    <section class="section-pad-sm">
      <div class="wrap">
        <a class="btn-line" href="programme.html?date=2026-11-14">← Back to Programme</a>
      </div>
    </section>`;

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
