// DR-004p — D4 "Robin Dock, diverged" home page. Same structural bones as the
// D2/Harvest home (hero → workflow tabs → feature splits → pricing → social proof
// → CTA/footer), reskinned to Robin Dock's real two-color identity: cream bg,
// Fraunces serif headlines, teal-primary buttons/chrome, orange accent sparks,
// the robin logo in the header. Like D2, this page inlines its own single
// MarketingHeader rather than using the shared MarketingShell (which stacks the
// shared DirectionNav on top) — the shell and DirectionNav are untouched and
// still serve the other d4 screens (inbox, dashboard).
import { MarketingHeader } from '@/components/directions/d4/MarketingHeader';
import { Hero } from '@/components/directions/d4/Hero';
import { WorkflowTabs } from '@/components/directions/d4/WorkflowTabs';
import { FeatureSplit } from '@/components/directions/d4/FeatureSplit';
import { Pricing } from '@/components/directions/d4/Pricing';
import { SocialProof } from '@/components/directions/d4/SocialProof';
import { CtaFooter } from '@/components/directions/d4/CtaFooter';
import {
  DeliveryConfirmationSurface,
  PatientLinkSurface,
} from '@/components/directions/d4/surfaces';

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
        {/* 1 — Hero (Robin Dock) */}
        <Hero />

        {/* 2 — Workflows in one platform */}
        <WorkflowTabs />

        {/* 3 — Feature splits (one idea each) */}
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

        {/* 4 — Pricing */}
        <Pricing />

        {/* 5 — Social proof band */}
        <SocialProof />

        {/* 6 — Closing CTA + footer */}
        <CtaFooter />
      </main>
    </div>
  );
}
