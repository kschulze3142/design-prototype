'use client';
import React from 'react';
import { I } from './icons';

// Card
export const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`rounded-[28px] bg-white/85 backdrop-blur-[14px] border border-white/85 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.18)] ${className}`} style={style}>{children}</div>
);

// Pill / status badge
const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5', fg: '#047857', dot: '#10b981' },
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb', fg: '#b45309', dot: '#f59e0b' },
  red:     { bg: '#fef2f2', fg: '#b91c1c', dot: '#ef4444' },
  slate:   { bg: '#f1f5f9', fg: '#475569', dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff', fg: '#6d28d9', dot: '#8b5cf6' },
};

export const Pill = ({ tone = 'slate', children, dot = true, className = '' }: { tone?: string; children: React.ReactNode; dot?: boolean; className?: string }) => {
  const t = STATUS_TONES[tone] || STATUS_TONES.slate;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold leading-snug ${className}`} style={{ background: t.bg, color: t.fg }}>
      {dot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.dot }} />}
      {children}
    </span>
  );
};

// Button
export const AppButton = ({ variant = 'primary', size = 'md', className = '', children, icon, iconRight, ...rest }: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  [key: string]: any;
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all active:translate-y-px cursor-pointer';
  const sizes = { sm: 'text-[13px] py-1.5 px-3', md: 'text-[14px] py-2.5 px-4', lg: 'text-[15px] py-3 px-5' };
  const variants = {
    primary: 'text-white shadow-[0_6px_16px_-8px_var(--color-primary),inset_0_1px_0_rgba(255,255,255,0.18)]',
    secondary: 'bg-white text-slate-900 border border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(15,23,42,0.04)] hover:bg-slate-50',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={variant === 'primary' ? { background: 'var(--color-primary)' } : undefined} {...rest}>
      {icon && <span className="-ml-0.5">{icon}</span>}
      {children}
      {iconRight && <span className="-mr-0.5">{iconRight}</span>}
    </button>
  );
};

// Avatar
export const Avatar = ({ name, size = 32, tone = 'slate' }: { name: string; size?: number; tone?: string }) => {
  const init = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  const t = STATUS_TONES[tone] || STATUS_TONES.slate;
  return (
    <span className="inline-flex items-center justify-center rounded-full font-semibold shrink-0"
      style={{ width: size, height: size, background: t.bg, color: t.fg, fontSize: size * 0.38 }}>
      {init}
    </span>
  );
};

// StatCard
export const StatCard = ({ label, value, helper, trend, icon, className = '' }: {
  label: string; value: string | number; helper?: string; trend?: 'up' | 'down' | 'neutral'; icon?: React.ReactNode; className?: string;
}) => (
  <Card className={`p-6 flex flex-col gap-3 ${className}`}>
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
      {icon && <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>{icon}</span>}
    </div>
    <span className="text-[44px] leading-none font-semibold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading), system-ui' }}>{value}</span>
    {helper && (
      <div className={`text-[12.5px] flex items-center gap-1.5 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
        {trend === 'up' && <I.ArrowUp size={12} strokeWidth={2.4} />}
        {trend === 'down' && <I.ArrowDown size={12} strokeWidth={2.4} />}
        {helper}
      </div>
    )}
  </Card>
);

// SectionTitle
export const SectionTitle = ({ title, subtitle, action, className = '' }: { title: string; subtitle?: string; action?: React.ReactNode; className?: string }) => (
  <div className={`flex items-end justify-between gap-4 ${className}`}>
    <div>
      <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-[13.5px] text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
