'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { I } from '@/components/app/icons';
import {
  mockPatient,
  mockThreadEvents,
  PIPELINE_STAGES,
  STAGE_LABELS,
  NEXT_ACTION_HINTS,
  TEMPLATE_CHIPS,
  type Direction,
  type EventType,
  type ThreadEvent,
} from './mockThreadData';

const TEAL = '#0d9488';
const TEAL_SUBTLE = '#ccfbf1';
const VIOLET = '#7c3aed';
const VIOLET_SUBTLE = '#ede9fe';
const VIOLET_50 = '#f5f3ff';
const AMBER = '#d97706';
const AMBER_50 = '#fffbeb';

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  fax_inbound: 'Inbound Fax',
  fax_outbound: 'Outbound Fax',
  auto_fax: 'Auto Fax',
  pipeline_transition: 'Pipeline Move',
  note: 'Note',
};

function directionColor(direction: Direction): string {
  if (direction === 'inbound') return TEAL;
  if (direction === 'outbound') return VIOLET;
  if (direction === 'auto') return AMBER;
  return 'var(--color-text-tertiary)';
}

function dateKey(timestamp: string): string {
  return timestamp.split(',')[0];
}

function formatUSD(cents: number): string {
  const dollars = Math.round(cents / 100);
  return `$${dollars.toLocaleString('en-US')}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

function IconForEvent({ event, size = 14 }: { event: ThreadEvent; size?: number }) {
  const color = directionColor(event.direction);
  if (event.eventType === 'fax_inbound') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v10" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 19h14" />
      </svg>
    );
  }
  if (event.eventType === 'fax_outbound') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V9" />
        <path d="m7 14 5-5 5 5" />
        <path d="M5 5h14" />
      </svg>
    );
  }
  if (event.eventType === 'auto_fax') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color}
        strokeWidth="1" strokeLinejoin="round">
        <path d="M13 2 3 14h7l-1 8 10-12h-7Z" />
      </svg>
    );
  }
  if (event.eventType === 'pipeline_transition') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DocChip({ name, pages }: { name: string; pages: number | null }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      background: '#f3f4f6',
      maxWidth: '100%',
      marginTop: 8,
    }}>
      <I.Document size={14} strokeWidth={1.8} />
      <span style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: 220,
      }}>
        {name}
      </span>
      {pages !== null && (
        <span style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {pages}p
        </span>
      )}
    </div>
  );
}

// ─── LEFT SIDEBAR ─────────────────────────────────────────────────────────────

function PatientCard() {
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
        {mockPatient.name}
      </div>
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
      }}>
        {mockPatient.age} · DOB {mockPatient.dob}
      </div>
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
      }}>
        MRN {mockPatient.mrn}
      </div>
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-secondary)',
        marginBottom: 8,
      }}>
        {mockPatient.insurance}
      </div>
      <span style={{
        alignSelf: 'flex-start',
        padding: '3px 9px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-primary)',
        color: 'white',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {mockPatient.currentStatus}
      </span>
    </div>
  );
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
  const color = directionColor(event.direction);
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
          <IconForEvent event={event} size={12} />
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
          {EVENT_TYPE_LABEL[event.eventType]}
        </p>
        <p style={{
          margin: 0,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {event.senderLabel}
        </p>
        <p style={{
          margin: 0,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {event.timestamp}
        </p>
        {event.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            {event.tags.map(t => (
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

function LeftSidebar({
  activeEventId,
  setActiveEventId,
}: {
  activeEventId: string;
  setActiveEventId: (id: string) => void;
}) {
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
        href="/app/referrals"
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
        Back to pipeline
      </Link>

      <PatientCard />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {mockThreadEvents.map((evt, idx) => (
          <ThreadListItem
            key={evt.id}
            event={evt}
            active={evt.id === activeEventId}
            showConnector={idx < mockThreadEvents.length - 1}
            onClick={() => setActiveEventId(evt.id)}
          />
        ))}
      </div>
    </aside>
  );
}

// ─── CENTER COLUMN ────────────────────────────────────────────────────────────

function CenterHeader() {
  const eventCount = mockThreadEvents.length;
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
          Referral Thread — {mockPatient.name}
        </h1>
        <p style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: 'var(--color-text-tertiary)',
          margin: 0,
          marginTop: 4,
        }}>
          {eventCount} events · 2 days · {mockPatient.referringOrg} → Northwind Health
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button aria-label="Search" style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--color-text-tertiary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I.Search size={16} strokeWidth={2} />
        </button>
        <button aria-label="Print" style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--color-text-tertiary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V2h12v7" />
            <rect x="6" y="14" width="12" height="8" rx="1" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          </svg>
        </button>
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

function Avatar({ label, bg, color, size = 36 }: {
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

function InboundBubble({ event, active, onClick }: {
  event: ThreadEvent; active: boolean; onClick: () => void;
}) {
  const time = event.timestamp.split(', ')[1] ?? event.timestamp;
  const senderInitials = initials(event.senderLabel.split('(')[0].trim() || event.senderLabel);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Avatar label={senderInitials} bg={TEAL} color="white" size={28} />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {event.senderLabel}
        </span>
        <DirectionPill text="INBOUND" color={TEAL} bg={TEAL_SUBTLE} />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {time}
        </span>
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
        {event.bodyText && (
          <p style={{
            margin: 0,
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            lineHeight: 1.55,
            color: 'var(--color-text-primary)',
          }}>
            {event.bodyText}
          </p>
        )}
        {event.documentName && (
          <DocChip name={event.documentName} pages={event.documentPages} />
        )}
      </div>
      <div style={{
        marginLeft: 36,
        marginTop: 6,
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
      }}>
        {event.delivered && '✓ Delivered'}
        {event.classificationNote && ` · ${event.classificationNote}`}
      </div>
    </div>
  );
}

function OutboundBubble({ event, active, onClick }: {
  event: ThreadEvent; active: boolean; onClick: () => void;
}) {
  const time = event.timestamp.split(', ')[1] ?? event.timestamp;
  const sender = event.senderLabel.split('→')[0].trim();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '80%', marginLeft: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {time}
        </span>
        <DirectionPill text="OUTBOUND" color={VIOLET} bg={VIOLET_SUBTLE} />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {sender}
        </span>
        <Avatar label={initials(sender)} bg={VIOLET} color="white" size={28} />
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
        {event.bodyText && (
          <p style={{
            margin: 0,
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            lineHeight: 1.55,
            color: 'white',
          }}>
            {event.bodyText}
          </p>
        )}
        {event.documentName && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.15)',
            marginTop: 8,
          }}>
            <I.Document size={14} strokeWidth={1.8} />
            <span style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 12,
              fontWeight: 600,
            }}>
              {event.documentName}
            </span>
            {event.documentPages !== null && (
              <span style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 11,
                opacity: 0.8,
              }}>
                {event.documentPages}p
              </span>
            )}
          </div>
        )}
      </div>
      <div style={{
        marginRight: 36,
        marginTop: 6,
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
      }}>
        {event.delivered && '✓ Delivered'}
      </div>
    </div>
  );
}

function AutoBubble({ event, active, onClick }: {
  event: ThreadEvent; active: boolean; onClick: () => void;
}) {
  const time = event.timestamp.split(', ')[1] ?? event.timestamp;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Avatar label="⚡" bg={AMBER} color="white" size={28} />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {event.senderLabel}
        </span>
        <DirectionPill text="AUTO" color={AMBER} bg={AMBER_50} />
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {time}
        </span>
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
        {event.bodyText && (
          <p style={{
            margin: 0,
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            lineHeight: 1.55,
            color: 'var(--color-text-primary)',
          }}>
            {event.bodyText}
          </p>
        )}
        {event.documentName && (
          <DocChip name={event.documentName} pages={event.documentPages} />
        )}
      </div>
      {event.classificationNote && (
        <div style={{
          marginLeft: 36,
          marginTop: 6,
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {event.classificationNote}
        </div>
      )}
    </div>
  );
}

function PipelineTransitionCard({ event, active, onClick }: {
  event: ThreadEvent; active: boolean; onClick: () => void;
}) {
  const fromLabel = event.pipelineFromStatus
    ? (STAGE_LABELS[event.pipelineFromStatus] ?? event.pipelineFromStatus)
    : '';
  const toLabel = event.pipelineToStatus
    ? (STAGE_LABELS[event.pipelineToStatus] ?? event.pipelineToStatus)
    : '';
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
        {fromLabel} → {toLabel}
      </div>
      <hr style={{
        border: 'none',
        borderTop: '1px solid var(--color-border-strong)',
        margin: '12px 0',
      }} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'center',
      }}>
        {event.transitionActions?.map(action => (
          <div key={action} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            color: 'var(--color-text-primary)',
          }}>
            <span style={{ color: TEAL, display: 'inline-flex' }}>
              <I.Check size={14} strokeWidth={2.5} />
            </span>
            {action}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 12,
        textAlign: 'center',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
      }}>
        Moved by {event.senderLabel} · {event.timestamp}
      </div>
    </div>
  );
}

function EventBubble({ event, active, onClick }: {
  event: ThreadEvent; active: boolean; onClick: () => void;
}) {
  if (event.direction === 'inbound') return <InboundBubble event={event} active={active} onClick={onClick} />;
  if (event.direction === 'outbound') return <OutboundBubble event={event} active={active} onClick={onClick} />;
  if (event.direction === 'auto') return <AutoBubble event={event} active={active} onClick={onClick} />;
  return <PipelineTransitionCard event={event} active={active} onClick={onClick} />;
}

function ComposeBar() {
  const [value, setValue] = useState('');
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '14px 24px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {TEMPLATE_CHIPS.map(chip => (
          <button key={chip} style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-primary)',
            background: 'white',
            color: 'var(--color-primary)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            {chip}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Type a message or attach a document…"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            flex: 1,
            height: 42,
            padding: '0 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            color: 'var(--color-text-primary)',
            outline: 'none',
            background: 'white',
          }}
        />
        <button
          type="button"
          onClick={() => setValue('')}
          style={{
            height: 42,
            padding: '0 22px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <I.Send size={14} strokeWidth={2} />
          Send
        </button>
      </div>
    </div>
  );
}

function CenterColumn({
  activeEventId,
  setActiveEventId,
}: {
  activeEventId: string;
  setActiveEventId: (id: string) => void;
}) {
  const groups = useMemo(() => {
    const out: { date: string; events: ThreadEvent[] }[] = [];
    mockThreadEvents.forEach(evt => {
      const d = dateKey(evt.timestamp);
      const last = out[out.length - 1];
      if (last && last.date === d) last.events.push(evt);
      else out.push({ date: d, events: [evt] });
    });
    return out;
  }, []);

  return (
    <section style={{
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      overflow: 'hidden',
    }}>
      <CenterHeader />
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {groups.map(group => (
          <div key={group.date} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DateDivider label={group.date} />
            {group.events.map(evt => (
              <EventBubble
                key={evt.id}
                event={evt}
                active={evt.id === activeEventId}
                onClick={() => setActiveEventId(evt.id)}
              />
            ))}
          </div>
        ))}
      </div>
      <ComposeBar />
    </section>
  );
}

// ─── RIGHT COLUMN ─────────────────────────────────────────────────────────────

function LifecycleStepper({ currentStatus }: { currentStatus: string }) {
  const currentIdx = PIPELINE_STAGES.indexOf(currentStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {PIPELINE_STAGES.map((stage, idx) => {
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isLast = idx === PIPELINE_STAGES.length - 1;

        const dotBg = isDone ? TEAL : 'white';
        const dotBorder = isDone
          ? TEAL
          : isCurrent
            ? VIOLET
            : 'var(--color-border-strong)';
        const dotShadow = isCurrent
          ? `0 0 0 4px ${VIOLET_SUBTLE}`
          : 'none';

        const labelColor = isDone
          ? 'var(--color-text-primary)'
          : isCurrent
            ? VIOLET
            : 'var(--color-text-tertiary)';
        const labelWeight = isCurrent ? 600 : 500;

        const connectorColor = isDone ? TEAL : 'var(--color-border)';

        return (
          <div key={stage} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: dotBg,
                border: `2px solid ${dotBorder}`,
                boxShadow: dotShadow,
                marginTop: 2,
              }} />
              {!isLast && (
                <div style={{
                  width: 2,
                  height: 28,
                  background: connectorColor,
                  marginTop: 2,
                  marginBottom: 2,
                }} />
              )}
            </div>
            <div style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 13,
              fontWeight: labelWeight,
              color: labelColor,
              paddingBottom: isLast ? 0 : 14,
            }}>
              {STAGE_LABELS[stage] ?? stage}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NextActionHint({ currentStatus }: { currentStatus: string }) {
  const hint = NEXT_ACTION_HINTS[currentStatus];
  if (!hint) return null;

  return (
    <div style={{
      background: VIOLET_50,
      border: `2px solid ${VIOLET}`,
      borderRadius: 'var(--radius-md)',
      padding: 16,
      marginTop: 20,
    }}>
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
        marginBottom: 8,
      }}>
        Advancing will:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {hint.actions.map(a => (
          <div key={a} style={{
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            color: 'var(--color-text-primary)',
          }}>
            → {a}
          </div>
        ))}
      </div>
      <button style={{
        width: '100%',
        marginTop: 12,
        height: 38,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
      }}>
        {hint.label}
      </button>
    </div>
  );
}

function StakeholderField({ label, value, subValue }: {
  label: string; value: string; subValue?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 11,
        color: 'var(--color-text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        fontWeight: 600,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        color: 'var(--color-text-primary)',
        fontWeight: 500,
      }}>
        {value}
      </div>
      {subValue && (
        <div style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}>
          {subValue}
        </div>
      )}
    </div>
  );
}

function RightColumn() {
  return (
    <aside style={{
      width: 320,
      flexShrink: 0,
      background: 'var(--color-surface)',
      borderLeft: '1px solid var(--color-border)',
      padding: '24px 24px',
      overflowY: 'auto',
    }}>
      <h2 style={{
        fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        margin: 0,
        marginBottom: 16,
      }}>
        Referral Lifecycle
      </h2>
      <LifecycleStepper currentStatus={mockPatient.currentStatus} />
      <NextActionHint currentStatus={mockPatient.currentStatus} />

      <h2 style={{
        fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        margin: 0,
        marginTop: 28,
        marginBottom: 14,
      }}>
        Stakeholders
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <StakeholderField
          label="Referring Physician"
          value={mockPatient.referringPhysician}
          subValue={mockPatient.referringOrg}
        />
        <StakeholderField
          label="Assigned Coordinator"
          value={mockPatient.assignedTo}
        />
        <StakeholderField
          label="Episode Value"
          value={formatUSD(mockPatient.episodeValueCents)}
        />
      </div>
    </aside>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ReferralThreadPage() {
  const [activeEventId, setActiveEventId] = useState<string>('e1');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--color-bg)',
      marginLeft: -32,
      marginRight: -32,
    }}>
      <LeftSidebar
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
      />
      <CenterColumn
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
      />
      <RightColumn />
    </div>
  );
}
