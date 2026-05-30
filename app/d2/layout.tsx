import type { ReactNode } from 'react';
import { Besley, Inter } from 'next/font/google';

// DR-004h — Harvest (warm editorial-minimal) typography, wired d2-scoped.
// Besley is the serif display face (free Google substitute for Harvest's serif);
// Inter is the humanist body face (substitute for Harvest's licensed Muoto).
// Both are loaded here rather than in the shared root layout so the faces stay
// confined to the d2 subtree — the other directions keep the system stack.
// Both are variable fonts, so no explicit weight is required.
const besley = Besley({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-besley',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function D2Layout({ children }: { children: ReactNode }) {
  // The font CSS variables are exposed here; the [data-direction='d2'] token
  // block in app/directions.css maps --rd-font-display / --rd-font-body onto them.
  return (
    <div data-direction="d2" className={`${besley.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
