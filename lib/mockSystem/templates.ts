// =============================================================================
// Department templates
// =============================================================================
//
// Each template defines the shape of work in one department: which statuses
// the queue can hold, which doc tags are surfaceable, which metadata fields
// render on a card, and which automations are seeded by default.
//
// `urgentWhen` callbacks run at render time. The TEMPLATE only signals "this
// value is urgent given its current data"; the consuming component owns the
// urgency styling (red text, alert badge, sort priority, etc.). Keeping the
// callback in the template lets per-dept config (FE-072) tune thresholds
// without touching the renderer.
//
// `statuses` is `string[]`, not a literal enum. Per FE-072 statuses become
// user-customizable, so consumers must validate against `template.statuses`
// at runtime rather than narrowing to a fixed union.
// =============================================================================

import type {
  DepartmentTemplate,
  DepartmentType,
  PracticeType,
} from './types'

const daysUntil = (iso: string | undefined | null): number => {
  if (!iso) return Number.POSITIVE_INFINITY
  return (new Date(iso).getTime() - Date.now()) / 86_400_000
}

// -----------------------------------------------------------------------------
// REFERRALS — mirrors Phase 8 referrals shape so FE-054's port is a
// translation, not a redesign.
// -----------------------------------------------------------------------------
export const referralsTemplate: DepartmentTemplate = {
  type: 'referrals',
  name: 'Referrals',
  displayOrder: 1,
  queueLayout: 'pipeline',
  statuses: ['new', 'in_review', 'accepted', 'scheduled', 'completed', 'declined'],
  docTags: [
    'Referral Rx', 'H&P', 'Insurance Card', 'Lab Results', 'Labs',
    'Discharge Summary', 'Op Report', 'F2F Request', 'F2F Docs',
    'PA Support', 'POC', 'Auto',
  ],
  metadataFields: [
    { key: 'referringOrg',      label: 'Referring org',      format: 'text' },
    { key: 'referringProvider', label: 'Referring provider', format: 'text' },
    { key: 'diagnosisText',     label: 'Diagnosis',          format: 'text' },
    { key: 'services',          label: 'Services',           format: 'pill' },
    { key: 'episodeValueCents', label: 'Episode value',      format: 'currency' },
    { key: 'nextAction',        label: 'Next action',        format: 'text' },
  ],
  supportsDecline: true,
  declineReasons: [
    'Insurance not accepted',
    'Outside service area',
    'Capacity full',
    'Missing required documentation',
    'Patient declined services',
    'Clinical criteria not met',
  ],
  automationDefaults: ['auto-ref-acknowledge', 'auto-ref-sla-breach', 'auto-ref-accepted-poc'],
}

// -----------------------------------------------------------------------------
// PRIOR AUTH — tracker layout. `expiresAt` drives urgency (<3 days = urgent).
// -----------------------------------------------------------------------------
export const priorAuthTemplate: DepartmentTemplate = {
  type: 'prior_auth',
  name: 'Prior Auth',
  displayOrder: 2,
  queueLayout: 'tracker',
  statuses: ['pending', 'submitted', 'approved', 'denied', 'expired'],
  docTags: [
    'Auth Request', 'Auth Decision', 'Clinical Notes', 'F2F Docs',
    'Peer-to-Peer', 'Appeal', 'Auth Approval', 'Auth Denial',
  ],
  metadataFields: [
    { key: 'payer',            label: 'Payer',            format: 'text' },
    { key: 'serviceRequested', label: 'Service',          format: 'text' },
    { key: 'cptCodes',         label: 'CPT',              format: 'pill' },
    { key: 'authNumber',       label: 'Auth #',           format: 'text' },
    { key: 'submittedAt',      label: 'Submitted',        format: 'date' },
    {
      key: 'expiresAt',
      label: 'Expires',
      format: 'date',
      urgentWhen: (v: unknown) => typeof v === 'string' && daysUntil(v) < 3,
    },
  ],
  supportsDecline: false,
  automationDefaults: ['auto-pa-expiring', 'auto-pa-approved-notify'],
}

// -----------------------------------------------------------------------------
// CLINICAL RESULTS — inbox layout. `abnormal` flag renders as a pill and
// flips urgency on when true.
// -----------------------------------------------------------------------------
export const clinicalResultsTemplate: DepartmentTemplate = {
  type: 'clinical_results',
  name: 'Clinical Results',
  displayOrder: 3,
  queueLayout: 'inbox',
  statuses: ['new', 'reviewed', 'acknowledged', 'action_required', 'closed'],
  docTags: [
    'Lab', 'Imaging', 'Pathology', 'STAT', 'Abnormal', 'Critical',
    'Routine', 'Follow-up',
  ],
  metadataFields: [
    { key: 'resultType',       label: 'Type',             format: 'pill' },
    { key: 'headline',         label: 'Headline',         format: 'text' },
    { key: 'orderingProvider', label: 'Ordering provider', format: 'text' },
    { key: 'receivedAt',       label: 'Received',         format: 'date' },
    {
      key: 'abnormal',
      label: 'Abnormal',
      format: 'pill',
      urgentWhen: (v: unknown) => v === true,
    },
    { key: 'acknowledged',     label: 'Acknowledged',     format: 'pill' },
  ],
  supportsDecline: false,
  automationDefaults: ['auto-cr-abnormal-flag', 'auto-cr-stat-page', 'auto-cr-unack-escalate'],
}

// -----------------------------------------------------------------------------
// ORDERS — queue layout.
// -----------------------------------------------------------------------------
export const ordersTemplate: DepartmentTemplate = {
  type: 'orders',
  name: 'Orders',
  displayOrder: 4,
  queueLayout: 'queue',
  statuses: ['pending', 'in_progress', 'fulfilled', 'cancelled'],
  docTags: [
    'DME', 'Lab', 'Imaging', 'Procedure', 'Pharmacy', 'Home Health',
    'Routine', 'Urgent',
  ],
  metadataFields: [
    { key: 'orderType',          label: 'Order type',         format: 'pill' },
    { key: 'orderingProvider',   label: 'Ordering provider',  format: 'text' },
    { key: 'receivedAt',         label: 'Received',           format: 'date' },
    { key: 'fulfillmentStatus',  label: 'Fulfillment',        format: 'pill' },
  ],
  supportsDecline: false,
  automationDefaults: ['auto-orders-fulfilled-notify', 'auto-orders-unassigned-reassign'],
}

// -----------------------------------------------------------------------------
// ADMIN — inbox layout. Catch-all for paperwork not tied to a clinical
// pipeline (insurance updates, records requests, ROIs, address changes).
// -----------------------------------------------------------------------------
export const adminTemplate: DepartmentTemplate = {
  type: 'admin',
  name: 'Admin',
  displayOrder: 5,
  queueLayout: 'inbox',
  statuses: ['open', 'in_progress', 'completed', 'archived'],
  docTags: [
    'Insurance Card', 'Records Request', 'ROI', 'Address Change',
    'POA', 'Payer Correspondence', 'Routine',
  ],
  metadataFields: [
    { key: 'documentType', label: 'Document',     format: 'pill' },
    { key: 'receivedAt',   label: 'Received',     format: 'date' },
    { key: 'receivedVia',  label: 'Via',          format: 'pill' },
    { key: 'routedTo',     label: 'Routed to',    format: 'text' },
  ],
  supportsDecline: false,
  automationDefaults: ['auto-admin-records-route', 'auto-admin-insurance-notify'],
}

// -----------------------------------------------------------------------------
// Registry + practice-type defaults
// -----------------------------------------------------------------------------

export const allTemplates: DepartmentTemplate[] = [
  referralsTemplate,
  priorAuthTemplate,
  clinicalResultsTemplate,
  ordersTemplate,
  adminTemplate,
]

export const templatesByType: Record<DepartmentType, DepartmentTemplate> = {
  referrals:        referralsTemplate,
  prior_auth:       priorAuthTemplate,
  clinical_results: clinicalResultsTemplate,
  orders:           ordersTemplate,
  admin:            adminTemplate,
}

// Default department set per practice type. Used by signup (FE-046) to
// pre-enable a sensible starter configuration; the workspace can enable or
// disable additional departments after onboarding.
export const practiceTypeTemplates: Record<PracticeType, DepartmentType[]> = {
  home_health: ['referrals', 'prior_auth', 'orders', 'admin'],
  cardiology:  ['referrals', 'prior_auth', 'clinical_results', 'admin'],
}
