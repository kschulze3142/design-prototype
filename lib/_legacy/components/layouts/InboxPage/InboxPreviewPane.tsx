'use client';

// =============================================================================
// InboxPreviewPane — right pane of the inbox layout.
//
// Structure:
//   1. Doc header strip — tag pill · "1 page" stub · received-at timestamp
//   2. Clinical readout — patient + criticality pill (prominent) +
//      abnormalFlags chips + provider/type/source-order link
//   3. Quick action bar — Acknowledge / Flag / Route / Add Note
//   4. AddNoteComposer (toggled by Add Note)
//   5. Activity log — full thread events via MessageBubble
//
// All event rendering reuses ThreadView's MessageBubble (status_change, note,
// document_received, etc.) so the inbox stays consistent with the dedicated
// thread page.
// =============================================================================

import type { ReactNode } from 'react';
import { I } from '@/components/app/icons';
import { Pill } from '@/components/app/primitives';
import { formatRelative } from '@/lib/components/formatters';
import { MessageBubble } from '@/lib/components/ThreadView/MessageBubble';
import type {
  ClinicalResultsMetadata,
  Patient,
  ThreadEvent,
  WorkItem,
} from '@/lib/mockSystem/types';
import { AddNoteComposer } from './AddNoteComposer';

type ClinicalResultsItem = Extract<WorkItem, { departmentType: 'clinical_results' }>;

type Props = {
  workItem: ClinicalResultsItem;
  patient: Patient | null;
  events: ThreadEvent[];
  composerOpen: boolean;
  onAcknowledge: () => void;
  onFlag: () => void;
  onRoute: () => void;
  onOpenComposer: () => void;
  onSubmitNote: (body: string) => void;
  onCancelNote: () => void;
};

const CRITICALITY_TONE = {
  critical:   'red',
  borderline: 'amber',
  normal:     'slate',
} as const;

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

// -----------------------------------------------------------------------------
// Doc header strip — tag pill, page stub, received-at timestamp. Mimics the
// chrome of a faxed/PDF document landing in the queue.
// -----------------------------------------------------------------------------

function DocHeaderStrip({ workItem }: { workItem: ClinicalResultsItem }) {
  const tag = workItem.docTags[0] ?? 'Document';
  const received = formatRelative(workItem.metadata.receivedAt);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: 14,
      }}
    >
      <I.Document size={16} strokeWidth={1.8} />
      <Pill tone="slate" dot={false}>{tag}</Pill>
      <span style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
      }}>
        1 page
      </span>
      <span style={{ flex: 1 }} />
      <span style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
      }}>
        Received {received}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Clinical readout — large criticality pill, abnormalFlags chips, secondary
// metadata rows, source-order link (visual, inert).
// -----------------------------------------------------------------------------

function ClinicalReadout({
  workItem,
  patient,
}: {
  workItem: ClinicalResultsItem;
  patient: Patient | null;
}) {
  const m: ClinicalResultsMetadata = workItem.metadata;
  const tone = CRITICALITY_TONE[m.criticality];
  const sourceOrder = workItem.linkedItems[0];
  return (
    <div
      style={{
        padding: 18,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {patient?.name ?? 'Unknown patient'}
          </h2>
          {patient && (
            <p style={{
              margin: 0,
              marginTop: 4,
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 12,
              color: 'var(--color-text-tertiary)',
            }}>
              {patient.mrn} · {patient.age}{patient.sex} · {patient.insurance}
            </p>
          )}
        </div>
        <div style={{ flexShrink: 0 }}>
          <Pill tone={tone} dot={false}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.02em' }}>
              {capitalize(m.criticality)}
            </span>
          </Pill>
        </div>
      </div>

      {m.abnormalFlags.length > 0 && (
        <FieldBlock label="Findings">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {m.abnormalFlags.map(flag => (
              <span
                key={flag}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  background: tone === 'red'
                    ? '#fff1f2'
                    : tone === 'amber'
                      ? '#fffbeb'
                      : 'var(--color-primary-subtle)',
                  color: tone === 'red'
                    ? '#b91c1c'
                    : tone === 'amber'
                      ? '#92400e'
                      : 'var(--color-text-primary)',
                  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {flag}
              </span>
            ))}
          </div>
        </FieldBlock>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <FieldBlock label="Type">
          <span style={fieldValueStyle}>{capitalize(m.resultType)}</span>
        </FieldBlock>
        <FieldBlock label="Ordering provider">
          <span style={fieldValueStyle}>{m.orderingProvider}</span>
        </FieldBlock>
      </div>

      {sourceOrder && (
        <FieldBlock label="Source order">
          <span
            style={{
              ...fieldValueStyle,
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12.5,
            }}
          >
            → {sourceOrder.itemId}
          </span>
        </FieldBlock>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Quick-action bar — Acknowledge, Flag, Route to provider, Add Note.
// Acknowledge is disabled iff item is already resolved; Flag is disabled iff
// already flagged. From the other terminal state both remain available.
// -----------------------------------------------------------------------------

function QuickActionBar({
  workItem,
  composerOpen,
  onAcknowledge,
  onFlag,
  onRoute,
  onOpenComposer,
}: {
  workItem: ClinicalResultsItem;
  composerOpen: boolean;
  onAcknowledge: () => void;
  onFlag: () => void;
  onRoute: () => void;
  onOpenComposer: () => void;
}) {
  const ackDisabled = workItem.status === 'resolved';
  const flagDisabled = workItem.status === 'flagged';
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: 14,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        marginTop: 14,
      }}
    >
      <QuickActionButton
        onClick={onAcknowledge}
        disabled={ackDisabled}
        icon={<I.Check size={14} strokeWidth={2.2} />}
        primary
      >
        Acknowledge
      </QuickActionButton>
      <QuickActionButton
        onClick={onFlag}
        disabled={flagDisabled}
        icon={<I.X size={14} strokeWidth={2} />}
        danger
      >
        Flag
      </QuickActionButton>
      <QuickActionButton
        onClick={onRoute}
        icon={<I.Forward size={14} strokeWidth={1.8} />}
      >
        Route to provider
      </QuickActionButton>
      <QuickActionButton
        onClick={onOpenComposer}
        icon={<I.Note size={14} strokeWidth={1.8} />}
        pressed={composerOpen}
      >
        Add note
      </QuickActionButton>
    </div>
  );
}

function QuickActionButton({
  onClick,
  disabled = false,
  icon,
  children,
  primary,
  danger,
  pressed,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
  pressed?: boolean;
}) {
  const bg = pressed
    ? 'var(--color-primary-subtle)'
    : primary
      ? 'var(--color-primary)'
      : danger
        ? '#fff1f2'
        : 'white';
  const fg = primary && !pressed
    ? 'white'
    : danger
      ? '#b91c1c'
      : 'var(--color-text-primary)';
  const border = primary && !pressed
    ? 'none'
    : danger
      ? '1px solid #fda4af'
      : '1px solid var(--color-border-strong)';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 34,
        padding: '0 14px',
        borderRadius: 'var(--radius-pill)',
        background: bg,
        color: fg,
        border,
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Activity log — events sorted ascending, rendered via MessageBubble.
// Bubble selection isn't meaningful in the inbox preview, so active=false
// and onClick is a no-op for every bubble.
// -----------------------------------------------------------------------------

function ActivityLog({ events }: { events: ThreadEvent[] }) {
  if (events.length === 0) {
    return (
      <div
        style={{
          marginTop: 18,
          padding: 14,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12.5,
          color: 'var(--color-text-tertiary)',
          fontStyle: 'italic',
        }}
      >
        No activity yet.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
      <h3 style={{
        margin: 0,
        fontFamily: 'JetBrains Mono, var(--font-mono), monospace',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
        fontWeight: 600,
      }}>
        Activity
      </h3>
      {events.map(evt => (
        <MessageBubble
          key={evt.id}
          event={evt}
          active={false}
          onClick={() => { /* inbox preview log doesn't support bubble selection */ }}
        />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Shared
// -----------------------------------------------------------------------------

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-tertiary)',
  fontWeight: 600,
  marginBottom: 6,
};

const fieldValueStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 13,
  color: 'var(--color-text-primary)',
  fontWeight: 500,
};

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Top-level pane
// -----------------------------------------------------------------------------

export function InboxPreviewPane({
  workItem,
  patient,
  events,
  composerOpen,
  onAcknowledge,
  onFlag,
  onRoute,
  onOpenComposer,
  onSubmitNote,
  onCancelNote,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <DocHeaderStrip workItem={workItem} />
      <ClinicalReadout workItem={workItem} patient={patient} />
      <QuickActionBar
        workItem={workItem}
        composerOpen={composerOpen}
        onAcknowledge={onAcknowledge}
        onFlag={onFlag}
        onRoute={onRoute}
        onOpenComposer={onOpenComposer}
      />
      <AddNoteComposer
        open={composerOpen}
        onSubmit={onSubmitNote}
        onCancel={onCancelNote}
      />
      <ActivityLog events={events} />
    </div>
  );
}

export function InboxPreviewEmpty() {
  return (
    <div
      style={{
        height: '100%',
        minHeight: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{
          margin: 0,
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
        }}>
          Select a result to preview
        </p>
        <p style={{
          margin: '6px 0 0',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12.5,
          color: 'var(--color-text-tertiary)',
        }}>
          Choose any item from the list to see the full readout and activity.
        </p>
      </div>
    </div>
  );
}
