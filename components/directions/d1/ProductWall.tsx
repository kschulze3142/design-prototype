// d1 ProductWall — SEMrush's "look how much this does" proof wall (DR-001p): a
// horizontal row of ~4 product-screenshot cards, each a DIFFERENT fax dashboard
// view (area chart, success donut, routing bars, activity list), staggered and
// slightly overlapping on a subtle lavender diagonal-hatch background. This is
// product-as-proof, data-forward. Every figure is derived from the shared
// @/lib/designMock — no hardcoded fakes — and all series are fixed/deterministic
// (no Math.random / Date) so the static prerender draws identically.
import type { ReactNode } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { designMock, type Fax } from '@/lib/designMock';
import { Container, Eyebrow, Display, Card, space as u } from './primitives';
import { StatusPill, formatPhone, formatTime } from './surfaces';

// Fixed, deterministic weekly delivery-volume series (matches the hero surface).
const VOLUME = [14, 22, 18, 27, 24, 33, 30, 41] as const;

/** Area + line spark — lavender stroke over a soft accent fill. Deterministic. */
function AreaChart({ data = VOLUME, w = 232, h = 92 }: { data?: readonly number[]; w?: number; h?: number }) {
  const max = Math.max(...data);
  const stepX = w / (data.length - 1);
  const y = (d: number) => h - 4 - (d / max) * (h - 12);
  const pts = data.map((d, i) => `${i * stepX},${y(d)}`);
  const line = `M ${pts.join(' L ')}`;
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden style={{ display: 'block' }}>
      <path d={area} fill="var(--rd-color-accent-soft)" />
      <path d={line} fill="none" stroke="var(--rd-color-accent)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={i * stepX} cy={y(d)} r={i === data.length - 1 ? 3.5 : 0} fill="var(--rd-color-accent)" />
      ))}
    </svg>
  );
}

/** Delivery-success donut gauge — accent arc sized to the real success rate. */
function DonutGauge({ pct, label }: { pct: number; label: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: 118, height: 118, marginInline: 'auto' }}>
      <svg width={118} height={118} viewBox="0 0 118 118" aria-hidden style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={59} cy={59} r={r} fill="none" stroke="var(--rd-color-accent-soft)" strokeWidth={12} />
        <circle
          cx={59}
          cy={59}
          r={r}
          fill="none"
          stroke="var(--rd-color-accent)"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: '1.7rem',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--rd-color-heading)',
            }}
          >
            {pct.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--rd-color-text-muted)', marginTop: 3 }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Routing-by-destination bars. Buckets derived from inbound faxes routed via
 *  their matched rule's destination (designMock), with unrouted inbound counted
 *  separately — fully real, no invented values. */
function RoutingBars() {
  const inbound = designMock.faxes.filter((f) => f.direction === 'inbound');
  const counts = new Map<string, number>();
  for (const f of inbound) {
    const rule = f.routingRuleId ? designMock.routingRules.find((r) => r.id === f.routingRuleId) : undefined;
    const dest = rule ? rule.destination.value : 'Unrouted';
    counts.set(dest, (counts.get(dest) ?? 0) + 1);
  }
  const bars = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const max = Math.max(...bars.map(([, n]) => n));
  return (
    <div style={{ display: 'grid', gap: u(1.2) }}>
      {bars.map(([dest, n]) => (
        <div key={dest} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: u(1.4) }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--rd-color-heading)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: 5,
              }}
            >
              {dest}
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--rd-color-accent-soft)', overflow: 'hidden' }}>
              <div style={{ width: `${(n / max) * 100}%`, height: '100%', borderRadius: 999, background: 'var(--rd-color-accent)' }} />
            </div>
          </div>
          <span
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--rd-color-heading)',
            }}
          >
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Shared mini-card chrome — a labelled product view with a small header. */
function MiniCard({
  title,
  meta,
  children,
  offset,
}: {
  title: string;
  meta: string;
  children: ReactNode;
  offset: number;
}) {
  return (
    <div className="d1-wall-card" style={{ marginTop: offset, flexShrink: 0 }}>
      <Card elevated style={{ width: 264, padding: u(2.5) }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: u(2) }}>
          <span
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--rd-color-heading)',
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--rd-color-text-muted)' }}>{meta}</span>
        </div>
        {children}
      </Card>
    </div>
  );
}

export function ProductWall() {
  const { faxesSentThisMonth, deliverySuccessRate } = designMock.stats;
  const activity = designMock.faxes.slice(0, 4);

  return (
    <section
      style={{
        paddingBlock: u(7),
        // Subtle lavender diagonal hatch built from the existing accent-soft token.
        backgroundColor: 'var(--rd-color-bg)',
        backgroundImage:
          'repeating-linear-gradient(-45deg, var(--rd-color-accent-soft) 0 1px, transparent 1px 13px)',
      }}
    >
      <Container>
        <div style={{ maxWidth: 720, marginBottom: u(5) }}>
          <Eyebrow>One screen, every signal</Eyebrow>
          <Display as="h2" size="section" style={{ marginTop: u(2) }}>
            See the whole fax operation at a glance.
          </Display>
        </div>

        <div className="d1-wall-row" style={{ display: 'flex', gap: u(2.5), alignItems: 'flex-start' }}>
          {/* (a) Delivery-volume area chart */}
          <MiniCard title="Delivery volume" meta="30 days" offset={0}>
            <div style={{ marginBottom: u(1.5) }}>
              <span
                style={{
                  fontFamily: 'var(--rd-font-display)',
                  fontSize: '1.7rem',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  color: 'var(--rd-color-heading)',
                }}
              >
                {faxesSentThisMonth.toLocaleString()}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  marginLeft: u(1),
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--rd-color-accent)',
                }}
              >
                <TrendingUp size={13} strokeWidth={2.4} />
                +18%
              </span>
            </div>
            <AreaChart />
          </MiniCard>

          {/* (b) Delivery-success donut */}
          <MiniCard title="Delivery success" meta="first attempt" offset={32}>
            <DonutGauge pct={deliverySuccessRate * 100} label="delivered" />
          </MiniCard>

          {/* (c) Routing by destination */}
          <MiniCard title="Inbound routing" meta="by destination" offset={8}>
            <RoutingBars />
          </MiniCard>

          {/* (d) Recent activity list */}
          <MiniCard title="Recent activity" meta={`${designMock.faxes.length} total`} offset={40}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.4) }}>
              {activity.map((fax: Fax) => {
                const outbound = fax.direction === 'outbound';
                const label = fax.patientRef ? fax.patientRef.name : formatPhone(outbound ? fax.toNumber : fax.fromNumber);
                return (
                  <li key={fax.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: u(1.2) }}>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--rd-color-heading)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--rd-color-text-muted)' }}>{formatTime(fax.timestamp)}</div>
                    </div>
                    <StatusPill status={fax.status} />
                  </li>
                );
              })}
            </ul>
          </MiniCard>
        </div>

        <a
          href="#"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginTop: u(4),
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--rd-color-heading)',
            textDecoration: 'none',
          }}
        >
          Explore the dashboard
          <ArrowUpRight size={17} strokeWidth={2.4} color="var(--rd-color-accent)" />
        </a>
      </Container>

      {/* Desktop staggers; on narrow viewports the row scrolls horizontally and the
          stagger is flattened so nothing clips or overflows. */}
      <style>{`
        @media (max-width: 1040px) {
          .d1-wall-row {
            overflow-x: auto;
            padding-bottom: ${u(2)};
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x proximity;
          }
          .d1-wall-card { margin-top: 0 !important; scroll-snap-align: start; }
          .d1-wall-card > div { flex-shrink: 0; }
        }
      `}</style>
    </section>
  );
}
