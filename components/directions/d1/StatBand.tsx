// d1 StatBand — SEMrush's data-forward proof strip (DR-007): a dark green-black
// band with huge tight Space Grotesk numerals, the lavender accent picking out
// each figure's qualifier. Numbers are drawn from the shared designMock so D1
// shows the same underlying data as the other directions, in a bolder skin.
import { designMock } from '@/lib/designMock';
import { Container, space as u } from './primitives';

export function StatBand() {
  const { faxesSentThisMonth, faxesReceivedThisMonth, deliverySuccessRate } = designMock.stats;

  const stats = [
    { value: `${(deliverySuccessRate * 100).toFixed(1)}%`, label: 'first-attempt delivery rate' },
    { value: faxesSentThisMonth.toLocaleString(), label: 'faxes sent this month' },
    { value: faxesReceivedThisMonth.toLocaleString(), label: 'inbound auto-routed' },
    { value: '0', label: 'silent failures' },
  ];

  return (
    <section style={{ paddingBlock: u(5) }}>
      <Container>
        <div
          className="d1-statband"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: u(4),
            padding: `${u(6)} ${u(5)}`,
            borderRadius: 'var(--rd-radius-lg)',
            background: 'var(--rd-color-heading)',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: 'clamp(38px, 5vw, 56px)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: '#ffffff',
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  marginTop: u(1.5),
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--rd-color-accent)',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        @media (max-width: 760px) { .d1-statband { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
