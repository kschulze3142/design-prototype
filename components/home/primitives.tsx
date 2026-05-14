'use client';

import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'dark';
type PillTone = 'teal' | 'emerald' | 'amber' | 'slate';

interface HButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  href?: string;
}

export function HButton({ variant = 'primary', className = '', children, href, ...rest }: HButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition fg-shine-btn';
  const styles: Record<ButtonVariant, { className: string; style?: React.CSSProperties }> = {
    primary: {
      className: 'text-white hover:opacity-90',
      style: { background: 'var(--accent)', boxShadow: '0 16px 30px -16px var(--accent)' },
    },
    secondary: {
      className: 'border border-white/90 bg-white/80 text-slate-700 shadow-sm hover:bg-white',
    },
    dark: {
      className: 'bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800',
    },
  };

  const { className: varClass, style: varStyle } = styles[variant];
  const combined = `${base} ${varClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combined} style={varStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combined} style={varStyle} {...rest}>
      {children}
    </button>
  );
}

interface HCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function HCard({ children, className = '', style }: HCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/80 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

interface HPillProps {
  children: React.ReactNode;
  tone: PillTone;
}

export function HPill({ children, tone }: HPillProps) {
  const styles: Record<PillTone, string> = {
    teal: 'bg-teal-50 text-teal-700 ring-teal-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[tone]}`}>
      {children}
    </span>
  );
}

export function HLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-lg shadow-slate-950/15">
        F
      </div>
      <div>
        <p className="text-lg font-semibold tracking-tight text-slate-950">FaxGrid</p>
        <p className="text-xs font-medium text-slate-500">Secure fax infrastructure</p>
      </div>
    </div>
  );
}

interface HSignupFieldProps {
  className?: string;
}

export function HSignupField({ className = '' }: HSignupFieldProps) {
  return (
    <div className={`w-full max-w-xl ${className}`}>
      <div className="flex flex-col gap-2 rounded-[24px] border border-slate-200/80 bg-white/75 p-2 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
        <input
          type="email"
          placeholder="Your work email"
          className="min-h-12 flex-1 rounded-[18px] bg-transparent px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-500"
        />
        <Link
          href="/signup"
          className="min-h-12 inline-flex items-center justify-center rounded-[18px] bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
        >
          Get started for free
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
        <span className="flex items-center gap-2">
          <span className="text-teal-600">✓</span> Free 30-day trial
        </span>
        <span className="flex items-center gap-2">
          <span className="text-teal-600">✓</span> No credit card
        </span>
        <span className="flex items-center gap-2">
          <span className="text-teal-600">✓</span> Cancel anytime
        </span>
      </div>
    </div>
  );
}
