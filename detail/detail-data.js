/* ============================================================
   RobinDock — Document Detail · DATA
   Mock documents mirroring the extraction pipeline data model.
   Field: { key,label,value,conf:'high'|'med'|null,region,required,
            confirmed,edited,corrFrom }
   conf:null + value:'' = below-threshold → left empty, staged (B2).
   ============================================================ */
window.DD_DATA = (function () {
  'use strict';

  /* ---------- shared patient candidates (A3) ---------- */
  var CANDIDATES = [
    {
      id: 'p1', name: 'Biscuit', species: 'Canine', breed: 'Golden Retriever', sex: 'MN', age: '6y',
      owner: 'Marta Reyes', acct: 'MW-20481', eligible: true, grade: 'strong',
      keys: [
        { k: 'Patient name', hit: true },
        { k: 'Owner phone', hit: true },
        { k: 'Contact history', hit: true, tie: true }
      ],
      note: '3 agreeing keys \u2014 name, owner phone, and a confirmed contact\u2194patient tie with Bear Hollow.'
    },
    {
      id: 'p2', name: 'Biscuit', species: 'Feline', breed: 'Domestic Shorthair', sex: 'FS', age: '4y',
      owner: 'Julia Nguyen', acct: 'MW-19022', eligible: false, grade: 'veto', feline: true,
      keys: [{ k: 'Patient name', hit: true }],
      conflict: 'Species mismatch \u2014 document says Canine, this record is Feline. Hard conflict vetoes the match regardless of score.'
    },
    {
      id: 'p3', name: 'Brisket', species: 'Canine', breed: 'Labrador mix', sex: 'M', age: '2y',
      owner: 'M. Reys', acct: 'MW-21107', eligible: true, grade: 'weak',
      keys: [{ k: 'Similar name', hit: true }, { k: 'Owner phone', hit: false }, { k: 'Contact history', hit: false }],
      note: 'Single fuzzy key \u2014 always low-confidence on its own.'
    }
  ];

  /* ---------- core fields shared across tracks (Doc-Type Grid) ---------- */
  function coreFields() {
    return [
      { key: 'patient', label: 'Patient name', value: 'Biscuit', conf: 'high', region: 'r-patient', required: true },
      { key: 'species', label: 'Species / breed', value: 'Canine \u00b7 Golden Retriever', conf: 'high', region: 'r-species', required: true },
      { key: 'owner', label: 'Client / owner', value: 'Marta Reyes', conf: 'high', region: 'r-owner', required: true },
      { key: 'docdate', label: 'Document date', value: 'Jul 2, 2026', conf: 'med', region: 'r-docdate', required: true, input: 'date' }
    ];
  }

  /* ============================================================
     SCENARIO 1 — Referral + suggested Lab (multi-type, in review)
     ============================================================ */
  var DOC_REFERRAL = {
    id: 'RD-8341',
    scenario: 'referral',
    sender: {
      name: 'Bear Hollow Animal Clinic', kind: 'General practice', verified: true,
      fax: '(435) 615-2280', loc: 'Park City, UT 84060', contactSince: 'Sep 2024'
    },
    received: 'Today, 9:42 AM', channel: 'Fax', pages: 4, sizeKb: 842,
    assignee: { name: 'Kai Sandoval', initials: 'KS', av: 'blue' },
    extraction: { model: 'extraction v2.4.1', ts: 'Today, 9:43 AM', calibration: 'cal-2026-06-28', prescreen: 'passed' },
    result: 'ok',
    banner: { kind: 'warn', html: '<b>1 required field couldn\u2019t be extracted.</b> Requested service was below the confidence threshold and was left empty \u2014 it needs a value before the Referral track can complete.' },

    tracks: [
      {
        type: 'ref', label: 'Referral', origin: 'Auto-typed \u00b7 high confidence',
        steps: ['Review', 'Confirm Match', 'Confirm to Referrer', 'Schedule', 'Sync to PIMS', 'Complete'],
        optionalSteps: [3],
        stepIdx: 0, complete: false, pushed: false, syncing: false,
        pagesSpan: '1\u20132',
        fields: coreFields().concat([
          { key: 'urgency', label: 'Urgency', value: 'Urgent \u2014 within 48 h', conf: 'med', input: 'select', options: ['Routine', 'Soon \u2014 within 2 weeks', 'Urgent \u2014 within 48 h'], region: 'r-urgency', required: true },
          { key: 'service', label: 'Requested service / specialty', value: '', conf: null, input: 'select', options: ['Orthopedic surgery', 'Soft-tissue surgery', 'Internal medicine', 'Oncology', 'Cardiology', 'Neurology', 'Dermatology'], region: 'r-service', required: true },
          { key: 'rabies', label: 'Rabies vaccination date', value: 'Aug 14, 2025', conf: 'med', input: 'date', required: false },
          { key: 'reason', label: 'Reason for referral', value: 'Progressive right forelimb lameness, 6 wk; suspect elbow dysplasia. Radiographs enclosed.', conf: 'med', region: 'r-reason', required: true, wide: true },
          { key: 'records', label: 'Records enclosed', value: 'Radiographs (3 views) \u00b7 CBC / Chem panel \u00b7 referral letter', conf: 'high', required: false, wide: true },
          /* --- source of document: referring partner / contact (rendered on Patient & contact tab) --- */
          { key: 'refvet', label: 'Referring vet', value: 'Dr. Alan Voss, DVM', conf: 'high', region: 'r-refvet', required: true, group: 'partner' },
          { key: 'refclinic', label: 'Referring practice', value: 'Bear Hollow Animal Clinic', conf: 'high', region: 'r-refclinic', required: true, input: 'contact', group: 'partner',
            suggestedId: 'c-bearhollow',
            contactOptions: [
              { id: 'c-bearhollow', name: 'Bear Hollow Animal Clinic', kind: 'General practice', loc: 'Park City, UT', fax: '(435) 615-2280', verified: true, note: 'Exact match \u00b7 this document\u2019s sender', best: true },
              { id: 'c-bearhollow-heber', name: 'Bear Hollow Veterinary \u2014 Heber', kind: 'General practice', loc: 'Heber City, UT', fax: '(435) 654-1180', verified: true, note: 'Same brand, different location' },
              { id: 'c-wasatch', name: 'Wasatch Peak Animal Hospital', kind: 'General practice', loc: 'Kamas, UT', fax: '(435) 783-2200', verified: true, note: 'Similar fax exchange' }
            ] },
          { key: 'prefcontact', label: 'Preferred contact', value: 'Fax', conf: 'high', input: 'select', options: ['Fax', 'Phone', 'Email', 'Portal message'], required: false, group: 'partner' }
        ]),
        stagedNote: 'Requested service / specialty came back below the extraction threshold, so it was left empty rather than guessed \u2014 the record is never briefly wrong. Add it manually.'
      }
    ],

    suggestions: [
      {
        type: 'lab', label: 'Lab result', band: 'medium',
        why: 'Pages <b>3\u20134</b> look like an attached <b>CBC / Chem 17 panel</b> from Bear Hollow\u2019s in-house analyzer. Confirming adds an independent Lab track with its own completion.',
        pagesSpan: '3\u20134'
      }
    ],

    /* pre-built lab track, added if the suggestion is promoted */
    labTrack: {
      type: 'lab', label: 'Lab result', origin: 'Typed by you \u00b7 just now',
      steps: ['Review', 'Confirm Match', 'Sync to PIMS', 'Complete'],
      optionalSteps: [],
      stepIdx: 0, complete: false, pushed: false, syncing: false,
      pagesSpan: '3\u20134',
      fields: coreFields().concat([
        { key: 'panel', label: 'Test panel', value: 'CBC + Chem 17', conf: 'high', region: 'r-panel', required: true },
        { key: 'collected', label: 'Collection date', value: 'Jul 1, 2026', conf: 'high', region: 'r-collected', required: true, input: 'date' },
        { key: 'ordvet', label: 'Ordering vet', value: 'Dr. Alan Voss, DVM', conf: 'high', region: 'r-ordvet', required: true }
      ]),
      labResults: [
        { an: 'ALP', val: '312', unit: 'U/L', rng: '23\u2013212', flag: 'high' },
        { an: 'ALT', val: '118', unit: 'U/L', rng: '10\u2013125', flag: '' },
        { an: 'BUN', val: '18', unit: 'mg/dL', rng: '7\u201327', flag: '' },
        { an: 'Creatinine', val: '1.1', unit: 'mg/dL', rng: '0.5\u20131.8', flag: '' },
        { an: 'WBC', val: '14.9', unit: 'K/\u00b5L', rng: '5.05\u201316.76', flag: '' },
        { an: 'HCT', val: '39.1', unit: '%', rng: '37.3\u201361.7', flag: '' }
      ]
    },

    candidates: CANDIDATES,
    match: null, /* {cand, how} once bound */

    ties: {
      contact: 'Bear Hollow Animal Clinic',
      rows: [
        { name: 'Biscuit', species: 'Canine', sig: 'Golden Retriever \u00b7 Reyes', docs: 12, last: 'Today', strength: 'strong', current: true },
        { name: 'Moose', species: 'Canine', sig: 'Bernese Mtn Dog \u00b7 Tanner', docs: 5, last: 'Jun 21', strength: 'strong' },
        { name: 'Cleo', species: 'Feline', sig: 'DSH \u00b7 Nguyen', docs: 2, last: 'May 30', strength: 'new', feline: true },
        { name: 'Pepper', species: 'Canine', sig: 'Border Collie \u00b7 Okafor', docs: 1, last: 'Apr 12', strength: 'new' }
      ]
    },

    history: [
      { who: 'System', kind: 'sys', ts: '9:42 AM', what: 'Document received via fax from <b>(435) 615-2280</b> \u00b7 4 pages.' },
      { who: 'System', kind: 'sys', ts: '9:42 AM', what: 'Legibility pre-screen passed \u2014 queued for extraction.' },
      { who: 'System', kind: 'sys', ts: '9:43 AM', what: 'Classified <b>Referral</b> (high confidence \u2014 auto-applied) \u00b7 suggested <b>Lab result</b> (medium). <span class="hx-chip">extraction v2.4.1</span>' },
      { who: 'System', kind: 'sys', ts: '9:43 AM', what: 'Extracted 7 of 8 Referral fields. <b>Requested service</b> below threshold \u2192 left empty. Patient match suggested with 3 agreeing keys (suggest-only).' }
    ]
  };

  /* ============================================================
     SCENARIO 2 — Vaccine cert, complete → eligible to push (D4)
     ============================================================ */
  var DOC_VACCINE = {
    id: 'RD-8322',
    scenario: 'vaccine',
    sender: {
      name: 'Timpanogos Mobile Vet', kind: 'Mobile practice', verified: true,
      fax: '(801) 494-1180', loc: 'Provo, UT 84604', contactSince: 'Feb 2025'
    },
    received: 'Today, 8:05 AM', channel: 'Fax', pages: 1, sizeKb: 96,
    assignee: { name: 'Dana Voss', initials: 'DV', av: '' },
    extraction: { model: 'extraction v2.4.1', ts: 'Today, 8:05 AM', calibration: 'cal-2026-06-28', prescreen: 'passed' },
    result: 'ok',
    banner: null,

    tracks: [
      {
        type: 'vax', label: 'Vaccine / rabies cert', origin: 'Auto-typed \u00b7 high confidence',
        steps: ['Review', 'Confirm Match', 'Sync to PIMS', 'Complete'],
        optionalSteps: [],
        stepIdx: 2, complete: false, pushed: false, syncing: false, eligible: true,
        pagesSpan: '1',
        fields: [
          { key: 'patient', label: 'Patient name', value: 'Juniper', conf: 'high', region: 'r-patient', required: true, confirmed: true },
          { key: 'species', label: 'Species / breed', value: 'Canine \u00b7 Australian Shepherd', conf: 'high', region: 'r-species', required: true, confirmed: true },
          { key: 'owner', label: 'Client / owner', value: 'Sam Whitaker', conf: 'high', region: 'r-owner', required: true, confirmed: true },
          { key: 'docdate', label: 'Document date', value: 'Jul 3, 2026', conf: 'high', region: 'r-docdate', required: true, confirmed: true },
          { key: 'vaccine', label: 'Vaccine type', value: 'Rabies \u2014 3 year (RABVAC 3)', conf: 'high', region: 'r-vaccine', required: true, confirmed: true },
          { key: 'lot', label: 'Lot number', value: 'A0412-88C', conf: 'med', region: 'r-lot', required: true, confirmed: true, edited: true, corrFrom: 'A0412-BBC' },
          { key: 'advet', label: 'Administering vet', value: 'Dr. Priya Shah, DVM', conf: 'high', region: 'r-advet', required: true, confirmed: true },
          { key: 'expiry', label: 'Expiry / due date', value: 'Jul 3, 2029', conf: 'high', region: 'r-expiry', required: true, confirmed: true }
        ]
      }
    ],

    suggestions: [],
    candidates: [
      {
        id: 'p9', name: 'Juniper', species: 'Canine', breed: 'Australian Shepherd', sex: 'FS', age: '3y',
        owner: 'Sam Whitaker', acct: 'MW-18450', eligible: true, grade: 'strong',
        keys: [{ k: 'Patient name', hit: true }, { k: 'Owner name', hit: true }, { k: 'Contact history', hit: true, tie: true }]
      }
    ],
    match: { name: 'Juniper', sig: 'Canine \u00b7 Australian Shepherd \u00b7 Whitaker \u00b7 MW-18450', how: 'Confirmed by Dana Voss \u00b7 8:31 AM' },

    ties: {
      contact: 'Timpanogos Mobile Vet',
      rows: [
        { name: 'Juniper', species: 'Canine', sig: 'Australian Shepherd \u00b7 Whitaker', docs: 7, last: 'Today', strength: 'strong', current: true },
        { name: 'Tuck', species: 'Canine', sig: 'Corgi \u00b7 Whitaker', docs: 3, last: 'May 18', strength: 'strong' }
      ]
    },

    history: [
      { who: 'System', kind: 'sys', ts: '8:05 AM', what: 'Document received via fax from <b>(801) 494-1180</b> \u00b7 1 page.' },
      { who: 'System', kind: 'sys', ts: '8:05 AM', what: 'Classified <b>Vaccine / rabies cert</b> (high confidence \u2014 auto-applied). Extracted 8 of 8 fields. <span class="hx-chip">extraction v2.4.1</span>' },
      { who: 'Dana Voss', kind: 'human', ts: '8:29 AM', what: 'Corrected <b>Lot number</b>: <span class="old mono">A0412-BBC</span> \u2192 <span class="new mono">A0412-88C</span>.' },
      { who: 'Dana Voss', kind: 'human', ts: '8:30 AM', what: 'Reviewed and confirmed all extracted fields.' },
      { who: 'Dana Voss', kind: 'human', ts: '8:31 AM', what: 'Confirmed patient match \u2192 <b>Juniper</b> (MW-18450) \u00b7 3 agreeing keys.' }
    ]
  };

  /* ============================================================
     SCENARIO 3 — Partial extraction (page cap / noise) → untyped
     ============================================================ */
  var DOC_PARTIAL = {
    id: 'RD-8317',
    scenario: 'partial',
    sender: {
      name: 'Unknown sender', kind: 'Unsaved number', verified: false,
      fax: '(213) 555-0177', loc: '', contactSince: null
    },
    received: 'Today, 7:48 AM', channel: 'Fax', pages: 2, sizeKb: 1210,
    assignee: null,
    extraction: { model: 'extraction v2.4.1', ts: 'Today, 7:49 AM', calibration: 'cal-2026-06-28', prescreen: 'partial' },
    result: 'partial',
    banner: { kind: 'bad', html: '<b>Partial extraction.</b> Page 2 failed the legibility pre-screen (transmission noise) and was skipped. Nothing was auto-applied \u2014 confidence collapsed onto the safe path. Work it like a normal untyped document, or request a cleaner copy.' },

    tracks: [],
    suggestions: [],
    untyped: true,
    candidates: [],
    match: null,

    ties: { contact: 'Unknown sender', rows: [] },

    history: [
      { who: 'System', kind: 'sys', ts: '7:48 AM', what: 'Document received via fax from <b>(213) 555-0177</b> \u00b7 2 pages.' },
      { who: 'System', kind: 'sys', ts: '7:49 AM', what: 'Legibility pre-screen: page 1 passed, <b>page 2 failed</b> (noise). Extraction ran on legible pages only. <span class="hx-chip">extraction v2.4.1</span>' },
      { who: 'System', kind: 'sys', ts: '7:49 AM', what: 'No classification above threshold \u2014 document landed <b>untyped</b>. No fields applied.' }
    ]
  };

  return {
    docs: { referral: DOC_REFERRAL, vaccine: DOC_VACCINE, partial: DOC_PARTIAL },
    order: ['referral', 'vaccine', 'partial']
  };
})();
