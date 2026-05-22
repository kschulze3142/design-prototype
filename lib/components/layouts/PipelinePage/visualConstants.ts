// =============================================================================
// visualConstants — referrals-specific pipeline visuals.
//
// Per FE-054 Decision J1, these live alongside the consumer rather than on
// the template. Promote to template config when a second pipeline-layout
// department actually ships and shares the shape.
// =============================================================================

// Column header dot color per status. Keys match referralsTemplate.statuses
// (excluding 'declined' — declined items render in the archive tab, never
// as a column).
export const REFERRALS_COLUMN_DOT_COLOR: Record<string, string> = {
  new:       '#8896aa',
  in_review: '#f59e0b',
  accepted:  '#3d5080',
  scheduled: '#10b981',
  completed: '#6366f1',
};

// Inline action chips rendered above the droppable area for declarable
// columns. Visual hint only — clicking does nothing in the prototype.
export const REFERRALS_TRANSITION_BARS: Partial<Record<string, string[]>> = {
  new:       ['Send acknowledgment fax', 'Start 4h SLA', 'Notify patient'],
  in_review: ['Send acceptance fax', 'Request F2F if missing', 'Queue PA', 'Notify scheduler'],
  accepted:  ['Send POC for signature', 'Request prior auth', 'Book SOC visit'],
};

// Statuses where the hover ✕ decline trigger renders on the card. Defense
// in depth: ReferralPipelineCard also gates on template.supportsDecline.
export const DECLINABLE_STATUSES = new Set<string>(['new', 'in_review', 'accepted']);

// Per-status next-action hint. {referringOrg} / {referringProvider}
// placeholders are interpolated at render against the item's metadata.
export const REFERRALS_NEXT_ACTION_HINT: Partial<Record<string, string>> = {
  new:       'On move to In Review: send acknowledgment fax to {referringOrg}',
  in_review: 'On accept: auto-request F2F from {referringProvider}',
  accepted:  'On schedule: send POC for signature · request prior auth',
};

// Status-readable labels for modals and toasts. Sources from the same
// titleCaseStatus formatter that ThreadView uses; centralized here so the
// SequentialAdvanceModal copy reads the same labels as the column headers.
export const REFERRALS_STAGE_LABELS: Record<string, string> = {
  new:       'New',
  in_review: 'In Review',
  accepted:  'Accepted',
  scheduled: 'Scheduled',
  completed: 'Completed',
  declined:  'Declined',
};

// Rose tokens reused across the pipeline (SLA-breach borders, urgency
// pulse dot, at-risk stat value). Phase 8 inlined these; centralized to
// keep the kanban visually consistent.
export const ROSE = {
  R50:  '#fff1f2',
  R300: '#fda4af',
  R400: '#fb7185',
  R700: '#be123c',
};
