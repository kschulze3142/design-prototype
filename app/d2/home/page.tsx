// DR-004 — D2 Mercury "quiet minimal" home page.
// Mercury has ONE header. So this page does NOT use the shared MarketingShell
// (which always stacks the shared DirectionNav on top); it inlines the same
// full-bleed wrapper and renders the d2 MarketingHeader as the single primary
// bar, with the prototype's Home/Inbox/Dashboard switcher folded in as small
// secondary links. This is a page-level composition choice — the shared
// MarketingShell and DirectionNav are untouched and still serve the other
// d2 screens (inbox, dashboard) and the rest of the prototype.
import { MarketingHeader } from '@/components/directions/d2/MarketingHeader';
import { Hero } from '@/components/directions/d2/Hero';
import { FeatureSplit } from '@/components/directions/d2/FeatureSplit';
import { TrustTabs } from '@/components/directions/d2/TrustTabs';
import { Pricing } from '@/components/directions/d2/Pricing';
import { SocialProof } from '@/components/directions/d2/SocialProof';
import { CtaFooter } from '@/components/directions/d2/CtaFooter';
import { DeliveryConfirmationSurface, PatientLinkSurface } from '@/components/directions/d2/surfaces';

export default function Page() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--rd-color-bg)',
        color: 'var(--rd-color-text)',
        fontFamily: 'var(--rd-font-body)',
      }}
    >
      <MarketingHeader current="home" />
      <main>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Feature sections (one idea each) */}
      <FeatureSplit
        eyebrow="Delivery confirmation"
        headline="Every fax comes back with a receipt."
        body="No more wondering whether a referral or prior auth actually went through. Robin Dock returns a timestamped confirmation the moment it lands — and retries the busy lines for you."
        quote={{
          text: 'I stopped re-sending things “just in case.” The receipt is right there.',
          author: 'Dana Whitfield',
          role: 'Practice Manager',
        }}
        surface={<DeliveryConfirmationSurface />}
      />
      <FeatureSplit
        eyebrow="Patient routing"
        headline="Inbound faxes file themselves."
        body="Match on sender, keyword, or line and Robin Dock drops each incoming document onto the right patient or department — so your front desk isn’t sorting paper by hand."
        quote={{
          text: 'Lab results land on the right chart before anyone touches them.',
          author: 'Marcus Reyes',
          role: 'Billing Lead',
        }}
        surface={<PatientLinkSurface />}
        reverse
        tint
      />

      {/* 3 — Trust pillars (centerpiece) */}
      <TrustTabs />

      {/* 4 — Pricing */}
      <Pricing />

      {/* 5 — Social proof */}
      <SocialProof />

      {/* 6 — CTA + footer */}
      <CtaFooter />
      </main>
    </div>
  );
}
