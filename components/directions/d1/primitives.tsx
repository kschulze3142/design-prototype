// d1-local primitives — SEMrush "bold/editorial, data-forward" (DR-007).
// Direction-scoped by design: NOT shared. If a pattern repeats across directions
// we may lift *structure* into the shared layer later, but not yet.
import type { CSSProperties, ReactNode } from 'react';

const u = (n: number) => `calc(var(--rd-space-unit) * ${n})`;

/** Centered content column. SEMrush runs a wide, confident measure. The optional
 *  `width` lets the hero pair a NARROW text column over a WIDER product surface —
 *  SEMrush's signature centered-text-over-wide-dashboard move. */
export function Container({
  children,
  width = 1200,
  style,
}: {
  children: ReactNode;
  width?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ maxWidth: width, marginInline: 'auto', width: '100%', paddingInline: u(3), ...style }}>
      {children}
    </div>
  );
}

/** One marketing section with generous vertical rhythm. `wash` paints the pale
 *  sage hero tint (full-bleed via the section background); `tint` is a lighter
 *  alternation for interior sections. */
export function Section({
  children,
  wash = false,
  tint = false,
  style,
  id,
}: {
  children: ReactNode;
  wash?: boolean;
  tint?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  const background = wash
    ? 'var(--rd-color-hero-wash)'
    : tint
      ? 'var(--rd-color-accent-soft)'
      : 'transparent';
  return (
    <section id={id} style={{ paddingBlock: u(10), background, ...style }}>
      {children}
    </section>
  );
}

/** Small uppercase label above a headline — SEMrush's eyebrow, in lavender. */
export function Eyebrow({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'center' }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: 'var(--rd-color-accent)',
        textAlign: align,
      }}
    >
      {children}
    </p>
  );
}

/** The big tight display headline. `size` controls the clamp ceiling: 'hero'
 *  → 84px h1, 'section' → 64px h2. Letter-spacing is em-based (-0.04em ≈ -3.36px
 *  at 84px) so the very-tight tracking scales with the clamp on narrow viewports. */
export function Display({
  children,
  as: Tag = 'h2',
  size = 'section',
  align = 'left',
  style,
}: {
  children: ReactNode;
  as?: 'h1' | 'h2';
  size?: 'hero' | 'section';
  align?: 'left' | 'center';
  style?: CSSProperties;
}) {
  const fontSize = size === 'hero' ? 'clamp(40px, 8.5vw, 84px)' : 'clamp(34px, 6vw, 64px)';
  return (
    <Tag
      style={{
        margin: 0,
        fontFamily: 'var(--rd-font-display)',
        fontSize,
        lineHeight: size === 'hero' ? 1.06 : 1.09,
        letterSpacing: '-0.04em',
        fontWeight: 600,
        color: 'var(--rd-color-heading)',
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

type ButtonVariant = 'primary' | 'dark' | 'ghost';
type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  type?: 'button' | 'submit';
  style?: CSSProperties;
};

/** Buttons — SEMrush's distinctive set:
 *  - primary: LAVENDER bg with DARK text (not white-on-purple), squared 8px radius.
 *  - dark:    near-black bg, white text, full 100px pill (the "Sign Up" CTA).
 *  - ghost:   bordered, transparent. */
export function Button({ children, variant = 'primary', href, type = 'button', style }: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: u(1),
    fontSize: '16px',
    lineHeight: 1,
    fontFamily: 'var(--rd-font-body)',
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    transition: 'background 120ms ease, border-color 120ms ease, opacity 120ms ease',
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: {
      padding: '12px 20px',
      borderRadius: 'var(--rd-radius-sm)',
      fontWeight: 500,
      background: 'var(--rd-color-accent)',
      color: 'var(--rd-color-heading)',
    },
    dark: {
      padding: '12px 22px',
      borderRadius: 'var(--rd-radius-pill)',
      fontWeight: 500,
      background: 'var(--rd-color-btn-dark)',
      color: '#ffffff',
    },
    ghost: {
      padding: '12px 20px',
      borderRadius: 'var(--rd-radius-sm)',
      fontWeight: 500,
      background: 'transparent',
      color: 'var(--rd-color-heading)',
      borderColor: 'var(--rd-color-border)',
    },
  };
  const css = { ...base, ...variants[variant], ...style };
  if (href) {
    return (
      <a href={href} style={css}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} style={css}>
      {children}
    </button>
  );
}

/** White SEMrush card — crisp 16px radius, hairline border, soft data-product
 *  shadow. The recurring surface chrome across d1's marketing sections. */
export function Card({
  children,
  style,
  elevated = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  elevated?: boolean;
}) {
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: elevated ? 'var(--rd-shadow-lg)' : 'var(--rd-shadow-md)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export { u as space };
