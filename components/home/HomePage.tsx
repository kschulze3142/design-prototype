'use client';

import React from 'react';
import { HNav } from './HNav';
import { HHero } from './HHero';
import { HPlatformOverview } from './HPlatformOverview';
import { HTrustBand } from './HTrustBand';
import { HOperationsShowcase } from './HOperationsShowcase';
import { HPricing } from './HPricing';
import { HWorkflow } from './HWorkflow';
import { HSecurity } from './HSecurity';
import { HFAQ } from './HFAQ';
import { HResourcesFooter } from './HResourcesFooter';

export function HomePage() {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background:
          'radial-gradient(circle at 20% 0%, oklch(0.94 0.07 var(--accent-h) / 0.85), transparent 32%), linear-gradient(135deg, #f8fffd, #f3f7f6)',
      }}
    >
      <HNav />
      <main>
        <HHero />
        <HPlatformOverview />
        <HTrustBand />
        <HOperationsShowcase />
        <HPricing />
        <HWorkflow />
        <HSecurity />
        <HFAQ />
        <HResourcesFooter />
      </main>
    </div>
  );
}
