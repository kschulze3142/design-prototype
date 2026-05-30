import React from 'react';

type StatusVariant = 'delivered' | 'failed' | 'processing' | 'review' | 'phi' | 'archived';

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
}

const VARIANT_CONFIG: Record<StatusVariant, { bg: string; color: string; defaultLabel: string }> = {
  delivered:  { bg: 'var(--color-delivered-bg)',  color: 'var(--color-delivered)',  defaultLabel: 'Delivered' },
  failed:     { bg: 'var(--color-failed-bg)',     color: 'var(--color-failed)',     defaultLabel: 'Failed' },
  processing: { bg: 'var(--color-processing-bg)', color: 'var(--color-processing)', defaultLabel: 'Processing' },
  review:     { bg: 'var(--color-review-bg)',     color: 'var(--color-review)',     defaultLabel: 'In Review' },
  phi:        { bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)',        defaultLabel: 'PHI' },
  archived:   { bg: 'var(--color-archived-bg)',   color: 'var(--color-archived)',   defaultLabel: 'Archived' },
};

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  const { bg, color, defaultLabel } = VARIANT_CONFIG[variant];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 22,
      padding: '0 8px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
      background: bg,
      color,
    }}>
      <span style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }} />
      {label ?? defaultLabel}
    </span>
  );
}
