'use client';

import React from 'react';
import { Reveal, AnimatedCount, useCursorGlow } from './animations';
import { HSignupField, HPill } from './primitives';

function HDocumentPreview() {
  return (
    <div className="rounded-[28px] bg-slate-100/70 p-4 ring-1 ring-slate-200/70">
      <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 h-3 w-28 rounded-full" style={{ background: 'var(--color-primary)' }} />
        <div className="mb-6">
          <div className="h-3 w-44 rounded-full bg-slate-300" />
          <div className="mt-3 h-2 w-56 rounded-full bg-slate-200" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`mb-2 h-2 rounded-full bg-slate-200 ${i % 3 === 0 ? 'w-full' : i % 2 === 0 ? 'w-10/12' : 'w-8/12'}`}
          />
        ))}
        <div className="mt-8 rounded-2xl border border-dashed p-4" style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-primary-subtle)' }}>
          <div className="h-2 w-24 rounded-full" style={{ background: 'var(--color-primary)' }} />
          <div className="mt-3 h-2 w-36 rounded-full" style={{ background: 'var(--color-border-strong)' }} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Referral packet</span>
        <span>8 pages</span>
      </div>
    </div>
  );
}

type PillTone = 'teal' | 'emerald' | 'amber' | 'slate';

const faxRows: [string, string, string, PillTone][] = [
  ['Utah Valley Pediatrics', 'Needs review', 'amber'],
  ['Aspen Family Clinic', 'Delivered', 'emerald'],
  ['Wasatch Imaging', 'Processing', 'amber'],
].map(([name, status, tone]) => [name, '', status, tone as PillTone]);

function HProductMockup() {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl relative overflow-hidden p-4 md:p-5">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(61,80,128,0.12)' }} />
      <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full blur-3xl pointer-events-none" style={{ background: 'var(--color-primary-subtle)' }} />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-semibold text-slate-950">Live fax operations</p>
            <p className="text-xs text-slate-500">Today, 10:42 AM</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Healthy
          </div>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3">
          {([['42', 'sent'], ['18', 'received'], ['9', 'review']] as [string, string][]).map(([val, label]) => (
            <div key={label} className="rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-sm">
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                <AnimatedCount to={Number(val)} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <HDocumentPreview />
          <div className="space-y-3">
            {faxRows.map(([name, , status, tone]) => (
              <div key={name} className="rounded-[22px] bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{name}</p>
                  <HPill tone={tone}>{status}</HPill>
                </div>
              </div>
            ))}
            <div className="rounded-[22px] bg-slate-950 p-4 text-white shadow-lg shadow-slate-950/15">
              <p className="text-sm font-semibold">Suggested routing</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Assign to Intake Team, tag as New Patient, and retain for 7 years.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HHero() {
  const { wrapRef, glowRef } = useCursorGlow();
  return (
    <section
      ref={wrapRef as React.Ref<HTMLElement>}
      className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20"
    >
      <div ref={glowRef as React.Ref<HTMLDivElement>} className="fg-glow" style={{ opacity: 0 }} />
      <div className="relative grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
        <div>
          <Reveal delay={0}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl" style={{ border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--color-primary)' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
              </span>
              Secure cloud fax for modern teams
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-slate-950 md:text-7xl" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              Modern fax software for teams that still need fax to work.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              FaxGrid gives healthcare, finance, legal, and operations teams a calmer way to send, receive, route, track, and archive faxes — without the legacy portal experience.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <HSignupField className="mt-8" />
          </Reveal>
        </div>
        <Reveal delay={260} slow className="fg-float">
          <HProductMockup />
        </Reveal>
      </div>
    </section>
  );
}
