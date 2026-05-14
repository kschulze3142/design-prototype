'use client';

import React from 'react';
import { HCard, HPill } from './primitives';

const steps = [
  { num: '01', title: 'Compose or receive', text: 'Send a fax securely or capture inbound faxes from dedicated numbers.' },
  { num: '02', title: 'Review and route', text: 'Use owners, tags, folders, forwarding, and routing rules to keep faxes out of limbo.' },
  { num: '03', title: 'Archive the proof', text: 'Save documents, notes, activity, and delivery receipts for long-term retention.' },
];

const features = [
  'Dedicated fax numbers',
  'Inbound routing rules',
  'Email forwarding copies',
  'Team assignment',
  'Retry failed transmissions',
  'Downloadable PDF receipts',
  'Status timeline',
  'Retention policy controls',
];

export function HWorkflow() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <HCard className="p-8 md:p-10">
          <p className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>Modern fax workflow</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
            One calm workspace from inbound document to final receipt.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            FaxGrid is designed around the real operational work: sending packets, reviewing inbound faxes, assigning ownership, retrying failures, and keeping proof of delivery close at hand.
          </p>
          <div className="mt-7 space-y-4">
            {steps.map(({ num, title, text }) => (
              <div key={num} className="flex gap-4 rounded-[24px] bg-white p-5 ring-1 ring-slate-200">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                  {num}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </HCard>

        <HCard className="p-8 md:p-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-950">What teams can do</p>
              <p className="mt-1 text-sm text-slate-500">Built for actual fax operations, not just sending a PDF.</p>
            </div>
            <HPill tone="teal">Operational</HPill>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {features.map((item) => (
              <div
                key={item}
                className="fg-lift flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">✓</span>
                <span className="text-sm font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </HCard>
      </div>
    </section>
  );
}
