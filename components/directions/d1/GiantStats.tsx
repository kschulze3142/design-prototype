// d1 GiantStats — SEMrush's signature "data-as-hero" device (DR-001p). One
// inverted hero-stat card (green-black bg, GIANT lavender numeral) leads, then a
// stacked ledger of enormous Space Grotesk numerals — each paired with a short
// benefit headline to the right. The numerals are visual elements, not body text,
// so they clamp huge on desktop and shrink cleanly on mobile. Headline metrics
// come straight from the shared @/lib/designMock (success rate, pages, sends);
// the avg-confirmation figure is a plausible derived metric. Deterministic only.
import { ShieldCheck } from 'lucide-react';
import { designMock } from '@/lib/designMock';
import { Container, Eyebrow, space as u } from './primitives';

export function GiantStats() {
  const { deliverySuccessRate, pagesUsed, faxesSentThisMonth } = designMock.stats;

  // Stacked ledger — real designMock figures plus one plausible derived metric.
  const rows = [
    {
      value: '0',
      headline: 'Nothing fails in silence.',
      body: 'Every send that can’t complete surfaces immediately — no referral sits stuck for days.',
    },
    {
      value: pagesUsed.toLocaleString(),
      headline: 'Pages sent this month, fully tracked.',
      body: 'Every page accounted for against your plan, with a receipt behind each transmission.',
    },
    {
      value: faxesSentThisMonth.toLocaleString(),
      headline: 'Faxes delivered, confirmed end to end.',
      body: 'Outbound volume that returns a timestamped delivery receipt on every single fax.',
    },
    {
      value: '<1 min',
      headline: 'Average time to a confirmed receipt.',
      body: 'You know a fax landed almost as fast as you sent it — no waiting, no wondering.',
    },
  ];

  return (
    <section style={{ paddingBlock: u(7) }}>
      <Container>
        <div style={{ maxWidth: 720, marginBottom: u(5) }}>
          <Eyebrow>The numbers behind every fax</Eyebrow>
        </div>

        {/* Inverted hero-stat card — green-black bg, giant lavender numeral. */}
        <div
          className="d1-giant-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center',
            gap: u(5),
            padding: `${u(5)} ${u(5)}`,
            borderRadius: 'var(--rd-radius-lg)',
            background: 'var(--rd-color-heading)',
            marginBottom: u(6),
          }}
        >
          <div
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'clamp(72px, 12vw, 168px)',
              fontWeight: 600,
              letterSpacing: '-0.05em',
              lineHeight: 0.92,
              color: 'var(--rd-color-accent)',
              whiteSpace: 'nowrap',
            }}
          >
            {(deliverySuccessRate * 100).toFixed(1)}%
          </div>
          <div style={{ maxWidth: 420 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--rd-color-accent)',
                marginBottom: u(1.5),
              }}
            >
              <ShieldCheck size={15} strokeWidth={2.4} />
              First-attempt delivery
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--rd-font-display)',
                fontSize: 'clamp(22px, 3vw, 32px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: '#ffffff',
              }}
            >
              Faxes that confirm themselves — the first time, almost every time.
            </p>
          </div>
        </div>

        {/* Stacked giant-numeral ledger. */}
        <div>
          {rows.map((r, i) => (
            <div
              key={r.headline}
              className="d1-giant-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 0.9fr) 1fr',
                alignItems: 'center',
                gap: u(5),
                paddingBlock: u(4),
                borderTop: i === 0 ? 'none' : '1px solid var(--rd-color-border)',
              }}
            >
              <div
                className="d1-giant-num"
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: 'clamp(64px, 13vw, 168px)',
                  fontWeight: 600,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.9,
                  color: 'var(--rd-color-heading)',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.value}
              </div>
              <div style={{ maxWidth: 440 }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'var(--rd-font-display)',
                    fontSize: 'clamp(20px, 2.6vw, 28px)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    color: 'var(--rd-color-heading)',
                  }}
                >
                  {r.headline}
                </h3>
                <p style={{ margin: `${u(1.5)} 0 0`, fontSize: '1rem', lineHeight: 1.55, color: 'var(--rd-color-text)' }}>
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Mobile: inverted card and ledger rows stack numeral-over-text. */}
      <style>{`
        @media (max-width: 760px) {
          .d1-giant-hero { grid-template-columns: 1fr !important; gap: ${u(2)} !important; }
          .d1-giant-row { grid-template-columns: 1fr !important; gap: ${u(1.5)} !important; }
          .d1-giant-num { line-height: 1 !important; }
        }
      `}</style>
    </section>
  );
}
