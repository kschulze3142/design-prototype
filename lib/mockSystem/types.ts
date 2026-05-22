// =============================================================================
// Phase 9 mock-system type definitions
// =============================================================================
//
// DISCRIMINATED UNIONS — read before editing
//
// WorkItem and ThreadEvent are both discriminated unions. WorkItem narrows on
// `departmentType`; ThreadEvent narrows on `type`. To safely access
// department-specific or event-specific data, you must first narrow:
//
//   if (item.departmentType === 'referrals') {
//     item.metadata.referringOrg  // ReferralMetadata in scope
//   }
//
// Generic components (e.g. WorkItemCard) should NOT touch `metadata` directly.
// Instead they iterate the department's `MetadataFieldDescriptor[]` (from
// templates.ts) and look up `metadata[descriptor.key]`. This keeps the card
// renderer department-agnostic and lets per-dept config (FE-072) extend the
// fields without changing the card code.
//
// Department-specific code (e.g. a Prior Auth tracker view) is welcome to
// narrow on departmentType and read PriorAuthMetadata fields by name.
// =============================================================================

// =============================================================================
// PRACTICE & DEPARTMENT
// =============================================================================

export type PracticeType = 'home_health' | 'cardiology'

export type DepartmentType =
  | 'referrals'
  | 'prior_auth'
  | 'clinical_results'
  | 'orders'
  | 'admin'

export type QueueLayout = 'pipeline' | 'tracker' | 'inbox' | 'queue'

// Descriptor for one metadata field on a department's work items.
// `urgentWhen` is evaluated at render time; the consuming component owns
// the urgency styling (red text, badge, etc.).
//
// The T generic gives the template author type-safe access to the field's
// value type. Once collected into a DepartmentTemplate.metadataFields array,
// T widens to unknown — which is fine: generic card components only need
// runtime info, and department-specific code narrows via the discriminated
// WorkItem union.
export type MetadataFieldDescriptor<T = unknown> = {
  key: string
  label: string
  format?: 'text' | 'date' | 'currency' | 'pill'
  urgentWhen?: (value: T) => boolean
}

// Vocabulary supported by the Pill primitive (components/app/primitives.tsx).
// Unknown values fall back to 'slate' at render time; the type enforces the
// supported set at template-author time so a typo doesn't silently degrade.
export type PillTone = 'emerald' | 'teal' | 'amber' | 'red' | 'slate' | 'violet'

export type DepartmentTemplate = {
  type: DepartmentType
  name: string
  // Overline shown above the department name in the page header — a coarse
  // grouping like "Workflow", "Clinical", "Operations". Required so every
  // template author picks one explicitly.
  category: string
  // One-line purpose, rendered below the headline. Required for the same
  // reason as `category` — keeps department headers from shipping blank.
  description: string
  displayOrder: number
  queueLayout: QueueLayout
  statuses: string[]
  // Subset of `statuses` considered "done" — items in these statuses are
  // excluded from open-work counts (sidebar badges, dashboard tiles). Required
  // (not optional) so every template author makes an explicit choice; a
  // department with no terminal states ships `[]`.
  terminalStatuses: string[]
  // Pill tone per status — read by WorkItemCard. Required (not optional) so
  // every template author picks tones explicitly; an unknown status at render
  // time falls back to 'slate'.
  statusTones: Record<string, PillTone>
  docTags: string[]
  metadataFields: MetadataFieldDescriptor[]
  supportsDecline: boolean
  declineReasons?: string[]
  automationDefaults: string[]
}

// Department is an *instance* — a template applied to a workspace.
// Per FE-072, statuses/docTags can be overridden per workspace; FE-044
// stores no overrides yet, so consumers should read template values when
// overrides are absent.
export type Department = {
  id: string
  workspaceId: string
  type: DepartmentType
  enabled: boolean
  statusOverrides?: string[]
  docTagOverrides?: string[]
}

// =============================================================================
// WORK ITEM (discriminated union by departmentType)
// =============================================================================

type WorkItemBase = {
  id: string
  patientId: string
  status: string                       // must be in template.statuses
  assignedTo: string | null            // userId; renderer derives initials
  slaBreached: boolean
  slaDueAt: string | null              // ISO timestamp; null when no SLA applies
  docTags: string[]
  linkedItems: WorkItemLink[]
  createdAt: string
  updatedAt: string
}

export type WorkItemLink = {
  itemId: string
  relationship: 'spawned_from' | 'spawned' | 'related'
}

// Department-specific metadata. Field keys must match the `key` values
// in each template's metadataFields.
export type ReferralMetadata = {
  referringOrg: string
  referringProvider: string
  diagnosisCode: string
  diagnosisText: string
  services: string[]
  episodeValueCents: number
  nextAction: string | null
  declineReason?: string
  declineNotes?: string
}

export type PriorAuthMetadata = {
  payer: string
  authNumber?: string                  // null until approved
  serviceRequested: string
  cptCodes?: string[]
  submittedAt?: string                 // ISO
  expiresAt?: string                   // ISO; urgency rule reads this
}

export type ClinicalResultsMetadata = {
  resultType: 'lab' | 'imaging' | 'pathology' | 'other'
  orderingProvider: string
  receivedAt: string                   // ISO
  abnormal: boolean
  acknowledged: boolean
  headline: string                     // display string, e.g. "Echo, EF 35%"
}

export type OrdersMetadata = {
  orderType: string                    // "DME", "Lab", "Imaging", etc.
  orderingProvider: string
  receivedAt: string                   // ISO
  fulfillmentStatus: string
}

export type AdminMetadata = {
  documentType: string                 // "Insurance card", "Records request", etc.
  receivedAt: string                   // ISO
  receivedVia: 'fax' | 'email' | 'mail'
  routedTo?: string                    // userId or department type
}

export type WorkItem =
  | (WorkItemBase & { departmentType: 'referrals';        metadata: ReferralMetadata })
  | (WorkItemBase & { departmentType: 'prior_auth';       metadata: PriorAuthMetadata })
  | (WorkItemBase & { departmentType: 'clinical_results'; metadata: ClinicalResultsMetadata })
  | (WorkItemBase & { departmentType: 'orders';           metadata: OrdersMetadata })
  | (WorkItemBase & { departmentType: 'admin';            metadata: AdminMetadata })

// =============================================================================
// PATIENT (cross-department identity)
// =============================================================================

export type Patient = {
  id: string
  name: string
  mrn: string
  dob: string                          // ISO date (YYYY-MM-DD)
  age: number                          // denormalized for display
  sex: 'M' | 'F'
  insurance: string
}

// =============================================================================
// THREAD EVENT (discriminated union by type)
// =============================================================================
//
// Phase 8's ThreadEvent had 13 fixed fields that only applied to some event
// types. Here we split those fields onto per-type payload shapes so each
// event carries only the data it needs. The `actor` field is a userId or
// 'system'; `actorLabel` is an optional display override used for external
// parties (referring clinics, inbound fax senders) that don't have user
// records. Renderers should prefer `actorLabel` when present, otherwise
// look up the user by `actor`.

export type ThreadEventType =
  | 'document_received'
  | 'document_sent'
  | 'status_change'
  | 'note'
  | 'assignment'
  | 'automation'
  | 'decline'
  | 'link_created'

type ThreadEventBase = {
  id: string
  workItemId: string
  actor: string                        // userId or 'system'
  actorLabel?: string                  // override for external parties
  timestamp: string                    // ISO
}

export type DocumentReceivedPayload = {
  senderLabel: string                  // "Foothill Clinic (Dr. James Orin)"
  documentName: string
  documentPages: number
  bodyText: string | null
  tags: string[]
  classificationNote: string | null
  delivered: boolean
}

export type DocumentSentPayload = {
  recipientLabel: string
  documentName: string
  documentPages: number
  bodyText: string | null
  tags: string[]
  delivered: boolean
}

export type StatusChangePayload = {
  fromStatus: string
  toStatus: string
  transitionActions: string[]
  notes: string | null
}

export type NotePayload = {
  bodyText: string
  tags: string[]
}

export type AssignmentPayload = {
  fromUserId: string | null
  toUserId: string | null
  reason: string | null
}

export type AutomationEventPayload = {
  ruleId: string
  ruleName: string
  actionDescription: string
  bodyText: string | null
}

export type DeclinePayload = {
  reason: string
  notes: string | null
  courtesyFaxSent: boolean
}

export type LinkCreatedPayload = {
  linkedWorkItemId: string
  relationship: 'spawned_from' | 'spawned' | 'related'
  bodyText: string | null
}

export type ThreadEvent =
  | (ThreadEventBase & { type: 'document_received'; payload: DocumentReceivedPayload })
  | (ThreadEventBase & { type: 'document_sent';     payload: DocumentSentPayload })
  | (ThreadEventBase & { type: 'status_change';     payload: StatusChangePayload })
  | (ThreadEventBase & { type: 'note';              payload: NotePayload })
  | (ThreadEventBase & { type: 'assignment';        payload: AssignmentPayload })
  | (ThreadEventBase & { type: 'automation';        payload: AutomationEventPayload })
  | (ThreadEventBase & { type: 'decline';           payload: DeclinePayload })
  | (ThreadEventBase & { type: 'link_created';      payload: LinkCreatedPayload })

// =============================================================================
// AUTOMATION
// =============================================================================
//
// Conditions are structured (field/operator/value) rather than a free-form
// Record<string, unknown>, matching the Phase 8 settings UI shape. The
// operator set mirrors Phase 8's OPERATOR_OPTIONS.

export type AutomationTrigger =
  | 'document_received'
  | 'status_changed'
  | 'sla_approaching'
  | 'item_unassigned'

export type AutomationConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'changes_to'
  | 'greater_than'
  | 'less_than'

export type AutomationCondition = {
  field: string
  operator: AutomationConditionOperator
  value: string | number | boolean
}

export type AutomationAction =
  | { type: 'assign_to'; userId: string }
  | { type: 'set_status'; status: string }
  | { type: 'add_tag'; tag: string }
  | { type: 'notify'; userId: string }
  | { type: 'send_document'; templateId: string; recipientHint: string }
  | { type: 'start_sla_timer'; durationMs: number }

export type AutomationRule = {
  id: string
  departmentType: DepartmentType
  name: string
  description: string
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  enabled: boolean
}

// =============================================================================
// USER & WORKSPACE
// =============================================================================

export type UserRole = 'admin' | 'staff'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatarColor?: string                 // hex; for initial-avatar rendering
}

export type Workspace = {
  id: string
  name: string
  practiceType: PracticeType
  createdAt: string                    // ISO
}
