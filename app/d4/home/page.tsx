// DR-004d-p — D4 "Robin Dock, diverged" home page, polished. Robin Dock is
// repositioned as the vertical DOCUMENT INBOX for veterinary clinics. Structural
// bones unchanged (hero → trust → workflow tabs → routing diagram → feature
// splits → pricing → social proof → CTA/footer), but: a lighter white/grey base,
// a detailed three-pane inbox as the hero centerpiece, a stronger teal backbone
// (incl. a full-teal CTA band), the new sources→robin→folders routing diagram,
// and vet-focused copy throughout. Fraunces/Inter, teal-primary/orange-spark,
// and the robin logo are preserved. Like D2, this page inlines its own single
// MarketingHeader rather than using the shared MarketingShell — the shell and
// DirectionNav are untouched and still serve the other d4 screens.
import { MarketingHeader } from '@/components/directions/d4/MarketingHeader';
import { Hero } from '@/components/directions/d4/Hero';
import { TrustBand } from '@/components/directions/d4/TrustBand';
import { WorkflowTabs } from '@/components/directions/d4/WorkflowTabs';
import { RoutingDiagram } from '@/components/directions/d4/RoutingDiagram';
import { FeatureSplit } from '@/components/directions/d4/FeatureSplit';
import { Pricing } from '@/components/directions/d4/Pricing';
import { SocialProof } from '@/components/directions/d4/SocialProof';
import { CtaFooter } from '@/components/directions/d4/CtaFooter';
import {
  FilingTimelineSurface,
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
        {/* 1 — Hero: copy + full-width three-pane document inbox */}
        <Hero />

        {/* 2 — Veterinary trust band */}
        <TrustBand />

        {/* 3 — Every document workflow in one place */}
        <WorkflowTabs />

        {/* 4 — Auto-routing diagram: sources → robin → folders (the standout) */}
        <RoutingDiagram />

        {/* 5 — Feature splits (one idea each) */}
        <FeatureSplit
          eyebrow="Auto-filing"
          headline="Lab results file themselves."
          body="No more wondering whether a referral or result made it onto the chart. Robin Dock captures each document the moment it arrives, reads what it is, and files it to the right patient — with a timestamped trail of where it went."
          quote={{
            text: 'CBC and chem panels land on the right pet’s file before anyone touches them.',
            author: 'Dr. Elena Marsh, DVM',
            role: 'Lakeside Animal Hospital',
          }}
          surface={<FilingTimelineSurface />}
        />
        <FeatureSplit
          eyebrow="Patient routing"
          headline="Every referral on the right pet."
          body="Match on sender, document type, or keyword and Robin Dock drops each incoming referral, letter, or report onto the right patient record — so your front desk isn’t sorting paper by hand."
          quote={{
            text: 'Referrals route to the right chart automatically. Our front desk got their mornings back.',
            author: 'Dr. Marcus Reyes, DVM',
            role: 'Cedar Creek Veterinary',
          }}
          surface={<PatientLinkSurface />}
          reverse
          tint
        />

        {/* 6 — Pricing */}
        <Pricing />

        {/* 7 — Social proof band */}
        <SocialProof />

        {/* 8 — Closing CTA + footer */}
        <CtaFooter />
      </main>
    </div>
  );
}
