/* ============================================================
   RobinDock — Patient Detail · MOCK AGGREGATE DATA
   The data this page surfaces is COLLECTED FROM DOCUMENTS and
   staged for push — not authored here. Every field carries
   provenance (which document, which date). Conflicts are
   surfaced, not clobbered.

   Shape:
     DETAIL[patientId] = {
       dob, microchip, lastUpdated,           // record meta
       push: { pushedAt },                     // when last pushed (per current dest)
       sources: { docKey: {label,org,date,case,kind,flock} },
       groups: [ { title, tag, fields:[ Field ] } ],
       threads: [ {id,subject,status,other,date,kind,docs:[...]} ]
     }
   Field = {
     key, label, value, src(docKey), mono?, asPrinted?, optional?,
     conflict?: { candidates:[ {value, print, src} ] }
   }
   Patients without an authored record get a derived one
   (single-source provenance, no conflicts) so every link works.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Bella · Smith Household CL-1009 (the showcase) ---------- */
  var BELLA_SOURCES = {
    radiology: { label: 'Radiology Report — Left stifle', org: 'Wasatch Imaging', date: '2026-05-30', case: 'C-3120', kind: 'img' },
    cbc:       { label: 'CBC Results',                     org: 'Antech Diagnostics', date: '2026-05-14', case: 'C-3061', kind: 'lab' },
    referral:  { label: 'Orthopedic consult — referral',  org: 'Mountain West Vet Specialists', date: '2026-05-13', case: 'C-3061', kind: 'ref', flock: true },
    wellness:  { label: 'Wellness exam summary',          org: 'Mountain West Veterinary', date: '2026-04-30', case: 'C-3002', kind: 'rec' },
    vaccine:   { label: 'Vaccine record — Rabies, DHPP',  org: 'Bark City Veterinary', date: '2025-03-12', case: 'C-2904', kind: 'vax' }
  };

  var BELLA = {
    dob: '2022-03-08',
    microchip: '985•••231',
    lastUpdated: '2026-05-30',
    push: { pushedAt: '2026-05-12' }, // before the recent docs → "changed since last push"
    sources: BELLA_SOURCES,
    groups: [
      {
        title: 'Identity & matching core', tag: 'Matching',
        fields: [
          { key: 'species', label: 'Species', value: 'Canine', src: 'wellness' },
          { key: 'breed',   label: 'Breed',   value: 'Labrador Retriever', src: 'wellness' },
          { key: 'sex',     label: 'Sex',     value: 'Female, spayed', src: 'wellness' },
          { key: 'dob',     label: 'Date of birth', value: 'Mar 8, 2022', src: 'vaccine' },
          { key: 'chip',    label: 'Microchip', value: '985 141 000 444 231', mono: true, src: 'wellness' }
        ]
      },
      {
        title: 'Clinical', tag: 'Per-type · A1',
        fields: [
          {
            key: 'weight', label: 'Weight',
            conflict: {
              candidates: [
                { value: '28.4 kg', print: 'as printed: 28.4 kg (62.6 lb)', src: 'cbc' },
                { value: '27.8 kg', print: 'as printed: 27.8 kg', src: 'wellness' }
              ]
            }
          },
          { key: 'problems', label: 'Problems', value: 'Left stifle lameness — grade 2/4', src: 'referral' },
          { key: 'meds', label: 'Medications', value: 'Carprofen 75 mg — 1 tab PO BID', src: 'referral' },
          { key: 'allergies', label: 'Allergies', value: 'None reported', src: 'wellness' },
          { key: 'rabies', label: 'Rabies vaccine', value: 'Mar 12, 2025 · 3-yr · exp 2028', src: 'vaccine' },
          { key: 'dhpp', label: 'DHPP vaccine', value: 'Mar 12, 2025', src: 'vaccine' }
        ]
      },
      {
        title: 'Lab values', tag: 'As printed',
        fields: [
          { key: 'hct', label: 'HCT', value: '44.2 %', mono: true, asPrinted: true, src: 'cbc' },
          { key: 'wbc', label: 'WBC', value: '8.1 ×10⁹/L', mono: true, asPrinted: true, src: 'cbc' },
          { key: 'plt', label: 'Platelets', value: '312 ×10⁹/L', mono: true, asPrinted: true, src: 'cbc' },
          { key: 'bun', label: 'BUN', value: null, optional: true } // missing — completable
        ]
      }
    ],
    threads: [
      { id: 'C-3120', subject: 'Hip x-ray review', status: 'in progress', other: 'Wasatch Imaging', date: '2026-05-30',
        docs: [{ label: 'Radiology Report — Left stifle', kind: 'img' }] },
      { id: 'C-3061', subject: 'Orthopedic consult — left stifle', status: 'in progress', other: 'Mountain West Vet Specialists', date: '2026-05-13',
        docs: [{ label: 'CBC Results', kind: 'lab' }, { label: 'Referral', kind: 'ref', flock: true }] },
      { id: 'C-3002', subject: 'Annual wellness exam', status: 'complete', other: 'Mountain West Veterinary', date: '2026-04-30',
        docs: [{ label: 'Wellness exam summary', kind: 'rec' }] },
      { id: 'C-2904', subject: 'Vaccination update — Rabies, DHPP', status: 'archived', other: 'Bark City Veterinary', date: '2025-03-12',
        docs: [{ label: 'Vaccine record', kind: 'vax' }] }
    ]
  };

  var DETAIL = { 'c1-p1': BELLA };

  /* ---------- derived record for any other patient ----------
     Single-source provenance, no conflicts; cases come from the
     client's real case list (patient-filtered). Keeps every
     patient link resolving to a working page.            */
  function deriveDetail(p, c) {
    var threads = (c.cases || []).filter(function (k) { return k.patients.indexOf(p.name) >= 0; })
      .map(function (k) {
        return { id: k.id, subject: k.subject, status: k.status, other: k.other, date: k.date,
          docs: [{ label: k.subject, kind: 'rec' }] };
      });
    var recent = threads.length ? threads[0] : null;
    var src = recent
      ? { rec: { label: recent.subject, org: recent.other, date: recent.date, case: recent.id, kind: 'rec' } }
      : {};
    var coreFields = [
      { key: 'species', label: 'Species', value: p.species, src: recent ? 'rec' : null },
      { key: 'breed', label: 'Breed', value: p.breed, src: recent ? 'rec' : null },
      { key: 'sex', label: 'Sex', value: expandSex(p.sex), src: recent ? 'rec' : null },
      { key: 'age', label: 'Age', value: p.age, src: recent ? 'rec' : null }
    ];
    var clinical = [
      { key: 'weight', label: 'Weight', value: null, optional: true },
      { key: 'problems', label: 'Problems', value: recent ? subjectToProblem(recent.subject) : null, optional: true, src: recent ? 'rec' : null },
      { key: 'allergies', label: 'Allergies', value: null, optional: true },
      { key: 'rabies', label: 'Rabies vaccine', value: null, optional: true }
    ];
    return {
      dob: null, microchip: null, lastUpdated: p.lastCase, push: { pushedAt: null },
      sources: src,
      groups: [
        { title: 'Identity & matching core', tag: 'Matching', fields: coreFields },
        { title: 'Clinical', tag: 'Per-type · A1', fields: clinical }
      ],
      threads: threads
    };
  }

  function expandSex(s) {
    return ({ 'FS': 'Female, spayed', 'MN': 'Male, neutered', 'F': 'Female', 'M': 'Male' })[s] || s;
  }
  function subjectToProblem(sub) {
    var s = sub.toLowerCase();
    if (s.indexOf('lameness') >= 0 || s.indexOf('x-ray') >= 0 || s.indexOf('ortho') >= 0) return 'Lameness — under workup';
    if (s.indexOf('allerg') >= 0) return 'Suspected allergy';
    if (s.indexOf('dental') >= 0) return 'Dental disease';
    if (s.indexOf('ear') >= 0) return 'Otitis';
    return null;
  }

  /* ---------- SPARSE shaping: a thin/new patient ----------
     keep identity core known, blank the clinical + labs,
     drop most history → drives empty/sparse states.       */
  function makeSparse(detail) {
    var d = clone(detail);
    d.groups = d.groups.map(function (g) {
      if (g.title === 'Lab values') return null;
      var fields = g.fields.map(function (f) {
        if (g.title === 'Identity & matching core') {
          // keep species/breed/sex; blank the rest
          if (['species', 'breed', 'sex'].indexOf(f.key) >= 0) return f;
          return blank(f);
        }
        return blank(f); // clinical all unknown
      });
      return { title: g.title, tag: g.tag, fields: fields };
    }).filter(Boolean);
    d.threads = []; // no case history yet
    d.lastUpdated = d.lastUpdated;
    d.push = { pushedAt: null };
    d.sparse = true;
    return d;
  }
  function blank(f) {
    return { key: f.key, label: f.label, value: null, optional: true, mono: f.mono };
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  window.RD_PATIENT = {
    get: function (id) { return DETAIL[id] || null; },
    derive: deriveDetail,
    sparse: makeSparse
  };
})();
