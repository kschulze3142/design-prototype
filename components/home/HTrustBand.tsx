'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCount, useReveal } from './animations';
import { HPill } from './primitives';

interface AuditRow {
  org: string;
  event: string;
  color: 'green' | 'teal' | 'slate';
}

const auditRows: AuditRow[] = [
  { org: 'Utah Valley Pediatrics', event: 'Outbound delivered', color: 'green' },
  { org: 'Aspen Family Clinic', event: 'Inbound received', color: 'teal' },
  { org: 'Wasatch Imaging', event: 'Routing rule matched', color: 'teal' },
  { org: 'Mountain Lab Services', event: 'Assigned to Intake Team', color: 'green' },
  { org: 'Peak Dental Group', event: 'Retention policy applied', color: 'slate' },
];

function LiveAuditFeed() {
  const [sectionRef, inView] = useReveal({ threshold: 0.2 });
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= auditRows.length) clearInterval(interval);
    }, 320);
    return () => clearInterval(interval);
  }, [inView]);

  const colorMap = {
    green: 'bg-emerald-500',
    teal: 'bg-teal-500',
    slate: 'bg-slate-400',
  };

  return (
    <div ref={sectionRef as React.Ref<HTMLDivElement>} className="rounded-[28px] bg-slate-950 p-6 text-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-semibold text-white">Live audit feed</span>
        </div>
        <span className="text-xs font-mono text-slate-500">us-east-1</span>
      </div>
      <div className="fg-stream-track mb-4" />
      <div className="space-y-2">
        {auditRows.map((row, i) => (
          <div
            key={row.org}
            className={`fg-stream-item flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/8 ${i < visibleCount ? '' : 'opacity-0 pointer-events-none'}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${row.color === 'slate' ? 'bg-slate-800' : row.color === 'green' ? 'bg-emerald-900/60' : 'bg-teal-900/60'}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" className={row.color === 'green' ? 'text-emerald-400' : row.color === 'teal' ? 'text-teal-400' : 'text-slate-400'} />
                <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={row.color === 'green' ? 'text-emerald-400' : row.color === 'teal' ? 'text-teal-400' : 'text-slate-400'} />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{row.org}</p>
              <p className="text-[11px] text-slate-400">{row.event}</p>
            </div>
            <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorMap[row.color]}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HTrustBand() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, oklch(0.88 0.12 var(--accent-h) / 0.25), transparent 60%)' }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 xl:grid-cols-2 xl:items-center">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>Healthcare-grade trust</p>
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
              Quietly serious about security.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
              Built from day one with HIPAA compliance, end-to-end encryption, and audit trails that healthcare teams and compliance officers can trust.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { value: 256, suffix: '-bit', label: 'AES encryption', prefix: '' },
                { value: 99.99, suffix: '%', label: 'Uptime', prefix: '', decimals: 2 },
                { value: 7, suffix: 'yr', label: 'Default retention', prefix: '' },
                { label: 'SOC 2', sublabel: 'Type II controls', static: true },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[22px] border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
                  {'static' in stat ? (
                    <>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950">{stat.label}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.sublabel}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950">
                        <AnimatedCount to={stat.value!} suffix={stat.suffix} prefix={stat.prefix} decimals={stat.decimals ?? 0} />
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['HIPAA', 'BAA available', 'TLS 1.3', 'Role-based access', 'MFA required'].map((pill) => (
                <HPill key={pill} tone="teal">{pill}</HPill>
              ))}
            </div>
          </div>
          <LiveAuditFeed />
        </div>
      </div>
    </section>
  );
}
