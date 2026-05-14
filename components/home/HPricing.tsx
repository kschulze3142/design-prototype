'use client';

import React from 'react';
import Link from 'next/link';
import { HCard, HPill } from './primitives';

interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  billing?: string;
  badge?: string;
  featured?: boolean;
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
    billing: 'Most popular',
    badge: 'Most popular',
    featured: true,
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
          Start free. Scale when you&apos;re ready.
        </h2>
        <p className="mt-4 text-base text-slate-500">30-day free trial on all plans. No credit card required.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="relative flex flex-col">
            {plan.badge && (
              <div className="relative z-10 mb-[-1px] flex justify-center">
                <span
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-md"
                  style={{ background: 'var(--accent)' }}
                >
                  {plan.badge}
                </span>
              </div>
            )}
            <HCard
              className={`flex flex-1 flex-col p-8 ${plan.featured ? '' : ''}`}
              style={
                plan.featured
                  ? { boxShadow: '0 24px 70px rgba(15,23,42,0.08), inset 0 0 0 2px var(--accent)' }
                  : plan.id === 'trial'
                  ? { boxShadow: '0 24px 70px rgba(15,23,42,0.06)', background: 'transparent', border: '1px solid rgba(15,23,42,0.10)' }
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
