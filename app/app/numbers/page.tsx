'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const NUMBERS = [
  { id: 'n-001', number: '+1 (206) 555-0142', label: 'Cardiology — Floor 3',     type: 'Local',     area: 'Seattle, WA',   callerId: 'NORTHWIND CARDIO',    assignee: 'Dr. M. Greaves',  assigneeTone: 'teal',   team: 'Cardiology',   sentMonth: 312, receivedMonth: 84,  cost: 0, status: 'Active',          statusTone: 'emerald', primary: true,  monthlyTrend: [3,5,4,7,6,9,8,11,9,12,10,14] },
  { id: 'n-002', number: '+1 (206) 555-0319', label: 'Front desk · Main',        type: 'Local',     area: 'Seattle, WA',   callerId: 'NORTHWIND HEALTH',    assignee: 'Reception',       assigneeTone: 'slate',  team: 'Reception',    sentMonth: 142, receivedMonth: 188, cost: 0, status: 'Active',          statusTone: 'emerald', primary: false, monthlyTrend: [4,6,5,8,6,7,9,8,10,9,11,10] },
  { id: 'n-003', number: '+1 (888) 555-0903', label: 'Toll-free · Patient line', type: 'Toll-free', area: 'Nationwide',    callerId: 'NORTHWIND HEALTH',    assignee: 'Auto-route',      assigneeTone: 'violet', team: 'All teams',    sentMonth: 88,  receivedMonth: 142, cost: 5, status: 'Active',          statusTone: 'emerald', primary: false, monthlyTrend: [2,4,3,5,4,6,5,7,6,8,7,9] },
  { id: 'n-004', number: '+1 (206) 555-0144', label: 'Cardiology Fellow',        type: 'Local',     area: 'Seattle, WA',   callerId: 'NORTHWIND CARDIO',    assignee: 'Dr. P. Khanna',   assigneeTone: 'teal',   team: 'Cardiology',   sentMonth: 41,  receivedMonth: 18,  cost: 0, status: 'Active',          statusTone: 'emerald', primary: false, monthlyTrend: [1,2,2,3,2,4,3,4,3,5,4,4] },
  { id: 'n-005', number: '+1 (206) 555-0148', label: 'Endocrinology',            type: 'Local',     area: 'Seattle, WA',   callerId: 'NORTHWIND ENDO',      assignee: 'Dr. T. Iwasaki',  assigneeTone: 'amber',  team: 'Endocrinology',sentMonth: 64,  receivedMonth: 31,  cost: 0, status: 'Active',          statusTone: 'emerald', primary: false, monthlyTrend: [2,3,2,3,3,4,3,5,4,5,4,6] },
  { id: 'n-006', number: '+1 (425) 555-7710', label: 'Bellevue clinic',          type: 'Local',     area: 'Bellevue, WA',  callerId: 'NORTHWIND BELLEVUE',  assignee: 'Bellevue staff',  assigneeTone: 'slate',  team: 'Bellevue',     sentMonth: 28,  receivedMonth: 22,  cost: 0, status: 'Active',          statusTone: 'emerald', primary: false, monthlyTrend: [1,1,2,2,1,3,2,3,2,3,2,3] },
  { id: 'n-007', number: '+1 (877) 555-2210', label: 'Records line',             type: 'Toll-free', area: 'Nationwide',    callerId: 'NORTHWIND RECORDS',   assignee: 'Records team',    assigneeTone: 'violet', team: 'Records',      sentMonth: 12,  receivedMonth: 34,  cost: 5, status: 'Port-in pending', statusTone: 'amber',   primary: false, monthlyTrend: [0,0,0,1,1,2,2,3,3,4,4,5], portProgress: 0.6, portETA: 'Apr 3' },
  { id: 'n-008', number: '+1 (206) 555-2840', label: 'Legacy line',              type: 'Local',     area: 'Seattle, WA',   callerId: 'NORTHWIND HEALTH',    assignee: 'Unassigned',      assigneeTone: 'slate',  team: '—',            sentMonth: 4,   receivedMonth: 2,   cost: 0, status: 'Inactive',        statusTone: 'slate',   primary: false, monthlyTrend: [3,3,2,2,1,1,1,1,0,0,0,0] },
];
type FaxNumber = typeof NUMBERS[number];

const PORT_STEPS = [
  { id: 'submit',  title: 'Port request submitted',                desc: 'LOA signed and submitted to FaxGrid.',           when: 'Mar 18, 2026' },
  { id: 'accept',  title: 'Carrier accepted',                      desc: 'Receiving carrier confirmed eligibility.',       when: 'Mar 19, 2026' },
  { id: 'verify',  title: 'Documents verified',                    desc: 'CSR matched account details and authorization.', when: 'Mar 21, 2026' },
  { id: 'release', title: 'Awaiting release from previous carrier',desc: 'Pending CenturyLink release confirmation.',      when: 'In progress' },
  { id: 'live',    title: 'Number live on FaxGrid',                desc: 'Routing activates within 30 minutes of release.',when: 'ETA Apr 3, 2026' },
];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'rgba(204,251,241,0.6)', fg: 'var(--accent-deep)', dot: 'var(--accent)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label, helper }: { checked: boolean; onChange: (v: boolean) => void; label: string; helper?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <span onClick={() => onChange(!checked)} className="inline-flex shrink-0 mt-0.5 w-9 h-5 rounded-full transition relative" style={{ background: checked ? 'var(--accent)' : '#cbd5e1' }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: checked ? '18px' : '2px' }} />
      </span>
      <span>
        <span className="block text-[13.5px] font-medium text-slate-900">{label}</span>
        {helper && <span className="block text-[12.5px] text-slate-500 mt-0.5">{helper}</span>}
      </span>
    </label>
  );
}

function Sparkline({ data, w = 92, h = 28 }: { data: number[]; w?: number; h?: number }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${h - ((v - min) / span) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
              style={{ height: `${(d.value / max) * 100}%`, background: d.highlight ? 'var(--accent)' : 'rgba(15,118,110,0.18)' }} />
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

function NumberCard({ n, onOpen }: { n: FaxNumber; onOpen: () => void }) {
  const isPort = n.status === 'Port-in pending';
  const isInactive = n.status === 'Inactive';
  const stripBg = isPort
    ? 'linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)'
    : isInactive
    ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    : 'linear-gradient(135deg, rgba(204,251,241,0.5) 0%, rgba(240,253,244,0.7) 100%)';

  const st = STATUS_TONES[n.statusTone] || STATUS_TONES.slate;
  const at = STATUS_TONES[n.assigneeTone] || STATUS_TONES.teal;

  return (
    <button
      onClick={onOpen}
      className="text-left rounded-[20px] border border-slate-200/80 bg-white/85 backdrop-blur-[14px] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)] transition hover:border-[var(--accent)] hover:shadow-[0_20px_40px_-30px_rgba(15,23,42,0.25)] flex flex-col min-h-[300px] overflow-hidden w-full"
    >
      {/* Top strip */}
      <div className="p-5 relative" style={{ background: stripBg }}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Pill tone={n.type === 'Toll-free' ? 'amber' : 'teal'} dot={false}>{n.type}</Pill>
            {n.primary && <Pill tone="emerald" dot={false}>Primary</Pill>}
          </div>
          <Pill tone={n.statusTone} dot>{n.status}</Pill>
        </div>
        <div className="font-mono text-[18px] font-semibold text-slate-900 tracking-tight">{n.number}</div>
        <div className="text-[12.5px] text-slate-500 mt-0.5">{n.label}</div>
      </div>

      {/* Detail rows */}
      <div className="px-5 pt-4 pb-3 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Area</div>
            <div className="text-[13px] text-slate-700 mt-0.5">{n.area}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Caller ID</div>
            <div className="text-[13px] text-slate-700 mt-0.5 font-mono text-[12px]">{n.callerId}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Routes to</div>
            <div className="flex items-center gap-2 mt-0.5">
              <Avatar name={n.assignee} size={22} tone={n.assigneeTone} />
              <span className="text-[13px] text-slate-700">{n.assignee}</span>
              <span className="text-[11.5px] text-slate-400">· {n.team}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-5 pb-4 border-t border-slate-100 pt-3">
        {isPort && 'portProgress' in n && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11.5px] text-amber-600 font-semibold">Porting in progress</span>
              <span className="text-[11.5px] text-slate-500">ETA {(n as any).portETA}</span>
            </div>
            <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
              <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${((n as any).portProgress) * 100}%` }} />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 mb-1">This month</div>
            <div className="flex items-center gap-3">
              <span className="text-[12.5px] text-slate-600"><span className="font-semibold text-slate-800">{n.sentMonth}</span> sent</span>
              <span className="text-[12.5px] text-slate-600"><span className="font-semibold text-slate-800">{n.receivedMonth}</span> recv</span>
            </div>
          </div>
          <Sparkline data={n.monthlyTrend} />
        </div>
      </div>
    </button>
  );
}

function NumberDetailModal({ n, onClose }: { n: FaxNumber | null; onClose: () => void }) {
  const [tab, setTab] = useState('Routing');
  const [emailToggle, setEmailToggle] = useState(true);
  const [slackToggle, setSlackToggle] = useState(true);
  const [smsToggle, setSmsToggle] = useState(false);
  const [holdToggle, setHoldToggle] = useState(false);

  if (!n) return null;

  const chartData = MONTHS.map((label, i) => ({
    label,
    value: n.monthlyTrend[i],
    highlight: i >= 9,
  }));

  const tabs = ['Routing', 'Usage', 'Schedule', 'Identity'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[860px] max-h-[88vh] flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[20px] border border-white/70 shadow-[0_32px_80px_-16px_rgba(15,23,42,0.4)] overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-7 pb-5" style={{ background: 'linear-gradient(135deg, rgba(204,251,241,0.6) 0%, rgba(240,253,250,0.4) 100%)' }}>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-500 hover:bg-white/90 transition">
            <I.X size={14} />
          </button>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))', color: 'white' }}>
              <I.Numbers size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[26px] font-semibold text-slate-900 tracking-tight">{n.number}</div>
              <div className="text-[13.5px] text-slate-500 mt-0.5">{n.label}</div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Pill tone={n.type === 'Toll-free' ? 'amber' : 'teal'} dot={false}>{n.type}</Pill>
                <Pill tone={n.statusTone} dot>{n.status}</Pill>
                {n.primary && <Pill tone="emerald" dot={false}>Primary</Pill>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AppButton variant="secondary" size="sm" icon={<I.Send size={13} />}>Send test</AppButton>
              <AppButton variant="secondary" size="sm" icon={<I.Cog size={13} />}>Settings</AppButton>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-1 mt-5">
            {tabs.map(t => <Tab key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Tab>)}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          {tab === 'Routing' && (
            <>
              <div>
                <div className="text-[13px] font-semibold text-slate-700 mb-3">Inbound routing rules</div>
                <div className="space-y-2">
                  {[
                    { match: 'Subject contains "Auth"', team: 'Authorizations team', tone: 'amber' },
                    { match: 'From insurance carriers', team: 'Billing team', tone: 'amber' },
                    { match: 'All other inbound', team: n.assignee, tone: n.assigneeTone },
                  ].map((rule, i) => (
                    <SoftCard key={i} className="p-3.5 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0" style={{ background: 'var(--accent)', color: 'white' }}>{i + 1}</span>
                      <span className="text-[13px] text-slate-600 flex-1">If <span className="font-medium text-slate-900">{rule.match}</span></span>
                      <I.Arrow size={13} className="text-slate-400 shrink-0" />
                      <Pill tone={rule.tone} dot={false}>{rule.team}</Pill>
                    </SoftCard>
                  ))}
                </div>
                <button className="mt-2 text-[12.5px] font-semibold hover:underline flex items-center gap-1" style={{ color: 'var(--accent-deep)' }}>
                  <I.Plus size={12} strokeWidth={2.4} /> Add rule
                </button>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-700 mb-3">Notifications</div>
                <SoftCard className="p-4 space-y-4">
                  <Toggle checked={emailToggle} onChange={setEmailToggle} label="Email on inbound" helper="Send an email when a new fax arrives on this line." />
                  <Toggle checked={slackToggle} onChange={setSlackToggle} label="Slack alerts" helper="Post to #fax-alerts channel on new inbound." />
                  <Toggle checked={smsToggle} onChange={setSmsToggle} label="SMS for failed sends" helper="Text the assignee when an outbound fax fails." />
                </SoftCard>
              </div>
            </>
          )}

          {tab === 'Usage' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Sent · 30d', value: n.sentMonth },
                  { label: 'Received · 30d', value: n.receivedMonth },
                  { label: 'Avg pages', value: '2.3' },
                  { label: 'Cost / mo', value: n.cost > 0 ? `$${n.cost}` : 'Included' },
                ].map(s => (
                  <SoftCard key={s.label} className="p-4">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{s.label}</div>
                    <div className="text-[28px] font-semibold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-inter-tight), system-ui' }}>{s.value}</div>
                  </SoftCard>
                ))}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-700 mb-4">12-month activity</div>
                <BarChart data={chartData} height={160} />
              </div>
            </>
          )}

          {tab === 'Schedule' && (
            <>
              <SoftCard className="p-5">
                <div className="text-[13px] font-semibold text-slate-700 mb-3">Office hours</div>
                <div className="space-y-2">
                  {[
                    { day: 'Mon – Fri', hours: '8:00 AM – 6:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
                    { day: 'Sunday',   hours: 'Closed' },
                  ].map(row => (
                    <div key={row.day} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-[13.5px] text-slate-700">{row.day}</span>
                      <span className="text-[13.5px] text-slate-500">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </SoftCard>
              <SoftCard className="p-4">
                <Toggle checked={holdToggle} onChange={setHoldToggle} label="Hold outbound until office hours" helper="Queues faxes sent outside business hours for next open window." />
              </SoftCard>
            </>
          )}

          {tab === 'Identity' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Caller ID name</label>
                  <input defaultValue={n.callerId} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13.5px] font-mono bg-white focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Internal label</label>
                  <input defaultValue={n.label} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13.5px] bg-white focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Fax header line</label>
                <input defaultValue={`${n.callerId} · {{number}} · Page {{page}} of {{total}}`} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[13.5px] font-mono bg-white focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10" />
                <div className="text-[12px] text-slate-400 mt-1.5">Variables: <code className="font-mono bg-slate-100 px-1 rounded">{'{{number}}'}</code>, <code className="font-mono bg-slate-100 px-1 rounded">{'{{page}}'}</code>, <code className="font-mono bg-slate-100 px-1 rounded">{'{{total}}'}</code>, <code className="font-mono bg-slate-100 px-1 rounded">{'{{date}}'}</code></div>
              </div>
              <SoftCard className="p-4 flex items-start gap-3">
                <I.Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[12.5px] text-slate-500 leading-relaxed">Caller ID name changes take up to 24 hours to propagate across carriers. The fax header appears on every page transmitted from this number.</p>
              </SoftCard>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
          {tab === 'Identity' ? (
            <>
              <AppButton variant="danger" size="sm">Release number</AppButton>
              <div className="flex gap-2">
                <AppButton variant="secondary" onClick={onClose}>Cancel</AppButton>
                <AppButton>Save changes</AppButton>
              </div>
            </>
          ) : (
            <>
              <div />
              <AppButton variant="secondary" onClick={onClose}>Cancel</AppButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PortStatusModal({ n, onClose }: { n: FaxNumber | null; onClose: () => void }) {
  if (!n) return null;
  const portProgress = (n as any).portProgress ?? 0;
  const portETA = (n as any).portETA ?? '';
  const activeStep = 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[560px] max-h-[88vh] flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[20px] border border-white/70 shadow-[0_32px_80px_-16px_rgba(15,23,42,0.4)] overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-7 pb-5" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef9c3 50%, #fff 100%)' }}>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-500 hover:bg-white/90 transition">
            <I.X size={14} />
          </button>
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <I.Clock size={20} />
            </span>
            <div>
              <div className="font-mono text-[20px] font-semibold text-slate-900">{n.number}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <Pill tone="amber" dot>In progress · {Math.round(portProgress * 100)}%</Pill>
                <span className="text-[12.5px] text-slate-500">ETA {portETA}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          {/* Timeline */}
          <div className="space-y-1">
            {PORT_STEPS.map((step, i) => {
              const done = i < activeStep;
              const active = i === activeStep;
              return (
                <div key={step.id} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    {done ? (
                      <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)', color: 'white' }}>
                        <I.Check size={13} strokeWidth={2.5} />
                      </span>
                    ) : active ? (
                      <span className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center relative">
                        <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-60" />
                        <span className="relative w-2.5 h-2.5 rounded-full bg-white" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-semibold text-slate-400">{i + 1}</span>
                    )}
                    {i < PORT_STEPS.length - 1 && (
                      <span className="w-px flex-1 my-1" style={{ background: done ? 'var(--accent)' : '#e2e8f0', minHeight: 20 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className={`text-[13.5px] font-semibold ${done ? 'text-slate-900' : active ? 'text-amber-700' : 'text-slate-400'}`}>{step.title}</div>
                    <div className="text-[12.5px] text-slate-500 mt-0.5">{step.desc}</div>
                    <div className="text-[11.5px] text-slate-400 mt-0.5 font-mono">{step.when}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            {[
              { label: 'Submitted', value: 'Mar 18, 2026' },
              { label: 'Estimated completion', value: `Apr 3, 2026` },
              { label: 'Losing carrier', value: 'CenturyLink' },
              { label: 'Port reference', value: 'PORT-2026-0318-7210' },
            ].map((d, i, arr) => (
              <div key={d.label} className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <span className="text-[12.5px] text-slate-500">{d.label}</span>
                <span className="text-[13px] font-mono text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100 flex items-start gap-3">
            <I.Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[12.5px] text-amber-700 leading-relaxed">We'll send you an email and push notification the moment your number goes live on FaxGrid. No action needed on your end.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <button className="text-[13px] font-semibold text-red-600 hover:text-red-700">Cancel port request</button>
          <AppButton variant="secondary" onClick={onClose}>Close</AppButton>
        </div>
      </div>
    </div>
  );
}

export default function NumbersPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [open, setOpen] = useState<FaxNumber | null>(null);
  const [portOpen, setPortOpen] = useState<FaxNumber | null>(null);

  const filtered = NUMBERS.filter(n =>
    typeFilter === 'All' ? true :
    typeFilter === 'Active' ? n.status === 'Active' :
    n.type === typeFilter
  );

  const totalSent = NUMBERS.reduce((a, n) => a + n.sentMonth, 0);
  const totalRecv = NUMBERS.reduce((a, n) => a + n.receivedMonth, 0);
  const monthlyCost = NUMBERS.reduce((a, n) => a + n.cost, 0);
  const pending = NUMBERS.filter(n => n.status === 'Port-in pending');

  return (
    <div>
      {/* Header */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Numbers · {NUMBERS.length} lines</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>Your fax lines.</h1>
            <p className="text-[14px] text-slate-500 mt-2">Local and toll-free numbers, routing rules, and per-line activity. Port existing numbers in days, not weeks.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton variant="secondary" icon={<I.Arrow size={13} />}>Port number</AppButton>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>Get number</AppButton>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Numbers" value={String(NUMBERS.length)} helper="6 active · 1 porting · 1 inactive" icon={<I.Numbers size={15} />} />
        <StatCard label="Pages sent · 30d" value={totalSent.toLocaleString()} helper="↑ 14% vs prior month" trend="up" icon={<I.Send size={15} />} />
        <StatCard label="Pages received · 30d" value={totalRecv.toLocaleString()} helper="across all lines" icon={<I.Inbox size={15} />} />
        <StatCard label="Monthly cost" value={`$${monthlyCost}`} helper="2 toll-free × $5/mo" icon={<I.Billing size={15} />} />
      </div>

      {/* Port-in banner */}
      {pending.length > 0 && (
        <Card className="p-5 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(90deg, #fffbeb, white)' }}>
          <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0"><I.Clock size={16} /></span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-slate-900">{pending.length} number porting from previous carrier</div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">+1 (877) 555-2210 · 60% complete · ETA Apr 3. We'll notify you when it's live.</div>
          </div>
          <AppButton variant="secondary" onClick={() => setPortOpen(pending[0])}>View status</AppButton>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {['All', 'Active', 'Local', 'Toll-free'].map(t => (
          <Tab key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
            {t}
            <span className={`ml-1.5 text-[11px] ${typeFilter === t ? 'text-white/70' : 'text-slate-400'}`}>
              {t === 'All' ? NUMBERS.length : t === 'Active' ? NUMBERS.filter(n => n.status === 'Active').length : NUMBERS.filter(n => n.type === t).length}
            </span>
          </Tab>
        ))}
        <div className="flex-1" />
        <span className="text-[12.5px] text-slate-500">{filtered.length} shown</span>
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(n => <NumberCard key={n.id} n={n} onOpen={() => setOpen(n)} />)}
        {/* Add new number CTA card */}
        <button className="text-left rounded-[20px] border-2 border-dashed border-slate-200 hover:border-[var(--accent)] transition p-6 flex flex-col items-start justify-between min-h-[300px]">
          <div>
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'oklch(0.96 0.04 var(--accent-h))', color: 'var(--accent-deep)' }}>
              <I.Plus size={20} strokeWidth={2.2} />
            </span>
            <div className="text-[24px] font-semibold text-slate-900 leading-tight mt-4" style={{ fontFamily: 'Georgia, serif' }}>Add another line.</div>
            <div className="text-[13px] text-slate-500 mt-2 max-w-xs">Claim a local or toll-free number, or port an existing one from your current carrier.</div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <AppButton size="sm" icon={<I.Plus size={13} strokeWidth={2.4} />}>Browse</AppButton>
            <AppButton variant="secondary" size="sm" icon={<I.Arrow size={13} />}>Port in</AppButton>
          </div>
        </button>
      </div>

      <NumberDetailModal n={open} onClose={() => setOpen(null)} />
      <PortStatusModal n={portOpen} onClose={() => setPortOpen(null)} />
    </div>
  );
}
