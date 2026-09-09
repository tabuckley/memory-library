import { loadData, plateImg, vtName } from "./data.js";

async function main() {
  const data = await loadData();
  const host = document.getElementById("artist-index");

  if (!data.artists.length) {
    host.innerHTML = `<p class="t-body" style="opacity:.6; padding-block: var(--space-8);">Artists and collaborators will be announced as they're confirmed.</p>`;
    document.dispatchEvent(new CustomEvent("content:rendered"));
    return;
  }

  host.innerHTML = data.artists.map((a, i) => {
    const place = data.byId.place[a.placeId];
    const meta = [a.discipline, place?.name].filter(Boolean).join(" · ");
    return `
      <a class="index-row" href="artist.html?slug=${a.id}">
        <span class="index-row__n t-meta">${String(i + 1).padStart(2, "0")}</span>
        <span>
          <span class="index-row__name">${a.name}</span>
          ${meta ? `<span class="index-row__meta">${meta}</span>` : ""}
        </span>
        <span class="index-row__thumb media-plate" style="--plate-ratio: 4/5; view-transition-name: ${vtName("artist", a.id)};">
          ${plateImg(a.id, "portrait", a.photoUrl)}
        </span>
      </a>`;
  }).join("");

  document.dispatchEvent(new CustomEvent("content:rendered"));
}

main();
