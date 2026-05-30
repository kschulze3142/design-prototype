'use client';

// =============================================================================
// InboxFilterBar — five-dropdown filter row for the clinical-results inbox.
// Provider is dataset-derived; doc tags and status come from the template;
// criticality and date preset are hardcoded vocabularies. Each select is a
// styled native <select> for keyboard accessibility and zero-dependency
// rendering — chip-shaped dropdowns elsewhere in the app are visual-only,
// but here we need the real dropdown behavior.
// =============================================================================

import type { ChangeEvent } from 'react';
import { titleCaseStatus } from '@/lib/components/formatters';

export type DatePreset = '__all__' | 'today' | '7d' | '30d';

type Props = {
  providers: string[];
  docTags: string[];
  statuses: string[];

  providerFilter: string;
  docTagFilter: string;
  datePreset: DatePreset;
  statusFilter: string;
  criticalityFilter: string;

  onProviderChange: (value: string) => void;
  onDocTagChange: (value: string) => void;
  onDatePresetChange: (value: DatePreset) => void;
  onStatusChange: (value: string) => void;
  onCriticalityChange: (value: string) => void;

  onClear: () => void;
  anyActive: boolean;
};

const ALL = '__all__';

const CRITICALITY_OPTIONS = ['normal', 'borderline', 'critical'] as const;

const DATE_OPTIONS: { value: DatePreset; label: string }[] = [
  { value: '__all__', label: 'All dates' },
  { value: 'today',   label: 'Today' },
  { value: '7d',      label: 'Last 7 days' },
  { value: '30d',     label: 'Last 30 days' },
];

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const handle = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value);
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 12px 0 14px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--color-border-strong)',
        background: 'white',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
      }}>
        {label}
      </span>
      <select
        value={value}
        onChange={handle}
        style={{
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          paddingRight: 14,
          backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'m6 9 6 6 6-6\'/></svg>")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          outline: 'none',
        }}
      >
        {children}
      </select>
    </label>
  );
}

export function InboxFilterBar(props: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 16,
      }}
    >
      <FilterSelect label="Provider" value={props.providerFilter} onChange={props.onProviderChange}>
        <option value={ALL}>All providers</option>
        {props.providers.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </FilterSelect>

      <FilterSelect label="Doc tag" value={props.docTagFilter} onChange={props.onDocTagChange}>
        <option value={ALL}>All tags</option>
        {props.docTags.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        label="Date"
        value={props.datePreset}
        onChange={v => props.onDatePresetChange(v as DatePreset)}
      >
        {DATE_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </FilterSelect>

      <FilterSelect label="Status" value={props.statusFilter} onChange={props.onStatusChange}>
        <option value={ALL}>All statuses</option>
        {props.statuses.map(s => (
          <option key={s} value={s}>{titleCaseStatus(s)}</option>
        ))}
      </FilterSelect>

      <FilterSelect label="Criticality" value={props.criticalityFilter} onChange={props.onCriticalityChange}>
        <option value={ALL}>All criticalities</option>
        {CRITICALITY_OPTIONS.map(c => (
          <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
        ))}
      </FilterSelect>

      {props.anyActive && (
        <button
          type="button"
          onClick={props.onClear}
          style={{
            marginLeft: 'auto',
            height: 32,
            padding: '0 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
