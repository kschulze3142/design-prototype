/* ============================================================
   RobinDock — Composer (Create & Send) prototype · MOCK DATA
   The outbound surface: select a template → quick-edit → preview
   → send a document to a Contact. Built around a template library;
   the REFERRAL LETTER is the keystone, pre-filling from the
   confirmed referral Task fields (A1 referral extension).

   Pre-fill uses CONFIRMED data — the values a human verified at
   fulfillment — not the raw AI proposal. Send is faked; PHI egress
   is represented by an "Access logged" indicator. "Today" ≈ 2026-06-15.
   ============================================================ */
(function () {
  'use strict';

  /* ---- the sending org (letterhead) + the person composing ---- */
  var PRACTICE = {
    name: 'Mountain West Veterinary',
    line: 'General & Companion Animal Practice',
    addr: '1840 S Foothill Dr, Salt Lake City, UT 84108',
    fax: '(801) 262-5188', phone: '(801) 262-5180',
    dvm: 'Elena Ortiz, DVM', license: 'UT-VET-04417'
  };
  var ME = { name: 'Kai Sandoval', initials: 'KS', role: 'Front desk', dept: 'Mountain West' };

  /* roles permitted to send outbound (PHI egress is role-gated, §7) */
  var CAN_SEND = true;

  /* checklist option sets reused across record templates */
  var RECORD_KINDS = ['Visit history', 'Vaccine records', 'Lab results', 'Imaging / radiographs', 'Medication list', 'Problem list'];

  /* ============================================================
     TEMPLATE LIBRARY — small hard-coded v1 set (§3).
     Each template: id, name, purpose, glyph, blurb, the field
     list (grouped), and a `render` kind the preview switches on.
     field: { key, label, kind, group, options?, ph?, prefill? }
       kind: text | long | enum | date | bool | checklist
     ============================================================ */
  var TEMPLATES = [
    {
      id: 'referral', name: 'Referral letter', purpose: 'Refer a patient to a specialist or ER',
      glyph: 'ref', keystone: true,
      blurb: 'The keystone outbound. Pre-fills from the confirmed referral Task — review and send.',
      groups: [
        { id: 'patient', label: 'Patient & client' },
        { id: 'clinical', label: 'Clinical detail' }
      ],
      fields: [
        { key: 'patient', label: 'Patient', kind: 'text', group: 'patient', prefill: true },
        { key: 'species', label: 'Species', kind: 'text', group: 'patient', prefill: true },
        { key: 'breed', label: 'Breed', kind: 'text', group: 'patient', prefill: true },
        { key: 'owner', label: 'Owner', kind: 'text', group: 'patient', prefill: true },
        { key: 'weight', label: 'Weight (as recorded)', kind: 'text', group: 'patient', prefill: true },
        { key: 'referred_to_specialty', label: 'Referred-to specialty', kind: 'enum', group: 'clinical', prefill: true,
          options: ['Internal Medicine', 'Surgery', 'Cardiology', 'Oncology', 'Dermatology', 'Neurology', 'Ophthalmology', 'ER', 'Imaging', 'Rehab', 'Behavior', 'Other'] },
        { key: 'urgency', label: 'Urgency', kind: 'enum', group: 'clinical', prefill: true,
          options: ['routine', 'urgent', 'emergent'] },
        { key: 'requested_service', label: 'Requested service', kind: 'text', group: 'clinical', prefill: true },
        { key: 'chief_complaint', label: 'Chief complaint', kind: 'text', group: 'clinical', prefill: true },
        { key: 'reason_for_referral', label: 'Reason for referral', kind: 'long', group: 'clinical', prefill: true },
        { key: 'clinical_history', label: 'Clinical history', kind: 'long', group: 'clinical', prefill: true },
        { key: 'physical_findings', label: 'Physical findings', kind: 'long', group: 'clinical', prefill: true,
          ph: 'Sparse in source — read the chart and complete before sending' },
        { key: 'tentative_diagnosis', label: 'Tentative diagnosis', kind: 'text', group: 'clinical', prefill: true },
        { key: 'current_medications', label: 'Current medications', kind: 'long', group: 'clinical', prefill: true },
        { key: 'vaccine_status', label: 'Vaccine status', kind: 'text', group: 'clinical', prefill: true },
        { key: 'rabies_date', label: 'Rabies date', kind: 'date', group: 'clinical', prefill: true }
      ]
    },
    {
      id: 'records-cover', name: 'Records cover letter', purpose: 'Send records with a cover page',
      glyph: 'rec',
      blurb: 'A cover letter for a records packet you are sending out.',
      groups: [{ id: 'main', label: 'Records' }],
      fields: [
        { key: 'patient', label: 'Patient', kind: 'text', group: 'main' },
        { key: 'enclosed', label: 'Records enclosed', kind: 'checklist', group: 'main', options: RECORD_KINDS },
        { key: 'date_range', label: 'Date range', kind: 'text', group: 'main', ph: 'e.g. last 24 months' },
        { key: 'note', label: 'Cover note', kind: 'long', group: 'main', ph: 'Optional message to the recipient' }
      ]
    },
    {
      id: 'records-request', name: 'Records request', purpose: 'Request records from another practice',
      glyph: 'req',
      blurb: 'Ask another practice or facility to send records to us.',
      groups: [{ id: 'main', label: 'Request' }],
      fields: [
        { key: 'patient', label: 'Patient', kind: 'text', group: 'main' },
        { key: 'records_requested', label: 'Records requested', kind: 'checklist', group: 'main', options: RECORD_KINDS },
        { key: 'date_range', label: 'Date range', kind: 'text', group: 'main', ph: 'e.g. complete history' },
        { key: 'authorization', label: 'Owner authorization', kind: 'enum', group: 'main',
          options: ['Signed release on file', 'Verbal consent', 'Authorization pending'] },
        { key: 'respond_by', label: 'Respond by', kind: 'date', group: 'main' }
      ]
    },
    {
      id: 'fax-cover', name: 'General fax cover', purpose: 'A plain cover sheet for any fax',
      glyph: 'fax',
      blurb: 'A simple cover sheet — to, from, pages, and a short message.',
      groups: [{ id: 'main', label: 'Cover sheet' }],
      fields: [
        { key: 're', label: 'Regarding', kind: 'text', group: 'main', ph: 'Subject of this fax' },
        { key: 'pages', label: 'Total pages (incl. cover)', kind: 'text', group: 'main', ph: 'e.g. 3' },
        { key: 'message', label: 'Message', kind: 'long', group: 'main', ph: 'Your message to the recipient' },
        { key: 'urgent', label: 'Mark urgent', kind: 'bool', group: 'main' }
      ]
    }
  ];

  /* ============================================================
     REPLY / IN-CONTEXT — the highest-value path (§2).
     Composed from Case C-3061. The referral letter pre-fills from
     the CONFIRMED referral Task (T-3061-R) the worker verified.
     `sources` marks where each value came from:
       task  → confirmed Task field (pre-filled, verified)
       blank → no confirmed source; flagged for the user (§8)
     Recipient is the Case's Contact (Mountain West Veterinary
     Specialists) — resolved by name from the Contacts directory.
     ============================================================ */
  var REPLY = {
    caseId: 'C-3061', caseSubject: 'Orthopedic consult — left stifle',
    taskId: 'T-3061-R', taskTitle: 'Outbound referral — left stifle',
    recipientName: 'Mountain West Veterinary Specialists',
    template: 'referral',
    patient: { name: 'Bella', species: 'Canine', breed: 'Labrador Retriever' },
    client: 'Marsh Household', clientId: 'CL-1009',
    values: {
      patient: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'Rowan Marsh',
      weight: '28.4 kg (62.6 lb)',
      referred_to_specialty: 'Surgery', urgency: 'routine',
      requested_service: 'TPLO surgical consult & estimate',
      chief_complaint: 'Left hind-limb lameness, 3 weeks',
      reason_for_referral: 'Referring for surgical evaluation of suspected cranial cruciate ligament rupture of the left stifle. Conservative management trialed without sustained improvement; owner elects to pursue surgical options.',
      clinical_history: 'Acute onset non-weight-bearing lameness after off-leash exercise. Partial response to rest + NSAIDs over 2 weeks, recurrent on return to activity.',
      physical_findings: '',
      tentative_diagnosis: 'Cranial cruciate ligament rupture (L), R/O meniscal injury',
      current_medications: 'Carprofen 75 mg PO BID; Gabapentin 100 mg PO BID',
      vaccine_status: 'Current',
      rabies_date: 'Mar 12, 2025'
    },
    sources: {
      patient: 'task', species: 'task', breed: 'task', owner: 'task', weight: 'task',
      referred_to_specialty: 'task', urgency: 'task', requested_service: 'task',
      chief_complaint: 'task', reason_for_referral: 'task', clinical_history: 'task',
      physical_findings: 'blank', tentative_diagnosis: 'task',
      current_medications: 'task', vaccine_status: 'task', rabies_date: 'task'
    },
    /* attachments riding along with the letter — feeds the page count (§8) */
    attachments: [
      { name: 'Pre-referral history + exam notes', pages: 4, type: 'records' },
      { name: 'Stifle radiograph series', pages: 6, type: 'imaging' },
      { name: 'Pre-op CBC + Chemistry panel', pages: 2, type: 'lab' }
    ]
  };

  window.RD_COMPOSE = {
    PRACTICE: PRACTICE, ME: ME, CAN_SEND: CAN_SEND,
    TEMPLATES: TEMPLATES, REPLY: REPLY, RECORD_KINDS: RECORD_KINDS
  };
})();
