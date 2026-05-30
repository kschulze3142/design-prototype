// d2 marketing header — the single, primary top bar for the d2 home page.
// Mercury-quiet: wordmark + placeholder marketing links + Log in / Start trial.
// The prototype's Home/Inbox/Dashboard screen-switcher is folded in here as a
// small, muted secondary group so there's ONE header, not two competing bars.
// This is a d2-local composition piece — it does NOT touch the shared
// DirectionNav (which still serves the other screens via MarketingShell).
import Link from 'next/link';
import { space as u } from './primitives';

type ScreenId = 'home' | 'inbox' | 'dashboard';
const SCREENS: readonly { id: ScreenId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'dashboard', label: 'Dashboard' },
];

const MARKETING_LINKS = ['Product', 'Solutions', 'Resources', 'Pricing'] as const;

export function MarketingHeader({ current = 'home' }: { current?: ScreenId }) {
  return (
    <header
      className="d2-mkt-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: u(2),
        maxWidth: 1180,
        marginInline: 'auto',
        paddingBlock: u(2),
        paddingInline: u(3),
        fontFamily: 'var(--rd-font-body)',
      }}
    >
      {/* Left: brand + small muted prototype screen-switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: u(2) }}>
        <Link
          href="/d2/home"
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontWeight: 700,
            fontSize: '1.06rem',
            letterSpacing: '-0.01em',
            color: 'var(--rd-color-text)',
            textDecoration: 'none',
          }}
        >
          Robin Dock
        </Link>

        {/* Prototype switcher — visually secondary; reachable for review. */}
        <nav
          aria-label="Prototype screens"
          className="d2-mkt-screens"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: 2,
            borderRadius: 999,
            background: 'var(--rd-color-accent-soft)',
          }}
        >
          {SCREENS.map((s) => {
            const active = s.id === current;
            return (
              <Link
                key={s.id}
                href={`/d2/${s.id}`}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: u(3),
                  paddingInline: u(1.4),
                  borderRadius: 999,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: active ? 'var(--rd-color-accent)' : 'var(--rd-color-text-muted)',
                  background: active ? 'var(--rd-color-surface)' : 'transparent',
                  boxShadow: active ? 'var(--rd-shadow-sm)' : 'none',
                }}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: marketing links + auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: u(2.4) }}>
        <nav className="d2-mkt-links" style={{ display: 'flex', alignItems: 'center', gap: u(2.4) }}>
          {MARKETING_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--rd-color-text-muted)',
                textDecoration: 'none',
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#"
          className="d2-mkt-login"
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--rd-color-text)',
            textDecoration: 'none',
          }}
        >
          Log in
        </a>
        <a
          href="#"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: u(4),
            paddingInline: u(2),
            borderRadius: 999,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#ffffff',
            background: 'var(--rd-color-accent)',
            border: '1px solid var(--rd-color-accent)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Start trial
        </a>
      </div>

      {/* Collapse the secondary clusters on narrow widths so the header stays a
          single clean row (wordmark + Start trial) with no horizontal scroll. */}
      <style>{`
        @media (max-width: 860px) {
          .d2-mkt-header .d2-mkt-links { display: none !important; }
        }
        @media (max-width: 640px) {
          .d2-mkt-header .d2-mkt-screens,
          .d2-mkt-header .d2-mkt-login { display: none !important; }
        }
      `}</style>
    </header>
  );
}
