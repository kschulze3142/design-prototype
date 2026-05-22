'use client';

import { DepartmentStub } from '../DepartmentStub';
import type { DepartmentType } from '@/lib/mockSystem/types';

export function TrackerPage({ type }: { type: DepartmentType }) {
  return <DepartmentStub type={type} layoutName="Tracker" ticketId="FE-057" />;
}
