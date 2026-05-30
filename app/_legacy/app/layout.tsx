'use client';
import { AppSidebar } from '@/components/app/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <AppSidebar />
      <main style={{ marginLeft: 220, width: 'calc(100% - 220px)', maxWidth: '100%', paddingLeft: 32, paddingRight: 32, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
