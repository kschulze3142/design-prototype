'use client';

import React from 'react';

const items = [
  {
    title: 'Role permissions',
    text: 'Separate send, review, billing, number, and API access by role.',
  },
  {
    title: 'Receipt archive',
    text: 'Keep proof of delivery attached to every outbound fax automatically.',
  },
  {
    title: 'Routing audit trail',
    text: 'Track rule changes, ownership updates, notes, and retries with full history.',
  },
  {
    title: 'Retention controls',
    text: 'Align workspace defaults with your document retention policy requirements.',
  },
];

export function HSecurity() {
  return (
    <section id="security" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div
        className="rounded-[36px] border border-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10"
        style={{ background: 'oklch(0.97 0.02 var(--accent-h))' }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>Security without the heavy feel</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
            Built for teams that need trust, visibility, and control.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Use role-based permissions, MFA policies, audit-friendly activity logs, retention controls, and delivery receipts without burying users in admin complexity.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map(({ title, text }) => (
            <div
              key={title}
              className="rounded-[24px] p-5 ring-1"
              style={{ background: 'var(--accent-soft)', boxShadow: 'inset 0 0 0 1px var(--accent-mid)' }}
            >
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
