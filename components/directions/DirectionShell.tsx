import type { ReactNode } from 'react';
import { DirectionNav } from './DirectionNav';
import type { DirectionId } from './types';

interface Props {
  direction: DirectionId;
  children: ReactNode;
}

export function DirectionShell({ direction, children }: Props) {
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
      <main
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: 'calc(var(--rd-space-unit) * 4) calc(var(--rd-space-unit) * 3)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
