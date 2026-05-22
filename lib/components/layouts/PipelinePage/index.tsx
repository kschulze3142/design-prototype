'use client';

// =============================================================================
// PipelinePage — top-level orchestrator for any department whose
// template.queueLayout is 'pipeline'. Today: referrals only.
//
// Owns transient UI state (tab, view, declineTarget, pendingDrop, toast),
// routes drag-end events to MockSystemProvider mutations, and pre-computes
// the thread-count map passed into each card (Decision Q1 — one pass over
// the events list, not N hooks per card).
//
// All persistent data flows in via hooks; mutations flow out via
// MockSystemProvider. No local copy of work items.
// =============================================================================

import { useMemo, useState } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { I } from '@/components/app/icons';
import { DepartmentHeader } from '@/lib/components/DepartmentHeader';
import { DeclineModal } from '@/lib/components/DeclineModal';
import {
  useAutomations,
  useTemplate,
  useWorkItemsByDepartment,
} from '@/lib/mockSystem/hooks';
import { useMockSystem } from '@/lib/mockSystem/MockSystemProvider';
import type { DepartmentType, WorkItem } from '@/lib/mockSystem/types';
import { AutomationStrip } from './AutomationStrip';
import { ControlsBar, type TabKey, type ViewKey } from './ControlsBar';
import { CourtesyFaxPreview } from './CourtesyFaxPreview';
import { DeclinedArchive } from './DeclinedArchive';
import { PipelineBoard } from './PipelineBoard';
import {
  REFERRALS_STAGE_LABELS,
} from './visualConstants';
import { SequentialAdvanceModal, type PendingDrop } from './SequentialAdvanceModal';
import { StatStrip } from './StatStrip';
import { Toast } from './Toast';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

export function PipelinePage({ type }: { type: DepartmentType }) {
  const template = useTemplate(type);
  const allItems = useWorkItemsByDepartment(type);
  const { threadEvents, advanceItem, declineItem } = useMockSystem();

  // The dispatcher only routes referrals to PipelinePage today (it's the
  // sole queueLayout='pipeline' template). Cards, drag handlers, and
  // sub-components all consume the narrowed `ReferralWorkItem` shape.
  // When a second pipeline-layout department ships, this guard becomes
  // a template-driven dispatch instead.
  const referralItems = useMemo(
    () => allItems.filter(
      (i): i is ReferralWorkItem => i.departmentType === 'referrals',
    ),
    [allItems],
  );

  const kanbanItems = useMemo(
    () => referralItems.filter(i => i.status !== 'declined'),
    [referralItems],
  );
  const declinedItems = useMemo(
    () => referralItems.filter(i => i.status === 'declined'),
    [referralItems],
  );

  // Pre-compute per-item thread counts in one pass over the events list
  // and pass into each card via prop (Decision Q1). Avoids N
  // useThreadEvents() hooks across the board.
  const threadCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of threadEvents) {
      counts.set(e.workItemId, (counts.get(e.workItemId) ?? 0) + 1);
    }
    return counts;
  }, [threadEvents]);

  // Reference reads kept for future use (sidebar already drives
  // department badge counts from its own hook; nothing to wire here yet).
  void useAutomations(type);

  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [activeView, setActiveView] = useState<ViewKey>('pipeline');
  const [declineTarget, setDeclineTarget] = useState<ReferralWorkItem | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // The kanban renders one column per lifecycle stage (excludes declined,
  // which has its own tab). Column-order is template-driven so future
  // pipeline-layout departments inherit the same logic.
  const stageOrder = template.lifecycleStages;

  const stageLabel = (status: string): string =>
    REFERRALS_STAGE_LABELS[status] ?? status;

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const fromStatus = source.droppableId;
    const toStatus = destination.droppableId;

    // Same-column drags are a no-op (Decision P1). The new data layer has
    // no ordering primitive; the card will snap back via @hello-pangea/dnd's
    // natural drop animation.
    if (fromStatus === toStatus) return;

    const fromIndex = stageOrder.indexOf(fromStatus);
    const toIndex = stageOrder.indexOf(toStatus);
    // Both endpoints should be valid stages; if not, bail (defensive —
    // this shouldn't happen since droppable ids are stageOrder entries).
    if (fromIndex < 0 || toIndex < 0) return;

    // Backward, or adjacent forward — commit without confirmation.
    if (toIndex <= fromIndex + 1) {
      advanceItem(draggableId, toStatus);
      return;
    }

    // Skip forward: commit optimistically, then open the warning modal
    // (Decision O1 — matches Phase 8 UX). Cancel re-commits back to
    // fromStatus, which emits a second status_change ThreadEvent. This
    // double-event on cancel is a documented quirk of the mock; it's
    // not worth a provider-API expansion to suppress in a demo prototype.
    const skippedStages = stageOrder
      .slice(fromIndex + 1, toIndex)
      .map(stageLabel);

    advanceItem(draggableId, toStatus);

    setPendingDrop({
      itemId: draggableId,
      fromStatus,
      toStatus,
      fromLabel: stageLabel(fromStatus),
      toLabel: stageLabel(toStatus),
      skippedStages,
    });
  };

  const handleDeclineConfirm = (reason: string, notes: string) => {
    if (!declineTarget) return;
    // declineItem always emits payload.courtesyFaxSent = false regardless
    // of department UX — pre-existing provider behavior shared with
    // FE-053's generic decline flow. Toast text below is verbatim
    // Phase 8 (hardcoded message, not driven by the event payload).
    declineItem(declineTarget.id, reason, notes);
    setDeclineTarget(null);
    setToastMessage('Referral declined · Courtesy fax sent');
  };

  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <DepartmentHeader type={type} actions={<HeaderActions />} />
      <StatStrip items={referralItems} />
      <ControlsBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      {activeTab === 'active' ? (
        <PipelineBoard
          stageOrder={stageOrder}
          items={kanbanItems}
          threadCounts={threadCounts}
          supportsDecline={template.supportsDecline}
          onDecline={setDeclineTarget}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <DeclinedArchive items={declinedItems} threadEvents={threadEvents} />
      )}
      <AutomationStrip type={type} />

      {declineTarget && (
        <DeclineModal
          workItem={declineTarget}
          template={template}
          onConfirm={handleDeclineConfirm}
          onClose={() => setDeclineTarget(null)}
          previewSlot={(selectedReason) => (
            <CourtesyFaxPreview
              selectedReason={selectedReason}
              workItem={declineTarget}
            />
          )}
        />
      )}

      {pendingDrop && (
        <SequentialAdvanceModal
          pendingDrop={pendingDrop}
          onCancel={() => {
            advanceItem(pendingDrop.itemId, pendingDrop.fromStatus);
            setPendingDrop(null);
          }}
          onConfirm={() => {
            const n = pendingDrop.skippedStages.length;
            setToastMessage(
              `Advanced to ${pendingDrop.toLabel} · ${n} stage${n === 1 ? '' : 's'} skipped`,
            );
            setPendingDrop(null);
          }}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}

// Header right-side action buttons. Visual-only — Phase 8 had no onClick
// handlers on either button and we match that verbatim.
function HeaderActions() {
  return (
    <>
      <button
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
        New Referral
      </button>
    </>
  );
}
