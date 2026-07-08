/* Aetherhaven Signal Deck — Rev 6.0 — app.js */
(function () {
  "use strict";
  document.body.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Mobile nav ── */
  var btn = document.querySelector(".menu-btn"), links = document.querySelector(".links");
  if (btn && links) {
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ── Scroll reveals ── */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("in");
        el.addEventListener("transitionend", function () { el.classList.add("done"); el.style.transitionDelay = ""; }, { once: true });
        io.unobserve(el);
      });
    }, { threshold: .12 });
    revealEls.forEach(function (el, i) { el.style.transitionDelay = (i % 6) * 60 + "ms"; io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Constellation canvas: connected starfield with parallax ── */
  var canvas = document.getElementById("sky");
  if (canvas && !reduce && canvas.getContext) {
    var ctx = canvas.getContext("2d"), stars = [], W = 0, H = 0,
      DPR = Math.min(window.devicePixelRatio || 1, 2),
      mx = 0, my = 0, tx = 0, ty = 0,
      PALETTE = ["rgba(255,255,255,", "rgba(103,232,249,", "rgba(57,255,110,", "rgba(246,211,101,"];
    var size = function () {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    var seed = function () {
      stars = [];
      var n = Math.min(150, Math.floor(W * H / 11000));
      for (var i = 0; i < n; i++) {
        var z = Math.random();
        stars.push({ x: Math.random() * W, y: Math.random() * H, z: z, r: .4 + z * 1.4, tw: Math.random() * 6.28, c: PALETTE[(Math.random() * PALETTE.length) | 0] });
      }
    };
    var dist = function (a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); };
    size(); seed();
    window.addEventListener("resize", function () { size(); seed(); });
    window.addEventListener("pointermove", function (e) { tx = e.clientX / W - .5; ty = e.clientY / H - .5; }, { passive: true });
    var loop = function (t) {
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x += .014 * (.3 + s.z); if (s.x > W + 2) s.x = -2;
        var a = (.35 + .45 * Math.abs(Math.sin(t / 1400 + s.tw))) * (.35 + s.z * .65);
        var px = s.x + mx * 30 * s.z, py = s.y + my * 30 * s.z;
        ctx.beginPath(); ctx.arc(px, py, s.r, 0, 6.283); ctx.fillStyle = s.c + a + ")"; ctx.fill();
        s._px = px; s._py = py;
      }
      /* constellation links */
      ctx.lineWidth = 1;
      for (var i = 0; i < stars.length; i++) {
        for (var j = i + 1; j < stars.length; j++) {
          var d = dist(stars[i], stars[j]);
          if (d < 130) {
            var o = (1 - d / 130) * .18;
            ctx.strokeStyle = "rgba(103,232,249," + o + ")";
            ctx.beginPath(); ctx.moveTo(stars[i]._px, stars[i]._py); ctx.lineTo(stars[j]._px, stars[j]._py); ctx.stroke();
          }
        }
      }
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  /* ── Live fleet telemetry (GitHub API, 1h cache, silent fallback) ── */
  var USER = "Mellowambience", KEY = "ah-fleet-v2", HOUR = 36e5;
  var rel = function (iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + "m ago";
    if (s < 86400) return Math.round(s / 3600) + "h ago";
    if (s < 2592000) return Math.round(s / 86400) + "d ago";
    if (s < 31536000) return Math.round(s / 2592000) + "mo ago";
    return Math.round(s / 31536000) + "y ago";
  };
  var decorate = function (repos) {
    var byName = {}, latest = 0;
    repos.forEach(function (r) {
      byName[r.name.toLowerCase()] = r;
      var p = new Date(r.pushed_at).getTime(); if (p > latest) latest = p;
    });
    document.querySelectorAll("[data-repo]").forEach(function (card) {
      var r = byName[card.getAttribute("data-repo")], el = card.querySelector(".repo-meta");
      if (!r || !el) return;
      var bits = ["★ " + r.stargazers_count];
      if (r.language) bits.push(r.language);
      bits.push("updated " + rel(r.pushed_at));
      el.textContent = bits.join(" · ");
      el.classList.add("on");
    });
    var fleetEl = document.querySelector("[data-fleet] .repo-meta");
    if (fleetEl) { fleetEl.textContent = repos.length + " public modules in orbit"; fleetEl.classList.add("on"); }
    var ls = document.getElementById("last-signal");
    if (ls && latest) ls.textContent = " // LAST SIGNAL " + rel(new Date(latest).toISOString()).toUpperCase();
  };
  var fleet = function () {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (c && Date.now() - c.t < HOUR && c.d && c.d.length) { decorate(c.d); return; }
    } catch (e) {}
    fetch("https://api.github.com/users/" + USER + "/repos?per_page=100&sort=pushed")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var slim = d.map(function (x) { return { name: x.name, stargazers_count: x.stargazers_count, language: x.language, pushed_at: x.pushed_at }; });
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: slim })); } catch (e) {}
        decorate(slim);
      })
      .catch(function () { /* offline / rate-limited: cards stay as designed */ });
  };
  fleet();
})();
