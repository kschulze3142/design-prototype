'use client';

import { DepartmentStub } from '../DepartmentStub';
import type { DepartmentType } from '@/lib/mockSystem/types';

export function PipelinePage({ type }: { type: DepartmentType }) {
  return <DepartmentStub type={type} layoutName="Pipeline (Kanban)" ticketId="FE-054" />;
}
