'use client';

import { DepartmentStub } from '../DepartmentStub';
import type { DepartmentType } from '@/lib/mockSystem/types';

export function QueuePage({ type }: { type: DepartmentType }) {
  return <DepartmentStub type={type} layoutName="Queue" ticketId="FE-061" />;
}
