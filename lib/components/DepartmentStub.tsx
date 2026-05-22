'use client';

import { useMemo } from 'react';
import { Card } from '@/components/app/primitives';
import {
  usePatients,
  useTemplate,
  useWorkItemsByDepartment,
} from '@/lib/mockSystem/hooks';
import type { DepartmentType } from '@/lib/mockSystem/types';

type Props = {
  type: DepartmentType;
  layoutName: string;
  ticketId: string;
};

const MAX_ROWS = 5;

const overlineStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, var(--font-mono), monospace',
  fontSize: 11,
  color: 'var(--color-text-tertiary)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 600,
  margin: 0,
  marginBottom: 6,
};

const headlineStyle: React.CSSProperties = {
  fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
  fontWeight: 700,
  fontSize: 30,
  color: 'var(--color-text-primary)',
  margin: 0,
  lineHeight: 1.15,
};

const sublineStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 14,
  color: 'var(--color-text-secondary)',
  margin: 0,
  marginTop: 6,
};

export function DepartmentStub({ type, layoutName, ticketId }: Props) {
  const template = useTemplate(type);
  const items = useWorkItemsByDepartment(type);
  const patients = usePatients();

  const patientNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of patients) m.set(p.id, p.name);
    return m;
  }, [patients]);

  const { openCount, sortedItems } = useMemo(() => {
    const open = items.filter(i => !template.terminalStatuses.includes(i.status));
    const sorted = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return { openCount: open.length, sortedItems: sorted };
  }, [items, template.terminalStatuses]);

  const visibleItems = sortedItems.slice(0, MAX_ROWS);
  const hiddenCount = Math.max(0, sortedItems.length - MAX_ROWS);

  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <header style={{ marginBottom: 20 }}>
        <p style={overlineStyle}>DEPARTMENT</p>
        <h1 style={headlineStyle}>{template.name}</h1>
        <p style={sublineStyle}>
          {openCount} open · {items.length} total
        </p>
      </header>

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
          <div style={{
            borderTop: '1px solid var(--color-border)',
          }}>
            {visibleItems.map(item => {
              const isTerminal = template.terminalStatuses.includes(item.status);
              const name = patientNameById.get(item.patientId) ?? 'Unknown patient';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {name}
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-pill)',
                    background: isTerminal ? 'var(--color-bg)' : 'var(--color-primary-subtle)',
                    color: isTerminal ? 'var(--color-text-tertiary)' : 'var(--color-primary)',
                    fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {item.status}
                  </span>
                </div>
              );
            })}
            {hiddenCount > 0 && (
              <div style={{
                padding: '10px 0',
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
