/* ============================================================
   RobinDock — Document Detail · CONTROLLER
   The confirm/complete surface. Design rules enforced here:
   · Extraction proposes; humans dispose. Below-threshold = empty.
   · Per-field confidence (plain language) + provenance marker →
     source-region reveal in the evidence pane.
   · Patient match is suggest-only: ranked candidates, ≥2-key rule,
     hard-conflict veto, never auto-pick / auto-create.
   · typed ≠ completed: every track walks its workflow spine.
   · The AI never pushes. Completion → eligible; a human push acts.
   · History is an append-only audit log (quiet, on-demand).
   ============================================================ */
(function () {
  'use strict';

  var content = document.getElementById('appContent');
  var DATA = window.DD_DATA, DOCR = window.DD_DOC;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var I = {
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevD: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkSm: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pencil: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    crosshair: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    info: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    paw: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="9" r="1.7"/><circle cx="12" cy="6.5" r="1.7"/><circle cx="17" cy="9" r="1.7"/><path d="M12 11c-2.4 0-4.3 2-4.3 3.7 0 1.4 1.1 2.1 2.3 2.1.9 0 1.3-.4 2-.4s1.1.4 2 .4c1.2 0 2.3-.7 2.3-2.1C16.3 13 14.4 11 12 11z"/></svg>',
    cat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4.2l3 3.4-3 1.6z"/><path d="M18 4.2l-3 3.4 3 1.6z"/><circle cx="12" cy="13" r="6.4"/></svg>',
    building: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 20V8l5-3 5 3M5 20h14M5 20V8m10 12V8l4 2.5V20M9 20v-4h2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    person: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    push: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V6m0 0l-5 5m5-5l5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 4h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    send: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 19l14-7L5 5v5l8 2-8 2v5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    cal: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    more: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></svg>',
    download: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    refresh: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 5v4h-4M5 19v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4 9A7 7 0 006 7.5M5.6 15A7 7 0 0018 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    reassign: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M16 3l4 4-4 4M20 7H8a4 4 0 00-4 4v1M8 21l-4-4 4-4M4 17h12a4 4 0 004-4v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5.5A1.5 1.5 0 0111.5 4h1A1.5 1.5 0 0114 5.5V7M6.5 7l.7 11a1.5 1.5 0 001.5 1.4h6.6a1.5 1.5 0 001.5-1.4L17.5 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spam: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3l9-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9.5v4M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    shield: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    link: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.5 1.5M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.5-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    scissors: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.6" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="18" r="2.6" stroke="currentColor" stroke-width="1.7"/><path d="M8.3 7.6L20 17M8.3 16.4L20 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    tRef: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 4l6 5-6 5v-3C9 11 6 13 5 17c-.3-5 2-9 9-9V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    tVax: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3.5l6.5 2.2v5c0 4.2-2.8 7.3-6.5 8.6-3.7-1.3-6.5-4.4-6.5-8.6v-5L12 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.2 11.7l2 2 3.6-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tQ: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9.3 9a2.7 2.7 0 015.2 1c0 1.8-2.7 2.5-2.7 2.5M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>',
    zoomIn: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    zoomOut: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    spark: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" fill="currentColor"/></svg>',
    x: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    plus: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    store: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 9l1.2-4A1.5 1.5 0 016.6 4h10.8a1.5 1.5 0 011.4 1l1.2 4M4 9v9.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V9M4 9h16M4 9a2.4 2.4 0 004 1.6A2.4 2.4 0 0012 10.6a2.4 2.4 0 004 0A2.4 2.4 0 0020 9" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    swap: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 8h13m0 0l-3.5-3.5M17 8l-3.5 3.5M20 16H7m0 0l3.5-3.5M7 16l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var TYPES = {
    ref: { cls: 'ty-ref', label: 'Referral' },
    lab: { cls: 'ty-lab', label: 'Lab result' },
    rec: { cls: 'ty-rec', label: 'Records' },
    req: { cls: 'ty-req', label: 'Records request' },
    vax: { cls: 'ty-vax', label: 'Vaccine / rabies' }
  };

  /* ---------------- state ---------------- */
  var params = new URLSearchParams(location.search);
  var scen = params.get('doc');
  if (!DATA.docs[scen]) scen = 'referral';
  var ui = { tab: defaultTab(DATA.docs[scen]), page: 0, zoom: 100, openTrack: 0, editing: null, selCand: null, lit: null, selField: null, openSec: {}, focusFld: null, cpick: null, cedit: null, srcEdit: false, typeMenu: false, pageSel: [], splitConfirm: false };

  /* ---- batch model: one fax transmission = one batch of sibling documents ----
     Most batches hold a single document (→ the navigator renders nothing). The
     referral demo fax carries two siblings (Referral + Vaccine cert) so the
     pattern is visible; a page-split adds a third sibling at runtime. Partial is
     its own single-document batch. */
  var demoBatch = {
    docs: [
      { scen: 'referral', id: 'RD-8341', label: 'Referral' },
      { scen: 'vaccine',  id: 'RD-8322', label: 'Vaccine cert' }
    ],
    splits: [] /* runtime split-outs: { id, label, from, pages } */
  };
  function batchFor(s) { return (s === 'referral' || s === 'vaccine') ? demoBatch : null; }

  function D() { return DATA.docs[scen]; }
  function now() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  function logEv(who, kind, what) { D().history.push({ who: who, kind: kind, ts: now(), what: what }); }

  /* ---------------- derived state ---------------- */
  function trackStatus(t) {
    if (t.pushed && t.complete) return { cls: 'complete', label: 'Complete' };
    if (t.syncing) return { cls: 'syncing', label: 'Syncing to PIMS' };
    var syncIdx = t.steps.length - 2;
    if (t.stepIdx >= syncIdx) return { cls: 'eligible', label: 'Eligible \u00b7 ready to push' };
    if (t.stepIdx === 0) return { cls: 'review', label: 'In Review' };
    if (t.stepIdx === 1) return { cls: 'match', label: 'Confirm Match' };
    return { cls: 'step', label: t.steps[t.stepIdx] };
  }
  function aggregate(d) {
    if (d.untyped) return { cls: 'review', label: 'In Review' };
    if (d.tracks.length && d.tracks.every(function (t) { return t.complete; }) && !d.suggestions.length)
      return { cls: 'complete', label: 'Complete' };
    if (d.tracks.some(function (t) { return t.reviewComplete; }))
      return { cls: 'eligible', label: 'Ready to push' };
    var started = d.tracks.some(function (t) {
      return t.stepIdx > 0 || t.fields.some(function (f) { return f.confirmed || f.edited; });
    });
    if (started) return { cls: 'progress', label: 'In Progress' };
    return { cls: 'review', label: 'In Review' };
  }
  function reviewDone(t) {
    return mainFields(t).every(settled);
  }
  /* tab badges count only what still needs a human action — unsettled fields
     (required-empty or filled-but-unconfirmed), pending type suggestions, and
     an untyped doc needing a type. Reference/metadata tabs carry no badge. */
  function unsettledCount(fields) {
    return fields.filter(function (f) { return !settled(f); }).length;
  }
  function workPending(d) {
    if (d.untyped) return 1;
    var n = 0;
    d.tracks.forEach(function (t) { if (!t.complete) n += unsettledCount(detailFields(t)); });
    return n;
  }
  function patientPending(d) {
    var n = 0;
    d.tracks.forEach(function (t) {
      if (t.complete) return;
      /* patient tab now holds only the patient & client binding — the referring
         source moved to the Source section on the Document tab, so its fields no
         longer count toward this tab's pending badge. */
      n += unsettledCount(identityFields(t));
    });
    return n;
  }
  /* referring-partner / contact fields (refvet, refclinic, prefcontact) live on
     the "Patient & contact" tab now — as do the patient & client identity fields
     (patient name, species, owner). The doc-type tab holds every field relevant
     to the type itself (document date + type-specific detail). */
  var IDENTITY_COUNT = 3; /* patient, species, owner — the who */
  function isPartner(f) { return f.group === 'partner'; }
  function mainFields(t) { return t.fields.filter(function (f) { return !isPartner(f); }); }
  function partnerStartIdx(t) {
    var i = -1;
    t.fields.forEach(function (f, fi) { if (i < 0 && isPartner(f)) i = fi; });
    return i < 0 ? t.fields.length : i;
  }
  /* identity = patient & client (on Patient & contact tab); detail = everything
     type-relevant that isn't a referring-source/contact field (on the type tab). */
  function identityFields(t) { return t.fields.slice(0, IDENTITY_COUNT); }
  function detailFields(t) { return t.fields.slice(IDENTITY_COUNT, partnerStartIdx(t)); }
  /* a field is "settled" when it has a value (or is an untouched optional field).
     Regular fields no longer require a confirm step — only the patient / client /
     contact cards carry an explicit confirmation. Contact-link fields still gate
     on their card confirm. */
  function settled(f) {
    if (f.input === 'contact') return !!(f.confirmed && (f.contact || f.contactOther));
    return !!f.value || !f.required;
  }

  /* ---------------- default landing (entry point only) ----------------
     Dependency order (Document → Patient & contact → type details → History)
     never changes. But forcing the coordinator to START on the two already-
     resolved scopes wastes clicks, so the screen OPENS on the leftmost tab that
     actually holds an unresolved exception. Precedence:
       1. type unconfirmed OR a suggested additional type awaiting a decision → Document
       2. patient not confidently matched (no-match / create-new) → Patient & contact
       3. type confirmed + binding confident → the field-work tab (type details) */
  function patientConfident(d) {
    if (d.match) return true; /* already bound to a record */
    return (d.candidates || []).some(function (c) { return c.eligible && c.grade === 'strong'; });
  }
  function defaultTab(d) {
    if (d.untyped || !d.tracks.length || (d.suggestions && d.suggestions.length)) return 'docmeta';
    if (!patientConfident(d)) return 'patient';
    return 'work';
  }

  /* ============================================================
     RENDER — header
     ============================================================ */
  function headerHtml() {
    var d = D();
    var agg = aggregate(d);
    var tic, ticCls = '';
    if (d.untyped) { tic = I.tQ; ticCls = 'untyped'; }
    else if (d.tracks[0] && d.tracks[0].type === 'vax') { tic = I.tVax; ticCls = 'vax'; }
    else tic = I.tRef;
    var tags = '';
    /* doc-type chips — the type(s) this document has been classified as */
    if (!d.untyped && d.tracks.length) {
      tags = d.tracks.map(function (t) {
        return '<span class="tag dd-typechip ' + TYPES[t.type].cls + '"><span class="d"></span>' + TYPES[t.type].label + '</span>';
      }).join('');
    }
    /* header doc-type selector — switching tracks happens here, not on the tab */
    var selIdx = (ui.openTrack >= 0 && ui.openTrack < d.tracks.length) ? ui.openTrack : 0;
    var selTrack = d.tracks[selIdx];
    return '<div class="dd-head">' +
      '<a class="dd-back" href="../inbox/Robin Dock - Inbox v2.html">' + I.back + 'Inbox</a>' +
      '<div class="dd-headmain">' +
      '<div class="dd-id">' +
        '<div class="who">' +
          '<div class="nm">' + esc(d.sender.name) + '</div>' +
          (tags ? '<div class="nm-tags">' + tags + '</div>' : '') +
          '<div class="sub">' +
            '<span>' + d.channel + ' \u00b7 <span class="mono">' + esc(d.sender.fax) + '</span></span><span class="dot"></span>' +
            '<span>Received ' + d.received + '</span><span class="dot"></span>' +
            '<span>' + d.pages + ' page' + (d.pages > 1 ? 's' : '') + '</span><span class="dot"></span>' +
            '<span class="mono">' + d.id + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dd-htail">' +
        (d.result === 'partial' ? '<span class="dd-badge">Partial \u00b7 Page-Cap</span>' : '') +
        '<span class="dd-agg ' + agg.cls + '"><span class="d"></span>' + agg.label + '</span>' +
        (d.assignee
          ? '<span class="dd-assignee"><span class="av ' + d.assignee.av + '" style="--av:28px">' + d.assignee.initials + '</span><span class="anm">' + esc(d.assignee.name) + '</span></span>'
          : '<button class="dd-actbtn" data-act="claim">Assign to me</button>') +
        '<div class="dd-more">' +
          '<button class="dd-morebtn" data-act="more" aria-label="More actions">' + I.more + '</button>' +
          '<div class="dd-menu" id="moreMenu">' +
            '<div class="mi" data-act="reextract">' + I.refresh + '<div><div class="mt">Re-run extraction</div><div class="md">Runs once on explicit request \u2014 e.g. after a cleaner copy arrives.</div></div></div>' +
            '<div class="mi" data-act="reassign">' + I.reassign + '<div><div class="mt">Reassign</div><div class="md">Hand this document to someone else.</div></div></div>' +
            '<div class="mi" data-act="download">' + I.download + '<div><div class="mt">Download source PDF</div><div class="md">' + d.pages + ' page' + (d.pages > 1 ? 's' : '') + ' \u00b7 ' + d.sizeKb + ' KB</div></div></div>' +
            '<div class="msep"></div>' +
            '<div class="mi bad" data-act="trash">' + I.trash + '<div><div class="mt">Move to trash</div></div></div>' +
            '<div class="mi bad" data-act="spam">' + I.spam + '<div><div class="mt">Mark as spam</div><div class="md">You confirm \u2014 spam is never auto-applied.</div></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>' +
    '</div>';
  }

  function scenStatus(doc) {
    if (doc.result === 'partial' || doc.untyped) return 'issue';
    var t = doc.tracks;
    if (t.length && t.every(function (x) { return x.complete || x.eligible; }) && !doc.suggestions.length) return 'done';
    return '';
  }
  function switcherHtml() {
    var names = { referral: 'Referral', vaccine: 'Vaccine cert', partial: 'Partial' };
    var todo = [], done = [];
    DATA.order.forEach(function (k) {
      var doc = DATA.docs[k];
      var sel = k === scen;
      var status = scenStatus(doc);
      var cls = 'dd-swopt' + (sel ? ' on' : (status ? ' ' + status : ''));
      var html = '<button class="' + cls + '" data-scen="' + k + '">' + names[k] + '</button>';
      (status === 'done' ? done : todo).push(html);
    });
    var out = '<div class="dd-switch">';
    if (todo.length) out += '<div class="sw-sec"><span class="swlbl">To do</span>' + todo.join('') + '</div>';
    if (todo.length && done.length) out += '<span class="sw-div"></span>';
    if (done.length) out += '<div class="sw-sec"><span class="swlbl done">Completed</span>' + done.join('') + '</div>';
    return out + '</div>';
  }

  function bannerHtml() {
    var b = D().banner;
    if (!b) return '';
    return '<div class="dd-banner ' + (b.kind === 'bad' ? 'bad' : '') + '">' + I.alert + '<div>' + b.html + '</div></div>';
  }

  /* ============================================================
     RENDER — document pane (evidence)
     ============================================================ */
  function docPaneHtml() {
    var d = D();
    var pages = DOCR.pages(d.scenario);
    var thumbs = pages.map(function (p, i) {
      return '<div class="thumb' + (i === ui.page ? ' on' : '') + (p.bad ? ' badpage' : '') + '" data-page="' + i + '">' +
        (p.mark ? '<span class="tmark ' + p.mark + '"></span>' : '') +
        '<span class="pn">' + (i + 1) + '</span></div>';
    }).join('');
    return '<div class="viewer">' +
      '<div class="thumbs">' + thumbs + '</div>' +
      '<div class="vmain">' +
        '<div class="vbar">' +
          '<span class="vt">Source document</span>' +
          '<span class="vsub">p. ' + (ui.page + 1) + ' / ' + pages.length + '</span>' +
          '<span class="vspace"></span>' +
          '<span class="vzoom">' +
            '<span class="zb" data-zoom="-1">' + I.zoomOut + '</span>' +
            '<span class="zl">' + ui.zoom + '%</span>' +
            '<span class="zb" data-zoom="1">' + I.zoomIn + '</span>' +
          '</span>' +
          '<span class="iconbtn" data-act="download" title="Download PDF" style="width:32px;height:32px">' + I.download + '</span>' +
        '</div>' +
        '<div class="vstage" id="vstage">' +
          '<div class="dd-page scanline" style="zoom:' + (ui.zoom / 100) + '">' + DOCR.renderPage(d.scenario, ui.page) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ============================================================
     RENDER — fields
     ============================================================ */
  function confHtml(f) {
    if (f.edited || f.conf === 'human') return '<span class="fd-conf human"><span class="cd"></span>You</span>';
    if (f.conf === 'high') return '<span class="fd-conf high"><span class="cd"></span>High confidence</span>';
    if (f.conf === 'med') return '<span class="fd-conf med"><span class="cd"></span>Medium confidence</span>';
    return '';
  }
  function fieldHtml(t, ti, f, fi) {
    var isEmpty = !f.value;
    var isEditing = ui.editing === ti + ':' + fi;
    var isSel = ui.selField === ti + ':' + fi;
    var cls = 'fd' + (isEmpty ? ' empty' : '') + (f.confirmed && !isEmpty ? ' confirmed' : '') +
      (isEditing ? ' editing' : '') + (isSel && !isEditing ? ' sel' : '');
    var body;
    if (isEditing) {
      body = '<div class="fd-label">' + esc(f.label) + (f.required ? '<span class="req">*</span>' : '') + '</div>' +
        '<div class="fd-editor"><input class="input" id="fdInput" value="' + esc(f.value) + '" placeholder="Enter ' + esc(f.label.toLowerCase()) + '\u2026" />' +
        '<div class="fd-editbar">' +
          '<button class="btn btn-blue save" data-save="' + ti + ':' + fi + '">Save</button>' +
          '<button class="cancel" data-cancel="1">Cancel</button>' +
          '<span class="lognote">' + I.shield + ' correction logged to History</span>' +
        '</div></div>';
      return '<div class="' + cls + '" data-fld="' + ti + ':' + fi + '">' + body + '</div>';
    }
    var statusChip = (f.confirmed && !isEmpty)
      ? '<span class="fd-conf done">' + I.checkSm + ' Confirmed</span>'
      : (isEmpty ? '' : confHtml(f));
    var editBtn = '<button class="fd-abtn fd-icon" data-edit="' + ti + ':' + fi + '" title="Edit" aria-label="Edit">' + I.pencil + '</button>';
    var acts;
    if (isEmpty || f.confirmed) {
      acts = editBtn;
    } else {
      acts = '<button class="fd-abtn aok" data-ok="' + ti + ':' + fi + '">Confirm</button>' + editBtn;
    }
    body = '<div class="fd-row" data-selfield="' + ti + ':' + fi + '">' +
      '<div class="fd-meta">' +
        '<div class="fd-label">' + esc(f.label) + (f.required ? '<span class="req">*</span>' : '') + '</div>' +
        (isEmpty
          ? '<div class="fd-empty">Left empty \u2014 below extraction threshold. Add a value.</div>'
          : '<div class="fd-val">' + esc(f.value) + '</div>') +
        (f.edited && f.corrFrom ? '<div class="fd-corr"><span class="old">' + esc(f.corrFrom) + '</span><span class="arrow">\u2192</span><span>corrected by you</span></div>' : '') +
      '</div>' +
      '<div class="fd-side">' +
        '<div class="fd-status">' + statusChip +
          (f.validated ? '<span class="fd-conf high" title="' + esc(f.validated) + '">' + I.shield + ' Validated</span>' : '') +
        '</div>' +
        '<div class="fd-acts">' + acts + '</div>' +
      '</div>' +
    '</div>';
    var selDot = '<button class="fd-seldot' + (isSel ? ' on' : '') + '" data-selfield="' + ti + ':' + fi + '" title="' + (isSel ? 'Selected \u2014 source shown in document' : 'Select to show source in document') + '"><span class="lbl">Selected</span></button>';
    return '<div class="' + cls + '" data-fld="' + ti + ':' + fi + '">' + selDot + body + '</div>';
  }

  function secHead(label, ctx, done, total, secKey, collapsed) {
    var complete = total > 0 && done >= total;
    var pct = total ? Math.round(done / total * 100) : 0;
    var toggle = (complete && secKey)
      ? ' dw-seclbl--toggle" data-sectoggle="' + secKey + '"'
      : '"';
    return '<div class="dw-seclbl' + (complete ? ' done' : '') + toggle + '>' +
      '<span>' + label + '</span>' +
      '<span class="rule"></span>' +
      (total
        ? '<span class="secct' + (complete ? ' done' : '') + '">' +
            (complete ? I.checkSm : '<span class="ptrack"><span class="pfill" style="width:' + pct + '%"></span></span>') +
            '<span class="pnum">' + done + '/' + total + '</span>' +
          '</span>'
        : '') +
      '<span class="c">' + ctx + '</span>' +
      (complete && secKey ? '<span class="secchev' + (collapsed ? '' : ' open') + '">' + I.chevD + '</span>' : '') +
    '</div>';
  }

  /* build a category's cards: unconfirmed first, confirmed sink to the bottom;
     when every field is confirmed the whole category collapses to just its header. */
  function sectionBody(t, ti, entries, secKey, complete) {
    var expanded = !complete || ui.openSec[secKey];
    if (complete && !expanded) return '';
    var open = entries.filter(function (e) { return !e.f.confirmed; });
    var done = entries.filter(function (e) { return e.f.confirmed; });
    return open.concat(done).map(function (e) { return fieldHtml(t, ti, e.f, e.fi); }).join('');
  }

  /* ---- confidence / provenance signal on the label row:
     · required but empty     → “Needs review”
     · AI-extracted value     → High / Medium confidence (hover for the why) + an
                                AI spark marking it was pulled by extraction. Both
                                the reading and the spark drop the moment a human
                                touches the field — clicks in and out, edits, or
                                clears it. No per-field confirm. */
  function confTag(f, ti, fi) {
    /* Confident fields carry no decoration \u2014 silence is the default state.
       Only a required field left empty (below threshold) pulls the eye. */
    if (!f.value && f.required)
      return '<span class="ff-status low" title="Left empty \u2014 below extraction threshold">Needs review</span>';
    return '';
  }

  /* ---- the editable control for one field (text / date / area) ---- */
  function fieldControl(t, ti, f, fi) {
    var key = ti + ':' + fi;
    var region = f.region ? ' data-region="' + f.region + '"' : '';
    var ph = 'Enter ' + esc(f.label.toLowerCase()) + '\u2026';
    if (f.input === 'date') {
      return '<div class="ff-datewrap ff-ctrl"><input class="input ff-input ff-date" type="text" data-fedit="' + key + '"' + region +
        ' value="' + esc(f.value) + '" placeholder="Select a date\u2026" />' + I.cal + '</div>';
    }
    if (f.input === 'textarea' || f.key === 'reason') {
      return '<textarea class="input ff-input ff-area" data-fedit="' + key + '"' + region + ' placeholder="' + ph + '">' + esc(f.value) + '</textarea>';
    }
    return '<input class="input ff-input" type="text" data-fedit="' + key + '"' + region + ' value="' + esc(f.value) + '" placeholder="' + ph + '" />';
  }

  /* ============================================================
     CONTACT-LINK FIELD (Referring practice)
     unconfirmed → recommends the top matching contact; confirm it,
     switch to another, create a new contact, or mark unlisted (Other).
     confirmed   → resolved, linked to a saved contact (or unlisted).
     ============================================================ */
  function contactRow(f, ti, fi, c, sel) {
    var key = ti + ':' + fi + ':' + c.id;
    return '<button class="cf-opt' + (sel ? ' sel' : '') + (c.best ? ' best' : '') + '" data-clink="' + key + '">' +
      '<span class="cf-optic">' + I.store + '</span>' +
      '<span class="cf-optbody">' +
        '<span class="cf-optname">' + esc(c.name) +
          (c.verified ? '<span class="cf-saved">' + I.shield + ' Saved</span>' : '') +
          (c.best ? '<span class="cf-best">Best match</span>' : '') +
        '</span>' +
        '<span class="cf-optmeta">' + esc(c.kind) + ' \u00b7 ' + esc(c.loc) + ' \u00b7 <span class="mono">' + esc(c.fax) + '</span></span>' +
        (c.note ? '<span class="cf-optnote">' + esc(c.note) + '</span>' : '') +
      '</span>' +
      '<span class="cf-optpick">' + I.check + '</span>' +
    '</button>';
  }

  /* inline source editor — shared by the "keep as typed / Other" path and the
     no-matching-contact path. Lets the coordinator add OR edit the source name
     when the sender isn't a saved contact, or when they'd rather record a typed
     source than link to the matched contact. */
  function sourceEditorHtml(f, key, opts) {
    var hasContacts = opts && opts.length;
    return '<div class="ff wide" data-ff="' + key + '">' +
      '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + '<span class="req">*</span></span>' +
        '<span class="ff-status high"><span class="cf-conf">' + I.pencil + ' ' + (f.value ? 'Edit source' : 'Add source') + '</span></span></div>' +
      '<div class="cf-editbox">' +
        '<label class="cf-editlab" for="cfInput">Source name</label>' +
        '<input class="input cf-otherinput" id="cfInput" value="' + esc(f.value || '') + '" placeholder="Referring practice or sender name\u2026" autocomplete="off" />' +
        '<div class="cf-editnote">' + I.info + ' Recorded as this document\u2019s source without a directory link. You can link it to a saved contact anytime.</div>' +
        '<div class="cf-editacts">' +
          '<button class="cf-confirm" data-cothersave="' + key + '">' + I.check + ' Save source</button>' +
          '<button class="cf-ghost" data-cothercancel="1">Cancel</button>' +
          (hasContacts ? '<button class="cf-ghost" data-cchange="' + key + '">' + I.swap + ' Pick a contact instead</button>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function contactFieldHtml(t, ti, f, fi) {
    var opts = f.contactOptions || [];
    var sug = opts.filter(function (c) { return c.id === f.suggestedId; })[0] || opts[0];
    var key = ti + ':' + fi;
    var picking = ui.cpick === key;
    var editing = ui.cedit === key;
    var linked = f.confirmed && f.contact;
    var other = f.confirmed && f.contactOther;

    /* ---- editing / adding a typed source (highest precedence) ---- */
    if (editing) return sourceEditorHtml(f, key, opts);

    /* ---- resolved: linked to a saved contact (picker takes precedence) ---- */
    if (linked && !picking) {
      var c = f.contact;
      return '<div class="ff wide ok" data-ff="' + key + '">' +
        '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + '<span class="req">*</span></span>' +
          '<span class="ff-status settled" title="Linked to a saved contact">' + I.shield + ' Linked</span></div>' +
        '<div class="cf-card cf-linked">' +
          '<span class="cf-ic">' + I.store + '</span>' +
          '<div class="cf-main">' +
            '<div class="cf-name">' + esc(c.name) +
              (c.verified ? '<span class="cf-saved">' + I.shield + ' Saved contact</span>' : '') + '</div>' +
            '<div class="cf-meta">' + esc(c.kind) + ' \u00b7 ' + esc(c.loc) + ' \u00b7 <span class="mono">' + esc(c.fax) + '</span></div>' +
          '</div>' +
          '<div class="cf-cardacts">' +
            '<a class="cf-link" href="../contacts/Robin Dock - Contact Detail.html">Open contact</a>' +
            '<button class="cf-ghost" data-cchange="' + key + '">' + I.swap + ' Change</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    /* ---- resolved: unlisted practice (Other) ---- */
    if (other && !picking) {
      return '<div class="ff wide filled" data-ff="' + key + '">' +
        '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + '<span class="req">*</span></span>' +
          '<span class="ff-status settled" title="Recorded without a directory link">' + I.check + ' Recorded</span></div>' +
        '<div class="cf-card cf-other">' +
          '<span class="cf-ic muted">' + I.store + '</span>' +
          '<div class="cf-main">' +
            '<div class="cf-name">' + esc(f.value) + '<span class="cf-unl">Unlisted</span></div>' +
            '<div class="cf-meta">Kept as typed \u2014 not linked to a saved contact.</div>' +
          '</div>' +
          '<div class="cf-cardacts">' +
            '<button class="cf-ghost" data-cedit="' + key + '">' + I.pencil + ' Edit source</button>' +
            '<button class="cf-ghost" data-cchange="' + key + '">' + I.swap + ' Link a contact</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    var footer =
      '<div class="cf-more">' +
        '<button class="cf-mini" data-cnew="' + key + '">' + I.plus + ' Create new contact</button>' +
        '<button class="cf-mini" data-cedit="' + key + '">' + I.pencil + ' Not in directory \u2014 add / edit source</button>' +
      '</div>';

    /* ---- picker open: full option list ---- */
    if (picking) {
      return '<div class="ff wide" data-ff="' + key + '">' +
        '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + '<span class="req">*</span></span>' +
          '<span class="ff-status high"><span class="cf-conf">' + (opts.length ? 'Choose a contact' : 'No matches') + '</span></span></div>' +
        '<div class="cf-picker">' +
          '<div class="cf-pickhead"><span>' + (opts.length ? 'Matching contacts' : 'No matching contacts') + '</span>' +
            '<button class="cf-close" data-cclose="' + key + '">' + I.x + '</button></div>' +
          (opts.length
            ? opts.map(function (c) { return contactRow(f, ti, fi, c, f.contact && f.contact.id === c.id); }).join('')
            : '<div class="cf-noopt">' + I.info + ' This number isn\u2019t linked to a saved contact. Add the source manually, or create a new contact.</div>') +
          footer +
        '</div>' +
      '</div>';
    }

    /* ---- no matching contact for this sender \u2014 add / edit the source manually ---- */
    if (!opts.length) {
      return '<div class="ff wide warn" data-ff="' + key + '">' +
        '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + '<span class="req">*</span></span>' +
          '<span class="ff-status warn">' + I.alert + ' No saved contact</span></div>' +
        '<div class="cf-card cf-nomatch">' +
          '<span class="cf-ic muted">' + I.store + '</span>' +
          '<div class="cf-main">' +
            '<div class="cf-extract">This number (<span class="mono">' + esc(D().sender.fax) + '</span>) isn\u2019t linked to a saved contact.</div>' +
            '<div class="cf-name">' + (f.value ? esc(f.value) : 'No source on file yet') + '</div>' +
            '<div class="cf-meta">Add the source manually, or create a contact for this sender.</div>' +
            '<div class="cf-acts">' +
              '<button class="cf-confirm" data-cedit="' + key + '">' + I.pencil + ' ' + (f.value ? 'Add / edit source' : 'Add source') + '</button>' +
              '<button class="cf-ghost" data-cnew="' + key + '">' + I.plus + ' Create new contact</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    /* ---- default: recommend the top contact ---- */
    return '<div class="ff wide" data-ff="' + key + '">' +
      '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + '<span class="req">*</span></span>' +
        '<span class="ff-status high"><span class="cf-conf">' + I.spark + ' Suggested link</span></span></div>' +
      '<div class="cf-card cf-suggest">' +
        '<span class="cf-ic">' + I.store + '</span>' +
        '<div class="cf-main">' +
          '<div class="cf-extract">Extracted \u201c<b>' + esc(f.value) + '</b>\u201d \u2014 matched to a saved contact</div>' +
          '<div class="cf-name">' + esc(sug.name) +
            (sug.verified ? '<span class="cf-saved">' + I.shield + ' Saved contact</span>' : '') + '</div>' +
          '<div class="cf-meta">' + esc(sug.kind) + ' \u00b7 ' + esc(sug.loc) + ' \u00b7 <span class="mono">' + esc(sug.fax) + '</span></div>' +
          '<div class="cf-acts">' +
            '<button class="cf-confirm" data-clink="' + key + ':' + sug.id + '">' + I.check + ' Confirm link</button>' +
            '<button class="cf-ghost" data-cchange="' + key + '">' + I.swap + ' Different contact</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      footer +
    '</div>';
  }

  /* ---- one labeled field: quiet confidence, empty-required flagged ---- */
  function formFieldHtml(t, ti, f, fi) {
    if (f.input === 'contact') return contactFieldHtml(t, ti, f, fi);
    var emptyReq = !f.value && f.required;
    var state = emptyReq ? ' warn' : (f.value ? ' filled' : ' empty');
    var cls = 'ff' + (f.wide ? ' wide' : '') + state;
    return '<div class="' + cls + '" data-ff="' + ti + ':' + fi + '">' +
      '<div class="ff-lab"><span class="ff-name">' + esc(f.label) + (f.required ? '<span class="req">*</span>' : '') + '</span>' +
        confTag(f, ti, fi) +
        (f.validated ? '<span class="validic" title="' + esc(f.validated) + '">' + I.shield + '</span>' : '') +
      '</div>' +
      fieldControl(t, ti, f, fi) +
      (emptyReq ? '<div class="ff-warn">' + I.alert + ' Needs a value \u2014 left empty because extraction was below threshold.</div>' : '') +
      (f.edited && f.corrFrom ? '<div class="ff-corr"><span class="old">' + esc(f.corrFrom) + '</span><span class="arrow">\u2192</span>corrected by you</div>' : '') +
    '</div>';
  }

  /* ---- a form section (Core / type-specific). Fields settle on having a value;
     no per-section confirm — confirmation lives on the patient/client/contact cards. */
  function formSection(label, ctx, t, ti, from, to) {
    var fields = t.fields.slice(from, to);
    if (!fields.length) return '';
    var filled = fields.filter(function (f) { return f.value; }).length;
    var missing = fields.filter(function (f) { return f.required && !f.value; }).length;
    var complete = fields.every(settled);
    /* collapsible: expanded while there's work to do; once every field is
       settled it collapses by default. A user toggle overrides + persists. */
    var secKey = 'form:' + ti + ':' + from + ':' + to;
    var expanded = !complete || ui.openSec[secKey];
    var grid = fields.map(function (f, i) { return formFieldHtml(t, ti, f, from + i); }).join('');
    var titleHtml = complete
      ? '<button type="button" class="ff-sectoggle" data-sectoggle="' + secKey + '" aria-expanded="' + (expanded ? 'true' : 'false') + '">' +
          '<span class="secchev' + (expanded ? ' open' : '') + '">' + I.chevD + '</span>' +
          '<h3 class="ff-sectitle">' + label + '</h3></button>'
      : '<h3 class="ff-sectitle">' + label + '</h3>';
    return '<div class="ff-sec' + (expanded ? '' : ' collapsed') + '">' +
      '<div class="ff-sechead">' +
        titleHtml +
      '</div>' +
      (expanded ? '<div class="ff-grid">' + grid + '</div>' : '') +
    '</div>';
  }

  /* Read-only echo of the document-level referring source on the type tab.
     The referring vet / practice is resolved ONCE, as the document-level source,
     on the Patient & contact tab. It reappears here only as a read-only echo so
     the coordinator can see the source in context \u2014 never a second editable
     binding. Editing happens on Patient & contact. */
  function partnerEchoHtml(t, pStart) {
    var pf = t.fields.slice(pStart);
    function val(key) { var f = pf.filter(function (x) { return x.key === key; })[0]; return f ? (f.value || '\u2014') : null; }
    var rows = '';
    var vet = val('refvet'), clinic = val('refclinic');
    if (vet != null) rows += '<div class="ff-echo-row"><span class="k">Referring vet</span><span class="v">' + esc(vet) + '</span></div>';
    if (clinic != null) rows += '<div class="ff-echo-row"><span class="k">Referring practice</span><span class="v">' + esc(clinic) + '</span></div>';
    return '<div class="ff-note ff-partner-note">' + I.link +
      '<div><b>Referring source is set in the Source section on the Document tab.</b>' +
        '<div class="ff-echo">' + rows + '</div>' +
        '<span class="ff-echo-note">Shown here read-only \u2014 it\u2019s resolved once, as the document-level source, on the Document tab.</span>' +
      '</div></div>';
  }

  function reviewFormHtml(t, ti) {
    var main = mainFields(t);
    var missing = main.filter(function (f) { return f.required && !f.value; }).length;
    var pending = main.filter(function (f) { return f.value && !f.confirmed; }).length;
    var canContinue = reviewDone(t);
    var pStart = partnerStartIdx(t);
    var labTbl = '';
    if (t.labResults) {
      labTbl = '<div class="ff-sec"><div class="ff-sechead"><span class="ff-seclbl">Result values</span>' +
        '<span class="ff-secmeta"><span class="ff-seccount">as printed</span></span></div>' +
        '<div class="dd-labtable"><table><thead><tr><th>Analyte</th><th class="num">Result</th><th>Units</th><th>Reference</th><th></th></tr></thead><tbody>' +
        t.labResults.map(function (r) {
          var fl = r.flag === 'high' ? '<span class="dd-labfl high">H</span>' : r.flag === 'low' ? '<span class="dd-labfl low">L</span>' : '';
          return '<tr' + (r.flag === 'high' ? ' class="hi"' : '') + '><td class="an">' + r.an + '</td><td class="num val">' + r.val + '</td><td>' + r.unit + '</td><td class="rng">' + r.rng + '</td><td>' + fl + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="dd-asprinted">' + I.info + ' Values transcribed as printed \u2014 they sync to the record verbatim and are never interpreted.</div></div>';
    }
    return formSection(TYPES[t.type].label + ' details', '', t, ti, IDENTITY_COUNT, pStart) +
      (t.stagedNote && t.fields.some(function (f) { return !f.value; })
        ? '<div class="ff-note">' + I.info + '<div>' + esc(t.stagedNote) + '</div></div>' : '') +
      (pStart < t.fields.length
        ? partnerEchoHtml(t, pStart)
        : '')  +
      labTbl +
      (t.reviewComplete
        ? '<div class="ff-foot ff-foot-done">' +
            '<div class="ff-footinfo"><span class="ff-footok">' + I.check + '</span> <b>Marked ready to push.</b> This document is eligible \u2014 the push to your PIMS is a separate, human action, from here or the Ready-to-push view.</div>' +
          '</div>'
        : '<div class="ff-foot ff-foot-complete">' +
            '<button class="btn btn-blue ff-completebtn" data-complete="' + ti + '"' + (missing ? ' disabled' : '') + '>' + I.check + ' Complete &amp; mark ready to push</button>' +
            (missing
              ? '<div class="ff-footreason">' + I.alert + ' ' + missing + ' required field' + (missing > 1 ? 's' : '') + ' still ' + (missing > 1 ? 'need' : 'needs') + ' a value.</div>'
              : '') +
            '<div class="ff-footpush">' + I.info + '<span>Completing makes this eligible to push \u2014 the push to your PIMS is always a separate, human action.</span></div>' +
          '</div>');
  }

  /* ---------------- patient match step ---------------- */
  function matchStepHtml(t, ti) {
    var d = D();
    if (d.match) {
      return '<div class="pmx-done"><span class="di">' + I.paw + '</span>' +
        '<div><div class="dn">' + esc(d.match.name) + '</div><div class="ds">' + esc(d.match.sig) + ' \u00b7 ' + esc(d.match.how) + '</div></div>' +
        '<button class="dx" data-unmatch="' + ti + '">Change</button></div>';
    }
    var shown = d.candidates.filter(function (c) { return c.eligible; });
    var ruledOut = d.candidates.filter(function (c) { return !c.eligible; });
    var cands = shown.map(function (c) {
      var sel = ui.selCand === c.id;
      var keys = c.keys.map(function (k) {
        return '<span class="pmx-key' + (k.hit ? '' : ' miss') + '">' + (k.tie ? I.link : '') + esc(k.k) + (k.hit ? ' ' + I.checkSm : '') + '</span>';
      }).join('');
      var badge = c.grade === 'strong' ? '<span class="pmx-badge strong">Strong \u00b7 ' + c.keys.filter(function(k){return k.hit;}).length + ' keys</span>'
        : c.grade === 'veto' ? '<span class="pmx-badge veto">Vetoed</span>'
        : '<span class="pmx-badge weak">Low \u00b7 1 key</span>';
      return '<button class="pmx-cand' + (sel ? ' sel' : '') + (c.eligible ? '' : ' veto') + (c.feline ? ' feline' : '') + '" data-cand="' + c.id + '"' + (c.eligible ? '' : ' disabled') + '>' +
        '<span class="paw">' + (c.feline ? I.cat : I.paw) + '</span>' +
        '<div class="cmain">' +
          '<div class="cnm">' + esc(c.name) + badge + '</div>' +
          '<div class="csig">' + esc(c.species) + ' \u00b7 ' + esc(c.breed) + ' \u00b7 ' + esc(c.sex) + ', ' + esc(c.age) + ' \u00b7 <b>' + esc(c.owner) + '</b> \u00b7 <span style="font-family:var(--f-mono);font-size:10.5px">' + c.acct + '</span></div>' +
          '<div class="pmx-keys">' + keys + '</div>' +
          (c.conflict ? '<div class="pmx-conflict">' + I.alert + '<span>' + esc(c.conflict) + '</span></div>' : '') +
        '</div>' +
        '<span class="cck">' + I.checkSm + '</span>' +
      '</button>';
    }).join('');
    var selC = d.candidates.filter(function (c) { return c.id === ui.selCand; })[0];
    var ruledNote = ruledOut.length
      ? '<div class="pmx-ruled">' + I.info + '<span>' +
          ruledOut.length + ' same-name ' + (ruledOut.length === 1 ? 'record was' : 'records were') + ' ruled out — ' +
          ruledOut.map(function (c) { return esc(c.name) + ' (' + esc(c.species) + ((c.conflict ? ', ' + esc(c.conflict.split('\u2014')[0].replace(/\s*$/, '').toLowerCase()) : '')) + ')'; }).join('; ') +
          '. A hard conflict vetoes a match regardless of score.</span></div>'
      : '';
    return '<div class="pmx-note">' + I.info + '<div><b>Match is suggested, never auto-picked.</b> High confidence needs \u22652 agreeing keys; a hard conflict vetoes regardless of score. Binding the patient is your call.</div></div>' +
      cands +
      ruledNote +
      (selC ? '<div class="pmx-confirm"><div class="ct">Bind this document to <b>' + esc(selC.name) + ' \u00b7 ' + esc(selC.owner) + '</b>? The confirmed match also strengthens the ' + esc(d.sender.name) + ' contact tie.</div>' +
        '<button class="btn btn-blue btn-sm" data-bind="' + ti + '">Confirm match</button></div>' : '') +
      '<div class="pmx-alts">' +
        '<button class="pmx-altbtn" data-createnew="' + ti + '">+ Create new patient</button>' +
        '<button class="pmx-altbtn" data-nomatch="' + ti + '">Complete without a match</button>' +
      '</div>';
  }

  /* ---------------- type-specific + sync steps ---------------- */
  function stepCardHtml(t, ti) {
    var d = D();
    var step = t.steps[t.stepIdx];
    var syncIdx = t.steps.length - 2;
    if (t.complete) {
      return '<div class="tk-completed"><span class="ci">' + I.check + '</span>' +
        '<div><div class="ct">Track complete</div><div class="cs">Pushed to PIMS \u00b7 ' + now() + ' \u00b7 payload logged with per-field provenance</div></div></div>';
    }
    if (t.stepIdx >= syncIdx) {
      /* eligible → push (manual, human-triggered — the AI never pushes) */
      return '<div class="stp-card stp-eligible">' +
        '<div class="stp-done-note">' + I.check + ' Review, match and workflow steps are done \u2014 this track is <b>\u00a0eligible</b>.</div>' +
        '<div class="stp-push-note">' + I.info + '<div><b>Completion authorizes; your push acts.</b> Nothing is written to the PIMS until a person pushes it \u2014 single here, or in bulk from the Ready-to-push view.</div></div>' +
        '<div class="row"><button class="btn btn-blue" data-push="' + ti + '"' + (t.syncing ? ' disabled' : '') + '>' + I.push + (t.syncing ? 'Syncing\u2026' : 'Push to PIMS') + '</button>' +
        (t.syncing ? '' : '<span style="font-size:11px;color:var(--gray-500)">Writes to Mountain West \u00b7 AVImark</span>') + '</div>' +
      '</div>';
    }
    if (step === 'Confirm to Referrer') {
      return '<div class="stp-card">' +
        '<div class="st">' + I.send + ' Confirm to referrer</div>' +
        '<div class="sd">One-click acknowledgment back to <b>' + esc(d.sender.name) + '</b> (fax ' + esc(d.sender.fax) + '): referral received, under review, reference ' + d.id + '.</div>' +
        '<div class="row"><button class="btn btn-blue btn-sm" data-tstep="' + ti + '" data-ack="1">Send acknowledgment</button></div>' +
      '</div>';
    }
    if (step === 'Schedule') {
      return '<div class="stp-card">' +
        '<div class="st">' + I.cal + ' Schedule <span style="font-size:10px;font-weight:600;color:var(--gray-400)">optional</span></div>' +
        '<div class="sd">Prep a booking for <b>' + esc(d.match ? d.match.name : 'the patient') + '</b> \u2014 orthopedic surgery consult. Skipping doesn\u2019t block completion.</div>' +
        '<div class="row"><button class="btn btn-blue btn-sm" data-tstep="' + ti + '" data-sched="1">Mark scheduled</button>' +
        '<button class="stp-skip" data-tstep="' + ti + '" data-skip="1">Skip for now</button></div>' +
      '</div>';
    }
    if (step === 'Fulfill Request') {
      return '<div class="stp-card">' +
        '<div class="st">' + I.send + ' Fulfill request</div>' +
        '<div class="sd">Send the requested records out. This replaces Sync for records requests \u2014 the work product is outbound.</div>' +
        '<div class="row"><button class="btn btn-blue btn-sm" data-tstep="' + ti + '">Open fulfillment</button></div>' +
      '</div>';
    }
    return '';
  }

  /* ---------------- stepper (shared: progress head + pips) ---------------- */
  function stepperHtml(t) {
    var optIdx = t.optionalSteps || [];
    var pips = t.steps.map(function (s, si) {
      var last = si === t.steps.length - 1;
      var passed = t.complete || si < t.stepIdx;
      var cls = passed ? 'done' : si === t.stepIdx ? 'now' : '';
      var opt = optIdx.indexOf(si) >= 0;
      return '<span class="tk-pip ' + cls + (opt ? ' opt' : '') + '" title="' + esc(s) + (opt ? ' (optional)' : '') + '">' +
          '<span class="pd">' + (passed ? I.checkSm : si + 1) + '</span></span>' +
        (last ? '' : '<span class="tk-line' + (passed ? ' done' : '') + '"></span>');
    }).join('');
    var curNo = t.complete ? t.steps.length : t.stepIdx + 1;
    var curName = t.complete ? 'Complete' : t.steps[t.stepIdx];
    var curOpt = optIdx.indexOf(t.stepIdx) >= 0 && !t.complete;
    return '<div class="tk-steps-head">' +
        '<span class="tk-cur">' + esc(curName) + (curOpt ? '<span class="tk-optbadge">optional</span>' : '') + '</span>' +
        '<span class="tk-count">Step ' + curNo + ' of ' + t.steps.length + '</span>' +
      '</div>' +
      '<div class="tk-pips">' + pips + '</div>';
  }

  /* ---------------- track card (Referral tab: field review only) ---------------- */
  /* The patient match + downstream workflow steps (Confirm to Referrer,
     Schedule, Push to PIMS) now live on the Patient & contact tab — this tab
     is purely the extracted-field review for the active track. */
  function trackHtml(t, ti) {
    var st = trackStatus(t);
    return '<div class="tk' + (t.complete ? ' done' : ' open') + '">' +
      '<div class="tk-head">' +
        '<span class="tag ' + TYPES[t.type].cls + '"><span class="d"></span>' + TYPES[t.type].label + '</span>' +
        '<span class="origin">' + esc(t.origin) + '</span>' +
        '<span class="tk-status ' + st.cls + '" style="margin-left:auto"><span class="d"></span>' + st.label + '</span>' +
      '</div>' +
      '<div class="tk-body">' + reviewFormHtml(t, ti) + '</div>' +
    '</div>';
  }

  function suggestionHtml(s, si) {
    return '<div class="sg">' +
      '<div class="sgmain">' +
        '<div class="sgtop"><span class="tag ' + TYPES[s.type].cls + '">' + TYPES[s.type].label + '?</span>' +
        '<span class="sg-band ' + s.band + '"><span class="bd"></span>' + s.band + ' confidence</span></div>' +
        '<div class="sgwhy">' + s.why + '</div>' +
      '</div>' +
      '<div class="sgacts">' +
        '<button class="sg-promote" data-promote="' + si + '">Confirm type</button>' +
        '<button class="sg-dismiss" data-dismiss="' + si + '">Dismiss</button>' +
      '</div>' +
    '</div>';
  }

  function untypedHtml() {
    return '<div class="dd-settype">' +
      '<h4>No confirmed type yet</h4>' +
      '<p>Nothing classified above threshold, so nothing was applied. Set the type manually \u2014 that correction is the highest-value calibration signal the practice can give.</p>' +
      '<div class="typerow">' + Object.keys(TYPES).map(function (k) {
        return '<button class="typebtn" data-settype="' + k + '">' + TYPES[k].label + '</button>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="fd-stagenote">' + I.info + '<div><b>Request a cleaner copy?</b> Re-extraction runs only on your explicit trigger \u2014 use \u201cRe-run extraction\u201d in the header menu once a better scan arrives.</div></div>';
  }

  /* ---- unified doc-type manager: confirm suggested · add · remove ----
     One clear surface used both at the top of the work tab and on the
     Document tab, so there is a single mental model for typing a doc. */
  function typeManagerHtml(d, part) {
    part = part || 'assigned';
    /* untyped / no confirmed track → a plain picker to classify it */
    if (d.untyped || !d.tracks.length) {
      if (part === 'suggested') return '';
      return '<div class="tmg">' +
        '<div class="tmg-head"><span class="tmg-title">Document type</span></div>' +
        '<div class="tmg-empty">' + I.info + '<div><b>No type set yet.</b> Nothing classified above threshold \u2014 choose a type to start a workflow.</div></div>' +
        '<div class="tmg-add-open"><div class="tmg-add-row">' +
          Object.keys(TYPES).map(function (k) {
            return '<button class="tmg-addbtn" data-settype="' + k + '">' + I.plus + TYPES[k].label + '</button>';
          }).join('') +
        '</div></div>' +
      '</div>';
    }

    var multi = d.tracks.length > 1;
    var rows = d.tracks.map(function (t, ti) {
      var st = trackStatus(t);
      var active = ti === ui.openTrack;
      var removing = ui.removeType === ti;
      return '<div class="tmg-row' + (active && multi ? ' on' : '') + '">' +
        '<div class="tmg-rowmain">' +
          '<span class="tag tmg-typechip ' + TYPES[t.type].cls + '"><span class="d"></span>' + TYPES[t.type].label + '</span>' +
          '<span class="tk-status ' + st.cls + '"><span class="d"></span>' + st.label + '</span>' +
        '</div>' +

        (removing
          ? '<span class="tmg-confirm">Remove this type?' +
              '<button class="tmg-cyes" data-removetrack="' + ti + '">Remove</button>' +
              '<button class="tmg-cno" data-removecancel>Keep</button></span>'
          : '<button class="tmg-remove" data-removeask="' + ti + '" title="Remove this type" aria-label="Remove ' + TYPES[t.type].label + '">' + I.trash + '</button>') +
      '</div>';
    }).join('');

    var sugRows = (d.suggestions || []).map(function (s, si) {
      return '<div class="tmg-row tmg-sug">' +
        '<div class="tmg-sugmain">' +
          '<div class="tmg-sugtop"><span class="tag ' + TYPES[s.type].cls + ' sugtag">' + I.spark + TYPES[s.type].label + '</span>' +
            '<span class="sg-band ' + s.band + '"><span class="bd"></span>' + s.band + ' confidence</span></div>' +
          '<div class="tmg-sugwhy">' + s.why + '</div>' +
        '</div>' +
        '<div class="tmg-sugacts">' +
          '<button class="sg-promote sg-soft ' + TYPES[s.type].cls + '" data-promote="' + si + '">' + I.checkSm + ' Confirm</button>' +
          '<button class="sg-dismiss" data-dismiss="' + si + '">Dismiss</button>' +
        '</div>' +
      '</div>';
    }).join('');

    var applied = {};
    d.tracks.forEach(function (t) { applied[t.type] = 1; });
    (d.suggestions || []).forEach(function (s) { applied[s.type] = 1; });
    var addKeys = Object.keys(TYPES).filter(function (k) { return !applied[k]; });
    var addBlock = '';
    if (addKeys.length) {
      addBlock = ui.addType
        ? '<div class="tmg-add-open"><span class="tmg-addlbl">Add a type manually</span>' +
            '<div class="tmg-add-row">' +
              addKeys.map(function (k) { return '<button class="tmg-addbtn" data-settype="' + k + '">' + I.plus + TYPES[k].label + '</button>'; }).join('') +
              '<button class="tmg-addcancel" data-addcancel>Cancel</button>' +
            '</div></div>'
        : '<button class="tmg-addtoggle" data-addtoggle>' + I.plus + 'Add another type</button>';
    }

    var hasSug = d.suggestions && d.suggestions.length;

    if (part === 'suggested') {
      if (!hasSug) return '';
      return '<div class="tmg tmg-sugcard">' +
        '<span class="tmg-aibadge">' + I.spark + 'AI Suggested</span>' +
        '<div class="tmg-tophead">' +
          '<span class="tmg-title">New Workflow Identified</span>' +
          '<span class="tmg-tophead-sub">Proposed by extraction — not assigned. Confirm to add a track, or dismiss.</span>' +
        '</div>' +
        '<div class="tmg-assigned">' + sugRows + '</div>' +
      '</div>';
    }

    /* --- assigned part: unified with the fax's sibling documents ---
       The current document's confirmed type(s) carry full controls; the other
       documents in the same fax are shown as calm, read-only rows below. */
    var b = batchFor(scen);
    var sibRows = '';
    var docCount = 1;
    if (b) {
      docCount = b.docs.length + b.splits.length;
      b.docs.forEach(function (doc) {
        if (doc.scen === scen) return;
        var sd = DATA.docs[doc.scen];
        var t0 = sd.tracks[0];
        var m = navStatusMeta(scenStatus(sd));
        var cls = t0 ? TYPES[t0.type].cls : 'ty-req';
        sibRows += '<div class="tmg-row tmg-sib">' +
          '<span class="tag tmg-typechip ' + cls + '"><span class="d"></span>' + esc(doc.label) + '</span>' +
          '<span class="tk-status ' + m.cls + '"><span class="d"></span>' + m.label + '</span>' +
        '</div>';
      });
      b.splits.forEach(function (sp) {
        sibRows += '<div class="tmg-row tmg-sib">' +
          '<span class="tag tmg-typechip ty-req"><span class="d"></span>' + esc(sp.label) + '</span>' +
          '<span class="tk-status issue"><span class="d"></span>Untyped \u00b7 new</span>' +
        '</div>';
      });
    }

    /* AI-suggested sibling document/workflow — proposed, not yet a track.
       Pending → yellow row with confidence + hover reason + confirm/dismiss.
       Confirmed → folds into the sibling list as a real Lab track.
       Dismissed → hidden. */
    var sugSib = '';
    if (b) {
      if (b.sugState === 'confirmed') {
        sibRows += '<div class="tmg-row tmg-sib">' +
          '<span class="tag tmg-typechip ty-lab"><span class="d"></span>Lab result</span>' +
          '<span class="tk-status review"><span class="d"></span>In Review</span>' +
        '</div>';
        docCount += 1;
      } else if (b.sugState !== 'dismissed') {
        sugSib = '<div class="tmg-row tmg-sibsug">' +
          '<span class="tag tmg-typechip sugtag ty-lab"><span class="sug-ico">' + I.spark + '</span>Lab result</span>' +
          '<span class="sg-band medium tmg-confhover" tabindex="0" aria-label="Why this was suggested">' +
            '<span class="bd"></span>medium confidence' +
            '<span class="tmg-tip" role="tooltip">' +
              '<span class="tmg-tip-body">Pages <b>3\u20134</b> look like an attached <b>CBC / Chem 17 panel</b> from Bear Hollow\u2019s in-house analyzer. Confirming adds an independent Lab track with its own completion.</span>' +
            '</span>' +
          '</span>' +
          '<span class="tmg-sibsug-acts">' +
            '<button class="sg-promote sg-soft ty-lab" data-sib-confirm>' + I.checkSm + ' Confirm</button>' +
            '<button class="sg-dismiss" data-sib-dismiss>Dismiss</button>' +
          '</span>' +
        '</div>';
      }
    }

    var title = b
      ? 'This fax contains <b>' + docCount + ' document' + (docCount > 1 ? 's' : '') + '</b>'
      : 'Document type' + (multi ? 's' : '');
    var sub = b
      ? 'Each is an independent track with its own workflow and status'
      : (multi ? 'Active tracks driving this document’s workflow' : 'The active track driving this document’s workflow');

    return '<div class="tmg fdx-card">' +
      '<div class="tmg-tophead">' +
        '<span class="tmg-title">' + title + '</span>' +
        '<span class="tmg-tophead-sub">' + sub + '</span>' +
      '</div>' +
      '<div class="tmg-assigned">' + rows + sibRows + sugSib + '</div>' +
      addBlock +
    '</div>';
  }

  /* ============================================================
     RENDER — tabs
     ============================================================ */
  function workTabHtml() {
    var d = D();
    if (d.untyped) return untypedHtml();
    var out = '';
    /* the doc-type selector lives at the top of this tab — it selects which track this tab is working on */
    out += typeSelectorHtml(d);
    var ti = (ui.openTrack >= 0 && ui.openTrack < d.tracks.length) ? ui.openTrack : 0;
    var t = d.tracks[ti];
    if (t) out += trackHtml(t, ti);
    /* the type workflow spine lives here now — it switches with the active track
       (Referral workflow on the referral track, Lab result workflow on lab, etc.) */
    out += workflowSectionHtml(d);
    return out;
  }

  /* ---- SECTION A · the patient the document is about (patient & client) ---- */
  function patientSectionHtml(d) {
    var t0 = d.tracks[0];
    var core = t0 ? t0.fields : [];
    var pName = core[0] ? core[0].value : '';
    var pSpecies = core[1] ? core[1].value : '';
    var pOwner = core[2] ? core[2].value : '';
    var feline = /feline/i.test(pSpecies);
    var strong = (d.candidates || []).filter(function (c) { return c.eligible && c.grade === 'strong'; })[0];
    var typeLbl = t0 ? TYPES[t0.type].label : 'document';

    var statusPill = d.match
      ? '<span class="fd-conf high">' + I.shield + ' Bound to record</span>'
      : (d.candidates && d.candidates.length
          ? '<span class="fd-conf med"><span class="cd"></span>Match pending</span>'
          : '<span class="fd-conf med"><span class="cd"></span>No candidate yet</span>');
    var head = '<div class="pc-head"><span class="pc-ic pat">' + I.paw + '</span>' +
      '<div class="pc-htext"><div class="pc-title">Patient &amp; client</div>' +
        '<div class="pc-sub">Who this document is about</div></div>' +
      '<span class="pc-hstatus">' + statusPill + '</span></div>';

    if (!pName) {
      return '<div class="pc-sec">' + head +
        '<div class="pc-note">' + I.info + '<div>No patient extracted yet \u2014 the patient this document is about appears here once a type is confirmed.</div></div></div>';
    }

    var patMeta = esc(pSpecies) + (strong ? ' \u00b7 ' + esc(strong.sex) + ' \u00b7 ' + esc(strong.age) : '');
    var patientCard = '<div class="id-card">' +
      '<span class="id-cic pat">' + (feline ? I.cat : I.paw) + '</span>' +
      '<div class="id-body"><div class="id-lbl">Patient</div>' +
        '<div class="id-name">' + esc(pName) + '</div>' +
        '<div class="id-meta">' + patMeta + '</div></div>' +
      (d.match ? '<a class="btn btn-light btn-sm id-open" href="../clients/Robin Dock - Clients.html">Open</a>' : '') +
    '</div>';

    var cliMeta = strong ? '<span class="mono">' + esc(strong.acct) + '</span> \u00b7 account on file' : 'Client / owner of record';
    var clientCard = '<div class="id-card">' +
      '<span class="id-cic cli">' + I.person + '</span>' +
      '<div class="id-body"><div class="id-lbl">Client / owner</div>' +
        '<div class="id-name">' + esc(pOwner || '\u2014') + '</div>' +
        '<div class="id-meta">' + cliMeta + '</div></div>' +
    '</div>';

    var note = d.match
      ? '<div class="pc-note ok">' + I.shield + '<div><b>' + esc(d.match.name) + '</b> is bound to a saved record \u2014 ' + esc(d.match.how) + '. Every value on the ' + typeLbl + ' track syncs to this patient.</div></div>'
      : '<div class="pc-note">' + I.info + '<div><b>This document isn\u2019t bound to a patient yet.</b> Confirm the suggested match, pick a different existing patient, or create a new record \u2014 binding is always your call.</div></div>';

    /* ---- decision UI (pending state only) — confirm / replace / create ---- */
    var decide = '';
    if (!d.match) {
      var eligible = (d.candidates || []).filter(function (c) { return c.eligible; });
      var primary = strong || eligible[0];
      if (ui.pcPicker) {
        var selC = eligible.filter(function (c) { return c.id === ui.selCand; })[0];
        var rows = eligible.map(function (c) {
          var sel = ui.selCand === c.id;
          var badge = c.grade === 'strong'
            ? '<span class="pmx-badge strong">Strong \u00b7 ' + c.keys.filter(function (k) { return k.hit; }).length + ' keys</span>'
            : '<span class="pmx-badge weak">Low \u00b7 1 key</span>';
          return '<button class="pmx-cand' + (sel ? ' sel' : '') + (c.feline ? ' feline' : '') + '" data-cand="' + c.id + '">' +
            '<span class="paw">' + (c.feline ? I.cat : I.paw) + '</span>' +
            '<div class="cmain"><div class="cnm">' + esc(c.name) + badge + '</div>' +
              '<div class="csig">' + esc(c.species) + ' \u00b7 ' + esc(c.breed) + ' \u00b7 ' + esc(c.sex) + ', ' + esc(c.age) + ' \u00b7 <b>' + esc(c.owner) + '</b> \u00b7 <span style="font-family:var(--f-mono);font-size:10.5px">' + esc(c.acct) + '</span></div></div>' +
            '<span class="cck">' + I.checkSm + '</span>' +
          '</button>';
        }).join('');
        decide = '<div class="pc-picker">' +
          '<div class="pc-pickhead"><span>Replace with an existing patient</span>' +
            '<button class="pc-pickcancel" data-pcpickcancel="1">Cancel</button></div>' +
          (eligible.length ? rows : '<div class="pc-note" style="margin-top:0">' + I.info + '<div>No matching records were found. Create a new patient instead.</div></div>') +
          (selC ? '<div class="pmx-confirm"><div class="ct">Bind this document to <b>' + esc(selC.name) + ' \u00b7 ' + esc(selC.owner) + '</b>? The confirmed match also strengthens the ' + esc(d.sender.name) + ' contact tie.</div>' +
            '<button class="btn btn-blue btn-sm" data-pcbind="1">Confirm match</button></div>' : '') +
        '</div>';
      } else {
        decide = '<div class="pc-decide">' +
          (primary
            ? '<button class="btn btn-blue btn-sm" data-pcconfirm="' + primary.id + '">' + I.checkSm + ' Confirm ' + esc(primary.name) + '</button>'
            : '') +
          '<button class="btn btn-light btn-sm" data-pcreplace="1">Replace with existing patient</button>' +
          '<button class="btn btn-light btn-sm" data-pccreate="1">Create new patient</button>' +
        '</div>';
      }
    }

    /* ---- extracted patient & client identity fields (moved here from the type tab) ---- */
    var idBlock = '';
    if (t0) {
      var idF = identityFields(t0);
      var idFilled = idF.filter(function (f) { return f.value; }).length;
      var idComplete = idF.every(settled);
      var idGrid = idF.map(function (f, i) { return formFieldHtml(t0, 0, f, i); }).join('');
      idBlock = '<div class="pc-subhead"><span class="pc-sublbl">Extracted patient &amp; client fields</span><span class="pc-subrule"></span>' +
        '<span class="pc-submeta"><span class="ff-seccount' + (idComplete ? ' done' : '') + '">' + idFilled + ' of ' + idF.length + ' filled</span></span></div>' +
        '<div class="ff-grid">' + idGrid + '</div>';
    }

    return '<div class="pc-sec">' + head + '<div class="id-grid">' + patientCard + clientCard + '</div>' + note + decide + idBlock + '</div>';
  }

  /* ---- SECTION · the referral workflow (match → acknowledge → schedule → push) ----
     Moved off the extraction tab: this is the actionable spine that drives the
     document to completion. Review of the extracted fields stays on the type tab. */
  function workflowSectionHtml(d) {
    var ti = (ui.openTrack >= 0 && ui.openTrack < d.tracks.length) ? ui.openTrack : 0;
    var t = d.tracks[ti];
    if (!t) return '';
    var st = trackStatus(t);
    var typeLbl = TYPES[t.type].label;
    var head = '<div class="pc-head"><span class="pc-ic wf">' + I.push + '</span>' +
      '<div class="pc-htext"><div class="pc-title">' + typeLbl + ' workflow</div>' +
        '<div class="pc-sub">Match the patient, then drive it to completion</div></div>' +
      '<span class="pc-hstatus"><span class="tk-status ' + st.cls + '"><span class="d"></span>' + st.label + '</span></span></div>';
    var body;
    if (t.complete) body = stepCardHtml(t, ti);
    else if (t.stepIdx === 0) body = '<div class="pc-note">' + I.info +
      '<div><b>Confirm the extracted fields first.</b> Review the ' + typeLbl.toLowerCase() +
      ' details above — that unlocks patient match and the rest of the workflow.</div></div>';
    else if (t.stepIdx === 1) body = matchStepHtml(t, ti);
    else body = stepCardHtml(t, ti);
    return '<div class="pc-sec">' + head +
      '<div class="tk-steps">' + stepperHtml(t) + '</div>' +
      '<div class="wf-body">' + body + '</div>' +
    '</div>';
  }

  /* ---- SECTION B · the source of the document (referring person / contact) ---- */
  function referringSectionHtml(d) {
    var t0 = d.tracks[0];
    var pStart = t0 ? partnerStartIdx(t0) : 0;
    var hasPartner = t0 && pStart < t0.fields.length;

    var statusPill = d.sender.verified
      ? '<span class="fd-conf high">' + I.shield + ' Saved contact</span>'
      : '<span class="fd-conf med"><span class="cd"></span>Unsaved number</span>';
    var head = '<div class="pc-head"><span class="pc-ic src">' + I.building + '</span>' +
      '<div class="pc-htext"><div class="pc-title">Referring source</div>' +
        '<div class="pc-sub">Where this document came from</div></div>' +
      '<span class="pc-hstatus">' + statusPill + '</span></div>';

    /* the contact identity card */
    var contactCard = '<div class="id-card wide">' +
      '<span class="id-cic src">' + I.building + '</span>' +
      '<div class="id-body"><div class="id-lbl">Contact</div>' +
        '<div class="id-name">' + esc(d.sender.name) + '</div>' +
        '<div class="id-meta">' + esc(d.sender.kind) + (d.sender.loc ? ' \u00b7 ' + esc(d.sender.loc) : '') + ' \u00b7 <span class="mono">' + esc(d.sender.fax) + '</span>' +
          (d.sender.contactSince ? ' \u00b7 exchanging since ' + esc(d.sender.contactSince) : '') + '</div></div>' +
      '<a class="btn btn-light btn-sm id-open" href="../contacts/Robin Dock - Contact Detail.html">Open contact</a>' +
    '</div>';

    /* editable referring-partner fields, as a form */
    var formBlock = '';
    if (hasPartner) {
      var pf = t0.fields.slice(pStart);
      var filled = pf.filter(function (f) { return f.value || (f.input === 'contact' && (f.contact || f.contactOther)); }).length;
      var complete = pf.every(settled);
      var grid = pf.map(function (f, i) { return formFieldHtml(t0, 0, f, pStart + i); }).join('');
      formBlock = '<div class="pc-subhead"><span class="pc-sublbl">Referring source fields</span><span class="pc-subrule"></span>' +
        '<span class="pc-submeta"><span class="ff-seccount' + (complete ? ' done' : '') + '">' + filled + ' of ' + pf.length + ' filled</span></span></div>' +
        '<div class="ff-grid">' + grid + '</div>';
    }

    /* connected-patient ties */
    var rows = d.ties.rows.map(function (r) {
      return '<tr' + (r.current ? ' class="this"' : '') + '>' +
        '<td><span class="pn"><span class="pi' + (r.feline ? ' feline' : '') + '">' + (r.feline ? I.cat : I.paw) + '</span>' + esc(r.name) +
          (r.current ? '<span class="tie-thispill">This doc</span>' : '') + '</span><div class="sig" style="margin-left:31px">' + esc(r.sig) + '</div></td>' +
        '<td class="num">' + r.docs + '</td>' +
        '<td class="last">' + esc(r.last) + '</td>' +
        '<td><span class="tie-strength ' + r.strength + '"><span class="d"></span>' + (r.strength === 'strong' ? 'Strong key' : 'New') + '</span></td>' +
        '<td style="text-align:right"><button class="untie" data-untie="' + esc(r.name) + '">Remove tie</button></td>' +
      '</tr>';
    }).join('');
    var tieBlock = '<div class="pc-subhead"><span class="pc-sublbl">Connected patients</span><span class="pc-subrule"></span>' +
      '<span class="pc-submeta"><span class="ff-seccount">' + d.ties.rows.length + ' tied</span></span></div>';
    tieBlock += d.ties.rows.length
      ? '<div class="tie-note">' + I.link + '<div><b>The contact\u2194patient tie is a match key.</b> Patients this contact has verifiably sent documents about count as a corroborating key toward the \u22652-key rule. Ties are built from confirmed matches only \u2014 a wrong tie must never quietly poison future matches.</div></div>' +
        '<div class="tie-table"><table><thead><tr><th>Patient</th><th style="text-align:right">Docs</th><th>Last doc</th><th>Tie strength</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      : '<div class="pc-note">' + I.info + '<div>No confirmed patient ties for this sender yet. Ties appear as matches are confirmed \u2014 the asset earns its way in.</div></div>';

    return '<div class="pc-sec">' + head + contactCard + formBlock + tieBlock + '</div>';
  }

  function patientTabHtml() {
    var d = D();
    /* Referring source moved to the Source section on the Document tab, and the
       type workflow spine moved onto the type tab — this tab now holds only the
       patient & client binding. */
    return patientSectionHtml(d);
  }

  /* ---- doc-type dropdown menu (first tab) ---- */
  function typeMenuHtml(d) {
    if (!ui.typeMenu) return '';
    var body;
    if (d.untyped || !d.tracks.length) {
      body = '<div class="tm-head">Classify this document</div>' +
        Object.keys(TYPES).map(function (k) {
          return '<button class="tm-item" data-settype="' + k + '">' +
            '<span class="tag ' + TYPES[k].cls + '"><span class="d"></span>' + TYPES[k].label + '</span>' +
            '<span class="tm-set">Set type</span></button>';
        }).join('');
    } else {
      body = '<div class="tm-head">Document types \u00b7 ' + d.tracks.length + '</div>' +
        d.tracks.map(function (t, ti) {
          var st = trackStatus(t);
          return '<button class="tm-item' + (ti === ui.openTrack ? ' on' : '') + '" data-selecttrack="' + ti + '" data-keeptab="1">' +
            '<span class="tag ' + TYPES[t.type].cls + '"><span class="d"></span>' + TYPES[t.type].label + '</span>' +
            '<span class="tk-status ' + st.cls + '"><span class="d"></span>' + st.label + '</span></button>';
        }).join('') +
        '<div class="tm-foot"><button class="tm-manage" data-tab="docmeta">Manage all types in Document' + I.chevD + '</button></div>';
    }
    return '<div class="dw-typemenu">' + body + '</div>';
  }

  /* ---- doc-type selector (now lives inside the Workflow tab) ---- */
  function typeSelectorHtml(d) {
    if (d.untyped || !d.tracks.length) return '';
    var selIdx = (ui.openTrack >= 0 && ui.openTrack < d.tracks.length) ? ui.openTrack : 0;
    var selTrack = d.tracks[selIdx];
    if (!selTrack) return '';
    return '<div class="dw-typebar">' +
      '<div class="dd-typewrap">' +
        '<button class="dd-typesel" data-typemenu title="Switch or manage document type">' +
          '<span class="dd-typesel-k">Working on</span>' +
          '<span class="tag ' + TYPES[selTrack.type].cls + '"><span class="d"></span>' + TYPES[selTrack.type].label + '</span>' +
          (d.tracks.length > 1 ? '<span class="dd-typesel-ct">' + (selIdx + 1) + ' / ' + d.tracks.length + '</span>' : '') +
          '<span class="dd-typesel-chev' + (ui.typeMenu ? ' open' : '') + '">' + I.chevD + '</span>' +
        '</button>' +
        typeMenuHtml(d) +
      '</div>' +
    '</div>';
  }

  /* ---- Change 1 · sibling-document navigator (only when batch > 1) ---- */
  function navStatusMeta(status) {
    if (status === 'done') return { cls: 'done', label: 'Ready to complete' };
    if (status === 'issue') return { cls: 'issue', label: 'Needs attention' };
    return { cls: 'review', label: 'In review' };
  }
  function batchNavHtml() {
    var b = batchFor(scen);
    if (!b) return '';
    var total = b.docs.length + b.splits.length;
    if (total < 2) return '';
    var chips = [];
    b.docs.forEach(function (doc) {
      var m = navStatusMeta(scenStatus(DATA.docs[doc.scen]));
      chips.push('<span class="bnav-doc">' +
        '<span class="bnav-head"><span class="bdot ' + m.cls + '"></span>' + esc(doc.label) + '</span>' +
        '<span class="bnav-stat ' + m.cls + '">' + m.label + '</span></span>');
    });
    b.splits.forEach(function (sp) {
      chips.push('<span class="bnav-doc">' +
        '<span class="bnav-head"><span class="bdot issue"></span>' + esc(sp.label) + '</span>' +
        '<span class="bnav-stat issue">Untyped \u00b7 new</span></span>');
    });
    var joined = chips.join('<span class="bnav-sep"></span>');
    return '<div class="bnav">' +
      '<span class="bnav-lead">This fax contains <b>' + total + ' documents</b></span>' +
      '<span class="bnav-items">' + joined + '</span></div>';
  }

  /* ---- Change 2 · Source card (quiet, already-resolved known-sender state) ---- */
  function sourceCardHtml(d) {
    var s = d.sender;
    /* the source is "linked" only when the sender's number is tied to a saved
       contact AND the coordinator hasn't chosen to record it as Other instead. */
    var linked = s.verified && !s.other;
    var isOther = !!s.other;                       /* recorded as an unlisted / Other source */
    var displayName = s.sourceName || s.name;

    /* ---- inline editor: add or edit the typed source (for unsaved numbers, or
       when overriding a contact link with a manually-recorded Other source) ---- */
    if (ui.srcEdit) {
      var hadName = s.sourceName || (s.verified ? '' : (s.name && s.name !== 'Unknown sender' ? s.name : ''));
      return '<div class="id-card wide src-card src-editing">' +
        '<span class="id-cic src">' + I.building + '</span>' +
        '<div class="id-body">' +
          '<div class="src-editlab">Source name</div>' +
          '<input id="srcInput" class="src-input" value="' + esc(hadName) + '" ' +
            'placeholder="Referring practice or sender name\u2026" autocomplete="off" />' +
          '<div class="src-editmeta"><span class="mono">' + esc(s.fax) + '</span> \u00b7 ' + esc(s.kind) + '</div>' +
          '<div class="src-editnote">' + I.info + ' Recorded as this document\u2019s source without a directory link' +
            (s.verified ? ' \u2014 the linked contact stays in the directory, untouched.' : '. You can still save it as a contact later.') + '</div>' +
          '<div class="src-editacts">' +
            '<button class="btn btn-blue btn-sm" data-srcsave="1">Save source</button>' +
            '<button class="btn btn-light btn-sm" data-srccancel="1">Cancel</button>' +
            (s.verified ? '<button class="btn btn-light btn-sm" data-srcrelink="1">Use linked contact</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    var statusLine, menuItems;
    if (linked) {
      /* number is tied to a saved contact — but still offer "Record as Other" */
      statusLine = '<span class="src-pill high">' + I.shield + 'Saved contact</span>' +
        (s.contactSince ? '<span class="src-since">exchanging since ' + esc(s.contactSince) + '</span>' : '');
      menuItems =
        '<a class="mi" href="../contacts/Robin Dock - Contact Detail.html">' + I.building +
          '<div><div class="mt">Open contact</div><div class="md">View the saved directory record.</div></div></a>' +
        '<div class="mi" data-srcother="1">' + I.swap +
          '<div><div class="mt">Record as Other</div><div class="md">Keep as a typed source instead of the linked contact.</div></div></div>';
    } else if (isOther) {
      /* recorded as an unlisted source (not linked to a directory contact) */
      statusLine = '<span class="src-pill med"><span class="cd"></span>Other \u2014 not linked to a contact</span>';
      menuItems =
        '<div class="mi" data-srcedit="1">' + I.pencil +
          '<div><div class="mt">Edit source</div><div class="md">Change the typed source name.</div></div></div>' +
        (s.verified
          ? '<div class="mi" data-srcrelink="1">' + I.building +
              '<div><div class="mt">Use linked contact</div><div class="md">Restore the saved directory contact.</div></div></div>'
          : '<div class="mi" data-srcsavecontact="1">' + I.plus +
              '<div><div class="mt">Save as contact</div><div class="md">Add this sender to the directory.</div></div></div>');
    } else {
      /* unsaved number — sender isn't a saved contact yet */
      statusLine = '<span class="src-pill med"><span class="cd"></span>Unsaved number \u2014 not yet a contact</span>';
      menuItems =
        '<div class="mi" data-srcsavecontact="1">' + I.plus +
          '<div><div class="mt">Save as contact</div><div class="md">Add this sender to the directory.</div></div></div>' +
        '<div class="mi" data-srcedit="1">' + I.pencil +
          '<div><div class="mt">' + (s.sourceName ? 'Edit source' : 'Add source') + '</div>' +
          '<div class="md">Record a typed source without a directory link.</div></div></div>';
    }
    var action = '<div class="dd-more src-more">' +
      '<button class="dd-morebtn" data-srcmenu aria-label="Source actions">' + I.more + '</button>' +
      '<div class="dd-menu" id="srcMenu">' + menuItems + '</div>' +
    '</div>';

    var nameLine = esc(displayName) + (isOther ? '<span class="cf-unl">Unlisted</span>' : '');
    return '<div class="id-card wide src-card' + (linked ? '' : ' unresolved') + '">' +
      '<span class="id-cic src">' + I.building + '</span>' +
      '<div class="id-body">' +
        '<div class="id-name">' + nameLine + '</div>' +
        '<div class="id-meta">' + esc(s.kind) + (s.loc ? ' \u00b7 ' + esc(s.loc) : '') +
          ' \u00b7 <span class="mono">' + esc(s.fax) + '</span></div>' +
        '<div class="src-status">' + statusLine + '</div>' +
      '</div>' + action +
    '</div>';
  }

  /* ---- Change 3 · Pages & structure (page selection + split operation) ---- */
  function pageRangeLabel(arr) {
    if (!arr.length) return '';
    var s = arr.slice().sort(function (a, b) { return a - b; }).map(function (i) { return i + 1; });
    var contiguous = s.every(function (v, i) { return i === 0 || v === s[i - 1] + 1; });
    return (contiguous && s.length > 1) ? s[0] + '\u2013' + s[s.length - 1] : s.join(', ');
  }
  function pagesStructureHtml(d) {
    var pages = DOCR.pages(d.scenario);
    var n = pages.length;
    var sel = ui.pageSel || [];
    var goneCount = (d.splitPages || []).length;
    var thumbs = pages.map(function (p, i) {
      var gone = (d.splitPages || []).indexOf(i) >= 0;
      var on = sel.indexOf(i) >= 0;
      if (gone) return '<div class="ps-thumb gone" title="Moved to ' + esc(d.splitOut.newId) + '"><span class="ps-pn">' + (i + 1) + '</span><span class="ps-gonetag">\u2192 ' + esc(d.splitOut.newId) + '</span></div>';
      return '<button class="ps-thumb' + (on ? ' on' : '') + '" data-pspage="' + i + '">' +
        '<span class="ps-pn">' + (i + 1) + '</span>' +
        (on ? '<span class="ps-chk">' + I.checkSm + '</span>' : '') + '</button>';
    }).join('');
    var remaining = n - goneCount;
    var countLine = '<div class="ps-count">' + remaining + ' page' + (remaining > 1 ? 's' : '') +
      (goneCount ? ' <span class="ps-countsub">\u00b7 ' + goneCount + ' moved to ' + esc(d.splitOut.newId) + '</span>'
        : ' <span class="ps-countsub">\u00b7 select pages to split into a separate document</span>') + '</div>';

    var op = '';
    var confirm = '';
    if (sel.length) {
      var r = pageRangeLabel(sel);
      confirm = '<div class="ps-confirm">' +
        '<div class="ps-cf-h">' + I.scissors + '<b>Split page' + (sel.length > 1 ? 's ' : ' ') + r + ' into a new document?</b></div>' +
        '<p class="ps-cf-b">The new document joins this batch with <b>no type</b> and <b>no patient</b> \u2014 classify and bind it separately. Recorded in history; undo only by re-merging.</p>' +
        '<div class="ps-cf-acts"><button class="btn btn-light btn-sm" data-splitcancel="1">Cancel</button>' +
        '<button class="btn btn-primary btn-sm" data-splitconfirm="1">' + I.scissors + 'Split into new document</button></div></div>';
    }
    var prov = '';
    if (d.splitOut) {
      prov = '<div class="ps-prov">' + I.link + '<div><span class="ps-provrow">Pages ' + esc(d.splitOut.pages) + ' \u2192 <b>' + esc(d.splitOut.newId) + '</b></span>' +
        '<span class="ps-provsub">Provenance link \u00b7 both documents record the split in History; undo only by re-merging.</span></div></div>';
    }
    return countLine + '<div class="ps-thumbs">' + thumbs + '</div>' + confirm + prov;
  }

  function docTabHtml() {
    var d = D();
    function kv(k, v) { return '<tr><td class="k">' + k + '</td><td class="v">' + v + '</td></tr>'; }

    /* --- doc-type classification: applied tracks + suggested types + add --- */
    var trackRows = d.tracks.map(function (t, ti) {
      var st = trackStatus(t);
      var step = t.complete ? 'All ' + t.steps.length + ' steps done'
        : 'Step ' + (t.stepIdx + 1) + ' of ' + t.steps.length + ' \u00b7 ' + esc(t.steps[t.stepIdx]);
      return '<div class="dt-row">' +
        '<div class="dt-info"><span class="tag ' + TYPES[t.type].cls + '"><span class="d"></span>' + TYPES[t.type].label + '</span>' +
          '<span class="dt-sub">' + esc(t.origin) + (t.pagesSpan ? ' \u00b7 pages ' + esc(t.pagesSpan) : '') + '</span></div>' +
        '<div class="dt-meta"><span class="dt-step">' + step + '</span>' +
          '<span class="tk-status ' + st.cls + '"><span class="d"></span>' + st.label + '</span>' +
          '<button class="dt-open" data-selecttrack="' + ti + '">Open' + I.chevD + '</button></div>' +
      '</div>';
    }).join('');
    var sugRows = d.suggestions.map(function (s, si) {
      return '<div class="dt-row dt-sug">' +
        '<div class="dt-info"><span class="tag ' + TYPES[s.type].cls + ' sugtag">' + I.spark + TYPES[s.type].label + '</span>' +
          '<span class="dt-sub">' + s.why + '</span></div>' +
        '<div class="dt-meta"><span class="sg-band ' + s.band + '"><span class="bd"></span>' + s.band + ' confidence</span>' +
          '<span class="tk-status review"><span class="d"></span>Needs confirmation</span>' +
          '<div class="dt-sugacts"><button class="sg-promote" data-promote="' + si + '">Confirm type</button>' +
          '<button class="sg-dismiss" data-dismiss="' + si + '">Dismiss</button></div></div>' +
      '</div>';
    }).join('');
    var applied = {};
    d.tracks.forEach(function (t) { applied[t.type] = 1; });
    d.suggestions.forEach(function (s) { applied[s.type] = 1; });
    var addKeys = Object.keys(TYPES).filter(function (k) { return !applied[k]; });
    var addRow = addKeys.length
      ? '<div class="dt-add"><span class="dt-addlbl">Add a type manually</span>' +
        addKeys.map(function (k) { return '<button class="dt-addbtn" data-settype="' + k + '">' + I.plus + TYPES[k].label + '</button>'; }).join('') +
      '</div>' : '';
    var typesEmpty = !d.tracks.length && !d.suggestions.length
      ? '<div class="fd-stagenote">' + I.info + '<div>No type confirmed yet \u2014 nothing classified above threshold. Add a type below to start a track.</div></div>' : '';
    var typesSection = typeManagerHtml(d, 'assigned');
    var suggestedSection = d.suggestions.length
      ? '<div style="margin-top:26px"></div>' +
        typeManagerHtml(d, 'suggested')
      : '';

    var payloads = d.tracks.length
      ? d.tracks.map(function (t) {
          var st = trackStatus(t);
          var desc = t.complete ? 'Pushed \u00b7 payload emitted with per-field provenance (value \u00b7 confidence \u00b7 source region \u00b7 confirmation state).'
            : st.cls === 'eligible' ? 'Eligible \u2014 completion reached; awaiting a human push (single or bulk).'
            : 'Not yet eligible \u2014 the payload becomes available when this track completes.';
          return '<div class="pay-track"><div class="pt"><div class="pl"><span class="tag ' + TYPES[t.type].cls + '"><span class="d"></span>' + TYPES[t.type].label + '</span>One payload per track</div>' +
            '<div class="ps">' + desc + '</div></div>' +
            '<span class="tk-status ' + st.cls + '"><span class="d"></span>' + st.label + '</span></div>';
        }).join('')
      : '<div class="fd-stagenote">' + I.info + '<div>No confirmed tracks \u2014 no payloads. A payload is emitted per doc-type track when that track completes.</div></div>';
    var nav = '';
    var sourceSection = '<div class="dw-seclbl" style="margin-top:26px">Source<span class="rule"></span></div>' +
      sourceCardHtml(d);
    /* Pages & structure moved out of the inline flow — now a top action that
       opens a focused modal for page selection + split. */
    var goneCount = (d.splitPages || []).length;
    var pagesBtn = '<button class="ps-openbtn" data-pagesmodal="1">' +
      '<span class="ps-openic">' + I.scissors + '</span>' +
      '<span class="ps-opentext"><span class="ps-opent">Pages &amp; structure</span>' +
        '<span class="ps-opensub">' + d.pages + ' page' + (d.pages > 1 ? 's' : '') +
          (goneCount ? ' \u00b7 ' + goneCount + ' moved to ' + esc(d.splitOut.newId) : ' \u00b7 split pages into a separate document') +
        '</span></span>' +
      '<span class="ps-openchev">' + I.chevD + '</span>' +
    '</button>';
    var pagesModal = '';
    if (ui.pagesModal) {
      pagesModal = '<div class="ps-modal-back">' +
        '<div class="ps-modal" role="dialog" aria-modal="true">' +
          '<div class="ps-modal-head">' +
            '<div class="ps-modal-htext"><div class="ps-modal-title">Pages &amp; structure</div>' +
              '<div class="ps-modal-sub">Select pages to split into a separate document in this batch</div></div>' +
            '<button class="ps-modal-x" data-pagesclose="1" aria-label="Close">' + I.x + '</button>' +
          '</div>' +
          '<div class="ps-modal-body">' + pagesStructureHtml(d) + '</div>' +
        '</div></div>';
    }
    return (nav ? nav + '<div style="margin-top:24px"></div>' : '') +
      typesSection +
      suggestedSection +
      sourceSection +
      '<div style="margin-top:26px"></div>' +
      pagesBtn +
      '<div class="dw-seclbl">Document details<span class="rule"></span></div>' +
      '<div class="meta-table"><table>' +
        kv('Document ID', '<span class="mono">' + d.id + '</span>') +
        kv('Received', d.received + ' \u00b7 ' + d.channel) +
        kv('Sender', esc(d.sender.name) + ' \u00b7 <span class="mono">' + esc(d.sender.fax) + '</span>') +
        kv('Pages / size', d.pages + ' page' + (d.pages > 1 ? 's' : '') + ' \u00b7 ' + d.sizeKb + ' KB') +
        kv('Legibility pre-screen', d.extraction.prescreen === 'passed' ? 'Passed' : 'Partial \u2014 illegible pages skipped') +
        kv('Extraction run', '<span class="mono">' + d.extraction.model + '</span> \u00b7 ' + d.extraction.ts + ' \u00b7 runs once at arrival') +
        kv('Calibration snapshot', '<span class="mono">' + d.extraction.calibration + '</span> \u00b7 confidence maps to measured per-practice accuracy') +
      '</table></div>' +
      '<div class="dw-seclbl">PIMS payloads<span class="rule"></span><span class="c">Zone D contract</span></div>' +
      payloads +
      '<div class="pay-note">' + I.info + '<div><b>The AI never pushes.</b> Completion makes a track eligible; a human push \u2014 single from this page or bulk from the Ready-to-push view \u2014 executes the write. Anything pushable has been human-reviewed by construction.</div></div>' +
      pagesModal;
  }

  function historyTabHtml() {
    var d = D();
    return '<div class="hx-note">' + I.shield + '<div>Append-only audit log. Extraction is logged as one System event; every correction adds its own entry (old \u2192 new). Nothing here is ever rewritten.</div></div>' +
      '<div class="hx">' + d.history.slice().reverse().map(function (e) {
        return '<div class="hx-ev ' + e.kind + '">' +
          '<div class="hx-top"><span class="hx-who">' + (e.kind === 'sys' ? '<span class="sysic">' + I.shield + '</span>' : '') + esc(e.who) + '</span><span class="hx-ts">' + esc(e.ts) + '</span></div>' +
          '<div class="hx-what">' + e.what + '</div>' +
        '</div>';
      }).join('') + '</div>';
  }

  /* ============================================================
     RENDER — root
     ============================================================ */
  function render() {
    var d = D();
    var prevBody = content.querySelector('.dw-body');
    var keepScroll = prevBody ? prevBody.scrollTop : 0;
    var keepPage = content.scrollTop;
    var selTrack = (ui.openTrack >= 0 && ui.openTrack < d.tracks.length) ? d.tracks[ui.openTrack] : d.tracks[0];
    var extractLabel = d.untyped ? 'Untyped' : (selTrack ? TYPES[selTrack.type].label : 'Extraction');
    var workBadge = workPending(d) || null;
    var isWork = ui.tab === 'work';
    var firstTab = '<button class="dw-tab' + (isWork ? ' on' : '') + '" data-tab="work" title="' + extractLabel + ' details">' +
      'Workflow' +
      (workBadge ? '<span class="n">' + workBadge + '</span>' : '') +
    '</button>';
    /* tab order reflects document-scope hierarchy, left \u2192 right:
       Document (root: type settles the field sets) \u2192 Patient & contact
       (doc-level bindings, shared across tracks) \u2192 type details (the leaves,
       e.g. Referral \u2014 the dropdown/type-switcher tab) \u2192 History. Tabs stay
       freely navigable; nothing is gated. Only the entry point (defaultTab) moves. */
    function plainTab(k, label, n) {
      return '<button class="dw-tab' + (ui.tab === k ? ' on' : '') + '" data-tab="' + k + '">' + label +
        (n ? '<span class="n">' + n + '</span>' : '') + '</button>';
    }
    var tabHtml =
      plainTab('docmeta', 'Document', d.suggestions.length || null) +
      plainTab('patient', 'Patient & contact', patientPending(d) || null) +
      firstTab +
      plainTab('history', 'History', null);
    /* AI-extracted marker rides the tab row (Valerie shape), shown on extraction tabs */
    var aiMark = (ui.tab === 'work' || ui.tab === 'patient')
      ? '<span class="dd-tabai">' + I.spark + ' AI Extracted</span>' : '';
    var body = ui.tab === 'work' ? workTabHtml()
      : ui.tab === 'patient' ? patientTabHtml()
      : ui.tab === 'docmeta' ? docTabHtml()
      : historyTabHtml();
    content.innerHTML = '<div class="dd" data-screen-label="Document detail \u00b7 ' + d.id + '">' +
      headerHtml() +
      '<div class="dd-body">' +
        '<div class="dd-doc">' + docPaneHtml() + '</div>' +
        '<div class="dd-work">' +
          '<div class="dd-tabbar">' + tabHtml + aiMark + '</div>' +
          '<div class="dw-card">' +
            '<div class="dw-body">' + body + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    var nb = content.querySelector('.dw-body');
    if (nb) nb.scrollTop = keepScroll;
    content.scrollTop = keepPage;
    if (ui.lit) lightRegion(ui.lit, false);
    var inp = document.getElementById('fdInput');
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    var cinp = document.getElementById('cfInput');
    if (cinp) { cinp.focus(); cinp.setSelectionRange(cinp.value.length, cinp.value.length); }
    var sinp = document.getElementById('srcInput');
    if (sinp) { sinp.focus(); sinp.setSelectionRange(sinp.value.length, sinp.value.length); }
    if (ui.focusFld) {
      var ff = content.querySelector('[data-fedit="' + ui.focusFld + '"]');
      if (ff) { ff.focus(); try { if (ff.setSelectionRange && ff.value) ff.setSelectionRange(ff.value.length, ff.value.length); } catch (e) {} }
      ui.focusFld = null;
    }
  }

  /* set which field is selected (page + source region) WITHOUT re-rendering */
  function applyFieldSelection(ti, fi) {
    var d = D(), t = d.tracks[ti];
    if (!t) return;
    var f = t.fields[fi];
    if (!f) return;
    ui.selField = ti + ':' + fi;
    if (f.region && DOCR.regionPage(d.scenario, f.region) >= 0) {
      ui.page = DOCR.regionPage(d.scenario, f.region);
      ui.lit = f.region;
    } else {
      ui.lit = null;
    }
  }
  /* select a field card → jump to its page and light up its value */
  function selectField(ti, fi, flash) {
    applyFieldSelection(ti, fi);
    render();
    if (ui.lit) lightRegion(ui.lit, true, flash);
  }
  /* Category-aware next field: completing a field opens the next item WITHIN the
     same category (core fields 0–3, then type-specific fields 4+). Only once every
     item in the current category is confirmed do we jump to the next category.
     Returns the field index to open, or -1 if the track is fully confirmed. */
  var CORE_COUNT = 4;
  function findNextUnconfirmed(ti, afterFi) {
    var t = D().tracks[ti];
    if (!t) return -1;
    var n = t.fields.length;
    var start = afterFi < CORE_COUNT ? 0 : CORE_COUNT;
    var end = afterFi < CORE_COUNT ? Math.min(CORE_COUNT, n) : n;
    var i;
    /* same category: prefer the item after the one just completed, then earlier gaps */
    for (i = afterFi + 1; i < end; i++) if (!t.fields[i].confirmed) return i;
    for (i = start; i < afterFi; i++) if (!t.fields[i].confirmed) return i;
    /* category fully done — fall through to the first unconfirmed item anywhere */
    for (i = 0; i < n; i++) if (!t.fields[i].confirmed) return i;
    return -1;
  }

  /* ---------------- FLIP: smooth reflow when cards reorder on confirm ---------------- */
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function captureRects() {
    var m = {};
    content.querySelectorAll('.fd[data-fld]').forEach(function (el) {
      m[el.dataset.fld] = el.getBoundingClientRect();
    });
    return m;
  }
  function flip(prev) {
    if (REDUCE) return;
    content.querySelectorAll('.fd[data-fld]').forEach(function (el) {
      var o = prev[el.dataset.fld];
      if (!o) return;
      var n = el.getBoundingClientRect();
      var dx = o.left - n.left, dy = o.top - n.top;
      if (!dx && !dy) return;
      el.style.transition = 'none';
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      requestAnimationFrame(function () {
        el.style.transition = 'transform .36s cubic-bezier(.22,.61,.36,1)';
        el.style.transform = '';
      });
      el.addEventListener('transitionend', function h() {
        el.style.transition = ''; el.removeEventListener('transitionend', h);
      });
    });
  }
  /* confirm a field, then animate: the confirmed card gets a success pulse and
     everything reflows via FLIP into the next-item selection. */
  function confirmField(ti, fi) {
    var t = D().tracks[ti];
    if (!t || !t.fields[fi]) return;
    var prev = captureRects();
    t.fields[fi].confirmed = true;
    var next = findNextUnconfirmed(ti, fi);
    if (next >= 0) applyFieldSelection(ti, next);
    else { ui.selField = null; ui.lit = null; }
    render();
    var card = content.querySelector('.fd[data-fld="' + ti + ':' + fi + '"]');
    if (card && !REDUCE) {
      card.classList.remove('fd-pop'); void card.offsetWidth; card.classList.add('fd-pop');
    }
    flip(prev);
    if (ui.lit) lightRegion(ui.lit, true, true);
  }
  /* auto-select the first field of the open track when a review surface first appears */
  function autoFirst() {
    ui.selField = null; ui.lit = null;
    var d = D();
    if (d.untyped) return;
    var t = d.tracks[ui.openTrack];
    if (t && !t.complete && t.stepIdx === 0 && t.fields.length) {
      var f = t.fields[0];
      ui.selField = ui.openTrack + ':0';
      if (f.region && DOCR.regionPage(d.scenario, f.region) >= 0) {
        ui.page = DOCR.regionPage(d.scenario, f.region);
        ui.lit = f.region;
      }
    }
  }

  /* light up a source region in the evidence pane */
  function centerIn(container, el) {
    if (!container) return;
    /* only nudge containers that can actually scroll */
    if (container.scrollHeight - container.clientHeight < 4) return;
    var cr = container.getBoundingClientRect(), er = el.getBoundingClientRect();
    var delta = (er.top - cr.top) - container.clientHeight / 2 + er.height / 2;
    container.scrollTop += delta;
  }
  function lightRegion(region, scroll, flash) {
    var mark = content.querySelector('.dd-src[data-region="' + region + '"]');
    if (!mark) return;
    mark.classList.add('lit');
    if (flash) {
      /* re-trigger the attention pulse even if the class was already present */
      mark.classList.remove('flash');
      void mark.offsetWidth;
      mark.classList.add('flash');
    }
    if (scroll !== false) {
      /* bring the value into view in whichever container is scrollable:
         the inner stage (stacked layout) and/or the page column (side-by-side). */
      centerIn(document.getElementById('vstage'), mark);
      centerIn(document.getElementById('appContent'), mark);
    }
  }

  /* ---------------- toasts ---------------- */
  var toastWrap = document.getElementById('logToasts');
  function toast(title, sub, kind) {
    var el = document.createElement('div');
    el.className = 'logtoast' + (kind === 'bad' ? ' bad' : '');
    el.innerHTML = '<span class="lic">' + (kind === 'bad' ? I.alert : I.check) + '</span><div><div class="lt">' + esc(title) + '</div>' + (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>';
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 320); }, 2800);
  }

  /* ============================================================
     ACTIONS
     ============================================================ */
  function advance(t, ti) {
    t.stepIdx += 1;
    ui.selCand = null;
    render();
  }

  function doPush(t, ti) {
    var d = D();
    t.syncing = true;
    logEv('Kai Sandoval', 'human', 'Pushed <b>' + TYPES[t.type].label + '</b> track to PIMS \u2014 manual push of an eligible payload.');
    render();
    setTimeout(function () {
      t.syncing = false; t.complete = true; t.pushed = true;
      t.stepIdx = t.steps.length - 1;
      logEv('System', 'push', 'PIMS write-back confirmed for the <b>' + TYPES[t.type].label + '</b> track. Payload logged with per-field provenance. <span class="hx-chip">AVImark</span>');
      toast('Synced to PIMS', TYPES[t.type].label + ' track complete \u00b7 payload logged');
      /* reconciliation loop fires at FULL doc completion */
      if (d.tracks.every(function (x) { return x.complete; }) && !d.suggestions.length) {
        logEv('System', 'sys', 'Document fully complete \u2014 reconciliation: AI-proposed types vs confirmed types logged as a calibration signal.');
      }
      render();
    }, 1500);
  }

  content.addEventListener('click', function (e) {
    var d = D();
    var el;

    /* scenario switch */
    if ((el = e.target.closest('[data-scen]'))) { scen = el.dataset.scen; ui = { tab: defaultTab(D()), page: 0, zoom: 100, openTrack: 0, editing: null, selCand: null, lit: null, selField: null, openSec: {}, focusFld: null, typeMenu: false, pageSel: [], splitConfirm: false }; autoFirst(); render(); return; }
    /* doc-type dropdown (first tab) */
    if ((el = e.target.closest('[data-typemenu]'))) {
      ui.typeMenu = !ui.typeMenu;
      ui.editing = null; render(); return;
    }
    /* pick a doc-type track from the dropdown or the Document list */
    if ((el = e.target.closest('[data-selecttrack]'))) {
      ui.openTrack = +el.dataset.selecttrack; ui.typeMenu = false; ui.editing = null;
      /* switching type keeps you on the current tab unless the control asks to jump */
      if (!el.dataset.keeptab) ui.tab = 'work';
      ui.removeType = null; ui.addType = false;
      render(); return;
    }
    /* tabs */
    if ((el = e.target.closest('[data-tab]'))) { ui.tab = el.dataset.tab; ui.editing = null; ui.typeMenu = false; render(); return; }
    /* thumbnails */
    if ((el = e.target.closest('[data-page]'))) { ui.page = +el.dataset.page; ui.lit = null; render(); return; }

    /* Pages & structure — modal open/close */
    if ((el = e.target.closest('[data-pagesmodal]'))) { ui.pagesModal = true; ui.splitConfirm = false; render(); return; }
    if ((el = e.target.closest('[data-pagesclose]'))) { ui.pagesModal = false; ui.splitConfirm = false; render(); return; }
    if (e.target.classList && e.target.classList.contains('ps-modal-back')) { ui.pagesModal = false; ui.splitConfirm = false; render(); return; }

    /* Pages & structure — page selection + split operation */
    if ((el = e.target.closest('[data-pspage]'))) {
      var pspi = +el.dataset.pspage;
      if (d.splitPages && d.splitPages.indexOf(pspi) >= 0) return;
      ui.pageSel = ui.pageSel || [];
      var pix = ui.pageSel.indexOf(pspi);
      if (pix >= 0) ui.pageSel.splice(pix, 1); else ui.pageSel.push(pspi);
      ui.pageSel.sort(function (a, b) { return a - b; });
      ui.splitConfirm = false;
      render(); return;
    }
    if ((el = e.target.closest('[data-splitcancel]'))) { ui.pageSel = []; ui.splitConfirm = false; render(); return; }
    if ((el = e.target.closest('[data-splitconfirm]'))) {
      var rng = pageRangeLabel(ui.pageSel);
      var newId = 'RD-8342';
      var b = batchFor(scen);
      if (b && !b.splits.some(function (s) { return s.id === newId; })) b.splits.push({ id: newId, label: 'Untyped', from: d.id, pages: rng });
      d.splitOut = { newId: newId, pages: rng };
      d.splitPages = ui.pageSel.slice();
      logEv('Kai Sandoval', 'human', 'Split <b>pages ' + rng + '</b> into a new document <b>' + newId + '</b> — untyped and unbound in this batch. <span class="hx-chip">provenance: ' + d.id + ' → ' + newId + '</span>');
      logEv('System', 'sys', 'Created <b>' + newId + '</b> from <b>' + d.id + '</b> (pages ' + rng + '). Added to the batch as a sibling — no type, no patient. Undo only by re-merging.');
      ui.splitConfirm = false; ui.pageSel = [];
      toast('Document split', 'Pages ' + rng + ' → ' + newId + ' · added to this batch');
      render(); return;
    }
    if ((el = e.target.closest('[data-sibsplit]'))) {
      toast(el.dataset.sibsplit + ' — untyped sibling', 'Classify and bind it on its own review screen'); return;
    }
    /* zoom */
    if ((el = e.target.closest('[data-zoom]'))) {
      ui.zoom = Math.max(60, Math.min(160, ui.zoom + 20 * (+el.dataset.zoom))); render(); return;
    }
    /* header menu */
    if ((el = e.target.closest('[data-act]'))) {
      var act = el.dataset.act;
      var menu = document.getElementById('moreMenu');
      if (act === 'more') { menu.classList.toggle('open'); return; }
      if (menu) menu.classList.remove('open');
      if (act === 'download') { toast('Downloading source PDF', d.id + ' \u00b7 ' + d.pages + ' pages \u00b7 access logged'); return; }
      if (act === 'reextract') {
        logEv('Kai Sandoval', 'human', 'Requested re-extraction \u2014 explicit human trigger (extraction otherwise runs once at arrival).');
        toast('Re-extraction queued', 'Runs on the current scan \u00b7 results land as suggestions'); render(); return;
      }
      if (act === 'reassign') { toast('Reassign', 'Pick a teammate to hand this document to'); return; }
      if (act === 'claim') { d.assignee = { name: 'Kai Sandoval', initials: 'KS', av: 'blue' }; logEv('Kai Sandoval', 'human', 'Assigned the document to themselves.'); render(); return; }
      if (act === 'trash') { toast('Moved to trash', 'Undo from the inbox', 'bad'); return; }
      if (act === 'spam') { toast('Marked as spam', 'You confirmed \u2014 spam is never auto-applied', 'bad'); return; }
    }

    /* track open/close */
    if ((el = e.target.closest('[data-track]')) && !e.target.closest('[data-tstep]')) {
      var i = +el.dataset.track;
      ui.openTrack = ui.openTrack === i ? -1 : i; ui.editing = null; render(); return;
    }

    /* collapse/expand a completed field section */
    if ((el = e.target.closest('[data-sectoggle]'))) {
      var sk = el.dataset.sectoggle;
      ui.openSec[sk] = !ui.openSec[sk];
      render(); return;
    }

    /* field: edit / save / cancel / confirm */
    if ((el = e.target.closest('[data-edit]'))) { ui.editing = el.dataset.edit; render(); return; }
    if ((el = e.target.closest('[data-cancel]'))) { ui.editing = null; render(); return; }
    if ((el = e.target.closest('[data-save]'))) {
      var p = el.dataset.save.split(':'), t = d.tracks[+p[0]], f = t.fields[+p[1]];
      var val = (document.getElementById('fdInput') || {}).value || '';
      var saved = false;
      if (val && val !== f.value) {
        if (f.value) {
          logEv('Kai Sandoval', 'human', 'Corrected <b>' + esc(f.label) + '</b>: <span class="old">' + esc(f.value) + '</span> \u2192 <span class="new">' + esc(val) + '</span>');
          f.corrFrom = f.value; f.edited = true;
        } else {
          logEv('Kai Sandoval', 'human', 'Filled <b>' + esc(f.label) + '</b> (left empty by extraction): <span class="new">' + esc(val) + '</span>');
          f.conf = 'human';
        }
        f.value = val; f.confirmed = true; saved = true;
      }
      ui.editing = null;
      if (saved) { confirmField(+p[0], +p[1]); }
      else { render(); }
      return;
    }
    if ((el = e.target.closest('[data-ok]'))) {
      var q = el.dataset.ok.split(':');
      confirmField(+q[0], +q[1]);
      return;
    }
    /* field: clear (red X) → empties the value and logs it */
    if ((el = e.target.closest('[data-clear]'))) {
      var cp = el.dataset.clear.split(':');
      var tc = d.tracks[+cp[0]], fc = tc && tc.fields[+cp[1]];
      if (fc && fc.value) {
        logEv('Kai Sandoval', 'human', 'Cleared <b>' + esc(fc.label) + '</b>: <span class="old">' + esc(fc.value) + '</span> \u2192 left empty.');
        fc.value = ''; fc.confirmed = false; fc.edited = false; fc.corrFrom = null;
        applyFieldSelection(+cp[0], +cp[1]);
        render();
      }
      return;
    }
    /* contact-link field (Referring practice) */
    if ((el = e.target.closest('[data-clink]'))) {
      var lp = el.dataset.clink.split(':');
      var lt = d.tracks[+lp[0]], lf = lt && lt.fields[+lp[1]];
      var lc = lf && (lf.contactOptions || []).filter(function (c) { return c.id === lp[2]; })[0];
      if (lf && lc) {
        var prevL = captureRects();
        var was = lf.contact && lf.contact.id;
        lf.contact = lc; lf.contactOther = false; lf.confirmed = true;
        ui.cpick = null;
        if (was && was !== lc.id)
          logEv('Kai Sandoval', 'human', 'Re-linked <b>Referring practice</b> to saved contact <b>' + esc(lc.name) + '</b>.');
        else
          logEv('Kai Sandoval', 'human', 'Linked <b>Referring practice</b> to saved contact <b>' + esc(lc.name) + '</b> \u2014 contact\u2194document tie recorded.');
        toast('Practice linked', lc.name + ' \u00b7 saved contact');
        render(); flip(prevL);
      }
      return;
    }
    if ((el = e.target.closest('[data-cchange]'))) {
      ui.cpick = ui.cpick === el.dataset.cchange ? null : el.dataset.cchange;
      ui.cedit = null;
      render(); return;
    }
    if ((el = e.target.closest('[data-cclose]'))) { ui.cpick = null; render(); return; }
    /* open the inline source editor (add / edit a typed source, no directory link) */
    if ((el = e.target.closest('[data-cedit]'))) { ui.cedit = el.dataset.cedit; ui.cpick = null; render(); return; }
    if ((el = e.target.closest('[data-cothercancel]'))) { ui.cedit = null; render(); return; }
    if ((el = e.target.closest('[data-cothersave]'))) {
      var op = el.dataset.cothersave.split(':');
      var ot = d.tracks[+op[0]], of = ot && ot.fields[+op[1]];
      if (of) {
        var val = ((document.getElementById('cfInput') || {}).value || '').trim();
        if (!val) { toast('Add a source', 'Enter a name to record this source.', 'bad'); return; }
        var prevO = captureRects();
        var changed = val !== of.value;
        if (changed && of.value) { of.corrFrom = of.value; of.edited = true; }
        of.value = val; of.contact = null; of.contactOther = true; of.confirmed = true; of.conf = 'human';
        ui.cedit = null; ui.cpick = null;
        logEv('Kai Sandoval', 'human', 'Recorded <b>Referring practice</b> as an unlisted source \u2014 <span class="new">' + esc(val) + '</span> \u00b7 no directory link.');
        toast('Source recorded', val + ' \u00b7 not linked');
        render(); flip(prevO);
      }
      return;
    }
    if ((el = e.target.closest('[data-cnew]'))) {
      toast('Create new contact', 'Never auto-created \u2014 opens a pre-filled contact form');
      return;
    }

    /* ---- source card: add / edit a typed source, override a contact with Other, or re-link ---- */
    if ((el = e.target.closest('[data-srcmenu]'))) {
      var sMenu = document.getElementById('srcMenu');
      if (sMenu) sMenu.classList.toggle('open');
      return;
    }
    if ((el = e.target.closest('[data-srcedit]'))) { ui.srcEdit = true; render(); return; }
    if ((el = e.target.closest('[data-srccancel]'))) { ui.srcEdit = false; render(); return; }
    if ((el = e.target.closest('[data-srcsave]'))) {
      var sv = ((document.getElementById('srcInput') || {}).value || '').trim();
      if (!sv) { toast('Add a source', 'Enter a name to record this source.', 'bad'); return; }
      var s1 = d.sender;
      s1.sourceName = sv; s1.other = true; ui.srcEdit = false;
      logEv('Kai Sandoval', 'human', 'Recorded the document source as <span class="new">' + esc(sv) + '</span> \u00b7 Other \u2014 not linked to a saved contact.');
      toast('Source saved', sv + ' \u00b7 Other, not linked');
      render(); return;
    }
    if ((el = e.target.closest('[data-srcother]'))) {
      var s2 = d.sender;
      s2.other = true; s2.sourceName = s2.sourceName || s2.name;
      logEv('Kai Sandoval', 'human', 'Recorded the source as <b>Other</b> \u2014 kept the sender as a typed source instead of the linked contact.');
      toast('Recorded as Other', s2.sourceName + ' \u00b7 not linked to the contact');
      render(); return;
    }
    if ((el = e.target.closest('[data-srcrelink]'))) {
      var s3 = d.sender;
      s3.other = false; s3.sourceName = null;
      logEv('Kai Sandoval', 'human', 'Restored the source to the linked saved contact <b>' + esc(s3.name) + '</b>.');
      toast('Contact restored', s3.name + ' \u00b7 saved contact');
      render(); return;
    }
    if ((el = e.target.closest('[data-srcsavecontact]'))) {
      toast('Save as contact', 'Never auto-created \u2014 opens a pre-filled contact form for this sender');
      return;
    }

    /* field: select card → jump to page + highlight the data point */
    if ((el = e.target.closest('[data-selfield]'))) {
      var sp = el.dataset.selfield.split(':');
      selectField(+sp[0], +sp[1], true); return;
    }
    if ((el = e.target.closest('[data-confirmall]'))) {
      var prevCA = captureRects();
      var tc = d.tracks[+el.dataset.confirmall];
      tc.fields.forEach(function (f) { if (f.value && !(f.input === 'contact' && !f.contact && !f.contactOther)) f.confirmed = true; });
      logEv('Kai Sandoval', 'human', 'Reviewed and confirmed all extracted <b>' + TYPES[tc.type].label + '</b> fields.');
      render();
      flip(prevCA);
      return;
    }
    /* per-section confirm — disposes every filled field in the section */
    if ((el = e.target.closest('[data-secconfirm]'))) {
      var sp2 = el.dataset.secconfirm.split(':');
      var ts = d.tracks[+sp2[0]], from = +sp2[1], to = +sp2[2];
      var n2 = 0;
      for (var si2 = from; si2 < to; si2++) {
        var fs = ts.fields[si2];
        if (fs.input === 'contact' && !fs.contact && !fs.contactOther) continue;
        if (fs.value && !fs.confirmed) { fs.confirmed = true; n2++; }
      }
      if (n2) logEv('Kai Sandoval', 'human', 'Confirmed the <b>' + (from === 0 ? 'Core' : TYPES[ts.type].label) + '</b> fields \u2014 ' + n2 + ' value' + (n2 > 1 ? 's' : '') + ' disposed.');
      render();
      return;
    }

    /* patient decision (Patient & contact card) — confirm / replace / create */
    if ((el = e.target.closest('[data-pcconfirm]'))) {
      var pc = d.candidates.filter(function (x) { return x.id === el.dataset.pcconfirm; })[0];
      if (!pc) return;
      d.match = { name: pc.name, sig: pc.species + ' \u00b7 ' + pc.breed + ' \u00b7 ' + pc.owner + ' \u00b7 ' + pc.acct, how: 'Confirmed by you \u00b7 ' + now() };
      logEv('Kai Sandoval', 'human', 'Confirmed patient match \u2192 <b>' + esc(pc.name) + '</b> (' + pc.acct + ') \u00b7 ' + pc.keys.filter(function (k) { return k.hit; }).length + ' agreeing keys. Contact\u2194patient tie strengthened.');
      d.tracks.forEach(function (x) { if (x.stepIdx === 1) x.stepIdx = 2; });
      ui.pcPicker = false; ui.selCand = null;
      toast('Patient bound', pc.name + ' \u00b7 ' + pc.owner + ' \u00b7 match logged');
      render(); return;
    }
    if ((el = e.target.closest('[data-pcreplace]'))) { ui.pcPicker = true; ui.selCand = null; render(); return; }
    if ((el = e.target.closest('[data-pcpickcancel]'))) { ui.pcPicker = false; ui.selCand = null; render(); return; }
    if ((el = e.target.closest('[data-pcbind]'))) {
      var pb = d.candidates.filter(function (x) { return x.id === ui.selCand; })[0];
      if (!pb) return;
      d.match = { name: pb.name, sig: pb.species + ' \u00b7 ' + pb.breed + ' \u00b7 ' + pb.owner + ' \u00b7 ' + pb.acct, how: 'Confirmed by you \u00b7 ' + now() };
      logEv('Kai Sandoval', 'human', 'Replaced the suggested match \u2014 bound this document to <b>' + esc(pb.name) + '</b> (' + pb.acct + '). Contact\u2194patient tie strengthened.');
      d.tracks.forEach(function (x) { if (x.stepIdx === 1) x.stepIdx = 2; });
      ui.pcPicker = false; ui.selCand = null;
      toast('Patient bound', pb.name + ' \u00b7 ' + pb.owner + ' \u00b7 match logged');
      render(); return;
    }
    if ((el = e.target.closest('[data-pccreate]'))) {
      var t0c = d.tracks[0], cc = t0c ? t0c.fields : [];
      var nm = (cc[0] && cc[0].value) ? cc[0].value : 'New patient';
      var sp = (cc[1] && cc[1].value) ? cc[1].value : '';
      var ow = (cc[2] && cc[2].value) ? cc[2].value : '';
      d.match = { name: nm, sig: (sp ? sp + ' \u00b7 ' : '') + (ow ? ow + ' \u00b7 ' : '') + 'new record', how: 'New patient created by you \u00b7 ' + now() };
      logEv('Kai Sandoval', 'human', 'Created a <b>new patient</b> record for <b>' + esc(nm) + '</b>' + (ow ? ' (' + esc(ow) + ')' : '') + ' from the extracted fields and bound this document to it.');
      d.tracks.forEach(function (x) { if (x.stepIdx === 1) x.stepIdx = 2; });
      ui.pcPicker = false; ui.selCand = null;
      toast('New patient created', nm + (ow ? ' \u00b7 ' + ow : '') + ' \u00b7 bound to this document');
      render(); return;
    }

    /* patient match */
    if ((el = e.target.closest('[data-cand]')) && !el.disabled) {
      ui.selCand = ui.selCand === el.dataset.cand ? null : el.dataset.cand; render(); return;
    }
    if ((el = e.target.closest('[data-bind]'))) {
      var c = d.candidates.filter(function (x) { return x.id === ui.selCand; })[0];
      if (!c) return;
      d.match = { name: c.name, sig: c.species + ' \u00b7 ' + c.breed + ' \u00b7 ' + c.owner + ' \u00b7 ' + c.acct, how: 'Confirmed by you \u00b7 ' + now() };
      logEv('Kai Sandoval', 'human', 'Confirmed patient match \u2192 <b>' + esc(c.name) + '</b> (' + c.acct + ') \u00b7 ' + c.keys.filter(function (k) { return k.hit; }).length + ' agreeing keys. Contact\u2194patient tie strengthened.');
      var tb = d.tracks[+el.dataset.bind];
      if (tb.stepIdx === 1) tb.stepIdx = 2;
      /* other tracks waiting at match inherit the binding step done */
      d.tracks.forEach(function (x) { if (x !== tb && x.stepIdx === 1) x.stepIdx = 2; });
      ui.selCand = null;
      toast('Patient bound', c.name + ' \u00b7 ' + c.owner + ' \u00b7 match logged');
      render(); return;
    }
    if ((el = e.target.closest('[data-createnew]'))) {
      toast('Create new patient', 'Never auto-created \u2014 opens a pre-filled patient form'); return;
    }
    if ((el = e.target.closest('[data-nomatch]'))) {
      var tn = d.tracks[+el.dataset.nomatch];
      logEv('Kai Sandoval', 'human', 'Chose to <b>complete without a confirmed match</b> \u2014 the payload carries a null patient ref.');
      tn.stepIdx = 2; ui.selCand = null; render(); return;
    }
    if ((el = e.target.closest('[data-unmatch]'))) {
      logEv('Kai Sandoval', 'human', 'Unbound the patient match \u2014 returning to candidate review.');
      d.match = null; render(); return;
    }

    /* workflow advance (ack / schedule / generic) */
    if ((el = e.target.closest('[data-tstep]'))) {
      var ta = d.tracks[+el.dataset.tstep];
      if (el.dataset.ack) { logEv('Kai Sandoval', 'human', 'Sent acknowledgment to <b>' + esc(d.sender.name) + '</b> \u2014 referral received, ref ' + d.id + '.'); toast('Acknowledgment sent', d.sender.name + ' \u00b7 via fax'); }
      else if (el.dataset.sched) { logEv('Kai Sandoval', 'human', 'Marked the referral <b>scheduled</b>.'); }
      else if (el.dataset.skip) { logEv('Kai Sandoval', 'human', 'Skipped the optional Schedule step.'); }
      else if (ta.stepIdx === 0) { logEv('Kai Sandoval', 'human', 'Completed field review for the <b>' + TYPES[ta.type].label + '</b> track.'); ui.tab = 'patient'; }
      advance(ta, +el.dataset.tstep); return;
    }
    /* push */
    if ((el = e.target.closest('[data-push]')) && !el.disabled) { doPush(d.tracks[+el.dataset.push], +el.dataset.push); return; }

    /* terminal action: complete the document \u2014 makes it eligible for a human push */
    if ((el = e.target.closest('[data-complete]')) && !el.disabled) {
      var ct = d.tracks[+el.dataset.complete];
      if (ct) {
        ct.reviewComplete = true;
        logEv('Kai Sandoval', 'human', 'Marked the <b>' + TYPES[ct.type].label + '</b> document complete — now eligible for a human push to the PIMS.');
        toast('Marked ready to push', 'Eligible · the push to your PIMS is a separate, human action');
        render();
      }
      return;
    }

    /* doc-type manager: remove a confirmed type, add another */
    if ((el = e.target.closest('[data-removeask]'))) { ui.removeType = +el.dataset.removeask; ui.addType = false; render(); return; }
    if ((el = e.target.closest('[data-removecancel]'))) { ui.removeType = null; render(); return; }
    if ((el = e.target.closest('[data-removetrack]'))) {
      var ridx = +el.dataset.removetrack, rt = d.tracks[ridx];
      d.tracks.splice(ridx, 1);
      ui.removeType = null;
      if (ui.openTrack >= d.tracks.length) ui.openTrack = d.tracks.length - 1;
      if (ui.openTrack < 0) ui.openTrack = 0;
      if (!d.tracks.length) { d.untyped = true; ui.openTrack = 0; }
      logEv('Kai Sandoval', 'human', 'Removed the <b>' + (rt ? TYPES[rt.type].label : 'document') + '</b> type from this document — its track and workflow were deleted.');
      toast('Type removed', (rt ? TYPES[rt.type].label : '') + ' \u00b7 track deleted', 'bad');
      render(); return;
    }
    if ((el = e.target.closest('[data-addtoggle]'))) { ui.addType = true; ui.removeType = null; render(); return; }
    if ((el = e.target.closest('[data-addcancel]'))) { ui.addType = false; render(); return; }

    /* suggestions */
    if (e.target.closest('[data-sib-confirm]')) {
      demoBatch.sugState = 'confirmed';
      logEv('Kai Sandoval', 'human', 'Confirmed the AI-suggested <b>Lab result</b> document \u2014 added as an independent track in this fax.');
      toast('Lab result confirmed', 'Added as a new track in this fax');
      render(); return;
    }
    if (e.target.closest('[data-sib-dismiss]')) {
      demoBatch.sugState = 'dismissed';
      logEv('Kai Sandoval', 'human', 'Dismissed the AI-suggested <b>Lab result</b> document \u2014 logged for calibration.');
      toast('Suggestion dismissed', 'Logged for calibration');
      render(); return;
    }
    if ((el = e.target.closest('[data-promote]'))) {
      ui.addType = false; ui.removeType = null;
      var s = d.suggestions.splice(+el.dataset.promote, 1)[0];
      var nt = d.labTrack || { type: s.type, label: s.label, origin: 'Typed by you \u00b7 just now', steps: ['Review', 'Confirm Match', 'Sync to PIMS', 'Complete'], optionalSteps: [], stepIdx: 0, complete: false, fields: [] };
      if (d.match) { /* match already bound → lab track can skip to after match once reviewed */ }
      d.tracks.push(nt);
      ui.typeMenu = false;
      logEv('Kai Sandoval', 'human', 'Promoted the suggested <b>' + s.label + '</b> type \u2014 it\u2019s now an independent track with its own completion.');
      toast('Type confirmed', s.label + ' track added \u00b7 still viewing ' + (d.tracks[ui.openTrack] ? TYPES[d.tracks[ui.openTrack].type].label : 'current type'));
      render(); return;
    }
    if ((el = e.target.closest('[data-dismiss]'))) {
      var ds = d.suggestions.splice(+el.dataset.dismiss, 1)[0];
      logEv('Kai Sandoval', 'human', 'Dismissed the suggested <b>' + ds.label + '</b> type \u2014 logged as a calibration signal (not a tag-strip).');
      toast('Suggestion dismissed', 'Logged for calibration');
      render(); return;
    }

    /* untyped: manual set-type */
    if ((el = e.target.closest('[data-settype]'))) {
      var k = el.dataset.settype;
      ui.addType = false; ui.removeType = null;
      var wasUntyped = d.untyped || !d.tracks.length;
      var selT = d.tracks[ui.openTrack];
      d.untyped = false; d.banner = null;
      d.tracks.push({
        type: k, label: TYPES[k].label, origin: 'Typed by you \u00b7 manual', pagesSpan: '1',
        steps: k === 'ref' ? ['Review', 'Confirm Match', 'Confirm to Referrer', 'Schedule', 'Sync to PIMS', 'Complete']
             : k === 'req' ? ['Review', 'Confirm Match', 'Fulfill Request', 'Complete']
             : ['Review', 'Confirm Match', 'Sync to PIMS', 'Complete'],
        optionalSteps: k === 'ref' ? [3] : [], stepIdx: 0, complete: false,
        fields: [
          { key: 'patient', label: 'Patient name', value: '', conf: 'human', required: true },
          { key: 'species', label: 'Species / breed', value: '', conf: 'human', required: true },
          { key: 'owner', label: 'Client / owner', value: '', conf: 'human', required: true },
          { key: 'docdate', label: 'Document date', value: '', conf: 'human', required: true }
        ],
        stagedNote: 'Extraction failed on this document, so every field is manual. Your typing here is the highest-value calibration signal.'
      });
      /* first type on an untyped doc → jump in; adding a type to an already-typed
         doc keeps you on the current form */
      if (wasUntyped) { ui.openTrack = d.tracks.length - 1; ui.tab = 'work'; }
      ui.typeMenu = false;
      if (wasUntyped) {
        logEv('Kai Sandoval', 'human', 'Manually typed the document as <b>' + TYPES[k].label + '</b> after extraction failure \u2014 highest-value correction signal.');
      } else {
        logEv('Kai Sandoval', 'human', 'Added a <b>' + TYPES[k].label + '</b> type \u2014 a new independent track with its own workflow. Still viewing the current type.');
        toast('Type added', TYPES[k].label + ' track created \u00b7 still on ' + (selT ? TYPES[selT.type].label : 'current type'));
      }
      render(); return;
    }

    /* ties */
    if ((el = e.target.closest('[data-untie]'))) {
      var nm = el.dataset.untie;
      d.ties.rows = d.ties.rows.filter(function (r) { return r.name !== nm; });
      logEv('Kai Sandoval', 'human', 'Removed the contact\u2194patient tie for <b>' + esc(nm) + '</b> \u2014 it will no longer act as a corroborating match key.');
      toast('Tie removed', nm + ' \u00b7 no longer a match key for this sender');
      render(); return;
    }
  });

  /* editing a field IS the disposition act — commit + log + auto-confirm that field */
  content.addEventListener('change', function (e) {
    var el = e.target.closest('[data-fedit]');
    if (!el) return;
    var d = D();
    var p = el.dataset.fedit.split(':'), t = d.tracks[+p[0]], f = t && t.fields[+p[1]];
    if (!f) return;
    var val = (el.value || '').trim();
    if (val === (f.value || '')) return;
    if (f.value) {
      logEv('Kai Sandoval', 'human', 'Corrected <b>' + esc(f.label) + '</b>: <span class="old">' + esc(f.value) + '</span> \u2192 <span class="new">' + esc(val) + '</span>');
      f.corrFrom = f.value; f.edited = true;
    } else {
      logEv('Kai Sandoval', 'human', 'Filled <b>' + esc(f.label) + '</b> (left empty by extraction): <span class="new">' + esc(val) + '</span>');
      f.conf = 'human'; f.edited = true;
    }
    f.value = val; f.confirmed = true;
    render();
  }, true);

  /* focusing a field reveals its source region in the evidence pane */
  content.addEventListener('focusin', function (e) {
    var el = e.target.closest('[data-fedit][data-region]');
    if (!el) return;
    var d = D(), region = el.dataset.region;
    var pg = DOCR.regionPage(d.scenario, region);
    if (pg >= 0 && pg !== ui.page) {
      ui.page = pg; ui.lit = region; ui.focusFld = el.dataset.fedit; render();
    } else {
      ui.lit = region; lightRegion(region, true, true);
    }
  });

  /* clicking in and out of a field marks it human-touched \u2014 the whole AI signal
     (confidence reading + spark) drops. No value change required. A required field\n     left empty keeps its \"Needs review\" flag. */
  content.addEventListener('focusout', function (e) {
    var el = e.target.closest('[data-fedit]');
    if (!el) return;
    var q = el.dataset.fedit.split(':');
    var t = D().tracks[+q[0]], f = t && t.fields[+q[1]];
    if (!f || f.touched) return;
    f.touched = true;
    var host = el.closest('[data-ff]');
    var status = host && host.querySelector('.ff-status:not(.low)');
    if (status) status.remove();
  }, true);

  /* enter-to-save in field editor */
  content.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'fdInput') {
      var btn = content.querySelector('[data-save]'); if (btn) btn.click();
    }
    if (e.key === 'Enter' && e.target.id === 'cfInput') {
      var cbtn = content.querySelector('[data-cothersave]'); if (cbtn) cbtn.click();
    }
    if (e.key === 'Enter' && e.target.id === 'srcInput') {
      var sbtn = content.querySelector('[data-srcsave]'); if (sbtn) sbtn.click();
    }
    if (e.key === 'Escape' && ui.srcEdit) { ui.srcEdit = false; render(); }
    if (e.key === 'Escape' && ui.cedit) { ui.cedit = null; render(); }
    if (e.key === 'Escape' && ui.editing) { ui.editing = null; render(); }
  });

  document.addEventListener('click', function (e) {
    var menu = document.getElementById('moreMenu');
    if (menu && menu.classList.contains('open') && !e.target.closest('.dd-more')) menu.classList.remove('open');
    var srcMenu = document.getElementById('srcMenu');
    if (srcMenu && srcMenu.classList.contains('open') && !e.target.closest('.src-more')) srcMenu.classList.remove('open');
    if (ui.typeMenu && !e.target.closest('.dd-typewrap')) { ui.typeMenu = false; render(); }
  });

  /* ---------------- shell chrome (rail collapse, menus) ---------------- */
  var app = document.getElementById('app');
  var COLLAPSE_KEY = 'rd-rail-collapsed';
  if (localStorage.getItem(COLLAPSE_KEY) === '1') app.classList.add('collapsed');
  var rt = document.getElementById('railToggle');
  if (rt) rt.addEventListener('click', function () { app.classList.toggle('collapsed'); localStorage.setItem(COLLAPSE_KEY, app.classList.contains('collapsed') ? '1' : '0'); });
  var notifPanel = document.getElementById('notifPanel');
  var userPanel = document.getElementById('userPanel');
  function closeShellMenus(except) {
    if (notifPanel && except !== notifPanel) notifPanel.classList.remove('open');
    if (userPanel && except !== userPanel) userPanel.classList.remove('open');
  }
  var bell = document.getElementById('bellBtn');
  if (bell) bell.addEventListener('click', function (e) { e.stopPropagation(); var open = !notifPanel.classList.contains('open'); closeShellMenus(notifPanel); notifPanel.classList.toggle('open', open); });
  var userBtn = document.getElementById('userBtn');
  if (userBtn) userBtn.addEventListener('click', function (e) { e.stopPropagation(); var open = !userPanel.classList.contains('open'); closeShellMenus(userPanel); userPanel.classList.toggle('open', open); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.bellwrap') && !e.target.closest('.usermenu')) closeShellMenus(null); });

  autoFirst();
  render();
})();
