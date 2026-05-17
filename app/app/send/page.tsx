'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, SectionTitle } from '@/components/app/primitives';

// ── DATA ─────────────────────────────────────────────────────────────────────

const SENDER_NUMBERS = [
  { number: '+1 (206) 555-0142', label: 'Seattle · Cardiology',   type: 'Local',     isDefault: true },
  { number: '+1 (206) 555-0319', label: 'Seattle · Front desk',   type: 'Local' },
  { number: '+1 (888) 555-0903', label: 'Toll-free · Nationwide', type: 'Toll-free' },
];

const RECENT_RECIPIENTS = [
  { name: 'BlueShield Prior Auth',     number: '+1 (888) 555-0903', attn: 'Authorizations Dept.', tone: 'teal' },
  { name: 'Swedish Medical · Records', number: '+1 (206) 555-7711', attn: 'ROI Office',            tone: 'violet' },
  { name: 'Aetna Claims',              number: '+1 (800) 555-2840', attn: 'Claims Review',         tone: 'amber' },
];

const SAMPLE_FILE = { name: 'PriorAuth_A24189.pdf', size: '284 KB', pages: 7 };

const STATUS_TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  emerald: { bg: '#ecfdf5',               fg: '#047857',            dot: '#10b981' },
  teal:    { bg: 'var(--color-primary-subtle)', fg: 'var(--color-primary)', dot: 'var(--color-primary)' },
  amber:   { bg: '#fffbeb',               fg: '#b45309',            dot: '#f59e0b' },
  slate:   { bg: '#f1f5f9',              fg: '#475569',            dot: '#94a3b8' },
  violet:  { bg: '#f5f3ff',              fg: '#6d28d9',            dot: '#8b5cf6' },
};

// ── FORM ──────────────────────────────────────────────────────────────────────

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

// ── SHARED INPUT CLASS ────────────────────────────────────────────────────────

const inputCls = 'w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 placeholder:text-slate-400 transition';

// ── LOCAL SUB-COMPONENTS ──────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, helper }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; helper?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <span
        onClick={() => onChange(!checked)}
        className="inline-flex shrink-0 mt-0.5 w-9 h-5 rounded-full transition relative"
        style={{ background: checked ? 'var(--color-primary)' : '#cbd5e1' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? '18px' : '2px' }}
        />
      </span>
      <span>
        <span className="block text-[13.5px] font-medium text-slate-900">{label}</span>
        {helper && <span className="block text-[12.5px] text-slate-500 mt-0.5">{helper}</span>}
      </span>
    </label>
  );
}

function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-3">
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <li key={i} className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition ${active ? 'bg-slate-900 text-white' : done ? 'text-white' : 'bg-slate-100 text-slate-500'}`}
              style={done ? { background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' } : undefined}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] inline-flex items-center justify-center ${active ? 'bg-white text-slate-900' : done ? 'text-white' : 'bg-white text-slate-400'}`}
                style={done ? { background: 'var(--color-primary)', color: 'white' } : undefined}
              >
                {done ? '✓' : i + 1}
              </span>
              {s}
            </span>
            {i < steps.length - 1 && <span className="w-6 h-px bg-slate-200" />}
          </li>
        );
      })}
    </ol>
  );
}

function DocPreview({ title, from, to, pages }: { title: string; from: string; to: string; pages: number }) {
  return (
    <div className="relative">
      <div
        className="absolute -inset-3 rounded-[32px] -z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(15,23,42,0.04) 0 8px, transparent 8px 16px)',
          backgroundColor: 'rgba(241,245,249,0.6)',
        }}
      />
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 overflow-hidden">
        <div
          className="flex items-center gap-2 px-5 py-3 border-b border-slate-100"
          style={{ background: 'linear-gradient(90deg, var(--color-primary-subtle), white)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
          <span className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: 'var(--color-primary)' }}>
            {title}
          </span>
          <span className="ml-auto text-[11px] text-slate-400 font-mono">PG 1/{pages}</span>
        </div>
        <div className="px-7 py-6 space-y-5">
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">From</div>
            <div className="text-[13px] text-slate-900 font-medium">{from}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">To</div>
            <div className="text-[13px] text-slate-900 font-medium">{to}</div>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="space-y-2.5">
            {(['long', 'med', 'long', 'short', 'med', 'long', 'long'] as const).map((w, i) => (
              <div
                key={i}
                className="h-2 rounded-full"
                style={{
                  width: w === 'long' ? '92%' : w === 'med' ? '70%' : '40%',
                  background: 'linear-gradient(90deg, #e2e8f0, #f1f5f9)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STEP 0: COMPOSE ───────────────────────────────────────────────────────────

function StepCompose({ form, setForm, onNext }: {
  form: typeof defaultForm;
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>;
  onNext: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const canContinue = !!form.recipientNumber && !!form.subject && !!form.file;

  const selectRecipient = (r: typeof RECENT_RECIPIENTS[0]) =>
    setForm(f => ({ ...f, recipientName: r.name, recipientNumber: r.number, recipientAttn: r.attn }));

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Left (8 cols) ── */}
      <div className="col-span-8 space-y-6">

        {/* Card 1: Recipient */}
        <Card className="p-6 space-y-5">
          <SectionTitle title="Recipient" subtitle="Where this fax is going." />

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7">
              <label className="block text-[12.5px] font-medium text-slate-500 mb-1.5">Fax number</label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white overflow-hidden focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition">
                <span className="px-3.5 text-[12px] font-semibold text-slate-400 border-r border-slate-200 py-2.5 select-none">FAX</span>
                <input
                  className="flex-1 px-3 py-2.5 text-[14px] text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-mono"
                  value={form.recipientNumber}
                  onChange={e => setForm(f => ({ ...f, recipientNumber: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="col-span-5">
              <label className="block text-[12.5px] font-medium text-slate-500 mb-1.5">Recipient name</label>
              <input
                className={inputCls}
                value={form.recipientName}
                onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                placeholder="Organization or person"
              />
            </div>

            <div className="col-span-12">
              <label className="block text-[12.5px] font-medium text-slate-500 mb-1.5">
                ATTN <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                className={inputCls}
                value={form.recipientAttn}
                onChange={e => setForm(f => ({ ...f, recipientAttn: e.target.value }))}
                placeholder="Attention line — e.g. Authorization Dept."
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[12px] text-slate-400 font-medium">Recent</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {RECENT_RECIPIENTS.map(r => {
                const active = form.recipientNumber === r.number && form.recipientName === r.name;
                return (
                  <button
                    key={r.number}
                    onClick={() => selectRecipient(r)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border text-left transition hover:shadow-sm"
                    style={
                      active
                        ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary-subtle)' }
                        : { borderColor: '#e2e8f0', background: 'white' }
                    }
                  >
                    <Avatar name={r.name} size={28} tone={r.tone} />
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">{r.name}</div>
                      <div className="text-[11.5px] font-mono text-slate-500">{r.number}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Card 2: Cover page */}
        <Card className="p-6 space-y-4">
          <SectionTitle
            title="Cover page"
            subtitle="Subject is printed on the cover sheet; the note follows beneath."
          />
          <div>
            <label className="block text-[12.5px] font-medium text-slate-500 mb-1.5">Subject</label>
            <input
              className={inputCls}
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Subject line"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-medium text-slate-500 mb-1.5">Cover note</label>
            <div className="relative">
              <textarea
                className={`${inputCls} resize-none min-h-[120px]`}
                value={form.cover}
                onChange={e => setForm(f => ({ ...f, cover: e.target.value.slice(0, 500) }))}
                placeholder="Add a message to appear on the cover sheet..."
              />
              <span className="absolute bottom-2.5 right-3 text-[11.5px] text-slate-400 pointer-events-none">
                {form.cover.length}/500
              </span>
            </div>
          </div>
          <Toggle
            checked={form.includeCover}
            onChange={v => setForm(f => ({ ...f, includeCover: v }))}
            label="Include cover sheet"
            helper="Generated automatically with sender, recipient, and the note above."
          />
        </Card>

        {/* Card 3: Documents */}
        <Card className="p-6 space-y-4">
          <SectionTitle
            title="Documents"
            subtitle="PDF, PNG, JPG, or TIFF. Up to 50 MB and 200 pages."
            action={
              form.file ? (
                <button
                  onClick={() => setForm(f => ({ ...f, file: null }))}
                  className="text-[13px] font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-xl hover:bg-slate-100 transition"
                >
                  Remove
                </button>
              ) : undefined
            }
          />
          {form.file ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
              >
                <I.Document size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-slate-900 truncate">{form.file.name}</div>
                <div className="text-[12.5px] text-slate-500 mt-0.5">{form.file.pages} pages · {form.file.size}</div>
              </div>
              <Pill tone="emerald">Ready</Pill>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                <I.Eye size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed transition cursor-pointer ${dragOver ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'}`}
              onClick={() => setForm(f => ({ ...f, file: SAMPLE_FILE }))}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setForm(f => ({ ...f, file: SAMPLE_FILE })); }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
              >
                <I.Upload size={22} />
              </div>
              <div className="text-center">
                <div className="text-[14px] font-medium text-slate-900">Drop files here or click to browse</div>
                <div className="text-[12.5px] text-slate-500 mt-1">PDF, PNG, JPG, or TIFF</div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Right (4 cols) ── */}
      <div className="col-span-4 space-y-6">

        {/* Card 4: Send from */}
        <Card className="p-6 space-y-4">
          <SectionTitle title="Send from" />
          <div className="space-y-2">
            {SENDER_NUMBERS.map(n => {
              const active = form.senderNumber === n.number;
              return (
                <button
                  key={n.number}
                  onClick={() => setForm(f => ({ ...f, senderNumber: n.number }))}
                  className="w-full flex items-start gap-3 p-3.5 rounded-2xl border text-left transition"
                  style={
                    active
                      ? { borderColor: 'var(--color-primary)', background: 'var(--color-primary-subtle)' }
                      : { borderColor: '#e2e8f0', background: 'white' }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition"
                    style={
                      active
                        ? { background: 'var(--color-primary)', color: 'white' }
                        : { background: '#f1f5f9', color: '#94a3b8' }
                    }
                  >
                    <I.Send size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-mono font-medium text-slate-900 truncate">{n.number}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{n.label}</div>
                  </div>
                  <Pill tone={n.type === 'Toll-free' ? 'amber' : 'teal'} dot={false}>{n.type}</Pill>
                </button>
              );
            })}
          </div>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition">
            <I.Plus size={14} /> Add a new number
          </button>
        </Card>

        {/* Card 5: Delivery options */}
        <Card className="p-6 space-y-4">
          <SectionTitle title="Delivery options" />
          <div className="space-y-4">
            <Toggle
              checked={form.priority}
              onChange={v => setForm(f => ({ ...f, priority: v }))}
              label="Priority routing"
              helper="+1 credit per page"
            />
            <Toggle
              checked={form.schedule}
              onChange={v => setForm(f => ({ ...f, schedule: v }))}
              label="Schedule for later"
            />
            <Toggle
              checked={form.receipt}
              onChange={v => setForm(f => ({ ...f, receipt: v }))}
              label="Request read receipt"
            />
          </div>
        </Card>

        {/* Card 6: HIPAA notice */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
            >
              <I.Shield size={16} />
            </span>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">HIPAA-secured channel</div>
              <div className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                All transmissions are encrypted end-to-end. Audit logs retained for 7 years per HIPAA requirements.
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="space-y-2.5">
          <AppButton
            variant="primary"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canContinue}
            onClick={onNext}
          >
            Continue to preview →
          </AppButton>
          {!canContinue && (
            <p className="text-[12.5px] text-slate-400 text-center">
              Add a fax number, subject, and at least one document.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STEP 1: PREVIEW ───────────────────────────────────────────────────────────

const CREDIT_BALANCE = 142;

function StepPreview({ form, sender, totalPages, credits, onBack, onSend, sending }: {
  form: typeof defaultForm;
  sender: { number: string; label: string; type: string; isDefault?: boolean };
  totalPages: number;
  credits: number;
  onBack: () => void;
  onSend: () => void;
  sending: boolean;
}) {
  const remaining = CREDIT_BALANCE - credits;
  const usagePct = Math.min(100, Math.round((credits / CREDIT_BALANCE) * 100));

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Left (7 cols): document preview ── */}
      <div className="col-span-7">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold text-slate-900">{form.file?.name ?? 'Document'}</div>
              <div className="text-[12.5px] text-slate-500 mt-0.5">
                {totalPages} pages total{form.includeCover ? ' (incl. cover)' : ''}
              </div>
            </div>
            <Pill tone="emerald">Ready to send</Pill>
          </div>

          <div className="py-2">
            <DocPreview
              title={form.subject || 'Fax Cover Sheet'}
              from={`${sender.label} · ${sender.number}`}
              to={
                form.recipientAttn
                  ? `${form.recipientName} · ATTN: ${form.recipientAttn}`
                  : form.recipientName
              }
              pages={totalPages}
            />
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-16 aspect-[3/4] rounded-xl border border-slate-200 bg-slate-50 flex flex-col p-2 gap-1.5 relative overflow-hidden"
              >
                {[70, 50, 80, 40, 60].map((w, j) => (
                  <div key={j} className="h-1 rounded-full bg-slate-200" style={{ width: `${w}%` }} />
                ))}
                <div className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] text-slate-400 font-medium">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Right (5 cols): summary + credits + actions ── */}
      <div className="col-span-5 space-y-4">

        {/* Summary card */}
        <Card className="p-6 space-y-4">
          <SectionTitle title="Ready to send" />

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-200 text-slate-600 shrink-0">
                <I.Send size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">From</div>
                <div className="text-[13px] font-medium text-slate-900 font-mono">{sender.number}</div>
                <div className="text-[12px] text-slate-500">{sender.label}</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400">
                <I.Arrow size={14} />
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: 'var(--color-primary-subtle)' }}
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary)', color: 'white' }}
              >
                <I.Inbox size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)', opacity: 0.65 }}>To</div>
                <div className="text-[13px] font-medium text-slate-900 font-mono">{form.recipientNumber}</div>
                <div className="text-[12px] text-slate-600">
                  {form.recipientName}{form.recipientAttn ? ` · ${form.recipientAttn}` : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-2.5">
            {[
              { key: 'Subject',     val: form.subject },
              { key: 'Cover sheet', val: form.includeCover ? 'Included' : 'None' },
              { key: 'Documents',   val: form.file?.name ?? '—' },
              { key: 'Priority',    val: form.priority ? 'Enabled (+1×)' : 'Standard' },
              { key: 'Schedule',    val: form.schedule ? 'Scheduled' : 'Send now' },
            ].map(({ key, val }) => (
              <div key={key} className="flex justify-between gap-3">
                <span className="text-[12.5px] text-slate-500 shrink-0">{key}</span>
                <span className="text-[12.5px] font-medium text-slate-900 text-right truncate max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Credits card */}
        <Card className="p-6 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div
                className="text-[42px] font-semibold leading-none tracking-tight"
                style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-inter-tight), system-ui' }}
              >
                {credits}
              </div>
              <div className="text-[12.5px] text-slate-500 mt-1">
                {totalPages} {totalPages === 1 ? 'page' : 'pages'} × {form.priority ? '1.5 credits (priority)' : '1 credit'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11.5px] text-slate-500">Balance after</div>
              <div className="text-[22px] font-semibold text-slate-900">{remaining}</div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${usagePct}%`, background: 'var(--color-primary)' }}
            />
          </div>
          <div className="text-[11.5px] text-slate-400">{credits} of {CREDIT_BALANCE} credits used for this send</div>
        </Card>

        {/* Actions */}
        {sending ? (
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full shrink-0 animate-pulse"
                style={{ background: 'var(--color-primary)' }}
              />
              <div>
                <div className="text-[13.5px] font-semibold text-slate-900">Connecting to recipient…</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Negotiating ECM at 14400 baud</div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex gap-3">
            <AppButton
              variant="secondary"
              onClick={onBack}
              icon={<I.Chevron size={14} className="rotate-180" />}
            >
              Back
            </AppButton>
            <AppButton variant="primary" className="flex-1" onClick={onSend}>
              Send fax · {credits} {credits === 1 ? 'credit' : 'credits'}
            </AppButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STEP 2: CONFIRM ───────────────────────────────────────────────────────────

function StepConfirm({ form, sender, totalPages, onSendAnother }: {
  form: typeof defaultForm;
  sender: { number: string; label: string; type: string; isDefault?: boolean };
  totalPages: number;
  onSendAnother: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText('FX-9824-1A').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timelineSteps = [
    { title: 'Queued',       tone: 'slate', time: 'Just now',    desc: 'Fax queued for transmission.',   via: 'via FaxGrid scheduler' },
    { title: 'Connecting',   tone: 'amber', time: 'Moments ago', desc: 'Dialing recipient line.',         via: 'via Telnyx carrier' },
    { title: 'Transmitting', tone: 'slate', time: 'Pending',     desc: 'Sending pages to device.',       via: 'via ECM protocol' },
    { title: 'Delivered',    tone: 'slate', time: 'Pending',     desc: 'Delivery confirmed by carrier.', via: 'via Telnyx confirmation' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Left (7 cols): confirmation ── */}
      <div className="col-span-7">
        <Card className="p-10 flex flex-col items-center text-center space-y-6">
          <style>{`
            @keyframes draw-check {
              from { stroke-dashoffset: 30; }
              to   { stroke-dashoffset: 0; }
            }
            .draw-check-path {
              stroke-dasharray: 30;
              stroke-dashoffset: 0;
              animation: draw-check 0.6s ease-out 0.2s both;
            }
          `}</style>

          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-primary-subtle)' }}
          >
            <svg
              width="40" height="40" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-primary)"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path className="draw-check-path" d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div>
            <h2
              className="text-[28px] font-semibold text-slate-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Your fax is on its way.
            </h2>
            <p className="text-[14px] text-slate-500 mt-2 max-w-sm mx-auto">
              Your document is being transmitted. You'll receive a delivery receipt when it arrives.
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50">
            <span className="text-[13.5px] font-mono font-semibold text-slate-900">FX-9824-1A</span>
            <button
              onClick={copy}
              className="text-slate-400 hover:text-slate-700 transition"
              title={copied ? 'Copied!' : 'Copy confirmation code'}
            >
              {copied ? <I.Check size={14} strokeWidth={2.5} /> : <I.Document size={14} />}
            </button>
          </div>

          <div className="flex gap-3">
            <AppButton variant="secondary">View fax record</AppButton>
            <AppButton variant="primary" onClick={onSendAnother}>Send another</AppButton>
          </div>
        </Card>
      </div>

      {/* ── Right (5 cols) ── */}
      <div className="col-span-5 space-y-4">

        {/* Transmission timeline */}
        <Card className="p-6 space-y-5">
          <SectionTitle title="Transmission" subtitle="Live status — updates as carrier reports back." />
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-slate-100" />
            <div className="space-y-5">
              {timelineSteps.map((s, i) => {
                const t = STATUS_TONES[s.tone] || STATUS_TONES.slate;
                return (
                  <div key={i} className="relative">
                    <span
                      className="absolute -left-[21px] w-3 h-3 rounded-full ring-2 ring-white"
                      style={{ background: t.dot, top: '3px' }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{s.title}</span>
                      <span className="text-[11.5px] text-slate-400">{s.time}</span>
                    </div>
                    <div className="text-[12.5px] text-slate-500 mt-0.5">{s.desc}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 italic">{s.via}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Summary card */}
        <Card className="p-6 space-y-3">
          <div className="space-y-2.5">
            {[
              { key: 'From',      val: sender.number },
              { key: 'To',        val: form.recipientNumber },
              { key: 'Recipient', val: form.recipientName },
              { key: 'Subject',   val: form.subject },
              { key: 'Pages',     val: String(totalPages) },
            ].map(({ key, val }) => (
              <div key={key} className="flex justify-between gap-3">
                <span className="text-[12.5px] text-slate-500 shrink-0">{key}</span>
                <span className="text-[12.5px] font-medium text-slate-900 text-right truncate max-w-[65%]">{val}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-slate-900 transition">
              <I.Download size={13} /> Download receipt
            </button>
            <span className="text-slate-300">·</span>
            <button className="flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-slate-900 transition">
              <I.Forward size={13} /> Forward
            </button>
          </div>
        </Card>

        {/* Template suggestion */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
            >
              <I.Star size={16} />
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-slate-900">Save this as a template?</div>
              <div className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                Reuse this recipient, subject, and settings for future prior auth requests.
              </div>
              <button
                className="mt-2 text-[12.5px] font-semibold hover:underline transition"
                style={{ color: 'var(--color-primary)' }}
              >
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

  const sender = SENDER_NUMBERS.find(s => s.number === form.senderNumber) || SENDER_NUMBERS[0];
  const totalPages = (form.file?.pages || 0) + (form.includeCover ? 1 : 0);
  const credits = Math.ceil(totalPages * (form.priority ? 1.5 : 1));

  const headings = [
    { greeting: 'Compose · Step 1 of 3', title: 'New fax.',           subtitle: 'Compose your fax — we handle the dialing, retries, and delivery receipts.' },
    { greeting: 'Preview · Step 2 of 3', title: 'Take one last look.', subtitle: 'Confirm the recipient, sender, and credit cost before transmitting.' },
    { greeting: 'Sent · Step 3 of 3',    title: 'Sent.',               subtitle: `Confirmation #FX-9824-1A · ${form.file?.pages ?? 0} pages to ${form.recipientName || 'recipient'}.` },
  ];

  return (
    <div>
      {/* Header card */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
              {headings[step].greeting}
            </div>
            <h1
              className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
              style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}
            >
              {headings[step].title}
            </h1>
            <p className="text-[14px] text-slate-500 mt-2">{headings[step].subtitle}</p>
          </div>
          {step !== 2 && (
            <div className="flex items-center gap-2 shrink-0 pt-1">
              <button className="text-[13px] font-medium text-slate-500 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition">
                Save draft
              </button>
              <button className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-700 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition">
                <I.Templates size={14} /> From template
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Stepper card */}
      <Card className="px-6 py-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Steps steps={['Compose', 'Preview', 'Confirmation']} current={step} />
          <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
            <I.Lock size={12} strokeWidth={2.4} />
            <span>Encrypted end-to-end · HIPAA</span>
          </div>
        </div>
      </Card>

      {step === 0 && <StepCompose form={form} setForm={setForm} onNext={() => setStep(1)} />}
      {step === 1 && (
        <StepPreview
          form={form}
          sender={sender}
          totalPages={totalPages}
          credits={credits}
          onBack={() => setStep(0)}
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
  );
}
