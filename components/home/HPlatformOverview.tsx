'use client';

import React, { useState } from 'react';

type CardId = 'send' | 'review' | 'route' | 'archive';

interface SolCard {
  id: CardId;
  eyebrow: string;
  title: string;
  desc: string;
  previewTitle: string;
  previewSub: string;
  preview: React.ReactNode;
}

function SendPreview() {
  return (
    <div className="sol-preview">
      <div className="sol-preview-head">
        <span className="sol-preview-title">New outbound fax</span>
        <span className="sol-preview-sub">draft</span>
      </div>
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
          <span className="text-xs text-slate-400 w-12 shrink-0">To</span>
          <span className="text-xs font-medium text-slate-700">+1 (801) 555-0192</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
          <span className="text-xs text-slate-400 w-12 shrink-0">Subject</span>
          <span className="text-xs font-medium text-slate-700">Referral packet</span>
        </div>
        <div className="flex flex-col gap-1">
          {['referral.pdf', 'auth.pdf', 'notes.pdf'].map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-lg bg-teal-50 px-2 py-1.5 ring-1 ring-teal-100">
              <span className="text-xs text-teal-600">📄</span>
              <span className="text-xs font-medium text-teal-700">{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-xs text-slate-400">~10 pages · 2 credits</span>
        <button className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">Send secure fax</button>
      </div>
    </div>
  );
}

function ReviewPreview() {
  const rows = [
    { name: 'Utah Valley Pediatrics', status: 'Needs review', tone: 'amber' },
    { name: 'Mountain Lab Services', status: 'Received', tone: 'teal' },
    { name: 'Peak Dental Group', status: 'Needs review', tone: 'amber' },
  ];
  return (
    <div className="sol-preview">
      <div className="sol-preview-head">
        <span className="sol-preview-title">Inbox</span>
        <span className="sol-preview-sub">3 unread</span>
      </div>
      <div className="space-y-1.5 flex-1">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{r.name}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}>{r.status}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-slate-950 p-3">
        <p className="text-xs font-semibold text-white">Suggested routing</p>
        <p className="mt-1 text-[11px] text-slate-400">Assign to Intake Team, tag as New Patient.</p>
      </div>
    </div>
  );
}

function RoutePreview() {
  const rules = [
    { num: '+1 (801) 555-0001', team: 'Intake Team' },
    { num: '+1 (801) 555-0002', team: 'Billing' },
    { num: '+1 (801) 555-0003', team: 'Prior Auth' },
  ];
  return (
    <div className="sol-preview">
      <div className="sol-preview-head">
        <span className="sol-preview-title">Routing rules</span>
        <span className="sol-preview-sub">3 active</span>
      </div>
      <div className="space-y-2 flex-1">
        {rules.map((r) => (
          <div key={r.num} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <span className="text-xs font-mono text-slate-600">{r.num}</span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{r.team}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchivePreview() {
  const files = [
    { name: 'referral-2024-03.pdf', tag: '7yr' },
    { name: 'auth-form-0421.pdf', tag: '7yr' },
    { name: 'lab-results.pdf', tag: '3yr' },
    { name: 'prior-auth.pdf', tag: '7yr' },
  ];
  return (
    <div className="sol-preview">
      <div className="sol-preview-head">
        <span className="sol-preview-title">Archive</span>
        <span className="sol-preview-sub">4 files</span>
      </div>
      <div className="space-y-1.5 flex-1">
        {files.map((f) => (
          <div key={f.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">{f.name}</span>
            <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{f.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const cards: SolCard[] = [
  {
    id: 'send',
    eyebrow: 'Outbound',
    title: 'Send',
    desc: 'Compose cover pages, attach files, preview packets, and send outbound faxes with clear delivery tracking.',
    previewTitle: 'Compose fax',
    previewSub: 'draft',
    preview: <SendPreview />,
  },
  {
    id: 'review',
    eyebrow: 'Inbound',
    title: 'Review',
    desc: 'Open inbound faxes, preview pages, assign owners, add notes, and move documents through review.',
    previewTitle: 'Inbox',
    previewSub: '3 unread',
    preview: <ReviewPreview />,
  },
  {
    id: 'route',
    eyebrow: 'Automation',
    title: 'Route',
    desc: 'Use fax numbers, folders, teams, forwarding rules, and routing logic to keep incoming documents organized.',
    previewTitle: 'Routing rules',
    previewSub: '3 active',
    preview: <RoutePreview />,
  },
  {
    id: 'archive',
    eyebrow: 'Retention',
    title: 'Archive',
    desc: 'Store documents, receipts, routing activity, and retention settings in one traceable system.',
    previewTitle: 'Archive',
    previewSub: '4 files',
    preview: <ArchivePreview />,
  },
];

function HSolutionsRow() {
  const [open, setOpen] = useState<CardId | null>('send');

  const toggle = (id: CardId) => setOpen((prev) => (prev === id ? null : id));

  return (
    <div className="sol-row">
      {cards.map((card) => {
        const isOpen = open === card.id;
        return (
          <div
            key={card.id}
            className={`sol-card${isOpen ? ' open' : ''}`}
            onClick={() => { if (!isOpen) toggle(card.id); }}
          >
            <div className="sol-stripes" />
            <button
              className="sol-toggle"
              onClick={(e) => { e.stopPropagation(); toggle(card.id); }}
              aria-label={isOpen ? 'Collapse' : 'Expand'}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="sol-left">
              <p className="sol-eyebrow">{card.eyebrow}</p>
              <h3 className="sol-title">{card.title}</h3>
              <p className="sol-desc">{card.desc}</p>
              <button className="sol-cta fg-shine-btn">
                Learn more <span className="sol-cta-arrow">→</span>
              </button>
            </div>
            <div className="sol-stage">
              {card.preview}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HPlatformOverview() {
  return (
    <section style={{ background: 'oklch(0.97 0.025 var(--accent-h))' }} className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>Platform overview</p>
            <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
              All your fax workflows in one platform
            </h2>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-300 shadow-sm backdrop-blur-xl">←</button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-xl">→</button>
          </div>
        </div>
        <HSolutionsRow />
      </div>
    </section>
  );
}
