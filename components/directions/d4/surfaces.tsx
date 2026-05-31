// Product-surface renderers for d4 — "Robin Dock, diverged" (DR-004d-p). Robin
// Dock is repositioned as the vertical DOCUMENT INBOX for veterinary clinics, so
// these surfaces render a realistic document-inbox UI driven by the d4-local vet
// overlay in ./documents (which itself reads the shared @/lib/designMock, kept
// untouched). The hero centerpiece is a dense three-pane inbox.
//
// Two-color discipline: a product UI's chrome is functional, so it routes to the
// WORKHORSE — Forest Teal (the app's primary): active nav, selection bars, count
// badges, the Open-Document button, the filing-timeline dots. Orange is reserved
// for the marketing chrome (the headline underline, one stat figure), never the
// product. Semantic status hues (green) read fine on the white surfaces.
import {
  CheckCircle2,
  Inbox,
  Files,
  Star,
  ClipboardCheck,
  Send,
  Archive,
  Folder,
  Search,
  ChevronRight,
  FileText,
  Circle,
  PawPrint,
} from 'lucide-react';
import { space as u } from './primitives';
import {
  vetDocuments,
  inboxFolders,
  needsReviewCount,
  starredCount,
  type VetDocument,
} from './documents';

/** +12125550144 → +1 (212) 555-0144. d4-local; not shared. */
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

/** Two-letter initials for a small chip. */
function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Small teal-tint initials chip — product chrome, so it rides the workhorse. */
function Chip({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 999,
        flexShrink: 0,
        background: 'var(--rd-color-primary-soft)',
        color: 'var(--rd-color-primary)',
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: '0.01em',
      }}
    >
      {initials(name)}
    </span>
  );
}

/** A small muted folder tag. */
function FolderTag({ name }: { name: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0,
        paddingInline: 8,
        height: 22,
        borderRadius: 'var(--rd-radius-round)',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: 'var(--rd-color-text-muted)',
        background: 'var(--rd-color-bg)',
        border: '1px solid var(--rd-color-border)',
      }}
    >
      <Folder size={11} strokeWidth={2.2} />
      {name}
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// HERO CENTERPIECE — the three-pane document inbox
// ───────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'inbox', label: 'Inbox', Icon: Inbox, count: vetDocuments.length, active: true },
  { id: 'all', label: 'All Documents', Icon: Files },
  { id: 'starred', label: 'Starred', Icon: Star, count: starredCount },
  { id: 'review', label: 'Needs Review', Icon: ClipboardCheck, badge: needsReviewCount },
  { id: 'sent', label: 'Sent', Icon: Send },
  { id: 'archive', label: 'Archives', Icon: Archive },
] as const;

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '92px 1fr',
        gap: u(1.2),
        alignItems: 'start',
        paddingBlock: u(1),
        borderBottom: '1px solid var(--rd-color-border)',
      }}
    >
      <span style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)', fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ fontSize: '0.8rem', color: 'var(--rd-color-text)', fontWeight: 600 }}>
        {children}
      </span>
    </div>
  );
}

/** The hero centerpiece: a realistic three-pane document inbox — folders sidebar,
 *  document list, and a detail panel with tabs + metadata. Built full-width to
 *  read as a real app shot. Static (no hooks) so it prerenders cleanly. */
export function InboxHeroSurface() {
  const docs = vetDocuments;
  const selected = docs[0]; // CBC Results — Bella

  return (
    <div
      style={{
        background: 'var(--rd-color-surface)',
        borderRadius: 'var(--rd-radius-lg)',
        border: '1px solid var(--rd-color-border)',
        boxShadow: 'var(--rd-shadow-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* App chrome bar — teal robin mark + title, search, avatar. */}
      <div
        className="d4-inbox-chrome"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(2),
          padding: `${u(1.4)} ${u(2)}`,
          borderBottom: '1px solid var(--rd-color-border)',
          background: 'var(--rd-color-bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: u(1.2), flexShrink: 0 }}>
          <span
            aria-hidden
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'var(--rd-color-primary)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={14} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontWeight: 500,
              fontSize: '0.98rem',
              color: 'var(--rd-color-heading)',
            }}
          >
            Document Inbox
          </span>
        </div>

        <div
          className="d4-inbox-search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: u(1),
            flex: 1,
            maxWidth: 320,
            marginLeft: 'auto',
            paddingInline: u(1.4),
            height: 32,
            borderRadius: 'var(--rd-radius-round)',
            border: '1px solid var(--rd-color-border)',
            background: 'var(--rd-color-surface)',
            color: 'var(--rd-color-text-muted)',
            fontSize: '0.78rem',
          }}
        >
          <Search size={14} strokeWidth={2.2} />
          Search patients, documents…
        </div>
        <Chip name="Front Desk" size={28} />
      </div>

      {/* Three panes */}
      <div
        className="d4-inbox-panes"
        style={{
          display: 'grid',
          gridTemplateColumns: '208px minmax(0, 1fr) 296px',
          minHeight: 432,
        }}
      >
        {/* (a) Left — folders sidebar */}
        <aside
          className="d4-inbox-side"
          style={{
            borderRight: '1px solid var(--rd-color-border)',
            padding: u(1.4),
            background: 'var(--rd-color-bg)',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.Icon;
              const active = 'active' in item && item.active;
              return (
                <li key={item.id}>
                  <span
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: u(1.2),
                      padding: `${u(0.9)} ${u(1.2)}`,
                      borderRadius: 'var(--rd-radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--rd-color-primary)' : 'var(--rd-color-text)',
                      background: active ? 'var(--rd-color-primary-soft)' : 'transparent',
                    }}
                  >
                    {active && (
                      <span
                        aria-hidden
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 6,
                          bottom: 6,
                          width: 3,
                          borderRadius: 999,
                          background: 'var(--rd-color-primary)',
                        }}
                      />
                    )}
                    <Icon size={15} strokeWidth={2.2} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {'badge' in item && item.badge ? (
                      <span
                        style={{
                          minWidth: 18,
                          height: 18,
                          paddingInline: 5,
                          borderRadius: 999,
                          background: 'var(--rd-color-primary)',
                          color: '#fff',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : 'count' in item && item.count ? (
                      <span style={{ fontSize: '0.72rem', color: 'var(--rd-color-text-muted)', fontWeight: 600 }}>
                        {item.count}
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>

          <div
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--rd-color-text-muted)',
              margin: `${u(2)} 0 ${u(1)} ${u(1.2)}`,
            }}
          >
            Folders
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {inboxFolders.map((f) => (
              <li key={f.name}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: u(1.2),
                    padding: `${u(0.9)} ${u(1.2)}`,
                    borderRadius: 'var(--rd-radius-sm)',
                    fontSize: '0.82rem',
                    color: 'var(--rd-color-text)',
                  }}
                >
                  <Folder size={15} strokeWidth={2.2} color="var(--rd-color-primary)" />
                  <span style={{ flex: 1 }}>{f.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--rd-color-text-muted)', fontWeight: 600 }}>
                    {f.count}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* (b) Center — document list */}
        <div className="d4-inbox-list" style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${u(1.4)} ${u(2)}`,
              borderBottom: '1px solid var(--rd-color-border)',
            }}
          >
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--rd-color-heading)' }}>
              Inbox
              <span style={{ color: 'var(--rd-color-text-muted)', fontWeight: 600 }}>
                {' '}· {docs.length}
              </span>
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)', fontWeight: 600 }}>
              Newest first
            </span>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, overflow: 'hidden' }}>
            {docs.map((doc, i) => {
              const isSel = doc.id === selected.id;
              return (
                <li
                  key={doc.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: u(1.4),
                    padding: `${u(1.4)} ${u(2)}`,
                    borderBottom: i === docs.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
                    background: isSel ? 'var(--rd-color-primary-soft)' : 'transparent',
                  }}
                >
                  {isSel && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: 'var(--rd-color-primary)',
                      }}
                    />
                  )}
                  <span aria-hidden style={{ flexShrink: 0 }}>
                    {doc.unread ? (
                      <Circle size={9} fill="var(--rd-color-primary)" strokeWidth={0} />
                    ) : (
                      <Circle size={9} color="var(--rd-color-border)" strokeWidth={2} />
                    )}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: doc.unread ? 700 : 600,
                        color: 'var(--rd-color-heading)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--rd-color-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.source} · {doc.time} · {doc.pageCount} pp
                    </div>
                  </div>
                  <FolderTag name={doc.folder} />
                </li>
              );
            })}
          </ul>
        </div>

        {/* (c) Right — detail panel */}
        <aside
          className="d4-inbox-detail"
          style={{
            borderLeft: '1px solid var(--rd-color-border)',
            padding: u(2),
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--rd-color-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: u(1) }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                paddingInline: 9,
                height: 22,
                borderRadius: 'var(--rd-radius-round)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--rd-color-primary)',
                background: 'var(--rd-color-primary-soft)',
              }}
            >
              <FileText size={12} strokeWidth={2.4} />
              {selected.type}
            </span>
            <Star size={15} strokeWidth={2.2} color="var(--rd-color-text-muted)" />
          </div>

          <h4
            style={{
              fontFamily: 'var(--rd-font-display)',
              fontWeight: 500,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'var(--rd-color-heading)',
              margin: `${u(1.4)} 0 ${u(1.6)}`,
            }}
          >
            {selected.name}
          </h4>

          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Document detail"
            style={{ display: 'flex', gap: u(2), borderBottom: '1px solid var(--rd-color-border)' }}
          >
            {['Details', 'Activity'].map((tab, i) => (
              <span
                key={tab}
                role="tab"
                aria-selected={i === 0}
                style={{
                  paddingBottom: u(1),
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: i === 0 ? 'var(--rd-color-primary)' : 'var(--rd-color-text-muted)',
                  boxShadow: i === 0 ? 'inset 0 -2px 0 var(--rd-color-primary)' : 'none',
                }}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Metadata */}
          <div style={{ marginTop: u(1.2) }}>
            <MetaRow label="Type">{selected.type}</MetaRow>
            <MetaRow label="Patient">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <PawPrint size={12} strokeWidth={2.2} color="var(--rd-color-primary)" />
                {selected.owner}
              </span>
            </MetaRow>
            <MetaRow label="Date of Service">{selected.dateOfService}</MetaRow>
            <MetaRow label="Folder">{selected.folder}</MetaRow>
            <MetaRow label="Source">{selected.source}</MetaRow>
            <MetaRow label="Tags">
              <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 5 }}>
                {selected.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      paddingInline: 7,
                      height: 19,
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 999,
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: 'var(--rd-color-text-muted)',
                      background: 'var(--rd-color-bg)',
                      border: '1px solid var(--rd-color-border)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </span>
            </MetaRow>
          </div>

          <button
            type="button"
            style={{
              marginTop: u(2),
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: u(1),
              width: '100%',
              height: 38,
              borderRadius: 'var(--rd-radius-pill)',
              border: '1px solid var(--rd-color-btn)',
              background: 'var(--rd-color-btn)',
              color: '#fff',
              fontFamily: 'var(--rd-font-body)',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <FileText size={15} strokeWidth={2.2} />
            Open Document
          </button>
        </aside>
      </div>

      {/* Mobile: stack the three panes into one scrollable column. */}
      <style>{`
        @media (max-width: 900px) {
          .d4-inbox-panes { grid-template-columns: 1fr !important; }
          .d4-inbox-side { border-right: none !important; border-bottom: 1px solid var(--rd-color-border) !important; }
          .d4-inbox-detail { border-left: none !important; border-top: 1px solid var(--rd-color-border) !important; }
        }
        @media (max-width: 560px) {
          .d4-inbox-search { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Secondary surfaces (workflow tabs + feature splits)
// ───────────────────────────────────────────────────────────────────────────

/** A compact document list — the inbox shown plainly inside a card. */
export function DocumentListSurface({ limit = 4 }: { limit?: number }) {
  const rows = vetDocuments.slice(0, limit);
  return (
    <div aria-label="Recent documents" style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${u(1.6)} ${u(2)}`,
          borderBottom: '1px solid var(--rd-color-border)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--rd-color-text-muted)',
        }}
      >
        <span>Captured today</span>
        <span>{vetDocuments.length} documents</span>
      </div>
      {rows.map((doc, i) => (
        <div
          key={doc.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: u(1.4),
            padding: `${u(1.5)} ${u(2)}`,
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rd-color-border)',
          }}
        >
          <Chip name={doc.patient} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--rd-color-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {doc.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
              {doc.source} · {doc.time}
            </div>
          </div>
          <FolderTag name={doc.folder} />
        </div>
      ))}
    </div>
  );
}

/** Search surface — a query matched to a patient's documents across folders. */
export function SearchSurface() {
  const hits = vetDocuments.filter((d) => ['Bella', 'Max', 'Luna'].includes(d.patient)).slice(0, 3);
  return (
    <div style={{ padding: u(2.4), display: 'grid', gap: u(1.6) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1),
          paddingInline: u(1.6),
          height: 40,
          borderRadius: 'var(--rd-radius-round)',
          border: '1px solid var(--rd-color-primary)',
          color: 'var(--rd-color-text)',
          fontSize: '0.9rem',
        }}
      >
        <Search size={16} strokeWidth={2.2} color="var(--rd-color-primary)" />
        Bella
        <span style={{ marginLeft: 'auto', fontSize: '0.74rem', color: 'var(--rd-color-text-muted)', fontWeight: 600 }}>
          {hits.length} results
        </span>
      </div>
      <div style={{ display: 'grid', gap: u(1) }}>
        {hits.map((doc) => (
          <div
            key={doc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: u(1.2),
              padding: u(1.4),
              borderRadius: 'var(--rd-radius-md)',
              border: '1px solid var(--rd-color-border)',
              background: 'var(--rd-color-surface)',
            }}
          >
            <FileText size={16} strokeWidth={2} color="var(--rd-color-primary)" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--rd-color-text)' }}>
                {doc.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>
                {doc.folder} · {doc.dateOfService}
              </div>
            </div>
            <ChevronRight size={16} strokeWidth={2} color="var(--rd-color-text-muted)" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Filing timeline — a document captured, categorized, and filed automatically.
 *  In-progress dots ride the teal workhorse; the final filed dot is semantic
 *  green (the reassurance moment). */
export function FilingTimelineSurface() {
  const doc = vetDocuments[0]; // CBC Results — Bella
  const steps = [
    { label: 'Captured from Antech Diagnostics', time: doc.time },
    { label: `Categorized as ${doc.type}`, time: doc.time },
    { label: `Filed to ${doc.folder} · ${doc.patient}`, time: doc.time },
  ];
  return (
    <div style={{ padding: u(3) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(1.2), marginBottom: u(2.4) }}>
        <CheckCircle2 size={20} strokeWidth={2.2} color="#2f7d5b" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--rd-color-heading)' }}>
            Filed automatically
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
            {doc.name} · {doc.pageCount} pages
          </div>
        </div>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: u(1.6) }}>
        {steps.map((s, i) => (
          <li key={s.label} style={{ display: 'flex', gap: u(1.4), alignItems: 'flex-start' }}>
            <span
              aria-hidden
              style={{
                marginTop: 4,
                width: 9,
                height: 9,
                borderRadius: 999,
                flexShrink: 0,
                background: i === steps.length - 1 ? '#2f7d5b' : 'var(--rd-color-primary)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, gap: u(2) }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--rd-color-text)' }}>{s.label}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>{s.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Patient-linking surface — an inbound document matched to a pet's record. The
 *  match callout rides the teal workhorse (product chrome). */
export function PatientLinkSurface() {
  const doc = vetDocuments.find((d) => d.folder === 'Referrals') ?? vetDocuments[1];
  return (
    <div style={{ padding: u(3), display: 'grid', gap: u(2) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FolderTag name={doc.folder} />
        <span style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
          {doc.pageCount} pages · {doc.time}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: u(1.4),
          padding: u(1.8),
          borderRadius: 'var(--rd-radius-md)',
          background: 'var(--rd-color-primary-soft)',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'var(--rd-color-surface)',
            color: 'var(--rd-color-primary)',
          }}
        >
          <PawPrint size={18} strokeWidth={2.2} />
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--rd-color-heading)' }}>
            Filed to {doc.owner}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
            {doc.name} · routed automatically
          </div>
        </div>
      </div>
    </div>
  );
}

export type { VetDocument };
