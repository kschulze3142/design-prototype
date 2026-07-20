/* ============================================================
   RobinDock — Sent Detail · CONTROLLER
   The full story of ONE outbound transmission (per-document-crossing).
   Reached from a row in the Outbound/Sent list (?id=TX-####).
   Renders: status headline → delivery-journey state machine (the heart,
   with retry history + failure reason) → the sent document → recovery
   actions → Case/thread + sender context. Delivery states advance on a
   live ticker; a scenario switcher flips between mock transmissions to
   exercise every state. Prototype / mock only.
   ============================================================ */
(function () {
  'use strict';

  var D = window.RD_OUTBOUND;
  var TX = D.TX, TYPES = D.TYPES, SRC = D.SRC, PRACTICE = D.PRACTICE;
  var NOW = new Date(D.NOW);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function qid() {
    var m = /[?&]id=([^&]+)/.exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ---------------- icons ---------------- */
  var I = {
    check: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.7"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkSm: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alert: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    alertSm: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 16h.01" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    clock: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plane: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l14-7-7 16-2-6-5-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    planeSm: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l14-7-7 16-2-6-5-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    fax: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 8V4h10v4M5 8h14a2 2 0 012 2v6a2 2 0 01-2 2h-2v-4H7v4H5a2 2 0 01-2-2v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    spec: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 19l14-7L5 5v5l8 2-8 2v5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    rec: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 10h6M9 14h6M9 18h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    eye: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.7"/></svg>',
    retry: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 10-1.5 5.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M20 5v6h-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    internal: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 11v3.5A1.5 1.5 0 009.5 16H13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    caseic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 8a2 2 0 012-2h3l2 2h7a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    edit: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.7"/></svg>',
    person: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    journey: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M8.4 6H14a3 3 0 013 3v6.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    doc: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13 3v5h5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    bolt: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    link: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M10 14a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1 1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14 10a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    logged: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.7"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    caret: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
  };
  function srcIcon(type) { return type === 'gp' ? I.rec : type === 'er' ? I.fax : (type === 'lab' || type === 'imaging') ? I.rec : type === 'other' ? I.fax : I.spec; }
  function srcCls(type) { return SRC[type] || 'other'; }

  /* ---------------- time ---------------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function clock12(d) { var h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + pad(m) + ' ' + ap; }
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dayDiff(d) { var a = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()); var b = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return Math.round((a - b) / 86400000); }
  function absTime(iso) { if (!iso) return ''; var d = new Date(iso); return (dayDiff(d) === 0 ? 'Today ' : MON[d.getMonth()] + ' ' + d.getDate() + ', ') + clock12(d); }
  function relTime(iso) {
    if (!iso) return '—';
    var d = new Date(iso), ms = NOW - d, m = Math.round(ms / 60000), dd = dayDiff(d);
    if (m < 1) return 'just now'; if (m < 60) return m + ' min ago';
    if (dd === 0) return Math.round(m / 60) + ' hr ago'; if (dd === 1) return 'Yesterday';
    return MON[d.getMonth()] + ' ' + d.getDate();
  }
  function durBetween(a, b) {
    if (!a || !b) return '';
    var ms = Math.abs(new Date(b) - new Date(a)), m = Math.round(ms / 60000), s = Math.round(ms / 1000);
    if (m < 1) return s + 's'; if (m < 60) return m + ' min'; return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
  }

  /* ---------------- derivations ---------------- */
  function typeBadge(type) { var t = TYPES[type] || { label: type, cls: 'ty-cov' }; return '<span class="tybadge ' + t.cls + '">' + esc(t.label) + '</span>'; }
  function originOf(tx) {
    var t = tx.doc.type;
    if (t === 'referral') return ['Composed from the <b>Referral letter</b> template', 'reply-in-context · Case ' + (tx.caseId || '—')];
    if (t === 'records') return ['Records package assembled and sent', 'composed from patient records'];
    if (t === 'recreq') return ['Records request generated', 'outbound request to records-holder'];
    if (t === 'vaccine') return ['Vaccine history exported and sent', 'composed from patient records'];
    if (t === 'cover') return ['Generic fax — manual cover page', 'free-form send'];
    return ['Composed in the Composer', 'outbound send'];
  }
  function failureReason(tx) {
    // last retry/failed event note with a parenthetical reason
    var reason = null;
    tx.events.forEach(function (e) {
      var m = /\(([^)]+)\)/.exec(e[2] || '');
      if ((e[0] === 'retry' || e[0] === 'failed') && m) reason = m[1];
    });
    return reason; // e.g. "no carrier", "line busy", "no answer"
  }

  /* ---------------- status headline ---------------- */
  function statusHead(tx) {
    var rt = tx.retry || { n: 0, of: 3 };
    var map = {
      delivered: [I.check, 'Delivered',
        'Confirmed received by the recipient' + (tx.resent ? ' after a manual resend' : '') + '.'],
      failed: [I.alert, 'Delivery failed',
        'Terminal failure after ' + rt.of + ' automatic attempts' + (failureReason(tx) ? ' — last reason: ' + failureReason(tx) : '') + '. Use the recovery actions to re-attempt.'],
      retrying: ['<span class="ds-spin" style="width:26px;height:26px;border-width:3px"></span>', 'Retrying automatically',
        'Attempt ' + rt.n + ' of ' + rt.of + ' — backing off between tries. No action needed; you’ll be notified if it terminally fails.'],
      queued: [I.clock, 'Queued',
        'Accepted and waiting to be handed to the fax transport. Will move to “sent” momentarily.'],
      sent: [I.plane, 'Sent — awaiting confirmation',
        tx.slow ? 'Handed to the carrier; the delivery confirmation is delayed (normal for some lines). Not yet confirmed delivered.'
          : 'Handed to the fax transport. Waiting on the carrier’s delivery confirmation.']
    };
    var m = map[tx.status];
    var times = [];
    times.push('<span>Sent <b>' + absTime(tx.sent) + '</b></span>');
    if (tx.status === 'delivered' && tx.settled) times.push('<span>Delivered <b>' + absTime(tx.settled) + '</b> · ' + durBetween(tx.sent, tx.settled) + '</span>');
    if (tx.status === 'failed' && tx.settled) times.push('<span>Failed <b>' + absTime(tx.settled) + '</b></span>');
    return '<div class="sd-status"><span class="sic">' + m[0] + '</span><div class="stx">' +
      '<h1>' + m[1] + '</h1><div class="ssub">' + esc(m[2]).replace('&amp;ldquo;', '“') + '</div>' +
      '<div class="stime">' + times.join('') + '</div></div></div>';
  }

  /* ---------------- machine track ---------------- */
  function machineTrack(tx) {
    var nodes = ['queued', 'sent', 'delivered'];
    var reached = {};
    tx.events.forEach(function (e) { if (e[0] === 'queued' || e[0] === 'sent' || e[0] === 'delivered') reached[e[0]] = true; });
    var failed = tx.status === 'failed', retrying = tx.status === 'retrying';
    var html = '';
    nodes.forEach(function (n, i) {
      var done = (n === 'delivered') ? tx.status === 'delivered' : reached[n] && !(n === 'sent' && tx.status === 'queued');
      var active = (n === 'sent' && (tx.status === 'sent' || retrying)) || (n === 'queued' && tx.status === 'queued');
      var bad = (n === 'delivered' && failed);
      var cls = bad ? 'bad' : done ? 'done' : active ? 'active' : '';
      var ic = bad ? I.alertSm : done ? I.checkSm : (active ? (retrying ? '<span class="ds-spin" style="width:12px;height:12px"></span>' : I.planeSm) : '');
      html += '<div class="node ' + cls + '"><div class="dot">' + ic + '</div><div class="nl">' + (bad ? 'failed' : n) + '</div></div>';
      if (i < nodes.length - 1) { var segDone = reached[nodes[i + 1]] || (nodes[i + 1] === 'delivered' && tx.status === 'delivered'); html += '<div class="seg' + (segDone && !failed ? ' done' : '') + '"></div>'; }
    });
    return '<div class="machine">' + html + '</div>';
  }

  /* ---------------- retry attempts ---------------- */
  function attemptCards(tx) {
    var atts = tx.events.filter(function (e) { return e[0] === 'retry'; });
    if (!atts.length) return '';
    var cards = atts.map(function (e, i) {
      var note = e[2] || '';
      var pending = /in progress/i.test(note);
      var failedA = /fail/i.test(note);
      var cls = pending ? 'pending' : failedA ? 'bad' : 'ok';
      var m = /\(([^)]+)\)/.exec(note);
      var reason = m ? m[1] : (pending ? 'in progress' : 'completed');
      return '<div class="sd-attempt ' + cls + '"><div class="an"><span class="dot"></span>Attempt ' + (i + 1) + '</div>' +
        '<div class="av">' + esc(reason.charAt(0).toUpperCase() + reason.slice(1)) + '</div>' +
        '<div class="aw">' + absTime(e[1]) + '</div></div>';
    }).join('');
    return '<div class="sd-subsec">Automatic retry attempts</div><div class="sd-attempts">' + cards + '</div>';
  }

  /* ---------------- full event timeline ---------------- */
  function evItem(e) {
    var k = e[0];
    var svg = k === 'delivered' || k === 'internal' ? I.checkSm : k === 'failed' ? I.alertSm : k === 'retry' ? '<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 10-1.5 5.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M20 5v6h-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' : k === 'sent' ? I.planeSm : I.checkSm;
    var label = k === 'retry' ? 'Retry' : k === 'internal' ? 'Delivered internally' : k;
    return '<div class="ev ' + k + '"><span class="ed">' + svg + '</span><div class="etx"><div class="et">' + esc(label) + '</div>' +
      (e[2] ? '<div class="en">' + esc(e[2]) + '</div>' : '') + '<div class="ew">' + absTime(e[1]) + '</div></div></div>';
  }

  /* ---------------- document preview ---------------- */
  function docPreview(tx) {
    var t = TYPES[tx.doc.type] || { label: tx.doc.type };
    var thumbs =
      '<div class="sd-page-thumb behind"><div class="ph-band"></div><div class="ph-stripes"></div></div>' +
      '<div class="sd-page-thumb cover"><div class="ph-band"></div><span class="ph-cap">COVER · MOUNTAIN WEST VET</span>' +
      '<div class="ph-cl" style="top:46px"></div><div class="ph-cl" style="top:58px;right:60px"></div><div class="ph-stripes" style="top:78px"></div></div>';
    return '<div class="sd-doc-wrap"><div class="sd-doc-stage">' + thumbs + '</div>' +
      '<div class="sd-doc-side">' +
      '<div class="sd-doc-kv"><span class="k">File</span><span class="v">' + esc(tx.doc.name) + '</span></div>' +
      '<div class="sd-doc-kv"><span class="k">Type</span><span class="v">' + esc(t.label) + '</span></div>' +
      '<div class="sd-doc-kv"><span class="k">Pages</span><span class="v">' + tx.doc.pages + ' + cover</span></div>' +
      '<div class="sd-doc-kv"><span class="k">Format</span><span class="v">PDF</span></div>' +
      '<button class="btn btn-blue" style="width:100%;justify-content:center;margin-top:14px" data-act="viewdoc">' + I.eye + 'Open document</button>' +
      '<div class="sd-doc-immutable">' + I.lock + '<span>This is exactly what was transmitted — immutable. Opening it logs a PHI <b>view</b>. To change anything, compose a new send.</span></div>' +
      '</div></div>';
  }

  /* ---------------- actions ---------------- */
  function actionsList(tx) {
    var out = [];
    if (tx.status === 'failed') {
      out.push('<button class="sd-act primary" data-act="retry"><span class="aic">' + I.retry + '</span><div class="atx"><div class="at">Resend</div><div class="as">Manually re-attempt this transmission over fax.</div></div><span class="ach">' + I.chev + '</span></button>');
      if (tx.internalEligible) out.push('<button class="sd-act internal" data-act="internal"><span class="aic">' + I.internal + '</span><div class="atx"><div class="at">Try internal <span class="latent">latent · v3</span></div><div class="as">Recipient is on Robin Dock — deliver over the network instead of fax.</div></div><span class="ach">' + I.chev + '</span></button>');
      out.push('<button class="sd-act" data-act="fix"><span class="aic">' + I.edit + '</span><div class="atx"><div class="at">Fix recipient &amp; resend</div><div class="as">Bad number? Correct the contact and re-dispatch.</div></div><span class="ach">' + I.chev + '</span></button>');
    }
    out.push('<button class="sd-act" data-act="viewdoc"><span class="aic">' + I.eye + '</span><div class="atx"><div class="at">View the sent document</div><div class="as">Open what was transmitted · logs a PHI view.</div></div><span class="ach">' + I.chev + '</span></button>');
    if (tx.caseId) out.push('<button class="sd-act" data-act="opencase"><span class="aic">' + I.caseic + '</span><div class="atx"><div class="at">Open the Case</div><div class="as">Jump to ' + esc(tx.caseId) + ' — the thread this send belongs to.</div></div><span class="ach">' + I.chev + '</span></button>');
    if (tx.unresolved) out.push('<button class="sd-act" data-act="resolve"><span class="aic">' + I.person + '</span><div class="atx"><div class="at">Resolve into a Contact</div><div class="as">Sent to a raw number — save it as a directory contact.</div></div><span class="ach">' + I.chev + '</span></button>');
    return '<div class="sd-actions">' + out.join('') + '</div>' +
      '<div class="sd-act-foot">' + I.logged + '<span>Re-dispatching PHI out of the org (resend / try-internal / fix-and-resend) is a logged, higher-sensitivity action.</span></div>';
  }

  /* ---------------- context ---------------- */
  function contextCard(tx) {
    var origin = originOf(tx);
    var caseBlock = tx.caseId
      ? '<a class="sd-ctx-case" data-act="opencase"><span class="cic">' + I.caseic + '</span><div class="ctx"><div class="cid">' + esc(tx.caseId) + '</div><div class="csub">' + esc(tx.caseSubject || 'Case thread') + '</div></div><span class="cch">' + I.chev + '</span></a>'
      : '<div class="sd-ctx-none">This send isn’t attached to a Case — it was a standalone fax. It still appears in the recipient’s exchange history.</div>';
    return caseBlock +
      '<div class="sd-ctx-row"><span class="rav">KS</span><div><div class="rk">Sender</div><div class="rv">Kai Sandoval <span class="sub">· Front desk</span></div></div></div>' +
      '<div class="sd-ctx-row"><span class="ric">' + I.bolt + '</span><div><div class="rk">Originating action</div><div class="rv" style="font-weight:500;font-size:13px;color:var(--gray-600)">' + origin[0] + '</div></div></div>' +
      '<div class="sd-ctx-row"><span class="ric">' + I.person + '</span><div><div class="rk">From practice</div><div class="rv">' + esc(PRACTICE.name) + ' <span class="sub">· ' + esc(PRACTICE.fax) + '</span></div></div></div>';
  }

  /* ---------------- facts ---------------- */
  function factsCard(tx) {
    var net = tx.recip.network === 'on' ? 'On-network' : 'Off-network · fax';
    var rows = [
      ['Transmission', '<span class="mono">' + esc(tx.id) + '</span>'],
      (tx.recip.raw ? ['Recipient fax', '<span class="mono">' + esc(tx.recip.raw) + '</span>'] : ['Location', esc(tx.recip.loc || 'Direct fax')]),
      ['Network', net],
      ['Pages', tx.doc.pages + ' + cover'],
      ['Queued', absTime(tx.events[0] ? tx.events[0][1] : tx.sent)],
      ['Sent', absTime(tx.sent)]
    ];
    if (tx.settled) rows.push([tx.status === 'failed' ? 'Failed' : 'Delivered', absTime(tx.settled)]);
    return '<div class="sd-facts">' + rows.map(function (r) {
      return '<div class="kv"><span class="k">' + r[0] + '</span><span class="v ' + (/mono/.test(r[1]) ? '' : '') + '">' + r[1] + '</span></div>';
    }).join('') + '</div>';
  }

  /* ---------------- page ---------------- */
  function card(icon, title, body, opts) {
    opts = opts || {};
    var head = '<div class="sd-chead"><span class="ci">' + icon + '</span><h2>' + title + '</h2>' +
      (opts.heart ? '<span class="heart">The heart</span>' : '') +
      (opts.tag ? '<span class="tag">' + opts.tag + '</span>' : '') + '</div>';
    return '<div class="sd-card' + (opts.cls ? ' ' + opts.cls : '') + '">' + head + '<div class="sd-cbody">' + body + '</div></div>';
  }

  function notFound() {
    return '<div class="sd-notfound"><div class="ico">' + I.search + '</div>' +
      '<h2>Transmission not found</h2><p>This send doesn’t exist or has aged out of the log. It may have been a different practice’s transmission.</p>' +
      '<a class="btn btn-blue" href="Robin Dock - Outbound.html" style="margin-top:18px">Back to Outbound</a></div>';
  }

  function render() {
    var root = document.getElementById('appContent');
    var tx = byId(STATE.id);
    if (!tx) { root.innerHTML = '<div class="sd-page">' + notFound() + '</div>'; return; }
    document.getElementById('appTitle').textContent = tx.id;

    var net = tx.recip.network === 'on' ? '<span class="netchip on"><span class="d"></span>On-network</span>' : '<span class="netchip off"><span class="d"></span>Off-network · fax</span>';
    var reason = failureReason(tx);

    /* hero quick actions */
    var heroActs = '';
    if (tx.status === 'failed') heroActs += '<button class="btn btn-blue" data-act="retry">' + I.retry + 'Resend</button>';
    if (tx.status === 'failed' && tx.internalEligible) heroActs += '<button class="btn btn-violet" data-act="internal">' + I.internal + 'Try internal</button>';
    heroActs += '<button class="btn btn-light" data-act="viewdoc">' + I.eye + 'View document</button>';
    if (tx.caseId) heroActs += '<button class="btn btn-light" data-act="opencase">' + I.caseic + 'Open Case</button>';

    var hero = '<div class="sd-hero ' + tx.status + '">' +
      '<div class="sd-hero-top"><span class="sd-txid">' + esc(tx.id) + '</span>' +
      '<span class="sd-logged">' + I.logged + 'Access logged</span></div>' +
      statusHead(tx) +
      '<div class="sd-meta-strip">' +
      '<div class="sd-mcard' + (tx.unresolved ? ' unres' : '') + '"><span class="sq ' + srcCls(tx.recip.type) + '">' + srcIcon(tx.recip.type) + '</span>' +
      '<div><div class="mk">Recipient</div><div class="mv">' +
      (tx.unresolved ? esc(tx.recip.raw) : '<a href="../contacts/Robin Dock - Contact Detail.html">' + esc(tx.recip.name) + '</a>') +
      ' ' + net + '</div><div class="ms">' + (tx.unresolved ? 'Unrecognized number' : '<span class="mono">' + esc(tx.recip.loc || 'Direct fax') + '</span>') + '</div></div></div>' +
      '<div class="sd-mcard"><span class="sq" style="background:var(--blue-50);color:var(--blue-600)">' + I.doc + '</span>' +
      '<div><div class="mk">What was sent</div><div class="mv">' + esc(tx.doc.name) + '</div><div class="ms">' + typeBadge(tx.doc.type) + '<span class="mono">' + tx.doc.pages + ' pages + cover</span></div></div></div>' +
      '</div>' +
      '<div class="sd-hero-acts">' + heroActs + '</div></div>';

    /* journey body */
    var journeyBody = machineTrack(tx);
    if (tx.unresolved) journeyBody += '<div class="sd-unres-band"><span class="ui">' + I.person + '</span><div><div class="ut">Sent to an unresolved number</div><div class="us">This went to a raw fax number that isn’t in your directory yet. Delivery still tracked normally — resolve it into a Contact so future sends are one click.</div><div class="ub"><button class="btn btn-aqua" data-act="resolve" style="padding:7px 14px">' + I.person + 'Resolve into a Contact</button></div></div></div>';
    if (tx.status === 'failed') journeyBody += '<div class="sd-reason failed"><span class="ri">' + I.alert.replace('width="26" height="26"', 'width="20" height="20"') + '</span><div><div class="rt">Why it failed' + (reason ? ' — <span class="rcode">' + esc(reason) + '</span>' : '') + '</div><div class="rs">The carrier reported this on the final attempt after ' + (tx.retry ? tx.retry.of : 3) + ' tries over ' + durBetween(tx.sent, tx.settled) + '. ' + (tx.internalEligible ? 'Because this recipient is on Robin Dock, you can also try internal delivery.' : 'Resend to try again, or fix the recipient number if it’s wrong.') + '</div></div></div>';
    if (tx.status === 'retrying') journeyBody += '<div class="sd-reason retrying"><span class="ri">' + I.clock.replace('width="26" height="26"', 'width="20" height="20"') + '</span><div><div class="rt">Auto-retrying — attempt ' + tx.retry.n + ' of ' + tx.retry.of + '</div><div class="rs">' + (reason ? 'Last attempt: <span class="rcode">' + esc(reason) + '</span>. ' : '') + 'Robin Dock is backing off and re-attempting on its own. No action needed unless all attempts are exhausted.</div></div></div>';
    if (tx.internalEligible && tx.status === 'failed') journeyBody += '<div class="sd-internal-note">' + I.internal + '<div><b>This recipient is on Robin Dock.</b> Fax delivery failed, but you can deliver the document over the network instead. (Network transport is latent in this prototype — v3.)</div></div>';
    journeyBody += attemptCards(tx);
    journeyBody += '<div class="sd-subsec">Full transmission history</div><div class="evlist">' + tx.events.slice().reverse().map(evItem).join('') + '</div>';

    var main = card(I.journey, 'Delivery journey', journeyBody, { heart: true, cls: 'sd-journey' }) +
      card(I.doc, 'The document', docPreview(tx), { tag: I.logged + 'View logs PHI' });

    var side = card(I.bolt, 'Actions', actionsList(tx)) +
      card(I.link, 'Context', contextCard(tx)) +
      card(I.doc, 'Transmission facts', factsCard(tx));

    root.innerHTML = '<div class="sd-page">' +
      '<a class="sd-back" href="Robin Dock - Outbound.html">' + I.back + 'Back to Outbound</a>' +
      hero +
      '<div class="sd-body"><div class="sd-main">' + main + '</div><div class="sd-side">' + side + '</div></div>' +
      '</div>' + scenarioSwitcher();
  }

  /* ---------------- scenario switcher ---------------- */
  var SCEN = [
    ['TX-48590', 'Delivered', 'clean success'],
    ['TX-48604', 'In flight', 'sent · awaiting'],
    ['TX-48615', 'Queued', 'just dispatched'],
    ['TX-48577', 'Mid-retry', 'attempt 2 of 3'],
    ['TX-48561', 'Failed (terminal)', 'off-net · resend'],
    ['TX-48550', 'Failed → try internal', 'on-network'],
    ['TX-48506', 'Slow confirmation', 'sent, lagging'],
    ['TX-48455', 'Recovered', 'resent → delivered'],
    ['TX-48402', 'Unresolved recipient', 'raw number']
  ];
  function scenarioSwitcher() {
    var rows = SCEN.map(function (s) {
      return '<div class="scenario' + (s[0] === STATE.id ? ' on' : '') + '" data-scen="' + s[0] + '"><span class="sd"></span><div class="stxt"><div class="sl">' + s[1] + '</div><div class="sh">' + s[2] + '</div></div></div>';
    }).join('');
    return '<div class="sd-states" id="sdStates"><div class="csh" data-act="toggle-states"><span class="dt"></span><span class="lbl">Prototype · transmission states</span><span class="caret">' + I.caret + '</span></div>' +
      '<div class="csbody">' + rows + '<div class="cshint">Each row opens a different mock send so you can see every delivery state. Real users reach this page from an Outbound row.</div></div></div>';
  }

  /* ---------------- actions / mutations ---------------- */
  function nowISO(off) { var d = new Date(NOW.getTime() + (off || 0) * 60000); return d.toISOString().slice(0, 19); }
  function byId(id) { return TX.filter(function (t) { return t.id === id; })[0]; }
  function doRetry() {
    var tx = byId(STATE.id); if (!tx) return;
    tx.status = 'retrying'; tx.retry = { n: 1, of: 3 }; tx.settled = null;
    tx.events.push(['sent', nowISO(), 'Manual resend by Kai Sandoval']);
    tx._resolveAt = Date.now() + 4200; tx._resolveTo = 'delivered';
    toast('Resending · ' + tx.recip.name, 'Re-dispatching the fax · logged.');
    render();
  }
  function doInternal() {
    var tx = byId(STATE.id); if (!tx) return;
    tx.status = 'retrying'; tx.retry = { n: 1, of: 1 }; tx.settled = null;
    tx.events.push(['internal', nowISO(), 'Routing over Robin Dock network…']);
    tx._resolveAt = Date.now() + 3000; tx._resolveTo = 'internal';
    toast('Trying internal · ' + tx.recip.name, 'Delivering over the network · logged.');
    render();
  }
  function viewDoc() { var tx = byId(STATE.id); if (!tx) return; toast('Opening document', esc(tx.doc.name) + ' · access logged (PHI view).'); }
  function openCase() { window.location.href = '../cases/Robin Dock - Cases.html'; }
  function doFix() { var tx = byId(STATE.id); if (!tx) return; toast('Fix recipient & resend', 'Correct the number on the Contact, then re-dispatch · logged.'); }
  function doResolve() { window.location.href = '../contacts/Robin Dock - Contacts.html'; }

  /* ---------------- live ticker ---------------- */
  function tick() {
    var tx = byId(STATE.id); if (!tx) return;
    var t = Date.now(), changed = false;
    if (tx._resolveAt && t >= tx._resolveAt) {
      tx.status = 'delivered'; tx.settled = nowISO();
      tx.events.push(['delivered', nowISO(), tx._resolveTo === 'internal' ? 'Confirmed delivered over the network' : 'Confirmed received']);
      tx.retry = null; tx._resolveAt = null; changed = true;
    } else if (!tx._resolveAt && !tx.slow) {
      if (tx.status === 'queued') { tx.status = 'sent'; tx.events.push(['sent', nowISO(), 'Handed to Telnyx fax · awaiting confirmation']); changed = true; }
      else if (tx.status === 'sent') { tx.status = 'delivered'; tx.settled = nowISO(); tx.events.push(['delivered', nowISO(), 'Confirmed received · ' + tx.doc.pages + ' page' + (tx.doc.pages === 1 ? '' : 's')]); changed = true; }
      else if (tx.status === 'retrying') {
        if (tx.retry.n < tx.retry.of) { tx.retry.n++; tx.events.push(['retry', nowISO(), 'Attempt ' + tx.retry.n + ' in progress']); }
        else { tx.status = 'delivered'; tx.settled = nowISO(); tx.retry = null; tx.events.push(['delivered', nowISO(), 'Confirmed received after retry']); }
        changed = true;
      }
    }
    if (changed) render();
  }

  /* ---------------- toast ---------------- */
  function toast(t, s) {
    var host = document.getElementById('logToasts'); if (!host) return;
    var el = document.createElement('div'); el.className = 'logtoast';
    el.innerHTML = '<span class="lic">' + I.logged + '</span><div><div class="lt">' + esc(t) + '</div><div class="ls">' + s + '</div></div>';
    host.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 320); }, 4200);
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var scen = e.target.closest('[data-scen]');
    if (scen) { STATE.id = scen.getAttribute('data-scen'); history.replaceState(null, '', 'Robin Dock - Sent Detail.html?id=' + encodeURIComponent(STATE.id)); render(); return; }
    var a = e.target.closest('[data-act]'); if (!a) return;
    switch (a.getAttribute('data-act')) {
      case 'retry': doRetry(); break;
      case 'internal': doInternal(); break;
      case 'viewdoc': viewDoc(); break;
      case 'opencase': openCase(); break;
      case 'fix': doFix(); break;
      case 'resolve': doResolve(); break;
      case 'toggle-states': document.getElementById('sdStates').classList.toggle('collapsed'); break;
    }
  });

  /* ---------------- boot ---------------- */
  var STATE = { id: qid() || TX[0].id };
  document.addEventListener('DOMContentLoaded', function () { render(); setInterval(tick, 6000); });
})();
