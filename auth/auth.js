/* RobinDock — auth interactions: view routing, password reveal,
   strength meter, reset requirements, checkbox toggle. Demo-only. */
(function () {
  const shell = document.getElementById('authShell');
  const titles = {
    signin: 'RobinDock — Sign in', create: 'RobinDock — Create account',
    forgot: 'RobinDock — Reset password', sent: 'RobinDock — Check your email',
    reset: 'RobinDock — Set a new password', done: 'RobinDock — Password updated'
  };

  function go(view) {
    if (!titles[view]) return;
    shell.setAttribute('data-view', view);
    document.title = titles[view];
    // update the top-right swap prompts
    document.querySelectorAll('.form-top .swap').forEach(s => {
      s.style.display = s.dataset.when.split(' ').includes(view) ? '' : 'none';
    });
    // focus first field of the shown view
    const first = shell.querySelector('.view-' + view + ' input');
    if (first) setTimeout(() => first.focus(), 30);
    window.scrollTo(0, 0);
  }

  // any element with data-go navigates
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-go]');
    if (nav) { e.preventDefault(); go(nav.dataset.go); }
  });

  // password reveal toggles
  document.querySelectorAll('[data-reveal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = document.getElementById(btn.dataset.reveal);
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.innerHTML = show
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10.6 6.2A9.7 9.7 0 0112 6c6 0 9.5 6 9.5 6a15 15 0 01-3 3.5M6.4 7.9A15 15 0 002.5 12S6 18 12 18c1 0 2-.2 2.9-.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.6 10.6a3 3 0 004.2 4.2" stroke="currentColor" stroke-width="1.7"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>';
      inp.focus();
    });
  });

  // checkbox affordance
  document.querySelectorAll('[data-ck]').forEach(ck => {
    ck.addEventListener('click', e => { e.preventDefault(); ck.classList.toggle('on'); });
  });

  // create-account strength meter
  const crPass = document.getElementById('cr-pass');
  const crStrength = document.getElementById('crStrength');
  const strLabels = ['—', 'Weak', 'Fair', 'Good', 'Strong'];
  function score(v) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return v ? Math.max(1, s) : 0;
  }
  if (crPass) crPass.addEventListener('input', () => {
    const lvl = score(crPass.value);
    crStrength.dataset.lvl = lvl;
    crStrength.querySelector('.strength-lbl b').textContent = strLabels[lvl];
  });

  // reset-password live requirements + confirm match
  const rsPass = document.getElementById('rs-pass');
  const rsConfirm = document.getElementById('rs-confirm');
  const rsReq = document.getElementById('rsReq');
  const rsMismatch = document.getElementById('rsMismatch');
  function checkReq() {
    const v = rsPass.value;
    const tests = { len: v.length >= 8, case: /[a-z]/.test(v) && /[A-Z]/.test(v), num: /\d/.test(v), sym: /[^A-Za-z0-9]/.test(v) };
    rsReq.querySelectorAll('li').forEach(li => li.classList.toggle('met', tests[li.dataset.req]));
  }
  function checkMatch() {
    const bad = rsConfirm.value && rsPass.value !== rsConfirm.value;
    rsMismatch.style.display = bad ? '' : 'none';
    rsConfirm.classList.toggle('bad', !!bad);
  }
  if (rsPass) { rsPass.addEventListener('input', checkReq); rsPass.addEventListener('input', checkMatch); }
  if (rsConfirm) rsConfirm.addEventListener('input', checkMatch);

  // form submissions → next step in the flow (demo, no backend)
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const kind = form.dataset.form;
      if (kind === 'signin') { window.location.href = '../inbox/Robin Dock - Inbox v2.html'; }
      else if (kind === 'create') { window.location.href = '../inbox/Robin Dock - Inbox v2.html'; }
      else if (kind === 'forgot') {
        const email = document.getElementById('fg-email').value.trim() || 'you@practice.com';
        document.getElementById('sentTo').textContent = email;
        go('sent');
      }
      else if (kind === 'reset') {
        if (rsConfirm.value && rsPass.value !== rsConfirm.value) { checkMatch(); return; }
        go('done');
      }
    });
  });

  // resend nudge
  document.querySelectorAll('[data-resend]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    a.textContent = 'Sent ✓';
    setTimeout(() => { a.textContent = 'Resend'; }, 2500);
  }));

  // initialize swap prompts for the current view (and deep-link support)
  const hash = (location.hash || '').replace('#', '');
  go(titles[hash] ? hash : shell.getAttribute('data-view'));
})();
