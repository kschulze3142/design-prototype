'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  mockIntakeFaxes,
  mockActivityFeed,
  type IntakeFax,
  type UrgencyLevel,
} from './mockData';

// ─── INLINE ICONS (HeroIcons outline-style) ────────────────────────────────────

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const Svg = ({ size = 16, color = 'currentColor', strokeWidth = 1.6, children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const PrinterIcon = (p: IconProps) => <Svg {...p}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></Svg>;
const ArrowDownTrayIcon = (p: IconProps) => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></Svg>;
const ArrowUturnRightIcon = (p: IconProps) => <Svg {...p}><path d="M21 11V7a2 2 0 0 0-2-2H6" /><path d="m9 8-3-3 3-3" /><path d="M3 13v4a2 2 0 0 0 2 2h16" /></Svg>;
const CheckCircleIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Svg>;
const DocumentTextIcon = (p: IconProps) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 13h6" /><path d="M9 17h4" /></Svg>;
const ClipboardDocumentCheckIcon = (p: IconProps) => <Svg {...p}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></Svg>;
const UserIcon = (p: IconProps) => <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Svg>;
const ArrowTopRightOnSquareIcon = (p: IconProps) => <Svg {...p}><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></Svg>;
const ClockIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
const InboxArrowDownIcon = (p: IconProps) => <Svg {...p}><path d="M22 13h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" /><path d="M12 4v6" /><path d="m9 7 3 3 3-3" /></Svg>;
const EyeIcon = (p: IconProps) => <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Svg>;
const PaperAirplaneIcon = (p: IconProps) => <Svg {...p}><path d="M22 2 11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7Z" /></Svg>;
const ChatBubbleLeftIcon = (p: IconProps) => <Svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></Svg>;
const DocIcon = (p: IconProps) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></Svg>;

// ─── DESIGN TOKENS (a couple of literals used inline) ──────────────────────────

const URGENCY_DOT: Record<UrgencyLevel, string> = {
  overdue: '#fb7185', // rose-400
  soon: '#fbbf24',    // amber-400
  normal: 'var(--color-border-strong)',
};

const SLA_BADGE: Record<UrgencyLevel, { bg: string; color: string } | null> = {
  overdue: { bg: '#ffe4e6', color: '#e11d48' }, // rose-100 / rose-600
  soon:    { bg: '#fef3c7', color: '#b45309' }, // amber-100 / amber-700
  normal:  null,
};

const REPEAT_SENDER = {
  name: 'Foothill Clinic',
  faxNumber: '8015550177',
  countThisWeek: 4,
};

const ACTIVITY_ICON: Record<string, { Icon: (p: IconProps) => React.ReactElement; color: string }> = {
  received: { Icon: InboxArrowDownIcon, color: '#0d9488' },               // teal-600
  assigned: { Icon: UserIcon,           color: 'var(--color-primary)' },
  viewed:   { Icon: EyeIcon,            color: 'var(--color-text-tertiary)' },
  template: { Icon: PaperAirplaneIcon,  color: '#7c3aed' },               // violet
  note:     { Icon: ChatBubbleLeftIcon, color: '#d97706' },               // amber
};

// ─── LEFT PANEL ────────────────────────────────────────────────────────────────

type TabId = 'all' | 'mine' | 'team' | 'waiting';
const TABS: { id: TabId; label: string }[] = [
  { id: 'all',     label: 'All'     },
  { id: 'mine',    label: 'Mine'    },
  { id: 'team',    label: 'Team'    },
  { id: 'waiting', label: 'Waiting' },
];

function FilterChip({ label }: { label: string }) {
  return (
    <button style={{
      height: 28,
      padding: '0 10px',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-pill)',
      background: 'white',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
    }}>
      {label}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

function FaxRow({ fax, selected, onSelect }: { fax: IntakeFax; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const slaBadge = SLA_BADGE[fax.slaLevel];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 12px 12px 18px',
        cursor: 'pointer',
        background: selected ? 'var(--color-primary-subtle)' : (hovered ? 'var(--color-primary-subtle)' : 'transparent'),
        borderLeft: selected ? '3px solid var(--color-primary)' : '3px solid transparent',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      {/* Urgency dot */}
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: URGENCY_DOT[fax.slaLevel],
        flexShrink: 0,
        marginTop: 6,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Row 1: sender + time */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {fax.senderName}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--color-text-tertiary)',
            flexShrink: 0,
          }}>
            {fax.receivedAt}
          </span>
        </div>

        {/* Row 2: subject */}
        <div style={{
          marginTop: 2,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {fax.subject}
        </div>

        {/* Row 3: type tag · owner · SLA badge */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 18,
            padding: '0 6px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
          }}>
            {fax.type}
          </span>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--color-surface-dark)',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {fax.owner.initials}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--color-text-tertiary)',
            }}>
              {fax.owner.name}
            </span>
          </div>

          {slaBadge && (
            <span style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              height: 18,
              padding: '0 6px',
              borderRadius: 'var(--radius-pill)',
              background: slaBadge.bg,
              color: slaBadge.color,
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 700,
            }}>
              {fax.slaDueLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LeftPanel({
  faxes, selectedId, onSelect, activeTab, setActiveTab,
}: {
  faxes: IntakeFax[];
  selectedId: string;
  onSelect: (id: string) => void;
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
}) {
  return (
    <div style={{
      width: 360,
      flexShrink: 0,
      background: 'white',
      borderRight: '1px solid var(--color-border)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: 0,
          lineHeight: 1.15,
        }}>
          Intake
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          margin: '2px 0 0',
        }}>
          Incoming fax queue
        </p>
      </div>

      {/* View tabs */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 4 }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: active ? 'var(--color-primary)' : 'transparent',
                color: active ? 'white' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter chips */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: 6 }}>
        <FilterChip label="Type" />
        <FilterChip label="Status" />
      </div>

      {/* List */}
      <div style={{ borderTop: '1px solid var(--color-border)' }}>
        {faxes.map(fax => (
          <FaxRow
            key={fax.id}
            fax={fax}
            selected={fax.id === selectedId}
            onSelect={() => onSelect(fax.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── RIGHT PANEL ───────────────────────────────────────────────────────────────

function ToolbarIconButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: 'transparent',
        color: hovered ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}

function DocPreviewPlaceholder({ fax }: { fax: IntakeFax }) {
  const [activePage, setActivePage] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: '100%',
        maxWidth: 560,
        aspectRatio: '8.5 / 11',
        background: 'var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: 'var(--color-text-tertiary)',
      }}>
        <DocIcon size={56} color="var(--color-text-tertiary)" strokeWidth={1.4} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          {fax.pages}-page fax · {fax.type}
        </div>
      </div>

      {/* Page dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: fax.pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActivePage(i)}
            aria-label={`Page ${i + 1}`}
            style={{
              width: 10, height: 10, borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: i === activePage ? 'var(--color-primary)' : 'var(--color-border-strong)',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PropertyRow({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-text-tertiary)',
      }}>
        {label}
      </span>
      <select
        defaultValue={value}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-primary)',
          background: 'transparent',
          border: 'none',
          textAlign: 'right',
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          paddingRight: 14,
          backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238896aa' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '10px',
          maxWidth: 180,
          textOverflow: 'ellipsis',
        }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-text-tertiary)',
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function TemplateRow({ Icon, label }: { Icon: (p: IconProps) => React.ReactElement; label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--color-text-secondary)', display: 'inline-flex' }}>
          <Icon size={16} />
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-primary)' }}>
          {label}
        </span>
      </div>
      <Button variant="primary" size="sm" style={{ height: 26, padding: '0 12px', fontSize: 12 }}>
        Send
      </Button>
    </div>
  );
}

function OtherActionRow({ Icon, label }: { Icon: (p: IconProps) => React.ReactElement; label: string }) {
  return (
    <a href="#" onClick={e => e.preventDefault()} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 0',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--color-primary)',
      textDecoration: 'none',
      fontWeight: 600,
    }}>
      <Icon size={16} />
      {label}
    </a>
  );
}

function ActivityFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {mockActivityFeed.map((event, i) => {
        const { Icon, color } = ACTIVITY_ICON[event.icon];
        const isLast = i === mockActivityFeed.length - 1;
        return (
          <div key={event.id} style={{ display: 'flex', gap: 10, position: 'relative' }}>
            {/* Left column: icon + connector */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'white',
                border: `1.5px solid ${color}`,
                color,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}>
                <Icon size={12} />
              </div>
              {!isLast && (
                <div style={{
                  flex: 1,
                  width: 1.5,
                  background: 'var(--color-border)',
                  marginTop: 2,
                  marginBottom: 2,
                }} />
              )}
            </div>

            {/* Right column: label + time */}
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
              paddingBottom: isLast ? 0 : 14,
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--color-text-primary)',
                lineHeight: 1.35,
              }}>
                {event.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--color-text-tertiary)',
                flexShrink: 0,
              }}>
                {event.time}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Inspector({ fax }: { fax: IntakeFax }) {
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  const SECTION_DIVIDER = (
    <div style={{ height: 1, background: 'var(--color-border)', margin: '16px 0' }} />
  );

  const STATUS_LABELS: Record<IntakeFax['status'], string> = {
    unread: 'Unread', in_review: 'In review', resolved: 'Resolved', waiting: 'Waiting',
  };

  return (
    <div style={{
      width: 320,
      flexShrink: 0,
      borderLeft: '1px solid var(--color-border)',
      padding: '16px 20px',
      overflowY: 'auto',
      background: 'white',
    }}>
      {/* Section 1 — Properties */}
      <div>
        <PropertyRow label="Document type" value={fax.type} options={['Referral Rx', 'Lab Results', 'Insurance Card', 'H&P', 'Prior Auth', 'Other']} />
        <PropertyRow label="Patient" value={fax.patientName ?? '—'} options={[fax.patientName ?? '—', 'Eleanor Vance', 'Henry Tobias', 'Marcus Whitfield']} />
        <PropertyRow label="Owner" value={fax.owner.name} options={['Amelia Park', 'Jordan Reyes', 'Sam Levin']} />
        <PropertyRow label="Status" value={STATUS_LABELS[fax.status]} options={['Unread', 'In review', 'Waiting', 'Resolved']} />
        <PropertyRow label="Due" value={fax.slaDueLabel || '—'} options={[fax.slaDueLabel || '—', 'Overdue', '1h 20m', '4h remaining']} />
      </div>

      {SECTION_DIVIDER}

      {/* Section 2 — Reply with template */}
      <div>
        <SectionHeading>Reply with template</SectionHeading>
        <TemplateRow Icon={CheckCircleIcon} label="Send acknowledgment" />
        <TemplateRow Icon={DocumentTextIcon} label="Request records" />
        <TemplateRow Icon={ClipboardDocumentCheckIcon} label="Prior auth cover sheet" />
      </div>

      {SECTION_DIVIDER}

      {/* Section 3 — Other actions */}
      <div>
        <SectionHeading>Other actions</SectionHeading>
        <OtherActionRow Icon={UserIcon} label="Reassign" />
        <OtherActionRow Icon={ArrowTopRightOnSquareIcon} label="Forward to provider" />
        <OtherActionRow Icon={ClockIcon} label="Snooze" />
      </div>

      {!suggestionDismissed && SECTION_DIVIDER}

      {/* Section 4 — Inline rule suggestion chip */}
      {!suggestionDismissed && (
        <div style={{
          border: '2px solid #0d9488',
          borderRadius: 'var(--radius-md)',
          background: '#f0fdfa',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, lineHeight: 1.4 }}>⚡</span>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--color-text-primary)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              <strong>Repeat sender detected.</strong> This is the {REPEAT_SENDER.countThisWeek}th fax from{' '}
              <strong>{REPEAT_SENDER.name}</strong> this week — would you like all future faxes from this
              number to auto-assign to the Intake team with a 4-hour SLA?
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setSuggestionDismissed(true)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--color-text-tertiary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Dismiss
            </button>
            <Link
              href={`/app/settings?section=automations&prefill_fax=${REPEAT_SENDER.faxNumber}`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 600,
                color: '#0d9488',
                background: '#ccfbf1',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Create rule →
            </Link>
          </div>
        </div>
      )}

      {SECTION_DIVIDER}

      {/* Section 5 — Activity feed */}
      <div>
        <SectionHeading>Activity</SectionHeading>
        <ActivityFeed />
      </div>
    </div>
  );
}

function RightPanel({ fax }: { fax: IntakeFax | undefined }) {
  if (!fax) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-tertiary)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
      }}>
        Select a fax to view details
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
    }}>
      {/* Top toolbar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-tertiary)',
        }}>
          From {fax.senderFax}  ·  {fax.pages} pages  ·  Received {fax.receivedAt}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ToolbarIconButton><PrinterIcon size={18} /></ToolbarIconButton>
          <ToolbarIconButton><ArrowDownTrayIcon size={18} /></ToolbarIconButton>
          <ToolbarIconButton><ArrowUturnRightIcon size={18} /></ToolbarIconButton>
        </div>

        <Button variant="primary">Mark resolved</Button>
      </div>

      {/* Content area: doc preview + inspector */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Doc preview */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 32px 48px',
          background: 'var(--color-bg)',
        }}>
          <DocPreviewPlaceholder fax={fax} />
        </div>

        {/* Inspector */}
        <Inspector fax={fax} />
      </div>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string>('f1');
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const selectedFax = mockIntakeFaxes.find(f => f.id === selectedId);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      margin: '0 -32px',
      background: 'var(--color-bg)',
    }}>
      <LeftPanel
        faxes={mockIntakeFaxes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <RightPanel fax={selectedFax} />
    </div>
  );
}
