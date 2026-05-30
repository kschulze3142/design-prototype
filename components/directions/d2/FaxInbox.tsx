// d2 Inbox — Mercury "quiet minimal" applied to the in-app fax inbox (DR-005).
// Lives inside the constrained DirectionShell <main>; reads the shared
// @/lib/designMock only. Failures are surfaced calmly, never buried.
'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Route,
  UserRound,
} from 'lucide-react';
import { designMock, type Fax } from '@/lib/designMock';
import { Card, Eyebrow, space as u } from './primitives';
import { StatusPill, STATUS_META, formatPhone, formatTime } from './surfaces';
import {
  FaxFilterBar,
  type DirectionFilter,
  type SortOrder,
  type StatusFilter,
} from './FaxFilterBar';

// Single source of the failed treatment — the row hairline and "needs attention"
// dot draw STATUS_META.failed.color directly, so they can't drift from the pill.
// A restrained hairline, not an alarm.

// Shared table grid so the header row and body rows stay aligned.
const GRID =
  '22px minmax(0, 1.5fr) minmax(0, 1.3fr) 58px minmax(0, 1.2fr) 116px 76px';

const ruleNameById = new Map(designMock.routingRules.map((r) => [r.id, r.name]));

function ColumnHeader() {
  const cell = {
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: 'var(--rd-color-text-muted)',
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: GRID,
        alignItems: 'center',
        gap: u(1.4),
        padding: `${u(1.3)} ${u(2)}`,
        borderBottom: '1px solid var(--rd-color-border)',
      }}
    >
      <span aria-hidden />
      <span style={cell}>Number</span>
      <span style={cell}>Patient / record</span>
      <span style={cell}>Pages</span>
      <span style={cell}>Routing</span>
      <span style={cell}>Status</span>
      <span style={cell}>Time</span>
    </div>
  );
}

function FaxRow({
  fax,
  selected,
  last,
  onSelect,
}: {
  fax: Fax;
  selected: boolean;
  last: boolean;
  onSelect: () => void;
}) {
  const inbound = fax.direction === 'inbound';
  const counterpart = inbound ? fax.fromNumber : fax.toNumber;
  const failed = fax.status === 'failed';
  const DirIcon = inbound ? ArrowDownLeft : ArrowUpRight;
  const rule = fax.routingRuleId ? ruleNameById.get(fax.routingRuleId) : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: GRID,
        alignItems: 'center',
        gap: u(1.4),
        padding: `${u(1.6)} ${u(2)}`,
        // Restrained left hairline keeps failures unmistakable but calm.
        borderLeft: failed
          ? `2px solid ${STATUS_META.failed.color}`
          : '2px solid transparent',
        borderBottom: last ? 'none' : '1px solid var(--rd-color-border)',
        background: selected ? 'var(--rd-color-accent-soft)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
    >
      <span
        aria-hidden
        title={inbound ? 'Inbound' : 'Outbound'}
        style={{ display: 'inline-flex', color: 'var(--rd-color-text-muted)' }}
      >
        <DirIcon size={16} strokeWidth={2} />
      </span>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--rd-color-text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formatPhone(counterpart)}
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--rd-color-text-muted)' }}>
          {inbound ? 'From sender' : 'To recipient'}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        {fax.patientRef ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: u(0.7), minWidth: 0 }}>
            <UserRound size={14} strokeWidth={2} color="var(--rd-color-text-muted)" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: '0.84rem',
                color: 'var(--rd-color-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {fax.patientRef.name}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '0.84rem', color: 'var(--rd-color-text-muted)' }}>Unassigned</span>
        )}
      </div>

      <span style={{ fontSize: '0.84rem', color: 'var(--rd-color-text-muted)' }}>{fax.pageCount} pp</span>

      <div style={{ minWidth: 0 }}>
        {rule ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: u(0.6),
              maxWidth: '100%',
              fontSize: '0.8rem',
              color: 'var(--rd-color-text-muted)',
            }}
          >
            <Route size={13} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {rule}
            </span>
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--rd-color-text-muted)' }}>—</span>
        )}
      </div>

      <StatusPill status={fax.status} />

      <span style={{ fontSize: '0.8rem', color: 'var(--rd-color-text-muted)' }}>
        {formatTime(fax.timestamp)}
      </span>
    </div>
  );
}

function DetailStub({ fax, onClose }: { fax: Fax; onClose: () => void }) {
  const inbound = fax.direction === 'inbound';
  const rule = fax.routingRuleId ? ruleNameById.get(fax.routingRuleId) : undefined;
  const rows: { label: string; value: string }[] = [
    { label: 'Direction', value: inbound ? 'Inbound' : 'Outbound' },
    { label: 'From', value: formatPhone(fax.fromNumber) },
    { label: 'To', value: formatPhone(fax.toNumber) },
    { label: 'Pages', value: `${fax.pageCount}` },
    { label: 'Patient / record', value: fax.patientRef ? `${fax.patientRef.name} · ${fax.patientRef.mrn}` : 'Unassigned' },
    { label: 'Routing rule', value: rule ?? 'None applied' },
    { label: 'Received', value: formatTime(fax.timestamp) },
    { label: 'Reference', value: fax.id.toUpperCase() },
  ];
  return (
    <Card style={{ marginTop: u(2.5) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: u(2),
          padding: `${u(2)} ${u(2.5)}`,
          borderBottom: '1px solid var(--rd-color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: u(1.4) }}>
          <StatusPill status={fax.status} />
          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--rd-color-text)' }}>
            {formatPhone(inbound ? fax.fromNumber : fax.toNumber)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            appearance: 'none',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'var(--rd-color-text-muted)',
            fontFamily: 'var(--rd-font-body)',
          }}
        >
          Close
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: `${u(1.6)} ${u(3)}`,
          padding: u(2.5),
        }}
      >
        {rows.map((r) => (
          <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--rd-color-text-muted)',
              }}
            >
              {r.label}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--rd-color-text)' }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: `0 ${u(2.5)} ${u(2.5)}` }}>
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: u(0.7),
            appearance: 'none',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--rd-color-accent)',
            fontFamily: 'var(--rd-font-body)',
          }}
        >
          Open full record
          <ArrowRight size={15} strokeWidth={2.2} />
        </button>
      </div>
    </Card>
  );
}

export function FaxInbox() {
  const [direction, setDirection] = useState<DirectionFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOrder>('newest');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const failedCount = useMemo(
    () => designMock.faxes.filter((f) => f.status === 'failed').length,
    [],
  );

  const rows = useMemo(() => {
    const filtered = designMock.faxes.filter((f) => {
      if (direction !== 'all' && f.direction !== direction) return false;
      if (status !== 'all' && f.status !== status) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) =>
      sort === 'newest'
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp),
    );
    return sorted;
  }, [direction, status, sort]);

  const selected = rows.find((f) => f.id === selectedId) ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: u(4) }}>
      {/* Calm page header — consistent with the D2 home. */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: u(1.2) }}>
        <Eyebrow>Inbox</Eyebrow>
        <h1
          style={{
            fontFamily: 'var(--rd-font-display)',
            fontSize: 'calc(2.1rem * var(--rd-type-scale))',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
            color: 'var(--rd-color-text)',
          }}
        >
          Fax activity
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--rd-color-text-muted)',
            maxWidth: 560,
          }}
        >
          Every inbound and outbound fax, with delivery status and routing in one place.
        </p>
        {failedCount > 0 && (
          // Failures are surfaced calmly up top — clear, never buried, no alarm.
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: u(0.9),
              marginTop: u(0.6),
              fontSize: '0.84rem',
              color: 'var(--rd-color-text)',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: STATUS_META.failed.color,
                flexShrink: 0,
              }}
            />
            <span>
              <strong style={{ fontWeight: 600 }}>{failedCount}</strong>{' '}
              {failedCount === 1 ? 'fax needs' : 'faxes need'} attention
            </span>
            <button
              type="button"
              onClick={() => {
                setStatus('failed');
                setDirection('all');
                setSelectedId(null);
              }}
              style={{
                appearance: 'none',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--rd-color-accent)',
                fontFamily: 'var(--rd-font-body)',
              }}
            >
              Review
            </button>
          </div>
        )}
      </header>

      <FaxFilterBar
        direction={direction}
        status={status}
        sort={sort}
        onDirectionChange={(v) => {
          setDirection(v);
          setSelectedId(null);
        }}
        onStatusChange={(v) => {
          setStatus(v);
          setSelectedId(null);
        }}
        onSortChange={setSort}
      />

      <div>
        <Card>
          <ColumnHeader />
          {rows.length === 0 ? (
            <div
              style={{
                padding: u(5),
                textAlign: 'center',
                fontSize: '0.9rem',
                color: 'var(--rd-color-text-muted)',
              }}
            >
              No faxes match these filters.
            </div>
          ) : (
            rows.map((fax, i) => (
              <FaxRow
                key={fax.id}
                fax={fax}
                selected={fax.id === selectedId}
                last={i === rows.length - 1}
                onSelect={() => setSelectedId((cur) => (cur === fax.id ? null : fax.id))}
              />
            ))
          )}
        </Card>

        <p style={{ margin: `${u(1.4)} 0 0`, fontSize: '0.78rem', color: 'var(--rd-color-text-muted)' }}>
          Showing {rows.length} of {designMock.faxes.length} faxes
        </p>
      </div>

      {selected && <DetailStub fax={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
