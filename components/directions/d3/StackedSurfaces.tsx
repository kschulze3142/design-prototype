// d3 StackedSurfaces — the "bring it all together" section. Three real Robin Dock
// workspace surfaces (fax queue + patient records + auto-routing rules) overlapped
// at depth on the gray canvas — Notion's "this organizes your chaos" visual. The
// section carries deep top padding to clear the hero workspace that overlaps the
// seam above it. Surface data is entirely from the shared @/lib/designMock.
import { Container, Display, Eyebrow, space as u } from './primitives';
import { FaxQueueSurface, PatientBoardSurface, RoutingRulesSurface } from './surfaces';

export function StackedSurfaces() {
  return (
    <section
      style={{
        background: 'var(--rd-color-canvas)',
        // Top pad clears the hero workspace surface overlapping the seam.
        paddingTop: u(18),
        paddingBottom: u(8),
      }}
    >
      <Container>
        <div style={{ maxWidth: 660, marginBottom: u(5) }}>
          <Eyebrow>One workspace</Eyebrow>
          <Display as="h2" size="section" style={{ marginTop: u(1.5) }}>
            Bring your entire fax operation together.
          </Display>
          <p style={{ margin: `${u(2)} 0 0`, fontSize: '1.1rem', lineHeight: 1.55, color: 'var(--rd-color-text-muted)' }}>
            Queues, patient records, and routing rules stop living in separate inboxes and binders.
            Robin Dock connects them into one surface — so the whole team sees the same source of truth.
          </p>
        </div>

        {/* Overlapping stack — three surfaces at depth. */}
        <div
          className="d3-stack"
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.95fr',
            gridTemplateRows: 'auto auto',
            gap: u(3),
            alignItems: 'start',
          }}
        >
          {/* Primary: fax queue, spanning the left column across both rows. */}
          <div
            className="d3-stack-primary"
            style={{ gridColumn: '1', gridRow: '1 / span 2', position: 'relative', zIndex: 2 }}
          >
            <FaxQueueSurface />
          </div>

          {/* Secondary: routing rules, top-right, nudged up and overlapping. */}
          <div
            className="d3-stack-secondary"
            style={{ gridColumn: '2', gridRow: '1', position: 'relative', zIndex: 3, marginTop: `calc(-1 * ${u(3)})` }}
          >
            <RoutingRulesSurface />
          </div>

          {/* Tertiary: patient board, bottom-right, overlapping inward. */}
          <div
            className="d3-stack-tertiary"
            style={{ gridColumn: '2', gridRow: '2', position: 'relative', zIndex: 1, marginLeft: `calc(-1 * ${u(5)})` }}
          >
            <PatientBoardSurface />
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 820px) {
          .d3-stack { grid-template-columns: 1fr !important; grid-template-rows: none !important; }
          .d3-stack-primary { grid-column: 1 !important; grid-row: auto !important; }
          .d3-stack-secondary { grid-column: 1 !important; grid-row: auto !important; margin-top: 0 !important; }
          .d3-stack-tertiary { grid-column: 1 !important; grid-row: auto !important; margin-left: 0 !important; }
        }
      `}</style>
    </section>
  );
}
