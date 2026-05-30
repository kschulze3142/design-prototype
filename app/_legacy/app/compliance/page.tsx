'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const COMPLIANCE_CHECKS = [
  { label: 'Business Associate Agreement signed',  status: 'ok',   note: 'Signed Mar 24, 2026 by Amelia Park' },
  { label: 'Encryption at rest (AES-256)',          status: 'ok',   note: 'All archives in us-west-2 · automatic' },
  { label: 'Encryption in transit (TLS 1.3)',       status: 'ok',   note: 'Enforced on all endpoints' },
  { label: 'Multi-factor authentication required',  status: 'warn', note: '9 of 11 active users — 2 pending enrollment' },
  { label: 'Workforce HIPAA training',              status: 'warn', note: '1 member overdue (Tom Iwasaki — due Mar 31)' },
  { label: 'Annual risk assessment',                status: 'ok',   note: 'Completed Feb 12, 2026' },
  { label: 'Audit log retention (7 years)',         status: 'ok',   note: 'Append-only, cryptographically signed' },
  { label: 'Incident response plan',                status: 'ok',   note: 'Last tabletop exercise: Jan 18, 2026' },
  { label: 'Data residency (US-only)',              status: 'ok',   note: 'All processing in us-west-2 + us-east-1' },
];

const SUBPROCESSORS = [
  { name: 'Omega Fax Networks',   purpose: 'Telephony / fax transmission', region: 'United States', status: 'BAA on file' },
  { name: 'Linode S3-compatible', purpose: 'Encrypted document archive',   region: 'United States', status: 'BAA on file' },
  { name: 'Datadog',              purpose: 'Operational logs (no PHI)',     region: 'United States', status: 'Reviewed' },
  { name: 'Stripe',               purpose: 'Billing & invoicing',           region: 'United States', status: 'Reviewed' },
];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
};

function CheckRow({ label, status, note }: { label: string; status: string; note: string }) {
  const tone = status === 'ok' ? 'emerald' : status === 'warn' ? 'amber' : 'red';
  const t = STATUS_TONES[tone] || STATUS_TONES.emerald;
  const [hover, setHover] = useState(false);
  return (
    <div
      className="flex items-center gap-4 px-7 py-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-primary-subtle)' : 'transparent',
        transition: 'background var(--duration-fast)',
        cursor: 'pointer',
      }}
    >
      <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: t.bg, color: t.fg }}>
        {status === 'ok' ? <I.Check size={16} strokeWidth={2.4} /> : <I.Info size={16} strokeWidth={2.4} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium text-slate-900">{label}</div>
        <div className="text-[12px] text-slate-500 mt-0.5">{note}</div>
      </div>
      <Pill tone={tone} dot={false}>{status === 'ok' ? 'Passing' : 'Action'}</Pill>
    </div>
  );
}

function DocumentRow({ d }: { d: { name: string; v: string; date: string; expires: string; icon: 'Document' | 'Shield' | 'Audit' | 'Lock' } }) {
  const Ico = I[d.icon];
  const [hover, setHover] = useState(false);
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200/70"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-primary-subtle)' : 'rgba(255,255,255,0.7)',
        transition: 'background var(--duration-fast)',
        cursor: 'pointer',
      }}
    >
      <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
        <Ico size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
          {d.name} <span className="text-[11px] text-slate-400 font-mono">{d.v}</span>
        </div>
        <div className="text-[12.5px] text-slate-500 mt-0.5">Issued {d.date} · expires {d.expires}</div>
      </div>
      <button
        className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
        style={{ color: hover ? 'var(--color-primary)' : '#64748b', transition: 'color var(--duration-fast)' }}
      ><I.Download size={15} /></button>
      <button
        className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
        style={{ color: hover ? 'var(--color-primary)' : '#64748b', transition: 'color var(--duration-fast)' }}
      ><I.More size={15} /></button>
    </div>
  );
}

function SubprocessorRow({ s }: { s: { name: string; purpose: string; region: string; status: string } }) {
  const [hover, setHover] = useState(false);
  return (
    <tr
      className="border-b border-slate-100 last:border-0"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-primary-subtle)' : 'transparent',
        transition: 'background var(--duration-fast)',
        cursor: 'pointer',
      }}
    >
      <td className="px-4 py-4 text-[14px] font-medium text-slate-900">{s.name}</td>
      <td className="px-4 py-4 text-[13.5px] text-slate-600">{s.purpose}</td>
      <td className="px-4 py-4 text-[13.5px] text-slate-500">{s.region}</td>
      <td className="px-4 py-4"><Pill tone={s.status === 'BAA on file' ? 'emerald' : 'teal'}>{s.status}</Pill></td>
      <td className="px-4 py-4 text-right"><button className="text-slate-400 hover:text-slate-700"><I.Eye size={15} /></button></td>
    </tr>
  );
}

function ContactRow({ p }: { p: { name: string; role: string; email: string; tone: string } }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="flex items-start gap-3 p-2 -mx-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-primary-subtle)' : 'transparent',
        borderRadius: hover ? 'var(--radius-md)' : '0',
        transition: 'background var(--duration-fast), border-radius var(--duration-fast)',
        cursor: 'pointer',
      }}
    >
      <Avatar name={p.name} tone={p.tone} size={36} />
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-slate-900">{p.name}</div>
        <div className="text-[12px] text-slate-500">{p.role}</div>
        <div className="text-[12px] text-slate-500 truncate">{p.email}</div>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const okCount = COMPLIANCE_CHECKS.filter(c => c.status === 'ok').length;
  const score = Math.round((okCount / COMPLIANCE_CHECKS.length) * 100);
  const warnItems = COMPLIANCE_CHECKS.filter(c => c.status === 'warn');

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div className="px-7 py-6 mb-6 flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Compliance</div>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>HIPAA-ready, by default.</h1>
          <p className="text-[14px] text-slate-500 mt-2">Posture, attestations, and the agreements that keep you audit-ready.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <AppButton variant="secondary" icon={<I.Download size={14} />}>Compliance pack</AppButton>
          <AppButton icon={<I.Shield size={14} />}>Request attestation</AppButton>
        </div>
      </div>

      {/* Hero score card */}
      <Card className="p-7 mb-6" style={{ maxWidth: '860px' }}>
        <div className="grid grid-cols-12 gap-7 items-center">
          <div className="col-span-12 md:col-span-4">
            <div className="relative w-44 h-44 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="#eef2f6" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="var(--color-primary)" strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[44px] leading-none font-semibold" style={{ color: 'var(--color-primary)', fontFamily: 'Georgia, serif' }}>{score}</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Posture score</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="text-[12px] uppercase tracking-wider font-bold" style={{ color: 'var(--color-primary)' }}>HIPAA · SOC 2 Type II</div>
            <div className="text-[28px] font-semibold text-slate-900 mt-1.5 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {warnItems.length} item{warnItems.length !== 1 ? 's' : ''} need attention.
            </div>
            <div className="text-[13.5px] text-slate-500 mt-1.5 max-w-xl">Your workspace is in great shape. Resolve these to push your posture to 100% — both can be cleared in under 5 minutes.</div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {warnItems.map(c => (
                <div key={c.label} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <Pill tone="amber">Action needed</Pill>
                  <div className="text-[13.5px] font-semibold text-slate-900 mt-2">{c.label}</div>
                  <div className="text-[12.5px] text-slate-600 mt-1">{c.note}</div>
                  <button className="mt-3 text-[12.5px] font-semibold hover:underline flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                    Resolve <I.Chevron size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Controls grid */}
      <Card className="mb-6 overflow-hidden" style={{ maxWidth: '860px' }}>
        <div className="px-7 pt-6 pb-3">
          <SectionTitle title="Security & privacy controls" subtitle="Auto-evaluated nightly. Last check: 2 hours ago." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="divide-y divide-slate-100">
            {COMPLIANCE_CHECKS.slice(0, 5).map(c => <CheckRow key={c.label} {...c} />)}
          </div>
          <div className="divide-y divide-slate-100">
            {COMPLIANCE_CHECKS.slice(5).map(c => <CheckRow key={c.label} {...c} />)}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents */}
        <Card className="p-6 lg:col-span-2">
          <SectionTitle title="Documents & attestations" subtitle="Auto-renewed before expiry." />
          <div className="mt-5 space-y-3">
            {[
              { name: 'Business Associate Agreement', v: 'v3.2', date: 'Mar 24, 2026', expires: 'Mar 24, 2027', icon: 'Document' as const },
              { name: 'SOC 2 Type II report',         v: 'FY25', date: 'Jan 8, 2026',  expires: 'Jan 8, 2027',  icon: 'Shield' as const },
              { name: 'Risk assessment',              v: '2026', date: 'Feb 12, 2026', expires: 'Feb 12, 2027', icon: 'Audit' as const },
              { name: 'Penetration test summary',     v: 'Q1',   date: 'Jan 22, 2026', expires: 'Jul 22, 2026', icon: 'Lock' as const },
            ].map((d, i) => (
              <DocumentRow key={i} d={d} />
            ))}
          </div>
        </Card>

        {/* Contacts */}
        <Card className="p-6">
          <SectionTitle title="Compliance contacts" />
          <div className="mt-4 space-y-4">
            {[
              { name: 'Amelia Park',    role: 'Privacy officer · primary',     email: 'amelia@northwindhealth.example',  tone: 'teal' },
              { name: 'Dr. M. Greaves', role: 'HIPAA security officer',         email: 'greaves@northwindhealth.example', tone: 'emerald' },
              { name: 'Outside counsel',role: 'Breach notification escalation', email: 'compliance@stein-roe.example',    tone: 'slate' },
            ].map((p, i) => (
              <ContactRow key={i} p={p} />
            ))}
            <button className="w-full p-3 rounded-xl border border-dashed border-slate-300 text-[12.5px] font-medium text-slate-600 hover:border-slate-400 transition flex items-center justify-center gap-2">
              <I.Plus size={13} /> Add contact
            </button>
          </div>
        </Card>
      </div>

      {/* Subprocessors */}
      <Card className="mt-6 overflow-hidden">
        <div className="px-7 pt-6 pb-3">
          <SectionTitle title="Subprocessors" subtitle="Third parties that may process your data, by purpose. We notify you 30 days before changes." />
        </div>
        <div className="overflow-auto scrollbar-thin">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Vendor', 'Purpose', 'Region', 'Status', ''].map((h, i) => (
                  <th key={i} className="text-[11.5px] uppercase tracking-[0.06em] text-slate-500 font-semibold px-4 py-3 text-left bg-slate-50/70 border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBPROCESSORS.map(s => (
                <SubprocessorRow key={s.name} s={s} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
