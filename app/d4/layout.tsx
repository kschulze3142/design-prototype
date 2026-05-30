import type { ReactNode } from 'react';

export default function D4Layout({ children }: { children: ReactNode }) {
  return <div data-direction="d4">{children}</div>;
}
