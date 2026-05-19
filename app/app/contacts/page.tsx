'use client';
import { useState, useEffect, useRef } from 'react';
import { I } from '@/components/app/icons';
import { Pill, AppButton, Avatar, SectionTitle } from '@/components/app/primitives';

const CONTACT_CATEGORIES = [
  { id: 'all',       label: 'All contacts',  count: 13,  tone: 'slate' },
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
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',             dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',               fg: '#475569',             dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',               fg: '#6d28d9',             dot: '#8b5cf6' },
};

const AVATAR_COLOR_MAP: Record<string, { bg: string; fg: string }> = {
  BP: { bg: '#fef3c7',                       fg: '#d97706' },
  SM: { bg: 'var(--color-phi-bg)',            fg: 'var(--color-phi)' },
  PL: { bg: 'var(--color-processing-bg)',    fg: 'var(--color-processing)' },
  AC: { bg: 'var(--color-review-bg)',        fg: 'var(--color-review)' },
  DS: { bg: 'var(--color-primary-subtle)',   fg: 'var(--color-primary)' },
  DM: { bg: '#f0fdf4',                       fg: '#16a34a' },
  GH: { bg: '#fef3c7',                       fg: '#d97706' },
  QD: { bg: 'var(--color-processing-bg)',    fg: 'var(--color-processing)' },
  NI: { bg: 'var(--color-primary-subtle)',   fg: 'var(--color-primary)' },
};

function getInitials(name: string): string {
  const words = name.split(/[\s·]+/).filter(w => w.length > 0);
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function getAvatarStyle(name: string): { bg: string; fg: string } {
  const initials = getInitials(name);
  return AVATAR_COLOR_MAP[initials] ?? { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)' };
}

function chipLabel(name: string): string {
  const parts = name.split(/\s*·\s*/)[0].trim().split(/\s+/);
  return parts.slice(0, 2).join(' ');
}

function sparkFor(id: string): number[] {
  let s = 0;
  for (const c of id) s = ((s * 31 + c.charCodeAt(0)) >>> 0);
  return Array.from({ length: 12 }, () => { s = ((s * 1103515245 + 12345) >>> 0); return 2 + (s % 9); });
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 'var(--radius-pill)',
        background: active ? 'var(--color-primary)' : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
        fontFamily: 'var(--font-body)',
      }}
    >
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
      <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>{children}</div>;
}

function StatItem({ label, value, helper, trend, icon, tooltip }: {
  label: string; value: string; helper?: string; trend?: 'up' | 'down'; icon?: React.ReactNode; tooltip?: string;
}) {
  const [tipVisible, setTipVisible] = useState(false);
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 12.5,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-tertiary)',
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
          }}>{label}</span>
          {tooltip && (
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setTipVisible(true)}
                onMouseLeave={() => setTipVisible(false)}
                style={{
                  width: 16, height: 16,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: tipVisible ? '1px solid var(--color-primary)' : '1px solid var(--color-border-strong)',
                  color: tipVisible ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  fontSize: 10,
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'border-color var(--duration-fast), color var(--duration-fast)',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >?</button>
              {tipVisible && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--color-surface-dark)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: 12,
                  maxWidth: 220,
                  width: 'max-content',
                  boxShadow: 'var(--shadow-modal)',
                  zIndex: 50,
                  pointerEvents: 'none',
                  lineHeight: 1.5,
                  fontFamily: 'var(--font-body)',
                }}>{tooltip}</div>
              )}
            </div>
          )}
        </div>
        {icon && (
          <span style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            flexShrink: 0,
          }}>{icon}</span>
        )}
      </div>
      <span style={{
        fontSize: 44,
        lineHeight: 1,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-heading)',
      }}>{value}</span>
      {helper && (
        <div style={{
          fontSize: 12.5,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : 'var(--color-text-secondary)',
          fontFamily: 'var(--font-body)',
        }}>
          {trend === 'up' && <I.ArrowUp size={12} strokeWidth={2.4} />}
          {trend === 'down' && <I.ArrowDown size={12} strokeWidth={2.4} />}
          {helper}
        </div>
      )}
    </div>
  );
}

function ContactPin({ c, onOpen }: { c: Contact; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const spark = sparkFor(c.id);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface)',
        border: 'none',
        boxShadow: hovered ? 'var(--shadow-panel)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: `all var(--duration-base) var(--ease-out)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <div style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Avatar name={c.name} size={42} tone={c.tone} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Pill tone={c.tone} dot={false} className="mb-1.5">{c.category}</Pill>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 6 }}>{c.name}</div>
          {c.attn && <div style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.attn}</div>}
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{c.number}</div>
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Last 30d</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.recent} faxes</div>
        </div>
        <Sparkline data={spark} w={72} h={24} />
      </div>
    </button>
  );
}

function ContactRow({ c, onOpen, isLast }: { c: Contact; onOpen: () => void; isLast?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cellStyle: React.CSSProperties = {
    padding: '14px 20px',
    borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
  };
  return (
    <tr
      style={{
        cursor: 'pointer',
        background: hovered ? 'var(--color-primary-subtle)' : 'transparent',
        transition: `background var(--duration-fast)`,
      }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={cellStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={c.name} size={36} tone={c.tone} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subtitle || '—'}</div>
          </div>
        </div>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{c.number}</span>
      </td>
      <td style={cellStyle}>
        <Pill tone={c.tone} dot={false}>{c.category}</Pill>
      </td>
      <td style={{ ...cellStyle, fontSize: 13, color: 'var(--color-text-secondary)' }}>{c.lastSent}</td>
      <td style={cellStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.deliveryRate}%</span>
          <div style={{ width: 64, height: 6, borderRadius: 999, background: 'var(--color-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'var(--color-primary)', width: `${c.deliveryRate}%` }} />
          </div>
        </div>
      </td>
      <td style={{ ...cellStyle, textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          <button
            onClick={e => e.stopPropagation()}
            style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <I.Send size={13} />
          </button>
          <button
            onClick={e => e.stopPropagation()}
            style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
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
                      <div className="text-[18px] font-semibold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-heading), system-ui' }}>{s.value}</div>
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
                        <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: 'var(--color-primary)' }} />
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

const RECENT_NAMES = ['BlueShield Prior Auth', 'Pacific Lab Diagnostics', 'Swedish Medical · Records'];

export default function ContactsPage() {
  const [cat, setCat] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [open, setOpen] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [dropHover, setDropHover] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = CONTACTS.filter(c => {
    if (cat !== 'all' && c.category.toLowerCase().replace(' / ', '/').replace(' ', '') !== cat) return false;
    if (searchValue && !`${c.name} ${c.number} ${c.subtitle}`.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  useEffect(() => { setPage(1); }, [cat, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedContacts = filtered.slice((page - 1) * pageSize, page * pageSize);
  const showStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showEnd = Math.min(page * pageSize, filtered.length);

  const recentContacts = RECENT_NAMES.map(n => CONTACTS.find(c => c.name === n)).filter(Boolean) as Contact[];
  const dropResults = searchValue
    ? CONTACTS.filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase()))
    : null;

  const sectionLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-tertiary)',
    padding: '10px 16px 6px',
    display: 'block',
  };

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* ── Header — sits directly on var(--color-bg) ── */}
      <div style={{
        padding: '32px 0 24px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 4,
          }}>
            ADDRESS BOOK · {CONTACTS.length} CONTACTS
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.15,
          }}>
            Your fax directory.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            margin: 0,
            marginTop: 4,
          }}>
            Recipients you fax regularly — organizations and people. Saved contacts auto-fill the compose form.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingTop: 4 }}>
          <AppButton variant="secondary" size="md" icon={<I.Upload size={14} />}>↑ Import CSV</AppButton>
          <AppButton variant="primary" size="md" icon={<I.Plus size={15} strokeWidth={2.4} />}>+ New contact</AppButton>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: 24 }}>
        <div style={{ width: '260px', minWidth: '260px' }}><StatItem label="Contacts" value={String(CONTACTS.length)} helper="+4 this month" trend="up" icon={<I.Contacts size={15} />} /></div>
        <div style={{ width: '260px', minWidth: '260px' }}><StatItem label="Organizations" value="76" helper="across 11 categories" icon={<I.Building size={15} />} /></div>
        <div style={{ width: '260px', minWidth: '260px' }}><StatItem label="Verified numbers" value="262" helper="of 284 total" icon={<I.Shield size={15} />} tooltip="Fax numbers confirmed to receive transmissions successfully. Unverified numbers haven't had a successful delivery yet and may increase failed send risk." /></div>
        <div style={{ width: '260px', minWidth: '260px' }}><StatItem label="Avg delivery" value="98.9%" helper="↑ 0.4 vs last month" trend="up" icon={<I.Sparkle size={15} />} tooltip="Average delivery success rate across all contacts over the last 30 days. Industry average is typically 94–96%." /></div>
      </div>

      {/* ── Pinned strip ── */}
      <div className="mb-7">
        <SectionTitle title="Pinned" subtitle="Your most-used recipients — pinned for one-tap sending."
          action={<AppButton variant="ghost" size="sm">Manage</AppButton>} />
        <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {PINNED.map(p => <ContactPin key={p.id} c={p} onOpen={() => setOpen(p)} />)}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Category rail ── */}
        <aside style={{ width: '280px', minWidth: '280px', maxWidth: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Category card */}
          <div style={{
            background: 'var(--color-surface)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: 16,
          }}>
            <div style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-tertiary)',
              fontWeight: 600,
              padding: '0 4px',
              marginBottom: 8,
              fontFamily: 'var(--font-body)',
            }}>Categories</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CONTACT_CATEGORIES.map(c => {
                const active = cat === c.id;
                return (
                  <CategoryItem
                    key={c.id}
                    active={active}
                    onClick={() => setCat(c.id)}
                    dot={STATUS_TONES[c.tone]?.dot}
                    label={c.label}
                    count={c.count}
                  />
                );
              })}
              <button
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 4,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <I.Plus size={13} /> New category
              </button>
            </div>
          </div>

          {/* Auto-cleanup card */}
          <div style={{
            background: 'var(--color-primary-subtle)',
            border: 'none',
            borderLeft: '3px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            padding: '16px 20px',
            maxWidth: '280px',
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
              }}>
                <I.Sparkle size={15} />
              </span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>Auto-cleanup</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>5 contacts haven&apos;t received a fax in 12+ months. Review and archive?</div>
                <button style={{
                  marginTop: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                }}>Review →</button>
              </div>
            </div>
          </div>

        </aside>

        {/* ── Directory ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'var(--color-surface)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}>

            {/* Search + toggle bar */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-surface)',
            }}>
              {/* Search pill with dropdown */}
              <div
                ref={searchRef}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-strong)',
                  borderColor: searchFocused ? 'var(--color-primary)' : 'var(--color-border-strong)',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(61,80,128,0.12)' : 'var(--shadow-card)',
                  flex: 1,
                  outline: 'none',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none', flexShrink: 0 }}
                >
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search contacts, numbers, ATTN..."
                  value={searchValue}
                  onFocus={() => setSearchFocused(true)}
                  onChange={e => { setSearchValue(e.target.value); setSearchFocused(true); }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                    paddingLeft: '38px',
                    paddingRight: '16px',
                    width: '100%',
                    height: '100%',
                    fontFamily: 'var(--font-sora)',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                  }}
                />

                {/* Autosuggest dropdown */}
                {searchFocused && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-modal)',
                    border: '1px solid var(--color-border)',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}>
                    {!searchValue ? (
                      <>
                        {/* Recent */}
                        <span style={sectionLabelStyle}>Recent</span>
                        {recentContacts.map(c => (
                          <div
                            key={c.id}
                            onMouseEnter={() => setDropHover('recent-' + c.id)}
                            onMouseLeave={() => setDropHover(null)}
                            onClick={() => { setSearchValue(c.name); setSearchFocused(false); }}
                            style={{
                              padding: '10px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              cursor: 'pointer',
                              background: dropHover === 'recent-' + c.id ? 'var(--color-primary-subtle)' : 'transparent',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span style={{ fontFamily: 'var(--font-sora)', fontSize: 13, color: 'var(--color-text-primary)' }}>{c.name}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 'auto' }}>{c.number}</span>
                          </div>
                        ))}

                        {/* Pinned */}
                        <div style={{ borderTop: '1px solid var(--color-border)' }}>
                          <span style={sectionLabelStyle}>Pinned</span>
                          <div style={{ padding: '6px 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {PINNED.map(c => {
                              const av = getAvatarStyle(c.name);
                              const initials = getInitials(c.name);
                              const isHovered = dropHover === 'pin-' + c.id;
                              return (
                                <div
                                  key={c.id}
                                  onMouseEnter={() => setDropHover('pin-' + c.id)}
                                  onMouseLeave={() => setDropHover(null)}
                                  onClick={() => { setSearchValue(c.name); setSearchFocused(false); }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 10px 4px 4px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: isHovered ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                    background: isHovered ? 'var(--color-primary-subtle)' : 'var(--color-bg)',
                                    cursor: 'pointer',
                                    transition: 'all var(--duration-fast)',
                                  }}
                                >
                                  <div style={{
                                    width: 20, height: 20, borderRadius: 999,
                                    background: av.bg, color: av.fg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 8, fontWeight: 700, flexShrink: 0,
                                  }}>{initials}</div>
                                  <span style={{ fontFamily: 'var(--font-sora)', fontSize: 12, color: 'var(--color-text-primary)' }}>
                                    {chipLabel(c.name)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : dropResults && dropResults.length > 0 ? (
                      dropResults.map(c => {
                        const av = getAvatarStyle(c.name);
                        const initials = getInitials(c.name);
                        return (
                          <div
                            key={c.id}
                            onMouseEnter={() => setDropHover('res-' + c.id)}
                            onMouseLeave={() => setDropHover(null)}
                            onClick={() => { setSearchValue(c.name); setSearchFocused(false); }}
                            style={{
                              padding: '10px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              cursor: 'pointer',
                              background: dropHover === 'res-' + c.id ? 'var(--color-primary-subtle)' : 'transparent',
                            }}
                          >
                            <div style={{
                              width: 28, height: 28, borderRadius: 999,
                              background: av.bg, color: av.fg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 600, flexShrink: 0,
                            }}>{initials}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{c.name}</div>
                              {c.subtitle && <div style={{ fontFamily: 'var(--font-sora)', fontSize: 11, color: 'var(--color-text-tertiary)' }}>{c.subtitle}</div>}
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 'auto', flexShrink: 0 }}>{c.number}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: '20px 16px', textAlign: 'center', fontFamily: 'var(--font-sora)', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                        No contacts match &ldquo;{searchValue}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 4 }}>{filtered.length} of {CONTACTS.length}</span>
              <div style={{ flex: 1 }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 'var(--radius-pill)',
                padding: 2,
              }}>
                <Tab active={view === 'table'} onClick={() => setView('table')}>List</Tab>
                <Tab active={view === 'grid'} onClick={() => setView('grid')}>Cards</Tab>
              </div>
              <button style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}>
                <I.Filter size={14} />
              </button>
            </div>

            {view === 'table' ? (
              <div className="overflow-auto scrollbar-thin">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Name', 'Fax number', 'Category', 'Last sent', 'Delivery', 'Actions'].map(h => (
                        <th
                          key={h}
                          style={{
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontWeight: 600,
                            color: 'var(--color-text-tertiary)',
                            padding: '10px 20px',
                            textAlign: h === 'Actions' ? 'right' : 'left',
                            background: 'var(--color-bg)',
                            borderBottom: '1px solid var(--color-border)',
                            fontFamily: 'var(--font-body)',
                            whiteSpace: 'nowrap',
                            minWidth: h === 'Fax number' ? 160 : undefined,
                          }}
                        >{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContacts.map((c, i) => (
                      <ContactRow key={c.id} c={c} onOpen={() => setOpen(c)} isLast={i === paginatedContacts.length - 1} />
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '48px 20px', fontSize: 13.5 }}>
                          No contacts match.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 280px))', gap: 12, justifyContent: 'flex-start' }}>
                {paginatedContacts.map(c => (
                  <button key={c.id} onClick={() => setOpen(c)}
                    className="text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[var(--color-primary)] transition flex gap-3">
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

            {/* Pagination bar */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>
                Showing {showStart}–{showEnd} of {filtered.length} contacts
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-strong)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 10px',
                    fontSize: 13,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                  }}
                >
                  {[15, 25, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
                </select>
                <AppButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : undefined }}
                >
                  Previous
                </AppButton>
                <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                  Page {page} of {totalPages}
                </span>
                <AppButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  style={{ opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'not-allowed' : undefined }}
                >
                  Next
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactDrawer c={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function CategoryItem({
  active, onClick, dot, label, count,
}: {
  active: boolean; onClick: () => void; dot: string; label: string; count: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 'var(--radius-pill)',
        textAlign: 'left',
        background: active ? 'var(--color-primary)' : hovered ? 'var(--color-primary-subtle)' : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: dot }} />
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', opacity: active ? 0.65 : 1 }}>{count}</span>
    </button>
  );
}
