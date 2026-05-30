import type { ReactNode } from 'react';

export default function D1Layout({ children }: { children: ReactNode }) {
  return <div data-direction="d1">{children}</div>;
}
