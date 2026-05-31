// Plain product-surface renderers for d4. Real Robin Dock surfaces shown plainly
// from the shared @/lib/designMock. d4-scoped styling; reads mock data only.
//
// Two-color discipline: a product UI's chrome is functional, so it routes to the
// WORKHORSE — Forest Teal (the app's primary). Every place d2 used its coral
// accent for surface chrome (the brand icon chip, avatars, the sparkline, the
// trend figure, the patient-link wash, the in-progress timeline dots) is TEAL
// here. Orange is reserved for the marketing chrome (eyebrows, headline
// underlines), not the product. Semantic status hues (green/amber/red/blue) are
// unchanged — they read fine on the warm surfaces.
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
  UserRound,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { designMock, type Fax, type FaxStatus } from '@/lib/designMock';
import { space as u } from './primitives';

/** +12125550144 → +1 (212) 555-0144. d4-local; not shared. */
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

// d4-local status treatment. Semantic hues, unchanged from the warm system.
export const STATUS_META: Record<
  FaxStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  delivered: { label: 'Delivered', color: '#2f7d5b', bg: '#e7f4ee', Icon: CheckCircle2 },
  received: { label: 'Received', color: '#9a5b1f', bg: '#f6ece0', Icon: ArrowDownLeft },
  sending: { label: 'Sending', color: '#9a7b1f', bg: '#fbf3df', Icon: Clock },
  failed: { label: 'Failed', color: '#b4453c', bg: '#fbe9e7', Icon: XCircle },
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

/** A quiet list of recent faxes — the core inbox surface, shown plainly. */
export function FaxListSurface({ limit = 5 }: { limit?: number }) {
  const rows = designMock.faxes.slice(0, limit);
  return (
    <div role="table" aria-label="Recent faxes" style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${u(1.6)} ${u(2)}`,
          borderBottom: '1px solid var(--rd-color-border)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--rd-color-text-muted)',
        }}
      >
        <span>Recent activity</span>
        <span>{designMock.faxes.length} this view</span>
      </div>
      {rows.map((fax: Fax, i) => (
        <div
          key={fax.id}
          role="row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: u(2),
            padding: `${u(1.5)} ${u(2)}`,
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--rd-color-text)' }}>
              {fax.direction === 'outbound'
                ? formatPhone(fax.toNumber)
                : formatPhone(fax.fromNumber)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
              {fax.patientRef ? fax.patientRef.name : 'Unassigned'} · {fax.pageCount} pp ·{' '}
              {formatTime(fax.timestamp)}
            </div>
          </div>
          <StatusPill status={fax.status} />
        </div>
      ))}
    </div>
  );
}

/** Two-letter initials for an avatar chip. */
function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Small teal-tint initials avatar — product chrome, so it rides the workhorse. */
function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 999,
        flexShrink: 0,
        background: 'var(--rd-color-primary-soft)',
        color: 'var(--rd-color-primary)',
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: '0.01em',
      }}
    >
      {initials(name)}
    </span>
  );
}

/** Tiny area+line sparkline in teal. Fixed deterministic series only — no
 *  Math.random / Date, so every render (incl. static prerender) draws identically. */
function Sparkline({
  data,
  width = 120,
  height = 36,
}: {
  data: readonly number[];
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d - min) / span) * (height - 4) - 2; // 2px breathing top/bottom
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="d4-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--rd-color-primary)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="var(--rd-color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#d4-spark-fill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--rd-color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill="var(--rd-color-primary)" />
    </svg>
  );
}

/** The hero product surface — a plain white Robin Dock fax panel built to sit
 *  inside the TEAL frame in the right column of the hero. Fax activity up top, a
 *  quiet send-volume strip, and a delivery-confirmation callout as the focal
 *  reassurance moment. Reads only from the shared mock. */
export function HeroSurface() {
  const { faxesSentThisMonth, deliverySuccessRate, pagesUsed, pagesCap } = designMock.stats;
  const delivered = designMock.faxes.find((f) => f.id === 'fx-001')!;

  const stats = [
    { value: faxesSentThisMonth.toLocaleString(), label: 'sent' },
    { value: `${(deliverySuccessRate * 100).toFixed(1)}%`, label: 'delivered' },
    { value: `${(pagesUsed / 1000).toFixed(1)}k`, label: `of ${(pagesCap / 1000).toFixed(1)}k pages` },
  ];

  // Fixed, deterministic weekly send volume — never randomized.
  const series = [12, 18, 14, 22, 19, 27, 24, 31, 26, 34, 30, 39] as const;

  const rows = [
    designMock.faxes.find((f) => f.id === 'fx-002')!, // received, patient-linked
    designMock.faxes.find((f) => f.id === 'fx-005')!, // sending, outbound
  ];

  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-md)',
        padding: u(3),
        width: '100%',
      }}
    >
      {/* Header — brand icon chip rides the workhorse teal. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: u(1.2) }}>
          <span
            aria-hidden
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: 'var(--rd-color-primary)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={16} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontWeight: 500,
              fontSize: '1.05rem',
              color: 'var(--rd-color-heading)',
            }}
          >
            Fax activity
          </span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.74rem',
            fontWeight: 600,
            color: 'var(--rd-color-text-muted)',
          }}
        >
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: '#2f7d5b' }} />
          Live
        </span>
      </div>

      {/* Stat readouts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: u(1.4),
          marginTop: u(2.4),
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: u(1.6),
              borderRadius: 'var(--rd-radius-md)',
              background: 'var(--rd-color-bg)',
              border: '1px solid var(--rd-color-border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--rd-font-display)',
                fontSize: '1.55rem',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--rd-color-heading)',
                lineHeight: 1.1,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--rd-color-text-muted)', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Send-volume sparkline strip — teal data, teal trend. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: u(2),
          marginTop: u(2),
          padding: `${u(1.6)} ${u(1.8)}`,
          borderRadius: 'var(--rd-radius-md)',
          background: 'var(--rd-color-bg-tint)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)', fontWeight: 600 }}>
            Send volume
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--rd-color-primary)',
            }}
          >
            <TrendingUp size={14} strokeWidth={2.4} />
            +18% vs. last month
          </div>
        </div>
        <Sparkline data={series} />
      </div>

      {/* Mini activity list */}
      <div style={{ marginTop: u(2), display: 'grid', gap: u(1.4) }}>
        {rows.map((fax) => {
          const meta = STATUS_META[fax.status];
          const name = fax.patientRef?.name;
          const label =
            name ?? formatPhone(fax.direction === 'outbound' ? fax.toNumber : fax.fromNumber);
          const sub = name
            ? `${fax.patientRef!.mrn} · ${fax.pageCount} pp`
            : `${fax.pageCount} pp · ${formatTime(fax.timestamp)}`;
          return (
            <div key={fax.id} style={{ display: 'flex', alignItems: 'center', gap: u(1.2) }}>
              {name ? (
                <Avatar name={name} />
              ) : (
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: meta.bg,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: meta.color }} />
                </span>
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: 'var(--rd-color-text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>{sub}</div>
              </div>
              <StatusPill status={fax.status} />
            </div>
          );
        })}
      </div>

      {/* Delivery-confirmation callout — the focal reassurance moment (semantic green). */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1.4),
          marginTop: u(2),
          padding: u(1.8),
          borderRadius: 'var(--rd-radius-md)',
          background: '#e7f4ee',
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
            color: '#2f7d5b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={19} strokeWidth={2.4} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
            Delivered · receipt #{delivered.id.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>
            {formatPhone(delivered.toNumber)} · {formatTime(delivered.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Delivery confirmation — a single delivered outbound fax with a plain timeline.
 *  In-progress dots ride the teal workhorse; the final delivered dot stays the
 *  semantic green. */
export function DeliveryConfirmationSurface() {
  const fax = designMock.faxes.find((f) => f.status === 'delivered')!;
  const steps = [
    { label: 'Queued', time: '2:11 PM' },
    { label: 'Transmitting', time: '2:11 PM' },
    { label: `Delivered to ${formatPhone(fax.toNumber)}`, time: formatTime(fax.timestamp) },
  ];
  return (
    <div style={{ padding: u(3) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(1.2), marginBottom: u(2.4) }}>
        <CheckCircle2 size={20} strokeWidth={2.2} color="#2f7d5b" />
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
                background: i === steps.length - 1 ? '#2f7d5b' : 'var(--rd-color-primary)',
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

/** Patient-linking surface — an inbound fax matched to a patient record. The
 *  match callout rides the teal workhorse (product chrome). */
export function PatientLinkSurface() {
  const fax = designMock.faxes.find((f) => f.direction === 'inbound' && f.patientRef)!;
  const patient = fax.patientRef!;
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
          gap: u(1.4),
          padding: u(1.8),
          borderRadius: 'var(--rd-radius-md)',
          background: 'var(--rd-color-primary-soft)',
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
            color: 'var(--rd-color-primary)',
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
