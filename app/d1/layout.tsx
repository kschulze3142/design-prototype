import type { ReactNode } from 'react';
import { Space_Grotesk, Inter } from 'next/font/google';

// DR-007 — SEMrush (bold/editorial, data-forward) typography, wired d1-scoped.
// Space Grotesk is the geometric display face (free Google substitute for
// SEMrush's licensed "Lazzer"); Inter is the body face. Both are loaded here
// rather than in the shared root layout so the faces stay confined to the d1
// subtree — the other directions keep their own stacks. Both are variable fonts,
// so no explicit weight array is required.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function D1Layout({ children }: { children: ReactNode }) {
  // The font CSS variables are exposed here; the [data-direction='d1'] token
  // block in app/directions.css maps --rd-font-display / --rd-font-body onto them.
  return (
    <div data-direction="d1" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
