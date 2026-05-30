// d2 Hero — Harvest two-column (DR-004h). Left-aligned serif headline with one
// coral-underlined accent word, sans subline, the email-capture pill + black CTA,
// and a trust microcopy row. The Robin Dock fax product surface sits to the RIGHT
// in a coral-backed rounded frame (Harvest frames its product shot in coral).
// Stacks to a single column on narrow viewports.
import { Check } from 'lucide-react';
import { Container, CoralUnderline, Eyebrow, space as u } from './primitives';
import { EmailCapture } from './EmailCapture';
import { HeroSurface } from './surfaces';

const TRUST = ['Free trial', 'No credit card', 'Cancel anytime'] as const;

export function Hero() {
  return (
    <section style={{ paddingBlock: u(9) }}>
      <Container>
        <div
          className="d2-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: u(6),
            alignItems: 'center',
          }}
        >
          {/* Left — copy + capture */}
          <div style={{ maxWidth: 560 }}>
            <Eyebrow>Cloud fax for modern practices</Eyebrow>
            <h1
              style={{
                fontFamily: 'var(--rd-font-display)',
                // Spec: 70px / 77px (≈1.1) / weight 400 / -2.8px (≈-0.04em).
                // Clamped down for narrow viewports; the em letter-spacing scales with it.
                fontSize: 'clamp(40px, 5.6vw, 70px)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                fontWeight: 400,
                margin: `${u(2)} 0 ${u(2.5)}`,
                color: 'var(--rd-color-heading)',
              }}
            >
              Faxes that <CoralUnderline>file</CoralUnderline> themselves.
            </h1>
            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.6,
                color: 'var(--rd-color-text-muted)',
                margin: `0 0 ${u(3.5)}`,
                maxWidth: 480,
              }}
            >
              Robin Dock sends, receives, and confirms every fax — with delivery
              receipts, automatic patient routing, and no hardware to babysit.
            </p>

            <EmailCapture buttonLabel="Start free trial" />

            {/* Trust microcopy with small coral checks */}
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexWrap: 'wrap',
                gap: `${u(0.8)} ${u(2.4)}`,
                margin: `${u(2.4)} 0 0`,
                padding: 0,
              }}
            >
              {TRUST.map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: u(0.8),
                    fontSize: '0.88rem',
                    color: 'var(--rd-color-text-muted)',
                  }}
                >
                  <Check size={15} strokeWidth={2.6} color="var(--rd-color-accent)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — product surface in a coral-backed frame */}
          <div
            style={{
              padding: 10,
              borderRadius: 28,
              background: 'var(--rd-color-accent)',
              boxShadow: 'var(--rd-shadow-lg)',
            }}
          >
            <HeroSurface />
          </div>
        </div>
      </Container>

      {/* Stack cleanly on narrow viewports — text first, then the framed surface. */}
      <style>{`
        @media (max-width: 900px) {
          .d2-hero-grid {
            grid-template-columns: 1fr !important;
            gap: ${u(5)} !important;
          }
        }
      `}</style>
    </section>
  );
}
