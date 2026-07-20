/* ============================================================
   RobinDock — Patient Detail · RENDERER + INTERACTIONS
   The collect → reconcile → push staging surface for one animal.
   Renders into #appContent (the live app shell). Uses helpers
   exposed by app.js via window.RD. Mock data only.

   States (toggleable via the prototype switcher):
     pims  : connected | none          (§4.4)
     push  : changed | current | never  (§5)
     data  : full | sparse              (§4.3 / §7)
     life  : active | deceased          (§7)
   ============================================================ */
(function () {
  'use strict';

  function RD() { return window.RD || {}; }
  var content, titleEl;

  /* ---------------- local icons ---------------- */
  var I = {
    paw: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="10" r="1.9" fill="currentColor"/><circle cx="10" cy="6.3" r="1.9" fill="currentColor"/><circle cx="14.5" cy="6.3" r="1.9" fill="currentColor"/><circle cx="18.5" cy="10" r="1.9" fill="currentColor"/><path d="M12.3 11c2.5 0 4.5 1.9 4.5 4.1 0 1.7-1.4 2.5-3.1 2.5-.8 0-1-.3-1.6-.3s-.8.3-1.6.3c-1.7 0-3.1-.8-3.1-2.5 0-2.2 2-4.1 4.5-4.1z" fill="currentColor"/></svg>',
    shield: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ins: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.7"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    chev: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arr: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l5 6-5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    push: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V7M7 12l5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 5h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pushBtn: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 19V7M7 12l5-5 5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 5h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4l9 16H3l9-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plug: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0V7zM12 16v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 4h3l1.5 4-2 1.2a11 11 0 0 0 4.3 4.3L14 15l3 1 1 3v2a1 1 0 0 1-1 1A14 14 0 0 1 4 7a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    mail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M5 8l7 5 7-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cases: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7a2 2 0 012-2h3l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    flock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="7" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="7" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="17" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M9 8l2 6M15 8l-2 6" stroke="currentColor" stroke-width="1.7"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.7"/></svg>',
    caret: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var PIMS_NAME = 'Vetspire';

  /* ---------------- state (persisted) ---------------- */
  var DEF = { pims: 'connected', push: 'changed', data: 'full', life: 'active' };
  var state = load();
  function load() {
    try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem('rd_pt_state') || '{}')); }
    catch (e) { return Object.assign({}, DEF); }
  }
  function save() { try { localStorage.setItem('rd_pt_state', JSON.stringify(state)); } catch (e) {} }

  /* session interaction state (reset per patient) */
  var currentId = null, loggedId = null;
  var reconciled = {};   // fieldKey -> { value, srcKey|null, manual }
  var edits = {};        // fieldKey -> value (corrected/added)
  var editingKey = null;
  var historyView = 'threads';
  var pushedThisSession = false;

  function resetSession() { reconciled = {}; edits = {}; editingKey = null; historyView = 'threads'; pushedThisSession = false; }

  /* ---------------- helpers ---------------- */
  function esc(s) { return RD().esc ? RD().esc(s) : String(s == null ? '' : s); }
  function fmtDate(d) { return RD().fmtDate ? RD().fmtDate(d) : (d || '—'); }
  function logAccess(s) { if (RD().logAccess) RD().logAccess(s); }
  function toast(t, s, k) { if (RD().toast) RD().toast(t, s, k); }
  function findPatient(id) { return RD().findPatient ? RD().findPatient(id) : null; }
  function initials(n) { return String(n).split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function age(dob) {
    if (!dob) return null;
    var d = new Date(dob + 'T00:00:00'), now = new Date('2026-06-09T00:00:00');
    var y = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) y--;
    return y + 'y';
  }

  /* ============================================================
     DATA SHAPING for the active state
     ============================================================ */
  function getDetail(p, c) {
    var base = window.RD_PATIENT.get(p.id) || window.RD_PATIENT.derive(p, c);
    if (state.data === 'sparse') base = window.RD_PATIENT.sparse(base);
    return base;
  }
  function srcOf(detail, key) { return key ? detail.sources[key] : null; }

  /* unresolved conflicts remaining (gates push) */
  function unresolvedConflicts(detail) {
    var n = 0;
    detail.groups.forEach(function (g) {
      g.fields.forEach(function (f) { if (f.conflict && !reconciled[f.key]) n++; });
    });
    return n;
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function renderPatientDetail(id) {
    content = document.getElementById('appContent');
    titleEl = document.getElementById('appTitle');
    var f = findPatient(id);
    if (!f) { removeSwitcher(); return; }
    var p = f.p, c = f.c;

    if (id !== currentId) { currentId = id; resetSession(); }
    if (state.life === 'deceased') p = Object.assign({}, p, { status: 'deceased' });

    titleEl.textContent = p.name;
    document.title = 'RobinDock — ' + p.name;
    var detail = getDetail(p, c);

    content.innerHTML =
      '<div class="cl-page">' +
        '<span class="cd-back" data-client="' + c.id + '">' + I.back + 'Back to ' + esc(c.name) + '</span>' +
        identityHeader(p, c) +
        pushBand(detail) +
        '<div class="pt-body">' +
          '<div class="pt-main">' + aggregateZone(detail, p) + historyZone(detail) + '</div>' +
          '<div class="pt-side">' + sideColumn(p, c, detail) + '</div>' +
        '</div>' +
      '</div>';

    renderSwitcher();

    if (id !== loggedId) { loggedId = id; logAccess('Opened patient ' + p.name + ' · ' + c.name + ' (view logged)'); }
  }
  window.renderPatientDetail = renderPatientDetail;

  /* ---------- identity header (§4.1) ---------- */
  function identityHeader(p, c) {
    var gone = p.status === 'deceased' || p.status === 'inactive';
    var lifeCls = p.status === 'deceased' ? 'deceased' : (p.status === 'inactive' ? 'inactive' : 'active');
    var lifeLabel = lifeCls.charAt(0).toUpperCase() + lifeCls.slice(1) + (lifeCls === 'active' ? ' patient' : '');
    var ins = p.insurer
      ? '<span class="ins">' + I.ins + 'Insured · ' + esc(p.insurer) + '</span>'
      : '<span class="ins none">' + I.ins + 'No insurance on file</span>';
    return '<div class="pt-id' + (gone ? ' gone' : '') + '"><div class="in">' +
      '<span class="big">' + I.paw + '</span>' +
      '<div class="meta">' +
        '<h1>' + esc(p.name) + ' <span class="life-badge ' + lifeCls + '"><span class="d"></span>' + lifeLabel + '</span></h1>' +
        '<div class="line">' +
          '<span class="id">' + esc(p.id.toUpperCase()) + '</span>' +
          '<span class="dot"></span>' + esc(p.species) + ' · ' + esc(p.breed) +
          '<span class="dot"></span>' + esc(({ FS: 'Female, spayed', MN: 'Male, neutered', F: 'Female', M: 'Male' })[p.sex] || p.sex) +
          '<span class="dot"></span>' + esc(p.age) +
        '</div>' +
        '<div class="sub2">' + ins +
          '<span class="logged-chip">' + I.shield + 'Access logged</span>' +
        '</div>' +
      '</div>' +
      '<div class="actions">' +
        '<button class="btn btn-light btn-sm" data-pt="edit-patient">' + I.edit + 'Edit patient</button>' +
      '</div>' +
    '</div></div>';
  }

  /* ---------- push-state band (§4.4 · §5) ---------- */
  function pushBand(detail) {
    if (state.pims === 'none') {
      return '<div class="pt-push none">' +
        '<span class="pic">' + I.plug + '</span>' +
        '<div class="pbody"><div class="ptitle">No system connected</div>' +
          '<div class="pmeta">Connect a PIMS in Connected Apps to push this patient\u2019s reconciled data to your record of truth.</div></div>' +
        '<div class="pactions"><a class="sync-link" href="#/connected">Connected Apps ' + I.arr + '</a></div>' +
      '</div>';
    }
    var unresolved = state.data === 'full' ? unresolvedConflicts(detail) : 0;
    var st = pushedThisSession ? 'current' : state.push;

    if (st === 'current') {
      return '<div class="pt-push current">' +
        '<span class="pic">' + I.check + '</span>' +
        '<div class="pbody"><div class="ptitle">Record is up to date<span class="push-pill"><span class="d"></span>In sync</span></div>' +
          '<div class="pmeta"><span class="dest">' + I.plug + PIMS_NAME + '</span><span class="dot"></span>' +
            'Last pushed <time>' + fmtDate(latestPush(detail)) + '</time><span class="dot"></span>No changes since</div></div>' +
        '<div class="pactions"><a class="sync-link" href="#/connected">Sync settings ' + I.arr + '</a></div>' +
      '</div>';
    }
    if (st === 'never') {
      return '<div class="pt-push never">' +
        '<span class="pic">' + I.push + '</span>' +
        '<div class="pbody"><div class="ptitle">Never pushed<span class="push-pill"><span class="d"></span>All pending</span></div>' +
          '<div class="pmeta"><span class="dest">' + I.plug + PIMS_NAME + '</span><span class="dot"></span>' +
            'This patient\u2019s data has not been sent to your connected system yet' +
            (unresolved ? '<span class="dot"></span>' + pushBlock(unresolved) : '') + '</div></div>' +
        '<div class="pactions">' + pushButton(unresolved) +
          '<a class="sync-link" href="#/sync">Go to Sync ' + I.arr + '</a></div>' +
      '</div>';
    }
    /* changed */
    return '<div class="pt-push changed">' +
      '<span class="pic">' + I.push + '</span>' +
      '<div class="pbody"><div class="ptitle">Changes ready to push<span class="push-pill"><span class="d"></span>Changed</span></div>' +
        '<div class="pmeta"><span class="dest">' + I.plug + PIMS_NAME + '</span><span class="dot"></span>' +
          'Last pushed <time>' + fmtDate(detail.push.pushedAt) + '</time><span class="dot"></span>' +
          'Updated <time>' + fmtDate(detail.lastUpdated) + '</time>' +
          (unresolved ? '<span class="dot"></span>' + pushBlock(unresolved) : '') + '</div></div>' +
      '<div class="pactions">' + pushButton(unresolved) +
        '<a class="sync-link" href="#/sync">Go to Sync ' + I.arr + '</a></div>' +
    '</div>';
  }
  function latestPush(detail) { return detail.lastUpdated; }
  function pushBlock(n) {
    return '<span class="push-block">' + I.warn + n + ' field' + (n > 1 ? 's' : '') + ' need' + (n > 1 ? '' : 's') + ' reconcile</span>';
  }
  function pushButton(unresolved) {
    if (unresolved) return '<button class="btn btn-light btn-sm" data-pt="push" disabled style="opacity:.5;cursor:not-allowed">' + I.pushBtn + 'Push this patient</button>';
    return '<button class="btn btn-blue btn-sm" data-pt="push">' + I.pushBtn + 'Push this patient</button>';
  }

  /* ---------- aggregate zone (§4.3) ---------- */
  function aggregateZone(detail, p) {
    var head = '<div class="zone-head"><div class="ov"><span>The aggregate</span><span class="ln"></span></div>' +
      '<h2>What we know now</h2>' +
      '<p>Clinical data RobinDock assembled from every document received about ' + esc(p.name) + '. Review, reconcile and complete it \u2014 then it\u2019s eligible to push.</p></div>';

    var emr = '<div class="emr-note">' + I.lock +
      '<div>This is a staging surface, not the medical record. You can <b>correct or complete</b> extracted fields; original clinical notes live in your EMR.</div></div>';

    var sparse = detail.sparse
      ? '<div class="sparse-note">' + I.warn + '<div><b>Sparse record.</b> Only a few documents have been received for ' + esc(p.name) + ' so far. Known fields are shown; the rest are marked <i>not on file</i> rather than guessed.</div></div>'
      : '';

    var groups = detail.groups.map(function (g) { return aggGroup(g, detail); }).join('');
    return head + emr + sparse + groups;
  }

  function aggGroup(g, detail) {
    var rows = g.fields.map(function (f) { return fieldRow(f, detail); }).join('');
    return '<div class="agg">' +
      '<div class="ghead"><h3>' + esc(g.title) + '</h3><span class="gtag">' + esc(g.tag) + '</span></div>' +
      rows +
    '</div>';
  }

  function fieldRow(f, detail) {
    /* editing this field inline */
    if (editingKey === f.key) {
      var cur = currentValue(f);
      return '<div class="field-row"><div class="fl">' + esc(f.label) + '</div>' +
        '<div class="fv"><input class="fin" id="finEdit" value="' + esc(cur || '') + '" placeholder="Enter value" />' +
          '<div class="fin-actions"><button class="btn btn-blue btn-sm" data-pt="save-edit" data-key="' + f.key + '">Save</button>' +
            '<button class="btn btn-light btn-sm" data-pt="cancel-edit">Cancel</button></div></div>' +
        '<div></div></div>';
    }
    /* unresolved conflict */
    if (f.conflict && !reconciled[f.key]) {
      var cands = f.conflict.candidates;
      var vals = cands.map(function (cd, i) {
        return (i ? '<span class="vs">vs</span>' : '') + '<span class="cv">' + esc(cd.value) + '</span>';
      }).join('');
      return '<div class="field-row conflict"><div class="fl">' + esc(f.label) + '</div>' +
        '<div class="fv"><div class="conflict-vals">' + vals + '</div>' +
          '<div class="conflict-flag" data-pt="reconcile" data-key="' + f.key + '">' + I.warn +
            cands.length + ' sources disagree \u00b7 Reconcile</div></div>' +
        '<div></div></div>';
    }
    /* reconciled */
    if (reconciled[f.key]) {
      var r = reconciled[f.key];
      var provR = r.manual
        ? '<span class="prov" style="cursor:default"><span class="src" style="color:var(--violet-600)">Corrected by you</span></span>'
        : provLine(srcOf(detail, r.srcKey));
      return '<div class="field-row"><div class="fl">' + esc(f.label) + '</div>' +
        '<div class="fv"><div class="val">' + esc(r.value) +
          '<span class="asprinted" style="background:var(--ok-bg);color:var(--ok-ink)">' + I.check + ' Reconciled</span></div>' +
          provR + '</div>' +
        '<div><span class="fedit" data-pt="edit-field" data-key="' + f.key + '">' + I.edit + 'Edit</span></div></div>';
    }
    /* missing / completable */
    var val = currentValue(f);
    if (val == null || val === '') {
      return '<div class="field-row"><div class="fl">' + esc(f.label) + '</div>' +
        '<div class="fv"><div class="val missing">Not on file</div></div>' +
        '<div><span class="fedit add" data-pt="edit-field" data-key="' + f.key + '">' + I.plus + 'Add</span></div></div>';
    }
    /* normal value + provenance */
    var edited = edits[f.key] != null;
    var asp = f.asPrinted ? '<span class="asprinted">as printed</span>' : '';
    var prov = edited
      ? '<span class="prov" style="cursor:default"><span class="src" style="color:var(--violet-600)">Corrected by you</span></span>'
      : provLine(srcOf(detail, f.src));
    return '<div class="field-row"><div class="fl">' + esc(f.label) + '</div>' +
      '<div class="fv"><div class="val' + (f.mono ? ' mono' : '') + '">' + esc(val) + asp + '</div>' + prov + '</div>' +
      '<div><span class="fedit" data-pt="edit-field" data-key="' + f.key + '">' + I.edit + 'Edit</span></div></div>';
  }

  function currentValue(f) {
    if (edits[f.key] != null) return edits[f.key];
    if (reconciled[f.key]) return reconciled[f.key].value;
    return f.value;
  }

  function provLine(src) {
    if (!src) return '<span class="prov" style="cursor:default"><span class="src" style="color:var(--gray-400)">No source</span></span>';
    return '<span class="prov" data-pt="open-src" data-case="' + esc(src.case) + '" data-label="' + esc(src.label) + '">' +
      '<span class="di"></span><span class="src">' + esc(src.label) + '</span>' +
      '<span style="color:var(--gray-300)">\u00b7</span><time>' + fmtDate(src.date) + '</time>' +
      '<span class="arr">' + I.arr + '</span></span>';
  }

  /* ---------- source history (§4.5) ---------- */
  function historyZone(detail) {
    var toggle = '<div class="vtoggle">' +
      '<span class="vt' + (historyView === 'threads' ? ' on' : '') + '" data-pt="view-threads">Case threads</span>' +
      '<span class="vt' + (historyView === 'timeline' ? ' on' : '') + '" data-pt="view-timeline">Document timeline</span></div>';

    var body;
    if (!detail.threads.length) {
      body = '<div class="hist-empty"><div class="ico">' + I.cases + '</div>' +
        '<h4>No case history yet</h4><p>No communication threads involve this patient. Cases appear here as documents arrive.</p></div>';
    } else {
      body = historyView === 'threads' ? threadList(detail) : timeline(detail);
    }

    return '<div class="history-zone">' +
      '<div class="zone-head history" style="margin-bottom:0"><div class="ov"><span>The source history</span><span class="ln"></span></div></div>' +
      '<div class="hh-top" style="margin-top:9px"><div><h2 style="font-family:var(--f-display);font-weight:800;font-size:20px;letter-spacing:-.025em;color:var(--gray-950)">Where it came from</h2>' +
        '<p style="font-size:13px;color:var(--gray-600);margin-top:4px;max-width:60ch">The cases and documents this record was assembled from. Reference &amp; navigation \u2014 work happens in Departments, not here.</p></div>' +
        toggle + '</div>' +
      body +
    '</div>';
  }

  function threadList(detail) {
    return detail.threads.map(function (t) {
      var cls = ({ 'open': 'open', 'in progress': 'inprog', 'complete': 'complete', 'archived': 'archived' })[t.status] || 'open';
      var docs = t.docs.map(function (d) {
        return '<span class="dchip"><span class="dt"></span>' + esc(d.label) +
          (d.flock ? ' <span class="flockmark">' + I.flock + 'Flock</span>' : '') + '</span>';
      }).join('<span class="sep"></span>');
      return '<div class="thread' + (t.status === 'archived' ? ' archived' : '') + '" data-pt="open-src" data-case="' + esc(t.id) + '" data-label="' + esc(t.subject) + '">' +
        '<span class="tic">' + I.cases + '</span>' +
        '<div class="tm"><div class="ts-row"><span class="tsub">' + esc(t.subject) + '</span><span class="tid">' + esc(t.id) + '</span></div>' +
          '<div class="tdocs">' + docs + '<span class="sep"></span><span class="other">' + esc(t.other) + '</span></div></div>' +
        '<div class="tright"><span class="tst ' + cls + '"><span class="d"></span>' + esc(t.status) + '</span>' +
          '<span class="tdate">' + fmtDate(t.date) + '</span></div>' +
        '<span class="chev">' + I.chev + '</span>' +
      '</div>';
    }).join('');
  }

  function timeline(detail) {
    var docs = documentList(detail);
    docs.sort(function (a, b) { return (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0); });
    var out = '<div class="timeline">';
    docs.forEach(function (d) {
      out += '<div class="tl-group"><div class="tl-day">' + fmtDate(d.date) + '</div>' +
        '<div class="docrow" data-pt="open-src" data-case="' + esc(d.case) + '" data-label="' + esc(d.label) + '">' +
          '<span class="di ' + diClass(d.kind) + '"></span>' +
          '<div class="dm"><div class="dt">' + esc(d.label) + '</div>' +
            '<div class="ds">' + esc(d.org) + (d.flock ? ' \u00b7 via Flock' : '') + ' \u00b7 ' + esc(d.case) + '</div></div>' +
          '<span class="dtag ' + d.kind + '">' + tagLabel(d.kind) + '</span></div></div>';
    });
    return out + '</div>';
  }
  function documentList(detail) {
    var keys = Object.keys(detail.sources || {});
    if (keys.length) {
      return keys.map(function (k) {
        var s = detail.sources[k];
        return { label: s.label, org: s.org, date: s.date, case: s.case, kind: s.kind || 'rec', flock: s.flock };
      });
    }
    // derive from threads
    var out = [];
    (detail.threads || []).forEach(function (t) {
      t.docs.forEach(function (d) { out.push({ label: d.label, org: t.other, date: t.date, case: t.id, kind: d.kind || 'rec', flock: d.flock }); });
    });
    return out;
  }
  function diClass(k) { return k === 'ref' ? 'violet' : (k === 'vax' ? 'aqua' : ''); }
  function tagLabel(k) { return ({ lab: 'Lab result', ref: 'Referral', vax: 'Vaccine', img: 'Imaging', rec: 'Record' })[k] || 'Record'; }

  /* ---------- side column ---------- */
  function sideColumn(p, c, detail) {
    var pr = c.signers.primary;
    var hh = '<div class="pt-side-card"><div class="bar" style="background:var(--blue-600)"></div><div class="scin">' +
      '<h3>Household</h3>' +
      '<div class="hh-link" data-client="' + c.id + '"><span class="hi">' + I.home + '</span>' +
        '<div><div class="hn">' + esc(c.name) + '</div><div class="hsub">' + esc(c.accountId) + ' \u00b7 ' + esc(c.location) + '</div></div>' +
        '<span class="chev">' + I.chev + '</span></div>' +
      '<div class="signer-mini"><div class="sm-lbl">Primary signer</div>' +
        '<div class="row"><span class="av">' + initials(pr.name) + '</span>' +
          '<div><div class="sn">' + esc(pr.name) + '</div><div class="sr">' + esc(pr.relationship) + '</div></div></div>' +
        '<div class="contact"><span class="c mono">' + I.phone + esc(pr.phone) + '</span>' +
          '<span class="c">' + I.mail + esc(pr.email) + '</span></div></div>' +
    '</div></div>';

    var insV = p.insurer ? esc(p.insurer) : '<span style="color:var(--gray-400);font-weight:500">None</span>';
    var facts = '<div class="pt-side-card"><div class="bar" style="background:var(--violet-400)"></div><div class="scin">' +
      '<h3>Patient facts</h3>' +
      '<div class="kv"><span class="k">Patient ID</span><span class="v mono">' + esc(p.id.toUpperCase()) + '</span></div>' +
      '<div class="kv"><span class="k">Insurance</span><span class="v">' + insV + '</span></div>' +
      (detail.microchip ? '<div class="kv"><span class="k">Microchip</span><span class="v mono">' + esc(detail.microchip) + '</span></div>' : '') +
      (detail.dob ? '<div class="kv"><span class="k">Date of birth</span><span class="v">' + fmtDate(detail.dob) + '</span></div>' : '') +
      '<div class="kv"><span class="k">Documents</span><span class="v">' + documentList(detail).length + ' on file</span></div>' +
      '<div class="kv"><span class="k">Last updated</span><span class="v">' + fmtDate(detail.lastUpdated) + '</span></div>' +
    '</div></div>';

    var hasFlock = !detail.sparse && documentList(detail).some(function (d) { return d.flock; });
    var flock = hasFlock
      ? '<div class="flock-card"><div class="ft">' + I.flock + 'Arrived via the Flock</div>' +
        '<p>' + esc(p.name) + '\u2019s orthopedic referral came directly from Mountain West Vet Specialists \u2014 no fax round-trip.</p></div>'
      : '';

    return hh + facts + flock;
  }

  /* ============================================================
     RECONCILE MODAL (§4.3 · richer side-by-side)
     ============================================================ */
  function openReconcile(fieldKey) {
    var f = findPatient(currentId), detail = getDetail(f.p, f.c);
    var field = null;
    detail.groups.forEach(function (g) { g.fields.forEach(function (x) { if (x.key === fieldKey) field = x; }); });
    if (!field || !field.conflict) return;

    var sel = { idx: 0, manual: '' };
    var cands = field.conflict.candidates;

    function cardHTML(cd, i) {
      var s = detail.sources[cd.src] || {};
      return '<div class="cand' + (sel.idx === i && !sel.manual ? ' sel' : '') + '" data-cand="' + i + '">' +
        '<div class="pick"></div>' +
        '<div class="cval">' + esc(cd.value) + '</div>' +
        '<div class="cprint">' + esc(cd.print) + '</div>' +
        '<div class="csrc"><div class="sd"><span class="di"></span><div><div class="sn">' + esc(s.label) + '</div>' +
          '<div class="so">' + esc(s.org) + '</div></div></div>' +
          '<div class="openlink" data-open-case="' + esc(s.case) + '" data-label="' + esc(s.label) + '">Open document ' + I.arr + '</div></div>' +
      '</div>';
    }

    var scrim = document.createElement('div');
    scrim.className = 'pt-scrim';
    scrim.innerHTML = '<div class="rec-modal" role="dialog" aria-modal="true">' +
      '<div class="rmh"><span class="tag">' + I.warn + 'Conflict \u00b7 reconcile</span>' +
        '<h3>Reconcile ' + esc(field.label.toLowerCase()) + '</h3>' +
        '<p>Two received documents report a different ' + esc(field.label.toLowerCase()) + '. Choose the value that should become eligible to push \u2014 RobinDock won\u2019t pick for you.</p></div>' +
      '<div class="rmb"><div class="cand-grid" id="candGrid">' + cands.map(cardHTML).join('') + '</div>' +
        '<div class="cand-or"><span class="ln"></span>or correct it<span class="ln"></span></div>' +
        '<div class="manual-correct"><label>Enter a corrected value</label>' +
          '<input id="recManual" placeholder="e.g. 28.0 kg" autocomplete="off" /></div></div>' +
      '<div class="rmf"><span class="note-inline">' + I.lock + 'This change is logged as an update.</span>' +
        '<span class="spacer"></span>' +
        '<button class="btn btn-light" data-pt="rec-cancel">Cancel</button>' +
        '<button class="btn btn-blue" data-pt="rec-confirm">Confirm value</button></div>' +
    '</div>';
    document.body.appendChild(scrim);

    var grid = scrim.querySelector('#candGrid');
    var manual = scrim.querySelector('#recManual');
    function refresh() {
      grid.querySelectorAll('.cand').forEach(function (el, i) {
        el.classList.toggle('sel', sel.idx === i && !sel.manual);
      });
    }
    grid.addEventListener('click', function (e) {
      var openc = e.target.closest('[data-open-case]');
      if (openc) { logAccess('Opened ' + openc.dataset.label + ' \u00b7 ' + openc.dataset.openCase + ' (view logged)'); scrim.remove(); location.hash = '#/case/' + encodeURIComponent(openc.dataset.openCase); return; }
      var card = e.target.closest('[data-cand]');
      if (card) { sel.idx = parseInt(card.dataset.cand, 10); sel.manual = ''; manual.value = ''; refresh(); }
    });
    manual.addEventListener('input', function () { sel.manual = manual.value.trim(); refresh(); });

    scrim.addEventListener('click', function (e) {
      if (e.target === scrim || e.target.closest('[data-pt="rec-cancel"]')) { scrim.remove(); return; }
      if (e.target.closest('[data-pt="rec-confirm"]')) {
        if (sel.manual) reconciled[fieldKey] = { value: sel.manual, srcKey: null, manual: true };
        else { var cd = cands[sel.idx]; reconciled[fieldKey] = { value: cd.value, srcKey: cd.src, manual: false }; }
        scrim.remove();
        toast('Field reconciled', field.label + ' \u2192 ' + reconciled[fieldKey].value + ' \u00b7 update logged', 'save');
        renderPatientDetail(currentId);
      }
    });
  }

  /* ============================================================
     PROTOTYPE STATE SWITCHER
     ============================================================ */
  function switcherEl() { return document.getElementById('ptStates'); }
  function removeSwitcher() { var el = switcherEl(); if (el) el.remove(); }
  function renderSwitcher() {
    var el = switcherEl();
    if (!el) { el = document.createElement('div'); el.id = 'ptStates'; el.className = 'pt-states'; document.body.appendChild(el); bindSwitcher(el); }
    var collapsed = el.classList.contains('collapsed');
    var connected = state.pims === 'connected';
    el.innerHTML =
      '<div class="psh" data-ps="toggle"><span class="dt"></span><span class="lbl">Prototype states</span>' +
        '<span class="sub">demo</span><span class="caret">' + I.caret + '</span></div>' +
      '<div class="psbody">' +
        seg('pims', 'PIMS connection', [['connected', 'Connected'], ['none', 'None']], false) +
        seg('push', 'Push state', [['changed', 'Changed'], ['current', 'Current'], ['never', 'Never']], !connected) +
        seg('data', 'Data coverage', [['full', 'Full'], ['sparse', 'Sparse']], false) +
        seg('life', 'Patient status', [['active', 'Active'], ['deceased', 'Deceased']], false) +
        '<div class="pshint">Mirrors the page\u2019s edge cases (\u00a77). Push controls disable when no PIMS is connected.</div>' +
      '</div>';
    if (collapsed) el.classList.add('collapsed');
  }
  function seg(group, label, opts, disabled) {
    var segs = opts.map(function (o) {
      var on = state[group] === o[0];
      return '<span class="s' + (on ? ' on' : '') + (disabled ? ' dis' : '') + '" data-ps="set" data-group="' + group + '" data-val="' + o[0] + '">' + o[1] + '</span>';
    }).join('');
    return '<div class="grp"><div class="gl">' + label + '</div><div class="seg' + (disabled ? ' dis' : '') + '">' + segs + '</div></div>';
  }
  function bindSwitcher(el) {
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-ps]');
      if (!t) return;
      var kind = t.dataset.ps;
      if (kind === 'toggle') { el.classList.toggle('collapsed'); return; }
      if (kind === 'set') {
        var g = t.dataset.group, v = t.dataset.val;
        if (t.classList.contains('dis')) return;
        if (state[g] === v) return;
        state[g] = v; save();
        if (g === 'data' || g === 'life') resetSession();
        renderPatientDetail(currentId);
      }
    });
  }

  /* ============================================================
     INLINE EDIT
     ============================================================ */
  function startEdit(key) { editingKey = key; renderPatientDetail(currentId); setTimeout(function () { var i = document.getElementById('finEdit'); if (i) { i.focus(); i.select(); } }, 30); }
  function saveEdit(key) {
    var i = document.getElementById('finEdit');
    var v = i ? i.value.trim() : '';
    editingKey = null;
    if (v) { edits[key] = v; toast('Field updated', labelFor(key) + ' \u2192 ' + v + ' \u00b7 update logged', 'save'); }
    renderPatientDetail(currentId);
  }
  function labelFor(key) {
    var f = findPatient(currentId), detail = getDetail(f.p, f.c), out = key;
    detail.groups.forEach(function (g) { g.fields.forEach(function (x) { if (x.key === key) out = x.label; }); });
    return out;
  }

  /* ============================================================
     EVENT DELEGATION (patient-page only attrs: data-pt)
     ============================================================ */
  document.addEventListener('click', function (e) {
    if (!/^#\/patient\//.test(location.hash)) return;
    var t = e.target.closest('[data-pt]');
    if (!t) return;
    var act = t.dataset.pt;
    if (act === 'open-src') {
      e.stopPropagation();
      var cid = t.dataset.case, label = t.dataset.label || 'document';
      logAccess('Opened ' + label + ' \u00b7 ' + cid + ' (view logged)');
      location.hash = '#/case/' + encodeURIComponent(cid);
    } else if (act === 'reconcile') { openReconcile(t.dataset.key); }
    else if (act === 'edit-field') { startEdit(t.dataset.key); }
    else if (act === 'save-edit') { saveEdit(t.dataset.key); }
    else if (act === 'cancel-edit') { editingKey = null; renderPatientDetail(currentId); }
    else if (act === 'view-threads') { historyView = 'threads'; renderPatientDetail(currentId); }
    else if (act === 'view-timeline') { historyView = 'timeline'; renderPatientDetail(currentId); }
    else if (act === 'push') {
      if (t.disabled) return;
      pushedThisSession = true;
      toast('Pushed to ' + PIMS_NAME, currentName() + '\u2019s reconciled data sent to your record of truth', 'push');
      renderPatientDetail(currentId);
    } else if (act === 'edit-patient') {
      toast('Edit patient', 'Prototype \u2014 reconcile fields inline below', 'save');
    }
  });
  function currentName() { var f = findPatient(currentId); return f ? f.p.name : 'Patient'; }

  /* keyboard: Enter saves inline edit */
  document.addEventListener('keydown', function (e) {
    if (editingKey && e.key === 'Enter') { e.preventDefault(); saveEdit(editingKey); }
    if (editingKey && e.key === 'Escape') { editingKey = null; renderPatientDetail(currentId); }
  });

  /* remove switcher when leaving the patient route */
  window.addEventListener('hashchange', function () {
    if (!/^#\/patient\//.test(location.hash)) { currentId = null; loggedId = null; removeSwitcher(); }
  });

  /* if we booted directly onto a patient route, re-trigger render now that we're defined */
  if (/^#\/patient\//.test(location.hash)) {
    setTimeout(function () { window.dispatchEvent(new HashChangeEvent('hashchange')); }, 0);
  }
})();
