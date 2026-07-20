/* ============================================================
   RobinDock — Fulfillment · DOCUMENT PANE + SHARED HELPERS
   Renders the source document (the evidence) into the left pane:
   a realistic rendered fax (letterhead, signalment, clinical body,
   tables, signature) built from the SAME task data the stepper
   verifies, plus the viewer chrome (thumbnail rail with relevant-
   page markers, zoom, rotate). Exposes shared icons + helpers on
   window.RD_FF for the controller.
   ============================================================ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  var ICON = {
    back:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevDown:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkSm: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    logged:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    paw:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><ellipse cx="7" cy="9" rx="1.8" ry="2.4" fill="currentColor"/><ellipse cx="12" cy="7.2" rx="2" ry="2.6" fill="currentColor"/><ellipse cx="17" cy="9" rx="1.8" ry="2.4" fill="currentColor"/><path d="M12 12c-2.9 0-4.8 2.1-4.8 4.1C7.2 17.9 9 18.4 12 18.4s4.8-.5 4.8-2.3C16.8 14.1 14.9 12 12 12z" fill="currentColor"/></svg>',
    spark:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.7 5L19 10l-5.3 2L12 17l-1.7-5L5 10l5.3-2L12 3z" fill="currentColor"/></svg>',
    info:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    alert:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    lock:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pencil:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    rotate:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 10-1.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20 5v6h-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 19h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    more:    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></svg>',
    reassign:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M16 3l4 4-4 4M20 7H8a4 4 0 00-4 4v1M8 21l-4-4 4-4M4 17h12a4 4 0 004-4v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dept:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20V9l5-3 5 3M4 20h16M4 20V9m10 11V6.5L20 9v11M9 20v-4h2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    person:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    caseic:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 8a2 2 0 012-2h3l2 2h7a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    unclaim: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flag:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 21V4m0 0l11 1.5L14 9l3 3.5L6 14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fork:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 3v6a3 3 0 003 3h6m0 0l-3-3m3 3l-3 3M18 21v-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    add:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    push:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 19V6m0 0l-5 5m5-5l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 5h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    reopen:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-2.6-6.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M21 4v5h-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* type glyphs for the header tile */
    tLab:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6l-4.6 8.2A2 2 0 007.2 20h9.6a2 2 0 001.8-2.8L14 9V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    tRef:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 19l14-7L5 5v5l8 2-8 2v5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    tRec:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    tVax:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---- rendered-fax building blocks (.rich classes from triage.css) ---- */
  function letterhead(s, kicker, page, total) {
    var addr = (s.loc || 'Salt Lake City, UT 84101') + '<br/>' +
      (s.channel === 'upload' ? 'Submitted via portal' : 'Fax ' + (s.faxNo || 'Unknown number'));
    return '<div class="rlet"><div class="rlhd">' +
        '<div class="rorg">' + esc(s.name) + '</div><div class="raddr">' + addr + '</div></div>' +
      '<div class="rmeta">' +
        (kicker ? '<div class="rkick">' + esc(kicker) + '</div>' : '') +
        '<div>' + esc(s.channel === 'upload' ? 'OWNER PORTAL' : (s.faxNo || '')) + '</div>' +
        '<div>PAGE ' + page + ' / ' + total + '</div></div></div>';
  }
  function grid(rows) {
    return '<div class="rgrid">' + rows.map(function (r) {
      return '<div class="rf"><span class="k">' + esc(r[0]) + '</span><span class="v">' + r[1] + '</span></div>';
    }).join('') + '</div>';
  }
  function sec(t) { return '<div class="rsec">' + esc(t) + '</div>'; }
  function hl(s) { return '<mark class="aih">' + esc(s) + '</mark>'; }

  /* ---- per-type first-page bodies ---- */
  var BODY = {
    lab: function (t, s, page, total) {
      var rows = (t.results || []).map(function (r) {
        var flc = r.flag === 'critical' ? 'critical' : r.flag === 'high' ? 'high' : r.flag === 'low' ? 'low' : '';
        var fl = (r.flag && r.flag !== 'normal') ? '<span class="rfl ' + (r.flag === 'critical' ? 'hi' : r.flag === 'high' ? 'hi' : 'lo') + '">' + (r.flag === 'critical' ? '!!' : r.flag === 'high' ? 'H' : 'L') + '</span>' : '';
        var v = (r.flag && r.flag !== 'normal') ? hl(r.value) : esc(r.value);
        return '<tr><td>' + esc(r.analyte) + '</td><td class="num">' + v + '</td><td>' + esc(r.unit) + '</td><td>' + esc(r.range) + '</td><td class="flag">' + fl + '</td></tr>';
      }).join('');
      return letterhead(t.sender, 'Lab report', page, total) +
        '<div class="rtitle">' + hl('Diagnostic Laboratory Report') + '</div>' +
        '<div class="rdate">Accession ' + hl(getHeader(t, 'accession_number')) + ' \u00b7 Reported ' + esc(getHeader(t, 'reported_at')) + '</div>' +
        grid([
          ['Patient', hl(esc(s.patient)) + ' \u00b7 ' + esc(s.species) + (s.breed ? ', ' + esc(s.breed) : '')],
          ['Owner', esc(s.owner)],
          ['Specimen', esc(s.specimen || 'Serum') + ' \u00b7 ' + esc(s.weight || '')],
          ['Panel', esc(getHeader(t, 'panel_name'))]
        ]) +
        sec('Results') +
        '<table class="rtable"><thead><tr><th>Analyte</th><th class="num">Result</th><th>Units</th><th>Reference</th><th class="flag">Flag</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        sec('Interpretation') +
        '<p class="rp">' + esc(t.interpretation || '') + '</p>' +
        '<div class="rlabfoot">Performed at ' + esc(s.name) + ' \u00b7 Clinical Pathology review on file</div>';
    },
    referral: function (t, s, page, total) {
      var n = t.narrative || {};
      return letterhead(t.sender, 'Referral', page, total) +
        '<div class="rtitle">' + hl('Referral / Consultation Request') + '</div>' +
        '<div class="rdate">Referred to Mountain West Veterinary \u00b7 ' + esc(getRef(t, 'rabies_date') ? 'Rabies on file' : '') + '</div>' +
        grid([
          ['Patient', hl(esc(s.patient)) + ' \u00b7 ' + esc(s.species) + ', ' + esc(s.breed)],
          ['Owner', esc(s.owner)],
          ['Referring DVM', hl(esc(s.dvm || 'Elena Ortiz, DVM'))],
          ['Weight', esc(s.weight || '')]
        ]) +
        sec('Reason for referral') +
        '<p class="rp">' + hlWords(n.reason || '', [s.patient, 'cranial cruciate']) + '</p>' +
        sec('Relevant history') +
        '<p class="rp">' + esc(n.history || '') + '</p>' +
        sec('Requested service') +
        '<p class="rp">' + hlWords(n.requested || '', ['TPLO']) + '</p>' +
        '<div class="rsign"><div class="rsig-line"></div><div class="rsig-name">' + esc(s.dvm || 'Elena Ortiz, DVM') + '</div>' +
          '<div class="rsig-role">Referring Veterinarian \u00b7 ' + esc(s.name) + '</div></div>';
    },
    vaccine: function (t, s, page, total) {
      var rows = (t.vaccine || []).slice(0, 3).map(function (f) {
        return '<tr><td>' + esc(f.label) + '</td><td>' + esc(f.value) + '</td></tr>';
      }).join('');
      return letterhead(t.sender, 'Vaccine cert', page, total) +
        '<div class="rtitle">' + hl('Rabies Vaccination Certificate') + '</div>' +
        '<div class="rdate">' + esc(getVax(t, 'tag')) + ' \u00b7 ' + esc(getVax(t, 'rabies_date')) + '</div>' +
        grid([
          ['Patient', hl(esc(s.patient)) + ' \u00b7 ' + esc(s.species) + ', ' + esc(s.breed)],
          ['Owner', esc(s.owner)],
          ['Weight', esc(s.weight || '')],
          ['Issued by', esc(s.name)]
        ]) +
        sec('Certificate detail') +
        '<table class="rtable"><tbody>' + rows + '</tbody></table>' +
        '<div class="rtagrow"><span class="rtag">' + hl('Rabies tag ' + getVax(t, 'tag')) + '</span><span class="rtag muted">Expires ' + esc(getVax(t, 'expires')) + '</span></div>' +
        '<div class="rsign"><div class="rsig-line"></div><div class="rsig-name">Marcus Reed, DVM</div>' +
          '<div class="rsig-role">Administering Veterinarian \u00b7 ' + esc(s.name) + '</div></div>';
    },
    records: function (t, s, page, total) {
      return letterhead(t.sender, 'Records', page, total) +
        '<div class="rtitle">Inbound Document</div>' +
        '<div class="rdate">' + esc(t.title) + '</div>' +
        grid([['From', esc(s.name)], ['Re: patient', esc((s.patient || 'Unspecified'))], ['Pages', total + '']]) +
        sec('Message') +
        '<p class="rp">Document received and pending verification. Read the page(s) and confirm the patient before completing the record.</p>';
    }
  };

  function getHeader(t, key) { var f = (t.labHeader || []).filter(function (x) { return x.key === key; })[0]; return f ? f.value : ''; }
  function getRef(t, key) { var f = (t.referral || []).filter(function (x) { return x.key === key; })[0]; return f ? f.value : ''; }
  function getVax(t, key) { var f = (t.vaccine || []).filter(function (x) { return x.key === key; })[0]; return f ? f.value : ''; }
  function hlWords(text, words) {
    var out = esc(text);
    (words || []).forEach(function (w) {
      if (!w) return;
      var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i');
      out = out.replace(re, '<mark class="aih">$1</mark>');
    });
    return out;
  }

  function continuation(t, s, page, total) {
    return letterhead(t.sender, (t.type === 'lab' ? 'Lab report' : t.type === 'referral' ? 'Referral' : 'Document'), page, total) +
      '<div class="rtitle small">' + esc(t.title) + ' <span class="rcont-badge">cont\u2019d</span></div>' +
      '<div class="rdate">Page ' + page + ' of ' + total + '</div>' +
      '<p class="rp">Continued from the preceding page. ' + (t.type === 'lab' ? 'Hematology morphology, instrument flags and quality-control notes continue here.' : 'Prior treatment summary and supporting notes continue here.') + '</p>' +
      sec('Notes') +
      '<p class="rp">All findings are part of the same transmission. Refer to the first page for patient identification and sender.</p>' +
      '<p class="rp small">End of section.</p>';
  }

  function pageHTML(t, ds) {
    var s = t.signalment || {};
    var page = ds.page, total = t.totalPages || 1;
    var rel = (t.relevantPages || []).indexOf(page) >= 0;
    var inner;
    if (page === 1) inner = (BODY[t.type] || BODY.records)(t, s, page, total);
    else inner = continuation(t, s, page, total);
    var tr = 'rotate(' + (ds.rot || 0) + 'deg) scale(' + (ds.zoom || 1) + ')';
    return '<div class="tg-page rich' + (ds.hl ? ' hl' : '') + '" style="transform:' + tr + '">' + inner + '</div>';
  }

  function thumbs(t, ds) {
    var total = t.totalPages || 1, out = '';
    for (var p = 1; p <= total; p++) {
      var rel = (t.relevantPages || []).indexOf(p) >= 0;
      out += '<div class="thumb' + (p === ds.page ? ' on' : '') + (rel ? ' relevant' : '') + '" data-ff-page="' + p + '">' +
        (rel ? '<span class="relflag">' + ICON.checkSm + '</span>' : '') +
        '<span class="pn">' + p + '</span></div>';
    }
    return out;
  }

  /* unreadable arrival */
  function unreadable(t, ds) {
    return '<div class="viewer"><div class="thumbs"><div class="thumb"><span class="pn">\u2014</span></div></div>' +
      '<div class="vmain"><div class="vbar"><div><div class="vt">Unreadable arrival</div>' +
        '<div class="vsub">' + esc(t.id) + ' \u00b7 ' + esc(t.sender.name) + '</div></div><div class="vspace"></div>' +
        '<span class="vbtn" data-ff="download">' + ICON.download + '</span></div>' +
        '<div class="vstage"><div class="tg-unreadable"><div class="gic">' + ICON.alert + '</div>' +
          '<h4>Document could not be rendered</h4>' +
          '<p>The fax arrived garbled. There is nothing legible to verify against \u2014 flag it for review.</p>' +
          '<div class="garble"><div class="g"></div><div class="g"></div><div class="g"></div><div class="g"></div></div>' +
        '</div></div></div></div>';
  }

  function viewer(t, ds) {
    if (t.unreadable) return unreadable(t, ds);
    var title = t.type === 'lab' ? 'Diagnostic Laboratory Report' :
      t.type === 'referral' ? 'Referral / Consultation Request' :
      t.type === 'vaccine' ? 'Rabies Vaccination Certificate' : 'Inbound Document';
    var relCount = (t.relevantPages || []).length;
    var relTag = (relCount && relCount < (t.totalPages || 1))
      ? '<span class="vrel">' + ICON.info + 'Relevant: pp. ' + (t.relevantPages.join(', ')) + '</span>' : '';
    return '<div class="viewer">' +
      '<div class="thumbs">' + thumbs(t, ds) + '</div>' +
      '<div class="vmain">' +
        '<div class="vbar"><div><div class="vt">' + esc(title) + '</div>' +
          '<div class="vsub">' + esc(t.id) + ' \u00b7 ' + esc(t.sender.name) + '</div></div>' + relTag +
          '<div class="vspace"></div>' +
          '<span class="vbtn hltoggle' + (ds.hl ? ' on' : '') + '" data-ff="toggle-hl" title="Toggle extracted-field highlights">' + ICON.spark + '</span>' +
          '<span class="vbtn" data-ff="rotate" title="Rotate">' + ICON.rotate + '</span>' +
          '<div class="vzoom"><span class="zb" data-ff="zoom-out">\u2212</span><span class="zl">' + Math.round((ds.zoom || 1) * 100) + '%</span><span class="zb" data-ff="zoom-in">+</span></div>' +
          '<span class="vbtn" data-ff="download" title="Download (logged)">' + ICON.download + '</span>' +
        '</div>' +
        '<div class="vstage">' + pageHTML(t, ds) + '</div>' +
        '<div class="vlegend"><span class="vlg-sw"></span>' +
          '<span class="vlg-t"><b>Extracted content</b> \u2014 highlights the spans that pre-filled the fields</span>' +
          '<span class="vlg-x" data-ff="toggle-hl">' + (ds.hl ? 'Hide' : 'Show') + '</span></div>' +
      '</div></div>';
  }

  window.RD_FF = { esc: esc, ICON: ICON };
  window.RD_FF_DOC = { viewer: viewer };
})();
