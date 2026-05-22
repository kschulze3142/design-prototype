// Phase 9 — Blue Lark practice-type signup (single-screen).
// Replaces previous FaxGrid multi-step signup flow (preserved in git history).
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useMockSystem,
  practiceTypeTemplates,
  type PracticeType,
} from '@/lib/mockSystem';
import { PracticeTypeCard } from './PracticeTypeCard';

const PRACTICE_TYPES = {
  home_health: {
    title: 'Home Health Agency',
    description:
      'Manage incoming referrals, prior authorizations, and orders across your intake and clinical teams.',
    iconName: 'HomeHealth' as const,
  },
  cardiology: {
    title: 'Cardiology Practice',
    description:
      'Track referrals, prior auths, and clinical results for your specialty practice.',
    iconName: 'Cardiology' as const,
  },
};

export default function SignupPage() {
  const { templates, setPracticeType } = useMockSystem();
  const router = useRouter();

  // Always start unselected — /signup is a fresh-choice screen, not a settings page.
  // Re-entry requires re-selection; the provider remembers the previous choice for the session.
  const [selectedType, setSelectedType] = useState<PracticeType | null>(null);

  const deptTypesForPreview = selectedType
    ? practiceTypeTemplates[selectedType]
    : [];

  const handleContinue = () => {
    if (!selectedType) return;
    setPracticeType(selectedType);
    router.push('/welcome');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-[560px] flex flex-col gap-8">
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 24,
            color: 'var(--color-text-primary)',
          }}
        >
          Blue Lark
        </div>

        <div className="flex flex-col gap-2">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1.2,
              color: 'var(--color-text-primary)',
            }}
          >
            What kind of practice are you?
          </h1>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            We&apos;ll set up your workspace based on how your office works. You
            can customize everything later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(PRACTICE_TYPES) as PracticeType[]).map((type) => {
            const meta = PRACTICE_TYPES[type];
            return (
              <PracticeTypeCard
                key={type}
                type={type}
                title={meta.title}
                description={meta.description}
                iconName={meta.iconName}
                selected={selectedType === type}
                onSelect={() => setSelectedType(type)}
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.07em]"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Your workspace will include:
          </div>
          <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
            {selectedType === null ? (
              <span
                className="italic text-[13px]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Select a practice type to see your departments
              </span>
            ) : (
              // Inline chip rather than the `Pill` primitive: `Pill` is for status
              // tones (delivered / review / failed) with mandatory colored dots —
              // wrong semantics for neutral department labels here.
              deptTypesForPreview.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium"
                  style={{
                    background: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {templates[t].name}
                </span>
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full h-[42px] font-semibold text-[14px] text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'var(--color-primary)',
            fontFamily: 'var(--font-heading)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
