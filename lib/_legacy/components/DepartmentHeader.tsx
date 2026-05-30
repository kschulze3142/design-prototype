'use client';

import { useMemo, type ReactNode } from 'react';
import {
  useTemplate,
  useWorkItemsByDepartment,
} from '@/lib/mockSystem/hooks';
import type { DepartmentType } from '@/lib/mockSystem/types';

type Props = {
  type: DepartmentType;
  actions?: ReactNode;
};

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

const descriptionStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 14,
  color: 'var(--color-text-secondary)',
  margin: 0,
  marginTop: 6,
};

const countsStyle: React.CSSProperties = {
  fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
  fontSize: 12,
  color: 'var(--color-text-tertiary)',
  margin: 0,
  marginTop: 4,
};

export function DepartmentHeader({ type, actions }: Props) {
  const template = useTemplate(type);
  const items = useWorkItemsByDepartment(type);

  const openCount = useMemo(
    () => items.filter(i => !template.terminalStatuses.includes(i.status)).length,
    [items, template.terminalStatuses],
  );

  return (
    <header
      style={{
        marginBottom: 20,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div>
        <p style={overlineStyle}>{template.category.toUpperCase()}</p>
        <h1 style={headlineStyle}>{template.name}</h1>
        <p style={descriptionStyle}>{template.description}</p>
        <p style={countsStyle}>
          {openCount} open · {items.length} total
        </p>
      </div>
      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'center',
          }}
        >
          {actions}
        </div>
      )}
    </header>
  );
}
