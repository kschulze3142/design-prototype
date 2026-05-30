// d3 FeatureDensity — a dense capability grid on the gray canvas. Six workspace
// capabilities as clean Notion cards (icon + title + body), with the first card
// spanning wide and carrying a small inline mini-surface so the grid reads as
// product, not illustration. Body copy is Notion-style placeholder reskinned to
// Robin Dock; the mini-surface stat is pulled from the shared @/lib/designMock.
import {
  Inbox,
  Route,
  ShieldCheck,
  Users,
  History,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { designMock } from '@/lib/designMock';
import { Container, Display, Eyebrow, Tag, space as u } from './primitives';

const FEATURES = [
  {
    Icon: Route,
    title: 'Rule-based routing',
    body: 'Match on sender, keyword, or line and send every fax to the right destination automatically.',
  },
  {
    Icon: ShieldCheck,
    title: 'Confirmed delivery',
    body: 'Every outbound send returns a timestamped receipt — and retries the busy lines for you.',
  },
  {
    Icon: Users,
    title: 'Patient linking',
    body: 'Inbound documents attach to the right patient record the moment they arrive.',
  },
  {
    Icon: History,
    title: 'Full audit trail',
    body: 'Every routing decision and status change is logged, so nothing happens off the record.',
  },
  {
    Icon: Building2,
    title: 'Departments & queues',
    body: 'Organize work into shared queues your whole team can see and pick up from.',
  },
] as const;

export function FeatureDensity() {
  const { deliverySuccessRate } = designMock.stats;
  return (
    <section style={{ background: 'var(--rd-color-canvas)', paddingBlock: u(11) }}>
      <Container>
        <div style={{ maxWidth: 640, marginBottom: u(5) }}>
          <Eyebrow>Capabilities</Eyebrow>
          <Display as="h2" size="section" style={{ marginTop: u(1.5) }}>
            Everything a fax operation needs, in one surface.
          </Display>
        </div>

        <div
          className="d3-feature-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: u(2),
          }}
        >
          {/* Wide lead card with an inline mini-surface */}
          <div
            className="d3-feature-lead"
            style={{
              gridColumn: 'span 2',
              display: 'flex',
              gap: u(3),
              padding: u(3),
              borderRadius: 'var(--rd-radius-lg)',
              background: 'var(--rd-color-surface)',
              border: '1px solid var(--rd-color-border)',
              boxShadow: 'var(--rd-shadow-sm)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--rd-radius-md)',
                  background: 'var(--rd-color-accent-soft)',
                  color: 'var(--rd-color-accent)',
                  marginBottom: u(1.5),
                }}
              >
                <Inbox size={19} strokeWidth={2.2} />
              </span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                A shared inbox for every fax
              </h3>
              <p style={{ margin: `8px 0 0`, fontSize: '0.98rem', lineHeight: 1.55, color: 'var(--rd-color-text-muted)' }}>
                Inbound and outbound, across every number, in one place your whole team works from —
                grouped, tagged, and tracked through to handled.
              </p>
            </div>
            {/* Inline mini-surface */}
            <div
              className="d3-feature-mini"
              style={{
                width: 188,
                flexShrink: 0,
                borderRadius: 'var(--rd-radius-md)',
                border: '1px solid var(--rd-color-border)',
                background: 'var(--rd-color-canvas)',
                padding: u(1.5),
                display: 'grid',
                gap: u(1),
                alignContent: 'start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tag tint="green" icon={<CheckCircle2 size={11} strokeWidth={2.4} />}>
                  Delivered
                </Tag>
                <span style={{ fontSize: '0.7rem', color: 'var(--rd-color-text-muted)' }}>now</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: '1.9rem',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--rd-color-heading)',
                  lineHeight: 1.05,
                }}
              >
                {(deliverySuccessRate * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>
                first-attempt delivery
              </div>
            </div>
          </div>

          {/* Remaining capability cards */}
          {FEATURES.map((f) => {
            const Icon = f.Icon;
            return (
              <div
                key={f.title}
                style={{
                  padding: u(2.5),
                  borderRadius: 'var(--rd-radius-lg)',
                  background: 'var(--rd-color-surface)',
                  border: '1px solid var(--rd-color-border)',
                  boxShadow: 'var(--rd-shadow-sm)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: 'var(--rd-radius-md)',
                    background: 'var(--rd-color-accent-soft)',
                    color: 'var(--rd-color-accent)',
                    marginBottom: u(1.5),
                  }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                  {f.title}
                </h3>
                <p style={{ margin: `7px 0 0`, fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--rd-color-text-muted)' }}>
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>

      <style>{`
        @media (max-width: 920px) {
          .d3-feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .d3-feature-lead { grid-column: span 2 !important; }
        }
        @media (max-width: 600px) {
          .d3-feature-grid { grid-template-columns: 1fr !important; }
          .d3-feature-lead { grid-column: span 1 !important; flex-direction: column !important; }
          .d3-feature-mini { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
