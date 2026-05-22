'use client';

import { DepartmentStub } from '../DepartmentStub';
import type { DepartmentType } from '@/lib/mockSystem/types';

export function InboxPage({ type }: { type: DepartmentType }) {
  return <DepartmentStub type={type} layoutName="Inbox" ticketId="FE-059 / FE-063" />;
}
