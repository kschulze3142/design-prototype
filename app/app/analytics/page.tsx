'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard } from '@/components/app/primitives';

// ── Data ────────────────────────────────────────────────────────────────────

const ANALYTICS_KPIS = [
  { label: 'Total faxes',   value: '8,412',  helper: '+11.4% vs. prev 30d',  trend: 'up' as const,   icon: 'Sent' },
  { label: 'Delivery rate', value: '99.1%',  helper: '+0.4 pp vs. prev 30d', trend: 'up' as const,   icon: 'Shield' },
  { label: 'Avg confirm',   value: '1m 18s', helper: '−9s vs. prev 30d',     trend: 'up' as const,   icon: 'Clock' },
  { label: 'Pages sent',    value: '31,847', helper: 'Avg 3.8 pages/fax',    trend: undefined,        icon: 'Document' },
  { label: 'Cost per fax',  value: '$0.062', helper: '−$0.004 vs. prev 30d', trend: 'up' as const,   icon: 'Billing' },
];

const KPI_TIPS = [
  'Total outbound and inbound faxes processed in the selected period.',
  "Percentage of outbound faxes confirmed delivered by the recipient's fax machine.",
  'Average time from send to delivery confirmation. Lower is better.',
  'Total pages transmitted outbound. Multi-page faxes count each page separately.',
  'Average transmission cost per outbound fax, excluding subscription fee.',
];

const DAILY_VOLUME = (() => {
  const seed = [240,280,295,268,310,110,80,260,290,312,305,330,130,95,280,305,340,325,350,145,110,310,335,360,348,372,158,122,322,360];
  return seed.map((out, i) => ({ day: i + 1, out, in: Math.round(out * (0.18 + ((i * 7) % 13) / 100)) }));
})();

const STATUS_MIX = [
  { label: 'Delivered',      value: 8174, color: 'var(--color-primary)',                  pct: 97.2 },
  { label: 'Retried & sent', value: 162,  color: 'var(--color-accent)',                   pct: 1.9 },
  { label: 'Failed',         value: 51,   color: '#f87171',                               pct: 0.6 },
  { label: 'Blocked (DNC)',  value: 25,   color: '#cbd5e1',                               pct: 0.3 },
];

const FAILURE_REASONS = [
  { reason: 'Busy / no answer',       count: 27, share: 0.53, note: 'Avg 3 retries before success', tone: 'amber' },
  { reason: 'Bad number',             count: 12, share: 0.24, note: 'Returned by carrier',          tone: 'rose' },
  { reason: 'Receiver out of paper',  count: 6,  share: 0.12, note: 'Confirmed via callback',       tone: 'amber' },
  { reason: 'TLS handshake failed',   count: 4,  share: 0.08, note: 'Receiver cert invalid',        tone: 'rose' },
  { reason: 'Other',                  count: 2,  share: 0.04, note: '—',                            tone: 'slate' },
];

const TOP_DESTINATIONS = [
  { org: 'BlueShield Prior Auth',    number: '+1 (888) 555-0903', count: 412, pages: 1602, rate: 99.5 },
  { org: 'Aetna Claims',             number: '+1 (800) 555-2840', count: 387, pages: 1394, rate: 99.0 },
  { org: 'Pacific Lab Diagnostics',  number: '+1 (206) 555-1180', count: 311, pages: 1284, rate: 99.7 },
  { org: 'Swedish Medical Records',  number: '+1 (206) 555-7711', count: 268, pages: 988,  rate: 98.1 },
  { org: 'Group Health · Referrals', number: '+1 (425) 555-3322', count: 214, pages: 742,  rate: 99.2 },
  { org: "Dr. Rivera's Office",      number: '+1 (253) 555-4099', count: 188, pages: 612,  rate: 99.5 },
];

const TEAM_LEADERBOARD = [
  { who: 'Dr. M. Greaves', role: 'Cardiology',   tone: 'teal',    sent: 612, rate: 99.8, pages: 2387, fastest: true },
  { who: 'Amelia Park',    role: 'Admin',         tone: 'amber',   sent: 487, rate: 99.4, pages: 1894 },
  { who: 'Kelly Liu',      role: 'Front desk',    tone: 'violet',  sent: 412, rate: 98.9, pages: 1208 },
  { who: 'Reception',      role: 'Shared',        tone: 'slate',   sent: 388, rate: 99.5, pages: 1011 },
  { who: 'Dr. C. Rivera',  role: 'Internal med',  tone: 'emerald', sent: 295, rate: 99.7, pages: 1418 },
  { who: 'Billing team',   role: 'Shared',        tone: 'slate',   sent: 244, rate: 99.0, pages: 803 },
];

const NUMBER_PERF = [
  { number: '+1 (206) 555-0142', label: 'Main · Cardiology', in: 1284, out: 3110, rate: 99.4 },
  { number: '+1 (206) 555-0188', label: 'Records',            in: 920,  out: 1922, rate: 99.1 },
  { number: '+1 (888) 555-0220', label: 'Toll-free intake',   in: 612,  out: 0,    rate: 99.7 },
];

const HEATMAP = (() => {
  const rows = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const HOURS = 16;
  const data = rows.map((d, r) => {
    const weekend = r >= 5;
    return Array.from({ length: HOURS }, (_, h) => {
      const hour = h + 6;
      const peak = weekend ? 0.12 : 0.95;
      const dist = Math.abs(hour - (weekend ? 10 : 11));
      const v = Math.max(0.04, peak * Math.exp(-Math.pow(dist / (weekend ? 4 : 4.2), 2)));
      return Math.min(1, v + ((r * 13 + h * 7) % 11) / 220);
    });
  });
  const hourLabels = ['6a','','8a','','10a','','12p','','2p','','4p','','6p','','8p',''];
  return { rows, hourLabels, data };
})();

// ── Local sub-components ─────────────────────────────────────────────────────

function HelpTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          width: 16, height: 16,
          background: 'var(--color-primary-subtle)',
          color: 'var(--color-primary)',
          border: 'none',
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >?</button>
      {show && (
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 6,
          zIndex: 50,
          background: 'var(--color-surface-dark)',
          color: 'white',
          fontFamily: 'Sora, sans-serif',
          fontSize: 12,
          lineHeight: 1.5,
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          maxWidth: 220,
          boxShadow: 'var(--shadow-modal)',
          pointerEvents: 'none',
          whiteSpace: 'normal',
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function SectionHeader({ title, tip, subtitle, action }: { title: string; tip: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
          {title} <HelpTip text={tip} />
        </h2>
        {subtitle && <p className="text-[13.5px] text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-[12.5px] px-3 py-1.5 rounded-xl font-semibold transition-all ${active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
      {children}
    </button>
  );
}

function Delta({ trend, children }: { trend?: 'up' | 'down'; children: React.ReactNode }) {
  if (!trend) return <span className="text-[11.5px] text-slate-500">{children}</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-medium ${trend === 'up' ? 'text-emerald-700' : 'text-rose-700'}`}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {trend === 'up' ? <path d="M3 8.5 6.5 5 9 7" /> : <path d="M3 3.5 6.5 7 9 5" />}
      </svg>
      {children}
    </span>
  );
}

function VolumeChart({ data, height = 220 }: { data: { day: number; out: number; in: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.out + d.in));
  const W = 100, padL = 4, padR = 4, H = 100;
  const bandW = (W - padL - padR) / data.length;
  const barW = bandW * 0.55;
  const ticks = [0, Math.round(max * 0.5), max];
  return (
    <div className="relative">
      <div className="flex">
        <div className="flex flex-col justify-between text-[10.5px] text-slate-400 font-mono pr-3 select-none" style={{ height }}>
          {[...ticks].reverse().map((t, i) => <span key={i}>{t}</span>)}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="flex-1 block" style={{ height }}>
          {ticks.map((t, i) => {
            const y = H - (t / max) * (H - 8) - 4;
            return <line key={i} x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.18" strokeDasharray={t === 0 ? '0' : '0.6 0.6'} />;
          })}
          {data.map((d, i) => {
            const x = padL + i * bandW + (bandW - barW) / 2;
            const outH = (d.out / max) * (H - 8);
            const inH = (d.in / max) * (H - 8);
            const baseY = H - 4;
            return (
              <g key={i}>
                <rect x={x} y={baseY - inH} width={barW} height={inH} fill="var(--color-accent)" rx="0.4" />
                <rect x={x} y={baseY - inH - outH} width={barW} height={outH} fill="var(--color-primary)" rx="0.4" />
                {i === data.length - 1 && (
                  <rect x={x - 0.3} y={baseY - inH - outH - 0.6} width={barW + 0.6} height={inH + outH + 0.6} fill="none" stroke="var(--color-primary)" strokeWidth="0.25" rx="0.5" />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="pl-9 flex justify-between text-[10.5px] text-slate-400 font-mono mt-2">
        {[1,5,10,15,20,25,30].map(d => <span key={d}>Apr {d}</span>)}
      </div>
    </div>
  );
}

function Donut({ data, size = 168, thickness = 22, centerLabel, centerValue }: {
  data: { label: string; value: number; color: string; pct: number }[];
  size?: number; thickness?: number; centerLabel: string; centerValue: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - thickness / 2;
  const C = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {data.map((d, i) => {
          const seg = C * (d.value / total);
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={d.color} strokeWidth={thickness}
              strokeDasharray={`${seg} ${C - seg}`} strokeDashoffset={-off}
              strokeLinecap="butt" />
          );
          off += seg;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{centerLabel}</div>
        <div className="text-[30px] font-semibold text-slate-900 tracking-tight mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>{centerValue}</div>
      </div>
    </div>
  );
}

function Heatmap({ rows, hourLabels, data }: { rows: string[]; hourLabels: string[]; data: number[][] }) {
  const [hovered, setHovered] = useState<{ ri: number; ci: number } | null>(null);
  const color = (v: number) => `rgba(61, 80, 128, ${0.06 + 0.94 * Math.max(0.04, v)})`;
  return (
    <div className="overflow-hidden">
      <div className="flex pl-[40px] gap-[3px] mb-2">
        {hourLabels.map((h, i) => <div key={i} className="flex-1 text-[10.5px] text-slate-400 font-mono text-center">{h}</div>)}
      </div>
      {data.map((row, ri) => (
        <div key={ri} className="flex items-center gap-[3px] mb-[3px]">
          <div className="w-[36px] text-[11px] text-slate-500 font-medium pr-1">{rows[ri]}</div>
          {row.map((v, ci) => {
            const hour = ci + 6;
            const hourLabel = hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`;
            const fakeCount = Math.round(v * 50);
            const isHovered = hovered?.ri === ri && hovered?.ci === ci;
            return (
              <div
                key={ci}
                className="flex-1 aspect-square rounded-[3px]"
                style={{ background: color(v), position: 'relative' }}
                onMouseEnter={() => setHovered({ ri, ci })}
                onMouseLeave={() => setHovered(null)}
              >
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 4,
                    zIndex: 50,
                    background: 'var(--color-surface-dark)',
                    color: 'white',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 11,
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    {rows[ri]} {hourLabel} · {fakeCount} faxes
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
        <span>Low</span>
        <div className="h-2.5 flex-1 max-w-[160px] rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-primary-subtle), var(--color-primary))' }} />
        <span>High</span>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState('30 days');
  const [scope, setScope] = useState('All numbers');

  return (
    <div>
      {/* Header */}
      <div className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">ANALYTICS · LAST 30 DAYS</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
              style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>
              Usage and delivery insights.
            </h1>
            <p className="text-[14px] text-slate-500 mt-2">Volume trends, delivery performance, and team activity across all your numbers.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton
              variant="secondary"
              icon={<I.Calendar size={14} />}
              iconRight={<I.ChevronDown size={12} />}
              style={{ transition: 'background var(--duration-fast)' }}
              onMouseEnter={(e: any) => { e.currentTarget.style.background = 'var(--color-primary-subtle)'; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.background = ''; }}
            >{range}</AppButton>
            <AppButton
              variant="secondary"
              icon={<I.Filter size={14} />}
              iconRight={<I.ChevronDown size={12} />}
              style={{ transition: 'background var(--duration-fast)' }}
              onMouseEnter={(e: any) => { e.currentTarget.style.background = 'var(--color-primary-subtle)'; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.background = ''; }}
            >{scope}</AppButton>
            <AppButton
              variant="secondary"
              icon={<I.Download size={14} />}
              style={{ transition: 'background var(--duration-fast)' }}
              onMouseEnter={(e: any) => { e.currentTarget.style.background = 'var(--color-primary-subtle)'; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.background = ''; }}
            >Export CSV</AppButton>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {ANALYTICS_KPIS.map((s, i) => {
          const Ico = I[s.icon as keyof typeof I];
          return (
            <div
              key={i}
              className={`rounded-[28px] bg-white/85 backdrop-blur-[14px] border border-white/85 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)] p-5 flex flex-col gap-3 ${i === 0 ? 'ring-1 ring-[var(--color-border-strong)]' : ''}`}
              style={{ transition: 'transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-panel)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">{s.label}</span>
                  <HelpTip text={KPI_TIPS[i]} />
                </div>
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center ${i === 0 ? 'text-white' : 'bg-slate-50 text-slate-500'}`}
                  style={i === 0 ? { background: 'var(--color-primary)' } : undefined}>
                  <Ico size={14} />
                </span>
              </div>
              <div className="text-[28px] leading-none font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{s.value}</div>
              <Delta trend={s.trend}>{s.helper}</Delta>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Volume trend */}
          <Card className="p-6">
            <SectionHeader
              title="Volume trend"
              tip="Daily fax volume. Solid bars are outbound, lighter bars are inbound. Weekends shown in muted color."
              subtitle="Daily outbound (solid) and inbound (soft). Weekends visible at glance."
              action={
                <div className="flex items-center gap-1">
                  {['7 days','30 days','90 days','YTD'].map(r => (
                    <Tab key={r} active={range === r} onClick={() => setRange(r)}>{r}</Tab>
                  ))}
                </div>
              }
            />
            <div className="mt-6"><VolumeChart data={DAILY_VOLUME} height={220} /></div>
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-4 gap-6">
              {[
                { label: 'Outbound', value: '6,936', delta: '+12%', trend: 'up' as const },
                { label: 'Inbound',  value: '1,476', delta: '+6%',  trend: 'up' as const },
                { label: 'Busiest day', value: 'Apr 30', sub: '· 372' },
                { label: 'Quietest',    value: 'Apr 06', sub: '· 80' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">{item.label}</div>
                  <div className="text-[20px] font-semibold text-slate-900 mt-1 flex items-baseline gap-2">
                    {item.value}
                    {'delta' in item && item.delta ? <Delta trend={item.trend}>{item.delta}</Delta> : null}
                    {'sub' in item && item.sub ? <span className="text-slate-400 font-normal text-[14px]">{item.sub}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Heatmap */}
          <Card className="p-6">
            <SectionHeader
              title="When you fax"
              tip="Outbound send activity by hour and day of week. Darker cells = higher volume. Useful for staffing decisions."
              subtitle="Outbound activity by hour and weekday. Useful for staffing the queue."
              action={<Pill tone="teal">Pacific Time</Pill>}
            />
            <div className="mt-6"><Heatmap {...HEATMAP} /></div>
            <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-6">
              <div>
                <div className="text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">Peak hour</div>
                <div className="text-[18px] font-semibold text-slate-900 mt-1">Tue 11a <span className="text-slate-400 font-normal text-[13px]">· 47/wk</span></div>
              </div>
              <div>
                <div className="text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">Weekend share</div>
                <div className="text-[18px] font-semibold text-slate-900 mt-1">8.4%</div>
              </div>
              <div>
                <div className="text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">After-hours sends</div>
                <div className="text-[18px] font-semibold text-slate-900 mt-1">112 <span className="text-slate-400 font-normal text-[13px]">· auto-queued</span></div>
              </div>
            </div>
          </Card>

          {/* Top destinations */}
          <Card className="p-6">
            <SectionHeader
              title="Top destinations"
              tip="The recipients your workspace faxes most frequently, ranked by volume over the selected period."
              subtitle="Where your outbound traffic is going."
              action={
                <AppButton
                  variant="ghost"
                  size="sm"
                  style={{ transition: 'color var(--duration-fast)' }}
                  onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.color = ''; }}
                >View all 84</AppButton>
              }
            />
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/70">
                    {['Recipient','Number','Faxes','Pages','Delivery',''].map((h, i) => (
                      <th key={i} className={`px-4 py-3 font-semibold ${['Faxes','Pages','Delivery'].includes(h) ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_DESTINATIONS.map((d, i) => {
                    const maxCount = TOP_DESTINATIONS[0].count;
                    return (
                      <tr
                        key={i}
                        className="border-t border-slate-100 group transition"
                        style={{ transition: 'background var(--duration-fast)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-subtle)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{d.org}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[12px]">{d.number}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full" style={{ width: `${(d.count / maxCount) * 100}%`, background: 'var(--color-primary)' }} />
                            </div>
                            <span className="text-slate-900 font-semibold font-mono">{d.count}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700 font-mono">{d.pages.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-mono font-semibold ${d.rate >= 99.5 ? 'text-emerald-700' : d.rate >= 99 ? 'text-slate-900' : 'text-amber-700'}`}>
                            {d.rate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-900 transition">
                            <I.Chevron size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Status donut */}
          <Card className="p-6">
            <SectionHeader
              title="Delivery breakdown"
              tip="Outcome distribution for all outbound faxes. Retried & sent means it failed once but succeeded on retry."
              subtitle="Last 30 days · all numbers."
            />
            <div className="mt-5 flex justify-center">
              <Donut data={STATUS_MIX} centerLabel="Delivered" centerValue="99.1%" />
            </div>
            <div className="mt-5 space-y-2">
              {STATUS_MIX.map(s => (
                <div key={s.label} className="flex items-center gap-3 text-[12.5px]">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                  <span className="flex-1 text-slate-700">{s.label}</span>
                  <span className="text-slate-900 font-mono font-semibold">{s.value.toLocaleString()}</span>
                  <span className="text-slate-400 font-mono w-12 text-right">{s.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Failure reasons */}
          <Card className="p-6">
            <SectionHeader
              title="Why faxes failed"
              tip="Root causes for faxes that failed permanently after all retries were exhausted."
              subtitle="51 failures · 0.6% of volume. Most resolved on retry."
              action={
                <AppButton
                  variant="ghost"
                  size="sm"
                  style={{ transition: 'color var(--duration-fast)' }}
                  onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.color = ''; }}
                >Audit</AppButton>
              }
            />
            <div className="mt-5 space-y-3.5">
              {FAILURE_REASONS.map((f, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[13.5px] font-medium text-slate-900 flex-1">{f.reason}</span>
                    <span className="text-[13px] font-mono font-semibold text-slate-900">{f.count}</span>
                    <span className="text-[11.5px] font-mono text-slate-400 w-10 text-right">{Math.round(f.share * 100)}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${f.share * 100}%`,
                      background: f.tone === 'rose' ? '#f87171' : f.tone === 'amber' ? '#f59e0b' : '#94a3b8',
                    }} />
                  </div>
                  <div className="text-[11.5px] text-slate-500 mt-1">{f.note}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Team leaderboard */}
          <Card className="p-6">
            <SectionHeader
              title="Sender leaderboard"
              tip="Team members ranked by outbound fax volume. Delivery rate shown per sender."
              subtitle="Top 6 senders · last 30 days."
              action={
                <AppButton
                  variant="ghost"
                  size="sm"
                  style={{ transition: 'color var(--duration-fast)' }}
                  onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.color = ''; }}
                >Team</AppButton>
              }
            />
            <div className="mt-4 space-y-1">
              {TEAM_LEADERBOARD.map((m, i) => {
                const maxSent = TEAM_LEADERBOARD[0].sent;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-2 py-1.5 -mx-2"
                    style={{ transition: 'background var(--duration-fast)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-subtle)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    <span className="text-[11px] font-mono text-slate-400 w-4 text-right">{i + 1}</span>
                    <Avatar name={m.who} size={32} tone={m.tone} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-slate-900 truncate">{m.who}</span>
                        {m.fastest && <Pill tone="teal" dot={false}>Fastest</Pill>}
                      </div>
                      <div className="text-[11.5px] text-slate-500">{m.role} · {m.pages.toLocaleString()} pages · {m.rate}%</div>
                      <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full" style={{ width: `${(m.sent / maxSent) * 100}%`, background: 'var(--color-primary)' }} />
                      </div>
                    </div>
                    <span className="text-[13px] font-mono font-semibold text-slate-900 shrink-0">{m.sent}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Numbers performance */}
          <Card className="p-6">
            <SectionHeader
              title="Numbers"
              tip="Inbound and outbound volume breakdown per owned fax number."
              subtitle="In/out volume per owned number."
              action={
                <AppButton
                  variant="ghost"
                  size="sm"
                  style={{ transition: 'color var(--duration-fast)' }}
                  onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.color = ''; }}
                >Manage</AppButton>
              }
            />
            <div className="mt-4 space-y-2">
              {NUMBER_PERF.map((n, i) => {
                const total = n.in + n.out;
                const outPct = total ? (n.out / total) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="rounded-xl px-2 py-2 -mx-2"
                    style={{ transition: 'background var(--duration-fast)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-subtle)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[13px] font-medium text-slate-900">{n.label}</span>
                      <span className="text-[11px] font-mono text-slate-400">{n.number}</span>
                      <span className="ml-auto text-[12px] font-mono font-semibold text-slate-900">{n.rate}%</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                      <div style={{ width: `${outPct}%`, background: 'var(--color-primary)' }} />
                      <div style={{ width: `${100 - outPct}%`, background: 'var(--color-accent)' }} />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--color-primary)' }} /> Out {n.out.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-sm" style={{ background: 'var(--color-accent)' }} /> In {n.in.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Compliance footer */}
          <Card className="p-5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
            <span className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 ring-1 ring-white shadow-sm"
              style={{ color: 'var(--color-primary)' }}>
              <I.Shield size={16} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">Reports are HIPAA-safe</div>
              <div className="text-[11.5px] text-slate-500 mt-0.5">Aggregate counts only · no PHI · BAA on file.</div>
            </div>
            <AppButton
              variant="ghost"
              size="sm"
              style={{ transition: 'color var(--duration-fast)' }}
              onMouseEnter={(e: any) => { e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.color = ''; }}
            >Audit</AppButton>
          </Card>
        </div>
      </div>
    </div>
  );
}
