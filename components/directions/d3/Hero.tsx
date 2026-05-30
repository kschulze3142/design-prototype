// d3 Hero — Notion's signature DARK charcoal hero (DR-003). Centered white
// 64px/700 Inter headline with Robin Dock's workflow content, a workflow subline,
// two CTAs (blue primary + translucent secondary), then the dense FaxOpsWorkspace
// surface below — Robin Dock's equivalent of Notion's "Ramp HQ" board shot. The
// surface is pulled DOWN so it bleeds past the hero's bottom edge into the next
// (light) section, the classic Notion dark→light seam. Hero copy is Robin Dock;
// the workspace is driven entirely by the shared @/lib/designMock.
import { Button, Container, space as u } from './primitives';
import { FaxOpsWorkspace } from './surfaces';

export function Hero() {
  return (
    <section
      style={{
        background: 'var(--rd-color-hero-bg)',
        color: 'var(--rd-color-hero-text)',
        paddingTop: u(7),
        // Deep bottom pad: the workspace surface is lifted up out of this and
        // overlaps the seam into the section below (negative margin on the wrap).
        paddingBottom: u(16),
      }}
    >
      <Container width={920} style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            paddingInline: 12,
            height: 28,
            borderRadius: 'var(--rd-radius-round)',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.16)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: u(3),
          }}
        >
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--rd-color-accent)' }} />
          One workspace for your whole fax operation
        </span>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'clamp(40px, 7vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.033em',
            color: 'var(--rd-color-hero-text)',
          }}
        >
          Where every fax gets handled.
        </h1>

        <p
          style={{
            margin: `${u(3)} auto 0`,
            maxWidth: 620,
            fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)',
            lineHeight: 1.5,
            color: 'var(--rd-color-hero-muted)',
          }}
        >
          Every inbound fax routed, every patient linked, every send confirmed — tracked from arrival to
          handled in one shared workspace. No more lost referrals, no more paper on the front desk.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: u(1.5),
            justifyContent: 'center',
            marginTop: u(4),
          }}
        >
          <Button variant="primary" href="#" style={{ padding: '13px 22px', fontSize: '1rem' }}>
            Get Robin Dock free
          </Button>
          <Button variant="ghost-dark" href="#" style={{ padding: '13px 22px', fontSize: '1rem' }}>
            Request a demo
          </Button>
        </div>
        <p style={{ margin: `${u(2)} 0 0`, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
          Free 14-day trial · No credit card · HIPAA-ready
        </p>
      </Container>

      {/* Workspace centerpiece — lifted to overlap the dark→light seam. */}
      <Container width={1120} style={{ marginTop: u(7), marginBottom: `calc(-1 * ${u(13)})` }}>
        <FaxOpsWorkspace />
      </Container>
    </section>
  );
}
