'use client';

// =============================================================================
// AutomationStrip — indigo-subtle row beneath the board listing the
// active automation rules for this department, with a deep link to the
// settings page. Reads via useAutomations(type) and filters .enabled.
// =============================================================================

import Link from 'next/link';
import { useAutomations } from '@/lib/mockSystem/hooks';
import type { DepartmentType } from '@/lib/mockSystem/types';

type Props = { type: DepartmentType };

export function AutomationStrip({ type }: Props) {
  const automations = useAutomations(type);
  const active = automations.filter(a => a.enabled);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'var(--color-primary-subtle)',
        borderRadius: 'var(--radius-lg)',
        marginTop: 16,
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-text-tertiary)',
          whiteSpace: 'nowrap',
        }}
      >
        Active on this board:
      </span>

      {active.map(automation => (
        <div
          key={automation.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 10px',
          }}
        >
          <span
            className="animate-pulse"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#0d9488',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 12,
              color: 'var(--color-text-primary)',
            }}
          >
            {automation.name}
          </span>
        </div>
      ))}

      <Link
        href="/app/settings?section=automations"
        style={{
          marginLeft: 'auto',
          fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
          fontSize: 12,
          color: 'var(--color-primary)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Manage automations →
      </Link>
    </div>
  );
}
