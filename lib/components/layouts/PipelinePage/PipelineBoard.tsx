'use client';

// =============================================================================
// PipelineBoard — horizontal kanban container.
//
// Reads template.lifecycleStages from the orchestrator (passed in as
// `stageOrder`) to drive column order. Items are grouped by status and
// fed to one PipelineColumn each. Wraps everything in DragDropContext —
// onDragEnd lives in the orchestrator.
// =============================================================================

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useMemo } from 'react';
import type { WorkItem } from '@/lib/mockSystem/types';
import { PipelineColumn } from './PipelineColumn';
import {
  REFERRALS_COLUMN_DOT_COLOR,
  REFERRALS_STAGE_LABELS,
  REFERRALS_TRANSITION_BARS,
} from './visualConstants';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

type Props = {
  stageOrder: string[];
  items: ReferralWorkItem[];
  threadCounts: Map<string, number>;
  supportsDecline: boolean;
  onDecline: (item: ReferralWorkItem) => void;
  onDragEnd: (result: DropResult) => void;
};

export function PipelineBoard({
  stageOrder,
  items,
  threadCounts,
  supportsDecline,
  onDecline,
  onDragEnd,
}: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, ReferralWorkItem[]>();
    for (const stage of stageOrder) map.set(stage, []);
    for (const item of items) {
      const bucket = map.get(item.status);
      if (bucket) bucket.push(item);
    }
    return map;
  }, [items, stageOrder]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 8,
          alignItems: 'flex-start',
        }}
      >
        {stageOrder.map(stage => (
          <PipelineColumn
            key={stage}
            status={stage}
            label={REFERRALS_STAGE_LABELS[stage] ?? stage}
            dotColor={REFERRALS_COLUMN_DOT_COLOR[stage] ?? '#8896aa'}
            transitionActions={REFERRALS_TRANSITION_BARS[stage]}
            cards={grouped.get(stage) ?? []}
            threadCounts={threadCounts}
            supportsDecline={supportsDecline}
            onDecline={onDecline}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
