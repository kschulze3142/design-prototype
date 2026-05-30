// d3-local primitives — Notion "workflow / surface-dense, dark-hero" (DR-003).
// Direction-scoped by design: NOT shared. Notion's system is tight radii, hairline
// borders, a single blue accent, 700-weight Inter display type, and — its
// signature — a near-black charcoal hero that the page alternates out of into
// light body sections. The `onDark`/`tone` flags let the same primitives render
// correctly on both the dark hero and the light body.
import type { CSSProperties, ReactNode } from 'react';

const u = (n: number) => `calc(var(--rd-space-unit) * ${n})`;

/** Centered content column. Notion runs a contained ~1100px measure. */
export function Container({
  children,
  width = 1120,
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

type SectionTone = 'light' | 'dark' | 'canvas';

/** One marketing section with Notion's tight vertical rhythm. `tone` paints the
 *  background: `dark` = the charcoal hero/CTA bookend, `canvas` = the gray
 *  workspace wash, `light` = white. */
export function Section({
  children,
  tone = 'light',
  style,
  id,
}: {
  children: ReactNode;
  tone?: SectionTone;
  style?: CSSProperties;
  id?: string;
}) {
  const background =
    tone === 'dark'
      ? 'var(--rd-color-hero-bg)'
      : tone === 'canvas'
        ? 'var(--rd-color-canvas)'
        : 'var(--rd-color-bg)';
  const color = tone === 'dark' ? 'var(--rd-color-hero-text)' : 'var(--rd-color-text)';
  return (
    <section id={id} style={{ paddingBlock: u(9), background, color, ...style }}>
      {children}
    </section>
  );
}

/** Small uppercase label above a headline — Notion's eyebrow, in blue. `onDark`
 *  keeps it legible on the charcoal hero. */
export function Eyebrow({
  children,
  align = 'left',
  onDark = false,
}: {
  children: ReactNode;
  align?: 'left' | 'center';
  onDark?: boolean;
}) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: '0.8rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: onDark ? 'rgba(255,255,255,0.7)' : 'var(--rd-color-accent)',
        textAlign: align,
      }}
    >
      {children}
    </p>
  );
}

/** The big tight display headline. `size` controls the clamp ceiling: 'hero'
 *  → 64px h1, 'section' → 54px h2. Notion sets these at weight 700 with very tight
 *  tracking (-0.033em ≈ -2.125px @64px) — em-based so it scales on the clamp.
 *  `onDark` flips to white for the charcoal hero. */
export function Display({
  children,
  as: Tag = 'h2',
  size = 'section',
  align = 'left',
  onDark = false,
  style,
}: {
  children: ReactNode;
  as?: 'h1' | 'h2';
  size?: 'hero' | 'section';
  align?: 'left' | 'center';
  onDark?: boolean;
  style?: CSSProperties;
}) {
  const fontSize = size === 'hero' ? 'clamp(38px, 7vw, 64px)' : 'clamp(32px, 5vw, 54px)';
  return (
    <Tag
      style={{
        margin: 0,
        fontFamily: 'var(--rd-font-display)',
        fontSize,
        lineHeight: size === 'hero' ? 1.0 : 1.08,
        letterSpacing: '-0.033em',
        fontWeight: 700,
        color: onDark ? 'var(--rd-color-hero-text)' : 'var(--rd-color-heading)',
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost-dark';
type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  type?: 'button' | 'submit';
  style?: CSSProperties;
};

/** Buttons — Notion's set:
 *  - primary:    blue bg, white text (the marketing CTA).
 *  - secondary:  white bg, hairline border, dark text (light-section pairing).
 *  - dark:       charcoal bg, white text (used on light sections).
 *  - ghost-dark: translucent white on the charcoal hero (the hero's secondary). */
export function Button({ children, variant = 'primary', href, type = 'button', style }: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: u(1),
    fontSize: '15px',
    lineHeight: 1,
    fontFamily: 'var(--rd-font-body)',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    padding: '11px 18px',
    borderRadius: 'var(--rd-radius-md)',
    border: '1px solid transparent',
    transition: 'background 120ms ease, border-color 120ms ease, opacity 120ms ease',
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: 'var(--rd-color-accent)', color: '#ffffff' },
    secondary: {
      background: 'var(--rd-color-surface)',
      color: 'var(--rd-color-heading)',
      borderColor: 'var(--rd-color-border)',
    },
    dark: { background: 'var(--rd-color-hero-bg)', color: '#ffffff' },
    'ghost-dark': {
      background: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
      borderColor: 'rgba(255,255,255,0.22)',
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

/** White Notion card — tight radius, hairline border, soft layered shadow. The
 *  recurring surface chrome across d3's marketing sections. */
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

type TintName = 'gray' | 'blue' | 'yellow' | 'green' | 'red' | 'purple';

/** Notion status tag — a small rounded chip in one of the six status tints.
 *  The atom that makes the kanban/board read authentically Notion. */
export function Tag({
  children,
  tint = 'gray',
  icon,
  style,
}: {
  children: ReactNode;
  tint?: TintName;
  icon?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        paddingInline: 8,
        height: 22,
        borderRadius: 'var(--rd-radius-sm)',
        fontSize: '0.74rem',
        fontWeight: 500,
        lineHeight: 1,
        color: `var(--rd-tint-${tint}-fg)`,
        background: `var(--rd-tint-${tint}-bg)`,
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

export { u as space };
export type { TintName };
