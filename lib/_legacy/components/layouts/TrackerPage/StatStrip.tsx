'use client';

// =============================================================================
// StatStrip (tracker) — 4 stat cells above the status sections.
//
// Tracker-specific stats:
//   - Pending           — items in literal 'pending' status
//   - Expiring this week— items with metadata.expiresAt < 7 days from now,
//                         regardless of status (includes already-expired)
//   - Approval rate     — approved / (approved + denied + expired), rounded
//   - Denied this month — status='denied' updated within last 30 days
//
// All counts derive from the live `items` array via useMemo so mutations
// flow reactively (matches PipelinePage's FE-054 fix — no module-level
// snapshots).
//
// The component reads metadata.expiresAt by string key. PA is the only
// tracker department today; if a second one ships with a different urgency
// field, lift this to a template hook (`template.expiringField`?) rather
// than hardcoding.
// =============================================================================

import { useMemo } from 'react';
import type { WorkItem } from '@/lib/mockSystem/types';

type Props = { items: WorkItem[] };

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

function getExpiresAtMs(item: WorkItem): number | null {
  const v = (item.metadata as Record<string, unknown>).expiresAt;
  if (typeof v !== 'string') return null;
  const ms = new Date(v).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function StatCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
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
          color: 'var(--color-text-primary)',
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
    const now = Date.now();

    const pending = items.filter(i => i.status === 'pending').length;

    const expiringThisWeek = items.filter(i => {
      const ms = getExpiresAtMs(i);
      return ms !== null && ms - now < WEEK_MS;
    }).length;

    const approved = items.filter(i => i.status === 'approved').length;
    const denied = items.filter(i => i.status === 'denied').length;
    const expired = items.filter(i => i.status === 'expired').length;
    const decisionTotal = approved + denied + expired;
    const approvalRate = decisionTotal > 0 ? Math.round((approved / decisionTotal) * 100) : 0;

    const deniedThisMonth = items.filter(i => {
      if (i.status !== 'denied') return false;
      const ms = new Date(i.updatedAt).getTime();
      return !Number.isNaN(ms) && now - ms < MONTH_MS;
    }).length;

    return { pending, expiringThisWeek, approvalRate, deniedThisMonth };
  }, [items]);

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      <StatCell label="Pending" value={String(stats.pending)} sub="Awaiting payer decision" />
      <StatCell
        label="Expiring This Week"
        value={String(stats.expiringThisWeek)}
        sub="Within 7 days"
      />
      <StatCell label="Approval Rate" value={`${stats.approvalRate}%`} sub="Of decided requests" />
      <StatCell
        label="Denied This Month"
        value={String(stats.deniedThisMonth)}
        sub="Last 30 days"
      />
    </div>
  );
}
