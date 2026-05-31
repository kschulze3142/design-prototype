// d4 Hero — DR-004d-p. Repositioned for the real ICP: veterinary clinics. A
// left-aligned Fraunces headline with one Robin-Orange accent-underlined word
// (the rare spark), an Inter subline, the email-capture pill + teal CTA, and a
// trust microcopy row — all in a top copy block. Below it, the detailed
// three-pane DOCUMENT INBOX spans the FULL container width as the hero
// centerpiece (it needs the room to read as a real app), framed in a soft teal
// wash with a soft shadow. Panes stack on narrow viewports.
import { Check } from 'lucide-react';
import { Container, AccentUnderline, Eyebrow, space as u } from './primitives';
import { EmailCapture } from './EmailCapture';
import { InboxHeroSurface } from './surfaces';

const TRUST = ['Free trial', 'No credit card', 'Works with your PIMS'] as const;

export function Hero() {
  return (
    <section style={{ paddingBlock: u(8) }}>
      <Container>
        {/* Top — copy + capture, left aligned */}
        <div style={{ maxWidth: 720 }}>
          <Eyebrow>Document management for veterinary clinics</Eyebrow>
          <h1
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'clamp(40px, 5.4vw, 68px)',
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              fontWeight: 400,
              margin: `${u(2)} 0 ${u(2.5)}`,
              color: 'var(--rd-color-heading)',
            }}
          >
            The vertical document inbox for{' '}
            <AccentUnderline>vet clinics</AccentUnderline>.
          </h1>
          <p
            style={{
              fontSize: '1.18rem',
              lineHeight: 1.6,
              color: 'var(--rd-color-text-muted)',
              margin: `0 0 ${u(3.5)}`,
              maxWidth: 600,
            }}
          >
            Capture, organize, and deliver every document your clinic receives —
            faxed lab results, referrals, radiology reports, and DVM letters —
            sorted onto the right patient before anyone touches them.
          </p>

          <div style={{ maxWidth: 460 }}>
            <EmailCapture buttonLabel="Start free trial" />
          </div>

          {/* Trust microcopy with small teal checks (confirmed/included = teal). */}
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${u(0.8)} ${u(2.4)}`,
              margin: `${u(2.4)} 0 0`,
              padding: 0,
            }}
          >
            {TRUST.map((item) => (
              <li
                key={item}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: u(0.8),
                  fontSize: '0.88rem',
                  color: 'var(--rd-color-text-muted)',
                }}
              >
                <Check size={15} strokeWidth={2.6} color="var(--rd-color-primary)" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Centerpiece — full-width three-pane document inbox in a teal-wash frame. */}
        <div
          style={{
            marginTop: u(6),
            padding: 12,
            borderRadius: 28,
            background:
              'linear-gradient(160deg, var(--rd-color-primary) 0%, var(--rd-color-primary-strong) 100%)',
            boxShadow: 'var(--rd-shadow-lg)',
          }}
        >
          <InboxHeroSurface />
        </div>
      </Container>
    </section>
  );
}
