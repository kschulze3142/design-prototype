'use client';

// d4 WorkflowTabs — "All your workflows in one platform" (DR-004p). A segmented
// row of ~5 tabs, each revealing a short label + body + "Learn more" alongside a
// product surface. The active-tab indicator and icon, and the "Learn more" link,
// ride the TEAL workhorse — they're functional selection + a link, both teal per
// the two-color discipline. The eyebrow stays Robin Orange (the small spark).
// Accessible tablist with full keyboard support.
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  Activity,
  CheckCircle2,
  Receipt,
  FolderClosed,
  Settings2,
  ArrowRight,
} from 'lucide-react';
import { Card, Eyebrow, Section, space as u } from './primitives';
import {
  FaxListSurface,
  DeliveryConfirmationSurface,
  PatientLinkSurface,
} from './surfaces';

interface Workflow {
  id: string;
  tab: string;
  Icon: typeof Activity;
  heading: string;
  body: string;
  surface: () => React.ReactNode;
}

const WORKFLOWS: Workflow[] = [
  {
    id: 'track',
    tab: 'Track',
    Icon: Activity,
    heading: 'See every fax the moment it moves.',
    body: 'One live view of everything sent and received, with status that updates itself — no spreadsheets, no calling the other office to ask if it arrived.',
    surface: () => <FaxListSurface limit={4} />,
  },
  {
    id: 'review',
    tab: 'Review',
    Icon: CheckCircle2,
    heading: 'Review and confirm in one place.',
    body: 'Every delivery comes back with a timestamped receipt, so approving and proving what went out is a glance, not an investigation.',
    surface: () => <DeliveryConfirmationSurface />,
  },
  {
    id: 'bill',
    tab: 'Bill',
    Icon: Receipt,
    heading: 'Turn delivered pages into clean records.',
    body: 'Page counts and confirmations are captured automatically, ready to hand off to billing without anyone re-keying a thing.',
    surface: () => <FaxListSurface limit={4} />,
  },
  {
    id: 'organize',
    tab: 'Organize',
    Icon: FolderClosed,
    heading: 'Keep every document where it belongs.',
    body: 'Inbound faxes file themselves onto the right patient or department by sender, keyword, or line — your front desk stops sorting paper by hand.',
    surface: () => <PatientLinkSurface />,
  },
  {
    id: 'manage',
    tab: 'Manage',
    Icon: Settings2,
    heading: 'Run your numbers and your team.',
    body: 'Add teammates, port numbers, and set routing rules from one calm settings area — everything in the same platform, nothing bolted on.',
    surface: () => <FaxListSurface limit={4} />,
  },
];

export function WorkflowTabs() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let next = active;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % WORKFLOWS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (active - 1 + WORKFLOWS.length) % WORKFLOWS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = WORKFLOWS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = WORKFLOWS[active];

  return (
    <Section>
      <div style={{ maxWidth: 640, marginBottom: u(5) }}>
        <Eyebrow>One platform</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'clamp(34px, 4.2vw, 50px)',
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            fontWeight: 400,
            margin: `${u(1.6)} 0 0`,
            color: 'var(--rd-color-heading)',
          }}
        >
          All your workflows in one platform.
        </h2>
      </div>

      {/* Segmented tab row */}
      <div
        role="tablist"
        aria-label="Robin Dock workflows"
        className="d4-wf-tabs"
        style={{
          display: 'flex',
          gap: u(0.8),
          borderBottom: '1px solid var(--rd-color-border)',
          marginBottom: u(4),
          overflowX: 'auto',
        }}
      >
        {WORKFLOWS.map((w, i) => {
          const selected = i === active;
          const Icon = w.Icon;
          return (
            <button
              key={w.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${w.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${w.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: u(1),
                whiteSpace: 'nowrap',
                padding: `${u(1.4)} ${u(1.8)}`,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--rd-font-body)',
                fontSize: '0.98rem',
                fontWeight: 500,
                color: selected ? 'var(--rd-color-heading)' : 'var(--rd-color-text-muted)',
                // Teal underline under the active tab, overlapping the row hairline.
                boxShadow: selected ? 'inset 0 -2px 0 var(--rd-color-primary)' : 'none',
                transition: 'color 120ms ease',
              }}
            >
              <Icon
                size={17}
                strokeWidth={2.1}
                color={selected ? 'var(--rd-color-primary)' : 'currentColor'}
              />
              {w.tab}
            </button>
          );
        })}
      </div>

      {/* Active panel — text left, surface right */}
      <div
        role="tabpanel"
        id={`${baseId}-panel-${current.id}`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="d4-wf-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: u(5),
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <h3
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: 'clamp(26px, 3vw, 34px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              fontWeight: 400,
              margin: `0 0 ${u(1.6)}`,
              color: 'var(--rd-color-heading)',
            }}
          >
            {current.heading}
          </h3>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: 'var(--rd-color-text-muted)',
              margin: `0 0 ${u(2.4)}`,
            }}
          >
            {current.body}
          </p>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: u(0.8),
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--rd-color-primary)',
              textDecoration: 'none',
            }}
          >
            Learn more
            <ArrowRight size={16} strokeWidth={2.2} />
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Card style={{ width: '100%', maxWidth: 420 }}>{current.surface()}</Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .d4-wf-panel {
            grid-template-columns: 1fr !important;
            gap: ${u(4)} !important;
          }
          .d4-wf-panel > div:last-child { justify-content: flex-start !important; }
        }
      `}</style>
    </Section>
  );
}
