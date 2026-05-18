'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { I } from '@/components/app/icons';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type TabId = 'document' | 'receipt' | 'log';

// ─── PAGE DATA ────────────────────────────────────────────────────────────────

const THUMBNAILS = [1, 2, 3, 4, 5, 6, 7];

const DOC_LINES = [100, 88, 75, 92, 60, 84, 95, 70];

const RECEIPT_ROWS = [
  { label: 'Fax ID',        value: 'FX-9824-1A',         mono: true  },
  { label: 'From',          value: '+1 (206) 555-0142',   mono: true  },
  { label: 'To',            value: '+1 (888) 555-0903',   mono: true  },
  { label: 'Sent',          value: 'Today · 10:42 AM',    mono: false },
  { label: 'Pages',         value: '7',                   mono: false },
  { label: 'Status',        value: 'Delivered',           mono: false, highlight: true },
  { label: 'Confirmation',  value: 'CF-882-AUTH',         mono: true  },
];

const LOG_STEPS = [
  {
    label: 'Queued',
    time: '10:41 AM',
    desc: 'Fax queued for transmission.',
    via: 'via Blue Lark scheduler',
    done: true,
  },
  {
    label: 'Connecting',
    time: '10:41 AM',
    desc: 'Dialing recipient line.',
    via: 'via Telnyx carrier',
    done: true,
  },
  {
    label: 'Transmitting',
    time: '10:42 AM',
    desc: 'Sending pages to device.',
    via: 'via kICM protocol',
    done: true,
  },
  {
    label: 'Delivered',
    time: '10:42 AM',
    desc: 'Delivery confirmed by carrier.',
    via: 'via Telnyx confirmation',
    done: true,
  },
];

const FAX_DETAIL_ROWS = [
  { label: 'To',        value: '+1 (888) 555-0903',   mono: true  },
  { label: 'Recipient', value: 'BlueShield Prior Auth', mono: false },
  { label: 'From',      value: '+1 (206) 555-0142',   mono: true  },
  { label: 'Sent by',   value: 'Amelia Park',          mono: false },
  { label: 'Sent',      value: 'Today · 10:42 AM',    mono: false },
  { label: 'Pages',     value: '7',                   mono: false },
  { label: 'Fax ID',    value: 'FX-9824-1A',          mono: true  },
  { label: 'Number',    value: 'Cardiology · 0142',   mono: false },
];

const TAGS = [
  { label: 'PHI',  bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
  { label: 'AUTH', bg: 'var(--color-primary-subtle)', color: 'var(--color-primary)' },
];

// ─── LABEL STYLE ──────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--color-text-tertiary)',
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SentDetailPage() {
  const [activeTab, setActiveTab] = useState<TabId>('document');
  const [activePage, setActivePage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
      margin: '0 -32px',
    }}>

      {/* ── Detail header ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 32px',
        flexShrink: 0,
      }}>

        {/* Back button */}
        <div style={{ marginBottom: 8 }}>
          <Link href="/app/sent" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm">← Sent</Button>
          </Link>
        </div>

        {/* Row 1: avatar · name · phone/time · fax ID · three-dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            BP
          </div>

          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}>
            BlueShield Prior Auth
          </span>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            +1 (888) 555-0903 · Today · 10:42 AM
          </span>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            FX-9824-1A
          </span>

          {/* Three-dot menu */}
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 32, height: 32,
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <I.More size={16} />
            </button>

            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 4,
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-panel)',
                  minWidth: 180,
                  zIndex: 100,
                  overflow: 'hidden',
                }}>
                  {[
                    { label: 'Mark as unread', icon: '○' },
                    { label: 'Resend',         icon: '↺' },
                    { label: 'Archive',        icon: '⊟' },
                    { divider: true },
                    { label: 'Delete',         icon: '✕', danger: true },
                  ].map((item, i) => (
                    item.divider
                      ? <div key={i} style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />
                      : <button
                          key={item.label}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            width: '100%', padding: '10px 14px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: 'var(--font-body)', fontSize: 13,
                            color: item.danger ? 'var(--color-failed)' : 'var(--color-text-primary)',
                            textAlign: 'left',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = item.danger ? 'var(--color-failed-bg)' : 'var(--color-bg)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <span style={{ fontSize: 12, opacity: 0.7 }}>{item.icon}</span>
                          {item.label}
                        </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row 2: headline */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '8px 0 0',
          lineHeight: 1.2,
        }}>
          Authorization request — Patient #A24189
        </h1>

        {/* Row 3: tag badges */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {TAGS.map(tag => (
            <span key={tag.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 22, padding: '0 8px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              background: tag.bg, color: tag.color,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: tag.color, flexShrink: 0 }} />
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Action bar ────────────────────────────────────────────────────── */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 32px',
        display: 'flex',
        gap: 8,
        flexShrink: 0,
      }}>
        <Button variant="primary"   size="sm">Resend</Button>
        <Button variant="secondary" size="sm"><I.Forward size={13} /> Forward</Button>
        <Button variant="secondary" size="sm"><I.Download size={13} /> Download</Button>
        <Button variant="ghost"     size="sm">Print</Button>
      </div>

      {/* ── Content area ──────────────────────────────────────────────────── */}
      <div style={{
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 24,
        alignItems: 'start',
      }}>

        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div>

          {/* Tab bar */}
          <div style={{
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            gap: 24,
            marginBottom: 16,
          }}>
            {(['document', 'receipt', 'log'] as const).map(tab => {
              const labels: Record<TabId, string> = {
                document: 'Document',
                receipt:  'Receipt',
                log:      'Transmission log',
              };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                    padding: '10px 0',
                    cursor: 'pointer',
                    marginBottom: -1,
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* ── Document tab ──────────────────────────────────────────────── */}
          {activeTab === 'document' && (
            <>
              {/* Thumbnail strip */}
              <div style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                marginBottom: 12,
              }}>
                {THUMBNAILS.map((_, i) => (
                  <div key={i} style={{ flexShrink: 0 }}>
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
                        padding: 6,
                        gap: 3,
                      }}
                    >
                      {[100, 80, 60, 90].map((w, j) => (
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
                      {i + 1}
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
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                  }}>
                    AUTHORIZATION REQUEST — PATIENT #A24189
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
                  <div>
                    <div style={{ ...labelStyle, marginBottom: 4 }}>FROM</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-primary)' }}>
                      Northwind Health · Cardiology
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ ...labelStyle, marginBottom: 4 }}>TO</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-primary)' }}>
                      BlueShield Prior Auth · Authorizations Dept.
                    </div>
                  </div>

                  {/* Placeholder lines */}
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {DOC_LINES.map((w, i) => (
                      <div key={i} style={{
                        height: 10,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-border)',
                        width: `${w}%`,
                      }} />
                    ))}
                  </div>

                  {/* Prev / Next */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setActivePage(p => p - 1)}
                      disabled={activePage === 0}
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setActivePage(p => p + 1)}
                      disabled={activePage === 6}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* ── Receipt tab ───────────────────────────────────────────────── */}
          {activeTab === 'receipt' && (
            <Card>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
                color: 'var(--color-text-primary)', marginBottom: 4,
              }}>
                Delivery receipt
              </div>

              {RECEIPT_ROWS.map(({ label, value, mono, highlight }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  height: 32, borderBottom: '1px solid var(--color-border)',
                }}>
                  <span style={labelStyle}>{label}</span>
                  <span style={{
                    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
                    fontSize: 12, fontWeight: mono ? 400 : 600,
                    color: highlight ? 'var(--color-delivered)' : 'var(--color-text-primary)',
                  }}>
                    {value}
                  </span>
                </div>
              ))}

              <div style={{ marginTop: 12 }}>
                <Button variant="secondary" size="sm"><I.Download size={13} /> Download receipt</Button>
              </div>
            </Card>
          )}

          {/* ── Transmission log tab ──────────────────────────────────────── */}
          {activeTab === 'log' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {LOG_STEPS.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', gap: 16, paddingBottom: 20 }}>
                  {/* Timeline connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: step.done ? 'var(--color-delivered)' : 'var(--color-border)',
                      marginTop: 4,
                    }} />
                    {i < LOG_STEPS.length - 1 && (
                      <div style={{
                        width: 2, flex: 1, marginTop: 4,
                        background: step.done ? 'var(--color-delivered)' : 'var(--color-border)',
                        minHeight: 24,
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}>
                        {step.label}
                      </span>
                      <span style={{
                        marginLeft: 'auto',
                        fontFamily: 'var(--font-body)', fontSize: 11,
                        color: 'var(--color-text-tertiary)',
                      }}>
                        {step.time}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      color: 'var(--color-text-secondary)', marginTop: 2,
                    }}>
                      {step.desc}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 11,
                      color: 'var(--color-text-tertiary)', fontStyle: 'italic', marginTop: 2,
                    }}>
                      {step.via}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column ──────────────────────────────────────────────────── */}
        <div>

          {/* Delivery status card */}
          <Card>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}>
              Delivery status
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-delivered)', flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                color: 'var(--color-delivered)',
              }}>
                Delivered
              </span>
              <span style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-body)', fontSize: 11,
                color: 'var(--color-text-tertiary)',
              }}>
                Today · 10:42 AM
              </span>
            </div>

            <div style={{ marginTop: 6, paddingLeft: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                Confirmation #CF-882-AUTH
              </div>
            </div>

            <div style={{ marginTop: 4, paddingLeft: 16 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                7 pages · 1m 12s transmission time
              </div>
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

            {FAX_DETAIL_ROWS.map(({ label, value, mono }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 32, borderBottom: '1px solid var(--color-border)',
              }}>
                <span style={labelStyle}>{label}</span>
                <span style={{
                  fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
                  fontSize: 12, fontWeight: mono ? 400 : 600,
                  color: 'var(--color-text-primary)',
                }}>
                  {value}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="ghost" size="sm"><I.Download size={13} /> Download receipt</Button>
              <Button variant="ghost" size="sm"><I.Forward size={13} /> Forward</Button>
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
              Reuse this recipient, subject, and settings for future prior auth requests.
            </div>
            <div style={{ marginTop: 10 }}>
              <a href="#" onClick={e => e.preventDefault()} style={{
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
