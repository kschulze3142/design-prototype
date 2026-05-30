'use client';

// =============================================================================
// FilterBar — status tab pills + payer/owner dropdown chips for the tracker.
//
// All controls are non-functional (visual placeholders) per Decision E and
// the PipelinePage ControlsBar convention. Status-tab selection is local
// transient state so the visual "selected" affordance still feels responsive;
// no items are filtered as a result. "All" is selected by default.
//
// Status list is template-driven (lifecycleStages ∪ terminalStatuses,
// preserving lifecycle order) so future tracker departments inherit the
// correct tab set without code changes.
// =============================================================================

import { useMemo, useState } from 'react';
import { titleCaseStatus } from '@/lib/components/formatters';
import type { DepartmentTemplate } from '@/lib/mockSystem/types';

type Props = {
  template: DepartmentTemplate;
};

const ALL = '__all__';

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active
          ? 'var(--color-primary)'
          : hover
          ? 'var(--color-primary-subtle)'
          : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '7px 14px',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        transition: 'background var(--duration-fast), color var(--duration-fast)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function DropdownChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 32,
        padding: '0 12px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--color-border-strong)',
        background: 'white',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function FilterBar({ template }: Props) {
  const [activeStatus, setActiveStatus] = useState<string>(ALL);

  const statusOrder = useMemo(() => {
    const out = [...template.lifecycleStages];
    for (const s of template.terminalStatuses) if (!out.includes(s)) out.push(s);
    return out;
  }, [template]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-pill)',
          padding: 4,
          boxShadow: 'var(--shadow-card)',
          gap: 2,
        }}
      >
        <TabPill active={activeStatus === ALL} onClick={() => setActiveStatus(ALL)}>
          All
        </TabPill>
        {statusOrder.map(s => (
          <TabPill key={s} active={activeStatus === s} onClick={() => setActiveStatus(s)}>
            {titleCaseStatus(s)}
          </TabPill>
        ))}
      </div>

      <div style={{ display: 'inline-flex', gap: 8, marginLeft: 'auto' }}>
        <DropdownChip label="Payer" />
        <DropdownChip label="Owner" />
      </div>
    </div>
  );
}
