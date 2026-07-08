/* Inject floating hub link on subpages when missing */
(function () {
  "use strict";
  if (document.querySelector(".ah-hub")) return;
  var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "" || path === "/" || path === "/index.html") return;

  var a = document.createElement("a");
  a.className = "ah-hub";
  a.href = "https://mellowambience.github.io/";
  a.setAttribute("aria-label", "Back to Aetherhaven hub");
  a.innerHTML = "<b>⟁</b><span>Aetherhaven</span>";
  document.body.appendChild(a);

  if (!document.querySelector('link[href*="site-chrome.css"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    // Resolve relative to current path depth
    var depth = path.split("/").filter(Boolean).length;
    // If we're in /foo/ or /foo/bar.html under github pages root
    var prefix = "";
    if (path.indexOf("/") === 0) {
      var parts = path.split("/").filter(Boolean);
      // file in subdir: /aether-garden/ or /aether-garden/index.html → one level
      if (parts.length >= 1 && parts[parts.length - 1].indexOf(".") !== -1) parts.pop();
      prefix = parts.map(function () { return ".."; }).join("/") || ".";
      if (prefix !== ".") prefix += "/";
      else prefix = "../".repeat(0);
      // simpler: always try root-absolute for GH pages
      prefix = "/";
    }
    link.href = prefix + "site-chrome.css";
    document.head.appendChild(link);
  }
})();
