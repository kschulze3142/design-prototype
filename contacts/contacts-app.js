/* ============================================================
   RobinDock — Contacts prototype · APP
   Orchestrates the two views:
     • COMPARE — the three directions side-by-side, each with its
       own search + filters, independently scrollable.
     • FOCUS   — one direction expanded to the full Contacts List
       surface (hero search, full toolbar, empty/loading states),
       with Add / Edit / Resolve-node flows.
   Plus the shell chrome (collapse, dropdowns, skeleton).
   Mock data only — nothing persists.
   ============================================================ */
(function () {
  'use strict';

  var R = window.RDC;
  var DIR = window.RDDIR;
  var DIR_ORDER = window.RDDIR_ORDER;
  var TYPE_ORDER = window.RD_TYPE_ORDER;
  var CONTACTS = window.RD_CONTACTS || [];
  var UNIDENTIFIED = window.RD_UNIDENTIFIED || [];
  var content = document.getElementById('appContent');
  var titleEl = document.getElementById('appTitle');

  /* per-direction state (preserved across compare ⇄ focus) */
  function newState() { return { q: '', sort: 'name', type: 'all', network: 'all', showInactive: false }; }
  var STATES = { roster: newState(), registry: newState(), cards: newState() };

  /* ---------------- context + render for one direction ---------------- */
  function ctxFor(dk) {
    var st = STATES[dk];
    return {
      contacts: CONTACTS,
      unidentified: R.filterUnidentified(UNIDENTIFIED, st),
      state: st
    };
  }
  function renderDir(dk) {
    var mount = document.getElementById('mount-' + dk);
    if (!mount) return;
    var ctx = ctxFor(dk);
    DIR[dk].render(mount, ctx);
    var cnt = document.getElementById('count-' + dk);
    if (cnt) cnt.innerHTML = window.RDDIR_COUNTLINE(R.filterContacts(CONTACTS, ctx.state).length, ctx);
  }

  /* ---------------- filter dropdown menu ---------------- */
  function typeOptions() {
    return [{ v: 'all', l: 'All types' }].concat(TYPE_ORDER.map(function (t) { return { v: t, l: R.typeLabel(t) }; }));
  }
  var NETWORK_OPTS = [{ v: 'all', l: 'All' }, { v: 'on', l: 'On network' }, { v: 'off', l: 'Off network' }];
  var SORT_OPTS = [{ v: 'name', l: 'Name (A–Z)' }, { v: 'activity', l: 'Last exchanged' }, { v: 'type', l: 'Type' }];

  function openMenu(trigger, options, current, onPick) {
    closeMenu();
    var m = document.createElement('div');
    m.className = 'menu dropmenu';
    m.innerHTML = options.map(function (o) {
      return '<div class="mi' + (o.v === current ? ' on' : '') + '" data-v="' + o.v + '">' +
        '<span class="mi-tick">' + (o.v === current ? '✓' : '') + '</span>' + R.esc(o.l) + '</div>';
    }).join('');
    document.body.appendChild(m);
    var r = trigger.getBoundingClientRect();
    m.style.position = 'fixed';
    m.style.top = (r.bottom + 6) + 'px';
    var left = r.left;
    var mw = Math.max(180, m.offsetWidth);
    if (left + mw > window.innerWidth - 12) left = window.innerWidth - 12 - mw;
    m.style.left = left + 'px';
    m.style.minWidth = Math.max(r.width, 180) + 'px';
    m.addEventListener('click', function (e) {
      var it = e.target.closest('[data-v]'); if (!it) return;
      onPick(it.dataset.v); closeMenu();
    });
    window._cmenu = m;
  }
  function closeMenu() { if (window._cmenu) { window._cmenu.remove(); window._cmenu = null; } }
  document.addEventListener('click', function (e) {
    if (window._cmenu && !e.target.closest('.dropmenu') && !e.target.closest('[data-drop]')) closeMenu();
  });
  window.addEventListener('resize', closeMenu);

  /* ---------------- toolbar (search + filters) ---------------- */
  function fdrop(dk, kind, label, current, opts) {
    var cur = opts.filter(function (o) { return o.v === current; })[0] || opts[0];
    var active = (kind === 'sort') ? current !== 'name' : current !== 'all';
    return '<button class="fdrop' + (active ? ' active' : '') + '" data-drop="' + kind + '" data-dk="' + dk + '">' +
      '<span class="lbl">' + label + '</span>' + R.esc(cur.l) + '<span class="ch">▾</span></button>';
  }
  function searchBox(dk, compact) {
    var st = STATES[dk];
    return '<div class="ct-search dir-search' + (compact ? ' compact' : '') + '" data-dk="' + dk + '">' + R.ICON.search +
      '<input data-search="' + dk + '" value="' + R.esc(st.q) + '" placeholder="' +
        (compact ? 'Search name or number…' : 'Search practices, cities, or a fax number…') + '" autocomplete="off" />' +
      '<span class="dir-clearx" data-clear="' + dk + '" style="' + (st.q ? '' : 'display:none') + '">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>' +
    '</div>';
  }
  function filterRow(dk, compact) {
    var st = STATES[dk];
    return '<div class="dir-filters">' +
      fdrop(dk, 'type', 'Type', st.type, typeOptions()) +
      fdrop(dk, 'network', 'Network', st.network, NETWORK_OPTS) +
      fdrop(dk, 'sort', 'Sort', st.sort, SORT_OPTS) +
      (compact ? '' : '<button class="fchk' + (st.showInactive ? ' on' : '') + '" data-toggle-inactive="' + dk + '"><span class="ck' + (st.showInactive ? ' on' : '') + '"></span>Show inactive</button>') +
    '</div>';
  }

  /* ---------------- COMPARE view ---------------- */
  var DK = 'roster'; /* committed direction */

  function renderSurface() {
    var dk = DK;
    var st = STATES[dk];
    titleEl.textContent = 'Contacts';

    content.innerHTML =
      '<div class="ct-page focus single" data-dk="' + dk + '">' +
        '<div class="ct-head">' +
          '<div><h1>Contacts</h1>' +
            '<div class="sub">The external directory — referring practices, specialty &amp; ER hospitals, labs, imaging and pharmacies you fax and refer to. ' +
              'Search a name, a city, or a fax number.</div></div>' +
          '<div class="ct-head-act"><button class="btn btn-blue" data-act="add">' + R.ICON.plus + 'Add contact</button></div>' +
        '</div>' +

        '<div class="ct-hero"><div class="in">' +
          '<div class="lbl">Find an external contact</div>' +
          '<div class="searchbar">' + R.ICON.search +
            '<input data-search="' + dk + '" value="' + R.esc(st.q) + '" placeholder="Search by practice name, city, email — or a fax number" autocomplete="off" />' +
            '<span class="dir-clearx hero" data-clear="' + dk + '" style="' + (st.q ? '' : 'display:none') + '">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>' +
          '</div>' +
          '<div class="hint">' + R.ICON.search + 'Number-aware — typing <b>0142</b> answers “who is this fax number?”.</div>' +
        '</div></div>' +

        '<div class="ct-toolbar">' +
          '<div class="count" id="count-' + dk + '"></div>' +
          '<div class="ct-toolbar-r">' + filterRow(dk, false) + '</div>' +
        '</div>' +

        '<div id="mount-' + dk + '"></div>' +
      '</div>';

    skeletonInto('mount-' + dk);
    setTimeout(function () { renderDir(dk); }, 360);
  }

  /* ---------------- loading skeleton ---------------- */
  function skeletonInto(mountId) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    var rows = '';
    for (var i = 0; i < 6; i++) {
      rows += '<div class="sk-row"><div class="skel circle" style="width:30px;height:30px"></div>' +
        '<div style="flex:1"><div class="skel" style="height:13px;width:' + (45 + (i % 3) * 12) + '%"></div>' +
        '<div class="skel" style="height:10px;width:30%;margin-top:7px"></div></div>' +
        '<div class="skel" style="height:22px;width:90px;border-radius:100px"></div></div>';
    }
    mount.innerHTML = '<div class="ctable"><div class="dir-skel">' + rows + '</div></div>';
  }

  /* ---------------- routing ---------------- */
  function route() {
    renderSurface();
    if (content.parentElement) content.parentElement.scrollTop = 0;
    document.title = 'RobinDock — Contacts';
  }

  /* ---------------- contact-detail stub (detail is a future surface) ---------------- */
  function openContactStub(c) {
    R.openModal({
      title: c.name,
      sub: R.typeLabel(c.type) + ' · <span class="mono">' + R.esc(c.faxes[0]) + '</span> · ' + R.esc(c.location),
      width: 460,
      body: '<div class="stub-note">' + R.ICON.book +
        '<div><b>Contact Detail is a separate surface.</b><br>Numbers, channels, on/off-network status and the full PHI-logged exchange history live on the detail page — built in a future session. From the directory you can still edit the contact’s business-directory fields.</div></div>' +
        '<div class="stub-kv">' +
          '<div class="kv"><span class="k">Network</span><span class="v">' + (c.network === 'on' ? 'On network (Robin Dock org)' : 'Off network (fax / email)') + '</span></div>' +
          '<div class="kv"><span class="k">Exchange · 30d</span><span class="v">' + (c.docs30 || 0) + ' documents</span></div>' +
          '<div class="kv"><span class="k">Last exchanged</span><span class="v">' + R.fmtDate(c.last) + '</span></div>' +
        '</div>',
      saveLabel: 'Edit contact',
      onSave: function () { R.editContactModal(c); }
    });
  }

  /* ---------------- interaction (delegated) ---------------- */
  function findContact(id) { return CONTACTS.filter(function (c) { return c.id === id; })[0]; }
  function findNode(id) { return UNIDENTIFIED.filter(function (u) { return u.id === id; })[0]; }

  content.addEventListener('click', function (e) {
    var t;
    if (e.target.closest('[data-act="add"]')) { R.addContactModal(); return; }
    if ((t = e.target.closest('[data-act="resolve"]'))) { e.stopPropagation(); var u = findNode(t.dataset.uid); if (u) R.resolveNodeModal(u); return; }
    if ((t = e.target.closest('[data-act="edit"]'))) { e.stopPropagation(); var ce = findContact(t.dataset.cid); if (ce) R.editContactModal(ce); return; }
    if ((t = e.target.closest('[data-drop]'))) {
      var dk = t.dataset.dk, kind = t.dataset.drop, st = STATES[dk];
      var opts = kind === 'type' ? typeOptions() : (kind === 'network' ? NETWORK_OPTS : SORT_OPTS);
      var cur = kind === 'type' ? st.type : (kind === 'network' ? st.network : st.sort);
      openMenu(t, opts, cur, function (v) { st[kind] = v; renderDir(dk); refreshControls(dk); });
      return;
    }
    if ((t = e.target.closest('[data-toggle-inactive]'))) {
      var dk2 = t.dataset.toggleInactive; STATES[dk2].showInactive = !STATES[dk2].showInactive;
      renderDir(dk2); refreshControls(dk2); return;
    }
    if ((t = e.target.closest('[data-clear]'))) {
      var dk3 = t.dataset.clear; STATES[dk3].q = '';
      var inp = content.querySelector('[data-search="' + dk3 + '"]'); if (inp) inp.value = '';
      t.style.display = 'none'; renderDir(dk3); if (inp) inp.focus(); return;
    }
    if ((t = e.target.closest('[data-act="open"]'))) {
      var co = findContact(t.dataset.cid);
      if (co) { window.location.href = 'Robin Dock - Contact Detail.html#' + co.id; }
      return;
    }
  });

  content.addEventListener('input', function (e) {
    var inp = e.target.closest('[data-search]'); if (!inp) return;
    var dk = inp.dataset.search; STATES[dk].q = inp.value;
    var clr = content.querySelector('[data-clear="' + dk + '"]'); if (clr) clr.style.display = inp.value ? '' : 'none';
    renderDir(dk);
  });

  /* re-render the toolbar control labels after a filter change */
  function refreshControls(dk) {
    var panel = content.querySelector('.ct-page[data-dk="' + dk + '"] .dir-filters');
    if (panel) panel.outerHTML = filterRow(dk, false);
  }

  /* ============================================================
     SHELL CHROME — collapse + dropdowns + skeleton (from shell)
     ============================================================ */
  var app = document.getElementById('app');
  var COLLAPSE_KEY = 'rd_rail_collapsed';
  if (localStorage.getItem(COLLAPSE_KEY) === '1') app.classList.add('collapsed');
  var rt = document.getElementById('railToggle');
  if (rt) rt.addEventListener('click', function () {
    app.classList.toggle('collapsed');
    localStorage.setItem(COLLAPSE_KEY, app.classList.contains('collapsed') ? '1' : '0');
  });
  var notifPanel = document.getElementById('notifPanel');
  var userPanel = document.getElementById('userPanel');
  function closeMenus(except) {
    if (notifPanel && except !== notifPanel) notifPanel.classList.remove('open');
    if (userPanel && except !== userPanel) userPanel.classList.remove('open');
  }
  var bell = document.getElementById('bellBtn');
  if (bell) bell.addEventListener('click', function (e) {
    e.stopPropagation(); var open = !notifPanel.classList.contains('open'); closeMenus(notifPanel); notifPanel.classList.toggle('open', open);
  });
  var userBtn = document.getElementById('userBtn');
  if (userBtn) userBtn.addEventListener('click', function (e) {
    e.stopPropagation(); var open = !userPanel.classList.contains('open'); closeMenus(userPanel); userPanel.classList.toggle('open', open);
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.bellwrap') && !e.target.closest('.usermenu')) closeMenus(null);
  });

  var skel = document.getElementById('shellSkeleton');
  function hideSkeleton() { if (!skel) return; skel.classList.add('hide'); setTimeout(function () { skel.style.display = 'none'; }, 400); }
  window.addEventListener('load', function () { setTimeout(hideSkeleton, 600); });
  setTimeout(hideSkeleton, 1300);

  window.addEventListener('hashchange', route);
  route();
})();
