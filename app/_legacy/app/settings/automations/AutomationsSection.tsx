'use client';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { I } from '@/components/app/icons';
import { AppButton } from '@/components/app/primitives';
import {
  Action,
  Automation,
  Condition,
  TriggerType,
  ACTION_TYPE_OPTIONS,
  FIELD_OPTIONS,
  OPERATOR_OPTIONS,
  TRIGGER_OPTIONS,
  generatePlainEnglish,
  mockAutomations,
} from './mockAutomationsData';

function PillToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex shrink-0 cursor-pointer relative"
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        transition: 'background var(--duration-fast)',
        border: 'none',
        padding: 0,
      }}
      aria-pressed={checked}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
        style={{ left: checked ? '18px' : '2px', transition: 'left var(--duration-fast)' }}
      />
    </button>
  );
}

const pillSelectStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-body), system-ui',
  fontSize: 13,
  padding: '6px 12px',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  outline: 'none',
};

const pillInputStyle: React.CSSProperties = {
  ...pillSelectStyle,
  cursor: 'text',
  minWidth: 140,
};

function DashedAddButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 cursor-pointer"
      style={{
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--color-text-tertiary)',
        background: 'transparent',
        padding: '8px 12px',
        fontFamily: 'var(--font-body), system-ui',
        fontSize: 13,
        fontWeight: 500,
        transition: 'all var(--duration-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.color = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.color = 'var(--color-text-tertiary)';
      }}
    >
      <I.Plus size={13} strokeWidth={2.2} /> {children}
    </button>
  );
}

function StepHeader({ step, title, optional }: { step: string; title: string; optional?: boolean }) {
  return (
    <div className="mb-4">
      <div
        className="font-semibold"
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {step}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <h3
          className="font-semibold"
          style={{
            fontFamily: 'var(--font-heading), system-ui',
            fontSize: 18,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>
        {optional && (
          <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>(optional)</span>
        )}
      </div>
    </div>
  );
}

function BuilderCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function RuleRow({
  automation,
  onToggle,
  onEdit,
}: {
  automation: Automation;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const dim = !automation.isActive;
  const runText =
    automation.runCount === 0
      ? 'Never run'
      : `${automation.runCount} runs${automation.lastRunAt ? ` · Last run ${automation.lastRunAt}` : ''}`;

  return (
    <div
      className="flex items-center gap-4"
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: 16,
      }}
    >
      <div className="pt-0.5">
        <PillToggle checked={automation.isActive} onChange={onToggle} />
      </div>
      <div className="flex-1 min-w-0" style={{ opacity: dim ? 0.6 : 1 }}>
        <div
          className="font-semibold truncate"
          style={{
            fontFamily: 'var(--font-heading), system-ui',
            fontSize: 14,
            color: 'var(--color-text-primary)',
            fontWeight: 600,
          }}
        >
          {automation.name}
        </div>
        <div
          className="truncate"
          style={{
            fontFamily: 'var(--font-body), system-ui',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            marginTop: 2,
          }}
        >
          {automation.description}
        </div>
      </div>
      <div
        className="shrink-0 text-right"
        style={{
          fontFamily: 'var(--font-body), system-ui',
          fontSize: 12,
          color: 'var(--color-text-tertiary)',
          minWidth: 180,
        }}
      >
        {runText}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 cursor-pointer"
        style={{
          background: '#fff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 14px',
          fontFamily: 'var(--font-body), system-ui',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          transition: 'all var(--duration-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.color = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
      >
        Edit
      </button>
    </div>
  );
}

function HighlightedPreview({ text }: { text: string }) {
  const parts = text.split(/(".*?")/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('"') && part.endsWith('"')) {
          return (
            <strong key={i} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {part}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

const builderInputStyle: React.CSSProperties = {
  width: '100%',
  height: 42,
  background: '#fff',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)',
  border: '1px solid var(--color-border)',
  padding: '0 14px',
  fontFamily: 'var(--font-body), system-ui',
  fontSize: 14,
  color: 'var(--color-text-primary)',
  outline: 'none',
};

function blankDraft(prefillFax?: string | null): Partial<Automation> {
  const conditions: Condition[] = prefillFax
    ? [{ id: 'prefill-1', field: 'Fax number', operator: 'is', value: prefillFax }]
    : [];
  return {
    name: '',
    description: '',
    triggerType: prefillFax ? 'fax_received' : undefined,
    isActive: true,
    conditions,
    actions: [],
  };
}

export function AutomationsSection() {
  const searchParams = useSearchParams();
  const prefillFax = searchParams.get('prefill_fax');
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [editingId, setEditingId] = useState<string | null>(prefillFax ? 'new' : null);

  if (editingId !== null) {
    return (
      <Builder
        key={editingId}
        editingId={editingId}
        seed={
          editingId === 'new'
            ? blankDraft(prefillFax)
            : automations.find((a) => a.id === editingId) ?? blankDraft()
        }
        onCancel={() => setEditingId(null)}
        onSave={(draft) => {
          setAutomations((prev) => {
            if (editingId === 'new') {
              const next: Automation = {
                id: `a${Date.now()}`,
                name: draft.name || 'Untitled automation',
                description: draft.description || '',
                triggerType: (draft.triggerType ?? 'fax_received') as TriggerType,
                isActive: draft.isActive ?? true,
                conditions: draft.conditions ?? [],
                actions: draft.actions ?? [],
                runCount: 0,
                lastRunAt: null,
              };
              return [...prev, next];
            }
            return prev.map((a) =>
              a.id === editingId
                ? { ...a, ...draft, id: a.id, runCount: a.runCount, lastRunAt: a.lastRunAt }
                : a
            );
          });
          setEditingId(null);
        }}
        onDelete={() => {
          setAutomations((prev) => prev.filter((a) => a.id !== editingId));
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div
            className="font-semibold"
            style={{
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Automations
          </div>
          <h1
            className="font-semibold mt-1.5"
            style={{
              fontFamily: 'var(--font-heading), system-ui',
              fontSize: 28,
              lineHeight: 1.1,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Automations
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: 'var(--font-body), system-ui',
              fontSize: 14,
              color: 'var(--color-text-secondary)',
            }}
          >
            Rules that fire automatically based on fax and referral events.
          </p>
        </div>
        <AppButton
          icon={<I.Plus size={14} strokeWidth={2.4} />}
          onClick={() => setEditingId('new')}
          style={{ background: 'var(--color-primary)' }}
        >
          New automation
        </AppButton>
      </div>

      {/* Rule list */}
      <div className="flex flex-col gap-3">
        {automations.map((a) => (
          <RuleRow
            key={a.id}
            automation={a}
            onToggle={() =>
              setAutomations((prev) =>
                prev.map((p) => (p.id === a.id ? { ...p, isActive: !p.isActive } : p))
              )
            }
            onEdit={() => setEditingId(a.id)}
          />
        ))}
      </div>
    </>
  );
}

function Builder({
  editingId,
  seed,
  onCancel,
  onSave,
  onDelete,
}: {
  editingId: string;
  seed: Partial<Automation>;
  onCancel: () => void;
  onSave: (draft: Partial<Automation>) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<Partial<Automation>>(seed);

  const preview = useMemo(() => generatePlainEnglish(draft), [draft]);

  const updateCondition = (id: string, patch: Partial<Condition>) => {
    setDraft((d) => ({
      ...d,
      conditions: (d.conditions ?? []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };
  const removeCondition = (id: string) => {
    setDraft((d) => ({ ...d, conditions: (d.conditions ?? []).filter((c) => c.id !== id) }));
  };
  const addCondition = () => {
    setDraft((d) => ({
      ...d,
      conditions: [
        ...(d.conditions ?? []),
        { id: `c${Date.now()}`, field: FIELD_OPTIONS[0], operator: OPERATOR_OPTIONS[0], value: '' },
      ],
    }));
  };

  const updateAction = (id: string, patch: Partial<Action>) => {
    setDraft((d) => ({
      ...d,
      actions: (d.actions ?? []).map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  };
  const removeAction = (id: string) => {
    setDraft((d) => ({ ...d, actions: (d.actions ?? []).filter((a) => a.id !== id) }));
  };
  const addAction = () => {
    setDraft((d) => ({
      ...d,
      actions: [...(d.actions ?? []), { id: Date.now().toString(), type: 'Send fax', config: {} }],
    }));
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Back link */}
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 cursor-pointer mb-4"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          fontFamily: 'var(--font-body), system-ui',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        ← Back to automations
      </button>

      <div className="flex flex-col gap-4">
        {/* Rule name */}
        <BuilderCard>
          <StepHeader step="Rule" title={editingId === 'new' ? 'New automation' : 'Edit automation'} />
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Rule name"
              value={draft.name ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              style={builderInputStyle}
            />
            <input
              type="text"
              placeholder="Description"
              value={draft.description ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              style={builderInputStyle}
            />
          </div>
        </BuilderCard>

        {/* Step 1 — Trigger */}
        <BuilderCard>
          <StepHeader step="Step 1" title="Choose a trigger" />
          <div className="grid grid-cols-3 gap-3">
            {TRIGGER_OPTIONS.map((t) => {
              const selected = draft.triggerType === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, triggerType: t.type }))}
                  className="text-left cursor-pointer"
                  style={{
                    background: selected ? 'var(--color-primary-subtle)' : '#fff',
                    border: selected
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    padding: selected ? 15 : 16, // compensate for 2px border
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{t.icon}</div>
                  <div
                    className="font-semibold"
                    style={{
                      fontFamily: 'var(--font-heading), system-ui',
                      fontSize: 14,
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-body), system-ui',
                      fontSize: 12,
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {t.description}
                  </div>
                </button>
              );
            })}
          </div>
        </BuilderCard>

        {/* Step 2 — Conditions */}
        <BuilderCard>
          <StepHeader step="Step 2" title="Set conditions" optional />
          <div className="flex flex-col gap-2">
            {(draft.conditions ?? []).map((c, idx) => (
              <React.Fragment key={c.id}>
                {idx > 0 && (
                  <div
                    className="text-center"
                    style={{
                      fontFamily: 'var(--font-body), system-ui',
                      fontSize: 11,
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      padding: '2px 0',
                    }}
                  >
                    AND
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={c.field}
                    onChange={(e) => updateCondition(c.id, { field: e.target.value })}
                    style={pillSelectStyle}
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <select
                    value={c.operator}
                    onChange={(e) => updateCondition(c.id, { operator: e.target.value })}
                    style={pillSelectStyle}
                  >
                    {OPERATOR_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={c.value}
                    placeholder="Value"
                    onChange={(e) => updateCondition(c.id, { value: e.target.value })}
                    style={pillInputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeCondition(c.id)}
                    aria-label="Remove condition"
                    className="cursor-pointer"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-tertiary)',
                      padding: 4,
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      transition: 'color var(--duration-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                  >
                    <I.X size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </React.Fragment>
            ))}
            <div className={(draft.conditions?.length ?? 0) > 0 ? 'mt-2' : ''}>
              <DashedAddButton onClick={addCondition}>Add condition</DashedAddButton>
            </div>
          </div>
        </BuilderCard>

        {/* Step 3 — Actions */}
        <BuilderCard>
          <StepHeader step="Step 3" title="Define actions" />
          <div className="flex flex-col gap-3">
            {(draft.actions ?? []).map((a, idx) => (
              <div
                key={a.id}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--color-border)',
                  padding: 16,
                  position: 'relative',
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center justify-center shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      background: 'var(--color-primary)',
                      color: '#fff',
                      fontFamily: 'var(--font-body), system-ui',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <select
                      value={a.type}
                      onChange={(e) => updateAction(a.id, { type: e.target.value })}
                      style={pillSelectStyle}
                    >
                      {ACTION_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {Object.keys(a.config).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(a.config).map(([k, v]) => (
                          <span
                            key={k}
                            style={{
                              background: 'var(--color-primary-subtle)',
                              color: 'var(--color-primary)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '3px 8px',
                              fontFamily: 'var(--font-body), system-ui',
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {k}: &ldquo;{v}&rdquo;
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAction(a.id)}
                    aria-label="Remove action"
                    className="cursor-pointer shrink-0"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-tertiary)',
                      padding: 4,
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      transition: 'color var(--duration-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                  >
                    <I.X size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            ))}
            <div className={(draft.actions?.length ?? 0) > 0 ? 'mt-1' : ''}>
              <DashedAddButton onClick={addAction}>Add action</DashedAddButton>
            </div>
          </div>
        </BuilderCard>

        {/* Plain English preview */}
        <div
          style={{
            border: '2px solid #0d9488',
            background: 'var(--color-primary-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1.2 }}>⚡</span>
          <div
            style={{
              fontFamily: 'var(--font-body), system-ui',
              fontSize: 13.5,
              lineHeight: 1.55,
              color: 'var(--color-text-primary)',
            }}
          >
            <HighlightedPreview text={preview} />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 pt-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <label
            className="inline-flex items-center gap-2 cursor-pointer"
            style={{ userSelect: 'none' }}
          >
            <PillToggle
              checked={draft.isActive ?? true}
              onChange={(v) => setDraft((d) => ({ ...d, isActive: v }))}
            />
            <span
              style={{
                fontFamily: 'var(--font-body), system-ui',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              Active
            </span>
          </label>
          <div className="flex items-center gap-2">
            {editingId !== 'new' && (
              <button
                type="button"
                onClick={onDelete}
                className="cursor-pointer"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#e11d48',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  fontFamily: 'var(--font-body), system-ui',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'background var(--duration-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Delete
              </button>
            )}
            <AppButton variant="secondary" size="md" onClick={() => {/* non-functional */}}>
              Test on past fax
            </AppButton>
            <AppButton
              size="md"
              onClick={() => onSave(draft)}
              style={{ background: 'var(--color-primary)' }}
              icon={<I.Check size={14} strokeWidth={2.4} />}
            >
              Save automation
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
