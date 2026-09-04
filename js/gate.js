// Memory Library — temporary password holding page.
// Client-side only: keeps the site off casual view before launch, not real
// security (page source has the password). Remove this script tag from
// every HTML file, and delete this file, once the site is ready to go public.

(function () {
  var KEY = "ml_gate_ok";
  var PASSWORD = "memory";

  if (localStorage.getItem(KEY) === "1") return;

  document.write("<style>html{visibility:hidden}</style>");

  window.addEventListener("DOMContentLoaded", function () {
    var overlay = document.createElement("div");
    overlay.id = "ml-gate";
    overlay.style.cssText =
      "visibility:visible;position:fixed;inset:0;z-index:99999;" +
      "background:#12100e;color:#f4efe6;display:flex;align-items:center;" +
      "justify-content:center;font-family:Georgia,serif;padding:1.5rem;";

    overlay.innerHTML =
      '<form id="ml-gate-form" style="text-align:center;max-width:22rem;">' +
      '<p style="margin:0 0 1.25rem;font-size:1.05rem;letter-spacing:.02em;">Memory Library - site not yet public</p>' +
      '<div style="display:flex;gap:.5rem;justify-content:center;">' +
      '<input id="ml-gate-input" type="password" placeholder="Password" autofocus ' +
      'style="padding:.55em .7em;font-size:1em;border:1px solid #6b6459;background:#1c1a17;color:#f4efe6;border-radius:3px;" />' +
      '<button type="submit" style="padding:.55em 1.1em;font-size:1em;border:1px solid #f4efe6;background:transparent;color:#f4efe6;border-radius:3px;cursor:pointer;">Enter</button>' +
      "</div>" +
      '<p id="ml-gate-error" style="color:#e08a8a;margin:.9em 0 0;visibility:hidden;font-size:.9rem;">Incorrect password</p>' +
      "</form>";

    document.body.appendChild(overlay);
    document.getElementById("ml-gate-input").focus();

    document.getElementById("ml-gate-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var value = document.getElementById("ml-gate-input").value;
      if (value === PASSWORD) {
        localStorage.setItem(KEY, "1");
        location.reload();
      } else {
        document.getElementById("ml-gate-error").style.visibility = "visible";
      }
    });
  });
})();
