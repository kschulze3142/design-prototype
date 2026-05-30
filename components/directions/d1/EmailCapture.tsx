'use client';

// d1 EmailCapture — SEMrush's hero capture pattern (DR-007): one fully-rounded
// white pill shell with a transparent email input and the distinctive lavender
// dark-text "Get insights" button tucked at the right end. Its own client
// component because the mock (non-submitting) form needs an onSubmit handler —
// kept out of the server-rendered primitives.
import type { CSSProperties } from 'react';
import { Button, space as u } from './primitives';

export function EmailCapture({
  buttonLabel = 'Get insights',
  placeholder = 'Enter your work email',
  center = false,
  style,
}: {
  buttonLabel?: string;
  placeholder?: string;
  center?: boolean;
  style?: CSSProperties;
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: u(1),
        width: '100%',
        maxWidth: 520,
        marginInline: center ? 'auto' : undefined,
        padding: '6px 6px 6px 22px',
        borderRadius: 'var(--rd-radius-round)',
        border: '1px solid var(--rd-color-border)',
        background: 'var(--rd-color-surface)',
        boxShadow: 'var(--rd-shadow-sm)',
        ...style,
      }}
    >
      <input
        type="email"
        placeholder={placeholder}
        aria-label="Work email"
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '16px',
          color: 'var(--rd-color-text)',
          fontFamily: 'var(--rd-font-body)',
        }}
      />
      <Button type="submit" variant="primary" style={{ flexShrink: 0 }}>
        {buttonLabel}
      </Button>
    </form>
  );
}
