/* ============================================================
   RobinDock — Inbox v2 · CONTROLLER
   Redesigned to the OCR/Extraction architecture (Zones A–F):

   · Greyed processing rows (E2): a doc is visible from arrival but
     greyed + non-actionable until the pipeline lands it. No verbose
     "Reading/Extracting" vocabulary — greyed IS the signal.
   · Status = the 4-state aggregate (C5): In Review → Not Started →
     In Progress → Complete, derived from tracks + suggestions.
     Failed / Unreadable / Partial·Page-Cap co-render as badges.
   · Suggested ≠ confirmed (C2): pending AI type suggestions render
     as dashed chips with a calibrated confidence band + on-row
     promote / dismiss. Confirmed tracks render as solid tags.
   · On-row patient (A3): a high-eligibility unconfirmed match shows
     the candidate with a distinct "match?" treatment — display
     prominence only; binding happens on the document page.
   · typed ≠ completed: no "mark complete" on the list. Completion
     is a per-track human workflow on the document page.
   · The list stays flat (accordion is a folder-view behavior).
   ============================================================ */
(function () {
  'use strict';

  var content = document.getElementById('appContent');

  /* ---------------- icons ---------------- */
  var I = {
    fax: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 8V4h10v4M7 18h10v3H7zM5 8h14a2 2 0 012 2v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 7l7.5 5.5L19.5 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    scLab: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6l-4.6 8.2A2 2 0 007.2 20h9.6a2 2 0 001.8-2.8L14 9V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scGp: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 20V9l5-3 5 3M5 20h14M5 20V9m10 11V6.5L20 9v11M10 20v-4h2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    scSpec: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 13.2L7 21l5-2.8 5 2.8-1.5-7.8" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    scEr: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 4h6a1 1 0 011 1v3h3a1 1 0 011 1v6a1 1 0 01-1 1h-3v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3H5a1 1 0 01-1-1V9a1 1 0 011-1h3V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    scReg: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    scOther: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 21V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V21M15 9h2.5A1.5 1.5 0 0119 10.5V21M3.5 21h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8h2M8 12h2M8 16h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    scQ: '<svg viewBox="0 0 24 24" fill="none"><path d="M9.3 9a2.7 2.7 0 015.2 1c0 1.8-2.7 2.5-2.7 2.5M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5.5A1.5 1.5 0 0111.5 4h1A1.5 1.5 0 0114 5.5V7M6.5 7l.7 11a1.5 1.5 0 001.5 1.4h6.6a1.5 1.5 0 001.5-1.4L17.5 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spam: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l9 16H3l9-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9.5v4M12 16.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    assign: '<svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 19c0-3.2 2.6-5.2 5.5-5.2 1 0 2 .25 2.8.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.5 14v6M14.5 17h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    envelopeOpen: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 10.5l8-5.5 8 5.5M4 10.5V18a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 18v-7.5M4 10.5l8 5 8-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    envelope: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="12" rx="1.6" stroke="currentColor" stroke-width="1.7"/><path d="M4.6 7l7.4 5.4L19.4 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    type: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 8.5V5.5A1.5 1.5 0 015.5 4h4.7a1.5 1.5 0 011 .4l8 7.6a1.6 1.6 0 010 2.3l-4.5 4.4a1.6 1.6 0 01-2.3 0L4.9 11.2a1.5 1.5 0 01-.9-1.4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="8.4" cy="8.4" r="1.3" fill="currentColor"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4.5L21 19.5H3L12 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    chevD: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    contact: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    userOutline: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M5.6 19c0-3.6 2.9-6 6.4-6s6.4 2.4 6.4 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    funnel: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5h16l-6.2 7.4V19l-3.6-2v-3.9L4 5.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    tune: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h9M17 7h3M4 17h3M11 17h9M14 4v6M7 14v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    sort: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 5v14M7 19l-3-3M7 5l3 3M17 19V5M17 5l3 3M17 19l-3-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    inboxBig: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 13l2.5-7A2 2 0 018.4 4.7h7.2a2 2 0 011.9 1.3L20 13M4 13v4.5A1.5 1.5 0 005.5 19h13a1.5 1.5 0 001.5-1.5V13M4 13h4l1.5 2.5h5L16 13h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none"><path d="M19 5v4h-4M5 19v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.4 9A7 7 0 006 7.5M5.6 15A7 7 0 0018 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v10m0 0l-4-4m4 4l4-4M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    xs: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    paw: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="9" r="1.7"/><circle cx="12" cy="6.5" r="1.7"/><circle cx="17" cy="9" r="1.7"/><path d="M12 11c-2.4 0-4.3 2-4.3 3.7 0 1.4 1.1 2.1 2.3 2.1.9 0 1.3-.4 2-.4s1.1.4 2 .4c1.2 0 2.3-.7 2.3-2.1C16.3 13 14.4 11 12 11z"/></svg>',
    catFace: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4.2l3 3.4-3 1.6z"/><path d="M18 4.2l-3 3.4 3 1.6z"/><circle cx="12" cy="13" r="6.4"/></svg>',
    house: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5L12 5l8 6.5M6 10.5V19a1 1 0 001 1h10a1 1 0 001-1v-8.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20v-5h4v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bird: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5a5.5 5.5 0 015.5 5.5c0 .3.2.45.5.4l2.5-.4-1.6 2.1c-.9 2-2.9 3.4-5.4 3.4A5.5 5.5 0 016 12.7l-2.6 1 1.4-2.6A5.5 5.5 0 0112 5z"/><path d="M17.4 8.4l3-1-2 2.2z"/></svg>',
    rabbit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 9.6C7.8 7.6 7.4 4.3 8.8 3.7c1.2-.5 2.3 1.8 2.6 4.5z"/><path d="M15 9.6c1.2-2 1.6-5.3.2-5.9-1.2-.5-2.3 1.8-2.6 4.5z"/><circle cx="12" cy="14.2" r="5.2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.4" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    scUnknown: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.3" stroke="currentColor" stroke-width="1.5"/><path d="M7.8 16.6c.7-1.8 2.1-2.6 4.2-2.6s3.5.8 4.2 2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };

  /* ---------------- people (assignees) ---------------- */
  var ME = { key: 'me', name: 'Kai Sandoval', initials: 'KS', av: 'blue' };
  var PEOPLE = {
    me: ME,
    dv: { key: 'dv', name: 'Dana Voss', initials: 'DV', av: '' },
    ml: { key: 'ml', name: 'Mateo Luna', initials: 'ML', av: 'aqua' }
  };

  /* ---------------- document types (Tier 1 = full extraction in v1) ---------------- */
  var TYPES = {
    lab: { cls: 'ty-lab', label: 'Lab result' },
    ref: { cls: 'ty-ref', label: 'Referral' },
    rec: { cls: 'ty-rec', label: 'Records' },
    req: { cls: 'ty-req', label: 'Records request' },
    vax: { cls: 'ty-vax', label: 'Vaccine / rabies' }
  };
  var CLASSIFY = ['lab', 'ref', 'rec', 'req', 'vax'];
  var TYPEICON = {
    lab: '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 3h5M10.5 3v5.5l-4 7.2A2 2 0 008.3 19h7.4a2 2 0 001.8-3.3l-4-7.2V3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 14h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    ref: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 4l6 5-6 5v-3C9 11 6 13 5 17c-.3-5 2-9 9-9V4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    rec: '<svg viewBox="0 0 24 24" fill="none"><rect x="5.5" y="3.5" width="13" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    req: '<svg viewBox="0 0 24 24" fill="none"><path d="M13.5 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M15 4h5v5M20 4l-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    vax: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l6.5 2.2v5c0 4.2-2.8 7.3-6.5 8.6-3.7-1.3-6.5-4.4-6.5-8.6v-5L12 3.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.2 11.7l2 2 3.6-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* workflow steps per doc type (Doc-Type Grid). review → confirm_match →
     [type-specific] → complete. Display names for the folder views; the
     inbox only needs step position to derive the aggregate. */
  var WORKFLOW = {
    lab: ['review', 'match'],
    rec: ['review', 'match'],
    vax: ['review', 'match'],
    ref: ['review', 'match', 'referrer'],
    req: ['review', 'match', 'fulfill']
  };

  /* ============================================================
     MOCK DATA — each doc mirrors the pipeline data model:
       pipeline: 'processing' | 'ready'
       result:   'ok' | 'failed' | 'unreadable' | 'partial'
       tracks:   [{ type, stepIdx, done }]   — confirmed identity
       suggestions: [{ type, band: 'high'|'medium', why }] — pending AI
       match:    { name, species, confirmed: bool }  — on-row patient
     ============================================================ */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var NOW = new Date(); NOW.setHours(10, 5, 0, 0);
  function startOfDay(date) { var n = new Date(date); n.setHours(0, 0, 0, 0); return n; }
  function parseYMD(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3], 0, 0, 0, 0) : null; }

  var seq = 0;
  function doc(o) {
    o.id = 'd' + (++seq);
    o.pipeline = o.pipeline || 'ready';
    o.result = o.result || 'ok';
    o.tracks = o.tracks || [];
    o.suggestions = o.suggestions || [];
    o.read = !o.unread; o.trashed = false; o.spam = false; o.sel = false;
    var base = startOfDay(NOW);
    if (o.day === 'yesterday') base.setDate(base.getDate() - 1);
    var hh = Math.floor((o.t || 0) / 100), mm = (o.t || 0) % 100;
    base.setHours(hh, mm, 0, 0);
    o.ts = base.getTime();
    return o;
  }
  function tr(type, stepIdx, done) { return { type: type, stepIdx: stepIdx || 0, done: !!done }; }

  var NAV_TOTAL = 412;

  var DOCS = [
    /* ---- TODAY ---- */
    /* greyed: just arrived, pipeline still running (E2 — grey is the signal) */
    doc({ day: 'today', t: 1003, time: 'Now', sender: 'Sonoran Veterinary Specialists', chan: 'fax', line: 'referrals line', pages: 6, pipeline: 'processing', unread: true }),
    /* deterministic route → Lab track at review; high-eligibility unconfirmed patient match; critical value */
    doc({ day: 'today', t: 942, time: '9:42 AM', sender: 'Antech Diagnostics', chan: 'fax', line: 'lab results line', pages: 4, unread: true, crit: 'K⁺ 7.9 mmol/L',
      tracks: [tr('lab')], match: { name: 'Bella', species: 'Dog', confirmed: false, client: 'Marsh, Elena' } }),
    /* cold doc → classification auto-applied Records; a second type rode in as a pending suggestion (A4) */
    doc({ day: 'today', t: 925, time: '9:25 AM', sender: 'Oasis Animal Hospital', chan: 'fax', line: 'main line', pages: 14, unread: true,
      tracks: [tr('rec')], suggestions: [{ type: 'lab', band: 'medium', why: [['Document', 'Pages 9–11 read as an in-house chemistry panel'], ['Contact', 'This hospital has sent labs inside records before']] }],
      match: { name: 'Cooper', species: 'Dog', confirmed: false, band: 'medium', client: 'Nguyen, Paul' } }),
    /* deterministic route → Referral, past review, at confirm-to-referrer → In Progress; confirmed patient */
    doc({ day: 'today', t: 918, time: '9:18 AM', sender: 'Mesa Valley Animal Hospital', chan: 'fax', line: 'referrals line', pages: 6, assignee: 'dv',
      tracks: [tr('ref', 2)], match: { name: 'Luna', species: 'Cat', confirmed: true, client: 'Ortiz, Gabriela' } }),
    /* cold doc, classification landed below auto-apply → suggestion only (In Review, no track yet) */
    doc({ day: 'today', t: 855, time: '8:55 AM', sender: '+1 (480) 555-0173', unknown: true, chan: 'fax', line: 'main line', pages: 2, unread: true,
      suggestions: [{ type: 'req', band: 'medium', why: [['Document', 'First page reads \u201cRequest for medical records\u201d'], ['Sender', 'Number is not a known contact yet']] }] }),
    /* cold doc with two pending suggestions (A4 both-tags case) */
    doc({ day: 'today', t: 842, time: '8:42 AM', sender: 'Sunrise Pet Clinic', chan: 'fax', line: 'referrals line', pages: 5, unread: true,
      suggestions: [
        { type: 'ref', band: 'high', why: [['Document', 'Cover page header reads \u201cPatient Referral\u201d'], ['Channel', 'Arrived on your referrals fax line']] },
        { type: 'rec', band: 'medium', why: [['Document', '5 pages \u2014 specialty visits usually attach records']] }
      ],
      match: { name: 'Diesel', species: 'Dog', confirmed: false, client: 'Foster, Ray' } }),
    /* review confirmed, confirm-match untouched → Not Started */
    doc({ day: 'today', t: 740, time: '7:40 AM', sender: 'Maricopa County Rabies Registry', chan: 'mail', line: 'rabies-registry@maricopa.gov', pages: 1, assignee: 'ml',
      tracks: [tr('vax', 1)], match: { name: 'Ginger', species: 'Bird', confirmed: true, client: 'Webb, Sara' } }),
    /* unreadable scan — un-greyed as workable untyped, badge co-renders (E2b / matrix row 8) */
    doc({ day: 'today', t: 812, time: '8:12 AM', sender: 'Whitfield Mobile Vet', chan: 'fax', line: 'main line', pages: 2, result: 'unreadable' }),
    /* untyped pile — never classified above the floor, no suggestions (matrix row 7) */
    doc({ day: 'today', t: 758, time: '7:58 AM', sender: '+1 (602) 555-0148', unknown: true, chan: 'fax', line: 'main line', pages: 3, unread: true }),
    /* records request, at fulfill step → In Progress */
    doc({ day: 'today', t: 735, time: '7:35 AM', sender: 'Trupanion', chan: 'fax', line: 'main line', pages: 2, assignee: 'me',
      tracks: [tr('req', 2)], match: { name: 'Shadow', species: 'Cat', confirmed: true, client: 'Cross, Mae' } }),

    /* ---- YESTERDAY ---- */
    /* receipt failed — nothing received; workable untyped + Failed badge + retry */
    doc({ day: 'yesterday', t: 1740, time: '5:40 PM', sender: 'Antech Diagnostics', chan: 'fax', line: 'lab results line', pages: null, unread: true, result: 'failed' }),
    /* hit the extraction page cap — In Review + Partial badge (matrix row 10) */
    doc({ day: 'yesterday', t: 1651, time: '4:51 PM', sender: 'Banfield Pet Hospital', chan: 'fax', line: 'records line', pages: 50, result: 'partial',
      tracks: [tr('rec')], match: { name: 'Zoe', species: 'Dog', confirmed: false, band: 'medium', client: 'Pena, Luis' } }),
    doc({ day: 'yesterday', t: 1410, time: '2:10 PM', sender: 'VCA Animal Specialty', chan: 'fax', line: 'referrals line', pages: 5, assignee: 'dv',
      tracks: [tr('ref', 1)], match: { name: 'Max', species: 'Dog', confirmed: true, client: 'Stone, Will' } }),
    doc({ day: 'yesterday', t: 1336, time: '1:36 PM', sender: 'Antech Diagnostics', chan: 'fax', line: 'lab results line', pages: 2,
      tracks: [tr('lab')], match: { name: 'Pepper', species: 'Cat', confirmed: false, client: 'Reyes, Nora' } }),
    doc({ day: 'yesterday', t: 1148, time: '11:48 AM', sender: 'Paws & Claws Mobile Vet', chan: 'mail', line: 'records@pawsclaws.vet', pages: 1, assignee: 'ml',
      tracks: [tr('vax', 1)], match: { name: 'Biscuit', species: 'Rabbit', confirmed: true, client: 'Day, Erin' } }),
    doc({ day: 'yesterday', t: 930, time: '9:30 AM', sender: 'Mesa Valley Animal Hospital', chan: 'fax', line: 'records line', pages: 8, unread: true,
      tracks: [tr('rec')], match: { name: 'Daisy', species: 'Dog', confirmed: false, band: 'medium', client: 'Kerr, Anita' } }),
    doc({ day: 'yesterday', t: 805, time: '8:05 AM', sender: 'Foothills Emergency Vet', chan: 'fax', line: 'main line', pages: 4, assignee: 'me',
      tracks: [tr('ref', 1)], match: { name: 'Tucker', species: 'Dog', confirmed: true, client: 'Lamb, Joel' } }),

    /* ---- completed (hidden unless "Show completed") ---- */
    doc({ day: 'today', t: 705, time: '7:05 AM', sender: 'Camelback Animal Clinic', chan: 'mail', line: 'records@camelbackvet.com', pages: 3, assignee: 'me',
      tracks: [tr('rec', 1, true)], match: { name: 'Olive', species: 'Cat', confirmed: true, client: 'Snow, Beth' }, doneBy: 'Kai Sandoval' }),
    doc({ day: 'yesterday', t: 1730, time: '5:30 PM', sender: 'IDEXX Reference Labs', chan: 'mail', line: 'results@idexx.com', pages: 5, assignee: 'dv',
      tracks: [tr('lab', 1, true)], match: { name: 'Bruno', species: 'Dog', confirmed: true, client: 'Reed, Omar' }, doneBy: 'Dana Voss' }),
    doc({ day: 'yesterday', t: 902, time: '9:02 AM', sender: 'Gilbert Veterinary', chan: 'fax', line: 'main line', pages: 1, assignee: 'me',
      tracks: [tr('vax', 1, true)], match: { name: 'Mittens', species: 'Cat', confirmed: true, client: 'Kane, Tom' }, doneBy: 'Kai Sandoval' })
  ];

  /* ============================================================
     THE 4-STATE AGGREGATE (architecture §7.2, precedence top-down)
     ============================================================ */
  /* a document "needs confirmation" when the AI produced a field a human must
     still accept (a suggested doc type, an unconfirmed client match) or a
     required field is missing and must be entered (no doc type on a workable
     doc). Confirmation happens on the document page — never one-click here. */
  function needsConfirm(d) {
    if (d.pipeline === 'processing') return false;
    if (d.tracks.length && d.tracks.every(function (t) { return t.done; })) return false; // complete
    if (d.suggestions && d.suggestions.length) return true;                      // AI-suggested doc type
    if (d.match && d.match.client && !d.match.confirmed) return true;            // unconfirmed client match
    if (!d.tracks.length && !d.result) return true;                             // missing doc type (workable)
    return false;
  }
  function aggregate(d) {
    if (d.pipeline === 'processing') return 'grey';
    if (d.tracks.length && d.tracks.every(function (t) { return t.done; })) return 'complete';
    if (needsConfirm(d)) return 'needsconfirm';                                  // AI fields to accept / missing input
    if (d.tracks.length) {
      if (d.tracks.some(function (t) { return !t.done && t.stepIdx === 0; })) return 'review';
      if (d.tracks.some(function (t) { return !t.done && t.stepIdx > 1; })) return 'progress'; // a post-review step acted on
      return 'notstarted';                                                       // past review, nothing acted yet
    }
    return 'untyped';                                                            // failed/unreadable, still untyped
  }
  var AGG = {
    needsconfirm: { cls: 'st-confirm', label: 'Needs Confirmation' },
    review:     { cls: 'st-review',  label: 'In Review' },
    notstarted: { cls: 'st-not',     label: 'Not Started' },
    progress:   { cls: 'st-prog',    label: 'In Progress' },
    complete:   { cls: 'st-done',    label: 'Complete' },
    untyped:    { cls: 'st-untyped', label: 'Needs doc type' }
  };
  function isDone(d) { return aggregate(d) === 'complete'; }

  /* pipeline-terminal badges co-render with work states (matrix rows 8–10) */
  function resultBadge(d) {
    if (d.result === 'failed') return '<span class="ib-flag failed">' + I.alert + 'Failed</span>';
    if (d.result === 'unreadable') return '<span class="ib-flag unreadable">' + I.alert + 'Unreadable</span>';
    if (d.result === 'partial') return '<span class="ib-flag partial">Partial \u00b7 page cap</span>';
    return '';
  }

  /* ---------------- view state ---------------- */
  var view = {
    unread: false, untyped: false, mine: false,
    status: 'any', date: 'any', dateFrom: '', dateTo: '', contact: 'all', channel: 'all',
    showDone: false, sort: 'newest', showFilters: false
  };
  var CONTACTS = [
    ['all', 'All contact types'], ['lab', 'Diagnostic lab'], ['gp', 'Referring practice'],
    ['spec', 'Specialty'], ['er', 'Emergency'], ['reg', 'Registry / public'], ['ins', 'Insurer'], ['unk', 'Unknown sender']
  ];

  /* ---------------- helpers ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function person(k) { return PEOPLE[k] || null; }
  function avatar(p, size) { return '<span class="av ' + (p.av || '') + '" style="--av:' + (size || 26) + 'px">' + esc(p.initials) + '</span>'; }
  function chanGlyph(c) { return c === 'mail' ? I.mail : I.fax; }
  function chanLabel(c) { return c === 'mail' ? 'Email' : 'Fax'; }
  function whenLabel(d) {
    var dt = new Date(d.ts);
    if (dt.toDateString() === NOW.toDateString()) return d.time;
    if (dt.getFullYear() === NOW.getFullYear()) return MON[dt.getMonth()] + ' ' + dt.getDate();
    return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + String(dt.getFullYear()).slice(-2);
  }
  function sourceMeta(d) {
    if (d.unknown) return { cls: 'unk', label: 'Unknown sender', icon: I.scUnknown };
    var s = (d.sender || '').toLowerCase();
    if (/antech|idexx|diagnostic|\blab\b|patholog|reference/.test(s)) return { cls: 'lab', label: 'Diagnostic lab', icon: I.scLab };
    if (/registry|county|public|state/.test(s)) return { cls: 'reg', label: 'Registry / public', icon: I.scReg };
    if (/emergenc|\ber\b|urgent/.test(s)) return { cls: 'er', label: 'Emergency / ER', icon: I.scEr };
    if (/specialty|specialist|vca animal special|derm|cardio|surg|dental|oncolog|neurolog|ophthalm|ortho/.test(s)) return { cls: 'spec', label: 'Specialty', icon: I.scSpec };
    if (/trupanion|nationwide|insur|petplan/.test(s)) return { cls: 'ins', label: 'Insurer', icon: I.scOther };
    if (/clinic|hospital|veterinary|\bvet\b|pet|animal|paws|claws|bark/.test(s)) return { cls: 'gp', label: 'Referring practice', icon: I.scGp };
    return { cls: 'other', label: 'Other', icon: I.scOther };
  }

  /* ---------------- filtering + sorting ---------------- */
  function filtersActive() {
    return view.unread || view.untyped || view.mine ||
      view.status !== 'any' || view.date !== 'any' || view.contact !== 'all' || view.channel !== 'all';
  }
  function passes(d) {
    if (d.trashed || d.spam) return false;
    var agg = aggregate(d);
    if (agg === 'complete' && !view.showDone && view.status !== 'complete') return false;
    if (view.unread && d.read) return false;
    if (view.untyped && agg !== 'untyped') return false;
    if (view.mine && d.assignee !== 'me') return false;
    if (view.status !== 'any' && agg !== view.status) return false;
    if (view.date === 'range') {
      if (view.dateFrom) { var f = parseYMD(view.dateFrom); if (f && d.ts < f.getTime()) return false; }
      if (view.dateTo) { var t = parseYMD(view.dateTo); if (t) { t.setHours(23, 59, 59, 999); if (d.ts > t.getTime()) return false; } }
    } else if (view.date !== 'any' && d.day !== view.date) return false;
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
      return y.ts - x.ts;
    });
    return a;
  }
  function selectableVisible() { return DOCS.filter(function (d) { return passes(d) && !isDone(d) && d.pipeline !== 'processing'; }); }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    var visible = DOCS.filter(passes);
    var selv = selectableVisible();
    var selN = selv.filter(function (d) { return d.sel; }).length;
    var allCls = selN === 0 ? '' : (selN === selv.length ? ' on' : ' dash');

    var listHtml = visible.length ? sortRows(visible).map(rowHtml).join('') : emptyState();
    var total = filtersActive() ? visible.length : NAV_TOTAL;
    var end = visible.length;
    var moreBacklog = !filtersActive();

    content.innerHTML =
      '<div class="ib">' +
        strip(end, total, moreBacklog) +
        '<div class="ib-scroll" id="ibScroll">' +
          '<div class="ib-grid ib-head">' +
            '<span class="h-sel"><span class="ck ib-selall' + allCls + '" data-selall role="checkbox" aria-checked="' + (allCls === ' on') + '" title="' + (selN ? 'Clear selection' : 'Select all') + '"></span></span>' +
            '<span class="h-sender">Document &amp; sender</span>' +
            '<span class="h-type">Doc type</span>' +
            '<span class="h-status">Status</span>' +
            '<span class="h-patient">Client</span>' +
            '<span class="h-time h-num">Arrived</span>' +
            '<span class="h-assignee"></span>' +
          '</div>' +
          listHtml +
        '</div>' +
        bulkBar() +
      '</div>';

    var navc = document.getElementById('navCount'); if (navc) navc.textContent = NAV_TOTAL;
  }

  function pagerHtml(end, total, moreBacklog) {
    return '<div class="ib-pager">' +
      '<span class="range">' + (end ? '1\u2013<b>' + end + '</b>' : '0') + ' of <b>' + total + '</b></span>' +
      '<div class="pg">' +
        '<span class="pb dis" title="Previous page">' + I.chevL + '</span>' +
        '<span class="pb' + (moreBacklog ? '' : ' dis') + '" id="pgNext" title="Next page">' + I.chevR + '</span>' +
      '</div>' +
    '</div>';
  }

  function strip(end, total, moreBacklog) {
    var unreadN = DOCS.filter(function (d) { return !d.trashed && !d.spam && !isDone(d) && d.read === false && d.pipeline !== 'processing'; }).length;
    var untypedN = DOCS.filter(function (d) { return !d.trashed && !d.spam && aggregate(d) === 'untyped'; }).length;

    var statusLbl = view.status === 'any' ? 'Status' : AGG[view.status].label;
    var dateLbl = { any: 'Date', today: 'Today', yesterday: 'Yesterday' }[view.date];
    var contactLbl = view.contact === 'all' ? 'Contact type' : (CONTACTS.filter(function (c) { return c[0] === view.contact; })[0] || ['', 'Contact type'])[1];
    var moreOn = view.channel !== 'all';
    var advCount = (view.status !== 'any' ? 1 : 0) + (view.date !== 'any' ? 1 : 0) + (view.contact !== 'all' ? 1 : 0) +
      (view.showDone ? 1 : 0) + (view.sort !== 'newest' ? 1 : 0);
    var advOpen = view.showFilters || advCount > 0;

    return '<div class="ib-strip" id="ibStrip"><div class="ib-filters">' +
        chip('unread', view.unread, 'Unread', unreadN) +
        chip('untyped', view.untyped, 'Missing doc type', untypedN, 'pile') +
        chip('mine', view.mine, 'Assigned to me', null) +
        '<span class="sep"></span>' +
        filtersToggle(advCount) +
      '</div>' +
      pagerHtml(end, total, moreBacklog) +
      '</div>';
  }
  function chip(key, on, label, n, extra) {
    return '<button class="ib-chip' + (extra ? ' ' + extra : '') + (on ? ' on' : '') + '" data-chip="' + key + '">' + esc(label) +
      (n != null ? '<span class="n">' + n + '</span>' : '') + '</button>';
  }
  function filtersToggle(n) {
    return '<button class="ib-chip ib-morebtn' + (n ? ' set' : '') + '" id="filtersToggle"><span class="ic">' + I.tune + '</span>Filters' +
      (n ? '<span class="n">' + n + '</span>' : '') + '</button>';
  }
  function dropChip(key, set, icon, label) {
    return '<button class="ib-chip' + (set ? ' set' : '') + '" data-drop="' + key + '"><span class="ic">' + icon + '</span>' + esc(label) + '<span class="ch">' + I.chevD + '</span></button>';
  }
  function sortLabel() {
    return { newest: 'Newest first', oldest: 'Oldest first', unread: 'Unread first', sender: 'Sender A\u2013Z' }[view.sort];
  }

  /* bulk bar — no "Complete" here: typed ≠ completed; completion is a
     per-track human workflow on the document page. */
  function bulkBar() {
    var rows = DOCS.filter(function (d) { return d.sel; });
    if (!rows.length) return '';
    var anyUnread = rows.some(function (d) { return d.read === false; });
    return '<div class="ib-bulkbar" id="ibBulk" role="toolbar" aria-label="Bulk actions">' +
        '<span class="bb-cnt"><span class="bb-n">' + rows.length + '</span> selected</span>' +
        '<span class="bb-sep"></span>' +
        '<button class="bb-act" data-bulk="type" id="bulkType">' + I.type + '<span class="l">Set type</span></button>' +
        '<button class="bb-act" data-bulk="assign" id="bulkAssign">' + I.assign + '<span class="l">Assign</span></button>' +
        '<button class="bb-act" data-bulk="read">' + (anyUnread ? I.envelopeOpen : I.envelope) + '<span class="l">' + (anyUnread ? 'Mark read' : 'Mark unread') + '</span></button>' +
        '<button class="bb-act" data-bulk="download">' + I.download + '<span class="l">Download</span></button>' +
        '<span class="bb-sep"></span>' +
        '<button class="bb-act" data-bulk="trash">' + I.trash + '<span class="l">Trash</span></button>' +
        '<button class="bb-act danger" data-bulk="spam">' + I.spam + '<span class="l">Spam</span></button>' +
        '<button class="bb-close" data-bulk="clear" title="Clear selection">' + I.x + '</button>' +
      '</div>';
  }

  /* ---- TYPE CELL: confirmed tags (solid) + pending suggestions (dashed,
     with confidence + promote/dismiss). Untyped → "+ Add doc type". ---- */
  function confMeter(band, why) {
    var n = band === 'high' ? 3 : 2, bars = '';
    for (var i = 1; i <= 3; i++) bars += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    var rows = (why || []).map(function (w) {
      return '<span class="ib-why-row"><b>' + w[0] + '</b><span>' + esc(w[1]) + '</span></span>';
    }).join('');
    return '<span class="ib-conf conf-' + band + '" tabindex="0"><span class="ib-bars">' + bars + '</span>' +
      '<span class="ib-why"><span class="ib-why-h">Needs Confirmation</span>' +
      '<span class="ib-why-sub">' + (band === 'high' ? 'High' : 'Medium') + ' confidence</span>' + rows +
      '<span class="ib-why-f">Confidence reflects this practice\u2019s measured accuracy, not a raw model score.</span></span></span>';
  }
  function typeCell(d) {
    var agg = aggregate(d);
    if (agg === 'grey') return '<div class="ib-types"><span class="ghost-tag"></span></div>';
    var parts = d.tracks.map(function (t) {
      var m = TYPES[t.type];
      return '<span class="tag ' + m.cls + (t.done ? ' donetag' : '') + '"><span class="d"></span>' + m.label + '</span>';
    });
    d.suggestions.forEach(function (s) {
      var m = TYPES[s.type];
      /* the AI-generated type, shown plainly with a hover-for-why confidence bar.
         Accepting / dismissing happens on the document page — never one-click here. */
      parts.push('<span class="sug ' + m.cls + '">' + m.label + confMeter(s.band, s.why) + '</span>');
    });
    if (!parts.length) {
      /* a failed/unreadable doc can't be meaningfully typed until a human opens
         and reads it — lead with review, not “add doc type” */
      if (d.result === 'failed' || d.result === 'unreadable') {
        return '<div class="ib-types"><button class="ib-openreview" type="button" data-openreview="' + d.id + '">' + I.envelopeOpen + 'Open to review</button></div>';
      }
      return '<div class="ib-types" data-typecell="' + d.id + '"><button class="ib-addtype" type="button"><span class="p">+</span>Add doc type</button></div>';
    }
    return '<div class="ib-types" data-typecell="' + d.id + '">' + parts.join('') + '</div>';
  }

  /* ---- PATIENT CELL: confirmed → solid; high-eligibility unconfirmed →
     dashed avatar + "match?" cue (prominence only, binds nothing);
     otherwise a quiet em-dash. ---- */
  var SPECIES = { Cat: { cls: 'cat', icon: I.catFace }, Bird: { cls: 'bird', icon: I.bird }, Rabbit: { cls: 'rabbit', icon: I.rabbit } };
  function speciesOf(t) { return SPECIES[t] || { cls: 'dog', icon: I.paw }; }
  function patientCell(d) {
    if (d.pipeline === 'processing') return '<span class="ib-pt empty"><span class="ghost-line"></span></span>';
    var p = d.match;
    if (!p) return '<span class="ib-pt empty">\u2014</span>';
    var sp = speciesOf(p.species);
    if (p.confirmed) {
      return '<div class="ib-pt"><span class="ib-pt-av ' + sp.cls + '">' + sp.icon + '</span>' +
        '<div class="ib-pt-main"><span class="ib-pt-name">' + esc(p.name) + '</span>' +
        '<span class="ib-pt-type ' + sp.cls + '">' + esc(p.species) + '</span></div></div>';
    }
    return '<div class="ib-pt unconf" title="Suggested match \u2014 confirm it on the document page">' +
      '<span class="ib-pt-av un ' + sp.cls + '">' + sp.icon + '</span>' +
      '<div class="ib-pt-main"><span class="ib-pt-name">' + esc(p.name) + '</span>' +
      '<span class="ib-pt-match">match?</span></div></div>';
  }

  /* ---- CLIENT CELL: the owner / household tied to this document. Pet name +
     species moved to the document detail page. Confirmed → solid house + name;
     unconfirmed AI-suggested binding → dashed house + name + "match?". ---- */
  function clientCell(d) {
    if (d.pipeline === 'processing') return '<span class="ib-cl empty"><span class="ghost-line"></span></span>';
    var p = d.match;
    if (!p || !p.client) return '<span class="ib-cl empty">\u2014</span>';
    if (p.confirmed) {
      return '<div class="ib-cl">' +
        '<span class="ib-cl-name">' + esc(p.client) + '</span></div>';
    }
    /* AI-suggested client binding: the generated name + a hover-for-why
       confidence bar. Confirming the match happens on the document page. */
    var why = [
      ['Patient', 'Document names ' + p.name + ', matched to a patient on file'],
      ['Client', 'Owner reads as ' + p.client + ', an existing client']
    ];
    return '<div class="ib-cl unconf">' +
      '<span class="ib-cl-name">' + esc(p.client) + '</span>' + confMeter(p.band || 'high', why) + '</div>';
  }

  function statusCell(d) {
    var agg = aggregate(d);
    if (agg === 'grey') return '<span class="ib-status st-grey"><span class="ghost-line w60"></span></span>';
    /* "untyped" is a Doc-Type-column condition, not a workflow status. A cold
       untyped doc still needs a human, so it reads as In Review here; the
       Doc Type column owns the untyped-ness via “+ Add doc type”. Status stays
       the locked four. */
    if (agg === 'untyped') agg = 'review';
    var s = AGG[agg];
    var ind = agg === 'complete' ? '<span class="ib-st-dot"></span>'
            : agg === 'notstarted' ? '<span class="ib-st-ring"></span>'
            : '<span class="ib-st-dot"></span>';
    return '<span class="ib-status ' + s.cls + '">' + ind + '<span class="ib-st-lbl">' + esc(s.label) + '</span></span>';
  }

  function nameFlags(d) {
    return '';
  }
  function srcLine(d) {
    /* email address stays useful; fax channel/line/page-count removed */
    if (d.chan !== 'mail' || !d.line) return '';
    return '<span class="ib-src"><span class="txt">' + esc(d.line) + '</span></span>';
  }
  function assigneeCell(d) {
    if (d.assignee) {
      var p = person(d.assignee);
      return '<button class="ib-assignee" data-assign="' + d.id + '" title="Assigned to ' + esc(p.name) + ' \u00b7 click to reassign">' + avatar(p, 26) + '</button>';
    }
    return '<button class="ib-assignee un" data-assign="' + d.id + '" title="Unassigned \u00b7 click to assign"><span class="un-av">' + I.userOutline + '</span></button>';
  }

  function rowHtml(d) {
    var src = sourceMeta(d);
    var agg = aggregate(d);

    /* greyed processing row (E2): visible, quiet, non-actionable. */
    if (agg === 'grey') {
      return '<div class="ib-row greyed ib-grid" data-id="' + d.id + '">' +
        '<span class="ib-c1"></span>' +
        '<div class="ib-sender"><span class="srcsq ' + src.cls + '">' + src.icon + '</span>' +
          '<div class="ib-who"><span class="ib-name"><span class="nm">' + esc(d.sender) + '</span></span>' + srcLine(d) + '</div></div>' +
        typeCell(d) +
        statusCell(d) +
        clientCell(d) +
        '<span class="ib-time"></span>' +
        '<span class="ib-assignee un static"><span class="un-av">' + I.userOutline + '</span></span>' +
      '</div>';
    }

    var done = agg === 'complete';
    var cls = done ? 'done read' : (d.read ? 'read' : 'unread');
    if (d.sel) cls += ' sel';
    if (d.result === 'failed') cls += ' st-failed';

    return '<div class="ib-row ' + cls + ' ib-grid" data-id="' + d.id + '">' +
      '<span class="ib-c1">' +
        (done ? '' : '<span class="ib-ck ck' + (d.sel ? ' on' : '') + '" data-check="' + d.id + '" role="checkbox" aria-checked="' + d.sel + '"></span>') +
      '</span>' +
      '<div class="ib-sender">' +
        '<span class="srcsq ' + src.cls + ' has-tip" data-tip="' + esc(src.label) + '">' + src.icon + '</span>' +
        '<div class="ib-who">' +
          '<span class="ib-name"><span class="nm' + (d.unknown ? ' unk' : '') + '">' + esc(d.sender) + '</span>' + nameFlags(d) + '</span>' +
          srcLine(d) +
        '</div>' +
        (d.result === 'failed' ? '<button class="ib-retry" data-retry="' + d.id + '" title="Ask the sender\u2019s machine to retransmit">' + I.refresh + 'Retry</button>' : '') +
      '</div>' +
      typeCell(d) +
      statusCell(d) +
      clientCell(d) +
      '<span class="ib-time">' + whenLabel(d) + '</span>' +
      (done ? '<span class="ib-assignee static">' + (d.assignee ? avatar(person(d.assignee), 26) : '') + '</span>' : assigneeCell(d)) +
    '</div>';
  }

  function emptyState() {
    if (!filtersActive() && !DOCS.some(function (d) { return !d.trashed && !d.spam && !isDone(d); })) {
      return '<div class="ib-empty clear"><div class="ei">' + I.checkCircle + '</div><h3>You\u2019ve cleared the pile</h3>' +
        '<p>Every document has been reviewed and its work completed. New faxes and emails will land here already processed.</p>' +
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
  function doTrash(d) {
    var row = content.querySelector('.ib-row[data-id="' + d.id + '"]');
    var apply = function () { d.trashed = true; d.sel = false; render(); };
    if (row) { row.classList.add('leaving'); setTimeout(apply, 240); } else apply();
    toast('Moved to trash', d.sender, 'bad', function () { d.trashed = false; render(); });
  }
  function doRead(d) {
    d.read = !d.read;
    render();
    toast(d.read ? 'Marked as read' : 'Marked as unread', d.sender, 'blue');
  }
  function assignTo(d, key) {
    d.assignee = key;
    render();
    toast(key ? 'Assigned' : 'Unassigned', d.sender + (key ? ' \u2192 ' + person(key).name : ' \u00b7 returned to pool'), 'blue');
  }

  /* promote / dismiss a pending suggestion (C2: promotion writes permanent
     identity; dismissal touches no track) */
  function findSug(d, type) { for (var i = 0; i < d.suggestions.length; i++) if (d.suggestions[i].type === type) return i; return -1; }
  function promoteSug(d, type) {
    var i = findSug(d, type); if (i < 0) return;
    var s = d.suggestions.splice(i, 1)[0];
    d.tracks.push(tr(type, 0, false));
    render();
    toast('Type confirmed \u00b7 ' + TYPES[type].label, d.sender + ' \u2014 extracted fields attached, ready to review', 'ok',
      function () { d.tracks = d.tracks.filter(function (t) { return t.type !== type; }); d.suggestions.splice(i, 0, s); render(); });
  }
  function dismissSug(d, type) {
    var i = findSug(d, type); if (i < 0) return;
    var s = d.suggestions.splice(i, 1)[0];
    render();
    toast('Suggestion dismissed', TYPES[type].label + ' \u00b7 logged for calibration', 'blue',
      function () { d.suggestions.splice(i, 0, s); render(); });
  }

  /* manual typing (drains the Missing Doc Type pile) — multi-select menu */
  function docTypes(d) { return d.tracks.map(function (t) { return t.type; }); }
  function toggleType(d, k) {
    var i = -1;
    for (var j = 0; j < d.tracks.length; j++) if (d.tracks[j].type === k) { i = j; break; }
    var added = i < 0;
    if (added) d.tracks.push(tr(k, 0, false)); else d.tracks.splice(i, 1);
    /* manual application of a suggested type resolves the suggestion (promotion-collision rule) */
    var si = findSug(d, k); if (added && si >= 0) d.suggestions.splice(si, 1);
    render();
    toast(TYPES[k].label + (added ? ' added' : ' removed'), d.sender, added ? 'ok' : 'blue');
    return added;
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
      openMenu(trigger, html, function (k) {
        rows.forEach(function (d) {
          if (!d.tracks.some(function (t) { return t.type === k; })) d.tracks.push(tr(k, 0, false));
          var si = findSug(d, k); if (si >= 0) d.suggestions.splice(si, 1);
          d.sel = false;
        });
        render(); toast('Set ' + n + ' \u2192 ' + TYPES[k].label, '', 'ok');
      });
      return;
    }
    if (kind === 'download') { rows.forEach(function (d) { d.sel = false; }); render(); toast('Downloading ' + n + ' documents', 'Preparing a combined PDF', 'blue'); return; }
    if (kind === 'trash') { rows.forEach(function (d) { d.trashed = true; d.sel = false; }); render(); toast('Trashed ' + n + ' documents', '', 'bad'); return; }
    if (kind === 'spam') { confirmSpam(rows); return; }
  }

  /* ============================================================
     FLOATING MENUS
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

  /* SET DOCUMENT TYPE — multi-select over Tier-1 types + live search */
  function typeMenu(d, trigger) {
    var cur = docTypes(d);
    function typeRow(k) {
      var on = cur.indexOf(k) >= 0;
      var sug = (d.suggestions || []).filter(function (s) { return s.type === k; })[0];
      var meta = '';
      if (sug) {
        meta = '<span class="ib-tyrec">' +
          'Recommended \u00b7 ' + (sug.band === 'high' ? 'High' : 'Medium') +
          confMeter(sug.band, sug.why) + '</span>';
      }
      return '<button data-typetoggle="' + k + '" data-typename="' + esc(TYPES[k].label.toLowerCase()) + '" class="ib-typerow ' + (on ? 'on' : '') + (sug ? ' rec' : '') + '">' +
        '<span class="sw ' + TYPES[k].cls + '">' + TYPEICON[k] + '</span>' +
        '<span class="ib-tylabel">' + TYPES[k].label + '</span>' +
        meta +
        '<span class="tick">' + I.check + '</span></button>';
    }
    var html = '<div class="pl">Set document type \u00b7 select all that apply</div>' +
      '<div class="ib-typesearch"><span class="ib-ts-ic">' + I.search + '</span><input type="text" class="ib-typesearch-in" placeholder="Search document types\u2026" autocomplete="off" spellcheck="false" /></div>' +
      CLASSIFY.map(typeRow).join('') +
      '<div class="ib-noresult" hidden>No matching types</div>' +
      '<div class="psep"></div><button data-typedone class="ib-typedone">Done</button>';
    openMenu(trigger, html, null, 'ib-typemenu');
    menuEl._onToggle = function (k) {
      toggleType(d, k);
      var on = docTypes(d).indexOf(k) >= 0;
      [].forEach.call(menuEl.querySelectorAll('[data-typetoggle="' + k + '"]'), function (b) { b.classList.toggle('on', on); });
    };
    var input = menuEl.querySelector('.ib-typesearch-in');
    if (input) {
      input.focus();
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase(), any = false;
        [].forEach.call(menuEl.querySelectorAll('button[data-typename]'), function (b) {
          var m = !q || b.dataset.typename.indexOf(q) >= 0;
          b.hidden = !m; if (m) any = true;
        });
        var none = menuEl.querySelector('.ib-noresult');
        if (none) none.hidden = any;
      });
    }
  }
  function assignMenu(d, trigger) {
    var roster = [ME, PEOPLE.dv, PEOPLE.ml];
    var html = '<div class="pl">Assign to</div>' + roster.map(function (p) {
      return '<button data-val="' + p.key + '" class="' + (d.assignee === p.key ? 'on' : '') + '"><span class="sw" style="background:transparent">' + avatar(p, 22) + '</span>' + esc(p.name) + (p.key === 'me' ? ' (you)' : '') + '<span class="tick">' + I.check + '</span></button>';
    }).join('') + '<div class="psep"></div><button data-val="__none" class="' + (d.assignee ? '' : 'on') + '"><span class="sw" style="background:var(--gray-100);color:var(--gray-500)">' + I.contact + '</span>Unassigned \u00b7 pool<span class="tick">' + I.check + '</span></button>';
    openMenu(trigger, html, function (k) { assignTo(d, k === '__none' ? null : k); });
  }
  function statusMenu(trigger) {
    var opts = [['any', 'Any status'], ['needsconfirm', 'Needs Confirmation'], ['review', 'In Review'], ['notstarted', 'Not Started'], ['progress', 'In Progress'], ['complete', 'Complete']];
    var html = '<div class="pl">Status</div>' + opts.map(function (o) {
      return '<button data-val="' + o[0] + '" class="' + (view.status === o[0] ? 'on' : '') + '">' + o[1] + '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    openMenu(trigger, html, function (v) { view.status = v; render(); });
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
  function sortMenu(trigger) {
    var opts = [['newest', 'Newest first'], ['oldest', 'Oldest first'], ['unread', 'Unread first'], ['sender', 'Sender A\u2013Z']];
    var html = opts.map(function (o) {
      return '<button data-val="' + o[0] + '" class="' + (view.sort === o[0] ? 'on' : '') + '">' + o[1] + '<span class="tick">' + I.check + '</span></button>';
    }).join('');
    openMenu(trigger, html, function (v) { view.sort = v; render(); });
  }

  /* FILTERS — advanced filters open in a popup (not inline on the header) */
  function fPills(kind, opts, current) {
    return '<div class="ib-fopts">' + opts.map(function (o) {
      return '<button data-fset="' + kind + '" data-fval="' + o[0] + '" class="ib-fopt' + (current === o[0] ? ' on' : '') + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  function fStatusPills() {
    var opts = [['any', 'Any'], ['needsconfirm', 'Needs Confirmation'], ['review', 'In Review'], ['notstarted', 'Not Started'], ['progress', 'In Progress'], ['complete', 'Complete']];
    return '<div class="ib-fopts">' + opts.map(function (o) {
      var dot = o[0] === 'any' ? '' : '<span class="ib-fdot s-' + o[0] + '"></span>';
      return '<button data-fset="status" data-fval="' + o[0] + '" class="ib-fopt' + (view.status === o[0] ? ' on' : '') + '">' + dot + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  function fDatePills() {
    var opts = [['any', 'Any time'], ['today', 'Today'], ['yesterday', 'Yesterday'], ['range', 'Custom range']];
    var pills = '<div class="ib-fopts">' + opts.map(function (o) {
      return '<button data-fset="date" data-fval="' + o[0] + '" class="ib-fopt' + (view.date === o[0] ? ' on' : '') + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
    if (view.date === 'range') {
      pills += '<div class="ib-frange">' +
        '<label class="ib-frfield"><span>From</span><input type="date" class="ib-fdate" data-frange="from" value="' + esc(view.dateFrom) + '"></label>' +
        '<span class="ib-frdash">–</span>' +
        '<label class="ib-frfield"><span>To</span><input type="date" class="ib-fdate" data-frange="to" value="' + esc(view.dateTo) + '"></label>' +
        '</div>';
    }
    return pills;
  }
  function filtersPanelHtml() {
    var sortOpts = [['newest', 'Newest'], ['oldest', 'Oldest'], ['unread', 'Unread first'], ['sender', 'Sender A\u2013Z']];
    var contactOpts = CONTACTS.map(function (c) { return [c[0], c[0] === 'all' ? 'All types' : c[1]]; });
    var advCount = (view.status !== 'any' ? 1 : 0) + (view.date !== 'any' ? 1 : 0) + (view.contact !== 'all' ? 1 : 0) + (view.showDone ? 1 : 0) + (view.sort !== 'newest' ? 1 : 0);
    var nRes = DOCS.filter(passes).length;
    return '<div class="ib-filterhead">' +
        '<span class="ib-fhtitle">' + I.tune + 'Filters<span class="ib-fhcount">' + nRes + ' document' + (nRes === 1 ? '' : 's') + '</span></span>' +
        (advCount ? '<button class="ib-fclear" data-fclear>' + I.x + 'Clear all</button>' : '') +
      '</div>' +
      '<div class="ib-fgroup"><div class="ib-flabel">Status</div>' + fStatusPills() + '</div>' +
      '<div class="ib-fgroup"><div class="ib-flabel">Arrived</div>' + fDatePills() + '</div>' +
      '<div class="ib-fgroup"><div class="ib-flabel">Contact type</div>' + fPills('contact', contactOpts, view.contact) + '</div>' +
      '<div class="ib-fgroup"><div class="ib-flabel">Sort by</div>' + fPills('sort', sortOpts, view.sort) + '</div>' +
      '<label class="ib-fshowrow" data-fset="showdone" data-fval="toggle">' +
        '<span class="ib-fshowtxt"><span class="ib-fshowt">Show completed</span><span class="ib-fshowd">Include documents already done</span></span>' +
        '<span class="toggle' + (view.showDone ? ' on' : '') + '"></span>' +
      '</label>' +
      '<div class="ib-ffoot"><button data-fdone class="ib-fdone">Done</button></div>';
  }
  function filtersMenu(trigger) {
    openMenu(trigger, filtersPanelHtml(), null, 'ib-filterpop');
    menuEl._onFilter = function (kind, val) {
      if (kind === 'clear') { view.status = 'any'; view.date = 'any'; view.dateFrom = ''; view.dateTo = ''; view.contact = 'all'; view.sort = 'newest'; view.showDone = false; }
      else if (kind === 'showdone') view.showDone = !view.showDone;
      else if (kind === 'status') view.status = val;
      else if (kind === 'date') view.date = val;
      else if (kind === 'rangefrom') view.dateFrom = val;
      else if (kind === 'rangeto') view.dateTo = val;
      else if (kind === 'contact') view.contact = val;
      else if (kind === 'sort') view.sort = val;
      render();
      menuEl.innerHTML = filtersPanelHtml();
      var nt = document.getElementById('filtersToggle');
      if (nt) {
        menuTrigger = nt; nt.classList.add('open', 'active');
        var r = nt.getBoundingClientRect(), mw = menuEl.offsetWidth;
        menuEl.style.left = Math.max(12, Math.min(r.left, window.innerWidth - mw - 12)) + 'px';
        menuEl.style.top = (r.bottom + 6) + 'px';
      }
    };
  }
  function bulkAssignMenu(trigger) {
    var roster = [ME, PEOPLE.dv, PEOPLE.ml];
    var html = '<div class="pl">Assign ' + selected().length + ' to</div>' + roster.map(function (p) {
      return '<button data-val="' + p.key + '"><span class="sw" style="background:transparent">' + avatar(p, 22) + '</span>' + esc(p.name) + (p.key === 'me' ? ' (you)' : '') + '</button>';
    }).join('');
    openMenu(trigger, html, function (k) { var rows = selected(); rows.forEach(function (d) { d.assignee = k; d.sel = false; }); render(); toast('Assigned ' + rows.length + ' \u2192 ' + person(k).name, '', 'blue'); });
  }

  document.addEventListener('click', function (e) {
    if (menuEl && menuEl.contains(e.target)) {
      if (e.target.closest('[data-fdone]')) { e.stopPropagation(); closeMenu(); return; }
      if (e.target.closest('[data-fclear]')) { e.stopPropagation(); if (menuEl._onFilter) menuEl._onFilter('clear'); return; }
      var fEl = e.target.closest('[data-fset]');
      if (fEl && menuEl._onFilter) { e.stopPropagation(); menuEl._onFilter(fEl.dataset.fset, fEl.dataset.fval); return; }
      if (e.target.closest('[data-typedone]')) { e.stopPropagation(); closeMenu(); return; }
      var tg = e.target.closest('button[data-typetoggle]');
      if (tg && menuEl._onToggle) { e.stopPropagation(); menuEl._onToggle(tg.dataset.typetoggle); return; }
      var b = e.target.closest('button[data-val]');
      if (b && menuEl._onPick) { e.stopPropagation(); var v = b.dataset.val; var cb = menuEl._onPick; closeMenu(); cb(v); }
      return;
    }
    if (!e.target.closest('.ib-act') && !e.target.closest('[data-drop]') && !e.target.closest('#sortBtn') && !e.target.closest('#bulkAssign') && !e.target.closest('#bulkType') && !e.target.closest('[data-assign]') && !e.target.closest('[data-typecell]')) closeMenu();
  });

  /* custom date-range inputs inside the filters popup */
  document.addEventListener('change', function (e) {
    if (!menuEl || !menuEl.contains(e.target)) return;
    var inp = e.target.closest('[data-frange]');
    if (inp && menuEl._onFilter) menuEl._onFilter(inp.dataset.frange === 'from' ? 'rangefrom' : 'rangeto', inp.value);
  });

  /* ============================================================
     EVENT WIRING
     ============================================================ */
  content.addEventListener('click', function (e) {
    var act = e.target.closest('.ib-act[data-act]');
    if (act) {
      e.stopPropagation();
      var d = byId(act.dataset.id); if (!d) return;
      switch (act.dataset.act) {
        case 'trash': doTrash(d); break;
        case 'read': doRead(d); break;
        case 'spam': confirmSpam([d]); break;
      }
      return;
    }
    var pm = e.target.closest('[data-promote]');
    if (pm) { e.stopPropagation(); var pp = pm.dataset.promote.split(':'); var pd = byId(pp[0]); if (pd) promoteSug(pd, pp[1]); return; }
    var dm = e.target.closest('[data-dismiss]');
    if (dm) { e.stopPropagation(); var dp = dm.dataset.dismiss.split(':'); var ddd = byId(dp[0]); if (ddd) dismissSug(ddd, dp[1]); return; }
    var asn = e.target.closest('[data-assign]');
    if (asn) { e.stopPropagation(); var ad = byId(asn.dataset.assign); if (ad) assignMenu(ad, asn); return; }
    var sa = e.target.closest('[data-selall]');
    if (sa) { e.stopPropagation(); var sv = selectableVisible(); var allOn = sv.length && sv.every(function (d) { return d.sel; }); sv.forEach(function (d) { d.sel = !allOn; }); render(); return; }
    var ck = e.target.closest('[data-check]');
    if (ck) { e.stopPropagation(); var dd = byId(ck.dataset.check); if (dd) { dd.sel = !dd.sel; render(); } return; }
    var tcell = e.target.closest('[data-typecell]');
    if (tcell && !e.target.closest('.sug')) { e.stopPropagation(); var tcd = byId(tcell.dataset.typecell); if (tcd) typeMenu(tcd, tcell); return; }
    var rty = e.target.closest('[data-retry]');
    if (rty) { e.stopPropagation(); var rd = byId(rty.dataset.retry); if (rd) toast('Retrying fax receipt', rd.sender + ' \u00b7 re-requesting transmission', 'blue'); return; }
    var orv = e.target.closest('[data-openreview]');
    if (orv) { e.stopPropagation(); var ord = byId(orv.dataset.openreview); if (ord) openDoc(ord); return; }

    if (e.target.closest('#filtersToggle')) { e.stopPropagation(); filtersMenu(e.target.closest('#filtersToggle')); return; }

    var chipEl = e.target.closest('[data-chip]');
    if (chipEl) { view[chipEl.dataset.chip] = !view[chipEl.dataset.chip]; render(); return; }
    var dropEl = e.target.closest('[data-drop]');
    if (dropEl) {
      e.stopPropagation();
      var k = dropEl.dataset.drop;
      if (k === 'status') statusMenu(dropEl); else if (k === 'date') dateMenu(dropEl); else if (k === 'contact') contactMenu(dropEl);
      return;
    }
    if (e.target.closest('#pgNext')) { var nx = e.target.closest('#pgNext'); if (!nx.classList.contains('dis')) toast('Loading next page', 'Showing the most recent documents first', 'blue'); return; }
    if (e.target.closest('#sortBtn')) { e.stopPropagation(); sortMenu(e.target.closest('#sortBtn')); return; }
    if (e.target.closest('#showDone')) { view.showDone = !view.showDone; render(); return; }
    if (e.target.closest('#clearFilters')) { view.unread = view.untyped = view.mine = false; view.status = 'any'; view.date = 'any'; view.contact = 'all'; view.channel = 'all'; view.showFilters = false; render(); return; }

    var bb = e.target.closest('[data-bulk]');
    if (bb) {
      e.stopPropagation();
      if (bb.dataset.bulk === 'assign') { bulkAssignMenu(bb); return; }
      bulk(bb.dataset.bulk, bb);
      return;
    }

    var row = e.target.closest('.ib-row[data-id]');
    if (row) {
      var od = byId(row.dataset.id); if (!od) return;
      if (od.pipeline === 'processing') return; /* E2: no mid-process access */
      if (DOCS.some(function (d) { return d.sel; }) && !isDone(od)) { od.sel = !od.sel; render(); }
      else openDoc(od);
    }
  });

  function openDoc(d) {
    if (d.result === 'failed') { toast('Receipt failed', 'Nothing was received \u2014 use Retry to request it again', 'bad'); return; }
    if (d.read === false) d.read = true;
    var p = new URLSearchParams();
    p.set('from', 'inbox'); p.set('id', d.id);
    p.set('type', d.tracks.length ? d.tracks[0].type : 'unc');
    p.set('title', d.sender); p.set('sender', d.sender);
    if (d.crit) p.set('crit', '1');
    toast('Opening document', d.sender + ' \u00b7 access logged', 'blue');
    setTimeout(function () { location.href = '../detail/Robin Dock - Document Detail.html?' + p.toString(); }, 360);
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

  window.addEventListener('scroll', function (e) {
    /* ignore the popup's own internal scrolling — only close on outside scroll */
    if (menuEl && e.target && e.target.nodeType === 1 && menuEl.contains(e.target)) return;
    closeMenu();
  }, true);
  window.addEventListener('resize', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeSpam(); } });

  /* ============================================================
     SHELL CHROME
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
     SPAM CONFIRM MODAL (A7: human confirms; blocking is deliberate)
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
      var sub = chanLabel(d.chan) + ' \u00b7 ' + esc(d.line);
      return '<div class="im-sender"><span class="srcsq ' + src.cls + '">' + src.icon + '</span>' +
        '<div class="im-sm"><span class="im-snm">' + esc(d.sender) + '</span><span class="im-ssub">' + sub + '</span></div></div>';
    }).join('');
    spamModal.innerHTML = '<div class="ib-modal" role="dialog" aria-modal="true" aria-label="Confirm mark as spam">' +
      '<div class="im-head"><span class="im-ic">' + I.spam + '</span>' +
        '<div><h3>' + (senders.length > 1 ? 'Block these senders?' : 'Block this sender?') + '</h3>' +
        '<p class="im-sub">Marking spam <b>blocks the sender</b> so their future faxes skip the inbox entirely. Trashing one document is quiet and undoable; this stops a sender.</p></div></div>' +
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
     SEARCH AUTOSUGGEST (unchanged shell behavior)
     ============================================================ */
  var searchWrap = document.querySelector('.app-sub .search');
  var searchInput = searchWrap ? searchWrap.querySelector('input') : null;
  var searchPop = null;
  var SS_ENTITIES = [
    { grp: 'Source', av: 'sender', ic: I.scGp, name: 'Marana Pet Hospital', sub: 'Referring practice \u00b7 sends to records line \u00b7 14 documents', tab: true },
    { grp: 'Contact', av: 'reg', ic: I.scReg, name: 'Maricopa County Rabies Registry', sub: 'Public registry \u00b7 rabies certificates' },
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
    var chips = ['Unread', 'Missing doc type', 'Assigned to me'].map(function (c) {
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
    var foot = '<div class="ss-foot" data-ssall="1"><span class="ss-fico">' + I.search + '</span>' +
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
    if (!e.target.closest('.app-sub .search')) closeSearch();
  });
  function applySearchChip(c) {
    if (c === 'Unread') view.unread = true;
    else if (c === 'Assigned to me') view.mine = true;
    else if (c === 'Missing doc type') view.untyped = true;
    render();
    toast('Filter applied', c, 'blue');
  }
  window.addEventListener('resize', positionSearch);
  window.addEventListener('scroll', function () { if (searchPop && searchPop.classList.contains('open')) positionSearch(); }, true);

  /* ---------------- boot ---------------- */
  document.title = 'RobinDock \u2014 Inbox';
  render();

  /* demo entry points (?demo=…) */
  var DEMO = new URLSearchParams(location.search).get('demo');
  if (DEMO === 'select') {
    ['d2', 'd4', 'd7', 'd10'].forEach(function (id) { var d = byId(id); if (d) d.sel = true; });
    render();
  } else if (DEMO === 'empty') {
    DOCS.forEach(function (d) { d.tracks.forEach(function (t) { t.done = true; }); d.suggestions = []; if (!d.tracks.length) d.trashed = true; d.pipeline = 'ready'; });
    render();
  }
})();
