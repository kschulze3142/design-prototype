// d1 FeatureSection — SEMrush's big-headline feature block (DR-007): a tight
// 64px Space Grotesk headline + body on one side, a product surface card on the
// other, alternating sides down the page. Body copy is SEMrush-style placeholder
// for now (the layout reads true); the hero above is the Robin Dock content.
import type { ReactNode } from 'react';
import { Container, Display, Eyebrow, Button, Card, space as u } from './primitives';

export function FeatureSection({
  eyebrow,
  headline,
  body,
  bullets,
  surface,
  reverse = false,
  tint = false,
}: {
  eyebrow: string;
  headline: ReactNode;
  body: string;
  bullets?: readonly string[];
  surface: ReactNode;
  reverse?: boolean;
  tint?: boolean;
}) {
  return (
    <section style={{ paddingBlock: u(10), background: tint ? 'var(--rd-color-accent-soft)' : 'transparent' }}>
      <Container>
        <div
          className="d1-feature-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: u(6),
            alignItems: 'center',
            direction: reverse ? 'rtl' : 'ltr',
          }}
        >
          {/* Copy — reset direction so text always reads LTR even when reversed */}
          <div style={{ direction: 'ltr', maxWidth: 520 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Display as="h2" size="section" style={{ marginBlock: u(2) }}>
              {headline}
            </Display>
            <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--rd-color-text)' }}>
              {body}
            </p>
            {bullets ? (
              <ul style={{ listStyle: 'none', margin: `${u(3)} 0 0`, padding: 0, display: 'grid', gap: u(1.4) }}>
                {bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: u(1.2),
                      fontSize: '1rem',
                      color: 'var(--rd-color-text)',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        flexShrink: 0,
                        background: 'var(--rd-color-accent)',
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}
            <div style={{ marginTop: u(3.5) }}>
              <Button variant="primary" href="#">
                Learn more
              </Button>
            </div>
          </div>

          {/* Product surface */}
          <div style={{ direction: 'ltr' }}>
            <Card elevated>{surface}</Card>
          </div>
        </div>
      </Container>

      {/* Stack to a single column (copy first) on narrow viewports. */}
      <style>{`
        @media (max-width: 900px) {
          .d1-feature-grid {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
            gap: ${u(4)} !important;
          }
        }
      `}</style>
    </section>
  );
}
