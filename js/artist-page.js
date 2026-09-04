import { loadData, plateImg, vtName, resolveIfAllIds } from "./data.js";
import { expandOccurrences, dateLabel, timeRange } from "./programme.js";

async function main() {
  const data = await loadData();
  const params = new URLSearchParams(location.search);
  const artist = data.byId.artist[params.get("slug")] || data.artists[0];
  const host = document.getElementById("artist-content");

  if (!artist) {
    document.title = "Artists - Memory Library";
    host.innerHTML = `
      <section class="section-pad-sm">
        <div class="wrap">
          <h1 class="t-display" style="font-size: clamp(2.25rem, 1.8rem + 3vw, 4.5rem); margin-bottom: var(--space-6);">Artists</h1>
          <p class="t-body" style="opacity:.6; margin-bottom: var(--space-6);">Artists and collaborators will be announced as they're confirmed.</p>
          <a class="btn-line" href="artists.html">← All artists</a>
        </div>
      </section>`;
    document.dispatchEvent(new CustomEvent("content:rendered"));
    return;
  }

  document.title = `${artist.name} - Memory Library`;

  const place = data.byId.place[artist.placeId];
  const meta = [artist.discipline, place?.name].filter(Boolean).join(" · ");
  const featuredWork = data.events.filter((e) => e.mode === "ongoing" && e.artistIds.includes(artist.id));
  const expanded = expandOccurrences(data).filter((x) => x.artists.some((a) => a.id === artist.id));
  const pmfAppearances = data.pmfSessions.filter((s) => {
    const who = resolveIfAllIds(s.who, data.byId.artist);
    return who && who.some((a) => a.id === artist.id);
  });

  host.innerHTML = `
    <section class="section-pad-sm">
      <div class="wrap">
        <div class="grid" style="align-items:end;">
          <div style="grid-column: 1 / span 4;">
            <div class="media-plate" style="--plate-ratio: 4/5; view-transition-name: ${vtName("artist", artist.id)};">
              ${plateImg(artist.id, "portrait", artist.photoUrl)}
              ${artist.portraitCaption ? `<span class="plate-caption">${artist.portraitCaption}</span>` : ""}
            </div>
          </div>
          <div style="grid-column: 6 / span 7;">
            ${meta ? `<p class="t-meta" style="opacity:.55; margin-bottom: var(--space-3);">${meta}</p>` : ""}
            <h1 class="t-display" style="font-size: clamp(2.25rem, 1.6rem + 4vw, 5.5rem); margin-bottom: var(--space-6);">${artist.name}</h1>
            <p class="t-intro measure" style="opacity:.85;">${artist.bio}</p>
            ${artist.portfolioUrl || artist.instagramUrl ? `
            <p class="t-meta" style="margin-top: var(--space-4);">
              ${artist.portfolioUrl ? `<a class="link-underline" href="${artist.portfolioUrl}" target="_blank" rel="noopener">Portfolio →</a>` : ""}
              ${artist.portfolioUrl && artist.instagramUrl ? `<span style="opacity:.4;"> · </span>` : ""}
              ${artist.instagramUrl ? `<a class="link-underline" href="${artist.instagramUrl}" target="_blank" rel="noopener">Instagram →</a>` : ""}
            </p>` : ""}
          </div>
        </div>
      </div>
    </section>

    ${featuredWork.length ? `
    <section class="section-pad-sm tone-paper reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">${featuredWork.length > 1 ? "Work" : "Project"}</p>
        <div class="grid">
          ${featuredWork.map((e) => `
            <a href="event.html?slug=${e.id}" style="grid-column: 1 / span 12;" class="grid">
              <div style="grid-column: 1 / span 4;">
                <div class="media-plate" style="--plate-ratio: 16/10; view-transition-name: ${vtName("event", e.id)};">
                  ${plateImg(e.id, "landscape", e.imageUrl)}
                  ${e.mediaCaption ? `<span class="plate-caption">${e.mediaCaption}</span>` : ""}
                </div>
              </div>
              <div style="grid-column: 6 / span 7;">
                <p class="t-title">${e.title}</p>
                <p class="t-body" style="opacity:.8; margin-top: var(--space-2);">${e.summary}</p>
                <p class="t-meta" style="opacity:.6; margin-top: var(--space-3);">${e.type}${e.year ? " · " + e.year : ""}</p>
              </div>
            </a>`).join("")}
        </div>
      </div>
    </section>` : ""}

    <section class="section-pad-sm reveal">
      <div class="wrap grid">
        <div style="grid-column: 1 / span 6;">
          <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-4);">On the programme</p>
          ${(expanded.length || pmfAppearances.length) ? `<div class="related-list">
            ${expanded.map((x) => `
            <a class="related-item" href="programme.html?date=${x.occ.date}">
              <span>${x.event.title}</span>
              <span class="t-meta" style="opacity:.6;">${dateLabel(x.occ.date)} · ${x.occ.startTime}</span>
            </a>`).join("")}
            ${pmfAppearances.map((s) => `
            <a class="related-item" href="past-makes-future.html${s.section === "pageant" ? "#pageant" : ""}">
              <span>${s.title} - Past Makes Future</span>
              <span class="t-meta" style="opacity:.6;">Sat 14 Nov · ${s.time}</span>
            </a>`).join("")}
          </div>` : `<p class="t-small" style="opacity:.6;">No scheduled sessions yet - see the exhibition for this artist's work.</p>`}
        </div>
      </div>
    </section>

    <section class="section-pad-sm">
      <div class="wrap">
        <a class="btn-line" href="artists.html">← All artists</a>
      </div>
    </section>`;

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
