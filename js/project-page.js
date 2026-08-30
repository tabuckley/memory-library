import { loadData, plateImg, vtName, resolveRefs } from "./data.js";
import { expandOccurrences, dateLabel } from "./programme.js";

async function main() {
  const data = await loadData();
  const params = new URLSearchParams(location.search);
  const project = data.byId.project[params.get("slug")] || data.projects[0];
  const host = document.getElementById("project-content");
  document.title = `${project.title} — Memory Library`;

  const artists = resolveRefs(project.artistIds, data.byId.artist, "artist");
  const place = data.byId.place[project.placeId];
  const strand = data.byId.strand[project.strandId];
  const expanded = expandOccurrences(data).filter((x) => x.projects.some((p) => p.id === project.id));
  const related = data.projects.filter((p) => p.id !== project.id && (p.strandId === project.strandId || p.artistIds?.some((a) => project.artistIds.includes(a)))).slice(0, 2);

  host.innerHTML = `
    <section class="section-pad-sm">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-4);">${project.type} · ${strand.name} · ${place.name}</p>
        <div class="grid" style="align-items:start;">
          <h1 class="t-display" style="grid-column: 1 / span 9; font-size: clamp(2.25rem, 1.5rem + 4.5vw, 6rem); margin-bottom: var(--space-6);">${project.title}</h1>
          <div style="grid-column: 10 / span 3;" class="t-meta">
            ${artists.length ? `
            <p style="opacity:.55; margin-bottom: var(--space-1);">Artist</p>
            <p style="margin-bottom: var(--space-4);">${artists.map((a) => `<a class="link-underline" href="artist.html?slug=${a.id}">${a.name}</a>`).join(", ")}</p>` : ""}
            <p style="opacity:.55; margin-bottom: var(--space-1);">Year</p>
            <p>${project.year}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad-sm">
      <div class="wrap">
        <div class="media-plate media-plate--hero" style="--plate-ratio: 21/9; view-transition-name: ${vtName("proj", project.id)};">
          ${plateImg(project.id, "landscape", project.mediaUrl)}
        </div>
        <p class="media-plate--hero-caption">${project.mediaCaption}</p>
      </div>
    </section>

    <section class="section-pad-sm reveal">
      <div class="wrap grid">
        <p class="t-intro measure" style="grid-column: 1 / span 6;">${project.intro}</p>
        <p class="t-body measure" style="grid-column: 7 / span 6; opacity:.85;">${project.body}</p>
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
            </a>`).join("")}</div>` : `<p class="t-small" style="opacity:.6;">Part of the continuous exhibition — see Programme for opening hours.</p>`}
        </div>
      </div>
    </section>

    ${related.length ? `
    <section class="section-pad-sm reveal">
      <div class="wrap">
        <p class="t-meta" style="opacity:.55; margin-bottom: var(--space-6);">Also in ${strand.name}</p>
        <div class="grid">
          ${related.map((p, i) => `
            <a href="project.html?slug=${p.id}" style="grid-column: ${i === 0 ? "1 / span 5" : "7 / span 5"};">
              <div class="media-plate" style="--plate-ratio: 4/3;">
                ${plateImg(p.id, "landscape", p.mediaUrl)}
                <span class="plate-caption">${p.mediaCaption}</span>
              </div>
              <p class="t-intro" style="margin-top: var(--space-3);">${p.title}</p>
            </a>`).join("")}
        </div>
      </div>
    </section>` : ""}

    <section class="section-pad-sm">
      <div class="wrap">
        <a class="btn-line" href="artists.html">← All artists</a>
      </div>
    </section>`;

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
