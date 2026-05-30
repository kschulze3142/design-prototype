// DR-006 — D2 Mercury · Dashboard. The last D2 screen: the in-app home, inside
// the constrained DirectionShell <main>. Reads the shared @/lib/designMock only.
// Quiet minimal — numbers present but not shouting, restrained accent, calm chrome.
import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Gauge,
  Route,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { designMock, type ActivityFeedItem, type Fax, type FaxStatus } from '@/lib/designMock';
import { Card, Eyebrow, space as u } from './primitives';
import { StatusPill, STATUS_META, formatTime } from './surfaces';

const { stats, faxes } = designMock;

// Resolve a fax once so the activity feed reads the SAME source of truth as the
// inbox — both render a fax's *actual* status, so they can't disagree about it.
const faxById = new Map<string, Fax>(faxes.map((f) => [f.id, f]));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 2026-05-27 → "May 27" — calm chart axis label. */
function formatDay(iso: string): string {
  const [, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

const numberFmt = new Intl.NumberFormat('en-US');

/* ── Stat cards ──────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  hint,
  Icon,
}: {
  label: string;
  value: string;
  hint: string;
  Icon: LucideIcon;
}) {
  return (
    <Card style={{ padding: u(2.5), display: 'flex', flexDirection: 'column', gap: u(1.4) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--rd-color-text-muted)',
          }}
        >
          {label}
        </span>
        <Icon size={16} strokeWidth={2} color="var(--rd-color-text-muted)" />
      </div>
      {/* Moderate weight/size — the D2 restraint that separates it from D1's bold numbers. */}
      <span
        style={{
          fontFamily: 'var(--rd-font-display)',
          fontSize: '1.85rem',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--rd-color-text)',
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>{hint}</span>
    </Card>
  );
}

function StatGrid() {
  const successPct = (stats.deliverySuccessRate * 100).toFixed(1);
  const cards = [
    {
      label: 'Sent this month',
      value: numberFmt.format(stats.faxesSentThisMonth),
      hint: 'Outbound faxes',
      Icon: ArrowUpRight,
    },
    {
      label: 'Received this month',
      value: numberFmt.format(stats.faxesReceivedThisMonth),
      hint: 'Inbound faxes',
      Icon: ArrowDownLeft,
    },
    {
      label: 'Delivery success',
      value: `${successPct}%`,
      hint: 'Confirmed delivered',
      Icon: CheckCircle2,
    },
    {
      label: 'Pages used',
      value: numberFmt.format(stats.pagesUsed),
      hint: `of ${numberFmt.format(stats.pagesCap)} cap`,
      Icon: Gauge,
    },
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: u(2),
      }}
    >
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  );
}

/* ── Usage / spending cap ────────────────────────────────────────────────── */

function UsageBar() {
  const { pagesUsed, pagesCap } = stats;
  const pct = Math.min(1, pagesUsed / pagesCap);
  const remaining = pagesCap - pagesUsed;
  return (
    <Card style={{ padding: u(2.5), display: 'flex', flexDirection: 'column', gap: u(1.8) }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: u(2) }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--rd-color-text)' }}>
          Page usage
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--rd-color-text-muted)' }}>
          {numberFmt.format(pagesUsed)} of {numberFmt.format(pagesCap)} pages
        </span>
      </div>
      <div
        aria-hidden
        style={{
          height: 10,
          borderRadius: 999,
          background: 'var(--rd-color-accent-soft)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(pct * 100).toFixed(1)}%`,
            height: '100%',
            borderRadius: 999,
            background: 'var(--rd-color-accent)',
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: u(2) }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--rd-color-text-muted)' }}>
          {(pct * 100).toFixed(0)}% of monthly cap used
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--rd-color-text-muted)' }}>
          {numberFmt.format(remaining)} remaining
        </span>
      </div>
    </Card>
  );
}

/* ── Delivery analytics chart (inline SVG, no dependency) ─────────────────── */

// Stack order + palette sourced from STATUS_META — same anti-drift move as the
// inbox failed-row hairline: chart segments and pills can't fall out of sync.
const SEGMENTS: FaxStatus[] = ['delivered', 'received', 'sending', 'failed'];

function DeliveryChart() {
  // Group the shared faxes by calendar day, oldest → newest.
  const byDay = new Map<string, Record<FaxStatus, number>>();
  for (const fax of faxes) {
    const day = fax.timestamp.slice(0, 10);
    const counts = byDay.get(day) ?? { delivered: 0, received: 0, sending: 0, failed: 0 };
    counts[fax.status] += 1;
    byDay.set(day, counts);
  }
  const days = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const maxTotal = Math.max(
    ...days.map(([, c]) => SEGMENTS.reduce((sum, s) => sum + c[s], 0)),
  );

  const W = 520;
  const H = 150;
  const padBottom = 24;
  const plotH = H - padBottom;
  const slot = W / days.length;
  const barW = Math.min(44, slot * 0.5);

  return (
    <Card style={{ padding: u(2.5), display: 'flex', flexDirection: 'column', gap: u(2) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: u(2) }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--rd-color-text)' }}>
          Delivery by day
        </span>
        <div style={{ display: 'flex', gap: u(1.8), flexWrap: 'wrap' }}>
          {SEGMENTS.map((s) => (
            <span
              key={s}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.72rem',
                color: 'var(--rd-color-text-muted)',
              }}
            >
              <span
                aria-hidden
                style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_META[s].color }}
              />
              {STATUS_META[s].label}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label="Faxes per day by delivery status"
        style={{ display: 'block' }}
      >
        {days.map(([day, counts], i) => {
          const cx = slot * i + slot / 2;
          const x = cx - barW / 2;
          let yCursor = plotH;
          return (
            <g key={day}>
              {SEGMENTS.map((s) => {
                const n = counts[s];
                if (n === 0) return null;
                const h = (n / maxTotal) * (plotH - 8);
                yCursor -= h;
                return (
                  <rect
                    key={s}
                    x={x}
                    y={yCursor}
                    width={barW}
                    height={h}
                    rx={2}
                    fill={STATUS_META[s].color}
                  />
                );
              })}
              <text
                x={cx}
                y={H - 7}
                textAnchor="middle"
                fontSize="11"
                fill="var(--rd-color-text-muted)"
                fontFamily="var(--rd-font-body)"
              >
                {formatDay(day)}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

/* ── Recent activity feed ────────────────────────────────────────────────── */

// Non-status events (rule-applied / patient-linked) reference a fax but aren't a
// fax *state* — they get a muted leading icon consistent with the inbox row icons.
const ACTIVITY_ICON: Partial<Record<ActivityFeedItem['kind'], LucideIcon>> = {
  'rule-applied': Route,
  'patient-linked': UserRound,
};

function ActivityLeading({ item }: { item: ActivityFeedItem }) {
  // fax-sent / fax-received / fax-failed → resolve the fax and show its ACTUAL
  // status pill (same source of truth as the inbox; no guessed label).
  const fax = item.faxId ? faxById.get(item.faxId) : undefined;
  if (fax && item.kind.startsWith('fax-')) {
    return <StatusPill status={fax.status} />;
  }
  const Icon = ACTIVITY_ICON[item.kind] ?? Route;
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: 999,
        flexShrink: 0,
        background: 'var(--rd-color-accent-soft)',
        color: 'var(--rd-color-accent)',
      }}
    >
      <Icon size={13} strokeWidth={2.2} />
    </span>
  );
}

function ActivityFeed() {
  const items = stats.recentActivity;
  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${u(1.6)} ${u(2.5)}`,
          borderBottom: '1px solid var(--rd-color-border)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--rd-color-text-muted)',
        }}
      >
        <span>Recent activity</span>
        <span>{items.length} events</span>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: u(1.6),
            padding: `${u(1.5)} ${u(2.5)}`,
            borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
          }}
        >
          <div style={{ flexShrink: 0, minWidth: 88, display: 'flex' }}>
            <ActivityLeading item={item} />
          </div>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: '0.88rem',
              lineHeight: 1.45,
              color: 'var(--rd-color-text)',
            }}
          >
            {item.description}
          </span>
          <span
            style={{
              flexShrink: 0,
              fontSize: '0.78rem',
              color: 'var(--rd-color-text-muted)',
            }}
          >
            {formatTime(item.timestamp)}
          </span>
        </div>
      ))}
    </Card>
  );
}

/* ── Page composition ────────────────────────────────────────────────────── */

function Stack({ children, gap }: { children: ReactNode; gap: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: u(gap) }}>{children}</div>;
}

export function Dashboard() {
  return (
    <Stack gap={4}>
      {/* Calm page header — same Eyebrow + display h1 + subline as D2 home/inbox. */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: u(1.2) }}>
        <Eyebrow>Dashboard</Eyebrow>
        <h1
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'calc(2.1rem * var(--rd-type-scale))',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--rd-color-text)',
          }}
        >
          This month
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--rd-color-text-muted)',
            maxWidth: 560,
          }}
        >
          Faxes, delivery health, and page usage at a glance — the same activity you see in your inbox.
        </p>
      </header>

      <StatGrid />
      <UsageBar />

      {/* Analytics + activity side by side on wide screens, stacked when narrow. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: u(2),
          alignItems: 'start',
        }}
      >
        <DeliveryChart />
        <ActivityFeed />
      </div>
    </Stack>
  );
}
