// Product-surface renderers for d3 — Notion "workflow / surface-dense" (DR-003).
// Real Robin Dock data from the shared @/lib/designMock, composed as Notion-style
// workspace surfaces: a dense fax-operations kanban (the hero centerpiece), plus
// the smaller queue / patient-board / routing-rules surfaces the "bring it all
// together" section stacks at depth. d3-scoped styling; reads mock data only.
// Every mapping is fixed and deterministic (no Math.random / Date) so the static
// prerender draws identically.
import {
  Inbox,
  Files,
  Columns3,
  Route,
  Building2,
  Users,
  Hash,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
  Search,
  Plus,
  MoreHorizontal,
  UserRound,
  ArrowRight,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { designMock, type Fax, type FaxStatus } from '@/lib/designMock';
import { Tag, type TintName, space as u } from './primitives';

// +12125550144 → +1 (212) 555-0144. d3-local on purpose: each direction formats
// numbers its own way (d1/d2 keep their own copies).
export function formatPhone(e164: string): string {
  const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164);
  if (!m) return e164;
  return `+1 (${m[1]}) ${m[2]}-${m[3]}`;
}

export function formatTime(iso: string): string {
  const [, time] = iso.split('T');
  const [h, min] = time.slice(0, 5).split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${ampm}`;
}

// d3-local status treatment, mapped onto Notion's tag tints. NOT shared.
export const STATUS_META: Record<
  FaxStatus,
  { label: string; tint: TintName; Icon: typeof CheckCircle2 }
> = {
  delivered: { label: 'Delivered', tint: 'green', Icon: CheckCircle2 },
  received: { label: 'Received', tint: 'blue', Icon: ArrowDownLeft },
  sending: { label: 'Sending', tint: 'yellow', Icon: Clock },
  failed: { label: 'Failed', tint: 'red', Icon: XCircle },
};

export function StatusTag({ status }: { status: FaxStatus }) {
  const m = STATUS_META[status];
  const Icon = m.Icon;
  return (
    <Tag tint={m.tint} icon={<Icon size={12} strokeWidth={2.4} />}>
      {m.label}
    </Tag>
  );
}

// ── Deterministic kanban mapping ───────────────────────────────────────────
// All 12 faxes from the shared mock, mapped across 4 ops-lifecycle columns. Every
// column is populated and the two failed sends land in "New" (needs triage) — the
// "no silent failures" story, told with the data's own variety.
type ColumnTint = Extract<TintName, 'gray' | 'blue' | 'yellow' | 'green'>;
interface BoardColumn {
  key: string;
  label: string;
  tint: ColumnTint;
  faxIds: readonly string[];
}

const BOARD_COLUMNS: readonly BoardColumn[] = [
  { key: 'new', label: 'New', tint: 'gray', faxIds: ['fx-009', 'fx-011', 'fx-003', 'fx-008'] },
  { key: 'routing', label: 'Routing', tint: 'blue', faxIds: ['fx-005', 'fx-010'] },
  { key: 'review', label: 'In Review', tint: 'yellow', faxIds: ['fx-002', 'fx-004', 'fx-006'] },
  { key: 'handled', label: 'Handled', tint: 'green', faxIds: ['fx-001', 'fx-007', 'fx-012'] },
];

const faxById = (id: string): Fax => designMock.faxes.find((f) => f.id === id)!;

// Departments derived from the routing-rule destinations + a sensible default set,
// so the sidebar reads like a real workspace without inventing unrelated data.
const DEPARTMENTS = ['Cardiology', 'Lab Results', 'Records', 'Front Desk'] as const;

function SidebarItem({
  icon,
  label,
  active = false,
  badge,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: u(1),
        height: 28,
        paddingInline: u(1),
        borderRadius: 'var(--rd-radius-md)',
        fontSize: '0.82rem',
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--rd-color-heading)' : 'var(--rd-color-text-muted)',
        background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
      }}
    >
      <span style={{ display: 'inline-flex', flexShrink: 0, color: 'inherit' }}>{icon}</span>
      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </span>
      {badge ? (
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--rd-color-text-muted)' }}>
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function SidebarGroupLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        paddingInline: u(1),
        marginTop: u(2),
        marginBottom: 4,
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--rd-color-text-muted)',
      }}
    >
      {children}
    </div>
  );
}

/** One fax card on the kanban — Notion "page card" density: title (patient or
 *  number), status tag, then meta chips (id · pages · time) and a matched
 *  rule/patient chip where the data carries one. */
function FaxCard({ fax }: { fax: Fax }) {
  const outbound = fax.direction === 'outbound';
  const title = fax.patientRef ? fax.patientRef.name : formatPhone(outbound ? fax.toNumber : fax.fromNumber);
  const rule = fax.routingRuleId
    ? designMock.routingRules.find((r) => r.id === fax.routingRuleId)
    : undefined;
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-md)',
        boxShadow: '0 1px 2px rgba(15,15,15,0.06)',
        padding: u(1.5),
        display: 'grid',
        gap: 7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: u(1) }}>
        <span
          style={{
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--rd-color-heading)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
        <StatusTag status={fax.status} />
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--rd-color-text-muted)' }}>
        {fax.id.toUpperCase()} · {fax.pageCount} pp · {formatTime(fax.timestamp)}
      </div>
      {rule ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Tag tint="purple" icon={<Route size={11} strokeWidth={2.4} />}>
            {rule.name}
          </Tag>
        </div>
      ) : fax.patientRef ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Tag tint="gray" icon={<UserRound size={11} strokeWidth={2.4} />}>
            {fax.patientRef.mrn}
          </Tag>
        </div>
      ) : null}
    </div>
  );
}

/** The hero centerpiece — a dense Robin Dock fax-operations workspace. Two-pane
 *  Notion layout: a left workspace sidebar (nav + the 4 routing rules + a pages
 *  meter) and a right kanban board grouping all 12 faxes across New / Routing /
 *  In Review / Handled. Sits white on the charcoal hero, lifted on the large
 *  layered shadow. Reads only from the shared mock; mapping is fully deterministic. */
export function FaxOpsWorkspace() {
  const { pagesUsed, pagesCap } = designMock.stats;
  const pagesPct = Math.round((pagesUsed / pagesCap) * 100);

  return (
    <div
      className="d3-workspace"
      style={{
        background: 'var(--rd-color-hero-surface)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-lg)',
        overflow: 'hidden',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '232px 1fr',
        textAlign: 'left',
      }}
    >
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        className="d3-workspace-sidebar"
        style={{
          background: 'var(--rd-color-sidebar)',
          borderRight: '1px solid var(--rd-color-border)',
          padding: u(1.5),
          display: 'flex',
          flexDirection: 'column',
          minHeight: 520,
        }}
      >
        {/* Workspace switcher header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: u(1),
            padding: u(1),
            borderRadius: 'var(--rd-radius-md)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: 'var(--rd-radius-sm)',
              background: 'var(--rd-color-hero-bg)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            R
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
              Robin Dock
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--rd-color-text-muted)' }}>Front Desk</div>
          </div>
        </div>

        {/* Search affordance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 28,
            paddingInline: u(1),
            marginTop: u(1),
            borderRadius: 'var(--rd-radius-md)',
            color: 'var(--rd-color-text-muted)',
            fontSize: '0.8rem',
            background: 'rgba(0,0,0,0.03)',
          }}
        >
          <Search size={14} strokeWidth={2.2} />
          Search
        </div>

        {/* Primary nav */}
        <div style={{ marginTop: u(1.5), display: 'grid', gap: 1 }}>
          <SidebarItem icon={<Inbox size={15} strokeWidth={2.2} />} label="Inbox" badge="5" />
          <SidebarItem icon={<Files size={15} strokeWidth={2.2} />} label="All faxes" badge="12" />
          <SidebarItem icon={<Columns3 size={15} strokeWidth={2.2} />} label="Queues" active />
          <SidebarItem icon={<Route size={15} strokeWidth={2.2} />} label="Routing rules" />
          <SidebarItem icon={<Building2 size={15} strokeWidth={2.2} />} label="Departments" />
          <SidebarItem icon={<Users size={15} strokeWidth={2.2} />} label="Patients" />
        </div>

        {/* Routing rules group — the 4 real rules with on/off state */}
        <SidebarGroupLabel>Routing rules</SidebarGroupLabel>
        <div style={{ display: 'grid', gap: 1 }}>
          {designMock.routingRules.map((r) => (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: u(1),
                height: 26,
                paddingInline: u(1),
                borderRadius: 'var(--rd-radius-md)',
                fontSize: '0.78rem',
                color: 'var(--rd-color-text-muted)',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  flexShrink: 0,
                  background: r.enabled ? 'var(--rd-tint-green-fg)' : 'rgba(0,0,0,0.2)',
                }}
              />
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.name}
              </span>
            </div>
          ))}
        </div>

        {/* Departments group */}
        <SidebarGroupLabel>Departments</SidebarGroupLabel>
        <div style={{ display: 'grid', gap: 1 }}>
          {DEPARTMENTS.map((d) => (
            <SidebarItem key={d} icon={<Hash size={14} strokeWidth={2.2} />} label={d} />
          ))}
        </div>

        {/* Pages meter — pinned bottom */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: u(2),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--rd-color-text-muted)',
              marginBottom: 6,
            }}
          >
            <span>Pages used</span>
            <span>
              {pagesUsed.toLocaleString()} / {pagesCap.toLocaleString()}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ width: `${pagesPct}%`, height: '100%', background: 'var(--rd-color-accent)' }} />
          </div>
        </div>
      </aside>

      {/* ── Board ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Board toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: u(2),
            padding: `${u(1.5)} ${u(2)}`,
            borderBottom: '1px solid var(--rd-color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: u(1.5), minWidth: 0 }}>
            <span style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
              Fax operations
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--rd-tint-green-fg)',
              }}
            >
              <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--rd-tint-green-fg)' }} />
              Live
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: u(1) }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 28,
                paddingInline: 10,
                borderRadius: 'var(--rd-radius-md)',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: 'var(--rd-color-text-muted)',
                border: '1px solid var(--rd-color-border)',
              }}
            >
              <Columns3 size={13} strokeWidth={2.2} />
              Board
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 28,
                paddingInline: 10,
                borderRadius: 'var(--rd-radius-md)',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: '#fff',
                background: 'var(--rd-color-accent)',
              }}
            >
              <Plus size={13} strokeWidth={2.6} />
              New
            </span>
          </div>
        </div>

        {/* Kanban columns */}
        <div
          className="d3-board-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_COLUMNS.length}, minmax(218px, 1fr))`,
            gap: u(1.5),
            padding: u(2),
            background: 'var(--rd-color-canvas)',
            overflowX: 'auto',
            flex: 1,
          }}
        >
          {BOARD_COLUMNS.map((col) => {
            const faxes = col.faxIds.map(faxById);
            return (
              <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: u(1.5), minWidth: 218 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <Tag tint={col.tint}>{col.label}</Tag>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--rd-color-text-muted)' }}>
                      {faxes.length}
                    </span>
                  </span>
                  <MoreHorizontal size={15} strokeWidth={2.2} color="var(--rd-color-text-muted)" />
                </div>
                <div style={{ display: 'grid', gap: u(1.5) }}>
                  {faxes.map((fax) => (
                    <FaxCard key={fax.id} fax={fax} />
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      height: 30,
                      paddingInline: u(1),
                      borderRadius: 'var(--rd-radius-md)',
                      fontSize: '0.76rem',
                      fontWeight: 500,
                      color: 'var(--rd-color-text-muted)',
                    }}
                  >
                    <Plus size={13} strokeWidth={2.4} />
                    New
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .d3-workspace { grid-template-columns: 1fr !important; }
          .d3-workspace-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Smaller surfaces for the stacked "bring it all together" section ─────────

/** A compact fax-queue list surface — the inbound/outbound stream as rows. */
export function FaxQueueSurface() {
  const rows = designMock.faxes.slice(0, 5);
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-md)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1),
          padding: `${u(1.4)} ${u(2)}`,
          borderBottom: '1px solid var(--rd-color-border)',
        }}
      >
        <Inbox size={15} strokeWidth={2.2} color="var(--rd-color-text-muted)" />
        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>Fax queue</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--rd-color-text-muted)' }}>
          {designMock.faxes.length} total
        </span>
      </div>
      {rows.map((fax, i) => {
        const outbound = fax.direction === 'outbound';
        const label = fax.patientRef ? fax.patientRef.name : formatPhone(outbound ? fax.toNumber : fax.fromNumber);
        return (
          <div
            key={fax.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: u(1.5),
              padding: `${u(1.2)} ${u(2)}`,
              borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--rd-color-heading)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--rd-color-text-muted)' }}>
                {fax.id.toUpperCase()} · {fax.pageCount} pp · {formatTime(fax.timestamp)}
              </div>
            </div>
            <StatusTag status={fax.status} />
          </div>
        );
      })}
    </div>
  );
}

/** A patient-record tracking board surface — patients with status + linked count. */
export function PatientBoardSurface() {
  const patientTint: Record<string, TintName> = {
    active: 'green',
    'pending-review': 'yellow',
    archived: 'gray',
  };
  const patientLabel: Record<string, string> = {
    active: 'Active',
    'pending-review': 'Pending review',
    archived: 'Archived',
  };
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-md)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1),
          padding: `${u(1.4)} ${u(2)}`,
          borderBottom: '1px solid var(--rd-color-border)',
        }}
      >
        <Users size={15} strokeWidth={2.2} color="var(--rd-color-text-muted)" />
        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
          Patient records
        </span>
      </div>
      {designMock.patients.map((p, i) => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: u(1.5),
            padding: `${u(1.2)} ${u(2)}`,
            borderBottom: i === designMock.patients.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: u(1.2), minWidth: 0 }}>
            <span
              aria-hidden
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                flexShrink: 0,
                background: 'var(--rd-color-accent-soft)',
                color: 'var(--rd-color-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserRound size={14} strokeWidth={2.2} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--rd-color-text-muted)' }}>
                {p.mrn} · {p.linkedFaxIds.length} linked
              </div>
            </div>
          </div>
          <Tag tint={patientTint[p.status]}>{patientLabel[p.status]}</Tag>
        </div>
      ))}
    </div>
  );
}

/** An auto-routing rules panel surface — rules as match → destination rows. */
export function RoutingRulesSurface() {
  const destTint: Record<string, TintName> = {
    department: 'blue',
    inbox: 'purple',
    patient: 'green',
  };
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-md)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1),
          padding: `${u(1.4)} ${u(2)}`,
          borderBottom: '1px solid var(--rd-color-border)',
        }}
      >
        <Route size={15} strokeWidth={2.2} color="var(--rd-color-text-muted)" />
        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>
          Auto-routing rules
        </span>
      </div>
      {designMock.routingRules.map((r, i) => (
        <div
          key={r.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: u(1.2),
            padding: `${u(1.3)} ${u(2)}`,
            borderBottom: i === designMock.routingRules.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              flexShrink: 0,
              background: r.enabled ? 'var(--rd-tint-green-fg)' : 'rgba(0,0,0,0.2)',
            }}
          />
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--rd-color-heading)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              flex: '0 1 auto',
            }}
          >
            {r.name}
          </span>
          <ArrowRight size={13} strokeWidth={2.2} color="var(--rd-color-text-muted)" style={{ flexShrink: 0 }} />
          <Tag tint={destTint[r.destination.kind]} style={{ marginLeft: 'auto', flexShrink: 0 }}>
            {r.destination.value}
          </Tag>
        </div>
      ))}
    </div>
  );
}

/** Compact single-fax routing trace, used by the workflow explainer. */
export function RoutingTraceSurface() {
  const fax = designMock.faxes.find((f) => f.direction === 'inbound' && f.patientRef && f.routingRuleId)!;
  const patient = fax.patientRef!;
  const rule = designMock.routingRules.find((r) => r.id === fax.routingRuleId)!;
  const steps = [
    { label: 'Inbound fax received', detail: `${formatPhone(fax.fromNumber)} · ${fax.pageCount} pages`, Icon: ArrowDownLeft, tint: 'blue' as TintName },
    { label: `Matched "${rule.name}"`, detail: `on ${rule.match.kind.replace('-', ' ')}`, Icon: Route, tint: 'purple' as TintName },
    { label: `Linked to ${patient.name}`, detail: `${patient.mrn} · ${rule.destination.value}`, Icon: UserRound, tint: 'green' as TintName },
  ];
  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        border: '1px solid var(--rd-color-border)',
        borderRadius: 'var(--rd-radius-lg)',
        boxShadow: 'var(--rd-shadow-md)',
        padding: u(2.5),
        width: '100%',
        display: 'grid',
        gap: u(1.5),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusTag status={fax.status} />
        <span style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>{formatTime(fax.timestamp)}</span>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.4) }}>
        {steps.map((s, i) => {
          const Icon = s.Icon;
          const last = i === steps.length - 1;
          return (
            <li key={s.label} style={{ display: 'flex', gap: u(1.4), alignItems: 'flex-start' }}>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <span
                  aria-hidden
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: `var(--rd-tint-${s.tint}-bg)`,
                    color: `var(--rd-tint-${s.tint}-fg)`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={15} strokeWidth={2.4} />
                </span>
                {!last && <span aria-hidden style={{ width: 2, flex: 1, minHeight: 14, background: 'var(--rd-color-border)', marginBlock: 3 }} />}
              </span>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--rd-color-heading)' }}>{s.label}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--rd-color-text-muted)' }}>{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
