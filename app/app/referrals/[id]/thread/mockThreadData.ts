export type EventType = 'fax_inbound' | 'fax_outbound' | 'auto_fax' | 'pipeline_transition' | 'note'
export type Direction = 'inbound' | 'outbound' | 'auto' | 'system'

export type ThreadEvent = {
  id: string
  eventType: EventType
  direction: Direction
  senderLabel: string
  bodyText: string | null
  documentName: string | null
  documentPages: number | null
  pipelineFromStatus: string | null
  pipelineToStatus: string | null
  transitionActions: string[] | null
  tags: string[]
  timestamp: string
  delivered: boolean
  classificationNote: string | null
}

export type ThreadPatient = {
  name: string
  age: number
  dob: string
  mrn: string
  insurance: string
  currentStatus: string
  referringOrg: string
  referringPhysician: string
  assignedTo: string
  episodeValueCents: number
}

export const mockPatient: ThreadPatient = {
  name: 'Marcus Whitfield',
  age: 71, dob: '1953-09-22', mrn: 'FC-77821',
  insurance: 'Humana',
  currentStatus: 'accepted',
  referringOrg: 'Foothill Clinic',
  referringPhysician: 'Dr. James Orin',
  assignedTo: 'Amelia Park',
  episodeValueCents: 612000,
}

export const mockThreadEvents: ThreadEvent[] = [
  {
    id: 'e1', eventType: 'fax_inbound', direction: 'inbound',
    senderLabel: 'Foothill Clinic (Dr. James Orin)',
    bodyText: 'Please find attached referral documentation for Marcus Whitfield. Patient requires PT, OT, and Speech Therapy following cerebral infarction. Insurance pre-authorization attached.',
    documentName: 'Referral_Whitfield_FC77821.pdf', documentPages: 4,
    pipelineFromStatus: null, pipelineToStatus: null, transitionActions: null,
    tags: ['Referral Rx', 'H&P'],
    timestamp: 'Jun 12, 9:04 AM', delivered: true,
    classificationNote: 'Auto-classified as referral intake',
  },
  {
    id: 'e2', eventType: 'auto_fax', direction: 'auto',
    senderLabel: 'Blue Lark Automation',
    bodyText: 'Acknowledgment fax sent to Foothill Clinic confirming receipt of referral for Marcus Whitfield.',
    documentName: 'Acknowledgment_FC77821.pdf', documentPages: 1,
    pipelineFromStatus: null, pipelineToStatus: null, transitionActions: null,
    tags: ['Auto'],
    timestamp: 'Jun 12, 9:05 AM', delivered: true,
    classificationNote: 'Triggered by: Auto-acknowledge new referrals',
  },
  {
    id: 'e3', eventType: 'pipeline_transition', direction: 'system',
    senderLabel: 'Amelia Park',
    bodyText: null,
    documentName: null, documentPages: null,
    pipelineFromStatus: 'new', pipelineToStatus: 'in_review',
    transitionActions: ['Acknowledgment fax sent', 'SLA timer started (4h)', 'Patient notification queued'],
    tags: [],
    timestamp: 'Jun 12, 10:30 AM', delivered: true,
    classificationNote: null,
  },
  {
    id: 'e4', eventType: 'fax_outbound', direction: 'outbound',
    senderLabel: 'Amelia Park → Foothill Clinic',
    bodyText: 'Requesting face-to-face documentation for prior authorization. Please fax F2F notes at your earliest convenience.',
    documentName: 'F2F_Request_FC77821.pdf', documentPages: 2,
    pipelineFromStatus: null, pipelineToStatus: null, transitionActions: null,
    tags: ['F2F Request'],
    timestamp: 'Jun 12, 11:15 AM', delivered: true,
    classificationNote: null,
  },
  {
    id: 'e5', eventType: 'pipeline_transition', direction: 'system',
    senderLabel: 'Amelia Park',
    bodyText: null,
    documentName: null, documentPages: null,
    pipelineFromStatus: 'in_review', pipelineToStatus: 'accepted',
    transitionActions: ['Acceptance fax sent to Foothill Clinic', 'Prior auth request queued', 'Scheduler notified'],
    tags: [],
    timestamp: 'Jun 13, 8:45 AM', delivered: true,
    classificationNote: null,
  },
  {
    id: 'e6', eventType: 'fax_outbound', direction: 'outbound',
    senderLabel: 'Amelia Park → Marcus Whitfield',
    bodyText: 'Plan of care attached for your review and signature. Please sign and return at your earliest convenience.',
    documentName: 'POC_Whitfield_FC77821.pdf', documentPages: 6,
    pipelineFromStatus: null, pipelineToStatus: null, transitionActions: null,
    tags: ['POC'],
    timestamp: 'Jun 13, 9:20 AM', delivered: true,
    classificationNote: null,
  },
  {
    id: 'e7', eventType: 'fax_inbound', direction: 'inbound',
    senderLabel: 'Foothill Clinic (F2F docs)',
    bodyText: null,
    documentName: 'F2F_Documentation_FC77821.pdf', documentPages: 3,
    pipelineFromStatus: null, pipelineToStatus: null, transitionActions: null,
    tags: ['F2F Docs', 'PA Support'],
    timestamp: 'Jun 13, 2:11 PM', delivered: true,
    classificationNote: 'Auto-classified as F2F documentation',
  },
]

export const PIPELINE_STAGES = ['new', 'in_review', 'accepted', 'scheduled', 'completed']

export const STAGE_LABELS: Record<string, string> = {
  new: 'New', in_review: 'In Review', accepted: 'Accepted',
  scheduled: 'Scheduled', completed: 'Completed',
}

export const NEXT_ACTION_HINTS: Partial<Record<string, { label: string; actions: string[] }>> = {
  accepted: {
    label: 'Advance to Scheduled',
    actions: ['Send POC for signature', 'Request prior auth', 'Book SOC visit'],
  },
  in_review: {
    label: 'Advance to Accepted',
    actions: ['Send acceptance fax', 'Request F2F if missing', 'Queue PA', 'Notify scheduler'],
  },
  new: {
    label: 'Advance to In Review',
    actions: ['Send acknowledgment fax', 'Start 4h SLA', 'Notify patient'],
  },
  scheduled: {
    label: 'Advance to Completed',
    actions: ['Send completion notice', 'Finalize episode billing', 'Close referral thread'],
  },
}

export const TEMPLATE_CHIPS = [
  'POC for signature',
  'Prior auth request',
  'F2F documentation',
  'Follow-up reminder',
]
