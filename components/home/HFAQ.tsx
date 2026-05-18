'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const faqs: FAQItem[] = [
  {
    question: 'Is FaxGrid replacing fax or improving it?',
    answer: 'FaxGrid is designed for teams that still need fax today, but want a cleaner, more controlled workflow around sending, receiving, routing, and proving delivery. It builds on existing fax infrastructure rather than replacing it.',
    defaultOpen: true,
  },
  {
    question: 'Who is this for?',
    answer: 'Healthcare clinics, billing teams, legal offices, finance teams, and operations groups that handle fax volume and need accountability around documents. Anyone who still relies on fax and wants a modern interface around it.',
  },
  {
    question: 'Does it support inbound routing?',
    answer: 'Yes. FaxGrid includes owned fax numbers, routing rules, team assignment, email forwarding copies, and retention policies — so inbound faxes land in the right place automatically.',
  },
  {
    question: 'Is FaxGrid HIPAA-ready?',
    answer: 'Yes. FaxGrid is built with HIPAA compliance in mind, including encrypted storage, BAA availability, audit logging, role-based access controls, and configurable retention policies.',
  },
  {
    question: 'What happens if a fax fails to send?',
    answer: 'FaxGrid automatically retries failed faxes up to 3 times with increasing delays. Each retry is logged and visible in your sent history. You can also trigger a manual retry from the sent view.',
  },
  {
    question: 'Can it support API-driven workflows later?',
    answer: 'Yes. FaxGrid can grow from a workspace-first product into deeper fax infrastructure with API access, webhooks, and automated routing for engineering teams and enterprise integrations.',
  },
];

function FAQAccordion({ question, answer, defaultOpen = false }: FAQItem) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-[24px] bg-white ring-1 ring-slate-200 ${open ? 'fg-acc-open' : ''}`}>
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base font-semibold text-slate-950">{question}</span>
        <span
          className="fg-acc-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-600 ring-1 ring-slate-200"
          style={{ background: open ? 'var(--color-primary-subtle)' : 'white', color: open ? 'var(--color-primary)' : undefined }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className="fg-acc-content">
        <div>
          <p className="px-6 pb-5 text-sm leading-7 text-slate-500">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function HFAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Questions</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
          Built for the messy middle between legacy fax and modern workflows.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <FAQAccordion key={faq.question} {...faq} />
        ))}
      </div>
    </section>
  );
}
