'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

type Category = 'Cover pages' | 'Prior auth' | 'Referrals' | 'Records request' | 'Legal';

const CATEGORY_COLORS: Record<Category, { text: string; bg: string }> = {
  'Cover pages':     { text: 'var(--color-primary)',   bg: 'var(--color-primary-subtle)' },
  'Prior auth':      { text: 'var(--color-phi)',        bg: 'var(--color-phi-bg)' },
  'Referrals':       { text: 'var(--color-processing)', bg: 'var(--color-processing-bg)' },
  'Records request': { text: 'var(--color-review)',     bg: 'var(--color-review-bg)' },
  'Legal':           { text: 'var(--color-archived)',   bg: 'var(--color-archived-bg)' },
};

interface Template {
  id: string;
  name: string;
  category: Category;
  usageCount: string;
  lastUsed: string;
  createdBy: string;
  isDefault?: boolean;
}

const TEMPLATES: Template[] = [
  { id: '1', name: 'Standard cover page',        category: 'Cover pages',     usageCount: '1,284×', lastUsed: 'Used today',   createdBy: 'A. Park',   isDefault: true },
  { id: '2', name: 'BlueShield prior auth',      category: 'Prior auth',      usageCount: '412×',   lastUsed: 'Used 1d ago',  createdBy: 'A. Park' },
  { id: '3', name: 'Aetna prior auth',           category: 'Prior auth',      usageCount: '287×',   lastUsed: 'Used 3d ago',  createdBy: 'M. Torres' },
  { id: '4', name: 'Cardiology referral',        category: 'Referrals',       usageCount: '198×',   lastUsed: 'Used 2d ago',  createdBy: 'A. Park' },
  { id: '5', name: 'Records request — standard', category: 'Records request', usageCount: '176×',   lastUsed: 'Used 5d ago',  createdBy: 'J. Kim' },
  { id: '6', name: 'Legal hold notice',          category: 'Legal',           usageCount: '44×',    lastUsed: 'Used 12d ago', createdBy: 'A. Park' },
  { id: '7', name: 'Patient consent cover',      category: 'Cover pages',     usageCount: '391×',   lastUsed: 'Used 1d ago',  createdBy: 'M. Torres' },
  { id: '8', name: 'Lab order routing',          category: 'Records request', usageCount: '89×',    lastUsed: 'Used 4d ago',  createdBy: 'J. Kim' },
];

const FILTERS = ['All', 'Cover pages', 'Prior auth', 'Referrals', 'Records request', 'Legal'] as const;
type Filter = typeof FILTERS[number];

const SKELETON_LINES: { width: string; height: number }[] = [
  { width: '90%', height: 8 },
  { width: '75%', height: 6 },
  { width: '85%', height: 8 },
  { width: '60%', height: 6 },
  { width: '70%', height: 8 },
];

function TemplateCard({ template }: { template: Template }) {
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[template.category];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: hovered ? 'var(--shadow-panel)' : 'var(--shadow-card)',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)`,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Preview area */}
      <div style={{ height: 108, background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ margin: '8px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SKELETON_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                height: line.height,
                width: line.width,
                background: 'var(--color-border)',
                borderRadius: 3,
              }}
            />
          ))}
        </div>

        {/* Category pill */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: colors.bg,
          color: colors.text,
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          borderRadius: 'var(--radius-pill)',
          padding: '3px 8px',
        }}>
          {template.category}
        </div>

        {/* Default badge */}
        {template.isDefault && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'var(--color-primary)',
            color: 'white',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            borderRadius: 'var(--radius-pill)',
            padding: '2px 8px',
          }}>
            Default
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(61,80,128,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: `opacity var(--duration-fast) var(--ease-out)`,
          pointerEvents: hovered ? 'auto' : 'none',
        }}>
          <Button variant="secondary" size="sm">
            Use template →
          </Button>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 5,
          lineHeight: 1.3,
        }}>
          {template.name}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
        }}>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{template.usageCount}</span>
          <span>·</span>
          <span>{template.lastUsed}</span>
          <span>·</span>
          <span>{template.createdBy}</span>
        </div>
      </div>
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        border: 'none',
        background: active
          ? 'var(--color-primary)'
          : hovered
            ? 'var(--color-primary-subtle)'
            : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        transition: `background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || t.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 32px 48px',
      scrollbarWidth: 'none',
    }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Page header */}
      <div style={{
        paddingTop: 32,
        paddingBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            TEMPLATES · 24 SAVED
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 30,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.15,
          }}>
            Your fax templates.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            marginTop: 4,
            marginBottom: 0,
            lineHeight: 1.5,
          }}>
            Pre-built fax layouts for recurring sends. Select a template to pre-fill the compose form.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <Button variant="primary" size="md">+ New template</Button>
        </div>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search templates…"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: 380,
          height: 42,
          background: 'var(--color-surface)',
          border: searchFocused
            ? '1px solid var(--color-primary)'
            : '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: searchFocused
            ? '0 0 0 3px rgba(61,80,128,0.12)'
            : 'var(--shadow-card)',
          padding: '0 16px',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--color-text-primary)',
          outline: 'none',
          marginBottom: 16,
          transition: `border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)`,
        }}
      />

      {/* Filter + sort row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {FILTERS.map(filter => (
            <FilterTab
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>
        <button style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          padding: '6px 4px',
          whiteSpace: 'nowrap',
        }}>
          Sort: Most used ▾
        </button>
      </div>

      {/* Template grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}>
        {filtered.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
