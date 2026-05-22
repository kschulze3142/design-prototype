// =============================================================================
// Shared formatting utilities for template-driven metadata fields.
//
// Used by both WorkItemCard (queue/list/compact variants) and ThreadView's
// RightRail metadata box. Keeping the formatters in one place ensures the
// card and the rail agree on currency, date, and pill formatting.
// =============================================================================

import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import type { MetadataFieldDescriptor, PillTone, UrgencyLevel } from '@/lib/mockSystem/types';
import { Pill } from '@/components/app/primitives';
import { I } from '@/components/app/icons';

// Surface hint passed in by callers that need richer rendering. 'rail' opts
// in to featured-field treatment (larger value + copy button) used by
// ThreadView's right rail. 'card' (or omitted) keeps the compact card-row
// rendering used by WorkItemCard's pipeline variant.
export type FieldRowContext = 'rail' | 'card';

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

export function FieldRow({
  descriptor,
  value,
  context,
}: {
  descriptor: MetadataFieldDescriptor;
  value: unknown;
  context?: FieldRowContext;
}) {
  const formatted = formatValue(value, descriptor.format);
  const urgency = normalizeUrgency(descriptor.urgentWhen?.(value));
  const { color, fontWeight } = urgencyStyle(urgency);

  if (descriptor.format === 'pill') {
    const tokens = Array.isArray(value) ? value : [value];
    const visible = tokens.filter(t => !isEmpty(t));
    if (visible.length === 0) return null;
    // urgentWhen drives pill tone for the descriptor as a whole (e.g.
    // criticality 'critical'→red, 'borderline'→amber). When urgentWhen is
    // absent or returns null, every chip stays slate — matches the FE-058
    // baseline for non-urgent pill descriptors (services, cptCodes, etc.).
    const tone: PillTone =
      urgency === 'urgent'  ? 'red'   :
      urgency === 'warning' ? 'amber' :
      'slate';
    return (
      <div style={fieldRowStyle}>
        <span style={fieldLabelStyle}>{descriptor.label}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {visible.map((t, i) => (
            <Pill key={i} tone={tone} dot={false}>
              {String(t)}
            </Pill>
          ))}
        </div>
      </div>
    );
  }

  if (context === 'rail' && descriptor.featured && !isEmpty(value)) {
    return <FeaturedFieldRow label={descriptor.label} value={formatted} />;
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

// Featured field — label above, larger value with inline copy button.
// Only used when context='rail' AND descriptor.featured AND value present.
function FeaturedFieldRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  // Cancel the revert-to-clipboard-icon timer if the row unmounts mid-window
  // (route change while the checkmark is still showing).
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(
        () => setCopied(true),
        () => { /* clipboard refused — silent per Decision D */ },
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          letterSpacing: '0.01em',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {value}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : `Copy ${label}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            border: 'none',
            color: copied ? 'var(--color-success, #0d9488)' : 'var(--color-text-tertiary)',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
            transition: 'color var(--duration-fast)',
          }}
        >
          {copied
            ? <I.Check size={14} strokeWidth={2.2} />
            : <I.Copy size={14} strokeWidth={1.8} />}
        </button>
      </div>
    </div>
  );
}
