/* ============================================================
   RobinDock — My Work · CONTROLLER
   The personal, cross-department view: every Task the current
   user has claimed/assigned to themselves, across ALL the
   departments in the active config, in one place.

   It is a VIEW, not a store — it reads the SAME Task data and
   the SAME claim/assignment state the department queues write
   (localStorage key 'rd_dept_state_v3'), filtered to me. A
   reassign/release here writes straight back to that shared
   state, so the department queues stay consistent (and vice
   versa). Mock data only.
   ============================================================ */
(function () {
  'use strict';

  var D = window.RD_DEPT;
  if (!D) {
    var _c = document.getElementById('appContent');
    if (_c) _c.innerHTML = '<div style="max-width:560px;margin:90px auto;padding:0 24px;text-align:center"><h2 style="margin:0 0 10px;font-size:22px;color:var(--ink,#1c1d26);font-family:Inter,system-ui,sans-serif">My Work is being rebuilt</h2><p style="margin:0;font-size:15px;line-height:1.55;color:var(--ink-2,#5a5c6b);font-family:Inter,system-ui,sans-serif">This view aggregated tasks from the department queues, which are being redesigned. It will return with the new direction.</p></div>';
    return;
  }
  var DEPTS = D.DEPTS, CONFIGS = D.CONFIGS, TYPES = D.TYPES, PEOPLE = D.PEOPLE, ME = D.ME, PINNED = D.PINNED;
  var content = document.getElementById('appContent');
  var titleEl = document.getElementById('appTitle');
  var deptNav = document.getElementById('deptNav');

  /* ---------------- icons ---------------- */
  var ICON = {
    mywork: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 7.5V6a2 2 0 012-2h3a2 2 0 012 2v1.5M3.5 12.5h17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    myworkBig: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 7.5V6a2 2 0 012-2h3a2 2 0 012 2v1.5M3.5 12.5h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    dept: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20V9l5-3 5 3M4 20h16M4 20V9m10 11V6.5L20 9v11M9 20v-4h2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    deptSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20V9l5-3 5 3M4 20h16M4 20V9m10 11V6.5L20 9v11M9 20v-4h2v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    caret: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevDown: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevR: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    userCircle: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10.2" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M6.4 18.3c.8-2.4 2.9-3.8 5.6-3.8s4.8 1.4 5.6 3.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    searchSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checksm: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    logged: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    review: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 3.5h9l3.5 3.5V20a.8.8 0 01-.8.8H6a.8.8 0 01-.8-.8V4.3A.8.8 0 016 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.5 3.5V7h3.5M9 12.5l1.8 1.8L14.5 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kebab: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alert: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    /* source-category glyphs (mirror dept queue) */
    scLab: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6l-4.6 8.2A2 2 0 007.2 20h9.6a2 2 0 001.8-2.8L14 9V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scGp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4v5a4 4 0 008 0V4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10 13v3a3.5 3.5 0 007 0v-2.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="11.3" r="2.2" stroke="currentColor" stroke-width="1.7"/></svg>',
    scSpec: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 13.2L7 21l5-2.8 5 2.8-1.5-7.8" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    scImg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 8V6.5A2.5 2.5 0 016.5 4H8M16 4h1.5A2.5 2.5 0 0120 6.5V8M20 16v1.5a2.5 2.5 0 01-2.5 2.5H16M8 20H6.5A2.5 2.5 0 014 17.5V16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7 12h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    scEr: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 4h6a1 1 0 011 1v3h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V9a1 1 0 011-1h3V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    scOwner: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    scOther: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 21V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V21M15 9h2.5A1.5 1.5 0 0119 10.5V21M3.5 21h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8h2M8 12h2M8 16h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scFax: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 9V4h10v5M7 18h10v3H7zM5 9h14a2 2 0 012 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    scQ: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9.3 9a2.7 2.7 0 015.2 1c0 1.8-2.7 2.5-2.7 2.5M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>'
  };

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function fmtAge(h) {
    if (h < 1) return '<1h';
    if (h < 24) return h + 'h';
    return Math.floor(h / 24) + 'd';
  }
  var OVER_THRESHOLD = 8, WATCH_THRESHOLD = 6;
  function person(key) { return key === 'me' ? { name: ME.name + ' (you)', initials: ME.initials, av: 'blue', me: true } : PEOPLE[key]; }
  function avatar(p, size) { return '<span class="av ' + (p.av || '') + '" style="--av:' + (size || 28) + 'px">' + esc(p.initials) + '</span>'; }
  function cloneTask(t) { var c = {}; for (var p in t) c[p] = t[p]; return c; }

  /* ---------------- shared state (read + write the SAME store the dept queues use) ---------------- */
  var SHARED_KEY = 'rd_dept_state_v3';
  function loadShared() { try { return JSON.parse(localStorage.getItem(SHARED_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveShared(s) { try { localStorage.setItem(SHARED_KEY, JSON.stringify(s)); } catch (e) {} }
  var shared = loadShared();
  if (!shared.config || !CONFIGS[shared.config]) shared.config = '5';
  if (!shared.claims) shared.claims = {};
  if (shared.navOpen == null) shared.navOpen = true;
  if (shared.showAll == null) shared.showAll = false;
  function commitShared() { var cur = loadShared(); cur.config = shared.config; cur.claims = shared.claims; cur.navOpen = shared.navOpen; cur.showAll = shared.showAll; saveShared(cur); }

  function configDepts() { return CONFIGS[shared.config].depts; }

  /* ---------------- My-Work view prefs (own key — doesn't touch shared task state) ---------------- */
  var VK = 'rd_mywork_view_v1';
  var view = { group: 'priority', filter: 'all', dept: 'all', type: 'all', sort: 'urgency', doneOpen: false };
  try { var sv = JSON.parse(localStorage.getItem(VK) || '{}'); if (sv && typeof sv === 'object') for (var k in sv) view[k] = sv[k]; } catch (e) {}
  function saveView() { try { localStorage.setItem(VK, JSON.stringify(view)); } catch (e) {} }

  /* ---------------- claim overrides → effective assignee ---------------- */
  function effAssignee(t) {
    var ov = shared.claims[t.id];
    if (ov === '__none__') return null;
    if (ov) return ov;
    return t.assignee || null;
  }

  /* pool size for a department (after overrides) — used by the sidebar counts */
  function availCount(id) {
    var base = DEPTS[id]; if (!base) return 0;
    var n = 0;
    base.available.concat(base.claimed).forEach(function (t) { if (effAssignee(t) == null) n++; });
    return n;
  }

  /* ---------------- gather MY tasks across every department in the config ---------------- */
  function gather() {
    var rows = [];
    configDepts().forEach(function (id) {
      var d = DEPTS[id]; if (!d) return;
      d.available.concat(d.claimed).forEach(function (t) {
        if (effAssignee(t) === 'me') {
          var c = cloneTask(t); c.assignee = 'me'; c._deptId = id; c._dept = d.name; rows.push(c);
        }
      });
    });
    return rows;
  }
  function isReview(t) { return !t.done && t.conf === 'low'; }
  function isAging(t) { return !t.done && t.ageH >= OVER_THRESHOLD; }

  /* ============================================================
     SIDEBAR NAV — My Work (active) + progressive Departments
     ============================================================ */
  function renderNav() {
    var html = '';
    html += '<a class="nav-i on" data-nav="mywork" href="#" title="My Work">' +
      ICON.mywork + '<span class="nl">My Work</span></a>';

    var list = configDepts();
    var single = list.length === 1;
    var deptHref = function (id) { return '../departments/Robin Dock - Departments.html#/dept/' + id; };

    if (single) {
      var only = DEPTS[list[0]]; var n = availCount(only.id);
      html += '<a class="nav-i" data-nav="departments" href="' + deptHref(only.id) + '" title="' + esc(only.name) + '">' +
        ICON.dept + '<span class="nl">' + esc(only.name) + '</span>' + (n ? '<span class="ct">' + n + '</span>' : '') + '</a>';
    } else {
      html += '<button class="nav-parent' + (shared.navOpen ? ' open' : '') + '" id="deptParent" title="Departments">' +
        ICON.dept + '<span class="nl">Departments</span><span class="caret">' + ICON.caret + '</span></button>';
      if (shared.navOpen) html += '<div class="dept-children">' + deptChildren(list, deptHref) + '</div>';
    }
    deptNav.innerHTML = html;
  }
  function deptRow(id, deptHref) {
    var d = DEPTS[id], n = availCount(id);
    return '<a class="dept-i" data-dept="' + id + '" href="' + deptHref(id) + '" title="' + esc(d.name) + '">' +
      '<span class="dn">' + esc(d.name) + '</span>' +
      '<span class="ct' + (n ? '' : ' zero') + '">' + n + '</span></a>';
  }
  function deptChildren(list, deptHref) {
    var condensed = list.length >= 10, html = '';
    if (!condensed) { list.forEach(function (id) { html += deptRow(id, deptHref); }); return html; }
    var shown = PINNED.filter(function (id) { return list.indexOf(id) >= 0; });
    var rest = list.filter(function (id) { return shown.indexOf(id) < 0; });
    if (!shared.showAll) {
      shown.forEach(function (id) { html += deptRow(id, deptHref); });
      if (rest.length) html += '<div class="dept-showall" id="deptShowAll">' + ICON.chevDown + '<span>Show all ' + list.length + '</span></div>';
    } else {
      list.forEach(function (id) { html += deptRow(id, deptHref); });
      html += '<div class="dept-showall open" id="deptShowAll">' + ICON.chevDown + '<span>Show less</span></div>';
    }
    return html;
  }

  /* ============================================================
     ROW CELLS — mirror the department queue's signal language
     ============================================================ */
  function typeBadge(t) { var m = TYPES[t]; return '<span class="tag ' + m.cls + '"><span class="d"></span>' + m.label + '</span>'; }

  function ageCell(h) {
    var st = h >= OVER_THRESHOLD ? 'over' : (h >= WATCH_THRESHOLD ? 'watch' : (h < 3 ? 'fresh' : 'normal'));
    var pct = Math.max(6, Math.min(h / OVER_THRESHOLD, 1) * 100);
    return '<span class="age st-' + st + '" title="' + h + 'h held' + (st === 'over' ? ' — past 8h SLA' : '') + '">' +
      '<span class="atop">' + (st === 'over' ? '<span class="aflag">' + ICON.clock + '</span>' : '') +
      '<span class="atime">' + fmtAge(h) + '</span></span>' +
      '<span class="atrack"><i style="width:' + pct + '%"></i></span></span>';
  }
  function critFlag(c) {
    return '<span class="critflag">' + ICON.alert +
      '<span class="cf-lead">Critical</span>' +
      '<span class="cf-val">' + esc(c.sym) + ' ' + esc(c.val) + ' ' + esc(c.unit) + '</span>' +
      '<span class="cf-dir ' + esc(c.dir) + '">' + (c.dir === 'high' ? '\u25B2 high' : '\u25BC low') + '</span></span>';
  }
  function taskCell(t) {
    var pat = t.patient
      ? '<span class="tsub"><span class="pat">' + esc(t.patient) + '</span></span>'
      : '<span class="tsub"><span class="unksender">' + ICON.scQ + 'Patient not yet linked</span></span>';
    return '<div class="tcell"><span class="tt">' + esc(t.title) + '</span>' + pat + (t.crit ? critFlag(t.crit) : '') + '</div>';
  }
  function sourceMeta(sender) {
    var s = (sender || '').toLowerCase();
    if (/unknown/.test(s)) return { cls: 'unk', label: 'Unknown sender', icon: ICON.scQ };
    if (/owner/.test(s)) return { cls: 'upl', label: 'Owner', icon: ICON.scOwner };
    if (/in-house|analyzer/.test(s)) return { cls: 'lab', label: 'In-house lab', icon: ICON.scLab };
    if (/idexx|antech|\blab\b|diagnostic|patholog/.test(s)) return { cls: 'lab', label: 'Lab', icon: ICON.scLab };
    if (/imaging|radiolog|mri/.test(s)) return { cls: 'img', label: 'Imaging', icon: ICON.scImg };
    if (/emergenc/.test(s)) return { cls: 'er', label: 'Emergency / ER', icon: ICON.scEr };
    if (/specialist|specialt|derm|cardiolog|surgical|dental|avian|oncolog|neurolog|ophthalm|ortho/.test(s)) return { cls: 'spec', label: 'Specialty', icon: ICON.scSpec };
    if (/trupanion|nationwide|insur/.test(s)) return { cls: 'other', label: 'Insurer', icon: ICON.scOther };
    if (/boarding|kennel|aspen/.test(s)) return { cls: 'other', label: 'Boarding facility', icon: ICON.scOther };
    if (/internal/.test(s)) return { cls: 'other', label: 'Internal', icon: ICON.scOther };
    if (/fax/.test(s)) return { cls: 'other', label: 'Fax', icon: ICON.scFax };
    if (/clinic|hospital|veterinary|vet|pet|animal|paws|claws|bark/.test(s)) return { cls: 'gp', label: 'Referring vet', icon: ICON.scGp };
    return { cls: 'other', label: 'Other', icon: ICON.scOther };
  }
  function sourceCell(t) {
    var m = sourceMeta(t.sender), unk = t.sender === 'Unknown sender';
    return '<div class="srccell"><span class="srcsq ' + m.cls + ' has-tip" data-tip="' + esc(m.label) + '">' + m.icon + '</span>' +
      '<span class="srctxt' + (unk ? ' unk' : '') + '">' + esc(t.sender) + '</span></div>';
  }
  function deptCell(t) {
    return '<a class="mw-dept" href="../departments/Robin Dock - Departments.html#/dept/' + t._deptId + '" data-deptlink="1" title="Open the ' + esc(t._dept) + ' queue">' +
      '<span class="di">' + ICON.deptSm + '</span><span class="dn">' + esc(t._dept) + '</span></a>';
  }
  function statusCell(t) {
    if (isReview(t)) return '<span class="mw-st review"><span class="rv">' + ICON.review + 'Needs review</span></span>';
    return '<span class="mw-st prog"><span class="pdot"></span>In progress</span>';
  }

  /* ---------------- the table ---------------- */
  function tableFor(rows) {
    var body = rows.map(function (t) {
      var cls = [];
      if (t.crit) cls.push('critrow'); else if (isReview(t)) cls.push('reviewrow');
      return '<tr data-task="' + t.id + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' +
        '<td class="shrink">' + typeBadge(t.type) + '</td>' +
        '<td>' + taskCell(t) + '</td>' +
        '<td>' + sourceCell(t) + '</td>' +
        '<td>' + deptCell(t) + '</td>' +
        '<td class="shrink">' + statusCell(t) + '</td>' +
        '<td class="shrink">' + ageCell(t.ageH) + '</td>' +
        '<td class="shrink"><button type="button" class="mw-kebab" data-reassign="' + t.id + '" title="Reassign, hand off or release" aria-haspopup="listbox">' + ICON.kebab + '</button></td>' +
        '</tr>';
    }).join('');
    return '<table class="ct qt qt-mywork"><thead><tr>' +
      '<th>Document type</th><th>Task</th><th>Source</th><th>Department</th><th>Status</th><th>Held</th><th></th>' +
      '</tr></thead><tbody>' + body + '</tbody></table>';
  }

  /* ---------------- sort + filter + group ---------------- */
  function passesFilter(t) {
    if (view.filter === 'review' && !isReview(t)) return false;
    if (view.filter === 'critical' && !t.crit) return false;
    if (view.dept !== 'all' && t._deptId !== view.dept) return false;
    if (view.type !== 'all' && t.type !== view.type) return false;
    return true;
  }
  function sortRows(rows) {
    var s = view.sort;
    var arr = rows.slice();
    arr.sort(function (a, b) {
      if (s === 'age') return b.ageH - a.ageH;
      if (s === 'dept') { if (a._dept !== b._dept) return a._dept < b._dept ? -1 : 1; return b.ageH - a.ageH; }
      if (s === 'type') { if (a.type !== b.type) return TYPES[a.type].label < TYPES[b.type].label ? -1 : 1; return b.ageH - a.ageH; }
      /* urgency (default): critical first, then aging-over-SLA, then needs-review, then oldest-held */
      function score(t) { return t.crit ? 0 : (isAging(t) ? 1 : (isReview(t) ? 2 : 3)); }
      var sa = score(a), sb = score(b);
      if (sa !== sb) return sa - sb;
      return b.ageH - a.ageH;
    });
    return arr;
  }

  /* ---------------- signal legend ---------------- */
  function legend() {
    return '<div class="siglegend">' +
      '<span class="sl-t">How to scan</span>' +
      '<span class="sl-i" style="color:var(--bad-ink)"><span class="sl-sw" style="background:var(--bad)"></span>Critical value — handle first</span>' +
      '<span class="sl-i" style="color:var(--warn-ink)"><span class="sl-sw" style="background:var(--warn)"></span>Held — escalates past ' + OVER_THRESHOLD + 'h SLA</span>' +
      '<span class="sl-i" style="color:var(--violet-600)"><span class="sl-sw" style="background:var(--violet-400)"></span>Needs review — slow / low-confidence</span>' +
      '</div>';
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    closeAssignMenu();
    document.title = 'RobinDock — My Work';
    syncUserDepts();

    var all = gather();
    var active = all.filter(function (t) { return !t.done; });
    var done = all.filter(function (t) { return t.done; });

    /* zero claimed work at all → the good "all caught up" state */
    if (!active.length && !done.length) { content.innerHTML = head(active, done) + emptyAllCaught(); renderNav(); return; }

    /* apply filters + sort */
    var shownActive = sortRows(active.filter(passesFilter));

    var listHtml;
    if (!active.length) {
      listHtml = emptyActive();
    } else if (!shownActive.length) {
      listHtml = noResult();
    } else if (view.group === 'dept') {
      listHtml = groupedByDept(shownActive);
    } else {
      listHtml = '<div class="zone ctable">' + tableFor(shownActive) + '</div>';
    }

    content.innerHTML = head(active, done) + statBar(active) + toolbar(active) + legend() + listHtml + doneDrawer(done);
    renderNav();
  }

  function head(active, done) {
    var nDept = configDepts().length;
    var spanDepts = uniqDepts(active).length;
    return '<div class="mw-page">' +
      '<div class="mw-head">' +
        '<span class="mw-av">' + avatar({ initials: ME.initials, av: 'blue' }, 56) + '<span class="ring"></span></span>' +
        '<div class="mw-main">' +
          '<h1>My Work</h1>' +
          '<div class="mw-sub">Everything you\u2019ve claimed, across every department \u2014 your personal to-do, prioritized by what needs attention next. ' +
            (active.length ? 'You\u2019re holding <b>' + active.length + '</b> active task' + (active.length === 1 ? '' : 's') + (spanDepts > 1 ? ' across <b>' + spanDepts + '</b> departments' : '') + '.' : 'Nothing active right now.') +
          '</div>' +
        '</div>' +
        '<div class="mw-aside">' +
          '<span class="accesslogged">' + ICON.logged + 'Opening a task logs access</span>' +
          '<span class="mw-scope">Across <b>' + nDept + '</b> department' + (nDept === 1 ? '' : 's') + ' in this practice</span>' +
        '</div>' +
      '</div>';
  }
  function uniqDepts(rows) { var seen = {}, out = []; rows.forEach(function (t) { if (!seen[t._deptId]) { seen[t._deptId] = 1; out.push(t._deptId); } }); return out; }

  function statBar(active) {
    var crit = active.filter(function (t) { return t.crit; }).length;
    var rev = active.filter(isReview).length;
    var aging = active.filter(isAging).length;
    var html = '<div class="mw-stats">';
    html += '<span class="mw-stat active"><span class="n">' + active.length + '</span><span class="l">Active</span></span>';
    if (crit) html += '<span class="mw-stat crit"><span class="n">' + crit + '</span><span class="l">Critical</span></span>';
    if (rev) html += '<span class="mw-stat review"><span class="n">' + rev + '</span><span class="l">Need review</span></span>';
    if (aging) html += '<span class="mw-stat aging"><span class="n">' + aging + '</span><span class="l">Aging · over SLA</span></span>';
    html += '</div>';
    return html;
  }

  function toolbar(active) {
    var cAll = active.length;
    var cRev = active.filter(isReview).length;
    var cCrit = active.filter(function (t) { return t.crit; }).length;

    var deptOpts = '<option value="all">All departments</option>' + configDepts().map(function (id) {
      return '<option value="' + id + '"' + (view.dept === id ? ' selected' : '') + '>' + esc(DEPTS[id].name) + '</option>';
    }).join('');
    var typeOpts = '<option value="all">All types</option>' + Object.keys(TYPES).map(function (k) {
      return '<option value="' + k + '"' + (view.type === k ? ' selected' : '') + '>' + esc(TYPES[k].label) + '</option>';
    }).join('');
    var sortOpts = [['urgency', 'Urgency'], ['age', 'Age held'], ['dept', 'Department'], ['type', 'Type']].map(function (o) {
      return '<option value="' + o[0] + '"' + (view.sort === o[0] ? ' selected' : '') + '>Sort: ' + o[1] + '</option>';
    }).join('');

    return '<div class="mw-toolbar">' +
      '<div class="segs" id="mwGroup">' +
        '<button class="seg' + (view.group === 'priority' ? ' on' : '') + '" data-group="priority">By priority</button>' +
        '<button class="seg' + (view.group === 'dept' ? ' on' : '') + '" data-group="dept">By department</button>' +
      '</div>' +
      '<div class="segs" id="mwFilter">' +
        '<button class="seg' + (view.filter === 'all' ? ' on' : '') + '" data-filter="all">All <span class="n">' + cAll + '</span></button>' +
        '<button class="seg' + (view.filter === 'review' ? ' on' : '') + '" data-filter="review">Needs review <span class="n">' + cRev + '</span></button>' +
        '<button class="seg' + (view.filter === 'critical' ? ' on' : '') + '" data-filter="critical">Critical <span class="n">' + cCrit + '</span></button>' +
      '</div>' +
      '<div class="mw-right">' +
        '<div class="mw-sel"><select class="input" id="mwDeptSel" aria-label="Filter by department">' + deptOpts + '</select></div>' +
        '<div class="mw-sel"><select class="input" id="mwTypeSel" aria-label="Filter by type">' + typeOpts + '</select></div>' +
        '<div class="mw-sel"><select class="input" id="mwSortSel" aria-label="Sort">' + sortOpts + '</select></div>' +
      '</div>' +
    '</div>';
  }

  function groupedByDept(rows) {
    var order = configDepts().filter(function (id) { return rows.some(function (t) { return t._deptId === id; }); });
    return order.map(function (id) {
      var grp = rows.filter(function (t) { return t._deptId === id; });
      return '<div class="mw-group">' +
        '<div class="mw-ghead"><span class="gi">' + ICON.deptSm + '</span>' +
          '<h3>' + esc(DEPTS[id].name) + '</h3><span class="gc">' + grp.length + '</span>' +
          '<a class="gopen" href="../departments/Robin Dock - Departments.html#/dept/' + id + '">Open queue ' + ICON.chevR + '</a></div>' +
        tableFor(grp) + '</div>';
    }).join('');
  }

  function doneDrawer(done) {
    if (!done.length) return '</div>';
    var body = view.doneOpen
      ? '<div class="mw-dbody"><div class="mw-dnote">Resolved Tasks drop off your active list automatically. This is a short reference of what you recently closed \u2014 it logs the same way when reopened.</div>' +
        '<div class="zone ctable">' + doneTable(done) + '</div></div>'
      : '';
    return '<div class="mw-done">' +
      '<button class="mw-dtoggle' + (view.doneOpen ? ' open' : '') + '" id="doneToggle"><span class="cv">' + ICON.chevR + '</span>' +
        'Recently completed by you <span class="gc">' + done.length + '</span></button>' +
      body + '</div></div>';
  }
  function doneTable(rows) {
    var body = rows.map(function (t) {
      return '<tr data-task="' + t.id + '" class="donerow">' +
        '<td class="shrink">' + typeBadge(t.type) + '</td>' +
        '<td>' + taskCell(t) + '</td>' +
        '<td>' + sourceCell(t) + '</td>' +
        '<td>' + deptCell(t) + '</td>' +
        '<td class="shrink"><span class="status done">' + ICON.checksm + 'Complete</span></td>' +
        '<td class="shrink">' + ageCell(t.ageH) + '</td>' +
        '<td class="shrink"></td>' +
        '</tr>';
    }).join('');
    return '<table class="ct qt qt-mywork"><thead><tr>' +
      '<th>Document type</th><th>Task</th><th>Source</th><th>Department</th><th>Status</th><th>Held</th><th></th>' +
      '</tr></thead><tbody>' + body + '</tbody></table>';
  }

  function emptyAllCaught() {
    return '<div class="mw-empty"><div class="ei">' + ICON.check + '</div>' +
      '<h2>All caught up</h2>' +
      '<p>You have no claimed tasks right now. A healthy personal list trends toward empty \u2014 pick up your next thing from any department pool and it\u2019ll land here.</p>' +
      '<a class="btn btn-blue ea" href="../departments/Robin Dock - Departments.html">Go to department queues</a></div></div>';
  }
  function emptyActive() {
    return '<div class="mw-empty" style="border-color:var(--ok);min-height:240px"><div class="ei">' + ICON.check + '</div>' +
      '<h2>Nothing active on your plate</h2>' +
      '<p>Everything you\u2019ve claimed is complete. Your recently closed work is below for reference.</p></div>';
  }
  function noResult() {
    return '<div class="mw-noresult"><h4>No tasks match this filter</h4>' +
      '<p>Try clearing the filter or widening the department / type selection above.</p></div>';
  }

  function syncUserDepts() {
    var el = document.getElementById('userDepts'); if (!el) return;
    var n = configDepts().length;
    el.textContent = 'Member of ' + n + ' department' + (n === 1 ? '' : 's');
  }

  /* ============================================================
     REASSIGN / HAND-OFF / RELEASE — writes back to shared state
     (reuses the dept queue's Jira-style assignee picker)
     ============================================================ */
  function findTaskAnywhere(id) {
    var list = configDepts();
    for (var i = 0; i < list.length; i++) {
      var d = DEPTS[list[i]]; if (!d) continue;
      var all = d.available.concat(d.claimed);
      for (var j = 0; j < all.length; j++) if (all[j].id === id) return all[j];
    }
    return null;
  }
  function assignRoster() {
    var items = [{ key: 'me', name: ME.name, suffix: ' (you · keep)', av: 'blue', initials: ME.initials }];
    for (var k in PEOPLE) items.push({ key: k, name: PEOPLE[k].name, av: PEOPLE[k].av, initials: PEOPLE[k].initials });
    return items;
  }
  var assignMenu = null, assignMenuTask = null, assignTrigger = null;
  function ensureAssignMenu() {
    if (assignMenu) return assignMenu;
    assignMenu = document.createElement('div');
    assignMenu.className = 'assign-menu';
    document.body.appendChild(assignMenu);
    assignMenu.addEventListener('click', function (e) {
      var row = e.target.closest('[data-pick]');
      if (row) { e.stopPropagation(); pickAssign(row.dataset.pick); }
    });
    assignMenu.addEventListener('input', function (e) {
      if (e.target.classList.contains('am-input')) {
        var q = (e.target.value || '').trim().toLowerCase();
        assignMenu.querySelectorAll('.am-row[data-name]').forEach(function (r) { r.style.display = r.dataset.name.indexOf(q) >= 0 ? '' : 'none'; });
      }
    });
    return assignMenu;
  }
  function openAssignMenu(taskId, trigger) {
    ensureAssignMenu();
    if (assignMenuTask === taskId && assignMenu.classList.contains('open')) { closeAssignMenu(); return; }
    assignMenuTask = taskId; assignTrigger = trigger;
    var cur = 'me';
    var html = '<div class="am-search"><span class="am-sic">' + ICON.searchSm + '</span>' +
      '<input type="text" class="am-input" placeholder="Reassign to…" autocomplete="off" spellcheck="false"></div>' +
      '<div class="am-list">' +
      '<button type="button" class="am-row am-auto" data-pick="__auto" data-name="release pool unassigned automatic">' +
        '<span class="am-ic">' + ICON.userCircle + '</span><span class="am-nm">Release to pool<span class="am-sx"> · un-claim</span></span>' +
        '<span class="am-tick"></span></button>';
    assignRoster().forEach(function (p) {
      var on = p.key === cur;
      html += '<button type="button" class="am-row' + (on ? ' on' : '') + '" data-pick="' + p.key + '" data-name="' + esc(p.name.toLowerCase()) + '">' +
        '<span class="av ' + (p.av || '') + '" style="--av:26px">' + esc(p.initials) + '</span>' +
        '<span class="am-nm">' + esc(p.name) + (p.suffix ? '<span class="am-sx">' + esc(p.suffix) + '</span>' : '') + '</span>' +
        '<span class="am-tick">' + (on ? ICON.checksm : '') + '</span></button>';
    });
    html += '</div>';
    assignMenu.innerHTML = html;

    var r = trigger.getBoundingClientRect();
    assignMenu.style.visibility = 'hidden'; assignMenu.classList.add('open');
    var mw = assignMenu.offsetWidth, mh = assignMenu.offsetHeight;
    var left = Math.min(r.right - mw, window.innerWidth - mw - 12);
    var top = r.bottom + 6;
    if (top + mh > window.innerHeight - 12) top = Math.max(12, r.top - mh - 6);
    assignMenu.style.left = Math.max(12, left) + 'px';
    assignMenu.style.top = top + 'px';
    assignMenu.style.visibility = '';
    trigger.classList.add('active');
    var input = assignMenu.querySelector('.am-input'); if (input) input.focus();
  }
  function closeAssignMenu() {
    if (assignMenu) assignMenu.classList.remove('open');
    if (assignTrigger) assignTrigger.classList.remove('active');
    assignMenuTask = null; assignTrigger = null;
  }
  function pickAssign(key) {
    var id = assignMenuTask; closeAssignMenu();
    if (!id) return;
    if (key === 'me') return; // keep — no change
    doReassign(id, key === '__auto' ? null : key);
  }
  function doReassign(id, who) {
    var t = findTaskAnywhere(id); if (!t) return;
    shared.claims[id] = (who === null ? '__none__' : who); commitShared();
    if (who === null) toast('Released to pool', (t.title) + ' — back to the queue · logged', 'ok');
    else toast('Reassigned', t.title + ' → ' + person(who).name + ' · logged', 'ok');
    /* it leaves my list → fade the row, then re-render */
    var row = content.querySelector('tr[data-task="' + id + '"]');
    if (row) { row.classList.add('claiming'); setTimeout(render, 380); }
    else render();
  }

  /* ---------------- open a task → fulfillment (logs access) ---------------- */
  function openTask(t) {
    var params = new URLSearchParams();
    params.set('from', 'mywork');
    params.set('type', t.type);
    params.set('id', t.id);
    params.set('title', t.title);
    params.set('sender', t.sender);
    if (t.patient) params.set('patient', t.patient);
    if (t.crit) params.set('crit', '1');
    if (t.done) { params.set('done', '1'); params.set('resolvedBy', ME.name); }
    location.href = '../fulfillment/Robin Dock - Fulfillment.html?' + params.toString();
  }

  /* ---------------- toasts ---------------- */
  var toastWrap = document.getElementById('logToasts');
  function toast(title, sub, kind) {
    var el = document.createElement('div');
    el.className = 'logtoast ' + (kind || 'ok');
    var ic = kind === 'bad' ? ICON.lock : ICON.checksm;
    el.innerHTML = '<span class="lic">' + ic + '</span><div><div class="lt">' + esc(title) + '</div>' + (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>';
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 280); }, 2600);
    while (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  }

  /* ============================================================
     EVENTS
     ============================================================ */
  content.addEventListener('click', function (e) {
    var rb = e.target.closest('[data-reassign]');
    if (rb) { e.stopPropagation(); openAssignMenu(rb.dataset.reassign, rb); return; }
    if (e.target.closest('[data-deptlink]') || e.target.closest('.gopen')) return; // let dept links navigate

    var grp = e.target.closest('#mwGroup [data-group]');
    if (grp) { view.group = grp.dataset.group; saveView(); render(); return; }
    var flt = e.target.closest('#mwFilter [data-filter]');
    if (flt) { view.filter = flt.dataset.filter; saveView(); render(); return; }
    var dt = e.target.closest('#doneToggle');
    if (dt) { view.doneOpen = !view.doneOpen; saveView(); render(); return; }

    var row = e.target.closest('tr[data-task]');
    if (row) {
      var all = gather(); var id = row.dataset.task;
      var t = null; for (var i = 0; i < all.length; i++) if (all[i].id === id) { t = all[i]; break; }
      if (t) openTask(t);
    }
  });
  content.addEventListener('change', function (e) {
    if (e.target.id === 'mwDeptSel') { view.dept = e.target.value; saveView(); render(); }
    else if (e.target.id === 'mwTypeSel') { view.type = e.target.value; saveView(); render(); }
    else if (e.target.id === 'mwSortSel') { view.sort = e.target.value; saveView(); render(); }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.assign-menu') && !e.target.closest('[data-reassign]')) closeAssignMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAssignMenu(); });
  window.addEventListener('scroll', closeAssignMenu, true);

  /* sidebar: departments expand / show-all */
  deptNav.addEventListener('click', function (e) {
    if (e.target.closest('#deptParent')) { e.preventDefault(); shared.navOpen = !shared.navOpen; commitShared(); renderNav(); return; }
    if (e.target.closest('#deptShowAll')) { e.preventDefault(); shared.showAll = !shared.showAll; commitShared(); renderNav(); return; }
    if (e.target.closest('[data-nav="mywork"]')) { e.preventDefault(); } // already here
  });

  /* prototype config toggle — changes the cross-department scope */
  var protoSeg = document.getElementById('protoSeg');
  function syncProto() { protoSeg.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.cfg === shared.config); }); }
  protoSeg.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cfg]'); if (!b || b.dataset.cfg === shared.config) return;
    shared.config = b.dataset.cfg; shared.showAll = false; shared.navOpen = true; commitShared();
    if (view.dept !== 'all' && configDepts().indexOf(view.dept) < 0) view.dept = 'all';
    saveView(); syncProto(); render();
  });

  /* ============================================================
     SHELL CHROME (collapse + dropdowns) — same as the other surfaces
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
  if (bell) bell.addEventListener('click', function (e) { e.stopPropagation(); var open = !notifPanel.classList.contains('open'); closeMenus(notifPanel); notifPanel.classList.toggle('open', open); });
  var userBtn = document.getElementById('userBtn');
  if (userBtn) userBtn.addEventListener('click', function (e) { e.stopPropagation(); var open = !userPanel.classList.contains('open'); closeMenus(userPanel); userPanel.classList.toggle('open', open); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.bellwrap') && !e.target.closest('.usermenu')) closeMenus(null); });
  var clearN = document.getElementById('clearNotif');
  if (clearN) clearN.addEventListener('click', function () {
    document.getElementById('notifList').innerHTML =
      '<div class="ct-empty" style="padding:30px 20px"><div class="ico">' + ICON.check + '</div><h4>You\u2019re all caught up</h4><p>New notifications will appear here.</p></div>';
    document.getElementById('bellDot').style.display = 'none';
  });

  /* ---------------- boot ---------------- */
  syncProto();
  render();
})();
