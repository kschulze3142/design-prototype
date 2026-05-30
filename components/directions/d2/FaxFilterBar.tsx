// d2 FaxFilterBar — the in-app filter/sort affordance, Mercury "quiet minimal".
// Built fresh for d2 (the legacy app's FaxFilterBar is NOT imported). Stateless
// and fully controlled by the parent; reads no data of its own.
'use client';

import type { CSSProperties } from 'react';
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';
import { space as u } from './primitives';
import type { FaxStatus } from '@/lib/designMock';

export type DirectionFilter = 'all' | 'inbound' | 'outbound';
export type StatusFilter = 'all' | FaxStatus;
export type SortOrder = 'newest' | 'oldest';

const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'received', label: 'Received' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'sending', label: 'Sending' },
  { value: 'failed', label: 'Failed' },
];

/** One quiet segmented control. Active segment gets the restrained accent wash. */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: u(0.7) }}>
      <span
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--rd-color-text-muted)',
        }}
      >
        {label}
      </span>
      <div
        role="group"
        aria-label={label}
        style={{
          display: 'inline-flex',
          gap: u(0.4),
          padding: u(0.4),
          background: 'var(--rd-color-bg-tint)',
          border: '1px solid var(--rd-color-border)',
          borderRadius: 'var(--rd-radius-md)',
        }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          const css: CSSProperties = {
            appearance: 'none',
            border: 'none',
            cursor: 'pointer',
            paddingInline: u(1.4),
            height: u(3.6),
            borderRadius: 'var(--rd-radius-sm)',
            fontSize: '0.82rem',
            fontWeight: active ? 600 : 500,
            fontFamily: 'var(--rd-font-body)',
            color: active ? 'var(--rd-color-accent)' : 'var(--rd-color-text-muted)',
            background: active ? 'var(--rd-color-surface)' : 'transparent',
            boxShadow: active ? 'var(--rd-shadow-sm)' : 'none',
            transition: 'color 120ms ease, background 120ms ease',
          };
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              style={css}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  direction: DirectionFilter;
  status: StatusFilter;
  sort: SortOrder;
  onDirectionChange: (v: DirectionFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSortChange: (v: SortOrder) => void;
}

export function FaxFilterBar({
  direction,
  status,
  sort,
  onDirectionChange,
  onStatusChange,
  onSortChange,
}: Props) {
  const SortIcon = sort === 'newest' ? ArrowDownNarrowWide : ArrowUpWideNarrow;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: u(2.5),
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: u(2.5) }}>
        <Segmented
          label="Direction"
          value={direction}
          options={DIRECTION_OPTIONS}
          onChange={onDirectionChange}
        />
        <Segmented label="Status" value={status} options={STATUS_OPTIONS} onChange={onStatusChange} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: u(0.7) }}>
        <span
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--rd-color-text-muted)',
          }}
        >
          Sort
        </span>
        <button
          type="button"
          onClick={() => onSortChange(sort === 'newest' ? 'oldest' : 'newest')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: u(0.8),
            height: u(4.4),
            paddingInline: u(1.6),
            background: 'var(--rd-color-surface)',
            border: '1px solid var(--rd-color-border)',
            borderRadius: 'var(--rd-radius-md)',
            fontSize: '0.82rem',
            fontWeight: 500,
            fontFamily: 'var(--rd-font-body)',
            color: 'var(--rd-color-text)',
            cursor: 'pointer',
          }}
        >
          <SortIcon size={15} strokeWidth={2} color="var(--rd-color-text-muted)" />
          {sort === 'newest' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>
    </div>
  );
}
