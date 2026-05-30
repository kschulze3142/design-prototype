import type { ReactNode } from 'react';
import { DirectionNav } from './DirectionNav';
import type { DirectionId } from './types';

interface Props {
  direction: DirectionId;
  children: ReactNode;
}

// Full-bleed shell variant for marketing pages. Mirrors DirectionShell's
// wrapper + shared DirectionNav, but the <main> drops the max-width clamp and
// horizontal padding so tinted section bands reach the viewport edges. Children
// manage their own internal width/padding (e.g. the d2 Container primitive).
export function MarketingShell({ direction, children }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--rd-color-bg)',
        color: 'var(--rd-color-text)',
        fontFamily: 'var(--rd-font-body)',
      }}
    >
      <DirectionNav direction={direction} />
      <main>{children}</main>
    </div>
  );
}
