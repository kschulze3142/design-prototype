// d1 Hero — SEMrush centered hero (DR-007). This is the key visual contrast with
// D2's left-aligned two-column: SEMrush centers a NARROW text column (eyebrow,
// huge 84px Space Grotesk headline, short subline, the pill email-capture) and
// then drops a WIDE-but-contained product dashboard BELOW it. The whole section
// sits on the pale sage wash (full-bleed background); the dashboard keeps a
// margin on both sides — it does not run edge-to-edge. Robin Dock hero content.
import { Container, Display, Eyebrow, space as u } from './primitives';
import { EmailCapture } from './EmailCapture';
import { HeroDashboardSurface } from './surfaces';

export function Hero() {
  return (
    <section style={{ background: 'var(--rd-color-hero-wash)', paddingTop: u(7), paddingBottom: u(9) }}>
      {/* Narrow centered text column */}
      <Container width={820}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: u(3), textAlign: 'center' }}>
          <Eyebrow align="center">Cloud fax for modern practices</Eyebrow>
          <Display as="h1" size="hero" align="center">
            Never lose a fax again.
          </Display>
          <p
            style={{
              margin: 0,
              maxWidth: 560,
              fontSize: '1.2rem',
              lineHeight: 1.55,
              color: 'var(--rd-color-text)',
            }}
          >
            Every fax sent, received, and confirmed — with a timestamped delivery
            receipt on each one, automatic patient routing, and zero silent
            failures. If it didn’t go through, you’ll know.
          </p>
          <EmailCapture center buttonLabel="Get insights" />
        </div>
      </Container>

      {/* Wide-but-contained product surface below the text */}
      <Container width={1160} style={{ marginTop: u(7) }}>
        <HeroDashboardSurface />
      </Container>
    </section>
  );
}
