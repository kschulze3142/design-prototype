'use client';

import { useState } from 'react';
import type { Referral } from '../mockData';

const ROSE_50  = '#fff1f2';
const ROSE_400 = '#fb7185';
const ROSE_500 = '#f43f5e';
const ROSE_700 = '#be123c';
const ROSE_300 = '#fda4af';

type Props = {
  referral: Referral;
  onConfirm: (reason: string, notes: string) => void;
  onClose: () => void;
};

const DECLINE_REASONS = [
  'Outside service area',
  'No capacity',
  'Insurance not accepted',
  'Patient declined services',
  'Inappropriate referral',
  'Other',
];

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
};

function XCircleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function ReasonChip({ label, selected, onClick }: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${selected ? ROSE_400 : 'var(--color-border)'}`,
        background: selected ? ROSE_50 : 'transparent',
        color: selected ? ROSE_700 : 'var(--color-text-secondary)',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast)',
      }}
    >
      {label}
    </button>
  );
}

export default function DeclineModal({ referral, onConfirm, onClose }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState('');

  const template = selectedReason ? COURTESY_FAX_TEMPLATES[selectedReason] : '';
  const interpolated = template
    .replace(/\{physician\}/g, referral.referringPhysician.replace(/^Dr\.\s+/, ''))
    .replace(/\{patient\}/g, referral.patientName);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26,34,54,0.4)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          width: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ color: ROSE_500, flexShrink: 0, marginTop: 2 }}>
            <XCircleIcon size={22} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
              fontWeight: 600,
              fontSize: 18,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}>
              Decline referral — {referral.patientName}
            </div>
            <div style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              marginTop: 4,
            }}>
              {referral.referringOrg} · Received {referral.slaDueAt}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Reason chips */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-tertiary)',
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Reason <span style={{ color: ROSE_500 }}>*</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DECLINE_REASONS.map(reason => (
                <ReasonChip
                  key={reason}
                  label={reason}
                  selected={selectedReason === reason}
                  onClick={() => setSelectedReason(reason)}
                />
              ))}
            </div>
          </div>

          {/* Internal notes */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-tertiary)',
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Internal notes
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Internal notes (optional — not sent to referring physician)"
              rows={3}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 13,
                padding: '10px 12px',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
                background: 'var(--color-surface)',
              }}
            />
          </div>

          {/* Courtesy fax preview */}
          {selectedReason ? (
            <div style={{
              background: 'var(--color-primary-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '12px 16px',
            }}>
              <p style={{
                fontFamily: 'JetBrains Mono, var(--font-mono), monospace',
                fontSize: 11,
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
                marginTop: 0,
                fontWeight: 600,
              }}>
                COURTESY FAX PREVIEW
              </p>
              <pre style={{
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                whiteSpace: 'pre-wrap',
                margin: 0,
                lineHeight: 1.55,
              }}>
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
          ) : (
            <div style={{
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border-strong)',
              padding: '14px 16px',
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 12,
              fontStyle: 'italic',
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
            }}>
              Select a reason above to preview the courtesy fax.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'white',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedReason}
            onClick={() => onConfirm(selectedReason, notes)}
            style={{
              background: selectedReason ? ROSE_500 : ROSE_300,
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 20px',
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: selectedReason ? 'pointer' : 'not-allowed',
            }}
          >
            Decline & send courtesy fax
          </button>
        </div>
      </div>
    </div>
  );
}
