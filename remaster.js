(() => {
  'use strict';
  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  window.matchMedia('(min-width:721px)').addEventListener('change', e => { if(e.matches) closeMenu(); });
  const search = document.querySelector('#project-search');
  const list = document.querySelector('#project-list');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const more = document.querySelector('#show-more');
  let items = [], filter = 'all', limit = 10;
  const type = item => item.status === 'archived' ? 'archive' : item.type === 'portfolio' ? 'creative-tool' : item.type || 'experiment';
  function render() {
    const query = search.value.trim().toLowerCase();
    const matches = items.filter(item => (filter === 'all' || type(item) === filter) && [item.title, item.shortDescription, item.longDescription, ...(item.techStack || []), ...(item.tags || [])].join(' ').toLowerCase().includes(query));
    list.replaceChildren();
    for (const item of matches.slice(0,limit)) {
      const row = document.createElement('article'); row.className = 'atlas-row';
      const intro = document.createElement('div');
      const title = document.createElement('h3'); title.textContent = item.title || item.slug;
      const desc = document.createElement('p'); desc.textContent = item.shortDescription || 'Explore the project repository.';
      intro.append(title,desc);
      const meta = document.createElement('div'); meta.className = 'atlas-meta'; meta.textContent = [item.status || 'prototype', ...(item.techStack || []).slice(0,3)].join(' · ');
      const a = document.createElement('a'); a.textContent = 'Open'; a.setAttribute('aria-label', 'Open ' + title.textContent);
      const url = item.repo || item.liveDemo;
      try { const parsed = new URL(url); if (parsed.protocol !== 'https:') continue; a.href = parsed.href; } catch { continue; }
      row.append(intro,meta,a); list.append(row);
    }
    document.querySelector('#result-count').textContent = `Showing ${Math.min(limit,matches.length)} of ${matches.length} projects`;
    document.querySelector('#empty').hidden = matches.length !== 0;
    more.hidden = matches.length <= limit;
  }
  search.addEventListener('input', () => { limit = 10; render(); });
  filters.forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; filters.forEach(b => b.setAttribute('aria-pressed', String(b === button))); limit = 10; render(); }));
  more.addEventListener('click', () => { limit += 10; render(); });
  fetch('projects.json').then(response => { if (!response.ok) throw new Error('Index unavailable'); return response.json(); }).then(data => {
    const seen = new Set();
    items = data.filter(item => { const key = (item.repo || item.slug || item.title).toLowerCase(); if(seen.has(key)) return false; seen.add(key); return true; }).sort((a,b) => (a.priority || 99) - (b.priority || 99));
    document.querySelector('#atlas-count').textContent = `${items.length} projects, including prototypes and archives. Status labels describe each project’s current scope.`;
    render();
  }).catch(() => { document.querySelector('#atlas-count').textContent = 'The project index could not load. Browse the repositories using the GitHub link in the footer.'; search.disabled = true; filters.forEach(b => b.disabled = true); });
})();
