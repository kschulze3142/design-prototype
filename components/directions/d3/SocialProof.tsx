// d3 SocialProof — a calm Notion-style proof band on white: a pull-quote with
// attribution, a row of wordmark placeholders, and three derived metrics. Copy is
// Notion-style placeholder reskinned to Robin Dock; the delivery figure is pulled
// from the shared @/lib/designMock so it stays consistent with the rest of the page.
import { designMock } from '@/lib/designMock';
import { Container, space as u } from './primitives';

const LOGOS = ['Northgate Health', 'Cedar Clinic', 'Meridian Care', 'Lakeside Group', 'Vantage Medical'] as const;

export function SocialProof() {
  const { deliverySuccessRate, faxesReceivedThisMonth } = designMock.stats;
  const metrics = [
    { value: `${(deliverySuccessRate * 100).toFixed(1)}%`, label: 'First-attempt delivery' },
    { value: faxesReceivedThisMonth.toLocaleString(), label: 'Inbound faxes routed / month' },
    { value: '< 1 min', label: 'Average time to handled' },
  ];

  return (
    <section style={{ background: 'var(--rd-color-bg)', paddingBlock: u(10), borderTop: '1px solid var(--rd-color-border)' }}>
      <Container width={920} style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--rd-color-text-muted)' }}>
          Trusted by modern practices
        </p>

        <blockquote
          style={{
            margin: `${u(3)} auto 0`,
            maxWidth: 720,
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'clamp(22px, 3.2vw, 30px)',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: 'var(--rd-color-heading)',
          }}
        >
          “Every referral used to mean someone walking paper to the right desk. Now it just lands where it
          belongs — and we can prove it landed.”
        </blockquote>
        <div style={{ marginTop: u(2.5), fontSize: '0.92rem', color: 'var(--rd-color-text-muted)' }}>
          Practice Manager · Northgate Health
        </div>

        {/* Wordmark placeholders */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: `${u(2)} ${u(5)}`,
            marginTop: u(5),
          }}
        >
          {LOGOS.map((name) => (
            <span
              key={name}
              style={{
                fontFamily: 'var(--rd-font-display)',
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'rgba(0,0,0,0.32)',
              }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Derived metrics */}
        <div
          className="d3-proof-metrics"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: u(3),
            marginTop: u(6),
            paddingTop: u(5),
            borderTop: '1px solid var(--rd-color-border)',
          }}
        >
          {metrics.map((m) => (
            <div key={m.label}>
              <div
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: 'clamp(30px, 5vw, 44px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--rd-color-heading)',
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--rd-color-text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        @media (max-width: 640px) {
          .d3-proof-metrics { grid-template-columns: 1fr !important; gap: ${u(3)} !important; }
        }
      `}</style>
    </section>
  );
}
