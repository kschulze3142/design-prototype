// d1 marketing header — the single, primary top bar for the d1 home page.
// SEMrush-style: bold wordmark left, centered marketing nav, and a right cluster
// of "Log in" + the dark full-pill "Sign Up" CTA. The prototype's
// Home/Inbox/Dashboard screen-switcher is folded in here as a small, muted
// secondary group so there's ONE header, not two competing bars. This is a
// d1-local composition piece — it does NOT touch the shared DirectionNav (which
// still serves the other d1 screens via MarketingShell).
import Link from 'next/link';
import { Button, space as u } from './primitives';

type ScreenId = 'home' | 'inbox' | 'dashboard';
const SCREENS: readonly { id: ScreenId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'dashboard', label: 'Dashboard' },
];

const MARKETING_LINKS = ['Features', 'Solutions', 'Resources', 'Pricing'] as const;

export function MarketingHeader({ current = 'home' }: { current?: ScreenId }) {
  return (
    <header
      className="d1-mkt-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: u(2),
        maxWidth: 1280,
        marginInline: 'auto',
        paddingBlock: u(2.5),
        paddingInline: u(3),
        fontFamily: 'var(--rd-font-body)',
      }}
    >
      {/* Left: bold wordmark + small muted prototype screen-switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: u(2) }}>
        <Link
          href="/d1/home"
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontWeight: 600,
            fontSize: '1.45rem',
            letterSpacing: '-0.03em',
            color: 'var(--rd-color-heading)',
            textDecoration: 'none',
          }}
        >
          Robin Dock
        </Link>

        {/* Prototype switcher — visually secondary; reachable for review. */}
        <nav
          aria-label="Prototype screens"
          className="d1-mkt-screens"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: 2,
            borderRadius: 'var(--rd-radius-round)',
            background: 'var(--rd-color-accent-soft)',
          }}
        >
          {SCREENS.map((s) => {
            const active = s.id === current;
            return (
              <Link
                key={s.id}
                href={`/d1/${s.id}`}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: u(3),
                  paddingInline: u(1.4),
                  borderRadius: 'var(--rd-radius-round)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: active ? 'var(--rd-color-heading)' : 'var(--rd-color-text-muted)',
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

      {/* Center: marketing links */}
      <nav
        className="d1-mkt-links"
        style={{ display: 'flex', alignItems: 'center', gap: u(3) }}
      >
        {MARKETING_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'var(--rd-color-heading)',
              textDecoration: 'none',
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Right: auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: u(2) }}>
        <a
          href="#"
          className="d1-mkt-login"
          style={{
            fontSize: '0.95rem',
            fontWeight: 500,
            color: 'var(--rd-color-heading)',
            textDecoration: 'none',
          }}
        >
          Log in
        </a>
        <Button variant="dark" href="#" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
          Sign Up
        </Button>
      </div>

      {/* Collapse the secondary clusters on narrow widths so the header stays a
          single clean row (wordmark + Sign Up) with no horizontal scroll. */}
      <style>{`
        @media (max-width: 900px) {
          .d1-mkt-header .d1-mkt-links { display: none !important; }
        }
        @media (max-width: 640px) {
          .d1-mkt-header .d1-mkt-screens,
          .d1-mkt-header .d1-mkt-login { display: none !important; }
        }
      `}</style>
    </header>
  );
}
