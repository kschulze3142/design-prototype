'use client';
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { I } from '@/components/app/icons';

// ── DATA ─────────────────────────────────────────────────────────────────────

const SENDER_NUMBERS = [
  { number: '+1 (206) 555-0142', label: 'Seattle · Cardiology',   type: 'Local',     isDefault: true },
  { number: '+1 (206) 555-0319', label: 'Seattle · Front desk',   type: 'Local' },
  { number: '+1 (888) 555-0903', label: 'Toll-free · Nationwide', type: 'Toll-free' },
];

const RECENT_RECIPIENTS = [
  { name: 'BlueShield Prior Auth',     number: '+1 (888) 555-0903', attn: 'Authorizations Dept.' },
  { name: 'Swedish Medical · Records', number: '+1 (206) 555-7711', attn: 'ROI Office' },
  { name: 'Aetna Claims',              number: '+1 (800) 555-2840', attn: 'Claims Review' },
];

const SAMPLE_FILE = { name: 'PriorAuth_A24189.pdf', size: '284 KB', pages: 7 };
const CREDIT_BALANCE = 142;

const defaultForm = {
  recipientName:   'BlueShield Prior Auth',
  recipientNumber: '+1 (888) 555-0903',
  recipientAttn:   'Authorizations Dept.',
  senderNumber:    SENDER_NUMBERS[0].number,
  subject:         'Authorization request — Patient #A24189',
  cover:           'Please find attached the prior authorization request for echocardiogram. Member ID and ICD-10 enclosed. Reach out with questions to Dr. Greaves at extension 4421.',
  includeCover:    true,
  priority:        false,
  schedule:        false,
  receipt:         true,
  file:            SAMPLE_FILE as typeof SAMPLE_FILE | null,
};

// ── SHARED INPUT STYLE ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: `border-color var(--duration-fast) var(--ease-out)`,
};

// ── STEP INDICATOR ────────────────────────────────────────────────────────────

const STEP_LABELS = ['Compose', 'Preview', 'Confirmation'];

function StepIndicator({ current, onBack }: { current: number; onBack?: () => void }) {
  return (
    <Card noPadding style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 24px' }}>
        <div style={{ flexShrink: 0, marginRight: 16 }}>
          {onBack && (
            <Button variant="ghost" onClick={onBack} style={{ gap: 4 }}>
              <I.Chevron size={14} className="rotate-180" /> Back
            </Button>
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {STEP_LABELS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div style={{
                    width: 40,
                    height: 1,
                    background: done ? 'var(--color-primary)' : 'var(--color-border)',
                    transition: `background var(--duration-base) var(--ease-out)`,
                    flexShrink: 0,
                  }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 6, paddingRight: 6 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: done ? 'var(--color-primary)' : active ? 'var(--color-primary)' : 'transparent',
                    border: done || active ? 'none' : '1.5px solid var(--color-text-tertiary)',
                    transition: `all var(--duration-base) var(--ease-out)`,
                    flexShrink: 0,
                    color: done || active ? 'white' : 'var(--color-text-tertiary)',
                  }}>
                    {done ? (
                      <I.Check size={13} strokeWidth={2.5} />
                    ) : (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: active ? 'white' : 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1,
                      }}>{i + 1}</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    color: done ? 'var(--color-primary)' : active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    transition: `color var(--duration-base) var(--ease-out)`,
                  }}>{label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ flexShrink: 0, marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <I.Lock size={12} strokeWidth={2.2} style={{ color: 'var(--color-text-tertiary)' }} />
          <span className="text-label" style={{ color: 'var(--color-text-tertiary)' }}>
            Encrypted end-to-end · HIPAA
          </span>
        </div>
      </div>
    </Card>
  );
}

// ── TOGGLE ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, helper }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; helper?: string;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', userSelect: 'none' }}>
      <span
        onClick={() => onChange(!checked)}
        style={{
          display: 'inline-flex',
          flexShrink: 0,
          marginTop: 2,
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? 'var(--color-primary)' : 'var(--color-border-strong)',
          position: 'relative',
          transition: `background var(--duration-base) var(--ease-out)`,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          transition: `left var(--duration-base) var(--ease-out)`,
          left: checked ? 18 : 2,
        }} />
      </span>
      <span>
        <span className="text-body-strong">{label}</span>
        {helper && <span className="text-body" style={{ display: 'block', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{helper}</span>}
      </span>
    </label>
  );
}

// ── INITIALS AVATAR ───────────────────────────────────────────────────────────

function InitialsAvatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: size * 0.38,
      fontWeight: 700,
    }}>{initials}</span>
  );
}

// ── STEP 1: COMPOSE ───────────────────────────────────────────────────────────

function StepCompose({ form, setForm, onNext }: {
  form: typeof defaultForm;
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>;
  onNext: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const canContinue = !!form.recipientNumber && !!form.subject && !!form.file;

  const selectRecipient = (r: typeof RECENT_RECIPIENTS[0]) =>
    setForm(f => ({ ...f, recipientName: r.name, recipientNumber: r.number, recipientAttn: r.attn }));

  const divider = <div style={{ height: 1, background: 'var(--color-border)', margin: '0 -24px' }} />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

      {/* ── Left: unified canvas card ── */}
      <Card noPadding style={{ borderRadius: 'var(--radius-lg)' }}>

        {/* Section: Recipient */}
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="text-title">Recipient</div>
            <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>Where this fax is going.</div>
          </div>

          {/* Fax number + Recipient name */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fax number</label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)',
                overflow: 'hidden',
              }}>
                <span style={{
                  padding: '0 12px',
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--color-text-tertiary)',
                  borderRight: '1px solid var(--color-border)',
                  flexShrink: 0,
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.06em',
                }}>FAX</span>
                <input
                  style={{ flex: 1, height: 40, padding: '0 12px', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-text-primary)' }}
                  value={form.recipientNumber}
                  onChange={e => setForm(f => ({ ...f, recipientNumber: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recipient name</label>
              <input style={{ ...inputStyle, height: 40, padding: '0 14px' }} value={form.recipientName} onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))} placeholder="Organization or person" />
            </div>
          </div>

          {/* ATTN */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ATTN <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input style={{ ...inputStyle, height: 40, padding: '0 14px' }} value={form.recipientAttn} onChange={e => setForm(f => ({ ...f, recipientAttn: e.target.value }))} placeholder="Attention line — e.g. Authorization Dept." />
          </div>

          {/* Recent recipients */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span className="text-label" style={{ color: 'var(--color-text-tertiary)' }}>Recent</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {RECENT_RECIPIENTS.map(r => {
                const active = form.recipientNumber === r.number && form.recipientName === r.name;
                return (
                  <button
                    key={r.number}
                    onClick={() => selectRecipient(r)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      height: 36, padding: '0 12px',
                      borderRadius: 'var(--radius-xl)',
                      border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: active ? 'var(--color-primary-subtle)' : 'white',
                      cursor: 'pointer',
                      transition: `all var(--duration-fast) var(--ease-out)`,
                    }}
                  >
                    <InitialsAvatar name={r.name} size={20} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{r.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>{r.number}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {divider}

        {/* Section: Cover page */}
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="text-title">Cover page</div>
            <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>Subject is printed on the cover sheet; the note follows beneath.</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</label>
            <input style={{ ...inputStyle, height: 40, padding: '0 14px' }} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject line" />
          </div>

          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cover note</label>
            <textarea
              style={{ ...inputStyle, height: 100, padding: '10px 14px', resize: 'none', display: 'block', lineHeight: 1.5 }}
              value={form.cover}
              onChange={e => setForm(f => ({ ...f, cover: e.target.value.slice(0, 500) }))}
              placeholder="Add a message to appear on the cover sheet..."
            />
            <span style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', pointerEvents: 'none' }}>{form.cover.length}/500</span>
          </div>

          <Toggle
            checked={form.includeCover}
            onChange={v => setForm(f => ({ ...f, includeCover: v }))}
            label="Include cover sheet"
            helper="Generated automatically with sender, recipient, and the note above."
          />
        </div>

        {divider}

        {/* Section: Documents */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="text-title">Documents</div>
              <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>PDF, PNG, JPG, or TIFF. Up to 50 MB and 200 pages.</div>
            </div>
            {form.file && (
              <Button variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, file: null }))}>
                Remove
              </Button>
            )}
          </div>

          {form.file && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14, borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              marginBottom: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--color-primary)',
              }}>
                <I.Document size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-body-strong" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.file.name}</div>
                <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginTop: 2 }}>{form.file.pages} pages · {form.file.size}</div>
              </div>
              <StatusBadge variant="delivered" label="Ready" />
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}>
                <I.Eye size={15} />
              </button>
            </div>
          )}

          <div
            onClick={() => !form.file && setForm(f => ({ ...f, file: SAMPLE_FILE }))}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); setForm(f => ({ ...f, file: SAMPLE_FILE })); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px 0',
              borderRadius: 'var(--radius-md)',
              border: `1.5px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: dragOver ? 'var(--color-primary-subtle)' : 'transparent',
              cursor: form.file ? 'default' : 'pointer',
              transition: `all var(--duration-fast) var(--ease-out)`,
            }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
              {form.file ? '+ Add another document' : '+ Drop files here or click to browse'}
            </span>
          </div>
        </div>
      </Card>

      {/* ── Right column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Card: Send from */}
        <Card>
          <div className="text-title" style={{ marginBottom: 14 }}>Send from</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {SENDER_NUMBERS.map(n => {
              const active = form.senderNumber === n.number;
              const isTollFree = n.type === 'Toll-free';
              return (
                <button
                  key={n.number}
                  onClick={() => setForm(f => ({ ...f, senderNumber: n.number }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: 12, borderRadius: 'var(--radius-md)',
                    border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: active ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: `all var(--duration-fast) var(--ease-out)`,
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? 'var(--color-primary)' : 'var(--color-border)',
                    color: active ? 'white' : 'var(--color-text-tertiary)',
                    transition: `all var(--duration-fast) var(--ease-out)`,
                  }}>
                    <I.Send size={12} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-body-strong" style={{ fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.number}</div>
                    <div className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: 1 }}>{n.label}</div>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    height: 20, padding: '0 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)',
                    background: isTollFree ? '#fffbeb' : 'var(--color-primary-subtle)',
                    color: isTollFree ? '#b45309' : 'var(--color-primary)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>{n.type}</span>
                </button>
              );
            })}
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <I.Plus size={14} /> Add a new number
          </button>
        </Card>

        {/* Card: Delivery options */}
        <Card>
          <div className="text-title" style={{ marginBottom: 4 }}>Delivery options</div>
          <div>
            {[
              { key: 'priority' as const, label: 'Priority routing', helper: '+1 credit per page' },
              { key: 'schedule' as const, label: 'Schedule for later' },
              { key: 'receipt' as const, label: 'Request read receipt' },
            ].map((opt, i, arr) => (
              <div key={opt.key} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <Toggle
                  checked={form[opt.key]}
                  onChange={v => setForm(f => ({ ...f, [opt.key]: v }))}
                  label={opt.label}
                  helper={opt.helper}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Card: HIPAA */}
        <Card style={{ background: 'var(--color-primary-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 1 }}>
              <I.Shield size={18} />
            </span>
            <div>
              <div className="text-body-strong" style={{ color: 'var(--color-primary)' }}>HIPAA-secured channel</div>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
                All transmissions are encrypted end-to-end. Audit logs retained for 7 years per HIPAA requirements.
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Button
          variant="primary"
          disabled={!canContinue}
          onClick={onNext}
          style={{ width: '100%', height: 44, justifyContent: 'center' }}
        >
          Continue to preview →
        </Button>
        {!canContinue && (
          <p className="text-body" style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: -8 }}>
            Add a fax number, subject, and at least one document.
          </p>
        )}
      </div>
    </div>
  );
}

// ── STEP 2: PREVIEW ───────────────────────────────────────────────────────────

function StepPreview({ form, sender, totalPages, credits, onSend, sending }: {
  form: typeof defaultForm;
  sender: typeof SENDER_NUMBERS[0];
  totalPages: number;
  credits: number;
  onSend: () => void;
  sending: boolean;
}) {
  const remaining = CREDIT_BALANCE - credits;
  const usagePct = Math.min(100, Math.round((credits / CREDIT_BALANCE) * 100));

  const detailRows = [
    { key: 'Subject',     val: form.subject },
    { key: 'Cover sheet', val: form.includeCover ? 'Included' : 'None' },
    { key: 'Documents',   val: form.file?.name ?? '—' },
    { key: 'Priority',    val: form.priority ? 'Enabled (+1×)' : 'Standard' },
    { key: 'Schedule',    val: form.schedule ? 'Scheduled' : 'Send now' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

      {/* ── Left: document preview ── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="text-body-strong">{form.file?.name ?? 'Document'}</div>
          <StatusBadge variant="delivered" label="Ready to send" />
        </div>
        <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginBottom: 20 }}>
          {totalPages} pages total{form.includeCover ? ' (incl. cover)' : ''}
        </div>

        {/* Cover page preview */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{
            background: 'var(--color-primary-subtle)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span className="text-label" style={{ color: 'var(--color-primary)' }}>
              {form.subject.toUpperCase() || 'AUTHORIZATION REQUEST'}
            </span>
            <span className="text-label" style={{ color: 'var(--color-primary)' }}>PG 1/{totalPages}</span>
          </div>
          <div style={{ padding: '20px 20px 16px', background: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
              <div>
                <div className="text-label" style={{ color: 'var(--color-text-tertiary)', marginBottom: 4 }}>FROM</div>
                <div className="text-body-strong">{sender.label}</div>
                <div className="text-body" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{sender.number}</div>
              </div>
              <div>
                <div className="text-label" style={{ color: 'var(--color-text-tertiary)', marginBottom: 4 }}>TO</div>
                <div className="text-body-strong">{form.recipientName}</div>
                {form.recipientAttn && <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>ATTN: {form.recipientAttn}</div>}
                <div className="text-body" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{form.recipientNumber}</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--color-border)', margin: '0 0 14px' }} />
            {[92, 70, 85, 45, 78, 92, 60].map((w, i) => (
              <div key={i} style={{
                height: 8, borderRadius: 4, marginBottom: 8,
                width: `${w}%`,
                background: 'var(--color-border)',
              }} />
            ))}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 16, overflowX: 'auto' }}>
          {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 60, aspectRatio: '3/4',
              borderRadius: 'var(--radius-sm)',
              border: i === 0 ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              padding: 6, position: 'relative', overflow: 'hidden',
            }}>
              {[70, 50, 80, 40, 60].map((w, j) => (
                <div key={j} style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', width: `${w}%`, marginBottom: 4 }} />
              ))}
              <div style={{
                position: 'absolute', bottom: 4, left: 0, right: 0,
                textAlign: 'center', fontSize: 9, fontFamily: 'var(--font-body)',
                color: 'var(--color-text-tertiary)', fontWeight: 600,
              }}>{i + 1}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Right: summary ── */}
      <Card>
        <div className="text-title" style={{ marginBottom: 16 }}>Ready to send</div>

        {/* FROM/TO */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)' }}>
            <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-text-tertiary)' }}>
              <I.Send size={14} />
            </span>
            <div>
              <div className="text-label" style={{ color: 'var(--color-text-tertiary)' }}>From</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{sender.number}</div>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>{sender.label}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0', color: 'var(--color-text-tertiary)' }}>
            <I.Arrow size={16} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-subtle)' }}>
            <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
              <I.Inbox size={14} />
            </span>
            <div>
              <div className="text-label" style={{ color: 'var(--color-primary)' }}>To</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{form.recipientNumber}</div>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>{form.recipientName}{form.recipientAttn ? ` · ${form.recipientAttn}` : ''}</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--color-border)', margin: '0 0 16px' }} />

        {/* Details list */}
        <div style={{ marginBottom: 16 }}>
          {detailRows.map(({ key, val }, i) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              height: 32,
              borderBottom: i < detailRows.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <span className="text-body" style={{ color: 'var(--color-text-secondary)' }}>{key}</span>
              <span className="text-body-strong" style={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--color-border)', margin: '0 0 16px' }} />

        {/* Credit cost */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{credits}</div>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>{totalPages} pages × {form.priority ? '1.5 credits' : '1 credit'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>Balance after</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>{remaining}</div>
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--color-border)', overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'var(--color-primary)', width: `${usagePct}%`, transition: `width var(--duration-base) var(--ease-out)` }} />
          </div>
          <div className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>{credits} of {CREDIT_BALANCE} credits used for this send</div>
        </div>

        {/* Action buttons */}
        {sending ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-subtle)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div>
              <div className="text-body-strong">Connecting to recipient…</div>
              <div className="text-body" style={{ color: 'var(--color-text-tertiary)' }}>Negotiating ECM at 14400 baud</div>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={onSend}
            style={{ width: '100%', height: 44, justifyContent: 'center' }}
          >
            Send fax · {credits} {credits === 1 ? 'credit' : 'credits'}
          </Button>
        )}
      </Card>
    </div>
  );
}

// ── STEP 3: CONFIRMATION ──────────────────────────────────────────────────────

function StepConfirm({ form, sender, totalPages, onSendAnother }: {
  form: typeof defaultForm;
  sender: typeof SENDER_NUMBERS[0];
  totalPages: number;
  onSendAnother: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timers = [0, 1, 2, 3].map(i =>
      setTimeout(() => setVisibleSteps(v => Math.max(v, i + 1)), i * 300)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText('FX-9824-1A').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timelineSteps = [
    { title: 'Queued',       time: 'Just now',    desc: 'Fax queued for transmission.',   via: 'via FaxGrid scheduler', state: 'done' as const },
    { title: 'Connecting',   time: 'Moments ago', desc: 'Dialing recipient line.',         via: 'via Telnyx carrier',    state: 'active' as const },
    { title: 'Transmitting', time: 'Pending',     desc: 'Sending pages to device.',       via: 'via ECM protocol',      state: 'pending' as const },
    { title: 'Delivered',    time: 'Pending',     desc: 'Delivery confirmed by carrier.', via: 'via Telnyx confirmation', state: 'pending' as const },
  ];

  const detailRows = [
    { key: 'From',      val: sender.number, mono: true },
    { key: 'To',        val: form.recipientNumber, mono: true },
    { key: 'Recipient', val: form.recipientName },
    { key: 'Subject',   val: form.subject },
    { key: 'Pages',     val: String(totalPages) },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

      {/* ── Left: success card ── */}
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 48 }}>
        <style>{`
          @keyframes draw-check-send {
            from { stroke-dashoffset: 30; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes timeline-in {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes dot-pulse {
            0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-review) 40%, transparent); }
            50%       { box-shadow: 0 0 0 5px color-mix(in srgb, var(--color-review) 0%, transparent); }
          }
        `}</style>

        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-delivered-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-delivered)' }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path style={{ strokeDasharray: 30, strokeDashoffset: 0, animation: 'draw-check-send 0.6s ease-out 0.2s both' }} d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 20 }}>
          Your fax is on its way.
        </div>
        <div className="text-body" style={{ color: 'var(--color-text-secondary)', maxWidth: 320, marginTop: 8, lineHeight: 1.6 }}>
          Your document is being transmitted. You'll receive a delivery receipt when it arrives.
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          marginTop: 20,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>FX-9824-1A</span>
          <button
            onClick={copy}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 0 }}
          >
            {copied ? <I.Check size={14} strokeWidth={2.5} /> : <I.Document size={14} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <Button variant="secondary">View fax record</Button>
          <Button variant="primary" onClick={onSendAnother}>Send another</Button>
        </div>
      </Card>

      {/* ── Right column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Transmission card */}
        <Card>
          <div className="text-title" style={{ marginBottom: 2 }}>Transmission</div>
          <div className="text-body" style={{ color: 'var(--color-text-tertiary)', marginBottom: 20 }}>Live status — updates as carrier reports back.</div>

          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical connector */}
            <div style={{
              position: 'absolute', left: 7, top: 6, bottom: 6,
              width: 1, background: 'var(--color-border)',
              zIndex: 0,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {timelineSteps.map((s, i) => {
                const visible = visibleSteps > i;
                const isDone = s.state === 'done';
                const isActive = s.state === 'active';
                return (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(4px)',
                      transition: `opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)`,
                    }}
                  >
                    {/* Dot */}
                    <span style={{
                      position: 'absolute', left: -20, top: 3,
                      width: 12, height: 12, borderRadius: '50%',
                      background: isDone ? 'var(--color-delivered)' : isActive ? 'var(--color-review)' : 'var(--color-surface)',
                      border: isDone || isActive ? 'none' : '1.5px solid var(--color-border)',
                      zIndex: 1,
                      animation: isActive ? 'dot-pulse 2s ease-in-out infinite' : 'none',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                      <span className="text-body-strong">{s.title}</span>
                      <span className="text-body" style={{ color: 'var(--color-text-tertiary)', fontSize: 11 }}>{s.time}</span>
                    </div>
                    <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>{s.desc}</div>
                    <div className="text-body" style={{ color: 'var(--color-text-tertiary)', fontSize: 11, fontStyle: 'italic', marginTop: 1 }}>{s.via}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Fax details card */}
        <Card>
          {detailRows.map(({ key, val, mono }, i) => (
            <div key={key} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              height: 32,
              borderBottom: i < detailRows.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <span className="text-body" style={{ color: 'var(--color-text-secondary)' }}>{key}</span>
              <span className="text-body-strong" style={{ fontFamily: mono ? 'var(--font-mono)' : undefined, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{val}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} />
          <div style={{ display: 'flex', gap: 16 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <I.Download size={14} /> Download receipt
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <I.Forward size={14} /> Forward
            </button>
          </div>
        </Card>

        {/* Save as template card */}
        <Card style={{ background: 'var(--color-primary-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 1 }}>
              <I.Star size={18} />
            </span>
            <div>
              <div className="text-body-strong">Save this as a template?</div>
              <div className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Reuse this recipient, subject, and settings for future prior auth requests.
              </div>
              <button style={{ marginTop: 8, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Create template →
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function SendPage() {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const goSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setStep(2); }, 1400);
  };

  const reset = () => {
    setForm({ ...defaultForm, subject: '', cover: '', file: null, recipientName: '', recipientNumber: '', recipientAttn: '' });
    setStep(0);
  };

  const sender = SENDER_NUMBERS.find(s => s.number === form.senderNumber) ?? SENDER_NUMBERS[0];
  const totalPages = (form.file?.pages ?? 0) + (form.includeCover ? 1 : 0);
  const credits = Math.ceil(totalPages * (form.priority ? 1.5 : 1));

  const headers = [
    { overline: 'COMPOSE · STEP 1 OF 3', headline: 'New fax.',            subline: 'Compose your fax — we handle the dialing, retries, and delivery receipts.' },
    { overline: 'PREVIEW · STEP 2 OF 3', headline: 'Take one last look.', subline: 'Confirm the recipient, sender, and credit cost before transmitting.' },
    { overline: 'SENT · STEP 3 OF 3',    headline: 'Sent.',                subline: `Confirmation #FX-9824-1A · ${form.file?.pages ?? 0} pages to ${form.recipientName || 'recipient'}.` },
  ];

  const h = headers[step];

  return (
    <div>
      {/* Bleed PageHeader to main edges by negating the main's horizontal padding */}
      <div style={{ margin: '0 -32px' }}>
        <PageHeader
          overline={h.overline}
          headline={h.headline}
          subline={h.subline}
          actions={step < 2 ? (
            <>
              <Button variant="ghost">Save draft</Button>
              <Button variant="secondary">
                <I.Templates size={14} /> From template
              </Button>
            </>
          ) : undefined}
        />
      </div>

      <div style={{ paddingTop: 24 }}>
        <StepIndicator current={step} onBack={step === 1 ? () => setStep(0) : undefined} />

        {step === 0 && <StepCompose form={form} setForm={setForm} onNext={() => setStep(1)} />}
        {step === 1 && (
          <StepPreview
            form={form}
            sender={sender}
            totalPages={totalPages}
            credits={credits}
            onSend={goSend}
            sending={sending}
          />
        )}
        {step === 2 && (
          <StepConfirm
            form={form}
            sender={sender}
            totalPages={totalPages}
            onSendAnother={reset}
          />
        )}
      </div>
    </div>
  );
}
