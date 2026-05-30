// d3 WorkflowExplainer — how inbound faxes get matched and routed. A left column
// of three numbered steps (match → link → handle) paired with the RoutingTrace
// product surface on the right, on white. Step copy is Notion-style placeholder
// reskinned to Robin Dock's routing mechanics; the surface and the rule names it
// references come from the shared @/lib/designMock.
import { Route, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container, Display, Eyebrow, space as u } from './primitives';
import { RoutingTraceSurface } from './surfaces';

const STEPS = [
  {
    Icon: Sparkles,
    title: 'Match on sender, keyword, or line',
    body: 'Every inbound fax is read against your routing rules the moment it lands — by from-number, a keyword in the cover page, or the line it arrived on.',
  },
  {
    Icon: Route,
    title: 'Route to the right place automatically',
    body: 'A matched fax drops straight onto the right department, inbox, or patient record. No front-desk sorting, no manual hand-off, no guesswork.',
  },
  {
    Icon: CheckCircle2,
    title: 'Track it through to handled',
    body: 'Each routed fax carries an audit trail from arrival to resolution, so anyone on the team can see exactly what happened and when.',
  },
];

export function WorkflowExplainer() {
  return (
    <section style={{ background: 'var(--rd-color-bg)', paddingBlock: u(11) }}>
      <Container>
        <div
          className="d3-workflow"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: u(7),
            alignItems: 'center',
          }}
        >
          {/* Left: steps */}
          <div>
            <Eyebrow>Auto-routing</Eyebrow>
            <Display as="h2" size="section" style={{ marginTop: u(1.5) }}>
              Inbound faxes file themselves.
            </Display>
            <p style={{ margin: `${u(2)} 0 ${u(4)}`, fontSize: '1.08rem', lineHeight: 1.55, color: 'var(--rd-color-text-muted)' }}>
              Set the rules once. Robin Dock matches every incoming fax and routes it the instant it arrives.
            </p>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(3) }}>
              {STEPS.map((s, i) => {
                const Icon = s.Icon;
                return (
                  <li key={s.title} style={{ display: 'flex', gap: u(2), alignItems: 'flex-start' }}>
                    <span
                      aria-hidden
                      style={{
                        position: 'relative',
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        borderRadius: 'var(--rd-radius-md)',
                        background: 'var(--rd-color-accent-soft)',
                        color: 'var(--rd-color-accent)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={19} strokeWidth={2.2} />
                      <span
                        style={{
                          position: 'absolute',
                          top: -7,
                          left: -7,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          background: 'var(--rd-color-hero-bg)',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i + 1}
                      </span>
                    </span>
                    <div style={{ paddingTop: 2 }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                        {s.title}
                      </h3>
                      <p style={{ margin: `6px 0 0`, fontSize: '0.96rem', lineHeight: 1.5, color: 'var(--rd-color-text-muted)' }}>
                        {s.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: live routing trace surface */}
          <div>
            <RoutingTraceSurface />
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 820px) {
          .d3-workflow { grid-template-columns: 1fr !important; gap: ${u(4)} !important; }
        }
      `}</style>
    </section>
  );
}
