import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

// DR-003 — Notion (workflow / surface-dense, dark-hero) typography, d3-scoped.
// Inter substitutes for Notion's "NotionInter" (the headline is 700-weight Inter);
// loaded here rather than the shared root layout so the face stays confined to the
// d3 subtree. Inter is a variable font, so no explicit weight array is required —
// the [data-direction='d3'] block maps --rd-font-display / --rd-font-body onto it.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function D3Layout({ children }: { children: ReactNode }) {
  return (
    <div data-direction="d3" className={inter.variable}>
      {children}
    </div>
  );
}
