'use client';
import { useState } from 'react';
import React from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

// ── DATA ─────────────────────────────────────────────────────────────────────

const SENT_FAXES = [
  { id: 'FX-9824-1A', to: 'BlueShield Prior Auth',      toNumber: '+1 (888) 555-0903', subject: 'Authorization request — Patient #A24189', pages: 7,  sentAt: 'Today · 10:42 AM',    status: 'Delivered', attempts: 1, tone: 'teal',   tags: ['PHI','Auth'],       from: 'Dr. M. Greaves',    channel: 'Tier-1' },
  { id: 'FX-9823-4C', to: 'Aetna Claims',               toNumber: '+1 (800) 555-2840', subject: 'EOB dispute — claim 881-14',              pages: 3,  sentAt: 'Today · 9:15 AM',     status: 'Delivered', attempts: 1, tone: 'amber',  tags: ['Billing'],          from: 'Amelia Park',       channel: 'Standard' },
  { id: 'FX-9821-2B', to: 'Swedish Medical · ROI',      toNumber: '+1 (206) 555-7711', subject: 'Records request — Patient A23104',        pages: 2,  sentAt: 'Today · 8:02 AM',     status: 'Delivered', attempts: 1, tone: 'violet', tags: ['PHI','ROI'],        from: 'Amelia Park',       channel: 'Standard' },
  { id: 'FX-9819-7D', to: 'Pacific Lab Diagnostics',    toNumber: '+1 (206) 555-2840', subject: 'Order — lipid panel A24189',              pages: 1,  sentAt: 'Yesterday · 4:51 PM', status: 'Delivered', attempts: 1, tone: 'violet', tags: ['PHI','Labs'],       from: 'Dr. M. Greaves',    channel: 'Standard' },
  { id: 'FX-9817-3A', to: 'Northwest Imaging',          toNumber: '+1 (206) 555-0142', subject: 'Echo referral — Patient A24189',          pages: 2,  sentAt: 'Yesterday · 2:30 PM', status: 'Delivered', attempts: 2, tone: 'teal',   tags: ['PHI','Imaging'],    from: 'Dr. M. Greaves',    channel: 'Standard' },
  { id: 'FX-9812-9E', to: 'Group Health · Referrals',   toNumber: '+1 (425) 555-7710', subject: 'Cardiology referral — Patient A23104',    pages: 4,  sentAt: 'Yesterday · 11:20 AM',status: 'Failed',    attempts: 3, tone: 'slate',  tags: ['PHI','Referral'],   from: 'Dr. Priya Khanna', channel: 'Standard' },
  { id: 'FX-9809-6F', to: 'Quest Diagnostics',          toNumber: '+1 (800) 555-0319', subject: 'Lab order — Patient A22891',              pages: 1,  sentAt: 'Mon · 3:44 PM',       status: 'Delivered', attempts: 1, tone: 'violet', tags: ['PHI','Labs'],       from: 'Dr. M. Greaves',    channel: 'Standard' },
  { id: 'FX-9801-1G', to: 'Aetna Claims',               toNumber: '+1 (800) 555-2840', subject: 'Prior auth — echocardiogram A24189',      pages: 5,  sentAt: 'Mon · 10:11 AM',      status: 'Delivered', attempts: 1, tone: 'amber',  tags: ['PHI','Auth'],       from: 'Dr. M. Greaves',    channel: 'Tier-1' },
];

type SentFax = typeof SENT_FAXES[number];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'rgba(204,251,241,0.6)', fg: 'var(--accent-deep)', dot: 'var(--accent)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  red:     { bg: '#fef2f2',               fg: '#b91c1c',             dot: '#ef4444' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

const TIMELINE = [
  { t: '10:42:08 AM', title: 'Composed',       who: 'Dr. M. Greaves', desc: '7 pages, including signed cover',       tone: 'slate' },
  { t: '10:42:11 AM', title: 'Queued',         who: 'FaxGrid',        desc: 'Routed via Tier-1 carrier',             tone: 'slate' },
  { t: '10:42:24 AM', title: 'Connected',      who: 'Carrier',        desc: 'Recipient ECM negotiated · 14400 baud', tone: 'slate' },
  { t: '10:43:18 AM', title: 'Delivered',      who: 'Recipient',      desc: 'All 7 pages confirmed · CRC OK',        tone: 'emerald' },
  { t: '10:43:19 AM', title: 'Receipt issued', who: 'FaxGrid',        desc: 'PDF receipt stored to archive',         tone: 'teal' },
];

const RELATED = [
  { id: 'FX-9742-3C', subject: 'Echo report — A24189',   date: 'Mar 21', status: 'Delivered' },
  { id: 'FX-9701-4B', subject: 'Referral — Cardiology',  date: 'Mar 18', status: 'Delivered' },
  { id: 'FX-9610-7A', subject: 'Insurance verification', date: 'Mar 11', status: 'Received' },
];

const LOG_METHODS: Record<string, string> = {
  'Composed':       'compose.fax',
  'Queued':         'queue.enqueue',
  'Connected':      'carrier.connect',
  'Delivered':      'delivery.confirm',
  'Receipt issued': 'receipt.write',
};

const HIGHLIGHTED_METHODS = new Set(['queue.enqueue', 'delivery.confirm', 'receipt.write']);

// ── LOCAL SUB-COMPONENTS ──────────────────────────────────────────────────────

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
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

function DocPreview({ title, from, to, pages }: { title: string; from: string; to: string; pages: number }) {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[32px] -z-10"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(15,23,42,0.04) 0 8px, transparent 8px 16px)', backgroundColor: 'rgba(241,245,249,0.6)' }} />
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100"
          style={{ background: 'linear-gradient(90deg, oklch(0.96 0.04 var(--accent-h)), white)' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: 'var(--accent-deep)' }}>{title}</span>
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

function SentListItem({ f, selected, onClick }: { f: SentFax; selected: boolean; onClick: () => void }) {
  const statusTone = f.status === 'Delivered' ? 'emerald' : f.status === 'Failed' ? 'red' : 'amber';
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3.5 flex gap-3 transition border-l-2 ${selected ? 'bg-[var(--accent-soft)] border-l-[var(--accent)]' : 'border-l-transparent hover:bg-slate-50'}`}>
      <Avatar name={f.to} size={36} tone={f.tone} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[13.5px] font-medium text-slate-900 truncate">{f.to}</span>
          <span className="ml-auto text-[11px] text-slate-400 font-mono whitespace-nowrap">{f.sentAt.split(' · ')[1]}</span>
        </div>
        <div className="text-[12.5px] text-slate-600 truncate mt-0.5">{f.subject}</div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: STATUS_TONES[statusTone]?.bg, color: STATUS_TONES[statusTone]?.fg }}>
            {f.status}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[10.5px] text-slate-400 font-mono">{f.pages}p</span>
          {f.attempts > 1 && <span className="text-[10.5px] text-amber-600 font-medium">{f.attempts} attempts</span>}
          <span className="ml-auto flex items-center gap-1">
            {f.tags.slice(0, 2).map(t => (
              <span key={t} className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{t}</span>
            ))}
          </span>
        </div>
      </div>
    </button>
  );
}

function SentDetail({ f, detailTab, setDetailTab, onForward }: {
  f: SentFax | undefined;
  detailTab: string;
  setDetailTab: (t: string) => void;
  onForward: () => void;
}) {
  if (!f) {
    return (
      <Card className="overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', color: 'var(--accent-deep)' }}>
            <I.Send size={26} />
          </div>
          <div className="text-[16px] font-semibold text-slate-900">No fax selected</div>
          <div className="text-[13.5px] text-slate-500 max-w-xs">Select a sent fax from the list to view its details here.</div>
        </div>
      </Card>
    );
  }

  const statusTone = f.status === 'Delivered' ? 'emerald' : f.status === 'Failed' ? 'red' : 'amber';
  const thumbnailCount = Math.min(7, f.pages);
  const extraPages = f.pages - 7;

  return (
    <Card className="overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 240px)' }}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100 space-y-3 shrink-0">
        <div className="flex items-start gap-3">
          <Avatar name={f.to} size={42} tone={f.tone} />
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold text-slate-900 leading-tight">{f.to}</div>
            <div className="text-[12.5px] text-slate-500 font-mono mt-0.5">{f.toNumber} · {f.sentAt} · {f.id}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={statusTone}>{f.status}</Pill>
          {f.tags.includes('PHI') && (
            <Pill tone="violet" dot={false}><I.Lock size={11} strokeWidth={2} /> PHI</Pill>
          )}
          <Pill tone="teal" dot={false}>{f.channel}</Pill>
        </div>
        <div className="text-[26px] leading-tight font-semibold text-slate-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {f.subject}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AppButton size="sm">Resend</AppButton>
          <AppButton size="sm" variant="secondary" icon={<I.Forward size={13} />} onClick={onForward}>Forward</AppButton>
          <AppButton size="sm" variant="secondary" icon={<I.Download size={13} />}>Download</AppButton>
          <AppButton size="sm" variant="secondary">Print</AppButton>
        </div>
      </div>

      {/* Tab bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-1 shrink-0">
        {[
          { id: 'document', label: 'Document' },
          { id: 'receipt',  label: 'Receipt' },
          { id: 'log',      label: 'Transmission log' },
        ].map(tab => (
          <Tab key={tab.id} active={detailTab === tab.id} onClick={() => setDetailTab(tab.id)}>{tab.label}</Tab>
        ))}
      </div>

      {/* Tab panels */}
      <div className="flex-1 overflow-auto p-6 space-y-6" style={{ background: 'rgba(248,250,252,0.4)' }}>

        {detailTab === 'document' && (
          <>
            <DocPreview title={f.subject} from={f.from} to={f.toNumber} pages={f.pages} />
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {Array.from({ length: thumbnailCount }).map((_, i) => (
                <div key={i} className="shrink-0 w-16 aspect-[3/4] rounded-xl border flex flex-col p-2 gap-1.5 relative overflow-hidden"
                  style={{ background: '#f8fafc', borderColor: i === 0 ? 'var(--accent)' : '#e2e8f0', boxShadow: i === 0 ? '0 0 0 1px var(--accent)' : undefined }}>
                  {[70, 50, 80, 40, 60].map((w, j) => (
                    <div key={j} className="h-1 rounded-full bg-slate-200" style={{ width: `${w}%` }} />
                  ))}
                  <div className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] text-slate-400 font-medium">{i + 1}</div>
                </div>
              ))}
              {extraPages > 0 && (
                <div className="shrink-0 w-16 aspect-[3/4] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-slate-400">+{extraPages}</span>
                </div>
              )}
            </div>
          </>
        )}

        {detailTab === 'receipt' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-100 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'oklch(0.96 0.04 var(--accent-h))' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-deep)' }} className="draw-check">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div className="text-[24px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Delivered successfully</div>
                <div className="text-[12.5px] text-slate-500 font-mono mt-1.5">{f.id}</div>
              </div>
              <div className="divide-y divide-slate-100 text-left">
                {[
                  { label: 'Sent at',      value: f.sentAt },
                  { label: 'Delivered at', value: '10:43:18 AM' },
                  { label: 'Duration',     value: '1m 10s' },
                  { label: 'Pages',        value: String(f.pages) },
                  { label: 'Attempts',     value: String(f.attempts) },
                  { label: 'Channel',      value: f.channel },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-[13px] text-slate-500">{label}</span>
                    <span className="text-[13px] font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
              <AppButton variant="secondary" icon={<I.Download size={13} />} className="w-full justify-center">Download receipt</AppButton>
            </div>
          </div>
        )}

        {detailTab === 'log' && (
          <div className="rounded-2xl bg-slate-950 p-5 font-mono text-[12px] space-y-2 overflow-x-auto">
            {TIMELINE.map((entry, i) => {
              const method = LOG_METHODS[entry.title] ?? entry.title.toLowerCase().replace(' ', '.');
              const colorClass = HIGHLIGHTED_METHODS.has(method) ? 'text-emerald-400' : 'text-slate-400';
              return (
                <div key={i} className={`flex gap-3 leading-relaxed ${colorClass}`}>
                  <span className="text-slate-600 shrink-0">[{entry.t}]</span>
                  <span className="shrink-0 w-32">{method}</span>
                  <span className="shrink-0 text-slate-500 w-20">{entry.who}</span>
                  <span>{entry.desc}</span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Card>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function SentPage() {
  const [items] = useState(SENT_FAXES);
  const [selectedId, setSelectedId] = useState<string>(SENT_FAXES[0].id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [detailTab, setDetailTab] = useState('document');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardTo, setForwardTo] = useState('');
  const [forwardDone, setForwardDone] = useState(false);

  const filtered = items.filter(f => {
    if (statusFilter !== 'All' && f.status !== statusFilter) return false;
    if (search && !`${f.to} ${f.subject}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = items.find(f => f.id === selectedId);
  const deliveredCount = items.filter(f => f.status === 'Delivered').length;
  const failedCount = items.filter(f => f.status === 'Failed').length;

  const submitForward = () => {
    setForwardDone(true);
    setTimeout(() => { setForwardDone(false); setShowForwardModal(false); setForwardTo(''); }, 1600);
  };

  return (
    <div>
      {/* Header card */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Sent · {items.length} faxes</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
              style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>
              Your fax history.
            </h1>
            <p className="text-[14px] text-slate-500 mt-2">Every outbound fax with delivery receipts, transmission logs, and full audit trail.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <div className="relative">
              <I.Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sent faxes…"
                className="pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--accent)] w-[240px] placeholder:text-slate-400" />
            </div>
            <button className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900">
              <I.Bell size={17} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            </button>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>New fax</AppButton>
          </div>
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Sent today" value="3" helper="+2 vs yesterday" trend="up" icon={<I.Send size={15} />} />
        <StatCard label="Delivered" value={String(deliveredCount)} helper={`${Math.round((deliveredCount / items.length) * 100)}% delivery rate`} trend="up" icon={<I.Check size={15} />} />
        <StatCard label="Failed" value={String(failedCount)} helper={failedCount > 0 ? 'Needs retry' : 'None this week'} trend={failedCount > 0 ? 'down' : 'neutral'} icon={<I.Refresh size={15} />} />
        <StatCard label="Pages sent" value="23" helper="this week" icon={<I.Document size={15} />} />
      </div>

      {/* Filter bar */}
      <Card className="px-4 py-3 mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {['All', 'Delivered', 'Failed'].map(s => (
            <Tab key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</Tab>
          ))}
        </div>
        <span className="w-px h-5 bg-slate-200 mx-2" />
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition">
          <I.Calendar size={13} /> Date range
        </button>
        <button className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition">
          <I.Download size={13} /> Export CSV
        </button>
      </Card>

      {/* List + detail */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <Card className="overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <span className="text-[12px] text-slate-500">{filtered.length} fax{filtered.length !== 1 ? 'es' : ''}</span>
              <div className="flex-1" />
              <button className="text-[12px] text-slate-500 hover:text-slate-900 flex items-center gap-1">
                Newest <I.ChevronDown size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-100 overflow-auto scrollbar-thin" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {filtered.length === 0 ? (
                <div className="px-6 py-14 text-center text-slate-500 text-[13.5px]">Nothing here. Try another filter.</div>
              ) : filtered.map(f => (
                <SentListItem key={f.id} f={f} selected={f.id === selectedId} onClick={() => setSelectedId(f.id)} />
              ))}
            </div>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <SentDetail f={selected} detailTab={detailTab} setDetailTab={setDetailTab} onForward={() => setShowForwardModal(true)} />
        </div>
      </div>

      {/* Forward modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-6" onClick={() => setShowForwardModal(false)}>
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" />
          <Card className="relative w-[440px] max-w-full p-6" onClick={e => e.stopPropagation()}>
            {!forwardDone ? (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[20px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Forward fax</div>
                    <div className="text-[13px] text-slate-500 mt-0.5">Send a copy to email or another fax number.</div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700" onClick={() => setShowForwardModal(false)}><I.X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Forward to</label>
                    <input className="w-full mt-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--accent)] placeholder:text-slate-400"
                      placeholder="email@hospital.org or +1 555…" value={forwardTo} onChange={e => setForwardTo(e.target.value)} />
                  </div>
                  <Toggle label="Include receipt PDF" helper="Adds the delivery confirmation as a second attachment." checked={true} onChange={() => {}} />
                  <Toggle label="Notify recipient inline" helper="Sends a short note above the document." checked={false} onChange={() => {}} />
                </div>
                <div className="mt-6 flex gap-2">
                  <AppButton variant="secondary" className="flex-1 justify-center" onClick={() => setShowForwardModal(false)}>Cancel</AppButton>
                  <AppButton className="flex-1 justify-center" onClick={submitForward}>Forward</AppButton>
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'oklch(0.96 0.04 var(--accent-h))' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-deep)' }} className="draw-check">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div className="text-[22px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Forwarded</div>
                <div className="text-[13px] text-slate-500 mt-1">Sent to {forwardTo}</div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
