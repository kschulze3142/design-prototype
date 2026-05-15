'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const CONTACT_CATEGORIES = [
  { id: 'all',       label: 'All contacts',  count: 284, tone: 'slate' },
  { id: 'insurance', label: 'Insurance',     count: 38,  tone: 'amber' },
  { id: 'labs',      label: 'Labs',          count: 21,  tone: 'violet' },
  { id: 'providers', label: 'Providers',     count: 142, tone: 'teal' },
  { id: 'records',   label: 'Records / ROI', count: 24,  tone: 'violet' },
  { id: 'billing',   label: 'Billing',       count: 17,  tone: 'amber' },
  { id: 'internal',  label: 'Internal',      count: 12,  tone: 'emerald' },
];

const PINNED = [
  { id: 'c-001', name: 'BlueShield Prior Auth',      category: 'Insurance',      subtitle: 'Authorizations Dept.', number: '+1 (888) 555-0903', attn: 'Authorizations Dept.', recent: 12, lastSent: '2h ago',   deliveryRate: 99.8, tone: 'amber',  tags: ['insurance','primary'], addedBy: 'Amelia Park', addedOn: 'Jan 4, 2026',  pinned: true },
  { id: 'c-002', name: 'Swedish Medical · Records',  category: 'Records',        subtitle: 'ROI Office',           number: '+1 (206) 555-7711', attn: 'ROI Office',           recent: 8,  lastSent: 'Yesterday', deliveryRate: 98.2, tone: 'violet', tags: ['records','primary'],   addedBy: 'Amelia Park', addedOn: 'Jan 4, 2026',  pinned: true },
  { id: 'c-003', name: 'Pacific Lab Diagnostics',    category: 'Labs',           subtitle: 'Results',              number: '+1 (206) 555-2840', attn: 'Results',              recent: 24, lastSent: '11:14 AM', deliveryRate: 100,  tone: 'violet', tags: ['labs','primary'],      addedBy: 'Amelia Park', addedOn: 'Jan 4, 2026',  pinned: true },
  { id: 'c-004', name: 'Aetna Claims',               category: 'Insurance',      subtitle: 'Claims Review',        number: '+1 (800) 555-2840', attn: 'Claims Review',        recent: 6,  lastSent: '9:32 AM',  deliveryRate: 97.5, tone: 'amber',  tags: ['insurance','primary'], addedBy: 'Amelia Park', addedOn: 'Jan 4, 2026',  pinned: true },
];

const CONTACTS = [
  ...PINNED,
  { id: 'c-010', name: 'Dr. Sarah Chen',        category: 'Providers',      subtitle: 'Cardiology · Swedish Medical',    number: '+1 (206) 555-4421', attn: '',                recent: 4,  lastSent: 'Mar 21',   deliveryRate: 100,  tone: 'teal',   tags: ['cardiology','referrals'],  addedBy: 'Dr. M. Greaves', addedOn: 'Feb 12, 2026', pinned: false },
  { id: 'c-011', name: 'Dr. Marcus Rivera',     category: 'Providers',      subtitle: 'Family Practice · Pacific Med',   number: '+1 (206) 555-8821', attn: 'Front desk',     recent: 7,  lastSent: 'Yesterday',deliveryRate: 99.1, tone: 'teal',   tags: ['family-practice'],         addedBy: 'Reception',      addedOn: 'Nov 3, 2025',  pinned: false },
  { id: 'c-012', name: 'Group Health · Referrals', category: 'Insurance',   subtitle: 'Member services',                 number: '+1 (425) 555-7710', attn: 'Referrals team', recent: 3,  lastSent: '10:47 AM', deliveryRate: 99.4, tone: 'amber',  tags: ['referrals'],               addedBy: 'Amelia Park',    addedOn: 'Jan 19, 2026', pinned: false },
  { id: 'c-013', name: 'Quest Diagnostics',     category: 'Labs',           subtitle: 'Pathology · Regional',            number: '+1 (800) 555-0319', attn: 'Results',        recent: 9,  lastSent: 'Yesterday',deliveryRate: 99.9, tone: 'violet', tags: ['pathology'],               addedBy: 'Kelly Liu',      addedOn: 'Oct 1, 2025',  pinned: false },
  { id: 'c-014', name: 'Northwest Imaging',     category: 'Providers',      subtitle: 'Echo & ultrasound',               number: '+1 (206) 555-0142', attn: '',               recent: 5,  lastSent: 'Mar 23',   deliveryRate: 98.0, tone: 'teal',   tags: ['imaging'],                 addedBy: 'Dr. M. Greaves', addedOn: 'Dec 8, 2025',  pinned: false },
  { id: 'c-015', name: 'Dr. Priya Khanna',      category: 'Internal',       subtitle: 'Internal · Cardiology Fellow',    number: '+1 (206) 555-0144', attn: '',               recent: 2,  lastSent: 'Mon',      deliveryRate: 100,  tone: 'emerald',tags: ['internal','team'],         addedBy: 'Amelia Park',    addedOn: 'Feb 1, 2026',  pinned: false },
  { id: 'c-016', name: 'Cigna · Pre-Auth',      category: 'Insurance',      subtitle: 'Pre-authorization',               number: '+1 (888) 555-1129', attn: 'Pre-Auth Dept.', recent: 2,  lastSent: 'Mar 22',   deliveryRate: 96.8, tone: 'amber',  tags: ['pre-auth'],                addedBy: 'Billing team',   addedOn: 'Aug 14, 2025', pinned: false },
  { id: 'c-017', name: 'Kaiser · Records',      category: 'Records',        subtitle: 'Release of Information',          number: '+1 (888) 555-4400', attn: 'ROI',            recent: 3,  lastSent: 'Mar 20',   deliveryRate: 99.0, tone: 'violet', tags: ['roi'],                     addedBy: 'Records team',   addedOn: 'Jul 30, 2025', pinned: false },
  { id: 'c-018', name: 'Dr. Tom Iwasaki',       category: 'Internal',       subtitle: 'Internal · Endocrinology',        number: '+1 (206) 555-0148', attn: '',               recent: 1,  lastSent: 'Mar 18',   deliveryRate: 100,  tone: 'emerald',tags: ['internal','endocrinology'],addedBy: 'Amelia Park',    addedOn: 'Mar 1, 2026',  pinned: false },
];
type Contact = typeof CONTACTS[number];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'rgba(204,251,241,0.6)', fg: 'var(--accent-deep)', dot: 'var(--accent)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

function sparkFor(id: string): number[] {
  let s = 0;
  for (const c of id) s = ((s * 31 + c.charCodeAt(0)) >>> 0);
  return Array.from({ length: 12 }, () => { s = ((s * 1103515245 + 12345) >>> 0); return 2 + (s % 9); });
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
      {children}
    </button>
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

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>{children}</div>;
}

function ContactPin({ c, onOpen }: { c: Contact; onOpen: () => void }) {
  const spark = sparkFor(c.id);
  return (
    <button onClick={onOpen}
      className="shrink-0 w-[220px] text-left rounded-[20px] border border-slate-200/80 bg-white/85 backdrop-blur-[14px] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)] hover:border-[var(--accent)] transition overflow-hidden flex flex-col">
      <div className="p-4 flex items-start gap-3">
        <Avatar name={c.name} size={42} tone={c.tone} />
        <div className="flex-1 min-w-0">
          <Pill tone={c.tone} dot={false} className="mb-1.5">{c.category}</Pill>
          <div className="text-[13.5px] font-semibold text-slate-900 leading-snug truncate">{c.name}</div>
          {c.attn && <div className="text-[11.5px] text-slate-500 truncate">{c.attn}</div>}
          <div className="text-[12px] font-mono text-slate-600 mt-1">{c.number}</div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">Last 30d</div>
          <div className="text-[13px] font-semibold text-slate-900">{c.recent} faxes</div>
        </div>
        <Sparkline data={spark} w={72} h={24} />
      </div>
    </button>
  );
}

function ContactRow({ c, onOpen }: { c: Contact; onOpen: () => void }) {
  return (
    <tr className="hover:bg-slate-50/70 cursor-pointer transition" onClick={onOpen}>
      <td className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar name={c.name} size={36} tone={c.tone} />
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-slate-900 truncate">{c.name}</div>
            <div className="text-[11.5px] text-slate-500 truncate">{c.subtitle || '—'}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 border-b border-slate-100">
        <span className="text-[12.5px] font-mono text-slate-700">{c.number}</span>
      </td>
      <td className="px-4 py-3 border-b border-slate-100">
        <Pill tone={c.tone} dot={false}>{c.category}</Pill>
      </td>
      <td className="px-4 py-3 border-b border-slate-100 text-[13px] text-slate-500">{c.lastSent}</td>
      <td className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-900">{c.deliveryRate}%</span>
          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${c.deliveryRate}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 border-b border-slate-100 text-right">
        <div className="flex items-center justify-end gap-1">
          <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700">
            <I.Send size={13} />
          </button>
          <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700">
            <I.More size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ContactDrawer({ c, onClose }: { c: Contact | null; onClose: () => void }) {
  if (!c) return null;
  const spark = sparkFor(c.id);
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]" />
      <div className="relative w-[860px] max-w-full max-h-[88vh] overflow-hidden flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[14px] border border-white/85 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.35)]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-7 pb-5" style={{ background: 'linear-gradient(135deg, rgba(204,251,241,0.6), white)' }}>
          <button className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-slate-500"
            onClick={onClose}><I.X size={16} /></button>
          <div className="flex items-start gap-4">
            <Avatar name={c.name} size={64} tone={c.tone} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{c.category}</div>
              <div className="text-[28px] font-semibold text-slate-900 leading-tight mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>{c.name}</div>
              {c.subtitle && <div className="text-[13.5px] text-slate-500 mt-0.5">{c.subtitle}</div>}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Pill tone={c.tone} dot={false}>{c.category}</Pill>
                {c.tags.map(tag => <Pill key={tag} tone="slate" dot={false}>{tag}</Pill>)}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AppButton size="sm" icon={<I.Send size={13} />}>Send fax</AppButton>
              <AppButton variant="secondary" size="sm" icon={<I.Note size={13} />}>Edit</AppButton>
              <AppButton variant="secondary" size="sm" icon={<I.Star size={13} />}>{c.pinned ? 'Unpin' : 'Pin'}</AppButton>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div className="grid grid-cols-12 gap-6 p-7">
            {/* Left */}
            <div className="col-span-7 space-y-6">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Fax routing</div>
                <SoftCard className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Primary number</div>
                      <div className="text-[14px] font-mono font-semibold text-slate-900">{c.number}</div>
                    </div>
                    <Pill tone="emerald" dot>Verified</Pill>
                  </div>
                  {c.attn && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">ATTN line</div>
                      <div className="text-[13.5px] text-slate-700">{c.attn}</div>
                    </div>
                  )}
                </SoftCard>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Recent faxes</div>
                <div className="space-y-2">
                  {[
                    { label: 'Authorization request', id: 'FAX-20260312-001', status: 'Delivered' },
                    { label: 'Echo report',            id: 'FAX-20260310-004', status: 'Delivered' },
                    { label: 'Records request response', id: 'FAX-20260308-007', status: 'Delivered' },
                  ].map(row => (
                    <SoftCard key={row.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-medium text-slate-900">{row.label}</div>
                        <div className="text-[11.5px] font-mono text-slate-400">{row.id}</div>
                      </div>
                      <Pill tone="emerald" dot>{row.status}</Pill>
                    </SoftCard>
                  ))}
                </div>
              </div>

              <div className="text-[12px] text-slate-400">
                Added by <span className="text-slate-600 font-medium">{c.addedBy}</span> on {c.addedOn} · Visible to workspace
              </div>
            </div>

            {/* Right */}
            <div className="col-span-5 space-y-5">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Activity · 30 days</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Sent', value: String(c.recent) },
                    { label: 'Delivery rate', value: `${c.deliveryRate}%` },
                    { label: 'Last', value: c.lastSent },
                  ].map(s => (
                    <SoftCard key={s.label} className="p-3 text-center">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">{s.label}</div>
                      <div className="text-[18px] font-semibold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-inter-tight), system-ui' }}>{s.value}</div>
                    </SoftCard>
                  ))}
                </div>
              </div>

              <SoftCard className="p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Volume trend</div>
                <Sparkline data={spark} w={300} h={56} />
              </SoftCard>

              <SoftCard className="p-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Top document types</div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Authorizations', pct: 62 },
                    { label: 'Records', pct: 24 },
                    { label: 'Other', pct: 14 },
                  ].map(d => (
                    <div key={d.label}>
                      <div className="flex justify-between text-[12px] text-slate-600 mb-1">
                        <span>{d.label}</span>
                        <span className="font-semibold">{d.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: 'var(--accent)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SoftCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [open, setOpen] = useState<Contact | null>(null);

  const filtered = CONTACTS.filter(c => {
    if (cat !== 'all' && c.category.toLowerCase().replace(' / ', '/').replace(' ', '') !== cat) return false;
    if (search && !`${c.name} ${c.number} ${c.subtitle}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Address book · {CONTACTS.length} contacts</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>Your fax directory.</h1>
            <p className="text-[14px] text-slate-500 mt-2">Recipients you fax regularly — organizations and people. Saved contacts auto-fill the compose form.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton variant="secondary" icon={<I.Upload size={14} />}>Import CSV</AppButton>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>New contact</AppButton>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Contacts" value={String(CONTACTS.length)} helper="+4 this month" trend="up" icon={<I.Contacts size={15} />} />
        <StatCard label="Organizations" value="76" helper="across 11 categories" icon={<I.Building size={15} />} />
        <StatCard label="Verified numbers" value="262" helper="of 284 total" icon={<I.Shield size={15} />} />
        <StatCard label="Avg delivery" value="98.9%" helper="↑ 0.4 vs last month" trend="up" icon={<I.Sparkle size={15} />} />
      </div>

      {/* Pinned strip */}
      <div className="mb-7">
        <SectionTitle title="Pinned" subtitle="Your most-used recipients — pinned for one-tap sending."
          action={<AppButton variant="ghost" size="sm">Manage</AppButton>} />
        <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
          {PINNED.map(p => <ContactPin key={p.id} c={p} onOpen={() => setOpen(p)} />)}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Category rail */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold px-2 mb-2">Categories</div>
            <div className="space-y-0.5">
              {CONTACT_CATEGORIES.map(c => {
                const active = cat === c.id;
                return (
                  <button key={c.id} onClick={() => setCat(c.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition ${active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_TONES[c.tone]?.dot }} />
                    <span className="flex-1 text-[13px] font-medium">{c.label}</span>
                    <span className={`text-[11.5px] font-mono ${active ? 'text-white/60' : 'text-slate-400'}`}>{c.count}</span>
                  </button>
                );
              })}
              <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[13px] text-slate-500 hover:bg-slate-50 mt-1">
                <I.Plus size={13} /> New category
              </button>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'oklch(0.96 0.04 var(--accent-h))', color: 'var(--accent-deep)' }}>
                <I.Sparkle size={15} />
              </span>
              <div>
                <div className="text-[13.5px] font-semibold text-slate-900">Auto-cleanup</div>
                <div className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">5 contacts haven't received a fax in 12+ months. Review and archive?</div>
                <button className="mt-2 text-[12.5px] font-semibold hover:underline" style={{ color: 'var(--accent-deep)' }}>Review →</button>
              </div>
            </div>
          </Card>
        </aside>

        {/* Directory */}
        <div className="col-span-12 lg:col-span-9">
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40">
              <div className="relative flex-1 max-w-md">
                <I.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts, numbers, ATTN…"
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[13px] focus:outline-none focus:border-[var(--accent)] placeholder:text-slate-400" />
              </div>
              <span className="text-[12px] text-slate-500 ml-2">{filtered.length} of {CONTACTS.length}</span>
              <div className="flex-1" />
              <div className="flex items-center gap-1 bg-white rounded-xl p-0.5 border border-slate-200">
                <button onClick={() => setView('table')} className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition ${view === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}>List</button>
                <button onClick={() => setView('grid')} className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition ${view === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}>Cards</button>
              </div>
              <button className="w-9 h-9 rounded-xl hover:bg-white flex items-center justify-center text-slate-500"><I.Filter size={14} /></button>
            </div>

            {view === 'table' ? (
              <div className="overflow-auto scrollbar-thin">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Name','Fax number','Category','Last sent','Delivery','Actions'].map(h => (
                        <th key={h} className={`text-[11.5px] uppercase tracking-[0.06em] text-slate-500 font-semibold px-4 py-3 text-left bg-slate-50/70 border-b border-slate-100 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => <ContactRow key={c.id} c={c} onOpen={() => setOpen(c)} />)}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-slate-500 py-12 text-[13.5px]">No contacts match.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map(c => (
                  <button key={c.id} onClick={() => setOpen(c)}
                    className="text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[var(--accent)] transition flex gap-3">
                    <Avatar name={c.name} size={40} tone={c.tone} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[11.5px] text-slate-500 truncate">{c.subtitle || c.attn || '—'}</div>
                      <div className="text-[12px] font-mono text-slate-700 mt-1.5">{c.number}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <Pill tone={c.tone} dot={false}>{c.category}</Pill>
                        <span className="text-[11px] text-slate-400">{c.lastSent}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <ContactDrawer c={open} onClose={() => setOpen(null)} />
    </div>
  );
}
