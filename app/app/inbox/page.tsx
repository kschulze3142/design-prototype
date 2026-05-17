'use client';
import React, { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

// ── DATA ─────────────────────────────────────────────────────────────────────

const INBOX_FAXES = [
  { id: 'FX-IN-3382', from: 'Pacific Lab Diagnostics',    number: '+1 (206) 555-2840', subject: 'Lab results · Patient A24189',            snippet: 'Comprehensive metabolic panel and lipid profile, ordered Mar 22. Results within reference range except for HDL…', time: '11:14 AM', date: 'Today',     pages: 4,  unread: true,  flagged: true,  tags: ['PHI','Labs'],      tone: 'violet', routedTo: null,              classification: 'PHI' },
  { id: 'FX-IN-3381', from: 'Group Health · Referrals',   number: '+1 (425) 555-7710', subject: 'Referral acknowledgement — Cardiology',   snippet: 'Confirming receipt of the referral for Patient A23104 dated Mar 21. Appointment scheduled for Apr 4 at 10:30 AM.', time: '10:47 AM', date: 'Today',     pages: 2,  unread: true,  flagged: false, tags: ['Referral'],        tone: 'teal',   routedTo: 'Dr. M. Greaves', classification: 'PHI' },
  { id: 'FX-IN-3380', from: 'Aetna Claims',               number: '+1 (800) 555-2840', subject: 'EOB · claim 882-31',                      snippet: 'Explanation of benefits attached. Patient responsibility: $42.18. See itemized breakdown on page 4.',             time: '9:32 AM',  date: 'Today',     pages: 6,  unread: true,  flagged: false, tags: ['Billing','EOB'],   tone: 'amber',  routedTo: 'Billing team',   classification: 'Financial' },
  { id: 'FX-IN-3379', from: "Dr. Rivera's Office",        number: '+1 (206) 555-8821', subject: 'Patient transfer summary',                snippet: 'Transfer summary including medication list, recent imaging, and discharge instructions for continuity of care.',  time: '8:14 AM',  date: 'Today',     pages: 9,  unread: true,  flagged: false, tags: ['PHI','Transfer'],  tone: 'slate',  routedTo: 'Dr. M. Greaves', classification: 'PHI' },
  { id: 'FX-IN-3376', from: 'Swedish Medical · ROI',      number: '+1 (206) 555-7711', subject: 'Records request response',                snippet: 'Attached medical records for the period requested (Jan 1, 2024 – Dec 31, 2025). 84 pages.',                    time: 'Yesterday',date: 'Yesterday', pages: 84, unread: false, flagged: true,  tags: ['PHI','ROI'],       tone: 'violet', routedTo: 'Records',         classification: 'PHI' },
  { id: 'FX-IN-3375', from: 'Quest Diagnostics',          number: '+1 (800) 555-0319', subject: 'Pathology — A23104',                      snippet: 'Surgical pathology report. Diagnosis: see page 2. Microscopic description on page 3.',                          time: 'Yesterday',date: 'Yesterday', pages: 5,  unread: false, flagged: false, tags: ['PHI','Pathology'], tone: 'violet', routedTo: 'Dr. M. Greaves', classification: 'PHI' },
  { id: 'FX-IN-3372', from: 'BlueShield Prior Auth',      number: '+1 (888) 555-0903', subject: 'Auth approved — #A24189',                 snippet: 'Prior authorization for echocardiogram is approved. Auth #BS-77-22841. Valid 90 days from approval date.',      time: 'Mon',      date: 'Mar 23',    pages: 1,  unread: false, flagged: false, tags: ['Auth'],            tone: 'teal',   routedTo: 'Dr. M. Greaves', classification: 'PHI' },
  { id: 'FX-IN-3370', from: 'Northwest Imaging',          number: '+1 (206) 555-0142', subject: 'Echo report — A24189',                    snippet: 'Transthoracic echocardiogram, performed Mar 18. LVEF 55%. Mild mitral regurgitation. Otherwise unremarkable.',  time: 'Mon',      date: 'Mar 23',    pages: 3,  unread: false, flagged: false, tags: ['PHI','Imaging'],   tone: 'teal',   routedTo: 'Dr. M. Greaves', classification: 'PHI' },
];

type Fax = typeof INBOX_FAXES[number];

const INBOX_TABS = [
  { id: 'all',      label: 'All',      filter: (_f: Fax) => true },
  { id: 'unread',   label: 'Unread',   filter: (f: Fax) => f.unread },
  { id: 'flagged',  label: 'Flagged',  filter: (f: Fax) => f.flagged },
  { id: 'phi',      label: 'PHI only', filter: (f: Fax) => f.classification === 'PHI' },
  { id: 'archived', label: 'Archived', filter: (_f: Fax) => false },
];

const SENDER_FILTERS = ['All senders', 'Labs', 'Insurance', 'Providers', 'Records'];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

// ── LOCAL SUB-COMPONENTS ──────────────────────────────────────────────────────

function DocPreview({ title, from, to, pages }: { title: string; from: string; to: string; pages: number }) {
  return (
    <div className="relative">
      <div
        className="absolute -inset-3 rounded-[32px] -z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(15,23,42,0.04) 0 8px, transparent 8px 16px)',
          backgroundColor: 'rgba(241,245,249,0.6)',
        }}
      />
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 overflow-hidden">
        <div
          className="flex items-center gap-2 px-5 py-3 border-b border-slate-100"
          style={{ background: 'linear-gradient(90deg, var(--color-primary-subtle), white)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
          <span className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: 'var(--color-primary)' }}>
            {title}
          </span>
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
              <div
                key={i}
                className="h-2 rounded-full"
                style={{
                  width: w === 'long' ? '92%' : w === 'med' ? '70%' : '40%',
                  background: 'linear-gradient(90deg, #e2e8f0, #f1f5f9)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
      {children}
    </button>
  );
}

function FaxListItem({ f, selected, onClick }: { f: Fax; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 transition ${selected ? 'bg-[var(--color-primary-subtle)] border-l-2 border-l-[var(--color-primary)]' : 'border-l-2 border-l-transparent hover:bg-slate-50'}`}
    >
      <div className="flex gap-3">
        <Avatar name={f.from} size={36} tone={f.tone} />
        <div className="flex-1 min-w-0 space-y-0.5">
          {/* Row 1: name + flag + time */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[13.5px] truncate flex-1 ${f.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
              {f.from}
            </span>
            {f.flagged && (
              <I.Star size={13} className="shrink-0 text-amber-400 fill-amber-400" />
            )}
            <span className="text-[11.5px] font-mono text-slate-400 shrink-0">{f.time}</span>
          </div>
          {/* Row 2: subject */}
          <div className={`text-[12.5px] truncate ${f.unread ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
            {f.subject}
          </div>
          {/* Row 3: snippet */}
          <div className="text-[12px] text-slate-400 truncate">{f.snippet}</div>
          {/* Row 4: unread dot + pages + routedTo + tags */}
          <div className="flex items-center gap-2 pt-0.5">
            {f.unread && (
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }} />
            )}
            <span className="text-[11px] font-mono text-slate-400 shrink-0">{f.pages}p</span>
            {f.routedTo && (
              <span className="text-[11px] text-slate-400 shrink-0">→ {f.routedTo}</span>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              {f.tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function InboxDetail({ f, onMarkRead, onToggleFlag }: { f: Fax | undefined; onMarkRead: () => void; onToggleFlag: () => void }) {
  if (!f) {
    return (
      <Card className="overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
          >
            <I.Inbox size={26} />
          </div>
          <div className="text-[16px] font-semibold text-slate-900">No fax selected</div>
          <div className="text-[13.5px] text-slate-500 max-w-xs">Select a fax from the list to preview it here.</div>
        </div>
      </Card>
    );
  }

  const thumbnailCount = Math.min(7, f.pages);
  const extraPages = f.pages - 7;

  return (
    <Card className="overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 240px)' }}>
      {/* Header */}
      <div className="p-6 pb-5 border-b border-slate-100 space-y-4 shrink-0">
        {/* Sender row */}
        <div className="flex items-start gap-3">
          <Avatar name={f.from} size={42} tone={f.tone} />
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold text-slate-900 leading-tight">{f.from}</div>
            <div className="text-[12.5px] text-slate-500 font-mono mt-0.5">
              {f.number} · {f.date} · {f.time} · {f.id}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onToggleFlag}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-slate-100"
              style={{ color: f.flagged ? '#f59e0b' : '#94a3b8' }}
            >
              <I.Star size={16} className={f.flagged ? 'fill-amber-400' : ''} />
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
              <I.More size={16} />
            </button>
          </div>
        </div>

        {/* Subject */}
        <div
          className="text-[26px] leading-tight font-semibold text-slate-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {f.subject}
        </div>

        {/* Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {f.classification === 'PHI' ? (
            <Pill tone="violet" dot={false}>
              <I.Lock size={11} strokeWidth={2} /> PHI
            </Pill>
          ) : (
            <Pill tone="amber" dot={false}>
              <I.Lock size={11} strokeWidth={2} /> {f.classification}
            </Pill>
          )}
          {f.tags.map(tag => (
            <Pill key={tag} tone="slate" dot={false}>{tag}</Pill>
          ))}
          {f.routedTo && (
            <Pill tone="teal" dot={false}>→ {f.routedTo}</Pill>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <AppButton size="sm" icon={<I.Forward size={13} />}>Forward</AppButton>
          <AppButton size="sm" variant="secondary" icon={<I.Send size={13} />}>Reply by fax</AppButton>
          <AppButton size="sm" variant="secondary" icon={<I.Download size={13} />}>Download</AppButton>
          <AppButton size="sm" variant="secondary">Print</AppButton>
          {f.unread && (
            <AppButton size="sm" variant="ghost" onClick={onMarkRead}>Mark read</AppButton>
          )}
        </div>
      </div>

      {/* Preview body */}
      <div className="flex-1 overflow-auto p-6 space-y-6" style={{ background: 'rgba(248,250,252,0.4)' }}>
        <DocPreview
          title={f.subject}
          from={f.number}
          to="FaxGrid · Seattle Office"
          pages={f.pages}
        />

        {/* Thumbnail strip */}
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {Array.from({ length: thumbnailCount }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-16 aspect-[3/4] rounded-xl border flex flex-col p-2 gap-1.5 relative overflow-hidden"
              style={{
                background: '#f8fafc',
                borderColor: i === 0 ? 'var(--color-primary)' : '#e2e8f0',
                boxShadow: i === 0 ? '0 0 0 1px var(--color-primary)' : undefined,
              }}
            >
              {[70, 50, 80, 40, 60].map((w, j) => (
                <div key={j} className="h-1 rounded-full bg-slate-200" style={{ width: `${w}%` }} />
              ))}
              <div className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] text-slate-400 font-medium">
                {i + 1}
              </div>
            </div>
          ))}
          {extraPages > 0 && (
            <div className="shrink-0 w-16 aspect-[3/4] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
              <span className="text-[11px] font-semibold text-slate-400">+{extraPages}</span>
            </div>
          )}
        </div>

        {/* Auto-extracted OCR card */}
        <div className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--color-primary-subtle)' }}>
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z"/>
              <path d="M18 15l.75 2.25L21 18l-2.25.75L18 21l-.75-2.25L15 18l2.25-.75Z"/>
              <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5Z"/>
            </svg>
            <span className="text-[12.5px] font-semibold" style={{ color: 'var(--color-primary)' }}>Auto-extracted</span>
          </div>
          <p className="text-[12.5px] text-slate-600 leading-relaxed">{f.snippet}</p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { label: 'Patient ID',      value: 'A24189' },
              { label: 'Date of service', value: 'Mar 22, 2025' },
              { label: 'Document type',   value: f.tags[0] ?? 'Fax' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/70 rounded-xl px-3 py-2">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
                <div className="text-[12.5px] font-semibold text-slate-800 mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [tab, setTab] = useState('all');
  const [senderFilter, setSenderFilter] = useState('All senders');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(INBOX_FAXES);
  const [selectedId, setSelectedId] = useState<string>(INBOX_FAXES[0].id);

  const tabDef = INBOX_TABS.find(t => t.id === tab) || INBOX_TABS[0];

  const filtered = items.filter(f => {
    if (!tabDef.filter(f)) return false;
    if (search && !`${f.from} ${f.subject} ${f.snippet}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = items.find(f => f.id === selectedId);
  const totalUnread = items.filter(f => f.unread).length;
  const totalPHI = items.filter(f => f.classification === 'PHI' && f.unread).length;

  const counts = Object.fromEntries(INBOX_TABS.map(t => [t.id, items.filter(t.filter).length]));

  const markRead = (id = selectedId) => setItems(arr => arr.map(f => f.id === id ? { ...f, unread: false } : f));
  const toggleFlag = (id = selectedId) => setItems(arr => arr.map(f => f.id === id ? { ...f, flagged: !f.flagged } : f));

  return (
    <div>
      {/* Header card */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Inbox · {totalUnread} unread</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
              style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>
              Anything urgent in here?
            </h1>
            <p className="text-[14px] text-slate-500 mt-2">Inbound faxes route here automatically. Unread items at the top, flagged at the bottom.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <div className="relative">
              <I.Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faxes, contacts…"
                className="pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-[var(--color-primary)] w-[260px] placeholder:text-slate-400" />
            </div>
            <button className="relative w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900">
              <I.Bell size={17} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
            </button>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>New fax</AppButton>
            <AppButton variant="secondary" icon={<I.Cog size={14} />}>Routing rules</AppButton>
          </div>
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Unread" value={String(totalUnread)} helper="4 in last hour" trend="up" icon={<I.Inbox size={15} />} />
        <StatCard label="Awaiting routing" value="1" helper="auto-routes when matched" icon={<I.Zap size={15} />} />
        <StatCard label="PHI unread" value={String(totalPHI)} helper="review within 24h" icon={<I.Shield size={15} />} />
        <StatCard label="Avg time in inbox" value="2.4h" helper="↓ 12% this week" trend="up" icon={<I.Clock size={15} />} />
      </div>

      {/* Filter bar */}
      <Card className="px-4 py-3 mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {INBOX_TABS.map(t => (
            <Tab key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
              {counts[t.id] > 0 && (
                <span className={`ml-1.5 text-[11px] ${tab === t.id ? 'text-white/70' : 'text-slate-400'}`}>{counts[t.id]}</span>
              )}
            </Tab>
          ))}
        </div>
        <span className="w-px h-5 bg-slate-200 mx-2" />
        <div className="flex items-center gap-1">
          {SENDER_FILTERS.map(s => (
            <button key={s} onClick={() => setSenderFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[12px] font-medium transition ${senderFilter === s ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <I.Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inbox…"
            className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[12.5px] w-[220px] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400" />
        </div>
      </Card>

      {/* List + detail split */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <Card className="overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <input type="checkbox" className="rounded" style={{ accentColor: 'var(--color-primary)' }} />
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
                <FaxListItem key={f.id} f={f} selected={f.id === selectedId}
                  onClick={() => { setSelectedId(f.id); markRead(f.id); }} />
              ))}
            </div>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <InboxDetail f={selected} onMarkRead={() => markRead()} onToggleFlag={() => toggleFlag()} />
        </div>
      </div>
    </div>
  );
}
