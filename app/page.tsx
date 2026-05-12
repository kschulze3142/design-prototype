"use client";

import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "dark";
type PillTone = "teal" | "emerald" | "amber" | "slate";

function cx(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

function Button({ children, variant = "primary", className = "" }: ButtonProps) {
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700",
    secondary: "border border-white/90 bg-white/80 text-slate-700 shadow-sm hover:bg-white",
    dark: "bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800",
  };

  return (
    <button className={cx("rounded-2xl px-5 py-3 text-sm font-semibold transition", styles[variant], className)}>
      {children}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={cx("rounded-[28px] border border-white/80 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

interface PillProps {
  children: React.ReactNode;
  tone?: PillTone;
}

function Pill({ children, tone = "teal" }: PillProps) {
  const styles: Record<PillTone, string> = {
    teal: "bg-teal-50 text-teal-700 ring-teal-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1", styles[tone])}>{children}</span>;
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-lg shadow-slate-950/15">F</div>
      <div>
        <p className="text-lg font-semibold tracking-tight text-slate-950">FaxGrid</p>
        <p className="text-xs font-medium text-slate-500">Secure fax infrastructure</p>
      </div>
    </div>
  );
}

interface SignupFieldProps {
  className?: string;
}

function SignupField({ className = "" }: SignupFieldProps) {
  return (
    <div className={cx("w-full max-w-xl", className)}>
      <div className="flex flex-col gap-2 rounded-[24px] border border-slate-200/80 bg-white/75 p-2 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
        <input
          type="email"
          placeholder="Your work email"
          className="min-h-12 flex-1 rounded-[18px] bg-transparent px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-500"
        />
        <Link href="/login" className="min-h-12 rounded-[18px] bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800">
          Get started for free
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
        <span className="flex items-center gap-2"><span className="text-teal-600">✓</span> Free 30-day trial</span>
        <span className="flex items-center gap-2"><span className="text-teal-600">✓</span> No credit card</span>
        <span className="flex items-center gap-2"><span className="text-teal-600">✓</span> Cancel anytime</span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/65 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          <a href="#workflow" className="hover:text-slate-950">Workflow</a>
          <a href="#security" className="hover:text-slate-950">Security</a>
          <a href="#pricing" className="hover:text-slate-950">Pricing</a>
          <a href="#faq" className="hover:text-slate-950">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-2xl px-5 py-3 text-sm font-semibold transition border border-white/90 bg-white/80 text-slate-700 shadow-sm hover:bg-white hidden sm:inline-flex">Sign in</Link>
          <Link href="/login" className="rounded-2xl px-5 py-3 text-sm font-semibold transition bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700">Get started</Link>
        </div>
      </div>
    </header>
  );
}

function DocumentPreview() {
  return (
    <div className="rounded-[28px] bg-slate-100/70 p-4 ring-1 ring-slate-200/70">
      <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 h-3 w-28 rounded-full bg-teal-500" />
        <div className="mb-6">
          <div className="h-3 w-44 rounded-full bg-slate-300" />
          <div className="mt-3 h-2 w-56 rounded-full bg-slate-200" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={cx("mb-2 h-2 rounded-full bg-slate-200", i % 3 === 0 ? "w-full" : i % 2 === 0 ? "w-10/12" : "w-8/12")} />
        ))}
        <div className="mt-8 rounded-2xl border border-dashed border-teal-200 bg-teal-50/70 p-4">
          <div className="h-2 w-24 rounded-full bg-teal-300" />
          <div className="mt-3 h-2 w-36 rounded-full bg-teal-200" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Referral packet</span>
        <span>8 pages</span>
      </div>
    </div>
  );
}

function ProductMockup() {
  const rows: [string, string, string, PillTone][] = [
    ["Utah Valley Pediatrics", "New referral packet", "Needs review", "amber"],
    ["Aspen Family Clinic", "Records request", "Delivered", "emerald"],
    ["Wasatch Imaging", "Prior authorization", "Processing", "amber"],
  ];

  return (
    <Card className="relative overflow-hidden p-4 md:p-5">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-200/60 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-emerald-100 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-semibold text-slate-950">Live fax operations</p>
            <p className="text-xs text-slate-500">Today, 10:42 AM</p>
          </div>
          <Pill tone="emerald">Healthy</Pill>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <Metric value="42" label="sent" />
          <Metric value="18" label="received" />
          <Metric value="9" label="review" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <DocumentPreview />
          <div className="space-y-3">
            {rows.map(([name, subject, status, tone]) => (
              <div key={name} className="rounded-[22px] bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{name}</p>
                  <Pill tone={tone}>{status}</Pill>
                </div>
                <p className="mt-1 text-sm text-slate-500">{subject}</p>
              </div>
            ))}
            <div className="rounded-[22px] bg-slate-950 p-4 text-white shadow-lg shadow-slate-950/15">
              <p className="text-sm font-semibold">Suggested routing</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Assign to Intake Team, tag as New Patient, and retain for 7 years.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface MetricProps {
  value: string;
  label: string;
}

function Metric({ value, label }: MetricProps) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-sm">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <Card className="p-7">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700 ring-1 ring-teal-100">{icon}</div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </Card>
  );
}

interface WorkflowOverviewCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  body: string;
}

function WorkflowOverviewCard({ icon, title, subtitle, body }: WorkflowOverviewCardProps) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-3xl text-teal-700 ring-1 ring-slate-200 shadow-sm">
        {icon}
      </div>
      <h3 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-base font-semibold leading-6 text-slate-900">{subtitle}</p>
      <p className="mt-4 text-base leading-8 text-slate-500">{body}</p>
    </div>
  );
}

interface TabData {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: [string, string][];
  panelTitle: string;
  panelSubtitle: string;
  badge: string;
  badgeTone: PillTone;
  leftItems: string[];
  rightTitle: string;
  rightRows: string[];
  cta: string;
}

function InteractiveOperationsShowcase() {
  const tabs: TabData[] = [
    {
      id: "send",
      label: "Send fax",
      title: "Send faxes without the busywork",
      description: "Prepare cover pages, attach files, preview packets, and send secure outbound faxes from one clean workflow.",
      bullets: [
        ["Compose", "Add recipient, fax number, subject, and cover page note."],
        ["Preview", "Review files, pages, and estimated credits before sending."],
        ["Receipt", "Track delivery and store the final receipt automatically."],
      ],
      panelTitle: "Outbound fax workflow",
      panelSubtitle: "Compose → Preview → Receipt",
      badge: "Ready to send",
      badgeTone: "teal",
      leftItems: ["Recipient", "Fax number", "Subject", "Cover page note"],
      rightTitle: "Delivery preview",
      rightRows: ["Files attached", "10 pages", "Auto-save receipt"],
      cta: "Send secure fax",
    },
    {
      id: "inbox",
      label: "Inbox review",
      title: "Review inbound faxes faster",
      description: "Open incoming documents, preview pages, assign owners, add notes, and move work forward without losing context.",
      bullets: [
        ["Preview", "See the document and key metadata side-by-side."],
        ["Triage", "Mark reviewed, assign owners, and add routing notes."],
        ["Forward", "Move documents to the right team without extra clicks."],
      ],
      panelTitle: "Inbound review",
      panelSubtitle: "Unread and review-needed faxes prioritized",
      badge: "Needs review",
      badgeTone: "amber",
      leftItems: ["Utah Valley Pediatrics", "Mountain Lab Services", "Peak Dental Group"],
      rightTitle: "Routing suggestion",
      rightRows: ["Assign to Intake Team", "Tag: New Patient", "Retain for 7 years"],
      cta: "Mark reviewed",
    },
    {
      id: "routing",
      label: "Routing rules",
      title: "Route documents where they belong",
      description: "Use fax numbers, folders, teams, forwarding rules, and retention settings to keep inbound fax traffic organized.",
      bullets: [
        ["Numbers", "Manage owned fax numbers in one place."],
        ["Rules", "Route inbound faxes to inboxes, folders, or teams."],
        ["Retention", "Apply forwarding and retention defaults with clarity."],
      ],
      panelTitle: "Number routing",
      panelSubtitle: "Main intake · Billing · New location",
      badge: "Active rules",
      badgeTone: "emerald",
      leftItems: ["Main intake", "Billing", "Prior auth"],
      rightTitle: "Rule preview",
      rightRows: ["Route to Intake inbox", "Forward copy to intake@faxgrid.com", "Retention: 7 years"],
      cta: "Save routing",
    },
    {
      id: "team",
      label: "Team control",
      title: "Manage your team without micromanaging",
      description: "Invite teammates, assign roles, and control permissions so everyone can do their work without overexposure.",
      bullets: [
        ["Roles", "Set access for sending, reviewing, billing, and admin tasks."],
        ["Visibility", "Control what each teammate can view and manage."],
        ["Approvals", "Keep ownership and responsibilities clear across the team."],
      ],
      panelTitle: "Team permissions",
      panelSubtitle: "Profiles, roles, and workspace access",
      badge: "Admin controls",
      badgeTone: "slate",
      leftItems: ["Admin", "Reviewer", "Billing", "Member"],
      rightTitle: "Permission summary",
      rightRows: ["Send faxes", "Review inbox", "Manage numbers"],
      cta: "Invite teammate",
    },
  ];

  const [activeTab, setActiveTab] = React.useState<string>("send");
  const current = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <p className="text-sm font-semibold text-teal-700">Interactive overview</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl">
          Everything you need to run modern fax operations
        </h2>
      </div>

      <div className="mx-auto mb-8 flex max-w-5xl flex-wrap items-center justify-center gap-2 rounded-[24px] border border-white/80 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = current.id === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                "rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[340px_1fr] xl:items-start">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-slate-950">{current.title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-500">{current.description}</p>

          <div className="mt-8 space-y-5">
            {current.bullets.map(([label, text]) => (
              <div key={label}>
                <p className="text-base font-semibold text-slate-950">{label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="bg-[linear-gradient(90deg,rgba(20,184,166,0.14),rgba(20,184,166,0.06))] px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">{current.panelTitle}</p>
                <p className="mt-1 text-sm text-slate-500">{current.panelSubtitle}</p>
              </div>
              <Pill tone={current.badgeTone}>{current.badge}</Pill>
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr]">
            <div className="border-b border-slate-200 bg-slate-50/70 p-5 lg:border-b-0 lg:border-r">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
              <div className="space-y-3">
                {current.leftItems.map((item, i) => (
                  <div
                    key={item}
                    className={cx(
                      "rounded-2xl px-4 py-3 text-sm font-medium ring-1",
                      i === 0 ? "bg-white text-slate-900 ring-slate-200 shadow-sm" : "bg-transparent text-slate-500 ring-transparent"
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button className="mt-6 rounded-[18px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15">
                {current.cta}
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">{current.rightTitle}</p>
                    <p className="mt-1 text-sm text-slate-500">Preview of the selected workflow</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="space-y-3">
                  {current.rightRows.map((row, i) => (
                    <div
                      key={row}
                      className={cx(
                        "flex items-center justify-between rounded-2xl px-4 py-4 ring-1",
                        i === 0 ? "bg-teal-50/70 ring-teal-100" : "bg-slate-50 ring-slate-200"
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row}</p>
                        <p className="mt-1 text-xs text-slate-500">Operational detail</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-400">→</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[22px] border border-dashed border-teal-200 bg-teal-50/60 p-5">
                  <div className="mb-3 h-3 w-28 rounded-full bg-teal-300" />
                  <div className="mb-2 h-2 w-full rounded-full bg-teal-200" />
                  <div className="mb-2 h-2 w-10/12 rounded-full bg-teal-200" />
                  <div className="h-2 w-8/12 rounded-full bg-teal-200" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

interface StepProps {
  number: string;
  title: string;
  text: string;
}

function Step({ number, title, text }: StepProps) {
  return (
    <div className="flex gap-4 rounded-[24px] bg-white p-5 ring-1 ring-slate-200">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">{number}</div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

interface SecurityItemProps {
  title: string;
  text: string;
}

function SecurityItem({ title, text }: SecurityItemProps) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-200">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="rounded-[24px] bg-white p-6 ring-1 ring-slate-200">
      <h3 className="font-semibold text-slate-950">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{answer}</p>
    </div>
  );
}

export default function FaxGridMarketingHome() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(204,251,241,0.85),transparent_32%),linear-gradient(135deg,#f8fffd,#f3f7f6)] text-slate-900">
      <Nav />

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> Secure cloud fax for modern teams
              </div>
              <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-slate-950 md:text-7xl">
                Modern fax software for teams that still need fax to work.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                FaxGrid gives healthcare, finance, legal, and operations teams a calmer way to send, receive, route, track, and archive faxes — without the legacy portal experience.
              </p>
              <SignupField className="mt-8" />
            </div>
            <ProductMockup />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
          <div className="mb-12 flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-teal-700">Platform overview</p>
              <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl">
                All your fax workflows in one platform
              </h2>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-300 shadow-sm backdrop-blur-xl">←</button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-xl">→</button>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            <WorkflowOverviewCard
              icon="↗"
              title="Send"
              subtitle="Compose and deliver faxes securely"
              body="Prepare cover pages, attach files, preview packets, and send outbound faxes with clear delivery tracking and downloadable receipts."
            />
            <WorkflowOverviewCard
              icon="◎"
              title="Review"
              subtitle="Triage inbound documents quickly"
              body="Open inbound faxes, preview pages, assign owners, add notes, and move documents through review without losing context."
            />
            <WorkflowOverviewCard
              icon="↘"
              title="Route"
              subtitle="Direct documents where they belong"
              body="Use fax numbers, folders, teams, forwarding rules, and routing logic to keep incoming documents organized and actionable."
            />
            <WorkflowOverviewCard
              icon="▣"
              title="Archive"
              subtitle="Keep records organized and accessible"
              body="Store documents, receipts, routing activity, and retention settings in one system built for visibility, traceability, and control."
            />
          </div>
        </section>

        <InteractiveOperationsShowcase />

        <section id="workflow" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="p-8 md:p-10">
              <p className="text-sm font-semibold text-teal-700">Modern fax workflow</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">One calm workspace from inbound document to final receipt.</h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                FaxGrid is designed around the real operational work: sending packets, reviewing inbound faxes, assigning ownership, retrying failures, and keeping proof of delivery close at hand.
              </p>
              <div className="mt-7 space-y-4">
                <Step number="01" title="Compose or receive" text="Send a fax securely or capture inbound faxes from dedicated numbers." />
                <Step number="02" title="Review and route" text="Use owners, tags, folders, forwarding, and routing rules to keep faxes out of limbo." />
                <Step number="03" title="Archive the proof" text="Save documents, notes, activity, and delivery receipts for long-term retention." />
              </div>
            </Card>

            <Card className="p-8 md:p-10">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-950">What teams can do</p>
                  <p className="mt-1 text-sm text-slate-500">Built for actual fax operations, not just sending a PDF.</p>
                </div>
                <Pill tone="teal">Operational</Pill>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  "Dedicated fax numbers",
                  "Inbound routing rules",
                  "Email forwarding copies",
                  "Team assignment",
                  "Retry failed transmissions",
                  "Downloadable PDF receipts",
                  "Status timeline",
                  "Retention policy controls",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">✓</span>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="security" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="rounded-[36px] border border-white/80 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-teal-700">Security without the heavy feel</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Built for teams that need trust, visibility, and control.</h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                Use role-based permissions, MFA policies, audit-friendly activity logs, retention controls, and delivery receipts without burying users in admin complexity.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SecurityItem title="Role permissions" text="Separate send, review, billing, number, and API access." />
              <SecurityItem title="Receipt archive" text="Keep proof of delivery attached to every outbound fax." />
              <SecurityItem title="Routing audit trail" text="Track rule changes, ownership updates, notes, and retries." />
              <SecurityItem title="Retention controls" text="Align workspace defaults with your document retention policy." />
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold text-teal-700">Simple pricing</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Start free. Scale when you&apos;re ready.</h2>
            <p className="mt-4 text-base text-slate-500">30-day free trial on all plans. No credit card required.</p>
          </div>
          <div className="mx-auto max-w-3xl grid md:grid-cols-2 gap-6">
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-slate-950">Starter</h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">$39</span>
                <span className="pb-1 text-sm font-medium text-slate-500">/mo</span>
              </div>
              <div className="mt-6 space-y-3">
                {["500 faxes/month", "1 fax number", "30-day retention", "Team inbox and sent history", "Delivery receipts", "Routing rules", "Email forwarding"].map((item) => (
                  <p key={item} className="flex gap-3 text-sm font-medium text-slate-700"><span className="text-teal-600">✓</span>{item}</p>
                ))}
              </div>
              <Button variant="dark" className="mt-7 w-full py-3.5">Start free trial</Button>
            </Card>
            <Card className="p-8 ring-2 ring-teal-500">
              <div className="mb-4">
                <Pill tone="emerald">Most popular</Pill>
              </div>
              <h3 className="text-xl font-semibold text-slate-950">Professional</h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">$89</span>
                <span className="pb-1 text-sm font-medium text-slate-500">/mo</span>
              </div>
              <div className="mt-6 space-y-3">
                {["2,000 faxes/month", "2 fax numbers", "90-day retention", "Team inbox and sent history", "Delivery receipts", "Routing rules", "Email forwarding"].map((item) => (
                  <p key={item} className="flex gap-3 text-sm font-medium text-slate-700"><span className="text-teal-600">✓</span>{item}</p>
                ))}
              </div>
              <Button variant="dark" className="mt-7 w-full py-3.5">Start free trial</Button>
            </Card>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold text-teal-700">Questions</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Built for the messy middle between legacy fax and modern workflows.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FAQItem question="Is FaxGrid replacing fax or improving it?" answer="FaxGrid is designed for teams that still need fax today, but want a cleaner, more controlled workflow around sending, receiving, routing, and proving delivery." />
            <FAQItem question="Who is this for?" answer="Healthcare clinics, billing teams, legal offices, finance teams, and operations groups that handle fax volume and need accountability around documents." />
            <FAQItem question="Does it support inbound routing?" answer="Yes. The product concept includes owned fax numbers, routing rules, team assignment, email forwarding copies, and retention policies." />
            <FAQItem question="Can it support API-driven workflows later?" answer="Yes. FaxGrid can grow from a workspace-first product into deeper fax infrastructure with API access, webhooks, and automated routing." />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8">
          <div className="rounded-[36px] border border-slate-950 bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.20)] md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold text-teal-300">Ready for a calmer fax workflow?</p>
                <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Give your team a secure fax experience that feels like modern software.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Start with sending, inbox triage, routing rules, receipts, team permissions, and analytics.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link href="/login" className="rounded-2xl px-5 py-3 text-sm font-semibold transition bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 bg-teal-500 hover:bg-teal-400">Request demo</Link>
                <Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/20">Talk to sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
