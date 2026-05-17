'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { I } from '@/components/app/icons';
import { Avatar } from '@/components/app/primitives';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
      margin: '0 -32px',
    }}>

      {/* ── Detail header ──────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexShrink: 0,
      }}>

        {/* Back button */}
        <Link href="/app/inbox" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm">← Inbox</Button>
        </Link>

        {/* Right: sender info + actions */}
        <div style={{ flex: 1 }}>

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
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 32px',
        display: 'flex',
        gap: 8,
        flexShrink: 0,
      }}>
        <Button variant="primary" size="sm"><I.Forward size={13} /> Forward</Button>
        <Button variant="secondary" size="sm"><I.Send size={13} /> Reply by fax</Button>
        <Button variant="secondary" size="sm"><I.Download size={13} /> Download</Button>
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
          }}>
            {pages.map((page, i) => (
              <div key={page.pageNum} style={{ flexShrink: 0 }}>
                <div
                  onClick={() => setActivePage(i)}
                  style={{
                    width: 72,
                    height: 90,
                    borderRadius: 'var(--radius-sm)',
                    border: activePage === i
                      ? '1.5px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
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
          <Card noPadding style={{ overflow: 'hidden' }}>
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
                    background: 'var(--color-border)', width: `${w}%`,
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
              <Button variant="ghost" size="sm">↓ Download receipt</Button>
              <Button variant="ghost" size="sm">→ Forward</Button>
            </div>
          </Card>

          {/* Auto-extracted card */}
          <Card padding={16} style={{
            background: 'var(--color-primary-subtle)',
            boxShadow: 'none',
            marginTop: 16,
          }}>
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
              <a href="#" style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                color: 'var(--color-primary)', textDecoration: 'none',
              }}>
                Create template →
              </a>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
