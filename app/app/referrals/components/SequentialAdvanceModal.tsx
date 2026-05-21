'use client';

import type { ReferralStatus } from '../mockData';

const AMBER_50  = '#fffbeb';
const AMBER_500 = '#f59e0b';
const AMBER_800 = '#92400e';

export type PendingDrop = {
  referralId: string;
  fromStatus: ReferralStatus;
  toStatus: ReferralStatus;
  fromLabel: string;
  toLabel: string;
  skippedStages: string[];
};

type Props = {
  pendingDrop: PendingDrop;
  onConfirm: () => void;
  onCancel: () => void;
};

function WarnIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export default function SequentialAdvanceModal({ pendingDrop, onConfirm, onCancel }: Props) {
  return (
    <div
      onClick={onCancel}
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
          width: 460,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 8px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ color: AMBER_500, flexShrink: 0, marginTop: 2 }}>
            <WarnIcon size={22} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 20,
              color: 'var(--color-text-primary)',
              lineHeight: 1.25,
            }}>
              Skip stages?
            </div>
            <p style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 14,
              color: 'var(--color-text-secondary)',
              marginTop: 6,
              marginBottom: 0,
              lineHeight: 1.55,
            }}>
              Moving this referral from{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>{pendingDrop.fromLabel}</strong>{' '}
              to{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>{pendingDrop.toLabel}</strong>{' '}
              will skip:
            </p>
          </div>
        </div>

        {/* Skipped stages list */}
        <ul style={{
          margin: '12px 24px 16px',
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {pendingDrop.skippedStages.map(stage => (
            <li
              key={stage}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: AMBER_500, flexShrink: 0, marginTop: 2 }}>
                <WarnIcon size={14} />
              </span>
              <span>
                <strong style={{ color: 'var(--color-text-primary)' }}>{stage}</strong>
                {' '}— transition automations for this stage won&rsquo;t fire
              </span>
            </li>
          ))}
        </ul>

        {/* Warning box */}
        <div style={{
          margin: '0 24px 20px',
          background: AMBER_50,
          border: `1.5px solid ${AMBER_500}`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: AMBER_800,
          lineHeight: 1.5,
        }}>
          Acknowledgment faxes and SLA timers for skipped stages will not fire automatically.
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          padding: '14px 24px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <button
            type="button"
            onClick={onCancel}
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
            onClick={onConfirm}
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 18px',
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Move anyway
          </button>
        </div>
      </div>
    </div>
  );
}
