/* Aetherhaven Signal Deck — Rev 7.0 — app.js */
(function () {
  "use strict";
  document.body.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Scroll progress ── */
  var progress = document.getElementById("scroll-progress");
  var onScrollUi = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (progress && max > 0) progress.style.width = Math.min(100, (h.scrollTop / max) * 100) + "%";
    var nav = document.querySelector(".nav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    var topBtn = document.getElementById("to-top");
    if (topBtn) topBtn.classList.toggle("show", window.scrollY > 480);
  };
  window.addEventListener("scroll", onScrollUi, { passive: true });
  onScrollUi();

  var topBtn = document.getElementById("to-top");
  if (topBtn) topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ── Mobile nav ── */
  var btn = document.querySelector(".menu-btn"), links = document.querySelector(".links");
  if (btn && links) {
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        btn.focus();
      }
    });
  }

  /* ── Active section nav ── */
  var sections = ["about", "pillars", "play", "fleet", "decks", "lanes", "signal", "portal"];
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".links a[href^='#']"));
  var setActive = function () {
    var y = window.scrollY + 120;
    var current = "";
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = id;
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href");
      a.classList.toggle("active", href === "#" + current);
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ── Scroll reveals ── */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("in");
        el.addEventListener("transitionend", function () {
          el.classList.add("done");
          el.style.transitionDelay = "";
        }, { once: true });
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 55 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Fleet filters ── */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll("#fleet-grid .card");
  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      filterBtns.forEach(function (x) {
        x.classList.remove("active");
        x.setAttribute("aria-pressed", "false");
      });
      b.classList.add("active");
      b.setAttribute("aria-pressed", "true");
      var f = b.getAttribute("data-filter");
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var show = f === "all" || tags.indexOf(f) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ── Constellation canvas ── */
  var canvas = document.getElementById("sky");
  if (canvas && !reduce && canvas.getContext) {
    var ctx = canvas.getContext("2d"), stars = [], W = 0, H = 0,
      DPR = Math.min(window.devicePixelRatio || 1, 2),
      mx = 0, my = 0, tx = 0, ty = 0,
      PALETTE = ["rgba(255,255,255,", "rgba(103,232,249,", "rgba(57,255,110,", "rgba(246,211,101,", "rgba(168,85,247,"];
    var size = function () {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    var seed = function () {
      stars = [];
      var n = Math.min(170, Math.floor(W * H / 10000));
      for (var i = 0; i < n; i++) {
        var z = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: z,
          r: 0.35 + z * 1.5,
          tw: Math.random() * 6.28,
          c: PALETTE[(Math.random() * PALETTE.length) | 0],
          drift: 0.01 + z * 0.03
        });
      }
    };
    var dist = function (a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    size(); seed();
    window.addEventListener("resize", function () { size(); seed(); });
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX / W - 0.5;
      ty = e.clientY / H - 0.5;
    }, { passive: true });
    var loop = function (t) {
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x += s.drift;
        if (s.x > W + 2) s.x = -2;
        var a = (0.3 + 0.5 * Math.abs(Math.sin(t / 1400 + s.tw))) * (0.35 + s.z * 0.65);
        var px = s.x + mx * 36 * s.z;
        var py = s.y + my * 36 * s.z;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, 6.283);
        ctx.fillStyle = s.c + a + ")";
        ctx.fill();
        s._px = px; s._py = py;
      }
      ctx.lineWidth = 1;
      for (var i = 0; i < stars.length; i++) {
        for (var j = i + 1; j < stars.length; j++) {
          var d = dist(
            { x: stars[i]._px, y: stars[i]._py },
            { x: stars[j]._px, y: stars[j]._py }
          );
          if (d < 125) {
            var o = (1 - d / 125) * 0.16;
            ctx.strokeStyle = "rgba(103,232,249," + o + ")";
            ctx.beginPath();
            ctx.moveTo(stars[i]._px, stars[i]._py);
            ctx.lineTo(stars[j]._px, stars[j]._py);
            ctx.stroke();
          }
        }
      }
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  /* ── Live fleet telemetry ── */
  var USER = "Mellowambience", KEY = "ah-fleet-v3", HOUR = 36e5;
  var rel = function (iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + "m ago";
    if (s < 86400) return Math.round(s / 3600) + "h ago";
    if (s < 2592000) return Math.round(s / 86400) + "d ago";
    if (s < 31536000) return Math.round(s / 2592000) + "mo ago";
    return Math.round(s / 31536000) + "y ago";
  };
  var decorate = function (repos) {
    var byName = {}, latest = 0, stars = 0;
    repos.forEach(function (r) {
      byName[r.name.toLowerCase()] = r;
      var p = new Date(r.pushed_at).getTime();
      if (p > latest) latest = p;
      stars += r.stargazers_count || 0;
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
    if (fleetEl) {
      fleetEl.textContent = repos.length + " public modules · " + stars + " ★ total";
      fleetEl.classList.add("on");
    }
    var ls = document.getElementById("last-signal");
    if (ls && latest) ls.textContent = " // LAST SIGNAL " + rel(new Date(latest).toISOString()).toUpperCase();
    var live = document.getElementById("hp-live-text");
    if (live && latest) live.textContent = "Fleet active · last push " + rel(new Date(latest).toISOString());
  };
  var fleet = function () {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (c && Date.now() - c.t < HOUR && c.d && c.d.length) { decorate(c.d); return; }
    } catch (e) {}
    fetch("https://api.github.com/users/" + USER + "/repos?per_page=100&sort=pushed")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var slim = d.map(function (x) {
          return {
            name: x.name,
            stargazers_count: x.stargazers_count,
            language: x.language,
            pushed_at: x.pushed_at
          };
        });
        try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: slim })); } catch (e) {}
        decorate(slim);
      })
      .catch(function () { /* offline / rate-limited */ });
  };
  fleet();

  /* ── Project Vault (renders curated projects.json) ── */
  var vaultGrid = document.getElementById("vault-grid");
  if (vaultGrid) {
    fetch("projects.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (items) {
        if (!Array.isArray(items) || !items.length) return;
        var keep = ["portfolio", "game", "ai-agent", "creative-tool"];
        var list = items.filter(function (p) { return keep.indexOf(p.type) !== -1; });
        if (!list.length) list = items.slice(0, 24);
        list.sort(function (a, b) { return (a.priority || 99) - (b.priority || 99); });
        var frag = document.createDocumentFragment();
        list.forEach(function (p) {
          var card = document.createElement("article");
          card.className = "card vault-card";
          var state = p.featured ? "Featured" : (p.status || "");
          var tags = (p.tags && p.tags.length ? p.tags : [p.type]).slice(0, 4);
          var href = p.liveDemo || p.repo || "#";
          var linkLabel = p.liveDemo ? "Open" : "Repo";
          card.innerHTML =
            '<div class="top"><span class="state">' + esc(state) + '</span><span class="badge">' + esc(String(p.type || "").replace("-", " ")) + '</span></div>' +
            '<div class="glyph" aria-hidden="true">✦</div>' +
            '<h3>' + esc(p.title) + '</h3>' +
            '<p>' + esc(p.shortDescription || "") + '</p>' +
            '<div class="tags">' + tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div>' +
            '<a class="repo-link" href="' + esc(href) + '" target="_blank" rel="noopener">' + linkLabel + '</a>';
          frag.appendChild(card);
        });
        vaultGrid.appendChild(frag);
        var count = document.getElementById("vault-count");
        if (count) count.textContent = list.length + " modules";
      })
      .catch(function () { /* projects.json missing — section stays quiet */ });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ── Year stamp ── */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
