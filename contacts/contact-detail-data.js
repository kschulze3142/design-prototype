/* ============================================================
   RobinDock — Contact Detail · MOCK DATA
   The exchange relationship for a single external Contact:
     • EXCHANGE — the PHI section. Documents/cases exchanged with
       this Contact (inbound received / outbound sent), each row
       carrying the patient(s)/client involved + status (§6).
     • NOTES / PEOPLE / ADDED — business-directory context (§4).
     • NEW_CONTACT — a synthetic just-added Contact with no
       exchange history yet (empty-state scenario, §6/§9).
     • SCENARIOS — the prototype switcher's edge-case roster (§9).

   Contact business fields come from contacts-data.js (RD_CONTACTS
   / RD_UNIDENTIFIED). This file adds only the exchange substance.
   Mock only. "Today" ≈ 2026-06-11.
   ============================================================ */
(function () {
  'use strict';

  function P(name, species) { return { name: name, species: species || '' }; }
  /* row(case, dir, subject, patients[], client, dateISO, status, kind, flock)
       dir    'in'  = received from this Contact (inbound)
              'out' = sent to this Contact (outbound)
       status 'new' | 'open' | 'inprog' | 'complete' | 'archived'
       kind   'ref' | 'consult' | 'surg' | 'lab' | 'img' | 'rec'  (tile flavor)
       flock  arrived/sent over the network (on-network edge) */
  function row(id, dir, subject, patients, client, date, status, kind, flock) {
    return {
      id: id, dir: dir, subject: subject, patients: patients,
      client: client, date: date, status: status, kind: kind || 'rec', flock: !!flock
    };
  }

  var EXCHANGE = {
    /* ---- CT-007 · Mountain West Veterinary Specialists (specialty, on-network) ----
       A specialist you refer TO: you send referrals + records, they send
       consult/surgical reports back. Mixed, leans inbound. Some via Flock. */
    'CT-007': [
      row('CASE-1187', 'in',  'Cardiology consult — recheck summary',        [P('Bella', 'Canine')],  'Martinez household', '2026-06-11', 'complete', 'consult', true),
      row('CASE-1190', 'out', 'Referral — suspected mitral valve disease',    [P('Cooper', 'Canine')], 'Nguyen household',   '2026-06-10', 'open',     'ref',     true),
      row('CASE-1184', 'in',  'Echocardiogram results + interpretation',      [P('Cooper', 'Canine')], 'Nguyen household',   '2026-06-09', 'inprog',   'img',     true),
      row('CASE-1171', 'out', 'Referral — TPLO evaluation, left stifle',      [P('Max', 'Canine')],    'Thompson household', '2026-06-06', 'open',     'ref',     false),
      row('CASE-1168', 'in',  'Surgical report — TPLO, left stifle',          [P('Max', 'Canine')],    'Thompson household', '2026-06-05', 'complete', 'surg',    false),
      row('CASE-1155', 'in',  'Oncology consult — lymphoma staging',          [P('Luna', 'Feline')],   'Patel household',    '2026-06-03', 'complete', 'consult', true),
      row('CASE-1149', 'out', 'Records package — pre-referral history',       [P('Daisy', 'Canine')],  'Romero household',   '2026-05-30', 'complete', 'rec',     false),
      row('CASE-1132', 'in',  'Recheck summary — cardiology',                 [P('Bella', 'Canine')],  'Martinez household', '2026-05-28', 'archived', 'consult', false)
    ],

    /* ---- CT-011 · Mountain West Animal ER (ER, on-network, 2 fax numbers) ----
       After-hours ER: mostly inbound — they treat your patients overnight
       and send records the next morning. */
    'CT-011': [
      row('CASE-1192', 'in',  'ER visit summary — overnight, GDV',            [P('Rocky', 'Canine')],  'Sanderson household', '2026-06-11', 'complete', 'rec', true),
      row('CASE-1189', 'in',  'ER discharge — laceration repair',             [P('Olive', 'Feline')],  'Brooks household',    '2026-06-10', 'complete', 'rec', false),
      row('CASE-1181', 'in',  'ER records — toxin ingestion (chocolate)',     [P('Milo', 'Canine')],   'Garcia household',    '2026-06-08', 'inprog',   'rec', false),
      row('CASE-1176', 'out', 'Records request — prior bloodwork',            [P('Milo', 'Canine')],   'Garcia household',    '2026-06-08', 'complete', 'rec', false),
      row('CASE-1163', 'in',  'ER visit summary — heat exhaustion',           [P('Ruby', 'Canine')],   'Chen household',      '2026-06-04', 'archived', 'rec', false),
      row('CASE-1140', 'in',  'ER discharge — seizure observation',           [P('Bella', 'Canine')],  'Martinez household',  '2026-05-27', 'complete', 'rec', false)
    ],

    /* ---- CT-002 · Valley Veterinary Clinic (referring GP, off-network) ----
       A referring GP: they send referrals in, you return discharge/consult
       summaries. Fax only — no Flock. */
    'CT-002': [
      row('CASE-1185', 'in',  'Referral — chronic ear infection',            [P('Charlie', 'Canine')], 'Kim household',    '2026-06-09', 'open',     'ref', false),
      row('CASE-1178', 'out', 'Consult summary — returned to GP',            [P('Charlie', 'Canine')], 'Kim household',    '2026-06-09', 'inprog',   'rec', false),
      row('CASE-1160', 'in',  'Referral — dental extraction eval',           [P('Daisy', 'Canine')],   'Romero household', '2026-06-02', 'complete', 'ref', false),
      row('CASE-1145', 'out', 'Discharge summary — post-op dental',          [P('Daisy', 'Canine')],   'Romero household', '2026-05-29', 'complete', 'rec', false),
      row('CASE-1120', 'in',  'Vaccine history request',                     [P('Luna', 'Feline')],    'Patel household',  '2026-05-20', 'archived', 'rec', false)
    ],

    /* ---- CT-006 · Wasatch Companion Care (GP, INACTIVE) ----
       Relationship gone quiet — last exchange January. All archived. */
    'CT-006': [
      row('CASE-0921', 'in',  'Referral — chronic limping eval',             [P('Buddy', 'Canine')], 'Alvarez household', '2026-01-22', 'archived', 'ref', false),
      row('CASE-0915', 'out', 'Discharge summary — orthopedic',              [P('Buddy', 'Canine')], 'Alvarez household', '2026-01-20', 'archived', 'rec', false),
      row('CASE-0902', 'in',  'Records transfer — established patient',      [P('Penny', 'Feline')], 'Wong household',    '2026-01-08', 'archived', 'rec', false)
    ],

    /* ---- UN-001 · Unidentified node (385) 555-0521 (§7) ----
       Auto-created by ingress. All inbound. The exchange history is
       already populated — it's the EVIDENCE of the relationship — even
       though nobody has named the sender. Some patients matched at
       triage, some still unmatched. */
    'UN-001': [
      row('CASE-1191', 'in', 'Referral cover sheet — orthopedic',           [P('Shadow', 'Canine')],          '—', '2026-06-11', 'new',    'ref', false),
      row('CASE-1186', 'in', 'Referral cover sheet — dermatology',          [P('Unmatched patient', '')],     '—', '2026-06-07', 'new',    'ref', false),
      row('CASE-1175', 'in', 'Cover sheet + records (12 pp)',               [P('Hazel', 'Feline')],           '—', '2026-06-04', 'review', 'rec', false),
      row('CASE-1158', 'in', 'Referral cover sheet',                        [P('Unmatched patient', '')],     '—', '2026-06-01', 'review', 'ref', false),
      row('CASE-1141', 'in', 'Cover sheet — consult request',               [P('Bear', 'Canine')],            '—', '2026-05-29', 'new',    'ref', false)
    ]
  };

  /* ---- operational notes (business-directory; not clinical, §4) ---- */
  var NOTES = {
    'CT-007': 'Referral coordinator: Dana Whitfield. Sends consult reports as single combined PDFs — typical turnaround ~2 business days.',
    'CT-011': 'After-hours line; records usually arrive the next morning. (801) 555-0911 is the main line, (801) 555-0912 is the records desk.',
    'CT-002': 'Dr. Alan Pierce refers ortho and dental. Prefers a faxed discharge summary on return.',
    'CT-006': '',
    'CT-NEW': ''
  };

  /* ---- people within an org (entity-granularity OPEN ITEM, §4) ----
     Surfaced only where individuals are known. Whether a Contact is an
     org or a person-at-org is unresolved — shown here as a sub-section
     pending the hub-shadowing decision. */
  var PEOPLE = {
    'CT-007': [
      { name: 'Dr. Elena Ruiz', cred: 'DVM, DACVIM', role: 'Cardiology' },
      { name: 'Dr. Sam Okafor', cred: 'DVM, DACVIM', role: 'Oncology' },
      { name: 'Dana Whitfield', cred: '', role: 'Referral coordinator' }
    ],
    'CT-011': [
      { name: 'Dr. Priya Raman', cred: 'DVM', role: 'Emergency lead' },
      { name: 'Records desk', cred: '', role: 'Medical records' }
    ]
  };

  /* ---- date the Contact was first added to the directory (§4) ---- */
  var ADDED = {
    'CT-007': '2023-04-12',
    'CT-011': '2022-11-03',
    'CT-002': '2024-02-19',
    'CT-006': '2021-09-08',
    'CT-NEW': '2026-06-11'
  };

  /* ---- a synthetic just-added Contact with no exchange yet (§6 empty) ---- */
  var NEW_CONTACT = {
    id: 'CT-NEW', kind: 'contact',
    name: 'Sunrise Mobile Veterinary', type: 'gp', location: 'Holladay, UT',
    faxes: ['(801) 555-0455'], email: 'hello@sunrisemobilevet.com', phone: '(801) 555-0453',
    network: null, active: true, docs30: 0, last: '', weeks: []
  };

  /* ---- prototype switcher roster — one Contact per edge case (§9) ---- */
  var SCENARIOS = [
    { key: 'specialty',    id: 'CT-007', label: 'Specialist',     hint: 'On-network · busy' },
    { key: 'er',           id: 'CT-011', label: 'Emergency / ER', hint: 'On-network · multi-fax' },
    { key: 'gp',           id: 'CT-002', label: 'Referring GP',   hint: 'Off-network' },
    { key: 'inactive',     id: 'CT-006', label: 'Inactive',       hint: 'Relationship quiet' },
    { key: 'new',          id: 'CT-NEW', label: 'New contact',    hint: 'No exchange yet' },
    { key: 'unidentified', id: 'UN-001', label: 'Unidentified',   hint: 'Auto-created node' }
  ];

  window.RD_EXCHANGE = EXCHANGE;
  window.RD_CONTACT_NOTES = NOTES;
  window.RD_CONTACT_PEOPLE = PEOPLE;
  window.RD_CONTACT_ADDED = ADDED;
  window.RD_NEW_CONTACT = NEW_CONTACT;
  window.RD_CD_SCENARIOS = SCENARIOS;
})();
