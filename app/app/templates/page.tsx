'use client';
import { useState, useEffect } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const TEMPLATE_CATEGORIES = ['All', 'Cover pages', 'Prior auth', 'Referrals', 'Records request', 'Legal'];

const TEMPLATES = [
  { id: 't1', name: 'Standard cover page',         cat: 'Cover pages',      uses: 1284, by: 'Workspace default',  updated: '2 weeks ago', featured: true,  accent: true,  lines: ['long','med','long','short','med','long','long'], usageCount: '1,284×', lastUsed: 'Used today',   createdBy: 'A. Park'   },
  { id: 't2', name: 'BlueShield prior auth',        cat: 'Prior auth',       uses: 412,  by: 'Amelia Park',        updated: 'Mar 18',      featured: false, accent: false, lines: ['short','long','med','long','short'],            usageCount: '412×',   lastUsed: 'Used 1d ago',  createdBy: 'A. Park'   },
  { id: 't3', name: 'Aetna prior auth',             cat: 'Prior auth',       uses: 287,  by: 'Amelia Park',        updated: 'Mar 12',      featured: false, accent: false, lines: ['med','long','short','long','med'],              usageCount: '287×',   lastUsed: 'Used 3d ago',  createdBy: 'M. Torres' },
  { id: 't4', name: 'Cardiology referral',          cat: 'Referrals',        uses: 198,  by: 'Dr. M. Greaves',     updated: 'Feb 28',      featured: false, accent: false, lines: ['long','short','long','med','long'],             usageCount: '198×',   lastUsed: 'Used 2d ago',  createdBy: 'A. Park'   },
  { id: 't5', name: 'Records request — standard',  cat: 'Records request',  uses: 176,  by: 'Priya Khanna',       updated: 'Feb 20',      featured: false, accent: false, lines: ['med','long','med','short','long'],              usageCount: '176×',   lastUsed: 'Used 5d ago',  createdBy: 'J. Kim'    },
  { id: 't6', name: 'Legal hold notice',            cat: 'Legal',            uses: 44,   by: 'Outside counsel',    updated: 'Jan 14',      featured: false, accent: false, lines: ['short','med','long','long','short'],            usageCount: '44×',    lastUsed: 'Used 12d ago', createdBy: 'A. Park'   },
  { id: 't7', name: 'Patient consent cover',        cat: 'Cover pages',      uses: 391,  by: 'Brand · Maria K.',   updated: 'Jan 09',      featured: false, accent: false, lines: ['long','long','med','short','long'],             usageCount: '391×',   lastUsed: 'Used 1d ago',  createdBy: 'M. Torres' },
  { id: 't8', name: 'Lab order routing',            cat: 'Records request',  uses: 89,   by: 'Priya Khanna',       updated: 'Dec 22',      featured: false, accent: false, lines: ['med','short','long','med','long'],              usageCount: '89×',    lastUsed: 'Used 4d ago',  createdBy: 'J. Kim'    },
];
type Template = typeof TEMPLATES[number];
type EditFields = { name: string; subject: string; body: string; urgency: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDefaultFields(t: Template): EditFields {
  if (t.name === 'Cardiology referral') {
    return {
      name: t.name,
      subject: 'Cardiology Referral — Patient {{patient.id}}',
      body: 'Please find enclosed a referral for the above-named patient requiring cardiology consultation. The patient presents with chest pain and shortness of breath. Recent ECG findings are attached for your review.\n\nPlease contact our office at your earliest convenience to schedule an appointment. We request this be treated as {{urgency}} priority.\n\nThank you for your continued partnership.',
      urgency: 'Routine',
    };
  }
  return {
    name: t.name,
    subject: t.name,
    body: `Template body content for ${t.name}. Edit to customize.`,
    urgency: 'Routine',
  };
}

// ── Tab ───────────────────────────────────────────────────────────────────────

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition whitespace-nowrap ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
      {children}
    </button>
  );
}

const LINE_WIDTHS: Record<string, string> = { long: '85%', med: '60%', short: '35%' };

// ── DocPreview (kept, not used in modal) ──────────────────────────────────────

function DocPreview({ title, from, to, pages }: { title: string; from: string; to: string; pages: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200" style={{ background: 'repeating-linear-gradient(45deg, rgba(61,80,128,0.03) 0px, rgba(61,80,128,0.03) 1px, transparent 1px, transparent 8px)' }}>
      <div className="p-5" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), rgba(238,241,247,0.5))' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Cover page</span>
        </div>
        <div className="text-[15px] font-semibold text-slate-900">{title}</div>
        <div className="text-[12px] text-slate-500 mt-0.5">From: {from} · To: {to} · {pages}p</div>
      </div>
      <div className="bg-white p-5 space-y-2">
        {['long','med','long','short','med'].map((w, i) => (
          <div key={i} className="h-2 rounded-full bg-slate-100" style={{ width: LINE_WIDTHS[w] }} />
        ))}
      </div>
    </div>
  );
}

// ── SoftCard ──────────────────────────────────────────────────────────────────

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>{children}</div>;
}

// ── TemplateCard ──────────────────────────────────────────────────────────────

function TemplateCard({ t, onClick, selected }: { t: Template; onClick: () => void; selected: boolean }) {
  const [hovered, setHovered] = useState(false);

  const CAT_STYLE: Record<string, { color: string; bg: string }> = {
    'Cover pages':     { color: 'var(--color-primary)',    bg: 'var(--color-primary-subtle)' },
    'Prior auth':      { color: 'var(--color-phi)',        bg: 'var(--color-phi-bg)' },
    'Referrals':       { color: 'var(--color-processing)', bg: 'var(--color-processing-bg)' },
    'Records request': { color: 'var(--color-review)',     bg: 'var(--color-review-bg)' },
    'Legal':           { color: 'var(--color-archived)',   bg: 'var(--color-archived-bg)' },
  };
  const cs = CAT_STYLE[t.cat] ?? CAT_STYLE['Cover pages'];

  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full text-left rounded-[24px] p-1 transition ${selected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
      <div
        className="rounded-[20px] overflow-hidden border border-slate-200/70 bg-white"
        style={{ transition: 'transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-panel)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
      >
        <div className="relative" style={{ height: 108, maxHeight: 108, background: 'var(--color-bg)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 20, fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '999px', backgroundColor: cs.bg, color: cs.color, lineHeight: 1.4 }}>
            {t.cat}
          </div>
          {t.featured && (
            <div className="absolute top-2 right-2 z-10">
              <Pill tone="teal" dot={false}>Default</Pill>
            </div>
          )}
          <div style={{ margin: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.lines.slice(0, 5).map((w, i) => (
              <div key={i} style={{ height: i % 2 === 0 ? 8 : 6, background: 'var(--color-border)', borderRadius: 3, width: LINE_WIDTHS[w] }} />
            ))}
          </div>
          {hovered && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,80,128,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <span style={{ fontFamily: 'var(--font-sora)', fontSize: '13px', fontWeight: 500, color: 'var(--color-primary)', background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-pill)', padding: '6px 16px' }}>
                Use template →
              </span>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="text-[13.5px] font-semibold text-slate-900 truncate">{t.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 3 }}>
            {t.usageCount} · {t.lastUsed} · {t.createdBy}
          </div>
        </div>
      </div>
    </button>
  );
}

// ── LiveDocPreview sub-components ─────────────────────────────────────────────

function HeaderPair({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', padding: '2px 0' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)', minWidth: 60, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-sora)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
        {value}
      </span>
    </div>
  );
}

function BodyWithPills({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((para, pIdx) => (
        <p key={pIdx} style={{ margin: 0, marginBottom: pIdx < paragraphs.length - 1 ? '1em' : 0 }}>
          {para.split(/({{[^}]+}})/g).map((part, i) =>
            /^{{[^}]+}}$/.test(part) ? (
              <span key={i} style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--color-processing)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: '4px', padding: '1px 5px', fontSize: '11px', fontFamily: 'var(--font-mono)', margin: '0 1px' }}>
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      ))}
    </>
  );
}

function LiveDocPreview({ template, fields }: { template: Template; fields: EditFields; editMode: boolean }) {
  const isCardiology = template.name === 'Cardiology referral';

  return (
    <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', fontFamily: 'var(--font-sora)', fontSize: '12px' }}>
      {/* Letterhead */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-tertiary)', marginBottom: 10 }}>
        NORTHWIND HEALTH · CARDIOLOGY
      </div>
      <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 14 }} />

      {/* Fax header block */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 14 }}>
        <HeaderPair label="TO"      value="Valley Medical Group · Dr. Sarah Chen" />
        <HeaderPair label="FAX"     value="+1 (801) 555-0187" />
        <HeaderPair label="FROM"    value="Northwind Health · Cardiology" />
        <HeaderPair label="FAX"     value="+1 (206) 555-0142" />
        <HeaderPair label="DATE"    value="May 19, 2026" />
        <HeaderPair label="PAGES"   value="2" />
        <div style={{ gridColumn: '1 / -1' }}>
          <HeaderPair label="RE" value={fields.subject} />
        </div>
        <HeaderPair label="PATIENT"  value="{{patient.id}}" />
        <HeaderPair label="URGENCY"  value={fields.urgency} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 18 }} />

      {/* Body or skeleton */}
      {isCardiology ? (
        <div>
          <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)' }}>
            <BodyWithPills text={fields.body} />
          </div>
          <div style={{ marginTop: 32 }}>
            <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 12, width: '40%' }} />
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: '11px', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
              Dr. Michael Greaves, MD · Cardiologist<br />
              Northwind Health · Cardiology Department
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(['long','med','long','short','med','long'] as const).map((w, i) => (
            <div key={i} style={{ height: i % 2 === 0 ? 8 : 6, background: 'var(--color-border)', borderRadius: 3, width: LINE_WIDTHS[w] }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── EditField ─────────────────────────────────────────────────────────────────

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-sora)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-tertiary)', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ── TemplatesPage ─────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState<EditFields>({ name: '', subject: '', body: '', urgency: 'Routine' });

  useEffect(() => {
    if (open) {
      setEditMode(false);
      setEditFields(getDefaultFields(open));
    }
  }, [open]);

  const filtered = TEMPLATES.filter(t => {
    if (cat !== 'All' && t.cat !== cat) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inputBase = {
    width: '100%',
    fontFamily: 'var(--font-sora)',
    fontSize: '13px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    background: 'white',
    color: 'var(--color-text-primary)',
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-primary)';
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-border-strong)';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ paddingTop: 32, paddingBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Templates · {TEMPLATES.length} saved</div>
          <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>Your fax templates.</h1>
          <p className="text-[14px] text-slate-500 mt-2">Pre-built fax layouts for recurring sends. Select a template to pre-fill the compose form.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>New template</AppButton>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '24px' }}>
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <I.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400"
            placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {TEMPLATE_CATEGORIES.map(c => <Tab key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Tab>)}
        </div>
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <Card className="p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            <I.Templates size={26} />
          </div>
          <div className="text-[26px] font-semibold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>No templates match.</div>
          <div className="text-[13.5px] text-slate-500 mt-1.5 max-w-sm mx-auto">Try a different category or start from scratch — every template can be shared with your team.</div>
          <AppButton className="mt-6" icon={<I.Plus size={14} />}>Create new template</AppButton>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(t => <TemplateCard key={t.id} t={t} onClick={() => setOpen(t)} selected={open?.id === t.id} />)}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center p-6"
          onClick={() => { if (!editMode) setOpen(null); }}
        >
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]" />
          <div
            className="relative w-[920px] max-w-full max-h-[88vh] overflow-hidden flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[14px] border border-white/85 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.35)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-7 pb-5 border-b border-slate-100" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--color-text-secondary)' }}
                onClick={() => setOpen(null)}
              >
                <I.X size={16} />
              </button>
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                  <I.Templates size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Template</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
                      {open.name}
                    </span>
                    {editMode && (
                      <span style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', borderRadius: '999px', fontSize: '11px', padding: '2px 10px', fontFamily: 'var(--font-mono)' }}>
                        EDITING
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Pill tone="teal" dot={false}>{open.cat}</Pill>
                    <span style={{ fontSize: '12.5px', color: 'var(--color-text-tertiary)' }}>
                      Used {open.uses.toLocaleString()} times · Updated {open.updated}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              className="flex-1 overflow-auto scrollbar-thin"
              style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 24, padding: 28 }}
            >
              {/* Left: live preview */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
                  PREVIEW
                </div>
                <LiveDocPreview template={open} fields={editFields} editMode={editMode} />
              </div>

              {/* Right: details or edit form */}
              <div>
                {!editMode ? (
                  <div className="space-y-5">
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-tertiary)', fontWeight: 600, marginBottom: 12 }}>Details</div>
                      <SoftCard className="p-4 space-y-2.5 text-[13px]">
                        {[['Owner', open.by], ['Updated', open.updated], ['Visibility', 'Workspace'], ['Pages', '1 page'], ['Uses', open.uses.toLocaleString()]].map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
                            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{v}</span>
                          </div>
                        ))}
                      </SoftCard>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-tertiary)', fontWeight: 600, marginBottom: 8 }}>Merge fields</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['{{recipient.name}}','{{recipient.fax}}','{{patient.id}}','{{provider.npi}}','{{date.today}}'].map(m => (
                          <Pill key={m} tone="teal" dot={false}><span className="font-mono text-[11px]">{m}</span></Pill>
                        ))}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', marginTop: 8, lineHeight: 1.6 }}>
                        Filled in automatically when sending — pulled from the recipient and patient context.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <EditField label="Template Name">
                      <input
                        style={inputBase}
                        value={editFields.name}
                        onChange={e => setEditFields(p => ({ ...p, name: e.target.value }))}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </EditField>
                    <EditField label="Subject / Re line">
                      <input
                        style={inputBase}
                        value={editFields.subject}
                        onChange={e => setEditFields(p => ({ ...p, subject: e.target.value }))}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </EditField>
                    <EditField label="Urgency">
                      <select
                        style={inputBase}
                        value={editFields.urgency}
                        onChange={e => setEditFields(p => ({ ...p, urgency: e.target.value }))}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      >
                        <option>Routine</option>
                        <option>Urgent</option>
                        <option>STAT</option>
                      </select>
                    </EditField>
                    <EditField label="Body">
                      <textarea
                        rows={6}
                        style={{ ...inputBase, fontFamily: 'var(--font-mono)', resize: 'vertical' }}
                        value={editFields.body}
                        onChange={e => setEditFields(p => ({ ...p, body: e.target.value }))}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                      />
                    </EditField>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.4)' }}>
              {!editMode ? (
                <>
                  <div className="flex items-center gap-2">
                    <AppButton
                      variant="secondary"
                      size="sm"
                      icon={<I.Wand size={13} />}
                      onClick={() => { setEditMode(true); setEditFields(getDefaultFields(open)); }}
                    >
                      Edit
                    </AppButton>
                    <AppButton variant="secondary" size="sm" icon={<I.Forward size={13} />}>Duplicate</AppButton>
                    <button className="text-[13px] text-red-600 hover:text-red-700 font-semibold px-2">Archive</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppButton variant="secondary" onClick={() => setOpen(null)}>Close</AppButton>
                    <AppButton icon={<I.Send size={13} />}>Use template</AppButton>
                  </div>
                </>
              ) : (
                <>
                  <AppButton variant="secondary" onClick={() => { setEditMode(false); setEditFields(getDefaultFields(open)); }}>
                    Discard changes
                  </AppButton>
                  <AppButton>Save changes</AppButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
