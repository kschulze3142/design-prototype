'use client';

// =============================================================================
// TransitionBar — inline visual hint above the column body listing the
// transition actions that fire when items move into this column. Visual
// only — clicking does nothing in the prototype.
// =============================================================================

type Props = { actions: string[] };

function Bolt({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13 2 3 14h7l-1 8 10-12h-7Z" />
    </svg>
  );
}

export function TransitionBar({ actions }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: '10px 14px',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {actions.map(a => (
        <span
          key={a}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Bolt size={10} />
          {a}
        </span>
      ))}
    </div>
  );
}
