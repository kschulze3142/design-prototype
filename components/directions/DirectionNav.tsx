import Link from 'next/link';
import { DIRECTION_LABELS, SCREEN_LABELS, type DirectionId, type ScreenId } from './types';

const SCREENS: readonly ScreenId[] = ['home', 'inbox', 'dashboard'] as const;

interface Props {
  direction: DirectionId;
}

export function DirectionNav({ direction }: Props) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'calc(var(--rd-space-unit) * 2)',
        padding: 'calc(var(--rd-space-unit) * 2) calc(var(--rd-space-unit) * 3)',
        background: 'var(--rd-color-surface)',
        borderBottom: '1px solid var(--rd-color-border)',
        fontFamily: 'var(--rd-font-body)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'calc(var(--rd-space-unit) * 2)' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontWeight: 600,
            fontSize: 'calc(1rem * var(--rd-type-scale))',
            color: 'var(--rd-color-text)',
            textDecoration: 'none',
          }}
        >
          Robin Dock
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'var(--rd-color-text-muted)' }}>
          {DIRECTION_LABELS[direction]}
        </span>
      </div>
      <ul style={{ display: 'flex', gap: 'calc(var(--rd-space-unit) * 2)', listStyle: 'none', margin: 0, padding: 0 }}>
        {SCREENS.map((screen) => (
          <li key={screen}>
            <Link
              href={`/${direction}/${screen}`}
              style={{ color: 'var(--rd-color-text-muted)', textDecoration: 'none' }}
            >
              {SCREEN_LABELS[screen]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
