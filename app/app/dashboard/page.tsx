'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { I } from '@/components/app/icons';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AttentionItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  titleColor: string;
  sub: string;
  arrowColor: string;
  href: string;
  borderColor?: string;
}

interface QueueItem {
  id: string;
  recipient: string;
  number: string;
  pages: number;
  sentBy: string;
  status: 'Transmitting' | 'Connecting' | 'Queued';
  progress: number;
}

interface InboxItem {
  initials: string;
  sender: string;
  subject: string;
  time: string;
  unread: boolean;
}

interface RecentRecipient {
  initials: string;
  name: string;
  number: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const QUEUE_ITEMS: QueueItem[] = [
  { id: 'FX-9824-1A', recipient: 'BlueShield Prior Auth',   number: '+1 (888) 555-0903', pages: 7,  sentBy: 'Dr. M. Greaves', status: 'Transmitting', progress: 0.65 },
  { id: 'FX-9824-1B', recipient: 'Swedish Medical Records', number: '+1 (206) 555-7711', pages: 3,  sentBy: 'A. Park',        status: 'Connecting',   progress: 0 },
  { id: 'FX-9824-1C', recipient: 'Aetna Claims',            number: '+1 (800) 555-2840', pages: 12, sentBy: 'K. Liu',         status: 'Queued',       progress: 0 },
];

const INBOX_ITEMS: InboxItem[] = [
  { initials: 'PL', sender: 'Pacific Lab Diagnostics',  subject: 'Lab results · Patient A24189',          time: '11:14 AM', unread: true },
  { initials: 'GH', sender: 'Group Health · Referrals', subject: 'Referral acknowledgement — Cardiology', time: '10:47 AM', unread: true },
  { initials: 'AC', sender: 'Aetna Claims',             subject: 'EOB · claim 882-31',                    time: '9:32 AM',  unread: true },
  { initials: 'DR', sender: "Dr. Rivera's Office",      subject: 'Patient transfer summary',              time: '8:14 AM',  unread: true },
];

const RECENT_RECIPIENTS: RecentRecipient[] = [
  { initials: 'BP', name: 'BlueShield Prior Auth',   number: '(888) 555-0903' },
  { initials: 'AC', name: 'Aetna Claims',            number: '(800) 555-2840' },
  { initials: 'PL', name: 'Pacific Lab Diagnostics', number: '(206) 555-2840' },
];

const COMPLIANCE_ITEMS = [
  'BAA signed · expires Mar 2026',
  'Audit log healthy · last verified 4h ago',
  'Encryption at rest verified',
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      fontFamily: 'var(--font-body)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function IconCircle({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: bg,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

function AttentionCard({ item }: { item: AttentionItem }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={item.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
        onMouseUp={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; }}
        style={{
          background: hovered ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
          ...(item.borderColor ? { borderLeft: `3px solid ${item.borderColor}` } : {}),
          borderRadius: 'var(--radius-lg)',
          boxShadow: hovered ? 'var(--shadow-card)' : 'var(--shadow-card)',
          transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
          transition: 'all var(--duration-fast) var(--ease-out)',
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          cursor: 'pointer',
        }}
      >
        <IconCircle bg={item.iconBg} color={item.iconColor}>
          {item.icon}
        </IconCircle>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="text-body-strong" style={{ color: item.titleColor }}>{item.title}</div>
          <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>{item.sub}</div>
        </div>
        <span style={{ color: item.arrowColor, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>→</span>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: QueueItem['status'] }) {
  const [tooltipShown, setTooltipShown] = useState(false);
  const map: Record<QueueItem['status'], { bg: string; color: string; tooltip: string }> = {
    Transmitting: { bg: 'var(--color-processing-bg)', color: 'var(--color-processing)', tooltip: 'In progress · started 2m ago' },
    Connecting:   { bg: 'var(--color-review-bg)',     color: 'var(--color-review)',     tooltip: 'Dialing recipient · attempt 1 of 3' },
    Queued:       { bg: 'var(--color-bg)',             color: 'var(--color-text-tertiary)', tooltip: 'Waiting to send · position 3' },
  };
  const s = map[status];
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setTooltipShown(true)}
      onMouseLeave={() => setTooltipShown(false)}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: 'var(--radius-xl)',
        background: s.bg,
        color: s.color,
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}>
        {status}
      </span>
      {tooltipShown && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-surface-dark)',
          color: 'white',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          whiteSpace: 'nowrap',
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          {s.tooltip}
        </div>
      )}
    </div>
  );
}

function RecentRecipientRow({ recipient, isLast }: { recipient: RecentRecipient; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 8px',
        margin: '0 -8px',
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
        background: hovered ? 'var(--color-primary-subtle)' : 'transparent',
        borderRadius: hovered ? 'var(--radius-md)' : 0,
        transition: 'background var(--duration-fast), border-radius var(--duration-fast)',
      }}
    >
      <div style={{ flexShrink: 0, marginRight: 10 }}>
        <Avatar initials={recipient.initials} size={36} />
      </div>
      <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
        <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--color-text-primary)' }}>
          {recipient.name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          {recipient.number}
        </div>
      </div>
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        color: hovered ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
        transition: 'color var(--duration-fast)',
      }}>
        <I.Send size={16} />
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [hoveredInboxRow, setHoveredInboxRow] = useState<number | null>(null);
  const [hoveredQueueRow, setHoveredQueueRow] = useState<number | null>(null);
  const [openLinkHovered, setOpenLinkHovered] = useState(false);

  const attentionItems: AttentionItem[] = [
    {
      icon: <I.Inbox size={20} />,
      iconBg: 'var(--color-primary-subtle)',
      iconColor: 'var(--color-primary)',
      title: '4 unread faxes',
      titleColor: 'var(--color-text-primary)',
      sub: 'Routed to your queue · oldest from 11:14 AM',
      arrowColor: 'var(--color-text-tertiary)',
      href: '/app/inbox?number=all&filter=unread',
    },
    {
      icon: <I.Forward size={20} />,
      iconBg: 'var(--color-review-bg)',
      iconColor: 'var(--color-review)',
      title: '1 fax needs routing',
      titleColor: 'var(--color-review)',
      sub: "Dr. Rivera's Office · Patient transfer summary",
      arrowColor: 'var(--color-review)',
      href: '/app/inbox?number=all&filter=needs-routing',
      borderColor: 'var(--color-review)',
    },
    {
      icon: <I.Zap size={20} />,
      iconBg: 'var(--color-failed-bg)',
      iconColor: 'var(--color-failed)',
      title: '1 fax failed to send',
      titleColor: 'var(--color-failed)',
      sub: 'Group Health · Referrals · 5 attempts · Resend now',
      arrowColor: 'var(--color-failed)',
      href: '/app/sent?filter=failed',
      borderColor: 'var(--color-failed)',
    },
    {
      icon: <I.Shield size={20} />,
      iconBg: 'var(--color-phi-bg)',
      iconColor: 'var(--color-phi)',
      title: '3 PHI faxes unreviewed',
      titleColor: 'var(--color-phi)',
      sub: 'Review within 24h per compliance policy',
      arrowColor: 'var(--color-phi)',
      href: '/app/inbox?number=all&filter=phi',
      borderColor: 'var(--color-phi)',
    },
  ];

  return (
    <div style={{ margin: '0 -32px', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>

      {/* Inline keyframe for progress bar pulse */}
      <style>{`
        @keyframes tx-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        .tx-bar { animation: tx-pulse 1.8s ease-in-out infinite; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{
        padding: '32px 32px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 4,
          }}>TUESDAY · MAY 13</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.15,
          }}>
            Good morning, Amelia.
          </h1>
          <p className="text-body" style={{ margin: 0, marginTop: 2 }}>
            Northwind Health · Cardiology is set up and humming — 47 faxes today, no retries needed.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center' }}>
          <Button variant="primary">
            <I.Plus size={14} strokeWidth={2.4} /> New fax
          </Button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}>

      {/* ── Onboarding Banner ── */}
      {!bannerDismissed && (
        <div style={{
          background: 'var(--color-delivered-bg)',
          border: 'none',
          borderLeft: '3px solid var(--color-delivered)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--color-delivered)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}>
              <I.Check size={10} strokeWidth={2.8} />
            </div>
            <div style={{ marginLeft: 10 }}>
              <span className="text-body-strong">Workspace ready · onboarding complete</span>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: 2 }}>
                2 numbers claimed · 9 teammates invited · BAA signed Mar 22 · routing rules active.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: 24 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--color-primary)',
              }}
            >
              Review setup
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--color-text-tertiary)',
                fontSize: 18,
                lineHeight: 1,
                marginLeft: 16,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 24,
        alignItems: 'start',
      }}>

        {/* Left column */}
        <div>

          {/* Section 1 — Attention Queue */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <div className="text-title">Needs attention</div>
              <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                Items that need your action right now.
              </div>
            </div>
            {attentionItems.map((item, i) => (
              <AttentionCard key={i} item={item} />
            ))}
          </div>

          {/* Section 2 — Live Queue */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div className="text-title">Live queue</div>
                <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                  Outbound faxes in flight or about to send.
                </div>
              </div>
              <Link href="/app/sent" style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--color-primary)',
                alignSelf: 'center',
              }}>
                View all sent →
              </Link>
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUEUE_ITEMS.map((item, i) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredQueueRow(i)}
                  onMouseLeave={() => setHoveredQueueRow(null)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: hoveredQueueRow === i ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    transform: hoveredQueueRow === i ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'all var(--duration-fast) var(--ease-out)',
                    cursor: 'pointer',
                  }}>
                  <span style={{ color: 'var(--color-text-tertiary)', display: 'flex', flexShrink: 0 }}>
                    <I.Send size={16} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="text-body-strong" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.recipient}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {item.id}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {item.number} · {item.pages} pages · by {item.sentBy}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    {item.status === 'Transmitting' && (
                      <div style={{ width: 120, height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div className="tx-bar" style={{
                          height: '100%',
                          width: `${item.progress * 100}%`,
                          background: 'var(--color-primary)',
                          borderRadius: 2,
                        }} />
                      </div>
                    )}
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>

          {/* Card 1 — Compliance Pulse */}
          <div style={{
            background: 'var(--color-surface-dark)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }}>
                  <I.Shield size={16} />
                </span>
                <span className="text-body-strong" style={{ color: 'white' }}>Compliance pulse</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-delivered)', display: 'block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#86efac' }}>All systems green</span>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {COMPLIANCE_ITEMS.map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--color-delivered)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <I.Check size={12} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              {['HIPAA', 'BAA'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase' as const,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2 — Quick Send */}
          <Card padding="20px">
            <div className="text-title">Quick send</div>
            <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2, marginBottom: 12 }}>
              Start a new fax or pick a recent recipient.
            </div>
            <Button variant="primary" style={{ width: '100%', height: 44, justifyContent: 'center' }}>
              + New fax
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span className="text-label">recent</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>
            {RECENT_RECIPIENTS.map((r, i) => (
              <RecentRecipientRow key={i} recipient={r} isLast={i === RECENT_RECIPIENTS.length - 1} />
            ))}
          </Card>

          {/* Card 3 — Inbox Preview */}
          <Card padding="20px">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="text-title">Inbox</span>
              <span style={{
                marginLeft: 8,
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '2px 8px',
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
              }}>
                4 unread
              </span>
              <Link
                href="/app/inbox"
                onMouseEnter={() => setOpenLinkHovered(true)}
                onMouseLeave={() => setOpenLinkHovered(false)}
                style={{
                  marginLeft: 'auto',
                  fontSize: 13,
                  color: openLinkHovered ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  transition: 'color var(--duration-fast)',
                }}
              >
                Open →
              </Link>
            </div>
            <div style={{ marginTop: 8 }}>
              {INBOX_ITEMS.map((item, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredInboxRow(i)}
                  onMouseLeave={() => setHoveredInboxRow(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 8px',
                    borderBottom: i < INBOX_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'pointer',
                    background: hoveredInboxRow === i ? 'var(--color-primary-subtle)' : 'transparent',
                    transition: 'background var(--duration-fast), border-radius var(--duration-fast)',
                    borderRadius: hoveredInboxRow === i ? 'var(--radius-md)' : 0,
                    margin: '0 -8px',
                  }}>
                  <Avatar initials={item.initials} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: item.unread ? 700 : 400,
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.sender}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--color-text-tertiary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.subject}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span className="text-label" style={{ color: 'var(--color-text-tertiary)' }}>{item.time}</span>
                    {item.unread && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', display: 'block' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
      </div>
    </div>
  );
}
