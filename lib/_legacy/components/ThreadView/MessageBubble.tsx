'use client';

// =============================================================================
// MessageBubble — discriminator that renders one of 8 bubble variants based
// on event.type. Each variant uses the same outer click-to-activate pattern.
//
// Direction palette mirrors Phase 8: teal=inbound, violet=outbound,
// amber=auto/automation, rose=decline, primary-subtle/violet=status_change.
// =============================================================================

import { I } from '@/components/app/icons';
import { useLinkedWorkItems, usePatient, useUser, useWorkItem } from '@/lib/mockSystem/hooks';
import type { ThreadEvent } from '@/lib/mockSystem/types';
import { titleCaseStatus } from '../formatters';

const TEAL = '#0d9488';
const TEAL_SUBTLE = '#ccfbf1';
const VIOLET = '#7c3aed';
const VIOLET_SUBTLE = '#ede9fe';
const AMBER = '#d97706';
const AMBER_50 = '#fffbeb';
const ROSE = '#e11d48';
const ROSE_300 = '#fda4af';
const ROSE_50 = '#fff1f2';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function Avatar({ label, bg, color, size = 28 }: {
  label: string; bg: string; color: string; size?: number;
}) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: bg,
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
      fontSize: 12,
      fontWeight: 700,
      flexShrink: 0,
      letterSpacing: '0.02em',
    }}>
      {label}
    </div>
  );
}

function DirectionPill({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span style={{
      padding: '2px 7px',
      borderRadius: 'var(--radius-sm)',
      background: bg,
      color,
      fontFamily: 'var(--font-mono), monospace',
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: '0.08em',
    }}>
      {text}
    </span>
  );
}

function DocChip({ name, pages, dark = false }: { name: string; pages: number; dark?: boolean }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      background: dark ? 'rgba(255,255,255,0.15)' : '#f3f4f6',
      maxWidth: '100%',
      marginTop: 8,
    }}>
      <I.Document size={14} strokeWidth={1.8} />
      <span style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        color: dark ? 'white' : 'var(--color-text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 220,
      }}>
        {name}
      </span>
      <span style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        color: dark ? 'rgba(255,255,255,0.8)' : 'var(--color-text-tertiary)',
      }}>
        {pages}p
      </span>
    </div>
  );
}

function useActorName(actor: string, actorLabel?: string, fallback = 'System'): string {
  const user = useUser(actor === 'system' ? null : actor);
  return actorLabel ?? user?.name ?? fallback;
}

// -----------------------------------------------------------------------------
// document_received → InboundBubble
// -----------------------------------------------------------------------------

function InboundBubble({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'document_received' }>;
  active: boolean; onClick: () => void;
}) {
  const senderName = event.payload.senderLabel.split('(')[0].trim() || event.payload.senderLabel;
  const time = formatTime(event.timestamp);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Avatar label={initials(senderName)} bg={TEAL} color="white" />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {event.payload.senderLabel}
        </span>
        <DirectionPill text="INBOUND" color={TEAL} bg={TEAL_SUBTLE} />
        <span style={timestampStyle}>{time}</span>
      </div>
      <div
        onClick={onClick}
        style={{
          background: 'var(--color-surface)',
          boxShadow: active ? 'var(--shadow-panel)' : 'var(--shadow-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          marginLeft: 36,
          border: active ? `2px solid var(--color-primary)` : '2px solid transparent',
          cursor: 'pointer',
          transition: 'box-shadow var(--duration-fast), border-color var(--duration-fast)',
        }}>
        {event.payload.bodyText && (
          <p style={bodyTextStyle}>{event.payload.bodyText}</p>
        )}
        <DocChip name={event.payload.documentName} pages={event.payload.documentPages} />
      </div>
      <div style={{ ...metaFooterStyle, marginLeft: 36 }}>
        {event.payload.delivered && '✓ Delivered'}
        {event.payload.classificationNote && ` · ${event.payload.classificationNote}`}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// document_sent → OutboundBubble
// -----------------------------------------------------------------------------

function OutboundBubble({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'document_sent' }>;
  active: boolean; onClick: () => void;
}) {
  const senderName = useActorName(event.actor, event.actorLabel);
  const time = formatTime(event.timestamp);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '80%', marginLeft: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={timestampStyle}>{time}</span>
        <DirectionPill text="OUTBOUND" color={VIOLET} bg={VIOLET_SUBTLE} />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {senderName} → {event.payload.recipientLabel}
        </span>
        <Avatar label={initials(senderName)} bg={VIOLET} color="white" />
      </div>
      <div
        onClick={onClick}
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          boxShadow: active ? 'var(--shadow-panel)' : 'var(--shadow-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          marginRight: 36,
          border: active ? `2px solid ${VIOLET}` : '2px solid transparent',
          cursor: 'pointer',
          transition: 'box-shadow var(--duration-fast), border-color var(--duration-fast)',
        }}>
        {event.payload.bodyText && (
          <p style={{ ...bodyTextStyle, color: 'white' }}>{event.payload.bodyText}</p>
        )}
        <DocChip name={event.payload.documentName} pages={event.payload.documentPages} dark />
      </div>
      <div style={{ ...metaFooterStyle, marginRight: 36 }}>
        {event.payload.delivered && '✓ Delivered'}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// status_change → PipelineTransitionCard
// -----------------------------------------------------------------------------

function PipelineTransitionCard({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'status_change' }>;
  active: boolean; onClick: () => void;
}) {
  const actorName = useActorName(event.actor, event.actorLabel);
  const time = formatTime(event.timestamp);
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-primary-subtle)',
        border: `2px dashed ${VIOLET}`,
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        margin: '0 8px',
        cursor: 'pointer',
        boxShadow: active ? 'var(--shadow-panel)' : 'none',
        transition: 'box-shadow var(--duration-fast)',
      }}>
      <div style={{
        fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        textAlign: 'center',
      }}>
        {titleCaseStatus(event.payload.fromStatus)} → {titleCaseStatus(event.payload.toStatus)}
      </div>
      <hr style={{
        border: 'none',
        borderTop: '1px solid var(--color-border-strong)',
        margin: '12px 0',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        {event.payload.transitionActions.map(action => (
          <div key={action} style={transitionActionStyle}>
            <span style={{ color: TEAL, display: 'inline-flex' }}>
              <I.Check size={14} strokeWidth={2.5} />
            </span>
            {action}
          </div>
        ))}
      </div>
      {event.payload.notes && (
        <p style={{
          marginTop: 10,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          {event.payload.notes}
        </p>
      )}
      <div style={{
        marginTop: 12,
        textAlign: 'center',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
      }}>
        Moved by {actorName} · {time}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// note → NoteBubble
// -----------------------------------------------------------------------------

function NoteBubble({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'note' }>;
  active: boolean; onClick: () => void;
}) {
  const actorName = useActorName(event.actor, event.actorLabel);
  const time = formatTime(event.timestamp);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Avatar label={initials(actorName)} bg="var(--color-surface-dark)" color="white" />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {actorName}
        </span>
        <DirectionPill text="NOTE" color="var(--color-text-secondary)" bg="var(--color-primary-subtle)" />
        <span style={timestampStyle}>{time}</span>
      </div>
      <div
        onClick={onClick}
        style={{
          background: 'var(--color-primary-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 14,
          marginLeft: 36,
          border: active ? `2px solid var(--color-primary)` : '2px solid transparent',
          cursor: 'pointer',
          transition: 'border-color var(--duration-fast)',
        }}>
        <p style={bodyTextStyle}>{event.payload.bodyText}</p>
        {event.payload.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {event.payload.tags.map(t => (
              <span key={t} style={tagPillStyle}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// automation → AutomationBubble (port of Phase 8 AutoBubble)
// -----------------------------------------------------------------------------

function AutomationBubble({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'automation' }>;
  active: boolean; onClick: () => void;
}) {
  const time = formatTime(event.timestamp);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Avatar label="⚡" bg={AMBER} color="white" />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {event.payload.ruleName}
        </span>
        <DirectionPill text="AUTO" color={AMBER} bg={AMBER_50} />
        <span style={timestampStyle}>{time}</span>
      </div>
      <div
        onClick={onClick}
        style={{
          background: 'var(--color-surface)',
          border: `2px dashed ${AMBER}`,
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          marginLeft: 36,
          cursor: 'pointer',
          boxShadow: active ? 'var(--shadow-panel)' : 'none',
          transition: 'box-shadow var(--duration-fast)',
        }}>
        <p style={bodyTextStyle}>{event.payload.actionDescription}</p>
        {event.payload.bodyText && (
          <p style={{
            ...bodyTextStyle,
            marginTop: 6,
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
          }}>
            {event.payload.bodyText}
          </p>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// decline → DeclineBubble
// -----------------------------------------------------------------------------

function DeclineBubble({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'decline' }>;
  active: boolean; onClick: () => void;
}) {
  const actorName = useActorName(event.actor, event.actorLabel);
  const time = formatTime(event.timestamp);
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px dashed ${ROSE_300}`,
        borderRadius: 'var(--radius-lg)',
        background: ROSE_50,
        padding: '14px 16px',
        margin: '8px 8px',
        cursor: 'pointer',
        boxShadow: active ? 'var(--shadow-panel)' : 'none',
        transition: 'box-shadow var(--duration-fast)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ color: ROSE, display: 'inline-flex' }}>
          <I.X size={15} strokeWidth={2.5} />
        </span>
        <span style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 13,
          color: ROSE,
        }}>
          Declined — {event.payload.reason}
        </span>
        <span style={{ marginLeft: 'auto', ...timestampStyle }}>{time}</span>
      </div>
      {event.payload.notes && (
        <p style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          margin: '0 0 6px',
        }}>
          {event.payload.notes}
        </p>
      )}
      <div style={{
        display: 'flex',
        gap: 16,
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
      }}>
        <span>
          Declined by <strong style={{ color: 'var(--color-text-primary)' }}>{actorName}</strong>
        </span>
        {event.payload.courtesyFaxSent && <span style={{ color: '#059669' }}>✓ Courtesy fax sent</span>}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// assignment → AssignmentRow
// -----------------------------------------------------------------------------

function AssignmentRow({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'assignment' }>;
  active: boolean; onClick: () => void;
}) {
  const actorName = useActorName(event.actor, event.actorLabel);
  const toUser = useUser(event.payload.toUserId);
  const fromUser = useUser(event.payload.fromUserId);
  const time = formatTime(event.timestamp);
  const verb = !event.payload.fromUserId && event.payload.toUserId
    ? `assigned to ${toUser?.name ?? 'unknown'}`
    : event.payload.fromUserId && !event.payload.toUserId
      ? 'unassigned'
      : `reassigned from ${fromUser?.name ?? 'unknown'} to ${toUser?.name ?? 'unknown'}`;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        margin: '0 24px',
        background: active ? 'var(--color-primary-subtle)' : 'transparent',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
      }}>
      <div style={{ flex: 1, fontFamily: 'Sora, var(--font-body), system-ui, sans-serif', fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
        <strong style={{ color: 'var(--color-text-primary)' }}>{actorName}</strong> {verb}
        {event.payload.reason && (
          <span style={{ color: 'var(--color-text-tertiary)' }}> — {event.payload.reason}</span>
        )}
      </div>
      <span style={timestampStyle}>{time}</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// link_created → LinkRow
// -----------------------------------------------------------------------------

function LinkRow({ event, active, onClick }: {
  event: Extract<ThreadEvent, { type: 'link_created' }>;
  active: boolean; onClick: () => void;
}) {
  const actorName = useActorName(event.actor, event.actorLabel);
  const target = useWorkItem(event.payload.linkedWorkItemId);
  const targetPatient = usePatient(target?.patientId ?? '');
  const time = formatTime(event.timestamp);

  const verb = event.payload.relationship === 'spawned'
    ? 'spawned'
    : event.payload.relationship === 'spawned_from'
      ? 'spawned from'
      : 'related to';

  const targetLabel = target
    ? `${targetPatient?.name ?? target.patientId} (${target.departmentType.replace(/_/g, ' ')})`
    : event.payload.linkedWorkItemId;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '8px 14px',
        margin: '0 24px',
        background: active ? 'var(--color-primary-subtle)' : 'transparent',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
      }}>
      <span style={{ color: 'var(--color-text-tertiary)', display: 'inline-flex', marginTop: 2 }}>
        <I.Forward size={14} strokeWidth={1.8} />
      </span>
      <div style={{ flex: 1, fontFamily: 'Sora, var(--font-body), system-ui, sans-serif', fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
        <strong style={{ color: 'var(--color-text-primary)' }}>{actorName}</strong>{' '}
        {verb} <strong style={{ color: 'var(--color-text-primary)' }}>{targetLabel}</strong>
        {event.payload.bodyText && (
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)' }}>
            {event.payload.bodyText}
          </p>
        )}
      </div>
      <span style={timestampStyle}>{time}</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Discriminator
// -----------------------------------------------------------------------------

export function MessageBubble({ event, active, onClick }: {
  event: ThreadEvent; active: boolean; onClick: () => void;
}) {
  switch (event.type) {
    case 'document_received': return <InboundBubble event={event} active={active} onClick={onClick} />;
    case 'document_sent':     return <OutboundBubble event={event} active={active} onClick={onClick} />;
    case 'status_change':     return <PipelineTransitionCard event={event} active={active} onClick={onClick} />;
    case 'note':              return <NoteBubble event={event} active={active} onClick={onClick} />;
    case 'automation':        return <AutomationBubble event={event} active={active} onClick={onClick} />;
    case 'decline':           return <DeclineBubble event={event} active={active} onClick={onClick} />;
    case 'assignment':        return <AssignmentRow event={event} active={active} onClick={onClick} />;
    case 'link_created':      return <LinkRow event={event} active={active} onClick={onClick} />;
    default: {
      const _exhaustive: never = event;
      void _exhaustive;
      return null;
    }
  }
}

// -----------------------------------------------------------------------------
// Shared styles
// -----------------------------------------------------------------------------

const bodyTextStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 13,
  lineHeight: 1.55,
  color: 'var(--color-text-primary)',
};

const timestampStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 11,
  color: 'var(--color-text-tertiary)',
  flexShrink: 0,
};

const metaFooterStyle: React.CSSProperties = {
  marginTop: 6,
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 11,
  color: 'var(--color-text-tertiary)',
};

const transitionActionStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 13,
  color: 'var(--color-text-primary)',
};

const tagPillStyle: React.CSSProperties = {
  padding: '1px 6px',
  borderRadius: 'var(--radius-sm)',
  background: 'white',
  color: 'var(--color-primary)',
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 600,
};
