// d4 closing CTA + understated footer. Calm sign-off (teal primary button, ghost
// secondary), then a quiet footer led by the robin logo + Fraunces wordmark.
import { Button, space as u } from './primitives';

const FOOTER_LINKS: { heading: string; items: string[] }[] = [
  { heading: 'Product', items: ['Features', 'Pricing', 'Security', 'Status'] },
  { heading: 'Company', items: ['About', 'Customers', 'Careers', 'Contact'] },
  { heading: 'Resources', items: ['Help center', 'Porting guide', 'BAA', 'Privacy'] },
];

export function CtaFooter() {
  return (
    <>
      {/* Closing CTA — sits on the cream page, between the tinted social-proof
          band above and the white footer below. */}
      <section style={{ paddingBlock: u(10) }}>
        <div style={{ maxWidth: 640, marginInline: 'auto', textAlign: 'center', paddingInline: u(3) }}>
          <h2
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'clamp(34px, 4.2vw, 50px)',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              fontWeight: 400,
              margin: `0 0 ${u(1.6)}`,
              color: 'var(--rd-color-heading)',
            }}
          >
            Ready to retire the fax machine?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--rd-color-text-muted)', margin: `0 0 ${u(3.5)}` }}>
            Start a free trial today. Keep your number, cancel in one click.
          </p>
          <div style={{ display: 'flex', gap: u(1.2), justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary">Start free trial</Button>
            <Button variant="ghost" href="#demo">
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      {/* Understated footer */}
      <footer style={{ borderTop: '1px solid var(--rd-color-border)', background: 'var(--rd-color-surface)' }}>
        <div
          style={{
            maxWidth: 920,
            marginInline: 'auto',
            paddingBlock: u(6),
            paddingInline: u(2),
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 1.4fr) repeat(3, 1fr)',
            gap: u(4),
          }}
          className="d4-footer-grid"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: u(1) }}>
              <img
                src="/robin-dock-icon.svg"
                alt="Robin Dock"
                width={26}
                height={26}
                style={{ display: 'block', borderRadius: 6 }}
              />
              <span
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontWeight: 500,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--rd-color-heading)',
                }}
              >
                robin dock
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--rd-color-text-muted)', margin: `${u(1)} 0 0`, maxWidth: 220, lineHeight: 1.5 }}>
              Cloud fax for practices that care where their documents go.
            </p>
          </div>
          {FOOTER_LINKS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <div
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: 'var(--rd-color-text-muted)',
                  marginBottom: u(1.4),
                }}
              >
                {col.heading}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1) }}>
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{ fontSize: '0.88rem', color: 'var(--rd-color-text)', textDecoration: 'none' }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div
          style={{
            borderTop: '1px solid var(--rd-color-border)',
            paddingBlock: u(2.4),
            paddingInline: u(2),
          }}
        >
          <div
            style={{
              maxWidth: 920,
              marginInline: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: u(1),
              fontSize: '0.8rem',
              color: 'var(--rd-color-text-muted)',
            }}
          >
            <span>© 2026 Robin Dock, Inc.</span>
            <span>HIPAA-adjacent handling · BAA available · SOC 2 in progress</span>
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .d4-footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </footer>
    </>
  );
}
