import type { ReactNode } from 'react';
import { Fraunces, Inter } from 'next/font/google';

// DR-004p — D4 "Robin Dock, diverged" typography, wired d4-scoped.
// Fraunces is the serif display face for the big editorial headlines (warm,
// optical-sized character — that's the whole point of the serif); Inter is the
// body/UI face. Both are loaded here rather than in the shared root layout so the
// faces stay confined to the d4 subtree — the other directions keep their own.
// Both are variable fonts, so no explicit weight array is required; Fraunces also
// carries the `opsz` (optical sizing) axis so the display headlines pick up its
// warmer large-size letterforms.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function D4Layout({ children }: { children: ReactNode }) {
  // The font CSS variables are exposed here; the [data-direction='d4'] token
  // block in app/directions.css maps --rd-font-display / --rd-font-body onto them.
  return (
    <div data-direction="d4" className={`${fraunces.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
