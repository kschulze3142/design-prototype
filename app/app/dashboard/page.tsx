'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const TODAY_STATS = [
  { label: 'Sent today',      value: '47',    helper: '12 since last hour',   trend: 'up' as const,   icon: 'Sent' },
  { label: 'In flight',       value: '3',     helper: 'Avg confirm 1m 12s',   trend: undefined,        icon: 'Send' },
  { label: 'Inbound today',   value: '18',    helper: '4 awaiting review',    trend: 'up' as const,   icon: 'Inbox' },
  { label: 'Delivery rate',   value: '99.4%', helper: '+0.3 vs. 30-day avg',  trend: 'up' as const,   icon: 'Shield' },
];

const HOURLY = [
  { label: '8a',  value: 2,  highlight: false },
  { label: '9a',  value: 6,  highlight: false },
  { label: '10a', value: 9,  highlight: false },
  { label: '11a', value: 11, highlight: true },
  { label: '12p', value: 7,  highlight: false },
  { label: '1p',  value: 4,  highlight: false },
  { label: '2p',  value: 8,  highlight: false },
  { label: '3p',  value: 10, highlight: false },
  { label: '4p',  value: 5,  highlight: false },
  { label: '5p',  value: 2,  highlight: false },
];

const QUEUE = [
  { id: 'FX-9824-1A', to: 'BlueShield Prior Auth',    number: '+1 (888) 555-0903', pages: 7,  status: 'Transmitting', progress: 0.60, who: 'Dr. M. Greaves', tone: 'amber' },
  { id: 'FX-9824-1B', to: 'Swedish Medical Records',  number: '+1 (206) 555-7711', pages: 3,  status: 'Connecting',   progress: 0.20, who: 'A. Park',         tone: 'amber' },
  { id: 'FX-9824-1C', to: 'Aetna Claims',             number: '+1 (800) 555-2840', pages: 12, status: 'Queued',       progress: 0.05, who: 'K. Liu',          tone: 'slate' },
];

const INBOX_PREVIEW = [
  { from: 'Pacific Lab Diagnostics',   subject: 'Lab results · A24189',     time: '11:14 AM',  tone: 'violet', unread: true,  pages: 4 },
  { from: 'Group Health · Referrals',  subject: 'Referral acknowledgement',  time: '10:47 AM',  tone: 'teal',   unread: true,  pages: 2 },
  { from: 'Aetna Claims',              subject: 'EOB · claim 882-31',        time: '9:32 AM',   tone: 'amber',  unread: false, pages: 6 },
  { from: "Dr. Rivera's Office",       subject: 'Patient transfer summary',   time: 'Yesterday', tone: 'slate',  unread: false, pages: 9 },
];

const TEAM_ACTIVITY = [
  { who: 'Dr. M. Greaves', tone: 'teal',   action: 'sent fax to',          target: 'BlueShield Prior Auth',  time: '2m ago' },
  { who: 'Amelia Park',    tone: 'amber',  action: 'approved a fax flagged', target: 'PHI · A24189',          time: '14m ago' },
  { who: 'Kelly Liu',      tone: 'violet', action: 'added template',        target: 'Discharge summary v3',   time: '1h ago' },
  { who: 'Reception',      tone: 'slate',  action: 'routed inbound to',     target: 'Dr. Rivera',             time: '2h ago' },
];

const SHORTCUTS = [
  { icon: 'Send' as const,      label: 'New fax',       desc: 'Compose and send',   accent: true,  href: '/app/send' },
  { icon: 'Templates' as const, label: 'From template', desc: '12 saved templates', accent: false, href: '/app/templates' },
  { icon: 'Contacts' as const,  label: 'Address book',  desc: '284 contacts',       accent: false, href: '/app/contacts' },
  { icon: 'Audit' as const,     label: 'Audit log',     desc: "Today's activity",   accent: false, href: '/app/audit' },
];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`px-3 py-1.5 text-[13px] rounded-full font-medium transition ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>{children}</button>;
}

function BarChart({ data, height = 200 }: { data: { label: string; value: number; highlight?: boolean }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="flex items-end gap-2 w-full" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-full flex items-end" style={{ height: height - 24 }}>
            <div className="w-full rounded-t-lg transition-all"
              style={{ height: `${(d.value / max) * 100}%`, background: d.highlight ? 'var(--color-primary)' : 'var(--color-primary-subtle)' }} />
          </div>
          <span className="text-[11px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState('Today');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div>
      {/* Header */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Tuesday · May 13</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
              style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>
              Good morning, Amelia.
            </h1>
            <p className="text-[14px] text-slate-500 mt-2">Northwind Health · Cardiology is set up and humming — 47 faxes today, no retries needed.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton variant="secondary" icon={<I.Calendar size={14} />}>{range}</AppButton>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>New fax</AppButton>
          </div>
        </div>
      </Card>

      {/* Onboarding-complete banner */}
      {!bannerDismissed && (
        <Card className="p-5 mb-6 flex items-center gap-4"
          style={{ background: 'linear-gradient(90deg, var(--color-primary-subtle), rgba(255,255,255,0.85))' }}>
          <span className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-primary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="draw-check">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-semibold text-slate-900">Workspace ready · onboarding complete</div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">2 numbers claimed · 9 teammates invited · BAA signed Mar 22 · routing rules active.</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AppButton variant="ghost" size="sm">Review setup</AppButton>
            <button className="text-slate-400 hover:text-slate-700" onClick={() => setBannerDismissed(true)}><I.X size={14} /></button>
          </div>
        </Card>
      )}

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {TODAY_STATS.map((s, i) => {
          const Ico = I[s.icon as keyof typeof I];
          return (
            <StatCard key={i} label={s.label} value={s.value} helper={s.helper}
              trend={s.trend} icon={<Ico size={15} />} />
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Volume chart */}
          <Card className="p-6">
            <SectionTitle
              title="Today's volume"
              subtitle="Outbound by hour · all numbers."
              action={
                <div className="flex items-center gap-1">
                  {['Today', '7 days', '30 days'].map(r => (
                    <Tab key={r} active={range === r} onClick={() => setRange(r)}>{r}</Tab>
                  ))}
                </div>
              }
            />
            <div className="mt-6"><BarChart data={HOURLY} height={200} /></div>
            <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-6">
              <div>
                <div className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Peak hour</div>
                <div className="text-[18px] font-semibold text-slate-900 mt-1">11:00 AM <span className="text-slate-400 font-normal text-[14px]">· 11 faxes</span></div>
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Avg confirm</div>
                <div className="text-[18px] font-semibold text-slate-900 mt-1">1m 12s <span className="text-emerald-600 text-[13px]">↓ 8s</span></div>
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Pages out</div>
                <div className="text-[18px] font-semibold text-slate-900 mt-1">312</div>
              </div>
            </div>
          </Card>

          {/* Live queue */}
          <Card className="p-6">
            <SectionTitle
              title="Live queue"
              subtitle="Outbound faxes in flight or about to send."
              action={<AppButton variant="ghost" size="sm">View sent</AppButton>}
            />
            <div className="mt-5 divide-y divide-slate-100">
              {QUEUE.map(q => (
                <div key={q.id} className="py-4 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 pulse-ring"
                    style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                    <I.Send size={15} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-slate-900 truncate">{q.to}</span>
                      <span className="text-[11.5px] text-slate-400 font-mono">{q.id}</span>
                    </div>
                    <div className="text-[12.5px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="font-mono">{q.number}</span>
                      <span className="text-slate-300">·</span>
                      <span>{q.pages} pages</span>
                      <span className="text-slate-300">·</span>
                      <span>by {q.who}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${q.progress * 100}%`, background: 'var(--color-primary)' }} />
                    </div>
                  </div>
                  <Pill tone={q.tone}>{q.status}</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Quick shortcuts */}
          <Card className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map((s, i) => {
                const Ico = I[s.icon];
                return (
                  <button key={i} className={`text-left p-3.5 rounded-2xl border transition ${s.accent ? 'border-transparent text-white' : 'border-slate-200/70 bg-white hover:border-slate-300 hover:shadow-sm'}`}
                    style={s.accent ? { background: 'var(--color-primary)' } : undefined}>
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.accent ? 'bg-white/15 text-white' : 'bg-slate-50 text-slate-500'}`}>
                      <Ico size={16} />
                    </span>
                    <div className={`text-[13.5px] font-semibold mt-3 ${s.accent ? 'text-white' : 'text-slate-900'}`}>{s.label}</div>
                    <div className={`text-[11.5px] mt-0.5 ${s.accent ? 'text-white/70' : 'text-slate-500'}`}>{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Inbox preview */}
          <Card className="p-6">
            <SectionTitle
              title="Inbox"
              subtitle="4 unread · routed to your queue."
              action={<AppButton variant="ghost" size="sm">Open</AppButton>}
            />
            <div className="mt-4 -mx-2">
              {INBOX_PREVIEW.map((m, i) => (
                <button key={i} className="w-full flex items-start gap-3 px-2 py-3 rounded-xl hover:bg-slate-50 text-left transition">
                  <Avatar name={m.from} size={32} tone={m.tone} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13.5px] truncate ${m.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{m.from}</span>
                      {m.unread && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }} />}
                    </div>
                    <div className="text-[12.5px] text-slate-500 truncate">{m.subject}</div>
                    <div className="text-[11.5px] text-slate-400 mt-0.5">{m.pages} pages</div>
                  </div>
                  <span className="text-[11.5px] text-slate-400 font-mono whitespace-nowrap shrink-0 mt-0.5">{m.time}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Team activity */}
          <Card className="p-6">
            <SectionTitle title="Team activity" />
            <ol className="mt-4 relative pl-5 border-l-2 border-slate-100 space-y-4">
              {TEAM_ACTIVITY.map((a, i) => {
                const tone = STATUS_TONES[a.tone] || STATUS_TONES.slate;
                return (
                  <li key={i} className="relative">
                    <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full ring-4 ring-white" style={{ background: tone.dot }} />
                    <div className="text-[13px] text-slate-700">
                      <span className="font-semibold text-slate-900">{a.who}</span>{' '}
                      <span className="text-slate-500">{a.action}</span>{' '}
                      <span className="font-medium text-slate-900">{a.target}</span>
                    </div>
                    <div className="text-[11.5px] text-slate-400 mt-0.5 font-mono">{a.time}</div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {/* Compliance pulse */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                <I.Shield size={16} />
              </span>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-slate-900">Compliance pulse</div>
                <div className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">All systems green. BAA signed, audit log healthy, encryption at rest verified 4h ago.</div>
                <div className="mt-3 flex items-center gap-2">
                  <Pill tone="emerald">HIPAA</Pill>
                  <Pill tone="emerald">SOC 2</Pill>
                  <Pill tone="teal">BAA</Pill>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
