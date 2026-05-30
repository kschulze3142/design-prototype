'use client';

// =============================================================================
// PipelineColumn — one droppable column on the referrals kanban.
//
// Receives a fixed status key + label + dot color (Phase 8 visual data
// from visualConstants.ts) plus the cards that belong in this status.
// Per-card thread counts come pre-computed from the orchestrator (Q1).
// =============================================================================

import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { WorkItem } from '@/lib/mockSystem/types';
import { ReferralPipelineCard } from './ReferralPipelineCard';
import { TransitionBar } from './TransitionBar';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

type Props = {
  status: string;
  label: string;
  dotColor: string;
  transitionActions?: string[];
  cards: ReferralWorkItem[];
  threadCounts: Map<string, number>;
  supportsDecline: boolean;
  onDecline: (item: ReferralWorkItem) => void;
};

export function PipelineColumn({
  status,
  label,
  dotColor,
  transitionActions,
  cards,
  threadCounts,
  supportsDecline,
  onDecline,
}: Props) {
  return (
    <div
      style={{
        flex: '0 0 280px',
        minWidth: 280,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 14px 12px',
          borderBottom: transitionActions ? 'none' : '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 22,
            height: 20,
            padding: '0 6px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-bg)',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {cards.length}
        </span>
      </div>

      {transitionActions && <TransitionBar actions={transitionActions} />}

      {/* Cards */}
      <Droppable droppableId={status}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 12,
              overflowY: 'auto',
              flex: 1,
              minHeight: 80,
              background: droppableSnapshot.isDraggingOver
                ? 'var(--color-primary-subtle)'
                : 'transparent',
              borderRadius: droppableSnapshot.isDraggingOver ? 'var(--radius-md)' : undefined,
              transition: 'background var(--duration-fast)',
            }}
          >
            {cards.map((c, index) => (
              <Draggable draggableId={c.id} index={index} key={c.id}>
                {(draggableProvided, draggableSnapshot) => (
                  <ReferralPipelineCard
                    item={c}
                    threadCount={threadCounts.get(c.id) ?? 0}
                    supportsDecline={supportsDecline}
                    onDecline={onDecline}
                    draggableProvided={draggableProvided}
                    isDragging={draggableSnapshot.isDragging}
                    isDropAnimating={draggableSnapshot.isDropAnimating}
                  />
                )}
              </Draggable>
            ))}
            {cards.length === 0 && !droppableSnapshot.isDraggingOver && (
              <div
                style={{
                  padding: '20px 12px',
                  textAlign: 'center',
                  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                  fontSize: 12,
                  color: 'var(--color-text-tertiary)',
                }}
              >
                No referrals
              </div>
            )}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
