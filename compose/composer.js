/* ============================================================
   RobinDock — Composer (Create & Send) · CONTROLLER
   ONE surface, three entry modes:
     • fax      — generic "send a fax" (DEFAULT): pick a recipient,
                  attach a document and/or add a cover page, send.
     • template — opt-in shortcut: structured sends (referral letter,
                  records cover/request) that pre-fill fields.
     • reply    — arrives pre-loaded from a Case/Task (confirmed data).
   Left pane drives a live preview (what-you-see-is-what-sends).
   Send is simulated; PHI egress shows an "Access logged" indicator.
   Prototype / mock only.
   ============================================================ */
(function () {
  'use strict';

  var D = window.RD_COMPOSE;
  var CONTACTS = window.RD_CONTACTS || [];
  var CT = window.RD_CONTACT_TYPES || {};
  var TODAY = 'June 15, 2026';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br/>'); }
  function tmpl(id) { return D.TEMPLATES.filter(function (t) { return t.id === id; })[0]; }
  function contactById(id) { return CONTACTS.filter(function (c) { return c.id === id; })[0]; }
  function contactByName(n) { return CONTACTS.filter(function (c) { return c.name === n; })[0]; }

  var I = {
    ref: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 19l14-7L5 5v5l8 2-8 2v5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    rec: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    req: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 3l4 4-4 4M20 7H9a4 4 0 00-4 4v1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 21l-4-4 4-4M4 17h11a4 4 0 004-4v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fax: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 8V4h10v4M5 8h14a2 2 0 012 2v6a2 2 0 01-2 2h-2v-4H7v4H5a2 2 0 01-2-2v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spark: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.7 5L19 10l-5.3 2L12 17l-1.7-5L5 10l5.3-2L12 3z" fill="currentColor"/></svg>',
    edit: '<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    warn: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    logged: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    layers: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 13l9 5 9-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    x: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l14-7-7 16-2-6-5-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    chev: '<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    okbig: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upload: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 16V5m0 0l-4 4m4-4l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 16v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    doc: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 3h8l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3v5h5M8 13h8M8 17h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    grid: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/></svg>',
    reply: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5M4 12h11a5 5 0 015 5v1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function tg(t) { return I[t.glyph] || I.fax; }
  function sqCls(type) { return type === 'gp' ? 'gp' : type === 'lab' ? 'lab' : type === 'er' ? 'er' : ''; }

  /* ---------------- state ---------------- */
  var S = {
    mode: 'fax',            // 'fax' | 'template' | 'reply'
    view: 'compose',        // 'start' (library) | 'compose'
    template: null,
    recipient: null,        // contact id, or '__adhoc'
    adhocRecip: null,
    values: {},
    sources: {},
    orig: {},
    attachments: [],
    includeCover: false,
    zoom: 1,
    pickerOpen: false,
    creating: false
  };
  function recip() { return S.recipient === '__adhoc' ? S.adhocRecip : (S.recipient ? contactById(S.recipient) : null); }

  function loadTemplate(id, ctx) {
    var t = tmpl(id); if (!t) return;
    S.template = id; S.values = {}; S.sources = {}; S.orig = {};
    t.fields.forEach(function (f) {
      var v = (ctx && ctx.values && ctx.values[f.key] != null) ? ctx.values[f.key] : (f.kind === 'checklist' ? [] : (f.kind === 'bool' ? false : ''));
      S.values[f.key] = v;
      S.orig[f.key] = Array.isArray(v) ? v.slice() : v;
      S.sources[f.key] = (ctx && ctx.sources && ctx.sources[f.key]) ? ctx.sources[f.key] : (f.prefill ? 'task' : 'default');
    });
  }

  /* ---- entry modes ---- */
  function startFax() {
    S.mode = 'fax'; S.view = 'compose'; S.template = null;
    S.recipient = null; S.adhocRecip = null; S.attachments = []; S.includeCover = false;
    S.values = { re: '', message: '', urgent: false }; S.sources = {}; S.orig = {};
    S.pickerOpen = false; S.creating = false;
  }
  function startReply() {
    S.mode = 'reply'; S.view = 'compose';
    var r = D.REPLY;
    var c = contactByName(r.recipientName);
    S.recipient = c ? c.id : null; S.adhocRecip = null;
    S.attachments = r.attachments.map(function (a) { return Object.assign({}, a); });
    S.includeCover = false;
    loadTemplate(r.template, r);
  }
  function browseTemplates() { S.view = 'start'; render(); }
  function chooseTemplate(id) {
    // keep recipient/attachments if already chosen in fax mode
    var keepRecip = S.recipient, keepAdhoc = S.adhocRecip, keepAtt = S.attachments;
    S.mode = 'template'; S.view = 'compose';
    loadTemplate(id, null);
    S.recipient = keepRecip; S.adhocRecip = keepAdhoc; S.attachments = keepAtt; S.includeCover = false;
    render();
  }

  /* ---------------- provenance ---------------- */
  function isEmpty(v) { return Array.isArray(v) ? v.length === 0 : (v === '' || v == null || v === false); }
  function provState(key) {
    var src = S.sources[key], v = S.values[key], o = S.orig[key];
    if (src == null) return 'default';
    var changed = Array.isArray(v) ? (v.join('|') !== (o || []).join('|')) : (v !== o);
    if (src === 'blank' && isEmpty(v)) return 'blank';
    if (changed) return 'edited';
    if (src === 'task') return 'task';
    if (src === 'blank') return 'edited';
    return 'default';
  }
  function provChip(key) {
    var p = provState(key);
    if (p === 'task') return '<span class="prov task" data-prov="' + key + '">' + I.spark + 'Confirmed</span>';
    if (p === 'edited') return '<span class="prov edited" data-prov="' + key + '">' + I.edit + 'Edited</span>';
    if (p === 'blank') return '<span class="prov blank" data-prov="' + key + '">' + I.warn + 'Needs input</span>';
    return '<span class="prov" data-prov="' + key + '" style="display:none"></span>';
  }

  /* ---------------- recipient ---------------- */
  function recipSqIcon(c) { return c.adhoc ? I.fax : (c.type === 'lab' || c.type === 'imaging' ? I.rec : I.ref); }
  function netChip(c, sm) {
    if (c.adhoc || c.network == null) return '<span class="netchip off"><span class="d"></span>Network unknown</span>';
    return c.network === 'on'
      ? '<span class="netchip on"><span class="d"></span>' + (sm ? 'On-net' : 'On-network') + '</span>'
      : '<span class="netchip off"><span class="d"></span>' + (sm ? 'Off-net' : 'Off-network · fax') + '</span>';
  }
  function recipBlock() {
    var c = recip();
    var inner;
    if (c && c.adhoc) {
      inner = '<div class="recip-pick" data-act="toggle-picker"><div class="recip-sq">' + I.fax + '</div>' +
        '<div class="recip-main"><div class="recip-name">' + esc(c.faxes[0]) + '</div>' +
        '<div class="recip-sub">Direct fax · one-off recipient ' + netChip(c) + '</div></div>' +
        '<span class="recip-edit">Change</span></div>';
    } else if (c) {
      var t = CT[c.type] || {};
      inner = '<div class="recip-pick" data-act="toggle-picker"><div class="recip-sq ' + sqCls(c.type) + '">' + recipSqIcon(c) + '</div>' +
        '<div class="recip-main"><div class="recip-name">' + esc(c.name) + '</div>' +
        '<div class="recip-sub">' + esc(t.label || c.type) + ' · ' + esc(c.location) +
        '<span class="recip-ph"><b>Fax</b> ' + esc(c.faxes[0]) + '</span> ' + netChip(c) + '</div></div>' +
        '<span class="recip-edit">Change</span></div>';
    } else {
      inner = '<div class="recip-pick empty" data-act="toggle-picker"><div class="recip-sq">' + I.search + '</div>' +
        '<div class="recip-main"><div class="recip-name">Choose a recipient</div>' +
        '<div class="recip-sub">Search Contacts, enter a fax number, or create a Contact</div></div>' +
        '<span class="recip-edit">Pick</span></div>';
    }
    return '<div class="recip">' + inner + recipPop() + '</div>';
  }
  function recipPop() {
    if (!S.pickerOpen) return '';
    if (S.creating) return '<div class="recip-pop open">' + recipCreate() + '</div>';
    var order = window.RD_TYPE_ORDER || ['gp', 'specialty', 'er', 'lab', 'imaging', 'pharmacy', 'other'];
    var q = (S._q || '').toLowerCase();
    var rows = '';
    order.forEach(function (ty) {
      var grp = CONTACTS.filter(function (c) {
        return c.type === ty && (!q || c.name.toLowerCase().indexOf(q) >= 0 || (c.location || '').toLowerCase().indexOf(q) >= 0);
      });
      if (!grp.length) return;
      rows += '<div class="recip-grp">' + esc((CT[ty] || {}).label || ty) + '</div>';
      grp.forEach(function (c) {
        rows += '<div class="recip-row" data-pick="' + c.id + '">' +
          '<div class="recip-sq ' + sqCls(c.type) + '" style="width:32px;height:32px;border-radius:9px">' + recipSqIcon(c) + '</div>' +
          '<div class="recip-main"><div class="rn">' + esc(c.name) + '</div>' +
          '<div class="rs">' + esc(c.location) + ' · ' + esc(c.faxes[0]) + '</div></div>' +
          '<span class="rt">' + netChip(c, true) + '</span></div>';
      });
    });
    if (!rows) rows = '<div class="recip-empty">No Contact matches “' + esc(S._q || '') + '”.<br/>Use a direct number or create one below.</div>';
    return '<div class="recip-pop open">' +
      '<div class="recip-search">' + I.search +
      '<input id="recipSearch" placeholder="Search Contacts by name or city…" value="' + esc(S._q || '') + '" autocomplete="off"/></div>' +
      '<div class="recip-list">' + rows + '</div>' +
      '<div class="recip-direct"><div class="rd-lbl">Send to a fax number directly</div>' +
      '<div class="rd-row"><input class="fld-input" id="directFax" placeholder="(801) 555-0000" autocomplete="off"/>' +
      '<button class="btn btn-light btn-sm" data-act="use-direct">Use number</button></div></div>' +
      '<div class="recip-create" data-act="start-create"><span class="ic">' + I.plus + '</span> Create a new Contact</div></div>';
  }
  function recipCreate() {
    var opts = ['gp', 'specialty', 'er', 'lab', 'imaging', 'pharmacy', 'other'].map(function (k) {
      return '<option value="' + k + '">' + esc((CT[k] || {}).label || k) + '</option>';
    }).join('');
    return '<div class="recip-new"><h5>' + I.plus + 'New Contact</h5>' +
      '<input class="fld-input" id="ncName" placeholder="Practice / facility name"/>' +
      '<div class="row" style="margin-top:9px"><select class="fld-input" id="ncType">' + opts + '</select>' +
      '<input class="fld-input" id="ncFax" placeholder="Fax number"/></div>' +
      '<input class="fld-input" id="ncLoc" placeholder="City, ST"/>' +
      '<div class="acts"><button class="btn btn-light btn-sm" data-act="cancel-create">Cancel</button>' +
      '<button class="btn btn-blue btn-sm" data-act="save-create">Add &amp; select</button></div></div>';
  }

  /* ---------------- template field rendering ---------------- */
  function fieldHTML(f) {
    var v = S.values[f.key];
    var meta = '<div class="fld-lab"><span class="lab">' + esc(f.label) + '</span>' + provChip(f.key) + '</div>';
    var note = (provState(f.key) === 'blank')
      ? '<div class="fld-note" data-note="' + f.key + '">' + I.warn + (f.ph || 'No confirmed source — complete before sending') + '</div>' : '';
    var ctrl;
    if (f.kind === 'long') {
      ctrl = '<textarea class="fld-input' + (provState(f.key) === 'blank' ? ' flagged' : '') + '" data-key="' + f.key + '" placeholder="' + esc(f.ph || '') + '">' + esc(v) + '</textarea>';
    } else if (f.kind === 'enum') {
      ctrl = '<select class="fld-input" data-key="' + f.key + '" data-change="1">' +
        f.options.map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    } else if (f.kind === 'bool') {
      return '<div class="fld"><div class="boolrow"><span class="toggle' + (v ? ' on' : '') + '" data-toggle="' + f.key + '"></span><span class="bl">' + esc(f.label) + '</span></div></div>';
    } else if (f.kind === 'checklist') {
      var cells = f.options.map(function (o) {
        var on = (v || []).indexOf(o) >= 0;
        return '<div class="chk' + (on ? ' on' : '') + '" data-checklist="' + f.key + '" data-opt="' + esc(o) + '"><span class="box">' + (on ? I.check : '') + '</span>' + esc(o) + '</div>';
      }).join('');
      return '<div class="fld">' + meta + '<div class="checks">' + cells + '</div></div>';
    } else {
      ctrl = '<input class="fld-input' + (provState(f.key) === 'blank' ? ' flagged' : '') + '" data-key="' + f.key + '" value="' + esc(v) + '" placeholder="' + esc(f.ph || '') + '"/>';
    }
    return '<div class="fld">' + meta + ctrl + note + '</div>';
  }
  function groupHTML(t, g) {
    var fs = t.fields.filter(function (f) { return f.group === g.id; });
    return '<div class="cmp-sec" style="margin-top:-6px"><div class="cmp-sec-h"><h3>' + esc(g.label) + '</h3></div>' +
      '<div class="fields">' + fs.map(fieldHTML).join('') + '</div></div>';
  }

  /* ---------------- attachments (shared) ---------------- */
  function attachRows() {
    return S.attachments.map(function (a, i) {
      var cls = a.type === 'imaging' ? 'aqua' : a.type === 'lab' ? 'violet' : '';
      return '<div class="attach-row"><span class="ti ' + cls + '"></span>' +
        '<div><div class="an">' + esc(a.name) + '</div><div class="ap">' + a.pages + ' page' + (a.pages === 1 ? '' : 's') + ' · ' + esc(a.type === 'pdf' ? 'PDF' : a.type) + '</div></div>' +
        '<span class="ax" data-detach="' + i + '" title="Remove">' + I.x + '</span></div>';
    }).join('');
  }

  /* ---------------- LEFT: generic fax ---------------- */
  function coverFieldsHTML() {
    return '<div class="fields cover-fields">' +
      '<div class="fld"><div class="fld-lab"><span class="lab">Regarding</span></div>' +
      '<input class="fld-input" data-key="re" value="' + esc(S.values.re || '') + '" placeholder="Subject of this fax"/></div>' +
      '<div class="fld"><div class="fld-lab"><span class="lab">Message</span></div>' +
      '<textarea class="fld-input" data-key="message" placeholder="A short note to the recipient">' + esc(S.values.message || '') + '</textarea></div>' +
      '<div class="fld"><div class="boolrow"><span class="toggle' + (S.values.urgent ? ' on' : '') + '" data-toggle="urgent"></span><span class="bl">Mark urgent</span></div></div>' +
      '</div>';
  }
  function faxLeft() {
    var html = '';
    // 1 · recipient
    html += '<div class="cmp-sec"><div class="cmp-sec-h"><span class="n">1</span><h3>Recipient</h3>' +
      '<span class="sub">Contact or fax number</span></div>' + recipBlock() + '</div>';
    // 2 · document
    html += '<div class="cmp-sec"><div class="cmp-sec-h"><span class="n">2</span><h3>Document</h3>' +
      '<span class="sub">' + (S.attachments.length ? S.attachments.length + ' attached' : 'Attach a PDF') + '</span></div>' +
      '<div class="dropzone" id="faxDrop" data-act="pick-file"><span class="dz-ic">' + I.upload + '</span>' +
      '<div class="dz-t">Drag a PDF here, or <b>browse</b></div>' +
      '<div class="dz-s">The original document is transmitted as-is</div></div>' +
      '<input type="file" id="faxFile" accept="application/pdf,.pdf" multiple hidden/>' +
      (S.attachments.length ? '<div class="doc-list">' + attachRows() + '</div>' : '') +
      '<span class="dz-sample" data-act="add-sample">' + I.plus + ' Add a sample document</span></div>';
    // 3 · cover page (optional)
    html += '<div class="cmp-sec"><div class="cmp-sec-h"><span class="n">3</span><h3>Cover page</h3><span class="sub">Optional</span></div>' +
      '<div class="cover-toggle"><span class="toggle' + (S.includeCover ? ' on' : '') + '" data-act="toggle-cover"></span>' +
      '<div class="ct-main"><div class="ct-t">Include a cover page</div>' +
      '<div class="ct-s">Adds a cover sheet with recipient, sender, page count and your note</div></div></div>' +
      (S.includeCover ? coverFieldsHTML() : '') + '</div>';
    return html;
  }

  /* ---------------- LEFT: template / reply ---------------- */
  function attachSection() {
    var rows = attachRows();
    return '<div class="cmp-sec"><div class="cmp-sec-h"><span class="n">3</span><h3>Attachments</h3>' +
      '<span class="sub">' + S.attachments.length + ' document' + (S.attachments.length === 1 ? '' : 's') + '</span></div>' +
      '<div class="attach">' + (rows || '<div style="font-size:12.5px;color:var(--gray-500);padding:4px 2px">No attachments — the letter sends on its own.</div>') +
      '<span class="attach-add" data-act="add-attach">' + I.plus + ' Add from this Case</span></div></div>';
  }
  function templateLeft() {
    var t = tmpl(S.template), html = '';
    if (S.mode === 'reply') {
      html += '<div class="prefill-banner"><span class="ic">' + I.spark + '</span>' +
        '<div>Pre-filled from the <b>confirmed referral Task</b> (' + esc(D.REPLY.taskId) + ') — the fields a teammate verified at fulfillment, not raw AI extraction. Review and quick-edit before sending.</div></div>';
    }
    html += '<div class="cmp-sec"><div class="cmp-sec-h"><span class="n">1</span><h3>Recipient</h3>' +
      (S.mode === 'reply' ? '<span class="sub">From the Case</span>' : '') + '</div>' + recipBlock() + '</div>';
    html += '<div class="cmp-sec"><div class="cmp-sec-h"><span class="n">2</span><h3>' + esc(t.name) + ' details</h3><span class="sub">Quick-edit</span></div></div>';
    t.groups.forEach(function (g) { html += groupHTML(t, g); });
    html += attachSection();
    return html;
  }
  function renderLeft() { return S.mode === 'fax' ? faxLeft() : templateLeft(); }

  /* ---------------- preview: shared building blocks ---------------- */
  function letterhead(kick) {
    var p = D.PRACTICE;
    return '<div class="o-let"><div><div class="o-org">' + esc(p.name) + '<div class="tl">' + esc(p.line) + '</div></div></div>' +
      '<div><div class="o-mark"><svg class="mk" viewBox="0 0 512 512"><use href="#rdMark"></use></svg></div>' +
      '<div class="o-addr">' + esc(p.addr).replace(', ', '<br/>') + '<br/>Fax ' + esc(p.fax) + ' · Tel ' + esc(p.phone) + '</div></div></div>' +
      (kick ? '<div class="o-kick">' + esc(kick) + '</div>' : '');
  }
  function toBlock(extraRight) {
    var c = recip();
    var to = c ? ('<span class="k">To</span><b>' + esc(c.adhoc ? c.faxes[0] : c.name) + '</b><br/>' + esc(c.adhoc ? 'Direct fax' : ((CT[c.type] || {}).label || c.type)) +
      ' · Fax ' + esc(c.faxes[0])) : '<span class="k">To</span><span class="o-pend">— select a recipient —</span>';
    return '<div class="o-meta"><div class="o-to">' + to + '</div><div class="o-date">' + TODAY + (extraRight ? '<br/>' + extraRight : '') + '</div></div>';
  }
  function vget(k) { return S.values[k]; }
  function longOrBlank(k, label) {
    var v = vget(k);
    if (isEmpty(v)) return '<span class="o-blank">' + I.warn + ' ' + esc(label) + ' — to complete</span>';
    return nl2br(v);
  }
  function signature() {
    return '<div class="o-sign"><div class="ln"></div><div class="nm">' + esc(D.PRACTICE.dvm) + '</div>' +
      '<div class="rl">' + esc(D.PRACTICE.name) + ' · Prepared by ' + esc(D.ME.name) + ', ' + esc(D.ME.role) + '</div></div>';
  }
  function foot(t) {
    return '<div class="o-foot">' + esc(t) + '<br/>' + esc(D.PRACTICE.name) + ' · License ' + esc(D.PRACTICE.license) + ' · Sent via RobinDock</div>';
  }

  /* ---------------- preview: documents ---------------- */
  function docReferral() {
    var c = recip();
    var spec = vget('referred_to_specialty'), urg = vget('urgency');
    var stamp = urg === 'emergent' ? '<div class="o-stamp">Emergent</div>' : urg === 'urgent' ? '<div class="o-stamp urgent">Urgent</div>' : '';
    var grid = [
      ['Patient', esc(vget('patient')) + ' · ' + esc(vget('species')) + (vget('breed') ? ', ' + esc(vget('breed')) : '')],
      ['Owner', esc(vget('owner'))], ['Weight', esc(vget('weight')) || '—'],
      ['Urgency', '<span style="text-transform:capitalize">' + esc(urg) + '</span>'],
      ['Referred to', esc(spec) + (c && !c.adhoc ? ' — ' + esc(c.name) : '')],
      ['Vaccine status', esc(vget('vaccine_status')) || '—'], ['Rabies', esc(vget('rabies_date')) || '—'],
      ['Requested service', esc(vget('requested_service')) || '—']
    ].map(function (r) { return '<div class="o-f"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + '</span></div>'; }).join('');
    var who = c ? (c.adhoc ? 'Colleague' : c.name) : 'Colleague';
    return '<div class="odoc">' + stamp + letterhead('Referral · Consultation Request') + toBlock('Ref ' + esc(D.REPLY.caseId)) +
      '<div class="o-re"><span class="lbl">RE</span>' + esc(vget('patient')) + ' — ' + esc(vget('chief_complaint') || 'consultation request') + '</div>' +
      '<div class="o-grid">' + grid + '</div>' +
      '<p class="o-p body">Dear ' + esc(who) + ' team,</p>' +
      '<p class="o-p body">Thank you for seeing this patient. ' + nl2br(vget('reason_for_referral') || '') + '</p>' +
      '<div class="o-sec">Clinical history</div><p class="o-p">' + longOrBlank('clinical_history', 'Clinical history') + '</p>' +
      '<div class="o-sec">Physical findings</div><p class="o-p">' + longOrBlank('physical_findings', 'Physical findings') + '</p>' +
      '<div class="o-sec">Tentative diagnosis</div><p class="o-p">' + (isEmpty(vget('tentative_diagnosis')) ? '<span class="o-pend">—</span>' : esc(vget('tentative_diagnosis'))) + '</p>' +
      '<div class="o-sec">Current medications</div><p class="o-p">' + longOrBlank('current_medications', 'Current medications') + '</p>' +
      '<div class="o-sec">Requested service</div><p class="o-p">' + esc(vget('requested_service') || '') + (S.attachments.length ? ' Prior records, imaging, and bloodwork are attached (' + attachPageTotal() + ' pp).' : '') + '</p>' +
      signature() + foot('This referral and any attachments contain protected health information transmitted from ' + esc(D.PRACTICE.name) + '.') + '</div>';
  }
  function docRecordsCover() {
    var c = recip(); var encl = vget('enclosed') || [];
    var list = encl.length ? '<ul class="o-list">' + encl.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>'
      : '<p class="o-p"><span class="o-blank">' + I.warn + ' Select the records enclosed</span></p>';
    var who = c ? (c.adhoc ? 'Colleague' : c.name) : 'Colleague';
    return '<div class="odoc">' + letterhead('Records · Cover Letter') + toBlock('') +
      '<div class="o-re"><span class="lbl">RE</span>Medical records — ' + (esc(vget('patient')) || '<span class="o-pend">patient</span>') + '</div>' +
      '<p class="o-p body">Dear ' + esc(who) + ' team,</p>' +
      '<p class="o-p body">Please find enclosed the following records for <b>' + (esc(vget('patient')) || '—') + '</b>' +
      (vget('date_range') ? ' (' + esc(vget('date_range')) + ')' : '') + ':</p>' + list +
      (vget('note') ? '<div class="o-sec">Note</div><p class="o-p">' + nl2br(vget('note')) + '</p>' : '') +
      '<p class="o-p body" style="margin-top:14px">Please contact our office with any questions.</p>' +
      signature() + foot('Records released per signed owner authorization on file. PHI — handle accordingly.') + '</div>';
  }
  function docRecordsRequest() {
    var c = recip(); var req = vget('records_requested') || [];
    var list = req.length ? '<ul class="o-list">' + req.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>'
      : '<p class="o-p"><span class="o-blank">' + I.warn + ' Select the records requested</span></p>';
    var who = c ? (c.adhoc ? 'Colleague' : c.name) : 'Colleague';
    return '<div class="odoc">' + letterhead('Records Request') + toBlock('') +
      '<div class="o-re"><span class="lbl">RE</span>Records request — ' + (esc(vget('patient')) || '<span class="o-pend">patient</span>') + '</div>' +
      '<p class="o-p body">Dear ' + esc(who) + ' team,</p>' +
      '<p class="o-p body">' + esc(D.PRACTICE.name) + ' is now caring for <b>' + (esc(vget('patient')) || '—') + '</b>. We are requesting the following records' +
      (vget('date_range') ? ' (' + esc(vget('date_range')) + ')' : '') + ':</p>' + list +
      '<div class="o-sec">Authorization</div><p class="o-p">' + esc(vget('authorization') || '—') + '.</p>' +
      '<p class="o-p body">Records may be returned by fax to ' + esc(D.PRACTICE.fax) + (vget('respond_by') ? ' by <b>' + esc(vget('respond_by')) + '</b>' : '') + '.</p>' +
      signature() + foot('Requested under signed owner authorization. Please transmit to the fax number above only.') + '</div>';
  }
  function docFaxCover() {
    var c = recip(); var urgent = vget('urgent');
    var rows = [
      ['To', c ? esc(c.adhoc ? c.faxes[0] : c.name) : '<span class="o-pend">— recipient —</span>'],
      ['Fax', c ? esc(c.faxes[0]) : '—'],
      ['From', esc(D.PRACTICE.name) + ' · ' + esc(D.ME.name)],
      ['Date', TODAY],
      ['Pages', totalPages() + ' (incl. cover)'],
      ['Re', esc(vget('re')) || '<span class="o-pend">—</span>']
    ].map(function (r) { return '<div class="o-cr"><div class="cl">' + r[0] + '</div><div class="cv">' + r[1] + '</div></div>'; }).join('');
    return '<div class="odoc cover">' + (urgent ? '<div class="o-stamp urgent">Urgent</div>' : '') + letterhead('Fax Cover Sheet') +
      '<div class="o-cover-grid">' + rows + '</div>' +
      '<div class="o-sec">Message</div><p class="o-p body">' + (isEmpty(vget('message')) ? '<span class="o-pend">No message.</span>' : nl2br(vget('message'))) + '</p>' +
      signature() + foot('CONFIDENTIAL: This fax contains protected health information intended only for the named recipient. If received in error, please notify the sender and destroy all copies.') + '</div>';
  }
  function templateDoc() {
    if (S.template === 'referral') return docReferral();
    if (S.template === 'records-cover') return docRecordsCover();
    if (S.template === 'records-request') return docRecordsRequest();
    return docFaxCover();
  }

  /* uploaded-document representation (we transmit the original PDF as-is) */
  function attachPaper(a) {
    var cls = a.type === 'imaging' ? 'aqua' : a.type === 'lab' ? 'violet' : '';
    return '<div class="odoc doc-attach"><div class="da-bar"><span class="ti ' + cls + '"></span>' +
      '<div class="da-meta"><div class="an">' + esc(a.name) + '</div><div class="ap">' + a.pages + ' page' + (a.pages === 1 ? '' : 's') + ' · ' + esc(a.type === 'pdf' ? 'PDF' : a.type) + '</div></div>' +
      '<span class="da-tag">Document</span></div>' +
      '<div class="da-faux"><span class="ln h"></span><span class="ln w9"></span><span class="ln w8"></span><span class="ln w9"></span><span class="ln w5"></span><span class="ln w7"></span><span class="ln w8"></span></div>' +
      '<div class="da-note">Original PDF · transmitted exactly as uploaded. RobinDock does not alter attached documents.</div></div>';
  }
  function emptyPreview() {
    return '<div class="pv-empty"><div class="pe-ic">' + I.doc + '</div><h4>Nothing to send yet</h4>' +
      '<p>Attach a PDF or add a cover page — the preview shows exactly what will be faxed.</p></div>';
  }
  function attachPageTotal() { return S.attachments.reduce(function (n, a) { return n + a.pages; }, 0); }
  function letterPages() { return S.mode === 'fax' ? (S.includeCover ? 1 : 0) : 1; }
  function totalPages() { return letterPages() + attachPageTotal(); }

  function pvStackHTML() {
    var out = '';
    if (S.mode === 'fax') {
      if (S.includeCover) out += docFaxCover();
      S.attachments.forEach(function (a) { out += attachPaper(a); });
      if (!S.includeCover && !S.attachments.length) out += emptyPreview();
    } else {
      out += templateDoc();
      S.attachments.forEach(function (a) { out += attachPaper(a); });
    }
    return out;
  }
  function pagesLabel() {
    var n = totalPages();
    if (S.mode === 'fax') {
      if (!n) return 'No pages yet';
      var bits = [];
      if (S.includeCover) bits.push('cover');
      if (S.attachments.length) bits.push(attachPageTotal() + ' attached');
      return n + ' page' + (n === 1 ? '' : 's') + ' (' + bits.join(' + ') + ')';
    }
    return n + ' page' + (n === 1 ? '' : 's') + (S.attachments.length ? ' (1 letter + ' + attachPageTotal() + ' attached)' : '');
  }
  function renderRight() {
    var pv = document.getElementById('pvScroll'); if (!pv) return;
    pv.innerHTML = '<div class="pv-stack" id="pvWrap" style="transform:scale(' + S.zoom + ')">' + pvStackHTML() + '</div>';
    var ps = document.getElementById('pvPages'); if (ps) ps.textContent = pagesLabel();
  }

  /* ---------------- context bar + footer ---------------- */
  function contextBar() {
    var t = tmpl(S.template), left, right;
    if (S.mode === 'reply') {
      left = '<span class="cmp-mode reply"><span class="d"></span>Reply in context</span>' +
        '<div class="cmp-ctx"><a href="../cases/Robin Dock - Cases.html">' + esc(D.REPLY.caseId) + '</a><span class="sep">·</span><b>' + esc(D.REPLY.caseSubject) + '</b></div>';
      right = '<span class="tmpl-chip" data-act="switch-template"><span class="tg">' + tg(t) + '</span>' + esc(t.name) + '<span class="ch">' + I.chev + '</span></span>' +
        '<span class="cmp-switch" data-act="go-fax">Start a new fax</span>';
    } else if (S.mode === 'template') {
      left = '<span class="cmp-mode tmpl"><span class="d"></span>From template</span><div class="cmp-ctx"><b>' + esc(t.name) + '</b></div>';
      right = '<span class="tmpl-chip" data-act="switch-template"><span class="tg">' + tg(t) + '</span>' + esc(t.name) + '<span class="ch">' + I.chev + '</span></span>' +
        '<span class="cmp-switch" data-act="go-fax">Switch to a blank fax</span>';
    } else {
      left = '<span class="cmp-mode fax"><span class="d"></span>New fax</span><div class="cmp-ctx"><b>Send a fax</b><span class="sep">·</span>attach a document, pick a recipient, send</div>';
      right = '<span class="cmp-switch" data-act="browse-templates">' + I.grid + 'Use a template</span>' +
        '<span class="cmp-switch" data-act="go-reply">' + I.reply + 'Reply to a Case</span>';
    }
    return '<div class="cmp-bar">' + left + '<div class="spacer"></div>' + right + '</div>';
  }
  function canSend() {
    if (!recip()) return false;
    if (S.mode === 'fax') return S.attachments.length > 0 || S.includeCover;
    return !!S.template;
  }
  function sendLabel() { return S.mode === 'fax' ? 'Send fax' : 'Send ' + tmpl(S.template).name.toLowerCase(); }
  function footer() {
    var ok = canSend();
    return '<div class="cmp-foot">' +
      '<div class="sendboth"><span class="sb-ico">' + I.layers + '</span>' +
      '<div><div class="sb-t">Send-both <span class="sb-tag floor">PDF · floor</span> <span class="sb-tag latent">Structured · latent</span></div>' +
      '<div class="sb-s">The PDF is the authoritative send. A structured payload rides along for on-network receivers.</div></div></div>' +
      '<div class="spacer"></div>' +
      '<span class="logged-inline">' + I.logged + 'Send is logged · PHI egress</span>' +
      '<button class="btn btn-light" data-act="preview-page">Preview</button>' +
      '<button class="btn btn-blue btn-lg' + (ok ? '' : ' is-disabled') + '" data-act="send"' + (ok ? '' : ' disabled') + '>' + I.send + sendLabel() + '</button></div>';
  }

  /* ---------------- start / library screen ---------------- */
  function startScreen() {
    var cards = D.TEMPLATES.map(function (t) {
      return '<button class="tmpl-card' + (t.keystone ? ' keystone' : '') + '" data-template="' + t.id + '"><span class="tg">' + tg(t) + '</span>' +
        '<div><div class="tn">' + esc(t.name) + (t.keystone ? ' <span class="keystone-badge">Keystone</span>' : '') + '</div>' +
        '<div class="tp">' + esc(t.blurb) + '</div></div></button>';
    }).join('');
    return '<div class="cmp"><div class="cmp-bar"><span class="cmp-mode tmpl"><span class="d"></span>Templates</span>' +
      '<div class="cmp-ctx"><b>Start from a template</b><span class="sep">·</span>an opt-in shortcut for structured sends</div><div class="spacer"></div>' +
      '<span class="cmp-switch" data-act="go-fax">' + I.fax + 'Back to a blank fax</span></div>' +
      '<div style="flex:1;overflow-y:auto"><div class="cmp-start">' +
      '<h2>Start from a template</h2>' +
      '<div class="sb">Templates pre-build a structured document — fields, layout and (for referrals) confirmed Task data. Prefer a plain fax? Use a blank fax and just attach your PDF.</div>' +
      '<div class="tmpl-grid">' + cards + '</div></div></div></div>';
  }

  /* ---------------- main render ---------------- */
  function render() {
    var root = document.getElementById('appContent');
    if (S.view === 'start') { root.innerHTML = startScreen(); return; }
    root.innerHTML = '<div class="cmp">' + contextBar() +
      '<div class="cmp-body"><div class="cmp-left" id="cmpLeft">' + renderLeft() + '</div>' +
      '<div class="cmp-right"><div class="pv-bar"><span class="pv-t">Outbound preview</span><span class="pv-s" id="pvPages"></span>' +
      '<div class="spacer"></div><span class="pv-wysiwyg"><span class="d"></span>What you see is what sends</span>' +
      '<div class="pv-zoom"><span class="zb" data-zoom="-">−</span><span class="zl" id="zlbl">' + Math.round(S.zoom * 100) + '%</span><span class="zb" data-zoom="+">+</span></div></div>' +
      '<div class="pv-scroll" id="pvScroll"></div></div></div>' + footer() + '</div>';
    renderRight();
    bindFax();
    if (S.pickerOpen) { var si = document.getElementById('recipSearch'); if (si) si.focus(); }
  }

  /* ---------------- file attach ---------------- */
  function addFiles(list) {
    if (!list || !list.length) return;
    Array.prototype.forEach.call(list, function (f) {
      var pages = Math.max(1, Math.min(40, Math.round((f.size || 140000) / 45000)));
      S.attachments.push({ name: f.name || 'Document.pdf', pages: pages, type: 'pdf', uploaded: true });
    });
    render();
  }
  function bindFax() {
    if (S.mode !== 'fax' && S.mode !== 'template' && S.mode !== 'reply') return;
    var fi = document.getElementById('faxFile');
    if (fi) fi.addEventListener('change', function (e) { addFiles(e.target.files); e.target.value = ''; });
    var dz = document.getElementById('faxDrop');
    if (dz) {
      ['dragover', 'dragenter'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('drag'); }); });
      ['dragleave', 'dragend'].forEach(function (ev) { dz.addEventListener(ev, function () { dz.classList.remove('drag'); }); });
      dz.addEventListener('drop', function (e) { e.preventDefault(); dz.classList.remove('drag'); addFiles(e.dataTransfer.files); });
    }
  }

  /* ---------------- send flow ---------------- */
  function sendConfirm() {
    var c = recip(), t = tmpl(S.template);
    var blanks = t ? t.fields.filter(function (f) { return provState(f.key) === 'blank'; }) : [];
    var warn = blanks.length ? '<div class="send-warn">' + I.warn +
      '<div><b>' + blanks.length + ' field' + (blanks.length > 1 ? 's are' : ' is') + ' still blank</b> (' +
      blanks.map(function (f) { return esc(f.label); }).join(', ') + '). They will send empty — RobinDock never fabricates a value.</div></div>' : '';
    var scrim = document.createElement('div');
    scrim.className = 'send-scrim'; scrim.id = 'sendScrim';
    scrim.innerHTML = '<div class="send-card"><div class="sh"><h3>Send ' + (S.mode === 'fax' ? 'this fax' : esc(t.name.toLowerCase())) + '?</h3></div>' +
      '<div class="sb2">This sends ' + totalPages() + ' page' + (totalPages() === 1 ? '' : 's') + ' (PDF) to the recipient by fax and logs the transmission. Sending PHI out of the practice is an audited action.</div>' +
      '<div class="send-recip"><div class="recip-sq ' + sqCls(c.type) + '" style="width:34px;height:34px;border-radius:9px">' + recipSqIcon(c) + '</div>' +
      '<div class="recip-main"><div class="recip-name">' + esc(c.adhoc ? c.faxes[0] : c.name) + '</div>' +
      '<div class="recip-sub">' + (c.adhoc ? 'Direct fax' : 'Fax ' + esc(c.faxes[0])) + ' ' + netChip(c) + '</div></div></div>' + warn +
      '<div class="sf"><button class="btn btn-light" data-act="cancel-send">Cancel</button>' +
      '<button class="btn btn-blue" data-act="do-send">' + I.send + 'Send & log</button></div></div>';
    document.querySelector('.cmp').appendChild(scrim);
  }
  function runSend() {
    var scrim = document.getElementById('sendScrim');
    var steps = [
      ['Building PDF (authoritative)', 'Rendering ' + totalPages() + ' pages'],
      ['Attaching structured payload', 'Latent — for on-network receivers'],
      ['Transmitting to fax', null],
      ['Logging PHI egress', 'Audit · send']
    ];
    scrim.querySelector('.send-card').innerHTML = '<div class="sending"><div class="spinner" style="margin:0 auto;width:30px;height:30px"></div>' +
      '<div class="steps">' + steps.map(function (s, i) { return '<div class="stp" data-step="' + i + '"><span class="si">' + (i + 1) + '</span>' + esc(s[0]) + '</div>'; }).join('') + '</div></div>';
    var i = 0;
    var iv = setInterval(function () {
      var el = scrim.querySelector('[data-step="' + i + '"]');
      if (el) { el.classList.add('done'); el.querySelector('.si').innerHTML = I.check; }
      i++;
      var nx = scrim.querySelector('[data-step="' + i + '"]'); if (nx) nx.classList.add('active');
      if (i >= steps.length) { clearInterval(iv); setTimeout(sentScreen, 480); }
    }, 600);
    var first = scrim.querySelector('[data-step="0"]'); if (first) first.classList.add('active');
  }
  function sentScreen() {
    var c = recip();
    var what = S.mode === 'fax' ? 'fax' : tmpl(S.template).name.toLowerCase();
    var tx = 'TX-' + Math.floor(48200 + Math.random() * 900);
    var scrim = document.getElementById('sendScrim');
    scrim.querySelector('.send-card').innerHTML = '<div class="sent"><div class="ok-ic">' + I.okbig + '</div>' +
      '<h3>Sent to ' + esc(c.adhoc ? c.faxes[0] : c.name) + '</h3>' +
      '<div class="ss">The ' + esc(what) + ' is queued for delivery. Track it in Outbound' + (S.mode === 'reply' ? '; it has been appended to the Case timeline.' : '.') + '</div>' +
      '<div class="tx"><div class="row"><span class="k">Transmission</span><span class="v mono">' + tx + '</span></div>' +
      '<div class="row"><span class="k">Recipient</span><span class="v">' + esc(c.adhoc ? c.faxes[0] : c.name) + '</span></div>' +
      '<div class="row"><span class="k">Pages</span><span class="v">' + totalPages() + ' (PDF + structured payload)</span></div>' +
      '<div class="row"><span class="k">Status</span><span class="v"><span class="st new"><span class="d"></span>Queued</span></span></div>' +
      (S.mode === 'reply' ? '<div class="row"><span class="k">Case</span><span class="v mono">' + esc(D.REPLY.caseId) + '</span></div>' : '') +
      '<div class="row"><span class="k">Audit</span><span class="v"><span class="logged-inline">' + I.logged + 'send · logged</span></span></div></div>' +
      '<div class="acts"><button class="btn btn-light" data-act="close-sent">New fax</button>' +
      '<button class="btn btn-blue" data-act="go-outbound">View in Outbound</button></div></div>';
    logToast('Sent · ' + esc(c.adhoc ? c.faxes[0] : c.name), 'Access logged — PHI egress recorded to audit.');
  }

  /* ---------------- toast ---------------- */
  function logToast(t, s) {
    var host = document.getElementById('logToasts'); if (!host) return;
    var el = document.createElement('div');
    el.className = 'logtoast';
    el.innerHTML = '<span class="lic">' + I.logged + '</span><div><div class="lt">' + t + '</div><div class="ls">' + s + '</div></div>';
    host.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 320); }, 4200);
  }

  /* ---------------- field-meta live update ---------------- */
  function setVal(key, v) { S.values[key] = v; }
  function updateMeta(key) {
    var chip = document.querySelector('[data-prov="' + key + '"]');
    if (chip) { var h = document.createElement('div'); h.innerHTML = provChip(key); chip.replaceWith(h.firstChild); }
    var inp = document.querySelector('[data-key="' + key + '"]'); if (inp) inp.classList.toggle('flagged', provState(key) === 'blank');
    var note = document.querySelector('[data-note="' + key + '"]'); if (note && provState(key) !== 'blank') note.remove();
  }
  function refreshPicker() {
    var pop = document.querySelector('.recip-pop'); if (!pop) return;
    var fresh = document.createElement('div'); fresh.innerHTML = recipPop();
    pop.replaceWith(fresh.firstChild);
    var si = document.getElementById('recipSearch'); if (si) { si.focus(); si.setSelectionRange(si.value.length, si.value.length); }
  }

  /* ---------------- events ---------------- */
  document.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-key');
    if (k && !e.target.hasAttribute('data-change')) { setVal(k, e.target.value); updateMeta(k); renderRight(); return; }
    if (e.target.id === 'recipSearch') { S._q = e.target.value; if (document.querySelector('.recip-list')) refreshPicker(); }
  });
  document.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-key');
    if (k && e.target.hasAttribute('data-change')) { setVal(k, e.target.value); updateMeta(k); renderRight(); }
  });

  document.addEventListener('click', function (e) {
    if (S.pickerOpen && !e.target.closest('.recip')) { S.pickerOpen = false; S.creating = false; render(); return; }
    var t = e.target.closest('[data-act],[data-pick],[data-template],[data-zoom],[data-checklist],[data-toggle],[data-detach]');
    if (!t) return;
    var act = t.getAttribute('data-act');

    if (t.hasAttribute('data-template')) { chooseTemplate(t.getAttribute('data-template')); return; }
    if (t.hasAttribute('data-pick')) { S.recipient = t.getAttribute('data-pick'); S.adhocRecip = null; S.pickerOpen = false; S._q = ''; render(); return; }
    if (t.hasAttribute('data-zoom')) {
      S.zoom = Math.max(0.6, Math.min(1.6, S.zoom + (t.getAttribute('data-zoom') === '+' ? 0.15 : -0.15)));
      var w = document.getElementById('pvWrap'); if (w) w.style.transform = 'scale(' + S.zoom + ')';
      var z = document.getElementById('zlbl'); if (z) z.textContent = Math.round(S.zoom * 100) + '%'; return;
    }
    if (t.hasAttribute('data-checklist')) {
      var key = t.getAttribute('data-checklist'), opt = t.getAttribute('data-opt');
      var arr = S.values[key] || []; var ix = arr.indexOf(opt);
      if (ix >= 0) arr.splice(ix, 1); else arr.push(opt);
      S.values[key] = arr; t.classList.toggle('on'); t.querySelector('.box').innerHTML = ix >= 0 ? '' : I.check;
      updateMeta(key); renderRight(); return;
    }
    if (t.hasAttribute('data-toggle')) { var bk = t.getAttribute('data-toggle'); S.values[bk] = !S.values[bk]; t.classList.toggle('on'); renderRight(); return; }
    if (t.hasAttribute('data-detach')) { S.attachments.splice(+t.getAttribute('data-detach'), 1); render(); return; }

    switch (act) {
      case 'toggle-picker': S.pickerOpen = !S.pickerOpen; S.creating = false; render(); break;
      case 'start-create': S.creating = true; refreshPicker(); break;
      case 'cancel-create': S.creating = false; refreshPicker(); break;
      case 'use-direct': {
        var num = (document.getElementById('directFax') || {}).value;
        if (!num || !num.trim()) { document.getElementById('directFax').classList.add('flagged'); break; }
        S.adhocRecip = { id: '__adhoc', adhoc: true, name: 'Fax recipient', type: 'other', location: 'Direct fax', faxes: [num.trim()], network: null };
        S.recipient = '__adhoc'; S.pickerOpen = false; S._q = ''; render();
        logToast('Direct fax set', esc(num.trim()) + ' — one-off recipient.');
        break;
      }
      case 'save-create': {
        var nm = (document.getElementById('ncName') || {}).value;
        if (!nm) { document.getElementById('ncName').classList.add('flagged'); break; }
        var ty = document.getElementById('ncType').value, fx = document.getElementById('ncFax').value || '(000) 000-0000', lc = document.getElementById('ncLoc').value || 'Unknown city';
        var id = 'CT-NEW-' + (CONTACTS.length + 1);
        CONTACTS.push({ id: id, kind: 'contact', name: nm, type: ty, location: lc, faxes: [fx], email: '', phone: '', network: null, active: true, docs30: 0, last: '2026-06-15', weeks: [] });
        S.recipient = id; S.adhocRecip = null; S.pickerOpen = false; S.creating = false; S._q = ''; render();
        logToast('Contact created', esc(nm) + ' added to the directory.');
        break;
      }
      case 'pick-file': { var fi = document.getElementById('faxFile'); if (fi) fi.click(); break; }
      case 'add-sample': {
        var samples = [{ name: 'Patient chart — Bella.pdf', pages: 3 }, { name: 'Lab results — CBC panel.pdf', pages: 2 }, { name: 'Vaccine certificate.pdf', pages: 1 }];
        S.attachments.push(Object.assign({ type: 'pdf', uploaded: true }, samples[S.attachments.length % samples.length]));
        render(); break;
      }
      case 'toggle-cover': S.includeCover = !S.includeCover; render(); break;
      case 'add-attach': logToast('Pick from Case', 'In the build this opens the Case document picker.'); break;
      case 'browse-templates': browseTemplates(); break;
      case 'switch-template': S.view = 'start'; render(); break;
      case 'go-fax': startFax(); render(); break;
      case 'go-reply': startReply(); render(); break;
      case 'preview-page': { var ps = document.getElementById('pvScroll'); if (ps) ps.scrollTo({ top: 0, behavior: 'smooth' }); break; }
      case 'send': if (canSend()) sendConfirm(); break;
      case 'cancel-send': { var s1 = document.getElementById('sendScrim'); if (s1) s1.remove(); break; }
      case 'do-send': runSend(); break;
      case 'close-sent': { var s2 = document.getElementById('sendScrim'); if (s2) s2.remove(); startFax(); render(); break; }
      case 'go-outbound': window.location.href = '../outbound/Robin Dock - Outbound.html'; break;
    }
  });

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

  document.addEventListener('DOMContentLoaded', function () { shell(); startFax(); render(); });
})();
