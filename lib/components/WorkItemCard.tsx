'use client';

// =============================================================================
// WorkItemCard — generic, template-driven card for any department's work items.
//
// Three density variants:
//   - pipeline: full card with header, meta, doc tags, all metadata fields, footer
//   - list:     single-row horizontal layout, first 2 metadata fields
//   - compact:  two-line minimal, first 1 metadata field
//
// Template ownership: the card reads `template.statusTones` for the status pill
// tone and `template.metadataFields` to drive which fields render in what order.
// Templates author with most-important field first; list/compact take the
// first N by descriptor order.
//
// Boundary cast: WorkItem.metadata is a discriminated union and the descriptor
// `key` is `string`, so we cast to Record<string, unknown> once at the lookup
// point and format defensively from there.
// =============================================================================

import { useMemo, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Pill } from '@/components/app/primitives';
import {
  usePatient,
  useTemplate,
  useUser,
} from '@/lib/mockSystem/hooks';
import type {
  PillTone,
  WorkItem,
} from '@/lib/mockSystem/types';
import { FieldRow, formatRelative, formatValue, isEmpty, normalizeUrgency, urgencyStyle } from './formatters';

type Variant = 'pipeline' | 'list' | 'compact';

type Props = {
  workItem: WorkItem;
  variant: Variant;
  href: string;
  // List variant only — when set, click invokes onSelect instead of
  // navigating, and `selected` drives a primary-ring + panel-shadow
  // affordance. Inbox layouts use this for in-pane selection.
  selected?: boolean;
  onSelect?: () => void;
};

const ROSE_300 = '#fda4af';
const ROSE_400 = '#fb7185';
const ROSE_50 = '#fff1f2';

// -----------------------------------------------------------------------------
// Value helpers
// -----------------------------------------------------------------------------

function getMetadataValue(item: WorkItem, key: string): unknown {
  return (item.metadata as Record<string, unknown>)[key];
}

function resolveTone(tone: PillTone | undefined): PillTone {
  return tone ?? 'slate';
}

// -----------------------------------------------------------------------------
// Inline pulse-dot for SLA-breach urgency. Phase 8 inlines this same shape;
// single-consumer, not worth growing icons.tsx.
// -----------------------------------------------------------------------------

function UrgencyDot() {
  return (
    <span className="animate-pulse" style={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: ROSE_400,
      boxShadow: `0 0 0 4px ${ROSE_50}`,
      display: 'inline-block',
      flexShrink: 0,
    }} />
  );
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export function WorkItemCard({ workItem, variant, href, selected = false, onSelect }: Props) {
  const router = useRouter();
  const template = useTemplate(workItem.departmentType);
  const patient = usePatient(workItem.patientId);
  const assignee = useUser(workItem.assignedTo);
  const [hover, setHover] = useState(false);

  const visibleFields = useMemo(() => {
    if (variant === 'pipeline') return template.metadataFields;
    if (variant === 'list') return template.metadataFields.slice(0, 2);
    return template.metadataFields.slice(0, 1);
  }, [template.metadataFields, variant]);

  const tone = resolveTone(template.statusTones[workItem.status]);
  const urgent = workItem.slaBreached;
  const patientName = patient?.name ?? 'Unknown patient';
  const timestamp = formatRelative(workItem.updatedAt);

  const handleClick = onSelect ?? (() => router.push(href));

  const handleClaim = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Claim wiring deferred to a later ticket. FE-054 took the dedicated-
    // card path (Decision G-prime/α) and does not exercise this branch.
  };

  if (variant === 'compact') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '10px 12px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: hover ? 'var(--shadow-panel)' : 'var(--shadow-card)',
          border: urgent ? `2px solid ${ROSE_300}` : '2px solid transparent',
          cursor: 'pointer',
          transition: 'box-shadow var(--duration-fast), transform var(--duration-fast)',
          transform: hover ? 'translateY(-1px)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={titleStyle}>{patientName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {urgent && <UrgencyDot />}
            <Pill tone={tone}>{workItem.status.replace(/_/g, ' ')}</Pill>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {visibleFields[0] ? (
            <span style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}>
              {formatValue(getMetadataValue(workItem, visibleFields[0].key), visibleFields[0].format)}
            </span>
          ) : <span />}
          <span style={timestampStyle}>{timestamp}</span>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    // Selection ring wins over urgent ring — inbox in-pane selection is the
    // strongest signal the user controls. Hover and selected both promote
    // shadow to panel so the row visually "lifts."
    const borderColor = selected
      ? 'var(--color-primary)'
      : urgent
        ? ROSE_300
        : 'transparent';
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 14px',
          background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: selected || hover ? 'var(--shadow-panel)' : 'var(--shadow-card)',
          border: `2px solid ${borderColor}`,
          cursor: 'pointer',
          transition: 'box-shadow var(--duration-fast), background var(--duration-fast)',
        }}
      >
        <span style={{ ...titleStyle, flex: '0 0 auto', minWidth: 140 }}>{patientName}</span>
        <span style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 12,
          color: 'var(--color-text-tertiary)',
          flex: '0 0 auto',
        }}>
          {patient?.mrn ?? '—'}
        </span>
        {urgent && <UrgencyDot />}
        <Pill tone={tone}>{workItem.status.replace(/_/g, ' ')}</Pill>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 auto', minWidth: 0 }}>
          {visibleFields.map(descriptor => {
            const value = getMetadataValue(workItem, descriptor.key);
            if (isEmpty(value)) return null;
            const urgency = normalizeUrgency(descriptor.urgentWhen?.(value));
            const { color, fontWeight } = urgencyStyle(urgency);
            return (
              <span
                key={descriptor.key}
                style={{
                  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                  fontSize: 12.5,
                  color,
                  fontWeight,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}
              >
                {formatValue(value, descriptor.format)}
              </span>
            );
          })}
        </div>
        <AssigneeBadge assignee={assignee} onClaim={handleClaim} compact />
        <span style={{ ...timestampStyle, flex: '0 0 auto' }}>{timestamp}</span>
      </div>
    );
  }

  // pipeline
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 14,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: hover ? 'var(--shadow-panel)' : 'var(--shadow-card)',
        border: urgent ? `2px solid ${ROSE_300}` : '2px solid transparent',
        cursor: 'pointer',
        transition: 'box-shadow var(--duration-fast), transform var(--duration-fast)',
        transform: hover ? 'translateY(-1px)' : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={titleStyle}>{patientName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {urgent && <UrgencyDot />}
          <Pill tone={tone}>{workItem.status.replace(/_/g, ' ')}</Pill>
        </div>
      </div>

      {/* Meta */}
      {patient && (
        <div style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-tertiary)',
        }}>
          {patient.mrn} · {patient.age}{patient.sex}
        </div>
      )}

      {/* Doc tags */}
      {workItem.docTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {workItem.docTags.map(tag => (
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

      {/* Template-driven metadata */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
        {visibleFields.map(descriptor => {
          const value = getMetadataValue(workItem, descriptor.key);
          if (isEmpty(value)) return null;
          // Explicit context='card' — card-density variants never opt in to
          // featured rendering, even if a future template flags an early
          // field as featured.
          return <FieldRow key={descriptor.key} descriptor={descriptor} value={value} context="card" />;
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingTop: 8,
        borderTop: '1px solid var(--color-border)',
      }}>
        <AssigneeBadge assignee={assignee} onClaim={handleClaim} />
        <span style={timestampStyle}>{timestamp}</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Assignee badge / claim button
// -----------------------------------------------------------------------------

function AssigneeBadge({
  assignee,
  onClaim,
  compact = false,
}: {
  assignee: { name: string } | null;
  onClaim: (e: MouseEvent<HTMLButtonElement>) => void;
  compact?: boolean;
}) {
  if (!assignee) {
    return (
      <button
        type="button"
        onClick={onClaim}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          height: compact ? 22 : 26,
          padding: '0 10px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--color-primary-subtle)',
          color: 'var(--color-primary)',
          border: 'none',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 11.5,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Claim
      </button>
    );
  }
  const initials = assignee.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  const size = compact ? 22 : 24;
  return (
    <span
      title={assignee.name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-surface-dark)',
        color: 'white',
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Shared styles
// -----------------------------------------------------------------------------

const titleStyle: React.CSSProperties = {
  fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
};

const timestampStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 11,
  color: 'var(--color-text-tertiary)',
  flexShrink: 0,
};
