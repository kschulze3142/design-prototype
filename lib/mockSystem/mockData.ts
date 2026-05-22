// =============================================================================
// Northwind Health — mock data for the Phase 9 multi-department prototype
// =============================================================================
//
// CROSS-DEPARTMENT PATIENT COVERAGE
// =============================================================================
// Patient              MRN          Referrals  PriorAuth  Clinical  Orders  Admin
// ------------------   ----------   ---------  ---------  --------  ------  -----
// Marcus Whitfield     FC-77821     ✓          ✓          ✓          -       -
// Cordelia Brennan     FC-77756     ✓✓         ✓          -          -       -
// Eleanor Vance        SM-2284417   ✓          -          ✓          -       ✓
// Beatrice Lindgren    CI-44211     ✓          ✓          -          -       -
// ------------------   ----------   ---------  ---------  --------  ------  -----
// (Filler patients appear in a single department each; some standalone
// patients have 2-dept overlap to fill quotas, but the four above are the
// intentional cross-department demo stories.)
//
// Story arcs (for demo narration):
// - Marcus Whitfield: stroke referral → echo finds reduced EF → cardiac MRI
//   PA submitted to identify embolic source. All three items are linked.
// - Cordelia Brennan: two referrals (COPD + MDD) and a pulmonary-rehab PA
//   approved against the COPD referral.
// - Eleanor Vance: HF referral → BNP lab elevated (acknowledged) → POA
//   documentation request in admin.
// - Beatrice Lindgren: CKD referral → cardiology-consult PA queued for
//   HFpEF workup.
// - Persephone Mali (supporting arc): T2DM referral declined for insurance
//   (ref-13) → patient updates insurance (ad-persephone-ins) → referral
//   resubmitted (ref-4), pending verification.
//
// Dates: ISO timestamps computed at file-load relative to "now". This means
// they shift on every refresh — fine for a prototype, and ensures the
// urgency rules (PA expiring <3 days, abnormal results, SLA breaches)
// always have something to highlight.
// =============================================================================

import type {
  AutomationRule,
  Department,
  Patient,
  ThreadEvent,
  User,
  WorkItem,
  Workspace,
} from './types'

// -----------------------------------------------------------------------------
// Date helpers
// -----------------------------------------------------------------------------
const NOW_MS = Date.now()
const inHours  = (h: number) => new Date(NOW_MS + h * 3_600_000).toISOString()
const hoursAgo = (h: number) => new Date(NOW_MS - h * 3_600_000).toISOString()
const inDays   = (d: number) => new Date(NOW_MS + d * 86_400_000).toISOString()
const daysAgo  = (d: number) => new Date(NOW_MS - d * 86_400_000).toISOString()

// -----------------------------------------------------------------------------
// Workspace
// -----------------------------------------------------------------------------
export const mockWorkspace: Workspace = {
  id: 'ws-northwind',
  name: 'Northwind Health',
  practiceType: 'cardiology',
  createdAt: daysAgo(420),
}

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------
export const mockUsers: User[] = [
  { id: 'u-amelia',  name: 'Amelia Park',     email: 'amelia.park@northwind.health',     role: 'admin', avatarColor: '#3d5080' },
  { id: 'u-daniel',  name: 'Daniel Reyes',    email: 'daniel.reyes@northwind.health',    role: 'staff', avatarColor: '#6366f1' },
  { id: 'u-sophia',  name: 'Sophia Mendoza',  email: 'sophia.mendoza@northwind.health',  role: 'staff', avatarColor: '#10b981' },
  { id: 'u-jordan',  name: 'Jordan Chen',     email: 'jordan.chen@northwind.health',     role: 'staff', avatarColor: '#f59e0b' },
]

// -----------------------------------------------------------------------------
// Departments — all five enabled at Northwind for the demo, even though the
// cardiology practice-type defaults exclude `orders`. Workspaces can enable
// any department they want.
// -----------------------------------------------------------------------------
export const mockDepartments: Department[] = [
  { id: 'dept-ref',      workspaceId: 'ws-northwind', type: 'referrals',        enabled: true },
  { id: 'dept-pa',       workspaceId: 'ws-northwind', type: 'prior_auth',       enabled: true },
  { id: 'dept-clinical', workspaceId: 'ws-northwind', type: 'clinical_results', enabled: true },
  { id: 'dept-orders',   workspaceId: 'ws-northwind', type: 'orders',           enabled: true },
  { id: 'dept-admin',    workspaceId: 'ws-northwind', type: 'admin',            enabled: true },
]

// -----------------------------------------------------------------------------
// Patients
// -----------------------------------------------------------------------------
export const mockPatients: Patient[] = [
  // -- Starred cross-department patients ----------------------------------
  { id: 'pt-marcus',    name: 'Marcus Whitfield',    mrn: 'FC-77821',  dob: '1953-09-22', age: 71, sex: 'M', insurance: 'Humana' },
  { id: 'pt-cordelia',  name: 'Cordelia Brennan',    mrn: 'FC-77756',  dob: '1944-07-01', age: 81, sex: 'F', insurance: 'UnitedHealthcare' },
  { id: 'pt-eleanor',   name: 'Eleanor Vance',       mrn: 'SM-2284417', dob: '1947-07-01', age: 78, sex: 'F', insurance: 'Medicare Part A' },
  { id: 'pt-beatrice',  name: 'Beatrice Lindgren',   mrn: 'CI-44211',  dob: '1943-07-01', age: 82, sex: 'F', insurance: 'Medicare Advantage' },
  // -- Phase 8 referral-only patients -------------------------------------
  { id: 'pt-henry',     name: 'Henry Tobias',        mrn: 'MR-019874', dob: '1961-07-01', age: 64, sex: 'M', insurance: 'Aetna' },
  { id: 'pt-persephone', name: 'Persephone Mali',    mrn: 'CI-44178',  dob: '1953-07-01', age: 72, sex: 'F', insurance: 'Blue Cross' },
  { id: 'pt-rosalind',  name: 'Rosalind Okafor',     mrn: 'UH-90122',  dob: '1958-07-01', age: 67, sex: 'F', insurance: 'Cigna' },
  // -- New referral patients (cardiology-flavored) -------------------------
  { id: 'pt-theodore',  name: 'Theodore Ashworth',   mrn: 'FC-77834',  dob: '1957-07-01', age: 68, sex: 'M', insurance: 'UnitedHealthcare' },
  { id: 'pt-lillian',   name: 'Lillian Castellanos', mrn: 'UH-90234',  dob: '1951-07-01', age: 74, sex: 'F', insurance: 'Medicare Advantage' },
  { id: 'pt-quincy',    name: 'Quincy Devereux',     mrn: 'MR-019921', dob: '1966-07-01', age: 59, sex: 'M', insurance: 'Blue Cross' },
  { id: 'pt-meilin',    name: 'Mei-Lin Sato',        mrn: 'SM-2284502', dob: '1960-07-01', age: 65, sex: 'F', insurance: 'Cigna' },
  // -- Standalone non-referral patients ------------------------------------
  { id: 'pt-oscar',     name: 'Oscar Wendell',       mrn: 'CI-44267',  dob: '1955-07-01', age: 70, sex: 'M', insurance: 'Humana' },
  { id: 'pt-yvette',    name: 'Yvette Bramwell',     mrn: 'UH-90345',  dob: '1958-07-01', age: 67, sex: 'F', insurance: 'Aetna' },
  { id: 'pt-reginald',  name: 'Reginald Hoffman',    mrn: 'CI-44312',  dob: '1957-07-01', age: 68, sex: 'M', insurance: 'Blue Cross' },
  { id: 'pt-greta',     name: 'Greta Holstrom',      mrn: 'SM-2284908', dob: '1947-07-01', age: 78, sex: 'F', insurance: 'Medicare Part B' },
]

// =============================================================================
// WORK ITEMS
// =============================================================================
//
// IDs are kebab-case for readability in console output. Where two work items
// are clinically linked (Marcus's referral → cardiac MRI PA → echo result),
// the `linkedItems` arrays point at each other.
// =============================================================================

export const mockWorkItems: WorkItem[] = [
  // ---------------------------------------------------------------------------
  // REFERRALS (12) — mirror Phase 8 mockReferrals + 4 new cardiology cases
  // ---------------------------------------------------------------------------
  {
    id: 'ref-1', departmentType: 'referrals', patientId: 'pt-eleanor',
    status: 'new', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inHours(4),
    docTags: ['Referral Rx', 'H&P'],
    linkedItems: [{ itemId: 'cr-eleanor-bnp', relationship: 'related' }],
    createdAt: hoursAgo(6), updatedAt: hoursAgo(2),
    metadata: {
      referringOrg: "St. Mark's Hospital",
      referringProvider: 'Dr. Patricia Holt',
      diagnosisCode: 'I50.9',
      diagnosisText: 'Heart failure, unspecified',
      services: ['Skilled Nursing', 'PT', 'OT'],
      episodeValueCents: 487_500,
      nextAction: 'Verify insurance eligibility',
    },
  },
  {
    id: 'ref-2', departmentType: 'referrals', patientId: 'pt-cordelia',
    status: 'new', assignedTo: 'u-amelia',
    slaBreached: true, slaDueAt: hoursAgo(2),
    docTags: ['Referral Rx'],
    linkedItems: [{ itemId: 'pa-cordelia-rehab', relationship: 'spawned' }],
    createdAt: hoursAgo(20), updatedAt: hoursAgo(2),
    metadata: {
      referringOrg: 'Foothill Clinic',
      referringProvider: 'Dr. James Orin',
      diagnosisCode: 'J44.1',
      diagnosisText: 'COPD with acute exacerbation',
      services: ['Skilled Nursing', 'Respiratory Therapy'],
      episodeValueCents: 392_000,
      nextAction: 'Call referring office',
    },
  },
  {
    id: 'ref-3', departmentType: 'referrals', patientId: 'pt-henry',
    status: 'in_review', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inHours(8),
    docTags: ['Referral Rx', 'Insurance Card'],
    linkedItems: [{ itemId: 'pa-henry-mri-pa', relationship: 'spawned' }],
    createdAt: hoursAgo(12), updatedAt: hoursAgo(3),
    metadata: {
      referringOrg: 'Mercy Regional',
      referringProvider: 'Dr. Sandra Vu',
      diagnosisCode: 'M54.5',
      diagnosisText: 'Low back pain',
      services: ['PT', 'HHA'],
      episodeValueCents: 215_000,
      nextAction: 'Request missing face-to-face',
    },
  },
  {
    id: 'ref-4', departmentType: 'referrals', patientId: 'pt-persephone',
    status: 'in_review', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inHours(12),
    docTags: ['Referral Rx', 'Lab Results'],
    linkedItems: [{ itemId: 'ref-13', relationship: 'related' }],
    createdAt: hoursAgo(14), updatedAt: hoursAgo(4),
    metadata: {
      referringOrg: 'Cascade IM',
      referringProvider: 'Dr. Robert Yuen',
      diagnosisCode: 'E11.9',
      diagnosisText: 'Type 2 diabetes mellitus',
      services: ['Skilled Nursing', 'Diabetic Education'],
      episodeValueCents: 178_000,
      nextAction: 'Queue prior auth',
    },
  },
  {
    id: 'ref-5', departmentType: 'referrals', patientId: 'pt-marcus',
    status: 'accepted', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inHours(24),
    docTags: ['Referral Rx', 'H&P', 'Discharge Summary'],
    linkedItems: [
      { itemId: 'pa-marcus-mri', relationship: 'spawned' },
      { itemId: 'cr-marcus-echo', relationship: 'spawned' },
    ],
    createdAt: daysAgo(3), updatedAt: hoursAgo(10),
    metadata: {
      referringOrg: 'Foothill Clinic',
      referringProvider: 'Dr. James Orin',
      diagnosisCode: 'I63.9',
      diagnosisText: 'Cerebral infarction, unspecified',
      services: ['PT', 'OT', 'Speech Therapy'],
      episodeValueCents: 612_000,
      nextAction: 'Send POC for signature',
    },
  },
  {
    id: 'ref-6', departmentType: 'referrals', patientId: 'pt-beatrice',
    status: 'scheduled', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inHours(48),
    docTags: ['Referral Rx', 'Labs'],
    linkedItems: [{ itemId: 'pa-beatrice-cards', relationship: 'spawned' }],
    createdAt: daysAgo(4), updatedAt: hoursAgo(18),
    metadata: {
      referringOrg: 'Cascade IM',
      referringProvider: 'Dr. Robert Yuen',
      diagnosisCode: 'N18.3',
      diagnosisText: 'Chronic kidney disease, stage 3',
      services: ['Skilled Nursing', 'Dietitian'],
      episodeValueCents: 334_000,
      nextAction: 'Confirm SOC visit time',
    },
  },
  {
    id: 'ref-7', departmentType: 'referrals', patientId: 'pt-rosalind',
    status: 'completed', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: null,
    docTags: ['Referral Rx', 'Op Report'],
    linkedItems: [],
    createdAt: daysAgo(10), updatedAt: daysAgo(1),
    metadata: {
      referringOrg: 'University Hospital',
      referringProvider: 'Dr. Fatima Osei',
      diagnosisCode: 'Z96.641',
      diagnosisText: 'Presence of right artificial hip joint',
      services: ['PT', 'HHA'],
      episodeValueCents: 289_000,
      nextAction: null,
    },
  },
  {
    id: 'ref-8', departmentType: 'referrals', patientId: 'pt-cordelia',
    status: 'new', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inHours(6),
    docTags: ['Referral Rx'],
    linkedItems: [],
    createdAt: hoursAgo(8), updatedAt: hoursAgo(1),
    metadata: {
      referringOrg: 'Foothill Clinic',
      referringProvider: 'Dr. James Orin',
      diagnosisCode: 'F32.9',
      diagnosisText: 'Major depressive disorder, unspecified',
      services: ['Behavioral Health'],
      episodeValueCents: 145_000,
      nextAction: 'Review referral documents',
    },
  },
  {
    id: 'ref-9', departmentType: 'referrals', patientId: 'pt-theodore',
    status: 'new', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: inHours(3),
    docTags: ['Referral Rx', 'EKG'],
    linkedItems: [{ itemId: 'pa-theodore-ep', relationship: 'spawned' }],
    createdAt: hoursAgo(5), updatedAt: hoursAgo(1),
    metadata: {
      referringOrg: 'Foothill Clinic',
      referringProvider: 'Dr. James Orin',
      diagnosisCode: 'I48.0',
      diagnosisText: 'Paroxysmal atrial fibrillation',
      services: ['Cardiology Consult', 'EP Study'],
      episodeValueCents: 528_000,
      nextAction: 'Confirm EP scheduling window',
    },
  },
  {
    id: 'ref-10', departmentType: 'referrals', patientId: 'pt-lillian',
    status: 'accepted', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: inHours(18),
    docTags: ['Referral Rx', 'Discharge Summary', 'Cath Report'],
    linkedItems: [{ itemId: 'pa-lillian-angio', relationship: 'related' }],
    createdAt: daysAgo(2), updatedAt: hoursAgo(8),
    metadata: {
      referringOrg: 'University Hospital',
      referringProvider: 'Dr. Fatima Osei',
      diagnosisCode: 'I21.4',
      diagnosisText: 'Non-ST elevation myocardial infarction, s/p PCI',
      services: ['Cardiac Rehab', 'Post-MI Follow-up'],
      episodeValueCents: 712_000,
      nextAction: 'Schedule first cardiac-rehab session',
    },
  },
  {
    id: 'ref-11', departmentType: 'referrals', patientId: 'pt-quincy',
    status: 'in_review', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: inHours(10),
    docTags: ['Referral Rx', 'Echo Report'],
    linkedItems: [
      { itemId: 'cr-quincy-lipid', relationship: 'related' },
      { itemId: 'pa-quincy-tavr-ct', relationship: 'spawned' },
    ],
    createdAt: hoursAgo(16), updatedAt: hoursAgo(4),
    metadata: {
      referringOrg: 'Mercy Regional',
      referringProvider: 'Dr. Sandra Vu',
      diagnosisCode: 'I35.0',
      diagnosisText: 'Nonrheumatic aortic (valve) stenosis, severe',
      services: ['Cardiology Consult', 'TAVR Eval'],
      episodeValueCents: 985_000,
      nextAction: 'Request CT for TAVR planning',
    },
  },
  {
    id: 'ref-12', departmentType: 'referrals', patientId: 'pt-meilin',
    status: 'scheduled', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: inHours(36),
    docTags: ['Referral Rx', 'Labs'],
    linkedItems: [
      { itemId: 'cr-meilin-iron', relationship: 'related' },
      { itemId: 'o-meilin-epo',  relationship: 'spawned' },
    ],
    createdAt: daysAgo(3), updatedAt: hoursAgo(20),
    metadata: {
      referringOrg: "St. Mark's Hospital",
      referringProvider: 'Dr. Patricia Holt',
      diagnosisCode: 'I50.32',
      diagnosisText: 'Heart failure with preserved ejection fraction, with anemia',
      services: ['Cardiology Follow-up', 'Iron Infusion'],
      episodeValueCents: 411_000,
      nextAction: 'Confirm infusion-clinic slot',
    },
  },
  {
    id: 'ref-13', departmentType: 'referrals', patientId: 'pt-persephone',
    status: 'declined', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: null,
    docTags: ['Referral Rx'],
    linkedItems: [{ itemId: 'ref-4', relationship: 'related' }],
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    metadata: {
      referringOrg: 'Cascade IM',
      referringProvider: 'Dr. Robert Yuen',
      diagnosisCode: 'E11.9',
      diagnosisText: 'Type 2 diabetes mellitus',
      services: ['Skilled Nursing', 'Diabetic Education'],
      episodeValueCents: 178_000,
      nextAction: null,
      declineReason: 'Insurance not accepted',
      declineNotes: "Patient on Medicaid; Northwind not contracted with this Medicaid plan in this region. Courtesy fax sent to Cascade IM 2 days ago. Patient subsequently updated insurance — see ad-persephone-ins and resubmitted referral ref-4.",
    },
  },

  // ---------------------------------------------------------------------------
  // PRIOR AUTH (10) — 3 cross-dept stars (Marcus/Cordelia/Beatrice) + 7 mixed,
  // covering all 6 status states (submitted/awaiting_docs/pending/approved/
  // denied/expired). Reginald/Quincy/Henry PAs added per FE-056 to exercise
  // the new awaiting_docs status and the previously-missing denied/expired.
  // ---------------------------------------------------------------------------
  {
    id: 'pa-marcus-mri', departmentType: 'prior_auth', patientId: 'pt-marcus',
    status: 'submitted', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inDays(2),
    docTags: ['PA Request', 'Clinical Notes'],
    linkedItems: [
      { itemId: 'ref-5', relationship: 'spawned_from' },
      { itemId: 'cr-marcus-echo', relationship: 'spawned_from' },
    ],
    createdAt: daysAgo(2), updatedAt: hoursAgo(6),
    metadata: {
      payer: 'Humana',
      servicesRequested: ['Cardiac MRI for embolic source'],
      cptCodes: ['75561', '75565'],
      submittedAt: hoursAgo(28),
      expiresAt: inDays(2),
    },
  },
  {
    id: 'pa-cordelia-rehab', departmentType: 'prior_auth', patientId: 'pt-cordelia',
    status: 'approved', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inDays(30),
    docTags: ['Auth Approval', 'Clinical Notes'],
    linkedItems: [{ itemId: 'ref-2', relationship: 'spawned_from' }],
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
    metadata: {
      payer: 'UnitedHealthcare',
      servicesRequested: ['Pulmonary rehabilitation program (12 sessions)'],
      cptCodes: ['94625', '94626'],
      authNumber: 'UHC-2026-447128',
      submittedAt: daysAgo(5),
      expiresAt: inDays(60),
    },
  },
  {
    id: 'pa-beatrice-cards', departmentType: 'prior_auth', patientId: 'pt-beatrice',
    status: 'submitted', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: inDays(7),
    docTags: ['PA Request'],
    linkedItems: [{ itemId: 'ref-6', relationship: 'spawned_from' }],
    createdAt: hoursAgo(20), updatedAt: hoursAgo(20),
    metadata: {
      payer: 'Medicare Advantage',
      servicesRequested: ['Cardiology consult — HFpEF evaluation in CKD stage 3'],
      cptCodes: ['99244'],
      submittedAt: hoursAgo(20),
      expiresAt: inDays(7),
    },
  },
  {
    id: 'pa-theodore-ep', departmentType: 'prior_auth', patientId: 'pt-theodore',
    status: 'submitted', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: inDays(5),
    docTags: ['PA Request', 'Clinical Notes'],
    linkedItems: [{ itemId: 'ref-9', relationship: 'spawned_from' }],
    createdAt: hoursAgo(4), updatedAt: hoursAgo(2),
    metadata: {
      payer: 'UnitedHealthcare',
      servicesRequested: ['Electrophysiology study, ?ablation for paroxysmal AF'],
      cptCodes: ['93653'],
      submittedAt: hoursAgo(2),
      expiresAt: inDays(5),
    },
  },
  {
    id: 'pa-lillian-angio', departmentType: 'prior_auth', patientId: 'pt-lillian',
    status: 'approved', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: inDays(14),
    docTags: ['Auth Approval'],
    linkedItems: [{ itemId: 'ref-10', relationship: 'related' }],
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
    metadata: {
      payer: 'Medicare Advantage',
      servicesRequested: ['Diagnostic coronary angiography (post-PCI surveillance)'],
      cptCodes: ['93454'],
      authNumber: 'MAPD-2026-008812',
      submittedAt: daysAgo(3),
      expiresAt: inDays(14),
    },
  },
  {
    id: 'pa-oscar-ablation', departmentType: 'prior_auth', patientId: 'pt-oscar',
    status: 'approved', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: inDays(21),
    docTags: ['Auth Approval', 'Clinical Notes'],
    linkedItems: [{ itemId: 'o-oscar-monitor', relationship: 'spawned' }],
    createdAt: daysAgo(8), updatedAt: daysAgo(4),
    metadata: {
      payer: 'Humana',
      servicesRequested: ['Radiofrequency ablation — atrial flutter'],
      cptCodes: ['93656'],
      authNumber: 'HUM-2026-119003',
      submittedAt: daysAgo(8),
      expiresAt: inDays(21),
    },
  },
  {
    id: 'pa-yvette-mri', departmentType: 'prior_auth', patientId: 'pt-yvette',
    status: 'submitted', assignedTo: 'u-jordan',
    slaBreached: false, slaDueAt: inDays(2),
    docTags: ['PA Request', 'Clinical Notes'],
    linkedItems: [{ itemId: 'cr-yvette-cmr', relationship: 'related' }],
    createdAt: hoursAgo(48), updatedAt: hoursAgo(10),
    metadata: {
      payer: 'Aetna',
      servicesRequested: ['Cardiac MRI — nonischemic cardiomyopathy workup'],
      cptCodes: ['75561'],
      submittedAt: hoursAgo(48),
      expiresAt: inDays(2),
    },
  },
  {
    id: 'pa-reginald-cath', departmentType: 'prior_auth', patientId: 'pt-reginald',
    status: 'awaiting_docs', assignedTo: 'u-jordan',
    slaBreached: false, slaDueAt: inDays(2),
    docTags: ['PA Request', 'F2F Docs'],
    linkedItems: [{ itemId: 'cr-reginald-stress', relationship: 'related' }],
    createdAt: hoursAgo(36), updatedAt: hoursAgo(4),
    metadata: {
      payer: 'Blue Cross',
      servicesRequested: ['Diagnostic cardiac cath', 'IVUS if indicated'],
      cptCodes: ['93454', '93458'],
      // Not yet submitted — awaiting clinical note from Dr. Quintero before payer submission.
    },
  },
  {
    id: 'pa-quincy-tavr-ct', departmentType: 'prior_auth', patientId: 'pt-quincy',
    status: 'denied', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: null,
    docTags: ['PA Request', 'Auth Denial', 'Clinical Notes'],
    linkedItems: [{ itemId: 'ref-11', relationship: 'spawned_from' }],
    createdAt: daysAgo(6), updatedAt: daysAgo(2),
    metadata: {
      payer: 'Blue Cross',
      servicesRequested: ['Cardiac CT with contrast', 'TAVR planning protocol'],
      cptCodes: ['75574'],
      submittedAt: daysAgo(6),
      deniedReason: 'Service not covered by plan',
    },
  },
  {
    id: 'pa-henry-mri-pa', departmentType: 'prior_auth', patientId: 'pt-henry',
    status: 'expired', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: null,
    docTags: ['PA Request', 'Auth Approval'],
    linkedItems: [
      { itemId: 'ref-3', relationship: 'spawned_from' },
      { itemId: 'o-henry-mri', relationship: 'related' },
    ],
    createdAt: daysAgo(45), updatedAt: daysAgo(5),
    metadata: {
      payer: 'Aetna',
      servicesRequested: ['Lumbar MRI without contrast'],
      cptCodes: ['72148'],
      authNumber: 'AET-2025-330451',
      submittedAt: daysAgo(45),
      expiresAt: daysAgo(5),
    },
  },

  // ---------------------------------------------------------------------------
  // CLINICAL RESULTS (6) — 2 cross-dept stars + 4 mixed
  // ---------------------------------------------------------------------------
  {
    id: 'cr-marcus-echo', departmentType: 'clinical_results', patientId: 'pt-marcus',
    status: 'action_required', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: inHours(12),
    docTags: ['Imaging', 'Abnormal'],
    linkedItems: [
      { itemId: 'ref-5', relationship: 'spawned_from' },
      { itemId: 'pa-marcus-mri', relationship: 'spawned' },
    ],
    createdAt: daysAgo(2), updatedAt: hoursAgo(30),
    metadata: {
      resultType: 'imaging',
      orderingProvider: 'Dr. Marisol Quintero (Cardiology)',
      receivedAt: hoursAgo(30),
      abnormal: true,
      acknowledged: false,
      headline: 'Transthoracic echo: LVEF 35%, mild global hypokinesis. Recommend cardiac MRI for embolic source evaluation.',
    },
  },
  {
    id: 'cr-eleanor-bnp', departmentType: 'clinical_results', patientId: 'pt-eleanor',
    status: 'acknowledged', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: null,
    docTags: ['Lab', 'Abnormal'],
    linkedItems: [{ itemId: 'ref-1', relationship: 'related' }],
    createdAt: hoursAgo(20), updatedAt: hoursAgo(8),
    metadata: {
      resultType: 'lab',
      orderingProvider: 'Dr. Patricia Holt',
      receivedAt: hoursAgo(20),
      abnormal: true,
      acknowledged: true,
      headline: 'BNP 1,450 pg/mL (ref < 100). Consistent with decompensated heart failure.',
    },
  },
  {
    id: 'cr-reginald-stress', departmentType: 'clinical_results', patientId: 'pt-reginald',
    status: 'action_required', assignedTo: 'u-jordan',
    slaBreached: true, slaDueAt: hoursAgo(4),
    docTags: ['Imaging', 'Abnormal', 'Follow-up'],
    linkedItems: [
      { itemId: 'o-reginald-echo', relationship: 'spawned' },
      { itemId: 'pa-reginald-cath', relationship: 'related' },
    ],
    createdAt: daysAgo(3), updatedAt: hoursAgo(4),
    metadata: {
      resultType: 'imaging',
      orderingProvider: 'Dr. Marisol Quintero (Cardiology)',
      receivedAt: daysAgo(3),
      abnormal: true,
      acknowledged: false,
      headline: 'Dobutamine stress echo: apical wall motion abnormality at peak stress. Recommend follow-up TTE.',
    },
  },
  {
    id: 'cr-yvette-cmr', departmentType: 'clinical_results', patientId: 'pt-yvette',
    status: 'reviewed', assignedTo: 'u-jordan',
    slaBreached: false, slaDueAt: inHours(24),
    docTags: ['Imaging', 'Abnormal'],
    linkedItems: [{ itemId: 'pa-yvette-mri', relationship: 'related' }],
    createdAt: daysAgo(2), updatedAt: hoursAgo(14),
    metadata: {
      resultType: 'imaging',
      orderingProvider: 'Dr. Marisol Quintero (Cardiology)',
      receivedAt: daysAgo(2),
      abnormal: true,
      acknowledged: true,
      headline: 'Cardiac MRI: late gadolinium enhancement in lateral wall, pattern consistent with nonischemic cardiomyopathy.',
    },
  },
  {
    id: 'cr-quincy-lipid', departmentType: 'clinical_results', patientId: 'pt-quincy',
    status: 'acknowledged', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: null,
    docTags: ['Lab', 'Routine'],
    linkedItems: [{ itemId: 'ref-11', relationship: 'related' }],
    createdAt: hoursAgo(36), updatedAt: hoursAgo(12),
    metadata: {
      resultType: 'lab',
      orderingProvider: 'Dr. Sandra Vu',
      receivedAt: hoursAgo(36),
      abnormal: false,
      acknowledged: true,
      headline: 'Pre-op lipid panel: total chol 178, LDL 96. Within goal for surgical planning.',
    },
  },
  {
    id: 'cr-meilin-iron', departmentType: 'clinical_results', patientId: 'pt-meilin',
    status: 'reviewed', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: inHours(20),
    docTags: ['Lab', 'Abnormal', 'Follow-up'],
    linkedItems: [
      { itemId: 'ref-12', relationship: 'related' },
      { itemId: 'o-meilin-epo', relationship: 'spawned' },
    ],
    createdAt: hoursAgo(28), updatedAt: hoursAgo(6),
    metadata: {
      resultType: 'lab',
      orderingProvider: 'Dr. Patricia Holt',
      receivedAt: hoursAgo(28),
      abnormal: true,
      acknowledged: true,
      headline: 'Ferritin 14 ng/mL, TSAT 11%. Iron-deficient anemia in setting of HFpEF — infusion ordered.',
    },
  },

  // ---------------------------------------------------------------------------
  // ORDERS (5)
  // ---------------------------------------------------------------------------
  {
    id: 'o-reginald-echo', departmentType: 'orders', patientId: 'pt-reginald',
    status: 'pending', assignedTo: 'u-jordan',
    slaBreached: false, slaDueAt: inDays(3),
    docTags: ['Imaging', 'Follow-up'],
    linkedItems: [{ itemId: 'cr-reginald-stress', relationship: 'spawned_from' }],
    createdAt: hoursAgo(4), updatedAt: hoursAgo(4),
    metadata: {
      orderType: 'Imaging',
      orderingProvider: 'Dr. Marisol Quintero',
      receivedAt: hoursAgo(4),
      fulfillmentStatus: 'Awaiting scheduler',
    },
  },
  {
    id: 'o-henry-mri', departmentType: 'orders', patientId: 'pt-henry',
    status: 'in_progress', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: inDays(5),
    docTags: ['Imaging', 'Routine'],
    linkedItems: [
      { itemId: 'ref-3', relationship: 'related' },
      { itemId: 'pa-henry-mri-pa', relationship: 'related' },
    ],
    createdAt: daysAgo(1), updatedAt: hoursAgo(2),
    metadata: {
      orderType: 'Imaging',
      orderingProvider: 'Dr. Sandra Vu',
      receivedAt: daysAgo(1),
      fulfillmentStatus: 'Booked — Thursday 10:00',
    },
  },
  {
    id: 'o-oscar-monitor', departmentType: 'orders', patientId: 'pt-oscar',
    status: 'fulfilled', assignedTo: 'u-daniel',
    slaBreached: false, slaDueAt: null,
    docTags: ['DME'],
    linkedItems: [{ itemId: 'pa-oscar-ablation', relationship: 'spawned_from' }],
    createdAt: daysAgo(6), updatedAt: daysAgo(2),
    metadata: {
      orderType: 'DME',
      orderingProvider: 'Dr. Marisol Quintero',
      receivedAt: daysAgo(6),
      fulfillmentStatus: 'Delivered — 14-day event monitor',
    },
  },
  {
    id: 'o-yvette-telemetry', departmentType: 'orders', patientId: 'pt-yvette',
    status: 'pending', assignedTo: 'u-jordan',
    slaBreached: false, slaDueAt: inDays(2),
    docTags: ['DME', 'Urgent'],
    linkedItems: [],
    createdAt: hoursAgo(18), updatedAt: hoursAgo(18),
    metadata: {
      orderType: 'DME',
      orderingProvider: 'Dr. Marisol Quintero',
      receivedAt: hoursAgo(18),
      fulfillmentStatus: 'Insurance verification in progress',
    },
  },
  {
    id: 'o-meilin-epo', departmentType: 'orders', patientId: 'pt-meilin',
    status: 'pending', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: inDays(4),
    docTags: ['Pharmacy', 'Urgent'],
    linkedItems: [
      { itemId: 'cr-meilin-iron', relationship: 'spawned_from' },
      { itemId: 'ref-12', relationship: 'related' },
    ],
    createdAt: hoursAgo(6), updatedAt: hoursAgo(6),
    metadata: {
      orderType: 'Pharmacy',
      orderingProvider: 'Dr. Patricia Holt',
      receivedAt: hoursAgo(6),
      fulfillmentStatus: 'Infusion clinic scheduling',
    },
  },

  // ---------------------------------------------------------------------------
  // ADMIN (5)
  // ---------------------------------------------------------------------------
  {
    id: 'ad-persephone-ins', departmentType: 'admin', patientId: 'pt-persephone',
    status: 'open', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inDays(3),
    docTags: ['Insurance Card'],
    linkedItems: [{ itemId: 'ref-4', relationship: 'related' }],
    createdAt: hoursAgo(8), updatedAt: hoursAgo(8),
    metadata: {
      documentType: 'Insurance Card',
      receivedAt: hoursAgo(8),
      receivedVia: 'fax',
      routedTo: 'u-amelia',
    },
  },
  {
    id: 'ad-greta-records', departmentType: 'admin', patientId: 'pt-greta',
    status: 'in_progress', assignedTo: 'u-jordan',
    slaBreached: false, slaDueAt: inDays(5),
    docTags: ['Records Request', 'ROI'],
    linkedItems: [],
    createdAt: daysAgo(2), updatedAt: hoursAgo(20),
    metadata: {
      documentType: 'Records Request',
      receivedAt: daysAgo(2),
      receivedVia: 'fax',
      routedTo: 'u-jordan',
    },
  },
  {
    id: 'ad-rosalind-discharge', departmentType: 'admin', patientId: 'pt-rosalind',
    status: 'completed', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: null,
    docTags: ['Records Request'],
    linkedItems: [{ itemId: 'ref-7', relationship: 'related' }],
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
    metadata: {
      documentType: 'Discharge Summary Archive',
      receivedAt: daysAgo(2),
      receivedVia: 'email',
      routedTo: 'u-amelia',
    },
  },
  {
    id: 'ad-theodore-addr', departmentType: 'admin', patientId: 'pt-theodore',
    status: 'completed', assignedTo: 'u-sophia',
    slaBreached: false, slaDueAt: null,
    docTags: ['Address Change'],
    linkedItems: [],
    createdAt: daysAgo(1), updatedAt: hoursAgo(14),
    metadata: {
      documentType: 'Address Change',
      receivedAt: daysAgo(1),
      receivedVia: 'mail',
      routedTo: 'u-sophia',
    },
  },
  {
    id: 'ad-eleanor-poa', departmentType: 'admin', patientId: 'pt-eleanor',
    status: 'open', assignedTo: 'u-amelia',
    slaBreached: false, slaDueAt: inDays(7),
    docTags: ['POA'],
    linkedItems: [{ itemId: 'ref-1', relationship: 'related' }],
    createdAt: hoursAgo(5), updatedAt: hoursAgo(5),
    metadata: {
      documentType: 'Power of Attorney',
      receivedAt: hoursAgo(5),
      receivedVia: 'fax',
      routedTo: 'u-amelia',
    },
  },
]

// =============================================================================
// THREAD EVENTS
// =============================================================================
//
// Per-work-item event histories. The Marcus Whitfield referral mirrors the
// Phase 8 mockThreadEvents (e1-e7) so FE-054's port is straight translation.
// Cross-department items reference each other by name in their note bodies
// to make the multi-dept architecture feel real.
// =============================================================================

export const mockThreadEvents: ThreadEvent[] = [
  // -- Marcus Whitfield: REFERRAL (port of Phase 8 mockThreadEvents) --------
  {
    id: 'te-ref5-1', workItemId: 'ref-5', type: 'document_received',
    actor: 'system', actorLabel: 'Foothill Clinic (Dr. James Orin)',
    timestamp: daysAgo(3),
    payload: {
      senderLabel: 'Foothill Clinic (Dr. James Orin)',
      documentName: 'Referral_Whitfield_FC77821.pdf',
      documentPages: 4,
      bodyText: 'Please find attached referral documentation for Marcus Whitfield. Patient requires PT, OT, and Speech Therapy following cerebral infarction. Insurance pre-authorization attached.',
      tags: ['Referral Rx', 'H&P'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref5-2', workItemId: 'ref-5', type: 'automation',
    actor: 'system', timestamp: hoursAgo(71),
    payload: {
      ruleId: 'auto-ref-acknowledge',
      ruleName: 'Auto-acknowledge new referrals',
      actionDescription: 'Acknowledgment fax sent to Foothill Clinic.',
      bodyText: 'Acknowledgment fax sent to Foothill Clinic confirming receipt of referral for Marcus Whitfield.',
    },
  },
  {
    id: 'te-ref5-3', workItemId: 'ref-5', type: 'status_change',
    actor: 'u-amelia', timestamp: hoursAgo(60),
    payload: {
      fromStatus: 'new', toStatus: 'in_review',
      transitionActions: ['Acknowledgment fax sent', 'SLA timer started (4h)', 'Patient notification queued'],
      notes: null,
    },
  },
  {
    id: 'te-ref5-4', workItemId: 'ref-5', type: 'document_sent',
    actor: 'u-amelia', timestamp: hoursAgo(56),
    payload: {
      recipientLabel: 'Foothill Clinic',
      documentName: 'F2F_Request_FC77821.pdf',
      documentPages: 2,
      bodyText: 'Requesting face-to-face documentation for prior authorization. Please fax F2F notes at your earliest convenience.',
      tags: ['F2F Request'],
      delivered: true,
    },
  },
  {
    id: 'te-ref5-5', workItemId: 'ref-5', type: 'status_change',
    actor: 'u-amelia', timestamp: hoursAgo(34),
    payload: {
      fromStatus: 'in_review', toStatus: 'accepted',
      transitionActions: ['Acceptance fax sent to Foothill Clinic', 'Prior auth request queued', 'Scheduler notified'],
      notes: null,
    },
  },
  {
    id: 'te-ref5-6', workItemId: 'ref-5', type: 'link_created',
    actor: 'u-amelia', timestamp: hoursAgo(33),
    payload: {
      linkedWorkItemId: 'pa-marcus-mri',
      relationship: 'spawned',
      bodyText: 'Cardiac MRI PA queued — Dr. Quintero requesting embolic-source workup based on stroke etiology.',
    },
  },
  {
    id: 'te-ref5-7', workItemId: 'ref-5', type: 'document_sent',
    actor: 'u-amelia', timestamp: hoursAgo(28),
    payload: {
      recipientLabel: 'Marcus Whitfield',
      documentName: 'POC_Whitfield_FC77821.pdf',
      documentPages: 6,
      bodyText: 'Plan of care attached for your review and signature. Please sign and return at your earliest convenience.',
      tags: ['POC'],
      delivered: true,
    },
  },

  // -- Marcus Whitfield: ECHO RESULT ---------------------------------------
  {
    id: 'te-cr-marcus-1', workItemId: 'cr-marcus-echo', type: 'document_received',
    actor: 'system', actorLabel: 'Northwind Echo Lab',
    timestamp: hoursAgo(30),
    payload: {
      senderLabel: 'Northwind Echo Lab',
      documentName: 'TTE_Whitfield_2026.pdf',
      documentPages: 3,
      bodyText: 'Transthoracic echocardiogram report attached. LVEF 35% with mild global hypokinesis. Recommend cardiac MRI for embolic-source evaluation given recent stroke.',
      tags: ['Imaging', 'Abnormal'],
      classificationNote: 'Auto-flagged abnormal — EF threshold',
      delivered: true,
    },
  },
  {
    id: 'te-cr-marcus-2', workItemId: 'cr-marcus-echo', type: 'automation',
    actor: 'system', timestamp: hoursAgo(30),
    payload: {
      ruleId: 'auto-cr-abnormal-flag',
      ruleName: 'Abnormal result → flag for review',
      actionDescription: 'Tagged Abnormal and routed to Dr. Quintero.',
      bodyText: null,
    },
  },
  {
    id: 'te-cr-marcus-3', workItemId: 'cr-marcus-echo', type: 'note',
    actor: 'u-daniel', timestamp: hoursAgo(28),
    payload: {
      bodyText: 'Echo TTE performed today: LVEF 35%, mild global hypokinesis. Linked to stroke referral from Foothill Clinic 3 days ago (Whitfield, I63.9). Recommending cardiac MRI PA to evaluate cardiac embolic source — request being prepared for Humana.',
      tags: [],
    },
  },

  // -- Marcus Whitfield: CARDIAC MRI PA ------------------------------------
  {
    id: 'te-pa-marcus-1', workItemId: 'pa-marcus-mri', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(33),
    payload: {
      bodyText: 'Spawned from stroke referral 3 days ago (Foothill Clinic, Dr. Orin, I63.9 cerebral infarction). Echo from earlier today showed LVEF 35% with global hypokinesis — Dr. Quintero requesting cardiac MRI to evaluate cardiac embolic source.',
      tags: [],
    },
  },
  {
    id: 'te-pa-marcus-2', workItemId: 'pa-marcus-mri', type: 'document_sent',
    actor: 'u-amelia', timestamp: hoursAgo(28),
    payload: {
      recipientLabel: 'Humana PA Dept',
      documentName: 'PA_Whitfield_CardiacMRI.pdf',
      documentPages: 5,
      bodyText: 'Prior auth submission for cardiac MRI (75561, 75565). Clinical justification: recent cerebral infarction with reduced LVEF on TTE; ruling out cardiac embolic source.',
      tags: ['PA Request', 'Clinical Notes'],
      delivered: true,
    },
  },
  {
    id: 'te-pa-marcus-3', workItemId: 'pa-marcus-mri', type: 'status_change',
    actor: 'u-amelia', timestamp: hoursAgo(28),
    payload: {
      fromStatus: 'pending', toStatus: 'submitted',
      transitionActions: ['Submitted to Humana via portal', 'Expiry timer started'],
      notes: 'Expecting decision within 3 business days.',
    },
  },
  {
    id: 'te-pa-marcus-4', workItemId: 'pa-marcus-mri', type: 'automation',
    actor: 'system', timestamp: hoursAgo(6),
    payload: {
      ruleId: 'auto-pa-expiring',
      ruleName: 'Auth approaching expiry → alert',
      actionDescription: 'Notified Amelia Park — PA decision SLA <48h.',
      bodyText: null,
    },
  },

  // -- Cordelia Brennan: COPD REFERRAL -------------------------------------
  {
    id: 'te-ref2-1', workItemId: 'ref-2', type: 'document_received',
    actor: 'system', actorLabel: 'Foothill Clinic (Dr. James Orin)',
    timestamp: hoursAgo(20),
    payload: {
      senderLabel: 'Foothill Clinic (Dr. James Orin)',
      documentName: 'Referral_Brennan_COPD.pdf',
      documentPages: 3,
      bodyText: 'Mrs. Brennan presents with acute COPD exacerbation following discharge from FCMC. Requesting skilled nursing + respiratory therapy.',
      tags: ['Referral Rx'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref2-2', workItemId: 'ref-2', type: 'automation',
    actor: 'system', timestamp: hoursAgo(20),
    payload: {
      ruleId: 'auto-ref-sla-breach',
      ruleName: 'SLA breach alert',
      actionDescription: 'Escalation triggered — 4h SLA breached.',
      bodyText: 'No acknowledgment fax received within SLA window.',
    },
  },
  {
    id: 'te-ref2-3', workItemId: 'ref-2', type: 'link_created',
    actor: 'u-amelia', timestamp: hoursAgo(18),
    payload: {
      linkedWorkItemId: 'pa-cordelia-rehab',
      relationship: 'spawned',
      bodyText: 'Pulmonary rehab PA initiated 5 days ago and approved yesterday by UnitedHealthcare — auth #UHC-2026-447128, 12 sessions valid 60 days.',
    },
  },

  // -- Cordelia Brennan: MDD REFERRAL --------------------------------------
  {
    id: 'te-ref8-1', workItemId: 'ref-8', type: 'document_received',
    actor: 'system', actorLabel: 'Foothill Clinic (Dr. James Orin)',
    timestamp: hoursAgo(8),
    payload: {
      senderLabel: 'Foothill Clinic (Dr. James Orin)',
      documentName: 'Referral_Brennan_BH.pdf',
      documentPages: 2,
      bodyText: 'Separate referral for behavioral health — major depressive disorder with anxiety. Patient declined SSRI; requesting therapy services.',
      tags: ['Referral Rx'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref8-2', workItemId: 'ref-8', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(6),
    payload: {
      bodyText: 'Same patient as ref-2 (COPD). Separate referral, separate diagnosis — keep distinct work items per Dr. Orin\'s request.',
      tags: [],
    },
  },

  // -- Cordelia Brennan: PULMONARY REHAB PA --------------------------------
  {
    id: 'te-pa-cordelia-1', workItemId: 'pa-cordelia-rehab', type: 'document_sent',
    actor: 'u-amelia', timestamp: daysAgo(5),
    payload: {
      recipientLabel: 'UnitedHealthcare PA',
      documentName: 'PA_Brennan_PulmRehab.pdf',
      documentPages: 4,
      bodyText: 'Submitting PA for 12-session pulmonary rehab program. Clinical: GOLD stage D COPD with frequent exacerbations.',
      tags: ['PA Request', 'Clinical Notes'],
      delivered: true,
    },
  },
  {
    id: 'te-pa-cordelia-2', workItemId: 'pa-cordelia-rehab', type: 'document_received',
    actor: 'system', actorLabel: 'UnitedHealthcare',
    timestamp: daysAgo(1),
    payload: {
      senderLabel: 'UnitedHealthcare',
      documentName: 'PA_Approval_UHC2026447128.pdf',
      documentPages: 1,
      bodyText: 'Authorization #UHC-2026-447128 approved for 12 sessions of pulmonary rehab. Valid 60 days.',
      tags: ['Auth Approval'],
      classificationNote: 'Auto-classified as PA decision',
      delivered: true,
    },
  },
  {
    id: 'te-pa-cordelia-3', workItemId: 'pa-cordelia-rehab', type: 'status_change',
    actor: 'u-amelia', timestamp: daysAgo(1),
    payload: {
      fromStatus: 'submitted', toStatus: 'approved',
      transitionActions: ['Auth # recorded', 'Scheduler notified', 'Referral ref-2 updated'],
      notes: null,
    },
  },

  // -- Eleanor Vance: HF REFERRAL ------------------------------------------
  {
    id: 'te-ref1-1', workItemId: 'ref-1', type: 'document_received',
    actor: 'system', actorLabel: "St. Mark's Hospital (Dr. Patricia Holt)",
    timestamp: hoursAgo(6),
    payload: {
      senderLabel: "St. Mark's Hospital (Dr. Patricia Holt)",
      documentName: 'Referral_Vance_HF.pdf',
      documentPages: 5,
      bodyText: 'Mrs. Vance — newly diagnosed HF after 3-day admission. BNP 1450 (separate report). Requesting SN, PT, OT.',
      tags: ['Referral Rx', 'H&P'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref1-2', workItemId: 'ref-1', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(4),
    payload: {
      bodyText: 'BNP result arrived this morning from St. Mark\'s Lab: 1,450 pg/mL (ref <100). Confirms decompensation — supports the I50.9 diagnosis on the referral. No additional cardiac workup needed before SOC.',
      tags: [],
    },
  },
  {
    id: 'te-ref1-3', workItemId: 'ref-1', type: 'assignment',
    actor: 'u-amelia', timestamp: hoursAgo(2),
    payload: {
      fromUserId: null,
      toUserId: 'u-amelia',
      reason: 'Self-assigned for insurance eligibility check.',
    },
  },

  // -- Eleanor Vance: BNP LAB ----------------------------------------------
  {
    id: 'te-cr-eleanor-1', workItemId: 'cr-eleanor-bnp', type: 'document_received',
    actor: 'system', actorLabel: "St. Mark's Lab",
    timestamp: hoursAgo(20),
    payload: {
      senderLabel: "St. Mark's Lab",
      documentName: 'Lab_Vance_BNP.pdf',
      documentPages: 1,
      bodyText: 'BNP 1,450 pg/mL (ref < 100).',
      tags: ['Lab', 'Abnormal'],
      classificationNote: 'Auto-flagged abnormal — BNP threshold',
      delivered: true,
    },
  },
  {
    id: 'te-cr-eleanor-2', workItemId: 'cr-eleanor-bnp', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(8),
    payload: {
      bodyText: 'Acknowledged. BNP 1,450 pg/mL supports the I50.9 referral diagnosis from St. Mark\'s 6 hours ago. No separate cardiac workup needed before starting SOC.',
      tags: [],
    },
  },
  {
    id: 'te-cr-eleanor-3', workItemId: 'cr-eleanor-bnp', type: 'status_change',
    actor: 'u-amelia', timestamp: hoursAgo(8),
    payload: {
      fromStatus: 'reviewed', toStatus: 'acknowledged',
      transitionActions: ['Marked acknowledged', 'Linked to ref-1'],
      notes: null,
    },
  },

  // -- Eleanor Vance: POA ADMIN --------------------------------------------
  {
    id: 'te-ad-eleanor-1', workItemId: 'ad-eleanor-poa', type: 'document_received',
    actor: 'system', actorLabel: 'Family caregiver fax',
    timestamp: hoursAgo(5),
    payload: {
      senderLabel: 'Family caregiver fax',
      documentName: 'POA_Vance_signed.pdf',
      documentPages: 4,
      bodyText: 'POA documentation for Mrs. Vance, signed by daughter. Required for SN visits authorization.',
      tags: ['POA'],
      classificationNote: 'Auto-classified as POA filing',
      delivered: true,
    },
  },
  {
    id: 'te-ad-eleanor-2', workItemId: 'ad-eleanor-poa', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(4),
    payload: {
      bodyText: 'Required before ref-1 can move to scheduled — flagging for cross-dept review.',
      tags: [],
    },
  },

  // -- Beatrice Lindgren: CKD REFERRAL -------------------------------------
  {
    id: 'te-ref6-1', workItemId: 'ref-6', type: 'document_received',
    actor: 'system', actorLabel: 'Cascade IM (Dr. Robert Yuen)',
    timestamp: daysAgo(4),
    payload: {
      senderLabel: 'Cascade IM (Dr. Robert Yuen)',
      documentName: 'Referral_Lindgren_CKD.pdf',
      documentPages: 4,
      bodyText: 'Mrs. Lindgren — CKD stage 3 with stable creatinine, dietary counseling needed. Also requesting cardiology consult given age + comorbidities.',
      tags: ['Referral Rx', 'Labs'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref6-2', workItemId: 'ref-6', type: 'status_change',
    actor: 'u-amelia', timestamp: daysAgo(3),
    payload: {
      fromStatus: 'in_review', toStatus: 'accepted',
      transitionActions: ['Acceptance fax sent', 'Scheduler notified', 'Cardiology consult PA queued'],
      notes: null,
    },
  },
  {
    id: 'te-ref6-3', workItemId: 'ref-6', type: 'status_change',
    actor: 'u-amelia', timestamp: hoursAgo(18),
    payload: {
      fromStatus: 'accepted', toStatus: 'scheduled',
      transitionActions: ['SOC visit booked'],
      notes: null,
    },
  },

  // -- Beatrice Lindgren: CARDIOLOGY CONSULT PA ----------------------------
  {
    id: 'te-pa-beatrice-1', workItemId: 'pa-beatrice-cards', type: 'note',
    actor: 'u-sophia', timestamp: hoursAgo(20),
    payload: {
      bodyText: 'Spawned from CKD referral 4 days ago (Cascade IM, Dr. Yuen, N18.3). Dr. Yuen requesting cardiology consult for HFpEF workup — CKD stage 3 + age 82 + reported orthopnea.',
      tags: [],
    },
  },
  {
    id: 'te-pa-beatrice-2', workItemId: 'pa-beatrice-cards', type: 'document_sent',
    actor: 'u-sophia', timestamp: hoursAgo(20),
    payload: {
      recipientLabel: 'Medicare Advantage PA',
      documentName: 'PA_Lindgren_CardsConsult.pdf',
      documentPages: 3,
      bodyText: 'Submitting PA for cardiology consult (99244). Clinical: CKD stage 3 with HFpEF symptoms.',
      tags: ['PA Request'],
      delivered: true,
    },
  },

  // -- Persephone Mali: ORIGINAL DECLINED REFERRAL (ref-13) ----------------
  {
    id: 'te-ref13-1', workItemId: 'ref-13', type: 'document_received',
    actor: 'system', actorLabel: 'Cascade IM (Dr. Robert Yuen)',
    timestamp: daysAgo(2),
    payload: {
      senderLabel: 'Cascade IM (Dr. Robert Yuen)',
      documentName: 'Referral_Mali_T2DM_initial.pdf',
      documentPages: 3,
      bodyText: 'T2DM management — SN + diabetic education requested. Insurance card attached (Medicaid).',
      tags: ['Referral Rx'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref13-2', workItemId: 'ref-13', type: 'decline',
    actor: 'u-amelia', timestamp: daysAgo(2),
    payload: {
      reason: 'Insurance not accepted',
      notes: 'Patient on Medicaid; Northwind not contracted with this Medicaid plan in this region. Courtesy fax sent to Cascade IM with referral coordinator suggestions.',
      courtesyFaxSent: true,
    },
  },

  // -- Persephone Mali: RESUBMITTED REFERRAL (ref-4) -----------------------
  {
    id: 'te-ref4-1', workItemId: 'ref-4', type: 'document_received',
    actor: 'system', actorLabel: 'Cascade IM (Dr. Robert Yuen)',
    timestamp: hoursAgo(14),
    payload: {
      senderLabel: 'Cascade IM (Dr. Robert Yuen)',
      documentName: 'Referral_Mali_T2DM_v2.pdf',
      documentPages: 3,
      bodyText: 'Resubmitting T2DM referral with updated insurance (Blue Cross). Patient updated coverage 2 days ago after initial decline (ref-13).',
      tags: ['Referral Rx', 'Lab Results'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref4-2', workItemId: 'ref-4', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(6),
    payload: {
      bodyText: 'Pending Blue Cross verification before accepting — patient updated insurance 8 hours ago (ad-persephone-ins). Original referral 2 days ago (ref-13) declined for Medicaid non-contract.',
      tags: [],
    },
  },

  // -- Henry Tobias: REFERRAL ----------------------------------------------
  {
    id: 'te-ref3-1', workItemId: 'ref-3', type: 'document_received',
    actor: 'system', actorLabel: 'Mercy Regional (Dr. Sandra Vu)',
    timestamp: hoursAgo(12),
    payload: {
      senderLabel: 'Mercy Regional (Dr. Sandra Vu)',
      documentName: 'Referral_Tobias_LBP.pdf',
      documentPages: 3,
      bodyText: 'Low back pain — chronic, considering imaging before PT trial. Requesting PT + HHA.',
      tags: ['Referral Rx', 'Insurance Card'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref3-2', workItemId: 'ref-3', type: 'document_sent',
    actor: 'u-amelia', timestamp: hoursAgo(3),
    payload: {
      recipientLabel: 'Mercy Regional',
      documentName: 'F2F_Request_Tobias.pdf',
      documentPages: 2,
      bodyText: 'Missing F2F documentation — please fax notes from most recent visit.',
      tags: ['F2F Request'],
      delivered: true,
    },
  },

  // -- Rosalind Okafor: COMPLETED REFERRAL ---------------------------------
  {
    id: 'te-ref7-1', workItemId: 'ref-7', type: 'document_received',
    actor: 'system', actorLabel: 'University Hospital (Dr. Fatima Osei)',
    timestamp: daysAgo(10),
    payload: {
      senderLabel: 'University Hospital (Dr. Fatima Osei)',
      documentName: 'Referral_Okafor_THA.pdf',
      documentPages: 5,
      bodyText: 'Post-op THA — PT and HHA support.',
      tags: ['Referral Rx', 'Op Report'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref7-2', workItemId: 'ref-7', type: 'status_change',
    actor: 'u-amelia', timestamp: daysAgo(1),
    payload: {
      fromStatus: 'scheduled', toStatus: 'completed',
      transitionActions: ['Episode closed', 'Final fax sent', 'Archived'],
      notes: 'Episode wrapped at 30 days.',
    },
  },

  // -- Theodore Ashworth: REFERRAL + PA ------------------------------------
  {
    id: 'te-ref9-1', workItemId: 'ref-9', type: 'document_received',
    actor: 'system', actorLabel: 'Foothill Clinic (Dr. James Orin)',
    timestamp: hoursAgo(5),
    payload: {
      senderLabel: 'Foothill Clinic (Dr. James Orin)',
      documentName: 'Referral_Ashworth_AF.pdf',
      documentPages: 4,
      bodyText: 'Paroxysmal AF — recurrent episodes, considering EP study/ablation.',
      tags: ['Referral Rx', 'EKG'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref9-2', workItemId: 'ref-9', type: 'link_created',
    actor: 'u-daniel', timestamp: hoursAgo(2),
    payload: {
      linkedWorkItemId: 'pa-theodore-ep',
      relationship: 'spawned',
      bodyText: 'EP study PA queued — see pa-theodore-ep.',
    },
  },
  {
    id: 'te-pa-theodore-1', workItemId: 'pa-theodore-ep', type: 'document_sent',
    actor: 'u-daniel', timestamp: hoursAgo(2),
    payload: {
      recipientLabel: 'UnitedHealthcare PA',
      documentName: 'PA_Ashworth_EP.pdf',
      documentPages: 6,
      bodyText: 'PA for EP study (93653) with possible ablation. Failed rhythm control trial on flecainide.',
      tags: ['PA Request', 'Clinical Notes'],
      delivered: true,
    },
  },

  // -- Lillian Castellanos: REFERRAL + PA ----------------------------------
  {
    id: 'te-ref10-1', workItemId: 'ref-10', type: 'document_received',
    actor: 'system', actorLabel: 'University Hospital (Dr. Fatima Osei)',
    timestamp: daysAgo(2),
    payload: {
      senderLabel: 'University Hospital (Dr. Fatima Osei)',
      documentName: 'Referral_Castellanos_NSTEMI.pdf',
      documentPages: 7,
      bodyText: 'Post-PCI follow-up referral — cardiac rehab + post-MI clinic visit.',
      tags: ['Referral Rx', 'Discharge Summary', 'Cath Report'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref10-2', workItemId: 'ref-10', type: 'status_change',
    actor: 'u-sophia', timestamp: hoursAgo(8),
    payload: {
      fromStatus: 'in_review', toStatus: 'accepted',
      transitionActions: ['Acceptance fax sent', 'Cardiac rehab scheduler notified'],
      notes: null,
    },
  },
  {
    id: 'te-pa-lillian-1', workItemId: 'pa-lillian-angio', type: 'document_received',
    actor: 'system', actorLabel: 'Medicare Advantage',
    timestamp: daysAgo(1),
    payload: {
      senderLabel: 'Medicare Advantage',
      documentName: 'PA_Approval_MAPD2026008812.pdf',
      documentPages: 1,
      bodyText: 'Authorization #MAPD-2026-008812 approved for diagnostic coronary angiography. Valid 14 days.',
      tags: ['Auth Approval'],
      classificationNote: 'Auto-classified as PA decision',
      delivered: true,
    },
  },

  // -- Quincy Devereux: REFERRAL + LIPID -----------------------------------
  {
    id: 'te-ref11-1', workItemId: 'ref-11', type: 'document_received',
    actor: 'system', actorLabel: 'Mercy Regional (Dr. Sandra Vu)',
    timestamp: hoursAgo(16),
    payload: {
      senderLabel: 'Mercy Regional (Dr. Sandra Vu)',
      documentName: 'Referral_Devereux_AS.pdf',
      documentPages: 5,
      bodyText: 'Severe symptomatic AS — TAVR evaluation requested.',
      tags: ['Referral Rx', 'Echo Report'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref11-2', workItemId: 'ref-11', type: 'note',
    actor: 'u-daniel', timestamp: hoursAgo(4),
    payload: {
      bodyText: 'Lipid panel (cr-quincy-lipid) returned within goal. Proceeding with TAVR CT planning request.',
      tags: [],
    },
  },
  {
    id: 'te-cr-quincy-1', workItemId: 'cr-quincy-lipid', type: 'document_received',
    actor: 'system', actorLabel: 'Mercy Regional Lab',
    timestamp: hoursAgo(36),
    payload: {
      senderLabel: 'Mercy Regional Lab',
      documentName: 'Lipid_Devereux.pdf',
      documentPages: 1,
      bodyText: 'Total chol 178, LDL 96.',
      tags: ['Lab', 'Routine'],
      classificationNote: null,
      delivered: true,
    },
  },

  // -- Mei-Lin Sato: REFERRAL + IRON + EPO ---------------------------------
  {
    id: 'te-ref12-1', workItemId: 'ref-12', type: 'document_received',
    actor: 'system', actorLabel: "St. Mark's Hospital (Dr. Patricia Holt)",
    timestamp: daysAgo(3),
    payload: {
      senderLabel: "St. Mark's Hospital (Dr. Patricia Holt)",
      documentName: 'Referral_Sato_HFpEF.pdf',
      documentPages: 4,
      bodyText: 'HFpEF + iron-deficiency anemia. Requesting cardiology follow-up + IV iron arrangement.',
      tags: ['Referral Rx', 'Labs'],
      classificationNote: 'Auto-classified as referral intake',
      delivered: true,
    },
  },
  {
    id: 'te-ref12-2', workItemId: 'ref-12', type: 'status_change',
    actor: 'u-sophia', timestamp: hoursAgo(20),
    payload: {
      fromStatus: 'accepted', toStatus: 'scheduled',
      transitionActions: ['Cardiology follow-up booked', 'Infusion clinic referral sent'],
      notes: null,
    },
  },
  {
    id: 'te-cr-meilin-1', workItemId: 'cr-meilin-iron', type: 'document_received',
    actor: 'system', actorLabel: "St. Mark's Lab",
    timestamp: hoursAgo(28),
    payload: {
      senderLabel: "St. Mark's Lab",
      documentName: 'IronStudies_Sato.pdf',
      documentPages: 1,
      bodyText: 'Ferritin 14, TSAT 11%.',
      tags: ['Lab', 'Abnormal', 'Follow-up'],
      classificationNote: 'Auto-flagged abnormal — ferritin threshold',
      delivered: true,
    },
  },
  {
    id: 'te-cr-meilin-2', workItemId: 'cr-meilin-iron', type: 'link_created',
    actor: 'u-sophia', timestamp: hoursAgo(6),
    payload: {
      linkedWorkItemId: 'o-meilin-epo',
      relationship: 'spawned',
      bodyText: 'EPO infusion order placed — see o-meilin-epo.',
    },
  },
  {
    id: 'te-o-meilin-1', workItemId: 'o-meilin-epo', type: 'note',
    actor: 'u-sophia', timestamp: hoursAgo(6),
    payload: {
      bodyText: 'Order driven by cr-meilin-iron (ferritin 14). Cross-referenced ref-12.',
      tags: [],
    },
  },

  // -- Reginald Hoffman: STRESS ECHO + ECHO ORDER --------------------------
  {
    id: 'te-cr-reginald-1', workItemId: 'cr-reginald-stress', type: 'document_received',
    actor: 'system', actorLabel: 'Northwind Stress Lab',
    timestamp: daysAgo(3),
    payload: {
      senderLabel: 'Northwind Stress Lab',
      documentName: 'StressEcho_Hoffman.pdf',
      documentPages: 4,
      bodyText: 'Apical wall motion abnormality at peak stress.',
      tags: ['Imaging', 'Abnormal', 'Follow-up'],
      classificationNote: 'Auto-flagged abnormal — wall motion',
      delivered: true,
    },
  },
  {
    id: 'te-cr-reginald-2', workItemId: 'cr-reginald-stress', type: 'automation',
    actor: 'system', timestamp: hoursAgo(4),
    payload: {
      ruleId: 'auto-cr-unack-escalate',
      ruleName: '48h unacknowledged → escalate',
      actionDescription: 'Notified Dr. Quintero — unacknowledged 48h.',
      bodyText: null,
    },
  },
  {
    id: 'te-o-reginald-1', workItemId: 'o-reginald-echo', type: 'note',
    actor: 'u-jordan', timestamp: hoursAgo(4),
    payload: {
      bodyText: 'Follow-up TTE ordered per cr-reginald-stress recommendation.',
      tags: [],
    },
  },

  // -- Yvette Bramwell: CMR + PA + TELEMETRY -------------------------------
  {
    id: 'te-cr-yvette-1', workItemId: 'cr-yvette-cmr', type: 'document_received',
    actor: 'system', actorLabel: 'Northwind MRI',
    timestamp: daysAgo(2),
    payload: {
      senderLabel: 'Northwind MRI',
      documentName: 'CMR_Bramwell.pdf',
      documentPages: 5,
      bodyText: 'LGE in lateral wall — pattern consistent with nonischemic cardiomyopathy.',
      tags: ['Imaging', 'Abnormal'],
      classificationNote: 'Auto-flagged abnormal — LGE pattern',
      delivered: true,
    },
  },
  {
    id: 'te-pa-yvette-1', workItemId: 'pa-yvette-mri', type: 'document_sent',
    actor: 'u-jordan', timestamp: hoursAgo(48),
    payload: {
      recipientLabel: 'Aetna PA',
      documentName: 'PA_Bramwell_CMR.pdf',
      documentPages: 4,
      bodyText: 'PA for cardiac MRI — nonischemic cardiomyopathy workup.',
      tags: ['PA Request', 'Clinical Notes'],
      delivered: true,
    },
  },
  {
    id: 'te-o-yvette-1', workItemId: 'o-yvette-telemetry', type: 'document_received',
    actor: 'system', actorLabel: 'Dr. Quintero',
    timestamp: hoursAgo(18),
    payload: {
      senderLabel: 'Dr. Quintero',
      documentName: 'Order_Bramwell_Telemetry.pdf',
      documentPages: 2,
      bodyText: 'Home BP telemetry kit — 30-day trial for orthostatic monitoring.',
      tags: ['DME', 'Urgent'],
      classificationNote: null,
      delivered: true,
    },
  },

  // -- Henry Tobias: MRI ORDER ---------------------------------------------
  {
    id: 'te-o-henry-1', workItemId: 'o-henry-mri', type: 'note',
    actor: 'u-daniel', timestamp: daysAgo(1),
    payload: {
      bodyText: 'Lumbar MRI ordered per ref-3 clinical course. Booking Thursday slot.',
      tags: [],
    },
  },
  {
    id: 'te-o-henry-2', workItemId: 'o-henry-mri', type: 'status_change',
    actor: 'u-daniel', timestamp: hoursAgo(2),
    payload: {
      fromStatus: 'pending', toStatus: 'in_progress',
      transitionActions: ['Insurance verified', 'Imaging center confirmed'],
      notes: null,
    },
  },

  // -- Oscar Wendell: ABLATION PA + MONITOR --------------------------------
  {
    id: 'te-pa-oscar-1', workItemId: 'pa-oscar-ablation', type: 'document_received',
    actor: 'system', actorLabel: 'Humana',
    timestamp: daysAgo(4),
    payload: {
      senderLabel: 'Humana',
      documentName: 'PA_Approval_HUM2026119003.pdf',
      documentPages: 1,
      bodyText: 'Authorization #HUM-2026-119003 approved for RF ablation. Valid 21 days.',
      tags: ['Auth Approval'],
      classificationNote: 'Auto-classified as PA decision',
      delivered: true,
    },
  },
  {
    id: 'te-o-oscar-1', workItemId: 'o-oscar-monitor', type: 'status_change',
    actor: 'u-daniel', timestamp: daysAgo(2),
    payload: {
      fromStatus: 'in_progress', toStatus: 'fulfilled',
      transitionActions: ['14-day event monitor delivered'],
      notes: 'Post-ablation rhythm surveillance.',
    },
  },

  // -- Persephone Mali: INSURANCE UPDATE ADMIN -----------------------------
  {
    id: 'te-ad-persephone-1', workItemId: 'ad-persephone-ins', type: 'document_received',
    actor: 'system', actorLabel: 'Patient',
    timestamp: hoursAgo(8),
    payload: {
      senderLabel: 'Patient (via fax)',
      documentName: 'InsCard_Mali_BCBS.pdf',
      documentPages: 1,
      bodyText: 'Updated to Blue Cross — please re-verify referral eligibility.',
      tags: ['Insurance Card'],
      classificationNote: null,
      delivered: true,
    },
  },
  {
    id: 'te-ad-persephone-2', workItemId: 'ad-persephone-ins', type: 'note',
    actor: 'u-amelia', timestamp: hoursAgo(6),
    payload: {
      bodyText: 'Posted to ref-4 — holding decision pending Blue Cross verification.',
      tags: [],
    },
  },

  // -- Greta Holstrom: RECORDS REQUEST ADMIN -------------------------------
  {
    id: 'te-ad-greta-1', workItemId: 'ad-greta-records', type: 'document_received',
    actor: 'system', actorLabel: 'Outside cardiology office',
    timestamp: daysAgo(2),
    payload: {
      senderLabel: 'Outside cardiology office',
      documentName: 'RecordsRequest_Holstrom.pdf',
      documentPages: 2,
      bodyText: 'Patient transferring care — requesting records for last 12 months.',
      tags: ['Records Request', 'ROI'],
      classificationNote: 'Auto-classified as records request',
      delivered: true,
    },
  },
  {
    id: 'te-ad-greta-2', workItemId: 'ad-greta-records', type: 'assignment',
    actor: 'u-amelia', timestamp: hoursAgo(20),
    payload: {
      fromUserId: null,
      toUserId: 'u-jordan',
      reason: 'Routed to records coordinator.',
    },
  },

  // -- Rosalind Okafor: DISCHARGE ARCHIVE ----------------------------------
  {
    id: 'te-ad-rosalind-1', workItemId: 'ad-rosalind-discharge', type: 'status_change',
    actor: 'u-amelia', timestamp: daysAgo(1),
    payload: {
      fromStatus: 'in_progress', toStatus: 'completed',
      transitionActions: ['Discharge summary archived', 'Closes referral ref-7'],
      notes: null,
    },
  },

  // -- Theodore Ashworth: ADDRESS CHANGE -----------------------------------
  {
    id: 'te-ad-theodore-1', workItemId: 'ad-theodore-addr', type: 'document_received',
    actor: 'system', actorLabel: 'Patient',
    timestamp: daysAgo(1),
    payload: {
      senderLabel: 'Patient (via mail)',
      documentName: 'AddressChange_Ashworth.pdf',
      documentPages: 1,
      bodyText: 'New address effective immediately.',
      tags: ['Address Change'],
      classificationNote: null,
      delivered: true,
    },
  },
  {
    id: 'te-ad-theodore-2', workItemId: 'ad-theodore-addr', type: 'status_change',
    actor: 'u-sophia', timestamp: hoursAgo(14),
    payload: {
      fromStatus: 'open', toStatus: 'completed',
      transitionActions: ['Chart updated', 'Billing notified'],
      notes: null,
    },
  },

  // -- Reginald Hoffman: DIAGNOSTIC CATH PA (awaiting docs) ----------------
  {
    id: 'te-pa-reginald-1', workItemId: 'pa-reginald-cath', type: 'note',
    actor: 'u-jordan', timestamp: hoursAgo(36),
    payload: {
      bodyText: 'PA initiated for diagnostic cath after stress-echo wall-motion finding (cr-reginald-stress). Holding submission to Blue Cross until Dr. Quintero clinical note + stress-echo addendum arrive — Blue Cross requires both for cath PA.',
      tags: [],
    },
  },
  {
    id: 'te-pa-reginald-2', workItemId: 'pa-reginald-cath', type: 'document_sent',
    actor: 'u-jordan', timestamp: hoursAgo(30),
    payload: {
      recipientLabel: 'Dr. Marisol Quintero',
      documentName: 'Doc_Request_Hoffman_Cath.pdf',
      documentPages: 1,
      bodyText: 'Requesting clinical note and stress-echo addendum to support diagnostic cath PA to Blue Cross.',
      tags: ['F2F Docs'],
      delivered: true,
    },
  },
  {
    id: 'te-pa-reginald-3', workItemId: 'pa-reginald-cath', type: 'note',
    actor: 'u-jordan', timestamp: hoursAgo(4),
    payload: {
      bodyText: 'Still awaiting clinical note from Dr. Quintero. Will follow up tomorrow if not received.',
      tags: [],
    },
  },

  // -- Quincy Devereux: TAVR CT PA (denied) --------------------------------
  {
    id: 'te-pa-quincy-1', workItemId: 'pa-quincy-tavr-ct', type: 'document_sent',
    actor: 'u-daniel', timestamp: daysAgo(6),
    payload: {
      recipientLabel: 'Blue Cross PA',
      documentName: 'PA_Devereux_TAVRCT.pdf',
      documentPages: 5,
      bodyText: 'PA for CT angiography (75574) for TAVR planning — severe symptomatic AS per echo report.',
      tags: ['PA Request', 'Clinical Notes'],
      delivered: true,
    },
  },
  {
    id: 'te-pa-quincy-2', workItemId: 'pa-quincy-tavr-ct', type: 'document_received',
    actor: 'system', actorLabel: 'Blue Cross',
    timestamp: daysAgo(2),
    payload: {
      senderLabel: 'Blue Cross',
      documentName: 'PA_Denial_BCBS_Devereux.pdf',
      documentPages: 2,
      bodyText: 'Denial letter — TAVR planning CT not a covered benefit under the patient\'s current plan rider. Coverage requires upgrade to imaging benefit tier, or member appeal with cardiology documentation of medical necessity.',
      tags: ['Auth Denial'],
      classificationNote: 'Auto-classified as PA decision',
      delivered: true,
    },
  },
  {
    id: 'te-pa-quincy-3', workItemId: 'pa-quincy-tavr-ct', type: 'decline',
    actor: 'u-daniel', timestamp: daysAgo(2),
    payload: {
      reason: 'Service not covered by plan',
      notes: 'Blue Cross denial: TAVR planning CT not covered under current plan rider. Working with TAVR coordinator on appeal; in parallel exploring TEE as an alternative planning study.',
      courtesyFaxSent: false,
    },
  },
  {
    id: 'te-pa-quincy-4', workItemId: 'pa-quincy-tavr-ct', type: 'automation',
    actor: 'system', timestamp: daysAgo(2),
    payload: {
      ruleId: 'auto-pa-denied-notify',
      ruleName: 'Notify on denial',
      actionDescription: 'Notified Daniel Reyes — PA denied.',
      bodyText: null,
    },
  },

  // -- Henry Tobias: LUMBAR MRI PA (expired) -------------------------------
  {
    id: 'te-pa-henry-1', workItemId: 'pa-henry-mri-pa', type: 'document_sent',
    actor: 'u-daniel', timestamp: daysAgo(45),
    payload: {
      recipientLabel: 'Aetna PA',
      documentName: 'PA_Tobias_LumbarMRI.pdf',
      documentPages: 3,
      bodyText: 'PA for lumbar MRI (72148) — chronic low back pain workup prior to PT trial.',
      tags: ['PA Request'],
      delivered: true,
    },
  },
  {
    id: 'te-pa-henry-2', workItemId: 'pa-henry-mri-pa', type: 'document_received',
    actor: 'system', actorLabel: 'Aetna',
    timestamp: daysAgo(43),
    payload: {
      senderLabel: 'Aetna',
      documentName: 'PA_Approval_AET2025330451.pdf',
      documentPages: 1,
      bodyText: 'Authorization #AET-2025-330451 approved for lumbar MRI. Valid 38 days.',
      tags: ['Auth Approval'],
      classificationNote: 'Auto-classified as PA decision',
      delivered: true,
    },
  },
  {
    id: 'te-pa-henry-3', workItemId: 'pa-henry-mri-pa', type: 'note',
    actor: 'u-daniel', timestamp: daysAgo(20),
    payload: {
      bodyText: 'Patient elected PT-first trial per Dr. Vu — deferring imaging. Will re-request PA if PT fails.',
      tags: [],
    },
  },
  {
    id: 'te-pa-henry-4', workItemId: 'pa-henry-mri-pa', type: 'status_change',
    actor: 'system', timestamp: daysAgo(5),
    payload: {
      fromStatus: 'approved', toStatus: 'expired',
      transitionActions: ['Auth window lapsed', 'Notified assignee'],
      notes: 'Service not rendered within 38-day window. Re-submission required if MRI ordered.',
    },
  },
]

// =============================================================================
// AUTOMATIONS — translated from Phase 8 + per-department defaults
// =============================================================================
//
// Phase 8 mockAutomations live in app/app/settings/automations/mockAutomationsData.ts;
// they're fax-/referral-centric. Here we translate them into the generic
// AutomationRule shape and add reasonable defaults for the other four
// departments. Action shapes use the plan's tagged union (`assign_to`,
// `set_status`, `add_tag`, `notify`, `send_document`, `start_sla_timer`).
// =============================================================================

export const mockAutomations: AutomationRule[] = [
  // -- Referrals (translated from Phase 8) ---------------------------------
  {
    id: 'auto-ref-acknowledge',
    departmentType: 'referrals',
    name: 'Auto-acknowledge new referrals',
    description: 'Sends a confirmation fax to the referring physician when a new referral is received and starts the 4h SLA timer.',
    trigger: 'document_received',
    conditions: [
      { field: 'document_type', operator: 'equals', value: 'referral' },
    ],
    actions: [
      { type: 'send_document', templateId: 'tpl-ack-fax', recipientHint: 'referring_physician' },
      { type: 'start_sla_timer', durationMs: 4 * 3_600_000 },
    ],
    enabled: true,
  },
  {
    id: 'auto-ref-sla-breach',
    departmentType: 'referrals',
    name: 'SLA breach alert',
    description: 'Notifies the assigned coordinator when a referral SLA is about to be breached.',
    trigger: 'sla_approaching',
    conditions: [
      { field: 'time_remaining_hours', operator: 'less_than', value: 1 },
    ],
    actions: [
      { type: 'notify', userId: 'u-amelia' },
    ],
    enabled: true,
  },
  {
    id: 'auto-ref-accepted-poc',
    departmentType: 'referrals',
    name: 'Accepted → send POC fax',
    description: 'Automatically sends plan of care when a referral moves to Accepted.',
    trigger: 'status_changed',
    conditions: [
      { field: 'status', operator: 'changes_to', value: 'accepted' },
    ],
    actions: [
      { type: 'send_document', templateId: 'tpl-poc', recipientHint: 'patient' },
      { type: 'notify', userId: 'u-amelia' },
    ],
    enabled: false,
  },

  // -- Prior Auth -----------------------------------------------------------
  {
    id: 'auto-pa-acknowledge-submission',
    departmentType: 'prior_auth',
    name: 'Auto-acknowledge submission',
    description: 'Notifies the PA coordinator and starts a 3-day decision SLA timer when a PA is submitted to a payer.',
    trigger: 'status_changed',
    conditions: [
      { field: 'status', operator: 'changes_to', value: 'submitted' },
    ],
    actions: [
      { type: 'notify', userId: 'u-amelia' },
      { type: 'start_sla_timer', durationMs: 3 * 24 * 3_600_000 },
    ],
    enabled: true,
  },
  {
    id: 'auto-pa-expiring',
    departmentType: 'prior_auth',
    name: 'Alert 7 days before expiration',
    description: 'Notifies the assignee and tags the item when a PA auth is within 7 days of expiring.',
    trigger: 'sla_approaching',
    conditions: [
      { field: 'time_until_expiry_hours', operator: 'less_than', value: 168 },
    ],
    actions: [
      { type: 'notify', userId: 'u-amelia' },
      { type: 'add_tag', tag: 'Expiring soon' },
    ],
    enabled: true,
  },
  {
    id: 'auto-pa-approved-notify',
    departmentType: 'prior_auth',
    name: 'PA approved → notify scheduler',
    description: 'Notifies scheduling when an auth is approved so the service can be booked.',
    trigger: 'status_changed',
    conditions: [
      { field: 'status', operator: 'changes_to', value: 'approved' },
    ],
    actions: [
      { type: 'notify', userId: 'u-sophia' },
    ],
    enabled: true,
  },
  {
    id: 'auto-pa-denied-notify',
    departmentType: 'prior_auth',
    name: 'Notify on denial',
    description: 'Notifies the PA assignee and tags the item when a payer denies an authorization request.',
    trigger: 'status_changed',
    conditions: [
      { field: 'status', operator: 'changes_to', value: 'denied' },
    ],
    actions: [
      { type: 'notify', userId: 'u-daniel' },
      { type: 'add_tag', tag: 'Denied — review for appeal' },
    ],
    enabled: true,
  },

  // -- Clinical Results -----------------------------------------------------
  {
    id: 'auto-cr-abnormal-flag',
    departmentType: 'clinical_results',
    name: 'Abnormal result → flag for review',
    description: 'Tags abnormal results and routes them to the ordering provider.',
    trigger: 'document_received',
    conditions: [
      { field: 'abnormal', operator: 'equals', value: true },
    ],
    actions: [
      { type: 'add_tag', tag: 'Abnormal' },
      { type: 'notify', userId: 'u-daniel' },
    ],
    enabled: true,
  },
  {
    id: 'auto-cr-stat-page',
    departmentType: 'clinical_results',
    name: 'STAT result → page on-call',
    description: 'Pages the on-call clinician when a result carries the STAT tag.',
    trigger: 'document_received',
    conditions: [
      { field: 'tags', operator: 'contains', value: 'STAT' },
    ],
    actions: [
      { type: 'notify', userId: 'u-daniel' },
    ],
    enabled: true,
  },
  {
    id: 'auto-cr-unack-escalate',
    departmentType: 'clinical_results',
    name: '48h unacknowledged → escalate',
    description: 'Escalates abnormal results that remain unacknowledged for 48 hours.',
    trigger: 'sla_approaching',
    conditions: [
      { field: 'hours_unacknowledged', operator: 'greater_than', value: 48 },
      { field: 'abnormal',             operator: 'equals',       value: true },
    ],
    actions: [
      { type: 'notify', userId: 'u-amelia' },
      { type: 'add_tag', tag: 'Escalated' },
    ],
    enabled: true,
  },

  // -- Orders ---------------------------------------------------------------
  {
    id: 'auto-orders-fulfilled-notify',
    departmentType: 'orders',
    name: 'Order fulfilled → notify referring',
    description: 'Sends a fulfillment notice to the ordering provider when an order is marked fulfilled.',
    trigger: 'status_changed',
    conditions: [
      { field: 'status', operator: 'changes_to', value: 'fulfilled' },
    ],
    actions: [
      { type: 'send_document', templateId: 'tpl-fulfillment', recipientHint: 'ordering_provider' },
    ],
    enabled: true,
  },
  {
    id: 'auto-orders-unassigned-reassign',
    departmentType: 'orders',
    name: 'Order unassigned 4h → reassign',
    description: 'Reassigns an order to the orders coordinator if it sits unassigned for 4 hours.',
    trigger: 'item_unassigned',
    conditions: [
      { field: 'hours_unassigned', operator: 'greater_than', value: 4 },
    ],
    actions: [
      { type: 'assign_to', userId: 'u-jordan' },
    ],
    enabled: true,
  },

  // -- Admin ----------------------------------------------------------------
  {
    id: 'auto-admin-records-route',
    departmentType: 'admin',
    name: 'Records request received → route to coordinator',
    description: 'Routes inbound records requests to the records coordinator.',
    trigger: 'document_received',
    conditions: [
      { field: 'document_type', operator: 'equals', value: 'records_request' },
    ],
    actions: [
      { type: 'assign_to', userId: 'u-jordan' },
      { type: 'add_tag', tag: 'Records Request' },
    ],
    enabled: true,
  },
  {
    id: 'auto-admin-insurance-notify',
    departmentType: 'admin',
    name: 'Insurance update → notify billing',
    description: 'Notifies billing when a patient updates insurance information.',
    trigger: 'document_received',
    conditions: [
      { field: 'document_type', operator: 'equals', value: 'insurance_card' },
    ],
    actions: [
      { type: 'notify', userId: 'u-amelia' },
    ],
    enabled: true,
  },
]
