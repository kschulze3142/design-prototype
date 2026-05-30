import type { ReactNode } from 'react';

export default function D2Layout({ children }: { children: ReactNode }) {
  return <div data-direction="d2">{children}</div>;
}
