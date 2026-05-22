'use client';

import { useTemplate } from '@/lib/mockSystem/hooks';
import type { DepartmentType } from '@/lib/mockSystem/types';
import { PipelinePage } from './layouts/PipelinePage';
import { TrackerPage } from './layouts/TrackerPage';
import { InboxPage } from './layouts/InboxPage';
import { QueuePage } from './layouts/QueuePage';

export function DepartmentPage({ type }: { type: DepartmentType }) {
  const template = useTemplate(type);

  switch (template.queueLayout) {
    case 'pipeline': return <PipelinePage type={type} />;
    case 'tracker':  return <TrackerPage  type={type} />;
    case 'inbox':    return <InboxPage    type={type} />;
    case 'queue':    return <QueuePage    type={type} />;
    default: {
      // Exhaustiveness check: adding a new QueueLayout in types.ts will
      // tsc-error here until a case is added above.
      const _exhaustive: never = template.queueLayout;
      void _exhaustive;
      return null;
    }
  }
}
