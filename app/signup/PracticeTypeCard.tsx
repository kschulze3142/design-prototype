'use client';

import { I } from '@/components/app/icons';
import type { PracticeType } from '@/lib/mockSystem';

type IconName = 'HomeHealth' | 'Cardiology';

export type PracticeTypeCardProps = {
  type: PracticeType;
  title: string;
  description: string;
  iconName: IconName;
  selected: boolean;
  onSelect: () => void;
};

export function PracticeTypeCard({
  title,
  description,
  iconName,
  selected,
  onSelect,
}: PracticeTypeCardProps) {
  const IconCmp = I[iconName];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="text-left p-6 transition-shadow focus:outline-none focus-visible:ring-4"
      style={{
        background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: selected
          ? '2px solid var(--color-primary)'
          : '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)';
          e.currentTarget.style.boxShadow = 'var(--shadow-panel)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }
      }}
    >
      <span
        className="inline-flex mb-4"
        style={{ color: 'var(--color-primary)' }}
      >
        <IconCmp size={36} strokeWidth={1.6} />
      </span>
      <div
        className="mb-1"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: 18,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </div>
      <div
        className="text-[13px] leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </div>
    </button>
  );
}
