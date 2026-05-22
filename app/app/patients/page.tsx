'use client';

import { Card, SectionTitle } from '@/components/app/primitives';
import { I } from '@/components/app/icons';

export default function PatientsPage() {
  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <SectionTitle title="Patients" subtitle="Cross-department patient directory" />
      <Card className="mt-6 p-10 flex flex-col items-center justify-center gap-4 text-center">
        <span
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
        >
          <I.Patients size={22} />
        </span>
        <div>
          <div className="text-[16px] font-semibold text-slate-900">Patient directory coming soon</div>
          <p className="text-[13.5px] text-slate-500 mt-1.5 max-w-md">
            The full patient list view ships with FE-065. For now, patient cards surface inside
            each department's work-item drawer.
          </p>
        </div>
      </Card>
    </div>
  );
}
