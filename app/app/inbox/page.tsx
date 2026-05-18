'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { I } from '@/components/app/icons';
import { Button } from '@/components/ui/Button';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Tag { label: string; bg: string; color: string }

interface FaxItem {
  id: string;
  initials: string;
  sender: string;
  subject: string;
  routing: { type: 'auto'; to: string; team: string } | { type: 'needs' };
  tags: Tag[];
  time: string;
  pages: number;
  unread: boolean;
  starred: boolean;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const inboxNumbers = [
  { label: 'All inboxes', number: 'all', badge: 4 },
  { label: 'Cardiology · 0142', number: '0142', badge: 2, full: '+1 (206) 555-0142' },
  { label: 'Front desk · 0319', number: '0319', badge: 1, full: '+1 (206) 555-0319' },
  { label: 'Toll-free · 0903',  number: '0903', badge: 1, full: '+1 (888) 555-0903' },
];

const faxes: FaxItem[] = [
  {
    id: 'FX-IN-3382',
    initials: 'PL',
    sender: 'Pacific Lab Diagnostics',
    subject: 'Lab results · Patient A24189',
    routing: { type: 'auto', to: 'Dr. M. Greaves', team: 'Cardiology' },
    tags: [
      { label: 'PHI',  bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'LABS', bg: 'var(--color-processing-bg)', color: 'var(--color-processing)' },
    ],
    time: '11:14 AM', pages: 4, unread: true, starred: true,
  },
  {
    id: 'FX-IN-3380',
    initials: 'GH',
    sender: 'Group Health · Referrals',
    subject: 'Referral acknowledgement — Cardiology',
    routing: { type: 'auto', to: 'Dr. M. Greaves', team: 'Cardiology' },
    tags: [
      { label: 'REFERRAL', bg: '#f0fdf4', color: '#16a34a' },
    ],
    time: '10:47 AM', pages: 2, unread: true, starred: false,
  },
  {
    id: 'FX-IN-3379',
    initials: 'AC',
    sender: 'Aetna Claims',
    subject: 'EOB · claim 882-31',
    routing: { type: 'auto', to: 'Billing team', team: '' },
    tags: [
      { label: 'BILLING', bg: '#fffbeb', color: '#92400e' },
      { label: 'EOB',     bg: '#fffbeb', color: '#92400e' },
    ],
    time: '9:32 AM', pages: 6, unread: true, starred: false,
  },
  {
    id: 'FX-IN-3378',
    initials: 'DR',
    sender: "Dr. Rivera's Office",
    subject: 'Patient transfer summary',
    routing: { type: 'needs' },
    tags: [
      { label: 'PHI',      bg: 'var(--color-phi-bg)',      color: 'var(--color-phi)' },
      { label: 'TRANSFER', bg: 'var(--color-archived-bg)', color: 'var(--color-archived)' },
    ],
    time: '8:14 AM', pages: 9, unread: true, starred: false,
  },
  {
    id: 'FX-IN-3376',
    initials: 'SM',
    sender: 'Swedish Medical · ROI',
    subject: 'Records request response',
    routing: { type: 'auto', to: 'Records team', team: '' },
    tags: [
      { label: 'PHI', bg: 'var(--color-phi-bg)',      color: 'var(--color-phi)' },
      { label: 'ROI', bg: 'var(--color-archived-bg)', color: 'var(--color-archived)' },
    ],
    time: 'Yesterday', pages: 84, unread: false, starred: true,
  },
  {
    id: 'FX-IN-3374',
    initials: 'QD',
    sender: 'Quest Diagnostics',
    subject: 'Pathology · A23104',
    routing: { type: 'auto', to: 'Dr. M. Greaves', team: 'Cardiology' },
    tags: [
      { label: 'PHI',       bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'PATHOLOGY', bg: '#faf5ff',                    color: '#7c3aed' },
    ],
    time: 'Yesterday', pages: 5, unread: false, starred: false,
  },
  {
    id: 'FX-IN-3371',
    initials: 'BP',
    sender: 'BlueShield Prior Auth',
    subject: 'Auth approved — #A24189',
    routing: { type: 'auto', to: 'Dr. M. Greaves', team: 'Cardiology' },
    tags: [
      { label: 'AUTH', bg: 'var(--color-primary-subtle)', color: 'var(--color-primary)' },
    ],
    time: 'Mon', pages: 1, unread: false, starred: false,
  },
  {
    id: 'FX-IN-3369',
    initials: 'NI',
    sender: 'Northwest Imaging',
    subject: 'Echo report — A24189',
    routing: { type: 'auto', to: 'Dr. M. Greaves', team: 'Cardiology' },
    tags: [
      { label: 'PHI',     bg: 'var(--color-phi-bg)',        color: 'var(--color-phi)' },
      { label: 'IMAGING', bg: 'var(--color-processing-bg)', color: 'var(--color-processing)' },
    ],
    time: 'Mon', pages: 3, unread: false, starred: false,
  },
];

const TABS = [
  { id: 'all',      label: 'All',      count: 8 },
  { id: 'unread',   label: 'Unread',   count: 4 },
  { id: 'flagged',  label: 'Flagged',  count: 2 },
  { id: 'phi',      label: 'PHI only', count: 7 },
  { id: 'archived', label: 'Archived', count: 0 },
];

// ─── AUTOSUGGEST DATA ─────────────────────────────────────────────────────────

const recentSearches = [
  'Pacific Lab Diagnostics',
  'Prior auth A24189',
  'PHI unread',
  'BlueShield',
  'Lab results',
];

const frequentContacts = [
  { initials: 'PL', name: 'Pacific Lab',     count: 24 },
  { initials: 'BP', name: 'BlueShield',      count: 18 },
  { initials: 'AC', name: 'Aetna Claims',    count: 12 },
  { initials: 'SM', name: 'Swedish Medical', count: 9  },
  { initials: 'GH', name: 'Group Health',    count: 7  },
];

// ─── CONTACT CHIP ─────────────────────────────────────────────────────────────

function ContactChip({ contact, onSelect }: { contact: typeof frequentContacts[0]; onSelect: (name: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={() => onSelect(contact.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 10px 0 6px',
        border: `1px solid ${hovered ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-xl)',
        background: hovered ? 'var(--color-primary-subtle)' : 'white',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--color-text-primary)',
        transition: 'all var(--duration-fast)',
      }}
    >
      <div style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: 'var(--color-primary-subtle)',
        color: 'var(--color-primary)',
        fontSize: 9,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
      }}>
        {contact.initials}
      </div>
      {contact.name}
    </div>
  );
}

// ─── FAX ROW ──────────────────────────────────────────────────────────────────

function FaxRow({ fax }: { fax: FaxItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/app/inbox/${fax.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        paddingTop: 14,
        paddingBottom: 14,
        paddingRight: 32,
        paddingLeft: 29,
        borderBottom: '1px solid var(--color-border)',
        borderLeft: fax.unread ? '3px solid var(--color-primary)' : '3px solid transparent',
        cursor: 'pointer',
        transition: 'background var(--duration-fast) var(--ease-out)',
        position: 'relative',
        textDecoration: 'none',
        background: hovered ? 'var(--color-bg)' : 'white',
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
        {/* Row 1: sender · subject */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: fax.unread ? 700 : 500,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
          }}>
            {fax.sender}
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

        {/* Row 2: routing + tags */}
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          {fax.routing.type === 'auto' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-delivered)', flexShrink: 0,
              }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                → {fax.routing.to}{fax.routing.team ? ` · ${fax.routing.team}` : ''}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-review)', flexShrink: 0,
              }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-review)' }}>
                Needs routing
              </span>
            </div>
          )}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {fax.pages}p
          </span>
          <button
            onClick={e => e.stopPropagation()}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={fax.starred ? 'var(--color-review)' : 'none'}
              stroke={fax.starred ? 'var(--color-review)' : 'var(--color-text-tertiary)'}
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.5l6.4-.6Z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function InboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNumber = searchParams.get('number');

  useEffect(() => {
    if (!activeNumber) {
      router.replace(`/app/inbox?number=all`);
    }
  }, [activeNumber, router]);

  const activeInbox = inboxNumbers.find(n => n.number === activeNumber);
  const headline = activeNumber === 'all' || !activeNumber
    ? 'Your inbound faxes · All inboxes'
    : `Your inbound faxes · ${activeInbox?.label}`;
  const unreadCount = activeNumber === 'all' || !activeNumber ? 4 : (activeInbox?.badge ?? 0);
  const overline = `INBOX · ${unreadCount} UNREAD`;

  const [activeTab, setActiveTab]       = useState('all');
  const [searchValue, setSearchValue]   = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const q = searchValue.toLowerCase();

  const filtered = faxes.filter(f => {
    if (activeTab === 'unread'   && !f.unread)                              return false;
    if (activeTab === 'flagged'  && !f.starred)                             return false;
    if (activeTab === 'phi'      && !f.tags.some(t => t.label === 'PHI'))   return false;
    if (activeTab === 'archived')                                            return false;
    if (q && !`${f.sender} ${f.subject}`.toLowerCase().includes(q))         return false;
    return true;
  });

  const filteredRecent   = recentSearches.filter(s => s.toLowerCase().includes(q));
  const filteredContacts = frequentContacts.filter(c => c.name.toLowerCase().includes(q));

  const showDropdown = searchFocused;

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      margin: '0 -32px',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Page header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
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
            marginBottom: 2,
          }}>
            {overline}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {headline}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{
            position: 'relative',
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={{
              position: 'absolute',
              top: 7,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-failed)',
            }} />
          </button>
          <Button variant="primary">
            <I.Plus size={14} strokeWidth={2.4} /> New fax
          </Button>
        </div>
      </div>

      {/* Row 1 — Search bar */}
      <div style={{
        padding: '12px 32px',
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ position: 'relative', width: '480px' }}>
          {/* Icon — absolutely positioned inside container */}
          <svg
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'var(--color-text-tertiary)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          {/* Input */}
          <input
            type="text"
            placeholder="Search inbox..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            style={{
              width: '100%',
              height: '36px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '0 16px 0 38px',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Autosuggest dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              width: 480,
              background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-panel)',
              zIndex: 100,
              overflow: 'hidden',
            }}>
              {q === '' ? (
                <>
                  {/* Recent searches */}
                  {recentSearches.map(item => (
                    <div
                      key={item}
                      onMouseDown={() => { setSearchValue(item); setSearchFocused(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Clock icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {item}
                    </div>
                  ))}

                  {/* Divider */}
                  <div style={{ height: 1, background: 'var(--color-border)', margin: 0 }} />

                  {/* Frequent contacts label */}
                  <div style={{ padding: '6px 16px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                    Frequent Contacts
                  </div>

                  {/* Contact chips row */}
                  <div style={{ padding: '8px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {frequentContacts.map(c => (
                      <ContactChip key={c.initials} contact={c} onSelect={name => { setSearchValue(name); setSearchFocused(false); }} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Filtered recent searches */}
                  {filteredRecent.map(item => (
                    <div
                      key={item}
                      onMouseDown={() => { setSearchValue(item); setSearchFocused(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {item}
                    </div>
                  ))}

                  {/* Filtered contacts */}
                  {filteredContacts.map(c => (
                    <div
                      key={c.initials}
                      onMouseDown={() => { setSearchValue(c.name); setSearchFocused(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-text-secondary)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                        fontSize: 9,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: 'var(--font-body)',
                      }}>
                        {c.initials}
                      </div>
                      {c.name}
                    </div>
                  ))}

                  {filteredRecent.length === 0 && filteredContacts.length === 0 && (
                    <div style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                      No suggestions
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Row 2 — Filter pills + dropdowns */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px',
        height: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        {/* Primary pills */}
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 12px',
              borderRadius: 'var(--radius-xl)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                fontSize: 13,
                color: activeTab === tab.id ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}

        {/* Secondary dropdown filters */}
        <div style={{
          borderLeft: '1px solid var(--color-border)',
          paddingLeft: 16,
          marginLeft: 8,
          display: 'flex',
          gap: 8,
        }}>
          {['Routing', 'Sender'].map(label => (
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
              gap: 6,
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

      {/* List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-border) transparent',
        background: 'white',
      }}>
        {/* List header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: '8px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <input
            type="checkbox"
            style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {filtered.length} faxes
          </span>
          <button style={{
            marginLeft: 'auto',
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
        </div>

        {filtered.length === 0 ? (
          <div style={{
            padding: '64px 32px',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-text-tertiary)',
          }}>
            Nothing here. Try another filter.
          </div>
        ) : (
          filtered.map(fax => <FaxRow key={fax.id} fax={fax} />)
        )}
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={null}>
      <InboxContent />
    </Suspense>
  );
}
