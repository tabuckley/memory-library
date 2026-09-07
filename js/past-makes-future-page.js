import { loadData, plateImg, vtName } from "./data.js";
import { agendaRow } from "./programme.js";

async function main() {
  const data = await loadData();
  const conferenceSessions = data.pmfSessions.filter((s) => s.section === "conference");

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
          <div style="grid-column: 8 / span 5; text-align:right;">
            <p class="t-meta" style="opacity:.6;">${confEvent.bookingStatus} · 13:00–18:00</p>
            ${confEvent.bookingUrl ? `<p style="margin-top: var(--space-2);"><a class="btn-line" href="${confEvent.bookingUrl}" target="_blank" rel="noopener">Book &rarr;</a></p>` : ""}
          </div>
        </div>
        <div>${conferenceSessions.map((s) => agendaRow(s, data)).join("")}</div>
      </div>
    </section>

    ${pageantEvent ? `
    <section class="section-pad-sm reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">Also in Past Makes Future</p>
        <div class="grid">
          <a href="event.html?slug=${pageantEvent.id}" style="grid-column: 1 / span 5;">
            <div class="media-plate" style="--plate-ratio: 4/3; view-transition-name: ${vtName("event", pageantEvent.id)};">
              ${plateImg(pageantEvent.id, "landscape", pageantEvent.imageUrl)}
            </div>
            <p class="t-intro" style="margin-top: var(--space-3);"><img src="assets/logo/pmf-star-black.png" alt="" style="display:inline-block; height:0.75em; width:auto; margin-right:0.3em; vertical-align:baseline;" />${pageantEvent.title}</p>
          </a>
        </div>
      </div>
    </section>` : ""}

    <section class="section-pad-sm">
      <div class="wrap">
        <a class="btn-line" href="programme.html?date=2026-11-14">← Back to Programme</a>
      </div>
    </section>`;

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
