'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, StatCard, SectionTitle } from '@/components/app/primitives';

const TEMPLATE_CATEGORIES = ['All', 'Cover pages', 'Prior auth', 'Referrals', 'Records request', 'Legal'];

const TEMPLATES = [
  { id: 't1', name: 'Standard cover page',         cat: 'Cover pages',      uses: 1284, by: 'Workspace default',  updated: '2 weeks ago', featured: true,  accent: true,  lines: ['long','med','long','short','med','long','long'] },
  { id: 't2', name: 'BlueShield prior auth',        cat: 'Prior auth',       uses: 412,  by: 'Amelia Park',        updated: 'Mar 18',      featured: false, accent: false, lines: ['short','long','med','long','short'] },
  { id: 't3', name: 'Aetna prior auth',             cat: 'Prior auth',       uses: 287,  by: 'Amelia Park',        updated: 'Mar 12',      featured: false, accent: false, lines: ['med','long','short','long','med'] },
  { id: 't4', name: 'Cardiology referral',          cat: 'Referrals',        uses: 198,  by: 'Dr. M. Greaves',     updated: 'Feb 28',      featured: false, accent: false, lines: ['long','short','long','med','long'] },
  { id: 't5', name: 'Records request — patient',   cat: 'Records request',  uses: 167,  by: 'Priya Khanna',       updated: 'Feb 20',      featured: false, accent: false, lines: ['med','long','med','short','long'] },
  { id: 't6', name: 'HIPAA disclosure cover',       cat: 'Legal',            uses: 92,   by: 'Outside counsel',    updated: 'Jan 14',      featured: false, accent: false, lines: ['short','med','long','long','short'] },
  { id: 't7', name: 'Branded letterhead',           cat: 'Cover pages',      uses: 88,   by: 'Brand · Maria K.',   updated: 'Jan 09',      featured: false, accent: false, lines: ['long','long','med','short','long'] },
  { id: 't8', name: 'Records request — payer',     cat: 'Records request',  uses: 73,   by: 'Priya Khanna',       updated: 'Dec 22',      featured: false, accent: false, lines: ['med','short','long','med','long'] },
];
type Template = typeof TEMPLATES[number];

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 text-[13px] rounded-full font-medium transition whitespace-nowrap ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
      {children}
    </button>
  );
}

const LINE_WIDTHS: Record<string, string> = { long: '85%', med: '60%', short: '35%' };

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

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>{children}</div>;
}

function TemplateCard({ t, onClick, selected }: { t: Template; onClick: () => void; selected: boolean }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-[24px] p-1 transition ${selected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
      <div className="rounded-[20px] overflow-hidden border border-slate-200/70 bg-white">
        {/* Thumbnail */}
        <div className="relative p-4" style={{ aspectRatio: '3/4', background: 'var(--color-surface)' }}>
          {t.featured && (
            <div className="absolute top-3 right-3 z-10">
              <Pill tone="teal" dot={false}>Default</Pill>
            </div>
          )}
          <div className="h-full rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-1.5" style={{ background: 'var(--color-primary-subtle)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>{t.cat}</span>
            </div>
            <div className="flex-1 p-3 space-y-1.5">
              {t.lines.map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-slate-100" style={{ width: LINE_WIDTHS[w] }} />
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-slate-900 truncate">{t.name}</div>
            <div className="text-[11.5px] text-slate-500">{t.cat}</div>
          </div>
          <div className="text-[11.5px] text-slate-500 shrink-0 ml-2">{t.uses.toLocaleString()}×</div>
        </div>
      </div>
    </button>
  );
}

export default function TemplatesPage() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Template | null>(null);

  const filtered = TEMPLATES.filter(t => {
    if (cat !== 'All' && t.cat !== cat) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Templates · {TEMPLATES.length} saved</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5" style={{ fontFamily: 'var(--font-inter-tight), system-ui', letterSpacing: '-0.025em' }}>Reusable cover pages and forms.</h1>
            <p className="text-[14px] text-slate-500 mt-2">Save time on repetitive faxes. Create once, reuse with merge fields like {`{{patient.id}}`} and {`{{provider.npi}}`}.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton variant="secondary" icon={<I.Upload size={14} />}>Import</AppButton>
            <AppButton icon={<I.Plus size={15} strokeWidth={2.4} />}>New template</AppButton>
          </div>
        </div>
      </Card>

      {/* Filter bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <I.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400"
              placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {TEMPLATE_CATEGORIES.map(c => <Tab key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Tab>)}
          </div>
        </div>
      </Card>

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
        <div className="fixed inset-0 z-30 flex items-center justify-center p-6" onClick={() => setOpen(null)}>
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]" />
          <div className="relative w-[860px] max-w-full max-h-[88vh] overflow-hidden flex flex-col rounded-[28px] bg-white/90 backdrop-blur-[14px] border border-white/85 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.35)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            {/* Header */}
            <div className="relative p-7 pb-5 border-b border-slate-100" style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
              <button className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-slate-500"
                onClick={() => setOpen(null)}><I.X size={16} /></button>
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                  <I.Templates size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Template</div>
                  <div className="text-[28px] font-semibold text-slate-900 leading-tight mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>{open.name}</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Pill tone="teal" dot={false}>{open.cat}</Pill>
                    <span className="text-[12.5px] text-slate-500">Used {open.uses.toLocaleString()} times · Updated {open.updated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto scrollbar-thin grid grid-cols-12 gap-6 p-7">
              <div className="col-span-12 md:col-span-7">
                <DocPreview title={open.name} from="Northwind Health" to="{{recipient.name}}" pages={1} />
              </div>
              <div className="col-span-12 md:col-span-5 space-y-5">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Details</div>
                  <SoftCard className="p-4 space-y-2.5 text-[13px]">
                    {[['Owner', open.by], ['Updated', open.updated], ['Visibility', 'Workspace'], ['Pages', '1 page'], ['Uses', open.uses.toLocaleString()]].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}</span>
                        <span className="text-slate-900 font-medium">{v}</span>
                      </div>
                    ))}
                  </SoftCard>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Merge fields</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['{{recipient.name}}','{{recipient.fax}}','{{patient.id}}','{{provider.npi}}','{{date.today}}'].map(m => (
                      <Pill key={m} tone="teal" dot={false}><span className="font-mono text-[11px]">{m}</span></Pill>
                    ))}
                  </div>
                  <div className="text-[11.5px] text-slate-400 mt-2 leading-relaxed">Filled in automatically when sending — pulled from the recipient and patient context.</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <AppButton variant="secondary" size="sm" icon={<I.Wand size={13} />}>Edit</AppButton>
                <AppButton variant="secondary" size="sm" icon={<I.Forward size={13} />}>Duplicate</AppButton>
                <button className="text-[13px] text-red-600 hover:text-red-700 font-semibold px-2">Archive</button>
              </div>
              <div className="flex items-center gap-2">
                <AppButton variant="secondary" onClick={() => setOpen(null)}>Close</AppButton>
                <AppButton icon={<I.Send size={13} />}>Use template</AppButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
