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
        if (variant === 'primary') {
          el.style.background = 'var(--color-primary-hover)';
          el.style.transform = 'translateY(-1px)';
          el.style.boxShadow = '0 4px 12px rgba(61, 80, 128, 0.25)';
        }
        if (variant === 'secondary') {
          el.style.background = 'var(--color-primary-subtle)';
          el.style.borderColor = 'var(--color-primary)';
          el.style.transform = 'translateY(-1px)';
        }
        if (variant === 'ghost') {
          el.style.background = 'var(--color-primary-subtle)';
          el.style.color = 'var(--color-text-primary)';
          el.style.transform = 'translateY(-1px)';
        }
        if (variant === 'destructive') {
          el.style.background = '#b91c1c';
          el.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        Object.assign(el.style, variantStyle);
        el.style.transform = '';
        el.style.boxShadow = '';
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variant === 'primary' ? '0 2px 6px rgba(61, 80, 128, 0.15)' : '';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        if (variant === 'primary') e.currentTarget.style.boxShadow = '0 4px 12px rgba(61, 80, 128, 0.25)';
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
