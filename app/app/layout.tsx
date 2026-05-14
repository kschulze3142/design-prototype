'use client';
import { AppSidebar } from '@/components/app/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'radial-gradient(circle at 18% -4%, rgba(204,251,241,0.85), transparent 32%), radial-gradient(circle at 92% 8%, rgba(186,230,253,0.35), transparent 28%), linear-gradient(135deg, #f8fffd, #f3f7f6)' }}>
      <AppSidebar />
      <main className="flex-1 min-w-0 px-8 py-7">
        <div className="mx-auto" style={{ maxWidth: 1180 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
