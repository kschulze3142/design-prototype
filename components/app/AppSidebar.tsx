'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { I } from './icons';
import { Avatar } from './primitives';
import { useState } from 'react';

const NAV = [
  { group: 'Core', items: [
    { href: '/app/dashboard',  label: 'Dashboard',  icon: 'Dashboard' },
    { href: '/app/onboarding', label: 'Onboarding', icon: 'Zap' },
    { href: '/app/send',       label: 'Send Fax',   icon: 'Send' },
    { href: '/app/inbox',     label: 'Inbox',     icon: 'Inbox', badge: 4 },
    { href: '/app/sent',      label: 'Sent',      icon: 'Sent' },
  ]},
  { group: 'Directory', items: [
    { href: '/app/numbers',   label: 'Numbers',   icon: 'Numbers' },
    { href: '/app/team',      label: 'Team',      icon: 'Team' },
    { href: '/app/contacts',  label: 'Contacts',  icon: 'Contacts' },
    { href: '/app/templates', label: 'Templates', icon: 'Templates' },
  ]},
  { group: 'Reporting', items: [
    { href: '/app/analytics', label: 'Analytics',  icon: 'Analytics' },
    { href: '/app/audit',     label: 'Audit Log',  icon: 'Audit' },
    { href: '/app/compliance',label: 'Compliance', icon: 'Shield' },
  ]},
  { group: 'System', items: [
    { href: '/app/billing',   label: 'Billing & Usage', icon: 'Billing' },
    { href: '/app/settings',  label: 'Settings',        icon: 'Settings' },
  ]},
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  return (
    <aside className="w-[260px] shrink-0 sticky top-0 h-screen flex flex-col px-4 py-6 border-r border-slate-200/40" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'saturate(140%) blur(16px)', WebkitBackdropFilter: 'saturate(140%) blur(16px)' }}>
      {/* Logo */}
      <Link href="/app/dashboard" className="flex items-center gap-2.5 px-2 mb-6">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="2"/>
            <path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>
          </svg>
        </span>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-slate-900">FaxGrid</div>
          <div className="text-[11px] text-slate-500">Northwind Health · Pro</div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin -mx-2 px-2 space-y-0.5">
        {NAV.map(section => (
          <div key={section.group}>
            <div className="nav-section-label">{section.group}</div>
            {section.items.map(item => {
              const Ico = I[item.icon as keyof typeof I];
              const active = pathname === item.href || (item.href !== '/app/dashboard' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
                  <span style={{ color: active ? 'white' : '#64748b' }}><Ico size={17} /></span>
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User menu */}
      <div className="mt-3 p-3 rounded-2xl bg-white/70 border border-slate-200/80 flex items-center gap-2.5 relative">
        <Avatar name="Amelia Park" size={32} tone="teal" />
        <div className="flex-1 leading-tight min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 truncate">Amelia Park</div>
          <div className="text-[11.5px] text-slate-500 truncate">Workspace admin</div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-1" onClick={() => setMenu(m => !m)}>
          <I.More size={16} />
        </button>

        {menu && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setMenu(false)} />
            <div className="absolute left-3 right-3 bottom-[72px] z-30 bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] p-1.5">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <div className="text-[13px] font-semibold text-slate-900">Amelia Park</div>
                <div className="text-[11.5px] text-slate-500 truncate">amelia@northwindhealth.example</div>
              </div>
              {[
                { href: '/app/settings', label: 'Workspace settings', icon: 'Cog' },
                { href: '/app/billing',  label: 'Billing & usage',    icon: 'Billing' },
              ].map(m => {
                const Ico = I[m.icon as keyof typeof I];
                return (
                  <Link key={m.href} href={m.href} onClick={() => setMenu(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-slate-700 hover:bg-slate-50">
                    <Ico size={14} />
                    {m.label}
                  </Link>
                );
              })}
              <div className="my-1 h-px bg-slate-100" />
              <Link href="/login" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-600 hover:bg-red-50">
                <I.Lock size={14} /> Sign out
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
