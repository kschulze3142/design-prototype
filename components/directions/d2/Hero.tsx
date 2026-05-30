// d2 Hero — centered, plain, no collage. Benefit headline + inline email
// capture, calm product surface below.
import { Mail } from 'lucide-react';
import { Button, Card, Eyebrow, space as u } from './primitives';
import { FaxListSurface } from './surfaces';

export function Hero() {
  return (
    <section style={{ paddingBlock: u(11), background: 'var(--rd-color-bg-tint)' }}>
      <div style={{ maxWidth: 720, marginInline: 'auto', textAlign: 'center', paddingInline: u(2) }}>
        <Eyebrow>Cloud fax for modern practices</Eyebrow>
        <h1
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'calc(3rem * var(--rd-type-scale))',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            margin: `${u(2)} 0 ${u(1.6)}`,
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
            margin: `0 auto ${u(3.5)}`,
            maxWidth: 560,
          }}
        >
          Robin Dock sends, receives, and confirms every fax — with delivery receipts,
          automatic patient routing, and no hardware to babysit.
        </p>

        {/* Inline email capture — mock, non-submitting. */}
        <form
          style={{
            display: 'flex',
            gap: u(1.2),
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: 520,
            marginInline: 'auto',
          }}
        >
          <label style={{ position: 'relative', flex: '1 1 240px', minWidth: 220 }}>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--rd-color-text-muted)',
                display: 'inline-flex',
              }}
            >
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="you@practice.com"
              aria-label="Work email"
              style={{
                width: '100%',
                height: `calc(var(--rd-space-unit) * 5)`,
                paddingLeft: 34,
                paddingRight: 12,
                borderRadius: 'var(--rd-radius-md)',
                border: '1px solid var(--rd-color-border)',
                background: 'var(--rd-color-surface)',
                fontSize: '0.95rem',
                color: 'var(--rd-color-text)',
                fontFamily: 'var(--rd-font-body)',
              }}
            />
          </label>
          <Button type="button" variant="primary">
            Start trial
          </Button>
          <Button type="button" variant="ghost" href="#demo">
            See demo
          </Button>
        </form>
        <p style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)', marginTop: u(1.4) }}>
          14-day free trial · No credit card · Cancel in one click
        </p>
      </div>

      {/* Calm product surface, shown plainly below the fold of the headline. */}
      <div style={{ maxWidth: 720, marginInline: 'auto', marginTop: u(5), paddingInline: u(2) }} id="demo">
        <Card>
          <FaxListSurface limit={5} />
        </Card>
      </div>
    </section>
  );
}
