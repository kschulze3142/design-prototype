import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
  padding?: string | number;
}

export function Card({ children, className = '', style, noPadding, padding }: CardProps) {
  const resolvedPadding = noPadding ? 0 : (padding ?? 'var(--space-6)');
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: resolvedPadding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
