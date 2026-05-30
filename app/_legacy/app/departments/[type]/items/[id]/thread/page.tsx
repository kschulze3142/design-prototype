import { notFound } from 'next/navigation';
import { ThreadView } from '@/lib/components/ThreadView';
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
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (!isDepartmentType(type)) notFound();
  return <ThreadView itemId={id} type={type} />;
}
