'use client';
import { AppSidebar } from '@/components/app/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <AppSidebar />
      <main style={{ marginLeft: 220, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
