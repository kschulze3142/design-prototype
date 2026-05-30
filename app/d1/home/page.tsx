// DR-007 — D1 SEMrush "bold/editorial, data-forward" home page.
// A faithful reconstruction of SEMrush's marketing system with Robin Dock's hero
// content. SEMrush has ONE header, so this page does NOT use the shared
// MarketingShell (which always stacks the shared DirectionNav on top); it inlines
// the same full-bleed wrapper and renders the d1 MarketingHeader as the single
// primary bar, with the prototype's Home/Inbox/Dashboard switcher folded in as
// small secondary links. The shared MarketingShell and DirectionNav are untouched
// and still serve the other d1 screens (inbox, dashboard).
//
// Hero content is Robin Dock ("Never lose a fax again."); the body sections
// (feature splits, feature grid, stat band) carry SEMrush-style placeholder copy
// — we reskin those to Robin Dock specifics in a later pass. The layout reads
// true now: centered hero with a wide-but-contained dashboard surface below.
import { MarketingHeader } from '@/components/directions/d1/MarketingHeader';
import { Hero } from '@/components/directions/d1/Hero';
import { FeatureSection } from '@/components/directions/d1/FeatureSection';
import { FeatureGrid } from '@/components/directions/d1/FeatureGrid';
import { StatBand } from '@/components/directions/d1/StatBand';
import { CtaFooter } from '@/components/directions/d1/CtaFooter';
import { DeliveryReceiptSurface, RoutingSurface } from '@/components/directions/d1/surfaces';

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
        {/* 1 — Hero (Robin Dock): centered text over a wide-contained surface */}
        <Hero />

        {/* 2 — Feature split: delivery accountability */}
        <FeatureSection
          eyebrow="Delivery confirmation"
          headline="Track every fax to a confirmed receipt."
          body="Stop guessing whether a referral or prior auth actually landed. Robin Dock returns a timestamped receipt the moment a fax is delivered — and retries the busy lines for you, so nothing fails in silence."
          bullets={['Timestamped delivery receipts', 'Automatic retries on busy lines', 'Real-time send status']}
          surface={<DeliveryReceiptSurface />}
        />

        {/* 3 — Feature split: automated routing */}
        <FeatureSection
          eyebrow="Inbound routing"
          headline="Inbound faxes file themselves."
          body="Match on sender, keyword, or line and Robin Dock drops each incoming document onto the right patient or department automatically — so your front desk isn’t sorting paper by hand."
          bullets={['Rule-based matching', 'Auto-link to patient records', 'Audit trail on every decision']}
          surface={<RoutingSurface />}
          reverse
          tint
        />

        {/* 4 — Feature grid: one platform */}
        <FeatureGrid />

        {/* 5 — Data-forward proof band */}
        <StatBand />

        {/* 6 — Closing CTA + footer */}
        <CtaFooter />
      </main>
    </div>
  );
}
