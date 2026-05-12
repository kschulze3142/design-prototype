"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Left Panel */}
      <div className="relative overflow-hidden flex flex-col justify-between p-10 bg-slate-950">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-teal-500/[0.08] blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
            <span className="text-lg font-bold text-slate-950">F</span>
          </div>
          <div>
            <div className="font-semibold tracking-tight text-white">FaxGrid</div>
            <div className="text-xs text-slate-500">Secure fax infrastructure</div>
          </div>
        </div>

        {/* Body */}
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.12] px-3.5 py-1.5 text-xs font-semibold text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Trusted by modern healthcare teams
          </span>
          <h1 className="mt-6 max-w-xs text-3xl font-semibold leading-tight tracking-[-0.04em] text-white">
            The calmer way to run fax operations.
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
            Send, receive, route, and archive faxes without the legacy portal experience.
          </p>
        </div>

        {/* Footer */}
        <div className="relative text-xs text-slate-700">
          © 2026 FaxGrid. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="flex items-center justify-center p-10"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(204,251,241,0.85), transparent 32%), linear-gradient(135deg, #f8fffd, #f3f7f6)",
        }}
      >
        {/* Login Card */}
        <div
          className="w-full max-w-sm rounded-[28px] border border-white/80 bg-white/85 p-9 backdrop-blur-xl"
          style={{ boxShadow: "0 24px 70px rgba(15,23,42,0.08)" }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to your workspace</p>

          <form className="mt-6 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label
                htmlFor="email-input"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Work email
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="you@clinic.com"
                className="h-11 w-full rounded-[14px] border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password-input"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative flex items-center gap-2 border-b border-slate-200 pb-1.5 focus-within:border-teal-500">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 border-none bg-transparent text-sm text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="cursor-pointer border-none bg-transparent text-slate-400 hover:text-slate-600"
                  style={{ background: "none", border: "none" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye closed */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1={1} y1={1} x2={23} y2={23} />
                    </svg>
                  ) : (
                    /* Eye open */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx={12} cy={12} r={3} />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="-mt-2 text-right">
              <a
                href="#"
                className="text-xs font-semibold text-teal-700 hover:text-teal-500"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign in button */}
            <button
              type="button"
              onClick={() => router.push("/app/dashboard")}
              className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-slate-200" />
              <span className="text-xs font-medium text-slate-400">or</span>
              <hr className="flex-1 border-slate-200" />
            </div>

            {/* Sign up row */}
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <a
                href="/"
                className="font-semibold text-teal-700 hover:text-teal-500"
              >
                Start free trial
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
