// d4-local primitives — "Robin Dock, diverged" (DR-004p). Same structural bones
// as the d2/Harvest primitives, reskinned to Robin Dock's two-color identity:
// Forest Teal is the workhorse (Button), Robin Orange is the spark (Eyebrow,
// AccentUnderline). Direction-scoped by design: NOT shared.
import type { CSSProperties, ReactNode } from 'react';

const u = (n: number) => `calc(var(--rd-space-unit) * ${n})`;

/** Centered content column — generous editorial width. */
export function Container({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ maxWidth: 1120, marginInline: 'auto', width: '100%', paddingInline: u(3), ...style }}>
      {children}
    </div>
  );
}

/** One idea per section, generous vertical breathing room. The warm tint gives a
 *  quiet alternation against the cream page background. */
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
        paddingBlock: u(9),
        background: tint ? 'var(--rd-color-bg-tint)' : 'transparent',
        ...style,
      }}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Small uppercase label above a headline. DR-004d-p makes TEAL the default —
 *  the structural brand color now carries the section labels (the backbone),
 *  while Robin Orange is held back as a rare spark (the headline underline, a
 *  single stat figure). Pass tone="accent" only where an orange pop truly earns
 *  it; otherwise eyebrows reinforce the teal backbone. */
export function Eyebrow({
  children,
  tone = 'primary',
}: {
  children: ReactNode;
  tone?: 'primary' | 'accent';
}) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: '0.78rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: tone === 'accent' ? 'var(--rd-color-accent)' : 'var(--rd-color-primary)',
      }}
    >
      {children}
    </p>
  );
}

/** The signature move: a single accent word in a serif headline carrying a drawn
 *  underline bar — here in Robin Orange, the headline spark. The bar is a
 *  positioned element so it reads as a drawn underline (thick, rounded, offset
 *  below the baseline) rather than text-decoration. */
export function AccentUnderline({ children }: { children: ReactNode }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '0.04em',
          height: '0.085em',
          borderRadius: 999,
          background: 'var(--rd-color-accent)',
        }}
      />
    </span>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  href?: string;
  type?: 'button' | 'submit';
  style?: CSSProperties;
};

/** Buttons — the primary is a TEAL pill (Forest Teal is the workhorse; orange is
 *  never the button). 30px radius, 14×20 padding, weight 500, 16px. */
export function Button({ children, variant = 'primary', href, type = 'button', style }: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: u(1),
    padding: '14px 20px',
    borderRadius: 'var(--rd-radius-pill)',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1,
    fontFamily: 'var(--rd-font-body)',
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 120ms ease, border-color 120ms ease, opacity 120ms ease',
  };
  const variants: Record<'primary' | 'ghost', CSSProperties> = {
    primary: {
      background: 'var(--rd-color-btn)',
      color: '#ffffff',
      border: '1px solid var(--rd-color-btn)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--rd-color-heading)',
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

/** White card — 20px radius, one soft even shadow. The recurring surface chrome
 *  across d4. */
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
        boxShadow: 'var(--rd-shadow-md)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export { u as space };
