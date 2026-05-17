'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { HLogo } from './primitives';

interface BlogCard {
  tag: string;
  title: string;
  excerpt: string;
  art: React.ReactNode;
}

function PartnershipArt() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628, #0f2644)' }}>
      <div className="fg-blog-stripes" />
      <div className="relative z-10 text-center">
        <div className="mx-auto mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">F</div>
          <span className="text-white/40 text-lg">+</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/80 text-xs font-bold text-white">E</div>
        </div>
        <p className="text-xs font-semibold text-white/60">Integration partner</p>
      </div>
    </div>
  );
}

function FAQArt() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-6 py-5" style={{ background: 'linear-gradient(135deg, #071320, #0c1f38)' }}>
      <div className="fg-blog-stripes" style={{ opacity: 0.2 }} />
      {['Is FaxGrid HIPAA-ready?', 'How does routing work?', 'What happens on failure?'].map((q, i) => (
        <div key={i} className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/8">
          <p className="text-xs text-white/70">{q}</p>
        </div>
      ))}
    </div>
  );
}

function IntegrationArt() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #061a14, #082418)' }}>
      <div className="fg-blog-stripes" />
      <div className="relative z-10 space-y-2 px-6 w-full">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/8">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
          <span className="text-xs text-white/70">Epic → FaxGrid route matched</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/8">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-white/70">Assigned to Intake Team</span>
        </div>
      </div>
    </div>
  );
}

function UptimeArt() {
  const bars = [88, 92, 85, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-6 py-5" style={{ background: 'linear-gradient(180deg, #07090f, #0c1222)' }}>
      <div className="mb-3 flex items-end justify-between gap-1">
        <span className="text-xs text-white/40">Uptime</span>
        <span className="text-sm font-semibold text-emerald-400">99.99%</span>
      </div>
      <div className="flex items-end gap-1 h-14">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${h}%`, background: h === 100 ? 'var(--color-primary)' : 'rgba(61,80,128,0.25)' }}
          />
        ))}
      </div>
    </div>
  );
}

function WebinarArt() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #130a1e, #1e0f32)' }}>
      <div className="fg-blog-stripes" style={{ opacity: 0.15 }} />
      <div className="relative z-10 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2">
        <span className="text-xs font-semibold text-purple-300">HIPAA Webinar</span>
      </div>
      <p className="relative z-10 text-center text-sm font-semibold text-white px-4">Live Q&amp;A with our compliance team</p>
    </div>
  );
}

const blogCards: BlogCard[] = [
  {
    tag: 'Partnership',
    title: 'FaxGrid + Epic Connect: routing inbound faxes automatically',
    excerpt: 'How our Epic integration maps fax numbers to workflows and teams.',
    art: <PartnershipArt />,
  },
  {
    tag: 'FAQ',
    title: 'Your most common FaxGrid questions, answered',
    excerpt: 'HIPAA, pricing, routing, and what happens when a fax fails.',
    art: <FAQArt />,
  },
  {
    tag: 'Integration',
    title: 'Building an Epic routing pipeline with FaxGrid',
    excerpt: 'Step-by-step guide to connecting Epic and FaxGrid for automatic inbox routing.',
    art: <IntegrationArt />,
  },
  {
    tag: 'Reliability',
    title: "FaxGrid's uptime track record: a year in review",
    excerpt: '99.99% uptime across all regions and what we do when something goes wrong.',
    art: <UptimeArt />,
  },
  {
    tag: 'Webinar',
    title: 'HIPAA compliance in fax workflows: what you need to know',
    excerpt: 'Recap of our live session with compliance and legal experts.',
    art: <WebinarArt />,
  },
];

const footerLinks = {
  Product: ['Send fax', 'Inbox review', 'Routing rules', 'Team control', 'Pricing'],
  Solutions: ['Healthcare', 'Legal', 'Finance', 'Operations', 'Enterprise'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Resources: ['Documentation', 'API reference', 'Status', 'Security', 'Privacy'],
};

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a href="#" className="fg-soc" aria-label={label}>
      {children}
    </a>
  );
}

export function HResourcesFooter() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Resources band */}
      <section style={{ background: 'var(--color-bg)' }} className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>From the FaxGrid desk</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
                From the FaxGrid desk.
              </h2>
              <p className="mt-3 text-base text-slate-500">Articles, guides, and updates for fax-forward teams.</p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-300 shadow-sm">←</button>
              <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm">→</button>
            </div>
          </div>
          <div ref={scrollRef} className="fg-blog-row">
            {blogCards.map((card) => (
              <div key={card.title} className="fg-blog-card">
                <div className="fg-blog-art relative">
                  {card.art}
                </div>
                <div className="mt-4 px-1">
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{card.tag}</span>
                  <p className="fg-blog-title mt-2 text-sm font-semibold leading-snug text-slate-950">{card.title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{card.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark footer */}
      <footer className="fg-dark py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 xl:grid-cols-[1fr_auto]">
            <div>
              <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-white md:text-4xl" style={{ fontFamily: 'var(--font-inter-tight), sans-serif' }}>
                Get started with FaxGrid today.
              </h2>
              <p className="mt-4 max-w-md text-base text-slate-400">
                Join healthcare teams, legal offices, and operations groups that run fax with clarity.
              </p>
              <Link href="/signup" className="fg-foot-cta mt-8 inline-flex">
                Start free trial
                <span className="fg-foot-cta-arrow">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4">
              {Object.entries(footerLinks).map(([col, links]) => (
                <div key={col}>
                  <p className="fg-foot-col-title mb-3">{col}</p>
                  {links.map((link) => (
                    <a key={link} href="#" className="fg-foot-link">{link}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/8 pt-8">
            <HLogo />
            <div className="flex items-center gap-2">
              <SocialIcon label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
              </SocialIcon>
              <SocialIcon label="X / Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </SocialIcon>
              <SocialIcon label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>
              </SocialIcon>
              <SocialIcon label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </SocialIcon>
              <SocialIcon label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </SocialIcon>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>© 2026 FaxGrid. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                🌐 English
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
