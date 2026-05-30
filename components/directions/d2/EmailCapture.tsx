'use client';

// d2 EmailCapture — Harvest's email-capture pattern (DR-004h): one fully-rounded
// warm-tint pill shell with a transparent email input and the black CTA tucked
// at the right end. Its own client component because the mock (non-submitting)
// form needs an onSubmit handler — kept out of the server-rendered primitives.
import type { CSSProperties } from 'react';
import { Button, space as u } from './primitives';

export function EmailCapture({
  buttonLabel = 'Start free trial',
  placeholder = 'Enter your email',
  style,
}: {
  buttonLabel?: string;
  placeholder?: string;
  style?: CSSProperties;
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: u(1.5),
        width: '100%',
        maxWidth: 460,
        padding: '8px 8px 8px 24px',
        borderRadius: 'var(--rd-radius-round)',
        border: '1.5px solid var(--rd-color-border)',
        background: 'var(--rd-color-bg-tint)',
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
