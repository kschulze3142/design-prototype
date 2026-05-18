import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: React.ReactNode;
}

const HEIGHT: Record<Size, number> = { sm: 32, md: 36, lg: 40 };

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
  },
  secondary: {
    background: 'white',
    border: '1px solid var(--color-border-strong)',
    color: 'var(--color-text-primary)',
    borderRadius: 'var(--radius-pill)',
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-secondary)',
    borderRadius: 'var(--radius-md)',
  },
  destructive: {
    background: 'var(--color-failed)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md)',
  },
};

export function Button({ variant = 'md' as any, size = 'md', children, style, ...rest }: ButtonProps & { variant?: Variant }) {
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: `all var(--duration-fast) var(--ease-out)`,
        whiteSpace: 'nowrap',
        padding: '0 14px',
        height: HEIGHT[size],
        ...variantStyle,
        ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        if (variant === 'primary') el.style.background = 'var(--color-primary-hover)';
        if (variant === 'secondary') { el.style.background = 'var(--color-primary-subtle)'; el.style.borderColor = 'var(--color-primary)'; }
        if (variant === 'ghost') { el.style.background = 'var(--color-primary-subtle)'; el.style.color = 'var(--color-text-primary)'; }
        if (variant === 'destructive') el.style.background = '#b91c1c';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        Object.assign(el.style, variantStyle);
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
