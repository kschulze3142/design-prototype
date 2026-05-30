'use client';

// d2 Trust section — THE CENTERPIECE. Mercury's "Bank with complete confidence"
// tabbed pattern, recast as Robin Dock's trust pillars. Quiet, plain-language
// reassurance — accessible tablist with full keyboard support.
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { ShieldCheck, BadgeCheck, PhoneForwarded, CircleX, Check } from 'lucide-react';
import { Eyebrow, Section, space as u } from './primitives';

interface Pillar {
  id: string;
  tab: string;
  Icon: typeof ShieldCheck;
  heading: string;
  body: string;
  points: string[];
}

const PILLARS: Pillar[] = [
  {
    id: 'hipaa',
    tab: 'HIPAA-adjacent handling',
    Icon: ShieldCheck,
    heading: 'Built for protected health information.',
    body: 'Every page is encrypted in transit and at rest, access is logged, and we sign a BAA before you send your first fax. Nothing about a patient leaves an audit trail behind.',
    points: [
      'Encrypted in transit and at rest',
      'Business Associate Agreement on every plan',
      'Full access log for each document',
    ],
  },
  {
    id: 'delivery',
    tab: 'Delivery confirmation',
    Icon: BadgeCheck,
    heading: 'You always know it arrived.',
    body: 'Robin Dock retries busy lines automatically and returns a timestamped receipt the moment a fax is delivered — or tells you plainly when it could not be, so nothing falls silently through the cracks.',
    points: [
      'Timestamped delivery receipts',
      'Automatic retry on busy or no-answer',
      'Clear failure reasons, not silence',
    ],
  },
  {
    id: 'portability',
    tab: 'Number portability',
    Icon: PhoneForwarded,
    heading: 'Keep the number your referrals already know.',
    body: 'Port your existing fax number in and it keeps working — no reprinting letterhead, no notifying every clinic that sends to you. If you ever leave, you take it with you.',
    points: [
      'Bring your current fax number',
      'No interruption during the switch',
      'Yours to port out, always',
    ],
  },
  {
    id: 'cancellation',
    tab: 'One-click cancellation',
    Icon: CircleX,
    heading: 'Leave whenever you want.',
    body: 'No retention calls, no hunting for a hidden setting. Cancel from your account in a single click and export everything you sent and received on the way out.',
    points: [
      'Cancel from settings in one click',
      'No phone calls, no dark patterns',
      'Export your full fax history',
    ],
  },
];

export function TrustTabs() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let next = active;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % PILLARS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + PILLARS.length) % PILLARS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = PILLARS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = PILLARS[active];
  const CurrentIcon = current.Icon;

  return (
    <Section tint>
      <div style={{ textAlign: 'center', maxWidth: 560, marginInline: 'auto', marginBottom: u(5) }}>
        <Eyebrow>Why practices trust us</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'calc(2.2rem * var(--rd-type-scale))',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            margin: `${u(1.6)} 0 0`,
            color: 'var(--rd-color-text)',
          }}
        >
          Fax with complete confidence.
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 280px) 1fr',
          gap: u(4),
          alignItems: 'start',
        }}
        className="d2-trust-grid"
      >
        {/* Tab list — vertical on wide screens, scrollable row when stacked. */}
        <div
          role="tablist"
          aria-label="Robin Dock trust pillars"
          aria-orientation="vertical"
          style={{ display: 'flex', flexDirection: 'column', gap: u(0.8) }}
        >
          {PILLARS.map((p, i) => {
            const selected = i === active;
            const Icon = p.Icon;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${p.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${p.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: u(1.2),
                  textAlign: 'left',
                  padding: `${u(1.6)} ${u(1.8)}`,
                  borderRadius: 'var(--rd-radius-md)',
                  border: '1px solid',
                  borderColor: selected ? 'var(--rd-color-border)' : 'transparent',
                  background: selected ? 'var(--rd-color-surface)' : 'transparent',
                  boxShadow: selected ? 'var(--rd-shadow-sm)' : 'none',
                  color: selected ? 'var(--rd-color-text)' : 'var(--rd-color-text-muted)',
                  fontFamily: 'var(--rd-font-body)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={2.1}
                  color={selected ? 'var(--rd-color-accent)' : 'currentColor'}
                />
                {p.tab}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div
          role="tabpanel"
          id={`${baseId}-panel-${current.id}`}
          aria-labelledby={`${baseId}-tab-${current.id}`}
          style={{
            background: 'var(--rd-color-surface)',
            border: '1px solid var(--rd-color-border)',
            borderRadius: 'var(--rd-radius-lg)',
            boxShadow: 'var(--rd-shadow-md)',
            padding: u(4),
          }}
        >
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
              color: 'var(--rd-color-accent)',
              marginBottom: u(2),
            }}
          >
            <CurrentIcon size={22} strokeWidth={2.1} />
          </span>
          <h3
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'calc(1.5rem * var(--rd-type-scale))',
              lineHeight: 1.2,
              letterSpacing: '-0.015em',
              margin: `0 0 ${u(1.4)}`,
              color: 'var(--rd-color-text)',
            }}
          >
            {current.heading}
          </h3>
          <p
            style={{
              fontSize: '1.02rem',
              lineHeight: 1.65,
              color: 'var(--rd-color-text-muted)',
              margin: `0 0 ${u(3)}`,
              maxWidth: 520,
            }}
          >
            {current.body}
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.4) }}>
            {current.points.map((point) => (
              <li key={point} style={{ display: 'flex', alignItems: 'center', gap: u(1.2) }}>
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: 'var(--rd-color-accent-soft)',
                    color: 'var(--rd-color-accent)',
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </span>
                <span style={{ fontSize: '0.95rem', color: 'var(--rd-color-text)' }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .d2-trust-grid { grid-template-columns: 1fr !important; }
          .d2-trust-grid [role='tablist'] {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .d2-trust-grid [role='tab'] { white-space: nowrap; }
        }
      `}</style>
    </Section>
  );
}
