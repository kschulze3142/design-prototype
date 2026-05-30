'use client';

// d3 Pricing — Notion-skinned 3-tier table, kept consistent with D1/D2 (Free Trial
// / Starter $39 / Professional $89, same feature copy) so the cross-direction
// comparison stays apples-to-apples. Clean white cards, tight radii, the featured
// tier outlined in Notion blue. Optional monthly ⇄ annual toggle (annual = two
// months free).
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button, Container, Display, Eyebrow, space as u } from './primitives';

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
    features: ['1,000 pages / month', 'One ported fax number', 'Automatic retries', 'Email + chat support'],
  },
  {
    name: 'Professional',
    monthly: 89,
    blurb: 'For multi-provider groups and higher volume.',
    cta: 'Choose Professional',
    features: ['3,000 pages / month', 'Up to five fax numbers', 'Routing rules & departments', 'Priority support & BAA'],
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
    <section style={{ background: 'var(--rd-color-canvas)', paddingBlock: u(11) }}>
      <Container>
        <div style={{ textAlign: 'center', maxWidth: 600, marginInline: 'auto', marginBottom: u(5) }}>
          <Eyebrow align="center">Pricing</Eyebrow>
          <Display as="h2" size="section" align="center" style={{ marginTop: u(1.5) }}>
            Simple, honest pricing.
          </Display>
          <p style={{ fontSize: '1.08rem', color: 'var(--rd-color-text-muted)', margin: `${u(2)} 0 0` }}>
            One number, one price. No per-page surprises, no setup fees.
          </p>

          {/* Annual toggle */}
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
                    background: selected ? 'var(--rd-color-hero-bg)' : 'transparent',
                    color: selected ? '#ffffff' : 'var(--rd-color-text-muted)',
                    transition: 'background 120ms ease, color 120ms ease',
                  }}
                >
                  {isAnnual ? 'Annual' : 'Monthly'}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--rd-color-accent)', margin: `${u(1.2)} 0 0`, minHeight: '1.1em', fontWeight: 600 }}>
            {annual ? 'Two months free, billed yearly' : ' '}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(248px, 1fr))',
            gap: u(2.5),
            alignItems: 'stretch',
            maxWidth: 1000,
            marginInline: 'auto',
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
                border: tier.featured ? '1.5px solid var(--rd-color-accent)' : '1px solid var(--rd-color-border)',
                boxShadow: tier.featured ? 'var(--rd-shadow-md)' : 'var(--rd-shadow-sm)',
              }}
            >
              {tier.featured && (
                <span
                  style={{
                    position: 'absolute',
                    top: u(2.5),
                    right: u(2.5),
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--rd-color-accent)',
                    background: 'var(--rd-color-accent-soft)',
                    padding: '3px 9px',
                    borderRadius: 'var(--rd-radius-sm)',
                  }}
                >
                  Most popular
                </span>
              )}
              <h3 style={{ fontFamily: 'var(--rd-font-display)', fontWeight: 600, fontSize: '1.15rem', margin: 0, color: 'var(--rd-color-heading)' }}>
                {tier.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: `${u(1.5)} 0 ${u(0.6)}` }}>
                <span style={{ fontFamily: 'var(--rd-font-display)', fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--rd-color-heading)' }}>
                  {priceLabel(tier)}
                </span>
                {tier.monthly !== null && tier.monthly > 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--rd-color-text-muted)' }}>/mo</span>
                )}
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--rd-color-text-muted)', margin: `0 0 ${u(2.5)}`, minHeight: '2.7em' }}>
                {tier.blurb}
              </p>
              <Button variant={tier.featured ? 'primary' : 'secondary'} style={{ width: '100%' }}>
                {tier.cta}
              </Button>
              <ul style={{ listStyle: 'none', margin: `${u(2.6)} 0 0`, padding: 0, display: 'grid', gap: u(1.2) }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: u(1.1) }}>
                    <Check size={15} strokeWidth={2.6} color="var(--rd-color-accent)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--rd-color-text)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
