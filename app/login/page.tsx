"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Shared SVG props ─────────────────────────────────────────────────── */
const sp = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg {...sp} className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg {...sp} className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg {...sp} className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function EyeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg {...sp} className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg {...sp} className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1={1} y1={1} x2={23} y2={23} />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg {...sp} className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/* ── FaxGrid doc logo mark ────────────────────────────────────────────── */
function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, oklch(0.55 0.12 174), oklch(0.42 0.09 174))",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: size * 0.44, height: size * 0.44 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    </div>
  );
}

/* ── Left panel ───────────────────────────────────────────────────────── */
function LoginVisual() {
  return (
    <>
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #f0faf8 0%, #e8f5f2 50%, #dff0ec 100%)" }}
      />
      {/* Soft radial teal halos */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.85 0.09 174 / 0.38), transparent 65%)",
          top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          filter: "blur(32px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.82 0.09 174 / 0.22), transparent 65%)",
          bottom: "18%", right: "8%",
          filter: "blur(24px)",
        }}
      />
      {/* Diagonal stripe texture overlay */}
      <div className="absolute inset-0 pointer-events-none stripe-ph" style={{ opacity: 0.05 }} />

      {/* Top: logo + wordmark */}
      <div className="relative px-10 pt-9 flex items-center gap-3">
        <Link href="/">
          <LogoMark size={44} />
        </Link>
        <div>
          <div className="font-semibold tracking-tight text-slate-900 text-[15px]">FaxGrid</div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">HIPAA-grade fax for healthcare</div>
        </div>
      </div>

      {/* Center: fax transmission mockup */}
      <div className="relative flex-1 flex items-center justify-center px-10">
        {/* All carriers green chip — top-left */}
        <div
          className="absolute top-8 left-4 bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2 fade-up z-10"
          style={{ boxShadow: "0 8px 28px rgba(15,23,42,0.10), 0 1px 4px rgba(15,23,42,0.06)", animationDelay: "380ms" }}
        >
          <div
            className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
            style={{ boxShadow: "0 0 0 3px rgba(34,197,94,0.22)" }}
          />
          <span className="text-[11.5px] font-semibold text-slate-700">All carriers green</span>
        </div>

        {/* Main card */}
        <div
          className="relative w-full max-w-[320px] rounded-3xl bg-white"
          style={{ boxShadow: "0 24px 64px rgba(15,23,42,0.11), 0 4px 16px rgba(15,23,42,0.06)" }}
        >
          {/* Header bar */}
          <div
            className="rounded-t-3xl px-5 py-3.5 flex items-center justify-between"
            style={{ background: "linear-gradient(90deg, oklch(0.48 0.09 174), oklch(0.42 0.08 174))" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-full bg-white/90 pulse-ring flex-shrink-0"
              />
              <span className="text-[10.5px] font-bold tracking-widest text-white/90 uppercase">Transmitting</span>
            </div>
            <span className="text-[10.5px] font-mono text-white/65">PG 4/7</span>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {/* From / To */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 w-6 flex-shrink-0">From</span>
                <div>
                  <div className="text-[12px] font-semibold text-slate-800 leading-tight">Northwind Health · Cardiology</div>
                  <div className="text-[10.5px] text-slate-400 font-mono">+1 (206) 555-0142</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 w-6 flex-shrink-0">To</span>
                <div>
                  <div className="text-[12px] font-semibold text-slate-800 leading-tight">BlueShield Prior Auth</div>
                  <div className="text-[10.5px] text-slate-400 font-mono">+1 (888) 555-0903</div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 mb-4" />

            {/* Doc lines */}
            <div className="space-y-2 mb-4">
              <div className="doc-line long" />
              <div className="doc-line med" />
              <div className="doc-line long" />
              <div className="doc-line short" />
              <div className="doc-line med" />
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-mono">14400 baud · CRC OK</span>
              <span className="text-[11px] font-semibold text-slate-700">57%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "57%" }} />
            </div>
          </div>
        </div>

        {/* Delivered chip — bottom-right */}
        <div
          className="absolute bottom-8 right-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 fade-up z-10"
          style={{ boxShadow: "0 8px 28px rgba(15,23,42,0.10), 0 1px 4px rgba(15,23,42,0.06)", animationDelay: "180ms" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.94 0.06 160)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.38 0.10 160)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 draw-check">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-slate-800">Delivered</div>
            <div className="text-[10.5px] text-slate-400 font-mono">FX-9824-1A · 7p</div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative px-10 pb-5">
        <blockquote className="italic text-slate-600 text-[13px] leading-relaxed font-serif mb-3 max-w-[340px]">
          &ldquo;We sent 42,000 faxes through FaxGrid last quarter. Zero compliance gaps, zero retries needed.&rdquo;
        </blockquote>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, oklch(0.48 0.09 174), oklch(0.42 0.08 174))" }}
          >
            DP
          </div>
          <div>
            <div className="text-[12px] font-semibold text-slate-800">Dr. Devon Park</div>
            <div className="text-[11px] text-slate-500">CMO · Northwind Health</div>
          </div>
        </div>
      </div>

      {/* Bottom footer row */}
      <div className="relative px-10 pb-6 pt-4 flex items-center justify-between text-[11.5px] text-slate-500 border-t border-slate-200/60">
        <span>© 2026 FaxGrid, Inc.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-700 transition-colors">Status</a>
        </div>
      </div>
    </>
  );
}

/* ── Step types ───────────────────────────────────────────────────────── */
type Step = "email" | "password" | "mfa" | "sso-redirect";

/* ── Email step ───────────────────────────────────────────────────────── */
function EmailStep({
  email, setEmail, loading, onContinue, onOkta,
}: {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  onContinue: () => void;
  onOkta: () => void;
}) {
  const showSSOHint = email.includes("@");
  return (
    <div className="fade-up">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Welcome back</p>
      <h1 className="text-[38px] font-semibold tracking-tight text-slate-950 leading-tight mb-1">Sign in.</h1>
      <p className="text-[14px] text-slate-500 mb-8">Continue to your workspace.</p>

      {/* SSO buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onOkta}
          className="w-full h-11 rounded-2xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-colors"
        >
          <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">O</span>
          Continue with Okta
        </button>
        <button
          className="w-full h-11 rounded-2xl border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#4CAF50" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FFC107" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FF3D00" />
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <hr className="flex-1 border-slate-200" />
        <span className="text-[12px] text-slate-400">or</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Work email</label>
        <input
          type="email"
          placeholder="you@hospital.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && email && onContinue()}
          className="h-11 w-full rounded-[14px] border border-slate-200 bg-white px-3.5 text-[13.5px] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
        />
        {showSSOHint && (
          <p className="mt-1.5 text-[11.5px] accent-text-deep">SSO may be enforced for your domain.</p>
        )}
      </div>

      <button
        onClick={onContinue}
        disabled={!email || loading}
        className="w-full h-11 rounded-2xl bg-slate-950 text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Checking…" : <><span>Continue</span><ArrowRightIcon /></>}
      </button>

      <p className="mt-5 text-center text-[12.5px] text-slate-500">
        Joined via invite?{" "}
        <Link href="#" className="font-semibold accent-text hover:underline">Accept invitation</Link>
      </p>
    </div>
  );
}

/* ── Password step ────────────────────────────────────────────────────── */
function PasswordStep({
  email, showPassword, setShowPassword, keepSignedIn, setKeepSignedIn, loading, onBack, onSignIn,
}: {
  email: string;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  keepSignedIn: boolean;
  setKeepSignedIn: (v: boolean) => void;
  loading: boolean;
  onBack: () => void;
  onSignIn: () => void;
}) {
  return (
    <div className="fade-up">
      <button
        onClick={onBack}
        className="mb-7 flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeftIcon />
        <span className="font-mono text-[12px] truncate max-w-[260px]">{email}</span>
      </button>

      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Password</p>
      <h1 className="text-[38px] font-semibold tracking-tight text-slate-950 leading-tight mb-8">Welcome back.</h1>

      {/* Password */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-semibold text-slate-700">Password</label>
          <a href="#" className="text-[11.5px] accent-text hover:underline">Forgot?</a>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-11 w-full rounded-[14px] border border-slate-200 bg-white px-3.5 pr-11 text-[13.5px] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {/* Keep me signed in */}
      <div className="flex items-start gap-3 mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
        <button
          role="switch"
          aria-checked={keepSignedIn}
          onClick={() => setKeepSignedIn(!keepSignedIn)}
          className="relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200 mt-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          style={{ background: keepSignedIn ? "var(--accent)" : "#cbd5e1" }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: keepSignedIn ? "translateX(16px)" : "translateX(0)" }}
          />
        </button>
        <div>
          <div className="text-[13px] font-semibold text-slate-800">Keep me signed in</div>
          <div className="text-[11.5px] text-slate-500">Stay logged in on this device for 12 hours.</div>
        </div>
      </div>

      <button
        onClick={onSignIn}
        disabled={loading}
        className="w-full h-11 rounded-2xl bg-slate-950 text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-40"
      >
        {loading ? "Signing in…" : <><span>Sign in</span><ArrowRightIcon /></>}
      </button>
    </div>
  );
}

/* ── MFA step ─────────────────────────────────────────────────────────── */
function MfaStep({
  digits, digitRefs, allFilled, onDigit, onDigitKey, onVerify, onBack,
}: {
  digits: string[];
  digitRefs: { current: (HTMLInputElement | null)[] };
  allFilled: boolean;
  onDigit: (idx: number, val: string) => void;
  onDigitKey: (idx: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onBack: () => void;
}) {
  return (
    <div className="fade-up">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "oklch(0.94 0.06 174)" }}
      >
        <ShieldIcon className="w-7 h-7 accent-text" />
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Two-factor</p>
      <h1 className="text-[38px] font-semibold tracking-tight text-slate-950 leading-tight mb-1">Verify it&rsquo;s you.</h1>
      <p className="text-[14px] text-slate-500 mb-8">Enter the 6-digit code from your authenticator app.</p>

      {/* 6 digit inputs */}
      <div className="flex gap-2 mb-5 justify-between">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { digitRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => onDigit(i, e.target.value)}
            onKeyDown={(e) => onDigitKey(i, e)}
            className="w-12 h-14 rounded-2xl border border-slate-200 text-center font-mono text-xl font-semibold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition bg-white"
          />
        ))}
      </div>

      <p className="text-center text-[12px] text-slate-400 mb-6">
        <a href="#" className="hover:text-slate-600 transition-colors">Trouble? Use a backup code</a>
        {" · "}
        <a href="#" className="hover:text-slate-600 transition-colors">Use YubiKey</a>
      </p>

      <button
        onClick={onVerify}
        disabled={!allFilled}
        className="w-full h-11 rounded-2xl bg-slate-950 text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Verify and sign in <ArrowRightIcon />
      </button>

      <button
        onClick={onBack}
        className="mt-4 w-full text-center text-[12.5px] text-slate-400 hover:text-slate-600 transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

/* ── SSO redirect step ────────────────────────────────────────────────── */
function SsoStep({ onBack, onOpen }: { onBack: () => void; onOpen: () => void }) {
  return (
    <div className="fade-up">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 pulse-ring"
        style={{ background: "oklch(0.94 0.06 174)" }}
      >
        <LockIcon className="w-7 h-7 accent-text" />
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">SSO</p>
      <h1 className="text-[38px] font-semibold tracking-tight text-slate-950 leading-tight mb-1">Redirecting to Okta.</h1>
      <p className="text-[14px] text-slate-500 mb-8">
        Finish authenticating in Okta, then you&apos;ll be returned to your workspace automatically.
      </p>

      <button
        onClick={onOpen}
        className="w-full h-11 rounded-2xl bg-slate-950 text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition mb-4"
      >
        Open Okta <ArrowRightIcon />
      </button>

      <button
        onClick={onBack}
        className="w-full text-center text-[12.5px] text-slate-400 hover:text-slate-600 transition-colors"
      >
        ← Use a different account
      </button>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleEmailContinue() {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("password"); }, 600);
  }

  function handleSignIn() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("mfa"); }, 700);
  }

  function handleDigit(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val.slice(-1);
    setDigits(next);
    if (val && idx < 5) digitRefs.current[idx + 1]?.focus();
  }

  function handleDigitKey(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      digitRefs.current[idx - 1]?.focus();
    }
  }

  const allDigitsFilled = digits.every((d) => d !== "");

  return (
    <div className="min-h-screen flex" style={{ background: "#f3f7f6" }}>
      {/* Left panel */}
      <div className="hidden lg:flex relative w-[52%] flex-col overflow-hidden border-r border-slate-200/70">
        <LoginVisual />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6">
          <Link href="/" className="lg:hidden flex items-center gap-2.5">
            <LogoMark size={36} />
            <span className="font-semibold text-slate-900 text-[15px]">FaxGrid</span>
          </Link>
          <div className="lg:ml-auto text-[13.5px] text-slate-500">
            New to FaxGrid?{" "}
            <Link href="/signup" className="font-semibold accent-text hover:underline">
              Create workspace
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-4">
          <div className="w-full max-w-[420px] py-10">
            {step === "email" && (
              <EmailStep
                email={email}
                setEmail={setEmail}
                loading={loading}
                onContinue={handleEmailContinue}
                onOkta={() => setStep("sso-redirect")}
              />
            )}
            {step === "password" && (
              <PasswordStep
                email={email}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                keepSignedIn={keepSignedIn}
                setKeepSignedIn={setKeepSignedIn}
                loading={loading}
                onBack={() => setStep("email")}
                onSignIn={handleSignIn}
              />
            )}
            {step === "mfa" && (
              <MfaStep
                digits={digits}
                digitRefs={digitRefs}
                allFilled={allDigitsFilled}
                onDigit={handleDigit}
                onDigitKey={handleDigitKey}
                onVerify={() => router.push("/app/dashboard")}
                onBack={() => setStep("password")}
              />
            )}
            {step === "sso-redirect" && (
              <SsoStep
                onBack={() => setStep("email")}
                onOpen={() => router.push("/app/dashboard")}
              />
            )}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 text-[11.5px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldIcon className="w-3.5 h-3.5" />
            <span>HIPAA · SOC 2 Type II · BAA available</span>
          </div>
          <a href="#" className="hover:text-slate-600 transition-colors">Need help?</a>
        </div>
      </div>
    </div>
  );
}
