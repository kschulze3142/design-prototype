// d2 closing CTA + understated footer. Calm sign-off, no loud final pitch.
import { Button, space as u } from './primitives';

const FOOTER_LINKS: { heading: string; items: string[] }[] = [
  { heading: 'Product', items: ['Features', 'Pricing', 'Security', 'Status'] },
  { heading: 'Company', items: ['About', 'Customers', 'Careers', 'Contact'] },
  { heading: 'Resources', items: ['Help center', 'Porting guide', 'BAA', 'Privacy'] },
];

export function CtaFooter() {
  return (
    <>
      {/* Closing CTA */}
      <section style={{ background: 'var(--rd-color-bg-tint)', paddingBlock: u(11) }}>
        <div style={{ maxWidth: 620, marginInline: 'auto', textAlign: 'center', paddingInline: u(2) }}>
          <h2
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'calc(2.3rem * var(--rd-type-scale))',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              margin: `0 0 ${u(1.6)}`,
              color: 'var(--rd-color-text)',
            }}
          >
            Ready to retire the fax machine?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--rd-color-text-muted)', margin: `0 0 ${u(3)}` }}>
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
          className="d2-footer-grid"
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--rd-font-display)',
                fontWeight: 600,
                fontSize: '1.05rem',
                color: 'var(--rd-color-text)',
              }}
            >
              Robin Dock
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
            .d2-footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </footer>
    </>
  );
}
