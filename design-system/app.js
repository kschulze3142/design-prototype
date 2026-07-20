/* ============================================================
   RobinDock — App shell controller
   Hash routing · active nav · collapse · dropdowns · states
   ============================================================ */
(function () {
  'use strict';

  /* ---------- icons (24x24, currentColor) ---------- */
  const I = {
    intake: '<path d="M4 13l2.5-7A2 2 0 018.4 4.6h7.2A2 2 0 0117.5 6L20 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13h4l1.5 2.5h5L16 13h4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    cases: '<path d="M4 7a2 2 0 012-2h3l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    departments: '<path d="M4 20V9l5-3 5 3M4 20h16M4 20V9m10 11V6.5L20 9v11M9 20v-4h2v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    clients: '<circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    contacts: '<rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="11" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 16c.5-1.6 1.7-2.2 3-2.2s2.5.6 3 2.2M15 9h3M15 13h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    compose: '<path d="M4 20h4l10-10a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.7"/>',
    connected: '<rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.7"/><path d="M16.5 13.5v6M13.5 16.5h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    audit: '<path d="M6 3h9l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    settings: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3m14.5-6.5l-1.8 1.8M8.3 15.7L6.5 17.5m11 0l-1.8-1.8M8.3 8.3L6.5 6.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    profile: '<circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    ghost: '<path d="M5 20V9a7 7 0 0114 0v11l-2.3-1.6L14.5 20 12 18.4 9.5 20 7.3 18.4 5 20z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.5 10h.01M14.5 10h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };
  const svg = (name) => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none">' + (I[name] || I.cases) + '</svg>';

  /* ---------- route config ---------- */
  const ROUTES = {
    '/cases':        { nav: 'cases', title: 'Cases', sub: 'Every active patient case and its documents — your actionable home.', primary: 'New case', icon: 'cases' },
    '/clients':      { nav: 'clients', title: 'Clients', sub: 'Pet owners and the accounts you manage records for.', primary: 'Add client', icon: 'clients' },
    '/contacts':     { nav: 'contacts', title: 'Contacts', sub: 'Senders, referral partners and practices on your network.', primary: 'Add contact', icon: 'contacts' },
    '/compose':      { nav: 'compose', title: 'Compose', sub: 'Start a new document, fax or message to send from your practice.', primary: 'New message', icon: 'compose' },
    '/connected':    { nav: 'connected', title: 'Connected Apps', sub: 'Integrations with your PIMS, labs and the Flock network.', icon: 'connected' },
    '/audit':        { nav: 'audit', title: 'Audit log', sub: 'A complete, searchable record of every action across the practice.', icon: 'audit' },
    '/settings':     { nav: 'settings', title: 'Settings', sub: 'Practice profile, routing rules, team and permissions.', icon: 'settings' },
    '/profile':      { nav: null, title: 'User Profile', sub: 'Your account, notification preferences and signature.', icon: 'profile' },
    '/403':          { nav: null, error: '403' },
    '/404':          { nav: null, error: '404' }
  };

  const DEPARTMENTS = ['Radiology', 'Surgery', 'Internal Medicine', 'Dentistry', 'Emergency'];

  const content = document.getElementById('appContent');
  const titleEl = document.getElementById('appTitle');

  /* ---------- renderers ---------- */
  function placeholderPage(r) {
    const actions = r.primary
      ? '<div class="ph-actions"><button class="btn btn-light btn-sm">Filter</button><button class="btn btn-blue btn-sm">' + r.primary + '</button></div>'
      : '';
    const deptBar = r.dept ? deptSwitcher() : '';
    const label = (r.dept ? 'Radiology' : r.title);
    return '' +
      '<div class="page">' +
        '<div class="page-head"><div class="ph-main"><h1>' + r.title + '</h1>' +
        '<div class="ph-sub">' + r.sub + '</div></div>' + actions + '</div>' +
        deptBar +
        '<div class="placeholder">' +
          '<div class="pic">' + svg(r.icon) + '</div>' +
          '<h2>' + label + ' — content area</h2>' +
          '<span class="ppath">#' + (location.hash.replace(/^#/, '') || '/cases') + '</span>' +
          '<p>This screen plugs into the shared shell here. Built in a later pass — the frame, navigation and chrome around it are final.</p>' +
        '</div>' +
      '</div>';
  }

  function deptSwitcher() {
    const opts = DEPARTMENTS.map((d, i) =>
      '<div class="copt' + (i === 0 ? ' sel' : '') + '" data-val="' + d + '">' + d +
      ' <span class="ck-mini"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>'
    ).join('');
    return '' +
      '<div class="dept-bar">' +
        '<span class="dlabel">Department</span>' +
        '<div class="combo"><div class="cfield"><span class="cval">Radiology</span><span class="cch">▾</span></div>' +
          '<div class="cmenu">' + opts + '</div></div>' +
        '<span class="dmeta">You belong to <b>3 departments</b></span>' +
      '</div>';
  }

  function errorPage(code) {
    const is404 = code === '404';
    return '' +
      '<div class="errpage">' +
        '<div class="eic">' + (is404 ? svg('ghost') : svg('lock')) + '</div>' +
        '<div class="ecode">' + code + '</div>' +
        '<h1>' + (is404 ? 'Page not found' : 'Access restricted') + '</h1>' +
        '<p>' + (is404
          ? 'We couldn\u2019t find that page. It may have moved, or the link is out of date.'
          : 'You don\u2019t have permission to view this. Ask a practice admin for access to this department or setting.') + '</p>' +
        '<div class="eactions">' +
          '<a class="btn btn-light" href="#/cases">Back to Cases</a>' +
          (is404 ? '' : '<button class="btn btn-blue">Request access</button>') +
        '</div>' +
      '</div>';
  }

  /* ---------- router ---------- */
  function render() {
    let path = location.hash.replace(/^#/, '');
    if (!path) path = '/cases';
    const r = ROUTES[path] || ROUTES['/404'];

    // active nav
    document.querySelectorAll('.nav-i').forEach(n => n.classList.remove('on'));
    if (r.nav) {
      const active = document.querySelector('.nav-i[data-nav="' + r.nav + '"]');
      if (active) active.classList.add('on');
    }

    // title + content
    titleEl.textContent = r.error ? ('Error ' + r.error) : r.title;
    content.innerHTML = r.error ? errorPage(r.error) : placeholderPage(r);
    content.scrollTop = 0;
    document.title = 'RobinDock — ' + (r.error ? r.error : r.title);
  }

  window.addEventListener('hashchange', render);

  /* ---------- collapse toggle ---------- */
  const app = document.getElementById('app');
  const COLLAPSE_KEY = 'rd_rail_collapsed';
  if (localStorage.getItem(COLLAPSE_KEY) === '1') app.classList.add('collapsed');
  document.getElementById('railToggle').addEventListener('click', () => {
    app.classList.toggle('collapsed');
    localStorage.setItem(COLLAPSE_KEY, app.classList.contains('collapsed') ? '1' : '0');
  });

  /* ---------- dropdowns (notifications + user) ---------- */
  const notifPanel = document.getElementById('notifPanel');
  const userPanel = document.getElementById('userPanel');
  function closeMenus(except) {
    if (except !== notifPanel) notifPanel.classList.remove('open');
    if (except !== userPanel) userPanel.classList.remove('open');
  }
  document.getElementById('bellBtn').addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !notifPanel.classList.contains('open');
    closeMenus(notifPanel);
    notifPanel.classList.toggle('open', willOpen);
  });
  document.getElementById('userBtn').addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !userPanel.classList.contains('open');
    closeMenus(userPanel);
    userPanel.classList.toggle('open', willOpen);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.bellwrap') && !e.target.closest('.usermenu')) closeMenus(null);
  });
  // close menus when navigating from inside them
  notifPanel.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) closeMenus(null); });
  userPanel.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) closeMenus(null); });

  /* ---------- notifications: clear → empty state ---------- */
  document.getElementById('clearNotif').addEventListener('click', () => {
    const list = document.getElementById('notifList');
    list.innerHTML =
      '<div class="ct-empty" style="padding:34px 20px">' +
        '<div class="ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<h4>You\u2019re all caught up</h4><p>New notifications will appear here.</p>' +
      '</div>';
    document.getElementById('bellDot').style.display = 'none';
  });

  /* ---------- logout (demo) ---------- */
  document.getElementById('logoutBtn').addEventListener('click', () => {
    closeMenus(null);
    content.innerHTML =
      '<div class="errpage"><div class="eic">' + svg('profile') + '</div>' +
      '<h1 style="margin-top:6px">Signed out</h1>' +
      '<p>This is a demo shell — no real session. Sign back in to continue.</p>' +
      '<div class="eactions"><a class="btn btn-blue" href="#/cases">Sign back in</a></div></div>';
    titleEl.textContent = 'Signed out';
  });

  /* ---------- loading skeleton ---------- */
  const skel = document.getElementById('shellSkeleton');
  function hideSkeleton() {
    skel.classList.add('hide');
    setTimeout(() => { skel.style.display = 'none'; }, 400);
  }

  /* ---------- combobox (dept switcher, delegated — content re-renders) ---------- */
  document.addEventListener('click', e => {
    const field = e.target.closest('.combo .cfield');
    if (field) {
      const combo = field.closest('.combo');
      const willOpen = !combo.classList.contains('open');
      document.querySelectorAll('.combo.open').forEach(c => c.classList.remove('open'));
      combo.classList.toggle('open', willOpen);
      return;
    }
    const opt = e.target.closest('.combo .copt');
    if (opt) {
      const combo = opt.closest('.combo');
      combo.querySelectorAll('.copt').forEach(o => o.classList.remove('sel'));
      opt.classList.add('sel');
      const val = combo.querySelector('.cval');
      if (val) val.textContent = opt.dataset.val || opt.textContent.trim();
      combo.classList.remove('open');
      // reflect department choice in the placeholder heading
      const ph = document.querySelector('.placeholder h2');
      if (ph) ph.textContent = (opt.dataset.val || opt.textContent.trim()) + ' — content area';
      return;
    }
    if (!e.target.closest('.combo')) document.querySelectorAll('.combo.open').forEach(c => c.classList.remove('open'));
  });

  /* ---------- boot ---------- */
  render();
  // show the shell skeleton briefly on first load
  window.addEventListener('load', () => setTimeout(hideSkeleton, 950));
  setTimeout(hideSkeleton, 1600); // fallback if load already fired
})();
