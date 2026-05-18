'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { I } from '@/components/app/icons';

type Role = 'admin' | 'reviewer' | 'member' | 'readonly';

interface Member {
  initials: string;
  name: string;
  email: string;
  role: Role;
  team: string;
  lastActive: string;
  mfa: boolean;
  you?: boolean;
  shared?: boolean;
}

const MEMBERS: Member[] = [
  { initials: 'AP', name: 'Amelia Park',      you: true,    email: 'amelia@northwindhealth.example',    role: 'admin',    team: 'Operations',     lastActive: 'Now',       mfa: true  },
  { initials: 'MG', name: 'Dr. M. Greaves',               email: 'greaves@northwindhealth.example',   role: 'member',   team: 'Cardiology',     lastActive: '2m ago',    mfa: true  },
  { initials: 'PK', name: 'Dr. Priya Khanna',             email: 'khanna@northwindhealth.example',    role: 'member',   team: 'Cardiology',     lastActive: '14m ago',   mfa: true  },
  { initials: 'KL', name: 'Kelly Liu',                    email: 'kelly@northwindhealth.example',     role: 'reviewer', team: 'Compliance',     lastActive: '1h ago',    mfa: true  },
  { initials: 'TI', name: 'Tom Iwasaki',                  email: 'tom@northwindhealth.example',       role: 'member',   team: 'Endocrinology',  lastActive: '3h ago',    mfa: true  },
  { initials: 'NH', name: 'Noor Hassan',                  email: 'noor@northwindhealth.example',      role: 'reviewer', team: 'Compliance',     lastActive: 'Yesterday', mfa: true  },
  { initials: 'R',  name: 'Reception',        shared: true, email: 'reception@northwindhealth.example', role: 'member', team: 'Front desk',     lastActive: 'Yesterday', mfa: false },
  { initials: 'DS', name: 'Dr. Sarah Chen',               email: 'schen@northwindhealth.example',     role: 'reviewer', team: 'Cardiology',    lastActive: '2d ago',    mfa: true  },
  { initials: 'MR', name: 'Marcus Riley',                 email: 'mriley@northwindhealth.example',    role: 'readonly', team: 'External Audit', lastActive: '1w ago',   mfa: true  },
  { initials: 'DP', name: 'Dr. Devon Park',               email: 'devon@northwindhealth.example',     role: 'admin',    team: 'Leadership',     lastActive: '1w ago',    mfa: true  },
  { initials: 'JC', name: 'Jamie Cortez',                 email: 'jcortez@northwindhealth.example',   role: 'member',   team: 'Cardiology',     lastActive: '32d ago',   mfa: false },
];

const PENDING_INVITES = [
  { initials: 'R',  email: 'rachel@northwindhealth.example', role: 'member'   as Role, invitedBy: 'Amelia Park', when: '2 days ago'  },
  { initials: 'AU', email: 'auditor@deloitte.example',       role: 'readonly' as Role, invitedBy: 'Amelia Park', when: '5 hours ago' },
];

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin', reviewer: 'Reviewer', member: 'Member', readonly: 'Read-only',
};

const FILTER_TABS: { key: string; label: string; count: number }[] = [
  { key: 'all',      label: 'All',       count: 11 },
  { key: 'admin',    label: 'Admin',     count: 2  },
  { key: 'reviewer', label: 'Reviewer',  count: 3  },
  { key: 'member',   label: 'Member',    count: 5  },
  { key: 'readonly', label: 'Read-only', count: 1  },
];

const ROLE_CARD_DATA: { role: Role; count: number; desc: string }[] = [
  { role: 'admin',    count: 2, desc: 'Full access incl. billing, security, and audit log.' },
  { role: 'reviewer', count: 3, desc: 'Approve outbound faxes flagged as PHI before send.'  },
  { role: 'member',   count: 5, desc: 'Send and receive faxes assigned to them or their team.' },
  { role: 'readonly', count: 1, desc: 'View-only access for auditors and observers.'          },
];

const COL = '2fr 1fr 1fr 1fr 1fr 80px';

// ── Sub-components ─────────────────────────────────────────────────────────────

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'var(--color-primary-subtle)', color: 'var(--color-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, fontFamily: 'var(--font-body)',
    }}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    borderRadius: 'var(--radius-sm)', padding: '2px 8px',
    fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
  };
  const variants: Record<Role, React.CSSProperties> = {
    admin:    { background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' },
    reviewer: { background: 'var(--color-phi-bg)',         color: 'var(--color-phi)'     },
    member:   { background: 'var(--color-bg)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' },
    readonly: { background: 'var(--color-bg)', color: 'var(--color-text-tertiary)',  border: '1px solid var(--color-border)' },
  };
  return <span style={{ ...base, ...variants[role] }}>{ROLE_LABELS[role]}</span>;
}

function SmallBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: 'var(--color-bg)', color: 'var(--color-text-tertiary)',
      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
      padding: '1px 6px', fontSize: 10, fontWeight: 600, marginLeft: 6,
      display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-body)',
    }}>
      {children}
    </span>
  );
}

function Dot({ color }: { color: string }) {
  return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

function LastActive({ value }: { value: string }) {
  if (value === 'Now') {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-delivered)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
        <Dot color="var(--color-delivered)" /> Now
      </span>
    );
  }
  const isRecent = value.endsWith('m ago') || value.endsWith('h ago');
  return (
    <span style={{ color: isRecent ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
      {value}
    </span>
  );
}

function MfaStatus({ on }: { on: boolean }) {
  return on ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-delivered)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
      <Dot color="var(--color-delivered)" /> On
    </span>
  ) : (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-review)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}>
      <Dot color="var(--color-review)" /> Off
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MEMBERS.filter(m => {
    if (activeFilter !== 'all' && m.role !== activeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q) && !m.team.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ margin: '0 -32px', display: 'flex', flexDirection: 'column' }}>

      {/* Page Header */}
      <div style={{
        background: 'white', borderBottom: '1px solid var(--color-border)',
        padding: '0 32px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
            TEAM · 11 MEMBERS
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.15, margin: 0 }}>
            Who's on the line.
          </h1>
        </div>
        <Button variant="primary">+ Invite people</Button>
      </div>

      {/* MFA Alert Banner */}
      <div style={{
        background: 'var(--color-review-bg)',
        borderBottom: '1px solid rgba(217,119,6,0.2)',
        padding: '10px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot color="var(--color-review)" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-primary)' }}>
            2 members without MFA enabled.
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-review)', cursor: 'pointer' }}>
          Remind them →
        </span>
      </div>

      {/* Pending Invitations */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--color-border)', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              2 pending invitations
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              Invitees haven't accepted yet. Resend or revoke below.
            </div>
          </div>
          <Button variant="ghost" size="sm" style={{ color: 'var(--color-failed)' }}>Cancel all</Button>
        </div>
        {PENDING_INVITES.map((p, i) => (
          <div key={p.email} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0',
            borderBottom: i === 0 ? '1px solid var(--color-border)' : 'none',
          }}>
            <Avatar initials={p.initials} size={32} />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {p.email}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)' }}>Invited as</span>
              <RoleBadge role={p.role} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                by {p.invitedBy} · {p.when}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant="ghost" size="sm">Resend</Button>
              <Button variant="ghost" size="sm" style={{ color: 'var(--color-failed)' }}>Revoke</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, padding: '24px 32px', alignItems: 'start' }}>

        {/* Left — Member Table */}
        <div>
          {/* Filter Tabs + Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {FILTER_TABS.map(tab => {
                const active = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    style={{
                      background: active ? 'var(--color-primary)' : 'transparent',
                      color: active ? 'white' : 'var(--color-text-secondary)',
                      borderRadius: 'var(--radius-xl)', padding: '4px 12px',
                      fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', transition: 'all 120ms',
                    }}
                  >
                    {tab.label} {tab.count}
                  </button>
                );
              })}
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', display: 'flex', pointerEvents: 'none' }}>
                <I.Search size={13} />
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search members..."
                style={{
                  width: 200, height: 32,
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
                  padding: '0 12px 0 32px', fontSize: 13, fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)', background: 'white', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Table */}
          <Card noPadding style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)',
              padding: '10px 16px', display: 'grid', gridTemplateColumns: COL, gap: 0,
            }}>
              {['MEMBER', 'ROLE', 'TEAM', 'LAST ACTIVE', 'MFA', 'ACTIONS'].map(col => (
                <div key={col} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>
                  {col}
                </div>
              ))}
            </div>
            {/* Rows */}
            {filtered.map((m, idx) => (
              <div
                key={m.email}
                style={{
                  display: 'grid', gridTemplateColumns: COL, alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                  cursor: 'pointer', transition: 'background 120ms',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                {/* MEMBER */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={m.initials} size={32} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.3 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: m.role === 'admin' ? 700 : 500, color: 'var(--color-text-primary)' }}>
                        {m.name}
                      </span>
                      {m.you    && <SmallBadge>You</SmallBadge>}
                      {m.shared && <SmallBadge>Shared</SmallBadge>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>
                      {m.email}
                    </div>
                  </div>
                </div>
                {/* ROLE */}
                <div><RoleBadge role={m.role} /></div>
                {/* TEAM */}
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {m.team}
                </div>
                {/* LAST ACTIVE */}
                <LastActive value={m.lastActive} />
                {/* MFA */}
                <MfaStatus on={m.mfa} />
                {/* ACTIONS */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4, borderRadius: 'var(--radius-sm)', display: 'flex' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-tertiary)'; }}
                  >
                    <I.More size={15} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-tertiary)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                No members match. Try clearing the filter.
              </div>
            )}
          </Card>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>

          {/* Roles Card */}
          <Card>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Roles
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 12, marginTop: 2 }}>
              What each role can do.
            </div>
            {ROLE_CARD_DATA.map((r, i) => (
              <div key={r.role}>
                {i > 0 && <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} />}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RoleBadge role={r.role} />
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>
                    {r.count} member{r.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ marginTop: 4, paddingLeft: 4, fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {r.desc}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Customize roles →
              </span>
            </div>
          </Card>

          {/* Security Policy Card */}
          <Card style={{ background: 'var(--color-primary-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ color: 'var(--color-primary)', display: 'flex', flexShrink: 0 }}>
                <I.Shield size={16} />
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
                Security policy
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['MFA required for all members', 'SSO via Okta', 'Session timeout: 12 hours'].map(line => (
                <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--color-delivered)', display: 'flex', flexShrink: 0 }}>
                    <I.Check size={12} />
                  </span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Manage →
              </span>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
