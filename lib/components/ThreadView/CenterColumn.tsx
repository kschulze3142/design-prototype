'use client';

// =============================================================================
// CenterColumn — sticky header (title + subtitle + no-op icon buttons),
// scrollable bubble area with day-grouped DateDivider, and the ComposeBar.
// =============================================================================

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { I } from '@/components/app/icons';
import type {
  DepartmentTemplate,
  Patient,
  ThreadEvent,
  WorkItem,
} from '@/lib/mockSystem/types';
import { ComposeBar } from './ComposeBar';
import { MessageBubble } from './MessageBubble';

type Props = {
  workItem: WorkItem;
  template: DepartmentTemplate;
  patient: Patient | null;
  events: ThreadEvent[];
  activeEventId: string | null;
  setActiveEventId: (id: string) => void;
  customActions?: ReactNode;
};

function dateKey(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dayCount(events: ThreadEvent[]): number {
  if (events.length === 0) return 0;
  const days = new Set(events.map(e => dateKey(e.timestamp)));
  return days.size;
}

function CenterHeader({ template, patient, eventCount, days }: {
  template: DepartmentTemplate;
  patient: Patient | null;
  eventCount: number;
  days: number;
}) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexShrink: 0,
    }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {template.name} Thread — {patient?.name ?? 'Unknown patient'}
        </h1>
        <p style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: 'var(--color-text-tertiary)',
          margin: 0,
          marginTop: 4,
        }}>
          {eventCount} event{eventCount === 1 ? '' : 's'}
          {days > 0 && ` · ${days} day${days === 1 ? '' : 's'}`}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <IconButton label="Search">
          <I.Search size={16} strokeWidth={2} />
        </IconButton>
        <IconButton label="Print">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V2h12v7" />
            <rect x="6" y="14" width="12" height="8" rx="1" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          </svg>
        </IconButton>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 14px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border-strong)',
          background: 'white',
          color: 'var(--color-text-primary)',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <I.Audit size={14} strokeWidth={1.8} />
          Audit trail
        </button>
      </div>
    </div>
  );
}

function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button aria-label={label} style={{
      width: 36, height: 36, borderRadius: 'var(--radius-sm)',
      background: 'transparent', border: 'none', cursor: 'pointer',
      color: 'var(--color-text-tertiary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </button>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '16px 0',
    }}>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />
      <span style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}>
        {label}
      </span>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />
    </div>
  );
}

export function CenterColumn({
  workItem,
  template,
  patient,
  events,
  activeEventId,
  setActiveEventId,
  customActions,
}: Props) {
  const groups = useMemo(() => {
    const out: { date: string; events: ThreadEvent[] }[] = [];
    events.forEach(evt => {
      const d = dateKey(evt.timestamp);
      const last = out[out.length - 1];
      if (last && last.date === d) last.events.push(evt);
      else out.push({ date: d, events: [evt] });
    });
    return out;
  }, [events]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events.length]);

  return (
    <section style={{
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      overflow: 'hidden',
    }}>
      <CenterHeader
        template={template}
        patient={patient}
        eventCount={events.length}
        days={dayCount(events)}
      />
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {events.length === 0 ? (
          <div style={{
            margin: 'auto',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            color: 'var(--color-text-tertiary)',
            fontStyle: 'italic',
          }}>
            No thread events yet for this item.
          </div>
        ) : (
          groups.map(group => (
            <div key={group.date} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <DateDivider label={group.date} />
              {group.events.map(evt => (
                <MessageBubble
                  key={evt.id}
                  event={evt}
                  active={evt.id === activeEventId}
                  onClick={() => setActiveEventId(evt.id)}
                />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <ComposeBar workItem={workItem} template={template} customActions={customActions} />
    </section>
  );
}
