// d1 CtaFooter — SEMrush's closing CTA + footer (DR-007): a centered final call
// on the pale sage wash (echoing the hero), the pill email-capture, then a quiet
// multi-column footer. SEMrush-style placeholder footer links; the wordmark and
// the centered headline carry the bold display face.
import { Container, Display, space as u } from './primitives';
import { EmailCapture } from './EmailCapture';

const FOOTER_GROUPS = [
  { title: 'Product', links: ['Features', 'Routing', 'Delivery receipts', 'Integrations'] },
  { title: 'Solutions', links: ['Clinics', 'Billing teams', 'Labs', 'Enterprise'] },
  { title: 'Resources', links: ['Docs', 'Guides', 'Status', 'Support'] },
  { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Contact'] },
] as const;

export function CtaFooter() {
  return (
    <>
      <section style={{ background: 'var(--rd-color-hero-wash)', paddingBlock: u(8) }}>
        <Container width={820}>
          <div style={{ display: 'grid', justifyItems: 'center', gap: u(3), textAlign: 'center' }}>
            <Display as="h2" size="section" align="center">
              Stop wondering if it sent.
            </Display>
            <p
              style={{
                margin: 0,
                maxWidth: 520,
                fontSize: '1.15rem',
                lineHeight: 1.55,
                color: 'var(--rd-color-text)',
              }}
            >
              Start sending faxes that confirm themselves. No hardware, no fax
              server, no silent failures.
            </p>
            <EmailCapture center buttonLabel="Get insights" />
          </div>
        </Container>
      </section>

      <footer style={{ paddingBlock: u(7), borderTop: '1px solid var(--rd-color-border)' }}>
        <Container>
          <div
            className="d1-footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr repeat(4, 1fr)',
              gap: u(4),
              alignItems: 'start',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontWeight: 600,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.03em',
                  color: 'var(--rd-color-heading)',
                }}
              >
                Robin Dock
              </span>
              <p style={{ margin: `${u(1.5)} 0 0`, fontSize: '0.9rem', color: 'var(--rd-color-text-muted)' }}>
                Cloud fax with delivery you can prove.
              </p>
            </div>
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--rd-color-heading)',
                    marginBottom: u(1.5),
                  }}
                >
                  {group.title}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1) }}>
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--rd-color-text-muted)',
                          textDecoration: 'none',
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: u(5),
              paddingTop: u(3),
              borderTop: '1px solid var(--rd-color-border)',
              fontSize: '0.85rem',
              color: 'var(--rd-color-text-muted)',
            }}
          >
            © 2026 Robin Dock. A Robin Dock design-prototype direction.
          </div>
        </Container>

        <style>{`
          @media (max-width: 860px) { .d1-footer-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 520px) { .d1-footer-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </footer>
    </>
  );
}
