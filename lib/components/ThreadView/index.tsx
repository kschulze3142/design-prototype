'use client';

// =============================================================================
// ThreadView — generic, template-driven work-item detail screen.
//
// Three-column layout:
//   - LeftRail   : back link, patient card, scrollable thread list
//   - CenterColumn: header + bubble feed + ComposeBar (inferred actions)
//   - RightRail  : lifecycle tracker, metadata, linked items, assignee
//
// Validates that workItem.id resolves and that workItem.departmentType
// matches the route's `type` param — any mismatch -> notFound().
// =============================================================================

import { notFound } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  usePatient,
  useTemplate,
  useThreadEvents,
  useWorkItem,
} from '@/lib/mockSystem/hooks';
import type { DepartmentType } from '@/lib/mockSystem/types';
import { CenterColumn } from './CenterColumn';
import { LeftRail } from './LeftRail';
import { RightRail } from './RightRail';

type Props = {
  itemId: string;
  type: DepartmentType;
  customActions?: ReactNode;
};

export function ThreadView({ itemId, type, customActions }: Props) {
  const workItem = useWorkItem(itemId);
  const template = useTemplate(type);

  if (!workItem || workItem.departmentType !== type) {
    notFound();
  }

  return <ThreadViewInner workItem={workItem} type={type} template={template} customActions={customActions} />;
}

// Inner component runs the remaining hooks unconditionally — once the outer
// component has confirmed workItem exists and matches `type`, this never
// re-enters the notFound() branch.
function ThreadViewInner({
  workItem,
  type,
  template,
  customActions,
}: {
  workItem: NonNullable<ReturnType<typeof useWorkItem>>;
  type: DepartmentType;
  template: ReturnType<typeof useTemplate>;
  customActions?: ReactNode;
}) {
  const patient = usePatient(workItem.patientId);
  const events = useThreadEvents(workItem.id);
  const [activeEventId, setActiveEventId] = useState<string | null>(
    events.length > 0 ? events[0].id : null,
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--color-bg)',
      marginLeft: -32,
      marginRight: -32,
    }}>
      <LeftRail
        type={type}
        template={template}
        patient={patient}
        status={workItem.status}
        events={events}
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
      />
      <CenterColumn
        workItem={workItem}
        template={template}
        patient={patient}
        events={events}
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
        customActions={customActions}
      />
      <RightRail workItem={workItem} template={template} />
    </div>
  );
}
