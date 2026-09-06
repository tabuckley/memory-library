import { loadData } from "./data.js";

async function main() {
  const data = await loadData();
  const artist = data.byId.artist["thomas-buckley"];
  const host = document.getElementById("curated-by-content");
  if (!artist || !host) return;

  host.innerHTML = `
    <h2 class="t-title" style="margin-bottom: var(--space-4);"><a class="link-underline" href="artist.html?slug=${artist.id}">${artist.name}</a></h2>
    <p class="t-body measure" style="opacity:.85;">${artist.bio}</p>
  `;
}

main();
