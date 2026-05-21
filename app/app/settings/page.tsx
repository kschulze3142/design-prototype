'use client';
import React, { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, SectionTitle } from '@/components/app/primitives';
import { AutomationsSection } from './automations/AutomationsSection';

type SettingsItem = {
  id: string;
  label: string;
  icon: keyof typeof I;
  desc: string;
  danger: boolean;
};

type SettingsSection = {
  group: string;
  items: SettingsItem[];
};

const SETTINGS_SECTIONS: SettingsSection[] = [
  { group: 'Workspace', items: [
    { id: 'workspace',     label: 'Workspace',     icon: 'Building',  desc: 'Name, logo, identity',    danger: false },
    { id: 'defaults',      label: 'Defaults',      icon: 'Cog',       desc: 'Sender + cover defaults', danger: false },
    { id: 'notifications', label: 'Notifications', icon: 'Bell',      desc: 'Email, Slack, SMS',       danger: false },
    { id: 'automations',   label: 'Automations',   icon: 'Zap',       desc: 'Rules and triggers',      danger: false },
    { id: 'integrations',  label: 'Integrations',  icon: 'Sparkle',   desc: 'EHR, SSO, webhooks',      danger: false },
  ]},
  { group: 'Security & Compliance', items: [
    { id: 'security',    label: 'Security',       icon: 'Lock',      desc: 'MFA, SSO, sessions',      danger: false },
    { id: 'compliance',  label: 'Compliance',     icon: 'Shield',    desc: 'BAA, retention, audit',   danger: false },
    { id: 'api',         label: 'API & webhooks', icon: 'Cog',       desc: 'Programmatic access',     danger: false },
  ]},
  { group: 'Account', items: [
    { id: 'profile', label: 'Your profile', icon: 'Contacts', desc: 'Personal details',        danger: false },
    { id: 'danger',  label: 'Danger zone',  icon: 'Trash',    desc: 'Export, transfer, delete', danger: true },
  ]},
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <span
      onClick={() => onChange(!checked)}
      className="inline-flex shrink-0 w-9 h-5 rounded-full cursor-pointer transition relative"
      style={{ background: checked ? 'var(--color-primary)' : '#cbd5e1' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
        style={{ left: checked ? '18px' : '2px' }}
      />
    </span>
  );
}

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>
      {children}
    </div>
  );
}

function SettingRow({ label, helper, children, danger = false }: {
  label: string; helper?: string; children: React.ReactNode; danger?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="flex items-start justify-between gap-6 py-4 px-3 border-b border-slate-100 last:border-0"
      style={{
        background: hover ? 'var(--color-primary-subtle)' : undefined,
        borderRadius: 'var(--radius-md)',
        transition: 'var(--duration-fast)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex-1 min-w-0 pt-1">
        <div className={`text-[14px] font-semibold ${danger ? 'text-red-700' : 'text-slate-900'}`}>{label}</div>
        {helper && <div className="text-[12.5px] text-slate-500 mt-0.5 leading-relaxed max-w-md">{helper}</div>}
      </div>
      <div className="shrink-0 min-w-[260px] flex justify-end">{children}</div>
    </div>
  );
}

function FocusSelect({ children, style, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hover || focused;
  return (
    <select
      {...rest}
      className={inputCls}
      style={{
        ...style,
        borderColor: active ? 'var(--color-primary)' : undefined,
        boxShadow: active ? '0 0 0 3px rgba(61,80,128,0.12)' : undefined,
        transition: 'var(--duration-fast)',
      }}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); rest.onMouseLeave?.(e); }}
      onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
    >
      {children}
    </select>
  );
}

function ReplaceButton() {
  const [hover, setHover] = useState(false);
  return (
    <AppButton
      variant="secondary"
      size="sm"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-primary)' : undefined,
        color: hover ? '#fff' : undefined,
        transition: 'var(--duration-fast)',
      }}
    >
      Replace
    </AppButton>
  );
}

function IntegrationCard({ name, desc, icon, status, accent }: {
  name: string; desc: string; icon: React.ReactNode; status: 'connected' | 'available';
  accent: { bg: string; fg: string };
}) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex items-start gap-3">
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: accent.bg, color: accent.fg }}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-slate-900">{name}</div>
          <div className="text-[12.5px] text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
        </div>
        {status === 'connected' && <Pill tone="emerald">Connected</Pill>}
      </div>
      <div className="mt-4 flex items-center gap-2">
        {status === 'connected' ? (
          <>
            <AppButton variant="secondary" size="sm" icon={<I.Cog size={13} />}>Configure</AppButton>
            <button className="text-[12.5px] text-red-600 hover:text-red-700 font-semibold px-2">Disconnect</button>
          </>
        ) : (
          <AppButton variant="secondary" size="sm" icon={<I.Plus size={13} />}>Connect</AppButton>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 transition";

function WorkspaceSection() {
  return (
    <>
      <SectionTitle title="Workspace" subtitle="Manage your workspace identity and region preferences." className="mb-5" />
      <Card className="px-6">
        <SettingRow label="Workspace name" helper="Shown to teammates and on outbound cover sheets.">
          <input className={inputCls} style={{ width: 280 }} defaultValue="Northwind Health · Cardiology" />
        </SettingRow>
        <SettingRow label="Workspace logo" helper="Printed on cover pages. 512×512 PNG, transparent background.">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}
            >
              <I.Document size={18} strokeWidth={1.8} />
            </div>
            <ReplaceButton />
          </div>
        </SettingRow>
        <SettingRow label="Billing email" helper="Invoices and payment receipts are sent here.">
          <input className={inputCls} style={{ width: 280 }} defaultValue="billing@northwindhealth.example" />
        </SettingRow>
        <SettingRow label="Time zone" helper="Used for scheduling and office hours.">
          <FocusSelect style={{ width: 280 }}>
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </FocusSelect>
        </SettingRow>
        <SettingRow label="Language" helper="Affects UI copy. Faxes are sent as-uploaded.">
          <FocusSelect style={{ width: 280 }}>
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Español</option>
            <option>Français</option>
          </FocusSelect>
        </SettingRow>
      </Card>
    </>
  );
}

function DefaultsSection() {
  const [coverSheet, setCoverSheet] = useState(true);
  const [autoOcr, setAutoOcr] = useState(true);
  return (
    <>
      <SectionTitle title="Defaults" subtitle="Configure default sender and cover sheet behavior." className="mb-5" />
      <Card className="px-6">
        <SettingRow label="Default sender number">
          <select className={inputCls} style={{ width: 280 }}>
            <option>Cardiology Main — (206) 555-0101</option>
            <option>Referrals — (206) 555-0187</option>
            <option>After Hours — (206) 555-0142</option>
          </select>
        </SettingRow>
        <SettingRow label="Include cover sheet" helper="Auto-attach a cover sheet with sender, recipient, and subject.">
          <Toggle checked={coverSheet} onChange={setCoverSheet} />
        </SettingRow>
        <SettingRow label="Cover signature" helper="Appears beneath the cover note on every outbound cover sheet.">
          <input className={inputCls} style={{ width: 280 }} defaultValue="Northwind Health Cardiology" />
        </SettingRow>
        <SettingRow label="Fax header line" helper="Printed at the top of every page (carrier requirement in some states).">
          <input className={`${inputCls} font-mono`} style={{ width: 280 }} defaultValue="NORTHWIND CARDIO · {{NUMBER}} · {{TS}}" />
        </SettingRow>
        <SettingRow label="Auto-OCR uploads" helper="Run OCR on PDF/image uploads so they're searchable.">
          <Toggle checked={autoOcr} onChange={setAutoOcr} />
        </SettingRow>
        <SettingRow label="Retry policy" helper="Number of times to retry a failed transmission before giving up.">
          <select className={inputCls} style={{ width: 280 }} defaultValue="3 retries (recommended)">
            <option>0 — No retries</option>
            <option>1 retry</option>
            <option>3 retries (recommended)</option>
            <option>5 retries</option>
          </select>
        </SettingRow>
      </Card>
    </>
  );
}

function NotificationsSection() {
  type Ch = 'email' | 'slack' | 'sms';
  type NotifState = Record<string, Record<Ch, boolean>>;
  const [notifs, setNotifs] = useState<NotifState>({
    delivered: { email: true,  slack: false, sms: false },
    failed:    { email: true,  slack: true,  sms: true  },
    inbound:   { email: true,  slack: true,  sms: false },
    phi:       { email: true,  slack: true,  sms: false },
    lowcredit: { email: true,  slack: false, sms: false },
    security:  { email: true,  slack: false, sms: true  },
  });
  const toggle = (id: string, ch: Ch) =>
    setNotifs(p => ({ ...p, [id]: { ...p[id], [ch]: !p[id][ch] } }));

  const events: { id: string; label: string; desc: string }[] = [
    { id: 'delivered', label: 'Fax delivered',        desc: 'When a recipient confirms receipt' },
    { id: 'failed',    label: 'Fax failed',            desc: 'After all retries are exhausted' },
    { id: 'inbound',   label: 'Inbound fax received',  desc: 'When a fax arrives on a number assigned to you' },
    { id: 'phi',       label: 'PHI flagged for review', desc: 'Reviewers only — when a send needs approval' },
    { id: 'lowcredit', label: 'Low credit balance',    desc: 'Under 100 credits remaining' },
    { id: 'security',  label: 'Security events',       desc: 'Sign-in from new device or location' },
  ];

  const channels: { id: string; label: string; helper: string; value: string; dot: string }[] = [
    { id: 'email', label: 'Email', helper: 'Transactional and digest messages',    value: 'amelia@northwindhealth.example', dot: '#10b981' },
    { id: 'slack', label: 'Slack', helper: 'Channel alerts and delivery receipts', value: '#fax-cardiology',               dot: '#8b5cf6' },
    { id: 'sms',   label: 'SMS',   helper: 'Critical-only text notifications',     value: '+1 (206) ••• 0184',             dot: '#f59e0b' },
  ];

  return (
    <>
      <SectionTitle title="Notifications" subtitle="Choose how and when you receive alerts." className="mb-5" />
      <Card className="px-6 mb-4">
        {channels.map(ch => (
          <div key={ch.id} className="flex items-start justify-between gap-6 py-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-3 pt-1">
              <span className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: ch.dot }} />
              <div>
                <div className="text-[14px] font-semibold text-slate-900">{ch.label}</div>
                <div className="text-[12.5px] text-slate-500 mt-0.5">{ch.helper}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <code className="text-[12px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{ch.value}</code>
              <AppButton variant="ghost" size="sm">Change</AppButton>
            </div>
          </div>
        ))}
      </Card>
      <Card className="px-6">
        <div className="flex items-center gap-4 py-3 border-b border-slate-100">
          <div className="flex-1 text-[11.5px] uppercase tracking-wider text-slate-400 font-semibold">Event</div>
          <div className="w-14 text-center text-[11.5px] uppercase tracking-wider text-slate-400 font-semibold">Email</div>
          <div className="w-14 text-center text-[11.5px] uppercase tracking-wider text-slate-400 font-semibold">Slack</div>
          <div className="w-14 text-center text-[11.5px] uppercase tracking-wider text-slate-400 font-semibold">SMS</div>
        </div>
        {events.map(ev => (
          <div key={ev.id} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-slate-900">{ev.label}</div>
              <div className="text-[12px] text-slate-500 mt-0.5">{ev.desc}</div>
            </div>
            {(['email', 'slack', 'sms'] as Ch[]).map(ch => (
              <div key={ch} className="w-14 flex justify-center">
                <Toggle checked={notifs[ev.id][ch]} onChange={() => toggle(ev.id, ch)} />
              </div>
            ))}
          </div>
        ))}
      </Card>
    </>
  );
}

function IntegrationsSection() {
  const integrations: { name: string; desc: string; icon: React.ReactNode; status: 'connected' | 'available'; accent: { bg: string; fg: string } }[] = [
    { name: 'Epic EHR',                desc: 'Push inbound faxes into patient records and send outbound from MyChart.', icon: <I.Building size={18} />, status: 'connected', accent: { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)' } },
    { name: 'Slack',                   desc: 'Post alerts to a channel when faxes are delivered or fail.',              icon: <I.Sparkle size={18} />, status: 'connected', accent: { bg: '#f5f3ff', fg: '#6d28d9' } },
    { name: 'Okta SSO',                desc: 'Single sign-on with your existing identity provider.',                     icon: <I.Lock size={18} />,    status: 'connected', accent: { bg: '#fffbeb', fg: '#b45309' } },
    { name: 'Zapier',                  desc: 'No-code automations across 6,000+ apps.',                                 icon: <I.Zap size={18} />,     status: 'available', accent: { bg: '#fef2f2', fg: '#b91c1c' } },
    { name: 'Cerner / Oracle Health',  desc: 'HL7-based two-way fax integration.',                                      icon: <I.Building size={18} />, status: 'available', accent: { bg: '#ecfdf5', fg: '#047857' } },
    { name: 'Salesforce Health Cloud', desc: 'Sync recipients and log fax activity to patient records.',                icon: <I.Globe size={18} />,   status: 'available', accent: { bg: '#f1f5f9', fg: '#475569' } },
  ];

  return (
    <>
      <SectionTitle title="Integrations" subtitle="Connect to your existing tools and systems." className="mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(it => (
          <IntegrationCard key={it.name} {...it} />
        ))}
      </div>
    </>
  );
}

function SecuritySection() {
  const [requireMfa, setRequireMfa] = useState(true);
  return (
    <>
      <SectionTitle title="Security" subtitle="Control access, authentication, and session policies." className="mb-5" />
      <Card className="px-6">
        <SettingRow label="Require MFA for all members" helper="All workspace members must enroll in multi-factor authentication.">
          <Toggle checked={requireMfa} onChange={setRequireMfa} />
        </SettingRow>
        <SettingRow label="Single sign-on (SSO)" helper="Authenticate with your identity provider instead of passwords.">
          <div className="flex items-center gap-2">
            <Pill tone="emerald">Okta · Active</Pill>
            <AppButton variant="ghost" size="sm">Configure</AppButton>
          </div>
        </SettingRow>
        <SettingRow label="Session timeout" helper="Automatically sign out inactive sessions after this period.">
          <select className={inputCls} style={{ width: 280 }} defaultValue="12 hours (default)">
            <option>1 hour</option>
            <option>4 hours</option>
            <option>12 hours (default)</option>
            <option>24 hours</option>
          </select>
        </SettingRow>
        <SettingRow label="IP allowlist" helper="Restrict workspace access to approved IP ranges.">
          <AppButton variant="secondary" size="sm" icon={<I.Plus size={13} />}>Add range</AppButton>
        </SettingRow>
        <SettingRow label="Allowed sign-in methods" helper="Control which authentication methods members can use.">
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Pill tone="emerald" dot={false}>SSO</Pill>
            <Pill tone="emerald" dot={false}>Password + MFA</Pill>
            <Pill tone="slate" dot={false}>Magic link · off</Pill>
          </div>
        </SettingRow>
      </Card>
      <Card className="px-6 py-5 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#ecfdf5', color: '#047857' }}>
            <I.Shield size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-slate-900">Security score · 96/100</div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">Your workspace exceeds HIPAA baseline controls. One improvement available.</div>
          </div>
          <AppButton variant="secondary" size="sm" className="ml-auto shrink-0">View details</AppButton>
        </div>
      </Card>
    </>
  );
}

function ComplianceSection() {
  const [autoClassify, setAutoClassify] = useState(true);
  return (
    <>
      <SectionTitle title="Compliance" subtitle="Manage BAA, data retention, and regulatory controls." className="mb-5" />
      <Card className="px-6">
        <SettingRow label="Business Associate Agreement (BAA)" helper="HIPAA-required agreement covering protected health information.">
          <div className="flex items-center gap-2">
            <Pill tone="emerald">Signed Mar 22, 2026</Pill>
            <AppButton variant="ghost" size="sm" icon={<I.Download size={13} />}>Download</AppButton>
          </div>
        </SettingRow>
        <SettingRow label="Default retention" helper="How long fax documents are stored before automatic deletion.">
          <select className={inputCls} style={{ width: 280 }} defaultValue="7 years (default)">
            <option>1 year</option>
            <option>3 years</option>
            <option>7 years (default)</option>
            <option>Indefinite</option>
          </select>
        </SettingRow>
        <SettingRow label="Auto-classify PHI" helper="Automatically flag documents that may contain protected health information.">
          <Toggle checked={autoClassify} onChange={setAutoClassify} />
        </SettingRow>
        <SettingRow label="Audit log export" helper="Export a tamper-evident log of all workspace activity.">
          <AppButton variant="secondary" size="sm">Configure</AppButton>
        </SettingRow>
        <SettingRow label="Data residency" helper="Region where workspace data is stored and processed.">
          <Pill tone="teal" dot={false}>US-WEST-2 (Oregon)</Pill>
        </SettingRow>
      </Card>
    </>
  );
}

function ApiSection() {
  const keys = [
    { label: 'Production', name: 'webhook-prod', masked: '••••••••••••sk-live-4f2a', lastUsed: '2 days ago', calls: '1,240 calls/mo' },
    { label: 'Staging',    name: 'staging',      masked: '••••••••••••sk-test-9c1b', lastUsed: '5 days ago', calls: '83 calls/mo' },
  ];
  return (
    <>
      <SectionTitle title="API & Webhooks" subtitle="Manage programmatic access to your workspace." className="mb-5" />
      <Card className="px-6 mb-4">
        <div className="py-3 border-b border-slate-100">
          <div className="text-[12px] uppercase tracking-wider text-slate-400 font-semibold">API Keys</div>
        </div>
        {keys.map(k => (
          <div key={k.name} className="flex items-center gap-3 py-4 border-b border-slate-100 last:border-0">
            <I.Lock size={14} className="text-slate-400 shrink-0" />
            <span className="text-[13px] font-semibold text-slate-900 w-24 shrink-0">{k.label}</span>
            <code className="text-[12px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 flex-1 truncate">{k.masked}</code>
            <span className="text-[12px] text-slate-400 shrink-0">Last used {k.lastUsed}</span>
            <span className="text-[12px] text-slate-400 shrink-0">{k.calls}</span>
            <AppButton variant="ghost" size="sm" icon={<I.More size={14} />} />
          </div>
        ))}
        <div className="py-4">
          <AppButton variant="secondary" size="sm" icon={<I.Plus size={13} />}>New API key</AppButton>
        </div>
      </Card>
      <Card className="px-6">
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="text-[12px] uppercase tracking-wider text-slate-400 font-semibold">Webhooks</div>
          <AppButton variant="secondary" size="sm" icon={<I.Plus size={13} />}>Add endpoint</AppButton>
        </div>
        <div className="py-5">
          <SoftCard className="px-5 py-4 flex items-center gap-3">
            <I.Info size={15} className="text-slate-400 shrink-0" />
            <span className="text-[13px] text-slate-500">No webhooks configured yet. Add an endpoint to receive real-time event notifications.</span>
          </SoftCard>
        </div>
      </Card>
    </>
  );
}

function ProfileSection() {
  return (
    <>
      <SectionTitle title="Your Profile" subtitle="Manage your personal details and authentication." className="mb-5" />
      <Card className="px-6 mb-4">
        <SettingRow label="Display name">
          <input className={inputCls} style={{ width: 280 }} defaultValue="Amelia Chen" />
        </SettingRow>
        <SettingRow label="Email">
          <input className={inputCls} style={{ width: 280 }} defaultValue="amelia@northwindhealth.example" type="email" />
        </SettingRow>
        <SettingRow label="Avatar">
          <div className="flex items-center gap-3">
            <Avatar name="Amelia Chen" size={48} tone="teal" />
            <AppButton variant="secondary" size="sm" icon={<I.Upload size={13} />}>Upload</AppButton>
          </div>
        </SettingRow>
        <SettingRow label="Phone">
          <input className={`${inputCls} font-mono`} style={{ width: 280 }} placeholder="+1 (206) 555-0100" />
        </SettingRow>
        <SettingRow label="Personal signature">
          <textarea className={`${inputCls} min-h-[80px] resize-y`} style={{ width: 280 }} placeholder="Dr. Amelia Chen, MD" />
        </SettingRow>
      </Card>
      <Card className="px-6">
        <div className="py-3 border-b border-slate-100">
          <div className="text-[12px] uppercase tracking-wider text-slate-400 font-semibold">Authentication</div>
        </div>
        <SettingRow label="Password">
          <AppButton variant="secondary" size="sm">Change</AppButton>
        </SettingRow>
        <SettingRow label="Two-factor auth">
          <Pill tone="emerald"><I.Shield size={11} strokeWidth={2.4} />Active</Pill>
        </SettingRow>
        <SettingRow label="Active sessions">
          <AppButton variant="secondary" size="sm">Review</AppButton>
        </SettingRow>
      </Card>
    </>
  );
}

function DangerSection() {
  return (
    <>
      <SectionTitle title="Danger Zone" subtitle="Irreversible actions — proceed with caution." className="mb-5" />
      <Card className="px-6" style={{ borderColor: '#fecaca' }}>
        <SettingRow danger label="Export all workspace data" helper="Download a complete archive of all faxes, contacts, and settings.">
          <AppButton variant="secondary" size="sm">Request export</AppButton>
        </SettingRow>
        <SettingRow danger label="Transfer ownership" helper="Hand over billing and admin control to another workspace member.">
          <AppButton variant="secondary" size="sm">Transfer…</AppButton>
        </SettingRow>
        <SettingRow danger label="Delete workspace" helper="Permanently delete this workspace and all its data. This cannot be undone.">
          <AppButton variant="danger" size="sm" icon={<I.Trash size={13} />}>Delete workspace</AppButton>
        </SettingRow>
      </Card>
    </>
  );
}

function SidebarItem({ item, active, onClick }: {
  item: SettingsItem;
  active: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const Ico = I[item.icon];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl ${active ? 'bg-slate-900 text-white' : item.danger ? 'text-red-600' : 'text-slate-700'}`}
      style={{
        background: !active && hover ? 'var(--color-primary-subtle)' : undefined,
        borderRadius: !active && hover ? 'var(--radius-md)' : undefined,
        transition: 'var(--duration-fast)',
        cursor: 'pointer',
      }}
    >
      <Ico size={15} />
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] font-semibold leading-tight">{item.label}</span>
        <span className={`block text-[11.5px] leading-tight mt-0.5 truncate ${active ? 'text-white/60' : item.danger ? 'text-red-500/70' : 'text-slate-500'}`}>{item.desc}</span>
      </span>
    </button>
  );
}

function DiscardButton() {
  const [hover, setHover] = useState(false);
  return (
    <AppButton
      variant="ghost"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-primary-subtle)' : undefined,
        color: hover ? 'var(--color-primary)' : undefined,
        transition: 'var(--duration-fast)',
      }}
    >
      Discard
    </AppButton>
  );
}

function SaveChangesButton() {
  const [hover, setHover] = useState(false);
  return (
    <AppButton
      icon={<I.Check size={14} strokeWidth={2.4} />}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--color-primary)',
        transform: hover ? 'translateY(-1px)' : undefined,
        boxShadow: hover ? 'var(--shadow-panel)' : undefined,
        transition: 'var(--duration-fast)',
      }}
    >
      Save changes
    </AppButton>
  );
}

export default function SettingsPage() {
  const [section, setSection] = useState('workspace');
  const allItems = SETTINGS_SECTIONS.flatMap(g => g.items);
  const current = allItems.find(i => i.id === section) || allItems[0];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div className="px-7 py-6 mb-6 flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Settings</div>
          <h1
            className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
            style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}
          >
            {current.id === 'profile' ? 'Make it yours.' : 'Workspace controls.'}
          </h1>
          <p className="text-[14px] text-slate-500 mt-2">Tune defaults, security, and integrations for Northwind Health · Cardiology.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <AppButton variant="secondary" icon={<I.Help size={14} />}>Docs</AppButton>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Left rail */}
        <aside className="col-span-12 lg:col-span-3">
          <Card className="p-3 sticky top-6">
            {SETTINGS_SECTIONS.map(g => (
              <div key={g.group} className="mb-2 last:mb-0">
                <div className="text-[10.5px] uppercase tracking-wider text-slate-500 font-semibold px-3 mt-3 mb-1.5">{g.group}</div>
                <div className="space-y-0.5">
                  {g.items.map(item => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      active={section === item.id}
                      onClick={() => setSection(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </aside>

        {/* Main panel */}
        <div className="col-span-12 lg:col-span-9" key={section}>
          {section === 'workspace'     && <WorkspaceSection />}
          {section === 'defaults'      && <DefaultsSection />}
          {section === 'notifications' && <NotificationsSection />}
          {section === 'automations'   && <AutomationsSection />}
          {section === 'integrations'  && <IntegrationsSection />}
          {section === 'security'      && <SecuritySection />}
          {section === 'compliance'    && <ComplianceSection />}
          {section === 'api'           && <ApiSection />}
          {section === 'profile'       && <ProfileSection />}
          {section === 'danger'        && <DangerSection />}

          {!['danger', 'integrations', 'automations'].includes(section) && (
            <div className="mt-6 flex items-center justify-end gap-2">
              <DiscardButton />
              <SaveChangesButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
