'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { I } from './icons';
import { useState } from 'react';

type NavItem = { href: string; label: string; icon: keyof typeof I; badge?: number };

const CORE: NavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/app/send',      label: 'Send Fax',  icon: 'Send' },
  { href: '/app/inbox',    label: 'Inbox',     icon: 'Inbox', badge: 4 },
  { href: '/app/sent',     label: 'Sent',      icon: 'Sent' },
];
const DIRECTORY: NavItem[] = [
  { href: '/app/numbers',   label: 'Numbers',   icon: 'Numbers' },
  { href: '/app/team',      label: 'Team',      icon: 'Team' },
  { href: '/app/contacts',  label: 'Contacts',  icon: 'Contacts' },
  { href: '/app/templates', label: 'Templates', icon: 'Templates' },
];
const COMPLIANCE: NavItem[] = [
  { href: '/app/analytics', label: 'Analytics',  icon: 'Analytics' },
  { href: '/app/audit',     label: 'Audit Log',  icon: 'Audit' },
  { href: '/app/compliance',label: 'Compliance', icon: 'Shield' },
];
const SYSTEM: NavItem[] = [
  { href: '/app/billing',  label: 'Billing',  icon: 'Billing' },
  { href: '/app/settings', label: 'Settings', icon: 'Settings' },
];

function NavGroup({ items, separator, pushDown, pathname }: {
  items: NavItem[];
  separator?: boolean;
  pushDown?: boolean;
  pathname: string;
}) {
  return (
    <div style={{
      ...(separator ? {
        marginTop: 4,
        paddingTop: 4,
        borderTop: '1px solid var(--color-border)',
      } : {}),
      ...(pushDown ? { marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--color-border)' } : {}),
    }}>
      {items.map(item => {
        const Ico = I[item.icon];
        const active = pathname === item.href ||
          (item.href !== '/app/dashboard' && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} className={`nav-item${active ? ' active' : ''}`}>
            <span className="nav-icon" style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Ico size={16} />
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span style={{
                background: 'var(--color-primary)',
                color: 'white',
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
              }}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  const initials = 'AP';
  const name = 'Amelia Park';
  const role = 'Workspace admin';

  return (
    <aside style={{
      width: 220,
      background: '#ffffff',
      borderRight: '1px solid var(--color-border)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
    }}>
      {/* Logo area */}
      <div style={{
        height: 56,
        padding: '0 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Link href="/app/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--color-primary)',
            lineHeight: 1.2,
          }}>
            Blue Lark
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-secondary)',
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
        <NavGroup items={CORE} pathname={pathname} />
        <NavGroup items={DIRECTORY} separator pathname={pathname} />
        <NavGroup items={COMPLIANCE} separator pathname={pathname} />
        <NavGroup items={SYSTEM} pushDown pathname={pathname} />
      </nav>

      {/* User area */}
      <div style={{
        height: 56,
        borderTop: '1px solid var(--color-border)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
      }}>
        {/* Avatar */}
        <span style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--color-primary-subtle)',
          color: 'var(--color-primary)',
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

        {/* Name / role */}
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-tertiary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {role}
          </div>
        </div>

        {/* Three-dot menu */}
        <button
          onClick={() => setMenu(m => !m)}
          style={{
            marginLeft: 'auto',
            color: 'var(--color-text-tertiary)',
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

        {/* Dropdown */}
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
