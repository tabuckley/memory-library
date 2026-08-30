// Restrained scroll-entry choreography. Elements marked .reveal fade/rise
// into place once, the first time they cross into view. Applied to a
// deliberate subset of sections per page — most of the site stays static,
// so the moments that do move register as pacing rather than decoration.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function observe(root = document) {
  const items = root.querySelectorAll(".reveal:not(.is-visible)");
  if (!items.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });

  items.forEach((el) => io.observe(el));
}

observe();

// Content injected later (e.g. after a data fetch) may add its own
// .reveal elements — re-scan once the shared chrome and any dynamic
// render has finished.
document.addEventListener("chrome:ready", () => observe());
document.addEventListener("content:rendered", () => observe());
