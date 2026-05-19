'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const TEMPLATES = [
  { id: 1, name: 'Standard cover page', category: 'Cover pages', uses: '1,284', lastUsed: 'Used today', createdBy: 'A. Park', isDefault: true },
  { id: 2, name: 'BlueShield prior auth', category: 'Prior auth', uses: '412', lastUsed: 'Used 1d ago', createdBy: 'A. Park', isDefault: false },
  { id: 3, name: 'Aetna prior auth', category: 'Prior auth', uses: '287', lastUsed: 'Used 3d ago', createdBy: 'M. Torres', isDefault: false },
  { id: 4, name: 'Cardiology referral', category: 'Referrals', uses: '198', lastUsed: 'Used 2d ago', createdBy: 'A. Park', isDefault: false },
  { id: 5, name: 'Records request — standard', category: 'Records request', uses: '176', lastUsed: 'Used 5d ago', createdBy: 'J. Kim', isDefault: false },
  { id: 6, name: 'Legal hold notice', category: 'Legal', uses: '44', lastUsed: 'Used 12d ago', createdBy: 'A. Park', isDefault: false },
  { id: 7, name: 'Patient consent cover', category: 'Cover pages', uses: '391', lastUsed: 'Used 1d ago', createdBy: 'M. Torres', isDefault: false },
  { id: 8, name: 'Lab order routing', category: 'Records request', uses: '89', lastUsed: 'Used 4d ago', createdBy: 'J. Kim', isDefault: false },
];

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  'Cover pages':      { color: 'var(--color-primary)',    bg: 'var(--color-primary-subtle)' },
  'Prior auth':       { color: 'var(--color-phi)',        bg: 'var(--color-phi-bg)' },
  'Referrals':        { color: 'var(--color-processing)', bg: 'var(--color-processing-bg)' },
  'Records request':  { color: 'var(--color-review)',     bg: 'var(--color-review-bg)' },
  'Legal':            { color: 'var(--color-archived)',   bg: 'var(--color-archived-bg)' },
};

const TABS = ['All', 'Cover pages', 'Prior auth', 'Referrals', 'Records request', 'Legal'];

const SKELETON_WIDTHS = ['90%', '75%', '85%', '60%', '70%'];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter(t => {
    const matchesTab = activeTab === 'All' || t.category === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 32px 48px',
      scrollbarWidth: 'none',
    }}>
      {/* PAGE HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: '32px',
        paddingBottom: '24px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            TEMPLATES · 24 SAVED
          </div>
          <h1 style={{
            fontFamily: 'var(--font-outfit)',
            fontWeight: 700,
            fontSize: '30px',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Your fax templates.
          </h1>
          <p style={{
            fontFamily: 'var(--font-sora)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            marginTop: '4px',
            marginBottom: 0,
          }}>
            Pre-built fax layouts for recurring sends. Select a template to pre-fill the compose form.
          </p>
        </div>
        <div style={{ flexShrink: 0, marginTop: '4px' }}>
          <Button variant="primary" size="md">+ New template</Button>
        </div>
      </div>

      {/* SEARCH BAR — standalone, no card */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '42px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-card)',
          padding: '0 16px',
          maxWidth: '380px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-sora)',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* FILTER TABS ROW — standalone, no card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: 'var(--font-sora)',
                fontSize: '13px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--color-text-secondary)',
                transition: 'background var(--duration-fast)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <span style={{
          fontFamily: 'var(--font-sora)',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
        }}>
          Sort: Most used ▾
        </span>
      </div>

      {/* CARD GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
      }}>
        {filtered.map(template => {
          const catStyle = CATEGORY_STYLES[template.category] || CATEGORY_STYLES['Cover pages'];
          return (
            <div
              key={template.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-panel)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* PREVIEW AREA */}
              <div style={{
                height: '108px',
                width: '100%',
                background: 'var(--color-bg)',
                position: 'relative',
                overflow: 'hidden',
                display: 'block',
              }}>
                {/* Skeleton lines — pushed down to avoid overlap with pill */}
                <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '12px', paddingRight: '12px' }}>
                  {SKELETON_WIDTHS.slice(0, 4).map((w, i) => (
                    <div key={i} style={{
                      height: i % 2 === 0 ? '7px' : '6px',
                      width: w,
                      background: 'var(--color-border)',
                      borderRadius: '3px',
                    }} />
                  ))}
                </div>
                {/* Category pill */}
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  zIndex: 10,
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'red',
                  color: 'white',
                  display: 'block',
                  pointerEvents: 'none',
                }}>
                  {template.category}
                </span>
                {/* Default badge */}
                {template.isDefault && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-primary)',
                    color: 'white',
                  }}>
                    Default
                  </span>
                )}
              </div>

              {/* CARD BODY */}
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                  marginBottom: '5px',
                }}>
                  {template.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sora)',
                  fontSize: '11px',
                  color: 'var(--color-text-tertiary)',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{template.uses}×</span>
                  <span>·</span>
                  <span>{template.lastUsed}</span>
                  <span>·</span>
                  <span>{template.createdBy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
