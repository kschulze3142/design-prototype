import Link from 'next/link';
import {
  DIRECTION_LABELS,
  SCREEN_LABELS,
  type DirectionId,
  type ScreenId,
} from '@/components/directions/types';

const DIRECTIONS: readonly DirectionId[] = ['d1', 'd2', 'd3', 'd4'] as const;
const SCREENS: readonly ScreenId[] = ['home', 'inbox', 'dashboard'] as const;

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '48px 24px',
        fontFamily: 'var(--rd-font-body)',
        color: 'var(--rd-color-text)',
      }}
    >
      <header style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rd-color-text-muted)', margin: 0 }}>
          Design directions prototype
        </p>
        <h1 style={{ fontFamily: 'var(--rd-font-display)', fontSize: 40, margin: '8px 0 8px 0' }}>Robin Dock</h1>
        <p style={{ color: 'var(--rd-color-text-muted)', margin: 0, maxWidth: 640 }}>
          Four directions, three screens each. Same data, different skin — pick a cell to compare.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '180px repeat(3, 1fr)',
          gap: 1,
          background: 'var(--rd-color-border)',
          border: '1px solid var(--rd-color-border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Cell header>Direction</Cell>
        {SCREENS.map((s) => (
          <Cell key={s} header>{SCREEN_LABELS[s]}</Cell>
        ))}

        {DIRECTIONS.map((d) => (
          <RowFragment key={d} direction={d} />
        ))}
      </section>
    </main>
  );
}

function RowFragment({ direction }: { direction: DirectionId }) {
  return (
    <>
      <Cell>
        <strong style={{ display: 'block', fontFamily: 'var(--rd-font-display)' }}>{direction.toUpperCase()}</strong>
        <span style={{ fontSize: 12, color: 'var(--rd-color-text-muted)' }}>{DIRECTION_LABELS[direction]}</span>
      </Cell>
      {SCREENS.map((screen) => (
        <Cell key={screen}>
          <Link
            href={`/${direction}/${screen}`}
            style={{
              display: 'block',
              padding: '4px 0',
              color: 'var(--rd-color-accent)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            /{direction}/{screen} →
          </Link>
        </Cell>
      ))}
    </>
  );
}

function Cell({ children, header = false }: { children: React.ReactNode; header?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        padding: '16px 20px',
        fontSize: header ? 12 : 14,
        letterSpacing: header ? '0.08em' : undefined,
        textTransform: header ? 'uppercase' : undefined,
        color: header ? 'var(--rd-color-text-muted)' : 'var(--rd-color-text)',
        fontWeight: header ? 500 : 400,
      }}
    >
      {children}
    </div>
  );
}
