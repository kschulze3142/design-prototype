/* RobinDock — search autosuggest (Gmail-style) */
(function () {
  'use strict';
  const root = document.getElementById('rdSuggest');
  if (!root) return;

  const input = root.querySelector('.ss-input');
  const clear = root.querySelector('.ss-clear');
  const panel = root.querySelector('.ss-panel');
  const entityHost = root.querySelector('.ss-entity-host');
  const resultsHost = root.querySelector('.ss-results');
  const foot = root.querySelector('.ss-foot');
  const footQ = foot.querySelector('.q');

  /* ---- domain data ---- */
  const patients = [
    { name: 'Bella', sub: 'Golden Retriever · Sarah Mitchell', kind: 'paw', initials: '🐾' },
    { name: 'Luna', sub: 'British Shorthair · Sarah Mitchell', kind: 'paw', initials: '🐾' },
    { name: 'Cosmo', sub: 'Vizsla · Sarah Mitchell', kind: 'paw', initials: '🐾' },
    { name: 'Daisy', sub: 'Labrador · Tom Reed', kind: 'paw', initials: '🐾' },
    { name: 'Cooper', sub: 'Beagle · Dana Ruiz', kind: 'paw', initials: '🐾' }
  ];
  const senders = [
    { name: 'Antech Diagnostics', sub: 'Lab · 1,042 documents', kind: 'sender', initials: 'AD' },
    { name: 'Mountain West Specialists', sub: 'Referral partner · via Flock', kind: 'sender', initials: 'MW' },
    { name: 'Vet Imaging Center', sub: 'Imaging · 274 documents', kind: 'sender', initials: 'VI' },
    { name: 'Idexx', sub: 'Lab · 612 documents', kind: 'sender', initials: 'ID' }
  ];
  const docs = [
    { title: 'CBC Results — Bella', sub: 'Antech Diagnostics · Bella', cloud: '', pages: 1, date: '8:47 AM' },
    { title: 'Referral — Orthopedic consult', sub: 'Mountain West Specialists · via Flock · Bella', cloud: 'violet', pages: 2, date: 'Yesterday' },
    { title: 'Radiology Report — Left stifle', sub: 'Vet Imaging Center · Bella', cloud: 'img', pages: 3, date: 'Yesterday' },
    { title: 'Bloodwork Results — Max', sub: 'Idexx · Max', cloud: '', pages: 3, date: 'May 13' },
    { title: 'Vaccine record — Luna', sub: 'Paws & Claws · via Flock · Luna', cloud: 'aqua', pages: 1, date: 'May 13' },
    { title: 'Lab panel — Senior wellness', sub: 'Antech Diagnostics · Unassigned', cloud: '', pages: 4, date: 'May 12' },
    { title: 'Referral — Cardiology', sub: 'South Mountain Pet Care · via Flock · Cosmo', cloud: 'violet', pages: 2, date: 'May 11' },
    { title: 'Ultrasound report — Abdomen', sub: 'Vet Imaging Center · Oliver', cloud: 'img', pages: 5, date: 'May 10' },
    { title: 'Wellness exam summary', sub: 'Mountain West Vet · Daisy', cloud: 'img', pages: 2, date: 'May 2' }
  ];

  function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function hl(text, q) {
    const e = esc(text);
    if (!q) return e;
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return e.replace(new RegExp('(' + safe + ')', 'ig'), '<b>$1</b>');
  }
  const match = (s, q) => s.toLowerCase().includes(q.toLowerCase());
  const paperclip = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 11l-7.5 7.5a4 4 0 01-5.5-5.5l8-8a2.6 2.6 0 013.7 3.7l-8 8a1.2 1.2 0 01-1.7-1.7l7-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  let activeIdx = -1; // -1 = none; index into selectable rows

  function render() {
    const q = input.value.trim();
    clear.classList.toggle('hide', !q);
    activeIdx = -1;

    /* entity: best patient or sender match */
    let entity = null;
    if (q) {
      entity = patients.find(p => match(p.name, q)) || senders.find(s => match(s.name, q)) || null;
    }
    entityHost.innerHTML = '';
    if (entity) {
      const cls = entity.kind === 'sender' ? 'ss-av sender' : 'ss-av paw';
      const ico = entity.kind === 'sender'
        ? entity.initials
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="10" r="1.8" fill="#223FAA"/><circle cx="10" cy="6.5" r="1.8" fill="#223FAA"/><circle cx="14.5" cy="6.5" r="1.8" fill="#223FAA"/><circle cx="18.5" cy="10" r="1.8" fill="#223FAA"/><path d="M12.3 11c2.4 0 4.4 1.8 4.4 4 0 1.6-1.4 2.4-3 2.4-.8 0-1-.3-1.6-.3s-.8.3-1.6.3c-1.6 0-3-.8-3-2.4 0-2.2 2-4 4.4-4z" fill="#223FAA"/></svg>';
      const row = document.createElement('div');
      row.className = 'ss-row ss-entity';
      row.dataset.sel = '';
      row.innerHTML = '<span class="' + cls + '">' + ico + '</span>' +
        '<div class="ss-main"><div class="ss-name">' + hl(entity.name, q) + '</div>' +
        '<div class="ss-sub">' + hl(entity.sub, q) + '</div></div>';
      entityHost.appendChild(row);
    }

    /* document results */
    let list, label;
    if (q) {
      list = docs.filter(d => match(d.title, q) || match(d.sub, q)).slice(0, 5);
      label = '';
    } else {
      list = docs.slice(0, 4);
      label = 'Recent';
    }
    resultsHost.innerHTML = label ? '<div class="ss-sectlbl">' + label + '</div>' : '';
    list.forEach(d => {
      const row = document.createElement('div');
      row.className = 'ss-row';
      row.dataset.sel = '';
      row.innerHTML =
        '<span class="ss-tile ' + d.cloud + '"></span>' +
        '<div class="ss-main"><div class="ss-title">' + hl(d.title, q) + '</div>' +
        '<div class="ss-sub">' + hl(d.sub, q) + '</div></div>' +
        '<div class="ss-meta">' + paperclip + '<span>' + d.date + '</span></div>';
      row.addEventListener('click', () => { input.value = d.title.replace(/—.*/, '').trim() || d.title; render(); input.focus(); });
      resultsHost.appendChild(row);
    });

    if (q && !entity && list.length === 0) {
      resultsHost.innerHTML = '<div class="ss-empty">No matches for “' + esc(q) + '”. Press ENTER to search everything.</div>';
    }

    footQ.innerHTML = q
      ? 'All results for <b>“' + esc(q) + '”</b>'
      : 'Search documents, patients &amp; senders';
  }

  function selectable() { return [...root.querySelectorAll('[data-sel]'), foot]; }
  function setActive(i) {
    const rows = selectable();
    rows.forEach(r => r.classList.remove('active'));
    activeIdx = (i + rows.length) % rows.length;
    rows[activeIdx].classList.add('active');
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', () => root.classList.add('open'));
  input.addEventListener('keydown', e => {
    const rows = selectable();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx - 1); }
    else if (e.key === 'Enter') {
      if (activeIdx >= 0 && rows[activeIdx] !== foot) rows[activeIdx].click();
    } else if (e.key === 'Escape') { input.value = ''; render(); }
  });
  clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });

  /* demo: chips toggle */
  root.querySelectorAll('.ss-chip').forEach(c =>
    c.addEventListener('click', () => c.classList.toggle('on')));

  render();
  root.classList.add('open'); // keep dropdown visible in the doc
})();
