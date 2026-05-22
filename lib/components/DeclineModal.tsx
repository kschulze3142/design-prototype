'use client';

// =============================================================================
// DeclineModal — generic, template-driven decline flow for any department
// with `supportsDecline: true`. Reads `template.declineReasons` for the chip
// grid and emits `(reason, notes)` on confirm. The parent owns the mutation
// (calls `declineItem` on MockSystemProvider) and dismissal.
//
// Visual continuity with Phase 8: same overlay/surface tokens, same rose
// chip styling and disabled-confirm treatment. Differences:
//   - No courtesy-fax preview (referrals-specific; FE-054 re-introduces it
//     on the kanban path if needed).
//   - Generic header "Decline {singularName} — {patient}" — derived from a
//     small DepartmentType→singular map, not from the template, since
//     template.name is already plural-cased ("Referrals", "Prior Auth").
//   - Escape-key dismisses; backdrop click dismisses.
// =============================================================================

import { useEffect, useState } from 'react';
import { usePatient } from '@/lib/mockSystem/hooks';
import type {
  DepartmentTemplate,
  DepartmentType,
  WorkItem,
} from '@/lib/mockSystem/types';

const ROSE_50 = '#fff1f2';
const ROSE_300 = '#fda4af';
const ROSE_400 = '#fb7185';
const ROSE_500 = '#f43f5e';
const ROSE_700 = '#be123c';

const SINGULAR_NAMES: Record<DepartmentType, string> = {
  referrals: 'referral',
  prior_auth: 'prior auth',
  clinical_results: 'clinical result',
  orders: 'order',
  admin: 'admin item',
};

type Props = {
  workItem: WorkItem;
  template: DepartmentTemplate;
  onConfirm: (reason: string, notes: string) => void;
  onClose: () => void;
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

export function DeclineModal({ workItem, template, onConfirm, onClose }: Props) {
  const patient = usePatient(workItem.patientId);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const reasons = template.declineReasons ?? [];
  const singular = SINGULAR_NAMES[template.type];
  const patientName = patient?.name ?? 'Unknown patient';

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
              Decline {singular} — {patientName}
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
              {reasons.map(reason => (
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
              placeholder="Internal notes (optional)"
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
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
