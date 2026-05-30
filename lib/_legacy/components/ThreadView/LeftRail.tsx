'use client';

// =============================================================================
// LeftRail — Back link + PatientCard + scrollable thread list.
//
// ThreadListItem icon/label maps the 8 ThreadEvent types to direction colors
// (teal=inbound, violet=outbound, amber=automation, rose=decline, slate=
// note/assignment/status_change/link_created) and a short list label.
// =============================================================================

import Link from 'next/link';
import { I } from '@/components/app/icons';
import { Pill } from '@/components/app/primitives';
import { useUser } from '@/lib/mockSystem/hooks';
import type {
  DepartmentTemplate,
  Patient,
  PillTone,
  ThreadEvent,
} from '@/lib/mockSystem/types';
import { titleCaseStatus } from '../formatters';

const TEAL = '#0d9488';
const VIOLET = '#7c3aed';
const AMBER = '#d97706';
const ROSE = '#e11d48';

type Props = {
  type: string;
  template: DepartmentTemplate;
  patient: Patient | null;
  status: string;
  events: ThreadEvent[];
  activeEventId: string | null;
  setActiveEventId: (id: string) => void;
};

function eventColor(event: ThreadEvent): string {
  switch (event.type) {
    case 'document_received': return TEAL;
    case 'document_sent':     return VIOLET;
    case 'automation':        return AMBER;
    case 'decline':           return ROSE;
    case 'status_change':     return VIOLET;
    default:                  return 'var(--color-text-tertiary)';
  }
}

function eventLabel(event: ThreadEvent): string {
  switch (event.type) {
    case 'document_received': return 'Inbound Document';
    case 'document_sent':     return 'Outbound Document';
    case 'status_change':     return `Moved to ${titleCaseStatus(event.payload.toStatus)}`;
    case 'note':              return 'Note';
    case 'assignment':        return 'Assignment';
    case 'automation':        return 'Automation';
    case 'decline':           return 'Declined';
    case 'link_created':      return 'Linked Item';
  }
}

function EventIcon({ event, size = 12 }: { event: ThreadEvent; size?: number }) {
  const color = eventColor(event);
  switch (event.type) {
    case 'document_received':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v10" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 19h14" />
        </svg>
      );
    case 'document_sent':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V9" />
          <path d="m7 14 5-5 5 5" />
          <path d="M5 5h14" />
        </svg>
      );
    case 'automation':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color}
          strokeWidth="1" strokeLinejoin="round">
          <path d="M13 2 3 14h7l-1 8 10-12h-7Z" />
        </svg>
      );
    case 'decline':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case 'status_change':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case 'note':
      return <I.Note size={size} strokeWidth={2} />;
    case 'link_created':
      return <I.Forward size={size} strokeWidth={2} />;
    case 'assignment':
      return <I.Patients size={size} strokeWidth={2} />;
  }
}

function actorLabelText(event: ThreadEvent): string {
  switch (event.type) {
    case 'document_received': return event.payload.senderLabel;
    case 'document_sent':     return `→ ${event.payload.recipientLabel}`;
    case 'automation':        return event.payload.ruleName;
    default:                  return '';
  }
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function ThreadListItem({
  event,
  active,
  showConnector,
  onClick,
}: {
  event: ThreadEvent;
  active: boolean;
  showConnector: boolean;
  onClick: () => void;
}) {
  const color = eventColor(event);
  const user = useUser(event.actor === 'system' ? null : event.actor);
  const secondary = actorLabelText(event) || user?.name || (event.actor === 'system' ? 'System' : '');
  const tags = event.type === 'document_received' || event.type === 'document_sent' || event.type === 'note'
    ? event.payload.tags
    : [];

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 10,
        position: 'relative',
        padding: '10px 10px 10px 11px',
        background: active ? 'var(--color-primary-subtle)' : 'transparent',
        border: 'none',
        borderLeft: active
          ? `3px solid var(--color-primary)`
          : '3px solid transparent',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'background var(--duration-fast)',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0, width: 24 }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--color-surface)',
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <EventIcon event={event} size={12} />
        </div>
        {showConnector && (
          <div style={{
            position: 'absolute',
            top: 24,
            left: 11,
            width: 2,
            height: 'calc(100% + 12px)',
            background: 'var(--color-border)',
          }} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
        <p style={{
          margin: 0,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}>
          {eventLabel(event)}
        </p>
        {secondary && (
          <p style={{
            margin: 0,
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 11,
            color: 'var(--color-text-tertiary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {secondary}
          </p>
        )}
        <p style={{
          margin: 0,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {formatTimestamp(event.timestamp)}
        </p>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            {tags.map(t => (
              <span key={t} style={{
                padding: '1px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 10,
                fontWeight: 600,
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function PatientCard({ patient, template, status }: {
  patient: Patient | null;
  template: DepartmentTemplate;
  status: string;
}) {
  const tone = (template.statusTones[status] ?? 'slate') as PillTone;
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: 16,
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: 2,
      }}>
        {patient?.name ?? 'Unknown patient'}
      </div>
      {patient && (
        <>
          <div style={metaLineStyle}>{patient.age}{patient.sex} · DOB {patient.dob}</div>
          <div style={metaLineStyle}>MRN {patient.mrn}</div>
          <div style={{ ...metaLineStyle, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            {patient.insurance}
          </div>
        </>
      )}
      <span style={{ alignSelf: 'flex-start' }}>
        <Pill tone={tone}>{titleCaseStatus(status)}</Pill>
      </span>
    </div>
  );
}

const metaLineStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 12,
  color: 'var(--color-text-tertiary)',
};

export function LeftRail({
  type,
  template,
  patient,
  status,
  events,
  activeEventId,
  setActiveEventId,
}: Props) {
  return (
    <aside style={{
      width: 280,
      flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
      background: 'var(--color-bg)',
      overflowY: 'auto',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Link
        href={`/app/departments/${type}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--color-primary)',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          marginBottom: 16,
          padding: '4px 0',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to {template.name.toLowerCase()}
      </Link>

      <PatientCard patient={patient} template={template} status={status} />

      {events.length === 0 ? (
        <div style={{
          padding: '20px 8px',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-tertiary)',
          fontStyle: 'italic',
        }}>
          No thread events yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {events.map((evt, idx) => (
            <ThreadListItem
              key={evt.id}
              event={evt}
              active={evt.id === activeEventId}
              showConnector={idx < events.length - 1}
              onClick={() => setActiveEventId(evt.id)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
