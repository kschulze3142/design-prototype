'use client';
import { useState } from 'react';
import { I } from '@/components/app/icons';
import { Card, Pill, AppButton, Avatar, SectionTitle } from '@/components/app/primitives';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── DATA ──────────────────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  { id: 'number', title: 'Claim your fax number', desc: 'Pick a local, toll-free, or port your existing number.', icon: 'Numbers' as const, time: '2 min' },
  { id: 'team',   title: 'Invite your team',       desc: 'Bring in coworkers and assign permissions.',           icon: 'Team'    as const, time: '1 min' },
  { id: 'send',   title: 'Send your first fax',    desc: 'Upload a PDF, choose recipient, and confirm.',          icon: 'Send'    as const, time: '3 min' },
  { id: 'route',  title: 'Set up inbox routing',   desc: 'Auto-route inbound faxes to the right person.',         icon: 'Inbox'   as const, time: '2 min' },
  { id: 'secure', title: 'Sign HIPAA BAA',          desc: "We'll generate a Business Associate Agreement.",        icon: 'Shield'  as const, time: '1 min' },
];

const NUMBER_OPTIONS = [
  { type: 'Local',     number: '+1 (206) 555-0142', area: 'Seattle, WA',   cost: 'Included',  recommended: false },
  { type: 'Local',     number: '+1 (206) 555-0319', area: 'Seattle, WA',   cost: 'Included',  recommended: false },
  { type: 'Toll-free', number: '+1 (888) 555-0903', area: 'United States', cost: '+$5/mo',    recommended: true },
  { type: 'Toll-free', number: '+1 (877) 555-2210', area: 'United States', cost: '+$5/mo',    recommended: false },
];

// ── LOCAL SUB-COMPONENTS ──────────────────────────────────────────────────────

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition ${active ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      style={active ? { background: 'var(--color-primary)' } : undefined}
    >
      {children}
    </button>
  );
}

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>{children}</div>;
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

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState('number');
  const [selectedNumber, setSelectedNumber] = useState(NUMBER_OPTIONS[2].number);
  const [invites, setInvites] = useState([{ email: '', role: 'Member' }]);
  const [hipaa, setHipaa] = useState(false);
  const [numberTab, setNumberTab] = useState('browse');

  const completedCount = Object.values(done).filter(Boolean).length;
  const pct = Math.round((completedCount / ONBOARDING_STEPS.length) * 100);

  const complete = (id: string) => {
    setDone(d => ({ ...d, [id]: true }));
    const idx = ONBOARDING_STEPS.findIndex(s => s.id === id);
    const next = ONBOARDING_STEPS.slice(idx + 1).find(s => !done[s.id]);
    if (next) setActive(next.id);
  };

  const activeStep = ONBOARDING_STEPS.find(s => s.id === active)!;

  const inputClass = "w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-[var(--color-primary)] placeholder:text-slate-400 transition";

  return (
    <div>
      {/* Header */}
      <Card className="px-7 py-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] uppercase tracking-[0.14em] text-slate-500 font-semibold">Welcome to FaxGrid</div>
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-900 mt-1.5"
              style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>
              Let's get your workspace ready.
            </h1>
            <p className="text-[14px] text-slate-500 mt-2">A handful of quick steps and you'll be sending HIPAA-grade faxes in under 10 minutes.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppButton variant="ghost" onClick={() => router.push('/app/dashboard')}>Skip for now</AppButton>
            <AppButton variant="secondary" icon={<I.Help size={14} />}>Book onboarding call</AppButton>
          </div>
        </div>
      </Card>

      {/* Progress strip */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="text-[13.5px] text-slate-700">
              <span className="font-semibold">{completedCount} of {ONBOARDING_STEPS.length}</span> steps complete
            </div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">
              {completedCount === ONBOARDING_STEPS.length ? 'All done!' : `Estimated ${(ONBOARDING_STEPS.length - completedCount) * 2} minutes remaining`}
            </div>
          </div>
          <span className="text-[28px] font-semibold text-slate-900" style={{ fontFamily: 'var(--font-heading), system-ui', letterSpacing: '-0.025em' }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--color-primary)' }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-5">
          {ONBOARDING_STEPS.map((s, i) => {
            const isDone = done[s.id], isActive = active === s.id;
            const Ico = I[s.icon];
            return (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`text-left p-3.5 rounded-2xl border transition ${isActive ? 'border-[var(--color-primary)] bg-white shadow-sm' : isDone ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-200/70 bg-white/50 hover:bg-white'}`}>
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><I.Check size={13} strokeWidth={3} /></span>
                  ) : (
                    <span className={`w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center ${isActive ? 'text-white' : 'bg-slate-100 text-slate-500'}`}
                      style={isActive ? { background: 'var(--color-primary)' } : undefined}>{i + 1}</span>
                  )}
                  <Ico size={15} style={{ color: isActive ? 'var(--color-primary)' : '#64748b' }} />
                </div>
                <div className="text-[13px] font-semibold text-slate-900 mt-2">{s.title}</div>
                <div className="text-[11.5px] text-slate-500 mt-0.5">{s.time}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Card className="p-7">
            {/* Step header */}
            <div className="flex items-center gap-3 mb-1">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                {(() => { const Ico = I[activeStep.icon]; return <Ico size={18} />; })()}
              </span>
              <div>
                <div className="text-[12px] uppercase tracking-wider font-bold" style={{ color: 'var(--color-primary)' }}>
                  Step {ONBOARDING_STEPS.findIndex(s => s.id === active) + 1}
                </div>
                <div className="text-[20px] font-semibold text-slate-900">{activeStep.title}</div>
              </div>
            </div>
            <div className="text-[13.5px] text-slate-500 mb-6">{activeStep.desc}</div>

            {/* Step: number */}
            {active === 'number' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Tab active={numberTab === 'browse'} onClick={() => setNumberTab('browse')}>Browse</Tab>
                  <Tab active={numberTab === 'port'} onClick={() => setNumberTab('port')}>Port existing</Tab>
                </div>
                {numberTab === 'browse' ? (
                  <div className="space-y-2">
                    {NUMBER_OPTIONS.map(n => {
                      const sel = n.number === selectedNumber;
                      return (
                        <label key={n.number}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${sel ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]' : 'border-slate-200/70 bg-white/70 hover:border-slate-300'}`}>
                          <input type="radio" name="num" checked={sel} onChange={() => setSelectedNumber(n.number)} className="sr-only" />
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${sel ? 'border-[var(--color-primary)]' : 'border-slate-300'}`}>
                            {sel && <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[14px] text-slate-900">{n.number}</span>
                              {n.recommended && <Pill tone="teal">Recommended</Pill>}
                            </div>
                            <div className="text-[12.5px] text-slate-500 mt-0.5">{n.type} · {n.area}</div>
                          </div>
                          <span className="text-[13px] font-medium text-slate-700 shrink-0">{n.cost}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <SoftCard className="p-6 text-center">
                    <I.Arrow size={24} className="mx-auto text-slate-400 mb-3" />
                    <div className="text-[14px] font-semibold text-slate-900">Port your existing number</div>
                    <div className="text-[13px] text-slate-500 mt-1 max-w-sm mx-auto">We'll handle the transfer from your current carrier — usually takes 3–5 business days.</div>
                    <AppButton variant="secondary" className="mt-4" icon={<I.Plus size={13} />}>Start port request</AppButton>
                  </SoftCard>
                )}
                <div className="mt-6 flex justify-between items-center">
                  <AppButton variant="ghost" onClick={() => complete('number')}>I'll set this up later</AppButton>
                  <AppButton icon={<I.Check size={14} strokeWidth={2.4} />} onClick={() => complete('number')}>Claim number</AppButton>
                </div>
              </div>
            )}

            {/* Step: team */}
            {active === 'team' && (
              <div>
                <div className="space-y-2">
                  {invites.map((inv, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input className={`${inputClass} flex-1`} placeholder="coworker@hospital.org"
                        value={inv.email} onChange={e => setInvites(arr => arr.map((x, j) => j === i ? { ...x, email: e.target.value } : x))} />
                      <select className={`${inputClass} w-[140px]`} value={inv.role}
                        onChange={e => setInvites(arr => arr.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}>
                        <option>Member</option><option>Reviewer</option><option>Admin</option>
                      </select>
                      <button onClick={() => setInvites(arr => arr.filter((_, j) => j !== i))}
                        className="w-10 h-10 rounded-xl text-slate-400 hover:bg-slate-50 flex items-center justify-center">
                        <I.Trash size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setInvites(arr => [...arr, { email: '', role: 'Member' }])}
                  className="mt-3 text-[13px] font-semibold hover:underline flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
                  <I.Plus size={13} /> Add another
                </button>
                <SoftCard className="mt-5 p-4 flex items-start gap-3">
                  <I.Info size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div className="text-[12.5px] text-slate-600">Members can send and read faxes assigned to them. Reviewers approve outbound faxes flagged as PHI. Admins manage billing and security.</div>
                </SoftCard>
                <div className="mt-6 flex justify-between items-center">
                  <AppButton variant="ghost" onClick={() => complete('team')}>Skip for now</AppButton>
                  <AppButton icon={<I.Send size={14} />} onClick={() => complete('team')}>
                    Send {invites.filter(inv => inv.email).length || ''} invite{invites.filter(inv => inv.email).length === 1 ? '' : 's'}
                  </AppButton>
                </div>
              </div>
            )}

            {/* Step: send */}
            {active === 'send' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Recipient</label>
                    <input className={`${inputClass} mt-1.5`} defaultValue="BlueShield Prior Auth" />
                  </div>
                  <div>
                    <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Fax number</label>
                    <input className={`${inputClass} mt-1.5 font-mono`} defaultValue="+1 (888) 555-0903" />
                  </div>
                  <div>
                    <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Subject</label>
                    <input className={`${inputClass} mt-1.5`} defaultValue="Test — please disregard" />
                  </div>
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center bg-white/60">
                    <I.Upload size={18} className="text-slate-400 mx-auto" />
                    <div className="text-[13.5px] font-medium text-slate-700 mt-2">Drop a PDF here</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">or browse · 25MB max</div>
                  </div>
                </div>
                <DocPreview title="Test fax" from="Northwind Health" to="BlueShield Prior Auth" pages={1} />
                <div className="md:col-span-2 mt-2 flex justify-between items-center">
                  <span className="text-[12.5px] text-slate-500">1 page · 1 credit · est. 45 sec</span>
                  <AppButton icon={<I.Send size={14} />} onClick={() => complete('send')}>Send test fax</AppButton>
                </div>
              </div>
            )}

            {/* Step: route */}
            {active === 'route' && (
              <div className="space-y-3">
                {[
                  { match: 'Anything from BlueShield', to: 'Inbox · Auths team' },
                  { match: 'Subject contains "lab"',   to: 'Inbox · Lab review' },
                  { match: 'All other inbound',         to: 'Inbox · General' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 border border-slate-200/70">
                    <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500"><I.Filter size={14} /></span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] text-slate-900 font-medium">{r.match}</div>
                      <div className="text-[12px] text-slate-500 flex items-center gap-1.5 mt-0.5"><I.Arrow size={11} /> {r.to}</div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-700"><I.More size={15} /></button>
                  </div>
                ))}
                <button className="w-full p-4 rounded-2xl border border-dashed border-slate-300 text-[13px] font-medium text-slate-600 hover:border-slate-400 hover:bg-white/60 transition flex items-center justify-center gap-2">
                  <I.Plus size={14} /> Add routing rule
                </button>
                <div className="mt-4 flex justify-between items-center">
                  <AppButton variant="ghost" onClick={() => complete('route')}>Skip for now</AppButton>
                  <AppButton onClick={() => complete('route')}>Save routing</AppButton>
                </div>
              </div>
            )}

            {/* Step: secure */}
            {active === 'secure' && (
              <div>
                <div className="rounded-2xl p-6 border border-white"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
                  <div className="flex items-center gap-3">
                    <I.Shield size={22} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <div className="text-[16px] font-semibold text-slate-900">Business Associate Agreement</div>
                      <div className="text-[12.5px] text-slate-500">Required for HIPAA-covered entities. Auto-generated from your workspace info.</div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4 text-[13px]">
                    {[
                      ['Covered entity', 'Northwind Health, Inc.'],
                      ['Effective', 'March 24, 2026'],
                      ['Authorized signer', 'Amelia Park'],
                      ['Encryption', 'AES-256 at rest, TLS 1.3 in transit'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{k}</div>
                        <div className="text-slate-900 mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="flex items-start gap-3 mt-5 cursor-pointer">
                  <input type="checkbox" checked={hipaa} onChange={e => setHipaa(e.target.checked)}
                    className="mt-1 w-4 h-4" style={{ accentColor: 'var(--color-primary)' }} />
                  <span className="text-[13.5px] text-slate-700">I confirm I'm authorized to sign on behalf of Northwind Health, Inc. and accept the terms of the BAA.</span>
                </label>
                <div className="mt-6 flex justify-between items-center">
                  <AppButton variant="secondary" icon={<I.Download size={14} />}>Download draft</AppButton>
                  <AppButton icon={<I.Lock size={14} />} onClick={() => complete('secure')}>Sign & finish setup</AppButton>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right rail */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6">
            <SectionTitle title="What's an empty workspace?" subtitle="A few things you'll see here once you're set up:" />
            <div className="mt-5 space-y-4">
              {[
                { icon: 'Inbox' as const,  title: 'Inbox',     desc: 'Inbound faxes routed to the right person.' },
                { icon: 'Sent' as const,   title: 'Sent',      desc: 'Every fax with delivery receipt and audit trail.' },
                { icon: 'Audit' as const,  title: 'Audit log', desc: 'Tamper-evident record of every PHI access.' },
              ].map((it, i) => {
                const Ico = I[it.icon];
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0"><Ico size={15} /></span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-slate-900">{it.title}</div>
                      <div className="text-[12.5px] text-slate-500 mt-0.5">{it.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-6">
            <SectionTitle title="Need a hand?" />
            <div className="mt-4 space-y-2.5 text-[13.5px]">
              {[
                { icon: 'Document' as const, label: 'HIPAA setup guide' },
                { icon: 'Globe' as const,    label: 'Porting an existing fax line' },
                { icon: 'Note' as const,     label: 'Cover page best practices' },
              ].map((l, i) => {
                const Ico = I[l.icon];
                return (
                  <a key={i} href="#" className="flex items-center gap-2 text-slate-700 hover:underline">
                    <Ico size={14} /> {l.label}
                  </a>
                );
              })}
            </div>
            <AppButton variant="secondary" className="w-full justify-center mt-5" icon={<I.Help size={14} />}>Talk to onboarding</AppButton>
          </Card>
        </div>
      </div>

      {/* Completion banner */}
      {completedCount === ONBOARDING_STEPS.length && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <Card className="px-5 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-subtle), white)' }}>
            <span className="w-9 h-9 rounded-full text-white flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
              <I.Check size={16} strokeWidth={3} />
            </span>
            <div>
              <div className="text-[14px] font-semibold text-slate-900">You're all set up.</div>
              <div className="text-[12.5px] text-slate-500">Hop into your dashboard whenever you're ready.</div>
            </div>
            <AppButton size="sm" onClick={() => router.push('/app/dashboard')}>Go to dashboard</AppButton>
          </Card>
        </div>
      )}
    </div>
  );
}
