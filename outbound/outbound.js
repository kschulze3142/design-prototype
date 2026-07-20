/* ============================================================
   RobinDock — Outbound / Sent list (delivery tracking) · CONTROLLER
   Renders the log of sent transmissions with delivery status as the
   headline, plus a detail drawer that draws the per-transmission
   state machine (queued → sent → delivered; retry ×3 → failed;
   try-internal on terminal fax-fail to an on-network recipient).
   Delivery states advance live on a ticker. Prototype / mock only.
   ============================================================ */
(function () {
  'use strict';

  var D = window.RD_OUTBOUND;
  var TX = D.TX, TYPES = D.TYPES, SRC = D.SRC;
  var NOW = new Date(D.NOW);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  var I = {
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkSm: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alert: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    alertSm: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/></svg>',
    clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plane: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l14-7-7 16-2-6-5-3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    fax: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 8V4h10v4M5 8h14a2 2 0 012 2v6a2 2 0 01-2 2h-2v-4H7v4H5a2 2 0 01-2-2v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    spec: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 19l14-7L5 5v5l8 2-8 2v5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    rec: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 10h6M9 14h6M9 18h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.7"/></svg>',
    retry: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 10-1.5 5.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M20 5v6h-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    internal: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 11v3.5A1.5 1.5 0 009.5 16H13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    caseic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 8a2 2 0 012-2h3l2 2h7a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    x: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    logged: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#838599" stroke-width="1.8"/><path d="M16 16l4 4" stroke="#838599" stroke-width="1.8" stroke-linecap="round"/></svg>',
    sortic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 4v16M7 20l-3-3M7 4l3 3M17 20V4M17 4l3 3M17 20l-3-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    inbox: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 13l2.5-7A2 2 0 018.4 4.6h7.2A2 2 0 0117.5 6L20 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13h4l1.5 2.5h5L16 13h4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'
  };
  function srcIcon(type) { return type === 'gp' ? I.rec : type === 'er' ? I.fax : (type === 'lab' || type === 'imaging') ? I.rec : I.spec; }
  function srcCls(type) { return SRC[type] || 'other'; }

  /* ---------------- time formatting ---------------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function clock12(d) { var h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + pad(m) + ' ' + ap; }
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dayDiff(d) { var a = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()); var b = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return Math.round((a - b) / 86400000); }
  function relTime(iso) {
    if (!iso) return '—';
    var d = new Date(iso), ms = NOW - d, m = Math.round(ms / 60000), dd = dayDiff(d);
    if (m < 1) return 'just now';
    if (m < 60) return m + ' min ago';
    if (dd === 0) { var h = Math.round(m / 60); return h + ' hr ago'; }
    if (dd === 1) return 'Yesterday';
    return MON[d.getMonth()] + ' ' + d.getDate();
  }
  function absTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return (dayDiff(d) === 0 ? '' : MON[d.getMonth()] + ' ' + d.getDate() + ', ') + clock12(d);
  }

  /* ---------------- status meta ---------------- */
  var STORDER = { failed: 0, retrying: 1, queued: 2, sent: 3, delivered: 4 };
  function statusCell(tx) {
    var s = tx.status;
    if (s === 'delivered') return '<div class="dstat delivered"><span class="ds-ic">' + I.check + '</span><span class="ds-tx">Delivered<span class="ds-sub">' + relTime(tx.settled) + '</span></span></div>';
    if (s === 'failed') return '<div class="dstat failed"><span class="ds-ic">' + I.alert + '</span><span class="ds-tx">Failed<span class="ds-sub">after ' + (tx.retry ? tx.retry.of : 3) + ' attempts</span></span></div>';
    if (s === 'retrying') return '<div class="dstat retrying"><span class="ds-ic"><span class="ds-spin"></span></span><span class="ds-tx">Retrying<span class="ds-sub">attempt ' + tx.retry.n + ' of ' + tx.retry.of + '</span></span></div>';
    if (s === 'queued') return '<div class="dstat queued"><span class="ds-ic ds-pulse">' + I.clock + '</span><span class="ds-tx">Queued<span class="ds-sub">awaiting transmission</span></span></div>';
    return '<div class="dstat sent"><span class="ds-ic ds-pulse">' + I.plane + '</span><span class="ds-tx">Sent<span class="ds-sub">' + (tx.slow ? 'confirmation delayed' : 'awaiting confirmation') + '</span></span></div>';
  }
  function isInflight(tx) { return tx.status === 'queued' || tx.status === 'sent' || tx.status === 'retrying'; }
  function isAttn(tx) { return tx.status === 'failed'; }

  /* ---------------- filtering ---------------- */
  var V = { seg: 'all', sort: 'recent', q: '', sel: null, sortOpen: false };
  function inSeg(tx) {
    if (V.seg === 'all') return true;
    if (V.seg === 'inprogress') return isInflight(tx);
    if (V.seg === 'delivered') return tx.status === 'delivered';
    if (V.seg === 'attention') return tx.status === 'failed' || tx.status === 'retrying';
    return true;
  }
  function matchQ(tx) {
    if (!V.q) return true;
    var q = V.q.toLowerCase();
    return tx.recip.name.toLowerCase().indexOf(q) >= 0 || tx.doc.name.toLowerCase().indexOf(q) >= 0 ||
      (tx.caseSubject || '').toLowerCase().indexOf(q) >= 0 || tx.id.toLowerCase().indexOf(q) >= 0;
  }
  function filtered() {
    var list = TX.filter(function (t) { return inSeg(t) && matchQ(t); });
    list.sort(function (a, b) {
      if (V.sort === 'status') return STORDER[a.status] - STORDER[b.status] || (new Date(b.sent) - new Date(a.sent));
      if (V.sort === 'recipient') return a.recip.name.localeCompare(b.recip.name);
      return new Date(b.sent) - new Date(a.sent);
    });
    return list;
  }
  function counts() {
    var c = { all: TX.length, inprogress: 0, delivered: 0, attention: 0, failed: 0, sentToday: 0 };
    TX.forEach(function (t) {
      if (isInflight(t)) c.inprogress++;
      if (t.status === 'delivered') c.delivered++;
      if (t.status === 'failed' || t.status === 'retrying') c.attention++;
      if (t.status === 'failed') c.failed++;
      if (dayDiff(new Date(t.sent)) === 0) c.sentToday++;
    });
    return c;
  }

  /* ---------------- row ---------------- */
  function typeBadge(type) { var t = TYPES[type] || { label: type, cls: 'ty-cov' }; return '<span class="tybadge ' + t.cls + '">' + esc(t.label) + '</span>'; }
  function rowActions(tx) {
    var a = '<div class="acts">';
    if (tx.status === 'failed') {
      a += '<span class="act-btn retry" data-act="retry" data-id="' + tx.id + '">' + I.retry + 'Resend</span>';
      if (tx.internalEligible) a += '<span class="act-btn internal" data-act="internal" data-id="' + tx.id + '">' + I.internal + 'Try internal</span>';
    }
    a += '<span class="act-icon" data-act="viewdoc" data-id="' + tx.id + '" title="View document">' + I.eye + '</span></div>';
    return a;
  }
  function row(tx) {
    var net = tx.recip.network === 'on' ? '<span class="netchip on" style="font-size:9.5px;padding:1px 7px"><span class="d"></span>On-net</span>' : '';
    return '<tr data-id="' + tx.id + '"' + (tx.id === V.sel ? ' class="sel"' : (isAttn(tx) ? ' class="attn"' : '')) + '>' +
      '<td><div class="rcell"><div class="sq ' + srcCls(tx.recip.type) + '">' + srcIcon(tx.recip.type) + '</div>' +
      '<div><div class="rn">' + esc(tx.recip.raw || tx.recip.name) + '</div>' +
      '<div class="rs">' + esc(tx.recip.loc || 'Direct fax') + ' ' + net + '</div></div></div></td>' +
      '<td class="col-doc"><div class="docell"><span class="ti"></span><div><div class="dn">' + esc(tx.doc.name) + '</div>' +
      '<div class="dm">' + typeBadge(tx.doc.type) + '<span class="pagecount">' + tx.doc.pages + 'p</span></div></div></div></td>' +
      '<td>' + statusCell(tx) + '</td>' +
      '<td class="col-times"><div class="ts-cell"><span class="rel">' + relTime(tx.sent) + '</span><div class="abs">' + absTime(tx.sent) + '</div></div></td>' +
      '<td class="col-case">' + (tx.caseId ? '<span class="caselink" data-act="opencase" data-id="' + tx.id + '">' + esc(tx.caseId) + '</span>' : '<span class="casenone">—</span>') + '</td>' +
      '<td class="right">' + rowActions(tx) + '</td></tr>';
  }

  /* ---------------- page ---------------- */
  function tile(seg, n, label, cls, ic, bar) {
    return '<button class="ob-tile' + (cls === 'attn' ? ' attn' : '') + (V.seg === seg ? ' on' : '') + '" data-seg="' + seg + '">' +
      '<div class="bar" style="background:' + bar + '"></div><div class="in">' +
      '<span class="ic" style="background:' + bar.replace('0.0', '0.0') + ';' + ic.style + '">' + ic.svg + '</span>' +
      '<div><div class="n" id="tile-' + seg + '">' + n + '</div><div class="l">' + label + '</div></div></div></button>';
  }
  function renderPage() {
    var c = counts();
    var root = document.getElementById('appContent');
    var tiles =
      tile('delivered', c.delivered, 'Delivered', '', { svg: I.check, style: 'background:var(--ok-bg);color:var(--ok)' }, 'var(--ok)') +
      tile('inprogress', c.inprogress, 'In flight', '', { svg: I.plane, style: 'background:var(--blue-50);color:var(--blue-600)' }, 'var(--blue-500)') +
      tile('attention', c.attention, 'Needs attention', 'attn', { svg: I.alert, style: 'background:var(--bad-bg);color:var(--bad)' }, 'var(--bad)') +
      tile('all', c.sentToday, 'Sent today', '', { svg: I.clock, style: 'background:var(--gray-100);color:var(--gray-500)' }, 'var(--gray-300)');

    var segs = [['all', 'All', c.all], ['inprogress', 'In progress', c.inprogress], ['delivered', 'Delivered', c.delivered], ['attention', 'Needs attention', c.attention]]
      .map(function (s) {
        return '<div class="seg' + (V.seg === s[0] ? ' on' : '') + '" data-seg="' + s[0] + '">' + s[1] + ' <span class="n" id="segc-' + s[0] + '">' + s[2] + '</span></div>';
      }).join('');

    root.innerHTML = '<div class="ob">' +
      '<div class="page-head"><div class="ph-main"><h1>Outbound</h1>' +
      '<div class="ph-sub">Delivery tracking — every document you’ve sent and whether it went through. No black box: each fax shows where it is, retries on its own, and tells you when it’s confirmed received.</div></div>' +
      '<div class="ph-actions"><a class="btn btn-blue" href="../compose/Robin Dock - Composer.html">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.8"/></svg>Compose</a></div></div>' +
      '<div class="ob-summary">' + tiles + '</div>' +
      '<div class="ob-tools"><div class="segs">' + segs + '</div>' +
      '<div class="ct-search"><div class="search" style="max-width:none">' + I.search +
      '<input id="obSearch" placeholder="Search recipient, document, case…" value="' + esc(V.q) + '"/></div></div>' +
      '<div style="position:relative"><div class="ob-sort" data-act="sort-toggle"><span class="lbl">Sort</span>' + sortLabel() + '<span class="ch">▾</span></div>' + sortMenu() + '</div></div>' +
      '<div class="ob-tablewrap"><table class="obt"><thead><tr>' +
      '<th data-sort="recipient">Recipient' + sarrow('recipient') + '</th>' +
      '<th class="col-doc nosort">Document</th>' +
      '<th data-sort="status">Delivery status' + sarrow('status') + '</th>' +
      '<th class="col-times" data-sort="recent">Sent' + sarrow('recent') + '</th>' +
      '<th class="col-case nosort">Case</th>' +
      '<th class="right nosort">Actions</th></tr></thead>' +
      '<tbody id="obTbody"></tbody></table>' +
      '<div class="ob-foot" id="obFoot"></div></div></div>';
    refreshTable();
  }
  function sortLabel() { return '<b style="color:var(--gray-950)">' + (V.sort === 'recent' ? 'Most recent' : V.sort === 'status' ? 'Status' : 'Recipient') + '</b>'; }
  function sarrow(k) { return V.sort === k ? ' <span class="sar">' + (k === 'recipient' ? '▲' : '▼') + '</span>' : ''; }
  function sortMenu() {
    var opts = [['recent', 'Most recent'], ['status', 'Delivery status'], ['recipient', 'Recipient']];
    return '<div class="ob-sortmenu' + (V.sortOpen ? ' open' : '') + '" id="obSortMenu">' + opts.map(function (o) {
      return '<button data-sortset="' + o[0] + '" class="' + (V.sort === o[0] ? 'on' : '') + '">' + o[1] + '<span class="ck">' + I.checkSm + '</span></button>';
    }).join('') + '</div>';
  }
  function refreshTable() {
    var list = filtered();
    var tb = document.getElementById('obTbody'); if (!tb) return;
    tb.innerHTML = list.length ? list.map(row).join('')
      : '<tr><td colspan="6"><div class="ob-empty"><div class="ico">' + I.inbox + '</div><h4>Nothing here</h4><p>No sent documents match this view.</p></div></td></tr>';
    var foot = document.getElementById('obFoot');
    if (foot) foot.innerHTML = '<span><b>' + list.length + '</b> transmission' + (list.length === 1 ? '' : 's') + '</span>' +
      '<span class="dw-logged" style="width:auto;margin:0;justify-content:flex-end">' + I.logged + 'Viewing this list is logged</span>';
    var c = counts();
    ['all', 'inprogress', 'delivered', 'attention'].forEach(function (s) {
      var e = document.getElementById('segc-' + s); if (e) e.textContent = c[s];
      var t = document.getElementById('tile-' + s); if (t) t.textContent = (s === 'all' ? c.sentToday : c[s]);
    });
  }

  /* ---------------- drawer ---------------- */
  function drawerHost() {
    var h = document.getElementById('obDrawerHost');
    if (!h) { h = document.createElement('div'); h.id = 'obDrawerHost'; document.body.appendChild(h); }
    return h;
  }
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
      var ic = bad ? I.alertSm : done ? I.checkSm : (active ? (retrying ? '<span class="ds-spin" style="width:11px;height:11px"></span>' : I.plane) : '');
      html += '<div class="node ' + cls + '"><div class="dot">' + ic + '</div><div class="nl">' + (bad ? 'failed' : n) + '</div></div>';
      if (i < nodes.length - 1) { var segDone = reached[nodes[i + 1]] || (nodes[i + 1] === 'delivered' && tx.status === 'delivered'); html += '<div class="seg' + (segDone && !failed ? ' done' : '') + '"></div>'; }
    });
    return '<div class="machine">' + html + '</div>';
  }
  function evItem(e) {
    var k = e[0], svg = k === 'delivered' || k === 'internal' ? I.checkSm : k === 'failed' ? I.alertSm : k === 'retry' ? I.retry : k === 'sent' ? I.plane : I.clock;
    var label = k === 'retry' ? 'Retry' : k === 'internal' ? 'Delivered internally' : k;
    return '<div class="ev ' + k + '"><span class="ed">' + svg + '</span><div class="etx"><div class="et">' + esc(label) + '</div>' +
      (e[2] ? '<div class="en">' + esc(e[2]) + '</div>' : '') + '<div class="ew">' + absTime(e[1]) + '</div></div></div>';
  }
  function statusBig(tx) {
    var rt = tx.retry || { n: 0, of: 3 };
    var map = {
      delivered: [I.check, 'Delivered', 'Confirmed received by the recipient' + (tx.settled ? ' at ' + absTime(tx.settled) : '') + (tx.resent ? ' (after a manual resend)' : '')],
      failed: [I.alert, 'Delivery failed', 'Terminal failure after ' + rt.of + ' automatic attempts. Resend to try again' + (tx.internalEligible ? ', or try internal delivery.' : '.')],
      retrying: ['<span class="ds-spin" style="width:18px;height:18px"></span>', 'Retrying automatically', 'Attempt ' + rt.n + ' of ' + rt.of + ' — backing off between tries. No action needed.'],
      queued: [I.clock, 'Queued', 'Accepted and waiting to be handed to the fax transport.'],
      sent: [I.plane, 'Sent — awaiting confirmation', tx.slow ? 'Handed to the carrier; delivery confirmation is delayed (normal for some lines). Not yet confirmed delivered.' : 'Handed to the fax transport. Waiting on the carrier’s delivery confirmation.']
    };
    var m = map[tx.status];
    return '<div class="dw-statusbig ' + tx.status + '"><span class="sic">' + m[0] + '</span><div><div class="st-t">' + m[1] + '</div><div class="st-s">' + esc(m[2]) + '</div></div></div>';
  }
  function drawerInner(tx) {
    var t = TYPES[tx.doc.type] || { label: tx.doc.type };
    var net = tx.recip.network === 'on' ? '<span class="netchip on"><span class="d"></span>On-network</span>' : '<span class="netchip off"><span class="d"></span>Off-network · fax</span>';
    var foot = '';
    foot += '<button class="btn btn-light" data-act="viewdoc" data-id="' + tx.id + '">' + I.eye + 'View document</button>';
    if (tx.caseId) foot += '<button class="btn btn-light" data-act="opencase" data-id="' + tx.id + '">' + I.caseic + 'Open Case</button>';
    if (tx.status === 'failed') foot += '<button class="btn btn-blue" data-act="retry" data-id="' + tx.id + '">' + I.retry + 'Resend</button>';
    if (tx.status === 'failed' && tx.internalEligible) foot += '<button class="btn btn-violet" data-act="internal" data-id="' + tx.id + '">' + I.internal + 'Try internal</button>';

    return '<div class="dw-head"><div class="dw-top"><span class="txid">' + esc(tx.id) + '</span><span class="x" data-act="close-drawer">' + I.x + '</span></div>' +
      '<div class="dw-recip"><div class="sq ' + srcCls(tx.recip.type) + '">' + srcIcon(tx.recip.type) + '</div>' +
      '<div><div class="nm">' + esc(tx.recip.raw || tx.recip.name) + '</div>' +
      '<div class="sb"><span style="font-family:var(--f-mono);font-size:11.5px">Fax</span> ' + esc(tx.recip.loc || 'Direct fax') + ' ' + net + '</div></div></div></div>' +
      '<div class="dw-body">' + statusBig(tx) +
      machineTrack(tx) +
      '<div class="dw-sec">Document</div>' +
      '<div class="dw-kv"><span class="k">File</span><span class="v">' + esc(tx.doc.name) + '</span></div>' +
      '<div class="dw-kv"><span class="k">Type</span><span class="v">' + esc(t.label) + '</span></div>' +
      '<div class="dw-kv"><span class="k">Pages</span><span class="v">' + tx.doc.pages + '</span></div>' +
      (tx.caseId ? '<div class="dw-kv"><span class="k">Case</span><span class="v"><a data-act="opencase" data-id="' + tx.id + '">' + esc(tx.caseId) + ' · ' + esc(tx.caseSubject) + '</a></span></div>' : '') +
      '<div class="dw-kv"><span class="k">Sent</span><span class="v">' + absTime(tx.sent) + '</span></div>' +
      (tx.internalEligible && tx.status === 'failed' ? '<div class="internal-note">' + I.internal + '<div><b>This recipient is on Robin Dock.</b> Fax delivery failed, but you can deliver the document over the network instead. (Network transport is latent in this prototype.)</div></div>' : '') +
      '<div class="dw-sec">Transmission history</div><div class="evlist">' + tx.events.slice().reverse().map(evItem).join('') + '</div>' +
      '</div>' +
      '<div class="dw-foot">' + foot + '<div class="dw-logged">' + I.logged + 'Opening the document logs a PHI view · retries are logged</div></div>';
  }
  function goDetail(id) {
    var tx = TX.filter(function (t) { return t.id === id; })[0]; if (!tx) return;
    window.location.href = 'Robin Dock - Sent Detail.html?id=' + encodeURIComponent(id);
  }
  function openDrawer(id) {
    var tx = TX.filter(function (t) { return t.id === id; })[0]; if (!tx) return;
    V.sel = id;
    var h = drawerHost();
    h.innerHTML = '<div class="drawer-scrim" data-act="close-drawer"></div><div class="drawer" id="obDrawer">' + drawerInner(tx) + '</div>';
    requestAnimationFrame(function () {
      var s = h.querySelector('.drawer-scrim'), d = h.querySelector('.drawer');
      if (s) s.classList.add('open'); if (d) d.classList.add('open');
    });
    refreshTable();
  }
  function updateDrawer() {
    if (!V.sel) return;
    var d = document.getElementById('obDrawer'); if (!d) return;
    var tx = TX.filter(function (t) { return t.id === V.sel; })[0]; if (!tx) return;
    d.innerHTML = drawerInner(tx);
  }
  function closeDrawer() {
    var h = document.getElementById('obDrawerHost'); if (!h) return;
    var s = h.querySelector('.drawer-scrim'), d = h.querySelector('.drawer');
    if (s) s.classList.remove('open'); if (d) d.classList.remove('open');
    V.sel = null;
    setTimeout(function () { h.innerHTML = ''; refreshTable(); }, 240);
  }

  /* ---------------- actions ---------------- */
  function nowISO(offsetMin) { var d = new Date(NOW.getTime() + (offsetMin || 0) * 60000); return d.toISOString().slice(0, 19); }
  function byId(id) { return TX.filter(function (t) { return t.id === id; })[0]; }
  function doRetry(id) {
    var tx = byId(id); if (!tx) return;
    tx.status = 'retrying'; tx.retry = { n: 1, of: 3 }; tx.settled = null;
    tx.events.push(['sent', nowISO(), 'Manual resend by Kai Sandoval']);
    tx._resolveAt = Date.now() + 4200; tx._resolveTo = 'delivered';
    logToast('Resending · ' + esc(tx.recip.name), 'Re-dispatching the fax · logged.');
    if (V.sel === id) updateDrawer();
    refreshTable();
  }
  function doInternal(id) {
    var tx = byId(id); if (!tx) return;
    tx.status = 'retrying'; tx.retry = { n: 1, of: 1 }; tx.settled = null;
    tx.events.push(['internal', nowISO(), 'Routing over Robin Dock network…']);
    tx._resolveAt = Date.now() + 3000; tx._resolveTo = 'internal';
    logToast('Trying internal · ' + esc(tx.recip.name), 'Delivering over the network · logged.');
    if (V.sel === id) updateDrawer();
    refreshTable();
  }
  function viewDoc(id) {
    var tx = byId(id); if (!tx) return;
    logToast('Opening document', esc(tx.doc.name) + ' · access logged (PHI view).');
  }
  function openCase() { window.location.href = '../cases/Robin Dock - Cases.html'; }

  /* ---------------- live ticker ---------------- */
  function tick() {
    var changed = false, t = Date.now();
    TX.forEach(function (tx) {
      // resolve manual retry / internal
      if (tx._resolveAt && t >= tx._resolveAt) {
        if (tx._resolveTo === 'internal') { tx.status = 'delivered'; tx.settled = nowISO(); tx.events.push(['delivered', nowISO(), 'Confirmed delivered over the network']); }
        else { tx.status = 'delivered'; tx.settled = nowISO(); tx.events.push(['delivered', nowISO(), 'Confirmed received']); }
        tx.retry = null; tx._resolveAt = null; changed = true;
      }
    });
    // gently advance ONE natural in-flight item per tick (not the slow/honest one)
    var cand = TX.filter(function (tx) { return !tx._resolveAt && !tx.slow && isInflight(tx); });
    if (cand.length && Math.random() < 0.6) {
      var tx = cand[0];
      if (tx.status === 'queued') { tx.status = 'sent'; tx.events.push(['sent', nowISO(), 'Handed to Telnyx fax · awaiting confirmation']); changed = true; }
      else if (tx.status === 'sent') { tx.status = 'delivered'; tx.settled = nowISO(); tx.events.push(['delivered', nowISO(), 'Confirmed received · ' + tx.doc.pages + ' page' + (tx.doc.pages === 1 ? '' : 's')]); changed = true; }
      else if (tx.status === 'retrying') {
        if (tx.retry.n < tx.retry.of) { tx.retry.n++; tx.events.push(['retry', nowISO(), 'Attempt ' + tx.retry.n + ' in progress']); }
        else { tx.status = 'delivered'; tx.settled = nowISO(); tx.retry = null; tx.events.push(['delivered', nowISO(), 'Confirmed received after retry']); }
        changed = true;
      }
    }
    if (changed) { refreshTable(); if (V.sel) updateDrawer(); }
  }

  /* ---------------- toast ---------------- */
  function logToast(t, s) {
    var host = document.getElementById('logToasts'); if (!host) return;
    var el = document.createElement('div'); el.className = 'logtoast';
    el.innerHTML = '<span class="lic">' + I.logged + '</span><div><div class="lt">' + t + '</div><div class="ls">' + s + '</div></div>';
    host.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 320); }, 4200);
  }

  /* ---------------- events ---------------- */
  document.addEventListener('input', function (e) {
    if (e.target.id === 'obSearch') { V.q = e.target.value; refreshTable(); }
  });
  document.addEventListener('click', function (e) {
    var sortEl = e.target.closest('.ob-sort,[data-sortset]');
    if (V.sortOpen && !sortEl) { V.sortOpen = false; var m = document.getElementById('obSortMenu'); if (m) m.classList.remove('open'); }

    var a = e.target.closest('[data-act],[data-seg],[data-sort],[data-sortset]');
    if (!a) {
      var tr0 = e.target.closest('tr[data-id]');
      if (tr0) goDetail(tr0.getAttribute('data-id'));
      return;
    }
    var act = a.getAttribute('data-act');

    if (a.hasAttribute('data-seg')) { V.seg = a.getAttribute('data-seg'); document.querySelectorAll('[data-seg]').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-seg') === V.seg && el.classList.contains('seg')); }); document.querySelectorAll('.ob-tile').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-seg') === V.seg); }); document.querySelectorAll('.seg').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-seg') === V.seg); }); refreshTable(); return; }
    if (a.hasAttribute('data-sort')) { V.sort = a.getAttribute('data-sort'); renderPage(); return; }
    if (a.hasAttribute('data-sortset')) { V.sort = a.getAttribute('data-sortset'); V.sortOpen = false; renderPage(); return; }

    if (act) e.stopPropagation();
    switch (act) {
      case 'sort-toggle': V.sortOpen = !V.sortOpen; document.getElementById('obSortMenu').classList.toggle('open', V.sortOpen); return;
      case 'retry': doRetry(a.getAttribute('data-id')); return;
      case 'internal': doInternal(a.getAttribute('data-id')); return;
      case 'viewdoc': viewDoc(a.getAttribute('data-id')); return;
      case 'opencase': openCase(); return;
      case 'close-drawer': closeDrawer(); return;
    }
    // row click → detail page
    var tr = e.target.closest('tr[data-id]');
    if (tr) goDetail(tr.getAttribute('data-id'));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (V.sel) closeDrawer(); } });

  /* ---------------- shell chrome ---------------- */
  function shell() {
    var rt = document.getElementById('railToggle');
    if (rt) rt.addEventListener('click', function () { document.getElementById('app').classList.toggle('collapsed'); });
    var bell = document.getElementById('bellBtn'), notif = document.getElementById('notifPanel');
    var ub = document.getElementById('userBtn'), up = document.getElementById('userPanel');
    document.addEventListener('click', function (e) {
      if (bell && bell.contains(e.target)) { notif.classList.toggle('open'); if (up) up.classList.remove('open'); }
      else if (notif && !notif.contains(e.target)) notif.classList.remove('open');
      if (ub && ub.contains(e.target)) { up.classList.toggle('open'); if (notif) notif.classList.remove('open'); }
      else if (up && !up.contains(e.target) && !(ub && ub.contains(e.target))) up.classList.remove('open');
    });
  }

  document.addEventListener('DOMContentLoaded', function () { shell(); renderPage(); setInterval(tick, 7000); });
})();
