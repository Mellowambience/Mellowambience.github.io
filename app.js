(function () {
  "use strict";

  document.body.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var q = function (selector, scope) { return (scope || document).querySelector(selector); };
  var qa = function (selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  /* Mobile navigation */
  var menuButton = q("#mobile-menu");
  var nav = q("#primary-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        menuButton.focus();
      }
    });
  }

  /* Active section navigation */
  var sectionIds = ["home", "engineering", "systems", "demos", "atlas", "about", "contact"];
  var navLinks = qa(".primary-nav a[href^='#']");

  function updateActiveNav() {
    var marker = window.scrollY + Math.min(window.innerHeight * 0.32, 220);
    var current = "home";
    sectionIds.forEach(function (id) {
      var element = document.getElementById(id);
      if (element && element.offsetTop <= marker) current = id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* Scroll reveal */
  var revealTargets = qa(".section-heading, .featured-card, .rail-panel, .system-row, .demo-card, .atlas-controls, .atlas-table-wrap, .about-grid > div, .contact-section");
  revealTargets.forEach(function (element) { element.setAttribute("data-reveal", ""); });

  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.09, rootMargin: "0px 0px -44px 0px" });

    revealTargets.forEach(function (element, index) {
      element.style.transitionDelay = (index % 4) * 45 + "ms";
      revealObserver.observe(element);
    });
  } else {
    revealTargets.forEach(function (element) { element.classList.add("visible"); });
  }

  /* Lightweight star field */
  var canvas = q("#starfield");
  if (canvas && canvas.getContext && !reducedMotion) {
    var context = canvas.getContext("2d");
    var stars = [];
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pointerX = 0;
    var pointerY = 0;
    var targetX = 0;
    var targetY = 0;
    var palette = [
      "255,255,255",
      "239,114,200",
      "140,99,255",
      "102,228,242"
    ];

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    }

    function seedStars() {
      stars = [];
      var count = Math.min(120, Math.max(54, Math.floor(width * height / 15000)));
      for (var i = 0; i < count; i += 1) {
        var depth = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          depth: depth,
          radius: 0.4 + depth * 1.2,
          twinkle: Math.random() * Math.PI * 2,
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }

    window.addEventListener("pointermove", function (event) {
      targetX = event.clientX / Math.max(width, 1) - 0.5;
      targetY = event.clientY / Math.max(height, 1) - 0.5;
    }, { passive: true });

    function draw(time) {
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;
      context.clearRect(0, 0, width, height);

      stars.forEach(function (star) {
        var x = star.x + pointerX * 24 * star.depth;
        var y = star.y + pointerY * 24 * star.depth;
        var opacity = 0.18 + (Math.sin(time / 1300 + star.twinkle) + 1) * 0.15 + star.depth * 0.18;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(" + star.color + "," + opacity.toFixed(3) + ")";
        context.fill();
      });

      window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    window.requestAnimationFrame(draw);
  }

  /* Back to top */
  var backToTop = q("#back-to-top");
  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 720);
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* Live repository metadata for selected work */
  var repoCards = qa("[data-repo]");
  var githubCacheKey = "amara-portfolio-github-v8";
  var githubCacheLifetime = 60 * 60 * 1000;

  function relativeTime(iso) {
    var delta = Math.max(0, Date.now() - new Date(iso).getTime());
    var minutes = Math.round(delta / 60000);
    if (minutes < 60) return Math.max(1, minutes) + "m ago";
    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + "h ago";
    var days = Math.round(hours / 24);
    if (days < 30) return days + "d ago";
    var months = Math.round(days / 30);
    if (months < 12) return months + "mo ago";
    return Math.round(months / 12) + "y ago";
  }

  function decorateRepoCards(repos) {
    var byName = {};
    repos.forEach(function (repo) { byName[String(repo.name).toLowerCase()] = repo; });
    repoCards.forEach(function (card) {
      var repo = byName[String(card.getAttribute("data-repo") || "").toLowerCase()];
      var target = q(".repo-meta", card);
      if (!repo || !target) return;
      var bits = [];
      if (typeof repo.stargazers_count === "number") bits.push("★ " + repo.stargazers_count);
      if (repo.language) bits.push(repo.language);
      if (repo.pushed_at) bits.push("updated " + relativeTime(repo.pushed_at));
      if (bits.length) target.textContent = bits.join(" · ");
    });
  }

  try {
    var cachedRepos = JSON.parse(sessionStorage.getItem(githubCacheKey) || "null");
    if (cachedRepos && Date.now() - cachedRepos.time < githubCacheLifetime) {
      decorateRepoCards(cachedRepos.data || []);
    } else {
      fetch("https://api.github.com/users/Mellowambience/repos?per_page=100&sort=pushed")
        .then(function (response) {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .then(function (data) {
          var compact = data.map(function (repo) {
            return {
              name: repo.name,
              language: repo.language,
              stargazers_count: repo.stargazers_count,
              pushed_at: repo.pushed_at
            };
          });
          try { sessionStorage.setItem(githubCacheKey, JSON.stringify({ time: Date.now(), data: compact })); } catch (error) {}
          decorateRepoCards(compact);
        })
        .catch(function () {});
    }
  } catch (error) {}

  /* Project Atlas */
  var atlasList = q("#atlas-list");
  var atlasCount = q("#atlas-count");
  var atlasSearch = q("#project-search");
  var atlasFilters = qa(".atlas-filter");
  var atlasMore = q("#atlas-more");
  var atlasEmpty = q("#atlas-empty");
  var atlasItems = [];
  var atlasFilter = "all";
  var atlasQuery = "";
  var atlasLimit = 12;

  function normalizeType(item) {
    var type = String(item.type || "experiment").toLowerCase();
    if (item.status === "archived") return "archive";
    if (type === "portfolio") return "creative-tool";
    if (type === "ai-companion") return "ai-agent";
    return type;
  }

  function dedupeProjects(items) {
    var seen = {};
    return items.filter(function (item) {
      var key = String(item.repo || item.slug || item.title || "").toLowerCase().replace(/\/$/, "");
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function projectSearchText(item) {
    return [
      item.title,
      item.shortDescription,
      item.longDescription,
      item.type,
      item.status,
      (item.techStack || []).join(" "),
      (item.tags || []).join(" ")
    ].join(" ").toLowerCase();
  }

  function visibleProjects() {
    return atlasItems.filter(function (item) {
      var type = normalizeType(item);
      var filterMatch = atlasFilter === "all" || type === atlasFilter;
      var searchMatch = !atlasQuery || projectSearchText(item).indexOf(atlasQuery) !== -1;
      return filterMatch && searchMatch;
    });
  }

  function renderAtlas() {
    if (!atlasList) return;
    var filtered = visibleProjects();
    var visible = filtered.slice(0, atlasLimit);
    atlasList.innerHTML = "";

    visible.forEach(function (item) {
      var type = normalizeType(item);
      var link = item.liveDemo || item.repo || "#";
      var linkLabel = item.liveDemo ? "Open" : "Repo";
      var stack = (item.techStack || []).filter(Boolean).slice(0, 4);
      if (!stack.length && item.tags && item.tags.length) stack = item.tags.slice(0, 4);
      var row = document.createElement("article");
      row.className = "atlas-row";
      row.innerHTML =
        '<div class="atlas-project"><h3>' + escapeHtml(item.title || item.slug || "Untitled") + '</h3><p>' + escapeHtml(item.shortDescription || item.longDescription || "Project entry in the Aetherhaven archive.") + '</p></div>' +
        '<div class="atlas-type">' + escapeHtml(type.replace(/-/g, " ")) + '</div>' +
        '<div class="atlas-status">' + escapeHtml(item.status || "prototype") + '</div>' +
        '<div class="atlas-stack">' + stack.map(function (value) { return "<span>" + escapeHtml(value) + "</span>"; }).join("") + '</div>' +
        '<a class="atlas-open" href="' + escapeHtml(link) + '" target="_blank" rel="noopener">' + escapeHtml(linkLabel) + '</a>';
      atlasList.appendChild(row);
    });

    if (atlasEmpty) atlasEmpty.hidden = filtered.length !== 0;
    if (atlasMore) {
      atlasMore.hidden = filtered.length <= atlasLimit;
      atlasMore.textContent = "Show " + Math.min(12, filtered.length - atlasLimit) + " more projects";
    }
  }

  if (atlasList) {
    fetch("projects.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(function (items) {
        atlasItems = dedupeProjects(Array.isArray(items) ? items : []);
        atlasItems.sort(function (a, b) {
          var featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
          if (featuredDiff) return featuredDiff;
          return Number(a.priority || 999) - Number(b.priority || 999);
        });
        if (atlasCount) atlasCount.textContent = atlasItems.length + " unique indexed projects.";
        renderAtlas();
      })
      .catch(function () {
        if (atlasCount) atlasCount.textContent = "Project index unavailable.";
        if (atlasEmpty) {
          atlasEmpty.hidden = false;
          atlasEmpty.textContent = "The project index could not be loaded. GitHub remains available from the links above.";
        }
      });
  }

  if (atlasSearch) {
    atlasSearch.addEventListener("input", function () {
      atlasQuery = atlasSearch.value.trim().toLowerCase();
      atlasLimit = 12;
      renderAtlas();
    });
  }

  atlasFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      atlasFilters.forEach(function (other) {
        other.classList.remove("active");
        other.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      atlasFilter = button.getAttribute("data-atlas-filter") || "all";
      atlasLimit = 12;
      renderAtlas();
    });
  });

  if (atlasMore) {
    atlasMore.addEventListener("click", function () {
      atlasLimit += 12;
      renderAtlas();
    });
  }

  /* MIST portfolio guide */
  var mistLaunch = q("#mist-launch");
  var mistPanel = q("#mist-panel");
  var mistClose = q("#mist-close");
  var mistLog = q("#mist-log");
  var mistPrompts = q("#mist-prompts");
  var mistForm = q("#mist-form");
  var mistInput = q("#mist-input");
  var mistOpened = false;

  var mistKnowledge = {
    greet: "I’m MIST, the portfolio guide. I can route you to Amara’s strongest engineering proof, agent systems, open-source work, or live demos.",
    strongest: "Amara’s clearest strength is end-to-end agentic product engineering: she can move between architecture, Python services, TypeScript interfaces, local memory, model routing, and the human approval layer that makes an agent safe to use.",
    ai: "Start with MIST / clawd for hybrid local-cloud architecture, then inspect AetherTwin Fairy OS for agent identity and permissions. AetherProof shows her voice-and-vision product thinking.",
    openSource: "The strongest external proof is OpenClaw PR #22142. She traced an injected-metadata leak across webchat, TUI, and Swift, added regression coverage, and iterated until the clean resubmission merged upstream.",
    product: "HumanPalette is the deepest conventional full-stack product: React Native, Supabase auth and realtime, Stripe Connect, escrow-style payment flows, RLS, and six Edge Functions.",
    security: "Ghostline is a modular defensive security suite with seven focused CLI tools and a unified dispatcher. It is one of the clearest examples of scoped, testable, useful engineering in the portfolio.",
    demo: "Try Pet Grave for the richest playable system, Aether Garden for the living-world direction, QI Games for agent simulation, or Boop Beat Board for Web Audio and interaction design.",
    browser: "AetherBrowser is a Tauri v2 desktop shell with Studio and Arcade modes, React and TypeScript UI, Rust integration, local persistence, project creation, and an embedded agent workspace.",
    fallback: "Ask about OpenClaw, MIST, HumanPalette, Ghostline, AetherBrowser, live demos, or the kind of role Amara fits best."
  };

  function mistReply(question) {
    var text = String(question || "").toLowerCase();
    if (/strong|best at|skill|fit|hire|role/.test(text)) return mistKnowledge.strongest;
    if (/open.?source|openclaw|pull request|pr #?22142/.test(text)) return mistKnowledge.openSource;
    if (/humanpalette|marketplace|stripe|supabase|product/.test(text)) return mistKnowledge.product;
    if (/ghostline|security|cyber|cli/.test(text)) return mistKnowledge.security;
    if (/aetherbrowser|browser|tauri|rust/.test(text)) return mistKnowledge.browser;
    if (/demo|play|game|pet grave|garden|beat|qi/.test(text)) return mistKnowledge.demo;
    if (/mist|agent|ai|fairy|local.?first/.test(text)) return mistKnowledge.ai;
    return mistKnowledge.fallback;
  }

  function addMistMessage(kind, text) {
    if (!mistLog) return;
    var message = document.createElement("div");
    message.className = "mist-message " + kind;
    message.textContent = text;
    mistLog.appendChild(message);
    mistLog.scrollTop = mistLog.scrollHeight;
  }

  function openMist() {
    if (!mistPanel || !mistLaunch) return;
    mistPanel.classList.add("open");
    mistPanel.setAttribute("aria-hidden", "false");
    mistLaunch.setAttribute("aria-expanded", "true");
    if (!mistOpened) {
      mistOpened = true;
      addMistMessage("guide", mistKnowledge.greet);
    }
    if (mistInput) mistInput.focus();
  }

  function closeMist() {
    if (!mistPanel || !mistLaunch) return;
    mistPanel.classList.remove("open");
    mistPanel.setAttribute("aria-hidden", "true");
    mistLaunch.setAttribute("aria-expanded", "false");
  }

  if (mistLaunch) mistLaunch.addEventListener("click", function () {
    if (mistPanel && mistPanel.classList.contains("open")) closeMist();
    else openMist();
  });
  if (mistClose) mistClose.addEventListener("click", closeMist);

  if (mistPrompts) {
    mistPrompts.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var question = button.textContent.trim();
      addMistMessage("user", question);
      window.setTimeout(function () { addMistMessage("guide", mistReply(question)); }, reducedMotion ? 0 : 280);
    });
  }

  if (mistForm) {
    mistForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var question = mistInput ? mistInput.value.trim() : "";
      if (!question) return;
      addMistMessage("user", question);
      if (mistInput) mistInput.value = "";
      window.setTimeout(function () { addMistMessage("guide", mistReply(question)); }, reducedMotion ? 0 : 280);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mistPanel && mistPanel.classList.contains("open")) closeMist();
  });

  /* Footer year */
  var year = q("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
