'use client';
import { useState, useEffect } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const ROLES = [
  { id: 'Admin',     desc: 'Full access incl. billing, security, and audit log.',      count: 2, tone: 'violet', perms: ['Manage workspace','Billing & invoices','Audit log export','All faxes','Compliance settings'] },
  { id: 'Reviewer',  desc: 'Approve outbound faxes flagged as PHI before send.',        count: 3, tone: 'amber',  perms: ['Approve PHI sends','Assigned faxes','Templates'] },
  { id: 'Member',    desc: 'Send and receive faxes assigned to them or their team.',    count: 6, tone: 'teal',   perms: ['Send fax','Read assigned faxes','Templates (use)'] },
  { id: 'Read-only', desc: 'View-only access for auditors and observers.',              count: 1, tone: 'slate',  perms: ['Read assigned faxes','Export receipts'] },
];

const MEMBERS = [
  { id: 'u-1',  name: 'Amelia Park',      email: 'amelia@northwindhealth.example',    role: 'Admin',     team: 'Operations',    tone: 'teal',    mfa: true,  status: 'Active',   lastActive: 'Now',       joined: 'Mar 1, 2024',  faxesSent: 184, you: true,  shared: false },
  { id: 'u-2',  name: 'Dr. M. Greaves',   email: 'greaves@northwindhealth.example',   role: 'Member',    team: 'Cardiology',    tone: 'teal',    mfa: true,  status: 'Active',   lastActive: '2m ago',    joined: 'Apr 12, 2024', faxesSent: 412, you: false, shared: false },
  { id: 'u-3',  name: 'Dr. Priya Khanna', email: 'khanna@northwindhealth.example',    role: 'Member',    team: 'Cardiology',    tone: 'emerald', mfa: true,  status: 'Active',   lastActive: '14m ago',   joined: 'Sep 4, 2024',  faxesSent: 117, you: false, shared: false },
  { id: 'u-4',  name: 'Kelly Liu',        email: 'kelly@northwindhealth.example',     role: 'Reviewer',  team: 'Compliance',    tone: 'amber',   mfa: true,  status: 'Active',   lastActive: '1h ago',    joined: 'Jun 21, 2024', faxesSent: 38,  you: false, shared: false },
  { id: 'u-5',  name: 'Tom Iwasaki',      email: 'tom@northwindhealth.example',       role: 'Member',    team: 'Endocrinology', tone: 'amber',   mfa: true,  status: 'Active',   lastActive: '3h ago',    joined: 'Aug 9, 2024',  faxesSent: 64,  you: false, shared: false },
  { id: 'u-6',  name: 'Noor Hassan',      email: 'noor@northwindhealth.example',      role: 'Reviewer',  team: 'Compliance',    tone: 'violet',  mfa: true,  status: 'Active',   lastActive: 'Yesterday', joined: 'Feb 14, 2025', faxesSent: 22,  you: false, shared: false },
  { id: 'u-7',  name: 'Reception',        email: 'reception@northwindhealth.example', role: 'Member',    team: 'Front desk',    tone: 'slate',   mfa: false, status: 'Active',   lastActive: 'Yesterday', joined: 'Mar 1, 2024',  faxesSent: 88,  you: false, shared: true },
  { id: 'u-8',  name: 'Dr. Sarah Chen',   email: 'schen@northwindhealth.example',     role: 'Reviewer',  team: 'Cardiology',    tone: 'teal',    mfa: true,  status: 'Active',   lastActive: '2d ago',    joined: 'Nov 18, 2024', faxesSent: 41,  you: false, shared: false },
  { id: 'u-9',  name: 'Marcus Riley',     email: 'marcus@northwindhealth.example',    role: 'Read-only', team: 'External Audit',tone: 'slate',   mfa: true,  status: 'Active',   lastActive: '1w ago',    joined: 'Jan 10, 2026', faxesSent: 0,   you: false, shared: false },
  { id: 'u-10', name: 'Dr. Devon Park',   email: 'devon@northwindhealth.example',     role: 'Admin',     team: 'Leadership',    tone: 'emerald', mfa: true,  status: 'Active',   lastActive: '1w ago',    joined: 'Mar 1, 2024',  faxesSent: 12,  you: false, shared: false },
  { id: 'u-11', name: 'Jamie Cortez',     email: 'jamie@northwindhealth.example',     role: 'Member',    team: 'Cardiology',    tone: 'violet',  mfa: false, status: 'Inactive', lastActive: '32d ago',   joined: 'May 4, 2024',  faxesSent: 6,   you: false, shared: false },
];
type Member = typeof MEMBERS[number];

const PENDING = [
  { email: 'rachel@northwindhealth.example', role: 'Member',    sentBy: 'Amelia Park', sentAt: '2 days ago' },
  { email: 'auditor@deloitte.example',       role: 'Read-only', sentBy: 'Amelia Park', sentAt: '5 hours ago' },
];

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',             dot: '#10b981' },
  teal:    { bg: 'rgba(204,251,241,0.6)', fg: 'var(--accent-deep)', dot: 'var(--accent)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
};

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

function RoleBadge({ role }: { role: string }) {
  const r = ROLES.find(x => x.id === role) || ROLES[2];
  return <Pill tone={r.tone} dot={false}>{role}</Pill>;
}

function MemberRow({ m, onOpen }: { m: Member; onOpen: () => void }) {
  const isOnline = m.lastActive === 'Now' || m.lastActive.endsWith('m ago');
  return (
    <tr className="hover:bg-slate-50/70 cursor-pointer transition" onClick={onOpen}>
      <td className="px-4 py-4 text-[14px] text-slate-900 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar name={m.name} size={36} tone={m.tone} />
            {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-slate-900 text-[13.5px]">{m.name}</span>
              {m.you && <Pill tone="teal" dot={false}>You</Pill>}
              {m.shared && <Pill tone="slate" dot={false}>Shared</Pill>}
            </div>
            <div className="text-[12px] text-slate-400 truncate">{m.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-[14px] text-slate-900 border-b border-slate-100"><RoleBadge role={m.role} /></td>
      <td className="px-4 py-4 text-[14px] text-slate-900 border-b border-slate-100">
        <span className="text-[13px] text-slate-600">{m.team}</span>
      </td>
      <td className="px-4 py-4 text-[14px] text-slate-900 border-b border-slate-100">
        <span className="font-mono text-[12.5px] text-slate-500">{m.lastActive}</span>
      </td>
      <td className="px-4 py-4 text-[14px] text-slate-900 border-b border-slate-100">
        {m.mfa ? (
          <span className="flex items-center gap-1.5 text-emerald-600 text-[12.5px] font-medium"><I.Shield size={13} /> On</span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-600 text-[12.5px] font-medium"><I.Info size={13} /> Off</span>
        )}
      </td>
      <td className="px-4 py-4 text-[14px] text-slate-900 border-b border-slate-100 text-right">
        <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 ml-auto" onClick={e => { e.stopPropagation(); }}>
          <I.More size={15} />
        </button>
      </td>
    </tr>
  );
}

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-4 border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>
      {children}
    </div>
  );
}

function MemberDetailModal({ m, onClose, onRoleChange }: { m: Member | null; onClose: () => void; onRoleChange: (id: string, role: string) => void }) {
  const [tab, setTab] = useState('Profile');
  const [notifyEmail, setNotifyEmail] = useState(true);

  if (!m) return null;

  const firstName = m.name.split(' ')[0];
  const tabs = ['Profile', 'Permissions', 'Activity', 'Sessions'];
  const currentRole = ROLES.find(r => r.id === m.role) || ROLES[2];

  const isOnline = m.lastActive === 'Now' || m.lastActive.endsWith('m ago');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[820px] max-h-[88vh] flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[20px] border border-white/70 shadow-[0_32px_80px_-16px_rgba(15,23,42,0.4)] overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-7 pb-5" style={{ background: 'linear-gradient(135deg, rgba(204,251,241,0.6) 0%, rgba(240,253,250,0.4) 100%)' }}>
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-500 hover:bg-white/90 transition">
            <I.X size={14} />
          </button>
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <Avatar name={m.name} size={64} tone={m.tone} />
              {isOnline && <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[24px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>{m.name}</span>
                {m.you && <Pill tone="teal" dot={false}>You</Pill>}
              </div>
              <div className="text-[13.5px] text-slate-500 mt-0.5">{m.email}</div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <RoleBadge role={m.role} />
                <Pill tone="slate" dot={false}>{m.team}</Pill>
                <Pill tone={m.mfa ? 'emerald' : 'amber'} dot={false}>{m.mfa ? 'MFA on' : 'No MFA'}</Pill>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AppButton variant="secondary" size="sm" icon={<I.Note size={13} />}>Edit</AppButton>
              <AppButton variant="secondary" size="sm" icon={<I.Send size={13} />}>Message</AppButton>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-5">
            {tabs.map(t => <Tab key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Tab>)}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-5">
          {tab === 'Profile' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full name', value: m.name },
                { label: 'Email', value: m.email },
                { label: 'Team', value: m.team },
                { label: 'Joined', value: m.joined },
                { label: 'Last sign-in', value: m.lastActive },
                { label: 'Faxes sent · 90d', value: String(m.faxesSent) },
              ].map(f => (
                <div key={f.label} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{f.label}</div>
                  <div className="text-[14px] text-slate-800 mt-1 font-medium truncate">{f.value}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Permissions' && (
            <>
              <div>
                <div className="text-[13px] font-semibold text-slate-700 mb-3">Role</div>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => {
                    const active = m.role === r.id;
                    return (
                      <button key={r.id} onClick={() => onRoleChange(m.id, r.id)}
                        className="text-left p-4 rounded-2xl border-2 transition"
                        style={{ borderColor: active ? 'var(--accent)' : '#e2e8f0', background: active ? 'oklch(0.96 0.04 var(--accent-h))' : 'white' }}>
                        <div className="flex items-center justify-between">
                          <Pill tone={r.tone} dot={false}>{r.id}</Pill>
                          {active && <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)', color: 'white' }}><I.Check size={11} strokeWidth={2.5} /></span>}
                        </div>
                        <div className="text-[12.5px] text-slate-500 mt-2 leading-relaxed">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-700 mb-3">What {firstName} can do</div>
                <SoftCard className="p-0 overflow-hidden">
                  <div className="grid grid-cols-2">
                    {currentRole.perms.map((perm, i) => (
                      <div key={perm} className={`flex items-center gap-2.5 px-4 py-3 ${i < currentRole.perms.length - (currentRole.perms.length % 2 === 0 ? 2 : 1) ? 'border-b border-slate-100' : ''}`}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent)', color: 'white' }}>
                          <I.Check size={10} strokeWidth={2.5} />
                        </span>
                        <span className="text-[13px] text-slate-700">{perm}</span>
                      </div>
                    ))}
                  </div>
                </SoftCard>
              </div>
            </>
          )}

          {tab === 'Activity' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Sent · 90d', value: String(m.faxesSent) },
                  { label: m.role === 'Reviewer' || m.role === 'Admin' ? 'Approved' : 'Approved', value: m.role === 'Reviewer' || m.role === 'Admin' ? '14' : '—' },
                  { label: 'Templates', value: '3' },
                ].map(s => (
                  <SoftCard key={s.label}>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{s.label}</div>
                    <div className="text-[28px] font-semibold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-inter-tight), system-ui' }}>{s.value}</div>
                  </SoftCard>
                ))}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-700 mb-3">Recent activity</div>
                <div className="space-y-1">
                  {[
                    { color: '#10b981', label: 'Signed in', when: 'Today, 9:04 AM', detail: 'Chrome · Seattle, WA' },
                    { color: 'var(--accent)', label: 'Sent fax', when: 'Today, 8:51 AM', detail: 'To +1 (206) 555-0199 · 3 pages' },
                    { color: '#f59e0b', label: 'Approved PHI fax', when: 'Yesterday, 4:12 PM', detail: 'Authorization for Dr. Patel referral' },
                    { color: '#8b5cf6', label: 'Updated template', when: 'Mar 24, 2026', detail: '"Prior Auth Request" template v2' },
                  ].map((ev, i) => (
                    <div key={i} className="flex gap-4 items-start py-2.5 border-b border-slate-100 last:border-0">
                      <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: ev.color }} />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-medium text-slate-900">{ev.label}</div>
                        <div className="text-[12px] text-slate-400">{ev.detail}</div>
                      </div>
                      <span className="text-[12px] text-slate-400 font-mono shrink-0">{ev.when}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'Sessions' && (
            <div className="space-y-3">
              {[
                { device: 'Chrome on macOS', location: 'Seattle, WA', ip: '98.102.44.11', when: 'Active now', current: true },
                { device: 'Safari on iPhone 15', location: 'Seattle, WA', ip: '98.102.44.11', when: '3 hours ago', current: false },
                { device: 'Chrome on Windows', location: 'Bellevue, WA', ip: '71.218.30.4', when: '2 days ago', current: false },
              ].map((sess, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                  <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <I.Lock size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-medium text-slate-900">{sess.device}</span>
                      {sess.current && <Pill tone="emerald" dot={false}>This device</Pill>}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5">{sess.location} · {sess.ip} · {sess.when}</div>
                  </div>
                  {!sess.current && (
                    <button className="text-[12.5px] font-semibold text-red-600 hover:text-red-700 shrink-0">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <button className="text-[13px] font-semibold text-red-600 hover:text-red-700">Remove from workspace</button>
          <AppButton variant="secondary" onClick={onClose}>Close</AppButton>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Member | null>(null);
  const [members, setMembers] = useState(MEMBERS);

  const filtered = members.filter(m => {
    if (roleFilter !== 'All' && m.role !== roleFilter) return false;
    if (search && !`${m.name} ${m.email} ${m.team}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const onRoleChange = (id: string, role: string) => {
    setMembers(arr => arr.map(m => m.id === id ? { ...m, role } : m));
  };

  useEffect(() => {
    if (open) {
      const fresh = members.find(m => m.id === open.id);
      if (fresh && fresh !== open) setOpen(fresh);
    }
  }, [members]);

  return (
    <div>
      {/* Header */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Team · {members.length} members</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>Who's on the line.</h1>
            <p className="text-[14px] text-slate-500 mt-2">Manage workspace members, assign roles, and keep tabs on access — without leaving FaxGrid.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton variant="secondary" icon={<I.Shield size={14} />}>Security policy</AppButton>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>Invite people</AppButton>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Members" value={String(members.length)} helper={`${members.filter(m => m.status === 'Active').length} active`} icon={<I.Team size={15} />} />
        <StatCard label="Admins" value={String(members.filter(m => m.role === 'Admin').length)} helper="2 of 5 seats" icon={<I.Shield size={15} />} />
        <StatCard label="MFA coverage" value={`${Math.round(members.filter(m => m.mfa).length / members.length * 100)}%`} helper={`${members.filter(m => !m.mfa).length} without MFA`} trend="up" icon={<I.Lock size={15} />} />
        <StatCard label="Pending invites" value={String(PENDING.length)} helper="oldest sent 2 days ago" icon={<I.Send size={15} />} />
      </div>

      {/* Pending invites */}
      {PENDING.length > 0 && (
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14.5px] font-semibold text-slate-900">{PENDING.length} pending invitation{PENDING.length !== 1 ? 's' : ''}</div>
              <div className="text-[12.5px] text-slate-500 mt-0.5">Invitees haven't accepted yet. Resend or revoke below.</div>
            </div>
            <AppButton variant="ghost" size="sm">Cancel all</AppButton>
          </div>
          <div className="space-y-2">
            {PENDING.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/60">
                <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400"><I.Send size={14} /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-slate-900 truncate">{p.email}</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5 flex items-center gap-1">
                    Invited as <RoleBadge role={p.role} /> by {p.sentBy} · {p.sentAt}
                  </div>
                </div>
                <AppButton variant="ghost" size="sm">Resend</AppButton>
                <button className="text-[12.5px] text-slate-500 hover:text-red-600 font-semibold px-2">Revoke</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40 flex-wrap">
              <div className="flex items-center gap-1">
                {['All', ...ROLES.map(r => r.id)].map(r => (
                  <Tab key={r} active={roleFilter === r} onClick={() => setRoleFilter(r)}>
                    {r}
                    {r !== 'All' && <span className={`ml-1.5 text-[11px] ${roleFilter === r ? 'text-white/70' : 'text-slate-400'}`}>{members.filter(m => m.role === r).length}</span>}
                  </Tab>
                ))}
              </div>
              <div className="flex-1" />
              <div className="relative">
                <I.Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…"
                  className="pl-8 py-1.5 rounded-xl border border-slate-200 bg-white text-[12.5px] w-[200px] focus:outline-none focus:border-[var(--accent)] placeholder:text-slate-400" />
              </div>
            </div>
            <div className="overflow-auto scrollbar-thin">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Member','Role','Team','Last active','MFA','Actions'].map(h => (
                      <th key={h} className={`text-[11.5px] uppercase tracking-[0.06em] text-slate-500 font-semibold px-4 py-3 text-left bg-slate-50/70 border-b border-slate-100 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => <MemberRow key={m.id} m={m} onOpen={() => setOpen(m)} />)}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-slate-500 py-12 text-[13.5px]">No members match. Try clearing the filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-6">
            <SectionTitle title="Roles" subtitle="What each role can do." />
            <div className="mt-5 space-y-3">
              {ROLES.map(r => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <Pill tone={r.tone} dot={false}>{r.id}</Pill>
                    <span className="text-[11.5px] text-slate-500 font-mono">{r.count} member{r.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-[12.5px] text-slate-600 mt-2 leading-relaxed">{r.desc}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[12.5px] font-semibold flex items-center gap-1 hover:underline" style={{ color: 'var(--accent-deep)' }}>
              <I.Cog size={12} /> Customize roles
            </button>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'oklch(0.96 0.04 var(--accent-h))', color: 'var(--accent-deep)' }}><I.Shield size={15} /></span>
              <div>
                <div className="text-[13.5px] font-semibold text-slate-900">Security policy</div>
                <div className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">MFA required for all members. SSO via Okta. Session timeout: 12 hours.</div>
                <button className="mt-2 text-[12.5px] font-semibold hover:underline" style={{ color: 'var(--accent-deep)' }}>Manage →</button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <MemberDetailModal m={open} onClose={() => setOpen(null)} onRoleChange={onRoleChange} />
    </div>
  );
}
