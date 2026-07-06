(function(){
  "use strict";
  if (window.AetherForgeFuelLoaded) return;
  window.AetherForgeFuelLoaded = true;

  const projects = ["Aetherhaven", "Pet Grave", "AetherBrowser", "Ghostline", "MIST", "Clawd / Openclaw", "Custom project"];
  const missions = ["Project triage", "Draft GitHub issues", "README polish", "Devlog / X thread", "Feature roadmap", "Code-review checklist", "Demo polish plan"];
  const providers = ["Demo / No API key", "OpenAI", "Anthropic", "OpenRouter", "Local gateway"];
  const root = document.createElement("section");
  root.className = "aether-forge-fuel";
  root.innerHTML = `
    <button class="aff-launch" type="button" aria-label="Open Forge Fuel"><span>✦</span></button>
    <div class="aff-panel" role="dialog" aria-label="Forge Fuel">
      <div class="aff-head"><div class="aff-title"><span class="aff-sigil">✦</span><div><b>Forge Fuel</b><span>temporary BYOK · draft-only</span></div></div><button class="aff-close" type="button">×</button></div>
      <div class="aff-body">
        <p class="aff-note">Bring temporary fuel for one approved project-enhancement run. Keys are never saved in localStorage. Real API calls require a server-side worker endpoint.</p>
        <div class="aff-grid">
          <div class="aff-card"><h3>Fuel</h3><label class="aff-field"><span>Provider</span><select class="aff-select" data-field="provider"></select></label><label class="aff-field"><span>Temporary API key</span><input class="aff-input" data-field="key" type="password" placeholder="demo mode does not need a key" /><small>Use only for this session. Do not paste keys into public/shared devices.</small></label><label class="aff-field"><span>Model</span><input class="aff-input" data-field="model" value="demo-forge-v0" /></label></div>
          <div class="aff-card"><h3>Mission</h3><label class="aff-field"><span>Project</span><select class="aff-select" data-field="project"></select></label><label class="aff-field"><span>Run type</span><select class="aff-select" data-field="mission"></select></label><label class="aff-field"><span>Usage cap</span><input class="aff-input" data-field="cap" value="one draft run / 30 min" /></label></div>
          <div class="aff-card full"><h3>Permission gates</h3><div class="aff-permissions">
            ${perm("analyze", "Analyze project context", "Allowed in public/demo mode.", true)}
            ${perm("draft", "Draft tasks, docs, and roadmap", "Creates text output only.", true)}
            ${perm("issues", "Create GitHub issues", "Disabled until private authenticated backend exists.", false, true)}
            ${perm("pr", "Open pull request", "Disabled until private authenticated backend exists.", false, true)}
          </div></div>
          <div class="aff-card full"><h3>Brief</h3><textarea class="aff-textarea" data-field="brief" placeholder="What should the Forge improve? Example: Make Pet Grave v0.3 feel more alive and portfolio-ready."></textarea><label class="aff-check"><input type="checkbox" data-field="consent" /><span><span>I understand this is temporary, permissioned, and draft-only.</span><small>The Forge will not store the key, send messages, push code, or merge anything.</small></span></label><div class="aff-actions"><button class="aff-btn primary" data-action="run" type="button">Run Forge</button><button class="aff-btn" data-action="export" type="button">Export Markdown</button></div></div>
          <div class="aff-card full"><h3>Run log</h3><div class="aff-meter"><div class="aff-meter-bar"><div class="aff-meter-fill"></div></div><span class="aff-meter-label">idle</span></div><div class="aff-log"></div><pre class="aff-output">No run yet.</pre></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);

  function perm(id, title, note, checked, danger){ return `<label class="aff-check ${danger ? "is-danger" : ""}"><input type="checkbox" data-perm="${id}" ${checked ? "checked" : ""} ${danger ? "disabled" : ""}/><span><span>${title}</span><small>${note}</small></span></label>`; }
  function opt(list){ return list.map(x => `<option>${x}</option>`).join(""); }
  root.querySelector('[data-field="provider"]').innerHTML = opt(providers);
  root.querySelector('[data-field="project"]').innerHTML = opt(projects);
  root.querySelector('[data-field="mission"]').innerHTML = opt(missions);

  const q = sel => root.querySelector(sel);
  const launch = q(".aff-launch"), close = q(".aff-close"), runBtn = q('[data-action="run"]'), exportBtn = q('[data-action="export"]');
  const log = q(".aff-log"), out = q(".aff-output"), fill = q(".aff-meter-fill"), label = q(".aff-meter-label");
  let last = "";
  launch.addEventListener("click", () => root.classList.toggle("is-open"));
  close.addEventListener("click", () => root.classList.remove("is-open"));
  window.addEventListener("aether:open-forge-fuel", () => root.classList.add("is-open"));

  function val(name){ const el = q(`[data-field="${name}"]`); return el && (el.type === "checkbox" ? el.checked : el.value); }
  function step(title, body){ const d = document.createElement("div"); d.className = "aff-step"; d.innerHTML = `<b>${title}</b><p>${body}</p>`; log.appendChild(d); }
  function setMeter(p, text){ fill.style.width = p + "%"; label.textContent = text; }
  function buildOutput(){
    const project = val("project"), mission = val("mission"), brief = val("brief") || "Improve the project and make it more shippable.";
    return `# Forge Fuel Draft\n\nProject: ${project}\nMission: ${mission}\nMode: ${val("provider")}\nCap: ${val("cap")}\n\n## Brief\n${brief}\n\n## Recommended output\n\n1. Create a clear README status block: what works, what is stubbed, how to run, and next milestone.\n2. Draft 5 GitHub issues for the smallest shippable loop.\n3. Add one screenshot/demo route so visitors see proof immediately.\n4. Keep all writes behind approval gates: draft → approve → act → review → merge.\n5. Publish a weekly build note showing exactly what changed.\n\n## Draft issue pack\n\n- Polish first-run experience for ${project}\n- Add proof-of-work screenshots and demo notes\n- Create next-milestone checklist\n- Add accessibility/mobile QA pass\n- Write release/devlog summary\n`;
  }
  async function runForge(){
    if (!val("consent")) { out.textContent = "Consent gate required before Forge Fuel can run."; return; }
    log.innerHTML = ""; out.textContent = "Running draft-only Forge session..."; setMeter(15, "checking gates");
    step("Permission gate", "Write actions are disabled in this public MVP. This run can only draft output.");
    await wait(250); setMeter(45, "reading brief"); step("Mission lock", `${val("mission")} for ${val("project")}.`);
    await wait(250); setMeter(75, "drafting");
    const endpoint = window.AETHER_FORGE_FUEL_ENDPOINT;
    if (endpoint && val("provider") !== "Demo / No API key") {
      step("Backend handoff", "Endpoint configured. The worker should handle the key server-side and discard it after the run.");
    } else {
      step("Demo mode", "No external API call made. Static-safe draft generated in-browser.");
    }
    await wait(250); last = buildOutput(); out.textContent = last; setMeter(100, "draft complete");
  }
  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
  function exportMd(){
    const blob = new Blob([last || buildOutput()], {type:"text/markdown"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "forge-fuel-draft.md"; a.click(); URL.revokeObjectURL(a.href);
  }
  runBtn.addEventListener("click", runForge);
  exportBtn.addEventListener("click", exportMd);
})();
