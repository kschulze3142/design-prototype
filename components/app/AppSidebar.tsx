'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { I } from './icons';
import { useState, Suspense } from 'react';

type SubNavItem = { href: string; label: string; badge?: number };
type NavItem = { href: string; label: string; icon: keyof typeof I; badge?: number; subItems?: SubNavItem[] };

const inboxNumbers = [
  { label: 'All inboxes',       number: 'all',  badge: 4 },
  { label: 'Cardiology · 0142', number: '0142', badge: 2 },
  { label: 'Front desk · 0319', number: '0319', badge: 1 },
  { label: 'Toll-free · 0903',  number: '0903', badge: 1 },
];

function InboxSubItems() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeNumber = searchParams.get('number');

  const [orderedNumbers, setOrderedNumbers] = useState(
    inboxNumbers.filter(n => n.number !== 'all')
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  if (!pathname.startsWith('/app/inbox')) return null;

  const allItem = inboxNumbers.find(n => n.number === 'all')!;
  const allActive = activeNumber === 'all';

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    const updated = [...orderedNumbers];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setOrderedNumbers(updated);
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  const badgeStyle: React.CSSProperties = {
    height: 16,
    minWidth: 16,
    fontSize: 10,
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    background: 'var(--sidebar-badge-bg)',
    color: 'var(--sidebar-text-active)',
    borderRadius: 8,
    padding: '0 4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <div>
      {/* All inboxes — fixed, not draggable */}
      <Link
        href="/app/inbox?number=all"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 28,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: allActive ? 600 : 500,
          color: allActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text-sub)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)',
          background: allActive ? 'var(--sidebar-item-active)' : 'transparent',
          marginBottom: 1,
          cursor: 'pointer',
          transition: 'color var(--duration-fast)',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {allItem.label}
        </span>
        {allItem.badge > 0 && <span style={badgeStyle}>{allItem.badge}</span>}
      </Link>

      {/* Draggable number items */}
      {orderedNumbers.map((item, index) => {
        const subActive = activeNumber === item.number;
        const isBeingDragged = dragIndex === index;
        const showDropLine = dropIndex === index && dragIndex !== index && dragIndex !== index - 1;

        return (
          <div
            key={item.number}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            style={{ position: 'relative', marginBottom: 1 }}
          >
            {showDropLine && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 28,
                right: 10,
                height: 2,
                background: 'var(--sidebar-text-active)',
                borderRadius: 1,
                zIndex: 10,
              }} />
            )}

            <Link
              href={`/app/inbox?number=${item.number}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 28,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 12,
                fontFamily: 'var(--font-body)',
                fontWeight: subActive ? 600 : 500,
                color: subActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text-sub)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-sm)',
                background: subActive
                  ? 'var(--sidebar-item-active)'
                  : isBeingDragged
                    ? 'var(--sidebar-item-hover)'
                    : 'transparent',
                opacity: isBeingDragged ? 0.4 : 1,
                cursor: 'grab',
                transition: 'opacity var(--duration-fast), background var(--duration-fast)',
                userSelect: 'none',
              }}
            >
              {/* Drag handle — 3 dots */}
              <span style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginRight: 6,
                opacity: 0.3,
                flexShrink: 0,
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: 'currentColor',
                    display: 'block',
                  }} />
                ))}
              </span>

              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>

              {item.badge > 0 && <span style={badgeStyle}>{item.badge}</span>}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

const CORE: NavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/app/send',      label: 'Send Fax',  icon: 'Send' },
  {
    href: '/app/inbox', label: 'Inbox', icon: 'Inbox', badge: 4,
    subItems: inboxNumbers.map(n => ({
      href: `/app/inbox?number=${n.number}`,
      label: n.label,
      badge: n.badge,
    })),
  },
  { href: '/app/sent', label: 'Sent', icon: 'Sent' },
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
      ...(separator ? { marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--sidebar-separator)' } : {}),
      ...(pushDown   ? { marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--sidebar-separator)' } : {}),
    }}>
      {items.map(item => {
        const Ico = I[item.icon];
        const inInbox = item.href === '/app/inbox' && pathname.startsWith('/app/inbox');
        const active = inInbox || pathname === item.href ||
          (item.href !== '/app/dashboard' && pathname.startsWith(item.href));

        return (
          <div key={item.href}>
            <Link href={item.href} className={`nav-item${active ? ' active' : ''}`}>
              <span className="nav-icon" style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <Ico size={16} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span style={{
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
                }}>
                  {item.badge}
                </span>
              )}
            </Link>

            {item.subItems && (
              <Suspense fallback={null}>
                <InboxSubItems />
              </Suspense>
            )}
          </div>
        );
      })}
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
    }}>
      {/* Logo area */}
      <div style={{
        height: 56,
        padding: '0 20px',
        borderBottom: '1px solid var(--sidebar-separator)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
            color: 'var(--sidebar-text-active)',
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
        <NavGroup items={CORE}       pathname={pathname} />
        <NavGroup items={DIRECTORY}  pathname={pathname} separator />
        <NavGroup items={COMPLIANCE} pathname={pathname} separator />
        <NavGroup items={SYSTEM}     pathname={pathname} pushDown />
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
