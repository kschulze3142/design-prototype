import { notFound } from 'next/navigation';
import { DepartmentPage } from '@/lib/components/DepartmentPage';
import type { DepartmentType } from '@/lib/mockSystem/types';

const VALID_TYPES: DepartmentType[] = [
  'referrals',
  'prior_auth',
  'clinical_results',
  'orders',
  'admin',
];

function isDepartmentType(s: string): s is DepartmentType {
  return (VALID_TYPES as string[]).includes(s);
}

export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isDepartmentType(type)) notFound();
  return <DepartmentPage type={type} />;
}
