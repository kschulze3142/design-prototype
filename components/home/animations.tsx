'use client';

import React, { useRef, useState, useEffect, useCallback, ElementType } from 'react';

export function useReveal(options?: IntersectionObserverInit): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  slow?: boolean;
  style?: React.CSSProperties;
}

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', slow = false, style }: RevealProps) {
  const [ref, inView] = useReveal();
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref}
      className={`fg-reveal${inView ? ' fg-in' : ''}${slow ? ' fg-reveal-slow' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Comp>
  );
}

interface AnimatedCountProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
  decimals?: number;
  separator?: string;
}

export function AnimatedCount({ to, duration = 1200, suffix = '', prefix = '', className = '', style, decimals = 0, separator = '' }: AnimatedCountProps) {
  const [ref, inView] = useReveal();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * to);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, to, duration]);

  const formatted = (() => {
    const n = value.toFixed(decimals);
    if (!separator) return n;
    return n.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  })();

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={className} style={style}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function useCursorGlow() {
  const wrapRef = useRef<HTMLElement>(null!);
  const glowRef = useRef<HTMLDivElement>(null!);

  const onMove = useCallback((e: MouseEvent) => {
    const wrap = wrapRef.current;
    const glow = glowRef.current;
    if (!wrap || !glow) return;
    const rect = wrap.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top = `${e.clientY - rect.top}px`;
    glow.style.opacity = '1';
  }, []);

  const onLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [onMove, onLeave]);

  return { wrapRef, glowRef };
}
