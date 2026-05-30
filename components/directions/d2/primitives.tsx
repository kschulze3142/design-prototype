// d2-local primitives — Mercury "quiet minimal".
// Direction-scoped by design (DR-004): NOT shared. If a pattern repeats across
// directions we may lift *structure* into the shared layer later, but not yet.
import type { CSSProperties, ReactNode } from 'react';

const u = (n: number) => `calc(var(--rd-space-unit) * ${n})`;

/** Centered content column. Mercury stays calm and contained, not full-bleed. */
export function Container({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ maxWidth: 920, marginInline: 'auto', width: '100%', ...style }}>{children}</div>;
}

/** One idea per section, generous vertical breathing room. */
export function Section({
  children,
  tint = false,
  style,
  id,
}: {
  children: ReactNode;
  tint?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <section
      id={id}
      style={{
        paddingBlock: u(8),
        background: tint ? 'var(--rd-color-bg-tint)' : 'transparent',
        ...style,
      }}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Small uppercase label that sits above a headline. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: 'var(--rd-color-accent)',
      }}
    >
      {children}
    </p>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  href?: string;
  type?: 'button' | 'submit';
  style?: CSSProperties;
};

/** Calm buttons — one restrained accent, soft radius, no loud gradients. */
export function Button({ children, variant = 'primary', href, type = 'button', style }: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: u(0.8),
    paddingInline: u(2.2),
    height: u(5),
    borderRadius: 'var(--rd-radius-md)',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: 'var(--rd-font-body)',
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 120ms ease, border-color 120ms ease',
  };
  const variants: Record<'primary' | 'ghost', CSSProperties> = {
    primary: {
      background: 'var(--rd-color-accent)',
      color: '#ffffff',
      border: '1px solid var(--rd-color-accent)',
    },
    ghost: {
      background: 'var(--rd-color-surface)',
      color: 'var(--rd-color-text)',
      border: '1px solid var(--rd-color-border)',
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

/** Plain bordered card — the recurring surface chrome across d2. */
export function Card({
  children,
  style,
  muted = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        background: muted ? 'var(--rd-color-bg)' : 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-highlight-inset), var(--rd-shadow-md)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export { u as space };
