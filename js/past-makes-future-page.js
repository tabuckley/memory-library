import { loadData, plateImg } from "./data.js";

function agendaRow(s) {
  const isBreak = /break/i.test(s.title);
  return `
    <div class="agenda-row${isBreak ? " agenda-row--break" : ""}">
      <span class="agenda-row__time">${s.time}</span>
      <span>
        <span class="agenda-row__title" style="display:block;">${s.title}</span>
        ${s.purpose ? `<span class="agenda-row__purpose" style="display:block;">${s.purpose}</span>` : ""}
      </span>
      <span class="agenda-row__who">${s.who || ""}</span>
    </div>`;
}

async function main() {
  const [data, pmf] = await Promise.all([
    loadData(),
    fetch("data/past-makes-future.json").then((r) => r.json()),
  ]);

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
            <img src="assets/logo/pmf-logo-black.png" alt="${strand.name}" style="width: 100%; max-width: 520px; height: auto; display:block;" />
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
        <div class="media-plate media-plate--hero" style="--plate-ratio: 21/9;">
          ${plateImg("past-makes-future")}
        </div>
        <p class="media-plate--hero-caption">Placeholder — event photography to follow</p>
      </div>
    </section>

    <section class="section-pad-sm reveal">
      <div class="wrap">
        <div class="grid" style="align-items:baseline; margin-bottom: var(--space-6);">
          <p class="t-title" style="grid-column: 1 / span 6;">Conference</p>
          <p class="t-meta" style="grid-column: 8 / span 5; opacity:.6; justify-self:end;">${confEvent.bookingStatus} · 13:00–18:00${confEvent.bookingUrl ? ` · <a class="link-underline" href="${confEvent.bookingUrl}" target="_blank" rel="noopener">Book →</a>` : ""}</p>
        </div>
        <div>${pmf.conference.sessions.map(agendaRow).join("")}</div>
      </div>
    </section>

    <section class="section-pad tone-black reveal" id="pageant">
      <div class="wrap">
        <div class="grid" style="align-items:baseline; margin-bottom: var(--space-6);">
          <p class="t-title" style="grid-column: 1 / span 6;"><img src="assets/logo/pmf-star-white.png" alt="" style="display:inline-block; height:0.75em; width:auto; margin-right:0.3em; vertical-align:baseline;" />Pageant</p>
          <p class="t-meta" style="grid-column: 8 / span 5; opacity:.6; justify-self:end;">${pageantEvent.bookingStatus}${pageantEvent.ageGuidance ? " · " + pageantEvent.ageGuidance : ""} · Doors 19:30${pageantEvent.bookingUrl ? ` · <a class="link-underline" href="${pageantEvent.bookingUrl}" target="_blank" rel="noopener">Book →</a>` : ""}</p>
        </div>
        <div>${pmf.pageant.sessions.map(agendaRow).join("")}</div>
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
