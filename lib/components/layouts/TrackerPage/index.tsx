'use client';

// =============================================================================
// TrackerPage — top-level orchestrator for any department whose
// template.queueLayout is 'tracker'. Today: prior_auth only.
//
// Department-agnostic by construction: section order, status tones, urgency
// styling, and filter chips all derive from the template. A future tracker
// department (e.g. credentialing) gets this layout for free by setting
// queueLayout: 'tracker'.
//
// Section order = lifecycleStages then non-duplicate terminalStatuses. A
// status that appears in both lists (PA's 'approved') renders once, at its
// lifecycle position, and is treated as an active flow stage for the
// expand-by-default rule. See DepartmentTemplate.terminalStatuses comment in
// types.ts for the canonical statement of this rule.
//
// Sort within a section: metadata.expiresAt ascending, missing values last.
// Read by string key with a discriminated-union-safe cast at the boundary
// (matches WorkItemCard's getMetadataValue pattern).
// =============================================================================

import { useMemo } from 'react';
import { I } from '@/components/app/icons';
import { DepartmentHeader } from '@/lib/components/DepartmentHeader';
import {
  useTemplate,
  useWorkItemsByDepartment,
} from '@/lib/mockSystem/hooks';
import type { DepartmentType, WorkItem } from '@/lib/mockSystem/types';
import { FilterBar } from './FilterBar';
import { StatStrip } from './StatStrip';
import { StatusSection } from './StatusSection';

function expiresAtKey(item: WorkItem): number {
  const v = (item.metadata as Record<string, unknown>).expiresAt;
  if (typeof v !== 'string') return Number.POSITIVE_INFINITY;
  const ms = new Date(v).getTime();
  return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
}

export function TrackerPage({ type }: { type: DepartmentType }) {
  const template = useTemplate(type);
  const items = useWorkItemsByDepartment(type);

  const sectionOrder = useMemo(() => {
    const out = [...template.lifecycleStages];
    for (const s of template.terminalStatuses) if (!out.includes(s)) out.push(s);
    return out;
  }, [template]);

  const grouped = useMemo(() => {
    const map = new Map<string, WorkItem[]>();
    for (const status of sectionOrder) {
      const slice = items
        .filter(i => i.status === status)
        .sort((a, b) => expiresAtKey(a) - expiresAtKey(b));
      map.set(status, slice);
    }
    return map;
  }, [items, sectionOrder]);

  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <DepartmentHeader type={type} actions={<HeaderActions />} />
      <StatStrip items={items} />
      <FilterBar template={template} />
      {sectionOrder.map(status => (
        <StatusSection
          key={status}
          status={status}
          items={grouped.get(status) ?? []}
          template={template}
          defaultExpanded={template.lifecycleStages.includes(status)}
        />
      ))}
    </div>
  );
}

// Visual-only header actions; matches PipelinePage's HeaderActions shape.
// "New Authorization" is PA-specific until a second tracker department ships.
function HeaderActions() {
  return (
    <>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 36,
          padding: '0 14px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border-strong)',
          background: 'white',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <I.Download size={14} strokeWidth={2} />
        Export
      </button>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 36,
          padding: '0 14px',
          borderRadius: 'var(--radius-pill)',
          border: 'none',
          background: 'var(--color-primary)',
          color: 'white',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <I.Plus size={14} strokeWidth={2.4} />
        New Authorization
      </button>
    </>
  );
}
