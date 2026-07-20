/* ============================================================
   RobinDock — Task Detail / Fulfillment prototype · MOCK DATA
   The workhorse surface: a single claimed Task is worked to
   resolution. This file supplies, per Task:
     • identity         — type, Case, sender Contact, status, assignee
     • the document     — signalment + narrative the viewer renders
                          (the SAME data the stepper verifies, so the
                          document and the fields stay consistent)
     • the extraction   — pre-filled clinical fields + per-field
                          confidence (the AI proposed; the human
                          confirms). Lab carries a results[] array.
     • the match        — extracted identity hints (search pre-seed)
                          + candidate Patients in the receiver's own
                          records, including the near-duplicate case.

   Two state machines live here implicitly: Task work-state
   (proposed → open → in_progress → resolved + needs_review) and
   the per-field verified/edited record. Mock / prototype only.
   ============================================================ */
(function () {
  'use strict';

  /* current mock user + teammates (consistent with the app shell) */
  var ME = { key: 'me', name: 'Kai Sandoval', initials: 'KS', av: 'blue', role: 'Front desk' };
  var PEOPLE = {
    me:     ME,
    dana:   { key: 'dana',   name: 'Dana Whitfield', initials: 'DW', av: '',     role: 'Lab Results' },
    priya:  { key: 'priya',  name: 'Priya Raman',    initials: 'PR', av: 'aqua', role: 'Medical Records' },
    marcus: { key: 'marcus', name: 'Marcus Lee',     initials: 'ML', av: 'blue', role: 'Referrals' },
    renee:  { key: 'renee',  name: 'Renee Cole',     initials: 'RC', av: 'aqua', role: 'Lab Results' }
  };

  /* departments a Task can be re-homed into */
  var DEPTS = [
    { key: 'frontdesk', name: 'Front Desk' },
    { key: 'labs',      name: 'Lab Results' },
    { key: 'referrals', name: 'Referrals' },
    { key: 'records',   name: 'Medical Records' },
    { key: 'vaccines',  name: 'Vaccines' },
    { key: 'unclassified', name: 'Unclassified' }
  ];

  /* type metadata — badge class mirrors the queue (cases.css .tag.ty-*) */
  var TYPES = {
    referral: { label: 'Referral',      cls: 'ty-ref', dept: 'referrals' },
    lab:      { label: 'Lab Result',    cls: 'ty-lab', dept: 'labs' },
    records:  { label: 'Records',       cls: 'ty-rec', dept: 'records' },
    recreq:   { label: 'Records req',   cls: 'ty-req', dept: 'records' },
    vaccine:  { label: 'Vaccine',       cls: 'ty-vax', dept: 'vaccines' }
  };

  /* ============================================================
     PATIENT DIRECTORY — the receiver's OWN records.
     Patient matching searches against THIS. Note the two "Bella"s
     in different households (one Canine Labrador, one Feline DSH) —
     the near-duplicate disambiguation the match must make safe.
     ============================================================ */
  var PATIENTS = {
    'bella-marsh': {
      id: 'P-1009-2', name: 'Bella', species: 'Canine', breed: 'Labrador Retriever',
      sex: 'Female, spayed', age: '4 yr', color: 'Black',
      client: 'Marsh Household', clientId: 'CL-1009', owner: 'Rowan Marsh',
      phone: '(801) 555-0148', lastSeen: 'May 30, 2026', chip: '985 141 000 444 231'
    },
    'cooper-marsh': {
      id: 'P-1009-1', name: 'Cooper', species: 'Canine', breed: 'Australian Shepherd',
      sex: 'Male, neutered', age: '6 yr', color: 'Blue merle',
      client: 'Marsh Household', clientId: 'CL-1009', owner: 'Rowan Marsh',
      phone: '(801) 555-0148', lastSeen: 'Feb 11, 2026', chip: '985 141 000 401 882'
    },
    'bella-okafor': {
      id: 'P-1242-1', name: 'Bella', species: 'Feline', breed: 'Domestic Shorthair',
      sex: 'Female, spayed', age: '9 yr', color: 'Gray tabby',
      client: 'Okafor Household', clientId: 'CL-1242', owner: 'Amara Okafor',
      phone: '(385) 555-0613', lastSeen: 'Jan 24, 2026', chip: '985 112 000 778 540'
    },
    'max-whitman': {
      id: 'P-1118-1', name: 'Max', species: 'Canine', breed: 'Beagle',
      sex: 'Male, neutered', age: '7 yr', color: 'Tricolor',
      client: 'Whitman Household', clientId: 'CL-1118', owner: 'Joelle Whitman',
      phone: '(801) 555-0207', lastSeen: 'Apr 2, 2026', chip: '985 141 000 552 117'
    },
    'luna-okafor': {
      id: 'P-1242-2', name: 'Luna', species: 'Feline', breed: 'Siamese',
      sex: 'Female, spayed', age: '3 yr', color: 'Seal point',
      client: 'Okafor Household', clientId: 'CL-1242', owner: 'Amara Okafor',
      phone: '(385) 555-0613', lastSeen: 'Mar 19, 2026', chip: '985 112 000 778 661'
    }
  };

  /* candidate set for a search — ids in directory + match-quality hints.
     strong = identity hints corroborate (species/breed/owner align).
     conflict = already bound elsewhere; surface, never clobber. */
  function cand(id, opts) { opts = opts || {}; return { id: id, strong: !!opts.strong, weak: !!opts.weak, conflict: opts.conflict || null }; }

  /* ============================================================
     TASKS
     ============================================================ */
  var TASKS = {

    /* ---- SHOWCASE: lab result with a CRITICAL value (deep stepper) ---- */
    'T-3061-L': {
      id: 'T-3061-L', type: 'lab', title: 'CBC + Superchem panel',
      caseId: 'C-3061', caseSubject: 'Orthopedic consult — left stifle',
      status: 'in_progress', assignee: 'me', dept: 'labs',
      arrivedH: 1, conf: 'high',
      sender: { name: 'IDEXX Reference Lab', kind: 'lab', loc: 'Salt Lake City, UT', channel: 'fax', faxNo: '(888) 433-9987' },
      totalPages: 3, relevantPages: [1, 2],
      crit: { analyte: 'Potassium', sym: 'K\u207A', val: '8.9', unit: 'mmol/L', dir: 'high', range: '3.5 \u2013 5.8' },
      hints: { name: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'R. Marsh', phone: '(801) 555-0148' },
      candidates: [ cand('bella-marsh', { strong: true }), cand('bella-okafor', { weak: true }), cand('cooper-marsh', { weak: true }) ],
      newClient: { client: 'Marsh Household', clientId: 'CL-1009' },
      signalment: { patient: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'Rowan Marsh', specimen: 'Serum', weight: '28.4 kg' },
      labHeader: [
        { key: 'ordering_provider', label: 'Ordering provider', value: '', conf: 'low', nullable: true, ph: 'Not printed on report' },
        { key: 'performing_lab', label: 'Performing lab', value: 'IDEXX Reference Laboratories', conf: 'high' },
        { key: 'accession_number', label: 'Accession #', value: 'A4471902', conf: 'high', mono: true },
        { key: 'specimen_type', label: 'Specimen', value: 'Serum, lithium heparin', conf: 'med', nullable: true },
        { key: 'collected_at', label: 'Collected', value: 'Jun 11, 2026 · 7:40 AM', conf: 'high', nullable: true },
        { key: 'received_at', label: 'Received', value: 'Jun 11, 2026 · 2:05 PM', conf: 'med', nullable: true },
        { key: 'reported_at', label: 'Reported', value: 'Jun 12, 2026 · 8:12 AM', conf: 'high' },
        { key: 'panel_name', label: 'Panel', value: 'CBC + Superchem', conf: 'high' }
      ],
      results: [
        { analyte: 'Potassium', value: '8.9', unit: 'mmol/L', range: '3.5 \u2013 5.8', flag: 'critical', panel: 'Chemistry' },
        { analyte: 'ALT', value: '142', unit: 'U/L', range: '10 \u2013 125', flag: 'high', panel: 'Chemistry' },
        { analyte: 'BUN', value: '34', unit: 'mg/dL', range: '7 \u2013 27', flag: 'high', panel: 'Chemistry' },
        { analyte: 'Creatinine', value: '1.6', unit: 'mg/dL', range: '0.5 \u2013 1.8', flag: 'normal', panel: 'Chemistry' },
        { analyte: 'ALKP', value: '96', unit: 'U/L', range: '23 \u2013 212', flag: 'normal', panel: 'Chemistry' },
        { analyte: 'Glucose', value: '104', unit: 'mg/dL', range: '74 \u2013 143', flag: 'normal', panel: 'Chemistry' },
        { analyte: 'Total protein', value: '6.4', unit: 'g/dL', range: '5.2 \u2013 8.2', flag: 'normal', panel: 'Chemistry' },
        { analyte: 'WBC', value: '15.8', unit: '\u00D710\u2079/L', range: '4.0 \u2013 15.5', flag: 'high', panel: 'Hematology' },
        { analyte: 'HCT', value: '38', unit: '%', range: '37 \u2013 55', flag: 'normal', panel: 'Hematology' },
        { analyte: 'Platelets', value: '312', unit: '\u00D710\u2079/L', range: '200 \u2013 500', flag: 'normal', panel: 'Hematology' }
      ],
      interpretation: 'Marked hyperkalemia\u2014verify against clinical signs and repeat if EDTA contamination suspected. Mild hepatocellular pattern with azotemia. Recommend correlation with presentation and recheck in 2\u20133 weeks. Hemolysis index within acceptable limits.'
    },

    /* ---- referral (medium / selective stepper) ---- */
    'T-3061-R': {
      id: 'T-3061-R', type: 'referral', title: 'Orthopedic referral — left stifle',
      caseId: 'C-3061', caseSubject: 'Orthopedic consult — left stifle',
      status: 'in_progress', assignee: 'me', dept: 'referrals',
      arrivedH: 5, conf: 'high',
      sender: { name: 'Mountain West Vet Specialists', kind: 'spec', loc: 'Murray, UT', channel: 'fax', faxNo: '(801) 262-5200' },
      totalPages: 4, relevantPages: [1, 2],
      hints: { name: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'R. Marsh', phone: '(801) 555-0148' },
      candidates: [ cand('bella-marsh', { strong: true }), cand('bella-okafor', { weak: true }), cand('cooper-marsh', { weak: true }) ],
      newClient: { client: 'Marsh Household', clientId: 'CL-1009' },
      signalment: { patient: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'Rowan Marsh', dvm: 'Elena Ortiz, DVM', weight: '28.4 kg' },
      referral: [
        { key: 'referred_to_specialty', label: 'Referred-to specialty', value: 'Surgery', conf: 'high', kind: 'enum',
          options: ['Internal Medicine', 'Surgery', 'Cardiology', 'Oncology', 'Dermatology', 'Neurology', 'Ophthalmology', 'ER', 'Imaging', 'Rehab', 'Behavior', 'Other'] },
        { key: 'urgency', label: 'Urgency', value: 'routine', conf: 'high', kind: 'enum', options: ['routine', 'urgent', 'emergent'] },
        { key: 'requested_service', label: 'Requested service', value: 'TPLO surgical consult & estimate', conf: 'high', kind: 'text' },
        { key: 'chief_complaint', label: 'Chief complaint', value: 'Left hind-limb lameness, 3 weeks', conf: 'high', kind: 'text' },
        { key: 'reason_for_referral', label: 'Reason for referral', value: 'Referring for surgical evaluation of suspected cranial cruciate ligament rupture of the left stifle. Conservative management trialed without sustained improvement; owner elects to pursue surgical options.', conf: 'high', kind: 'long' },
        { key: 'clinical_history', label: 'Clinical history', value: 'Acute onset non-weight-bearing lameness after off-leash exercise. Partial response to rest + NSAIDs over 2 weeks, recurrent on return to activity.', conf: 'med', kind: 'long' },
        { key: 'physical_findings', label: 'Physical findings', value: '', conf: 'low', kind: 'long', ph: 'Sparse in document \u2014 read pg. 2 and complete' },
        { key: 'tentative_diagnosis', label: 'Tentative diagnosis', value: 'Cranial cruciate ligament rupture (L), R/O meniscal injury', conf: 'high', kind: 'text' },
        { key: 'current_medications', label: 'Current medications', value: 'Carprofen 75 mg PO BID; Gabapentin 100 mg PO BID', conf: 'med', kind: 'long' },
        { key: 'weight', label: 'Weight (as printed)', value: '28.4 kg (62.6 lb)', conf: 'high', kind: 'text' },
        { key: 'vaccine_status', label: 'Vaccine status', value: 'Current', conf: 'med', kind: 'text' },
        { key: 'rabies_date', label: 'Rabies date', value: 'Mar 12, 2025', conf: 'high', kind: 'date', xref: 'Vaccine cert · T-2904-V' },
        { key: 'radiographs_with_client', label: 'Films sent with owner', value: true, conf: 'high', kind: 'bool' },
        { key: 'preferred_contact_method', label: 'Preferred contact', value: 'fax', conf: 'low', kind: 'enum', options: ['phone', 'fax', 'email', 'mail'] },
        { key: 'call_client_to_schedule', label: 'Call client to schedule', value: true, conf: 'med', kind: 'bool' }
      ],
      narrative: {
        reason: 'I am referring Bella, a 4-year-old female spayed Labrador Retriever, for surgical evaluation of a suspected cranial cruciate ligament rupture of the left stifle. Conservative management has been trialed without sustained improvement.',
        history: 'Acute onset non-weight-bearing lameness following off-leash exercise three weeks ago. Partial response to rest and carprofen, with recurrence on return to normal activity.',
        requested: 'TPLO surgical consult and estimate. Radiographs of the left stifle were taken and sent home with the owner. Prior records and lab work attached.'
      }
    },

    /* ---- BATCH lab for several animals → demonstrates the fork ---- */
    'T-2987-LB': {
      id: 'T-2987-LB', type: 'lab', title: 'Heartworm/Tick panel — 3 patients',
      caseId: 'C-2987', caseSubject: 'Annual screening — Okafor household',
      status: 'in_progress', assignee: 'me', dept: 'labs',
      arrivedH: 3, conf: 'high', batch: true,
      sender: { name: 'IDEXX Reference Lab', kind: 'lab', loc: 'Salt Lake City, UT', channel: 'fax', faxNo: '(888) 433-9987' },
      totalPages: 3, relevantPages: [1, 2, 3],
      hints: { name: 'Luna', species: 'Feline', breed: 'Siamese', owner: 'A. Okafor', phone: '(385) 555-0613' },
      candidates: [ cand('luna-okafor', { strong: true }), cand('bella-okafor', { weak: true }) ],
      newClient: { client: 'Okafor Household', clientId: 'CL-1242' },
      batchPatients: [
        { hints: { name: 'Luna', species: 'Feline' }, id: 'luna-okafor', page: 1 },
        { hints: { name: 'Bella', species: 'Feline' }, id: 'bella-okafor', page: 2 },
        { hints: { name: 'Cooper', species: 'Canine' }, id: 'cooper-marsh', page: 3 }
      ],
      signalment: { patient: 'Luna', species: 'Feline', breed: 'Siamese', owner: 'Amara Okafor', specimen: 'Serum', weight: '4.1 kg' },
      labHeader: [
        { key: 'performing_lab', label: 'Performing lab', value: 'IDEXX Reference Laboratories', conf: 'high' },
        { key: 'accession_number', label: 'Accession #', value: 'A4470088', conf: 'high', mono: true },
        { key: 'specimen_type', label: 'Specimen', value: 'Serum', conf: 'high', nullable: true },
        { key: 'reported_at', label: 'Reported', value: 'Jun 12, 2026 · 6:50 AM', conf: 'high' },
        { key: 'panel_name', label: 'Panel', value: '4Dx Plus + Chem', conf: 'high' }
      ],
      results: [
        { analyte: 'Heartworm Ag', value: 'Negative', unit: '', range: 'Negative', flag: 'normal', panel: '4Dx' },
        { analyte: 'Lyme C6', value: 'Negative', unit: '', range: 'Negative', flag: 'normal', panel: '4Dx' },
        { analyte: 'Anaplasma', value: 'Negative', unit: '', range: 'Negative', flag: 'normal', panel: '4Dx' },
        { analyte: 'Ehrlichia', value: '\u226537', unit: 'titer', range: '< 20', flag: 'high', panel: '4Dx' },
        { analyte: 'Glucose', value: '98', unit: 'mg/dL', range: '74 \u2013 159', flag: 'normal', panel: 'Chemistry' }
      ],
      interpretation: 'Positive Ehrlichia titer (\u226537) on patient 1 of 3 \u2014 recommend confirmatory testing. Remaining analytes within reference limits.'
    },

    /* ---- RESOLVED task — read-only review + reopen ---- */
    'T-2904-V': {
      id: 'T-2904-V', type: 'vaccine', title: 'Rabies certificate — boarding',
      caseId: 'C-2904', caseSubject: 'Vaccination update — Rabies, DHPP',
      status: 'resolved', assignee: 'priya', resolvedBy: 'priya', resolvedAt: 'Jun 10, 2026 · 11:24 AM', dept: 'vaccines',
      arrivedH: 30, conf: 'high',
      sender: { name: 'Bark City Veterinary', kind: 'gp', loc: 'Park City, UT', channel: 'fax', faxNo: '(435) 555-0110' },
      totalPages: 1, relevantPages: [1],
      hints: { name: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'R. Marsh', phone: '(801) 555-0148' },
      candidates: [ cand('bella-marsh', { strong: true }) ],
      matched: 'bella-marsh',
      newClient: { client: 'Marsh Household', clientId: 'CL-1009' },
      signalment: { patient: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'Rowan Marsh', weight: '28.0 kg' },
      vaccine: [
        { key: 'vaccine', label: 'Vaccine', value: 'Rabies (3-yr) · IMRAB 3', conf: 'high', kind: 'text' },
        { key: 'rabies_date', label: 'Rabies date', value: 'Mar 12, 2025', conf: 'high', kind: 'date' },
        { key: 'expires', label: 'Expires', value: 'Mar 12, 2028', conf: 'high', kind: 'date' },
        { key: 'lot', label: 'Lot #', value: 'K3441', conf: 'med', kind: 'text', mono: true },
        { key: 'tag', label: 'Rabies tag', value: 'RB-2026114', conf: 'high', kind: 'text', mono: true }
      ]
    },

    /* ---- RACED — claimed by someone else (not the working surface) ---- */
    'T-3120-IMG': {
      id: 'T-3120-IMG', type: 'records', title: 'Radiology report — left stifle',
      caseId: 'C-3120', caseSubject: 'Hip x-ray review',
      status: 'claimed', claimedBy: 'dana', claimedAt: '6 min ago', dept: 'records',
      arrivedH: 2, conf: 'high',
      sender: { name: 'Wasatch Imaging', kind: 'img', loc: 'Salt Lake City, UT', channel: 'fax', faxNo: '(801) 484-7100' },
      totalPages: 2, relevantPages: [1],
      hints: { name: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'R. Marsh' },
      candidates: [ cand('bella-marsh', { strong: true }) ]
    },

    /* ---- UNREADABLE arrival → needs_review path ---- */
    'T-2950-UN': {
      id: 'T-2950-UN', type: 'records', title: 'Inbound fax — 3 pages',
      caseId: 'C-2950', caseSubject: 'Unidentified transmission',
      status: 'in_progress', assignee: 'me', dept: 'frontdesk',
      arrivedH: 6, conf: 'low', unreadable: true,
      sender: { name: 'Unknown sender', kind: 'unk', loc: '', channel: 'fax', faxNo: '(307) 555-0190' },
      totalPages: 3, relevantPages: [],
      hints: {},
      candidates: []
    },

    /* ---- in_progress fixtures opened by TYPE from the department queue ---- */
    'T-DEPT-REC': {
      id: 'T-DEPT-REC', type: 'records', title: 'Medical records — history transfer',
      caseId: 'C-3140', caseSubject: 'Records transfer', status: 'in_progress', assignee: 'me', dept: 'records',
      arrivedH: 9, conf: 'high',
      sender: { name: 'Bark City Veterinary', kind: 'gp', loc: 'Park City, UT', channel: 'fax', faxNo: '(435) 555-0110' },
      totalPages: 5, relevantPages: [1, 2],
      hints: { name: 'Max', species: 'Canine', breed: 'Beagle', owner: 'J. Whitman', phone: '(801) 555-0207' },
      candidates: [ cand('max-whitman', { strong: true }) ],
      newClient: { client: 'Whitman Household', clientId: 'CL-1118' },
      signalment: { patient: 'Max', species: 'Canine', breed: 'Beagle', owner: 'Joelle Whitman', weight: '12.2 kg' },
      records: []
    },
    'T-DEPT-REQ': {
      id: 'T-DEPT-REQ', type: 'recreq', title: 'Records request — full history',
      caseId: 'C-3145', caseSubject: 'Records request', status: 'in_progress', assignee: 'me', dept: 'records',
      arrivedH: 4, conf: 'high',
      sender: { name: 'Mountain West Vet Specialists', kind: 'spec', loc: 'Murray, UT', channel: 'fax', faxNo: '(801) 262-5200' },
      totalPages: 2, relevantPages: [1],
      hints: { name: 'Max', species: 'Canine', breed: 'Beagle', owner: 'J. Whitman' },
      candidates: [ cand('max-whitman', { strong: true }) ],
      newClient: { client: 'Whitman Household', clientId: 'CL-1118' },
      signalment: { patient: 'Max', species: 'Canine', breed: 'Beagle', owner: 'Joelle Whitman' },
      records: [
        { key: 'respond_by', label: 'Respond by', value: 'Jun 21, 2026', conf: 'high', kind: 'date' },
        { key: 'records_requested', label: 'Records requested', value: 'Complete medical record \u2014 last 24 months', conf: 'high', kind: 'long' },
        { key: 'authorization', label: 'Owner authorization', value: 'Signed release on file', conf: 'med', kind: 'text' }
      ]
    },
    'T-DEPT-VAX': {
      id: 'T-DEPT-VAX', type: 'vaccine', title: 'Rabies certificate — boarding',
      caseId: 'C-3150', caseSubject: 'Vaccine verification', status: 'in_progress', assignee: 'me', dept: 'vaccines',
      arrivedH: 2, conf: 'high',
      sender: { name: 'Owner upload', kind: 'upl', loc: '', channel: 'upload', faxNo: '' },
      totalPages: 1, relevantPages: [1],
      hints: { name: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'R. Marsh' },
      candidates: [ cand('bella-marsh', { strong: true }), cand('bella-okafor', { weak: true }) ],
      newClient: { client: 'Marsh Household', clientId: 'CL-1009' },
      signalment: { patient: 'Bella', species: 'Canine', breed: 'Labrador Retriever', owner: 'Rowan Marsh', weight: '28.0 kg' },
      vaccine: [
        { key: 'vaccine', label: 'Vaccine', value: 'Rabies (3-yr) \u00b7 IMRAB 3', conf: 'high', kind: 'text' },
        { key: 'rabies_date', label: 'Rabies date', value: 'Mar 12, 2025', conf: 'high', kind: 'date' },
        { key: 'expires', label: 'Expires', value: 'Mar 12, 2028', conf: 'high', kind: 'date' },
        { key: 'lot', label: 'Lot #', value: 'K3441', conf: 'med', kind: 'text', mono: true },
        { key: 'tag', label: 'Rabies tag', value: 'RB-2026114', conf: 'high', kind: 'text', mono: true }
      ]
    }
  };

  /* order shown in the prototype task-switcher */
  var TASK_ORDER = ['T-3061-L', 'T-3061-R', 'T-2987-LB', 'T-2904-V', 'T-3120-IMG', 'T-2950-UN'];

  window.RD_FULFILL = {
    ME: ME, PEOPLE: PEOPLE, DEPTS: DEPTS, TYPES: TYPES,
    PATIENTS: PATIENTS, TASKS: TASKS, TASK_ORDER: TASK_ORDER
  };
})();
