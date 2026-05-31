'use client';

// d4 WorkflowTabs — "Every document workflow in one place" (DR-004d-p). A
// segmented row of ~5 tabs, each revealing a short label + body + "Learn more"
// alongside a product surface. The active-tab indicator and icon, and the "Learn
// more" link, ride the TEAL workhorse — they're functional selection + a link,
// both teal per the two-color discipline. The eyebrow is teal too now (the
// structural backbone). Accessible tablist with full keyboard support.
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  Inbox,
  FolderInput,
  ClipboardCheck,
  Search,
  Settings2,
  ArrowRight,
} from 'lucide-react';
import { Card, Eyebrow, Section, space as u } from './primitives';
import {
  DocumentListSurface,
  PatientLinkSurface,
  FilingTimelineSurface,
  SearchSurface,
} from './surfaces';

interface Workflow {
  id: string;
  tab: string;
  Icon: typeof Inbox;
  heading: string;
  body: string;
  surface: () => React.ReactNode;
}

const WORKFLOWS: Workflow[] = [
  {
    id: 'capture',
    tab: 'Capture',
    Icon: Inbox,
    heading: 'Every document, in one inbox.',
    body: 'Faxes, emailed lab results, referrals, and portal uploads land in a single inbox the moment they arrive — no machine to babysit, no paper to chase.',
    surface: () => <DocumentListSurface limit={4} />,
  },
  {
    id: 'organize',
    tab: 'Organize',
    Icon: FolderInput,
    heading: 'Filed to the right patient, automatically.',
    body: 'Robin Dock reads each document and routes it to the right folder and the right pet by sender, type, and keyword — your front desk stops sorting by hand.',
    surface: () => <PatientLinkSurface />,
  },
  {
    id: 'review',
    tab: 'Review',
    Icon: ClipboardCheck,
    heading: 'Nothing slips through the cracks.',
    body: 'Anything that needs a second look lands in a Needs Review queue with a clear count, so referrals and abnormal results never get buried.',
    surface: () => <FilingTimelineSurface />,
  },
  {
    id: 'search',
    tab: 'Search',
    Icon: Search,
    heading: 'Find any document in seconds.',
    body: 'Search by patient, document type, or keyword across every folder — pull up a pet’s full history without digging through stacks or shared drives.',
    surface: () => <SearchSurface />,
  },
  {
    id: 'manage',
    tab: 'Manage',
    Icon: Settings2,
    heading: 'Run your team and your folders.',
    body: 'Add staff, set routing rules, and connect your PIMS from one calm settings area — everything in the same platform, nothing bolted on.',
    surface: () => <DocumentListSurface limit={4} />,
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
          Every document workflow in one place.
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
