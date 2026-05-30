// d2 SocialProof — a quiet customer quote or two plus a stat line drawn from
// the shared mock stats. No logos wall, no shouting.
import { Star } from 'lucide-react';
import { designMock } from '@/lib/designMock';
import { Eyebrow, Section, space as u } from './primitives';

const QUOTES = [
  {
    text: 'We moved three offices off the old fax server in an afternoon. Nothing got lost, and front desk stopped asking me if a referral went through.',
    author: 'Dana Whitfield',
    role: 'Practice Manager, Lakeside Family Care',
  },
  {
    text: 'The delivery receipts alone are worth it. I can prove a prior auth was sent, to the minute.',
    author: 'Marcus Reyes',
    role: 'Billing Lead, Northgate Orthopedics',
  },
];

export function SocialProof() {
  const { deliverySuccessRate, faxesSentThisMonth, faxesReceivedThisMonth } = designMock.stats;
  const stats = [
    { value: `${(deliverySuccessRate * 100).toFixed(1)}%`, label: 'delivery success rate' },
    { value: (faxesSentThisMonth + faxesReceivedThisMonth).toLocaleString(), label: 'faxes handled this month' },
    { value: '< 1 min', label: 'average confirmation time' },
  ];

  return (
    <Section>
      <div style={{ textAlign: 'center', marginBottom: u(5) }}>
        <Eyebrow>Trusted by practices</Eyebrow>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: u(2.4),
          marginBottom: u(5),
        }}
      >
        {QUOTES.map((q) => (
          <figure
            key={q.author}
            style={{
              margin: 0,
              padding: u(3),
              borderRadius: 'var(--rd-radius-lg)',
              background: 'var(--rd-color-surface)',
              border: '1px solid var(--rd-color-border)',
              boxShadow: 'var(--rd-shadow-sm)',
            }}
          >
            <div aria-hidden style={{ display: 'flex', gap: 2, marginBottom: u(1.6) }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} strokeWidth={0} fill="var(--rd-color-accent)" />
              ))}
            </div>
            <blockquote style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: 'var(--rd-color-text)' }}>
              “{q.text}”
            </blockquote>
            <figcaption style={{ marginTop: u(2), fontSize: '0.85rem', color: 'var(--rd-color-text-muted)' }}>
              <strong style={{ color: 'var(--rd-color-text)', fontWeight: 600 }}>{q.author}</strong>
              <br />
              {q.role}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Quiet stat line */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: u(2),
          paddingTop: u(4),
          borderTop: '1px solid var(--rd-color-border)',
          textAlign: 'center',
        }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: 'var(--rd-font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--rd-color-text)',
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--rd-color-text-muted)', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
