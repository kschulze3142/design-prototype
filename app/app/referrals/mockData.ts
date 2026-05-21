export type ReferralStatus = 'new' | 'in_review' | 'accepted' | 'scheduled' | 'completed';

export type Referral = {
  id: string;
  patientName: string;
  mrn: string;
  age: number;
  sex: 'M' | 'F';
  referringOrg: string;
  referringPhysician: string;
  insurance: string;
  diagnosisCode: string;
  diagnosisText: string;
  services: string[];
  status: ReferralStatus;
  assignedTo: { name: string; initials: string };
  slaBreached: boolean;
  slaDueAt: string;
  episodeValueCents: number;
  threadCount: number;
  nextAction: string | null;
  docTags: string[];
};

export const mockReferrals: Referral[] = [
  {
    id: '1', patientName: 'Eleanor Vance', mrn: 'SM-2284417', age: 78, sex: 'F',
    referringOrg: "St. Mark's Hospital", referringPhysician: 'Dr. Patricia Holt',
    insurance: 'Medicare Part A', diagnosisCode: 'I50.9', diagnosisText: 'Heart failure, unspecified',
    services: ['Skilled Nursing', 'PT', 'OT'], status: 'new',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '4h remaining',
    episodeValueCents: 487500, threadCount: 2,
    nextAction: 'Verify insurance eligibility',
    docTags: ['Referral Rx', 'H&P'],
  },
  {
    id: '2', patientName: 'Cordelia Brennan', mrn: 'FC-77756', age: 81, sex: 'F',
    referringOrg: 'Foothill Clinic', referringPhysician: 'Dr. James Orin',
    insurance: 'UnitedHealthcare', diagnosisCode: 'J44.1', diagnosisText: 'COPD with acute exacerbation',
    services: ['Skilled Nursing', 'Respiratory Therapy'], status: 'new',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: true, slaDueAt: 'Overdue',
    episodeValueCents: 392000, threadCount: 0,
    nextAction: 'Call referring office',
    docTags: ['Referral Rx'],
  },
  {
    id: '3', patientName: 'Henry Tobias', mrn: 'MR-019874', age: 64, sex: 'M',
    referringOrg: 'Mercy Regional', referringPhysician: 'Dr. Sandra Vu',
    insurance: 'Aetna', diagnosisCode: 'M54.5', diagnosisText: 'Low back pain',
    services: ['PT', 'HHA'], status: 'in_review',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '8h remaining',
    episodeValueCents: 215000, threadCount: 3,
    nextAction: 'Request missing face-to-face',
    docTags: ['Referral Rx', 'Insurance Card'],
  },
  {
    id: '4', patientName: 'Persephone Mali', mrn: 'CI-44178', age: 72, sex: 'F',
    referringOrg: 'Cascade IM', referringPhysician: 'Dr. Robert Yuen',
    insurance: 'Blue Cross', diagnosisCode: 'E11.9', diagnosisText: 'Type 2 diabetes',
    services: ['Skilled Nursing', 'Diabetic Education'], status: 'in_review',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '12h remaining',
    episodeValueCents: 178000, threadCount: 1,
    nextAction: 'Queue prior auth',
    docTags: ['Referral Rx', 'Lab Results'],
  },
  {
    id: '5', patientName: 'Marcus Whitfield', mrn: 'FC-77821', age: 71, sex: 'M',
    referringOrg: 'Foothill Clinic', referringPhysician: 'Dr. James Orin',
    insurance: 'Humana', diagnosisCode: 'I63.9', diagnosisText: 'Cerebral infarction',
    services: ['PT', 'OT', 'Speech Therapy'], status: 'accepted',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '24h remaining',
    episodeValueCents: 612000, threadCount: 5,
    nextAction: 'Send POC for signature',
    docTags: ['Referral Rx', 'H&P', 'Discharge Summary'],
  },
  {
    id: '6', patientName: 'Beatrice Lindgren', mrn: 'CI-44211', age: 82, sex: 'F',
    referringOrg: 'Cascade IM', referringPhysician: 'Dr. Robert Yuen',
    insurance: 'Medicare Advantage', diagnosisCode: 'N18.3', diagnosisText: 'Chronic kidney disease, stage 3',
    services: ['Skilled Nursing', 'Dietitian'], status: 'scheduled',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '48h remaining',
    episodeValueCents: 334000, threadCount: 4,
    nextAction: 'Confirm SOC visit time',
    docTags: ['Referral Rx', 'Labs'],
  },
  {
    id: '7', patientName: 'Rosalind Okafor', mrn: 'UH-90122', age: 67, sex: 'F',
    referringOrg: 'University Hospital', referringPhysician: 'Dr. Fatima Osei',
    insurance: 'Cigna', diagnosisCode: 'Z96.641', diagnosisText: 'R. artificial hip joint',
    services: ['PT', 'HHA'], status: 'completed',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '',
    episodeValueCents: 289000, threadCount: 7,
    nextAction: null,
    docTags: ['Referral Rx', 'Op Report'],
  },
  {
    id: '8', patientName: 'Cordelia Brennan', mrn: 'FC-77756', age: 81, sex: 'F',
    referringOrg: 'Foothill Clinic', referringPhysician: 'Dr. James Orin',
    insurance: 'Medicaid', diagnosisCode: 'F32.9', diagnosisText: 'Major depressive disorder',
    services: ['Behavioral Health'], status: 'new',
    assignedTo: { name: 'Amelia Park', initials: 'AP' },
    slaBreached: false, slaDueAt: '6h remaining',
    episodeValueCents: 145000, threadCount: 0,
    nextAction: 'Review referral documents',
    docTags: ['Referral Rx'],
  },
];

export type DeclinedReferral = {
  id: string;
  patientName: string;
  mrn: string;
  age: number;
  sex: 'M' | 'F';
  referringOrg: string;
  referringPhysician: string;
  declineReason: string;
  declinedBy: string;
  declinedAt: string;
  courtesyFaxSent: boolean;
};

export const mockDeclinedReferrals: DeclinedReferral[] = [
  {
    id: 'd1', patientName: 'Persephone Mali', mrn: 'CI-44178', age: 72, sex: 'F',
    referringOrg: 'Cascade IM', referringPhysician: 'Dr. Robert Yuen',
    declineReason: 'Insurance not accepted',
    declinedBy: 'Amelia Park',
    declinedAt: '2 days ago',
    courtesyFaxSent: true,
  },
];

export const COLUMNS: { key: ReferralStatus; label: string; dotColor: string }[] = [
  { key: 'new',        label: 'New',        dotColor: '#8896aa' },
  { key: 'in_review',  label: 'In Review',  dotColor: '#f59e0b' },
  { key: 'accepted',   label: 'Accepted',   dotColor: '#3d5080' },
  { key: 'scheduled',  label: 'Scheduled',  dotColor: '#10b981' },
  { key: 'completed',  label: 'Completed',  dotColor: '#6366f1' },
];

export const TRANSITION_BARS: Partial<Record<ReferralStatus, string[]>> = {
  new:       ['Send acknowledgment fax', 'Start 4h SLA', 'Notify patient'],
  in_review: ['Send acceptance fax', 'Request F2F if missing', 'Queue PA', 'Notify scheduler'],
  accepted:  ['Send POC for signature', 'Request prior auth', 'Book SOC visit'],
};

export const MOCK_AUTOMATIONS = [
  { id: 'a1', label: 'Auto-acknowledge new referrals', isActive: true },
  { id: 'a2', label: 'SLA breach alert → assignee',   isActive: true },
  { id: 'a3', label: 'Accepted → send POC fax',       isActive: false },
];
