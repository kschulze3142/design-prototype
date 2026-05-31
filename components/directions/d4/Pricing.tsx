'use client';

// d4 Pricing — clean 3-tier table, scannable, no dark patterns. Optional
// monthly ⇄ annual toggle (annual = two months free). The recommended tier's
// emphasis is structural, so it rides the TEAL workhorse: the featured border,
// the "Most popular" badge, and the included-feature checks are all teal, and the
// toggle's selected pill is teal via --rd-color-btn. Orange shows up only as the
// small "two months free" highlight — a marketing spark.
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button, Eyebrow, Section, space as u } from './primitives';

interface Tier {
  name: string;
  monthly: number | null;
  blurb: string;
  cta: string;
  featured?: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: 'Free Trial',
    monthly: 0,
    blurb: 'Everything in Starter for 14 days.',
    cta: 'Start free',
    features: ['Up to 100 pages', 'Delivery receipts', 'Patient routing', 'No credit card'],
  },
  {
    name: 'Starter',
    monthly: 39,
    blurb: 'For a single practice getting off the fax machine.',
    cta: 'Choose Starter',
    featured: true,
    features: [
      '1,000 pages / month',
      'One ported fax number',
      'Automatic retries',
      'Email + chat support',
    ],
  },
  {
    name: 'Professional',
    monthly: 89,
    blurb: 'For multi-provider groups and higher volume.',
    cta: 'Choose Professional',
    features: [
      '3,000 pages / month',
      'Up to five fax numbers',
      'Routing rules & departments',
      'Priority support & BAA',
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  function priceLabel(tier: Tier) {
    if (tier.monthly === null) return 'Custom';
    if (tier.monthly === 0) return '$0';
    const value = annual ? Math.round(tier.monthly * 10) / 12 : tier.monthly;
    return `$${Math.round(value)}`;
  }

  return (
    <Section>
      <div style={{ textAlign: 'center', maxWidth: 560, marginInline: 'auto', marginBottom: u(4) }}>
        <Eyebrow>Pricing</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'clamp(34px, 4.2vw, 50px)',
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            fontWeight: 400,
            margin: `${u(1.6)} 0 ${u(1.2)}`,
            color: 'var(--rd-color-heading)',
          }}
        >
          Simple, honest pricing.
        </h2>
        <p style={{ fontSize: '1.02rem', color: 'var(--rd-color-text-muted)', margin: 0 }}>
          One number, one price. No per-page surprises, no setup fees.
        </p>

        {/* Annual toggle — selected pill is teal via --rd-color-btn. */}
        <div
          role="group"
          aria-label="Billing period"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: u(3),
            padding: 4,
            borderRadius: 999,
            border: '1px solid var(--rd-color-border)',
            background: 'var(--rd-color-surface)',
          }}
        >
          {(['monthly', 'annual'] as const).map((period) => {
            const isAnnual = period === 'annual';
            const selected = annual === isAnnual;
            return (
              <button
                key={period}
                type="button"
                aria-pressed={selected}
                onClick={() => setAnnual(isAnnual)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  paddingInline: u(2),
                  height: u(4),
                  borderRadius: 999,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontFamily: 'var(--rd-font-body)',
                  background: selected ? 'var(--rd-color-btn)' : 'transparent',
                  color: selected ? '#ffffff' : 'var(--rd-color-text-muted)',
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                {isAnnual ? 'Annual' : 'Monthly'}
              </button>
            );
          })}
        </div>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--rd-color-accent)',
            margin: `${u(1.2)} 0 0`,
            minHeight: '1.1em',
            fontWeight: 600,
          }}
        >
          {annual ? 'Two months free, billed yearly' : ' '}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: u(2.4),
          alignItems: 'stretch',
        }}
      >
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              padding: u(3),
              borderRadius: 'var(--rd-radius-lg)',
              background: 'var(--rd-color-surface)',
              border: tier.featured
                ? '1.5px solid var(--rd-color-primary)'
                : '1px solid var(--rd-color-border)',
              boxShadow: tier.featured ? 'var(--rd-shadow-md)' : 'var(--rd-shadow-sm)',
            }}
          >
            {tier.featured && (
              <span
                style={{
                  position: 'absolute',
                  top: u(2),
                  right: u(2),
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--rd-color-primary)',
                  background: 'var(--rd-color-primary-soft)',
                  padding: '3px 9px',
                  borderRadius: 999,
                }}
              >
                Most popular
              </span>
            )}
            <h3 style={{ fontFamily: 'var(--rd-font-display)', fontWeight: 500, fontSize: '1.2rem', margin: 0, color: 'var(--rd-color-heading)' }}>
              {tier.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: `${u(1.4)} 0 ${u(0.6)}` }}>
              <span style={{ fontFamily: 'var(--rd-font-display)', fontSize: '2.6rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--rd-color-heading)' }}>
                {priceLabel(tier)}
              </span>
              {tier.monthly !== null && tier.monthly > 0 && (
                <span style={{ fontSize: '0.85rem', color: 'var(--rd-color-text-muted)' }}>/mo</span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.5,
                color: 'var(--rd-color-text-muted)',
                margin: `0 0 ${u(2.4)}`,
                minHeight: '2.6em',
              }}
            >
              {tier.blurb}
            </p>
            <Button variant={tier.featured ? 'primary' : 'ghost'} style={{ width: '100%' }}>
              {tier.cta}
            </Button>
            <ul style={{ listStyle: 'none', margin: `${u(2.6)} 0 0`, padding: 0, display: 'grid', gap: u(1.2) }}>
              {tier.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: u(1.1) }}>
                  <Check size={15} strokeWidth={2.6} color="var(--rd-color-primary)" />
                  <span style={{ fontSize: '0.88rem', color: 'var(--rd-color-text)' }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
