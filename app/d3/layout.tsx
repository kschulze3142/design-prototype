import type { ReactNode } from 'react';

export default function D3Layout({ children }: { children: ReactNode }) {
  return <div data-direction="d3">{children}</div>;
}
