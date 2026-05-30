'use client';

// =============================================================================
// Toast — bottom-right confirmation pill. Auto-dismisses after 3.2s via
// setTimeout in useEffect. Verbatim Phase 8.
// =============================================================================

import { useEffect } from 'react';
import { I } from '@/components/app/icons';

type Props = { message: string; onDismiss: () => void };

export function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--color-text-primary)',
        color: 'white',
        padding: '12px 18px',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-modal)',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
        }}
      >
        <I.Check size={11} strokeWidth={3} />
      </span>
      {message}
    </div>
  );
}
