// d2 FeatureSplit — one idea per section. Headline + customer quote on the
// left, a single focused product surface on the right. Lots of whitespace.
import type { ReactNode } from 'react';
import { Card, Eyebrow, Section, space as u } from './primitives';

interface Props {
  eyebrow: string;
  headline: string;
  body: string;
  quote: { text: string; author: string; role: string };
  surface: ReactNode;
  /** Put the surface on the left instead of the right for visual rhythm. */
  reverse?: boolean;
  tint?: boolean;
}

export function FeatureSplit({ eyebrow, headline, body, quote, surface, reverse, tint }: Props) {
  const text = (
    <div style={{ maxWidth: 420 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        style={{
          fontFamily: 'var(--rd-font-display)',
          fontSize: 'calc(1.9rem * var(--rd-type-scale))',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          margin: `${u(1.6)} 0 ${u(1.4)}`,
          color: 'var(--rd-color-text)',
        }}
      >
        {headline}
      </h2>
      <p style={{ fontSize: '1.02rem', lineHeight: 1.6, color: 'var(--rd-color-text-muted)', margin: 0 }}>
        {body}
      </p>
      <figure
        style={{
          margin: `${u(3)} 0 0`,
          paddingLeft: u(2),
          borderLeft: '2px solid var(--rd-color-accent)',
        }}
      >
        <blockquote style={{ margin: 0, fontSize: '1rem', lineHeight: 1.55, color: 'var(--rd-color-text)' }}>
          “{quote.text}”
        </blockquote>
        <figcaption style={{ marginTop: u(1.2), fontSize: '0.84rem', color: 'var(--rd-color-text-muted)' }}>
          <strong style={{ color: 'var(--rd-color-text)', fontWeight: 600 }}>{quote.author}</strong>
          {' · '}
          {quote.role}
        </figcaption>
      </figure>
    </div>
  );

  const visual = (
    <div style={{ display: 'flex', justifyContent: reverse ? 'flex-start' : 'flex-end' }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>{surface}</Card>
    </div>
  );

  return (
    <Section tint={tint}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: u(5),
          alignItems: 'center',
        }}
      >
        {reverse ? (
          <>
            {visual}
            {text}
          </>
        ) : (
          <>
            {text}
            {visual}
          </>
        )}
      </div>
    </Section>
  );
}
