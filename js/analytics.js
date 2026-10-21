// GoatCounter path: keep ?slug= so each artist/event is counted as its own
// page, but drop everything else (utm_*, ?at= previews) so e.g. QR-code
// visits still count as /programme.html. utm_source is unaffected — count.js
// always sends location.search separately, and GoatCounter reads the
// referrer/campaign from that. Must load before count.js.
window.goatcounter = window.goatcounter || {};
window.goatcounter.path = function (p) {
  var slug = new URLSearchParams(location.search).get("slug");
  return location.pathname + (slug ? "?slug=" + encodeURIComponent(slug) : "");
};
