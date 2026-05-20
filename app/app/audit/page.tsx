'use client';
import { useState, useMemo } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const AUDIT_EVENTS = [
  { ts: 'Mar 24 · 10:51 AM', who: 'Amelia Park',        action: 'Viewed fax receipt',       target: 'FX-9824-1A',                            category: 'PHI access',     tone: 'teal',   ip: '10.0.4.18',   note: 'Northwind VPN' },
  { ts: 'Mar 24 · 10:43 AM', who: 'System',              action: 'Fax delivered',             target: 'FX-9824-1A · 7 pages',                  category: 'Transmission',   tone: 'emerald',ip: '—',           note: 'Tier-1 carrier' },
  { ts: 'Mar 24 · 10:42 AM', who: 'Dr. M. Greaves',      action: 'Sent fax',                  target: 'FX-9824-1A → BlueShield Prior Auth',     category: 'Transmission',   tone: 'teal',   ip: '10.0.4.62',   note: 'Cardiology · Floor 3' },
  { ts: 'Mar 24 · 09:58 AM', who: 'Amelia Park',         action: 'Updated routing rule',      target: 'Inbox · Auths team',                    category: 'Configuration',  tone: 'amber',  ip: '10.0.4.18',   note: 'Match changed: "BlueShield" → "BlueShield|Aetna"' },
  { ts: 'Mar 24 · 09:31 AM', who: 'Tom Iwasaki',         action: 'Failed login (2FA)',         target: 'tom@northwindhealth.example',            category: 'Security',       tone: 'red',    ip: '73.118.4.201',note: 'TOTP code expired' },
  { ts: 'Mar 24 · 09:30 AM', who: 'Tom Iwasaki',         action: 'Signed in',                 target: 'Web · Chrome 134',                       category: 'Security',       tone: 'slate',  ip: '73.118.4.201',note: 'Verified via SSO' },
  { ts: 'Mar 23 · 04:48 PM', who: 'System',              action: 'Fax retried',               target: 'FX-9817-2D · attempt 2',                category: 'Transmission',   tone: 'amber',  ip: '—',           note: 'First attempt: NO_ANSWER' },
  { ts: 'Mar 23 · 03:12 PM', who: 'Priya Khanna',        action: 'Downloaded receipt',        target: 'FX-9810-5C',                            category: 'PHI access',     tone: 'teal',   ip: '10.0.4.44',   note: 'Audit-only · downloaded as PDF' },
  { ts: 'Mar 23 · 02:09 PM', who: 'Amelia Park',         action: 'Invited team member',       target: 'noor@northwindhealth.example · Reviewer',category: 'Workspace',      tone: 'slate',  ip: '10.0.4.18',   note: '' },
  { ts: 'Mar 23 · 11:47 AM', who: 'System',              action: 'Retention policy applied',  target: '37 faxes archived to cold storage',     category: 'Compliance',     tone: 'violet', ip: '—',           note: '7-year retention triggered' },
  { ts: 'Mar 23 · 09:14 AM', who: 'API · webhook-prod',  action: 'API key used',              target: 'POST /v1/faxes',                         category: 'Security',       tone: 'slate',  ip: '52.39.0.14',  note: 'Key fg_live_•••a91c · 14 calls / hour' },
  { ts: 'Mar 22 · 06:02 PM', who: 'Amelia Park',         action: 'Exported audit log',        target: 'Range: Mar 1 – Mar 22',                 category: 'Compliance',     tone: 'violet', ip: '10.0.4.18',   note: 'CSV · 4,128 events' },
];
type AuditEvent = typeof AUDIT_EVENTS[number];

const ACTIVITY_BY_HOUR = [
  { label: '12a', value: 4,  highlight: false },
  { label: '3a',  value: 1,  highlight: false },
  { label: '6a',  value: 8,  highlight: false },
  { label: '9a',  value: 42, highlight: true },
  { label: '12p', value: 38, highlight: false },
  { label: '3p',  value: 51, highlight: true },
  { label: '6p',  value: 18, highlight: false },
  { label: '9p',  value: 6,  highlight: false },
];

const CATEGORIES = ['All', 'PHI access', 'Transmission', 'Security', 'Configuration', 'Workspace', 'Compliance'];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  red:     { bg: '#fef2f2',               fg: '#b91c1c',             dot: '#ef4444' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
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

function EventModal({ e, onClose }: { e: AuditEvent; onClose: () => void }) {
  const [tab, setTab] = useState('Details');
  const eventId = useMemo(() => 'evt_ky23gi2v', []);
  const tabs = ['Details', 'Raw payload', 'Chain of custody'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div
        className="relative w-[980px] max-w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[14px] border border-white/85 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.35)]"
        onClick={ev => ev.stopPropagation()}>

        {/* Header */}
        <div className="relative p-7 pb-5 shrink-0" style={{ background: 'linear-gradient(135deg, rgba(204,251,241,0.6) 0%, rgba(240,253,250,0.4) 100%)' }}>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-500 hover:bg-white/90 transition">
            <I.X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone={e.tone}>{e.category}</Pill>
            <span className="text-[12.5px] font-mono text-slate-500">{e.ts}</span>
          </div>
          <div className="text-[12px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Action</div>
          <div className="text-[30px] font-semibold text-slate-900 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{e.action}</div>
          <div className="text-[13.5px] font-mono text-slate-500 mt-1">{e.target}</div>
          <div className="flex items-center gap-1 mt-5">
            {tabs.map(t => <Tab key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Tab>)}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7">
          {tab === 'Details' && (
            <>
              {/* 4-col grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Actor</div>
                  <div className="flex items-center gap-2">
                    {e.who === 'System' || e.who.startsWith('API') ? (
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><I.Cog size={14} /></span>
                    ) : (
                      <Avatar name={e.who} size={32} tone="teal" />
                    )}
                    <span className="text-[13.5px] font-medium text-slate-900">{e.who}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">IP address</div>
                  <span className="text-[13.5px] font-mono text-slate-700">{e.ip}</span>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Source</div>
                  <span className="text-[13.5px] text-slate-700">{e.note || '—'}</span>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Event ID</div>
                  <span className="text-[12.5px] font-mono text-slate-600">{eventId}</span>
                </div>
              </div>

              {/* 2-col grid */}
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-7">
                  <SoftCard className="p-5">
                    <div className="text-[13px] font-semibold text-slate-700 mb-3">Context</div>
                    <div className="space-y-0">
                      {[
                        { k: 'Workspace',   v: 'Northwind Health' },
                        { k: 'Environment', v: 'Production' },
                        { k: 'Region',      v: 'us-west-2' },
                        { k: 'Captured at', v: e.ts },
                        { k: 'Retention',   v: '7 years (HIPAA)' },
                      ].map(row => (
                        <div key={row.k} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                          <span className="text-[12.5px] text-slate-500">{row.k}</span>
                          <span className="text-[13px] text-slate-800">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </SoftCard>
                </div>
                <div className="col-span-5 space-y-4">
                  <SoftCard className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <I.Lock size={13} style={{ color: 'var(--color-primary)' }} />
                      <span className="text-[12.5px] font-semibold text-slate-700">Write-once record</span>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed">This event cannot be modified or deleted. SHA-256 signed and anchored to the audit chain.</p>
                  </SoftCard>
                  <SoftCard className="p-5">
                    <div className="text-[13px] font-semibold text-slate-700 mb-3">Related events</div>
                    <div className="space-y-2">
                      {[
                        { label: 'Connected',     time: '10:42:24', active: false },
                        { label: 'This event',    time: '10:43:18', active: true },
                        { label: 'Receipt issued',time: '10:43:19', active: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${item.active ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`} style={item.active ? { background: 'var(--color-primary)' } : undefined} />
                          <span className={`text-[12.5px] flex-1 ${item.active ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>{item.label}</span>
                          <span className="text-[11.5px] font-mono text-slate-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </SoftCard>
                </div>
              </div>
            </>
          )}

          {tab === 'Raw payload' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-slate-700">Raw event payload · signed JSON</span>
                <div className="flex items-center gap-2">
                  <AppButton variant="ghost" size="sm" icon={<I.Document size={13} />}>Copy</AppButton>
                  <AppButton variant="ghost" size="sm" icon={<I.Download size={13} />}>Download JSON</AppButton>
                </div>
              </div>
              <pre className="rounded-2xl bg-slate-950 text-emerald-400 text-[12px] font-mono p-5 overflow-auto max-h-[320px] leading-relaxed whitespace-pre-wrap">
                {JSON.stringify({
                  ts: e.ts,
                  actor: e.who,
                  action: e.action,
                  target: e.target,
                  category: e.category,
                  ip: e.ip,
                  source: e.note,
                  workspace: 'northwind-health',
                  event_id: eventId,
                  signed: true,
                  signature: 'sha256:3d2e1f...a7c9b2',
                }, null, 2)}
              </pre>
              <div className="mt-3 text-[12px] font-mono text-slate-500">SHA-256: 3d2e1f4a8b5c6d7e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e</div>
            </>
          )}

          {tab === 'Chain of custody' && (
            <>
              <div className="space-y-3 mb-6">
                {[
                  { title: 'Event captured',    desc: 'Written to append-only log at the point of occurrence.',                          time: e.ts },
                  { title: 'Hashed & signed',   desc: 'SHA-256 signed with workspace key. Stored in tamper-evident record.',             time: e.ts },
                  { title: 'Anchored to chain', desc: 'Event hash included in hourly chain block.',                                      time: 'Mar 24 · 11:00 AM' },
                  { title: 'Verified hourly',   desc: 'Automated integrity checks confirm chain is unbroken.',                           time: 'Last: Mar 24 · 11:00 AM' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'var(--color-primary)', color: 'white' }}>
                      <I.Check size={12} strokeWidth={2.5} />
                    </span>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-semibold text-slate-900">{step.title}</div>
                      <div className="text-[12.5px] text-slate-500 mt-0.5">{step.desc}</div>
                      <div className="text-[11.5px] font-mono text-slate-400 mt-0.5">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <SoftCard className="p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <I.Shield size={14} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-[13px] font-semibold text-slate-700">HIPAA compliance</span>
                </div>
                <p className="text-[12.5px] text-slate-500 leading-relaxed">This audit log meets the HIPAA Security Rule requirement for audit controls (§164.312(b)). All records are retained for 7 years and are cryptographically verifiable.</p>
              </SoftCard>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AppButton variant="secondary" size="sm" icon={<I.Download size={13} />}>Download evidence</AppButton>
            <AppButton variant="secondary" size="sm" icon={<I.Forward size={13} />}>Share</AppButton>
          </div>
          <AppButton variant="secondary" onClick={onClose}>Close</AppButton>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<AuditEvent | null>(null);
  const [live, setLive] = useState(true);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [actorsHover, setActorsHover] = useState(false);

  const filtered = AUDIT_EVENTS.filter(e => {
    if (cat !== 'All' && e.category !== cat) return false;
    if (search && !`${e.who} ${e.action} ${e.target}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="px-7 py-6 mb-6 flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Audit log</div>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>Every action, on the record.</h1>
          <p className="text-[14px] text-slate-500 mt-2">Tamper-evident trail of access, transmission, and configuration events. Exportable for HIPAA and SOC 2 audits.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <AppButton variant="secondary" icon={<I.Calendar size={14} />}>Last 30 days</AppButton>
          <AppButton variant="secondary" icon={<I.Download size={14} />}>Export CSV</AppButton>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ width: '220px', minWidth: '220px', maxWidth: '220px', flexShrink: 0 }}>
          <StatCard label="Events today" value="284" helper="+12 vs yesterday" trend="up" icon={<I.Audit size={15} />} />
        </div>
        <div style={{ width: '220px', minWidth: '220px', maxWidth: '220px', flexShrink: 0 }}>
          <StatCard label="PHI accesses" value="47" helper="all within policy" icon={<I.Shield size={15} />} />
        </div>
        <div style={{ width: '220px', minWidth: '220px', maxWidth: '220px', flexShrink: 0 }}>
          <StatCard label="Failed sign-ins" value="3" helper="2 blocked by 2FA" icon={<I.Lock size={15} />} />
        </div>
        <div style={{ width: '220px', minWidth: '220px', maxWidth: '220px', flexShrink: 0 }}>
          <StatCard label="Config changes" value="6" helper="last 7 days" icon={<I.Cog size={15} />} />
        </div>
      </div>

      {/* Activity bar chart */}
      <Card className="p-6 mb-6" style={{ maxWidth: '860px' }}>
        <SectionTitle
          title="Activity — last 24 hours"
          subtitle="Hourly volume across all categories. Spikes around 9 AM and 3 PM are typical handoff windows."
          action={
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${live ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {live ? 'Live' : 'Paused'}
              </div>
              <button onClick={() => setLive(l => !l)} className="text-[12.5px] text-slate-500 hover:text-slate-900">{live ? 'Pause' : 'Resume'}</button>
            </div>
          }
        />
        <div className="mt-6"><BarChart data={ACTIVITY_BY_HOUR} height={120} /></div>
      </Card>

      {/* Search bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '42px',
        background: 'var(--color-surface)',
        border: `1px solid ${searchFocused ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
        borderRadius: 'var(--radius-pill)',
        boxShadow: searchFocused ? '0 0 0 3px rgba(61,80,128,0.12)' : 'var(--shadow-card)',
        padding: '0 16px',
        maxWidth: '320px',
        marginBottom: '12px',
        transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
      }}>
        <I.Search size={14} style={{ color: 'var(--color-text-secondary)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search actor, action, target..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: '14px',
            flex: 1,
            width: '100%',
          }}
        />
      </div>

      {/* Filter tabs row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => {
            const isActive = cat === c;
            const isHover = hoveredTab === c && !isActive;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                onMouseEnter={() => setHoveredTab(c)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  background: isActive ? 'var(--color-primary)' : isHover ? 'var(--color-primary-subtle)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 14px',
                  fontFamily: 'Sora, system-ui, sans-serif',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background var(--duration-fast), color var(--duration-fast)',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        <button
          onMouseEnter={() => setActorsHover(true)}
          onMouseLeave={() => setActorsHover(false)}
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            border: `1px solid ${actorsHover ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
            borderRadius: 'var(--radius-pill)',
            padding: '6px 12px',
            background: actorsHover ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background var(--duration-fast), border-color var(--duration-fast)',
          }}
        >
          <I.Filter size={13} />
          All actors
        </button>
      </div>

      {/* Events table */}
      <Card className="overflow-hidden">
        <div className="overflow-auto scrollbar-thin">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['When', 'Actor', 'Action', 'Target', 'Category', 'IP', ''].map((h, i) => (
                  <th key={i} className="text-[11.5px] uppercase tracking-[0.06em] text-slate-500 font-semibold px-4 py-3 text-left bg-slate-50/70 border-b border-slate-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500 text-[13.5px]">No events match those filters.</td></tr>
              ) : filtered.map((e, i) => {
                const isHover = hoveredRow === i;
                return (
                <tr
                  key={i}
                  onClick={() => setOpen(e)}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="border-b border-slate-100 last:border-0"
                  style={{
                    background: isHover ? 'var(--color-primary-subtle)' : 'transparent',
                    transition: 'background var(--duration-fast)',
                    cursor: 'pointer',
                  }}
                >
                  <td className="px-4 py-4 text-slate-500 text-[12.5px] font-mono whitespace-nowrap">{e.ts}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      {e.who === 'System' || e.who.startsWith('API') ? (
                        <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><I.Cog size={13} /></span>
                      ) : (
                        <Avatar name={e.who} size={28} tone={e.tone === 'red' ? 'slate' : 'teal'} />
                      )}
                      <span className="text-[13.5px] font-medium text-slate-900 whitespace-nowrap">{e.who}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13.5px] text-slate-700 whitespace-nowrap">{e.action}</td>
                  <td className="px-4 py-4 text-[13px] text-slate-500 font-mono max-w-[260px] truncate">{e.target}</td>
                  <td className="px-4 py-4"><Pill tone={e.tone}>{e.category}</Pill></td>
                  <td className="px-4 py-4 text-[12.5px] font-mono text-slate-500 whitespace-nowrap">{e.ip}</td>
                  <td
                    className="px-4 py-4 text-right"
                    style={{
                      color: isHover ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                      transition: 'color var(--duration-fast)',
                    }}
                  >
                    <I.Chevron size={14} />
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-[12.5px] text-slate-500">
          <span>Showing {filtered.length} of {AUDIT_EVENTS.length} events · all events are write-once</span>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100">Previous</button>
            <span>Page 1 of 348</span>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100">Next</button>
          </div>
        </div>
      </Card>

      {open && <EventModal e={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
