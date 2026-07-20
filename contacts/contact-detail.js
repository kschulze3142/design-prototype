/* ============================================================
   RobinDock — Contact Detail · RENDERER + INTERACTIONS
   The hub for one external Contact: identity, channels, on/off-
   network status, and the PHI exchange history. Renders into
   #appContent (the live app shell). Reuses helpers/modals/toasts
   from contacts-core.js (window.RDC). Mock data only.

   THE load-bearing distinction (decisions log #2):
     • Contact info / channels / network / facts = business data
       → viewing does NOT log a PHI access (edits = ops mutations).
     • Exchange history = PHI → opening it / opening a case from it
       = a logged view access (§6 · §8).
   ============================================================ */
(function () {
  'use strict';

  var R = window.RDC;
  var CONTACTS = window.RD_CONTACTS || [];
  var UNIDENTIFIED = window.RD_UNIDENTIFIED || [];
  var EXCHANGE = window.RD_EXCHANGE || {};
  var NOTES = window.RD_CONTACT_NOTES || {};
  var PEOPLE = window.RD_CONTACT_PEOPLE || {};
  var ADDED = window.RD_CONTACT_ADDED || {};
  var NEW_CONTACT = window.RD_NEW_CONTACT;
  var SCENARIOS = window.RD_CD_SCENARIOS || [];

  var content = document.getElementById('appContent');
  var titleEl = document.getElementById('appTitle');

  /* ---------------- local icons ---------------- */
  var I = {
    back: R.ICON.back, pin: R.ICON.pin, fax: R.ICON.fax, mail: R.ICON.mail,
    phone: R.ICON.phone, flock: R.ICON.flock, edit: R.ICON.edit, plus: R.ICON.plus,
    chev: R.ICON.chev, unknown: R.ICON.unknown, shield: R.ICON.logged,
    compose: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.8"/></svg>',
    inArr: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 7l-3 3 3 3M4 10h10a6 6 0 016 6v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    outArr: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M17 17l3-3-3-3M20 14H10a6 6 0 01-6-6V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    paw: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="11" r="1.7" fill="currentColor"/><circle cx="10" cy="7.6" r="1.7" fill="currentColor"/><circle cx="14" cy="7.6" r="1.7" fill="currentColor"/><circle cx="18" cy="11" r="1.7" fill="currentColor"/><path d="M12 12c2.2 0 4 1.7 4 3.7 0 1.5-1.2 2.2-2.7 2.2-.7 0-.9-.3-1.3-.3s-.6.3-1.3.3c-1.5 0-2.7-.7-2.7-2.2C8 13.7 9.8 12 12 12z" fill="currentColor"/></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v10m0 0l-4-4m4 4l4-4M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    caret: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arr: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l5 6-5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* type avatars */
    gp:   '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1v-7.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9v3m1.5-1.5h-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    spec: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M6 4v6a4 4 0 008 0V4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M5 4h2M13 4h2M10 14v2a4 4 0 008 0v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="13" r="2" stroke="currentColor" stroke-width="1.7"/></svg>',
    er:   '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-10a7 7 0 1114 0c0 5.5-7 10-7 10z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 7v6m3-3H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    lab:  '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6L5.5 17a2 2 0 001.8 3h9.4a2 2 0 001.8-3L14 9V3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    img:  '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 9h16M9 9v11M4 14h5" stroke="currentColor" stroke-width="1.5"/></svg>',
    pharm:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="8" width="13" height="9" rx="4.5" transform="rotate(45 10 12.5)" stroke="currentColor" stroke-width="1.6"/><path d="M8 9l5 5" stroke="currentColor" stroke-width="1.6"/></svg>',
    other:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="11" height="18" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M15 8h4a1 1 0 011 1v11a1 1 0 01-1 1h-4M8 7h3M8 11h3M8 15h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };
  function typeAvatar(cls) { return I[cls] || I.other; }

  /* ---------------- helpers ---------------- */
  function esc(s) { return R.esc(s); }
  function fmtDate(d) { return R.fmtDate(d); }

  /* ---------------- state (persisted) ---------------- */
  var STORE = 'rd_cd_scenario';
  var currentId = null, loggedId = null;
  var skeletonShown = false;

  /* resolve a contact object (real / new / unidentified) by id */
  function resolve(id) {
    if (!id) return null;
    if (id.indexOf('UN') === 0) {
      var u = UNIDENTIFIED.filter(function (x) { return x.id === id; })[0];
      if (!u) return null;
      return {
        node: u, unident: true,
        c: {
          id: u.id, name: u.number, type: null, location: 'Location unknown',
          faxes: [u.number], email: '', phone: '', network: null, active: true,
          docs30: u.docs, last: u.last, weeks: [], first: u.first
        }
      };
    }
    if (NEW_CONTACT && id === NEW_CONTACT.id) return { c: NEW_CONTACT, isNew: true };
    var found = CONTACTS.filter(function (x) { return x.id === id; })[0];
    return found ? { c: found } : null;
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render(id, opts) {
    opts = opts || {};
    var res = resolve(id);
    if (!res) { renderNotFound(id); return; }
    var c = res.c;
    currentId = id;
    localStorage.setItem(STORE, id);

    var displayName = res.unident ? 'Unidentified sender' : c.name;
    titleEl.textContent = displayName;
    document.title = 'RobinDock — ' + displayName;

    var rows = (EXCHANGE[id] || []).slice();
    rows.sort(function (a, b) { return (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0); });

    content.innerHTML =
      '<div class="cd-page">' +
        '<a class="ct-back" href="Robin Dock - Contacts.html">' + I.back + 'Back to Contacts</a>' +
        identityHeader(res) +
        '<div class="cd-body">' +
          '<div class="cd-main">' +
            (res.unident ? completionBand(res) : '') +
            (res.unident ? '' : contactInfo(res)) +
            exchangeZone(res, rows) +
          '</div>' +
          '<div class="cd-side">' +
            networkCard(res) +
            factsCard(res, rows) +
            composeCard(res) +
          '</div>' +
        '</div>' +
      '</div>';

    renderSwitcher();

    /* PHI access log — fires once per contact view (opening the
       exchange-history section). Business sections never log. */
    if (id !== loggedId && !opts.silent) {
      loggedId = id;
      if (rows.length) {
        R.toast('Exchange history opened', displayName + ' · ' + rows.length + ' record' + (rows.length === 1 ? '' : 's') + ' · PHI view logged', 'logged');
      }
    }
  }

  /* ---------- §3 · identity header ---------- */
  function identityHeader(res) {
    var c = res.c;
    if (res.unident) {
      return '<div class="cd-id unident"><div class="in">' +
        '<span class="avatar other">' + I.unknown + '</span>' +
        '<div class="meta">' +
          '<h1><span class="num-name">' + esc(c.name) + '</span> ' +
            '<span class="status-badge unident"><span class="d"></span>Unidentified sender</span></h1>' +
          '<div class="line"><span class="id">' + esc(c.id) + '</span>' +
            '<span class="dot"></span>Auto-created by ingress' +
            '<span class="dot"></span>First seen ' + fmtDate(c.first) + '</div>' +
        '</div>' +
        '<div class="actions">' +
          '<button class="btn btn-blue btn-sm" data-cd="complete">' + I.plus + 'Complete this contact</button>' +
        '</div>' +
      '</div></div>';
    }
    var cls = R.typeCls(c.type);
    var statusBadge = c.active
      ? '<span class="status-badge active"><span class="d"></span>Active</span>'
      : '<span class="status-badge inactive"><span class="d"></span>Inactive</span>';
    return '<div class="cd-id' + (c.active ? '' : ' gone') + '"><div class="in">' +
      '<span class="avatar ' + cls + '">' + typeAvatar(cls) + '</span>' +
      '<div class="meta">' +
        '<h1>' + esc(c.name) + ' ' + statusBadge + '</h1>' +
        '<div class="line">' +
          '<span class="id">' + esc(c.id) + '</span>' +
          '<span class="dot"></span>' + R.typeChip(c.type) +
          '<span class="dot"></span><span class="loc">' + I.pin + esc(c.location) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="actions">' +
        '<button class="btn btn-blue btn-sm" data-cd="compose">' + I.compose + 'Compose</button>' +
        '<button class="btn btn-light btn-sm" data-cd="edit">' + I.edit + 'Edit contact</button>' +
      '</div>' +
    '</div></div>';
  }

  /* ---------- §7 · unidentified-node completion band ---------- */
  function completionBand(res) {
    var u = res.node;
    return '<div class="complete-band">' +
      '<div class="cb-head">' +
        '<span class="cb-ic">' + I.unknown + '</span>' +
        '<div class="cb-body">' +
          '<div class="cb-flag">Complete this contact</div>' +
          '<div class="cb-why">Ingress stamped <b class="mono">' + esc(u.number) + '</b> as an unrecognized sender and created this node automatically. ' +
            'It is already a real edge — <b>' + u.docs + ' document' + (u.docs === 1 ? '' : 's') + '</b> received, shown below. ' +
            'Name it, set a type, and add channels to turn it into a proper Contact. This is the same resolution offered at triage.</div>' +
          '<div class="cb-act">' +
            '<button class="btn btn-blue btn-sm" data-cd="complete">' + I.plus + 'Name this contact</button>' +
            '<button class="btn btn-light btn-sm" data-cd="ignore">Not us — ignore</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------- §4 · contact information / channels (business data) ---------- */
  function contactInfo(res) {
    var c = res.c;
    var faxRows = c.faxes.map(function (f, i) {
      return '<div class="faxitem">' + I.fax +
        '<span class="num">' + esc(f) + '</span>' +
        (i === 0 ? '<span class="primary-tag">Primary</span>' : '<span class="desk-tag">additional</span>') +
      '</div>';
    }).join('');

    var email = c.email
      ? '<span class="chanline mono">' + I.mail + '<span class="v">' + esc(c.email) + '</span></span>'
      : '<span class="iv muted">Not on file</span>';
    var phone = c.phone
      ? '<span class="chanline mono">' + I.phone + '<span class="v">' + esc(c.phone) + '</span></span>'
      : '<span class="iv muted">Not on file</span>';

    var note = NOTES[c.id];
    var notesRow = note
      ? '<div class="inforow"><div class="il">Notes</div><div class="iv"><span class="notes-v">' + esc(note) + '</span></div></div>'
      : '<div class="inforow"><div class="il">Notes</div><div class="iv muted">No operational notes</div></div>';

    return '<div class="cd-card">' +
      '<div class="cd-chead"><h2>Contact information</h2>' +
        '<span class="tag">Business directory · not PHI</span>' +
        '<button class="edit" data-cd="edit">' + I.edit + 'Edit</button></div>' +
      '<div class="cd-info-rows">' +
        '<div class="inforow"><div class="il">Fax number' + (c.faxes.length > 1 ? 's' : '') + '</div>' +
          '<div class="iv"><div class="faxlist">' + faxRows + '</div></div></div>' +
        '<div class="inforow"><div class="il">Email</div><div class="iv">' + email + '</div></div>' +
        '<div class="inforow"><div class="il">Phone</div><div class="iv">' + phone + '</div></div>' +
        '<div class="inforow"><div class="il">Location</div><div class="iv">' +
          '<span class="chanline">' + I.pin + '<span class="v">' + esc(c.location) + '</span></span></div></div>' +
        notesRow +
      '</div>' +
      peopleBlock(c) +
    '</div>';
  }

  /* people-at-org (entity-granularity OPEN ITEM, §4) */
  function peopleBlock(c) {
    var ppl = PEOPLE[c.id];
    if (!ppl || !ppl.length) return '';
    var rows = ppl.map(function (p) {
      var inits = p.name.replace(/^Dr\.\s*/, '').split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
      return '<div class="person"><span class="pav">' + esc(inits) + '</span>' +
        '<div class="pn">' + esc(p.name) + (p.cred ? '<span class="cred">' + esc(p.cred) + '</span>' : '') + '</div>' +
        '<span class="pr">' + esc(p.role) + '</span></div>';
    }).join('');
    return '<div class="people-block">' +
      '<div class="people-head"><span class="pl">People at this practice</span>' +
        '<span class="open-q">open question</span></div>' +
      rows +
      '<div class="people-foot">Whether a Contact is an organization or a person-at-org is unresolved — pending hub-shadowing. Individuals are shown where known.</div>' +
    '</div>';
  }

  /* ---------- §6 · exchange history (PHI) ---------- */
  function exchangeZone(res, rows) {
    var c = res.c;
    var inN = rows.filter(function (r) { return r.dir === 'in'; }).length;
    var outN = rows.filter(function (r) { return r.dir === 'out'; }).length;
    var total = rows.length;
    var lastISO = rows.length ? rows[0].date : c.last;

    var head = '<div class="xch-head">' +
      '<div class="ov">Exchange history' +
        '<span class="ln"></span>' +
        '<span class="logged-chip">' + I.shield + 'Access logged</span></div>' +
      '<h2>Documents exchanged with this contact</h2>' +
      '<p>The substance of the relationship — inbound received and outbound sent. This is the one PHI section: ' +
        'opening a case from here logs a view. Reference &amp; navigation — work documents in Departments, not here.</p>' +
      summaryBand(c, rows, inN, outN, total, lastISO) +
    '</div>';

    var body;
    if (!total) {
      body = '<div class="xch-empty"><div class="ico">' + I.shield + '</div>' +
        '<h4>No exchange history yet</h4>' +
        '<p>' + esc(c.name) + ' was just added to the directory. Cases will appear here as you send to or receive from this contact.</p>' +
        '<button class="btn btn-blue btn-sm compose-empty" data-cd="compose">' + I.compose + 'Compose to ' + esc(c.name) + '</button></div>';
    } else {
      body = '<div class="xch-list">' + rows.map(exchangeRow).join('') + '</div>' +
        '<div class="xch-foot"><span class="note">' + I.shield + 'Opening a case logs a PHI view access.</span>' +
          '<button class="export" data-cd="export">' + I.download + 'Export history</button></div>';
    }

    return '<div class="cd-exchange">' + head + body + '</div>';
  }

  function summaryBand(c, rows, inN, outN, total, lastISO) {
    if (!total) return '';
    /* direction descriptor */
    var desc;
    if (inN && !outN) desc = 'All inbound';
    else if (outN && !inN) desc = 'All outbound';
    else if (Math.abs(inN - outN) <= Math.max(1, total * 0.15)) desc = 'Balanced';
    else desc = inN > outN ? 'Mostly inbound' : 'Mostly outbound';

    var inPct = total ? Math.round((inN / total) * 100) : 0;
    var spark = (c.weeks && c.weeks.length) ? R.sparkline(c.weeks) : '';
    var vol = c.docs30 != null ? c.docs30 : total;

    var balBlock = '<div class="xch-stat"><div class="k">Direction balance</div>' +
      '<div class="dirbal"><span class="in" style="width:' + inPct + '%"></span><span class="out" style="width:' + (100 - inPct) + '%"></span></div>' +
      '<div class="dirbal-legend"><span class="lg in"><span class="sw"></span><b>' + inN + '</b> received</span>' +
        '<span class="lg out"><span class="sw"></span><b>' + outN + '</b> sent</span></div>' +
      '<div class="sub" style="margin-top:5px">' + desc + '</div></div>';

    return '<div class="xch-summary">' +
      '<div class="xch-stat"><div class="k">Total exchanged</div>' +
        '<div class="v">' + total + '<span class="u">document' + (total === 1 ? '' : 's') + '</span></div>' +
        '<div class="sub">over the relationship</div></div>' +
      '<div class="xch-stat"><div class="k">Last 30 days</div>' +
        '<div class="v">' + vol + spark + '</div>' +
        '<div class="sub">Last exchanged ' + R.ago(lastISO) + '</div></div>' +
      balBlock +
    '</div>';
  }

  function exchangeRow(r) {
    var dir = r.dir === 'in' ? 'in' : 'out';
    var dirIcon = dir === 'in' ? I.inArr : I.outArr;
    var dirLbl = dir === 'in' ? 'Received' : 'Sent';
    var flock = r.flock ? '<span class="flockmark">' + I.flock + 'Flock</span>' : '';
    var pats = r.patients.map(function (p) {
      var unmatched = !p.species && /unmatched/i.test(p.name);
      return '<span class="pat' + (unmatched ? ' unmatched' : '') + '">' + I.paw + esc(p.name) +
        (p.species ? ' · ' + esc(p.species) : '') + '</span>';
    }).join('');
    var client = (r.client && r.client !== '—')
      ? '<span class="sep"></span><span class="cl">' + esc(r.client) + '</span>' : '';
    return '<div class="xch-row" data-cd="open-case" data-case="' + esc(r.id) + '" data-subject="' + esc(r.subject) + '">' +
      '<span class="xch-dir ' + dir + '" title="' + dirLbl + '">' + dirIcon + '</span>' +
      '<div class="xch-doc">' +
        '<div class="xch-subj"><span class="dirpill ' + dir + '">' + dirLbl + '</span>' + esc(r.subject) + flock + '</div>' +
        '<div class="xch-meta">' + pats + client + '<span class="sep"></span><span class="cid">' + esc(r.id) + '</span></div>' +
      '</div>' +
      '<div class="xch-right"><span class="cst ' + r.status + '"><span class="d"></span>' + statusLabel(r.status) + '</span>' +
        '<span class="xch-date">' + fmtDate(r.date) + '</span></div>' +
      '<span class="xch-chev">' + I.chev + '</span>' +
    '</div>';
  }
  function statusLabel(s) {
    return ({ new: 'New', open: 'Open', inprog: 'In progress', review: 'In review', complete: 'Complete', archived: 'Archived' })[s] || s;
  }

  /* ---------- §5 · network status card (side) ---------- */
  function networkCard(res) {
    var c = res.c;
    var net = c.network; /* 'on' | 'off' | null */
    var cls = net === 'on' ? 'on' : (net === 'off' ? 'off' : 'unk');
    var title, sub, ic;
    if (net === 'on') {
      title = 'On network'; sub = 'Also a Robin Dock org'; ic = I.flock;
    } else if (net === 'off') {
      title = 'Off network'; sub = 'Fax / email only'; ic = I.fax;
    } else {
      title = 'Network unknown'; sub = res.unident ? 'Sender not yet matched' : 'Not yet determined'; ic = I.unknown;
    }
    var badge = net === 'on' ? '<span class="flockmark">' + I.flock + 'Flock</span>' : '';
    return '<div class="cd-side-card net-card ' + cls + '">' +
      '<div class="bar" style="background:' + (net === 'on' ? 'var(--aqua-500)' : (net === 'off' ? 'var(--gray-300)' : 'var(--gray-200)')) + '"></div>' +
      '<div class="scin">' +
        '<h3>Network status</h3>' +
        '<div class="net-state"><span class="net-ic">' + ic + '</span>' +
          '<div class="net-txt"><div class="nt">' + title + ' ' + badge + '</div><div class="ns">' + sub + '</div></div></div>' +
        '<div class="net-why">' +
          (net === 'on'
            ? 'Internal structured exchange is possible with this org — the “blue bubble”. '
            : (net === 'off'
              ? 'Documents move by fax/email only. If they join Robin Dock, this becomes a structured edge. '
              : 'Whether this party is a Robin Dock org has not been resolved yet. ')) +
          '<b>Informational at v1.</b> The invite / “claim your inbox” flow is network-era. <span class="v3-pill">v3</span></div>' +
      '</div>' +
    '</div>';
  }

  /* ---------- directory facts (side · business data) ---------- */
  function factsCard(res, rows) {
    var c = res.c;
    var added = res.unident ? c.first : ADDED[c.id];
    var lastISO = rows.length ? rows[0].date : c.last;
    var typeRow = res.unident
      ? '<div class="kv"><span class="k">Type</span><span class="v" style="color:var(--gray-400);font-weight:500;font-style:italic">Unset</span></div>'
      : '<div class="kv"><span class="k">Type</span><span class="v">' + esc(R.typeLabel(c.type)) + '</span></div>';
    var statusRow = res.unident
      ? '<div class="kv"><span class="k">Status</span><span class="v" style="color:#2d7373">Unidentified</span></div>'
      : '<div class="kv"><span class="k">Status</span><span class="v">' + (c.active ? 'Active' : 'Inactive') + '</span></div>';
    return '<div class="cd-side-card">' +
      '<div class="bar" style="background:var(--blue-500)"></div>' +
      '<div class="scin">' +
        '<h3>Directory facts</h3>' +
        '<div class="kv"><span class="k">Contact ID</span><span class="v mono">' + esc(c.id) + '</span></div>' +
        typeRow +
        statusRow +
        '<div class="kv"><span class="k">Channels</span><span class="v">' +
          (c.faxes.length + ' fax' + (c.faxes.length === 1 ? '' : 'es') + (c.email ? ' · email' : '') + (c.phone ? ' · phone' : '')) + '</span></div>' +
        '<div class="kv"><span class="k">' + (res.unident ? 'First seen' : 'Added') + '</span><span class="v">' + fmtDate(added) + '</span></div>' +
        '<div class="kv"><span class="k">Last exchanged</span><span class="v">' + (lastISO ? fmtDate(lastISO) : '—') + '</span></div>' +
      '</div>' +
    '</div>';
  }

  /* ---------- compose card (directory feeds outbound, decisions #3) ---------- */
  function composeCard(res) {
    if (res.unident) return '';
    var c = res.c;
    return '<div class="compose-card">' +
      '<div class="ct">Send to this contact</div>' +
      '<div class="cs">The directory feeds outbound. Composing jumps to the recipient picker with ' + esc(c.name) + ' pre-selected.</div>' +
      '<button class="btn btn-onblock btn-sm" data-cd="compose">' + I.compose + 'Compose to contact</button>' +
    '</div>';
  }

  /* ---------- not-found (§9) ---------- */
  function renderNotFound(id) {
    titleEl.textContent = 'Contact not found';
    content.innerHTML = '<div class="cd-page">' +
      '<a class="ct-back" href="Robin Dock - Contacts.html">' + I.back + 'Back to Contacts</a>' +
      '<div class="xch-empty" style="padding:80px 24px"><div class="ico">' + I.unknown + '</div>' +
      '<h4>Contact not found</h4><p>No contact matches <span class="mono">' + esc(id || '—') + '</span>. It may have been merged or removed.</p>' +
      '<a class="btn btn-blue btn-sm" style="margin-top:16px" href="Robin Dock - Contacts.html">Back to Contacts</a></div></div>';
    renderSwitcher();
  }

  /* ============================================================
     LOADING SKELETON
     ============================================================ */
  function skeleton() {
    content.innerHTML = '<div class="cd-page">' +
      '<div class="skel" style="height:16px;width:120px;margin-bottom:16px;border-radius:6px"></div>' +
      '<div class="skel cd-skel-id"></div>' +
      '<div class="cd-skel-row"><div class="cd-skel-main">' +
        '<div class="skel" style="height:230px;border-radius:18px;margin-bottom:18px"></div>' +
        '<div class="skel" style="height:340px;border-radius:18px"></div>' +
      '</div><div class="cd-skel-side">' +
        '<div class="skel" style="height:150px;border-radius:18px;margin-bottom:16px"></div>' +
        '<div class="skel" style="height:200px;border-radius:18px"></div>' +
      '</div></div></div>';
  }

  /* ============================================================
     INTERACTIONS (delegated · data-cd)
     ============================================================ */
  function currentRes() { return resolve(currentId); }

  content.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cd]');
    if (!t) return;
    var act = t.dataset.cd;
    var res = currentRes();
    if (!res) return;
    var c = res.c;

    if (act === 'open-case') {
      /* PHI view access — logged (§6 · §8) */
      R.toast('Case opened', t.dataset.subject + ' · ' + t.dataset.case + ' · view logged', 'logged');
    } else if (act === 'compose') {
      R.toast('Opening Compose', esc(c.name) + ' pre-selected as recipient', 'flock');
    } else if (act === 'edit') {
      if (res.unident) { R.resolveNodeModal(res.node); return; }
      R.editContactModal(c);
    } else if (act === 'complete') {
      R.resolveNodeModal(res.node);
    } else if (act === 'ignore') {
      R.toast('Marked ignored', esc(c.name) + ' hidden from the directory · logged');
    } else if (act === 'export') {
      R.toast('Exchange history exported', esc(c.name) + ' · higher-sensitivity access logged', 'logged');
    }
  });

  /* ============================================================
     PROTOTYPE SCENARIO SWITCHER
     ============================================================ */
  function switcherEl() { return document.getElementById('cdStates'); }
  function renderSwitcher() {
    var el = switcherEl();
    if (!el) {
      el = document.createElement('div');
      el.id = 'cdStates';
      el.className = 'cd-states';
      if (localStorage.getItem('rd_cd_switcher_collapsed') === '1') el.classList.add('collapsed');
      document.body.appendChild(el);
      bindSwitcher(el);
    }
    var collapsed = el.classList.contains('collapsed');
    var items = SCENARIOS.map(function (s) {
      var on = s.id === currentId;
      return '<div class="scenario' + (on ? ' on' : '') + '" data-scenario="' + s.id + '">' +
        '<span class="sd"></span><div class="stxt"><div class="sl">' + esc(s.label) + '</div>' +
        '<div class="sh">' + esc(s.hint) + '</div></div></div>';
    }).join('');
    el.innerHTML =
      '<div class="csh" data-switch="toggle"><span class="dt"></span><span class="lbl">Contact scenarios</span>' +
        '<span class="sub">demo</span><span class="caret">' + I.caret + '</span></div>' +
      '<div class="csbody">' + items +
        '<div class="cshint">Each cycles an edge case from §9 — network status, multi-fax, inactive, empty history, and the unidentified auto-node.</div>' +
      '</div>';
    if (collapsed) el.classList.add('collapsed');
  }
  function bindSwitcher(el) {
    el.addEventListener('click', function (e) {
      var tog = e.target.closest('[data-switch="toggle"]');
      if (tog) {
        el.classList.toggle('collapsed');
        localStorage.setItem('rd_cd_switcher_collapsed', el.classList.contains('collapsed') ? '1' : '0');
        return;
      }
      var s = e.target.closest('[data-scenario]');
      if (s) {
        var id = s.dataset.scenario;
        if (id === currentId) return;
        loggedId = null;
        if (location.hash !== '#' + id) { history.replaceState(null, '', '#' + id); }
        skeleton();
        renderSwitcher();
        setTimeout(function () { render(id); }, 320);
      }
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function initialId() {
    var h = (location.hash || '').replace(/^#/, '').trim();
    if (h && resolve(h)) return h;
    var stored = localStorage.getItem(STORE);
    if (stored && resolve(stored)) return stored;
    return (SCENARIOS[0] && SCENARIOS[0].id) || 'CT-007';
  }

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace(/^#/, '').trim();
    if (h && h !== currentId && resolve(h)) {
      loggedId = null;
      skeleton(); renderSwitcher();
      setTimeout(function () { render(h); }, 280);
    }
  });

  function boot() {
    var id = initialId();
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    skeleton();
    setTimeout(function () { render(id); }, 360);
  }
  boot();
})();
