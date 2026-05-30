// Product-surface renderers for d1 — SEMrush "data-forward" reconstruction
// (DR-007). Real Robin Dock data from the shared @/lib/designMock, composed
// DENSER and more dashboard-like than D2's calm panel to carry SEMrush's data
// energy. d1-scoped styling; reads mock data only. All series are fixed and
// deterministic (no Math.random / Date) so static prerender draws identically.
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
  ShieldCheck,
  TrendingUp,
  Filter,
  UserRound,
  ArrowRight,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { designMock, type Fax, type FaxStatus } from '@/lib/designMock';
import { space as u } from './primitives';

// +12125550144 → +1 (212) 555-0144. d1-local on purpose: each direction formats
// and treats status its own way (D2 has its own copy).
export function formatPhone(e164: string): string {
  const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164);
  if (!m) return e164;
  return `+1 (${m[1]}) ${m[2]}-${m[3]}`;
}

export function formatTime(iso: string): string {
  const [, time] = iso.split('T');
  const [h, min] = time.slice(0, 5).split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${ampm}`;
}

// d1-local status treatment. Semantic green/amber/red/blue, retuned to read
// crisply on SEMrush's white surfaces. NOT shared.
export const STATUS_META: Record<
  FaxStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  delivered: { label: 'Delivered', color: '#1f7a4d', bg: '#e4f4ec', Icon: CheckCircle2 },
  received: { label: 'Received', color: '#2563a8', bg: '#e6eff7', Icon: ArrowDownLeft },
  sending: { label: 'Sending', color: '#8a6d18', bg: '#f6efda', Icon: Clock },
  failed: { label: 'Failed', color: '#b23a32', bg: '#f9e7e5', Icon: XCircle },
};

export function StatusPill({ status }: { status: FaxStatus }) {
  const m = STATUS_META[status];
  const Icon = m.Icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        paddingInline: 9,
        height: 24,
        borderRadius: 'var(--rd-radius-round)',
        fontSize: '0.72rem',
        fontWeight: 600,
        color: m.color,
        background: m.bg,
      }}
    >
      <Icon size={13} strokeWidth={2.2} />
      {m.label}
    </span>
  );
}

/** Deterministic bar chart for the send-volume panel. Lavender bars, fixed
 *  series — never randomized. */
function BarChart({
  data,
  width = 260,
  height = 96,
}: {
  data: readonly number[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const gap = 6;
  const barW = (width - gap * (data.length - 1)) / data.length;
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      {data.map((d, i) => {
        const h = Math.max(3, (d / max) * (height - 4));
        const x = i * (barW + gap);
        const last = i === data.length - 1;
        return (
          <rect
            key={i}
            x={x}
            y={height - h}
            width={barW}
            height={h}
            rx={3}
            fill="var(--rd-color-accent)"
            opacity={last ? 1 : 0.45}
          />
        );
      })}
    </svg>
  );
}

/** A single KPI tile — big tight Space Grotesk numeral over a small label, with
 *  an optional lavender delta. `accent` flips the tile to the lavender-soft wash
 *  for the focal "0 silent failures" reassurance. */
function Kpi({
  value,
  label,
  delta,
  accent = false,
  icon,
}: {
  value: string;
  label: string;
  delta?: string;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: u(2),
        borderRadius: 'var(--rd-radius-md)',
        background: accent ? 'var(--rd-color-accent-soft)' : 'var(--rd-color-bg)',
        border: accent ? '1px solid transparent' : '1px solid var(--rd-color-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--rd-color-text-muted)' }}>
        {icon}
        <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{label}</span>
      </div>
      <div
        style={{
          fontFamily: 'var(--rd-font-display)',
          fontSize: '1.9rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: 'var(--rd-color-heading)',
          lineHeight: 1.1,
          marginTop: 6,
        }}
      >
        {value}
      </div>
      {delta ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            fontSize: '0.74rem',
            fontWeight: 600,
            color: 'var(--rd-color-accent)',
          }}
        >
          <TrendingUp size={13} strokeWidth={2.4} />
          {delta}
        </div>
      ) : null}
    </div>
  );
}

/** The hero product surface — a wide, dense Robin Dock fax dashboard. KPI row
 *  (with the derived "0 silent failures" focal tile), a denser recent-activity
 *  table on the left, and a send-volume + delivery-confirmation panel on the
 *  right. Built to sit wide-but-contained below the centered hero text on the
 *  sage wash. Reads only from the shared mock. */
export function HeroDashboardSurface() {
  const { faxesSentThisMonth, deliverySuccessRate, pagesUsed, pagesCap } = designMock.stats;
  const delivered = designMock.faxes.find((f) => f.id === 'fx-001')!;
  const rows = designMock.faxes.slice(0, 6);

  // Fixed, deterministic weekly send volume — never randomized.
  const series = [14, 22, 18, 27, 24, 33, 30, 41] as const;

  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        borderRadius: 'var(--rd-radius-lg)',
        border: '1px solid var(--rd-color-border)',
        boxShadow: 'var(--rd-shadow-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: u(2),
          padding: `${u(2)} ${u(3)}`,
          borderBottom: '1px solid var(--rd-color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: u(1.5) }}>
          <span
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
              color: 'var(--rd-color-heading)',
            }}
          >
            Fax delivery overview
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#1f7a4d',
            }}
          >
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: '#1f7a4d' }} />
            Live
          </span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            paddingInline: 12,
            height: 30,
            borderRadius: 'var(--rd-radius-sm)',
            background: 'var(--rd-color-accent-soft)',
            color: 'var(--rd-color-heading)',
            fontSize: '0.74rem',
            fontWeight: 600,
          }}
        >
          <Filter size={13} strokeWidth={2.4} />
          Last 30 days
        </span>
      </div>

      {/* KPI row */}
      <div
        className="d1-hero-kpis"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: u(1.5),
          padding: u(3),
          paddingBottom: 0,
        }}
      >
        <Kpi value={faxesSentThisMonth.toLocaleString()} label="Faxes sent" delta="+18%" />
        <Kpi value={`${(deliverySuccessRate * 100).toFixed(1)}%`} label="Delivered" delta="+1.4%" />
        <Kpi value={`${(pagesUsed / 1000).toFixed(2)}k`} label={`of ${(pagesCap / 1000).toFixed(1)}k pages`} />
        <Kpi
          value="0"
          label="Silent failures"
          accent
          icon={<ShieldCheck size={14} strokeWidth={2.4} color="var(--rd-color-accent)" />}
        />
      </div>

      {/* Body: activity table + side panel */}
      <div
        className="d1-hero-body"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: u(2),
          padding: u(3),
        }}
      >
        {/* Recent activity table */}
        <div
          style={{
            border: '1px solid var(--rd-color-border)',
            borderRadius: 'var(--rd-radius-md)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${u(1.4)} ${u(2)}`,
              borderBottom: '1px solid var(--rd-color-border)',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: 'var(--rd-color-text-muted)',
            }}
          >
            <span>Recent activity</span>
            <span>{designMock.faxes.length} total</span>
          </div>
          {rows.map((fax: Fax, i) => {
            const outbound = fax.direction === 'outbound';
            const label = fax.patientRef
              ? fax.patientRef.name
              : formatPhone(outbound ? fax.toNumber : fax.fromNumber);
            return (
              <div
                key={fax.id}
                role="row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: u(1.5),
                  padding: `${u(1.3)} ${u(2)}`,
                  borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--rd-color-heading)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--rd-color-text-muted)' }}>
                    {fax.id.toUpperCase()} · {fax.pageCount} pp · {formatTime(fax.timestamp)}
                  </div>
                </div>
                <StatusPill status={fax.status} />
              </div>
            );
          })}
        </div>

        {/* Side panel — send volume + delivery confirmation */}
        <div style={{ display: 'grid', gap: u(2), gridAutoRows: 'min-content' }}>
          <div
            style={{
              padding: u(2),
              borderRadius: 'var(--rd-radius-md)',
              border: '1px solid var(--rd-color-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: u(1.5),
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--rd-color-text-muted)' }}>
                Send volume
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--rd-color-accent)',
                }}
              >
                <TrendingUp size={13} strokeWidth={2.4} />
                +18%
              </span>
            </div>
            <BarChart data={series} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: u(1.4),
              padding: u(2),
              borderRadius: 'var(--rd-radius-md)',
              background: '#e4f4ec',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                flexShrink: 0,
                background: '#ffffff',
                color: '#1f7a4d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={19} strokeWidth={2.4} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                Delivered · receipt #{delivered.id.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--rd-color-text-muted)' }}>
                {formatPhone(delivered.toNumber)} · {formatTime(delivered.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapse to a single column on narrow viewports so nothing overflows. */}
      <style>{`
        @media (max-width: 720px) {
          .d1-hero-kpis { grid-template-columns: repeat(2, 1fr) !important; }
          .d1-hero-body { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/** Delivery-receipt feature surface — a single delivered outbound fax with a
 *  plain transmission timeline ending in a green confirmation. */
export function DeliveryReceiptSurface() {
  const fax = designMock.faxes.find((f) => f.status === 'delivered')!;
  const steps = [
    { label: 'Queued', time: '2:11 PM', done: true },
    { label: 'Transmitting', time: '2:11 PM', done: true },
    { label: `Delivered to ${formatPhone(fax.toNumber)}`, time: formatTime(fax.timestamp), done: true },
  ];
  return (
    <div style={{ padding: u(3) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(1.4), marginBottom: u(2.4) }}>
        <span
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            flexShrink: 0,
            background: '#e4f4ec',
            color: '#1f7a4d',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={20} strokeWidth={2.4} />
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--rd-color-heading)' }}>
            Confirmed delivered
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
            {fax.pageCount} pages · receipt #{fax.id.toUpperCase()}
          </div>
        </div>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.6) }}>
        {steps.map((s, i) => (
          <li key={s.label} style={{ display: 'flex', gap: u(1.4), alignItems: 'flex-start' }}>
            <span
              aria-hidden
              style={{
                marginTop: 4,
                width: 9,
                height: 9,
                borderRadius: 999,
                flexShrink: 0,
                background: i === steps.length - 1 ? '#1f7a4d' : 'var(--rd-color-accent)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, gap: u(2) }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--rd-color-text)' }}>{s.label}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>{s.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Routing feature surface — an inbound fax matched by rule to a patient record. */
export function RoutingSurface() {
  const fax = designMock.faxes.find((f) => f.direction === 'inbound' && f.patientRef && f.routingRuleId)!;
  const patient = fax.patientRef!;
  const rule = designMock.routingRules.find((r) => r.id === fax.routingRuleId)!;
  return (
    <div style={{ padding: u(3), display: 'grid', gap: u(2) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusPill status="received" />
        <span style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
          {fax.pageCount} pages · {formatTime(fax.timestamp)}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1.2),
          fontSize: '0.82rem',
          color: 'var(--rd-color-text-muted)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--rd-color-heading)' }}>{rule.name}</span>
        <ArrowRight size={15} strokeWidth={2.2} color="var(--rd-color-accent)" />
        <span>matched</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1.4),
          padding: u(2),
          borderRadius: 'var(--rd-radius-md)',
          background: 'var(--rd-color-accent-soft)',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'var(--rd-color-surface)',
            color: 'var(--rd-color-heading)',
          }}
        >
          <UserRound size={18} strokeWidth={2.2} />
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--rd-color-heading)' }}>
            Linked to {patient.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
            {patient.mrn} · routed automatically
          </div>
        </div>
      </div>
    </div>
  );
}
