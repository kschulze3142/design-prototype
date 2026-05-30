// d2 Hero — centered, plain, no collage. Benefit headline + inline email
// capture, calm product surface below. The section uses overflow:hidden so the
// surface can bleed off the bottom (clipped, not shrunk) and the surface's
// margin-overhanging chips can't push horizontal scroll.
import { Mail } from 'lucide-react';
import { Button, Eyebrow, space as u } from './primitives';
import { HeroSurface } from './surfaces';

export function Hero() {
  return (
    <section
      style={{
        paddingTop: u(7),
        paddingBottom: 0,
        background: 'var(--rd-hero-gradient)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 720, marginInline: 'auto', textAlign: 'center', paddingInline: u(2) }}>
        <Eyebrow>Cloud fax for modern practices</Eyebrow>
        <h1
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'calc(3.1rem * var(--rd-type-scale))',
            lineHeight: 1.04,
            letterSpacing: '-0.032em',
            fontWeight: 700,
            margin: `${u(1.6)} 0 ${u(1.2)}`,
            color: 'var(--rd-color-text)',
          }}
        >
          Faxing that finally feels safe.
        </h1>
        <p
          style={{
            fontSize: '1.12rem',
            lineHeight: 1.6,
            color: 'var(--rd-color-text-muted)',
            margin: `0 auto ${u(3)}`,
            maxWidth: 560,
          }}
        >
          Robin Dock sends, receives, and confirms every fax — with delivery receipts,
          automatic patient routing, and no hardware to babysit.
        </p>

        {/* Inline email capture — mock, non-submitting. The mail icon + input +
            primary button share one fully-rounded pill shell; "See demo" is a
            matching pill alongside. */}
        <form
          style={{
            display: 'flex',
            gap: u(1.2),
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            maxWidth: 540,
            marginInline: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1 1 280px',
              minWidth: 260,
              height: u(5.5),
              paddingLeft: u(1.6),
              paddingRight: u(0.6),
              gap: u(1),
              borderRadius: 999,
              border: '1px solid var(--rd-color-border)',
              background: 'var(--rd-color-surface)',
              boxShadow: 'var(--rd-shadow-sm)',
            }}
          >
            <span aria-hidden style={{ color: 'var(--rd-color-text-muted)', display: 'inline-flex', flexShrink: 0 }}>
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="you@practice.com"
              aria-label="Work email"
              style={{
                flex: 1,
                minWidth: 0,
                height: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
                color: 'var(--rd-color-text)',
                fontFamily: 'var(--rd-font-body)',
              }}
            />
            <Button
              type="button"
              variant="primary"
              style={{ height: u(4.4), paddingInline: u(2), borderRadius: 999, flexShrink: 0 }}
            >
              Start trial
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            href="#demo"
            style={{ height: u(5.5), paddingInline: u(2.4), borderRadius: 999 }}
          >
            See demo
          </Button>
        </form>
        <p style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)', marginTop: u(1.4) }}>
          14-day free trial · No credit card · Cancel in one click
        </p>
      </div>

      {/* Composed marketing product surface — wide, sitting up close to the CTA,
          bottom edge bleeding past the section fold (clipped by overflow:hidden). */}
      <div
        style={{ maxWidth: 1080, marginInline: 'auto', marginTop: u(2.2), marginBottom: u(-7), paddingInline: u(2) }}
        id="demo"
      >
        <HeroSurface />
      </div>
    </section>
  );
}
