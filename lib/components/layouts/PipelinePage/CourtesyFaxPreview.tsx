'use client';

// =============================================================================
// CourtesyFaxPreview — reactive preview slot passed to DeclineModal via
// its previewSlot render prop. Two states:
//
//   - selectedReason === null  → dashed placeholder block
//   - selectedReason set       → interpolated template body
//
// Six fax templates (verbatim Phase 8). {physician}/{patient} are
// substituted from item.metadata.referringProvider + patient.name. The
// "Dr. " prefix is stripped from referringProvider to match Phase 8.
// =============================================================================

import { usePatient } from '@/lib/mockSystem/hooks';
import type { WorkItem } from '@/lib/mockSystem/types';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

type Props = {
  selectedReason: string | null;
  workItem: ReferralWorkItem;
};

const COURTESY_FAX_TEMPLATES: Record<string, string> = {
  'Outside service area':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. Unfortunately, this patient falls outside our service area and we are unable to accept this referral at this time.\n\nWe appreciate your confidence in our services and encourage you to contact us for future referrals within our coverage area.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'No capacity':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. Due to current capacity limitations, we are unable to accept new patients at this time. We expect availability within 2–3 weeks and will reach out if circumstances change.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'Insurance not accepted':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. Unfortunately, we are unable to accept this referral as we do not currently participate with the patient's insurance plan.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'Patient declined services':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. We made contact with the patient, however they have declined home health services at this time.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'Inappropriate referral':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. After clinical review, we have determined that the patient does not meet criteria for the requested services at this time.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'Other':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. We are unable to accept this referral at this time. Please contact our office if you have any questions.\n\nSincerely,\nNorthwind Health · Cardiology`,
  // Phase 9 referrals template adds these reasons; Phase 8 didn't have
  // dedicated templates so they fall through to a generic body.
  'Capacity full':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. Due to current capacity limitations, we are unable to accept new patients at this time. We expect availability within 2–3 weeks and will reach out if circumstances change.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'Missing required documentation':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. We are unable to process this referral as required clinical documentation is missing. Please resubmit with the necessary records.\n\nSincerely,\nNorthwind Health · Cardiology`,
  'Clinical criteria not met':
    `Dear Dr. {physician},\n\nThank you for your referral of {patient}. After clinical review, we have determined that the patient does not meet criteria for the requested services at this time.\n\nSincerely,\nNorthwind Health · Cardiology`,
};

export function CourtesyFaxPreview({ selectedReason, workItem }: Props) {
  const patient = usePatient(workItem.patientId);

  if (!selectedReason) {
    return (
      <div
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-border-strong)',
          padding: '14px 16px',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontStyle: 'italic',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center',
        }}
      >
        Select a reason above to preview the courtesy fax.
      </div>
    );
  }

  const template = COURTESY_FAX_TEMPLATES[selectedReason] ?? COURTESY_FAX_TEMPLATES['Other'];
  const physician = workItem.metadata.referringProvider.replace(/^Dr\.\s+/, '');
  const patientName = patient?.name ?? 'Unknown patient';
  const interpolated = template
    .replace(/\{physician\}/g, physician)
    .replace(/\{patient\}/g, patientName);

  return (
    <div
      style={{
        background: 'var(--color-primary-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        padding: '12px 16px',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, var(--font-mono), monospace',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 8,
          marginTop: 0,
          fontWeight: 600,
        }}
      >
        COURTESY FAX PREVIEW
      </p>
      <pre
        style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          whiteSpace: 'pre-wrap',
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {interpolated}
      </pre>
      <button
        type="button"
        style={{
          marginTop: 10,
          fontSize: 12,
          color: 'var(--color-primary)',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontWeight: 600,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        Edit template before sending
      </button>
    </div>
  );
}
