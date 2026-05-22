'use client';

// =============================================================================
// ControlsBar — tabs (Active/Declined), view toggle (Pipeline/Table/Calendar,
// only Pipeline live), and dummy filter chips (Time/Source/Owner).
//
// Per FE-054 structural surprise #2, there is no working search in
// Phase 8; the chips are visual placeholders only.
// =============================================================================

import { useState, type ReactNode } from 'react';

export type TabKey = 'active' | 'declined';
export type ViewKey = 'pipeline' | 'table' | 'calendar';

type Props = {
  activeTab: TabKey;
  setActiveTab: (k: TabKey) => void;
  activeView: ViewKey;
  setActiveView: (v: ViewKey) => void;
};

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active
          ? 'var(--color-primary)'
          : hover
          ? 'var(--color-primary-subtle)'
          : 'transparent',
        color: active ? 'white' : 'var(--color-text-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '7px 16px',
        fontFamily: 'Sora, var(--font-body), system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        transition: 'background var(--duration-fast), color var(--duration-fast)',
      }}
    >
      {children}
    </button>
  );
}

function ViewToggleIcon({ kind, active }: { kind: ViewKey; active: boolean }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-tertiary)';
  if (kind === 'pipeline') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="5" height="16" rx="1.5" />
        <rect x="10" y="4" width="5" height="11" rx="1.5" />
        <rect x="17" y="4" width="4" height="7" rx="1.5" />
      </svg>
    );
  }
  if (kind === 'table') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M3 15h18" />
        <path d="M10 4v16" />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9h18" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </svg>
  );
}

export function ControlsBar({
  activeTab,
  setActiveTab,
  activeView,
  setActiveView,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}
    >
      {/* Tab switcher */}
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-pill)',
          padding: 4,
          boxShadow: 'var(--shadow-card)',
          gap: 2,
        }}
      >
        <TabPill active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
          Active
        </TabPill>
        <TabPill active={activeTab === 'declined'} onClick={() => setActiveTab('declined')}>
          Declined
        </TabPill>
      </div>

      {/* View toggle */}
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-card)',
          padding: 4,
          gap: 2,
        }}
      >
        {(['pipeline', 'table', 'calendar'] as ViewKey[]).map(v => {
          const active = activeView === v;
          const disabled = v !== 'pipeline';
          return (
            <button
              key={v}
              onClick={() => {
                if (!disabled) setActiveView(v);
              }}
              title={v.charAt(0).toUpperCase() + v.slice(1)}
              style={{
                width: 32,
                height: 28,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? 'var(--color-primary-subtle)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.45 : 1,
              }}
            >
              <ViewToggleIcon kind={v} active={active} />
            </button>
          );
        })}
      </div>

      {/* Dummy filter chips — visual placeholder, no interactivity in Phase 8 */}
      <div style={{ display: 'inline-flex', gap: 8, marginLeft: 'auto' }}>
        {['Time', 'Source', 'Owner'].map(label => (
          <button
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 32,
              padding: '0 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border-strong)',
              background: 'white',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {label}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
