import { DIRECTION_LABELS, SCREEN_LABELS, type DirectionId, type ScreenId } from './types';

interface Props {
  direction: DirectionId;
  screen: ScreenId;
}

export function PlaceholderScreen({ direction, screen }: Props) {
  return (
    <section
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-sm)',
        padding: 'calc(var(--rd-space-unit) * 5)',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--rd-color-text-muted)',
          margin: 0,
        }}
      >
        DR-000 placeholder
      </p>
      <h1
        style={{
          fontFamily: 'var(--rd-font-display)',
          fontSize: 'calc(1.875rem * var(--rd-type-scale))',
          margin: 'calc(var(--rd-space-unit) * 1) 0 calc(var(--rd-space-unit) * 1) 0',
          color: 'var(--rd-color-text)',
        }}
      >
        {SCREEN_LABELS[screen]}
      </h1>
      <p style={{ color: 'var(--rd-color-text-muted)', margin: 0 }}>
        {DIRECTION_LABELS[direction]} — screen scaffolded. Content for this direction lands in its own ticket.
      </p>
    </section>
  );
}
