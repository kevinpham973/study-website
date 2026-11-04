(() => {
  const pages = window.STUDY_PAGES;
  const byId = new Map(pages.map(page => [page.id, page]));
  const nav = document.querySelector('#navigation');
  const input = document.querySelector('#search');
  const lesson = document.querySelector('#lesson');
  const complete = document.querySelector('#complete');
  const groups = ['Overview', 'Design Pattern', '1. creational', '2. structural', '3. behavioral', 'Cloud Database'];
  let read = new Set();
  try { read = new Set(JSON.parse(localStorage.getItem('architecture-read') || '[]')); } catch {}
  let current;
  const label = page => page.code ? `↳ ${page.title}` : page.title.replace(/^My Design Patterns Tutorial$/, 'Design Patterns');
  function navigate() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
    current = byId.get(id || 'README.md');
    if (!current) {
      current = byId.get('README.md');
      history.replaceState(null, '', '#README.md');
    }
    lesson.innerHTML = current.html;
    document.title = `${current.title} · Study Library`;
    document.querySelector('#category').textContent = current.group.replace(/^\d\. /, '');
    document.querySelector('#reading-time').textContent = current.code ? 'PYTHON EXAMPLE' : `${Math.max(1, Math.ceil(current.text.split(/\s+/).length / 200))} MIN READ`;
    complete.setAttribute('aria-pressed', String(read.has(current.id)));
    complete.textContent = read.has(current.id) ? '✓ Read' : '○ Mark as read';
    lesson.querySelectorAll('table').forEach(table => {
      const wrapper = document.createElement('div'); wrapper.className = 'table-scroll';
      table.before(wrapper); wrapper.append(table);
    });
    lesson.querySelectorAll('pre').forEach(pre => {
      const button = document.createElement('button'); button.className = 'copy-code'; button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy example');
      button.onclick = async () => {
        try { await navigator.clipboard.writeText(pre.querySelector('code').textContent); button.textContent = 'Copied'; }
        catch { button.textContent = 'Select text to copy'; }
      };
      pre.append(button);
    });
    const ordered = pages.filter(page => !page.code);
    const index = ordered.findIndex(page => page.id === current.id);
    [['previous', ordered[index - 1], '← PREVIOUS'], ['next', ordered[index + 1], 'NEXT →']].forEach(([elementId, page, text]) => {
      const anchor = document.getElementById(elementId); anchor.replaceChildren();
      anchor.hidden = !page || index < 0;
      if (page && index >= 0) {
        anchor.href = '#' + encodeURI(page.id);
        const small = document.createElement('small'); small.textContent = text;
        anchor.append(small, document.createTextNode(page.title));
      } else anchor.removeAttribute('href');
    });
    document.body.classList.remove('menu-open'); document.querySelector('#menu').setAttribute('aria-expanded', 'false');
    renderNav(); window.scrollTo(0, 0);
  }
  function renderNav() {
    const query = input.value.trim().toLowerCase(); nav.replaceChildren(); let found = 0;
    for (const group of groups) {
      const matches = pages.filter(page => page.group === group && (!query || `${page.title} ${page.text}`.toLowerCase().includes(query)));
      if (!matches.length) continue;
      const heading = document.createElement('div'); heading.className = 'nav-group'; heading.textContent = group; nav.append(heading);
      for (const page of matches) {
        found++;
        const anchor = document.createElement('a'); anchor.href = '#' + encodeURI(page.id);
        anchor.className = 'nav-link' + (page.code ? ' code' : '') + (page.id === current?.id ? ' active' : '');
        if (page.id === current?.id) anchor.setAttribute('aria-current', 'page');
        if (read.has(page.id)) { const dot = document.createElement('span'); dot.className = 'read-dot'; dot.textContent = '✓'; anchor.append(dot); }
        anchor.append(document.createTextNode(label(page))); nav.append(anchor);
      }
    }
    document.querySelector('#search-status').textContent = query ? `${found} matching pages` : '';
  }
  input.addEventListener('input', renderNav);
  complete.onclick = () => {
    read.has(current.id) ? read.delete(current.id) : read.add(current.id);
    try { localStorage.setItem('architecture-read', JSON.stringify([...read])); } catch {}
    complete.setAttribute('aria-pressed', String(read.has(current.id))); complete.textContent = read.has(current.id) ? '✓ Read' : '○ Mark as read'; renderNav();
  };
  document.querySelector('#menu').onclick = () => {
    const open = document.body.classList.toggle('menu-open'); document.querySelector('#menu').setAttribute('aria-expanded', String(open));
  };
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { document.body.classList.remove('menu-open'); document.querySelector('#menu').setAttribute('aria-expanded', 'false'); } });
  window.addEventListener('hashchange', navigate); navigate();
})();
