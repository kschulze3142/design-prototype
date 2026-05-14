'use client';

import React, { useState } from 'react';
import { HCard, HPill } from './primitives';

type PillTone = 'teal' | 'emerald' | 'amber' | 'slate';

interface TabData {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: [string, string][];
  panelTitle: string;
  panelSubtitle: string;
  badge: string;
  badgeTone: PillTone;
  leftItems: string[];
  rightTitle: string;
  rightRows: string[];
  cta: string;
}

const tabs: TabData[] = [
  {
    id: 'send',
    label: 'Send fax',
    title: 'Send faxes without the busywork',
    description: 'Prepare cover pages, attach files, preview packets, and send secure outbound faxes from one clean workflow.',
    bullets: [
      ['Compose', 'Add recipient, fax number, subject, and cover page note.'],
      ['Preview', 'Review files, pages, and estimated credits before sending.'],
      ['Receipt', 'Track delivery and store the final receipt automatically.'],
    ],
    panelTitle: 'Outbound fax workflow',
    panelSubtitle: 'Compose → Preview → Receipt',
    badge: 'Ready to send',
    badgeTone: 'teal',
    leftItems: ['Recipient', 'Fax number', 'Subject', 'Cover page note'],
    rightTitle: 'Delivery preview',
    rightRows: ['Files attached', '10 pages', 'Auto-save receipt'],
    cta: 'Send secure fax',
  },
  {
    id: 'inbox',
    label: 'Inbox review',
    title: 'Review inbound faxes faster',
    description: 'Open incoming documents, preview pages, assign owners, add notes, and move work forward without losing context.',
    bullets: [
      ['Preview', 'See the document and key metadata side-by-side.'],
      ['Triage', 'Mark reviewed, assign owners, and add routing notes.'],
      ['Forward', 'Move documents to the right team without extra clicks.'],
    ],
    panelTitle: 'Inbound review',
    panelSubtitle: 'Unread and review-needed faxes prioritized',
    badge: 'Needs review',
    badgeTone: 'amber',
    leftItems: ['Utah Valley Pediatrics', 'Mountain Lab Services', 'Peak Dental Group'],
    rightTitle: 'Routing suggestion',
    rightRows: ['Assign to Intake Team', 'Tag: New Patient', 'Retain for 7 years'],
    cta: 'Mark reviewed',
  },
  {
    id: 'routing',
    label: 'Routing rules',
    title: 'Route documents where they belong',
    description: 'Use fax numbers, folders, teams, forwarding rules, and retention settings to keep inbound fax traffic organized.',
    bullets: [
      ['Numbers', 'Manage owned fax numbers in one place.'],
      ['Rules', 'Route inbound faxes to inboxes, folders, or teams.'],
      ['Retention', 'Apply forwarding and retention defaults with clarity.'],
    ],
    panelTitle: 'Number routing',
    panelSubtitle: 'Main intake · Billing · New location',
    badge: 'Active rules',
    badgeTone: 'emerald',
    leftItems: ['Main intake', 'Billing', 'Prior auth'],
    rightTitle: 'Rule preview',
    rightRows: ['Route to Intake inbox', 'Forward copy to intake@faxgrid.com', 'Retention: 7 years'],
    cta: 'Save routing',
  },
  {
    id: 'team',
    label: 'Team control',
    title: 'Manage your team without micromanaging',
    description: 'Invite teammates, assign roles, and control permissions so everyone can do their work without overexposure.',
    bullets: [
      ['Roles', 'Set access for sending, reviewing, billing, and admin tasks.'],
      ['Visibility', 'Control what each teammate can view and manage.'],
      ['Approvals', 'Keep ownership and responsibilities clear across the team.'],
    ],
    panelTitle: 'Team permissions',
    panelSubtitle: 'Profiles, roles, and workspace access',
    badge: 'Admin controls',
    badgeTone: 'slate',
    leftItems: ['Admin', 'Reviewer', 'Billing', 'Member'],
    rightTitle: 'Permission summary',
    rightRows: ['Send faxes', 'Review inbox', 'Manage numbers'],
    cta: 'Invite teammate',
  },
];

export function HOperationsShowcase() {
  const [activeTab, setActiveTab] = useState('send');
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>Interactive overview</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
          Everything you need to run modern fax operations
        </h2>
      </div>

      <div className="mx-auto mb-8 flex max-w-5xl flex-wrap items-center justify-center gap-2 rounded-[24px] border border-white/80 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
              current.id === tab.id
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div key={current.id} className="fg-tabpanel grid gap-8 xl:grid-cols-[340px_1fr] xl:items-start">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-slate-950">{current.title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-500">{current.description}</p>
          <div className="mt-8 space-y-5">
            {current.bullets.map(([label, text]) => (
              <div key={label}>
                <p className="text-base font-semibold text-slate-950">{label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <HCard className="overflow-hidden p-0">
          <div className="bg-[linear-gradient(90deg,rgba(20,184,166,0.14),rgba(20,184,166,0.06))] px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">{current.panelTitle}</p>
                <p className="mt-1 text-sm text-slate-500">{current.panelSubtitle}</p>
              </div>
              <HPill tone={current.badgeTone}>{current.badge}</HPill>
            </div>
          </div>
          <div className="grid lg:grid-cols-[240px_1fr]">
            <div className="border-b border-slate-200 bg-slate-50/70 p-5 lg:border-b-0 lg:border-r">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
              <div className="space-y-3">
                {current.leftItems.map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium ring-1 ${
                      i === 0 ? 'bg-white text-slate-900 ring-slate-200 shadow-sm' : 'bg-transparent text-slate-500 ring-transparent'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button className="mt-6 rounded-[18px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15">
                {current.cta}
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">{current.rightTitle}</p>
                    <p className="mt-1 text-sm text-slate-500">Preview of the selected workflow</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="space-y-3">
                  {current.rightRows.map((row, i) => (
                    <div
                      key={row}
                      className={`flex items-center justify-between rounded-2xl px-4 py-4 ring-1 ${
                        i === 0 ? 'bg-teal-50/70 ring-teal-100' : 'bg-slate-50 ring-slate-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row}</p>
                        <p className="mt-1 text-xs text-slate-500">Operational detail</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-400">→</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[22px] border border-dashed border-teal-200 bg-teal-50/60 p-5">
                  <div className="mb-3 h-3 w-28 rounded-full bg-teal-300" />
                  <div className="mb-2 h-2 w-full rounded-full bg-teal-200" />
                  <div className="mb-2 h-2 w-10/12 rounded-full bg-teal-200" />
                  <div className="h-2 w-8/12 rounded-full bg-teal-200" />
                </div>
              </div>
            </div>
          </div>
        </HCard>
      </div>
    </section>
  );
}
