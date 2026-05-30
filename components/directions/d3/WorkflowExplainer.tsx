// d3 WorkflowExplainer — how inbound faxes get matched and routed. A left column
// of three numbered steps (match → link → handle) paired with a right column that
// stacks the RoutingTrace product surface over a compact "active routing rules"
// card, on white. Step copy is Notion-style placeholder reskinned to Robin Dock's
// routing mechanics; the surface, the rule names, and the rules card are all driven
// by the shared @/lib/designMock so the right column reads as live product (and
// fills the column height alongside the three steps — no centered float / void).
import { Route, Sparkles, CheckCircle2 } from 'lucide-react';
import { designMock } from '@/lib/designMock';
import type { RoutingRuleMatchKind } from '@/lib/designMock';
import { Container, Display, Eyebrow, Tag, space as u } from './primitives';
import { RoutingTraceSurface } from './surfaces';

// Friendly labels for the rule's match condition (Notion-tight, no jargon).
const MATCH_LABEL: Record<RoutingRuleMatchKind, string> = {
  'from-number': 'From number',
  keyword: 'Keyword',
  'recipient-line': 'Line',
};

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
  const rules = designMock.routingRules;
  const liveCount = rules.filter((r) => r.enabled).length;
  return (
    <section style={{ background: 'var(--rd-color-bg)', paddingBlock: u(8) }}>
      <Container>
        <div
          className="d3-workflow"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: u(7),
            alignItems: 'start',
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

          {/* Right: live routing trace over the active-rules card. Stacking the
              two fills the column to the height of the three steps on the left,
              so the surface reads dense instead of floating in empty space. */}
          <div style={{ display: 'grid', gap: u(3), alignContent: 'start' }}>
            <RoutingTraceSurface />

            {/* Active routing rules — the rule set the trace above matched on. */}
            <div
              style={{
                background: 'var(--rd-color-surface)',
                border: '1px solid var(--rd-color-border)',
                borderRadius: 'var(--rd-radius-lg)',
                boxShadow: 'var(--rd-shadow-md)',
                padding: u(2.5),
                display: 'grid',
                gap: u(1.5),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                  Active routing rules
                </span>
                <Tag tint="green">{liveCount} live</Tag>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1) }}>
                {rules.map((r) => (
                  <li
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: u(1.5),
                      padding: `${u(1)} ${u(1.5)}`,
                      borderRadius: 'var(--rd-radius-md)',
                      border: '1px solid var(--rd-color-border)',
                      background: 'var(--rd-color-canvas)',
                      opacity: r.enabled ? 1 : 0.6,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--rd-color-heading)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>
                        {MATCH_LABEL[r.match.kind]} → {r.destination.value}
                      </div>
                    </div>
                    <span
                      style={{
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: r.enabled ? 'var(--rd-tint-green-fg)' : 'var(--rd-color-text-muted)',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          background: r.enabled ? 'var(--rd-tint-green-fg)' : 'var(--rd-color-border)',
                        }}
                      />
                      {r.enabled ? 'On' : 'Off'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
