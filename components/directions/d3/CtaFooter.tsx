// d3 CtaFooter — the closing CTA + footer, on the DARK charcoal again so it
// bookends the hero and reinforces the dark-hero signature. A centered white
// headline + two CTAs, then a multi-column footer in muted white. Copy is
// Notion-style placeholder reskinned to Robin Dock.
import { Button, Container, space as u } from './primitives';

const FOOTER_COLUMNS: { heading: string; links: string[] }[] = [
  { heading: 'Product', links: ['Inbox', 'Routing', 'Departments', 'Patients', 'Pricing'] },
  { heading: 'Solutions', links: ['Primary care', 'Specialty clinics', 'Billing teams', 'Home health'] },
  { heading: 'Resources', links: ['Docs', 'Help center', 'Security', 'HIPAA & BAA'] },
  { heading: 'Company', links: ['About', 'Careers', 'Contact', 'Status'] },
];

export function CtaFooter() {
  return (
    <footer style={{ background: 'var(--rd-color-hero-bg)', color: 'var(--rd-color-hero-text)' }}>
      {/* Closing CTA */}
      <section style={{ paddingBlock: u(11) }}>
        <Container width={760} style={{ textAlign: 'center' }}>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'clamp(34px, 5.5vw, 54px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.033em',
              color: 'var(--rd-color-hero-text)',
            }}
          >
            Get every fax handled.
          </h2>
          <p style={{ margin: `${u(2.5)} auto 0`, maxWidth: 520, fontSize: '1.1rem', lineHeight: 1.5, color: 'var(--rd-color-hero-muted)' }}>
            Bring your whole fax operation into one workspace. Start free in minutes — no credit card,
            no hardware to install.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: u(1.5), justifyContent: 'center', marginTop: u(4) }}>
            <Button variant="primary" href="#" style={{ padding: '13px 22px', fontSize: '1rem' }}>
              Get Robin Dock free
            </Button>
            <Button variant="ghost-dark" href="#" style={{ padding: '13px 22px', fontSize: '1rem' }}>
              Talk to sales
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer columns */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <Container style={{ paddingBlock: u(6) }}>
          <div
            className="d3-footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr repeat(4, 1fr)',
              gap: u(4),
            }}
          >
            {/* Wordmark column */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--rd-font-display)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.03em',
                  color: 'var(--rd-color-hero-text)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: '#ffffff',
                    color: 'var(--rd-color-hero-bg)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  R
                </span>
                Robin Dock
              </div>
              <p style={{ margin: `${u(1.5)} 0 0`, maxWidth: 260, fontSize: '0.88rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.5)' }}>
                One workspace for your whole fax operation — routed, tracked, and handled.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                  {col.heading}
                </h3>
                <ul style={{ listStyle: 'none', margin: `${u(1.5)} 0 0`, padding: 0, display: 'grid', gap: u(1) }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
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
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: u(2),
              marginTop: u(5),
              paddingTop: u(3),
              borderTop: '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span>© 2026 Robin Dock. All rights reserved.</span>
            <span style={{ display: 'inline-flex', gap: u(2.5) }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Security</a>
            </span>
          </div>
        </Container>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .d3-footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .d3-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
