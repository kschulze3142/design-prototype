'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const PLAN = {
  name: 'Blue Lark Pro', cycle: 'Monthly · billed Mar 1',
  seats: 12, seatsUsed: 9, pages: 5000, pagesUsed: 3127,
  numbers: 8, numbersUsed: 6, storage: 100, storageUsed: 38.4, amount: 348.00,
};

const INVOICES = [
  { id: 'INV-2026-0042', date: 'Mar 1, 2026',  period: 'Feb 1 – Feb 28', amount: 348.00, status: 'Paid',     method: 'Visa •• 4824',   pdf: true },
  { id: 'INV-2026-0031', date: 'Feb 1, 2026',  period: 'Jan 1 – Jan 31', amount: 348.00, status: 'Paid',     method: 'Visa •• 4824',   pdf: true },
  { id: 'INV-2026-0019', date: 'Jan 1, 2026',  period: 'Dec 1 – Dec 31', amount: 412.00, status: 'Paid',     method: 'Visa •• 4824',   pdf: true, note: '+ overage' },
  { id: 'INV-2025-0148', date: 'Dec 1, 2025',  period: 'Nov 1 – Nov 30', amount: 348.00, status: 'Paid',     method: 'ACH · Chase',    pdf: true },
  { id: 'INV-2025-0136', date: 'Nov 1, 2025',  period: 'Oct 1 – Oct 31', amount: 348.00, status: 'Refunded', method: 'Visa •• 4824',   pdf: true },
];
type Invoice = typeof INVOICES[number] & { note?: string };

const USAGE_DAYS = [
  { label: 'Mon', value: 124, highlight: false },
  { label: 'Tue', value: 188, highlight: false },
  { label: 'Wed', value: 142, highlight: false },
  { label: 'Thu', value: 211, highlight: true },
  { label: 'Fri', value: 176, highlight: false },
  { label: 'Sat', value: 38,  highlight: false },
  { label: 'Sun', value: 22,  highlight: false },
];

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? 'var(--color-primary)' : hover ? 'var(--color-primary-subtle)' : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 14px',
        fontFamily: 'Sora, system-ui, sans-serif',
        fontSize: '13px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background var(--duration-fast), color var(--duration-fast)',
      }}
    >
      {children}
    </button>
  );
}

function BarChart({ data, height = 160 }: { data: { label: string; value: number; highlight?: boolean }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="flex items-end gap-2 w-full" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-full flex items-end" style={{ height: height - 24 }}>
            <div className="w-full rounded-t-md transition-all"
              style={{ height: `${(d.value / max) * 100}%`, background: d.highlight ? 'var(--color-primary)' : 'var(--color-primary-subtle)' }} />
          </div>
          <span className="text-[11px] text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/70 ${className}`} style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(10px)' }}>
      {children}
    </div>
  );
}

function DocPreview({ title, from, to, pages }: { title: string; from: string; to: string; pages: number }) {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[32px] -z-10"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(15,23,42,0.04) 0 8px, transparent 8px 16px)', backgroundColor: 'rgba(241,245,249,0.6)' }} />
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100"
          style={{ background: 'linear-gradient(90deg, var(--color-primary-subtle), white)' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
          <span className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: 'var(--color-primary)' }}>{title}</span>
          <span className="ml-auto text-[11px] text-slate-400 font-mono">PG 1/{pages}</span>
        </div>
        <div className="px-7 py-6 space-y-5">
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">From</div>
            <div className="text-[13px] text-slate-900 font-medium">{from}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">To</div>
            <div className="text-[13px] text-slate-900 font-medium">{to}</div>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="space-y-2.5">
            {(['long', 'med', 'long', 'short', 'med', 'long', 'long'] as const).map((w, i) => (
              <div key={i} className="h-2 rounded-full"
                style={{ width: w === 'long' ? '92%' : w === 'med' ? '70%' : '40%', background: 'linear-gradient(90deg, #e2e8f0, #f1f5f9)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageRing({ used, total, label, sub, tone = 'teal', index }: {
  used: number; total: number; label: string; sub: string; tone?: 'teal' | 'emerald' | 'amber' | 'red';
  index: 0 | 1 | 2 | 3;
}) {
  const pct = Math.min(1, used / total);
  const C = 2 * Math.PI * 38;
  const colors: Record<string, string> = { teal: 'var(--color-primary)', emerald: '#10b981', amber: '#f59e0b', red: '#ef4444' };
  const isTopRow = index < 2;
  const isLeftCol = index % 2 === 0;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px 24px',
      borderBottom: isTopRow ? '1px solid var(--color-border)' : undefined,
      borderRight: isLeftCol ? '1px solid var(--color-border)' : undefined,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-tertiary)' }}>{label}</div>
        <div style={{ fontFamily: 'Outfit, system-ui, sans-serif', fontWeight: 600, fontSize: '24px', color: 'var(--color-text-primary)', marginTop: '6px' }}>{used.toLocaleString()} / {total.toLocaleString()}</div>
        <div style={{ fontFamily: 'Sora, system-ui, sans-serif', fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '3px' }}>{sub}</div>
      </div>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="38" stroke="var(--color-border)" strokeWidth="8" fill="none" />
          <circle cx="50" cy="50" r="38" stroke={colors[tone]} strokeWidth="8" strokeLinecap="round" fill="none"
            strokeDasharray={`${C}`} strokeDashoffset={`${C * (1 - pct)}`}
            style={{ transition: 'stroke-dashoffset 800ms ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Outfit, system-ui, sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--color-text-primary)', lineHeight: 1 }}>{Math.round(pct * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [tab, setTab] = useState('overview');
  const [openInvoice, setOpenInvoice] = useState<Invoice | null>(null);
  const [switchHover, setSwitchHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [hoveredInvoice, setHoveredInvoice] = useState<string | null>(null);

  const invoiceTone = (s: string) =>
    s === 'Paid' ? 'emerald' : s === 'Refunded' ? 'slate' : s === 'Failed' ? 'red' : 'amber';

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div className="px-7 py-6 mb-6 flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Billing & usage</div>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
            style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>
            You're in good standing.
          </h1>
          <p className="text-[14px] text-slate-500 mt-2">Track plan limits, page volume, invoices, and your billing settings — all in one place.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <AppButton icon={<I.ArrowUp size={15} />}>Upgrade plan</AppButton>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { id: 'overview',  label: 'Overview' },
          { id: 'invoices',  label: 'Invoices', count: INVOICES.length },
          { id: 'method',    label: 'Payment method' },
          { id: 'limits',    label: 'Limits & overage' },
        ].map(t => (
          <Tab key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
            {'count' in t && t.count != null && (
              <span className={`ml-1.5 text-[11px] ${tab === t.id ? 'text-white/70' : 'text-slate-400'}`}>{t.count}</span>
            )}
          </Tab>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Plan + cost estimate */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="pt-7 px-7 lg:col-span-2">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}>
                    <I.Star size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[20px] font-semibold text-slate-900">{PLAN.name}</span>
                      <Pill tone="teal">Active</Pill>
                    </div>
                    <div className="text-[13px] text-slate-500 mt-0.5">{PLAN.cycle} · Next charge ${PLAN.amount.toFixed(2)} on Apr 1</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AppButton
                    variant="secondary"
                    icon={<I.Refresh size={14} />}
                    onMouseEnter={() => setSwitchHover(true)}
                    onMouseLeave={() => setSwitchHover(false)}
                    style={{
                      color: switchHover ? 'var(--color-primary)' : undefined,
                      transition: 'color var(--duration-fast)',
                      cursor: 'pointer',
                    }}
                  >
                    Switch to annual
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    onMouseEnter={() => setCancelHover(true)}
                    onMouseLeave={() => setCancelHover(false)}
                    style={{
                      color: cancelHover ? 'var(--color-failed)' : undefined,
                      transition: 'color var(--duration-fast)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel plan
                  </AppButton>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '28px', borderTop: '1px solid var(--color-border)' }}>
                <UsageRing index={0} used={PLAN.pagesUsed}   total={PLAN.pages}   label="Pages this cycle" sub="Resets Apr 1"                              tone="teal" />
                <UsageRing index={1} used={PLAN.seatsUsed}   total={PLAN.seats}   label="Team seats"       sub="3 seats available"                         tone="emerald" />
                <UsageRing index={2} used={PLAN.numbersUsed} total={PLAN.numbers} label="Fax numbers"      sub="2 numbers available"                       tone="teal" />
                <UsageRing index={3} used={PLAN.storageUsed} total={PLAN.storage} label="Archive storage"  sub={`${PLAN.storageUsed} GB of ${PLAN.storage} GB`} tone="amber" />
              </div>
            </Card>

            <Card className="p-7 flex flex-col">
              <SectionTitle title="This cycle" subtitle="Mar 1 – Mar 31, 2026" />
              <div className="mt-5 flex-1 space-y-3.5">
                {[
                  ['Plan (Blue Lark Pro)',         '$298.00'],
                  ['Additional numbers (2 × $5)', '$10.00'],
                  ['Toll-free routing',            '$15.00'],
                  ['Archive storage',              '$25.00'],
                ].map(([label, amount]) => (
                  <div key={label} className="flex justify-between text-[14px]">
                    <span className="text-slate-600">{label}</span>
                    <span className="text-slate-900 font-medium">{amount}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    Page overage
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md font-semibold" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>est.</span>
                  </span>
                  <span className="text-slate-400 font-medium">$0.00</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-[13px] text-slate-500">Estimated total</span>
                <span className="text-[34px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>$348.00</span>
              </div>
              <AppButton variant="secondary" className="mt-4 w-full justify-center" icon={<I.Download size={14} />}>Download estimate</AppButton>
            </Card>
          </div>

          {/* Recent invoices preview */}
          <Card className="overflow-hidden">
            <div className="px-7 pt-6 pb-4">
              <SectionTitle title="Recent invoices"
                action={<AppButton variant="ghost" onClick={() => setTab('invoices')}>View all</AppButton>} />
            </div>
            <div className="overflow-auto scrollbar-thin">
              <table className="w-full border-collapse">
                <thead>
                  <tr>{['Invoice','Date','Period','Amount','Status',''].map(h => (
                    <th key={h} className="text-[11.5px] uppercase tracking-[0.06em] text-slate-500 font-semibold px-4 py-3 text-left bg-slate-50/70 border-b border-slate-100">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {INVOICES.slice(0, 3).map(inv => {
                    const isHover = hoveredInvoice === `o-${inv.id}`;
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setOpenInvoice(inv)}
                        onMouseEnter={() => setHoveredInvoice(`o-${inv.id}`)}
                        onMouseLeave={() => setHoveredInvoice(null)}
                        className="border-b border-slate-100 last:border-0"
                        style={{
                          background: isHover ? 'var(--color-primary-subtle)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background var(--duration-fast)',
                        }}
                      >
                        <td className="px-4 py-4 font-mono text-[13px] text-slate-700">{inv.id}</td>
                        <td className="px-4 py-4 text-[14px] text-slate-600">{inv.date}</td>
                        <td className="px-4 py-4 text-[14px] text-slate-500">{inv.period}</td>
                        <td className="px-4 py-4 text-[14px] font-medium text-slate-900">
                          ${inv.amount.toFixed(2)}
                          {'note' in inv && inv.note && <span className="text-[11px] text-amber-600 ml-1">{inv.note}</span>}
                        </td>
                        <td className="px-4 py-4"><Pill tone={invoiceTone(inv.status)}>{inv.status}</Pill></td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={e => e.stopPropagation()}
                            style={{
                              color: isHover ? 'var(--color-primary)' : 'rgb(148 163 184)',
                              transition: 'color var(--duration-fast)',
                              cursor: 'pointer',
                            }}
                          >
                            <I.Download size={15} />
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
      )}

      {/* Invoices tab */}
      {tab === 'invoices' && (
        <div className="space-y-4">
          <Card className="p-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <I.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400"
                placeholder="Search invoice number…" />
            </div>
            <AppButton variant="secondary" size="sm" icon={<I.Calendar size={13} />}>All time</AppButton>
            <AppButton variant="secondary" size="sm" icon={<I.Filter size={13} />}>All statuses</AppButton>
            <div className="flex-1" />
            <AppButton variant="secondary" size="sm" icon={<I.Download size={13} />}>Export CSV</AppButton>
          </Card>
          <Card className="overflow-hidden">
            <div className="overflow-auto scrollbar-thin">
              <table className="w-full border-collapse">
                <thead>
                  <tr>{['','Invoice','Date','Period','Method','Amount','Status',''].map((h, i) => (
                    <th key={i} className="text-[11.5px] uppercase tracking-[0.06em] text-slate-500 font-semibold px-4 py-3 text-left bg-slate-50/70 border-b border-slate-100">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {INVOICES.map(inv => {
                    const isHover = hoveredInvoice === `i-${inv.id}`;
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setOpenInvoice(inv)}
                        onMouseEnter={() => setHoveredInvoice(`i-${inv.id}`)}
                        onMouseLeave={() => setHoveredInvoice(null)}
                        className="border-b border-slate-100 last:border-0"
                        style={{
                          background: isHover ? 'var(--color-primary-subtle)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background var(--duration-fast)',
                        }}
                      >
                        <td className="px-4 py-4"><input type="checkbox" onClick={e => e.stopPropagation()} style={{ accentColor: 'var(--color-primary)' }} /></td>
                        <td className="px-4 py-4 font-mono text-[13px] text-slate-700">{inv.id}</td>
                        <td className="px-4 py-4 text-[14px] text-slate-600">{inv.date}</td>
                        <td className="px-4 py-4 text-[14px] text-slate-500">{inv.period}</td>
                        <td className="px-4 py-4 text-[13px] text-slate-600">{inv.method}</td>
                        <td className="px-4 py-4 text-[14px] font-medium text-slate-900">${inv.amount.toFixed(2)}</td>
                        <td className="px-4 py-4"><Pill tone={invoiceTone(inv.status)}>{inv.status}</Pill></td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700" onClick={e => { e.stopPropagation(); setOpenInvoice(inv); }}><I.Eye size={15} /></button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-slate-100"
                              onClick={e => e.stopPropagation()}
                              style={{
                                color: isHover ? 'var(--color-primary)' : 'rgb(148 163 184)',
                                transition: 'color var(--duration-fast)',
                                cursor: 'pointer',
                              }}
                            >
                              <I.Download size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Payment method tab */}
      {tab === 'method' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-7 lg:col-span-2">
            <SectionTitle title="Payment methods" subtitle="Default is charged automatically each cycle." />
            <div className="mt-6 space-y-3">
              {[
                { brand: 'Visa', last: '4824',          exp: '07/27',    default: true,  name: 'Northwind Health · Operations' },
                { brand: 'ACH',  last: 'Chase · 9921',  exp: 'Verified', default: false, name: 'Backup ACH' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200/70 bg-white/70">
                  <div className="w-12 h-9 rounded-md text-white text-[11px] font-bold flex items-center justify-center tracking-wider"
                    style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>{m.brand}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-slate-900 flex items-center gap-2">
                      {m.name} {m.default && <Pill tone="teal">Default</Pill>}
                    </div>
                    <div className="text-[12.5px] text-slate-500">•• {m.last} · Exp {m.exp}</div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700"><I.More size={16} /></button>
                </div>
              ))}
              <button className="w-full p-4 rounded-2xl border border-dashed border-slate-300 text-[13px] font-medium text-slate-600 hover:border-slate-400 transition flex items-center justify-center gap-2">
                <I.Plus size={14} /> Add payment method
              </button>
            </div>
          </Card>
          <Card className="p-7">
            <SectionTitle title="Billing contact" subtitle="Receipts and dunning notices go here." />
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Contact</label>
                <input className="w-full mt-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--color-primary)]"
                  defaultValue="finance@northwindhealth.example" />
              </div>
              <div>
                <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Tax ID / VAT</label>
                <input className="w-full mt-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--color-primary)]"
                  defaultValue="EIN 88-3902471" />
              </div>
              <div>
                <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Address</label>
                <textarea className="w-full mt-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--color-primary)] resize-none h-24"
                  defaultValue={'Northwind Health, Inc.\n410 Linden Ave, Suite 220\nSeattle, WA 98109'} />
              </div>
              <AppButton variant="secondary" className="w-full justify-center">Save changes</AppButton>
            </div>
          </Card>
        </div>
      )}

      {/* Limits tab */}
      {tab === 'limits' && (
        <div className="space-y-6">
          <Card className="p-7">
            <SectionTitle title="Plan limits" subtitle="What's included in Blue Lark Pro and how overage is billed." />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {[
                { label: 'Pages per cycle',   val: '5,000',    over: '$0.04 / page after limit' },
                { label: 'Team seats',        val: '12',       over: '$8 / seat / mo' },
                { label: 'Fax numbers',       val: '8',        over: '$5 / number / mo' },
                { label: 'Archive storage',   val: '100 GB',   over: '$0.30 / GB / mo' },
                { label: 'API calls',         val: 'Unlimited',over: 'Fair-use 50 req/sec' },
                { label: 'Retention',         val: '7 years',  over: 'Configurable per number' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-[14px] font-medium text-slate-900">{row.label}</div>
                    <div className="text-[12.5px] text-slate-500 mt-0.5">{row.over}</div>
                  </div>
                  <div className="text-[24px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>{row.val}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-7" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex-1 min-w-[260px]">
                <div className="text-[12px] uppercase tracking-wider font-bold" style={{ color: 'var(--color-primary)' }}>Save 18% annually</div>
                <div className="text-[28px] font-semibold text-slate-900 mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>Switch to annual billing</div>
                <div className="text-[13.5px] text-slate-600 mt-1.5 max-w-md">Lock in your rate, eliminate surprise overage with rollover pages, and get priority HIPAA support.</div>
              </div>
              <AppButton>Compare plans</AppButton>
            </div>
          </Card>
        </div>
      )}

      {/* Invoice modal */}
      {openInvoice && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-6" onClick={() => setOpenInvoice(null)}>
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]" />
          <div className="relative w-[860px] max-w-full max-h-[88vh] overflow-hidden flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[14px] border border-white/85 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.35)]"
            onClick={e => e.stopPropagation()}>
            <div className="relative p-7 pb-5 border-b border-slate-100" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
              <button onClick={() => setOpenInvoice(null)} className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-slate-500"><I.X size={16} /></button>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Invoice</div>
                    <span className="font-mono text-[12.5px] text-slate-600">{openInvoice.id}</span>
                  </div>
                  <div className="text-[40px] leading-none font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>${openInvoice.amount.toFixed(2)}</div>
                  <div className="text-[13px] text-slate-500 mt-2">Issued {openInvoice.date} · {openInvoice.period}</div>
                </div>
                <Pill tone={invoiceTone(openInvoice.status)}>{openInvoice.status}</Pill>
              </div>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin grid grid-cols-12 gap-6 p-7">
              <div className="col-span-12 md:col-span-7">
                <DocPreview title={`Invoice ${openInvoice.id}`} from="Blue Lark, Inc." to="Northwind Health · Finance" pages={1} />
              </div>
              <div className="col-span-12 md:col-span-5 space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Summary</div>
                  <SoftCard className="p-4 space-y-2.5 text-[13px]">
                    {[['Plan','Blue Lark Pro'],['Period',openInvoice.period],['Method',openInvoice.method],['Tax','$0.00']].map(([k,v]) => (
                      <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="text-slate-900">{v}</span></div>
                    ))}
                    <div className="h-px bg-slate-100 my-1" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-900">Total</span>
                      <span className="text-slate-900 font-mono">${openInvoice.amount.toFixed(2)}</span>
                    </div>
                  </SoftCard>
                </div>
                <SoftCard className="p-4 flex items-start gap-3">
                  <I.Lock size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div className="text-[12.5px] text-slate-600 leading-relaxed">Charged automatically on the 1st of each month. Update your method anytime under Payment method.</div>
                </SoftCard>
              </div>
            </div>
            <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <AppButton variant="secondary" size="sm" icon={<I.Download size={13} />}>Download PDF</AppButton>
                <AppButton variant="secondary" size="sm" icon={<I.Forward size={13} />}>Email copy</AppButton>
              </div>
              <AppButton variant="secondary" onClick={() => setOpenInvoice(null)}>Close</AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
