/* ============================================================
   RobinDock — Clients prototype · CONTROLLER
   Router (list · detail · patient stub · case stub) + search +
   access-logged toasts + edit modals + shell chrome.
   Renders into the existing app shell. Mock data only.
   ============================================================ */
(function () {
  'use strict';

  var CLIENTS = window.RD_CLIENTS || [];
  var content = document.getElementById('appContent');
  var titleEl = document.getElementById('appTitle');

  /* ---------------- icons ---------------- */
  var ICON = {
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    homeSm: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    paw: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="10" r="1.8" fill="currentColor"/><circle cx="10" cy="6.5" r="1.8" fill="currentColor"/><circle cx="14.5" cy="6.5" r="1.8" fill="currentColor"/><circle cx="18.5" cy="10" r="1.8" fill="currentColor"/><path d="M12.3 11c2.4 0 4.4 1.8 4.4 4 0 1.6-1.4 2.4-3 2.4-.8 0-1-.3-1.6-.3s-.8.3-1.6.3c-1.6 0-3-.8-3-2.4 0-2.2 2-4 4.4-4z" fill="currentColor"/></svg>',
    shield: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#838599" stroke-width="1.8"/><path d="M16 16l4 4" stroke="#838599" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.7"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 4h3l1.5 4-2 1.2a11 11 0 0 0 4.3 4.3L18 15l1 3v2a1 1 0 0 1-1 1A14 14 0 0 1 4 7a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    mail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M5 8l7 5 7-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    logged: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    saved: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cases: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 7a2 2 0 012-2h3l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    inbox: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 13l2.5-7A2 2 0 018.4 4.6h7.2A2 2 0 0117.5 6L20 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13h4l1.5 2.5h5L16 13h4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function ts(iso) { return iso ? (Date.parse(iso + 'T00:00:00') || 0) : 0; }
  function digits(s) { return String(s).replace(/\D/g, ''); }

  function highlight(text, q) {
    if (!q) return esc(text);
    var lt = String(text).toLowerCase(), lq = q.toLowerCase();
    var i = lt.indexOf(lq);
    if (i < 0) return esc(text);
    var out = '', idx = 0;
    while (i >= 0) {
      out += esc(String(text).slice(idx, i)) + '<span class="hl">' + esc(String(text).slice(i, i + q.length)) + '</span>';
      idx = i + q.length;
      i = lt.indexOf(lq, idx);
    }
    return out + esc(String(text).slice(idx));
  }

  function findPatient(id) {
    for (var i = 0; i < CLIENTS.length; i++)
      for (var j = 0; j < CLIENTS[i].patients.length; j++)
        if (CLIENTS[i].patients[j].id === id) return { p: CLIENTS[i].patients[j], c: CLIENTS[i] };
    return null;
  }
  function findCase(id) {
    for (var i = 0; i < CLIENTS.length; i++)
      for (var j = 0; j < CLIENTS[i].cases.length; j++)
        if (CLIENTS[i].cases[j].id === id) return { k: CLIENTS[i].cases[j], c: CLIENTS[i] };
    return null;
  }
  function patientByName(c, name) {
    for (var i = 0; i < c.patients.length; i++) if (c.patients[i].name === name) return c.patients[i];
    return null;
  }

  /* ---------------- access-logged toast ---------------- */
  var toastWrap = document.getElementById('logToasts');
  function toast(title, sub, kind) {
    var el = document.createElement('div');
    el.className = 'logtoast';
    var ic = kind === 'save' ? ICON.saved : ICON.logged;
    el.innerHTML = '<span class="lic">' + ic + '</span><div><div class="lt">' + esc(title) + '</div>' +
      (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>';
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 280); }, 2600);
    // cap stack
    while (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  }
  function logAccess(sub) { toast('Access logged', sub, 'log'); }

  /* ============================================================
     LIST STATE + SEARCH
     ============================================================ */
  var listState = { q: '', sort: 'name', openOnly: false };
  var lastLoggedQuery = '';
  var searchLogTimer = null;

  function clientMatch(c, q) {
    if (!q) return { ok: true, pats: [] };
    var lq = q.toLowerCase(), dq = digits(q);
    var pats = [];
    c.patients.forEach(function (p) { if (p.name.toLowerCase().indexOf(lq) >= 0) pats.push(p.id); });
    var nameHit = c.name.toLowerCase().indexOf(lq) >= 0;
    var sigHit = [c.signers.primary].concat(c.signers.secondary).some(function (s) {
      return s.name.toLowerCase().indexOf(lq) >= 0;
    });
    var phoneHit = dq.length >= 3 && (digits(c.phone).indexOf(dq) >= 0 ||
      [c.signers.primary].concat(c.signers.secondary).some(function (s) { return digits(s.phone).indexOf(dq) >= 0; }));
    return { ok: nameHit || sigHit || phoneHit || pats.length > 0, pats: pats };
  }

  function filteredClients() {
    var q = listState.q.trim();
    var rows = [];
    CLIENTS.forEach(function (c) {
      var m = clientMatch(c, q);
      if (!m.ok) return;
      if (listState.openOnly && c.openTasks <= 0) return;
      rows.push({ c: c, matched: m.pats });
    });
    rows.sort(function (a, b) {
      if (listState.sort === 'activity') return ts(b.c.lastActivity) - ts(a.c.lastActivity);
      if (listState.sort === 'patients') return b.c.patientCount - a.c.patientCount || a.c.name.localeCompare(b.c.name);
      return a.c.name.localeCompare(b.c.name) || a.c.location.localeCompare(b.c.location);
    });
    return rows;
  }

  /* preview: most-recently-active first; pull matched patients forward */
  function previewPatients(c, matched, q) {
    var list = c.patients.slice().sort(function (a, b) { return ts(b.lastCase) - ts(a.lastCase); });
    if (q && matched.length) {
      list.sort(function (a, b) {
        var am = matched.indexOf(a.id) >= 0 ? 0 : 1, bm = matched.indexOf(b.id) >= 0 ? 0 : 1;
        return am - bm;
      });
    }
    return list;
  }

  function rosterRowHTML(row) {
    var c = row.c, q = listState.q.trim();
    var dim = c.status !== 'active' ? ' dim' : '';
    // household cell
    var statusMini = c.status !== 'active'
      ? '<span class="acct-mini">' + esc(c.status) + '</span>' : '';
    var hh = '<div class="hh">' +
      '<div class="nm"><span class="home">' + ICON.homeSm + '</span>' + highlight(c.name, q) + statusMini + '</div>' +
      '<div class="sig">' + highlight(c.signers.primary.name, q) +
        '<span class="dot"></span><span class="ph">' + highlight(c.signers.primary.phone, q) + '</span>' +
        '<span class="dot"></span><span class="acctid">' + esc(c.accountId) + '</span></div>' +
      '</div>';

    // patient preview
    var prev = previewPatients(c, row.matched, q);
    var show = prev.slice(0, 3), extra = prev.length - show.length;
    var pv;
    if (c.patientCount === 0) {
      pv = '<span class="ppreview"><span class="none">No patients</span></span>';
    } else {
      var parts = show.map(function (p) {
        var dead = p.status === 'deceased' ? ' dead' : '';
        return '<span class="pl' + dead + '" data-patient="' + p.id + '" title="Open ' + esc(p.name) + '">' + highlight(p.name, q) + '</span>';
      });
      var inner = parts.join('<span class="sepd"></span>');
      if (extra > 0) inner += '<span class="sepd"></span><span class="more">+' + extra + ' more</span>';
      pv = '<span class="ppreview">' + inner + '</span>';
    }
    var pvCell = pv + '<div style="margin-top:5px"><span class="pcount">' +
      c.patientCount + (c.patientCount === 1 ? ' patient' : ' patients') + '</span></div>';

    // activity
    var act = c.openTasks > 0
      ? '<span class="act-ind"><span class="d"></span>' + c.openTasks + ' open</span>'
      : '<span class="act-ind none">—</span>';

    return '<tr class="' + dim.trim() + '" data-client="' + c.id + '">' +
      '<td>' + hh + '</td>' +
      '<td>' + pvCell + '</td>' +
      '<td>' + act + '</td>' +
      '<td class="mono" style="font-family:var(--f-mono);font-size:12px;color:var(--gray-500)">' + fmtDate(c.lastActivity) + '</td>' +
      '<td class="right" style="color:var(--gray-300)">' + ICON.chev + '</td>' +
      '</tr>';
  }

  function refreshRoster() {
    var mount = document.getElementById('rosterMount');
    if (!mount) return;
    var rows = filteredClients();
    var q = listState.q.trim();

    // count line
    var countEl = document.getElementById('clCount');
    if (countEl) countEl.innerHTML = '<b>' + rows.length + '</b> ' + (rows.length === 1 ? 'household' : 'households') +
      (q ? ' matching “' + esc(q) + '”' : '') + (listState.openOnly ? ' · open tasks only' : '');

    if (!rows.length) {
      var empty = q
        ? { h: 'No matching households', p: 'No client, signer, phone or patient matched “' + esc(q) + '”. Check spelling or try a patient name.' }
        : { h: 'No households', p: 'There are no client households to show with the current filter.' };
      mount.innerHTML = '<div class="ctable"><div class="ct-empty"><div class="ico">' + ICON.search +
        '</div><h4>' + empty.h + '</h4><p>' + empty.p + '</p></div></div>';
      return;
    }

    var body = rows.map(rosterRowHTML).join('');
    mount.innerHTML =
      '<div class="ctable roster">' +
        '<table class="ct"><thead><tr>' +
          '<th>Household · Primary signer</th>' +
          '<th>Patients</th>' +
          '<th>Open tasks</th>' +
          '<th>Last activity</th>' +
          '<th class="right"></th>' +
        '</tr></thead><tbody>' + body + '</tbody></table>' +
      '</div>';

    // debounced "search resolved records" log
    if (q.length >= 2 && rows.length && q !== lastLoggedQuery) {
      clearTimeout(searchLogTimer);
      searchLogTimer = setTimeout(function () {
        lastLoggedQuery = q;
        logAccess('Search resolved ' + rows.length + ' record' + (rows.length === 1 ? '' : 's'));
      }, 900);
    }
  }

  function renderList() {
    titleEl.textContent = 'Clients';
    var seg = function (key, label) {
      return '<div class="seg' + (listState.sort === key ? ' on' : '') + '" data-sort="' + key + '">' + label + '</div>';
    };
    content.innerHTML =
      '<div class="cl-page">' +
        '<div class="cl-head"><h1>Clients</h1>' +
          '<div class="sub">Look up a household, signer or patient. A role-gated reference surface — record access is logged.</div></div>' +

        '<div class="cl-hero"><div class="in">' +
          '<div class="lbl">Find a household or patient</div>' +
          '<div class="searchbar">' + ICON.search +
            '<input id="clSearch" placeholder="Search households, signers, phone, or a patient name…" autocomplete="off" />' +
            '<span class="clearx" id="clClear" style="display:none">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>' +
          '</div>' +
          '<div class="hint">Patient-aware — typing <b>Bella</b> surfaces every household that owns a patient named Bella.</div>' +
        '</div></div>' +

        '<div class="cl-toolbar">' +
          '<div class="count" id="clCount"></div>' +
          '<div class="right">' +
            '<span class="sortlbl">Sort</span>' +
            '<div class="segs" id="clSort">' + seg('name', 'Name') + seg('activity', 'Last activity') + seg('patients', 'Patients') + '</div>' +
            '<div class="fdrop' + (listState.openOnly ? ' active' : '') + '" id="clOpen"><span class="lbl">Filter</span> Has open tasks <span class="ch">▾</span></div>' +
          '</div>' +
        '</div>' +

        '<div id="rosterMount"></div>' +
      '</div>';

    // bind search
    var inp = document.getElementById('clSearch');
    inp.value = listState.q;
    document.getElementById('clClear').style.display = listState.q ? 'flex' : 'none';
    inp.addEventListener('input', function () {
      listState.q = inp.value;
      document.getElementById('clClear').style.display = inp.value ? 'flex' : 'none';
      if (!inp.value) lastLoggedQuery = '';
      refreshRoster();
    });
    document.getElementById('clClear').addEventListener('click', function () {
      listState.q = ''; inp.value = ''; lastLoggedQuery = '';
      document.getElementById('clClear').style.display = 'none';
      inp.focus(); refreshRoster();
    });
    document.getElementById('clSort').addEventListener('click', function (e) {
      var s = e.target.closest('[data-sort]'); if (!s) return;
      listState.sort = s.dataset.sort;
      this.querySelectorAll('.seg').forEach(function (x) { x.classList.toggle('on', x.dataset.sort === listState.sort); });
      refreshRoster();
    });
    document.getElementById('clOpen').addEventListener('click', function () {
      listState.openOnly = !listState.openOnly;
      this.classList.toggle('active', listState.openOnly);
      refreshRoster();
    });

    refreshRoster();
  }

  /* ============================================================
     DETAIL
     ============================================================ */
  var currentClient = null;
  var caseSort = { key: 'date', dir: 'desc' };

  function patientsTableHTML(c) {
    if (!c.patients.length) {
      return '<div class="ct-empty"><div class="ico">' + ICON.paw + '</div>' +
        '<h4>No patients yet</h4><p>This household has no patients on record. Add the first patient to begin.</p></div>';
    }
    var rows = c.patients.slice().sort(function (a, b) {
      var ad = a.status === 'deceased' ? 1 : 0, bd = b.status === 'deceased' ? 1 : 0;
      if (ad !== bd) return ad - bd;
      return ts(b.lastCase) - ts(a.lastCase);
    });
    var body = rows.map(function (p) {
      var dead = p.status === 'deceased';
      var pawColor = dead ? 'var(--gray-400)' : 'var(--blue-600)';
      var pawBg = dead ? 'var(--gray-100)' : 'var(--blue-50)';
      var ins = p.insurer
        ? '<span class="ins-cell"><span style="color:var(--violet-600)">' + ICON.shield + '</span>' + esc(p.insurer) + '</span>'
        : '<span class="ins-none">None</span>';
      var act = p.openTasks > 0
        ? '<span class="act-ind"><span class="d"></span>' + p.openTasks + ' open</span>'
        : '<span class="act-ind none">—</span>';
      return '<tr class="' + (dead ? 'dead' : '') + '" data-patient="' + p.id + '">' +
        '<td><div class="pcell"><span class="paw" style="background:' + pawBg + ';color:' + pawColor + '">' + ICON.paw + '</span>' +
          '<span class="pn">' + esc(p.name) + '</span>' + (dead ? '<span class="deadtag">Deceased</span>' : '') + '</div></td>' +
        '<td>' + esc(p.species) + ' · ' + esc(p.breed) + '</td>' +
        '<td>' + esc(p.sex) + ' · ' + esc(p.age) + '</td>' +
        '<td>' + ins + '</td>' +
        '<td>' + fmtDate(p.lastCase) + '</td>' +
        '<td>' + act + '</td>' +
        '</tr>';
    }).join('');
    return '<table class="ct"><thead><tr>' +
      '<th>Patient</th><th>Species · Breed</th><th>Sex · Age</th><th>Insurance</th><th>Last case</th><th>Activity</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table>';
  }

  function renderCasesInto(mount, c) {
    if (!c.cases.length) {
      mount.innerHTML = '<div class="ct-empty"><div class="ico">' + ICON.cases.replace('width="26" height="26"', 'width="22" height="22"') +
        '</div><h4>No cases yet</h4><p>No communication threads involve this household. Cases appear here as they are opened.</p></div>';
      return;
    }
    var rank = { 'open': 0, 'in progress': 1, 'complete': 2, 'archived': 3 };
    var rows = c.cases.slice().sort(function (a, b) {
      var d = 0;
      if (caseSort.key === 'status') d = rank[a.status] - rank[b.status];
      else d = ts(b.date) - ts(a.date);
      if (caseSort.dir === 'desc' && caseSort.key === 'status') d = -d;
      if (caseSort.key === 'date' && caseSort.dir === 'asc') d = -d;
      return d || ts(b.date) - ts(a.date);
    });
    var statusChip = function (s) {
      var cls = { 'open': 'open', 'in progress': 'inprog', 'complete': 'complete', 'archived': 'archived' }[s] || 'open';
      var label = s.charAt(0).toUpperCase() + s.slice(1);
      return '<span class="st ' + cls + '"><span class="d"></span>' + label + '</span>';
    };
    var arrow = function (key) {
      if (caseSort.key !== key) return '';
      return '<span class="ar">' + (caseSort.dir === 'desc' ? '▼' : '▲') + '</span>';
    };
    var body = rows.map(function (k) {
      var pats = k.patients.map(function (nm) {
        var p = patientByName(c, nm);
        return p ? '<span class="pl" data-patient="' + p.id + '">' + esc(nm) + '</span>' : esc(nm);
      }).join('<span class="amp">&amp;</span>');
      return '<tr data-case="' + k.id + '">' +
        '<td><div style="font-weight:600;color:var(--gray-950)">' + esc(k.subject) + '</div>' +
          '<div style="font-family:var(--f-mono);font-size:11px;color:var(--gray-400);margin-top:3px">' + esc(k.id) + '</div></td>' +
        '<td><span class="pmulti">' + pats + '</span></td>' +
        '<td>' + statusChip(k.status) + '</td>' +
        '<td>' + esc(k.other) + '</td>' +
        '<td class="sortth" style="font-family:var(--f-mono);font-size:12px;color:var(--gray-500)">' + fmtDate(k.date) + '</td>' +
        '</tr>';
    }).join('');
    mount.innerHTML = '<table class="ct"><thead><tr>' +
      '<th>Case · ID</th><th>Patient(s) involved</th>' +
      '<th class="sortth" data-sortcase="status">Status' + arrow('status') + '</th>' +
      '<th>Other party</th>' +
      '<th class="sortth" data-sortcase="date">Date' + arrow('date') + '</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table>' +
      '<div class="refnote">' + ICON.logged + 'Reference only — open a case to view it. Cases are worked in the Cases workspace, not from here.</div>';
  }

  function signersHTML(c) {
    var pr = c.signers.primary;
    var initials = function (n) { return n.split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); };
    var primary = '<div class="signer primary">' +
      '<span class="av blue" style="--av:42px">' + initials(pr.name) + '</span>' +
      '<div class="sm"><div class="sn">' + esc(pr.name) + '<span class="rel lead">' + esc(pr.relationship) + '</span></div>' +
        '<div class="contact"><span class="c mono">' + ICON.phone + esc(pr.phone) + '</span>' +
          '<span class="c">' + ICON.mail + esc(pr.email) + '</span></div></div>' +
      '<span class="rowedit" data-action="edit-signer" data-arg="primary">Edit</span>' +
    '</div>';
    var secondary = c.signers.secondary.map(function (s, i) {
      return '<div class="signer">' +
        '<span class="av" style="--av:42px">' + initials(s.name) + '</span>' +
        '<div class="sm"><div class="sn">' + esc(s.name) + '<span class="rel sec">' + esc(s.relationship) + '</span></div>' +
          '<div class="contact"><span class="c mono">' + ICON.phone + esc(s.phone) + '</span>' +
            '<span class="c">' + ICON.mail + esc(s.email) + '</span></div></div>' +
        '<span class="rowedit" data-action="edit-signer" data-arg="sec' + i + '">Edit</span>' +
      '</div>';
    }).join('');
    return primary + secondary +
      '<div class="signer-foot"><span class="addlink" data-action="add-signer">' + ICON.plus + 'Add a signer</span></div>';
  }

  function statusBadge(s) {
    var label = s.charAt(0).toUpperCase() + s.slice(1);
    return '<span class="acct-status ' + s + '"><span class="d"></span>' + label + '</span>';
  }

  function renderDetail(c) {
    currentClient = c;
    caseSort = { key: 'date', dir: 'desc' };
    titleEl.textContent = c.name;

    content.innerHTML =
      '<div class="cl-page">' +
        '<span class="cd-back" data-back>' + ICON.back + 'All clients</span>' +

        /* identity header */
        '<div class="cd-id"><div class="in">' +
          '<span class="big">' + ICON.home + '</span>' +
          '<div class="meta"><h1>' + esc(c.name) + ' ' + statusBadge(c.status) + '</h1>' +
            '<div class="line"><span class="id">' + esc(c.accountId) + '</span>' +
              '<span class="dot"></span>' + esc(c.location) +
              '<span class="dot"></span>Created ' + fmtDate(c.created) +
              '<span class="dot"></span>Last activity ' + fmtDate(c.lastActivity) + '</div></div>' +
          '<div class="actions">' +
            '<button class="btn btn-light btn-sm" data-action="edit-account">' + ICON.edit + 'Edit account</button>' +
            '<button class="btn btn-blue btn-sm" data-action="add-patient">' + ICON.plus + 'Add patient</button>' +
          '</div>' +
        '</div></div>' +

        /* household info + signers */
        '<div class="cd-grid">' +
          '<div class="ctable"><div class="ct-head"><h3>Household information</h3>' +
            '<span class="linkmuted" data-action="edit-account">Edit</span></div>' +
            '<div class="infoblock">' +
              '<div class="f full"><div class="k">Address</div><div class="v">' + esc(c.address) + '</div></div>' +
              '<div class="f"><div class="k">Primary phone</div><div class="v mono">' + esc(c.phone) + '</div></div>' +
              '<div class="f"><div class="k">Email</div><div class="v">' + esc(c.email) + '</div></div>' +
              '<div class="f"><div class="k">Account created</div><div class="v">' + fmtDate(c.created) + '</div></div>' +
              '<div class="f"><div class="k">Last activity</div><div class="v">' + fmtDate(c.lastActivity) + '</div></div>' +
            '</div>' +
            '<div class="refnote" style="border-radius:0">' + ICON.shield + 'Insurance is tracked per patient — see the Patients table below.</div>' +
          '</div>' +
          '<div class="ctable"><div class="ct-head"><h3>Signers <span class="c">(' + (1 + c.signers.secondary.length) + ')</span></h3></div>' +
            '<div class="signers">' + signersHTML(c) + '</div>' +
          '</div>' +
        '</div>' +

        /* patients */
        '<div class="ctable" style="margin-bottom:22px"><div class="ct-head">' +
          '<h3>Patients <span class="c">(' + c.patientCount + ')</span></h3>' +
          '<span class="act" data-action="add-patient">' + ICON.plus + 'Add patient</span></div>' +
          patientsTableHTML(c) +
        '</div>' +

        /* cases */
        '<div class="ctable"><div class="ct-head">' +
          '<h3>Cases <span class="c">(' + c.cases.length + ')</span></h3>' +
          '<span style="font-size:12px;color:var(--gray-400);font-weight:600">Reference · view only</span></div>' +
          '<div id="casesMount"></div>' +
        '</div>' +
      '</div>';

    renderCasesInto(document.getElementById('casesMount'), c);
    logAccess('Opened ' + c.name + ' · ' + c.accountId);
  }

  /* ============================================================
     STUBS (Patient Detail / Case Detail not built)
     ============================================================ */
  function renderPatientStub(id) {
    var f = findPatient(id);
    if (!f) return renderNotFound();
    var p = f.p, c = f.c;
    titleEl.textContent = p.name;
    content.innerHTML =
      '<div class="cl-page"><span class="cd-back" data-client="' + c.id + '">' + ICON.back + 'Back to ' + esc(c.name) + '</span>' +
        '<div class="stub"><div class="ic">' + ICON.paw + '</div>' +
          '<h1>' + esc(p.name) + '</h1>' +
          '<div class="badge">Patient Detail — stub</div>' +
          '<p>The full Patient Detail surface is a separate screen, out of scope for this prototype. Here is the record this row resolves to.</p>' +
          '<div class="ctable kvs"><table class="ct kvtable"><tbody>' +
            '<tr><td class="k">Household</td><td class="v">' + esc(c.name) + ' · ' + esc(c.accountId) + '</td></tr>' +
            '<tr><td class="k">Species · Breed</td><td class="v">' + esc(p.species) + ' · ' + esc(p.breed) + '</td></tr>' +
            '<tr><td class="k">Sex · Age</td><td class="v">' + esc(p.sex) + ' · ' + esc(p.age) + '</td></tr>' +
            '<tr><td class="k">Insurance</td><td class="v">' + (p.insurer ? esc(p.insurer) : 'None') + '</td></tr>' +
          '</tbody></table></div>' +
          '<div class="eactions"><button class="btn btn-light" data-client="' + c.id + '">Back to household</button></div>' +
        '</div></div>';
    logAccess('Opened patient ' + p.name + ' · ' + c.name);
  }

  function renderCaseStub(id) {
    var f = findCase(id);
    if (!f) return renderNotFound();
    var k = f.k, c = f.c;
    titleEl.textContent = k.id;
    content.innerHTML =
      '<div class="cl-page"><span class="cd-back" data-client="' + c.id + '">' + ICON.back + 'Back to ' + esc(c.name) + '</span>' +
        '<div class="stub"><div class="ic">' + ICON.cases.replace('width="26" height="26"', 'width="28" height="28"') + '</div>' +
          '<h1>' + esc(k.subject) + '</h1>' +
          '<div class="badge">Case Detail — stub</div>' +
          '<p>Cases are worked in the Cases workspace. From the Client lens this is reference only — this is the thread the row points to.</p>' +
          '<div class="ctable kvs"><table class="ct kvtable"><tbody>' +
            '<tr><td class="k">Case ID</td><td class="v"><span class="mono">' + esc(k.id) + '</span></td></tr>' +
            '<tr><td class="k">Patient(s)</td><td class="v">' + esc(k.patients.join(', ')) + '</td></tr>' +
            '<tr><td class="k">Status</td><td class="v">' + esc(k.status.charAt(0).toUpperCase() + k.status.slice(1)) + '</td></tr>' +
            '<tr><td class="k">Other party</td><td class="v">' + esc(k.other) + '</td></tr>' +
            '<tr><td class="k">Last activity</td><td class="v">' + fmtDate(k.date) + '</td></tr>' +
          '</tbody></table></div>' +
          '<div class="eactions"><button class="btn btn-light" data-client="' + c.id + '">Back to household</button></div>' +
        '</div></div>';
    logAccess('Opened case ' + k.id + ' · ' + c.name);
  }

  function renderNotFound() {
    titleEl.textContent = 'Not found';
    content.innerHTML = '<div class="cl-page"><div class="stub"><div class="ic">' + ICON.search + '</div>' +
      '<h1>Record not found</h1><p>That record could not be resolved.</p>' +
      '<div class="eactions"><button class="btn btn-blue" data-back>Back to clients</button></div></div></div>';
  }

  function renderPlaceholder(name, icon, sub) {
    titleEl.textContent = name;
    content.innerHTML = '<div class="cl-page"><div class="cl-head"><h1>' + esc(name) + '</h1>' +
      '<div class="sub">' + esc(sub) + '</div></div>' +
      '<div class="placeholder"><div class="pic">' + icon + '</div>' +
      '<h2>' + esc(name) + ' — not part of this prototype</h2>' +
      '<p>This prototype focuses on the Client List and Client Detail surfaces. Other workspaces are stubbed here.</p></div></div>';
  }

  /* ============================================================
     EDIT MODALS (chosen pattern: modal — see requirements §3.8)
     ============================================================ */
  function field(label, val, ph) {
    return '<div class="field" style="max-width:none"><span class="lab">' + esc(label) + '</span>' +
      '<input class="input" value="' + esc(val || '') + '" placeholder="' + esc(ph || '') + '" /></div>';
  }
  function openModal(title, bodyHTML, saveLabel, onSave) {
    var scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.style.position = 'fixed';
    scrim.style.zIndex = '130';
    scrim.innerHTML = '<div class="modal" style="width:min(460px,92%)">' +
      '<div class="mh"><h3>' + esc(title) + '</h3></div>' +
      '<div class="mb"><div style="display:flex;flex-direction:column;gap:14px">' + bodyHTML + '</div></div>' +
      '<div class="mf"><button class="btn btn-light" data-mclose>Cancel</button>' +
      '<button class="btn btn-blue" data-msave>' + esc(saveLabel || 'Save') + '</button></div></div>';
    document.body.appendChild(scrim);
    function close() { scrim.remove(); }
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim || e.target.closest('[data-mclose]')) close();
      else if (e.target.closest('[data-msave]')) { close(); if (onSave) onSave(); }
    });
  }

  function doAction(action, arg) {
    var c = currentClient;
    if (action === 'edit-account' && c) {
      openModal('Edit account', field('Household name', c.name) + field('Address', c.address) +
        field('Primary phone', c.phone) + field('Email', c.email), 'Save changes',
        function () { toast('Saved', 'Prototype — changes are not persisted', 'save'); });
    } else if (action === 'add-patient') {
      openModal('Add patient', field('Patient name', '', 'e.g. Bella') +
        field('Species · Breed', '', 'e.g. Canine · Labrador') + field('Sex · Age', '', 'e.g. FS · 4y') +
        field('Insurer (optional)', '', 'Leave blank if none'), 'Add patient',
        function () { toast('Patient added', 'Prototype — not persisted', 'save'); });
    } else if (action === 'add-signer') {
      openModal('Add signer', field('Name') + field('Phone') + field('Email') + field('Relationship', '', 'e.g. Spouse'),
        'Add signer', function () { toast('Signer added', 'Prototype — not persisted', 'save'); });
    } else if (action === 'edit-signer' && c) {
      var s = arg === 'primary' ? c.signers.primary : c.signers.secondary[parseInt(arg.slice(3), 10)];
      if (!s) return;
      openModal('Edit signer', field('Name', s.name) + field('Phone', s.phone) + field('Email', s.email) +
        field('Relationship', s.relationship), 'Save changes',
        function () { toast('Saved', 'Prototype — not persisted', 'save'); });
    }
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  function setActiveNav(navKey) {
    document.querySelectorAll('.nav-i').forEach(function (n) { n.classList.remove('on'); });
    if (navKey) {
      var a = document.querySelector('.nav-i[data-nav="' + navKey + '"]');
      if (a) a.classList.add('on');
    }
  }

  function render() {
    var path = location.hash.replace(/^#/, '') || '/clients';
    var m;
    content.scrollTop = 0;
    if (content.parentElement) content.parentElement.scrollTop = 0;

    if (path === '/clients' || path === '/') { setActiveNav('clients'); renderList(); }
    else if ((m = path.match(/^\/clients\/(.+)$/))) {
      var c = CLIENTS.filter(function (x) { return x.id === m[1]; })[0];
      setActiveNav('clients');
      if (c) renderDetail(c); else renderNotFound();
    }
    else if ((m = path.match(/^\/patient\/(.+)$/))) {
      setActiveNav('clients');
      if (typeof window.renderPatientDetail === 'function') window.renderPatientDetail(m[1]);
      else renderPatientStub(m[1]);
    }
    else if ((m = path.match(/^\/case\/(.+)$/))) { setActiveNav('clients'); renderCaseStub(m[1]); }
    else if (path === '/cases') { setActiveNav('cases'); renderPlaceholder('Cases', ICON.cases, 'Your actionable home — active patient cases and documents.'); }
    else if (path === '/intake') { setActiveNav('intake'); renderPlaceholder('Intake', ICON.inbox, 'Incoming faxes, labs and referrals waiting to be triaged.'); }
    else { setActiveNav(null); renderPlaceholder('Workspace', ICON.cases, 'Not part of this prototype.'); }

    document.title = 'RobinDock — ' + titleEl.textContent;
  }

  /* navigation via delegation */
  content.addEventListener('click', function (e) {
    var p = e.target.closest('[data-patient]'); if (p) { location.hash = '#/patient/' + p.dataset.patient; return; }
    var k = e.target.closest('[data-case]'); if (k) { location.hash = '#/case/' + encodeURIComponent(k.dataset.case); return; }
    var a = e.target.closest('[data-action]'); if (a) { doAction(a.dataset.action, a.dataset.arg); return; }
    var sc = e.target.closest('[data-sortcase]'); if (sc && currentClient) {
      var key = sc.dataset.sortcase;
      if (caseSort.key === key) caseSort.dir = caseSort.dir === 'desc' ? 'asc' : 'desc';
      else { caseSort.key = key; caseSort.dir = 'desc'; }
      renderCasesInto(document.getElementById('casesMount'), currentClient); return;
    }
    var bk = e.target.closest('[data-back]'); if (bk) { location.hash = '#/clients'; return; }
    var cl = e.target.closest('[data-client]'); if (cl) { location.hash = '#/clients/' + cl.dataset.client; return; }
  });

  window.addEventListener('hashchange', function () { caseSort = { key: 'date', dir: 'desc' }; render(); });

  /* ============================================================
     SHELL CHROME (collapse + dropdowns) — lifted from app shell
     ============================================================ */
  var app = document.getElementById('app');
  var COLLAPSE_KEY = 'rd_rail_collapsed';
  if (localStorage.getItem(COLLAPSE_KEY) === '1') app.classList.add('collapsed');
  var rt = document.getElementById('railToggle');
  if (rt) rt.addEventListener('click', function () {
    app.classList.toggle('collapsed');
    localStorage.setItem(COLLAPSE_KEY, app.classList.contains('collapsed') ? '1' : '0');
  });
  var notifPanel = document.getElementById('notifPanel');
  var userPanel = document.getElementById('userPanel');
  function closeMenus(except) {
    if (notifPanel && except !== notifPanel) notifPanel.classList.remove('open');
    if (userPanel && except !== userPanel) userPanel.classList.remove('open');
  }
  var bell = document.getElementById('bellBtn');
  if (bell) bell.addEventListener('click', function (e) {
    e.stopPropagation(); var open = !notifPanel.classList.contains('open'); closeMenus(notifPanel); notifPanel.classList.toggle('open', open);
  });
  var userBtn = document.getElementById('userBtn');
  if (userBtn) userBtn.addEventListener('click', function (e) {
    e.stopPropagation(); var open = !userPanel.classList.contains('open'); closeMenus(userPanel); userPanel.classList.toggle('open', open);
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.bellwrap') && !e.target.closest('.usermenu')) closeMenus(null);
  });

  /* skeleton */
  var skel = document.getElementById('shellSkeleton');
  function hideSkeleton() { if (!skel) return; skel.classList.add('hide'); setTimeout(function () { skel.style.display = 'none'; }, 400); }
  window.addEventListener('load', function () { setTimeout(hideSkeleton, 650); });
  setTimeout(hideSkeleton, 1300);

  /* expose helpers for the Patient Detail module (patient.js) */
  window.RD = {
    esc: esc, fmtDate: fmtDate, ts: ts,
    logAccess: logAccess, toast: toast, openModal: openModal,
    ICON: ICON, findPatient: findPatient
  };

  /* boot */
  render();
})();
