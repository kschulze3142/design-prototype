// d4 Hero — two-column (DR-004p). Left-aligned Fraunces headline with one
// Robin-Orange accent-underlined word (the spark), Inter subline, the
// email-capture pill + teal CTA, and a trust microcopy row. The Robin Dock fax
// product surface sits to the RIGHT in a frame backed by FOREST TEAL — d2/Harvest
// backs this frame in its coral accent, but a frame is a large structural block,
// so under the two-color discipline it routes to the workhorse teal, NOT orange.
// Stacks to a single column on narrow viewports.
import { Check } from 'lucide-react';
import { Container, AccentUnderline, Eyebrow, space as u } from './primitives';
import { EmailCapture } from './EmailCapture';
import { HeroSurface } from './surfaces';

const TRUST = ['Free trial', 'No credit card', 'Cancel anytime'] as const;

export function Hero() {
  return (
    <section style={{ paddingBlock: u(9) }}>
      <Container>
        <div
          className="d4-hero-grid"
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
                fontSize: 'clamp(40px, 5.6vw, 70px)',
                lineHeight: 1.1,
                letterSpacing: '-0.035em',
                fontWeight: 400,
                margin: `${u(2)} 0 ${u(2.5)}`,
                color: 'var(--rd-color-heading)',
              }}
            >
              Faxes that <AccentUnderline>file</AccentUnderline> themselves.
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

            {/* Trust microcopy with small teal checks (confirmed/included = teal). */}
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
                  <Check size={15} strokeWidth={2.6} color="var(--rd-color-primary)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — product surface in a TEAL-backed frame */}
          <div
            style={{
              padding: 10,
              borderRadius: 28,
              background: 'var(--rd-color-primary)',
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
          .d4-hero-grid {
            grid-template-columns: 1fr !important;
            gap: ${u(5)} !important;
          }
        }
      `}</style>
    </section>
  );
}
