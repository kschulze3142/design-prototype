// d4 TrustBand — a quiet veterinary logo-trust row (DR-004d-p). Real ICP framing:
// veterinary practice names, set in a teal-tinted treatment so the trust signal
// reinforces the teal backbone (a small teal paw before each name, a teal eyebrow,
// hairline rules above/below). No shouting — a calm "you're in good company" beat
// right under the hero.
import { PawPrint } from 'lucide-react';
import { Container, Eyebrow, space as u } from './primitives';

const PRACTICES = [
  'Lakeside Animal Hospital',
  'Cedar Creek Veterinary',
  'Harbor Pet Clinic',
  'Brightwood Animal Care',
  'Meadowview Animal Hospital',
] as const;

export function TrustBand() {
  return (
    <section style={{ paddingBlock: u(5) }}>
      <Container>
        <div
          style={{
            borderTop: '1px solid var(--rd-color-border)',
            borderBottom: '1px solid var(--rd-color-border)',
            paddingBlock: u(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: u(2.4),
          }}
        >
          <Eyebrow>Trusted by veterinary teams nationwide</Eyebrow>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: `${u(1.6)} ${u(4)}`,
            }}
          >
            {PRACTICES.map((name) => (
              <li
                key={name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: u(1),
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: '1.02rem',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: 'var(--rd-color-heading)',
                }}
              >
                <PawPrint size={16} strokeWidth={2.2} color="var(--rd-color-primary)" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
