/* ============================================================
   RobinDock — Contacts prototype · DIRECTIONS
   Three distinct roster treatments of the same directory, for
   side-by-side review:
     A · Roster   — system-consistent table (the Clients analog)
     B · Registry — number-first ledger ("who is this number?")
     C · Cards    — grouped by contact type, more visual
   Each renders into a mount node from a shared ctx. Interaction
   is wired by the app via [data-act] delegation.
   ============================================================ */
(function () {
  'use strict';
  var R = window.RDC;
  var TYPE_ORDER = window.RD_TYPE_ORDER;
  var TYPES = window.RD_CONTACT_TYPES;

  /* ---------- shared: "Needs naming" band (unidentified nodes) ---------- */
  function needsNamingBand(unidentified, ctx) {
    if (!unidentified.length) return '';
    var total = unidentified.reduce(function (s, u) { return s + u.docs; }, 0);
    var rows = unidentified.map(function (u) {
      return '<div class="nn-row" data-act="resolve" data-uid="' + u.id + '">' +
        '<span class="nn-ic">' + R.ICON.unknown + '</span>' +
        '<div class="nn-main"><span class="nn-num mono">' + R.highlight(u.number, ctx.state.q) + '</span>' +
          '<span class="nn-sub">' + u.docs + ' document' + (u.docs === 1 ? '' : 's') + ' received' +
            (u.hint ? ' · ' + R.esc(u.hint) : '') + ' · last ' + R.ago(u.last) + '</span></div>' +
        '<button class="btn btn-blue btn-sm nn-btn" data-act="resolve" data-uid="' + u.id + '">' + R.ICON.plus + 'Name</button>' +
      '</div>';
    }).join('');
    return '<div class="needsname">' +
      '<div class="nn-head"><span class="nn-flag">' + R.ICON.unknown + 'Needs naming</span>' +
        '<span class="nn-count">' + unidentified.length + ' unidentified sender' + (unidentified.length === 1 ? '' : 's') +
          ' · ' + total + ' document' + (total === 1 ? '' : 's') + '</span></div>' +
      '<div class="nn-why">Ingress created a node for each of these numbers, but nobody has named them yet. Each is still a real edge — name it to make the relationship trackable.</div>' +
      '<div class="nn-list">' + rows + '</div>' +
    '</div>';
  }

  function emptyState(ctx, kind) {
    var q = (ctx.state.q || '').trim();
    var h, p;
    if (kind === 'empty') {
      h = 'No contacts yet';
      p = 'External parties you exchange documents with appear here. Add your first contact, or they will appear as ingress receives faxes.';
    } else {
      h = 'No matching contacts';
      p = q ? 'Nothing matched “' + R.esc(q) + '”. Try a practice name, a city, or a fax number.'
            : 'No contacts match the current filters.';
    }
    return '<div class="dir-empty"><div class="ico">' + R.ICON.search + '</div><h4>' + h + '</h4><p>' + p + '</p>' +
      (kind === 'empty' ? '<button class="btn btn-blue btn-sm" data-act="add" style="margin-top:14px">' + R.ICON.plus + 'Add contact</button>' : '') + '</div>';
  }

  function countLine(n, ctx) {
    var q = (ctx.state.q || '').trim();
    var bits = [];
    if (ctx.state.type !== 'all') bits.push(R.typeLabel(ctx.state.type));
    if (ctx.state.network !== 'all') bits.push(ctx.state.network === 'on' ? 'on-network' : 'off-network');
    if (q) bits.push('matching “' + R.esc(q) + '”');
    return '<b>' + n + '</b> contact' + (n === 1 ? '' : 's') + (bits.length ? ' · ' + bits.join(' · ') : '');
  }

  /* ============================================================
     A · ROSTER  — table
     ============================================================ */
  function renderRoster(mount, ctx) {
    var rows = R.sortContacts(R.filterContacts(ctx.contacts, ctx.state), ctx.state.sort);
    var band = needsNamingBand(ctx.unidentified, ctx);
    if (!rows.length) { mount.innerHTML = band + '<div class="ctable">' + emptyState(ctx, ctx.contacts.length ? 'noresult' : 'empty') + '</div>'; return; }

    var body = rows.map(function (c) {
      var dim = !c.active ? ' dim' : '';
      var inact = !c.active ? '<span class="inact-tag">Inactive</span>' : '';
      return '<tr class="' + dim.trim() + '" data-act="open" data-cid="' + c.id + '">' +
        '<td><div class="ros-id">' + R.typeTile(c.type) +
          '<div class="ros-meta"><div class="ros-nm">' + R.highlight(c.name, ctx.state.q) + inact + '</div>' +
            '<div class="ros-loc">' + R.ICON.pin + R.highlight(c.location, ctx.state.q) + '</div></div></div></td>' +
        '<td class="col-type">' + R.typeChip(c.type) + '</td>' +
        '<td class="col-chan"><div class="ros-chan">' + R.faxCell(c, ctx.state.q) + R.channelChips(c) + '</div></td>' +
        '<td class="col-net">' + R.networkCell(c.network) + '</td>' +
        '<td class="col-act">' + R.activityCell(c) + '</td>' +
        '<td class="col-edit right"><span class="rowedit" data-act="edit" data-cid="' + c.id + '" title="Edit">' + R.ICON.edit + '</span>' +
          '<span class="rowchev">' + R.ICON.chev + '</span></td>' +
      '</tr>';
    }).join('');

    mount.innerHTML = band +
      '<div class="ctable roster-tbl">' +
        '<table class="ct"><thead><tr>' +
          '<th>Contact · location</th><th class="col-type">Type</th><th class="col-chan">Channels</th>' +
          '<th class="col-net">Network</th><th class="col-act">Exchange activity</th><th class="col-edit"></th>' +
        '</tr></thead><tbody>' + body + '</tbody></table>' +
      '</div>';
  }

  /* ============================================================
     B · REGISTRY  — number-first ledger
     ============================================================ */
  function renderRegistry(mount, ctx) {
    var rows = R.sortContacts(R.filterContacts(ctx.contacts, ctx.state), ctx.state.sort);
    // unidentified nodes belong natively here as "unresolved" numbers,
    // but we also keep the pinned band for consistency across directions.
    var band = needsNamingBand(ctx.unidentified, ctx);
    if (!rows.length) { mount.innerHTML = band + '<div class="registry">' + emptyState(ctx, ctx.contacts.length ? 'noresult' : 'empty') + '</div>'; return; }

    var body = rows.map(function (c) {
      var dim = !c.active ? ' dim' : '';
      var nums = '<span class="rg-num mono">' + R.highlight(c.faxes[0], ctx.state.q) + '</span>';
      if (c.faxes.length > 1) {
        nums += c.faxes.slice(1).map(function (f) {
          return '<span class="rg-num alt mono">' + R.highlight(f, ctx.state.q) + '</span>';
        }).join('');
      }
      var net = c.network === 'on'
        ? '<span class="rg-net on">' + R.ICON.flock + 'On network</span>'
        : '<span class="rg-net off">Off network</span>';
      var act = (!c.active || c.docs30 === 0)
        ? '<span class="rg-act quiet">Quiet · ' + R.ago(c.last) + '</span>'
        : '<span class="rg-act"><b>' + c.docs30 + '</b> docs / 30d · ' + R.ago(c.last) + '</span>';
      return '<div class="rg-row' + dim + '" data-act="open" data-cid="' + c.id + '">' +
        '<div class="rg-left">' + nums + '</div>' +
        '<span class="rg-arrow">→</span>' +
        '<div class="rg-id"><div class="rg-nm">' + R.highlight(c.name, ctx.state.q) +
            (!c.active ? '<span class="inact-tag">Inactive</span>' : '') + '</div>' +
          '<div class="rg-line">' + R.typeChip(c.type) + '<span class="rg-loc">' + R.ICON.pin + R.highlight(c.location, ctx.state.q) + '</span></div></div>' +
        '<div class="rg-meta">' + net + act + '</div>' +
        '<span class="rowedit" data-act="edit" data-cid="' + c.id + '" title="Edit">' + R.ICON.edit + '</span>' +
      '</div>';
    }).join('');

    mount.innerHTML = band +
      '<div class="registry">' +
        '<div class="rg-cap"><span class="mono">DIRECTORY</span> · resolved by number — search a fax to find who it is</div>' +
        body +
      '</div>';
  }

  /* ============================================================
     C · CARDS  — grouped by type
     ============================================================ */
  function renderCards(mount, ctx) {
    var rows = R.filterContacts(ctx.contacts, ctx.state);
    var band = needsNamingBand(ctx.unidentified, ctx);
    if (!rows.length) { mount.innerHTML = band + '<div class="cards-wrap">' + emptyState(ctx, ctx.contacts.length ? 'noresult' : 'empty') + '</div>'; return; }

    // group by type, preserve taxonomy order
    var groups = {};
    rows.forEach(function (c) { (groups[c.type] = groups[c.type] || []).push(c); });

    var sections = TYPE_ORDER.filter(function (t) { return groups[t]; }).map(function (t) {
      var list = groups[t].slice().sort(function (a, b) {
        if (ctx.state.sort === 'activity') return R.ts(b.last) - R.ts(a.last);
        return a.name.localeCompare(b.name);
      });
      var cards = list.map(function (c) {
        var bubble = c.network === 'on'
          ? '<span class="cn-bubble on" title="On network">' + R.ICON.flock + '</span>'
          : '';
        var act = (!c.active || c.docs30 === 0)
          ? '<span class="cn-act quiet">Quiet · ' + R.ago(c.last) + '</span>'
          : '<span class="cn-act">' + R.sparkline(c.weeks, 'sm') + '<b>' + c.docs30 + '</b> docs / 30d</span>';
        var faxes = '<span class="cn-fax mono">' + R.ICON.fax + R.highlight(c.faxes[0], ctx.state.q) +
          (c.faxes.length > 1 ? '<span class="faxmore">+' + (c.faxes.length - 1) + '</span>' : '') + '</span>';
        return '<div class="cn-card ' + R.typeCls(c.type) + (!c.active ? ' dim' : '') + '" data-act="open" data-cid="' + c.id + '">' +
          '<span class="cn-bar"></span>' +
          '<div class="cn-top"><div class="cn-nm">' + R.highlight(c.name, ctx.state.q) +
              (!c.active ? '<span class="inact-tag">Inactive</span>' : '') + '</div>' + bubble + '</div>' +
          '<div class="cn-loc">' + R.ICON.pin + R.highlight(c.location, ctx.state.q) + '</div>' +
          faxes +
          '<div class="cn-foot">' + act +
            '<span class="rowedit" data-act="edit" data-cid="' + c.id + '" title="Edit">' + R.ICON.edit + '</span></div>' +
        '</div>';
      }).join('');
      return '<div class="cn-section">' +
        '<div class="cn-shead">' + R.typeChip(t) + '<span class="cn-scount">' + list.length + '</span></div>' +
        '<div class="cn-grid">' + cards + '</div>' +
      '</div>';
    }).join('');

    mount.innerHTML = band + '<div class="cards-wrap">' + sections + '</div>';
  }

  window.RDDIR = {
    roster:   { render: renderRoster,   name: 'Roster',   tag: 'Table',        desc: 'System-consistent table — the Clients-list analog. Scannable rows: name, type, channels, network, activity.' },
    registry: { render: renderRegistry, name: 'Registry', tag: 'Number-first', desc: 'Leads with the fax number as identity. Built around “who is (801) 555-0142?” — a ledger of numbers resolving to names.' },
    cards:    { render: renderCards,    name: 'Cards',    tag: 'By type',      desc: 'Grouped into sections by contact type. More visual; network status reads as a bubble. Good for browsing by category.' }
  };
  window.RDDIR_ORDER = ['roster', 'registry', 'cards'];
  window.RDDIR_COUNTLINE = countLine;
})();
