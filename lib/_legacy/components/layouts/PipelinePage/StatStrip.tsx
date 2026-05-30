'use client';

// =============================================================================
// StatStrip — 5-cell summary row above the kanban.
//
// Per FE-054 Decision I2, stats derive from the live `items` slice rather
// than a module-level snapshot — fixes the Phase 8 useMemo([]) bug where
// counts stayed frozen after drag/decline mutations. Strict improvement,
// no UX regression.
//
// Time-to-first-touch stays hardcoded ("2h 14m") — not derivable from the
// current data shape and out of FE-054 scope to model.
// =============================================================================

import { useMemo } from 'react';
import { formatCurrencyCents } from '@/lib/components/formatters';
import type { WorkItem } from '@/lib/mockSystem/types';
import { ROSE } from './visualConstants';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

type Props = { items: ReferralWorkItem[] };

function StatCell({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text-tertiary)',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1.1,
          color: valueColor ?? 'var(--color-text-primary)',
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
            fontSize: 11,
            color: 'var(--color-text-tertiary)',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export function StatStrip({ items }: Props) {
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter(
      r => r.status !== 'completed' && r.status !== 'declined',
    ).length;
    const accepted = items.filter(
      r =>
        r.status === 'accepted' ||
        r.status === 'scheduled' ||
        r.status === 'completed',
    ).length;
    const acceptRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    const revenueCents = items.reduce(
      (sum, r) => sum + r.metadata.episodeValueCents,
      0,
    );
    const atRisk = items.filter(r => r.slaBreached).length;
    return {
      active,
      acceptRate,
      revenue: formatCurrencyCents(revenueCents),
      atRisk,
    };
  }, [items]);

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      <StatCell label="Active Referrals" value={String(stats.active)} sub="In pipeline" />
      <StatCell label="Time to First Touch" value="2h 14m" sub="Median, last 30d" />
      <StatCell label="Accept Rate" value={`${stats.acceptRate}%`} sub="Of total intake" />
      <StatCell label="Revenue This Period" value={stats.revenue} sub="Episode value" />
      <StatCell
        label="At-Risk Referrals"
        value={String(stats.atRisk)}
        valueColor={stats.atRisk > 0 ? ROSE.R700 : undefined}
        sub="SLA breached"
      />
    </div>
  );
}
