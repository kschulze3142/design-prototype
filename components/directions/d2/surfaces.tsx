// Plain product-surface renderers for d2. Real Robin Dock surfaces shown
// plainly (no collage, no chaos) from the shared @/lib/designMock.
// d2-scoped styling; reads mock data only.
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { designMock, type Fax, type FaxStatus } from '@/lib/designMock';
import { space as u } from './primitives';

/** +12125550144 → +1 (212) 555-0144 — calm, human-readable.
 *  Exported for d2-local reuse (e.g. the inbox). Intentionally NOT shared:
 *  D1/D3/D4 each format and treat status their own way. */
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

// Exported for d2-local reuse (the inbox draws its failed-row hairline from
// STATUS_META.failed.color so the pill and hairline can't drift). NOT shared:
// D1/D3/D4 each define their own status treatment.
export const STATUS_META: Record<
  FaxStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  delivered: { label: 'Delivered', color: '#2f7d5b', bg: '#e7f4ee', Icon: CheckCircle2 },
  received: { label: 'Received', color: '#4b53b8', bg: '#eceefb', Icon: ArrowDownLeft },
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
        borderRadius: 999,
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

/** Delivery confirmation — a single delivered outbound fax with a plain timeline. */
export function DeliveryConfirmationSurface() {
  const fax = designMock.faxes.find((f) => f.status === 'delivered')!;
  const steps = [
    { label: 'Queued', time: '2:11 PM' },
    { label: 'Transmitting', time: '2:11 PM' },
    { label: `Delivered to ${formatPhone(fax.toNumber)}`, time: formatTime(fax.timestamp) },
  ];
  return (
    <div style={{ padding: u(2.5) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(1.2), marginBottom: u(2) }}>
        <CheckCircle2 size={20} strokeWidth={2.2} color="#2f7d5b" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Confirmed delivered</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
            {fax.pageCount} pages · receipt #{fax.id.toUpperCase()}
          </div>
        </div>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.4) }}>
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
                background:
                  i === steps.length - 1 ? '#2f7d5b' : 'var(--rd-color-accent)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, gap: u(2) }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--rd-color-text)' }}>{s.label}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
                {s.time}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Patient-linking surface — an inbound fax matched to a patient record. */
export function PatientLinkSurface() {
  const fax = designMock.faxes.find((f) => f.direction === 'inbound' && f.patientRef)!;
  const patient = fax.patientRef!;
  return (
    <div style={{ padding: u(2.5), display: 'grid', gap: u(1.8) }}>
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
            color: 'var(--rd-color-accent)',
          }}
        >
          <UserRound size={18} strokeWidth={2.2} />
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Linked to {patient.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
            {patient.mrn} · routed automatically
          </div>
        </div>
      </div>
    </div>
  );
}

/** A compact reassurance card used inside the trust tabs. */
export function AssuranceSurface({
  heading,
  detail,
}: {
  heading: string;
  detail: string;
}) {
  return (
    <div style={{ padding: u(2.5), display: 'flex', gap: u(1.4), alignItems: 'flex-start' }}>
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: 999,
          background: 'var(--rd-color-accent-soft)',
          color: 'var(--rd-color-accent)',
        }}
      >
        <ShieldCheck size={17} strokeWidth={2.2} />
      </span>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 3 }}>{heading}</div>
        <div style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--rd-color-text-muted)' }}>
          {detail}
        </div>
      </div>
    </div>
  );
}
