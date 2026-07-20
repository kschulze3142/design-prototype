/* ============================================================
   RobinDock — Inbox · CONTROLLER
   The front-desk workhorse. A busy, non-technical worker clears a
   pile of inbound documents (faxes + emails). The populated list is
   the hero; the primary action on any row must be obvious in ~2s.

   This is a self-contained prototype: documents live in memory and
   mutate locally (read/unread, classify, complete, trash, spam,
   assign). Mock data only — opening a document navigates to the
   fulfillment surface and logs access.
   ============================================================ */
(function () {
  'use strict';

  var content = document.getElementById('appContent');

  /* ---------------- icons ---------------- */
  var I = {
    fax: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 8V4h10v4M7 18h10v3H7zM5 8h14a2 2 0 012 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 7l7.5 5.5L19.5 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* source-category glyphs */
    scLab: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6l-4.6 8.2A2 2 0 007.2 20h9.6a2 2 0 001.8-2.8L14 9V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scGp: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 20V9l5-3 5 3M5 20h14M5 20V9m10 11V6.5L20 9v11M10 20v-4h2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    scSpec: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 13.2L7 21l5-2.8 5 2.8-1.5-7.8" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    scImg: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 8V6.5A2.5 2.5 0 016.5 4H8M16 4h1.5A2.5 2.5 0 0120 6.5V8M20 16v1.5a2.5 2.5 0 01-2.5 2.5H16M8 20H6.5A2.5 2.5 0 014 17.5V16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7 12h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    scEr: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 4h6a1 1 0 011 1v3h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V9a1 1 0 011-1h3V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    scReg: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    scOther: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 21V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V21M15 9h2.5A1.5 1.5 0 0119 10.5V21M3.5 21h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8h2M8 12h2M8 16h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scQ: '<svg viewBox="0 0 24 24" fill="none"><path d="M9.3 9a2.7 2.7 0 015.2 1c0 1.8-2.7 2.5-2.7 2.5M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>',
    /* row actions */
    type: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 8.5V5.5A1.5 1.5 0 015.5 4h4.7a1.5 1.5 0 011 .4l8 7.6a1.6 1.6 0 010 2.3l-4.5 4.4a1.6 1.6 0 01-2.3 0L4.9 11.2a1.5 1.5 0 01-.9-1.4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="8.4" cy="8.4" r="1.3" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5.5A1.5 1.5 0 0111.5 4h1A1.5 1.5 0 0114 5.5V7M6.5 7l.7 11a1.5 1.5 0 001.5 1.4h6.6a1.5 1.5 0 001.5-1.4L17.5 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spam: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3l9-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9.5v4M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    assign: '<svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 19c0-3.2 2.6-5.2 5.5-5.2 1 0 2 .25 2.8.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.5 14v6M14.5 17h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    envelopeOpen: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 10.5l8-5.5 8 5.5M4 10.5V18a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 18v-7.5M4 10.5l8 5 8-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    envelope: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="1.6" stroke="currentColor" stroke-width="1.7"/><path d="M4.6 7l7.4 5.4L19.4 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kebab: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18.5" r="1.5" fill="currentColor"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    chevD: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.6V12l3 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    contact: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    userOutline: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M5.6 19c0-3.6 2.9-6 6.4-6s6.4 2.4 6.4 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    funnel: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5h16l-6.2 7.4V19l-3.6-2v-3.9L4 5.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    sort: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 5v14M7 19l-3-3M7 5l3 3M17 19V5M17 5l3 3M17 19l-3-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    inboxBig: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 13l2.5-7A2 2 0 018.4 4.7h7.2a2 2 0 011.9 1.3L20 13M4 13v4.5A1.5 1.5 0 005.5 19h13a1.5 1.5 0 001.5-1.5V13M4 13h4l1.5 2.5h5L16 13h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* calm-marker + edge-state glyphs */
    dup: '<svg viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="11" height="12" rx="1.6" stroke="currentColor" stroke-width="1.7"/><path d="M5 16V5.5A1.5 1.5 0 016.5 4H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    reply: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5M4.5 12H14a5 5 0 015 5v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cover: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 7.5h7M8.5 11h7M8.5 14.5h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none"><path d="M19 5v4h-4M5 19v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4 9A7 7 0 006 7.5M5.6 15A7 7 0 0018 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v10m0 0l-4-4m4 4l4-4M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    client: '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 4.5a3 3 0 010 5.6M18.5 19c0-2.4-1.4-4.2-3.5-4.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    paw: '<svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="9" r="1.7" fill="currentColor"/><circle cx="12" cy="6.5" r="1.7" fill="currentColor"/><circle cx="17" cy="9" r="1.7" fill="currentColor"/><path d="M12 11c-2.4 0-4.3 2-4.3 3.7 0 1.4 1.1 2.1 2.3 2.1.9 0 1.3-.4 2-.4s1.1.4 2 .4c1.2 0 2.3-.7 2.3-2.1C16.3 13 14.4 11 12 11z" fill="currentColor"/></svg>',
    pawOutline: '<svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="9.5" r="1.4" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="7" r="1.4" stroke="currentColor" stroke-width="1.5"/><circle cx="17" cy="9.5" r="1.4" stroke="currentColor" stroke-width="1.5"/><path d="M12 12c-2.2 0-4 1.9-4 3.5 0 1.3 1 1.9 2.1 1.9.8 0 1.2-.35 1.9-.35s1.1.35 1.9.35c1.1 0 2.1-.6 2.1-1.9C16 13.9 14.2 12 12 12z" stroke="currentColor" stroke-width="1.5"/></svg>',
    /* species glyphs — simple filled silhouettes, sized for the patient avatar */
    catFace: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4.2l3 3.4-3 1.6z"/><path d="M18 4.2l-3 3.4 3 1.6z"/><circle cx="12" cy="13" r="6.4"/></svg>',
    bird: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5a5.5 5.5 0 015.5 5.5c0 .3.2.45.5.4l2.5-.4-1.6 2.1c-.9 2-2.9 3.4-5.4 3.4A5.5 5.5 0 016 12.7l-2.6 1 1.4-2.6A5.5 5.5 0 0112 5z"/><path d="M17.4 8.4l3-1-2 2.2z"/></svg>',
    rabbit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 9.6C7.8 7.6 7.4 4.3 8.8 3.7c1.2-.5 2.3 1.8 2.6 4.5z"/><path d="M15 9.6c1.2-2 1.6-5.3.2-5.9-1.2-.5-2.3 1.8-2.6 4.5z"/><circle cx="12" cy="14.2" r="5.2"/></svg>',
    house: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5L12 5l8 6.5M6 10.5V19a1 1 0 001 1h10a1 1 0 001-1v-8.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20v-5h4v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- people (assignees) ---------------- */
  var ME = { key: 'me', name: 'Kai Sandoval', initials: 'KS', av: 'blue' };
  var PEOPLE = {
    me: ME,
    dv: { key: 'dv', name: 'Dana Voss', initials: 'DV', av: '' },
    ml: { key: 'ml', name: 'Mateo Luna', initials: 'ML', av: 'aqua' }
  };

  /* ---------------- document types ---------------- */
  var TYPES = {
    lab: { cls: 'ty-lab', label: 'Lab' },
    ref: { cls: 'ty-ref', label: 'Referral' },
    rec: { cls: 'ty-rec', label: 'Records' },
    req: { cls: 'ty-req', label: 'Records request' },
    vax: { cls: 'ty-vax', label: 'Vaccine / rabies' },
    unc: { cls: 'ty-unc', label: 'Unclassified' }
  };
  var CLASSIFY = ['lab', 'ref', 'rec', 'req', 'vax']; // real types offered in the set-type menu
  /* a glyph per document type — used in the set-type menu so each row reads like the Unassigned row */
  var TYPEICON = {
    lab: '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 3h5M10.5 3v5.5l-4 7.2A2 2 0 008.3 19h7.4a2 2 0 001.8-3.3l-4-7.2V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 14h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    ref: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 4l6 5-6 5v-3C9 11 6 13 5 17c-.3-5 2-9 9-9V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    rec: '<svg viewBox="0 0 24 24" fill="none"><rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    req: '<svg viewBox="0 0 24 24" fill="none"><path d="M13.5 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M15 4h5v5M20 4l-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    vax: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l6.5 2.2v5c0 4.2-2.8 7.3-6.5 8.6-3.7-1.3-6.5-4.4-6.5-8.6v-5L12 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.2 11.7l2 2 3.6-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- the inbox (mock) — newest first within each day ---------------- */
  var NAV_TOTAL = 412; // Gmail-style backlog count shown in the left-nav Inbox item

  /* anchored "now" for the prototype — this morning, just after the latest arrival.
     Relative to whatever day the inbox is opened, so it always reads as today/yesterday. */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var NOW = new Date(); NOW.setHours(10, 5, 0, 0);
  function startOfDay(date) { var n = new Date(date); n.setHours(0, 0, 0, 0); return n; }

  var seq = 0;
  function doc(o) {
    o.id = 'd' + (++seq); o.read = !o.unread; o.done = !!o.done; o.trashed = false; o.spam = false; o.sel = false;
    // real timestamp from day + HHMM-encoded time, so the list sorts and labels by recency
    var base = startOfDay(NOW);
    if (o.day === 'yesterday') base.setDate(base.getDate() - 1);
    var hh = Math.floor((o.t || 0) / 100), mm = (o.t || 0) % 100;
    base.setHours(hh, mm, 0, 0);
    o.ts = base.getTime();
    return o;
  }

  /* Gmail-style "when" label: today → clock time; earlier this year → "Jun 25";
     a prior year → "M/D/YY". */
  function whenLabel(d) {
    var dt = new Date(d.ts);
    if (dt.getFullYear() === NOW.getFullYear() && dt.getMonth() === NOW.getMonth() && dt.getDate() === NOW.getDate())
      return d.time; // today — already-formatted clock time (incl. "Now")
    if (dt.getFullYear() === NOW.getFullYear())
      return MON[dt.getMonth()] + ' ' + dt.getDate();
    return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + String(dt.getFullYear()).slice(-2);
  }

  var DOCS = [
    /* ---- TODAY ---- */
    /* edge: a fax mid-receipt — lives in the pile with a quiet "Receiving" flag */
    doc({ day: 'today', t: 1001, time: 'Now', sender: 'Incoming fax', type: null, chan: 'fax', line: 'main line', raw: '+1 (520) 555-0119', state: 'arriving' }),
    doc({ day: 'today', t: 942, time: '9:42 AM', sender: 'Antech Diagnostics', type: 'lab', chan: 'fax', line: 'lab results line', pages: 4, unread: true, assignee: null, crit: 'K⁺ 7.9 mmol/L', client: 'Nguyen, Tracy', pt: { name: 'Bella', type: 'Dog' } }),
    /* multi-type: one fax carrying records + a lab + a rabies cert */
    doc({ day: 'today', t: 925, time: '9:25 AM', sender: 'Oasis Animal Hospital', types: ['rec', 'lab', 'vax'], type: 'rec', chan: 'fax', line: 'records line', pages: 14, unread: true, assignee: null, client: 'Alvarez, Marco', pt: { name: 'Cooper', type: 'Dog' } }),
    /* calm marker: cover sheet */
    doc({ day: 'today', t: 918, time: '9:18 AM', sender: 'Mesa Valley Animal Hospital', type: 'ref', chan: 'fax', line: 'referrals line', pages: 6, unread: true, assignee: 'dv', markers: [{ k: 'cover' }], client: 'Park, Helen', pt: { name: 'Luna', type: 'Cat' } }),
    /* edge: unknown sender — raw number + faint CSID hint (not yet matched to a patient) */
    doc({ day: 'today', t: 855, time: '8:55 AM', sender: '+1 (480) 555-0173', unknown: true, csid: 'SUNRISE VET AZ', type: 'unc', chan: 'fax', line: 'main line', pages: 2, unread: true, assignee: null }),
    /* unclassified from a KNOWN contact → recommended types surface inside the type dropdown */
    doc({ day: 'today', t: 842, time: '8:42 AM', sender: 'Sonoran Veterinary Specialists', type: 'unc', suggest: [
      { k: 'ref', conf: 'high', why: [['Contact', 'Sonoran Veterinary Specialists is a referring specialty hospital'], ['Channel', 'Arrived on your referrals fax line'], ['Document', 'Cover page header reads \u201cPatient Referral\u201d']] },
      { k: 'rec', conf: 'medium', why: [['Document', '5 pages \u2014 specialty visits usually include medical records'], ['Contact', 'This hospital routinely attaches records to referrals']] }
    ], chan: 'fax', line: 'referrals line', pages: 5, unread: true, assignee: null, client: 'Foster, Ray', pt: { name: 'Diesel', type: 'Dog' } }),
    /* calm marker: likely reply to one of our outbound requests */
    doc({ day: 'today', t: 830, time: '8:30 AM', sender: 'IDEXX Reference Labs', type: 'lab', chan: 'mail', line: 'results@idexx.com', pages: 3, unread: false, assignee: 'me', sync: true, markers: [{ k: 'reply' }], client: 'Tanaka, Joy', pt: { name: 'Mochi', type: 'Cat' } }),
    /* edge: unreadable scan — can't be matched until re-sent */
    doc({ day: 'today', t: 812, time: '8:12 AM', sender: 'Whitfield Mobile Vet', type: null, chan: 'fax', line: 'main line', pages: 2, unread: false, assignee: null, state: 'unreadable' }),
    /* calm marker: duplicate grouped */
    doc({ day: 'today', t: 758, time: '7:58 AM', sender: 'Desert Ridge Veterinary', type: 'rec', chan: 'fax', line: 'records line', pages: 12, unread: true, assignee: null, markers: [{ k: 'dup', n: 1 }], client: 'Brooks, Dana', pt: { name: 'Rocky', type: 'Dog' } }),
    doc({ day: 'today', t: 740, time: '7:40 AM', sender: 'Maricopa County Rabies Registry', type: 'vax', chan: 'mail', line: 'rabies-registry@maricopa.gov', pages: 1, unread: false, assignee: 'ml', client: 'Romero, Eli', pt: { name: 'Ginger', type: 'Bird' } }),
    doc({ day: 'today', t: 735, time: '7:35 AM', sender: 'Sunrise Pet Clinic', type: 'req', chan: 'fax', line: 'main line', pages: 1, unread: false, assignee: null, client: 'Webb, Sara' }),
    /* ---- YESTERDAY ---- */
    /* edge: receipt failed — retry inline (nothing received to match) */
    doc({ day: 'yesterday', t: 1740, time: '5:40 PM', sender: 'Antech Diagnostics', type: null, chan: 'fax', line: 'lab results line', pages: null, unread: true, assignee: null, state: 'failed' }),
    /* edge: partial — hit the page cap mid-transmission */
    doc({ day: 'yesterday', t: 1651, time: '4:51 PM', sender: 'Banfield Pet Hospital', type: 'rec', chan: 'fax', line: 'records line', pages: 50, unread: false, assignee: null, state: 'partial', client: 'Hale, Ian', pt: { name: 'Zoe', type: 'Dog' } }),
    doc({ day: 'yesterday', t: 1522, time: '3:22 PM', sender: '+1 (602) 555-0148', unknown: true, type: 'unc', chan: 'fax', line: 'main line', pages: 3, unread: false, assignee: null }),
    doc({ day: 'yesterday', t: 1410, time: '2:10 PM', sender: 'VCA Animal Specialty', type: 'ref', chan: 'fax', line: 'referrals line', pages: 5, unread: false, assignee: 'dv', client: 'Stone, Will', pt: { name: 'Max', type: 'Dog' } }),
    doc({ day: 'yesterday', t: 1336, time: '1:36 PM', sender: 'Antech Diagnostics', type: 'lab', chan: 'fax', line: 'lab results line', pages: 2, unread: false, assignee: null, client: 'Reyes, Nora', pt: { name: 'Pepper', type: 'Cat' } }),
    doc({ day: 'yesterday', t: 1148, time: '11:48 AM', sender: 'Paws & Claws Mobile Vet', type: 'vax', chan: 'mail', line: 'records@pawsclaws.vet', pages: 1, unread: false, assignee: 'ml', client: 'Day, Owen', pt: { name: 'Biscuit', type: 'Rabbit' } }),
    doc({ day: 'yesterday', t: 1015, time: '10:15 AM', sender: 'Trupanion', type: 'req', chan: 'fax', line: 'main line', pages: 2, unread: false, assignee: null, client: 'Cross, Mae', pt: { name: 'Shadow', type: 'Cat' } }),
    doc({ day: 'yesterday', t: 930, time: '9:30 AM', sender: 'Mesa Valley Animal Hospital', type: 'rec', chan: 'fax', line: 'records line', pages: 8, unread: true, assignee: null, client: 'Pena, Luis', pt: { name: 'Daisy', type: 'Dog' } }),
    doc({ day: 'yesterday', t: 805, time: '8:05 AM', sender: 'Foothills Emergency Vet', type: 'ref', chan: 'fax', line: 'main line', pages: 4, unread: false, assignee: 'me', client: 'Lamb, Joel', pt: { name: 'Tucker', type: 'Dog' } }),
    /* ---- already completed (hidden unless "Show completed") ---- */
    doc({ day: 'today', t: 705, time: '7:05 AM', sender: 'Camelback Animal Clinic', type: 'rec', chan: 'mail', line: 'records@camelbackvet.com', pages: 3, done: true, doneBy: 'Kai Sandoval', assignee: 'me', client: 'Frost, Gail', pt: { name: 'Olive', type: 'Cat' } }),
    doc({ day: 'yesterday', t: 1730, time: '5:30 PM', sender: 'Antech Diagnostics', type: 'lab', chan: 'fax', line: 'lab results line', pages: 5, done: true, doneBy: 'Dana Voss', assignee: 'dv', client: 'Sims, Dale', pt: { name: 'Bruno', type: 'Dog' } }),
    doc({ day: 'yesterday', t: 902, time: '9:02 AM', sender: 'Gilbert Veterinary', type: 'vax', chan: 'fax', line: 'main line', pages: 1, done: true, doneBy: 'Kai Sandoval', assignee: 'me', client: 'Knox, Faye', pt: { name: 'Mittens', type: 'Cat' } })
  ];

  var DAYS = [{ key: 'today', label: 'Today' }, { key: 'yesterday', label: 'Yesterday' }];

  /* ---------------- view state ---------------- */
  var view = {
    unread: false, unclassified: false, mine: false,
    date: 'any', contact: 'all', channel: 'all',
    showDone: false, sort: 'newest'
  };
  var CONTACTS = [
    ['all', 'All contact types'], ['lab', 'Diagnostic lab'], ['gp', 'Referring practice'],
    ['spec', 'Specialty'], ['er', 'Emergency'], ['reg', 'Registry / public'], ['ins', 'Insurer'], ['unk', 'Unknown sender']
  ];

  /* ---------------- helpers ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function person(k) { return PEOPLE[k] || null; }
  function avatar(p, size) { return '<span class="av ' + (p.av || '') + '" style="--av:' + (size || 26) + 'px">' + esc(p.initials) + '</span>'; }
  function unassignedAv() { return '<span class="un-av">' + I.userOutline + '</span>'; }
  /* Jira-style assignee chip: avatar when owned, a grey person circle when not — click opens the assign menu */
  function assigneeCell(d) {
    if (d.assignee) {
      var p = person(d.assignee);
      return '<button class="ib-assignee" data-assign="' + d.id + '" title="Assigned to ' + esc(p.name) + ' \u00b7 click to reassign">' + avatar(p, 26) + '</button>';
    }
    return '<button class="ib-assignee un" data-assign="' + d.id + '" title="Unassigned \u00b7 click to assign">' + unassignedAv() + '</button>';
  }
  function chanGlyph(c) { return c === 'mail' ? I.mail : I.fax; }
  function chanLabel(c) { return c === 'mail' ? 'Email' : 'Fax'; }

  function sourceMeta(d) {
    if (d.unknown) return { cls: 'unk', label: 'Unknown sender', icon: I.scQ };
    var s = (d.sender || '').toLowerCase();
    if (/antech|idexx|diagnostic|\blab\b|patholog|reference/.test(s)) return { cls: 'lab', label: 'Diagnostic lab', icon: I.scLab };
    if (/registry|county|public|state/.test(s)) return { cls: 'reg', label: 'Registry / public', icon: I.scReg };
    if (/emergenc|\ber\b|urgent/.test(s)) return { cls: 'er', label: 'Emergency / ER', icon: I.scEr };
    if (/specialty|specialist|vca animal special|derm|cardio|surg|dental|oncolog|neurolog|ophthalm|ortho/.test(s)) return { cls: 'spec', label: 'Specialty', icon: I.scSpec };
    if (/imaging|radiolog|mri/.test(s)) return { cls: 'img', label: 'Imaging', icon: I.scImg };
    if (/trupanion|nationwide|insur|petplan/.test(s)) return { cls: 'ins', label: 'Insurer', icon: I.scOther };
    if (/clinic|hospital|veterinary|\bvet\b|pet|animal|paws|claws|bark/.test(s)) return { cls: 'gp', label: 'Referring practice', icon: I.scGp };
    return { cls: 'other', label: 'Other', icon: I.scOther };
  }

  /* ---------------- filtering + sorting ---------------- */
  function filtersActive() {
    return view.unread || view.unclassified || view.mine ||
      view.date !== 'any' || view.contact !== 'all' || view.channel !== 'all';
  }
  function passes(d) {
    if (d.done && !view.showDone) return false;
    if (view.unread && d.read) return false;
    if (view.unclassified && d.type !== 'unc') return false;
    if (view.mine && d.assignee !== 'me') return false;
    if (view.date !== 'any' && d.day !== view.date) return false;
    if (view.channel !== 'all' && d.chan !== view.channel) return false;
    if (view.contact !== 'all' && sourceMeta(d).cls !== view.contact) return false;
    return true;
  }
  function sortRows(rows) {
    var s = view.sort, a = rows.slice();
    a.sort(function (x, y) {
      if (s === 'sender') return x.sender.toLowerCase() < y.sender.toLowerCase() ? -1 : (x.sender.toLowerCase() > y.sender.toLowerCase() ? 1 : 0);
      if (s === 'unread') { if (x.read !== y.read) return x.read ? 1 : -1; return y.ts - x.ts; }
      if (s === 'oldest') return x.ts - y.ts;
      return y.ts - x.ts; // newest first
    });
    return a;
  }

  /* rows the user can tick — visible, not completed, not still arriving */
  function selectableVisible() { return DOCS.filter(function (d) { return passes(d) && !d.done && d.state !== 'arriving'; }); }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    var visible = DOCS.filter(passes);
    var anySel = DOCS.some(function (d) { return d.sel; });

    // select-all state across the selectable visible rows (excludes done + arriving)
    var selv = selectableVisible();
    var selN = selv.filter(function (d) { return d.sel; }).length;
    var allCls = selN === 0 ? '' : (selN === selv.length ? ' on' : ' dash');

    var listHtml = '';
    if (!visible.length) {
      listHtml = emptyState();
    } else {
      listHtml = sortRows(visible).map(rowHtml).join('');
    }

    var total = filtersActive() ? visible.length : NAV_TOTAL;
    var end = visible.length;
    var moreBacklog = !filtersActive(); // imagined further pages exist only in the full backlog

    content.innerHTML =
      '<div class="ib">' +
        strip() +
        '<div class="ib-scroll" id="ibScroll">' +
          '<div class="ib-grid ib-head">' +
            '<span class="h-sel"><span class="ck ib-selall' + allCls + '" id="selAll" data-selall role="checkbox" aria-checked="' + (allCls === ' on') + '" title="' + (selN ? 'Clear selection' : 'Select all') + '"></span></span><span class="h-assignee"></span>' +
            '<span class="h-type">Type</span>' +
            '<span class="h-sender">Document &amp; sender</span>' +
            '<span class="h-client">Client</span>' +
            '<span class="h-patient">Patient</span>' +
            '<span class="h-status">Status</span>' +
            '<span class="h-time h-num">Arrived</span>' +
          '</div>' +
          listHtml +
        '</div>' +
        '<div class="ib-foot">' +
          '<span class="range">' + (end ? '1\u2013<b>' + end + '</b>' : '0') + ' of <b>' + total + '</b></span>' +
          '<div class="pg">' +
            '<span class="pb dis" title="Previous page">' + I.chevL + '</span>' +
            '<span class="pb' + (moreBacklog ? '' : ' dis') + '" id="pgNext" title="Next page">' + I.chevR + '</span>' +
          '</div>' +
        '</div>' +
        bulkBar() +
      '</div>';

    var navc = document.getElementById('navCount'); if (navc) navc.textContent = NAV_TOTAL;
  }

  function strip() {
    var unreadN = DOCS.filter(function (d) { return !d.done && d.read === false; }).length;
    var uncN = DOCS.filter(function (d) { return !d.done && d.type === 'unc'; }).length;

    var dateLbl = { any: 'Date', today: 'Today', yesterday: 'Yesterday' }[view.date];
    var contactLbl = view.contact === 'all' ? 'Contact type' : (CONTACTS.filter(function (c) { return c[0] === view.contact; })[0] || ['', 'Contact type'])[1];
    var moreOn = view.channel !== 'all';

    return '<div class="ib-strip" id="ibStrip"><div class="ib-filters">' +
        chip('unread', view.unread, 'Unread', unreadN) +
        chip('unclassified', view.unclassified, 'Unclassified', uncN) +
        chip('mine', view.mine, 'Assigned to me', null) +
        '<span class="sep"></span>' +
        dropChip('date', view.date !== 'any', I.cal, dateLbl) +
        dropChip('contact', view.contact !== 'all', I.contact, contactLbl) +
        dropChip('more', moreOn, I.funnel, 'More filters') +
        '<span class="grow"></span>' +
        '<label class="ib-showdone" id="showDone"><span class="toggle' + (view.showDone ? ' on' : '') + '"></span>Show completed</label>' +
        '<button class="ib-sort" id="sortBtn"><span class="ic">' + I.sort + '</span><span class="lbl">Sort:</span>' + sortLabel() + ' <span class="ch">' + I.chevD + '</span></button>' +
      '</div></div>';
  }

  /* floating bulk bar — bottom-center, persistent (only Clear/✕ dismisses it) */
  function bulkBar() {
    var rows = DOCS.filter(function (d) { return d.sel; });
    if (!rows.length) return '';
    var anyUnread = rows.some(function (d) { return d.read === false; });
    return '<div class="ib-bulkbar" id="ibBulk" role="toolbar" aria-label="Bulk actions">' +
        '<span class="bb-cnt"><span class="bb-n">' + rows.length + '</span> selected</span>' +
        '<span class="bb-sep"></span>' +
        '<button class="bb-act" data-bulk="type" id="bulkType">' + I.type + '<span class="l">Set type</span></button>' +
        '<button class="bb-act" data-bulk="done">' + I.check + '<span class="l">Complete</span></button>' +
        '<button class="bb-act" data-bulk="assign" id="bulkAssign">' + I.assign + '<span class="l">Assign</span></button>' +
        '<button class="bb-act" data-bulk="read">' + (anyUnread ? I.envelopeOpen : I.envelope) + '<span class="l">' + (anyUnread ? 'Mark read' : 'Mark unread') + '</span></button>' +
        '<button class="bb-act" data-bulk="download">' + I.download + '<span class="l">Download</span></button>' +
        '<span class="bb-sep"></span>' +
        '<button class="bb-act" data-bulk="trash">' + I.trash + '<span class="l">Trash</span></button>' +
        '<button class="bb-act danger" data-bulk="spam">' + I.spam + '<span class="l">Spam</span></button>' +
        '<button class="bb-close" data-bulk="clear" title="Clear selection">' + I.x + '</button>' +
      '</div>';
  }
  function chip(key, on, label, n) {
    return '<button class="ib-chip' + (on ? ' on' : '') + '" data-chip="' + key + '">' + esc(label) +
      (n != null ? '<span class="n">' + n + '</span>' : '') + '</button>';
  }
  function dropChip(key, set, icon, label) {
    return '<button class="ib-chip' + (set ? ' set' : '') + '" data-drop="' + key + '"><span class="ic">' + icon + '</span>' + esc(label) + '<span class="ch">' + I.chevD + '</span></button>';
  }
  function sortLabel() {
    return { newest: 'Newest first', oldest: 'Oldest first', unread: 'Unread first', sender: 'Sender A\u2013Z' }[view.sort];
  }

  /* ---- cell helpers — each addition stays quiet ---- */
  function typeSlot(d) {
    if (d.type === 'unc') {
      // unclassified → prompt to classify; the dropdown surfaces any recommended types
      return '<div class="ib-types" data-typecell="' + d.id + '"><button class="ib-addtype" type="button"><span class="p">+</span>Add doc type</button></div>';
    }
    var arr = (d.types && d.types.length) ? d.types : (d.type ? [d.type] : []);
    if (!arr.length) return '<div class="ib-types" data-typecell="' + d.id + '"></div>';
    var cap = arr.length > 2 ? 1 : 2; // 3+ collapses to one tag + a count chip, keeping a single line
    var shown = arr.slice(0, cap).map(function (k) { var m = TYPES[k]; return '<span class="tag ' + m.cls + '"><span class="d"></span>' + m.label + '</span>'; }).join('');
    var more = arr.length > cap ? '<span class="ib-tmore has-tip" data-tip="' + esc(arr.map(function (k) { return TYPES[k].label; }).join(', ')) + '">+' + (arr.length - cap) + '</span>' : '';
    return '<div class="ib-types' + (more ? ' nowrap' : '') + '" data-typecell="' + d.id + '">' + shown + more + '</div>';
  }
  /* edge-state flags ride beside the name — recognizable at a glance, soft, never alarming */
  function nameFlags(d) {
    var out = d.crit ? '<span class="ib-crit">' + I.alert + 'Critical</span>' : '';
    if (d.state === 'arriving') out += '<span class="ib-flag arriving"><span class="pulse"></span>Receiving</span>';
    else if (d.state === 'unreadable') out += '<span class="ib-flag unreadable">' + I.alert + 'Unreadable</span>';
    else if (d.state === 'partial') out += '<span class="ib-flag partial">Partial \u00b7 page cap</span>';
    else if (d.state === 'failed') out += '<span class="ib-flag failed">' + I.alert + 'Failed</span>';
    return out;
  }
  /* source line: channel · line [· raw number] [· faint CSID hint] + calm markers */
  function srcLine(d) {
    var extras = '';
    if (d.raw) extras += '<span class="dot"></span><span class="ib-raw">' + esc(d.raw) + '</span>';
    if (d.csid) extras += '<span class="dot"></span><span class="ib-csid">CSID \u201c' + esc(d.csid) + '\u201d</span>';
    var mk = (d.markers || []).map(function (m) {
      if (m.k === 'dup') return '<span class="ib-mk" title="An earlier identical fax was merged into this one">' + I.dup + (m.n || 1) + ' duplicate grouped</span>';
      if (m.k === 'reply') return '<span class="ib-mk reply" title="Matches an outbound request we sent">' + I.reply + 'Likely reply</span>';
      if (m.k === 'cover') return '<span class="ib-mk" title="First page is a fax cover sheet">' + I.cover + 'Cover sheet</span>';
      return '';
    }).join('');
    return '<span class="ib-src"><span class="chan">' + chanGlyph(d.chan) + chanLabel(d.chan) + '</span><span class="dot"></span><span class="txt">' + esc(d.line) + '</span>' + extras + mk + '</span>';
  }
  /* PATIENT (the animal) — paw avatar + name + pet-type pill. When no patient is
     linked but we know the client, offer an "Add patient" affordance; with no
     client either (edge / unmatched docs) it stays a bare em-dash. */
  /* species → icon + color class for the patient avatar / pill */
  var SPECIES = {
    Cat: { cls: 'cat', icon: I.catFace },
    Bird: { cls: 'bird', icon: I.bird },
    Rabbit: { cls: 'rabbit', icon: I.rabbit }
  };
  function speciesOf(type) { return SPECIES[type] || { cls: 'dog', icon: I.paw }; }
  /* households roster — the search source for the link-client / link-patient popovers */
  var CLIENTS = [
    { name: 'Foster, Ray', pets: [{ name: 'Diesel', type: 'Dog' }, { name: 'Olive', type: 'Cat' }] },
    { name: 'Webb, Sara', pets: [{ name: 'Biscuit', type: 'Dog' }] },
    { name: 'Reyes, Nora', pets: [{ name: 'Mango', type: 'Bird' }] },
    { name: 'Stone, Will', pets: [{ name: 'Rosie', type: 'Dog' }] },
    { name: 'Cross, Mae', pets: [{ name: 'Shadow', type: 'Cat' }] },
    { name: 'Pena, Luis', pets: [{ name: 'Luna', type: 'Cat' }, { name: 'Rocky', type: 'Dog' }] },
    { name: 'Lamb, Joel', pets: [{ name: 'Bear', type: 'Dog' }] },
    { name: 'Nguyen, Tam', pets: [{ name: 'Pepper', type: 'Rabbit' }] },
    { name: 'Alvarez, Ruth', pets: [{ name: 'Coco', type: 'Dog' }] },
    { name: 'Park, Dana', pets: [{ name: 'Milo', type: 'Cat' }] },
    { name: 'Brooks, Sam', pets: [{ name: 'Daisy', type: 'Dog' }, { name: 'Ziggy', type: 'Bird' }] },
    { name: 'Tanaka, Joy', pets: [{ name: 'Mochi', type: 'Cat' }] }
  ];
  function clientPets(name) { for (var i = 0; i < CLIENTS.length; i++) if (CLIENTS[i].name === name) return CLIENTS[i].pets || []; return []; }
  function patientCell(d) {
    var p = d.pt;
    if (p) {
      var sp = speciesOf(p.type);
      return '<div class="ib-pt">' +
        '<span class="ib-pt-av ' + sp.cls + '">' + sp.icon + '</span>' +
        '<div class="ib-pt-main">' +
          '<span class="ib-pt-name">' + esc(p.name) + '</span>' +
          '<span class="ib-pt-type ' + sp.cls + '">' + esc(p.type) + '</span>' +
        '</div></div>';
    }
    if (d.client) {
      return '<button class="ib-pt-add" data-addpatient="' + d.id + '" title="Link a patient to this document">' +
        '<span class="ib-pt-av un">' + I.pawOutline + '</span><span class="t">Add patient</span></button>';
    }
    return '<span class="ib-pt empty">\u2014</span>';
  }
  /* CLIENT (owner / household) — house avatar + name. When no client is linked
     it becomes an "Add client" affordance (dashed house); on edge docs with no
     subject yet (arriving / unreadable / failed) it's a bare em-dash. */
  function clientCell(d) {
    if (d.client) {
      return '<span class="ib-cl"><span class="ib-cl-av">' + I.house + '</span>' +
        '<span class="ib-cl-name">' + esc(d.client) + '</span></span>';
    }
    if (d.state === 'arriving' || d.state === 'unreadable' || d.state === 'failed')
      return '<span class="ib-cl empty">\u2014</span>';
    return '<button class="ib-cl-add" data-addclient="' + d.id + '" title="Link a client to this document">' +
      '<span class="ib-cl-av un">' + I.house + '</span><span class="t">Add client</span></button>';
  }

  function pagesCell(d) {
    if (d.pages == null) return '<span class="ib-pages"><span class="u">\u2014</span></span>';
    return '<span class="ib-pages">' + d.pages + ' <span class="u">pp</span></span>';
  }

  /* STATUS — derived from each document's processing state. The "what needs to
     happen" column: review → in progress → syncing to PIMS → completed, plus the
     receiving / awaiting edge states. PIMS = the practice's records system
     (the vet-world equivalent of an EHR). */
  function statusOf(d) {
    if (d.done)                 return { cls: 'done',   label: 'Completed',       ind: 'dot' };
    if (d.state === 'arriving') return { cls: 'recv',   label: 'Receiving',        ind: 'spin' };
    if (d.sync)                 return { cls: 'sync',   label: 'Syncing to PIMS',  ind: 'spin' };
    if (d.state === 'failed' || d.state === 'unreadable') return { cls: 'await', label: 'Awaiting resend', ind: 'clock' };
    if (d.state === 'partial')  return { cls: 'await',  label: 'Awaiting pages',   ind: 'clock' };
    if (d.crit)                 return { cls: 'urgent', label: 'Urgent review',    ind: 'dot' };
    if (d.type === 'unc')       return { cls: 'review', label: 'Assign doc type',  ind: 'dot' };
    if (d.read === false)       return { cls: 'review', label: 'Review needed',    ind: 'dot' };
    if (d.assignee)             return { cls: 'prog',   label: 'In progress',      ind: 'dot' };
    return { cls: 'queue', label: 'In queue', ind: 'ring' };
  }
  function statusCell(d) {
    var s = statusOf(d);
    var ind = s.ind === 'spin' ? '<span class="ib-st-spin"></span>'
            : s.ind === 'clock' ? '<span class="ib-st-clock">' + I.clock + '</span>'
            : s.ind === 'ring' ? '<span class="ib-st-ring"></span>'
            : '<span class="ib-st-dot"></span>';
    return '<span class="ib-status st-' + s.cls + '">' + ind + '<span class="ib-st-lbl">' + esc(s.label) + '</span></span>';
  }

  function rowHtml(d) {
    var src = sourceMeta(d);

    if (d.done) {
      var td = TYPES[d.type];
      return '<div class="ib-row done ib-grid" data-id="' + d.id + '">' +
        '<span class="ib-c1"></span>' +
        '<span class="ib-done-status">' + I.checkCircle + 'Done</span>' +
        '<div class="ib-types"><span class="tag ' + td.cls + '"><span class="d"></span>' + td.label + '</span></div>' +
        '<div class="ib-sender"><span class="srcsq ' + src.cls + '">' + src.icon + '</span>' +
          '<div class="ib-who"><span class="ib-name"><span class="nm' + (d.unknown ? ' unk' : '') + '">' + esc(d.sender) + '</span></span></div></div>' +
        clientCell(d) +
        patientCell(d) +
        statusCell(d) +
        '<span class="ib-time">' + whenLabel(d) + '</span>' +
      '</div>';
    }

    /* arriving — a fax mid-receipt. Quiet, not selectable, not yet openable. */
    if (d.state === 'arriving') {
      return '<div class="ib-row arriving ib-grid" data-id="' + d.id + '">' +
        '<span class="ib-c1"></span>' +
        '<span class="ib-assignee un static">' + unassignedAv() + '</span>' +
        '<div class="ib-types"></div>' +
        '<div class="ib-sender"><span class="srcsq ' + src.cls + '">' + src.icon + '</span>' +
          '<div class="ib-who"><span class="ib-name"><span class="nm">' + esc(d.sender) + '</span>' + nameFlags(d) + '</span></div></div>' +
        clientCell(d) +
        patientCell(d) +
        statusCell(d) +
        '<span class="ib-time">' + whenLabel(d) + '</span>' +
      '</div>';
    }

    var assignee = assigneeCell(d);

    return '<div class="ib-row ' + (d.read ? 'read' : 'unread') + (d.sel ? ' sel' : '') + (d.state ? ' st-' + d.state : '') + ' ib-grid" data-id="' + d.id + '">' +
      '<span class="ib-c1">' +
        '<span class="ib-dot"></span>' +
        '<span class="ib-ck ck' + (d.sel ? ' on' : '') + '" data-check="' + d.id + '" role="checkbox" aria-checked="' + d.sel + '"></span>' +
      '</span>' +
      assignee +
      typeSlot(d) +
      '<div class="ib-sender">' +
        '<span class="srcsq ' + src.cls + ' has-tip" data-tip="' + esc(src.label) + '">' + src.icon + '</span>' +
        '<div class="ib-who">' +
          '<span class="ib-name"><span class="nm' + (d.unknown ? ' unk' : '') + '">' + esc(d.sender) + '</span>' + nameFlags(d) + '</span>' +
        '</div>' +
        (d.state === 'failed' ? '<button class="ib-retry" data-retry="' + d.id + '" title="Retry receiving this fax">' + I.refresh + 'Retry</button>' : '') +
      '</div>' +
      clientCell(d) +
      patientCell(d) +
      statusCell(d) +
      '<span class="ib-time">' + whenLabel(d) + '</span>' +
      /* hover actions: 3 priority (type / complete / trash) + quieter cluster behind a divider */
      '<div class="ib-actions">' +
        '<button class="ib-act done" data-act="done" data-id="' + d.id + '" title="Mark complete">' + I.check + '</button>' +
        '<button class="ib-act trash" data-act="trash" data-id="' + d.id + '" title="Move to trash">' + I.trash + '</button>' +
        '<span class="ib-actsep"></span>' +
        '<button class="ib-act q" data-act="read" data-id="' + d.id + '" title="' + (d.read ? 'Mark as unread' : 'Mark as read') + '">' + (d.read ? I.envelope : I.envelopeOpen) + '</button>' +
        '<button class="ib-act q" data-act="spam" data-id="' + d.id + '" title="Mark as spam">' + I.spam + '</button>' +
      '</div>' +
    '</div>';
  }

  function emptyState() {
    if (!filtersActive() && !DOCS.some(function (d) { return !d.done; })) {
      return '<div class="ib-empty clear"><div class="ei">' + I.checkCircle + '</div><h3>You\u2019ve cleared the pile</h3>' +
        '<p>Every fax and email has been classified and routed. New documents will land here as they arrive \u2014 for now there\u2019s nothing waiting on you.</p>' +
        '<div class="ib-empty-cap">' + I.inboxBig + ' Inbox zero \u00b7 a healthy inbox trends here</div></div>';
    }
    return '<div class="ib-empty"><div class="ei">' + I.funnel + '</div><h3>Nothing matches these filters</h3>' +
      '<p>The pile isn\u2019t empty \u2014 your current filters just don\u2019t match anything. Clear them to see the full inbox again.</p>' +
      '<button class="ec" id="clearFilters">Clear all filters</button></div>';
  }

  function byId(id) { for (var i = 0; i < DOCS.length; i++) if (DOCS[i].id === id) return DOCS[i]; return null; }

  /* ============================================================
     ACTIONS
     ============================================================ */
  var lastRemoved = null; // for undo on remove (complete / trash / spam)

  function removeRow(d, kind) {
    var row = content.querySelector('.ib-row[data-id="' + d.id + '"]');
    var apply = function () {
      if (kind === 'done') { d.done = true; d.doneBy = ME.name; }
      else if (kind === 'trash') d.trashed = true;
      else if (kind === 'spam') d.spam = true;
      d.sel = false;
      render();
    };
    // remove from list: completed only show when showDone; trashed/spam always leave
    if (kind === 'done' && view.showDone) { apply(); return; }
    if (row) { row.classList.add('leaving'); setTimeout(apply, 240); } else apply();
  }

  function doComplete(d) {
    lastRemoved = { d: d, prev: { done: d.done, doneBy: d.doneBy } };
    removeRow(d, 'done');
    toast('Marked complete', d.sender + ' \u00b7 routed and closed', 'ok', function () { d.done = false; d.doneBy = null; render(); });
  }
  function doTrash(d) {
    lastRemoved = { d: d };
    removeRow(d, 'trash');
    toast('Moved to trash', d.sender, 'bad', function () { d.trashed = false; render(); });
  }
  function doSpam(d) {
    confirmSpam([d]);
  }
  function doRead(d) {
    d.read = !d.read;
    render();
    toast(d.read ? 'Marked as read' : 'Marked as unread', d.sender, 'blue');
  }
  function setType(d, ty) {
    var was = d.type; d.type = ty; render();
    toast('Document type set', d.sender + ' \u2192 ' + TYPES[ty].label, 'ok', function () { d.type = was; render(); });
  }
  function assignTo(d, key) {
    d.assignee = key;
    render();
    toast(key ? 'Assigned' : 'Unassigned', d.sender + (key ? ' \u2192 ' + person(key).name : ' \u00b7 returned to pool'), 'blue');
  }

  /* ---- bulk ---- */
  function selected() { return DOCS.filter(function (d) { return d.sel; }); }
  function bulk(kind, trigger) {
    var rows = selected(); if (!rows.length) return;
    var n = rows.length;
    if (kind === 'clear') { rows.forEach(function (d) { d.sel = false; }); render(); return; }
    if (kind === 'read') {
      var anyUnread = rows.some(function (d) { return d.read === false; });
      rows.forEach(function (d) { d.read = anyUnread; });
      render(); toast('Marked ' + n + (anyUnread ? ' read' : ' unread'), '', 'blue'); return;
    }
    if (kind === 'type') {
      var html = '<div class="pl">Set type on ' + n + '</div>' + CLASSIFY.map(function (k) {
        return '<button data-val="' + k + '"><span class="tag ' + TYPES[k].cls + '"><span class="d"></span>' + TYPES[k].label + '</span><span class="tick">' + I.check + '</span></button>';
      }).join('');
      openMenu(trigger, html, function (k) { rows.forEach(function (d) { d.type = k; d.sel = false; }); render(); toast('Set ' + n + ' \u2192 ' + TYPES[k].label, '', 'ok'); });
      return;
    }
    if (kind === 'download') { rows.forEach(function (d) { d.sel = false; }); render(); toast('Downloading ' + n + ' documents', 'Preparing a combined PDF', 'blue'); return; }
    if (kind === 'done') { rows.forEach(function (d) { d.done = true; d.doneBy = ME.name; d.sel = false; }); render(); toast('Completed ' + n + ' documents', 'Routed and closed', 'ok'); return; }
    if (kind === 'trash') { rows.forEach(function (d) { d.trashed = true; d.sel = false; }); render(); toast('Trashed ' + n + ' documents', '', 'bad'); return; }
    if (kind === 'spam') { confirmSpam(rows); return; }
  }

  /* ============================================================
     FLOATING MENUS (type / assign / date / contact / more / sort)
     ============================================================ */
  var menuEl = null, menuTrigger = null;
  function ensureMenu() {
    if (menuEl) return menuEl;
    menuEl = document.createElement('div');
    menuEl.className = 'ib-pop';
    document.body.appendChild(menuEl);
    return menuEl;
  }
  function openMenu(trigger, html, onPick, extraClass) {
    ensureMenu();
    if (menuTrigger === trigger && menuEl.classList.contains('open')) { closeMenu(); return; }
    closeMenu();
    menuTrigger = trigger;
    menuEl.className = 'ib-pop' + (extraClass ? ' ' + extraClass : '');
    menuEl.innerHTML = html;
    menuEl._onPick = onPick;
    menuEl._onToggle = null;
    menuEl.style.visibility = 'hidden'; menuEl.classList.add('open');
    var r = trigger.getBoundingClientRect();
    var mw = menuEl.offsetWidth, mh = menuEl.offsetHeight;
    var left = Math.min(r.left, window.innerWidth - mw - 12);
    var top = r.bottom + 6;
    if (top + mh > window.innerHeight - 12) top = Math.max(12, r.top - mh - 6);
    menuEl.style.left = Math.max(12, left) + 'px';
    menuEl.style.top = top + 'px';
    menuEl.style.visibility = '';
    if (trigger.classList) trigger.classList.add('open', 'active');
  }
  function closeMenu() {
    if (menuEl) menuEl.classList.remove('open');
    if (menuTrigger && menuTrigger.classList) menuTrigger.classList.remove('open', 'active');
    menuTrigger = null;
  }
  function menuPick(handler) { return function (e) { var b = e.target.closest('button[data-val]'); if (!b) return; e.stopPropagation(); var v = b.dataset.val; closeMenu(); handler(v); }; }

  /* current type set for a doc (multi-aware) */
  function docTypes(d) {
    if (d.types && d.types.length) return d.types.slice();
    if (d.type && d.type !== 'unc') return [d.type];
    return [];
  }
  function applyTypes(d, set) {
    set = set.slice().sort(function (a, b) { return CLASSIFY.indexOf(a) - CLASSIFY.indexOf(b); });
    if (!set.length) { d.type = 'unc'; d.types = null; }
    else { d.types = set; d.type = set[0]; d.suggest = null; }
  }

  /* SET DOCUMENT TYPE — multi-select. Toggling a chip adds/removes that type;
     the menu stays open and the row's tags update live. Recommended types (when the
     sender + document give a confident signal) surface at the top with a confidence badge. */
  function confBadge(s) {
    var rows = (s.why || []).map(function (w) {
      return '<span class="ib-why-row"><b>' + w[0] + '</b><span>' + esc(w[1]) + '</span></span>';
    }).join('');
    var n = s.conf === 'high' ? 3 : 2, bars = '';
    for (var i = 1; i <= 3; i++) bars += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return '<span class="ib-conf conf-' + s.conf + '" tabindex="0"><span class="ib-bars">' + bars + '</span>' + (s.conf === 'high' ? 'High' : 'Medium') + '<span class="ib-q" aria-hidden="true">?</span>' +
      '<span class="ib-why"><span class="ib-why-h">Why we recommend this</span>' + rows + '</span></span>';
  }
  var I_SEARCH = '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.4" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var I_PLUS = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  function typeMenu(d, trigger) {
    var sugg = (d.suggest && d.suggest.length) ? d.suggest : null;
    var cur = docTypes(d);
    function typeRow(k, badge) {
      var on = cur.indexOf(k) >= 0;
      return '<button data-typetoggle="' + k + '" data-typename="' + esc(TYPES[k].label.toLowerCase()) + '" class="ib-typerow ' + (badge ? 'rec ' : '') + (on ? 'on' : '') + '">' +
        '<span class="sw ' + TYPES[k].cls + '">' + TYPEICON[k] + '</span>' +
        '<span class="ib-tylabel">' + TYPES[k].label + '</span>' + (badge || '') +
        '<span class="tick">' + I.check + '</span></button>';
    }
    var html = '<div class="pl">Set document type \u00b7 select all that apply</div>' +
      '<div class="ib-typesearch"><span class="ib-ts-ic">' + I_SEARCH + '</span><input type="text" class="ib-typesearch-in" placeholder="Search document types\u2026" autocomplete="off" spellcheck="false" /></div>' +
      // Unassigned sits in its own section at the very top
      '<button data-typeclear data-typename="unassigned unclassified none clear" class="ib-typerow ib-typeclear ' + (cur.length ? '' : 'on') + '">' +
        '<span class="sw">' + I.contact + '</span><span class="ib-tylabel">Unassigned</span>' +
        '<span class="ib-clear-sub">clears all types</span><span class="tick">' + I.check + '</span></button>' +
      '<div class="psep js-unc-sep"></div>';
    if (sugg) {
      html += '<div class="pl pl-rec js-rec-h">Recommended</div>' +
        sugg.map(function (s) { return typeRow(s.k, confBadge(s)); }).join('') +
        '<div class="psep js-rec-sep"></div>';
    }
    html += '<div class="pl js-all-h">All types</div>' +
      CLASSIFY.map(function (k) { return typeRow(k); }).join('') +
      '<div class="ib-noresult" hidden>No matching types</div>' +
      '<div class="psep"></div><button data-typedone class="ib-typedone">Done</button>';
    openMenu(trigger, html, null, 'ib-typemenu');
    function syncClear() {
      var clr = menuEl.querySelector('[data-typeclear]');
      if (clr) clr.classList.toggle('on', docTypes(d).length === 0);
    }
    menuEl._onToggle = function (k) {
      var set = docTypes(d);
      var i = set.indexOf(k), added = i < 0;
      if (added) set.push(k); else set.splice(i, 1);
      applyTypes(d, set);
      var on = docTypes(d).indexOf(k) >= 0;
      // keep both copies (Recommended + All types) of the same type in sync
      [].forEach.call(menuEl.querySelectorAll('[data-typetoggle="' + k + '"]'), function (b) { b.classList.toggle('on', on); });
      syncClear();
      render();
      toast(TYPES[k].label + (added ? ' added' : ' removed'), d.sender, added ? 'ok' : 'blue');
    };
    menuEl._onClear = function () {
      if (docTypes(d).length === 0) return;
      applyTypes(d, []); // back to Unclassified
      [].forEach.call(menuEl.querySelectorAll('[data-typetoggle]'), function (b) { b.classList.remove('on'); });
      syncClear();
      render();
      toast('Set to Unassigned', d.sender + ' \u2014 document type cleared', 'blue');
    };
    // Jira-style live filter
    var input = menuEl.querySelector('.ib-typesearch-in');
    if (input) {
      input.focus();
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        var anyRec = false, anyAll = false, uncVis = false;
        [].forEach.call(menuEl.querySelectorAll('button[data-typename]'), function (b) {
          var match = !q || b.dataset.typename.indexOf(q) >= 0;
          b.hidden = !match;
          if (match) {
            if (b.hasAttribute('data-typeclear')) uncVis = true;
            else if (b.classList.contains('rec')) anyRec = true;
            else anyAll = true;
          }
        });
        var uncSep = menuEl.querySelector('.js-unc-sep');
        if (uncSep) uncSep.hidden = !uncVis;
        var recH = menuEl.querySelector('.js-rec-h'), recSep = menuEl.querySelector('.js-rec-sep');
        if (recH) recH.hidden = !anyRec;
        if (recSep) recSep.hidden = !anyRec;
        var allH = menuEl.querySelector('.js-all-h');
        if (allH) allH.hidden = !anyAll;
        var none = menuEl.querySelector('.ib-noresult');
        if (none) none.hidden = anyRec || anyAll || uncVis;
      });
    }
  }
  function assignMenu(d, trigger) {
    var roster = [ME, PEOPLE.dv, PEOPLE.ml];
    var html = '<div class="pl">Assign to</div>' + roster.map(function (p) {
      return '<button data-val="' + p.key + '" class="' + (d.assignee === p.key ? 'on' : '') + '"><span class="sw" style="background:transparent">' + avatar(p, 22) + '</span>' + esc(p.name) + (p.key === 'me' ? ' (you)' : '') + '<span class="tick">' + I.check + '</span></button>';
    }).join('') + '<div class="psep"></div><button data-val="__none" class="' + (d.assignee ? '' : 'on') + '"><span class="sw" style="background:var(--gray-100);color:var(--gray-500)">' + I.contact + '</span>Unassigned · pool<span class="tick">' + I.check + '</span></button>';
    openMenu(trigger, html, function (k) { assignTo(d, k === '__none' ? null : k); });
  }
  /* shared live-filter wiring for the search-pick popovers (client / patient).
     Filters only rows that carry data-name; create-new rows stay visible. */
  function wirePickSearch(emptyMsg) {
    var input = menuEl.querySelector('.ib-pick-in');
    if (!input) return;
    input.focus();
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase(), any = false;
      [].forEach.call(menuEl.querySelectorAll('button[data-name]'), function (b) {
        var m = !q || b.dataset.name.indexOf(q) >= 0;
        b.hidden = !m; if (m) any = true;
      });
      var none = menuEl.querySelector('.ib-noresult');
      if (none) none.hidden = any;
    });
  }
  /* LINK CLIENT — Jira-style search over households */
  function clientMenu(d, trigger) {
    var rows = CLIENTS.map(function (c) {
      var on = d.client === c.name, n = c.pets.length;
      return '<button data-pickrow data-client="' + esc(c.name) + '" data-name="' + esc(c.name.toLowerCase()) + '" class="ib-pickrow ' + (on ? 'on' : '') + '">' +
        '<span class="sw cl">' + I.house + '</span>' +
        '<span class="ib-pickmain"><span class="ib-pickname">' + esc(c.name) + '</span>' +
        '<span class="ib-picksub">' + n + (n === 1 ? ' patient' : ' patients') + '</span></span>' +
        '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    var html = '<div class="pl">Link a client \u00b7 search households</div>' +
      '<div class="ib-typesearch"><span class="ib-ts-ic">' + I_SEARCH + '</span><input type="text" class="ib-pick-in" placeholder="Search clients\u2026" autocomplete="off" spellcheck="false" /></div>' +
      rows + '<div class="ib-noresult" hidden>No matching clients</div>' +
      '<div class="psep"></div><button data-pickrow data-newclient class="ib-pickrow ib-pick-new"><span class="sw new">' + I_PLUS + '</span><span class="ib-pickname">Add a new client</span></button>';
    openMenu(trigger, html, null, 'ib-pickmenu');
    menuEl._onPickRow = function (el) {
      if (el.hasAttribute('data-newclient')) { closeMenu(); toast('New client', 'Open the new-household form for ' + d.sender, 'blue'); return; }
      var name = el.dataset.client;
      d.client = name;
      if (d.pt && !clientPets(name).some(function (p) { return p.name === d.pt.name; })) d.pt = null;
      render(); closeMenu();
      toast('Client linked', d.sender + ' \u2192 ' + name, 'ok');
    };
    wirePickSearch();
  }
  /* LINK PATIENT — search the linked client's pets (or add a new one) */
  function patientMenu(d, trigger) {
    var pets = d.client ? clientPets(d.client) : [];
    var rows = pets.map(function (p) {
      var sp = speciesOf(p.type), on = d.pt && d.pt.name === p.name;
      return '<button data-pickrow data-petname="' + esc(p.name) + '" data-pettype="' + esc(p.type) + '" data-name="' + esc((p.name + ' ' + p.type).toLowerCase()) + '" class="ib-pickrow ' + (on ? 'on' : '') + '">' +
        '<span class="sw pt ' + sp.cls + '">' + sp.icon + '</span>' +
        '<span class="ib-pickmain"><span class="ib-pickname">' + esc(p.name) + '</span>' +
        '<span class="ib-picksub">' + esc(p.type) + '</span></span>' +
        '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    var head = d.client ? ('Link a patient \u00b7 ' + esc(d.client)) : 'Link a patient';
    var html = '<div class="pl">' + head + '</div>' +
      '<div class="ib-typesearch"><span class="ib-ts-ic">' + I_SEARCH + '</span><input type="text" class="ib-pick-in" placeholder="Search patients\u2026" autocomplete="off" spellcheck="false" /></div>' +
      rows + '<div class="ib-noresult"' + (pets.length ? ' hidden' : '') + '>No matching patients</div>' +
      '<div class="psep"></div><button data-pickrow data-newpatient class="ib-pickrow ib-pick-new"><span class="sw new">' + I_PLUS + '</span><span class="ib-pickname">Add a new patient</span></button>';
    openMenu(trigger, html, null, 'ib-pickmenu');
    menuEl._onPickRow = function (el) {
      if (el.hasAttribute('data-newpatient')) { closeMenu(); toast('New patient', 'Open the new-patient form for ' + (d.client || 'this client'), 'blue'); return; }
      d.pt = { name: el.dataset.petname, type: el.dataset.pettype };
      render(); closeMenu();
      toast('Patient linked', d.sender + ' \u2192 ' + d.pt.name, 'ok');
    };
    wirePickSearch();
  }
  function dateMenu(trigger) {
    var opts = [['any', 'Any time'], ['today', 'Today'], ['yesterday', 'Yesterday']];
    var html = '<div class="pl">Arrived</div>' + opts.map(function (o) {
      return '<button data-val="' + o[0] + '" class="' + (view.date === o[0] ? 'on' : '') + '">' + o[1] + '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    openMenu(trigger, html, function (v) { view.date = v; render(); });
  }
  function contactMenu(trigger) {
    var html = '<div class="pl">Contact type</div>' + CONTACTS.map(function (o) {
      return '<button data-val="' + o[0] + '" class="' + (view.contact === o[0] ? 'on' : '') + '">' + o[1] + '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    openMenu(trigger, html, function (v) { view.contact = v; render(); });
  }
  function moreMenu(trigger) {
    var opts = [['all', 'Any channel'], ['fax', 'Faxes only'], ['mail', 'Emails only']];
    var html = '<div class="pl">Channel</div>' + opts.map(function (o) {
      return '<button data-val="' + o[0] + '" class="' + (view.channel === o[0] ? 'on' : '') + '"><span class="sw" style="background:var(--gray-100);color:var(--gray-500)">' + (o[0] === 'mail' ? I.mail : o[0] === 'fax' ? I.fax : I.funnel) + '</span>' + o[1] + '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    openMenu(trigger, html, function (v) { view.channel = v; render(); });
  }
  function sortMenu(trigger) {
    var opts = [['newest', 'Newest first'], ['oldest', 'Oldest first'], ['unread', 'Unread first'], ['sender', 'Sender A\u2013Z']];
    var html = opts.map(function (o) {
      return '<button data-val="' + o[0] + '" class="' + (view.sort === o[0] ? 'on' : '') + '">' + o[1] + '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    openMenu(trigger, html, function (v) { view.sort = v; render(); });
  }

  /* shared pick handler — menuEl click delegates to its _onPick (single-select)
     or _onToggle (multi-select type menu) */
  document.addEventListener('click', function (e) {
    if (menuEl && menuEl.contains(e.target)) {
      if (e.target.closest('[data-typedone]')) { e.stopPropagation(); closeMenu(); return; }
      if (e.target.closest('[data-typeclear]') && menuEl._onClear) { e.stopPropagation(); menuEl._onClear(); return; }
      var pr = e.target.closest('button[data-pickrow]');
      if (pr && menuEl._onPickRow) { e.stopPropagation(); menuEl._onPickRow(pr); return; }
      var tg = e.target.closest('button[data-typetoggle]');
      if (tg && menuEl._onToggle) { e.stopPropagation(); menuEl._onToggle(tg.dataset.typetoggle, tg); return; }
      var b = e.target.closest('button[data-val]');
      if (b && menuEl._onPick) { e.stopPropagation(); var v = b.dataset.val; var cb = menuEl._onPick; closeMenu(); cb(v); }
      return;
    }
    if (!e.target.closest('.ib-act') && !e.target.closest('[data-drop]') && !e.target.closest('#sortBtn') && !e.target.closest('#bulkAssign') && !e.target.closest('#bulkType')) closeMenu();
  });

  /* ============================================================
     EVENT WIRING (delegated on content)
     ============================================================ */
  content.addEventListener('click', function (e) {
    // row-action buttons
    var act = e.target.closest('.ib-act[data-act]');
    if (act) {
      e.stopPropagation();
      var d = byId(act.dataset.id); if (!d) return;
      switch (act.dataset.act) {
        case 'type': typeMenu(d, act); break;
        case 'done': doComplete(d); break;
        case 'trash': doTrash(d); break;
        case 'assign': assignMenu(d, act); break;
        case 'read': doRead(d); break;
        case 'spam': doSpam(d); break;
      }
      return;
    }
    // assignee chip — open the assign / reassign menu (Jira-style)
    var asn = e.target.closest('[data-assign]');
    if (asn) { e.stopPropagation(); var ad = byId(asn.dataset.assign); if (ad) assignMenu(ad, asn); return; }
    // select-all header checkbox
    var sa = e.target.closest('[data-selall]');
    if (sa) { e.stopPropagation(); var sv = selectableVisible(); var allOn = sv.length && sv.every(function (d) { return d.sel; }); sv.forEach(function (d) { d.sel = !allOn; }); render(); return; }
    // selection checkbox
    var ck = e.target.closest('[data-check]');
    if (ck) { e.stopPropagation(); var dd = byId(ck.dataset.check); if (dd) { dd.sel = !dd.sel; render(); } return; }

    // click the type pills/cell → open the document-type selector dropdown
    var tcell = e.target.closest('[data-typecell]');
    if (tcell) { e.stopPropagation(); var tcd = byId(tcell.dataset.typecell); if (tcd) typeMenu(tcd, tcell); return; }

    // retry a failed fax receipt
    var rty = e.target.closest('[data-retry]');
    if (rty) { e.stopPropagation(); var rd = byId(rty.dataset.retry); if (rd) { toast('Retrying fax receipt', rd.sender + ' \u00b7 re-requesting transmission', 'blue'); } return; }

    // add-client affordance (prototype) — would open a household search / link flow
    var ac = e.target.closest('[data-addclient]');
    if (ac) { e.stopPropagation(); var acd = byId(ac.dataset.addclient); if (acd) clientMenu(acd, ac); return; }

    // add-patient affordance — search the client's pets to attach the doc
    var ap = e.target.closest('[data-addpatient]');
    if (ap) { e.stopPropagation(); var apd = byId(ap.dataset.addpatient); if (apd) patientMenu(apd, ap); return; }

    // filter chips
    var chipEl = e.target.closest('[data-chip]');
    if (chipEl) { view[chipEl.dataset.chip] = !view[chipEl.dataset.chip]; render(); return; }
    var dropEl = e.target.closest('[data-drop]');
    if (dropEl) {
      e.stopPropagation();
      var k = dropEl.dataset.drop;
      if (k === 'date') dateMenu(dropEl); else if (k === 'contact') contactMenu(dropEl); else if (k === 'more') moreMenu(dropEl);
      return;
    }
    if (e.target.closest('#sortBtn')) { e.stopPropagation(); sortMenu(e.target.closest('#sortBtn')); return; }
    if (e.target.closest('#showDone')) { view.showDone = !view.showDone; render(); return; }
    if (e.target.closest('#clearFilters')) { view.unread = view.unclassified = view.mine = false; view.date = 'any'; view.contact = 'all'; view.channel = 'all'; render(); return; }

    // bulk bar
    var bb = e.target.closest('[data-bulk]');
    if (bb) {
      e.stopPropagation();
      if (bb.dataset.bulk === 'assign') { bulkAssignMenu(bb); return; }
      bulk(bb.dataset.bulk, bb);
      return;
    }
    if (e.target.closest('#pgNext')) { var nx = e.target.closest('#pgNext'); if (!nx.classList.contains('dis')) toast('Loading next page', 'Showing the most recent documents first', 'blue'); return; }

    // row body — in selection mode a click toggles the row (so selection never vanishes on a misclick); otherwise it opens the document
    var row = e.target.closest('.ib-row[data-id]');
    if (row) {
      var od = byId(row.dataset.id); if (!od) return;
      if (od.state === 'arriving') { openDoc(od); return; }
      if (DOCS.some(function (d) { return d.sel; })) { od.sel = !od.sel; render(); }
      else openDoc(od);
    }
  });

  function bulkAssignMenu(trigger) {
    var roster = [ME, PEOPLE.dv, PEOPLE.ml];
    var html = '<div class="pl">Assign ' + selected().length + ' to</div>' + roster.map(function (p) {
      return '<button data-val="' + p.key + '"><span class="sw" style="background:transparent">' + avatar(p, 22) + '</span>' + esc(p.name) + (p.key === 'me' ? ' (you)' : '') + '</button>';
    }).join('');
    openMenu(trigger, html, function (k) { var rows = selected(); rows.forEach(function (d) { d.assignee = k; d.sel = false; }); render(); toast('Assigned ' + rows.length + ' \u2192 ' + person(k).name, '', 'blue'); });
  }

  function openDoc(d) {
    if (d.state === 'arriving') { toast('Still receiving', d.sender + ' \u00b7 this fax is mid-transmission', 'blue'); return; }
    if (d.state === 'failed') { toast('Receipt failed', 'Nothing was received \u2014 use Retry to request it again', 'bad'); return; }
    if (d.done) { toast('Already completed', d.sender + ' \u00b7 closed by ' + (d.doneBy || ME.name), 'ok'); return; }
    if (d.read === false) d.read = true;
    var p = new URLSearchParams();
    p.set('from', 'inbox'); p.set('id', d.id); p.set('type', d.type);
    p.set('title', d.sender); p.set('sender', d.sender);
    if (d.crit) p.set('crit', '1');
    toast('Opening document', d.sender + ' \u00b7 access logged', 'blue');
    setTimeout(function () { location.href = '../fulfillment/Robin Dock - Fulfillment.html?' + p.toString(); }, 360);
  }

  /* ---------------- toasts ---------------- */
  var toastWrap = document.getElementById('logToasts');
  function toast(title, sub, kind, undo) {
    var el = document.createElement('div');
    el.className = 'logtoast ' + (kind === 'bad' ? 'bad' : kind === 'blue' ? 'blue' : '');
    var ic = kind === 'bad' ? I.trash : (kind === 'blue' ? I.envelopeOpen : I.check);
    el.innerHTML = '<span class="lic">' + ic + '</span><div><div class="lt">' + esc(title) + '</div>' + (sub ? '<div class="ls">' + esc(sub) + '</div>' : '') + '</div>' +
      (undo ? '<button class="lundo">Undo</button>' : '');
    if (undo) el.querySelector('.lundo').addEventListener('click', function () { undo(); el.remove(); });
    toastWrap.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 300); }, undo ? 5200 : 2800);
    while (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  }

  /* close menus on scroll / escape / resize */
  window.addEventListener('scroll', closeMenu, true);
  window.addEventListener('resize', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ============================================================
     SHELL CHROME (collapse + dropdowns + add button)
     ============================================================ */
  var app = document.getElementById('app');
  var COLLAPSE_KEY = 'rd_rail_collapsed';
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
  var clearN = document.getElementById('clearNotif');
  if (clearN) clearN.addEventListener('click', function () {
    document.getElementById('notifList').innerHTML = '<div class="ct-empty" style="padding:28px 18px"><div class="ico">' + I.checkCircle + '</div><h4>You\u2019re all caught up</h4><p>New notifications will appear here.</p></div>';
    var dot = document.getElementById('bellDot'); if (dot) dot.style.display = 'none';
  });
  var addBtn = document.getElementById('addDoc');
  if (addBtn) addBtn.addEventListener('click', function () { toast('Add a document', 'Upload a PDF or forward a fax to route it into the inbox', 'blue'); });

  /* ============================================================
     SPAM CONFIRM MODAL — deliberate: names the sender(s) being blocked.
     (Trash is silent + undoable; spam blocks a sender, so it asks first.)
     ============================================================ */
  var spamModal = null, spamRows = null;
  function confirmSpam(rows) {
    spamRows = rows.slice();
    var seen = {}, senders = [];
    rows.forEach(function (d) { if (!seen[d.sender]) { seen[d.sender] = 1; senders.push(d); } });
    if (!spamModal) {
      spamModal = document.createElement('div');
      spamModal.className = 'ib-scrim';
      document.body.appendChild(spamModal);
      spamModal.addEventListener('click', function (e) {
        if (e.target === spamModal) { closeSpam(); return; }
        var b = e.target.closest('[data-spam]'); if (!b) return;
        if (b.dataset.spam === 'cancel') closeSpam(); else applySpam();
      });
    }
    var n = rows.length;
    var list = senders.map(function (d) {
      var src = sourceMeta(d);
      var sub = d.unknown ? (d.raw || 'Unrecognized fax number') + (d.csid ? ' \u00b7 CSID \u201c' + esc(d.csid) + '\u201d' : '') : chanLabel(d.chan) + ' \u00b7 ' + esc(d.line);
      return '<div class="im-sender"><span class="srcsq ' + src.cls + '">' + src.icon + '</span>' +
        '<div class="im-sm"><span class="im-snm">' + esc(d.sender) + '</span><span class="im-ssub">' + sub + '</span></div></div>';
    }).join('');
    spamModal.innerHTML = '<div class="ib-modal" role="dialog" aria-modal="true" aria-label="Confirm mark as spam">' +
      '<div class="im-head"><span class="im-ic">' + I.spam + '</span>' +
        '<div><h3>' + (senders.length > 1 ? 'Block these senders?' : 'Block this sender?') + '</h3>' +
        '<p class="im-sub">Marking spam <b>blocks the sender</b> so their future faxes skip the inbox entirely. That\u2019s heavier than trashing \u2014 trashing one document is quiet and undoable; this stops a sender.</p></div></div>' +
      '<div class="im-lbl">' + (senders.length > 1 ? senders.length + ' senders will be blocked' : 'Sender to block') + '</div>' +
      '<div class="im-senders">' + list + '</div>' +
      '<div class="im-foot"><button class="btn btn-light" data-spam="cancel">Cancel</button>' +
        '<button class="ib-btn-danger" data-spam="confirm">' + I.spam + (n > 1 ? 'Block &amp; mark ' + n + ' spam' : 'Block sender &amp; mark spam') + '</button></div>' +
    '</div>';
    spamModal.classList.add('open');
  }
  function closeSpam() { if (spamModal) spamModal.classList.remove('open'); spamRows = null; }
  function applySpam() {
    var rows = spamRows || []; var n = rows.length;
    var senders = {}; rows.forEach(function (d) { senders[d.sender] = 1; });
    var sn = Object.keys(senders).length;
    rows.forEach(function (d) { d.spam = true; d.sel = false; });
    closeSpam(); render();
    toast('Blocked ' + sn + ' sender' + (sn > 1 ? 's' : ''), n + ' document' + (n > 1 ? 's' : '') + ' moved to spam', 'bad', function () { rows.forEach(function (d) { d.spam = false; }); render(); });
  }

  /* ============================================================
     SEARCH AUTOSUGGEST — grouped Source → Contact → Client → Patient,
     then live document results, then an "All results" footer. Reuses the
     design-system .ss-* search system.
     ============================================================ */
  var searchWrap = document.querySelector('.app-top .search');
  var searchInput = searchWrap ? searchWrap.querySelector('input') : null;
  var searchPop = null;
  var SS_ENTITIES = [
    { grp: 'Source', av: 'sender', ic: I.scGp, name: 'Marana Pet Hospital', sub: 'Referring practice \u00b7 sends to records line \u00b7 14 documents', tab: true },
    { grp: 'Contact', av: 'reg', ic: I.scReg, name: 'Maricopa County Rabies Registry', sub: 'Public registry \u00b7 rabies certificates' },
    { grp: 'Client', av: 'client', ic: I.client, name: 'Marsh, Daniel', sub: 'Household \u00b7 2 patients \u00b7 acct #MW-20418' },
    { grp: 'Patient', av: 'paw', ic: I.paw, name: 'Marley', sub: 'Labrador Retriever \u00b7 Marsh household \u00b7 seen 3 wks ago' }
  ];
  var SS_DOCS = [
    { tile: 'aqua', title: 'Records \u2014 Marana Pet Hospital', sub: 'Fax \u00b7 8 pages \u00b7 arrived Today 9:25 AM', meta: 'Today' },
    { tile: '', title: 'Rabies certificate \u2014 Marley', sub: 'Email \u00b7 1 page \u00b7 arrived Yesterday', meta: 'Yest' }
  ];
  function hl(name, q) {
    if (!q) return esc(name);
    var i = name.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return esc(name);
    return esc(name.slice(0, i)) + '<b>' + esc(name.slice(i, i + q.length)) + '</b>' + esc(name.slice(i + q.length));
  }
  function searchPanelHtml(q) {
    var chips = ['Unread', 'Last 7 days', 'Assigned to me', 'Unclassified'].map(function (c) {
      return '<button class="ss-chip" data-sschip="' + esc(c) + '">' + c + '</button>';
    }).join('');
    var ents = '';
    SS_ENTITIES.forEach(function (en) {
      ents += '<div class="ss-sectlbl">' + en.grp + '</div>' +
        '<div class="ss-row ss-entity" data-ssent="' + esc(en.name) + '">' +
          '<span class="ss-av ' + en.av + '">' + en.ic + '</span>' +
          '<div class="ss-main"><div class="ss-name">' + hl(en.name, q) + '</div><div class="ss-sub">' + en.sub + '</div></div>' +
          '<div class="ss-meta">' + (en.tab ? '<span class="ss-kbd">Tab \u21e5</span>' : '') + '</div>' +
        '</div>';
    });
    var docs = '<div class="ss-sectlbl">Documents</div>' + SS_DOCS.map(function (d) {
      return '<div class="ss-row" data-ssdoc="' + esc(d.title) + '">' +
        '<span class="ss-tile ' + d.tile + '"></span>' +
        '<div class="ss-main"><div class="ss-title">' + hl(d.title, q) + '</div><div class="ss-sub">' + d.sub + '</div></div>' +
        '<div class="ss-meta">' + d.meta + '</div></div>';
    }).join('');
    var foot = '<div class="ss-foot" data-ssall="1"><span class="ss-fico">' + I.searchSm + '</span>' +
      '<span class="q">All results for <b>' + esc(q || '\u2026') + '</b></span><span class="enter">Press Enter \u21b5</span></div>';
    return '<div class="ss-panel"><div class="ss-chips">' + chips + '</div>' + ents + docs + foot + '</div>';
  }
  function positionSearch() {
    if (!searchPop || !searchWrap) return;
    var r = searchWrap.getBoundingClientRect();
    searchPop.style.left = r.left + 'px';
    searchPop.style.top = r.bottom + 'px';
    searchPop.style.width = Math.min(Math.max(r.width, 540), window.innerWidth - r.left - 16) + 'px';
  }
  function openSearch() {
    if (!searchWrap) return;
    if (!searchPop) { searchPop = document.createElement('div'); searchPop.className = 'ib-searchpop'; document.body.appendChild(searchPop); }
    searchPop.innerHTML = searchPanelHtml(searchInput ? searchInput.value : '');
    searchPop.classList.add('open'); searchWrap.classList.add('focused'); positionSearch();
  }
  function closeSearch() { if (searchPop) searchPop.classList.remove('open'); if (searchWrap) searchWrap.classList.remove('focused'); }
  if (searchInput) {
    searchInput.addEventListener('focus', openSearch);
    searchInput.addEventListener('input', function () { if (searchPop && searchPop.classList.contains('open')) searchPop.innerHTML = searchPanelHtml(searchInput.value); });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && searchPop && searchPop.classList.contains('open')) { e.preventDefault(); searchInput.value = SS_ENTITIES[0].name; searchPop.innerHTML = searchPanelHtml(searchInput.value); }
      else if (e.key === 'Enter') { closeSearch(); toast('Searching', 'All results for \u201c' + (searchInput.value || '') + '\u201d', 'blue'); }
      else if (e.key === 'Escape') { closeSearch(); searchInput.blur(); }
    });
  }
  if (searchPop || true) {
    document.addEventListener('click', function (e) {
      if (searchPop && searchPop.contains(e.target)) {
        var ent = e.target.closest('[data-ssent]'); var dc = e.target.closest('[data-ssdoc]');
        var cp = e.target.closest('[data-sschip]'); var all = e.target.closest('[data-ssall]');
        if (ent) { closeSearch(); toast('Filtered to ' + ent.dataset.ssent, '', 'blue'); }
        else if (dc) { closeSearch(); toast('Opening document', dc.dataset.ssdoc + ' \u00b7 access logged', 'blue'); }
        else if (cp) { closeSearch(); applySearchChip(cp.dataset.sschip); }
        else if (all) { closeSearch(); toast('Searching', 'All results for \u201c' + (searchInput ? searchInput.value : '') + '\u201d', 'blue'); }
        return;
      }
      if (!e.target.closest('.app-top .search')) closeSearch();
    });
  }
  function applySearchChip(c) {
    if (c === 'Unread') view.unread = true;
    else if (c === 'Assigned to me') view.mine = true;
    else if (c === 'Unclassified') view.unclassified = true;
    else if (c === 'Last 7 days') view.date = 'any';
    render();
    toast('Filter applied', c, 'blue');
  }
  window.addEventListener('resize', positionSearch);
  window.addEventListener('scroll', function () { if (searchPop && searchPop.classList.contains('open')) positionSearch(); }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSpam(); } });

  /* ---------------- boot ---------------- */
  document.title = 'RobinDock — Inbox';
  render();

  /* showcase entry points for the active-states canvas (?demo=…) — no effect on normal use */
  var DEMO = new URLSearchParams(location.search).get('demo');
  if (DEMO === 'select') {
    ['d2', 'd4', 'd7', 'd10'].forEach(function (id) { var d = byId(id); if (d) d.sel = true; });
    render();
  } else if (DEMO === 'search') {
    if (searchInput) { searchInput.value = 'Mar'; searchInput.focus(); openSearch(); }
  } else if (DEMO === 'spam') {
    var sd = byId('d5'); if (sd) confirmSpam([sd]);
  } else if (DEMO === 'empty') {
    DOCS.forEach(function (d) { d.done = true; }); render();
  } else if (DEMO === 'filtered') {
    view.unclassified = true; view.contact = 'lab'; render();
  }
})();
