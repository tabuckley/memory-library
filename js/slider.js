// Shared moving-indicator behaviour for the date-nav and view-toggle.
// Positions a single element under the active button and animates it
// there on change, instead of the active state snapping instantly.

export function attachSlider(container) {
  const indicator = document.createElement("div");
  indicator.className = "slide-indicator";
  container.appendChild(indicator);
  container.classList.add("has-slider");

  function update() {
    const active = container.querySelector('button[aria-pressed="true"]');
    if (!active) { indicator.style.width = "0px"; return; }
    const cRect = container.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    indicator.style.width = `${aRect.width}px`;
    indicator.style.transform = `translateX(${aRect.left - cRect.left + container.scrollLeft}px)`;
  }

  update();
  window.addEventListener("resize", update);
  return update;
}
