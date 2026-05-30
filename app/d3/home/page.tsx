// DR-003 — D3 Notion "workflow / surface-dense, dark-hero" home page.
// A faithful reconstruction of Notion's marketing system with Robin Dock's hero
// content. Notion has ONE header, so this page does NOT use the shared
// MarketingShell (which always stacks the shared DirectionNav on top); it inlines
// the same full-bleed wrapper and renders the d3 MarketingHeader as the single
// primary bar sitting on the charcoal hero, with the prototype's
// Home/Inbox/Dashboard switcher folded in as small secondary links. The shared
// MarketingShell and DirectionNav are untouched and still serve the other d3
// screens (inbox, dashboard).
//
// Hero content is Robin Dock ("Where every fax gets handled." + the fax-operations
// workspace surface from designMock); the body sections carry Notion-style
// placeholder copy reskinned to Robin Dock. The page alternates the signature
// dark hero → light/canvas body sections → dark CTA-footer bookend, built dense
// from the start with tight Notion rhythm and no empty vertical gaps.
import { MarketingHeader } from '@/components/directions/d3/MarketingHeader';
import { Hero } from '@/components/directions/d3/Hero';
import { StackedSurfaces } from '@/components/directions/d3/StackedSurfaces';
import { WorkflowExplainer } from '@/components/directions/d3/WorkflowExplainer';
import { FeatureDensity } from '@/components/directions/d3/FeatureDensity';
import { SocialProof } from '@/components/directions/d3/SocialProof';
import { Pricing } from '@/components/directions/d3/Pricing';
import { CtaFooter } from '@/components/directions/d3/CtaFooter';

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
      {/* Header sits ON the dark hero — wrap both so the charcoal runs to the top */}
      <div style={{ background: 'var(--rd-color-hero-bg)' }}>
        <MarketingHeader current="home" />
        {/* 1 — Hero (Robin Dock): dark, centered, with the dense fax-ops workspace */}
        <Hero />
      </div>

      <main>
        {/* 2 — Bring it all together: stacked workspace surfaces at depth */}
        <StackedSurfaces />

        {/* 3 — Auto-routing explainer: match → route → handled + routing trace */}
        <WorkflowExplainer />

        {/* 4 — Feature density: workspace capabilities grid */}
        <FeatureDensity />

        {/* 5 — Social proof + derived metrics */}
        <SocialProof />

        {/* 6 — Transparent 3-tier pricing */}
        <Pricing />

        {/* 7 — Closing CTA + footer (dark bookend) */}
        <CtaFooter />
      </main>
    </div>
  );
}
