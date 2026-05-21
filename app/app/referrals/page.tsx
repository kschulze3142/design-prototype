'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggableProvided,
  type DropResult,
} from '@hello-pangea/dnd';
import { I } from '@/components/app/icons';
import {
  COLUMNS,
  MOCK_AUTOMATIONS,
  TRANSITION_BARS,
  mockDeclinedReferrals,
  mockReferrals,
  type DeclinedReferral,
  type Referral,
  type ReferralStatus,
} from './mockData';
import DeclineModal from './components/DeclineModal';
import SequentialAdvanceModal, { type PendingDrop } from './components/SequentialAdvanceModal';

const STAGE_ORDER: ReferralStatus[] = COLUMNS.map(c => c.key);
const STAGE_LABELS: Record<ReferralStatus, string> = COLUMNS.reduce(
  (acc, c) => ({ ...acc, [c.key]: c.label }),
  {} as Record<ReferralStatus, string>,
);

type TabKey = 'active' | 'declined';
type ViewKey = 'pipeline' | 'table' | 'calendar';

const ROSE_300 = '#fda4af';
const ROSE_400 = '#fb7185';
const ROSE_50  = '#fff1f2';
const ROSE_700 = '#be123c';

// ─── PAGE HEADER ───────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div style={{
      paddingTop: 32,
      paddingBottom: 24,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
    }}>
      <div>
        <p style={{
          fontFamily: 'JetBrains Mono, var(--font-mono), monospace',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
          marginBottom: 6,
          fontWeight: 600,
        }}>
          Workflow
        </p>
        <h1 style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 30,
          color: 'var(--color-text-primary)',
          margin: 0,
          lineHeight: 1.15,
        }}>
          Referrals
        </h1>
        <p style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 14,
          color: 'var(--color-text-secondary)',
          margin: 0,
          marginTop: 6,
        }}>
          Manage incoming referrals and track pipeline status
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
        <button style={{
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
        }}>
          <I.Download size={14} strokeWidth={2} />
          Export
        </button>
        <button style={{
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
        }}>
          <I.Plus size={14} strokeWidth={2.4} />
          New Referral
        </button>
      </div>
    </div>
  );
}

// ─── STAT STRIP ───────────────────────────────────────────────────────────────

function formatUSD(cents: number) {
  const dollars = Math.round(cents / 100);
  return `$${dollars.toLocaleString('en-US')}`;
}

function StatCell({ label, value, valueColor, sub }: {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div style={{
      flex: '1 1 0',
      minWidth: 0,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--color-text-tertiary)',
        fontWeight: 600,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
        fontSize: 26,
        fontWeight: 700,
        lineHeight: 1.1,
        color: valueColor ?? 'var(--color-text-primary)',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function StatStrip() {
  const stats = useMemo(() => {
    const total = mockReferrals.length;
    const active = mockReferrals.filter(r => r.status !== 'completed').length;
    const accepted = mockReferrals.filter(r =>
      r.status === 'accepted' || r.status === 'scheduled' || r.status === 'completed'
    ).length;
    const acceptRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    const revenueCents = mockReferrals.reduce((sum, r) => sum + r.episodeValueCents, 0);
    const atRisk = mockReferrals.filter(r => r.slaBreached).length;
    return { active, acceptRate, revenue: formatUSD(revenueCents), atRisk };
  }, []);

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      <StatCell label="Active Referrals" value={String(stats.active)} sub="In pipeline" />
      <StatCell label="Time to First Touch" value="2h 14m" sub="Median, last 30d" />
      <StatCell label="Accept Rate" value={`${stats.acceptRate}%`} sub="Of total intake" />
      <StatCell label="Revenue This Period" value={stats.revenue} sub="Episode value" />
      <StatCell
        label="At-Risk Referrals"
        value={String(stats.atRisk)}
        valueColor={stats.atRisk > 0 ? ROSE_700 : undefined}
        sub="SLA breached"
      />
    </div>
  );
}

// ─── CONTROLS BAR ─────────────────────────────────────────────────────────────

function TabPill({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active
          ? 'var(--color-primary)'
          : hover
          ? 'var(--color-primary-subtle)'
          : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '7px 16px',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        transition: 'background var(--duration-fast), color var(--duration-fast)',
      }}
    >
      {children}
    </button>
  );
}

function ViewToggleIcon({ kind, active }: { kind: ViewKey; active: boolean }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-tertiary)';
  if (kind === 'pipeline') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="5" height="16" rx="1.5" />
        <rect x="10" y="4" width="5" height="11" rx="1.5" />
        <rect x="17" y="4" width="4" height="7" rx="1.5" />
      </svg>
    );
  }
  if (kind === 'table') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M3 15h18" />
        <path d="M10 4v16" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </svg>
  );
}

function ControlsBar({
  activeTab,
  setActiveTab,
  activeView,
  setActiveView,
}: {
  activeTab: TabKey;
  setActiveTab: (k: TabKey) => void;
  activeView: ViewKey;
  setActiveView: (v: ViewKey) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      marginBottom: 20,
    }}>
      {/* Tab switcher */}
      <div style={{
        display: 'inline-flex',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-pill)',
        padding: 4,
        boxShadow: 'var(--shadow-card)',
        gap: 2,
      }}>
        <TabPill active={activeTab === 'active'}   onClick={() => setActiveTab('active')}>Active</TabPill>
        <TabPill active={activeTab === 'declined'} onClick={() => setActiveTab('declined')}>Declined</TabPill>
      </div>

      {/* View toggle */}
      <div style={{
        display: 'inline-flex',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-card)',
        padding: 4,
        gap: 2,
      }}>
        {(['pipeline', 'table', 'calendar'] as ViewKey[]).map(v => {
          const active = activeView === v;
          const disabled = v !== 'pipeline';
          return (
            <button
              key={v}
              onClick={() => { if (!disabled) setActiveView(v); }}
              title={v.charAt(0).toUpperCase() + v.slice(1)}
              style={{
                width: 32,
                height: 28,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? 'var(--color-primary-subtle)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.45 : 1,
              }}
            >
              <ViewToggleIcon kind={v} active={active} />
            </button>
          );
        })}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'inline-flex', gap: 8, marginLeft: 'auto' }}>
        {['Time', 'Source', 'Owner'].map(label => (
          <button
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 32,
              padding: '0 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border-strong)',
              background: 'white',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {label}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PIPELINE BOARD ───────────────────────────────────────────────────────────

function Bolt({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 3 14h7l-1 8 10-12h-7Z" />
    </svg>
  );
}

function TransitionBar({ actions }: { actions: string[] }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      padding: '10px 14px',
      borderBottom: '1px solid var(--color-border)',
    }}>
      {actions.map(a => (
        <span
          key={a}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Bolt size={10} />
          {a}
        </span>
      ))}
    </div>
  );
}

function getNextActionHint(referral: Referral): string | null {
  switch (referral.status) {
    case 'new':
      return `On move to In Review: send acknowledgment fax to ${referral.referringOrg}`;
    case 'in_review':
      return `On accept: auto-request F2F from ${referral.referringPhysician}`;
    case 'accepted':
      return 'On schedule: send POC for signature · request prior auth';
    default:
      return null;
  }
}

function ReferralCard({
  referral,
  onDecline,
  draggableProvided,
  isDragging = false,
}: {
  referral: Referral;
  onDecline?: (r: Referral) => void;
  draggableProvided?: DraggableProvided;
  isDragging?: boolean;
}) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const urgent = referral.slaBreached;
  const declinable = !!onDecline;

  const baseTransform = draggableProvided?.draggableProps?.style?.transform;
  const dragTransform = isDragging
    ? `${baseTransform ?? ''} rotate(1.5deg)`
    : baseTransform;

  return (
    <div
      ref={draggableProvided?.innerRef}
      {...(draggableProvided?.draggableProps ?? {})}
      {...(draggableProvided?.dragHandleProps ?? {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        if (isDragging) return;
        const target = e.target as HTMLElement;
        if (target.closest('[data-decline-btn]')) return;
        router.push(`/app/referrals/${referral.id}/thread`);
      }}
      style={{
        position: 'relative',
        ...(draggableProvided?.draggableProps?.style ?? {}),
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: isDragging
          ? 'var(--shadow-modal)'
          : hover
          ? 'var(--shadow-panel)'
          : 'var(--shadow-card)',
        padding: 14,
        textDecoration: 'none',
        color: 'inherit',
        cursor: isDragging ? 'grabbing' : 'pointer',
        border: urgent ? `2px solid ${ROSE_300}` : '2px solid transparent',
        transform: isDragging
          ? dragTransform
          : hover
          ? 'translateY(-1px)'
          : (draggableProvided?.draggableProps?.style?.transform ?? 'translateY(0)'),
        opacity: isDragging ? 0.95 : 1,
        transition: isDragging
          ? 'none'
          : 'transform var(--duration-fast), box-shadow var(--duration-fast)',
      }}
    >
      {declinable && (
        <button
          type="button"
          aria-label="Decline referral"
          data-decline-btn
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDecline?.(referral);
          }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: closeHover ? ROSE_50 : 'var(--color-border)',
            color: closeHover ? ROSE_700 : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            opacity: hover ? 1 : 0,
            transition: 'opacity var(--duration-fast), background var(--duration-fast), color var(--duration-fast)',
            zIndex: 2,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {referral.patientName}
        </div>
        {urgent ? (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span
              className="animate-pulse"
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: ROSE_400,
                boxShadow: `0 0 0 4px ${ROSE_50}`,
              }}
            />
          </span>
        ) : (
          <span style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            flexShrink: 0,
          }}>
            {formatUSD(referral.episodeValueCents)}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
      }}>
        {referral.mrn} · {referral.age}{referral.sex}
      </div>

      {/* Referring org */}
      <div style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-secondary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {referral.referringOrg}
      </div>

      {/* Doc tags */}
      {referral.docTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {referral.docTags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Next action hint */}
      {(() => {
        const hint = getNextActionHint(referral);
        if (!hint) return null;
        const accent = referral.slaBreached ? '#d97706' : '#0d9488';
        return (
          <div style={{
            border: `1.5px dashed ${accent}`,
            borderRadius: 'var(--radius-sm)',
            padding: '5px 8px',
            marginTop: 6,
          }}>
            <p style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 11,
              fontStyle: 'italic',
              color: accent,
              margin: 0,
              lineHeight: 1.4,
            }}>
              {hint}
            </p>
          </div>
        );
      })()}

      {/* Footer row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
      }}>
        <span
          title={referral.assignedTo.name}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'var(--color-surface-dark)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {referral.assignedTo.initials}
        </span>
        {referral.threadCount > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
            </svg>
            {referral.threadCount}
          </span>
        )}
      </div>
    </div>
  );
}

const DECLINABLE_STATUSES: ReferralStatus[] = ['new', 'in_review', 'accepted'];

function PipelineColumn({ column, cards, onDecline }: {
  column: { key: ReferralStatus; label: string; dotColor: string };
  cards: Referral[];
  onDecline: (r: Referral) => void;
}) {
  const canDecline = DECLINABLE_STATUSES.includes(column.key);
  const transitionActions = TRANSITION_BARS[column.key];
  return (
    <div style={{
      flex: '0 0 280px',
      minWidth: 280,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%',
    }}>
      {/* Column header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 14px 12px',
        borderBottom: transitionActions ? 'none' : '1px solid var(--color-border)',
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: column.dotColor,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {column.label}
        </span>
        <span style={{
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
        }}>
          {cards.length}
        </span>
      </div>

      {transitionActions && <TransitionBar actions={transitionActions} />}

      {/* Cards (droppable) */}
      <Droppable droppableId={column.key}>
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
                  <ReferralCard
                    referral={c}
                    onDecline={canDecline ? onDecline : undefined}
                    draggableProvided={draggableProvided}
                    isDragging={draggableSnapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
            {cards.length === 0 && !droppableSnapshot.isDraggingOver && (
              <div style={{
                padding: '20px 12px',
                textAlign: 'center',
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 12,
                color: 'var(--color-text-tertiary)',
              }}>
                No referrals
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function PipelineBoard({ referrals, onDecline, onDragEnd }: {
  referrals: Referral[];
  onDecline: (r: Referral) => void;
  onDragEnd: (result: DropResult) => void;
}) {
  const grouped = useMemo(() => {
    const map: Record<ReferralStatus, Referral[]> = {
      new: [], in_review: [], accepted: [], scheduled: [], completed: [],
    };
    referrals.forEach(r => map[r.status].push(r));
    return map;
  }, [referrals]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 8,
        alignItems: 'flex-start',
      }}>
        {COLUMNS.map(col => (
          <PipelineColumn
            key={col.key}
            column={col}
            cards={grouped[col.key]}
            onDecline={onDecline}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

// ─── DECLINED ARCHIVE ─────────────────────────────────────────────────────────

function DeclinedArchive({ declined }: { declined: DeclinedReferral[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        padding: '14px 20px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
      }}>
        {[
          { label: 'Decline Rate',        value: '12.5%' },
          { label: 'Top Reason',          value: 'Insurance not accepted' },
          { label: 'Courtesy Fax Rate',   value: '100%' },
          { label: 'Re-referral Rate',    value: '—' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-tertiary)',
              fontWeight: 600,
            }}>
              {item.label}
            </span>
            <span style={{
              fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1.4fr 1.4fr 1fr 0.8fr 0.8fr',
          padding: '12px 20px',
          background: 'var(--color-bg)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
          gap: 12,
        }}>
          <span>Patient</span>
          <span>MRN</span>
          <span>Referring Org</span>
          <span>Decline Reason</span>
          <span>Declined By</span>
          <span>Date</span>
          <span>Courtesy Fax</span>
        </div>
        {declined.map((r, idx) => (
          <div
            key={r.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1.4fr 1.4fr 1fr 0.8fr 0.8fr',
              padding: '14px 20px',
              gap: 12,
              alignItems: 'center',
              borderTop: idx === 0 ? 'none' : '1px solid var(--color-border)',
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 13,
              color: 'var(--color-text-secondary)',
            }}
          >
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{r.patientName}</span>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12 }}>{r.mrn}</span>
            <span>{r.referringOrg}</span>
            <span>{r.declineReason}</span>
            <span>{r.declinedBy}</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>{r.declinedAt}</span>
            <span>
              {r.courtesyFaxSent ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-delivered-bg)',
                  color: 'var(--color-delivered)',
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  <I.Check size={11} strokeWidth={2.6} /> Sent
                </span>
              ) : (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-tertiary)',
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  Not sent
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AUTOMATION STRIP ─────────────────────────────────────────────────────────

function AutomationStrip() {
  const activeAutomations = MOCK_AUTOMATIONS.filter(a => a.isActive);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: 'var(--color-primary-subtle)',
      borderRadius: 'var(--radius-lg)',
      marginTop: 16,
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
        whiteSpace: 'nowrap',
      }}>
        Active on this board:
      </span>

      {activeAutomations.map(automation => (
        <div key={automation.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '3px 10px',
        }}>
          <span
            className="animate-pulse"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#0d9488',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12,
            color: 'var(--color-text-primary)',
          }}>
            {automation.label}
          </span>
        </div>
      ))}

      <Link
        href="/app/settings?section=automations"
        style={{
          marginLeft: 'auto',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-primary)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Manage automations →
      </Link>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--color-text-primary)',
        color: 'white',
        padding: '12px 18px',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-modal)',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        color: 'white',
      }}>
        <I.Check size={11} strokeWidth={3} />
      </span>
      {message}
    </div>
  );
}

export default function ReferralsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [activeView, setActiveView] = useState<ViewKey>('pipeline');
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [declined, setDeclined] = useState<DeclinedReferral[]>(mockDeclinedReferrals);
  const [declineTarget, setDeclineTarget] = useState<Referral | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const commitStatusChange = (referralId: string, toStatus: ReferralStatus) => {
    setReferrals(prev =>
      prev.map(r => (r.id === referralId ? { ...r, status: toStatus } : r)),
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const fromStatus = source.droppableId as ReferralStatus;
    const toStatus = destination.droppableId as ReferralStatus;

    // Same column → reorder locally (grouped rendering reads encounter order)
    if (fromStatus === toStatus) {
      if (source.index === destination.index) return;
      setReferrals(prev => {
        const columnIds = prev.filter(r => r.status === fromStatus).map(r => r.id);
        const [movedId] = columnIds.splice(source.index, 1);
        columnIds.splice(destination.index, 0, movedId);

        const byId = new Map(prev.map(r => [r.id, r]));
        const reorderedColumn = columnIds.map(id => byId.get(id)!);

        let i = 0;
        return prev.map(r => (r.status === fromStatus ? reorderedColumn[i++] : r));
      });
      return;
    }

    const fromIndex = STAGE_ORDER.indexOf(fromStatus);
    const toIndex = STAGE_ORDER.indexOf(toStatus);

    // Backward moves: allow without confirmation
    if (toIndex < fromIndex) {
      commitStatusChange(draggableId, toStatus);
      return;
    }

    // Adjacent forward: allow without confirmation
    if (toIndex === fromIndex + 1) {
      commitStatusChange(draggableId, toStatus);
      return;
    }

    // Skipping forward: intercept with confirmation
    const skippedStages = STAGE_ORDER
      .slice(fromIndex + 1, toIndex)
      .map(s => STAGE_LABELS[s]);

    setPendingDrop({
      referralId: draggableId,
      fromStatus,
      toStatus,
      fromLabel: STAGE_LABELS[fromStatus],
      toLabel: STAGE_LABELS[toStatus],
      skippedStages,
    });
  };

  const handleDeclineConfirm = (reason: string, _notes: string) => {
    if (!declineTarget) return;

    setReferrals(prev => prev.filter(r => r.id !== declineTarget.id));

    setDeclined(prev => [{
      id: declineTarget.id,
      patientName: declineTarget.patientName,
      mrn: declineTarget.mrn,
      age: declineTarget.age,
      sex: declineTarget.sex,
      referringOrg: declineTarget.referringOrg,
      referringPhysician: declineTarget.referringPhysician,
      declineReason: reason,
      declinedBy: 'Amelia Park',
      declinedAt: 'Just now',
      courtesyFaxSent: true,
    }, ...prev]);

    setDeclineTarget(null);
    setToastMessage('Referral declined · Courtesy fax sent');
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      <PageHeader />
      <StatStrip />
      <ControlsBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      {activeTab === 'active'
        ? <PipelineBoard referrals={referrals} onDecline={setDeclineTarget} onDragEnd={handleDragEnd} />
        : <DeclinedArchive declined={declined} />}
      <AutomationStrip />

      {declineTarget && (
        <DeclineModal
          referral={declineTarget}
          onConfirm={handleDeclineConfirm}
          onClose={() => setDeclineTarget(null)}
        />
      )}

      {pendingDrop && (
        <SequentialAdvanceModal
          pendingDrop={pendingDrop}
          onCancel={() => setPendingDrop(null)}
          onConfirm={() => {
            commitStatusChange(pendingDrop.referralId, pendingDrop.toStatus);
            setToastMessage(`Advanced to ${pendingDrop.toLabel} · ${pendingDrop.skippedStages.length} stage${pendingDrop.skippedStages.length === 1 ? '' : 's'} skipped`);
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
