'use client';

// =============================================================================
// InboxPage — top-level orchestrator for any department whose
// template.queueLayout is 'inbox'. Today: clinical_results.
//
// Two-pane split: filterable list on the left, document-style preview on the
// right. Owns selection + filter state; quick actions mutate via the mock
// system (updateItemStatus, addNote, addThreadEvent).
//
// Implicit transition: when a `new` item is selected, it auto-transitions to
// `reviewing` and emits a status_change event. The `status === 'new'` guard
// in handleSelect is the entire idempotency mechanism — re-selecting the
// same item once it's reviewing is a no-op for status.
//
// Preview persistence: selectedId is looked up against the full department
// items list, not the filtered list (per FE-060). Selection only clears if
// the underlying item is removed from the dataset.
// =============================================================================

import { useEffect, useMemo, useState } from 'react';
import { DepartmentHeader } from '@/lib/components/DepartmentHeader';
import { DepartmentStub } from '@/lib/components/DepartmentStub';
import {
  usePatient,
  useTemplate,
  useThreadEvents,
  useWorkItemsByDepartment,
} from '@/lib/mockSystem/hooks';
import { useMockSystem } from '@/lib/mockSystem/MockSystemProvider';
import type { DepartmentType, WorkItem } from '@/lib/mockSystem/types';
import { InboxFilterBar, type DatePreset } from './InboxFilterBar';
import { InboxList } from './InboxList';
import { InboxPreviewEmpty, InboxPreviewPane } from './InboxPreviewPane';

type ClinicalResultsItem = Extract<WorkItem, { departmentType: 'clinical_results' }>;

const ALL = '__all__';

function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function cutoffForPreset(preset: DatePreset): number {
  if (preset === 'today') return startOfTodayMs();
  if (preset === '7d')    return Date.now() - 7  * 86_400_000;
  if (preset === '30d')   return Date.now() - 30 * 86_400_000;
  return Number.NEGATIVE_INFINITY;
}

export function InboxPage({ type }: { type: DepartmentType }) {
  // FE-060 wires clinical_results only. `admin` also uses queueLayout='inbox'
  // and lands here via the dispatcher; until FE-063 wires its readout, keep
  // the stub so existing admin navigation doesn't regress.
  if (type !== 'clinical_results') {
    return <DepartmentStub type={type} layoutName="Inbox" ticketId="FE-063" />;
  }
  return <ClinicalResultsInbox type={type} />;
}

function ClinicalResultsInbox({ type }: { type: DepartmentType }) {
  const template = useTemplate(type);
  const allItems = useWorkItemsByDepartment(type);
  const { currentUser, updateItemStatus, addNote, addThreadEvent } = useMockSystem();

  // Narrow to clinical_results — the only inbox-layout department today.
  // When a second inbox-layout department ships, this guard becomes a
  // dispatch by departmentType (matches PipelinePage's referral-narrow).
  const items = useMemo<ClinicalResultsItem[]>(
    () => allItems.filter(
      (i): i is ClinicalResultsItem => i.departmentType === 'clinical_results',
    ),
    [allItems],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const [providerFilter, setProviderFilter]       = useState<string>(ALL);
  const [docTagFilter, setDocTagFilter]           = useState<string>(ALL);
  const [datePreset, setDatePreset]               = useState<DatePreset>(ALL);
  const [statusFilter, setStatusFilter]           = useState<string>(ALL);
  const [criticalityFilter, setCriticalityFilter] = useState<string>(ALL);

  const providers = useMemo(
    () => [...new Set(items.map(i => i.metadata.orderingProvider))].sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const cutoffMs = cutoffForPreset(datePreset);
    return items
      .filter(i => providerFilter   === ALL || i.metadata.orderingProvider === providerFilter)
      .filter(i => docTagFilter     === ALL || i.docTags.includes(docTagFilter))
      .filter(i => new Date(i.metadata.receivedAt).getTime() >= cutoffMs)
      .filter(i => statusFilter     === ALL || i.status === statusFilter)
      .filter(i => criticalityFilter === ALL || i.metadata.criticality === criticalityFilter)
      .sort((a, b) =>
        new Date(b.metadata.receivedAt).getTime() -
        new Date(a.metadata.receivedAt).getTime(),
      );
  }, [items, providerFilter, docTagFilter, datePreset, statusFilter, criticalityFilter]);

  const hasActiveFilters =
    providerFilter !== ALL ||
    docTagFilter   !== ALL ||
    datePreset     !== ALL ||
    statusFilter   !== ALL ||
    criticalityFilter !== ALL;

  const handleClearFilters = () => {
    setProviderFilter(ALL);
    setDocTagFilter(ALL);
    setDatePreset(ALL);
    setStatusFilter(ALL);
    setCriticalityFilter(ALL);
  };

  // Preview persistence: lookup goes against the full items list, not the
  // filtered slice. If the underlying item disappears (defensive — won't
  // happen in current demo data), clear the selection in an effect.
  const selectedItem = useMemo(
    () => items.find(i => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  useEffect(() => {
    if (selectedId && !selectedItem) setSelectedId(null);
  }, [selectedId, selectedItem]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setComposerOpen(false);
    const item = items.find(i => i.id === id);
    if (item && item.status === 'new') {
      updateItemStatus(id, 'reviewing');
    }
  };

  const handleAcknowledge = () => {
    if (!selectedItem) return;
    updateItemStatus(selectedItem.id, 'resolved');
  };

  const handleFlag = () => {
    if (!selectedItem) return;
    updateItemStatus(selectedItem.id, 'flagged');
  };

  const handleRoute = () => {
    if (!selectedItem) return;
    addThreadEvent({
      workItemId: selectedItem.id,
      type: 'note',
      actor: currentUser.id,
      payload: {
        bodyText: `Routed to ${selectedItem.metadata.orderingProvider} — please review.`,
        tags: ['routing'],
      },
    });
  };

  const handleOpenComposer = () => setComposerOpen(open => !open);
  const handleCancelNote = () => setComposerOpen(false);

  const handleSubmitNote = (body: string) => {
    if (!selectedItem) return;
    addNote(selectedItem.id, body);
    setComposerOpen(false);
  };

  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <DepartmentHeader type={type} />
      <InboxFilterBar
        providers={providers}
        docTags={template.docTags}
        statuses={template.statuses}
        providerFilter={providerFilter}
        docTagFilter={docTagFilter}
        datePreset={datePreset}
        statusFilter={statusFilter}
        criticalityFilter={criticalityFilter}
        onProviderChange={setProviderFilter}
        onDocTagChange={setDocTagFilter}
        onDatePresetChange={setDatePreset}
        onStatusChange={setStatusFilter}
        onCriticalityChange={setCriticalityFilter}
        onClear={handleClearFilters}
        anyActive={hasActiveFilters}
      />

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 440px', minWidth: 0 }}>
          <InboxList
            items={filteredItems}
            selectedId={selectedId}
            onSelect={handleSelect}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          {selectedItem ? (
            <SelectedPreview
              workItem={selectedItem}
              composerOpen={composerOpen}
              onAcknowledge={handleAcknowledge}
              onFlag={handleFlag}
              onRoute={handleRoute}
              onOpenComposer={handleOpenComposer}
              onSubmitNote={handleSubmitNote}
              onCancelNote={handleCancelNote}
            />
          ) : (
            <InboxPreviewEmpty />
          )}
        </div>
      </div>
    </div>
  );
}

// Split so the patient + events hooks are mounted only when there's a
// selection — the inbox would otherwise pay for two hook calls per render
// even when the preview pane is empty.
function SelectedPreview({
  workItem,
  composerOpen,
  onAcknowledge,
  onFlag,
  onRoute,
  onOpenComposer,
  onSubmitNote,
  onCancelNote,
}: {
  workItem: ClinicalResultsItem;
  composerOpen: boolean;
  onAcknowledge: () => void;
  onFlag: () => void;
  onRoute: () => void;
  onOpenComposer: () => void;
  onSubmitNote: (body: string) => void;
  onCancelNote: () => void;
}) {
  const patient = usePatient(workItem.patientId);
  const events = useThreadEvents(workItem.id);
  return (
    <InboxPreviewPane
      workItem={workItem}
      patient={patient}
      events={events}
      composerOpen={composerOpen}
      onAcknowledge={onAcknowledge}
      onFlag={onFlag}
      onRoute={onRoute}
      onOpenComposer={onOpenComposer}
      onSubmitNote={onSubmitNote}
      onCancelNote={onCancelNote}
    />
  );
}
