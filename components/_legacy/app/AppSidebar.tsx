'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { I } from './icons';
import {
  useDepartments,
  useWorkItemsByDepartment,
} from '@/lib/mockSystem/hooks';
import { useMockSystem } from '@/lib/mockSystem/MockSystemProvider';
import type { Department, DepartmentType } from '@/lib/mockSystem/types';

type NavItem = { href: string; label: string; icon: keyof typeof I };

// Icon assignments for the dynamic Departments section. Defined alongside the
// DepartmentType union so a new department added in types.ts surfaces a tsc
// error here until an icon is chosen.
const DEPARTMENT_ICON: Record<DepartmentType, keyof typeof I> = {
  referrals:        'FolderOpen',
  prior_auth:       'PriorAuth',
  clinical_results: 'Results',
  orders:           'Orders',
  admin:            'Admin',
};

const TOP: NavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/app/send',      label: 'Send Fax',  icon: 'Send' },
];

const BOTTOM_PRIMARY: NavItem[] = [
  { href: '/app/patients', label: 'Patients', icon: 'Patients' },
];

const BOTTOM_COMPLIANCE: NavItem[] = [
  { href: '/app/analytics',  label: 'Analytics',  icon: 'Analytics' },
  { href: '/app/audit',      label: 'Audit',      icon: 'Audit' },
  { href: '/app/compliance', label: 'Compliance', icon: 'Shield' },
];

const BOTTOM_DIRECTORY: NavItem[] = [
  { href: '/app/numbers',   label: 'Numbers',   icon: 'Numbers' },
  { href: '/app/team',      label: 'Team',      icon: 'Team' },
  { href: '/app/contacts',  label: 'Contacts',  icon: 'Contacts' },
  { href: '/app/templates', label: 'Templates', icon: 'Templates' },
];

const BOTTOM_SYSTEM: NavItem[] = [
  { href: '/app/billing',  label: 'Billing',  icon: 'Billing' },
  { href: '/app/settings', label: 'Settings', icon: 'Settings' },
];

const badgeStyle: React.CSSProperties = {
  background: 'var(--sidebar-badge-bg)',
  color: 'var(--sidebar-text-active)',
  fontSize: 10,
  fontWeight: 700,
  fontFamily: 'var(--font-body)',
  height: 18,
  minWidth: 18,
  borderRadius: 9,
  padding: '0 5px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

function NavItemRow({ item, active, badge }: { item: NavItem; active: boolean; badge?: number }) {
  const Ico = I[item.icon];
  return (
    <Link href={item.href} className={`nav-item${active ? ' active' : ''}`}>
      <span className="nav-icon" style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Ico size={16} />
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {badge !== undefined && badge > 0 && <span style={badgeStyle}>{badge}</span>}
    </Link>
  );
}

function StaticNavGroup({ items, pathname, separator, pushDown }: {
  items: NavItem[];
  pathname: string;
  separator?: boolean;
  pushDown?: boolean;
}) {
  return (
    <div style={{
      ...(separator ? { marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--sidebar-separator)' } : {}),
      ...(pushDown  ? { marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--sidebar-separator)' } : {}),
    }}>
      {items.map(item => (
        <NavItemRow key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}
    </div>
  );
}

function DepartmentNavRow({ department, pathname }: { department: Department; pathname: string }) {
  const template = useMockSystem().templates[department.type];
  const items = useWorkItemsByDepartment(department.type);
  const openCount = useMemo(
    () => items.filter(i => !template.terminalStatuses.includes(i.status)).length,
    [items, template.terminalStatuses],
  );
  const href = `/app/departments/${department.type}`;
  return (
    <NavItemRow
      item={{ href, label: template.name, icon: DEPARTMENT_ICON[department.type] }}
      active={isActive(pathname, href)}
      badge={openCount}
    />
  );
}

function DepartmentsSection({ pathname }: { pathname: string }) {
  const departments = useDepartments();
  const { templates } = useMockSystem();
  const sorted = useMemo(
    () => [...departments].sort(
      (a, b) => templates[a.type].displayOrder - templates[b.type].displayOrder,
    ),
    [departments, templates],
  );
  return (
    <div style={{ marginTop: 8 }}>
      <div className="nav-section-label" style={{ color: 'var(--sidebar-text-faint)' }}>Departments</div>
      {sorted.map(d => (
        <DepartmentNavRow key={d.id} department={d} pathname={pathname} />
      ))}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  const initials = 'AP';
  const name     = 'Amelia Park';
  const role     = 'Workspace admin';

  return (
    <aside style={{
      width: 220,
      background: 'var(--sidebar-bg)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
    }}>
      {/* Logo area */}
      <div style={{
        paddingTop: 28,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Link href="/app/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--sidebar-text-active)',
            lineHeight: 1.2,
          }}>
            Blue Lark
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--sidebar-text-faint)',
            lineHeight: 1.3,
          }}>
            Northwind Health
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="scrollbar-thin" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <StaticNavGroup items={TOP} pathname={pathname} />
        <DepartmentsSection pathname={pathname} />
        <StaticNavGroup items={BOTTOM_PRIMARY}    pathname={pathname} separator />
        <StaticNavGroup items={BOTTOM_COMPLIANCE} pathname={pathname} />
        <StaticNavGroup items={BOTTOM_DIRECTORY}  pathname={pathname} />
        <StaticNavGroup items={BOTTOM_SYSTEM}     pathname={pathname} pushDown />
      </nav>

      {/* User area */}
      <div style={{
        height: 56,
        borderTop: '1px solid var(--sidebar-separator)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
      }}>
        <span style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--sidebar-avatar-bg)',
          color: 'var(--sidebar-text-active)',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {initials}
        </span>

        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: 'var(--sidebar-text-active)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            color: 'var(--sidebar-text-faint)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {role}
          </div>
        </div>

        <button
          onClick={() => setMenu(m => !m)}
          style={{
            marginLeft: 'auto',
            color: 'var(--sidebar-icon)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <I.More size={16} />
        </button>

        {menu && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setMenu(false)} />
            <div style={{
              position: 'absolute',
              left: 12,
              right: 12,
              bottom: 64,
              zIndex: 30,
              background: 'white',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-modal)',
              padding: 6,
            }}>
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--color-border)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)' }}>amelia@northwindhealth.example</div>
              </div>
              {([
                { href: '/app/settings', label: 'Workspace settings', icon: 'Settings' as const },
                { href: '/app/billing',  label: 'Billing & usage',    icon: 'Billing' as const },
              ] as const).map(m => {
                const Ico = I[m.icon];
                return (
                  <Link key={m.href} href={m.href} onClick={() => setMenu(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    textDecoration: 'none',
                  }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}><Ico size={14} /></span>
                    {m.label}
                  </Link>
                );
              })}
              <div style={{ margin: '4px 0', height: 1, background: 'var(--color-border)' }} />
              <Link href="/login" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                color: 'var(--color-failed)',
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
              }}>
                <I.Lock size={14} /> Sign out
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
