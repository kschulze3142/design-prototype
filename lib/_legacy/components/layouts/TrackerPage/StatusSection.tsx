'use client';

// =============================================================================
// StatusSection — one collapsible row in the TrackerPage.
//
// Header is a single button: chevron · status pill · count. Click anywhere to
// toggle. Body renders WorkItemCard variant='list' per item, or an empty-state
// placeholder when there are no items (Decision D1 — show the section header
// + "No items" body so demoable empty states stay legible).
//
// The orchestrator decides defaultExpanded per status: lifecycle stages start
// expanded, terminal-only statuses start collapsed. When a status is in both
// lists (e.g. PA's 'approved'), lifecycle wins — see DepartmentTemplate's
// terminalStatuses comment in types.ts.
// =============================================================================

import { useState } from 'react';
import { Pill } from '@/components/app/primitives';
import { titleCaseStatus } from '@/lib/components/formatters';
import { WorkItemCard } from '@/lib/components/WorkItemCard';
import type { DepartmentTemplate, WorkItem } from '@/lib/mockSystem/types';

type Props = {
  status: string;
  items: WorkItem[];
  template: DepartmentTemplate;
  defaultExpanded: boolean;
};

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform var(--duration-fast)',
        flexShrink: 0,
      }}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function StatusSection({ status, items, template, defaultExpanded }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tone = template.statusTones[status] ?? 'slate';

  return (
    <section style={{ marginBottom: 12 }}>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '10px 14px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ color: 'var(--color-text-tertiary)', display: 'inline-flex', alignItems: 'center' }}>
          <Chevron expanded={expanded} />
        </span>
        <Pill tone={tone}>{titleCaseStatus(status)}</Pill>
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            color: 'var(--color-text-tertiary)',
            fontWeight: 600,
          }}
        >
          {items.length}
        </span>
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0 4px 14px' }}>
          {items.length === 0 ? (
            <div
              style={{
                padding: '12px 14px',
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 12.5,
                color: 'var(--color-text-tertiary)',
                fontStyle: 'italic',
              }}
            >
              No items
            </div>
          ) : (
            items.map(item => (
              <WorkItemCard
                key={item.id}
                workItem={item}
                variant="list"
                href={`/app/departments/${item.departmentType}/items/${item.id}/thread`}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}
