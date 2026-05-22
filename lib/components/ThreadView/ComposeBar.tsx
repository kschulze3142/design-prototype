'use client';

// =============================================================================
// ComposeBar — inferred action buttons + always-visible note input + Send.
//
// Button visibility is template-driven (Decision B3):
//   - Add Note    : always present.
//   - Advance to X: shown iff template.lifecycleStages has a status after
//                   workItem.status (i.e. currentIdx >= 0 and a next exists).
//   - Decline     : shown iff template.supportsDecline. Opens DeclineModal.
// =============================================================================

import { useRef, useState, type ReactNode } from 'react';
import { I } from '@/components/app/icons';
import { useMockSystem } from '@/lib/mockSystem/MockSystemProvider';
import type { DepartmentTemplate, WorkItem } from '@/lib/mockSystem/types';
import { DeclineModal } from '../DeclineModal';
import { titleCaseStatus } from '../formatters';

type Props = {
  workItem: WorkItem;
  template: DepartmentTemplate;
  customActions?: ReactNode;
};

export function ComposeBar({ workItem, template, customActions }: Props) {
  const { declineItem, advanceItem } = useMockSystem();
  const [value, setValue] = useState('');
  const [declineOpen, setDeclineOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentIdx = template.lifecycleStages.indexOf(workItem.status);
  const nextStage =
    currentIdx >= 0 && currentIdx < template.lifecycleStages.length - 1
      ? template.lifecycleStages[currentIdx + 1]
      : null;

  const handleAddNote = () => {
    inputRef.current?.focus();
    // TODO: wire createNote() from MockSystemProvider when note flow ships (FE-053)
  };

  const handleAdvance = () => {
    // No toStatus passed — provider auto-advances to next status in template.statuses.
    // For referrals/prior_auth, the first N statuses align with lifecycleStages so
    // the resulting status matches the button label.
    advanceItem(workItem.id);
  };

  const handleDecline = () => {
    setDeclineOpen(true);
  };

  const handleDeclineConfirm = (reason: string, notes: string) => {
    declineItem(workItem.id, reason, notes);
    setDeclineOpen(false);
  };

  const handleSend = () => {
    setValue('');
    // TODO: wire createNote(value) — FE-053
  };

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '14px 24px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <ActionButton onClick={handleAddNote} icon={<I.Note size={14} strokeWidth={1.8} />}>
          Add Note
        </ActionButton>
        {nextStage && (
          <ActionButton onClick={handleAdvance} icon={<I.Arrow size={14} strokeWidth={1.8} />} primary>
            Advance to {titleCaseStatus(nextStage)}
          </ActionButton>
        )}
        {template.supportsDecline && (
          <ActionButton onClick={handleDecline} icon={<I.X size={14} strokeWidth={2} />} danger>
            Decline
          </ActionButton>
        )}
        {customActions}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a note or attach a document…"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            flex: 1,
            height: 42,
            padding: '0 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            color: 'var(--color-text-primary)',
            outline: 'none',
            background: 'white',
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          style={{
            height: 42,
            padding: '0 22px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <I.Send size={14} strokeWidth={2} />
          Send
        </button>
      </div>
      {declineOpen && (
        <DeclineModal
          workItem={workItem}
          template={template}
          onConfirm={handleDeclineConfirm}
          onClose={() => setDeclineOpen(false)}
        />
      )}
    </div>
  );
}

function ActionButton({ onClick, icon, children, primary, danger }: {
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
}) {
  const bg = primary ? 'var(--color-primary)' : danger ? '#fff1f2' : 'white';
  const fg = primary ? 'white' : danger ? '#b91c1c' : 'var(--color-text-primary)';
  const border = primary
    ? 'none'
    : danger
      ? '1px solid #fda4af'
      : '1px solid var(--color-border-strong)';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 14px',
        borderRadius: 'var(--radius-pill)',
        background: bg,
        color: fg,
        border,
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {icon}
      {children}
    </button>
  );
}
