'use client';

import Link from 'next/link';
import { HLogo } from './primitives';

export function HNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/65 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <HLogo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          <a href="#workflow" className="hover:text-slate-950 transition-colors">Workflow</a>
          <a href="#security" className="hover:text-slate-950 transition-colors">Security</a>
          <a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-2xl border border-white/90 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--color-primary)', boxShadow: '0 16px 30px -16px var(--color-primary)' }}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
