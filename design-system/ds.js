/* RobinDock Design System — interactions */
(function () {
  'use strict';

  /* ---- Scroll-spy for the contents rail ---- */
  const toc = document.getElementById('toc');
  if (toc) {
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const map = new Map();
    links.forEach(a => {
      const el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) map.set(el, a);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = map.get(e.target);
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -72% 0px', threshold: 0 });
    map.forEach((_, el) => io.observe(el));
  }

  /* ---- Click a swatch to copy its hex ---- */
  document.addEventListener('click', e => {
    const sw = e.target.closest('.swatch[data-hex]');
    if (sw) {
      const hex = sw.getAttribute('data-hex');
      navigator.clipboard && navigator.clipboard.writeText(hex);
      const cp = sw.querySelector('.cp');
      if (cp) { const prev = cp.textContent; cp.textContent = 'copied!'; setTimeout(() => cp.textContent = prev, 1100); }
    }
  });

  /* ---- Generic toggle groups: click an item, it becomes the only .on among siblings ---- */
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-pick]');
    if (item) {
      const group = item.parentElement;
      [...group.children].forEach(c => { if (c.hasAttribute('data-pick')) c.classList.remove('on'); });
      item.classList.add('on');
    }
  });

  /* ---- Self-toggling things (checkbox, toggle, radio-in-group handled above) ---- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toggle]');
    if (t) t.classList.toggle('on');
  });

  /* ---- Modal demo ---- */
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-modal-open]');
    if (open) {
      const m = document.querySelector(open.getAttribute('data-modal-open'));
      if (m) m.style.display = 'flex';
    }
    if (e.target.closest('[data-modal-close]') || e.target.classList.contains('modal-scrim')) {
      const scrim = e.target.closest('.modal-scrim');
      if (scrim) scrim.style.display = 'none';
    }
  });

  /* ---- Toast demo ---- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-toast]');
    if (b) {
      const t = document.querySelector(b.getAttribute('data-toast'));
      if (t) {
        t.style.opacity = '1';
        t.style.transform = 'translateY(0)';
        clearTimeout(t._timer);
        t._timer = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; }, 2600);
      }
    }
    const x = e.target.closest('.toast .x');
    if (x) { const t = x.closest('.toast'); t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; }
  });

  /* ---- Drawer / slide-over demo ---- */
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-drawer-open]');
    if (open) {
      const d = document.querySelector(open.getAttribute('data-drawer-open'));
      if (d) d.classList.add('open');
    }
    if (e.target.closest('[data-drawer-close]') || e.target.classList.contains('drawer-scrim')) {
      const d = e.target.closest('.drawer-demo');
      if (d) d.classList.remove('open');
    }
  });

  /* ---- Accordion ---- */
  document.addEventListener('click', e => {
    const head = e.target.closest('.acc .ahead');
    if (head) {
      const item = head.closest('.acc');
      const wrap = item.closest('.accordion');
      const wasOpen = item.classList.contains('open');
      if (wrap && wrap.hasAttribute('data-acc-single')) {
        wrap.querySelectorAll('.acc.open').forEach(a => a.classList.remove('open'));
      }
      item.classList.toggle('open', !wasOpen);
    }
  });

  /* ---- Combobox (single-select dropdown) ---- */
  document.addEventListener('click', e => {
    const field = e.target.closest('.combo .cfield');
    if (field) {
      const combo = field.closest('.combo');
      const wasOpen = combo.classList.contains('open');
      document.querySelectorAll('.combo.open').forEach(c => c.classList.remove('open'));
      combo.classList.toggle('open', !wasOpen);
      return;
    }
    const opt = e.target.closest('.combo .copt');
    if (opt) {
      const combo = opt.closest('.combo');
      combo.querySelectorAll('.copt').forEach(o => o.classList.remove('sel'));
      opt.classList.add('sel');
      const val = combo.querySelector('.cval');
      if (val) { val.textContent = opt.dataset.val || opt.textContent.trim(); val.classList.remove('cph'); }
      combo.classList.remove('open');
      return;
    }
    if (!e.target.closest('.combo')) document.querySelectorAll('.combo.open').forEach(c => c.classList.remove('open'));
  });

  /* ---- Token input: remove a token ---- */
  document.addEventListener('click', e => {
    const tx = e.target.closest('.token .tx');
    if (tx) tx.closest('.token').remove();
  });

  /* ---- Notification panel: dismiss bell dot / mark read ---- */
  document.addEventListener('click', e => {
    const mr = e.target.closest('.notif .mark-read');
    if (mr) {
      const n = mr.closest('.notif');
      n.querySelectorAll('.ni.unread').forEach(i => i.classList.remove('unread'));
    }
    const ni = e.target.closest('.notif .ni.unread');
    if (ni) ni.classList.remove('unread');
  });

  /* ---- Calendar: pick a single day (demo) ---- */
  document.addEventListener('click', e => {
    const day = e.target.closest('.cal .day:not(.mut)');
    if (day && !day.closest('[data-cal-range]')) {
      const cal = day.closest('.cal');
      cal.querySelectorAll('.day.on').forEach(d => d.classList.remove('on'));
      day.classList.add('on');
    }
  });

  /* ---- Stepper demo: advance / reset ---- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const wrap = document.querySelector(btn.dataset.stepTarget || '#demoStepper');
    if (!wrap) return;
    const steps = [...wrap.querySelectorAll('.step')];
    let cur = steps.findIndex(s => s.classList.contains('on'));
    const dir = btn.dataset.step;
    if (dir === 'next' && cur < steps.length - 1) {
      steps[cur].classList.remove('on'); steps[cur].classList.add('done');
      steps[cur + 1].classList.add('on');
    } else if (dir === 'back' && cur > 0) {
      steps[cur].classList.remove('on');
      steps[cur - 1].classList.remove('done'); steps[cur - 1].classList.add('on');
    } else if (dir === 'reset') {
      steps.forEach((s, i) => { s.classList.remove('done', 'on'); if (i === 0) s.classList.add('on'); });
    }
  });

  /* ---- Dropzone: hover/leave visual + fake upload progress on click ---- */
  document.querySelectorAll('.dropzone').forEach(dz => {
    ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('drag'); }));
  });
})();
