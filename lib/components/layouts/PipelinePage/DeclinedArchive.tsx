'use client';

// =============================================================================
// DeclinedArchive — table of declined referrals, shown when the user
// switches to the "Declined" tab. Stats bar values are hardcoded (Phase 8
// verbatim — not derivable from current data and out of FE-054 scope).
//
// Per declined item we surface the latest type='decline' ThreadEvent
// (orchestrator passes the events list once; we resolve per row).
// =============================================================================

import { I } from '@/components/app/icons';
import { formatRelative } from '@/lib/components/formatters';
import { usePatient, useUser } from '@/lib/mockSystem/hooks';
import type { DeclinePayload, ThreadEvent, WorkItem } from '@/lib/mockSystem/types';

type ReferralWorkItem = Extract<WorkItem, { departmentType: 'referrals' }>;

type Props = {
  items: ReferralWorkItem[];
  threadEvents: ThreadEvent[];
};

// Picks the latest decline event for an item. If none exists (e.g. an
// item seeded as declined without an event, or a future provider change),
// the row falls back to metadata fields.
function latestDeclineEvent(
  events: ThreadEvent[],
  itemId: string,
): (ThreadEvent & { type: 'decline'; payload: DeclinePayload }) | null {
  let latest: (ThreadEvent & { type: 'decline'; payload: DeclinePayload }) | null = null;
  for (const e of events) {
    if (e.workItemId !== itemId || e.type !== 'decline') continue;
    if (!latest || e.timestamp > latest.timestamp) {
      latest = e as ThreadEvent & { type: 'decline'; payload: DeclinePayload };
    }
  }
  return latest;
}

const STATS = [
  { label: 'Decline Rate',      value: '12.5%' },
  { label: 'Top Reason',        value: 'Insurance not accepted' },
  { label: 'Courtesy Fax Rate', value: '100%' },
  { label: 'Re-referral Rate',  value: '—' },
];

export function DeclinedArchive({ items, threadEvents }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          padding: '14px 20px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {STATS.map(item => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-tertiary)',
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: 'Outfit, var(--font-heading), system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1.4fr 1.4fr 1fr 0.8fr 0.8fr',
            padding: '12px 20px',
            background: 'var(--color-bg)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            gap: 12,
          }}
        >
          <span>Patient</span>
          <span>MRN</span>
          <span>Referring Org</span>
          <span>Decline Reason</span>
          <span>Declined By</span>
          <span>Date</span>
          <span>Courtesy Fax</span>
        </div>
        {items.length === 0 ? (
          <div
            style={{
              padding: '24px 20px',
              fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
              fontSize: 13,
              color: 'var(--color-text-tertiary)',
              textAlign: 'center',
            }}
          >
            No declined referrals.
          </div>
        ) : (
          items.map((item, idx) => (
            <DeclinedRow
              key={item.id}
              item={item}
              event={latestDeclineEvent(threadEvents, item.id)}
              isFirst={idx === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DeclinedRow({
  item,
  event,
  isFirst,
}: {
  item: ReferralWorkItem;
  event: (ThreadEvent & { type: 'decline'; payload: DeclinePayload }) | null;
  isFirst: boolean;
}) {
  const patient = usePatient(item.patientId);
  // event?.actor is 'system' or a userId; useUser handles both safely.
  const actor = useUser(event ? event.actor : null);
  const reason = event?.payload.reason ?? item.metadata.declineReason ?? '—';
  const declinedBy = actor?.name ?? event?.actorLabel ?? '—';
  const declinedAt = event ? formatRelative(event.timestamp) : '—';
  const courtesyFaxSent = event?.payload.courtesyFaxSent ?? false;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1.4fr 1.4fr 1fr 0.8fr 0.8fr',
        padding: '14px 20px',
        gap: 12,
        alignItems: 'center',
        borderTop: isFirst ? 'none' : '1px solid var(--color-border)',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        color: 'var(--color-text-secondary)',
      }}
    >
      <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
        {patient?.name ?? 'Unknown patient'}
      </span>
      <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12 }}>
        {patient?.mrn ?? '—'}
      </span>
      <span>{item.metadata.referringOrg}</span>
      <span>{reason}</span>
      <span>{declinedBy}</span>
      <span style={{ color: 'var(--color-text-tertiary)' }}>{declinedAt}</span>
      <span>
        {courtesyFaxSent ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-delivered-bg)',
              color: 'var(--color-delivered)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <I.Check size={11} strokeWidth={2.6} /> Sent
          </span>
        ) : (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-tertiary)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Not sent
          </span>
        )}
      </span>
    </div>
  );
}
