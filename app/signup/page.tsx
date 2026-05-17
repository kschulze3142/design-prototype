'use client';
import { useState, useMemo, useEffect, useRef, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { I } from '@/components/app/icons';
import { Pill } from '@/components/app/primitives';

// ─── PLAN DATA ────────────────────────────────────────────────────────────────

const SIGNUP_PLANS = {
  trial: {
    id: 'trial', name: 'Trial', price: 'Free', priceSuffix: null,
    cadence: 'Free for 14 days',
    blurb: 'Try FaxGrid free — no commitment. Card required to start.',
    bullets: ['50 pages included','1 fax number','HIPAA / BAA','Send & receive','Email-to-fax included','No contract, cancel anytime'],
    badge: null, needsPayment: true, trialDays: 14,
  },
  starter: {
    id: 'starter', name: 'Starter', price: '$39', priceSuffix: '/mo',
    cadence: 'Billed monthly · cancel anytime',
    blurb: 'Everything a small office needs.',
    bullets: ['Number porting','500 pages/mo','1 fax number','Email-to-fax','HIPAA / BAA','30 days of fax history','Extra numbers $5/mo','Additional pages $0.10/pg'],
    badge: null, needsPayment: true,
  },
  pro: {
    id: 'pro', name: 'Professional', price: '$89', priceSuffix: '/mo',
    cadence: 'Billed monthly · cancel anytime',
    blurb: 'For growing practices.',
    bullets: ['Number porting','2,000 pages/mo','2 fax numbers included','Email-to-fax','HIPAA / BAA included','Analytics & reporting','90 days of fax history','Extra numbers $5/mo','Additional pages $0.10/pg'],
    badge: 'Most popular', needsPayment: true,
  },
} as const;

type PlanId = keyof typeof SIGNUP_PLANS;
type Plan = typeof SIGNUP_PLANS[PlanId];

const INDUSTRIES = ['Healthcare clinic','Hospital / health system','Dental / vision','Behavioral health','Pharmacy','Legal','Finance / accounting','Insurance','Real estate / title','Government','Other'];
const TEAM_SIZES = ['Just me','2 – 5','6 – 20','21 – 50','51 – 200','200+'];
const ROLES = ['Admin / owner','Office manager','Provider','Reviewer','Member'];

// ─── TYPES ────────────────────────────────────────────────────────────────────

type FormState = {
  first: string; last: string; email: string; password: string;
  terms: boolean;
  workspace: string; industry: string; size: string; role: string; hipaa: string;
  card: string; exp: string; cvc: string; zip: string; promo: string;
};

// ─── SHARED INPUT CLASSNAME ───────────────────────────────────────────────────

const inputCn = 'w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 placeholder:text-slate-400 transition';

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function SignupMark({ size = 36 }: { size?: number }) {
  return (
    <span className="rounded-2xl flex items-center justify-center text-white shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary))', boxShadow: '0 8px 20px -10px var(--color-primary), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>
      </svg>
    </span>
  );
}

function StepDots({ count, current }: { count: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="h-1.5 rounded-full transition-all"
          style={{ width: i === current ? 28 : 8, background: i <= current ? 'var(--color-primary)' : 'rgba(15,23,42,0.10)' }} />
      ))}
    </div>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">{children}</label>
      {optional && <span className="text-[11px] text-slate-400">Optional</span>}
    </div>
  );
}

function SoftCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 ${className}`} style={{ background: 'rgba(248,250,252,0.7)' }}>{children}</div>;
}

function PlanCard({ plan, selected, onClick }: { plan: Plan; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className="relative cursor-pointer rounded-[22px] border-2 p-5 transition-all"
      style={{
        borderColor: selected ? 'var(--color-primary)' : 'rgba(148,163,184,0.5)',
        background: selected ? 'var(--color-primary-subtle)' : 'white',
      }}>
      {plan.badge && (
        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
          style={{ background: 'var(--color-primary)' }}>
          {plan.badge}
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: selected ? 'var(--color-primary)' : '#cbd5e1',
            background: selected ? 'var(--color-primary)' : 'white',
          }}>
          {selected && <I.Check size={10} strokeWidth={3} className="text-white" />}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[16px] font-semibold text-slate-900">{plan.name}</span>
            <div className="text-right shrink-0">
              <span className="text-[22px] font-semibold text-slate-900">{plan.price}</span>
              {plan.priceSuffix && <span className="text-[13px] text-slate-500">{plan.priceSuffix}</span>}
            </div>
          </div>
          <div className="text-[12px] text-slate-500 mt-0.5">{plan.cadence}</div>
        </div>
      </div>
      <div className="text-[13px] text-slate-600 mb-3">{plan.blurb}</div>
      <div className="space-y-1.5">
        {plan.bullets.map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-[12.5px] text-slate-600">
            <span style={{ color: 'var(--color-primary)' }}><I.Check size={13} strokeWidth={2.5} /></span>
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectedPlanCard({ plan, onChange }: { plan: Plan; onChange?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl mb-5"
      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(148,163,184,0.2)' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
          {plan.id === 'trial' ? <I.Sparkle size={15} strokeWidth={2} /> : <I.Billing size={15} strokeWidth={2} />}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-slate-800">{plan.name}</div>
          <div className="text-[11px] text-slate-500">{plan.cadence}</div>
        </div>
      </div>
      {onChange && (
        <button onClick={onChange} className="text-[12px] font-medium hover:underline shrink-0"
          style={{ color: 'var(--color-primary)' }}>
          Change
        </button>
      )}
    </div>
  );
}

function SoftBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="text-[12.5px] text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, disabled, children, icon, iconRight, className = '' }: {
  onClick?: () => void; disabled?: boolean; children: React.ReactNode;
  icon?: React.ReactNode; iconRight?: React.ReactNode; className?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-[14px] text-white transition disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{ background: disabled ? '#94a3b8' : 'var(--color-primary)', boxShadow: disabled ? 'none' : '0 6px 16px -8px var(--color-primary)' }}>
      {icon && <span>{icon}</span>}
      {children}
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
}

// ─── STEP: PLAN PICKER ────────────────────────────────────────────────────────

function StepPlanPicker({ planId, setPlanId, next }: {
  planId: PlanId | null; setPlanId: (id: PlanId) => void; next: () => void;
}) {
  return (
    <div>
      <h1 className="text-[36px] text-slate-900 leading-tight mb-1"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400 }}>
        Pick your starting point.
      </h1>
      <p className="text-[14px] text-slate-500 mb-8">You can switch plans anytime. No commitment required.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {(Object.values(SIGNUP_PLANS) as Plan[]).map(plan => (
          <PlanCard key={plan.id} plan={plan} selected={planId === plan.id} onClick={() => setPlanId(plan.id as PlanId)} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-[12.5px] text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
          <I.Chevron size={14} strokeWidth={2.2} className="rotate-180" />
          Back to site
        </Link>
        <PrimaryBtn onClick={next} iconRight={<I.Arrow size={15} strokeWidth={2.2} />}>
          Continue
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── STEP: ACCOUNT ────────────────────────────────────────────────────────────

function StepAccount({ form, setField, next, back, stepLabel, plan, onChangePlan }: {
  form: FormState; setField: (k: keyof FormState, v: string | boolean) => void;
  next: () => void; back: () => void; stepLabel: string; plan: Plan; onChangePlan?: () => void;
}) {
  const [showPw, setShowPw] = useState(false);

  const pwStrength = useMemo(() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    return score;
  }, [form.password]);

  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', '#ef4444', '#f59e0b', 'var(--color-primary)'][pwStrength];

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 font-mono">{stepLabel}</p>
      <h1 className="text-[36px] text-slate-900 leading-tight mb-1"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400 }}>
        Create your account.
      </h1>
      <p className="text-[13.5px] text-slate-500 mb-6">
        Already have one?{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
      </p>

      <SelectedPlanCard plan={plan} onChange={onChangePlan} />

      <div className="space-y-2.5 mb-5">
        <button className="w-full h-11 rounded-2xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#4CAF50"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FFC107"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FF3D00"/>
          </svg>
          Continue with Google
        </button>
        <button className="w-full h-11 rounded-2xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M11.5 2H2v9.5h9.5V2Z" fill="#F25022"/>
            <path d="M22 2h-9.5v9.5H22V2Z" fill="#7FBA00"/>
            <path d="M11.5 12.5H2V22h9.5v-9.5Z" fill="#00A4EF"/>
            <path d="M22 12.5h-9.5V22H22v-9.5Z" fill="#FFB900"/>
          </svg>
          Continue with Microsoft
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <hr className="flex-1 border-slate-200" />
        <span className="text-[12px] text-slate-400">or with email</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <FieldLabel>First name</FieldLabel>
          <input className={inputCn} placeholder="Amelia" value={form.first} onChange={e => setField('first', e.target.value)} />
        </div>
        <div>
          <FieldLabel>Last name</FieldLabel>
          <input className={inputCn} placeholder="Chen" value={form.last} onChange={e => setField('last', e.target.value)} />
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel>Work email</FieldLabel>
        <input type="email" className={inputCn} placeholder="you@clinic.org" value={form.email} onChange={e => setField('email', e.target.value)} />
      </div>

      <div className="mb-4">
        <FieldLabel>Password</FieldLabel>
        <div className="relative">
          <input type={showPw ? 'text' : 'password'} className={inputCn + ' pr-11'} placeholder="••••••••"
            value={form.password} onChange={e => setField('password', e.target.value)} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <I.Eye size={16} strokeWidth={1.8} />
          </button>
        </div>
        {form.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-1 flex-1 rounded-full transition-all"
                  style={{ background: pwStrength >= n ? strengthColor : 'rgba(15,23,42,0.08)' }} />
              ))}
            </div>
            <span className="text-[11px]" style={{ color: strengthColor as string }}>{strengthLabel}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 mb-6">
        <button type="button" onClick={() => setField('terms', !form.terms)}
          className="w-5 h-5 rounded-lg border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all"
          style={{ borderColor: form.terms ? 'var(--color-primary)' : '#cbd5e1', background: form.terms ? 'var(--color-primary)' : 'white' }}>
          {form.terms && <I.Check size={11} strokeWidth={3} className="text-white" />}
        </button>
        <span className="text-[12.5px] text-slate-500 leading-relaxed">
          I agree to the{' '}
          <a href="#" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>
        </span>
      </div>

      <div className="flex items-center justify-between">
        <SoftBtn onClick={back}><I.Chevron size={14} strokeWidth={2.2} className="rotate-180" />Back</SoftBtn>
        <PrimaryBtn onClick={next} iconRight={<I.Arrow size={15} strokeWidth={2.2} />}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

// ─── STEP: WORKSPACE ──────────────────────────────────────────────────────────

function StepWorkspace({ form, setField, next, back, stepLabel, plan, onChangePlan }: {
  form: FormState; setField: (k: keyof FormState, v: string | boolean) => void;
  next: () => void; back: () => void; stepLabel: string; plan: Plan; onChangePlan?: () => void;
}) {
  const slug = form.workspace.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 font-mono">{stepLabel}</p>
      <h1 className="text-[36px] text-slate-900 leading-tight mb-6"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400 }}>
        Tell us about your workspace.
      </h1>

      <SelectedPlanCard plan={plan} onChange={onChangePlan} />

      <div className="mb-4">
        <FieldLabel>Organization name</FieldLabel>
        <input className={inputCn} placeholder="Northwind Health" value={form.workspace} onChange={e => setField('workspace', e.target.value)} />
        {slug && (
          <p className="mt-1.5 text-[11.5px] text-slate-400 font-mono">
            faxgrid.com/<span style={{ color: 'var(--color-primary)' }}>{slug}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <FieldLabel>Industry</FieldLabel>
          <div className="relative">
            <select className={inputCn + ' appearance-none pr-9'} value={form.industry} onChange={e => setField('industry', e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <I.ChevronDown size={15} strokeWidth={2} />
            </span>
          </div>
        </div>
        <div>
          <FieldLabel>Team size</FieldLabel>
          <div className="relative">
            <select className={inputCn + ' appearance-none pr-9'} value={form.size} onChange={e => setField('size', e.target.value)}>
              {TEAM_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <I.ChevronDown size={15} strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel>Your role</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ROLES.map(r => (
            <button key={r} onClick={() => setField('role', r)}
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium border transition-all"
              style={{
                background: form.role === r ? 'var(--color-primary)' : 'white',
                borderColor: form.role === r ? 'var(--color-primary)' : '#e2e8f0',
                color: form.role === r ? 'white' : '#475569',
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <FieldLabel>Are you a HIPAA-covered entity?</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {['Yes', 'Business associate', 'No / unsure'].map(h => (
            <button key={h} onClick={() => setField('hipaa', h)}
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium border transition-all"
              style={{
                background: form.hipaa === h ? 'var(--color-primary)' : 'white',
                borderColor: form.hipaa === h ? 'var(--color-primary)' : '#e2e8f0',
                color: form.hipaa === h ? 'white' : '#475569',
              }}>
              {h}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[12px] text-slate-400 mb-6 flex items-center gap-1.5">
        <I.Info size={12} strokeWidth={2.2} />
        We&apos;ll auto-generate a BAA if applicable.
      </p>

      <div className="flex items-center justify-between">
        <SoftBtn onClick={back}><I.Chevron size={14} strokeWidth={2.2} className="rotate-180" />Back</SoftBtn>
        <PrimaryBtn onClick={next} iconRight={<I.Arrow size={15} strokeWidth={2.2} />}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}

// ─── STEP: VERIFY ─────────────────────────────────────────────────────────────

function StepVerify({ form, next, back, stepLabel, plan, onChangePlan }: {
  form: FormState; next: () => void; back: () => void; stepLabel: string; plan: Plan; onChangePlan?: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resent, setResent] = useState(false);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleDigit(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next_d = [...digits];
    next_d[idx] = val.slice(-1);
    setDigits(next_d);
    if (val && idx < 5) digitRefs.current[idx + 1]?.focus();
  }

  function handleKey(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      digitRefs.current[idx - 1]?.focus();
    }
  }

  function handleResend() {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 font-mono">{stepLabel}</p>
      <h1 className="text-[36px] text-slate-900 leading-tight mb-1"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400 }}>
        Verify your email.
      </h1>
      <p className="text-[13.5px] text-slate-500 mb-6">
        We sent a 6-digit code to <span className="font-semibold text-slate-700">{form.email}</span>.{' '}
        <button className="hover:underline" style={{ color: 'var(--color-primary)' }}>Wrong address?</button>
      </p>

      <SelectedPlanCard plan={plan} onChange={onChangePlan} />

      <div className="flex gap-2 justify-between mb-4">
        {digits.map((d, i) => (
          <input key={i}
            ref={el => { digitRefs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            className="w-full h-14 rounded-2xl border border-slate-200 text-center font-mono text-xl font-semibold text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)] bg-white transition"
          />
        ))}
      </div>

      <div className="text-center mb-5">
        {resent ? (
          <span className="text-[12.5px] font-medium" style={{ color: 'var(--color-primary)' }}>Resent ✓</span>
        ) : (
          <button onClick={handleResend} className="text-[12.5px] text-slate-500 hover:text-slate-700">
            Didn&apos;t receive it?{' '}
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Resend code</span>
          </button>
        )}
      </div>

      <PrimaryBtn onClick={next} iconRight={<I.Arrow size={15} strokeWidth={2.2} />} className="w-full">
        Verify and continue
      </PrimaryBtn>

      <div className="mt-4 flex justify-center">
        <SoftBtn onClick={back}><I.Chevron size={14} strokeWidth={2.2} className="rotate-180" />Back</SoftBtn>
      </div>
    </div>
  );
}

// ─── STEP: PAYMENT ────────────────────────────────────────────────────────────

function StepPayment({ form, setField, next, back, stepLabel, plan }: {
  form: FormState; setField: (k: keyof FormState, v: string | boolean) => void;
  next: () => void; back: () => void; stepLabel: string; plan: Plan;
}) {
  const [promoApplied, setPromoApplied] = useState(false);
  const isTrial = plan.id === 'trial';
  const cardType = form.card.replace(/\s/g, '').startsWith('4') ? 'VISA' : form.card.replace(/\s/g, '').startsWith('5') ? 'MC' : null;

  function formatCard(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExp(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length >= 3) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  }

  const subtotal = plan.id === 'trial' ? 0 : plan.id === 'starter' ? 39 : 89;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + tax;

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1 font-mono">{stepLabel}</p>
      <h1 className="text-[36px] text-slate-900 leading-tight mb-1"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400 }}>
        {isTrial ? 'Card on file.' : 'Payment.'}
      </h1>
      <p className="text-[13.5px] text-slate-500 mb-6">
        {isTrial
          ? 'No charge today. Your trial starts immediately — cancel before day 14 to avoid billing.'
          : `You'll be charged $${total.toFixed(2)} today.`}
      </p>

      <div className="mb-4">
        <FieldLabel>Card number</FieldLabel>
        <div className="relative">
          <input className={inputCn + ' pr-20 font-mono tracking-wider'} placeholder="1234 5678 9012 3456"
            value={form.card} onChange={e => setField('card', formatCard(e.target.value))} />
          {cardType && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
              {cardType}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <FieldLabel>Expiry</FieldLabel>
          <input className={inputCn + ' font-mono'} placeholder="MM/YY" maxLength={5}
            value={form.exp} onChange={e => setField('exp', formatExp(e.target.value))} />
        </div>
        <div>
          <FieldLabel>CVC</FieldLabel>
          <input className={inputCn + ' font-mono'} placeholder="•••" maxLength={4}
            value={form.cvc} onChange={e => setField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))} />
        </div>
        <div>
          <FieldLabel>ZIP</FieldLabel>
          <input className={inputCn} placeholder="98101"
            value={form.zip} onChange={e => setField('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} />
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel optional>Promo code</FieldLabel>
        <div className="flex gap-2">
          <input className={inputCn} placeholder="HIPAA2026"
            value={form.promo} onChange={e => setField('promo', e.target.value)} />
          <button onClick={() => setPromoApplied(true)}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 transition shrink-0">
            {promoApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>
      </div>

      <SoftCard className="p-4 mb-5 space-y-2">
        {isTrial ? (
          <>
            <div className="flex justify-between text-[13px] text-slate-600">
              <span>14-day trial</span>
              <span className="font-semibold text-slate-900">$0.00</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-[13px] font-semibold text-slate-900">
              <span>Due today</span><span>$0.00</span>
            </div>
            <div className="text-[11.5px] text-slate-400">From $39/mo after trial ends</div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-[13px] text-slate-600">
              <span>{plan.name} plan</span><span>${subtotal}.00</span>
            </div>
            <div className="flex justify-between text-[13px] text-slate-600">
              <span>Tax (7%)</span><span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-[13px] font-semibold text-slate-900">
              <span>Due today</span><span>${total.toFixed(2)}</span>
            </div>
          </>
        )}
      </SoftCard>

      <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-6">
        <I.Lock size={13} strokeWidth={2} />
        <span>Secured by Stripe · TLS 1.3 · PCI DSS Level 1</span>
      </div>

      <div className="flex items-center justify-between">
        <SoftBtn onClick={back}><I.Chevron size={14} strokeWidth={2.2} className="rotate-180" />Back</SoftBtn>
        <PrimaryBtn onClick={next} icon={<I.Lock size={14} strokeWidth={2.2} />}>
          {isTrial ? 'Start free trial' : `Pay $${total.toFixed(2)}`}
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── STEP: DONE ───────────────────────────────────────────────────────────────

function StepDone({ form, plan, entry, onLaunch }: {
  form: FormState; plan: Plan; entry: string; onLaunch: () => void;
}) {
  const isTrial = plan.id === 'trial';
  const today = new Date();
  const trialEnd = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const nextCharge = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-primary-subtle)', animation: 'fg-ringPulse 1.5s ease-out' }}>
          <svg viewBox="0 0 24 24" width={36} height={36} fill="none" strokeLinecap="round" strokeLinejoin="round"
            style={{ stroke: 'var(--color-primary)', strokeWidth: 2.5 }}>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">All set</p>
      <h1 className="text-slate-900 leading-tight mb-2"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400, fontSize: 42 }}>
        Welcome to FaxGrid,{' '}{form.first || 'there'}.
      </h1>
      <p className="text-[14px] text-slate-500 mb-8">
        {isTrial
          ? 'Your 14-day trial is active. No charge until the trial ends.'
          : `Your ${plan.name} plan is active. Your workspace is ready.`}
      </p>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 mb-7 text-left">
        <div className="space-y-3">
          <div className="flex justify-between text-[13.5px]">
            <span className="text-slate-500">Workspace</span>
            <span className="font-semibold text-slate-800">{form.workspace || 'My Organization'}</span>
          </div>
          <div className="flex justify-between text-[13.5px]">
            <span className="text-slate-500">Plan</span>
            <span className="font-semibold text-slate-800">{plan.name}</span>
          </div>
          <div className="flex justify-between text-[13.5px]">
            <span className="text-slate-500">Sandbox number</span>
            <span className="font-semibold text-slate-800 font-mono">+1 (555) 010-0001</span>
          </div>
          <div className="flex justify-between text-[13.5px]">
            <span className="text-slate-500">{isTrial ? 'Trial ends' : 'Next charge'}</span>
            <span className="font-semibold text-slate-800">{fmt(isTrial ? trialEnd : nextCharge)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <PrimaryBtn onClick={onLaunch} iconRight={<I.Arrow size={15} strokeWidth={2.2} />}>
          Set up workspace
        </PrimaryBtn>
      </div>

      <Link href="/app/dashboard" className="text-[13px] text-slate-500 hover:text-slate-700 hover:underline">
        Or jump straight into the dashboard
      </Link>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const [entry, setEntry] = useState<'general' | 'trial' | 'starter' | 'pro'>('general');
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<FormState>({
    first: '', last: '', email: 'amelia@northwindhealth.example', password: '',
    terms: false,
    workspace: '', industry: 'Healthcare clinic', size: '6 – 20', role: 'Admin / owner', hipaa: 'Yes',
    card: '', exp: '', cvc: '', zip: '', promo: '',
  });

  const setField = (k: keyof FormState, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    setStepIdx(0);
    const planMap: Record<string, PlanId | null> = { general: null, trial: 'trial', starter: 'starter', pro: 'pro' };
    setPlanId(planMap[entry] ?? null);
  }, [entry]);

  const steps = useMemo(() => {
    const s: string[] = [];
    if (entry === 'general') s.push('plan');
    s.push('account', 'workspace', 'verify');
    if (planId && SIGNUP_PLANS[planId]?.needsPayment) s.push('payment');
    s.push('done');
    return s;
  }, [entry, planId]);

  const totalSteps = steps.length;
  const currentKey = steps[stepIdx];
  const stepLabel = `Step ${Math.min(stepIdx + 1, totalSteps - 1)} of ${totalSteps - 1}`;

  const next = () => setStepIdx(i => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIdx(i => Math.max(i - 1, 0));
  const plan = (planId ? SIGNUP_PLANS[planId] : SIGNUP_PLANS.trial) as Plan;
  const onChangePlan = entry === 'general' ? () => setStepIdx(steps.indexOf('plan')) : undefined;
  const wideStep = currentKey === 'plan';

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(circle at 20% 0%, rgba(61,80,128,0.10), transparent 32%), radial-gradient(circle at 90% 100%, rgba(61,80,128,0.08), transparent 35%), linear-gradient(135deg, #f4f7fb, #f4f7fb)' }}>

      {/* Entry switcher (prototype only) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="rounded-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] p-1 flex items-center gap-1">
          <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 px-3">Came from</span>
          {([
            { id: 'general', label: 'Get started' },
            { id: 'trial',   label: 'Free trial' },
            { id: 'starter', label: 'Starter plan' },
            { id: 'pro',     label: 'Pro plan' },
          ] as const).map(e => (
            <button key={e.id} onClick={() => setEntry(e.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition ${entry === e.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <SignupMark size={32} />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">FaxGrid</div>
            <div className="text-[11px] text-slate-500">Secure fax for modern teams</div>
          </div>
        </Link>
        <div className="text-[13px] text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start justify-center px-6 pt-16 pb-16 overflow-y-auto">
        <div className={`w-full transition-all ${wideStep ? 'max-w-[920px]' : 'max-w-[560px]'}`}>
          <div className="rounded-[28px] bg-white/85 backdrop-blur-xl ring-1 ring-slate-200/70 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] overflow-hidden">
            <div className="p-8 md:p-10">
              {currentKey !== 'done' && (
                <div className="mb-7 flex items-center justify-between">
                  <StepDots count={totalSteps - 1} current={Math.min(stepIdx, totalSteps - 2)} />
                  <div className="text-[11.5px] font-mono text-slate-400">{Math.min(stepIdx + 1, totalSteps - 1)} / {totalSteps - 1}</div>
                </div>
              )}
              {currentKey === 'plan'      && <StepPlanPicker planId={planId} setPlanId={setPlanId} next={next} />}
              {currentKey === 'account'   && <StepAccount   form={form} setField={setField} next={next} back={back} stepLabel={stepLabel} plan={plan} onChangePlan={onChangePlan} />}
              {currentKey === 'workspace' && <StepWorkspace form={form} setField={setField} next={next} back={back} stepLabel={stepLabel} plan={plan} onChangePlan={onChangePlan} />}
              {currentKey === 'verify'    && <StepVerify    form={form} next={next} back={back} stepLabel={stepLabel} plan={plan} onChangePlan={onChangePlan} />}
              {currentKey === 'payment'   && <StepPayment   form={form} setField={setField} next={next} back={back} stepLabel={stepLabel} plan={plan} />}
              {currentKey === 'done'      && <StepDone      form={form} plan={plan} entry={entry} onLaunch={() => router.push('/app/onboarding')} />}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-[11.5px] text-slate-400 px-2">
            <div className="flex items-center gap-1.5">
              <I.Shield size={11} strokeWidth={2.4} />
              <span>HIPAA · SOC 2 Type II · BAA available · TLS 1.3</span>
            </div>
            <span className="hover:text-slate-700 cursor-pointer">Need help?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
