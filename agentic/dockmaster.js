(function(){
  "use strict";
  if (window.AetherDockmasterLoaded) return;
  window.AetherDockmasterLoaded = true;

  const fallbackMemory = {
    identity: {
      name: "Amara Torretti",
      site: "Aetherhaven",
      positioning: "Remote-first creator-engineer building AI systems, browser tools, games, security experiments, and emotionally alive creative technology."
    },
    projects: [
      { name: "AetherBrowser", type: "Browser / AI OS", status: "Flagship build", path: "browser/security", summary: "A sovereign desktop browser direction: AI-native, privacy-aware, and built around a command-center experience instead of passive browsing.", tags: ["Tauri", "Rust", "TypeScript", "MIST", "Ghostline"], repo: "https://github.com/Mellowambience/aetherbrowser" },
      { name: "Pet Grave", type: "Game / Living World", status: "Emotional vertical slice", path: "games", summary: "A cozy-spooky pet world about grief, affection, memory, and gentle interaction design.", tags: ["Game", "Cozy", "Pets", "Memory"], repo: "https://github.com/Mellowambience/pet-grave" },
      { name: "Aetherhaven", type: "Portfolio / Command Deck", status: "Public mothership", path: "site", summary: "The central hub for Amara's projects, repo constellation, work lanes, and agentic command layer.", tags: ["GitHub Pages", "Portfolio", "Agentic"], repo: "https://github.com/Mellowambience/Mellowambience.github.io" },
      { name: "Ghostline", type: "Security / Privacy", status: "Research lane", path: "browser/security", summary: "A shadow-sentinel direction for safer browsing, privacy overlays, and agentic awareness.", tags: ["Security", "Browser", "Privacy"] },
      { name: "MIST", type: "AI Companion / Agent", status: "System lore", path: "ai", summary: "A local-first companion and agentic workflow concept for creative project continuity.", tags: ["AI", "Agents", "Memory"] },
      { name: "Clawd / Openclaw", type: "Agentic Dev Tool", status: "Tooling bay", path: "ai", summary: "Developer-tool and agent-workflow experiments for shaping how AI, local tools, and project context work together.", tags: ["Agents", "CLI", "Workflow"], repo: "https://github.com/Mellowambience/openclaw" }
    ],
    services: ["AI prototype sprint", "Browser/extension prototype", "Creative tech landing page", "Game vertical-slice polish", "README/portfolio upgrade"],
    safeRule: "Dockmaster drafts. You approve. Private workers act. You review before merge."
  };

  const state = { memory: fallbackMemory, history: [] };

  const esc = (s) => String(s || "").replace(/[&<>\"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch]));
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const byName = (name) => state.memory.projects.find(p => slug(p.name).includes(slug(name)) || slug(name).includes(slug(p.name).split(" ")[0]));
  const listProjects = (filter) => state.memory.projects.filter(p => !filter || p.path === filter || slug(p.type).includes(filter));

  function createShell(){
    const root = document.createElement("section");
    root.className = "aether-dockmaster";
    root.setAttribute("aria-live", "polite");
    root.innerHTML = `
      <button class="ahd-orb" type="button" aria-label="Open Aetherhaven Dockmaster"><span class="ahd-orb-pulse"></span><span class="ahd-orb-glyph">⟁</span></button>
      <div class="ahd-panel" role="dialog" aria-label="Aetherhaven Dockmaster">
        <div class="ahd-head">
          <div class="ahd-title"><span class="ahd-sigil">⟁</span><div><b>Dockmaster</b><span>public guide · draft-only agent</span></div></div>
          <button class="ahd-close" type="button" aria-label="Close">×</button>
        </div>
        <div class="ahd-status">
          <div class="ahd-node"><small>Mode</small><strong>Draft-only</strong></div>
          <div class="ahd-node"><small>Best next</small><strong>Ship demo</strong></div>
          <div class="ahd-node"><small>Fuel</small><strong>Static-safe</strong></div>
        </div>
        <div class="ahd-log"></div>
        <div class="ahd-chips"></div>
        <form class="ahd-composer">
          <div class="ahd-input-row"><span class="ahd-prefix">›</span><input class="ahd-input" placeholder="Try /status, /fleet, /issues pet grave, /fuel" autocomplete="off" /><button class="ahd-send" type="submit">Send</button><button class="ahd-export" type="button">Export</button></div>
          <div class="ahd-footnote">No repo writes, emails, posts, or API keys are handled by Dockmaster.</div>
        </form>
      </div>`;
    document.body.appendChild(root);
    return root;
  }

  function msg(role, body){
    state.history.push({ role, body, at: new Date().toISOString() });
    const el = document.createElement("div");
    el.className = "ahd-msg " + (role === "you" ? "ahd-msg-user" : "ahd-msg-agent");
    el.innerHTML = `<div class="ahd-msg-meta"><span>${role === "you" ? "You" : "Dockmaster"}</span><span>${new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</span></div><div class="ahd-msg-body">${body}</div>`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function chips(){
    const commands = ["/status", "/fleet", "/games", "/ai", "/browser", "/issues pet grave", "/devlog", "/hire", "/recruiter", "/fuel"];
    chipBox.innerHTML = commands.map(c => `<button class="ahd-chip" type="button">${esc(c)}</button>`).join("");
    chipBox.querySelectorAll("button").forEach(b => b.addEventListener("click", () => run(b.textContent)));
  }

  function projectCard(p){
    return `<b>${esc(p.name)}</b> — ${esc(p.status)}\n${esc(p.summary)}\nTags: ${esc((p.tags||[]).join(" · "))}${p.repo ? `\n${esc(p.repo)}` : ""}`;
  }

  function issues(name){
    const p = byName(name) || byName("Pet Grave");
    const base = [
      `Polish ${p.name} first-run experience`,
      `Add screenshots and proof-of-work notes for ${p.name}`,
      `Write README: problem, solution, current status, next build`,
      `Create 3-minute vertical-slice checklist`,
      `Add QA pass: mobile, keyboard, reduced motion, broken links`
    ];
    return `<b>Draft issue pack: ${esc(p.name)}</b>\n` + base.map((x,i)=>`${i+1}. ${esc(x)}`).join("\n") + `\n\nThese are drafts only. Use them as GitHub issues after review.`;
  }

  function devlog(){
    return `<b>Weekly build log draft</b>\n\nThis week the Aetherhaven mothership gained an agentic layer: Dockmaster for project routing and Forge Fuel for temporary, permissioned BYOK enhancement sessions. The safest next move is to polish the demo, connect it to the live homepage, then use it to generate issues, devlogs, and recruiter-ready summaries.\n\nNext signal: ship one visible proof loop — demo page, screenshot, README, and one project roadmap.`;
  }

  function respond(input){
    const q = input.trim();
    const low = q.toLowerCase();
    if (!q) return "Type a command like <span class='ahd-kbd'>/status</span> or ask what to explore.";
    if (low === "/help") return "Commands: /status, /fleet, /games, /ai, /browser, /project NAME, /issues NAME, /roadmap, /devlog, /hire, /contact BRIEF, /recruiter, /agentic, /fuel, /export.";
    if (low === "/status") return `<b>Aetherhaven status</b>\nHighest portfolio value: Aetherhaven Dockmaster + Forge Fuel.\nMost hireable proof: AetherBrowser / browser-security lane.\nMost emotionally resonant: Pet Grave.\nRecommended today: merge the agentic demo, add homepage hooks, then publish a weekly X/devlog recap.`;
    if (low === "/fleet") return listProjects().map(projectCard).join("\n\n");
    if (low === "/games") return listProjects("games").map(projectCard).join("\n\n") || projectCard(byName("Pet Grave"));
    if (low === "/ai") return listProjects("ai").map(projectCard).join("\n\n");
    if (low === "/browser") return listProjects("browser/security").map(projectCard).join("\n\n");
    if (low.startsWith("/project")) return projectCard(byName(q.replace("/project", "")) || byName("Aetherhaven"));
    if (low.startsWith("/issues")) return issues(q.replace("/issues", ""));
    if (low === "/roadmap") return `<b>Agentic site roadmap</b>\n1. Static Dockmaster + Forge Fuel demo.\n2. Homepage script hooks.\n3. Private command deck login.\n4. Server-side Forge Fuel worker.\n5. GitHub issue/PR drafts behind approval gates.\n6. Weekly build-log automation.`;
    if (low === "/devlog") return devlog();
    if (low === "/hire") return `<b>Hire / collaborate route</b>\nBest packages: AI Prototype Sprint, Browser/Extension Prototype, Creative Tech Landing Page, Game Vertical Slice Polish, README/Portfolio Upgrade.\nUse the portal email or generate a contact draft with /contact your brief.`;
    if (low.startsWith("/contact")) return `<b>Contact draft</b>\nSubject: Aetherhaven collaboration inquiry\n\nHi Amara,\n\nI found Aetherhaven and I’m interested in ${esc(q.replace("/contact", "").trim() || "a collaboration")}. The projects that stood out to me were AetherBrowser, Pet Grave, and the agentic Dockmaster / Forge Fuel layer.\n\nCould we talk about scope, timeline, and the best first prototype?\n\nThank you.`;
    if (low === "/recruiter") return `<b>Recruiter summary</b>\nAmara Torretti is a remote-first creator-engineer building across AI systems, browser tools, game prototypes, security/privacy concepts, and creative technology. Aetherhaven is the public command deck tying the work together, with Dockmaster and Forge Fuel showing product thinking, frontend craft, and safe agentic architecture.`;
    if (low === "/agentic") return `<b>Safe agentic rule</b>\n${esc(state.memory.safeRule)}\n\nPublic Dockmaster explains and drafts. Private workers can later inspect repos, open branches, and draft PRs only after authentication and approval.`;
    if (low === "/fuel") { window.dispatchEvent(new CustomEvent("aether:open-forge-fuel")); return "Opening Forge Fuel. Bring temporary fuel, set limits, run drafts only."; }
    if (low === "/export") { exportMd(); return "Exported the current Dockmaster session as Markdown."; }
    return `<b>Signal read:</b> ${esc(q)}\n\nBest route: use /project for a specific build, /issues to turn it into tasks, /devlog to make content, or /fuel to open a temporary project-enhancement session.`;
  }

  function run(input){
    if (!root.classList.contains("is-open")) root.classList.add("is-open");
    msg("you", esc(input));
    msg("dockmaster", respond(input));
    inputEl.value = "";
  }

  function exportMd(){
    const md = state.history.map(h => `## ${h.role} — ${h.at}\n\n${String(h.body).replace(/<[^>]+>/g, "")}`).join("\n\n---\n\n");
    const blob = new Blob([md], {type:"text/markdown"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "aetherhaven-dockmaster-session.md";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const root = createShell();
  const log = root.querySelector(".ahd-log");
  const inputEl = root.querySelector(".ahd-input");
  const chipBox = root.querySelector(".ahd-chips");
  root.querySelector(".ahd-orb").addEventListener("click", () => root.classList.toggle("is-open"));
  root.querySelector(".ahd-close").addEventListener("click", () => root.classList.remove("is-open"));
  root.querySelector("form").addEventListener("submit", e => { e.preventDefault(); run(inputEl.value); });
  root.querySelector(".ahd-export").addEventListener("click", exportMd);
  chips();
  fetch("/agentic/aetherhaven-memory.json").then(r => r.ok ? r.json() : null).then(j => { if (j) state.memory = j; }).catch(()=>{});
  msg("dockmaster", "⟁ Dockmaster online. I can route visitors, explain projects, draft issues, write devlogs, generate contact copy, and open Forge Fuel. Try <span class='ahd-kbd'>/status</span> or <span class='ahd-kbd'>/fuel</span>.");
})();
