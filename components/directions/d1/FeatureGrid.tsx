// d1 FeatureGrid — SEMrush's 3-up feature-card grid (DR-007): a centered section
// header over a row of crisp white cards, each a lucide icon in a lavender chip,
// a bold tight title, and a line of body copy. SEMrush-style placeholder labels
// for now (data-forward energy via the dense grid); reskinned to Robin Dock copy
// in a later pass.
import { Container, Display, Eyebrow, Card, space as u } from './primitives';
import {
  Radar,
  GitBranch,
  ShieldCheck,
  FileSearch,
  BellRing,
  Plug,
} from 'lucide-react';

const FEATURES = [
  {
    Icon: Radar,
    title: 'Real-time visibility',
    body: 'Track every transmission as it happens — queued, sending, delivered, or failed — across every line.',
  },
  {
    Icon: GitBranch,
    title: 'Automated routing',
    body: 'Match on sender, keyword, or line and file each inbound document to the right queue automatically.',
  },
  {
    Icon: ShieldCheck,
    title: 'Delivery accountability',
    body: 'A timestamped receipt on every outbound fax, with automatic retries on the lines that go busy.',
  },
  {
    Icon: FileSearch,
    title: 'Full audit trail',
    body: 'Every send, receipt, and routing decision is logged and searchable — nothing happens off the record.',
  },
  {
    Icon: BellRing,
    title: 'Failure alerts',
    body: 'Get notified the moment a send can’t complete, so a stuck referral never sits silently for days.',
  },
  {
    Icon: Plug,
    title: 'Connects to your stack',
    body: 'Drop Robin Dock alongside your EHR and intake tools — no hardware, no fax server to babysit.',
  },
] as const;

export function FeatureGrid() {
  return (
    <section style={{ paddingBlock: u(10) }}>
      <Container>
        <div style={{ display: 'grid', justifyItems: 'center', gap: u(2), textAlign: 'center', marginBottom: u(7) }}>
          <Eyebrow align="center">One platform</Eyebrow>
          <Display as="h2" size="section" align="center" style={{ maxWidth: 820 }}>
            Everything your fax workflow needs.
          </Display>
        </div>

        <div
          className="d1-feature-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: u(2.5),
          }}
        >
          {FEATURES.map(({ Icon, title, body }) => (
            <Card key={title} style={{ padding: u(3) }}>
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--rd-radius-md)',
                  background: 'var(--rd-color-accent-soft)',
                  color: 'var(--rd-color-heading)',
                }}
              >
                <Icon size={22} strokeWidth={2} />
              </span>
              <h3
                style={{
                  margin: `${u(2)} 0 ${u(1)}`,
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--rd-color-heading)',
                }}
              >
                {title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.55, color: 'var(--rd-color-text)' }}>
                {body}
              </p>
            </Card>
          ))}
        </div>
      </Container>

      <style>{`
        @media (max-width: 900px) { .d1-feature-cards { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .d1-feature-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
