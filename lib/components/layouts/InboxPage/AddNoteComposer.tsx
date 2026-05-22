'use client';

// =============================================================================
// AddNoteComposer — toggleable inline textarea used by InboxPage's preview
// pane. Open/close is controlled by the parent (Add Note button). The composer
// owns transient text state; submission/clear is handled here and reported up
// via onSubmit. Empty/whitespace-only submissions are no-ops.
// =============================================================================

import { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onSubmit: (body: string) => void;
  onCancel: () => void;
};

export function AddNoteComposer({ open, onSubmit, onCancel }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
    else setValue('');
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    const body = value.trim();
    if (!body) return;
    onSubmit(body);
    setValue('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 14,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        marginTop: 14,
      }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add a note about this result…"
        rows={3}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: 'var(--color-text-primary)',
          background: 'white',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            height: 32,
            padding: '0 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border-strong)',
            background: 'white',
            color: 'var(--color-text-secondary)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={value.trim().length === 0}
          style={{
            height: 32,
            padding: '0 16px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: 'var(--color-primary)',
            color: 'white',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: value.trim().length === 0 ? 'not-allowed' : 'pointer',
            opacity: value.trim().length === 0 ? 0.5 : 1,
          }}
        >
          Save note
        </button>
      </div>
    </div>
  );
}
