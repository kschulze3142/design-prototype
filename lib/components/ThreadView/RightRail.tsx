'use client';

// =============================================================================
// RightRail — Lifecycle + dynamic Next + Metadata + Linked items + Assignee.
//
// Sections are fixed (Decision C); content is template-driven. "Next" is
// computed from template.lifecycleStages + workItem.status — no new schema
// field. Linked items render as compact WorkItemCards back into the new
// thread route.
// =============================================================================

import type { MouseEvent } from 'react';
import { useLinkedWorkItems, useUser } from '@/lib/mockSystem/hooks';
import type {
  DepartmentTemplate,
  WorkItem,
} from '@/lib/mockSystem/types';
import { FieldRow, isEmpty, titleCaseStatus } from '../formatters';
import { WorkItemCard } from '../WorkItemCard';
import { LifecycleTracker } from './LifecycleTracker';

type Props = {
  workItem: WorkItem;
  template: DepartmentTemplate;
};

export function RightRail({ workItem, template }: Props) {
  const assignee = useUser(workItem.assignedTo);
  const linkedItems = useLinkedWorkItems(workItem.id);

  const currentIdx = template.lifecycleStages.indexOf(workItem.status);
  const nextStage =
    currentIdx >= 0 && currentIdx < template.lifecycleStages.length - 1
      ? template.lifecycleStages[currentIdx + 1]
      : null;

  return (
    <aside style={{
      width: 320,
      flexShrink: 0,
      background: 'var(--color-surface)',
      borderLeft: '1px solid var(--color-border)',
      padding: '24px 24px',
      overflowY: 'auto',
    }}>
      {/* Lifecycle */}
      <SectionHeading>Lifecycle</SectionHeading>
      <LifecycleTracker template={template} status={workItem.status} />
      {nextStage && (
        <div style={{
          marginTop: 14,
          padding: '10px 12px',
          background: 'var(--color-primary-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12.5,
          color: 'var(--color-text-primary)',
        }}>
          <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 600, marginRight: 6 }}>
            NEXT
          </span>
          {titleCaseStatus(nextStage)}
        </div>
      )}

      {/* Metadata */}
      <SectionHeading style={{ marginTop: 28 }}>Metadata</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {template.metadataFields.map(descriptor => {
          const value = (workItem.metadata as Record<string, unknown>)[descriptor.key];
          if (isEmpty(value)) return null;
          return <FieldRow key={descriptor.key} descriptor={descriptor} value={value} />;
        })}
      </div>

      {/* Linked items */}
      <SectionHeading style={{ marginTop: 28 }}>Linked items</SectionHeading>
      {linkedItems.length === 0 ? (
        <div style={emptyStyle}>None linked.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {linkedItems.map(item => (
            <WorkItemCard
              key={item.id}
              workItem={item}
              variant="compact"
              href={`/app/departments/${item.departmentType}/items/${item.id}/thread`}
            />
          ))}
        </div>
      )}

      {/* Assignee */}
      <SectionHeading style={{ marginTop: 28 }}>Assignee</SectionHeading>
      <AssigneeRow assignee={assignee} />
    </aside>
  );
}

function SectionHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{
      fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--color-text-primary)',
      margin: 0,
      marginBottom: 14,
      ...style,
    }}>
      {children}
    </h2>
  );
}

function AssigneeRow({ assignee }: { assignee: { name: string } | null }) {
  const handleClaim = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // TODO: wire claimItem() from MockSystemProvider when claim flow ships (FE-053/FE-054)
  };

  if (!assignee) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ ...emptyStyle, margin: 0, flex: 1 }}>Unassigned</span>
        <button
          type="button"
          onClick={handleClaim}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            height: 28,
            padding: '0 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            border: 'none',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Claim
        </button>
      </div>
    );
  }
  const init = assignee.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--color-surface-dark)',
        color: 'white',
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {init}
      </span>
      <span style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--color-text-primary)',
      }}>
        {assignee.name}
      </span>
    </div>
  );
}

const emptyStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 12,
  color: 'var(--color-text-tertiary)',
  fontStyle: 'italic',
};
