// d2 SocialProof — Harvest's centered statement band (DR-004h). One quiet serif
// statement line with a coral-underlined figure, over a calm stat row drawn from
// the shared mock. No logo wall, no shouting. (The figure is Harvest-style
// placeholder for now; the stats are real mock data.)
import { designMock } from '@/lib/designMock';
import { CoralUnderline, Section, space as u } from './primitives';

export function SocialProof() {
  const { deliverySuccessRate, faxesSentThisMonth, faxesReceivedThisMonth } = designMock.stats;
  const stats = [
    { value: `${(deliverySuccessRate * 100).toFixed(1)}%`, label: 'delivery success rate' },
    {
      value: (faxesSentThisMonth + faxesReceivedThisMonth).toLocaleString(),
      label: 'faxes handled this month',
    },
    { value: '< 1 min', label: 'average confirmation time' },
  ];

  return (
    <Section tint>
      <p
        style={{
          fontFamily: 'var(--rd-font-display)',
          fontSize: 'clamp(28px, 3.8vw, 44px)',
          lineHeight: 1.2,
          letterSpacing: '-0.035em',
          fontWeight: 400,
          textAlign: 'center',
          color: 'var(--rd-color-heading)',
          maxWidth: 820,
          marginInline: 'auto',
          marginBlock: 0,
        }}
      >
        Over <CoralUnderline>1,200 practices</CoralUnderline> use Robin Dock to send faxes
        they can prove arrived.
      </p>

      {/* Quiet stat line */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: u(2),
          maxWidth: 720,
          marginInline: 'auto',
          marginTop: u(6),
          paddingTop: u(5),
          borderTop: '1px solid var(--rd-color-border)',
          textAlign: 'center',
        }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: 'var(--rd-font-display)',
                fontSize: '2.2rem',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                color: 'var(--rd-color-heading)',
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--rd-color-text-muted)', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
