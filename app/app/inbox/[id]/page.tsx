'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { I } from '@/components/app/icons';
import { Avatar } from '@/components/app/primitives';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--color-text-tertiary)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '38px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '0 12px',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--color-text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};

// ─── MODAL BASE ───────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children, footer }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(26,34,54,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: '18px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div>{children}</div>

        {footer && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TAG BADGE ────────────────────────────────────────────────────────────────

type Tag = 'PHI' | 'LABS' | 'REFERRAL' | 'BILLING' | 'EOB' | 'TRANSFER' | 'ROI' | 'PATHOLOGY' | 'IMAGING' | 'AUTH';

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
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 22, padding: '0 8px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase' as const,
      whiteSpace: 'nowrap' as const, background: bg, color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {TAG_LABELS[tag]}
    </span>
  );
}

// ─── SPARKLE ICON ─────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: 'var(--color-primary)', flexShrink: 0 }}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" />
      <path d="M18 15l.75 2.25L21 18l-2.25.75L18 21l-.75-2.25L15 18l2.25-.75Z" />
      <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5Z" />
    </svg>
  );
}

// ─── PAGE DATA ────────────────────────────────────────────────────────────────

const pages = [
  {
    pageNum: 1,
    label: 'LAB RESULTS · PATIENT A24189',
    fields: [
      { label: 'FROM', value: '+1 (206) 555-2840' },
      { label: 'TO', value: 'Northwind Health · Seattle Office' },
    ],
    lines: [100, 95, 88, 100, 75, 92, 68, 45, 80, 60],
  },
  {
    pageNum: 2,
    label: 'METABOLIC PANEL RESULTS',
    fields: [],
    lines: [100, 88, 76, 100, 92, 84, 70, 95, 60, 78],
  },
  {
    pageNum: 3,
    label: 'LIPID PROFILE',
    fields: [],
    lines: [90, 100, 82, 68, 95, 78, 88, 72, 60, 84],
  },
  {
    pageNum: 4,
    label: 'PHYSICIAN NOTES',
    fields: [],
    lines: [100, 72, 90, 85, 60, 95, 78, 88, 65, 50],
  },
  {
    pageNum: 5,
    label: 'REFERENCE RANGES',
    fields: [],
    lines: [88, 100, 75, 92, 68, 84, 95, 70, 80, 60],
  },
  {
    pageNum: 6,
    label: 'ORDERING PHYSICIAN',
    fields: [
      { label: 'PHYSICIAN', value: 'Dr. M. Greaves' },
      { label: 'NPI', value: '1234567890' },
      { label: 'DATE ORDERED', value: 'Mar 22, 2025' },
    ],
    lines: [100, 85, 70, 90, 60, 78, 88, 65, 72, 55],
  },
  {
    pageNum: 7,
    label: 'AUTHORIZATION',
    fields: [
      { label: 'AUTH CODE', value: 'A24189-LAB' },
      { label: 'VALID THROUGH', value: 'Jun 22, 2025' },
    ],
    lines: [80, 95, 70, 88, 60, 75, 90, 65, 78, 50],
  },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function InboxDetailPage() {
  const [activePage, setActivePage] = useState(0);
  const [hoverPage, setHoverPage] = useState<number | null>(null);

  // Modal / dropdown state
  const [forwardOpen, setForwardOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'PDF' | 'TIFF'>('PDF');

  const TAGS: Tag[] = ['PHI', 'LABS'];

  const FAX_DETAILS = [
    { label: 'From',     value: '+1 (206) 555-2840', mono: true  },
    { label: 'To',       value: '+1 (206) 555-0142', mono: true  },
    { label: 'Received', value: 'Today · 11:14 AM',  mono: false },
    { label: 'Pages',    value: '7',                 mono: false },
    { label: 'Fax ID',   value: 'FX-IN-3382',        mono: true  },
    { label: 'Number',   value: 'Cardiology · 0142', mono: false },
  ];

  const currentPage = pages[activePage];

  return (
    <>
    <style>{`
      .inbox-back-link {
        display: inline-block;
        padding-top: 24px;
        font-size: 13px;
        color: var(--color-text-tertiary);
        text-decoration: none;
        transition: color var(--duration-fast);
      }
      .inbox-back-link:hover { color: var(--color-text-primary); }
      .inbox-detail-scroll::-webkit-scrollbar { display: none; }
    `}</style>
    <div className="inbox-detail-scroll" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      margin: '0 -32px',
    }}>

      {/* ── Modal 1: Forward ───────────────────────────────────────────────── */}
      <Modal
        isOpen={forwardOpen}
        onClose={() => setForwardOpen(false)}
        title="Forward fax"
        footer={
          <>
            <Button variant="ghost" onClick={() => setForwardOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setForwardOpen(false)}>Forward fax →</Button>
          </>
        }
      >
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Recipient fax number</label>
          <input
            type="text"
            placeholder="+1 (xxx) xxx-xxxx"
            style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Recipient name (optional)</label>
          <input type="text" placeholder="e.g. BlueShield Prior Auth" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Note (optional)</label>
          <textarea
            placeholder="Add a note to the cover page..."
            rows={3}
            style={{
              width: '100%',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ color: 'var(--color-primary)', fontSize: '16px' }}>📄</span>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Lab results · Patient A24189
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
              7 pages · FX-IN-3382
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Modal 2: Reply by fax ──────────────────────────────────────────── */}
      <Modal
        isOpen={replyOpen}
        onClose={() => setReplyOpen(false)}
        title="Reply by fax"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReplyOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setReplyOpen(false)}>Send reply →</Button>
          </>
        }
      >
        <div style={{
          background: 'var(--color-primary-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '16px',
        }}>
          <div style={{ ...labelStyle, marginBottom: '2px' }}>Replying to</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
            +1 (206) 555-2840
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Pacific Lab Diagnostics
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Subject</label>
          <input type="text" defaultValue="Re: Lab results · Patient A24189" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Message</label>
          <textarea
            placeholder="Type your reply..."
            rows={4}
            style={{
              width: '100%',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>Send from</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }}>
            <option>+1 (206) 555-0142 · Cardiology</option>
            <option>+1 (206) 555-0319 · Front desk</option>
            <option>+1 (888) 555-0903 · Toll-free</option>
          </select>
        </div>
      </Modal>

      {/* ── Modal 3: Download ──────────────────────────────────────────────── */}
      <Modal
        isOpen={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        title="Download fax"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDownloadOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setDownloadOpen(false)}>↓ Download</Button>
          </>
        }
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Download Lab results · Patient A24189 (7 pages)
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Format</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['PDF', 'TIFF'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setDownloadFormat(fmt)}
                style={{
                  flex: 1,
                  height: '38px',
                  border: downloadFormat === fmt ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: downloadFormat === fmt ? 'var(--color-primary-subtle)' : 'white',
                  color: downloadFormat === fmt ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Include cover page', checked: true },
            { label: 'Include audit stamp', checked: false },
          ].map(opt => (
            <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={opt.checked} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Modal>

      {/* ── Modal 4: Download receipt ──────────────────────────────────────── */}
      <Modal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title="Download receipt"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReceiptOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setReceiptOpen(false)}>↓ Download receipt</Button>
          </>
        }
      >
        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ ...labelStyle, marginBottom: '12px' }}>Delivery receipt</div>
          {[
            { label: 'Fax ID',   value: 'FX-IN-3382' },
            { label: 'From',     value: '+1 (206) 555-2840' },
            { label: 'To',       value: '+1 (206) 555-0142' },
            { label: 'Received', value: 'Today · 11:14 AM' },
            { label: 'Pages',    value: '7' },
            { label: 'Status',   value: 'Delivered' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: '8px', paddingBottom: '8px',
              borderBottom: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)', fontSize: '13px',
            }}>
              <span style={{ color: 'var(--color-text-tertiary)' }}>{row.label}</span>
              <span style={{
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                fontFamily: ['Fax ID', 'From', 'To'].includes(row.label) ? 'var(--font-mono)' : 'var(--font-body)',
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          Receipt includes transmission confirmation and HIPAA audit stamp.
        </p>
      </Modal>

      {/* ── Modal 5: Create template ───────────────────────────────────────── */}
      <Modal
        isOpen={templateOpen}
        onClose={() => setTemplateOpen(false)}
        title="Save as template"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTemplateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setTemplateOpen(false)}>Save template</Button>
          </>
        }
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Save this fax as a reusable template for future lab result requests.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Template name</label>
          <input type="text" defaultValue="Lab results — Pacific Lab" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Category</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }}>
            <option>Labs</option>
            <option>Prior auth</option>
            <option>Referrals</option>
            <option>Records request</option>
            <option>Legal</option>
            <option>Cover pages</option>
          </select>
        </div>

        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}>
          <div style={{ ...labelStyle, marginBottom: '8px' }}>What gets saved</div>
          {[
            'Recipient: Pacific Lab Diagnostics',
            'Fax number: +1 (206) 555-2840',
            'Subject line',
            'Cover page settings',
          ].map(item => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'var(--font-body)', fontSize: '13px',
              color: 'var(--color-text-secondary)',
              marginBottom: '6px',
            }}>
              <span style={{ color: 'var(--color-delivered)', fontSize: '12px' }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </Modal>

      {/* ── Detail header ──────────────────────────────────────────────────── */}
      <div style={{
        padding: '16px 32px',
        flexShrink: 0,
      }}>

        {/* Back button — own row */}
        <Link href="/app/inbox" className="inbox-back-link">← Inbox</Link>

        {/* Sender info + actions */}
        <div style={{ marginTop: 8 }}>

          {/* Row 1: avatar · sender · phone/time · fax ID · star · menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name="Pacific Lab Diagnostics" size={36} tone="teal" />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}>
              Pacific Lab Diagnostics
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              +1 (206) 555-2840 · Today · 11:14 AM
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              FX-IN-3382
            </span>

            {/* Star + three-dot pushed to far right */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
              <button style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill="var(--color-review)" stroke="var(--color-review)"
                  strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6Z" />
                </svg>
              </button>

              {/* ── Dropdown 6: Three-dot menu ──────────────────────────── */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  <I.More size={16} />
                </button>

                {menuOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                      onClick={() => setMenuOpen(false)}
                    />
                    <div style={{
                      position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-panel)',
                      minWidth: '180px',
                      zIndex: 100,
                      overflow: 'hidden',
                    }}>
                      {[
                        { label: 'Mark as unread', icon: '○' },
                        { label: 'Flag for review', icon: '⚑' },
                        { label: 'Archive',         icon: '⊟' },
                        { divider: true },
                        { label: 'Delete',          icon: '✕', danger: true },
                      ].map((item, i) => (
                        item.divider
                          ? <div key={i} style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                          : <button
                              key={item.label}
                              onClick={() => setMenuOpen(false)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                width: '100%', padding: '10px 14px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontFamily: 'var(--font-body)', fontSize: '13px',
                                color: item.danger ? 'var(--color-failed)' : 'var(--color-text-primary)',
                                textAlign: 'left',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = item.danger ? 'var(--color-failed-bg)' : 'var(--color-bg)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                            >
                              <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
                              {item.label}
                            </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: headline */}
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700,
            color: 'var(--color-text-primary)', margin: '8px 0 0', lineHeight: 1.2,
          }}>
            Lab results · Patient A24189
          </h1>

          {/* Row 3: tag badges */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {TAGS.map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>

        </div>
      </div>

      {/* ── Action bar ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: '10px 32px 20px',
        display: 'flex',
        gap: 8,
        flexShrink: 0,
      }}>
        <Button variant="primary" size="sm" onClick={() => setForwardOpen(true)}><I.Forward size={13} /> Forward</Button>
        <Button variant="secondary" size="sm" onClick={() => setReplyOpen(true)}><I.Send size={13} /> Reply by fax</Button>
        <Button variant="secondary" size="sm" onClick={() => setDownloadOpen(true)}><I.Download size={13} /> Download</Button>
        <Button variant="ghost" size="sm">Print</Button>
        <Button variant="ghost" size="sm">Mark read</Button>
      </div>

      {/* ── Content area ───────────────────────────────────────────────────── */}
      <div style={{
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 24,
        alignItems: 'start',
      }}>

        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div>

          {/* Thumbnail strip — sits above the document card */}
          <div style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            marginBottom: 12,
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          }}>
            {pages.map((page, i) => (
              <div key={page.pageNum} style={{ flexShrink: 0 }}>
                <div
                  onClick={() => setActivePage(i)}
                  onMouseEnter={() => setHoverPage(i)}
                  onMouseLeave={() => setHoverPage(null)}
                  style={{
                    width: 72,
                    height: 90,
                    borderRadius: 'var(--radius-sm)',
                    border: activePage === i
                      ? '2px solid var(--color-primary)'
                      : hoverPage === i
                        ? '2px solid var(--color-border-strong)'
                        : '2px solid transparent',
                    boxShadow: activePage === i ? '0 0 0 3px var(--color-primary-subtle)' : 'none',
                    background: 'var(--color-bg)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '6px',
                    gap: '3px',
                  }}
                >
                  {page.lines.slice(0, 4).map((w, j) => (
                    <div key={j} style={{
                      height: 4,
                      width: `${w}%`,
                      background: 'var(--color-border)',
                      borderRadius: 2,
                    }} />
                  ))}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--color-text-tertiary)',
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  {page.pageNum}
                </div>
              </div>
            ))}
          </div>

          {/* Document preview card */}
          <Card noPadding style={{ overflow: 'hidden', border: 'none' }}>
            {/* Header bar */}
            <div style={{
              background: 'var(--color-primary-subtle)',
              padding: '10px 16px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-primary)', flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                color: 'var(--color-primary)',
              }}>
                {currentPage.label}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--color-text-tertiary)',
              }}>
                PG {activePage + 1}/7
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: 24 }}>
              {currentPage.fields.map((field, i) => (
                <div key={field.label} style={{ marginTop: i > 0 ? 14 : 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                    color: 'var(--color-text-tertiary)', marginBottom: 4,
                  }}>
                    {field.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-text-primary)' }}>
                    {field.value}
                  </div>
                </div>
              ))}

              {/* Placeholder content bars */}
              <div style={{ marginTop: currentPage.fields.length > 0 ? 24 : 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentPage.lines.map((w, i) => (
                  <div key={i} style={{
                    height: 10, borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-border)', opacity: 0.5, width: `${w}%`,
                  }} />
                ))}
              </div>

              {/* Prev / Next navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid var(--color-border)',
              }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePage(p => p - 1)}
                  disabled={activePage === 0}
                >
                  ← Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePage(p => p + 1)}
                  disabled={activePage === 6}
                >
                  Next →
                </Button>
              </div>
            </div>
          </Card>

        </div>

        {/* ── Right column ────────────────────────────────────────────────── */}
        <div>

          {/* Routing card */}
          <Card>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}>
              Routing
            </div>

            {/* Status row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-delivered)', flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}>
                Auto-routed to Dr. M. Greaves
              </span>
            </div>

            {/* Rule detail */}
            <div style={{ marginTop: 6, paddingLeft: 16 }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--color-text-secondary)',
              }}>
                Via rule: Lab results → Cardiology team
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 11,
                color: 'var(--color-text-tertiary)', marginTop: 2,
              }}>
                Set up by Amelia Park · Mar 1
              </div>
            </div>

            {/* Edit link */}
            <div style={{ marginTop: 10 }}>
              <a href="#" style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                color: 'var(--color-primary)', textDecoration: 'none',
              }}>
                Edit routing rule →
              </a>
            </div>
          </Card>

          {/* Fax details card */}
          <Card style={{ marginTop: 16 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
              color: 'var(--color-text-primary)', marginBottom: 4,
            }}>
              Fax details
            </div>

            {FAX_DETAILS.map(({ label, value, mono }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 32, borderBottom: '1px solid var(--color-border)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                  color: 'var(--color-text-tertiary)',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
                  fontSize: 12, fontWeight: mono ? 400 : 600,
                  color: 'var(--color-text-primary)',
                }}>
                  {value}
                </span>
              </div>
            ))}

            {/* Action row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="ghost" size="sm" onClick={() => setReceiptOpen(true)}>↓ Download receipt</Button>
              <Button variant="ghost" size="sm" onClick={() => setForwardOpen(true)}>→ Forward</Button>
            </div>
          </Card>

          {/* Auto-extracted card */}
          <Card padding={16} style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SparkleIcon />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                color: 'var(--color-primary)',
              }}>
                Auto-extracted
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--color-text-secondary)', lineHeight: 1.6,
              margin: '6px 0 0',
            }}>
              Comprehensive metabolic panel and lipid profile, ordered Mar 22.
              Results within reference range except for HDL...
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginTop: 14 }}>
              {[
                { label: 'PATIENT ID',      value: 'A24189' },
                { label: 'DATE OF SERVICE', value: 'Mar 22, 2025' },
                { label: 'DOCUMENT TYPE',   value: 'PHI' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                    color: 'var(--color-text-tertiary)', marginBottom: 3,
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Save as template card */}
          <Card padding={16} style={{
            background: 'var(--color-primary-subtle)',
            boxShadow: 'none',
            marginTop: 16,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--color-primary)' }}>
              <path d="M12 3l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6Z" />
            </svg>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
              color: 'var(--color-text-primary)', marginTop: 8,
            }}>
              Save this as a template?
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--color-text-secondary)', lineHeight: 1.55, marginTop: 4,
            }}>
              Reuse this recipient, subject, and settings for future lab result requests.
            </div>
            <div style={{ marginTop: 10 }}>
              <a
                href="#"
                onClick={e => { e.preventDefault(); setTemplateOpen(true); }}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                  color: 'var(--color-primary)', textDecoration: 'none',
                }}
              >
                Create template →
              </a>
            </div>
          </Card>

        </div>
      </div>
    </div>
    </>
  );
}
