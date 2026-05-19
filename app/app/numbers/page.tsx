'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// ── Types ──────────────────────────────────────────────────────────────────────

type NumberStatus = 'active' | 'porting' | 'inactive';
type NumberType = 'local' | 'tollfree';
type FilterTab = 'All' | 'Active' | 'Local' | 'Toll-free';

interface FaxNumber {
  id: string;
  type: NumberType;
  primary: boolean;
  status: NumberStatus;
  number: string;
  label: string;
  area: string;
  callerId: string;
  routesTo: { initials: string; name: string; team: string } | null;
  sent: number;
  received: number;
  portProgress?: number;
  portEta?: string;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const NUMBERS: FaxNumber[] = [
  { id: '1', type: 'local',    primary: true,  status: 'active',   number: '+1 (206) 555-0142', label: 'Cardiology · Floor 3',     area: 'Seattle, WA',  callerId: 'NORTHWIND CARDIO',   routesTo: { initials: 'MG',  name: 'Dr. M. Greaves', team: 'Cardiology'    }, sent: 312, received: 84  },
  { id: '2', type: 'local',    primary: false, status: 'active',   number: '+1 (206) 555-0319', label: 'Front desk · Main',        area: 'Seattle, WA',  callerId: 'NORTHWIND HEALTH',  routesTo: { initials: 'R',   name: 'Reception',      team: 'Reception'     }, sent: 142, received: 188 },
  { id: '3', type: 'tollfree', primary: false, status: 'active',   number: '+1 (888) 555-0903', label: 'Toll-free · Patient line', area: 'Nationwide',   callerId: 'NORTHWIND HEALTH',  routesTo: { initials: 'ALL', name: 'Auto-route',     team: 'All teams'     }, sent: 88,  received: 142 },
  { id: '4', type: 'local',    primary: false, status: 'active',   number: '+1 (206) 555-0144', label: 'Cardiology Fellow',        area: 'Seattle, WA',  callerId: 'NORTHWIND CARDIO',   routesTo: { initials: 'PK',  name: 'Dr. P. Khanna',  team: 'Cardiology'    }, sent: 41,  received: 18  },
  { id: '5', type: 'local',    primary: false, status: 'active',   number: '+1 (206) 555-0148', label: 'Endocrinology',            area: 'Seattle, WA',  callerId: 'NORTHWIND ENDO',    routesTo: { initials: 'TI',  name: 'Dr. T. Iwasaki', team: 'Endocrinology' }, sent: 64,  received: 31  },
  { id: '6', type: 'local',    primary: false, status: 'active',   number: '+1 (425) 555-7710', label: 'Bellevue clinic',          area: 'Bellevue, WA', callerId: 'NORTHWIND BELLEVUE', routesTo: { initials: 'BS',  name: 'Bellevue staff', team: 'Bellevue'      }, sent: 28,  received: 22  },
  { id: '7', type: 'tollfree', primary: false, status: 'porting',  number: '+1 (877) 555-2210', label: 'Records line',             area: 'Nationwide',   callerId: 'NORTHWIND RECORDS', routesTo: { initials: 'RT',  name: 'Records team',   team: 'Records'       }, sent: 12,  received: 34,  portProgress: 60, portEta: 'Apr 3' },
  { id: '8', type: 'local',    primary: false, status: 'inactive', number: '+1 (206) 555-2840', label: 'Legacy line',              area: 'Seattle, WA',  callerId: 'NORTHWIND HEALTH',  routesTo: null,                                                               sent: 4,   received: 2   },
];

// ── Style helpers ──────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--color-text-tertiary)',
};

const bodyStrongStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text-primary)',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 400,
  color: 'var(--color-text-secondary)',
};

// ── NumberCard ─────────────────────────────────────────────────────────────────

function NumberCard({ n }: { n: FaxNumber }) {
  const [hovered, setHovered] = useState(false);
  const isPort     = n.status === 'porting';
  const isInactive = n.status === 'inactive';

  const dotColor =
    n.status === 'active'  ? 'var(--color-delivered)' :
    n.status === 'porting' ? 'var(--color-review)' :
                              'var(--color-text-tertiary)';

  const statusLabel =
    n.status === 'active'  ? 'Active' :
    n.status === 'porting' ? 'Port in progress' :
                              'Inactive';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      style={{
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: `all var(--duration-base) var(--ease-out)`,
        cursor: 'pointer',
      }}
    >
    <Card
      noPadding
      style={{
        boxShadow: hovered ? 'var(--shadow-panel)' : undefined,
        opacity: isInactive ? 0.7 : 1,
        ...(isPort && {
          background: 'color-mix(in srgb, var(--color-review-bg) 50%, white)',
        }),
      }}
    >
      {/* Card header */}
      <div style={{ padding: '16px 16px 12px' }}>

        {/* Row 1: type badge, primary badge, status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: n.type === 'local' ? 'var(--color-primary-subtle)' : 'var(--color-review-bg)',
              color: n.type === 'local' ? 'var(--color-primary)' : '#92400e',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}>
              {n.type === 'local' ? 'Local' : 'Toll-free'}
            </span>
            {n.primary && (
              <span style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
              }}>
                Primary
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
            <span style={{ ...labelStyle, color: dotColor }}>{statusLabel}</span>
          </div>
        </div>

        {/* Row 2: phone number */}
        <div style={{
          marginTop: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>
          {n.number}
        </div>

        {/* Row 3: label */}
        <div style={{ marginTop: 2, ...bodyStyle }}>
          {n.label}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-border)' }} />

      {/* Card body */}
      <div style={{ padding: '14px 16px' }}>

        {/* Area + Caller ID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <div>
            <div style={{ ...labelStyle, marginBottom: 3 }}>AREA</div>
            <div style={bodyStrongStyle}>{n.area}</div>
          </div>
          <div>
            <div style={{ ...labelStyle, marginBottom: 3 }}>CALLER ID</div>
            <div style={{ ...bodyStrongStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{n.callerId}</div>
          </div>
        </div>

        {/* Routes To */}
        <div style={{ marginTop: 12 }}>
          <div style={{ ...labelStyle, marginBottom: 4 }}>ROUTES TO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {n.routesTo ? (
              <>
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  letterSpacing: 0,
                }}>
                  {n.routesTo.initials}
                </span>
                <span style={{ ...bodyStyle, color: 'var(--color-text-primary)' }}>
                  {n.routesTo.name}
                  <span style={{ color: 'var(--color-text-tertiary)' }}> · {n.routesTo.team}</span>
                </span>
              </>
            ) : (
              <span style={{ ...bodyStyle, color: 'var(--color-text-tertiary)' }}>Unassigned</span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} />

        {/* Activity row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={labelStyle}>THIS MONTH</span>
          <span style={bodyStyle}>{n.sent} sent · {n.received} received</span>
        </div>

        {/* Port progress bar */}
        {isPort && n.portProgress != null && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ ...labelStyle, color: 'var(--color-review)' }}>Porting in progress</span>
              <span style={labelStyle}>ETA {n.portEta}</span>
            </div>
            <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2 }}>
              <div style={{ width: `${n.portProgress}%`, height: '100%', background: 'var(--color-review)', borderRadius: 2 }} />
            </div>
          </div>
        )}
      </div>
    </Card>
    </div>
  );
}

// ── AddLineCard ────────────────────────────────────────────────────────────────

function AddLineCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px dashed ${hovered ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: hovered ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 340,
        minHeight: 280,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
        padding: 24,
      }}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 20, color: 'var(--color-text-tertiary)', lineHeight: 1 }}>+</span>
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginTop: 12,
      }}>
        Add another line.
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-text-tertiary)',
        maxWidth: 180,
        marginTop: 6,
        lineHeight: 1.5,
      }}>
        Claim a local or toll-free number, or port an existing one from your current carrier.
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Button variant="primary" size="sm">+ Browse</Button>
        <Button variant="ghost" size="sm">→ Port in</Button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const FILTER_TABS: FilterTab[] = ['All', 'Active', 'Local', 'Toll-free'];

export default function NumbersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [hoveredFilter, setHoveredFilter] = useState<FilterTab | null>(null);

  const activeCount   = NUMBERS.filter(n => n.status === 'active').length;
  const portingCount  = NUMBERS.filter(n => n.status === 'porting').length;
  const inactiveCount = NUMBERS.filter(n => n.status === 'inactive').length;

  const filterCounts: Record<FilterTab, number> = {
    'All':       NUMBERS.length,
    'Active':    activeCount,
    'Local':     NUMBERS.filter(n => n.type === 'local').length,
    'Toll-free': NUMBERS.filter(n => n.type === 'tollfree').length,
  };

  const filtered = NUMBERS.filter(n => {
    if (activeFilter === 'Active')     return n.status === 'active';
    if (activeFilter === 'Local')      return n.type === 'local';
    if (activeFilter === 'Toll-free')  return n.type === 'tollfree';
    return true;
  });

  const portingNumbers = NUMBERS.filter(n => n.status === 'porting');

  return (
    <div style={{ margin: '0 -32px', display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
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
          }}>
            NUMBERS · {activeCount} ACTIVE · {portingCount} PORTING · {inactiveCount} INACTIVE
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: 1.15,
          }}>
            Your fax numbers.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            margin: 0,
            marginTop: 4,
          }}>
            Manage your lines, routing, and caller ID settings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', alignSelf: 'center' }}>
          <Button variant="secondary" size="md">→ Port number</Button>
          <Button variant="primary" size="md">+ Get number</Button>
        </div>
      </div>

      {/* Port-in-progress banner */}
      {portingNumbers.length > 0 && (
        <div style={{
          background: 'var(--color-review-bg)',
          borderLeft: '3px solid var(--color-review)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '16px 20px',
          margin: '16px 32px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: '860px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-review)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {portingNumbers.length} number porting from previous carrier
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {portingNumbers[0].number} · {portingNumbers[0].portProgress}% complete · ETA {portingNumbers[0].portEta}. We'll notify you when it's live.
            </div>
          </div>
          <Button variant="secondary" size="sm">View status</Button>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ padding: '16px 32px 0' }}>
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              onMouseEnter={() => setHoveredFilter(tab)}
              onMouseLeave={() => setHoveredFilter(null)}
              style={{
                background: activeFilter === tab ? 'var(--color-primary)' : (hoveredFilter === tab ? 'var(--color-primary-subtle)' : 'transparent'),
                color: activeFilter === tab ? 'white' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 12px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Sora, var(--font-body)',
                border: 'none',
                cursor: 'pointer',
                transition: `background var(--duration-fast)`,
              }}
            >
              {tab} {filterCounts[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div style={{
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 340px))',
        gap: 16,
        justifyContent: 'flex-start',
      }}>
        <AddLineCard />
        {filtered.map(n => <NumberCard key={n.id} n={n} />)}
      </div>
    </div>
  );
}
