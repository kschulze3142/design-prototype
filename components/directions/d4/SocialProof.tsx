// d4 SocialProof — a centered statement band (DR-004p). One quiet Fraunces
// statement line with an orange accent-underlined figure (the spark), over a calm
// stat row drawn from the shared mock. No logo wall, no shouting.
import { designMock } from '@/lib/designMock';
import { AccentUnderline, Section, space as u } from './primitives';

export function SocialProof() {
  const { deliverySuccessRate, faxesSentThisMonth, faxesReceivedThisMonth } = designMock.stats;
  const stats = [
    { value: `${(deliverySuccessRate * 100).toFixed(1)}%`, label: 'auto-filed to the right patient' },
    {
      value: (faxesSentThisMonth + faxesReceivedThisMonth).toLocaleString(),
      label: 'documents handled this month',
    },
    { value: '< 1 min', label: 'average time to filed' },
  ];

  return (
    <Section tint>
      <p
        style={{
          fontFamily: 'var(--rd-font-display)',
          fontSize: 'clamp(28px, 3.8vw, 44px)',
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
          fontWeight: 400,
          textAlign: 'center',
          color: 'var(--rd-color-heading)',
          maxWidth: 820,
          marginInline: 'auto',
          marginBlock: 0,
        }}
      >
        Over <AccentUnderline>1,200 veterinary practices</AccentUnderline> trust Robin Dock to
        capture and organize every document they receive.
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
