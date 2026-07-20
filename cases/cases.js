/* ============================================================
   RobinDock — Cases prototype · CONTROLLER
   The communication-thread lens. Two surfaces:
     • Cases List   (#/cases)      — actionable thread directory
     • Case Detail  (#/case/:id)   — single-thread hub
   Renders into the shared app shell. Mock data only.

   Access logging is a prototype affordance: opening a Case,
   document, patient or contact surfaces a subtle "Access logged"
   toast; replies log a "send". Real build = silent server writes.
   ============================================================ */
(function () {
  'use strict';

  var D = window.RD_CASES;
  var CASES = D.CASES, TYPES = D.TYPES, CONTACTS = D.CONTACTS, SRC = D.SRC,
      PEOPLE = D.PEOPLE, DEPTS = D.DEPTS, ME = D.ME;
  var content = document.getElementById('appContent');
  var titleEl = document.getElementById('appTitle');

  /* ---------------- icons ---------------- */
  var ICON = {
    back:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevDown:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    paw:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><ellipse cx="7" cy="9" rx="1.7" ry="2.2" fill="currentColor"/><ellipse cx="12" cy="7.4" rx="1.8" ry="2.4" fill="currentColor"/><ellipse cx="17" cy="9" rx="1.7" ry="2.2" fill="currentColor"/><path d="M12 12c-2.8 0-4.6 2-4.6 3.9C7.4 17.6 9 18 12 18s4.6-.4 4.6-2.1C16.6 14 14.8 12 12 12z" fill="currentColor"/></svg>',
    pawBig:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><ellipse cx="7" cy="9" rx="1.8" ry="2.4" fill="currentColor"/><ellipse cx="12" cy="7.2" rx="2" ry="2.6" fill="currentColor"/><ellipse cx="17" cy="9" rx="1.8" ry="2.4" fill="currentColor"/><path d="M12 12c-2.9 0-4.8 2.1-4.8 4.1C7.2 17.9 9 18.4 12 18.4s4.8-.5 4.8-2.3C16.8 14.1 14.9 12 12 12z" fill="currentColor"/></svg>',
    check:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    logged:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    inbox:   '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 13l2.5-7A2 2 0 018.4 4.6h7.2A2 2 0 0117.5 6L20 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13h4l1.5 2.5h5L16 13h4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    reply:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h11a5 5 0 015 5v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    send:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-7-7 16-2.5-6.5L4 12z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    archive: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.7"/><path d="M5 9v9a1 1 0 001 1h12a1 1 0 001-1V9M10 13h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    clock:   '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alert:   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    arrowIn: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M19 5L9 15M9 15V8M9 15h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowOut:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 19L15 9M15 9v7M15 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    statusDot:'<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>',
    contact: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="11" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 16c.5-1.6 1.7-2.2 3-2.2s2.5.6 3 2.2M15 9h3M15 13h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    doc:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 3v5h5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    note:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 4h14a1 1 0 011 1v10l-5 5H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 20v-4a1 1 0 011-1h4M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bridge:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 18v-4a8 8 0 0116 0v4M4 14h4v4H4zM16 14h4v4h-4zM12 6V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    open:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* source-category glyphs */
    scLab:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6l-4.6 8.2A2 2 0 007.2 20h9.6a2 2 0 001.8-2.8L14 9V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scGp:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4v5a4 4 0 008 0V4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10 13v3a3.5 3.5 0 007 0v-2.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="11.3" r="2.2" stroke="currentColor" stroke-width="1.7"/></svg>',
    scSpec: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 13.2L7 21l5-2.8 5 2.8-1.5-7.8" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    scImg:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 8V6.5A2.5 2.5 0 016.5 4H8M16 4h1.5A2.5 2.5 0 0120 6.5V8M20 16v1.5a2.5 2.5 0 01-2.5 2.5H16M8 20H6.5A2.5 2.5 0 014 17.5V16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7 12h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    scEr:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 4h6a1 1 0 011 1v3h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V9a1 1 0 011-1h3V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    scFax:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 9V4h10v5M7 18h10v3H7zM5 9h14a2 2 0 012 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    scQ:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9.3 9a2.7 2.7 0 015.2 1c0 1.8-2.7 2.5-2.7 2.5M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>',
    scOther:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 21V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V21M15 9h2.5A1.5 1.5 0 0119 10.5V21M3.5 21h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8h2M8 12h2M8 16h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  };
  var SRC_ICON = { lab: ICON.scLab, gp: ICON.scGp, spec: ICON.scSpec, img: ICON.scImg, er: ICON.scEr, unk: ICON.scQ, upl: ICON.scOther, other: ICON.scOther };

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function fmtAge(h) {
    if (h < 1) return '<1h';
    if (h < 24) return Math.round(h) + 'h';
    var d = Math.round(h / 24);
    if (d < 14) return d + 'd';
    var w = Math.round(d / 7);
    if (w < 9) return w + 'w';
    return Math.round(d / 30) + 'mo';
  }
  function fmtDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function fmtDateTime(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  function person(key) {
    var p = PEOPLE[key];
    if (!p) return { name: key, initials: '?', av: '' };
    return p;
  }
  function avatar(p, size) {
    return '<span class="av ' + (p.av || '') + '" style="--av:' + (size || 28) + 'px">' + esc(p.initials) + '</span>';
  }
  var STATUS_LABEL = { open: 'Open', inprog: 'In progress', complete: 'Complete', archived: 'Archived' };

  /* ---------------- persisted state ---------------- */
  var SK = 'rd_cases_state_v1';
  var state = { view: 'attention', sort: 'activity', q: '', extra: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(SK) || '{}');
    if (saved && typeof saved === 'object') for (var k in saved) state[k] = saved[k];
  } catch (e) {}
  function save() { try { localStorage.setItem(SK, JSON.stringify(state)); } catch (e) {} }

  /* per-case user-added timeline events + notes (persisted) */
  function caseExtra(id) {
    if (!state.extra[id]) state.extra[id] = { events: [], notes: [], archived: false };
    return state.extra[id];
  }

  function findCase(id) {
    for (var i = 0; i < CASES.length; i++) if (CASES[i].id === id) return CASES[i];
    return null;
  }
  function isArchived(c) { return !!c.archived || caseExtra(c.id).archived; }
  function statusOf(c) {
    if (isArchived(c)) return 'archived';
    return D.deriveStatus(c);
  }
  function srcMeta(contactKey) {
    var ct = CONTACTS[contactKey];
    var s = SRC[ct ? ct.type : 'other'] || SRC.other;
    return { cls: s.cls, label: s.label, icon: SRC_ICON[s.cls] || ICON.scOther, name: ct ? ct.name : 'Unknown sender', loc: ct ? ct.loc : null, unk: !ct || ct.type === 'unknown' };
  }

  /* ============================================================
     CASES LIST
     ============================================================ */
  function patChips(pats, max) {
    max = max || 2;
    var html = '<span class="pats">';
    pats.slice(0, max).forEach(function (p) {
      html += '<span class="patchip"><span class="paw">' + ICON.paw + '</span>' + esc(p.name) + '</span>';
    });
    if (pats.length > max) html += '<span class="patchip more">+' + (pats.length - max) + '</span>';
    html += '</span>';
    return html;
  }

  function typeBadges(c, max) {
    max = max || 3;
    var seen = [], order = [];
    (c.docs || []).forEach(function (d) { if (seen.indexOf(d.type) < 0) { seen.push(d.type); order.push(d.type); } });
    (c.tasks || []).forEach(function (t) { if (seen.indexOf(t.type) < 0) { seen.push(t.type); order.push(t.type); } });
    var html = '<div class="typecell">';
    order.slice(0, max).forEach(function (t) {
      var m = TYPES[t] || TYPES.unc;
      html += '<span class="tag ' + m.cls + '"><span class="d"></span>' + m.label + '</span>';
    });
    if (order.length > max) html += '<span class="tmore">+' + (order.length - max) + '</span>';
    html += '</div>';
    return html;
  }

  function caseRow(c) {
    var st = statusOf(c);
    var sm = srcMeta(c.contact);
    var openN = D.openTaskCount(c);
    var crit = c.crit && st !== 'complete' && st !== 'archived';
    var attn = (c.awaiting === 'us') && st !== 'complete' && st !== 'archived';
    var aging = c.lastH >= 24 && (st === 'open' || st === 'inprog');
    var rowcls = [];
    if (crit) rowcls.push('crit');
    else if (attn) rowcls.push('attn');
    if (st === 'complete' || st === 'archived') rowcls.push('muted');

    /* subject + identity */
    var clientLine = c.client ? esc(c.client) : '<span style="font-style:italic">Unresolved client</span>';
    var subj = '<div class="subj"><span class="st">' + esc(c.subject) + '</span>' +
      '<span class="sm"><span class="cid">' + esc(c.id) + '</span><span class="dot"></span>' + patChips(c.patients) + '</span></div>';

    /* other party */
    var party = '<div class="srccell"><span class="srcsq ' + sm.cls + ' has-tip" data-tip="' + esc(sm.label) + '">' + sm.icon + '</span>' +
      '<span class="srctxt' + (sm.unk ? ' unk' : '') + '">' + esc(sm.name) +
      (c.client ? '<span class="loc">' + clientLine + '</span>' : (sm.unk ? '<span class="loc">Sender not resolved</span>' : '')) + '</span></div>';

    /* status */
    var status = '<span class="cstatus s-' + st + '"><span class="d"></span>' + STATUS_LABEL[st] + '</span>';

    /* tasks */
    var tasks = openN
      ? '<span class="taskcell"><span class="tdot">' + openN + '</span>' + openN + ' open</span>'
      : '<span class="taskcell clear">' + ICON.checkSm + ' Resolved</span>';

    /* activity */
    var awaitChip = '';
    if (st !== 'complete' && st !== 'archived') {
      if (c.awaiting === 'us') awaitChip = '<span class="await us">' + ICON.reply + 'Needs reply</span>';
      else if (c.awaiting === 'them') awaitChip = '<span class="await them">Awaiting reply</span>';
    }
    var critChip = crit ? '<span class="critinline">' + ICON.alert + 'Critical</span>' : '';
    var act = '<div class="actcell"><span class="age' + (aging ? ' warm' : '') + '">' + fmtAge(c.lastH) + '</span>' +
      awaitChip + critChip + '</div>';

    return '<tr data-case="' + c.id + '"' + (rowcls.length ? ' class="' + rowcls.join(' ') + '"' : '') + '>' +
      '<td>' + subj + '</td>' +
      '<td>' + party + '</td>' +
      '<td>' + typeBadges(c) + '</td>' +
      '<td>' + status + '</td>' +
      '<td>' + tasks + '</td>' +
      '<td>' + act + '</td>' +
      '</tr>';
  }

  function viewFilter(c, view) {
    var st = statusOf(c);
    if (view === 'attention') return (c.awaiting === 'us' || (c.crit && st !== 'complete')) && st !== 'complete' && st !== 'archived';
    if (view === 'active') return st === 'open' || st === 'inprog';
    if (view === 'archived') return st === 'complete' || st === 'archived';
    return true; /* all */
  }

  function sortCases(list) {
    var s = state.sort;
    var arr = list.slice();
    if (s === 'activity') arr.sort(function (a, b) { return a.lastH - b.lastH; });
    else if (s === 'age') arr.sort(function (a, b) { return b.lastH - a.lastH; });
    else if (s === 'status') {
      var ord = { open: 0, inprog: 1, complete: 2, archived: 3 };
      arr.sort(function (a, b) { return ord[statusOf(a)] - ord[statusOf(b)]; });
    }
    return arr;
  }

  function counts() {
    var attn = 0, awaitingReply = 0, unresolved = 0, active = 0;
    CASES.forEach(function (c) {
      var st = statusOf(c);
      if (st === 'open' || st === 'inprog') active++;
      if ((c.awaiting === 'us' || (c.crit && st !== 'complete')) && st !== 'complete' && st !== 'archived') attn++;
      if (c.awaiting === 'us' && st !== 'complete' && st !== 'archived') awaitingReply++;
      if (st !== 'complete' && st !== 'archived') unresolved += D.openTaskCount(c);
    });
    return { attn: attn, awaitingReply: awaitingReply, unresolved: unresolved, active: active };
  }

  function renderList() {
    titleEl.textContent = 'Cases';
    var c = counts();

    /* view tallies */
    function tally(v) { return CASES.filter(function (x) { return viewFilter(x, v); }).length; }
    var q = (state.q || '').trim().toLowerCase();
    var list = CASES.filter(function (x) { return viewFilter(x, state.view); });
    if (q) {
      list = list.filter(function (x) {
        var hay = (x.subject + ' ' + x.id + ' ' + (x.client || '') + ' ' +
          (CONTACTS[x.contact] ? CONTACTS[x.contact].name : '') + ' ' +
          x.patients.map(function (p) { return p.name; }).join(' ')).toLowerCase();
        return hay.indexOf(q) >= 0;
      });
    }
    list = sortCases(list);

    var sortLabel = { activity: 'Last activity', age: 'Oldest first', status: 'Status' }[state.sort];

    var strip =
      '<div class="cs-strip">' +
        statCard('attention', c.attn, 'Need attention', 'var(--blue-500)', ICON.reply) +
        statCard('awaiting', c.awaitingReply, 'Awaiting our reply', 'var(--warn)', ICON.clock) +
        statCard('unresolved', c.unresolved, 'Open tasks across threads', 'var(--violet-400)', null) +
        statCard('activec', c.active, 'Active threads', 'var(--ok)', null) +
      '</div>';

    var toolbar =
      '<div class="cs-toolbar">' +
        '<div class="cs-views" id="csViews">' +
          viewBtn('attention', 'Needs attention', tally('attention')) +
          viewBtn('active', 'Active', tally('active')) +
          viewBtn('all', 'All', CASES.length) +
          viewBtn('archived', 'Resolved', tally('archived')) +
        '</div>' +
        '<div class="cs-search"><span>' + ICON.search + '</span>' +
          '<input id="csSearch" placeholder="Search threads, patients, parties\u2026" value="' + esc(state.q) + '" autocomplete="off" spellcheck="false"></div>' +
        '<div class="cs-spacer"></div>' +
        '<button class="cs-sort" id="csSortBtn"><span class="lbl">Sort:</span>' + sortLabel + '<span class="ch">' + ICON.chevDown + '</span></button>' +
      '</div>';

    var rows;
    if (!list.length) {
      rows = emptyState(state.view, q);
    } else {
      rows = '<table class="cst"><thead><tr>' +
        '<th>Thread</th><th>Other party</th><th>Type</th><th>Status</th><th>Tasks</th><th style="text-align:right">Activity</th>' +
        '</tr></thead><tbody>' + list.map(caseRow).join('') + '</tbody></table>';
    }

    var listTitle = { attention: 'Needs attention', active: 'Active threads', all: 'All threads', archived: 'Resolved & archived' }[state.view];

    content.innerHTML =
      '<div class="cs-page">' +
        '<div class="cs-head"><div class="ph-main"><h1>Cases</h1>' +
          '<div class="ph-sub">Your communication threads with other practices, labs and specialists \u2014 the actionable home. Threads needing you surface first.</div></div>' +
          '<div class="ph-actions">' +
            '<span class="accesslogged">' + ICON.logged + 'Opening a thread logs access</span>' +
            '<button class="btn btn-blue btn-sm" id="composeBtn">' + ICON.send + 'Compose</button>' +
          '</div>' +
        '</div>' +
        strip +
        toolbar +
        '<div class="cs-list">' +
          '<div class="lhead"><h3>' + listTitle + ' <span class="c">' + list.length + '</span></h3>' +
            '<span class="lnote">Most-recently-active first</span></div>' +
          rows +
        '</div>' +
      '</div>' +
      '<div class="sortmenu" id="sortMenu">' +
        sortOpt('activity', 'Last activity') + sortOpt('age', 'Oldest first') + sortOpt('status', 'Status') +
      '</div>';
  }

  function statCard(key, n, label, color, icon) {
    var on = (key === 'attention' && state.view === 'attention') ||
             (key === 'awaiting' && state.view === 'attention') ||
             (key === 'activec' && state.view === 'active');
    return '<button class="cs-stat' + (on ? ' on' : '') + '" data-stat="' + key + '">' +
      '<span class="bar" style="background:' + color + '"></span>' +
      '<div class="n">' + (n || '0') + '</div>' +
      '<div class="l">' + (icon ? icon : '') + label + '</div></button>';
  }
  function viewBtn(v, label, n) {
    return '<button data-view="' + v + '"' + (state.view === v ? ' class="on"' : '') + '>' + label +
      ' <span class="n">' + n + '</span></button>';
  }
  function sortOpt(v, label) {
    return '<button data-sort="' + v + '"' + (state.sort === v ? ' class="on"' : '') + '>' + label +
      '<span class="tick">' + ICON.checkSm + '</span></button>';
  }
  function emptyState(view, q) {
    if (q) return '<div class="cs-empty"><div class="ico">' + ICON.search + '</div>' +
      '<h4>No threads match \u201C' + esc(q) + '\u201D</h4><p>Try a different patient, party or thread subject \u2014 or clear the search.</p></div>';
    var msg = view === 'attention'
      ? ['Nothing needs you right now', 'No threads are awaiting a reply or flagged critical. A clean home is a good home.']
      : view === 'archived'
        ? ['No resolved threads yet', 'Completed and archived conversations will collect here.']
        : ['No active threads', 'New communication threads will appear here as documents arrive.'];
    return '<div class="cs-empty"><div class="ico">' + ICON.check + '</div><h4>' + msg[0] + '</h4><p>' + msg[1] + '</p></div>';
  }

  /* ============================================================
     CASE DETAIL — single-thread hub
     ============================================================ */
  function renderDetail(id) {
    var c = findCase(id);
    if (!c) return renderNotFound(id);
    var st = statusOf(c);
    titleEl.textContent = c.id;
    logAccess('Access logged', 'Opened ' + c.id + ' \u00B7 ' + c.subject);

    var sm = srcMeta(c.contact);
    var ex = caseExtra(c.id);
    var events = (c.timeline || []).concat(ex.events);
    var notes = (c.notes || []).concat(ex.notes);
    var openN = D.openTaskCount(c);
    var lastEv = events.length ? events[events.length - 1] : null;

    /* ---- thread header ---- */
    var critBanner = (c.crit && st !== 'complete' && st !== 'archived')
      ? '<div class="cd-critbanner">' + ICON.alert + '<div><b>Critical value on this thread.</b> ' +
        esc(c.crit.an) + ' <span class="val">' + esc(c.crit.sym) + ' ' + esc(c.crit.val) + ' ' + esc(c.crit.unit) +
        '</span> flagged ' + (c.crit.dir === 'high' ? 'high' : 'low') + ' \u2014 review before it routes onward.</div></div>'
      : '';

    var replyDisabled = (st === 'archived');
    var headerActions = '<div class="cd-hbtns">' +
      (replyDisabled ? '' : '<button class="btn btn-blue btn-sm" id="replyJump">' + ICON.reply + 'Reply / continue thread</button>') +
      (st === 'archived'
        ? '<button class="btn btn-light btn-sm" id="unarchiveBtn">Unarchive</button>'
        : '<button class="btn btn-light btn-sm" id="archiveBtn">' + ICON.archive + 'Archive</button>') +
      '</div>';

    var header =
      '<div class="cd-head' + (st === 'archived' ? ' arch' : '') + '">' +
        '<div class="cd-htop"><div class="cd-hmain">' +
          '<div class="cd-crumb"><span>Cases</span>' + ICON.chev.replace('width="16" height="16"', 'width="13" height="13"') +
            '<span class="cid">' + esc(c.id) + '</span></div>' +
          '<h1>' + esc(c.subject) + '</h1>' +
          '<div class="cd-meta">' +
            '<span class="mi">with <a data-contact="' + c.contact + '">' + esc(sm.name) + '</a></span>' +
            '<span class="sep"></span>' +
            '<span class="mi">Opened <b>' + fmtDate(c.opened) + '</b></span>' +
            '<span class="sep"></span>' +
            '<span class="mi">Last activity <b>' + (lastEv ? fmtDateTime(lastEv.date) : fmtAge(c.lastH) + ' ago') + '</b></span>' +
          '</div>' +
        '</div>' +
        '<div class="cd-hactions">' +
          '<span class="cd-statuschip s-' + st + '"><span class="d"></span>' + STATUS_LABEL[st] + '</span>' +
          '<span class="cd-derived has-tip" data-tip="Rolled up from ' + (c.tasks.length) + ' task' + (c.tasks.length === 1 ? '' : 's') + '">' +
            ICON.info + 'Derived from ' + c.tasks.length + ' task' + (c.tasks.length === 1 ? '' : 's') + '</span>' +
          headerActions +
        '</div></div>' +
      '</div>';

    /* ---- documents & tasks ---- */
    var docRows = (c.docs || []).map(function (d) {
      var m = TYPES[d.type] || TYPES.unc;
      var di = d.type === 'lab' ? '' : d.type === 'referral' ? 'violet' : d.type === 'records' || d.type === 'recreq' || d.type === 'vaccine' ? 'aqua' : d.type === 'imaging' ? 'warn' : '';
      return '<div class="thread-row"><span class="di ' + di + '"></span>' +
        '<div class="dmain"><div class="dn">' + esc(d.name) + '</div>' +
          '<div class="dmeta"><span class="dir ' + d.dir + '">' + (d.dir === 'in' ? ICON.arrowIn + 'Received' : ICON.arrowOut + 'Sent') + '</span>' +
            '<span class="sep"></span>' + m.label + '<span class="sep"></span>' + d.pages + 'p<span class="sep"></span>' + fmtDate(d.date) + '</div></div>' +
        '<span class="open-lk" data-doc="' + d.id + '">' + ICON.open + 'Open</span></div>';
    }).join('');

    var taskRows = (c.tasks || []).map(function (t) {
      var who = t.who ? person(t.who) : null;
      var statcls = t.status === 'done' ? 'done' : t.status === 'prog' ? 'prog' : 'open';
      var staticon = t.status === 'done' ? ICON.checkSm : t.status === 'prog' ? '<span class="ring"></span>' : '';
      var m = TYPES[t.type] || TYPES.unc;
      var assignee = who
        ? '<span class="tassignee">' + avatar(who, 22) + '<span class="nm">' + (who.key === 'me' ? 'You' : esc(who.name)) + '</span></span>'
        : '<span class="tassignee"><span class="unassigned">Unassigned</span></span>';
      return '<div class="task-row' + (t.status === 'done' ? ' is-done' : '') + '" data-task="' + t.id + '">' +
        '<span class="tstat ' + statcls + '">' + staticon + '</span>' +
        '<div class="tmain"><div class="tn">' + esc(t.title) + '</div>' +
          '<div class="tsub"><span class="tag ' + m.cls + '" style="font-size:9.5px;padding:2px 7px"><span class="d"></span>' + m.label + '</span>' +
            '<span class="sep"></span><span class="dept">' + esc(DEPTS[t.dept] || t.dept) + '</span></div></div>' +
        assignee + '<span class="tgo">' + ICON.chev + '</span></div>';
    }).join('');

    var docsTasks =
      '<div class="cd-card">' +
        '<div class="cdh"><h3>' + ICON.doc + ' Documents <span class="c">' + c.docs.length + '</span></h3>' +
          '<span class="cdsub">The immutable artifacts in this thread</span></div>' +
        '<div class="cdbody">' + docRows + '</div>' +
      '</div>' +
      '<div class="cd-card">' +
        '<div class="cdh"><h3>' + ICON.bridge + ' Tasks <span class="c">' + c.tasks.length + '</span></h3>' +
          '<span class="cdsub">' + (openN ? openN + ' open' : 'All resolved') + '</span></div>' +
        '<div class="cdbody">' + taskRows + '</div>' +
        '<div class="cd-bridge">' + ICON.info + '<div>Tasks are <b>displayed</b> here and <b>worked</b> in the department\u2019s fulfillment surface. Opening one takes you there \u2014 the Case shows work state, it doesn\u2019t do the work.</div></div>' +
      '</div>';

    /* ---- conversation timeline ---- */
    var sorted = events.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    var tl = sorted.map(function (e) {
      var dotcls = e.dir === 'in' ? 'in' : e.dir === 'out' ? 'out' : 'status';
      var dirlab = e.dir === 'in' ? '<span class="dirlab in">Inbound</span>' : e.dir === 'out' ? '<span class="dirlab out">Outbound</span>' : '';
      var icon = e.dir === 'in' ? ICON.arrowIn : e.dir === 'out' ? ICON.arrowOut : ICON.statusDot;
      var by = e.by ? ' <span class="by">\u00B7 ' + esc(person(e.by).name) + (e.by === 'me' ? ' (you)' : '') + '</span>' : '';
      var typ = e.type ? (TYPES[e.type] ? TYPES[e.type].label : '') : '';
      var docchip = (e.type && (e.dir === 'in' || e.dir === 'out'))
        ? '<div class="tl-doc"><span class="tdi"></span><span class="tdn">' + esc(typ || 'Document') + '</span></div>' : '';
      return '<div class="tl-item ' + dotcls + '"><span class="tl-dot ' + dotcls + '">' + icon + '</span>' +
        '<div class="tl-when">' + fmtDateTime(e.date) + dirlab + '</div>' +
        '<div class="tl-title">' + esc(e.what) + by + '</div>' +
        (e.note ? '<div class="tl-note">' + esc(e.note) + '</div>' : '') +
        docchip + '</div>';
    }).join('');

    var replyComposer = replyDisabled ? '' :
      '<div class="cd-reply">' +
        '<div class="rlabel"><span class="send">' + ICON.send + '</span>Reply / continue thread</div>' +
        '<div class="reply-box">' + avatar(ME, 32) +
          '<div class="reply-field"><textarea id="replyText" placeholder="Send an outbound document or response to ' + esc(sm.name) + '\u2026"></textarea>' +
            '<div class="reply-bar"><span class="ctx">' + ICON.logged + 'Rides on <b>' + esc(c.id) + '</b> \u00B7 logged as a send</span>' +
              '<span class="rspace"></span>' +
              '<span class="openfull" id="openComposer">' + ICON.open + 'Open in Composer</span>' +
              '<button class="btn btn-blue btn-sm" id="sendReply">' + ICON.send + 'Send</button></div></div></div>' +
      '</div>';

    var timeline =
      '<div class="cd-card" id="threadCard">' +
        '<div class="cdh"><h3>' + ICON.inbox.replace('width="26" height="26"', 'width="18" height="18"') + ' Conversation <span class="c">' + sorted.length + '</span></h3>' +
          '<span class="cdsub">The back-and-forth made visible</span></div>' +
        '<div class="cdbody"><div class="timeline">' + tl + '</div></div>' +
        replyComposer +
      '</div>';

    /* ---- right rail ---- */
    var patHtml = c.patients.map(function (p) {
      return '<div class="participant"><span class="pav pat">' + ICON.pawBig + '</span>' +
        '<div class="pmain"><div class="pn">' + esc(p.name) + (p.tentative ? ' <span style="color:var(--gray-400);font-weight:500;font-style:italic">(tentative)</span>' : '') + '</div>' +
          '<div class="ps">' + esc(p.species) + (p.breed && p.breed !== '\u2014' ? ' \u00B7 ' + esc(p.breed) : '') + '</div></div>' +
        '<span class="pgo" data-patient="' + esc(p.name) + '">' + ICON.chev + '</span></div>';
    }).join('');
    var clientRow = c.client
      ? '<div class="participant" style="border-top:1px dashed var(--gray-200);margin-top:4px;padding-top:14px">' +
          '<span class="pav" style="background:var(--violet-50);color:var(--violet-600)">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span>' +
          '<div class="pmain"><div class="pn">' + esc(c.client) + '</div><div class="ps">Account ' + esc(c.clientId || '\u2014') + '</div></div>' +
          '<span class="pgo" data-client="' + esc(c.client) + '">' + ICON.chev + '</span></div>'
      : '<div class="note-empty">Client not yet resolved \u2014 sender must be identified first.</div>';

    var partyMeta = '<div class="party-block"><div class="plbl">Other party \u00B7 ' + esc(sm.label) + '</div>' +
      '<div class="participant" style="padding-top:6px"><span class="pav srcsq ' + sm.cls + '" style="border-radius:10px">' + sm.icon + '</span>' +
        '<div class="pmain"><div class="pn' + (sm.unk ? '' : '') + '">' + esc(sm.name) + '</div>' +
          '<div class="ps">' + (sm.loc ? esc(sm.loc) : 'Sender not resolved') + '</div></div>' +
        '<span class="pgo" data-contact="' + c.contact + '">' + ICON.chev + '</span></div></div>';

    var participants =
      '<div class="cd-card"><div class="cdh"><h3>Participants</h3>' +
        '<span class="cdsub">Who & with whom</span></div>' +
        '<div class="cdbody">' + patHtml + clientRow + partyMeta + '</div></div>';

    var facts =
      '<div class="cd-card"><div class="cdh"><h3>Case facts</h3></div><div class="cdbody">' +
        '<div class="cd-kv"><span class="k">Thread ID</span><span class="v mono">' + esc(c.id) + '</span></div>' +
        '<div class="cd-kv"><span class="k">Derived status</span><span class="v">' + STATUS_LABEL[st] + '</span></div>' +
        '<div class="cd-kv"><span class="k">Documents</span><span class="v">' + c.docs.length + '</span></div>' +
        '<div class="cd-kv"><span class="k">Tasks</span><span class="v">' + openN + ' open \u00B7 ' + c.tasks.length + ' total</span></div>' +
        '<div class="cd-kv"><span class="k">Opened</span><span class="v">' + fmtDate(c.opened) + '</span></div>' +
      '</div></div>';

    var noteItems = notes.length
      ? notes.map(function (n) {
          return '<div class="note-item"><div class="nhd">' + avatar(person(n.by), 22) +
            '<span class="nby">' + (n.by === 'me' ? 'You' : esc(person(n.by).name)) + '</span>' +
            '<span class="nwhen">' + fmtDateTime(n.when) + '</span></div>' +
            '<div class="ntext">' + esc(n.text) + '</div></div>';
        }).join('')
      : '<div class="note-empty">No internal notes yet. Add coordination notes for staff \u2014 not part of the exchanged thread.</div>';

    var notesCard =
      '<div class="cd-card"><div class="cdh"><h3>' + ICON.note + ' Internal notes</h3>' +
        '<span class="internal-tag">Staff only</span></div>' +
        '<div class="cdbody">' + noteItems +
          '<div class="note-add"><textarea id="noteText" placeholder="Add an internal note\u2026"></textarea>' +
            '<button class="btn btn-light btn-sm nbtn" id="addNote">Add</button></div>' +
        '</div></div>';

    content.innerHTML =
      '<div class="cs-page">' +
        '<button class="cd-back" id="backBtn">' + ICON.back + 'Back to Cases</button>' +
        header +
        critBanner +
        '<div class="cd-grid">' +
          '<div class="cd-main">' + docsTasks + timeline + '</div>' +
          '<div class="cd-side">' + participants + facts + notesCard + '</div>' +
        '</div>' +
      '</div>';
  }

  function renderNotFound(id) {
    titleEl.textContent = 'Not found';
    content.innerHTML = '<div class="cs-page"><button class="cd-back" id="backBtn">' + ICON.back + 'Back to Cases</button>' +
      '<div class="cs-list"><div class="cs-empty"><div class="ico">' + ICON.search + '</div>' +
      '<h4>Case ' + esc(id) + ' not found</h4><p>That thread may have been merged or archived. Head back to the Cases home.</p></div></div></div>';
  }

  /* ============================================================
     ACCESS-LOG + ACTION TOASTS
     ============================================================ */
  var toastWrap = document.getElementById('logToasts');
  function toast(title, sub, kind) {
    if (!toastWrap) return;
    var el = document.createElement('div');
    el.className = 'logtoast ' + (kind || 'ok');
    var ic = kind === 'send' ? ICON.send : kind === 'bad' ? ICON.alert : ICON.logged;
    el.innerHTML = '<span class="lic">' + ic + '</span><div><div class="lt">' + esc(title) + '</div>' +
      (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>';
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 280); }, 2600);
    while (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  }
  var lastLog = 0;
  function logAccess(title, sub) {
    var now = Date.now();
    if (now - lastLog < 400) return; /* de-dupe rapid double-renders */
    lastLog = now;
    toast(title, sub, 'ok');
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  function render() {
    var path = location.hash.replace(/^#/, '');
    content.scrollTop = 0;
    if (content.parentElement) content.parentElement.scrollTop = 0;
    var m;
    if (!path || path === '/' || path === '/cases') {
      renderList();
    } else if ((m = path.match(/^\/case\/(.+)$/))) {
      renderDetail(decodeURIComponent(m[1]));
    } else {
      /* other nav routes are handled by their own pages; keep cases home as fallback */
      renderList();
    }
    document.title = 'RobinDock — ' + titleEl.textContent;
    closeSortMenu();
  }
  window.addEventListener('hashchange', render);

  /* ============================================================
     EVENT DELEGATION
     ============================================================ */
  function closeSortMenu() {
    var sm = document.getElementById('sortMenu');
    if (sm) sm.classList.remove('open');
  }

  content.addEventListener('click', function (e) {
    /* ---- list interactions ---- */
    var stat = e.target.closest('[data-stat]');
    if (stat) {
      var k = stat.dataset.stat;
      state.view = (k === 'attention' || k === 'awaiting') ? 'attention' : (k === 'activec') ? 'active' : 'all';
      save(); renderList(); return;
    }
    var vb = e.target.closest('#csViews [data-view]');
    if (vb) { state.view = vb.dataset.view; save(); renderList(); return; }

    var sortBtn = e.target.closest('#csSortBtn');
    if (sortBtn) {
      e.stopPropagation();
      var menu = document.getElementById('sortMenu');
      var open = !menu.classList.contains('open');
      closeSortMenu();
      if (open) {
        var r = sortBtn.getBoundingClientRect();
        menu.style.left = Math.max(12, r.right - 180) + 'px';
        menu.style.top = (r.bottom + 6) + 'px';
        menu.classList.add('open');
      }
      return;
    }

    var compose = e.target.closest('#composeBtn');
    if (compose) { toast('Compose', 'Starts a new outbound thread (stub)', 'send'); return; }

    var row = e.target.closest('tr[data-case]');
    if (row) { location.hash = '#/case/' + encodeURIComponent(row.dataset.case); return; }

    /* ---- detail interactions ---- */
    var back = e.target.closest('#backBtn');
    if (back) { location.hash = '#/cases'; return; }

    var doc = e.target.closest('[data-doc]');
    if (doc) { toast('Access logged', 'Opened document ' + doc.dataset.doc + ' (viewer stub)', 'ok'); return; }

    var taskEl = e.target.closest('[data-task]');
    if (taskEl) { toast('Opening Task fulfillment', taskEl.dataset.task + ' \u2014 worked in the department surface', 'ok'); return; }

    var contact = e.target.closest('[data-contact]');
    if (contact) { toast('Access logged', 'Opened contact ' + (CONTACTS[contact.dataset.contact] ? CONTACTS[contact.dataset.contact].name : 'contact'), 'ok'); return; }

    var pat = e.target.closest('[data-patient]');
    if (pat) { toast('Access logged', 'Opened patient ' + pat.dataset.patient, 'ok'); return; }
    var cl = e.target.closest('[data-client]');
    if (cl) { toast('Access logged', 'Opened client ' + cl.dataset.client, 'ok'); return; }

    var replyJump = e.target.closest('#replyJump');
    if (replyJump) {
      var ta = document.getElementById('replyText');
      if (ta) { ta.focus(); }
      return;
    }
    var openComposer = e.target.closest('#openComposer');
    if (openComposer) { toast('Compose', 'Opens the Composer with this case as context', 'send'); return; }

    var send = e.target.closest('#sendReply');
    if (send) { doSendReply(); return; }

    var addNote = e.target.closest('#addNote');
    if (addNote) { doAddNote(); return; }

    var archiveBtn = e.target.closest('#archiveBtn');
    if (archiveBtn) { doArchive(true); return; }
    var unarchiveBtn = e.target.closest('#unarchiveBtn');
    if (unarchiveBtn) { doArchive(false); return; }
  });

  content.addEventListener('input', function (e) {
    if (e.target.id === 'csSearch') { state.q = e.target.value; save(); debounceList(); }
  });
  var listTimer = null;
  function debounceList() {
    clearTimeout(listTimer);
    listTimer = setTimeout(function () {
      var active = document.activeElement, pos = active && active.id === 'csSearch' ? active.selectionStart : null;
      renderList();
      var nf = document.getElementById('csSearch');
      if (nf && pos != null) { nf.focus(); try { nf.setSelectionRange(pos, pos); } catch (e) {} }
    }, 160);
  }

  /* current case id from hash */
  function currentCaseId() {
    var m = location.hash.replace(/^#/, '').match(/^\/case\/(.+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function doSendReply() {
    var id = currentCaseId(); if (!id) return;
    var ta = document.getElementById('replyText');
    var txt = ta ? ta.value.trim() : '';
    if (!txt) { if (ta) ta.focus(); return; }
    var ex = caseExtra(id);
    ex.events.push({ dir: 'out', what: 'Reply sent', type: 'records', date: new Date().toISOString(), by: 'me', note: txt });
    save();
    toast('Reply sent \u00B7 logged', 'Outbound on ' + id + ' \u2014 PHI leaving the org', 'send');
    renderDetail(id);
    setTimeout(function () {
      var card = document.getElementById('threadCard');
      if (card) card.scrollTop = card.scrollHeight;
    }, 40);
  }

  function doAddNote() {
    var id = currentCaseId(); if (!id) return;
    var ta = document.getElementById('noteText');
    var txt = ta ? ta.value.trim() : '';
    if (!txt) { if (ta) ta.focus(); return; }
    var ex = caseExtra(id);
    ex.notes.push({ by: 'me', when: new Date().toISOString(), text: txt });
    save();
    toast('Note added \u00B7 logged', 'Internal note on ' + id, 'ok');
    renderDetail(id);
  }

  function doArchive(on) {
    var id = currentCaseId(); if (!id) return;
    var ex = caseExtra(id);
    ex.archived = on;
    save();
    toast(on ? 'Thread archived' : 'Thread unarchived', id + (on ? ' moved to resolved & archived' : ' restored to active'), 'ok');
    renderDetail(id);
  }

  /* close sort menu on outside click / Esc */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#sortMenu') && !e.target.closest('#csSortBtn')) closeSortMenu();
    var so = e.target.closest('#sortMenu [data-sort]');
    if (so) { state.sort = so.dataset.sort; save(); renderList(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSortMenu(); });
  window.addEventListener('scroll', closeSortMenu, true);

  /* ============================================================
     SHELL CHROME (collapse + dropdowns) — same contract as siblings
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
  var clearN = document.getElementById('clearNotif');
  if (clearN) clearN.addEventListener('click', function () {
    document.getElementById('notifList').innerHTML =
      '<div class="ct-empty" style="padding:30px 20px"><div class="ico">' + ICON.check + '</div>' +
      '<h4>You\u2019re all caught up</h4><p>New notifications will appear here.</p></div>';
    var dot = document.getElementById('bellDot'); if (dot) dot.style.display = 'none';
  });

  /* rail Compose action — an action, not a destination */
  var composeRail = document.getElementById('composeRail');
  if (composeRail) composeRail.addEventListener('click', function (e) {
    e.preventDefault();
    toast('Compose', 'Starts a new outbound thread (stub)', 'send');
  });

  /* ---------------- boot ---------------- */
  render();
})();
