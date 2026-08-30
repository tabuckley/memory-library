// Memory Library — shared header/footer injection + nav behaviour.

async function include(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;
  const html = await fetch(url).then((r) => r.text());
  host.innerHTML = html;
}

function markActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
  });
}

function wireMobileToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

(async function initChrome() {
  await include("#site-header", "partials/header.html");
  await include("#site-footer", "partials/footer.html");
  markActiveNav();
  wireMobileToggle();
  document.dispatchEvent(new CustomEvent("chrome:ready"));
})();
