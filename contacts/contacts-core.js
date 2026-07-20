/* ============================================================
   RobinDock — Contacts prototype · CORE
   Shared helpers, icons, search/sort/filter logic, type chips,
   network markers, activity sparkline, channel cells, plus the
   access-logged toasts and Add/Edit/Resolve modals.
   Consumed by contacts-directions.js + contacts-app.js.
   ============================================================ */
(function () {
  'use strict';

  var TYPES = window.RD_CONTACT_TYPES;
  var TYPE_ORDER = window.RD_TYPE_ORDER;

  /* ---------------- icons ---------------- */
  var ICON = {
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#838599" stroke-width="1.8"/><path d="M16 16l4 4" stroke="#838599" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.7"/></svg>',
    fax: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 9V4h10v5M7 18h10v3H7zM5 9h14a2 2 0 012 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 4h3l1.5 4-2 1.2a11 11 0 0 0 4.3 4.3L18 15l1 3v2a1 1 0 0 1-1 1A14 14 0 0 1 4 7a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    mail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M5 8l7 5 7-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 14c.5-3 1.2-5.5 3-7 1.4-1.2 3.2-1.2 4.4.2.8 1 1.2 2 2.6 2h3l-2 1.6v3.4c0 2-1.6 3.8-4 3.8H6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    pin: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.2" stroke="currentColor" stroke-width="1.6"/></svg>',
    unknown: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9.3 9a2.7 2.7 0 015.2 1c0 1.8-2.7 2.5-2.7 2.5M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>',
    logged: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    saved: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="11" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 16c.5-1.6 1.7-2.2 3-2.2s2.5.6 3 2.2M15 9h3M15 13h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    focus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 9V5a1 1 0 011-1h4M20 9V5a1 1 0 00-1-1h-4M4 15v4a1 1 0 001 1h4M20 15v4a1 1 0 01-1 1h-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    grid: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function digits(s) { return String(s).replace(/\D/g, ''); }
  function ts(iso) { return iso ? (Date.parse(iso + 'T00:00:00') || 0) : 0; }
  var TODAY = ts('2026-06-11');
  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  /* relative "x days/weeks ago" for last-exchanged */
  function ago(iso) {
    if (!iso) return '—';
    var days = Math.round((TODAY - ts(iso)) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 14) return days + 'd ago';
    if (days < 60) return Math.round(days / 7) + 'w ago';
    if (days < 365) return Math.round(days / 30) + 'mo ago';
    return Math.round(days / 365) + 'y ago';
  }
  function typeLabel(t) { return (TYPES[t] || {}).label || t; }
  function typeShort(t) { return (TYPES[t] || {}).short || t; }
  function typeCls(t) { return (TYPES[t] || {}).cls || 'other'; }

  function highlight(text, q) {
    if (!q) return esc(text);
    var lt = String(text).toLowerCase(), lq = q.toLowerCase();
    var i = lt.indexOf(lq);
    if (i < 0) return esc(text);
    var out = '', idx = 0;
    while (i >= 0) {
      out += esc(String(text).slice(idx, i)) + '<span class="hl">' + esc(String(text).slice(i, i + q.length)) + '</span>';
      idx = i + q.length; i = lt.indexOf(lq, idx);
    }
    return out + esc(String(text).slice(idx));
  }

  /* ---------------- search / filter / sort ---------------- */
  /* Search matches name, fax number, email, location/city (§5).
     "who is (801) 555-0142?" — number search is first-class. */
  function contactMatch(c, q) {
    if (!q) return true;
    var lq = q.toLowerCase(), dq = digits(q);
    if (c.name.toLowerCase().indexOf(lq) >= 0) return true;
    if (c.location.toLowerCase().indexOf(lq) >= 0) return true;
    if (c.email && c.email.toLowerCase().indexOf(lq) >= 0) return true;
    if (typeLabel(c.type).toLowerCase().indexOf(lq) >= 0) return true;
    if (dq.length >= 3) {
      if (c.faxes.some(function (f) { return digits(f).indexOf(dq) >= 0; })) return true;
      if (digits(c.phone).indexOf(dq) >= 0) return true;
    }
    return false;
  }
  function unidentifiedMatch(u, q) {
    if (!q) return true;
    var lq = q.toLowerCase(), dq = digits(q);
    if (dq.length >= 3 && digits(u.number).indexOf(dq) >= 0) return true;
    if ('unidentified unknown unnamed'.indexOf(lq) >= 0) return true;
    if (u.hint && u.hint.toLowerCase().indexOf(lq) >= 0) return true;
    return false;
  }

  /* state shape: { q, sort:'name'|'activity'|'type', type:'all'|key,
                    network:'all'|'on'|'off', showInactive:bool } */
  function filterContacts(list, state) {
    var q = (state.q || '').trim();
    return list.filter(function (c) {
      if (!contactMatch(c, q)) return false;
      if (state.type && state.type !== 'all' && c.type !== state.type) return false;
      if (state.network && state.network !== 'all' && c.network !== state.network) return false;
      if (!state.showInactive && !c.active && !q) return false;
      return true;
    });
  }
  function sortContacts(rows, sort) {
    var by = sort || 'name';
    return rows.slice().sort(function (a, b) {
      if (by === 'activity') return ts(b.last) - ts(a.last) || a.name.localeCompare(b.name);
      if (by === 'type') {
        var d = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
        return d || a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
  }
  function filterUnidentified(list, state) {
    var q = (state.q || '').trim();
    // unidentified nodes ignore the type/network/active filters (they have none yet)
    if (state.network === 'on') return []; // an unclaimed node is never on-network
    return list.filter(function (u) { return unidentifiedMatch(u, q); })
      .sort(function (a, b) { return b.docs - a.docs || ts(b.last) - ts(a.last); });
  }

  /* ---------------- shared cell renderers ---------------- */
  function typeChip(t, q) {
    return '<span class="tchip ' + typeCls(t) + '"><span class="d"></span>' + highlight(typeLabel(t), q) + '</span>';
  }
  function typeTile(t) {
    return '<span class="ttile ' + typeCls(t) + '">' + typeShort(t).charAt(0) + '</span>';
  }
  function networkCell(net) {
    if (net === 'on') return '<span class="net on" title="Also a Robin Dock org — structured exchange possible">' + ICON.flock + 'On network</span>';
    if (net === 'off') return '<span class="net off" title="Fax / email only">Off network</span>';
    return '<span class="net unk" title="Network status unknown">—</span>';
  }
  function faxCell(c, q) {
    var primary = '<span class="faxno mono">' + highlight(c.faxes[0], q) + '</span>';
    var more = c.faxes.length > 1
      ? '<span class="faxmore" title="' + esc(c.faxes.slice(1).join(', ')) + '">+' + (c.faxes.length - 1) + '</span>' : '';
    return '<span class="faxcell">' + ICON.fax + primary + more + '</span>';
  }
  function channelChips(c) {
    var out = [];
    if (c.email) out.push('<span class="chch" title="' + esc(c.email) + '">' + ICON.mail + '</span>');
    if (c.phone) out.push('<span class="chch" title="' + esc(c.phone) + '">' + ICON.phone + '</span>');
    return out.length ? '<span class="chset">' + out.join('') + '</span>' : '<span class="chnone">—</span>';
  }
  /* tiny inline sparkline from an 8-week volume array */
  function sparkline(weeks, cls) {
    if (!weeks || !weeks.length) return '';
    var max = Math.max.apply(null, weeks) || 1;
    var bars = weeks.map(function (v) {
      var h = Math.max(8, Math.round((v / max) * 100));
      return '<span class="sb" style="height:' + h + '%"></span>';
    }).join('');
    return '<span class="spark ' + (cls || '') + '">' + bars + '</span>';
  }
  function activityCell(c) {
    if (!c.active || c.docs30 === 0) {
      return '<span class="actx quiet"><span class="quiet-d"></span>Quiet · ' + ago(c.last) + '</span>';
    }
    return '<span class="actx">' + sparkline(c.weeks) +
      '<span class="actn"><b>' + c.docs30 + '</b> / 30d</span>' +
      '<span class="actlast">' + ago(c.last) + '</span></span>';
  }

  /* ============================================================
     ACCESS-LOGGED TOAST  (business-directory note: lighter than
     the Client/PHI surface — but mutations are still logged, §4)
     ============================================================ */
  var toastWrap;
  function toast(title, sub, kind) {
    if (!toastWrap) toastWrap = document.getElementById('logToasts');
    if (!toastWrap) return;
    var el = document.createElement('div');
    el.className = 'logtoast';
    var ic = kind === 'save' ? ICON.saved : (kind === 'flock' ? ICON.flock : ICON.logged);
    el.innerHTML = '<span class="lic">' + ic + '</span><div><div class="lt">' + esc(title) + '</div>' +
      (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>';
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 280); }, 2600);
    while (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  }

  /* ============================================================
     MODALS — Add Contact / Edit Contact / Resolve node (§8)
     ============================================================ */
  function field(label, val, ph, hint) {
    return '<label class="field" style="max-width:none"><span class="lab">' + esc(label) + '</span>' +
      '<input class="input" value="' + esc(val || '') + '" placeholder="' + esc(ph || '') + '" />' +
      (hint ? '<span class="hint">' + esc(hint) + '</span>' : '') + '</label>';
  }
  function typeSelectField(label, val) {
    var opts = TYPE_ORDER.map(function (k) {
      return '<option value="' + k + '"' + (k === val ? ' selected' : '') + '>' + esc(typeLabel(k)) + '</option>';
    }).join('');
    return '<label class="field" style="max-width:none"><span class="lab">' + esc(label) + '</span>' +
      '<span class="selectwrap" style="max-width:none"><select class="input">' + opts + '</select></span></label>';
  }
  function netRadioField(val) {
    var opt = function (v, t, s) {
      return '<span class="netradio' + (v === val ? ' on' : '') + '" data-net="' + v + '">' +
        '<span class="rd"></span><span class="rl"><b>' + t + '</b>' + s + '</span></span>';
    };
    return '<div class="field" style="max-width:none"><span class="lab">Network status</span>' +
      '<div class="netradios">' +
        opt('off', 'Off network', 'Fax / email only') +
        opt('on', 'On network', 'Also a Robin Dock org') +
      '</div><span class="hint">Latent at v1 — informational. Capitalized in the network era.</span></div>';
  }

  function openModal(opts) {
    var scrim = document.createElement('div');
    scrim.className = 'modal-scrim cmodal-scrim';
    scrim.innerHTML =
      '<div class="modal cmodal" style="width:min(' + (opts.width || 480) + 'px,94%)">' +
        '<div class="mh"><h3>' + esc(opts.title) + '</h3>' +
          (opts.sub ? '<p class="mhsub">' + opts.sub + '</p>' : '') + '</div>' +
        '<div class="mb"><div class="mform">' + opts.body + '</div></div>' +
        '<div class="mf">' +
          (opts.secondary ? '<button class="btn btn-text" data-msecondary style="margin-right:auto">' + esc(opts.secondary) + '</button>' : '') +
          '<button class="btn btn-light" data-mclose>Cancel</button>' +
          '<button class="btn btn-blue" data-msave>' + esc(opts.saveLabel || 'Save') + '</button>' +
        '</div></div>';
    document.body.appendChild(scrim);
    function close() { scrim.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    // network radio toggle (if present)
    scrim.addEventListener('click', function (e) {
      var nr = e.target.closest('[data-net]');
      if (nr) {
        scrim.querySelectorAll('.netradio').forEach(function (x) { x.classList.remove('on'); });
        nr.classList.add('on'); nr.setAttribute('data-chosen', '1');
        return;
      }
      if (e.target === scrim || e.target.closest('[data-mclose]')) { close(); return; }
      if (e.target.closest('[data-msecondary]')) { close(); if (opts.onSecondary) opts.onSecondary(); return; }
      if (e.target.closest('[data-msave]')) { close(); if (opts.onSave) opts.onSave(); return; }
    });
    var first = scrim.querySelector('input, select');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function addContactModal(prefillFax) {
    openModal({
      title: 'Add contact',
      sub: 'An external party you exchange documents with — a practice, lab, imaging center or pharmacy. <b>Not</b> a pet-owner household.',
      body: field('Contact name', '', 'e.g. Cottonwood Animal Clinic', 'The name that makes a fax number readable.') +
        typeSelectField('Type', 'gp') +
        field('Fax number', prefillFax || '', '(801) 555-0000', 'The primary identifier — what inbound resolves against.') +
        '<div class="mrow">' + field('Email (optional)', '', 'records@…') + field('Phone (optional)', '', '(801) 555-0000') + '</div>' +
        field('Location', '', 'City, ST') +
        netRadioField('off'),
      saveLabel: 'Add contact',
      onSave: function () { toast('Contact added', 'New directory node created · logged', 'save'); }
    });
  }
  function editContactModal(c) {
    openModal({
      title: 'Edit contact',
      sub: 'Editing <b>' + esc(c.name) + '</b> — business-directory data.',
      body: field('Contact name', c.name) +
        typeSelectField('Type', c.type) +
        field('Fax number', c.faxes[0]) +
        '<div class="mrow">' + field('Email', c.email) + field('Phone', c.phone) + '</div>' +
        field('Location', c.location) +
        netRadioField(c.network === 'on' ? 'on' : 'off'),
      saveLabel: 'Save changes',
      onSave: function () { toast('Saved', 'Prototype — changes are not persisted', 'save'); }
    });
  }
  /* Resolve an unidentified node into a real Contact — the SAME
     action offered at triage (§6/§8), surfaced here too. */
  function resolveNodeModal(u) {
    openModal({
      title: 'Name this contact',
      sub: 'Ingress received <b>' + u.docs + ' document' + (u.docs === 1 ? '' : 's') + '</b> from <b class="mono">' + esc(u.number) + '</b> but nobody has named it yet. Naming it turns this unclaimed node into a real Contact — and makes the relationship trackable.',
      body: field('Contact name', '', 'Who is this number?', 'The same resolution offered at triage.') +
        typeSelectField('Type', 'gp') +
        '<div class="mrow">' +
          '<label class="field" style="max-width:none"><span class="lab">Fax number</span><input class="input mono" value="' + esc(u.number) + '" readonly /></label>' +
          field('Phone (optional)', '', '(801) 555-0000') +
        '</div>' +
        field('Location (optional)', '', 'City, ST'),
      saveLabel: 'Create contact',
      secondary: 'Not us — ignore',
      onSave: function () { toast('Node claimed', esc(u.number) + ' → new contact · ' + u.docs + ' doc' + (u.docs === 1 ? '' : 's') + ' linked · logged', 'flock'); },
      onSecondary: function () { toast('Marked ignored', esc(u.number) + ' hidden from the directory · logged'); }
    });
  }

  /* expose */
  window.RDC = {
    ICON: ICON, esc: esc, digits: digits, ts: ts, fmtDate: fmtDate, ago: ago, highlight: highlight,
    typeLabel: typeLabel, typeShort: typeShort, typeCls: typeCls,
    filterContacts: filterContacts, sortContacts: sortContacts, filterUnidentified: filterUnidentified,
    typeChip: typeChip, typeTile: typeTile, networkCell: networkCell, faxCell: faxCell,
    channelChips: channelChips, sparkline: sparkline, activityCell: activityCell,
    toast: toast, openModal: openModal,
    addContactModal: addContactModal, editContactModal: editContactModal, resolveNodeModal: resolveNodeModal
  };
})();
