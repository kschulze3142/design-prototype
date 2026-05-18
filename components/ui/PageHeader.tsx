import React from 'react';

interface PageHeaderProps {
  overline?: string;
  headline: string;
  subline?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ overline, headline, subline, actions }: PageHeaderProps) {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid var(--color-header-border)',
      padding: '24px 32px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    }}>
      <div>
        {overline && (
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-body)',
            marginBottom: 4,
          }}>
            {overline}
          </div>
        )}
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.15,
          margin: 0,
          marginBottom: subline ? 4 : 0,
        }}>
          {headline}
        </h1>
        {subline && (
          <p style={{
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}>
            {subline}
          </p>
        )}
      </div>
      {actions && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          alignSelf: 'center',
        }}>
          {actions}
        </div>
      )}
    </div>
  );
}
