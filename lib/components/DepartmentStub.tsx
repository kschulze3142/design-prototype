'use client';

import { useMemo } from 'react';
import { Card } from '@/components/app/primitives';
import { DepartmentHeader } from './DepartmentHeader';
import { WorkItemCard } from './WorkItemCard';
import { useWorkItemsByDepartment } from '@/lib/mockSystem/hooks';
import type { DepartmentType } from '@/lib/mockSystem/types';

type Props = {
  type: DepartmentType;
  layoutName: string;
  ticketId: string;
};

const MAX_ROWS = 5;

export function DepartmentStub({ type, layoutName, ticketId }: Props) {
  const items = useWorkItemsByDepartment(type);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [items],
  );

  const visibleItems = sortedItems.slice(0, MAX_ROWS);
  const hiddenCount = Math.max(0, sortedItems.length - MAX_ROWS);

  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <DepartmentHeader type={type} />

      <Card className="p-6">
        <div style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 4,
        }}>
          {layoutName} view — coming in {ticketId}
        </div>
        <div style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          marginBottom: 16,
        }}>
          The dispatcher is live; the real {layoutName.toLowerCase()} UI lands with {ticketId}.
          Recent items below confirm the data layer is flowing.
        </div>

        {items.length === 0 ? (
          <div style={{
            padding: '20px 0',
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 13,
            color: 'var(--color-text-tertiary)',
          }}>
            No items in this department yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleItems.map(item => (
              <WorkItemCard
                key={item.id}
                workItem={item}
                variant="compact"
                href={
                  type === 'referrals'
                    ? `/app/referrals/${item.id}/thread`
                    : `/app/departments/${type}/${item.id}/thread`
                }
              />
            ))}
            {hiddenCount > 0 && (
              <div style={{
                paddingTop: 4,
                fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                fontSize: 12,
                color: 'var(--color-text-tertiary)',
              }}>
                +{hiddenCount} more
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
