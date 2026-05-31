// d4 RoutingDiagram — "Everything in its place. Every time." (DR-004d-p). The
// standout section: a visual auto-routing story. LEFT = the input sources a clinic
// receives documents from (fax, email, portal upload); CENTER = the robin logo as
// a routing hub; RIGHT = the folders documents are automatically organized into,
// with live "new" counts. Subtle dashed teal connectors draw the flow
// sources → robin → folders. Teal is the structural backbone here; this section
// sits on a cream-tinted band (cream is the rare warm accent now, not the base).
import { Printer, Mail, Upload, Folder, ChevronRight, ArrowRight, Check } from 'lucide-react';
import { Container, Eyebrow, space as u } from './primitives';
import { inputSources, routedFolders } from './documents';

const SOURCE_ICON: Record<string, typeof Printer> = {
  fax: Printer,
  email: Mail,
  portal: Upload,
};

const FEATURES = [
  'Capture faxes, emails, and uploads',
  'Auto-categorize and route',
  'Search by patient, type, or keyword',
  'Integrates with your PIMS',
] as const;

export function RoutingDiagram() {
  return (
    <section id="routing" style={{ paddingBlock: u(9), background: 'var(--rd-color-bg-tint)' }}>
      <Container>
        {/* Header — copy left, feature list right */}
        <div className="d4-route-head" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: u(5), alignItems: 'end', marginBottom: u(6) }}>
          <div style={{ maxWidth: 560 }}>
            <Eyebrow>Auto-routing</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--rd-font-display)',
                fontSize: 'clamp(32px, 4.2vw, 50px)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                fontWeight: 400,
                margin: `${u(1.6)} 0 ${u(1.6)}`,
                color: 'var(--rd-color-heading)',
              }}
            >
              Everything in its place. Every time.
            </h2>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.6, color: 'var(--rd-color-text-muted)', margin: 0 }}>
              Robin Dock captures every document the moment it arrives, reads what it
              is, and routes it to the right folder and the right patient — no manual
              sorting, no paper stacking up at the front desk.
            </p>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: u(0.8),
                marginTop: u(2.4),
                fontSize: '0.98rem',
                fontWeight: 700,
                color: 'var(--rd-color-primary)',
                textDecoration: 'none',
              }}
            >
              Explore Features
              <ArrowRight size={17} strokeWidth={2.4} />
            </a>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.4) }}>
            {FEATURES.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: u(1.2) }}>
                <span
                  aria-hidden
                  style={{
                    width: 22,
                    height: 22,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: 'var(--rd-color-primary-soft)',
                    color: 'var(--rd-color-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </span>
                <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--rd-color-text)' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The diagram: sources → robin hub → folders */}
        <div className="d4-route-diagram" style={{ position: 'relative', minHeight: 360 }}>
          {/* Dashed connector lines, behind the columns. Hidden when stacked. */}
          <svg
            className="d4-route-lines"
            viewBox="0 0 1000 360"
            preserveAspectRatio="none"
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
          >
            <g
              fill="none"
              stroke="var(--rd-color-primary-line)"
              strokeWidth={2}
              strokeDasharray="5 6"
              strokeLinecap="round"
            >
              {/* sources → hub */}
              <path d="M320 75 Q 430 75 500 180" vectorEffect="non-scaling-stroke" />
              <path d="M320 180 L 500 180" vectorEffect="non-scaling-stroke" />
              <path d="M320 285 Q 430 285 500 180" vectorEffect="non-scaling-stroke" />
              {/* hub → folders */}
              <path d="M500 180 Q 570 60 680 60" vectorEffect="non-scaling-stroke" />
              <path d="M500 180 Q 580 140 680 140" vectorEffect="non-scaling-stroke" />
              <path d="M500 180 Q 580 220 680 220" vectorEffect="non-scaling-stroke" />
              <path d="M500 180 Q 570 300 680 300" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          <div
            className="d4-route-cols"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: u(4),
              alignItems: 'center',
            }}
          >
            {/* LEFT — input sources */}
            <div style={{ display: 'grid', gap: u(1.6) }}>
              {inputSources.map((s) => {
                const Icon = SOURCE_ICON[s.id] ?? Printer;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: u(1.4),
                      padding: u(1.6),
                      borderRadius: 'var(--rd-radius-md)',
                      background: 'var(--rd-color-surface)',
                      border: '1px solid var(--rd-color-border)',
                      boxShadow: 'var(--rd-shadow-sm)',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        borderRadius: 10,
                        background: 'var(--rd-color-primary-soft)',
                        color: 'var(--rd-color-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={19} strokeWidth={2.2} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--rd-color-heading)' }}>
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--rd-color-text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {s.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CENTER — robin routing hub */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u(1.4) }}>
              <div
                style={{
                  position: 'relative',
                  width: 116,
                  height: 116,
                  borderRadius: 999,
                  background: 'var(--rd-color-surface)',
                  border: '2px solid var(--rd-color-primary)',
                  boxShadow: 'var(--rd-shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: -10,
                    borderRadius: 999,
                    border: '1px solid var(--rd-color-primary-line)',
                  }}
                />
                <img
                  src="/robin-dock-icon.svg"
                  alt="Robin Dock routing hub"
                  width={64}
                  height={64}
                  style={{ display: 'block', borderRadius: 12 }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--rd-color-primary)',
                }}
              >
                Robin routes it
              </span>
            </div>

            {/* RIGHT — automatically organized folders */}
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--rd-color-text-muted)',
                  marginBottom: u(1.4),
                }}
              >
                Automatically organized
              </div>
              <div style={{ display: 'grid', gap: u(1) }}>
                {routedFolders.map((f) => (
                  <div
                    key={f.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: u(1.2),
                      padding: `${u(1.3)} ${u(1.6)}`,
                      borderRadius: 'var(--rd-radius-md)',
                      background: 'var(--rd-color-surface)',
                      border: '1px solid var(--rd-color-border)',
                      boxShadow: 'var(--rd-shadow-sm)',
                    }}
                  >
                    <Folder size={17} strokeWidth={2.2} color="var(--rd-color-primary)" />
                    <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                      {f.name}
                    </span>
                    <span
                      style={{
                        paddingInline: 8,
                        height: 20,
                        display: 'inline-flex',
                        alignItems: 'center',
                        borderRadius: 999,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--rd-color-primary)',
                        background: 'var(--rd-color-primary-soft)',
                      }}
                    >
                      {f.newCount} new
                    </span>
                    <ChevronRight size={16} strokeWidth={2.2} color="var(--rd-color-text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Responsive: header stacks, diagram becomes a single column, connectors hide. */}
      <style>{`
        @media (max-width: 860px) {
          .d4-route-head { grid-template-columns: 1fr !important; gap: ${u(3)} !important; align-items: start !important; }
          .d4-route-lines { display: none !important; }
          .d4-route-cols { grid-template-columns: 1fr !important; gap: ${u(3)} !important; }
        }
      `}</style>
    </section>
  );
}
