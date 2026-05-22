'use client';

// =============================================================================
// ReferralPipelineCard — referrals-specific kanban card.
//
// Per FE-054 Decision G-prime/α, this is a dedicated card that mirrors the
// Phase 8 ReferralCard verbatim rather than extending the generic
// WorkItemCard. The Phase 8 card and the WorkItemCard pipeline variant
// diverge in three regions (header right, body middle, footer right);
// composing them through slot props would dilute WorkItemCard for the
// other variants (compact / list) that DepartmentStub and RightRail rely on.
//
// Layout (top → bottom):
//   - Absolute ✕ button (top-right, hover-fade), iff declinable
//   - Header: patient name (left) + urgency dot OR formatted $ value
//   - Meta line: MRN · age · sex
//   - Referring org line
//   - Doc tag pills
//   - NextActionHint dashed-border block (status-keyed, interpolated)
//   - Footer: assignee initials (left) + thread-count chiclet (right)
//
// Drag wiring:
//   - Root spreads draggableProps + dragHandleProps (the whole card is the
//     drag handle, matching Phase 8).
//   - onClick navigates to the generic thread route, but only when not
//     dragging and the ✕ button isn't the target.
// =============================================================================

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { formatCurrencyCents } from '@/lib/components/formatters';
import { usePatient, useUser } from '@/lib/mockSystem/hooks';
import type { WorkItem } from '@/lib/mockSystem/types';
import {
  DECLINABLE_STATUSES,
  REFERRALS_NEXT_ACTION_HINT,
  ROSE,
} from './visualConstants';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

type Props = {
  item: ReferralWorkItem;
  threadCount: number;
  // Whether this department supports decline at all (passed from the
  // orchestrator after reading template.supportsDecline). Defense in
  // depth — combined with the per-status DECLINABLE_STATUSES gate, this
  // means the ✕ never renders when the template forbids decline.
  supportsDecline: boolean;
  onDecline: (item: ReferralWorkItem) => void;
  draggableProvided: DraggableProvided;
  isDragging: boolean;
  isDropAnimating: boolean;
};

function UrgencyDot() {
  return (
    <span
      className="animate-pulse"
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: ROSE.R400,
        boxShadow: `0 0 0 4px ${ROSE.R50}`,
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}

function ThreadChiclet({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--color-text-tertiary)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
      {count}
    </span>
  );
}

function interpolateHint(
  template: string,
  item: ReferralWorkItem,
): string {
  return template
    .replace(/\{referringOrg\}/g, item.metadata.referringOrg)
    .replace(/\{referringProvider\}/g, item.metadata.referringProvider);
}

export function ReferralPipelineCard({
  item,
  threadCount,
  supportsDecline,
  onDecline,
  draggableProvided,
  isDragging,
  isDropAnimating,
}: Props) {
  const router = useRouter();
  const patient = usePatient(item.patientId);
  const assignee = useUser(item.assignedTo);
  const [hover, setHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  const urgent = item.slaBreached;
  const declinable = supportsDecline && DECLINABLE_STATUSES.has(item.status);
  const patientName = patient?.name ?? 'Unknown patient';
  const assigneeInitials = assignee
    ? assignee.name
        .split(/\s+/)
        .map(p => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '—';

  const hintTemplate = REFERRALS_NEXT_ACTION_HINT[item.status];
  const nextHint = hintTemplate ? interpolateHint(hintTemplate, item) : null;

  const baseTransform = draggableProvided.draggableProps?.style?.transform;
  const dragTransform = isDragging
    ? `${baseTransform ?? ''} rotate(1.5deg)`
    : baseTransform;

  return (
    <div
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
      {...(draggableProvided.dragHandleProps ?? {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        if (isDragging) return;
        const target = e.target as HTMLElement;
        if (target.closest('[data-decline-btn]')) return;
        router.push(`/app/departments/referrals/items/${item.id}/thread`);
      }}
      style={{
        position: 'relative',
        ...(draggableProvided.draggableProps?.style ?? {}),
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
        border: urgent ? `2px solid ${ROSE.R300}` : '2px solid transparent',
        transform: isDragging
          ? dragTransform
          : hover
          ? 'translateY(-1px)'
          : (draggableProvided.draggableProps?.style?.transform ?? 'none'),
        opacity: isDragging ? 0.95 : 1,
        transitionDuration: isDropAnimating ? '0.001s' : undefined,
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
            onDecline(item);
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
            background: closeHover ? ROSE.R50 : 'var(--color-border)',
            color: closeHover ? ROSE.R700 : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            opacity: hover ? 1 : 0,
            transition:
              'opacity var(--duration-fast), background var(--duration-fast), color var(--duration-fast)',
            zIndex: 2,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div
          style={{
            fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {patientName}
        </div>
        {urgent ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <UrgencyDot />
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              flexShrink: 0,
            }}
          >
            {formatCurrencyCents(item.metadata.episodeValueCents)}
          </span>
        )}
      </div>

      {/* Meta row */}
      {patient && (
        <div
          style={{
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12,
            color: 'var(--color-text-tertiary)',
          }}
        >
          {patient.mrn} · {patient.age}{patient.sex}
        </div>
      )}

      {/* Referring org */}
      <div
        style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.metadata.referringOrg}
      </div>

      {/* Doc tags */}
      {item.docTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {item.docTags.map(tag => (
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
      {nextHint && (() => {
        const accent = urgent ? '#d97706' : '#0d9488';
        return (
          <div
            style={{
              border: `1.5px dashed ${accent}`,
              borderRadius: 'var(--radius-sm)',
              padding: '5px 8px',
              marginTop: 6,
            }}
          >
            <p
              style={{
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 11,
                fontStyle: 'italic',
                color: accent,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {nextHint}
            </p>
          </div>
        );
      })()}

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <span
          title={assignee?.name ?? undefined}
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
          {assigneeInitials}
        </span>
        <ThreadChiclet count={threadCount} />
      </div>
    </div>
  );
}
