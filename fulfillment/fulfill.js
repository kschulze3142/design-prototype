/* ============================================================
   RobinDock — Task Detail / Fulfillment · CONTROLLER
   The workhorse surface. Left = the document (evidence). Right =
   the work, a three-stage flow:
     1. Patient search-&-match  (the binding event — human search,
        never AI auto-match; writes the only trusted links)
     2. Type-aware clinical confirm-stepper  (THIS is the
        verification — confirm/complete pre-filled fields; gated
        until a patient is matched)
     3. Approve / resolve  (sign-off → resolved → push-eligible)
   Plus: multi-patient fork, reassign / re-home, needs_review,
   and the resolved / claimed-by-other / unreadable states.
   Mock data; access logging is a prototype affordance (toasts).
   ============================================================ */
(function () {
  'use strict';

  var D = window.RD_FULFILL;
  var TASKS = D.TASKS, PATIENTS = D.PATIENTS, PEOPLE = D.PEOPLE, DEPTS = D.DEPTS, TYPES = D.TYPES, ME = D.ME;
  var esc = window.RD_FF.esc, ICON = window.RD_FF.ICON;
  var content = document.getElementById('appContent');
  var titleEl = document.getElementById('appTitle');

  /* ---------------- persisted per-task working state ---------------- */
  var SK = 'rd_fulfill_v1';
  var store = { current: 'T-3061-L', tasks: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(SK) || '{}');
    if (saved && typeof saved === 'object') { store.current = saved.current || store.current; store.tasks = saved.tasks || {}; }
  } catch (e) {}
  function save() { try { localStorage.setItem(SK, JSON.stringify(store)); } catch (e) {} }

  function ws(id) {
    if (!store.tasks[id]) {
      var t = TASKS[id];
      store.tasks[id] = {
        ds: { page: 1, zoom: 1, rot: 0, hl: true },
        matched: t && t.matched ? t.matched : null,
        clinicalReviewed: false,
        statusOverride: null,
        edits: {}, verified: {}, custom: [],
        forked: false, editing: null,
        reassignOpen: false, moreOpen: false
      };
    }
    return store.tasks[id];
  }
  function curTask() { return TASKS[store.current]; }
  function effStatus(t, w) { return w.statusOverride || t.status; }

  /* ---------------- arrival from the department queue (?type / ?task) ---------------- */
  function parseParams() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    if (!q || (!q.get('type') && !q.get('task'))) return;
    var direct = q.get('task');
    if (direct && TASKS[direct]) { store.current = direct; delete store.tasks[direct]; return; }
    var type = q.get('type'); if (!type) return;
    var base = TASKS[TYPE_FIXTURE[type] || 'T-3061-L'];
    if (!base) return;
    var syn = JSON.parse(JSON.stringify(base));
    var deptId = q.get('id') || ('T-' + Date.now());
    syn.id = deptId;
    if (q.get('title')) syn.title = q.get('title');
    if (q.get('sender')) syn.sender = Object.assign({}, base.sender, { name: q.get('sender') });
    if (q.get('case')) { syn.caseId = q.get('case'); syn.caseSubject = q.get('title') || syn.caseSubject; }
    var firstCand = (base.candidates && base.candidates[0]) ? base.candidates[0].id : null;
    if (q.get('done') === '1') {
      syn.status = 'resolved';
      syn.resolvedBy = q.get('resolvedBy') || 'me';
      syn.resolvedAt = q.get('resolvedAt') || 'recently';
      syn.matched = base.matched || firstCand;
    } else if (q.get('claimed')) {
      syn.status = 'claimed';
      syn.claimedBy = q.get('claimed');
      syn.claimedAt = q.get('claimedAt') || 'recently';
    } else {
      syn.status = 'in_progress';
      syn.assignee = 'me';
    }
    /* only show the critical banner when the originating row was actually critical */
    if (q.get('crit') !== '1' && syn.crit) delete syn.crit;
    TASKS[deptId] = syn;
    store.current = deptId;
    delete store.tasks[deptId];
  }

  /* ---------------- helpers ---------------- */
  function person(key) {
    if (PEOPLE[key]) return PEOPLE[key];
    var nm = String(key || '');
    var inits = nm.split(/\s+/).map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase() || '?';
    return { name: nm, initials: inits, av: '' };
  }
  /* type → canonical fixture, used when arriving from the department queue */
  var TYPE_FIXTURE = { lab: 'T-3061-L', referral: 'T-3061-R', records: 'T-DEPT-REC', recreq: 'T-DEPT-REQ', vaccine: 'T-DEPT-VAX', unc: 'T-2950-UN' };
  function avatar(p, size) { return '<span class="av ' + (p.av || '') + '" style="--av:' + (size || 24) + 'px">' + esc(p.initials) + '</span>'; }
  var TYPE_GLYPH = { lab: ICON.tLab, referral: ICON.tRef, records: ICON.tRec, recreq: ICON.tRec, vaccine: ICON.tVax };

  /* ============================================================
     ACCESS-LOG / ACTION TOASTS
     ============================================================ */
  var toastWrap = document.getElementById('logToasts');
  function toast(title, sub, kind) {
    if (!toastWrap) return;
    var el = document.createElement('div');
    el.className = 'logtoast ' + (kind || 'ok');
    var ic = kind === 'send' ? ICON.push : kind === 'bad' ? ICON.alert : ICON.logged;
    el.innerHTML = '<span class="lic">' + ic + '</span><div><div class="lt">' + esc(title) + '</div>' +
      (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>';
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 280); }, 2600);
    while (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  }

  /* ============================================================
     HEADER
     ============================================================ */
  function header(t, w) {
    var st = effStatus(t, w);
    var gly = TYPE_GLYPH[t.type] || ICON.tRec;
    var tm = TYPES[t.type] || { label: t.type, cls: 'ty-rec' };
    var assignee = st === 'claimed' ? person(t.claimedBy) : (t.assignee ? person(t.assignee) : null);
    var assigneeChip = assignee
      ? '<span class="ff-assignee">' + avatar(assignee, 26) + '<span class="nm">' + (assignee.key === 'me' ? 'You' : esc(assignee.name)) + '</span></span>'
      : '';
    var statusLabel = { in_progress: 'In progress', resolved: 'Resolved', claimed: 'Claimed', needs_review: 'Needs review' }[st] || st;

    var actions = (st === 'in_progress' || st === 'needs_review')
      ? '<div class="ff-more" id="reassignWrap">' +
          '<button class="ff-actbtn" id="reassignBtn">' + ICON.reassign + 'Reassign</button>' +
          reassignMenu(t) +
        '</div>' +
        '<div class="ff-more" id="moreWrap">' +
          '<button class="ff-morebtn" id="moreBtn">' + ICON.more + '</button>' +
          moreMenu(t, w) +
        '</div>'
      : '';

    return '<div class="ff-head">' +
      '<button class="ff-back" id="backBtn">' + ICON.back + 'Queue</button>' +
      '<div class="ff-id"><span class="tic ' + t.type + '">' + gly + '</span>' +
        '<div class="who"><div class="nm">' + esc(t.title) +
          '<span class="tag ' + tm.cls + '"><span class="d"></span>' + tm.label + '</span></div>' +
          '<div class="sub"><span class="mono">' + esc(t.id) + '</span><span class="dot"></span>' +
            'Case <a data-go="case">' + esc(t.caseId) + '</a><span class="dot"></span>' +
            'from <a data-go="sender">' + esc(t.sender.name) + '</a></div></div></div>' +
      '<div class="ff-htail">' +
        '<span class="ff-access">' + ICON.logged + 'Access logged</span>' +
        assigneeChip +
        '<span class="ff-statuschip s-' + st + '"><span class="d"></span>' + statusLabel + '</span>' +
        actions +
      '</div></div>';
  }

  function reassignMenu(t) {
    var depts = DEPTS.filter(function (d) { return d.key !== t.dept; }).slice(0, 4).map(function (d) {
      return '<div class="mi" data-reassign="dept" data-v="' + d.key + '">' + ICON.dept + '<div><div class="mt">' + esc(d.name) + '</div></div></div>';
    }).join('');
    return '<div class="ff-menu" id="reassignMenu">' +
      '<div class="mlbl">Move to another department</div>' + depts +
      '<div class="msep"></div><div class="mlbl">Or</div>' +
      '<div class="mi" data-reassign="person">' + ICON.person + '<div><div class="mt">Assign to a person</div><div class="md">Hand to a specific teammate</div></div></div>' +
      '<div class="mi" data-reassign="case">' + ICON.caseic + '<div><div class="mt">Move to another Case</div><div class="md">Re-point this Task\u2019s case</div></div></div>' +
      '<div class="msep"></div>' +
      '<div class="mi" data-reassign="unclaim">' + ICON.unclaim + '<div><div class="mt">Un-claim \u00b7 return to pool</div><div class="md">Releases the lock \u2014 back to the queue as open</div></div></div>' +
    '</div>';
  }
  function moreMenu(t, w) {
    return '<div class="ff-menu" id="moreMenu">' +
      '<div class="mi" data-more="note">' + ICON.pencil + '<div><div class="mt">Add internal note</div><div class="md">Staff-only coordination \u2014 not clinical content</div></div></div>' +
      '<div class="mi" data-more="export">' + ICON.download + '<div><div class="mt">Export / print</div><div class="md">Higher-sensitivity \u00b7 logged</div></div></div>' +
      '<div class="msep"></div>' +
      '<div class="mi bad" data-more="needs_review">' + ICON.flag + '<div><div class="mt">Flag \u00b7 needs review</div><div class="md">Can\u2019t complete as-is \u2014 missing info or unworkable</div></div></div>' +
    '</div>';
  }

  /* ============================================================
     PROGRESS HEADER (Match → Verify → Resolve) + primary action
     ============================================================ */
  function progress(t, w) {
    var matched = !!w.matched;
    var reviewed = w.clinicalReviewed;
    var resolved = effStatus(t, w) === 'resolved';

    var nodes = [
      { key: 'patient', lab: 'Match', cls: 'patient', done: matched, now: !matched },
      { key: 'clinical', lab: 'Verify', done: reviewed, now: matched && !reviewed },
      { key: 'resolve', lab: 'Resolve', done: resolved, now: reviewed && !resolved }
    ];
    var steps = '';
    nodes.forEach(function (n, i) {
      var state = n.done ? 'done' : n.now ? 'now' : 'todo';
      if (i) steps += '<span class="fw-ssep' + (nodes[i - 1].done ? ' done' : '') + '"></span>';
      steps += '<span class="fw-snode ' + state + ' ' + (n.cls || '') + '"><span class="dot">' + (n.done ? ICON.checkSm : (i + 1)) + '</span><span class="lab">' + n.lab + '</span></span>';
    });

    var act, hint = '';
    if (!matched) {
      act = '<button class="btn btn-violet is-disabled" disabled>' + ICON.paw.replace('width="18" height="18"', 'width="15" height="15"') + 'Confirm a patient to verify</button>';
      hint = 'Patient match is a human search \u2014 the stepper stays locked until a patient is confirmed.';
    } else if (!reviewed) {
      act = '<button class="btn btn-blue" data-fw="mark-reviewed">' + ICON.check + 'Verification complete</button>';
      hint = 'Confirm the pre-filled clinical fields against the document, then mark complete.';
    } else if (!resolved) {
      act = '<button class="btn btn-blue" data-fw="resolve">' + ICON.check + 'Approve &amp; resolve</button>';
      hint = 'Resolving makes this data eligible to push to the PIMS.';
    } else {
      act = '<button class="btn btn-light" disabled>' + ICON.checkSm + ' Resolved</button>';
    }

    return '<div class="fw-prog">' +
      '<div class="ph-eyebrow">Work \u00b7 verify to resolve</div>' +
      '<div class="fw-steps">' + steps + '</div>' +
      '<div class="fw-action">' + act + '</div>' +
      (hint ? '<div class="fw-hint">' + hint + '</div>' : '') +
    '</div>';
  }

  /* ============================================================
     STEP 1 · PATIENT MATCH
     ============================================================ */
  function patientStep(t, w) {
    var active = !w.matched;
    var stepCls = 'fw-step patient' + (w.matched ? ' done' : ' active');
    var head;
    if (w.matched) {
      var p = PATIENTS[w.matched];
      head = '<div class="fw-shead" data-step="patient"><span class="fw-sn">' + ICON.checkSm + '</span>' +
        '<div class="fw-smain"><div class="fw-stitle">Patient matched</div>' +
          '<div class="fw-ssum"><span class="pchip">' + ICON.paw.replace('width="18" height="18"', 'width="13" height="13"') + esc(p.name) + '</span> ' + esc(p.species) + (p.breed ? ' \u00b7 ' + esc(p.breed) : '') + ' \u00b7 ' + esc(p.client) + '</div></div>' +
        '<span class="fw-schev">' + ICON.chevDown + '</span></div>';
    } else {
      head = '<div class="fw-shead" data-step="patient"><span class="fw-sn">1</span>' +
        '<div class="fw-smain"><div class="fw-stitle">Confirm the patient</div>' +
          '<div class="fw-ssum">The binding event \u2014 search your own records and confirm</div></div>' +
        '<span class="fw-schev">' + ICON.chevDown + '</span></div>';
    }
    if (!active && store._expand !== 'patient') return '<div class="' + stepCls + '">' + head + '</div>';

    var body;
    if (w.matched) {
      var p2 = PATIENTS[w.matched];
      body = '<div class="pm-done"><span class="di">' + ICON.paw + '</span>' +
        '<div><div class="dn">' + esc(p2.name) + ' \u00b7 ' + esc(p2.client) + '</div>' +
          '<div class="ds">Trusted links written \u00b7 <span style="font-family:var(--f-mono)">patient_id_local=' + esc(p2.id) + '</span> \u00b7 binding logged</div></div>' +
        '<span class="dx" data-fw="rematch">Change</span></div>';
    } else {
      body = matchBody(t, w);
    }
    return '<div class="' + stepCls + '">' + head + '<div class="fw-sbody">' + body + '</div></div>';
  }

  function matchBody(t, w) {
    var h = t.hints || {};
    var hintChips = [];
    if (h.name) hintChips.push(['Name', h.name]);
    if (h.species) hintChips.push(['Species', h.species]);
    if (h.breed) hintChips.push(['Breed', h.breed]);
    if (h.owner) hintChips.push(['Owner', h.owner]);
    if (h.phone) hintChips.push(['Phone', h.phone]);
    var chips = hintChips.map(function (c) {
      return '<span class="pm-hint"><span class="k">' + esc(c[0]) + '</span>' + esc(c[1]) + '<span class="x" data-fw="drop-hint">\u00d7</span></span>';
    }).join('');

    var cands = (t.candidates || []).map(function (c) { return candRow(t, w, c); }).join('');
    var nc = t.newClient || {};
    var alt = '<div class="pm-alt"><div class="pm-alt-h">Not in the list?</div>' +
      (nc.client
        ? '<button class="pm-altbtn" data-fw="add-patient"><span class="ai">' + ICON.add + '</span><div><div class="at">Add a new patient under ' + esc(nc.client) + '</div><div class="ad">Same household \u00b7 ' + esc(nc.clientId) + ' \u2014 a new animal record</div></div></button>'
        : '') +
      '<button class="pm-altbtn" data-fw="create-both"><span class="ai">' + ICON.add + '</span><div><div class="at">Create a new client + patient</div><div class="ad">No existing household matches the sender\u2019s identity</div></div></button></div>';

    return '<div class="pm-note">' + ICON.info + '<div><b>AI pre-fills the search; you commit.</b> Robin Dock never auto-matches \u2014 the link you write here is the only trusted patient binding.</div></div>' +
      '<div class="pm-seedlbl"><span class="sp">' + ICON.spark + '</span>Pre-seeded from the document</div>' +
      '<div class="pm-search">' + ICON.search + '<input placeholder="Search your patients &amp; clients\u2026" value="' + esc(h.name || '') + '" id="pmSearch" autocomplete="off" /></div>' +
      (chips ? '<div class="pm-hints">' + chips + '</div>' : '') +
      '<div class="pm-seedcap">Extracted identity hints \u2014 search hints only, never a confirmed link.</div>' +
      '<div class="pm-reslbl">In your records <span class="c">' + (t.candidates || []).length + ' near matches</span></div>' +
      cands + alt;
  }

  function candRow(t, w, c) {
    var p = PATIENTS[c.id];
    if (!p) return '';
    var sel = w._candSel === c.id;
    var feline = p.species === 'Feline';
    var badge = c.strong ? '<span class="pm-match-badge strong">Strong match</span>'
      : c.weak ? '<span class="pm-match-badge weak">Same name</span>' : '';
    /* mismatch hints vs extracted identity */
    var mism = '';
    if (t.hints && t.hints.species && t.hints.species !== p.species) mism += '<span class="pm-mismatch">' + ICON.alert.replace('width="16" height="16"', 'width="10" height="10"') + 'Species differs</span>';
    var conflict = c.conflict ? '<div class="pm-conflict">' + ICON.alert + '<div>Already bound to ' + esc(c.conflict) + ' \u2014 confirming flags a correction, never a silent overwrite.</div></div>' : '';

    var confirm = sel ? '<div class="pm-confirm"><div class="ct">Confirm <b>' + esc(p.name) + '</b> of <b>' + esc(p.client) + '</b> as this Task\u2019s patient. Writes the trusted links and logs the binding.</div>' +
      '<button class="btn btn-violet btn-sm" data-fw="confirm-match" data-id="' + c.id + '">' + ICON.check + 'Confirm patient</button></div>' : '';

    return '<button class="pm-cand' + (feline ? ' feline' : '') + (sel ? ' sel' : '') + '" data-fw="pick-cand" data-id="' + c.id + '">' +
      '<span class="paw">' + ICON.paw + '</span>' +
      '<div class="cmain"><div class="cnm">' + esc(p.name) + ' ' + badge + ' ' + mism + '</div>' +
        '<div class="csig"><b>' + esc(p.species) + '</b> \u00b7 ' + esc(p.breed) + ' \u00b7 ' + esc(p.sex) + ' \u00b7 ' + esc(p.age) + '</div>' +
        '<div class="chh">' + esc(p.client) + ' \u00b7 ' + esc(p.owner) + '<span class="dot"></span><span class="acct">' + esc(p.clientId) + '</span><span class="dot"></span>seen ' + esc(p.lastSeen) + '</div>' +
        conflict + '</div>' +
      '<span class="cck">' + ICON.checkSm + '</span></button>' + confirm;
  }

  /* ============================================================
     STEP 2 · CLINICAL VERIFICATION (type-aware)
     ============================================================ */
  function clinicalStep(t, w) {
    var locked = !w.matched;
    var done = w.clinicalReviewed;
    var active = w.matched && !done && store._expand !== 'patient' && store._expand !== 'resolve';
    var cls = 'fw-step' + (locked ? ' locked' : done ? ' done' : active ? ' active' : '');

    var head = '<div class="fw-shead" data-step="clinical"><span class="fw-sn">' + (done ? ICON.checkSm : '2') + '</span>' +
      '<div class="fw-smain"><div class="fw-stitle">Verify clinical fields' +
        (locked ? ' <span class="lock">' + ICON.lock + '</span>' : '') + '</div>' +
        '<div class="fw-ssum">' + (locked ? 'Locked \u2014 confirm a patient first' : done ? 'Verification confirmed \u00b7 ' + fieldCount(t) + ' fields' : 'Confirm the ' + (TYPES[t.type] || {}).label + ' fields against the document') + '</div></div>' +
      '<span class="fw-schev">' + ICON.chevDown + '</span></div>';

    if (locked || (!active && !(done && store._expand === 'clinical'))) return '<div class="' + cls + '">' + head + '</div>';

    var clinical = t.type === 'lab' ? labFields(t, w)
      : t.type === 'vaccine' ? simpleFields(t, w, t.vaccine)
      : (t.type === 'records' || t.type === 'recreq') ? recordsFields(t, w)
      : referralFields(t, w);
    var body = '<div class="cv-note">' + ICON.info + '<div><b>This is the verification.</b> Fields are pre-filled from the extraction \u2014 confirm or correct against the document. Every edit logs an update. Never author original content.</div></div>' +
      coreSummary(t, w) + clinical;
    return '<div class="' + cls + '">' + head + '<div class="fw-sbody">' + body + '</div></div>';
  }

  function fieldCount(t) {
    if (t.type === 'lab') return (t.labHeader || []).length + (t.results || []).length;
    if (t.type === 'vaccine') return (t.vaccine || []).length;
    if (t.type === 'records' || t.type === 'recreq') return (t.records || []).length;
    return (t.referral || []).length;
  }

  function recordsFields(t, w) {
    var fields = (t.records || []).concat(w.custom || []);
    var note = t.type === 'recreq'
      ? '<div class="cv-note">' + ICON.info + '<div><b>Records request \u2014 admin.</b> Confirm the respond-by date and scope. No clinical content to verify on this type.</div></div>'
      : '<div class="cv-note">' + ICON.info + '<div><b>Medical records \u2014 core-only.</b> Confirm the patient identity; the chart body lives on the PDF floor and isn\u2019t structured at launch.</div></div>';
    var body = fields.length
      ? fields.map(function (f) { return fieldRow(t, w, f); }).join('')
      : '<div class="cv-field" style="text-align:center;color:var(--gray-500);font-size:12.5px;padding:16px;line-height:1.5">No structured clinical fields for this type \u2014 the document is the record. Add a field if your org tracks one.</div>';
    return note + '<div class="cv-grouplbl">' + (t.type === 'recreq' ? 'Request detail' : 'Records') + ' <span class="badge">customizable</span></div>' +
      body + '<button class="cv-addfield" data-fw="add-field">' + ICON.add + 'Add a custom clinical field</button>';
  }

  function coreSummary(t, w) {
    var p = PATIENTS[w.matched]; if (!p) return '';
    return '<div class="cv-grouplbl">Identity &amp; matching core <span class="badge">fixed</span></div>' +
      '<div class="cv-field verified"><div class="cv-frow"><div class="cv-fmeta">' +
        '<div class="cv-flabel">Confirmed patient \u00b7 written at match</div>' +
        '<div class="cv-fval"><b>' + esc(p.name) + '</b> \u00b7 ' + esc(p.species) + ', ' + esc(p.breed) + ' \u00b7 ' + esc(p.sex) + ' \u00b7 ' + esc(p.client) + '</div>' +
      '</div><span class="cv-fedit" style="pointer-events:none;color:var(--ok)">' + ICON.lock + '</span></div></div>';
  }

  /* generic field renderer for referral / vaccine */
  function fieldRow(t, w, f) {
    var key = f.key;
    var val = (w.edits[key] != null) ? w.edits[key] : f.value;
    var edited = w.edits[key] != null;
    var verified = !!w.verified[key];
    var empty = (val === '' || val == null) && f.kind !== 'bool';
    var editing = w.editing === key;

    var conf = f.conf || 'high';
    var confEl = '<span class="cv-conf ' + conf + '"><span class="cd"></span>' + (conf === 'high' ? 'High' : conf === 'med' ? 'Medium' : 'Low') + '</span>';
    var xref = f.xref ? '<span class="cv-xref">' + ICON.spark.replace('width="14" height="14"', 'width="10" height="10"') + esc(f.xref) + '</span>' : '';

    var valHTML;
    if (f.kind === 'bool') {
      var yes = val === true || val === 'true';
      valHTML = '<div class="cv-fval boolval ' + (yes ? 'yes' : 'no') + '"><span class="bx">' + (yes ? ICON.checkSm : '') + '</span>' + (yes ? 'Yes' : 'No') + '</div>';
    } else if (empty) {
      valHTML = '<div class="cv-fempty">' + esc(f.ph || 'Empty in extraction \u2014 read the document and complete') + '</div>';
    } else if (f.kind === 'enum') {
      valHTML = '<div class="cv-fval enumval">' + esc(val) + '</div>';
    } else {
      valHTML = '<div class="cv-fval' + (f.mono ? ' mono' : '') + '">' + esc(val) + '</div>';
    }

    var cls = 'cv-field' + (editing ? ' editing' : '') + (empty && !edited ? ' empty' : '') + (empty && edited ? ' empty filled' : '') + (verified ? ' verified' : '');
    var editor = editing ? fieldEditor(f, val) : '';

    return '<div class="' + cls + '">' +
      '<div class="cv-frow"><div class="cv-fmeta">' +
        '<div class="cv-flabel">' + esc(f.label) + ' ' + confEl + ' ' + xref + (verified ? '<span class="cv-conf high"><span class="cd"></span>Verified</span>' : '') + '</div>' +
        valHTML +
      '</div>' +
      (editing ? '' : '<span class="cv-fedit" data-fw="edit-field" data-key="' + key + '" title="Edit (logs an update)">' + (verified ? ICON.checkSm : ICON.pencil) + '</span>') +
      '</div>' + editor + '</div>';
  }

  function fieldEditor(f, val) {
    var input;
    if (f.kind === 'bool') {
      var yes = val === true || val === 'true';
      input = '<div class="cv-boolset"><button class="' + (yes ? 'on' : '') + '" data-fw="bool-set" data-v="true">Yes</button>' +
        '<button class="' + (!yes ? 'on' : '') + '" data-fw="bool-set" data-v="false">No</button></div>';
    } else if (f.kind === 'enum') {
      input = '<div class="selectwrap" style="max-width:none"><select class="input" id="cvInput">' +
        (f.options || []).map(function (o) { return '<option' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></div>';
    } else if (f.kind === 'long') {
      input = '<textarea class="input" id="cvInput" placeholder="' + esc(f.ph || '') + '">' + esc(val || '') + '</textarea>';
    } else {
      input = '<input class="input" id="cvInput" value="' + esc(val || '') + '" placeholder="' + esc(f.ph || '') + '" />';
    }
    return '<div class="cv-editor">' + input +
      '<div class="cv-editbar"><button class="btn btn-blue btn-sm save" data-fw="save-field" data-key="' + f.key + '">Confirm field</button>' +
        '<button class="cancel" data-fw="cancel-edit">Cancel</button>' +
        '<span class="lognote">' + ICON.logged + 'Logged as update</span></div></div>';
  }

  function referralFields(t, w) {
    var fields = (t.referral || []).concat(w.custom || []);
    var look = fields.filter(function (f) { var v = w.edits[f.key] != null ? w.edits[f.key] : f.value; return (v === '' || v == null) && f.kind !== 'bool'; }).length;
    return '<div class="cv-grouplbl">Clinical \u00b7 referral <span class="badge">customizable</span>' + (look ? ' <span style="margin-left:auto;font-size:10px;color:var(--warn-ink);font-weight:600;text-transform:none;letter-spacing:0">' + look + ' need a look</span>' : '') + '</div>' +
      fields.map(function (f) { return fieldRow(t, w, f); }).join('') +
      '<button class="cv-addfield" data-fw="add-field">' + ICON.add + 'Add a custom clinical field</button>';
  }
  function simpleFields(t, w, fields) {
    fields = (fields || []).concat(w.custom || []);
    return '<div class="cv-grouplbl">Clinical fields <span class="badge">customizable</span></div>' +
      fields.map(function (f) { return fieldRow(t, w, f); }).join('') +
      '<button class="cv-addfield" data-fw="add-field">' + ICON.add + 'Add a custom clinical field</button>';
  }

  function labFields(t, w) {
    var header = (t.labHeader || []).map(function (f) { return fieldRow(t, w, f); }).join('');
    var rows = (t.results || []).map(function (r) {
      var flc = r.flag || 'normal';
      var fl = '<span class="lab-fl ' + flc + '">' + (flc === 'critical' ? 'CRIT' : flc === 'high' ? 'HIGH' : flc === 'low' ? 'LOW' : '\u2014') + '</span>';
      return '<tr class="' + (flc === 'critical' ? 'crit' : '') + '">' +
        '<td class="an">' + esc(r.analyte) + '</td>' +
        '<td class="val">' + esc(r.value) + '</td>' +
        '<td>' + esc(r.unit) + '</td>' +
        '<td class="num"><span class="rng">' + esc(r.range) + '</span></td>' +
        '<td>' + fl + '</td></tr>';
    }).join('');
    return '<div class="cv-grouplbl">Lab header <span class="badge">customizable</span></div>' +
      header +
      '<div class="cv-grouplbl">Results \u00b7 ' + (t.results || []).length + ' analytes <span class="badge">system-structural</span></div>' +
      '<div class="lab-table"><table><thead><tr><th>Analyte</th><th>Result</th><th>Unit</th><th class="num">Reference</th><th>Flag</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="lab-asprinted">' + ICON.info + 'Values stored <b>as printed</b> \u2014 never coerced to a number ("\u226537", "Negative" are valid). Flag drives queue criticality. Rows aren\u2019t field-editable at launch.</div>' +
      '<div class="cv-grouplbl">Interpretation</div>' +
      fieldRow(t, w, { key: 'interpretation', label: 'Interpretation (narrative)', value: t.interpretation, conf: 'high', kind: 'long' });
  }

  /* ============================================================
     STEP 3 · APPROVE / RESOLVE
     ============================================================ */
  function resolveStep(t, w) {
    var locked = !w.clinicalReviewed;
    var resolved = effStatus(t, w) === 'resolved';
    var active = w.clinicalReviewed && !resolved && store._expand !== 'patient' && store._expand !== 'clinical';
    var cls = 'fw-step' + (locked ? ' locked' : resolved ? ' done' : active ? ' active' : '');
    var head = '<div class="fw-shead" data-step="resolve"><span class="fw-sn">' + (resolved ? ICON.checkSm : '3') + '</span>' +
      '<div class="fw-smain"><div class="fw-stitle">Approve &amp; resolve' + (locked ? ' <span class="lock">' + ICON.lock + '</span>' : '') + '</div>' +
        '<div class="fw-ssum">' + (locked ? 'Locked \u2014 verify the fields first' : resolved ? 'Resolved \u00b7 push-eligible' : 'Sign off \u2014 makes the data push-eligible') + '</div></div>' +
      '<span class="fw-schev">' + ICON.chevDown + '</span></div>';
    if (locked || (!active && !resolved)) return '<div class="' + cls + '">' + head + '</div>';

    var p = PATIENTS[w.matched];
    var body = '<div class="rs-card">' +
      '<div class="rs-checklist">' +
        '<div class="rs-cl done"><span class="ci">' + ICON.checkSm + '</span>Patient confirmed \u2014 ' + esc(p ? p.name + ' \u00b7 ' + p.client : '') + '</div>' +
        '<div class="rs-cl done"><span class="ci">' + ICON.checkSm + '</span>Clinical fields verified against the document</div>' +
        '<div class="rs-cl ' + (resolved ? 'done' : 'todo') + '"><span class="ci">' + (resolved ? ICON.checkSm : '') + '</span>Approve &amp; resolve</div>' +
      '</div>' +
      '<div class="rs-push">' + ICON.push + '<div>Resolving transitions <b>in&nbsp;progress \u2192 resolved</b> and makes this verified data <b>eligible to push</b> to the PIMS. Raw extraction never auto-pushes.</div></div>' +
      (resolved
        ? '<button class="btn btn-light rs-resolvebtn" disabled>' + ICON.checkSm + ' Resolved</button>'
        : '<button class="btn btn-blue rs-resolvebtn" data-fw="resolve">' + ICON.check + 'Approve &amp; resolve</button>' +
          '<button class="rs-needs" data-more="needs_review">' + ICON.flag + 'Can\u2019t complete \u2014 flag for review</button>') +
    '</div>';
    return '<div class="' + cls + '">' + head + '<div class="fw-sbody">' + body + '</div></div>';
  }

  /* ============================================================
     WORK PANE
     ============================================================ */
  function forkBanner(t, w) {
    if (t.batch && !w.forked) {
      return '<div class="fk-banner">' + ICON.fork + '<div class="ft"><b>Batch document.</b> This transmission carries results for ' + t.batchPatients.length + ' patients. Adding a 2nd patient auto-forks it into independent single-patient Tasks.</div></div>';
    }
    if (w.forked) {
      return '<div class="fk-toast">' + ICON.fork + '<div><div class="kt">Forked into ' + t.batchPatients.length + ' single-patient Tasks</div>' +
        '<div class="ks">Siblings are independent from birth \u00b7 share only the document &amp; provenance \u00b7 logged</div></div>' +
        '<button class="undo" data-fw="undo-fork">Undo</button></div>';
    }
    return '';
  }

  function workPane(t, w) {
    return '<div class="fw-card">' + progress(t, w) +
      '<div class="fw-body">' + forkBanner(t, w) + patientStep(t, w) + clinicalStep(t, w) + resolveStep(t, w) + '</div></div>';
  }

  /* ============================================================
     FULL-PANE STATES (resolved / claimed / unreadable→needs_review)
     ============================================================ */
  function resolvedState(t, w) {
    var p = PATIENTS[w.matched || t.matched];
    var by = person(t.resolvedBy || 'me');
    var rows = '';
    if (t.type === 'vaccine') rows = (t.vaccine || []).map(function (f) { return '<div class="ro-row"><span class="k">' + esc(f.label) + '</span><span class="v">' + esc(f.value) + '</span></div>'; }).join('');
    else if (t.type === 'lab') rows = (t.results || []).slice(0, 5).map(function (r) { return '<div class="ro-row"><span class="k">' + esc(r.analyte) + '</span><span class="v">' + esc(r.value) + ' ' + esc(r.unit) + '</span></div>'; }).join('');
    return '<div class="ff-state"><span class="sic ok">' + ICON.check.replace('width="13" height="13"', 'width="30" height="30"') + '</span>' +
      '<h2>Task resolved</h2>' +
      '<p>Verified by <b>' + esc(by.name) + '</b> on ' + esc(t.resolvedAt || '') + '. This data is eligible to push to the PIMS. Opened read-only \u2014 reopen to make further edits.</p>' +
      (p ? '<div class="ro-fields"><div class="ro-row"><span class="k">Patient</span><span class="v">' + esc(p.name) + ' \u00b7 ' + esc(p.client) + '</span></div>' + rows + '</div>' : '') +
      '<div class="sactions"><button class="btn btn-light" data-fw="reopen">' + ICON.reopen + 'Reopen</button>' +
        '<button class="btn btn-blue" id="backBtn2">' + ICON.back + 'Back to queue</button></div></div>';
  }
  function claimedState(t) {
    var by = person(t.claimedBy);
    return '<div class="ff-state"><span class="sic lock">' + ICON.lock.replace('width="13" height="13"', 'width="28" height="28"') + '</span>' +
      '<h2>Claimed by ' + esc(by.name) + '</h2>' +
      '<p>This Task was claimed ' + esc(t.claimedAt || 'recently') + ' and is locked to them while in progress. You\u2019re seeing the claim record, not the working surface.</p>' +
      '<div class="sactions"><button class="btn btn-light" data-fw="readonly">View read-only</button>' +
        '<button class="btn btn-blue" id="backBtn2">' + ICON.back + 'Back to queue</button></div></div>';
  }
  function needsReviewPane(t) {
    return '<div class="fw-card"><div class="fw-body" style="padding:20px">' +
      '<div class="ff-review" style="background:var(--bad-bg);border-color:#E9C7BC"><span class="tri" style="color:var(--bad)">' + ICON.alert + '</span>' +
        '<div class="rvt"><b>Nothing legible to verify.</b> Don\u2019t force a patient match or clinical fields onto a garbled arrival.</div></div>' +
      '<button class="pm-altbtn" data-more="resend" style="margin-top:4px"><span class="ai">' + ICON.reopen + '</span><div><div class="at">Request a resend</div><div class="ad">Ask the sender to re-fax \u2014 keeps the Case thread</div></div></button>' +
      '<button class="pm-altbtn" data-more="needs_review"><span class="ai">' + ICON.flag + '</span><div><div class="at">Flag \u00b7 needs review</div><div class="ad">Park it for a supervisor \u2014 stays out of the clinical flow</div></div></button>' +
    '</div></div>';
  }

  /* ============================================================
     SWITCHER + RENDER
     ============================================================ */
  function switcher() {
    var opts = D.TASK_ORDER.map(function (id) {
      var t = TASKS[id];
      var lbl = { 'T-3061-L': 'Lab + critical', 'T-3061-R': 'Referral', 'T-2987-LB': 'Batch / fork', 'T-2904-V': 'Resolved', 'T-3120-IMG': 'Claimed (raced)', 'T-2950-UN': 'Unreadable' }[id] || id;
      var stt = t.status;
      return '<button class="ff-swopt' + (id === store.current ? ' on' : '') + '" data-task="' + id + '"><span class="st ' + stt + '"></span>' + esc(lbl) + '</button>';
    }).join('');
    return '<div class="ff-switch"><span class="swlbl">' + ICON.spark + 'Prototype \u00b7 open task</span><div class="swopts">' + opts + '</div></div>';
  }

  function critBanner(t, w) {
    if (t.type !== 'lab' || !t.crit) return '';
    if (effStatus(t, w) === 'resolved') return '';
    var c = t.crit;
    return '<div class="ff-crit">' + ICON.alert + '<div><b>Critical value on this result.</b> ' + esc(c.analyte) +
      ' <span class="val">' + esc(c.sym) + ' ' + esc(c.val) + ' ' + esc(c.unit) + '</span> flagged ' + esc(c.dir) +
      ' (ref ' + esc(c.range) + ') \u2014 verify before it routes onward.</div><span class="ct-tag">Critical</span></div>';
  }

  function render() {
    var t = curTask();
    var w = ws(store.current);
    titleEl.textContent = t.id;
    document.title = 'RobinDock — ' + t.id;
    var st = effStatus(t, w);

    var bodyHTML;
    if (st === 'resolved') bodyHTML = '<div class="ff-body" style="display:block">' + resolvedState(t, w) + '</div>';
    else if (st === 'claimed') bodyHTML = '<div class="ff-body" style="display:block">' + claimedState(t) + '</div>';
    else if (t.unreadable) bodyHTML = '<div class="ff-body"><div class="ff-doc tg-doc">' + RD_FF_DOC.viewer(t, w.ds) + '</div>' + needsReviewPane(t) + '</div>';
    else bodyHTML = '<div class="ff-body"><div class="ff-doc tg-doc">' + RD_FF_DOC.viewer(t, w.ds) + '</div><div class="ff-work">' + workPane(t, w) + '</div></div>';

    content.innerHTML = '<div class="ff">' + switcher() + header(t, w) + critBanner(t, w) + bodyHTML + '</div>';
    save();
  }

  /* ============================================================
     EVENT DELEGATION
     ============================================================ */
  function closeMenusFF() {
    var w = ws(store.current);
    if (w.reassignOpen || w.moreOpen) { w.reassignOpen = false; w.moreOpen = false; }
    var rm = document.getElementById('reassignMenu'); if (rm) rm.classList.remove('open');
    var mm = document.getElementById('moreMenu'); if (mm) mm.classList.remove('open');
  }

  content.addEventListener('click', function (e) {
    var t = curTask(), w = ws(store.current);

    /* prototype task switch */
    var sw = e.target.closest('[data-task]');
    if (sw) { store.current = sw.getAttribute('data-task'); store._expand = null; save(); render(); return; }

    /* back to queue */
    if (e.target.closest('#backBtn') || e.target.closest('#backBtn2')) {
      location.href = '../cases/Robin Dock - Cases.html'; return;
    }

    /* header go-links */
    var go = e.target.closest('[data-go]');
    if (go) { var g = go.getAttribute('data-go'); toast('Access logged', g === 'case' ? 'Opened Case ' + t.caseId : 'Opened contact ' + t.sender.name, 'ok'); return; }

    /* reassign menu */
    if (e.target.closest('#reassignBtn')) { e.stopPropagation(); var open = !w.reassignOpen; closeMenusFF(); w.reassignOpen = open; var rm = document.getElementById('reassignMenu'); if (rm) rm.classList.toggle('open', open); return; }
    if (e.target.closest('#moreBtn')) { e.stopPropagation(); var open2 = !w.moreOpen; closeMenusFF(); w.moreOpen = open2; var mm = document.getElementById('moreMenu'); if (mm) mm.classList.toggle('open', open2); return; }

    var ra = e.target.closest('[data-reassign]');
    if (ra) {
      var k = ra.getAttribute('data-reassign');
      if (k === 'dept') { var dn = (DEPTS.filter(function (d) { return d.key === ra.getAttribute('data-v'); })[0] || {}).name; toast('Re-homed', t.id + ' \u2192 ' + dn + ' \u00b7 logged'); }
      else if (k === 'unclaim') { toast('Returned to pool', t.id + ' \u2014 lock released, back to open \u00b7 logged'); }
      else if (k === 'person') toast('Reassigned', t.id + ' \u2014 pick a teammate (stub) \u00b7 logged');
      else if (k === 'case') toast('Case re-pointed', t.id + ' \u2014 moved to another Case (stub) \u00b7 logged');
      closeMenusFF(); render(); return;
    }
    var mo = e.target.closest('[data-more]');
    if (mo) {
      var mk = mo.getAttribute('data-more');
      if (mk === 'needs_review') { w.statusOverride = 'needs_review'; toast('Flagged \u00b7 needs review', t.id + ' \u2014 parked as unworkable \u00b7 logged', 'bad'); closeMenusFF(); render(); return; }
      if (mk === 'note') toast('Internal note', 'Staff-only coordination note (stub) \u00b7 logged');
      if (mk === 'export') toast('Export started', t.id + ' \u00b7 higher-sensitivity \u00b7 logged');
      if (mk === 'resend') toast('Resend requested', 'Asked ' + t.sender.name + ' to re-fax \u00b7 logged');
      closeMenusFF(); render(); return;
    }

    /* document viewer controls */
    var dv = e.target.closest('[data-ff]');
    if (dv) {
      var a = dv.getAttribute('data-ff');
      if (a === 'zoom-in') w.ds.zoom = Math.min(1.6, +((w.ds.zoom || 1) + 0.15).toFixed(2));
      else if (a === 'zoom-out') w.ds.zoom = Math.max(0.7, +((w.ds.zoom || 1) - 0.15).toFixed(2));
      else if (a === 'rotate') w.ds.rot = ((w.ds.rot || 0) + 90) % 360;
      else if (a === 'toggle-hl') w.ds.hl = !w.ds.hl;
      else if (a === 'download') { toast('Download started', t.id + ' \u00b7 logged', 'ok'); return; }
      else return handleWork(a, dv, t, w, e);
      render(); return;
    }

    var pg = e.target.closest('[data-ff-page]');
    if (pg) { w.ds.page = parseInt(pg.getAttribute('data-ff-page'), 10); w.ds.rot = 0; render(); return; }

    /* work-pane actions */
    var fw = e.target.closest('[data-fw]');
    if (fw) { handleWork(fw.getAttribute('data-fw'), fw, t, w, e); return; }

    /* step header expand/collapse */
    var sh = e.target.closest('[data-step]');
    if (sh) {
      var key = sh.getAttribute('data-step');
      var stp = sh.closest('.fw-step');
      if (stp && stp.classList.contains('locked')) return;
      store._expand = (store._expand === key) ? null : key;
      render(); return;
    }
  });

  function handleWork(a, el, t, w, e) {
    switch (a) {
      case 'pick-cand': w._candSel = el.getAttribute('data-id'); render(); return;
      case 'confirm-match': {
        var id = el.getAttribute('data-id');
        w.matched = id; w._candSel = null; store._expand = null;
        var p = PATIENTS[id];
        toast('Patient confirmed \u00b7 binding logged', p.name + ' \u00b7 ' + p.client + ' \u2014 trusted links written');
        render(); return;
      }
      case 'rematch': w.matched = null; w.clinicalReviewed = false; store._expand = 'patient'; render(); return;
      case 'drop-hint': render(); return;
      case 'add-patient': { var nc = t.newClient || {}; toast('New patient', 'Add under ' + (nc.client || 'client') + ' (stub) \u00b7 binding logged'); return; }
      case 'create-both': toast('New client + patient', 'Create both (stub) \u00b7 binding logged'); return;

      case 'edit-field': w.editing = el.getAttribute('data-key'); render(); return;
      case 'cancel-edit': w.editing = null; render(); return;
      case 'bool-set': {
        var key = el.closest('.cv-field').querySelector('[data-fw="save-field"]');
        var k = w.editing; if (!k) return;
        w.edits[k] = el.getAttribute('data-v') === 'true';
        w.verified[k] = true; w.editing = null;
        toast('Field confirmed \u00b7 logged', k + ' updated');
        render(); return;
      }
      case 'save-field': {
        var fk = el.getAttribute('data-key');
        var inp = document.getElementById('cvInput');
        if (inp) w.edits[fk] = inp.value;
        w.verified[fk] = true; w.editing = null;
        toast('Field confirmed \u00b7 logged', fk + ' verified');
        render(); return;
      }
      case 'add-field': {
        w.custom.push({ key: 'custom_' + (w.custom.length + 1), label: 'Custom field ' + (w.custom.length + 1), value: '', conf: 'low', kind: 'text', ph: 'Org-scoped clinical field' });
        toast('Custom field added', 'Clinical layer \u00b7 org-scoped');
        w.editing = 'custom_' + w.custom.length; render(); return;
      }

      case 'mark-reviewed': w.clinicalReviewed = true; store._expand = null; toast('Verification complete', t.id + ' \u2014 fields confirmed'); render(); return;
      case 'resolve': {
        w.statusOverride = 'resolved'; w.clinicalReviewed = true;
        toast('Resolved \u00b7 push-eligible', t.id + ' \u2014 verified data ready to push', 'send');
        render(); return;
      }
      case 'reopen': w.statusOverride = 'in_progress'; w.clinicalReviewed = false; toast('Reopened', t.id + ' \u2014 back to in progress \u00b7 logged'); render(); return;
      case 'readonly': toast('Read-only', 'Opened ' + t.id + ' as read-only \u00b7 access logged'); return;

      case 'undo-fork': w.forked = false; toast('Fork undone', t.id + ' \u2014 siblings reabsorbed'); render(); return;
    }
  }

  /* fork trigger: when a batch task gets its patient matched, offer fork on a 2nd add.
     Here, confirming the patient on a batch doc surfaces the fork as the binding implies siblings. */
  content.addEventListener('click', function (e) {
    var t = curTask(), w = ws(store.current);
    if (!t.batch || w.forked) return;
    if (e.target.closest('[data-fw="confirm-match"]')) {
      setTimeout(function () { w.forked = true; save(); render(); }, 60);
    }
  });

  /* pre-seeded search input (live filter is cosmetic on mock data) */
  content.addEventListener('input', function (e) {
    if (e.target.id === 'pmSearch') { /* keep value; no re-render to preserve focus */ }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#reassignWrap') && !e.target.closest('#moreWrap')) closeMenusFF();
  });

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
  if (bell) bell.addEventListener('click', function (e) { e.stopPropagation(); var o = !notifPanel.classList.contains('open'); closeMenus(notifPanel); notifPanel.classList.toggle('open', o); });
  var userBtn = document.getElementById('userBtn');
  if (userBtn) userBtn.addEventListener('click', function (e) { e.stopPropagation(); var o = !userPanel.classList.contains('open'); closeMenus(userPanel); userPanel.classList.toggle('open', o); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.bellwrap') && !e.target.closest('.usermenu')) closeMenus(null); });
  var clearN = document.getElementById('clearNotif');
  if (clearN) clearN.addEventListener('click', function () {
    document.getElementById('notifList').innerHTML = '<div class="ct-empty" style="padding:30px 20px"><div class="ico">' + ICON.check + '</div><h4>You\u2019re all caught up</h4><p>New notifications will appear here.</p></div>';
    var dot = document.getElementById('bellDot'); if (dot) dot.style.display = 'none';
  });
  var composeRail = document.getElementById('composeRail');
  if (composeRail) composeRail.addEventListener('click', function (e) { e.preventDefault(); toast('Compose', 'Starts a new outbound thread (stub)', 'send'); });

  /* ---------------- boot ---------------- */
  parseParams();
  if (!TASKS[store.current]) store.current = 'T-3061-L';
  render();
})();
