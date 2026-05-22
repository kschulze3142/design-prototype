'use client';

// =============================================================================
// InboxList — left pane of the inbox layout. Renders a vertical scroll of
// WorkItemCard variant='list' rows with selection wiring. Filtering and sort
// happen upstream in InboxPage; this component just maps the array.
// =============================================================================

import { WorkItemCard } from '@/lib/components/WorkItemCard';
import type { WorkItem } from '@/lib/mockSystem/types';

type Props = {
  items: WorkItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
};

export function InboxList({ items, selectedId, onSelect, onClearFilters, hasActiveFilters }: Props) {
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: 'var(--color-text-tertiary)',
        }}
      >
        {hasActiveFilters ? (
          <>
            <p style={{ margin: 0, marginBottom: 12 }}>No results match these filters.</p>
            <button
              type="button"
              onClick={onClearFilters}
              style={{
                height: 32,
                padding: '0 14px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border-strong)',
                background: 'white',
                color: 'var(--color-primary)',
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          </>
        ) : (
          <p style={{ margin: 0, fontStyle: 'italic' }}>No results received.</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(item => (
        <WorkItemCard
          key={item.id}
          workItem={item}
          variant="list"
          // href is kept for prop-shape compatibility; onSelect suppresses it.
          href={`/app/departments/${item.departmentType}/items/${item.id}/thread`}
          selected={item.id === selectedId}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}
