'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { I } from '@/components/app/icons';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Tag { label: string; bg: string; color: string }

interface SentFaxItem {
  id: string;
  initials: string;
  recipient: string;
  subject: string;
  status: 'delivered' | 'failed' | 'inflight';
  attempts: number | null;
  via: string;
  tags: Tag[];
  time: string;
  pages: number;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const sentFaxes: SentFaxItem[] = [
  {
    id: 'FX-9824-1A',
    initials: 'BP',
    recipient: 'BlueShield Prior Auth',
    subject: 'Authorization request — Patient #A24189',
    status: 'delivered',
    attempts: null,
    via: 'Cardiology · 0142',
    tags: [
      { label: 'PHI',  bg: 'var(--color-phi-bg)',       color: 'var(--color-phi)' },
      { label: 'AUTH', bg: 'var(--color-primary-subtle)', color: 'var(--color-primary)' },
    ],
    time: '10:42 AM',
    pages: 7,
  },
  {
    id: 'FX-9824-1B',
    initials: 'AC',
    recipient: 'Aetna Claims',
    subject: 'EOB dispute — claim 881-14',
    status: 'delivered',
    attempts: null,
    via: 'Cardiology · 0142',
    tags: [
      { label: 'BILLING', bg: '#fffbeb', color: '#92400e' },
    ],
    time: '9:15 AM',
    pages: 3,
  },
  {
    id: 'FX-9824-1C',
    initials: 'SM',
    recipient: 'Swedish Medical · ROI',
    subject: 'Records request — Patient A23104',
    status: 'delivered',
    attempts: null,
    via: 'Front desk · 0319',
    tags: [
      { label: 'PHI', bg: 'var(--color-phi-bg)',      color: 'var(--color-phi)' },
      { label: 'ROI', bg: 'var(--color-archived-bg)', color: 'var(--color-archived)' },
    ],
    time: '9:02 AM',
    pages: 2,
  },
  {
    id: 'FX-9824-1D',
    initials: 'PL',
    recipient: 'Pacific Lab Diagnostics',
    subject: 'Order — lipid panel A24189',
    status: 'delivered',
    attempts: null,
    via: 'Cardiology · 0142',
    tags: [
      { label: 'PHI',  bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'LABS', bg: 'var(--color-processing-bg)', color: 'var(--color-processing)' },
    ],
    time: '4:11 PM',
    pages: 1,
  },
  {
    id: 'FX-9824-1E',
    initials: 'NI',
    recipient: 'Northwest Imaging',
    subject: 'Echo referral — Patient A24189',
    status: 'delivered',
    attempts: 2,
    via: 'Cardiology · 0142',
    tags: [
      { label: 'PHI',    bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'IMAGING', bg: 'var(--color-processing-bg)', color: 'var(--color-processing)' },
    ],
    time: '2:50 PM',
    pages: 1,
  },
  {
    id: 'FX-9824-1F',
    initials: 'GH',
    recipient: 'Group Health · Referrals',
    subject: 'Cardiology referral — Patient A23104',
    status: 'failed',
    attempts: 5,
    via: 'Cardiology · 0142',
    tags: [
      { label: 'PHI',      bg: 'var(--color-phi-bg)', color: 'var(--color-phi)' },
      { label: 'REFERRAL', bg: '#f0fdf4',             color: '#16a34a' },
    ],
    time: '11:20 AM',
    pages: 3,
  },
  {
    id: 'FX-9824-1G',
    initials: 'QD',
    recipient: 'Quest Diagnostics',
    subject: 'Lab order — Patient A22891',
    status: 'delivered',
    attempts: null,
    via: 'Toll-free · 0903',
    tags: [
      { label: 'PHI',  bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'LABS', bg: 'var(--color-processing-bg)', color: 'var(--color-processing)' },
    ],
    time: '2:44 PM',
    pages: 1,
  },
  {
    id: 'FX-9824-1H',
    initials: 'AC',
    recipient: 'Aetna Claims',
    subject: 'Prior auth — echocardiogram A24189',
    status: 'delivered',
    attempts: null,
    via: 'Cardiology · 0142',
    tags: [
      { label: 'PHI',  bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'AUTH', bg: 'var(--color-primary-subtle)', color: 'var(--color-primary)' },
    ],
    time: '10:17 AM',
    pages: 4,
  },
];

const TABS = [
  { id: 'all',       label: 'All',       count: 8 },
  { id: 'delivered', label: 'Delivered', count: 7 },
  { id: 'failed',    label: 'Failed',    count: 1 },
  { id: 'inflight',  label: 'In flight', count: 0 },
];

// ─── FAX ROW ──────────────────────────────────────────────────────────────────

function FaxRow({ fax, isLast }: { fax: SentFaxItem; isLast?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/app/sent/${fax.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 20px',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
        borderLeft: fax.status === 'failed' ? '3px solid var(--color-failed)' : '3px solid transparent',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
        textDecoration: 'none',
        background: hovered ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
      }}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        onClick={e => e.stopPropagation()}
        style={{ width: 16, height: 16, flexShrink: 0, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
      />

      {/* Avatar */}
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
        {fax.initials}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Row 1: recipient · subject */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
          }}>
            {fax.recipient}
          </span>
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14, flexShrink: 0 }}> · </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {fax.subject}
          </span>
        </div>

        {/* Row 2: status · via · tags */}
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
          {fax.status === 'delivered' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-delivered)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                Delivered
              </span>
            </div>
          )}
          {fax.status === 'failed' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-failed)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--color-failed)' }}>
                Failed · {fax.attempts} attempts
              </span>
            </div>
          )}
          {fax.status === 'inflight' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-processing)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-processing)' }}>
                In flight · Connecting
              </span>
            </div>
          )}

          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-tertiary)',
            marginLeft: 12,
          }}>
            via {fax.via}
          </span>

          {/* Tags right-aligned */}
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            {fax.tags.map(tag => (
              <span key={tag.label} style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 18,
                padding: '0 6px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.03em',
                marginLeft: 4,
                background: tag.bg,
                color: tag.color,
              }}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right metadata */}
      <div style={{
        flexShrink: 0,
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          {fax.time}
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          {fax.pages}p
        </span>
      </div>
    </Link>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SentPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const recentSearches = [
    'BlueShield Prior Auth',
    'Authorization request A24189',
    'Aetna Claims',
    'Failed faxes',
    'Prior auth',
  ];

  const frequentRecipients = [
    { initials: 'BP', name: 'BlueShield', count: 31 },
    { initials: 'AC', name: 'Aetna Claims', count: 24 },
    { initials: 'PL', name: 'Pacific Lab', count: 18 },
    { initials: 'NI', name: 'NW Imaging', count: 12 },
    { initials: 'GH', name: 'Group Health', count: 8 },
  ];

  const q = searchValue.toLowerCase();
  const filtered = sentFaxes.filter(f => {
    if (activeTab === 'delivered' && f.status !== 'delivered') return false;
    if (activeTab === 'failed'    && f.status !== 'failed')    return false;
    if (activeTab === 'inflight'  && f.status !== 'inflight')  return false;
    if (q && !`${f.recipient} ${f.subject}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Page header */}
      <div style={{
        padding: '32px 0 24px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 4,
          }}>
            SENT · 8 FAXES
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.15,
          }}>
            Your sent faxes · All numbers
          </h1>
        </div>
        <Button variant="primary" style={{ alignSelf: 'center' }}>
          <I.Plus size={14} strokeWidth={2.4} /> New fax
        </Button>
      </div>

      {/* Search bar — sits on page background */}
      <div style={{ position: 'relative', width: 480, marginBottom: 16 }}>
        <svg
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--color-text-tertiary)', pointerEvents: 'none', zIndex: 1 }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          placeholder="Search sent faxes..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
          style={{
            width: '100%', height: '36px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '0 16px 0 38px',
            fontSize: '13px', fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg)',
            outline: 'none', boxSizing: 'border-box',
          }}
        />

        {searchFocused && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            width: '480px', background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-panel)',
            zIndex: 100, overflow: 'hidden',
          }}>
            {searchValue === '' ? (
              <>
                {recentSearches.map(search => (
                  <div
                    key={search}
                    onMouseDown={() => { setSearchValue(search); setSearchFocused(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {search}
                  </div>
                ))}

                <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                <div style={{ padding: '6px 16px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                  Frequent recipients
                </div>
                <div style={{ padding: '6px 16px 10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {frequentRecipients.map(contact => (
                    <div
                      key={contact.name}
                      onMouseDown={() => { setSearchValue(contact.name); setSearchFocused(false); }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        height: '30px', padding: '0 10px 0 6px',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        background: 'white', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '12px',
                        fontWeight: 500, color: 'var(--color-text-primary)',
                        transition: 'all var(--duration-fast)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-subtle)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'white'; }}
                    >
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                        fontSize: '9px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {contact.initials}
                      </div>
                      {contact.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {recentSearches.filter(s => s.toLowerCase().includes(searchValue.toLowerCase())).map(search => (
                  <div
                    key={search}
                    onMouseDown={() => { setSearchValue(search); setSearchFocused(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {search}
                  </div>
                ))}
                {frequentRecipients.filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase())).map(contact => (
                  <div
                    key={contact.name}
                    onMouseDown={() => { setSearchValue(contact.name); setSearchFocused(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'var(--color-primary-subtle)',
                      color: 'var(--color-primary)',
                      fontSize: '9px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {contact.initials}
                    </div>
                    {contact.name}
                  </div>
                ))}
                {recentSearches.filter(s => s.toLowerCase().includes(searchValue.toLowerCase())).length === 0 &&
                 frequentRecipients.filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
                  <div style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                    No suggestions
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Main list card */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}>

        {/* Filter tabs row */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === tab.id ? 'var(--color-primary)' : (hoveredTab === tab.id ? 'var(--color-primary-subtle)' : 'transparent'),
                color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
                transition: `background var(--duration-fast)`,
              }}
            >
              {tab.label}
              <span style={{
                fontSize: 13,
                color: activeTab === tab.id ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)',
              }}>
                {tab.count}
              </span>
            </button>
          ))}

          <div style={{
            borderLeft: '1px solid var(--color-border)',
            paddingLeft: 16,
            marginLeft: 8,
            display: 'flex',
            gap: 8,
          }}>
            {['Number', 'Recipient'].map(label => (
              <button key={label} style={{
                height: 30,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0 10px',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}>
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Column header row */}
        <div style={{
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <input
            type="checkbox"
            style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-tertiary)',
          }}>
            {filtered.length} faxes
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}>
              Newest ↓
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}>
              ↓ Export CSV
            </button>
          </div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{
            padding: '64px 20px',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-text-tertiary)',
          }}>
            Nothing here. Try another filter.
          </div>
        ) : (
          filtered.map((fax, i) => <FaxRow key={fax.id} fax={fax} isLast={i === filtered.length - 1} />)
        )}
      </div>
    </div>
  );
}
