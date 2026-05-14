'use client';

import React from 'react';
import Link from 'next/link';
import { HCard, HPill } from './primitives';

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  billing?: string;
  badge?: string;
  featured?: boolean;
  headline: string;
  features: string[];
  cta: string;
}

const plans: Plan[] = [
  {
    id: 'trial',
    name: 'Trial',
    price: 'Free',
    period: '',
    billing: 'Free for 14 days',
    headline: 'Try FaxGrid free — no commitment',
    features: [
      '50 pages included',
      '1 fax number',
      'HIPAA / BAA',
      'Send & receive',
      'Email-to-fax included',
      'No contract, cancel anytime',
    ],
    cta: 'Start free trial',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$39',
    period: '/mo',
    billing: 'Billed monthly',
    headline: 'Everything a small office needs',
    features: [
      'Number porting',
      '500 pages/mo',
      '1 fax number',
      'Email-to-fax',
      'HIPAA / BAA',
      '30 days of fax history',
      'Extra numbers $5/mo',
      'Additional pages $0.10/pg',
    ],
    cta: 'Get started',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$89',
    period: '/mo',
    billing: 'Billed monthly',
    badge: 'Most popular',
    featured: true,
    headline: 'For growing practices',
    features: [
      'Number porting',
      '2,000 pages/mo',
      '2 fax numbers included',
      'Email-to-fax',
      'HIPAA / BAA included',
      'Analytics & reporting',
      '90 days of fax history',
      'Extra numbers $5/mo',
      'Additional pages $0.10/pg',
    ],
    cta: 'Get started',
  },
];

export function HPricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--accent-deep)' }}>Simple pricing</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
          Start Free.<br />Scale when you&apos;re ready.
        </h2>
        <p className="mt-4 text-base text-slate-500">Simple plans, honest pricing, no surprises.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-end">
        {plans.map((plan) => (
          <div key={plan.id} className="flex flex-col">
            {plan.badge ? (
              <div className="h-8 flex items-end pl-6">
                <span
                  className="inline-flex translate-y-3 rounded-t-2xl rounded-b-md px-4 py-2 text-xs font-semibold"
                  style={{ background: 'oklch(0.93 0.06 var(--accent-h))', color: 'var(--accent-deep)' }}
                >
                  {plan.badge}
                </span>
              </div>
            ) : (
              <div className="h-8" />
            )}
            <HCard
              className={`flex flex-1 flex-col p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_32px_80px_rgba(15,23,42,0.12)]${
                plan.id === 'trial' ? ' ring-1 ring-slate-200' : ''
              }${
                plan.featured ? ' ring-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)] hover:shadow-[0_32px_80px_rgba(15,23,42,0.14)]' : ''
              }`}
              style={
                plan.featured
                  ? { boxShadow: '0 24px 70px rgba(15,23,42,0.08), inset 0 0 0 2px var(--accent)' }
                  : undefined
              }
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-950">{plan.name}</h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-slate-950">{plan.price}</span>
                  {plan.period && (
                    <span className="pb-1 text-sm font-medium text-slate-500">{plan.period}</span>
                  )}
                </div>
                {plan.billing && (
                  <p className="mt-1 text-sm text-slate-500">{plan.billing}</p>
                )}
                <p className="mt-6 text-sm font-semibold text-slate-900">{plan.headline}</p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm font-medium text-slate-700">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-7 block w-full rounded-[18px] py-3.5 text-center text-sm font-semibold transition ${
                  plan.id === 'trial'
                    ? 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </Link>
            </HCard>
          </div>
        ))}
      </div>
    </section>
  );
}
