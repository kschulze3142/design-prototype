// d3 marketing header — the single, primary top bar for the d3 home page, sitting
// ON the charcoal hero. Notion-style: wordmark left, marketing nav, and a right
// cluster of "Log in" + the blue "Get Robin Dock free" CTA. The prototype's
// Home/Inbox/Dashboard screen-switcher is folded in here as a small, translucent
// secondary group so there's ONE header, not two competing bars. Because it sits
// on the dark hero, all chrome is white/translucent. d3-local — it does NOT touch
// the shared DirectionNav (which still serves the other d3 screens).
import Link from 'next/link';
import { Button, space as u } from './primitives';

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
      className="d3-mkt-header"
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
      {/* Left: wordmark + small translucent prototype screen-switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: u(2) }}>
        <Link
          href="/d3/home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--rd-font-display)',
            fontWeight: 700,
            fontSize: '1.3rem',
            letterSpacing: '-0.03em',
            color: 'var(--rd-color-hero-text)',
            textDecoration: 'none',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: '#ffffff',
              color: 'var(--rd-color-hero-bg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            R
          </span>
          Robin Dock
        </Link>

        {/* Prototype switcher — visually secondary; reachable for review. */}
        <nav
          aria-label="Prototype screens"
          className="d3-mkt-screens"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: 2,
            borderRadius: 'var(--rd-radius-round)',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          {SCREENS.map((s) => {
            const active = s.id === current;
            return (
              <Link
                key={s.id}
                href={`/d3/${s.id}`}
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
                  color: active ? 'var(--rd-color-hero-bg)' : 'rgba(255,255,255,0.72)',
                  background: active ? '#ffffff' : 'transparent',
                }}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Center: marketing links */}
      <nav className="d3-mkt-links" style={{ display: 'flex', alignItems: 'center', gap: u(3) }}>
        {MARKETING_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            style={{
              fontSize: '0.92rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.82)',
              textDecoration: 'none',
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Right: auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: u(1.5) }}>
        <a
          href="#"
          className="d3-mkt-login"
          style={{
            fontSize: '0.92rem',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.82)',
            textDecoration: 'none',
          }}
        >
          Log in
        </a>
        <Button variant="primary" href="#" style={{ padding: '9px 16px', fontSize: '0.9rem' }}>
          Get Robin Dock free
        </Button>
      </div>

      {/* Collapse the secondary clusters on narrow widths so the header stays a
          single clean row (wordmark + CTA) with no horizontal scroll. */}
      <style>{`
        @media (max-width: 900px) {
          .d3-mkt-header .d3-mkt-links { display: none !important; }
        }
        @media (max-width: 640px) {
          .d3-mkt-header .d3-mkt-screens,
          .d3-mkt-header .d3-mkt-login { display: none !important; }
        }
      `}</style>
    </header>
  );
}
