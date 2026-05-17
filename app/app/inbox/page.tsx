'use client';
import React, { useState } from 'react';
import { I } from '@/components/app/icons';
import { Avatar } from '@/components/app/primitives';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tag = 'PHI' | 'LABS' | 'REFERRAL' | 'BILLING' | 'EOB' | 'TRANSFER' | 'ROI' | 'PATHOLOGY' | 'IMAGING' | 'AUTH';

interface FaxItem {
  id: string;
  from: string;
  avatarTone: string;
  number: string;
  subject: string;
  preview: string;
  time: string;
  pages: number;
  routedTo: string | null;
  tags: Tag[];
  unread: boolean;
  starred: boolean;
  phi: boolean;
  awaitingRouting?: boolean;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const FAXES: FaxItem[] = [
  {
    id: 'FX-IN-3382', from: 'Pacific Lab Diagnostics', avatarTone: 'teal',
    number: '+1 (206) 555-2840',
    subject: 'Lab results · Patient A24189',
    preview: 'Comprehensive metabolic panel and lipid profile, ordered Mar 22. Results within reference range except for HDL…',
    time: '11:14 AM', pages: 4, routedTo: 'Dr. M. Greaves',
    tags: ['PHI', 'LABS'], unread: true, starred: true, phi: true,
  },
  {
    id: 'FX-IN-3381', from: 'Group Health · Referrals', avatarTone: 'teal',
    number: '+1 (425) 555-7710',
    subject: 'Referral acknowledgement — Cardiology',
    preview: 'Confirming receipt of the referral for Patient A23104 dated Mar 21. Appointment scheduled for Apr 4 at 10:30 AM…',
    time: '10:47 AM', pages: 2, routedTo: 'Dr. M. Greaves',
    tags: ['REFERRAL'], unread: true, starred: false, phi: true,
  },
  {
    id: 'FX-IN-3380', from: 'Aetna Claims', avatarTone: 'amber',
    number: '+1 (800) 555-2840',
    subject: 'EOB · claim 882-31',
    preview: 'Explanation of benefits attached. Patient responsibility: $42.18. See itemized breakdown on page 4…',
    time: '9:32 AM', pages: 6, routedTo: 'Billing team',
    tags: ['BILLING', 'EOB'], unread: true, starred: false, phi: false, awaitingRouting: true,
  },
  {
    id: 'FX-IN-3379', from: "Dr. Rivera's Office", avatarTone: 'slate',
    number: '+1 (206) 555-8821',
    subject: 'Patient transfer summary',
    preview: 'Transfer summary including medication list, recent imaging, and discharge instructions for continuity of care…',
    time: '8:14 AM', pages: 9, routedTo: 'Dr. M. Greaves',
    tags: ['PHI', 'TRANSFER'], unread: true, starred: false, phi: true,
  },
  {
    id: 'FX-IN-3376', from: 'Swedish Medical · ROI', avatarTone: 'violet',
    number: '+1 (206) 555-7711',
    subject: 'Records request response',
    preview: 'Attached medical records for the period requested (Jan 1, 2024 – Dec 31, 2024). 84 pages total…',
    time: 'Yesterday', pages: 84, routedTo: 'Records',
    tags: ['PHI', 'ROI'], unread: false, starred: true, phi: true,
  },
  {
    id: 'FX-IN-3375', from: 'Quest Diagnostics', avatarTone: 'violet',
    number: '+1 (800) 555-0319',
    subject: 'Pathology · A23104',
    preview: 'Surgical pathology report. Diagnosis: see page 2. Microscopic description on pages 3–5…',
    time: 'Yesterday', pages: 5, routedTo: 'Dr. M. Greaves',
    tags: ['PHI', 'PATHOLOGY'], unread: false, starred: false, phi: true,
  },
  {
    id: 'FX-IN-3372', from: 'BlueShield Prior Auth', avatarTone: 'teal',
    number: '+1 (888) 555-0903',
    subject: 'Auth approved — #A24189',
    preview: 'Prior authorization for echocardiogram is approved. Auth #BS-77-22841. Valid 90 days from approval date…',
    time: 'Mon', pages: 1, routedTo: 'Dr. M. Greaves',
    tags: ['AUTH'], unread: false, starred: false, phi: true,
  },
  {
    id: 'FX-IN-3370', from: 'Northwest Imaging', avatarTone: 'teal',
    number: '+1 (206) 555-0142',
    subject: 'Echo report — A24189',
    preview: 'Transthoracic echocardiogram, performed Mar 18. LVEF 55%. Mild mitral regurgitation. Otherwise unremarkable…',
    time: 'Mon', pages: 3, routedTo: 'Dr. M. Greaves',
    tags: ['PHI', 'IMAGING'], unread: false, starred: false, phi: true,
  },
];

// ─── TAG BADGE ────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<Tag, { bg: string; color: string }> = {
  PHI:       { bg: 'var(--color-phi-bg)',         color: 'var(--color-phi)' },
  LABS:      { bg: 'var(--color-processing-bg)',  color: 'var(--color-processing)' },
  REFERRAL:  { bg: 'var(--color-delivered-bg)',   color: 'var(--color-delivered)' },
  BILLING:   { bg: 'var(--color-review-bg)',      color: 'var(--color-review)' },
  EOB:       { bg: 'var(--color-review-bg)',      color: 'var(--color-review)' },
  TRANSFER:  { bg: 'var(--color-archived-bg)',    color: 'var(--color-archived)' },
  ROI:       { bg: 'var(--color-archived-bg)',    color: 'var(--color-archived)' },
  PATHOLOGY: { bg: 'var(--color-phi-bg)',         color: 'var(--color-phi)' },
  IMAGING:   { bg: 'var(--color-processing-bg)',  color: 'var(--color-processing)' },
  AUTH:      { bg: 'var(--color-primary-subtle)', color: 'var(--color-primary)' },
};

const TAG_LABELS: Record<Tag, string> = {
  PHI: 'PHI', LABS: 'Labs', REFERRAL: 'Referral', BILLING: 'Billing', EOB: 'EOB',
  TRANSFER: 'Transfer', ROI: 'ROI', PATHOLOGY: 'Pathology', IMAGING: 'Imaging', AUTH: 'Auth',
};

function TagBadge({ tag }: { tag: Tag }) {
  const { bg, color } = TAG_COLORS[tag];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 20, padding: '0 7px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase' as const,
      whiteSpace: 'nowrap' as const, background: bg, color,
    }}>
      {TAG_LABELS[tag]}
    </span>
  );
}

// ─── FAX LIST ITEM ────────────────────────────────────────────────────────────

function FaxListItem({ item, selected, onClick }: { item: FaxItem; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  const bg = selected
    ? 'var(--color-primary-subtle)'
    : hovered
    ? 'var(--color-bg)'
    : 'var(--color-surface)';

  const leftBorder = (selected || item.unread)
    ? '2px solid var(--color-primary)'
    : '2px solid transparent';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: leftBorder,
        background: bg,
        cursor: 'pointer',
        transition: `background var(--duration-fast)`,
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <Avatar name={item.from} size={32} tone={item.avatarTone} />
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Row 1: sender + star + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: item.unread ? 700 : 500,
              color: item.unread ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.from}
            </span>
            {item.starred && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-review)" stroke="var(--color-review)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 3l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6Z" />
              </svg>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
              {item.time}
            </span>
          </div>

          {/* Row 2: subject */}
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12.5,
            fontWeight: item.unread ? 600 : 400,
            color: 'var(--color-text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: 2,
          }}>
            {item.subject}
          </div>

          {/* Row 3: preview (2 lines) */}
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'var(--color-text-tertiary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as any,
            overflow: 'hidden',
            marginBottom: 5,
          }}>
            {item.preview}
          </div>

          {/* Row 4: pages · routed to · tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
              {item.pages}p
            </span>
            {item.routedTo && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                → {item.routedTo}
              </span>
            )}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
              {item.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>
          </div>

        </div>
      </div>
    </button>
  );
}

// ─── FAX PREVIEW (RIGHT PANEL) ────────────────────────────────────────────────

function FaxPreview({ item }: { item: FaxItem }) {
  const thumbCount = Math.min(4, item.pages);

  return (
    <div style={{ padding: '0 0 32px' }}>

      {/* Preview header card */}
      <Card style={{ marginBottom: 16 }}>
        {/* Row 1: avatar + sender + meta + star + menu */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <Avatar name={item.from} size={36} tone={item.avatarTone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700,
              color: 'var(--color-text-primary)', lineHeight: 1.2,
            }}>
              {item.from}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--color-text-tertiary)', marginTop: 3 }}>
              {item.number} · Today · {item.time} · {item.id}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <button style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24"
                fill={item.starred ? 'var(--color-review)' : 'none'}
                stroke="var(--color-review)"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6Z" />
              </svg>
            </button>
            <button style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-tertiary)',
            }}>
              <I.More size={16} />
            </button>
          </div>
        </div>

        {/* Row 2: headline */}
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700,
          color: 'var(--color-text-primary)', margin: '0 0 12px', lineHeight: 1.2,
        }}>
          {item.subject}
        </h2>

        {/* Row 3: tag badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {item.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      </Card>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 }}>
        <Button variant="primary" size="sm">
          <I.Forward size={13} /> Forward
        </Button>
        <Button variant="secondary" size="sm">
          <I.Send size={13} /> Reply by fax
        </Button>
        <Button variant="secondary" size="sm">
          <I.Download size={13} /> Download
        </Button>
        <Button variant="ghost" size="sm">Print</Button>
        {item.unread && <Button variant="ghost" size="sm">Mark read</Button>}
      </div>

      {/* Document preview card */}
      <Card noPadding style={{ marginBottom: 0, overflow: 'hidden' }}>
        <div style={{
          background: 'var(--color-primary-subtle)',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid var(--color-border)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            color: 'var(--color-primary)',
          }}>
            {item.subject.toUpperCase()}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            PG 1/{item.pages}
          </span>
        </div>
        <div style={{ padding: 20, background: 'var(--color-surface)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
              FROM
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-text-primary)' }}>
              {item.number}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
              TO
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-text-primary)' }}>
              FaxGrid · Seattle Office
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[88, 72, 95, 60, 80, 90].map((w, i) => (
              <div key={i} style={{ height: 8, borderRadius: 'var(--radius-sm)', background: 'var(--color-border)', width: `${w}%` }} />
            ))}
          </div>
        </div>
      </Card>

      {/* Thumbnail strip */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 16 }}>
        {Array.from({ length: thumbCount }, (_, i) => (
          <div key={i}>
            <div style={{
              width: 80, height: 100,
              border: i === 0 ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5, padding: 10,
            }}>
              {[70, 50, 80, 40, 60].map((w, j) => (
                <div key={j} style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', width: `${w}%` }} />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Auto-extracted card */}
      <Card style={{ background: 'var(--color-primary-subtle)', boxShadow: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" />
            <path d="M18 15l.75 2.25L21 18l-2.25.75L18 21l-.75-2.25L15 18l2.25-.75Z" />
            <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5Z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
            Auto-extracted
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 14px' }}>
          {item.preview}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
          {[
            { label: 'PATIENT ID',      value: 'A24189' },
            { label: 'DATE OF SERVICE', value: 'Mar 22, 2025' },
            { label: 'DOCUMENT TYPE',   value: TAG_LABELS[item.tags[0]] ?? 'Fax' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'all',      label: 'All' },
  { id: 'unread',   label: 'Unread' },
  { id: 'flagged',  label: 'Flagged' },
  { id: 'phi',      label: 'PHI only' },
  { id: 'archived', label: 'Archived' },
];

const SENDER_FILTERS = ['All senders', 'Labs', 'Insurance', 'Providers', 'Records'];

export default function InboxPage() {
  const [activeTab, setActiveTab]       = useState('all');
  const [senderFilter, setSenderFilter] = useState('All senders');
  const [headerSearch, setHeaderSearch] = useState('');
  const [listSearch, setListSearch]     = useState('');
  const [selectedId, setSelectedId]     = useState(FAXES[0].id);

  const unreadCount    = FAXES.filter(f => f.unread).length;
  const phiUnreadCount = FAXES.filter(f => f.phi && f.unread).length;
  const awaitingCount  = FAXES.filter(f => !!f.awaitingRouting).length;

  const tabCounts: Record<string, number> = {
    all:      FAXES.length,
    unread:   FAXES.filter(f => f.unread).length,
    flagged:  FAXES.filter(f => f.starred).length,
    phi:      FAXES.filter(f => f.phi).length,
    archived: 0,
  };

  const q = (headerSearch || listSearch).toLowerCase();

  const filtered = FAXES.filter(f => {
    if (activeTab === 'unread'   && !f.unread)   return false;
    if (activeTab === 'flagged'  && !f.starred)  return false;
    if (activeTab === 'phi'      && !f.phi)       return false;
    if (activeTab === 'archived')                 return false;
    if (q && !`${f.from} ${f.subject} ${f.preview}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const selected = FAXES.find(f => f.id === selectedId);

  // ── stat tile base style ─────────────────────────────────────────────────
  const statTileBase: React.CSSProperties = {
    padding: 20,
    borderRight: '1px solid var(--color-border)',
  };

  const statTileLast: React.CSSProperties = {
    padding: 20,
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0 -32px' }}>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '20px 32px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)', marginBottom: 4,
          }}>
            INBOX · {unreadCount} UNREAD
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
            color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.15, marginBottom: 4,
          }}>
            Anything urgent in here?
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5,
          }}>
            Inbound faxes route here automatically. Unread items at the top, flagged at the bottom.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
          <div style={{ position: 'relative' }}>
            <I.Search size={14} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-tertiary)', pointerEvents: 'none',
            }} />
            <input
              value={headerSearch}
              onChange={e => setHeaderSearch(e.target.value)}
              placeholder="Search faxes, contacts…"
              style={{
                paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--color-text-primary)', background: 'var(--color-surface)',
                width: 220, outline: 'none',
              }}
            />
          </div>
          <button style={{
            position: 'relative', width: 36, height: 36,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-secondary)', cursor: 'pointer',
          }}>
            <I.Bell size={16} />
            <span style={{
              position: 'absolute', top: 7, right: 8,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--color-primary)',
            }} />
          </button>
          <Button variant="primary">
            <I.Plus size={14} strokeWidth={2.4} /> New fax
          </Button>
        </div>
      </div>

      {/* ── Body: stats + filters + split ─────────────────────────────────── */}
      <div style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: '20px 32px 0', gap: 14,
        background: 'var(--color-bg)',
      }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, flexShrink: 0 }}>

          {/* Tile 1: Unread — clickable */}
          <button
            onClick={() => setActiveTab('unread')}
            style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <div style={statTileBase}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
                UNREAD
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: 6 }}>
                {unreadCount}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-delivered)' }}>
                <I.ArrowUp size={11} strokeWidth={2.4} />
                4 in last hour
              </div>
            </div>
          </button>

          {/* Tile 2: Awaiting routing */}
          <div style={statTileBase}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
              AWAITING ROUTING
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: 6 }}>
              {awaitingCount}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              auto-routes when matched
            </div>
          </div>

          {/* Tile 3: PHI Unread — highlighted, clickable */}
          <button
            onClick={() => setActiveTab('phi')}
            style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <div style={statTileBase}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
                PHI UNREAD
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--color-phi)', lineHeight: 1, marginBottom: 6 }}>
                {phiUnreadCount}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                review within 24h
              </div>
            </div>
          </button>

          {/* Tile 4: Avg time — informational */}
          <div style={statTileLast}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
              AVG TIME IN INBOX
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: 6 }}>
              2.4h
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-delivered)' }}>
              <I.ArrowDown size={11} strokeWidth={2.4} />
              12% this week
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ flexShrink: 0 }}>
          <Card style={{ padding: '10px 14px', boxShadow: 'none' }}>
            {/* Row 1: primary pill tabs */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              marginBottom: 10, paddingBottom: 10,
              borderBottom: '1px solid var(--color-border)',
            }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 'var(--radius-xl)',
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', border: 'none',
                    background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                    transition: `all var(--duration-fast)`,
                  }}
                >
                  {tab.label}
                  {tabCounts[tab.id] > 0 && (
                    <span style={{
                      fontSize: 11,
                      color: activeTab === tab.id ? 'rgba(255,255,255,0.65)' : 'var(--color-text-tertiary)',
                    }}>
                      {tabCounts[tab.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {/* Row 2: sender filters + search */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                {SENDER_FILTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSenderFilter(s)}
                    style={{
                      padding: '3px 10px',
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                      cursor: 'pointer', background: 'none', border: 'none',
                      color: senderFilter === s ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                      textDecoration: senderFilter === s ? 'underline' : 'none',
                      textUnderlineOffset: '3px',
                      transition: `color var(--duration-fast)`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <I.Search size={13} style={{
                  position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-text-tertiary)', pointerEvents: 'none',
                }} />
                <input
                  value={listSearch}
                  onChange={e => setListSearch(e.target.value)}
                  placeholder="Search inbox…"
                  style={{
                    paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)', fontSize: 12,
                    color: 'var(--color-text-primary)', background: 'var(--color-surface)',
                    width: 180, outline: 'none',
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Content: left list + right preview */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: 16, paddingBottom: 24, minHeight: 0 }}>

          {/* Left panel — 320px fixed, independent scroll */}
          <Card noPadding style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* List header */}
            <div style={{
              padding: '9px 14px', borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--color-bg)', flexShrink: 0,
            }}>
              <input type="checkbox" style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                {filtered.length} fax{filtered.length !== 1 ? 'es' : ''}
              </span>
              <div style={{ flex: 1 }} />
              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-secondary)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}>
                Newest <I.ChevronDown size={12} />
              </button>
            </div>
            {/* Scrollable list */}
            <div style={{ flex: 1, overflowY: 'auto' }} className="scrollbar-thin">
              {filtered.length === 0 ? (
                <div style={{
                  padding: '48px 24px', textAlign: 'center',
                  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)',
                }}>
                  Nothing here. Try another filter.
                </div>
              ) : filtered.map(f => (
                <FaxListItem
                  key={f.id}
                  item={f}
                  selected={f.id === selectedId}
                  onClick={() => setSelectedId(f.id)}
                />
              ))}
            </div>
          </Card>

          {/* Right panel — flex-1, independent scroll */}
          <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }} className="scrollbar-thin">
            {selected ? (
              <FaxPreview item={selected} />
            ) : (
              <div style={{
                height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12, color: 'var(--color-text-tertiary)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-subtle)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I.Inbox size={22} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14 }}>No fax selected</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
