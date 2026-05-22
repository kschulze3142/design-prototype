// =============================================================================
// Shared formatting utilities for template-driven metadata fields.
//
// Used by both WorkItemCard (queue/list/compact variants) and ThreadView's
// RightRail metadata box. Keeping the formatters in one place ensures the
// card and the rail agree on currency, date, and pill formatting.
// =============================================================================

import type { CSSProperties } from 'react';
import type { MetadataFieldDescriptor, UrgencyLevel } from '@/lib/mockSystem/types';
import { Pill } from '@/components/app/primitives';

export type { UrgencyLevel };

// Normalize the loose return type of `MetadataFieldDescriptor.urgentWhen`
// (UrgencyLevel | boolean | undefined) into a strict UrgencyLevel.
// Boolean returns from legacy two-state descriptors map to urgent/null.
export function normalizeUrgency(
  result: UrgencyLevel | boolean | undefined,
): UrgencyLevel {
  if (result === true) return 'urgent';
  if (result === false || result == null) return null;
  return result;
}

// Single source of truth for urgency-tier text styling. Both FieldRow
// (pipeline variant) and WorkItemCard's list variant call this so the
// red/amber/normal palette stays consistent across density variants.
export function urgencyStyle(level: UrgencyLevel): { color: string; fontWeight: number } {
  if (level === 'urgent') return { color: 'var(--color-failed)', fontWeight: 600 };
  if (level === 'warning') return { color: 'var(--color-review)', fontWeight: 500 };
  return { color: 'var(--color-text-secondary)', fontWeight: 500 };
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.length === 0) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

export function formatCurrencyCents(cents: number): string {
  const dollars = Math.round(cents / 100);
  return `$${dollars.toLocaleString('en-US')}`;
}

export function formatRelative(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const minutes = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  const past = ms < 0;
  let body: string;
  if (minutes < 60) body = `${minutes}m`;
  else if (hours < 48) body = `${hours}h`;
  else body = `${days}d`;
  return past ? `${body} ago` : `in ${body}`;
}

export function formatValue(value: unknown, format: MetadataFieldDescriptor['format']): string {
  if (format === 'currency' && typeof value === 'number') {
    return formatCurrencyCents(value);
  }
  if (format === 'date' && typeof value === 'string') {
    return formatRelative(value);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '';
  return String(value);
}

// Render a status string like "in_review" or "action_required" as
// "In Review" / "Action Required" for display. Used for the lifecycle
// tracker, off-pipeline caption, and status_change bubble labels.
export function titleCaseStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// -----------------------------------------------------------------------------
// FieldRow — label · value pair, with pill rendering for `format: 'pill'` and
// urgent styling when descriptor.urgentWhen() returns true.
// -----------------------------------------------------------------------------

const fieldRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
  minWidth: 0,
};

const fieldLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-tertiary)',
  fontWeight: 600,
  flexShrink: 0,
  minWidth: 88,
};

export function FieldRow({ descriptor, value }: { descriptor: MetadataFieldDescriptor; value: unknown }) {
  const formatted = formatValue(value, descriptor.format);
  const urgency = normalizeUrgency(descriptor.urgentWhen?.(value));
  const { color, fontWeight } = urgencyStyle(urgency);

  if (descriptor.format === 'pill') {
    const tokens = Array.isArray(value) ? value : [value];
    const visible = tokens.filter(t => !isEmpty(t));
    if (visible.length === 0) return null;
    return (
      <div style={fieldRowStyle}>
        <span style={fieldLabelStyle}>{descriptor.label}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {visible.map((t, i) => (
            <Pill key={i} tone="slate" dot={false}>
              {String(t)}
            </Pill>
          ))}
        </div>
      </div>
    );
  }

  // Non-urgent text in FieldRow uses text-primary historically; only the
  // urgent/warning tiers consult urgencyStyle. Keeps the pipeline-card
  // baseline crisp while letting the tracker's list variant share the
  // urgent/amber palette.
  const isUrgent = urgency !== null;
  return (
    <div style={fieldRowStyle}>
      <span style={fieldLabelStyle}>{descriptor.label}</span>
      <span style={{
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12.5,
        color: isUrgent ? color : 'var(--color-text-primary)',
        fontWeight: isUrgent ? fontWeight : 500,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {formatted}
      </span>
    </div>
  );
}
