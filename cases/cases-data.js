/* ============================================================
   RobinDock — Cases prototype · MOCK DATA
   A CASE is a COMMUNICATION THREAD: the back-and-forth between
   this practice and one external party about a patient (or
   patients), assembled from the Documents and Tasks of that
   exchange.

   • Case STATUS is DERIVED from its Tasks — never set directly.
       open → in progress → complete → archived  (see deriveStatus)
   • The three lenses (Case / Department / Patient) are group-bys
       over the same Task data; this file is the Case grouping.
   • Patients/Clients are shown by NAME (role-gated-with-names),
       and opening a Case is a LOGGED surface (prototype affordance).

   "Today" ≈ 2026-06-14. Mock data only.
   ============================================================ */
(function () {
  'use strict';

  /* ---- current user + teammates (match the app shell) ---- */
  var ME = { key: 'me', name: 'Kai Sandoval', initials: 'KS', av: 'blue' };
  var PEOPLE = {
    me:     ME,
    dana:   { key: 'dana',  name: 'Dana Whitfield', initials: 'DW', av: '' },
    priya:  { key: 'priya', name: 'Priya Raman',    initials: 'PR', av: 'aqua' },
    marcus: { key: 'marcus',name: 'Marcus Lee',     initials: 'ML', av: 'blue' },
    renee:  { key: 'renee', name: 'Renee Cole',     initials: 'RC', av: 'aqua' }
  };

  /* ---- document-type set (LOCKED launch set, A1) ----
     Each gets a calm tinted badge, hues kept off the signal palette. */
  var TYPES = {
    referral: { label: 'Referral',     cls: 'ty-ref' },
    lab:      { label: 'Lab',          cls: 'ty-lab' },
    records:  { label: 'Records',      cls: 'ty-rec' },
    recreq:   { label: 'Records req',  cls: 'ty-req' },
    vaccine:  { label: 'Vaccine',      cls: 'ty-vax' },
    imaging:  { label: 'Imaging',      cls: 'ty-img' },
    unc:      { label: 'Unclassified', cls: 'ty-unc' }
  };

  /* ---- external parties (Contacts) — the "other end" of a thread ----
     type drives the source square (glyph + color = contact category). */
  var CONTACTS = {
    mwspec:    { name: 'Mountain West Veterinary Specialists', type: 'specialty', loc: 'Salt Lake City, UT' },
    cardiology:{ name: 'Intermountain Animal Cardiology',      type: 'specialty', loc: 'Salt Lake City, UT' },
    surgical:  { name: 'Wasatch Veterinary Surgical',          type: 'specialty', loc: 'Murray, UT' },
    cottonwood:{ name: 'Cottonwood Animal Clinic',             type: 'gp',        loc: 'Murray, UT' },
    pawsclaws: { name: 'Paws & Claws Clinic',                  type: 'gp',        loc: 'Sandy, UT' },
    foothill:  { name: 'Foothill Family Veterinary',           type: 'gp',        loc: 'Bountiful, UT' },
    barkcity:  { name: 'Bark City Veterinary',                 type: 'gp',        loc: 'Park City, UT' },
    wasimg:    { name: 'Wasatch Imaging Center',               type: 'imaging',   loc: 'Murray, UT' },
    idexx:     { name: 'IDEXX Reference Laboratories',         type: 'lab',       loc: 'Westbrook, ME' },
    antech:    { name: 'Antech Diagnostics',                   type: 'lab',       loc: 'Fountain Valley, CA' },
    redrock:   { name: 'Red Rock Emergency Vet',               type: 'er',        loc: 'Sandy, UT' },
    unknown:   { name: 'Unknown sender',                       type: 'unknown',   loc: null }
  };

  /* source-category metadata for a contact type */
  var SRC = {
    specialty: { cls: 'spec',  label: 'Specialty' },
    gp:        { cls: 'gp',    label: 'Referring vet' },
    er:        { cls: 'er',    label: 'Emergency / ER' },
    lab:       { cls: 'lab',   label: 'Lab' },
    imaging:   { cls: 'img',   label: 'Imaging' },
    pharmacy:  { cls: 'other', label: 'Pharmacy' },
    owner:     { cls: 'upl',   label: 'Owner' },
    unknown:   { cls: 'unk',   label: 'Unknown sender' },
    other:     { cls: 'other', label: 'Other' }
  };

  /* departments tasks route to */
  var DEPTS = {
    frontdesk: 'Front Desk',
    records:   'Records',
    medicine:  'Internal Medicine',
    surgery:   'Surgery',
    lab:       'Lab',
    radiology: 'Radiology'
  };

  /* ---- builders ----
     task(id, type, title, status, dept, who?)  status: open|prog|done
     doc(id, name, type, dir, dateISO, pages)    dir: in|out
     ev(dir, what, type, dateISO, by?, note?)    dir: in|out|status|note  */
  function task(id, type, title, status, dept, who) {
    return { id: id, type: type, title: title, status: status, dept: dept, who: who || null };
  }
  function doc(id, name, type, dir, date, pages) {
    return { id: id, name: name, type: type, dir: dir, date: date, pages: pages || 1 };
  }
  function ev(dir, what, type, date, by, note) {
    return { dir: dir, what: what, type: type || null, date: date, by: by || null, note: note || null };
  }

  /* ============================================================
     CASES — communication threads
     Each: id, subject, contact, client, patients[], opened,
     lastH (hours since last activity), awaiting ('us'|'them'|null),
     crit (clinical flag on the thread), archived, tasks[],
     docs[], timeline[], notes[].
     Status is DERIVED (see deriveStatus) — not stored.
     ============================================================ */
  var CASES = [

    /* ---- 1 · SHOWCASE: rich multi-document referral thread, awaiting OUR reply ---- */
    {
      id: 'C-3061', subject: 'Orthopedic consult — left stifle',
      contact: 'mwspec', client: 'Smith Household', clientId: 'CL-1009',
      patients: [{ name: 'Bella', species: 'Canine', breed: 'Labrador Retriever' }],
      opened: '2026-05-13', lastH: 3, awaiting: 'us',
      tasks: [
        task('T-9012', 'referral', 'Referral intake — review & route', 'done', 'frontdesk', 'dana'),
        task('T-9013', 'records', 'Send prior imaging + history back to MWVS', 'open', 'records', null),
        task('T-9014', 'records', 'File specialist consult note to Bella\u2019s chart', 'prog', 'records', 'me')
      ],
      docs: [
        doc('D-5510', 'Referral request — left stifle lameness', 'referral', 'in', '2026-05-13', 2),
        doc('D-5533', 'Pre-referral history + exam notes', 'records', 'out', '2026-05-14', 4),
        doc('D-5560', 'Specialist consult note — TPLO recommended', 'records', 'in', '2026-06-11', 3),
        doc('D-5561', 'Stifle radiograph series (referred)', 'imaging', 'in', '2026-06-11', 6)
      ],
      timeline: [
        ev('in', 'Referral request received', 'referral', '2026-05-13T09:12', null, 'Left stifle lameness — requesting orthopedic consult'),
        ev('status', 'Case opened · routed to Front Desk', null, '2026-05-13T09:15', 'dana'),
        ev('out', 'Prior history + exam notes sent', 'records', '2026-05-14T11:40', 'dana'),
        ev('in', 'Specialist consult note returned', 'records', '2026-06-11T15:02', null, 'TPLO recommended; requesting prior imaging + bloodwork'),
        ev('in', 'Stifle radiograph series attached', 'imaging', '2026-06-11T15:03', null)
      ],
      notes: [
        { by: 'dana', when: '2026-06-11T15:30', text: 'MWVS wants our pre-op bloodwork too — Bella\u2019s last CBC is from April, may need a fresh draw before we send.' }
      ]
    },

    /* ---- 2 · SHOWCASE: critical lab result, needs OUR review (clinical flag) ---- */
    {
      id: 'C-3142', subject: 'Spay pre-op labs — CBC / Chemistry',
      contact: 'idexx', client: 'Nguyen Household', clientId: 'CL-1204',
      patients: [{ name: 'Bella', species: 'Canine', breed: 'Standard Poodle' }],
      opened: '2026-06-14', lastH: 1, awaiting: 'us',
      crit: { sym: 'K\u207A', val: '8.9', unit: 'mmol/L', dir: 'high', an: 'Potassium' },
      tasks: [
        task('T-9101', 'lab', 'Review CBC / Chemistry — critical value flagged', 'open', 'medicine', null)
      ],
      docs: [
        doc('D-5602', 'Pre-op CBC + Chemistry panel', 'lab', 'in', '2026-06-14', 2)
      ],
      timeline: [
        ev('out', 'Pre-op panel ordered', 'lab', '2026-06-13T16:20', 'me'),
        ev('in', 'Results returned — critical potassium flagged', 'lab', '2026-06-14T08:05', null, 'K\u207A 8.9 mmol/L (HIGH) — verify sample, recheck before anesthesia')
      ],
      notes: []
    },

    /* ---- 3 · Unknown sender — thread can\u2019t be identified until Contact is resolved ---- */
    {
      id: 'C-3170', subject: 'Inbound fax — unidentified sender',
      contact: 'unknown', client: null, clientId: null,
      patients: [{ name: 'Cooper', species: 'Canine', breed: '\u2014', tentative: true }],
      opened: '2026-06-14', lastH: 5, awaiting: 'us',
      tasks: [
        task('T-9120', 'unc', 'Resolve sender & classify document', 'open', 'frontdesk', null)
      ],
      docs: [
        doc('D-5620', 'Fax — 4 pages (unclassified)', 'unc', 'in', '2026-06-14', 4)
      ],
      timeline: [
        ev('in', 'Fax received from an unrecognized number', 'unc', '2026-06-14T04:31', null, '(385) 555-0199 — no matching Contact on file')
      ],
      notes: []
    },

    /* ---- 4 · Records request we owe back, awaiting OUR reply ---- */
    {
      id: 'C-3155', subject: 'Records request — vaccine + visit history',
      contact: 'pawsclaws', client: 'Smith Household', clientId: 'CL-1126',
      patients: [{ name: 'Rocky', species: 'Canine', breed: 'Boxer' }],
      opened: '2026-06-12', lastH: 26, awaiting: 'us',
      tasks: [
        task('T-9088', 'recreq', 'Compile & send Rocky\u2019s records', 'prog', 'records', 'priya')
      ],
      docs: [
        doc('D-5588', 'Records request — transfer of care', 'recreq', 'in', '2026-06-12', 1)
      ],
      timeline: [
        ev('in', 'Records request received', 'recreq', '2026-06-12T10:18', null, 'Client moving care — requesting full history'),
        ev('status', 'Assigned to Records · Priya Raman', null, '2026-06-13T09:02', 'priya')
      ],
      notes: []
    },

    /* ---- 5 · Imaging review, in progress ---- */
    {
      id: 'C-3120', subject: 'Hip radiograph review',
      contact: 'wasimg', client: 'Smith Household', clientId: 'CL-1009',
      patients: [{ name: 'Bella', species: 'Canine', breed: 'Labrador Retriever' }],
      opened: '2026-05-30', lastH: 28, awaiting: 'them',
      tasks: [
        task('T-9050', 'imaging', 'File radiologist read to chart', 'prog', 'radiology', 'me'),
        task('T-9051', 'records', 'Acknowledge receipt to Wasatch Imaging', 'done', 'records', 'dana')
      ],
      docs: [
        doc('D-5470', 'Hip radiograph series', 'imaging', 'in', '2026-05-30', 4),
        doc('D-5495', 'Radiologist read — mild CHD', 'records', 'in', '2026-06-08', 2)
      ],
      timeline: [
        ev('out', 'Imaging referral sent', 'imaging', '2026-05-29T14:10', 'me'),
        ev('in', 'Radiograph series received', 'imaging', '2026-05-30T09:40', null),
        ev('in', 'Radiologist read returned', 'records', '2026-06-08T12:22', null, 'Mild coxofemoral dysplasia, bilateral')
      ],
      notes: []
    },

    /* ---- 6 · Cardiology follow-up, in progress ---- */
    {
      id: 'C-3104', subject: 'Cardiology follow-up — echo report',
      contact: 'cardiology', client: 'Alvarez Household', clientId: 'CL-1042',
      patients: [{ name: 'Coco', species: 'Canine', breed: 'Miniature Poodle' }],
      opened: '2026-06-02', lastH: 50, awaiting: 'them',
      tasks: [
        task('T-9070', 'referral', 'Cardiology referral — route to Medicine', 'done', 'medicine', 'marcus'),
        task('T-9071', 'records', 'File echo report + med plan', 'prog', 'medicine', 'marcus')
      ],
      docs: [
        doc('D-5512', 'Cardiology referral', 'referral', 'out', '2026-06-02', 2),
        doc('D-5559', 'Echocardiogram report', 'records', 'in', '2026-06-10', 5)
      ],
      timeline: [
        ev('out', 'Cardiology referral sent', 'referral', '2026-06-02T13:05', 'marcus'),
        ev('in', 'Echo report returned', 'records', '2026-06-10T10:50', null, 'Stage B2 MMVD — pimobendan started')
      ],
      notes: []
    },

    /* ---- 7 · Dental/surgery referral, in progress ---- */
    {
      id: 'C-3133', subject: 'Dental referral — fractured carnassial',
      contact: 'surgical', client: 'Delgado Household', clientId: 'CL-1187',
      patients: [{ name: 'Mochi', species: 'Feline', breed: 'Scottish Fold' }],
      opened: '2026-06-09', lastH: 19, awaiting: 'them',
      tasks: [
        task('T-9082', 'referral', 'Outbound surgical referral', 'prog', 'surgery', 'me')
      ],
      docs: [
        doc('D-5571', 'Surgical referral — oral', 'referral', 'out', '2026-06-09', 2),
        doc('D-5572', 'Dental radiographs', 'imaging', 'out', '2026-06-09', 3)
      ],
      timeline: [
        ev('out', 'Surgical referral + dental films sent', 'referral', '2026-06-09T16:40', 'me')
      ],
      notes: []
    },

    /* ---- 8 · Lab results, in progress ---- */
    {
      id: 'C-3128', subject: 'Thyroid panel — recheck',
      contact: 'antech', client: 'Patel Household', clientId: 'CL-1078',
      patients: [{ name: 'Simba', species: 'Feline', breed: 'Abyssinian' }],
      opened: '2026-06-07', lastH: 40, awaiting: 'us',
      tasks: [
        task('T-9078', 'lab', 'Review T4 panel & update plan', 'open', 'medicine', null)
      ],
      docs: [
        doc('D-5548', 'Total T4 panel', 'lab', 'in', '2026-06-12', 1)
      ],
      timeline: [
        ev('out', 'Recheck panel ordered', 'lab', '2026-06-07T09:15', 'me'),
        ev('in', 'T4 results returned', 'lab', '2026-06-12T18:30', null, 'T4 within reference range')
      ],
      notes: []
    },

    /* ---- 9 · Multi-patient household records transfer, in progress ---- */
    {
      id: 'C-3160', subject: 'Records transfer — two patients',
      contact: 'cottonwood', client: 'Patel Household', clientId: 'CL-1078',
      patients: [
        { name: 'Simba', species: 'Feline', breed: 'Abyssinian' },
        { name: 'Nala', species: 'Feline', breed: 'Abyssinian' }
      ],
      opened: '2026-06-11', lastH: 34, awaiting: 'us',
      tasks: [
        task('T-9110', 'recreq', 'Compile Simba\u2019s records', 'done', 'records', 'priya'),
        task('T-9111', 'recreq', 'Compile Nala\u2019s records', 'prog', 'records', 'priya')
      ],
      docs: [
        doc('D-5596', 'Records request — both pets', 'recreq', 'in', '2026-06-11', 1),
        doc('D-5601', 'Simba — records packet', 'records', 'out', '2026-06-13', 8)
      ],
      timeline: [
        ev('in', 'Records request received (Simba + Nala)', 'recreq', '2026-06-11T11:00', null),
        ev('out', 'Simba\u2019s records sent', 'records', '2026-06-13T14:20', 'priya')
      ],
      notes: [
        { by: 'priya', when: '2026-06-13T14:25', text: 'Nala\u2019s rabies cert is missing from the chart — pulling from Bark City before sending.' }
      ]
    },

    /* ---- 10 · Simple: single-document, single-task, open ---- */
    {
      id: 'C-3168', subject: 'Rabies certificate request',
      contact: 'foothill', client: 'Johansson Household', clientId: 'CL-1155',
      patients: [{ name: 'Thor', species: 'Canine', breed: 'Bernese Mountain Dog' }],
      opened: '2026-06-13', lastH: 8, awaiting: 'us',
      tasks: [
        task('T-9118', 'recreq', 'Send Thor\u2019s rabies certificate', 'open', 'records', null)
      ],
      docs: [
        doc('D-5615', 'Rabies certificate request', 'recreq', 'in', '2026-06-13', 1)
      ],
      timeline: [
        ev('in', 'Certificate request received', 'recreq', '2026-06-13T13:44', null)
      ],
      notes: []
    },

    /* ---- 11 · Complete thread (resolved, de-emphasized by default) ---- */
    {
      id: 'C-3088', subject: 'Annual wellness records transfer',
      contact: 'cottonwood', client: 'Smith Household', clientId: 'CL-1009',
      patients: [{ name: 'Max', species: 'Canine', breed: 'Beagle' }],
      opened: '2026-04-08', lastH: 360, awaiting: null,
      tasks: [
        task('T-8801', 'recreq', 'Send Max\u2019s wellness records', 'done', 'records', 'dana')
      ],
      docs: [
        doc('D-5210', 'Records request', 'recreq', 'in', '2026-04-08', 1),
        doc('D-5224', 'Wellness records packet', 'records', 'out', '2026-04-09', 5)
      ],
      timeline: [
        ev('in', 'Records request received', 'recreq', '2026-04-08T10:00', null),
        ev('out', 'Wellness records sent', 'records', '2026-04-09T09:30', 'dana'),
        ev('status', 'All tasks complete · thread resolved', null, '2026-04-09T09:31', 'dana')
      ],
      notes: []
    },

    /* ---- 12 · Complete vaccine thread ---- */
    {
      id: 'C-2980', subject: 'Vaccine records transfer',
      contact: 'pawsclaws', client: 'Smith Household', clientId: 'CL-1126',
      patients: [{ name: 'Rocky', species: 'Canine', breed: 'Boxer' }],
      opened: '2026-05-21', lastH: 540, awaiting: null,
      tasks: [
        task('T-8702', 'vaccine', 'Send vaccine history', 'done', 'records', 'renee')
      ],
      docs: [
        doc('D-5390', 'Vaccine records request', 'recreq', 'in', '2026-05-21', 1),
        doc('D-5402', 'Vaccine history', 'vaccine', 'out', '2026-05-21', 2)
      ],
      timeline: [
        ev('in', 'Vaccine records request received', 'recreq', '2026-05-21T08:50', null),
        ev('out', 'Vaccine history sent', 'vaccine', '2026-05-21T15:10', 'renee'),
        ev('status', 'Thread resolved', null, '2026-05-21T15:11', 'renee')
      ],
      notes: []
    },

    /* ---- 13 · Archived thread (viewable, marked, de-emphasized) ---- */
    {
      id: 'C-2904', subject: 'Vaccination update — Rabies, DHPP',
      contact: 'barkcity', client: 'Smith Household', clientId: 'CL-1009',
      patients: [{ name: 'Bella', species: 'Canine', breed: 'Labrador Retriever' }],
      opened: '2025-03-12', lastH: 11000, awaiting: null, archived: true,
      tasks: [
        task('T-7200', 'vaccine', 'File vaccination update', 'done', 'records', 'dana')
      ],
      docs: [
        doc('D-4810', 'Vaccination certificate — Rabies, DHPP', 'vaccine', 'in', '2025-03-12', 1)
      ],
      timeline: [
        ev('in', 'Vaccination certificate received', 'vaccine', '2025-03-12T09:00', null),
        ev('status', 'Filed to chart · thread resolved', null, '2025-03-12T09:20', 'dana'),
        ev('status', 'Archived', null, '2025-06-01T00:00', 'dana')
      ],
      notes: []
    }
  ];

  /* ============================================================
     DERIVED STATUS — rolled up from a Case\u2019s Tasks.
     archived → archived; all done → complete;
     any in progress (or mix) → in progress; else → open.
     ============================================================ */
  function deriveStatus(c) {
    if (c.archived) return 'archived';
    var ts = c.tasks || [];
    if (!ts.length) return 'open';
    var done = ts.filter(function (t) { return t.status === 'done'; }).length;
    if (done === ts.length) return 'complete';
    var anyProg = ts.some(function (t) { return t.status === 'prog'; });
    var anyDone = done > 0;
    if (anyProg || anyDone) return 'inprog';
    return 'open';
  }
  function openTaskCount(c) {
    return (c.tasks || []).filter(function (t) { return t.status !== 'done'; }).length;
  }

  window.RD_CASES = {
    ME: ME, PEOPLE: PEOPLE, TYPES: TYPES, CONTACTS: CONTACTS, SRC: SRC, DEPTS: DEPTS,
    CASES: CASES, TODAY: '2026-06-14',
    deriveStatus: deriveStatus, openTaskCount: openTaskCount
  };
})();
