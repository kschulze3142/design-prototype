// d4 closing CTA + understated footer (DR-004d-p). The closing CTA is now a full
// FOREST-TEAL band — the structural brand color carrying the final word, with
// cream/white text, a white pill button (teal text), and a cream-outline ghost.
// Below it, a quiet footer led by the robin logo + Fraunces wordmark.
import { space as u } from './primitives';

const FOOTER_LINKS: { heading: string; items: string[] }[] = [
  { heading: 'Product', items: ['Features', 'Pricing', 'Security', 'Status'] },
  { heading: 'Company', items: ['About', 'Customers', 'Careers', 'Contact'] },
  { heading: 'Resources', items: ['Help center', 'Integrations', 'BAA', 'Privacy'] },
];

export function CtaFooter() {
  return (
    <>
      {/* Closing CTA — a full forest-teal band. Cream/white text on deep teal. */}
      <section
        style={{
          marginBlock: u(2),
          paddingBlock: u(11),
          background:
            'linear-gradient(160deg, var(--rd-color-primary) 0%, var(--rd-color-primary-strong) 100%)',
        }}
      >
        <div style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', paddingInline: u(3) }}>
          <h2
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'clamp(34px, 4.2vw, 52px)',
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              fontWeight: 400,
              margin: `0 0 ${u(1.6)}`,
              color: '#ffffff',
            }}
          >
            Every document, in its place.
          </h2>
          <p
            style={{
              fontSize: '1.12rem',
              lineHeight: 1.6,
              color: 'var(--rd-color-cream)',
              opacity: 0.9,
              margin: `0 0 ${u(3.5)}`,
            }}
          >
            Start a free trial today — capture, organize, and deliver every document
            your clinic receives. No credit card, cancel in one click.
          </p>
          <div style={{ display: 'flex', gap: u(1.2), justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 22px',
                borderRadius: 'var(--rd-radius-pill)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: 1,
                textDecoration: 'none',
                background: '#ffffff',
                color: 'var(--rd-color-primary-strong)',
                border: '1px solid #ffffff',
              }}
            >
              Start free trial
            </a>
            <a
              href="#demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 22px',
                borderRadius: 'var(--rd-radius-pill)',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1,
                textDecoration: 'none',
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.55)',
              }}
            >
              Book a demo
            </a>
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
              The vertical document inbox for veterinary clinics.
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
            <span>Secure document handling · BAA available · SOC 2 in progress</span>
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
