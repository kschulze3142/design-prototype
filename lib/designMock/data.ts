import type {
  DesignMock,
  Fax,
  PatientRecord,
  RoutingRule,
  DashboardStats,
} from './types';

const patients: readonly PatientRecord[] = [
  { id: 'pt-1001', name: 'Maya Okafor',     mrn: 'MRN-48201', status: 'active',         linkedFaxIds: ['fx-002', 'fx-009'] },
  { id: 'pt-1002', name: 'Daniel Reyes',    mrn: 'MRN-48217', status: 'pending-review', linkedFaxIds: ['fx-004'] },
  { id: 'pt-1003', name: 'Priya Anand',     mrn: 'MRN-48233', status: 'active',         linkedFaxIds: ['fx-006'] },
  { id: 'pt-1004', name: 'Jordan Whitman',  mrn: 'MRN-48259', status: 'pending-review', linkedFaxIds: ['fx-011'] },
  { id: 'pt-1005', name: 'Lena Kovalenko',  mrn: 'MRN-48274', status: 'archived',       linkedFaxIds: [] },
] as const;

const routingRules: readonly RoutingRule[] = [
  {
    id: 'rr-1',
    name: 'Mercy Cardiology referrals',
    match: { kind: 'from-number', value: '+12125551080' },
    destination: { kind: 'department', value: 'Cardiology' },
    enabled: true,
  },
  {
    id: 'rr-2',
    name: 'Lab results keyword',
    match: { kind: 'keyword', value: 'LabCorp' },
    destination: { kind: 'inbox', value: 'Lab Results' },
    enabled: true,
  },
  {
    id: 'rr-3',
    name: 'Patient intake line',
    match: { kind: 'recipient-line', value: '+15551239090' },
    destination: { kind: 'patient', value: 'intake-queue' },
    enabled: true,
  },
  {
    id: 'rr-4',
    name: 'Legacy clinic forwarder',
    match: { kind: 'from-number', value: '+13125557211' },
    destination: { kind: 'inbox', value: 'Records' },
    enabled: false,
  },
] as const;

// 12 faxes. Coverage:
//   delivered: fx-001, fx-007, fx-012
//   sending:   fx-005, fx-010
//   failed:    fx-003, fx-008
//   received:  fx-002, fx-004, fx-006, fx-009, fx-011
// patientRef + routingRuleId both present on: fx-002, fx-004, fx-006 (3 inbound).
const faxes: readonly Fax[] = [
  {
    id: 'fx-001',
    direction: 'outbound',
    status: 'delivered',
    fromNumber: '+15551239090',
    toNumber: '+12125550144',
    pageCount: 3,
    timestamp: '2026-05-29T14:12:00Z',
  },
  {
    id: 'fx-002',
    direction: 'inbound',
    status: 'received',
    fromNumber: '+12125551080',
    toNumber: '+15551239090',
    pageCount: 6,
    timestamp: '2026-05-29T13:48:00Z',
    patientRef: patients[0],
    routingRuleId: 'rr-1',
  },
  {
    id: 'fx-003',
    direction: 'outbound',
    status: 'failed',
    fromNumber: '+15551239090',
    toNumber: '+18185550199',
    pageCount: 2,
    timestamp: '2026-05-29T11:22:00Z',
  },
  {
    id: 'fx-004',
    direction: 'inbound',
    status: 'received',
    fromNumber: '+18005558701',
    toNumber: '+15551239090',
    pageCount: 4,
    timestamp: '2026-05-29T10:05:00Z',
    patientRef: patients[1],
    routingRuleId: 'rr-2',
  },
  {
    id: 'fx-005',
    direction: 'outbound',
    status: 'sending',
    fromNumber: '+15551239090',
    toNumber: '+14155550172',
    pageCount: 8,
    timestamp: '2026-05-29T09:51:00Z',
  },
  {
    id: 'fx-006',
    direction: 'inbound',
    status: 'received',
    fromNumber: '+18005558701',
    toNumber: '+15551239090',
    pageCount: 2,
    timestamp: '2026-05-29T09:14:00Z',
    patientRef: patients[2],
    routingRuleId: 'rr-2',
  },
  {
    id: 'fx-007',
    direction: 'outbound',
    status: 'delivered',
    fromNumber: '+15551239090',
    toNumber: '+13125557211',
    pageCount: 1,
    timestamp: '2026-05-28T22:30:00Z',
  },
  {
    id: 'fx-008',
    direction: 'outbound',
    status: 'failed',
    fromNumber: '+15551239090',
    toNumber: '+17185550106',
    pageCount: 5,
    timestamp: '2026-05-28T17:48:00Z',
  },
  {
    id: 'fx-009',
    direction: 'inbound',
    status: 'received',
    fromNumber: '+19495550155',
    toNumber: '+15551239090',
    pageCount: 7,
    timestamp: '2026-05-28T15:20:00Z',
    patientRef: patients[0],
  },
  {
    id: 'fx-010',
    direction: 'outbound',
    status: 'sending',
    fromNumber: '+15551239090',
    toNumber: '+12025550111',
    pageCount: 3,
    timestamp: '2026-05-28T12:02:00Z',
  },
  {
    id: 'fx-011',
    direction: 'inbound',
    status: 'received',
    fromNumber: '+16175550199',
    toNumber: '+15551239090',
    pageCount: 10,
    timestamp: '2026-05-28T09:41:00Z',
    patientRef: patients[3],
  },
  {
    id: 'fx-012',
    direction: 'outbound',
    status: 'delivered',
    fromNumber: '+15551239090',
    toNumber: '+12125550144',
    pageCount: 2,
    timestamp: '2026-05-27T20:15:00Z',
  },
] as const;

const stats: DashboardStats = {
  faxesSentThisMonth: 184,
  faxesReceivedThisMonth: 226,
  deliverySuccessRate: 0.962,
  pagesUsed: 1428,
  pagesCap: 2500,
  recentActivity: [
    { id: 'act-1', timestamp: '2026-05-29T14:12:00Z', kind: 'fax-sent',       description: 'Discharge summary delivered to NYU Cardiology',          faxId: 'fx-001' },
    { id: 'act-2', timestamp: '2026-05-29T13:49:00Z', kind: 'rule-applied',   description: '"Mercy Cardiology referrals" routed inbound to Cardiology', faxId: 'fx-002' },
    { id: 'act-3', timestamp: '2026-05-29T13:49:00Z', kind: 'patient-linked', description: 'Inbound fax linked to Maya Okafor (MRN-48201)',           faxId: 'fx-002' },
    { id: 'act-4', timestamp: '2026-05-29T11:23:00Z', kind: 'fax-failed',     description: 'Send to +1 818 555 0199 failed: line busy after 3 retries', faxId: 'fx-003' },
    { id: 'act-5', timestamp: '2026-05-29T10:06:00Z', kind: 'fax-received',   description: 'LabCorp results received for Daniel Reyes',               faxId: 'fx-004' },
    { id: 'act-6', timestamp: '2026-05-29T09:52:00Z', kind: 'fax-sent',       description: 'Prior auth packet sending to Anthem Blue Cross',           faxId: 'fx-005' },
    { id: 'act-7', timestamp: '2026-05-28T17:49:00Z', kind: 'fax-failed',     description: 'Send to +1 718 555 0106 failed: remote not answering',     faxId: 'fx-008' },
  ],
};

export const designMock: DesignMock = Object.freeze({
  faxes,
  patients,
  routingRules,
  stats,
});
