/* ============================================================
   RobinDock — Outbound / Sent list prototype · MOCK DATA
   The delivery-tracking log: every document this practice has
   sent and whether it went through. Each row is ONE transmission
   (per-document-crossing) moving through the LOCKED state machine:

       queued → sent → delivered
       (auto-retry ×3 with backoff on failure → terminal failed)
       (terminal fax-fail to an on-network recipient → "Try internal")

   Status is the headline. Delivery confirmation can lag, so a
   "sent · awaiting confirmation" window is modelled honestly.
   "Now" ≈ 2026-06-15 14:32. Mock / prototype only.
   ============================================================ */
(function () {
  'use strict';

  var NOW = '2026-06-15T14:32:00';

  /* document-type metadata (A1 launch set) — calm tinted badges */
  var TYPES = {
    referral: { label: 'Referral',     cls: 'ty-ref' },
    records:  { label: 'Records',      cls: 'ty-rec' },
    recreq:   { label: 'Records req',  cls: 'ty-req' },
    vaccine:  { label: 'Vaccine',      cls: 'ty-vax' },
    cover:    { label: 'Fax cover',    cls: 'ty-cov' },
    lab:      { label: 'Lab',          cls: 'ty-lab' },
    imaging:  { label: 'Imaging',      cls: 'ty-img' }
  };

  /* contact-category → source-square class */
  var SRC = {
    specialty: 'spec', gp: 'gp', er: 'er', lab: 'lab', imaging: 'img', pharmacy: 'other', other: 'other'
  };

  /* ME (sender practice) */
  var PRACTICE = { name: 'Mountain West Veterinary', fax: '(801) 262-5188', dvm: 'Elena Ortiz, DVM' };

  /* builder — r(recipient), d(document) */
  function R(name, type, network, loc, raw) { return { name: name, type: type, network: network, loc: loc || '', raw: raw || null }; }
  function Doc(name, type, pages) { return { name: name, type: type, pages: pages }; }

  /* events: [state, isoTime, note?]  state ∈ queued|sent|delivered|retry|failed|internal */
  var TX = [

    /* 1 · just dispatched — QUEUED (will advance live) */
    {
      id: 'TX-48615', recip: R('Mountain West Veterinary Specialists', 'specialty', 'on', 'Salt Lake City, UT'),
      doc: Doc('Referral letter — left stifle (TPLO)', 'referral', 13),
      status: 'queued', sent: '2026-06-15T14:31:00', settled: null, retry: null,
      caseId: 'C-3061', caseSubject: 'Orthopedic consult — left stifle',
      events: [['queued', '2026-06-15T14:31:00', 'Accepted — awaiting transmission']]
    },

    /* 2 · in-flight — SENT, awaiting delivery confirmation (will advance live) */
    {
      id: 'TX-48604', recip: R('Cottonwood Animal Clinic', 'gp', 'on', 'Murray, UT'),
      doc: Doc('Records transfer — Simba + Nala', 'records', 9),
      status: 'sent', sent: '2026-06-15T14:28:00', settled: null, retry: null,
      caseId: 'C-3160', caseSubject: 'Records transfer — two patients',
      events: [['queued', '2026-06-15T14:27:00'], ['sent', '2026-06-15T14:28:00', 'Handed to Telnyx fax · awaiting confirmation']]
    },

    /* 3 · DELIVERED — the reassuring success */
    {
      id: 'TX-48590', recip: R('Paws & Claws Clinic', 'gp', 'off', 'Sandy, UT'),
      doc: Doc('Records request — Rocky', 'recreq', 1),
      status: 'delivered', sent: '2026-06-15T13:50:00', settled: '2026-06-15T13:52:18', retry: null,
      caseId: 'C-3155', caseSubject: 'Records request — vaccine + visit history',
      events: [['queued', '2026-06-15T13:49:40'], ['sent', '2026-06-15T13:50:00'], ['delivered', '2026-06-15T13:52:18', 'Confirmed received · 1 page']]
    },

    /* 4 · MID-RETRY — auto-handling a transient failure (retry 2 of 3) */
    {
      id: 'TX-48577', recip: R('Valley Veterinary Clinic', 'gp', 'off', 'Sandy, UT'),
      doc: Doc('Fax cover — dental films', 'cover', 4),
      status: 'retrying', sent: '2026-06-15T13:40:00', settled: null, retry: { n: 2, of: 3 },
      caseId: null, caseSubject: null,
      events: [
        ['queued', '2026-06-15T13:39:30'], ['sent', '2026-06-15T13:40:00'],
        ['retry', '2026-06-15T13:52:00', 'Attempt 1 failed (no answer) — backing off'],
        ['retry', '2026-06-15T14:20:00', 'Attempt 2 in progress']
      ]
    },

    /* 5 · FAILED (terminal, after 3 retries) — off-network → retry/resend only */
    {
      id: 'TX-48561', recip: R('Wasatch Veterinary Surgical', 'specialty', 'off', 'Murray, UT'),
      doc: Doc('Surgical referral — Mochi (oral)', 'referral', 5),
      status: 'failed', sent: '2026-06-15T12:10:00', settled: '2026-06-15T12:48:00', retry: { n: 3, of: 3 },
      caseId: 'C-3133', caseSubject: 'Dental referral — fractured carnassial',
      events: [
        ['queued', '2026-06-15T12:09:30'], ['sent', '2026-06-15T12:10:00'],
        ['retry', '2026-06-15T12:22:00', 'Attempt 1 failed (line busy)'],
        ['retry', '2026-06-15T12:35:00', 'Attempt 2 failed (no carrier)'],
        ['retry', '2026-06-15T12:46:00', 'Attempt 3 failed (no carrier)'],
        ['failed', '2026-06-15T12:48:00', 'Terminal failure after 3 attempts — resend to retry']
      ]
    },

    /* 6 · FAILED to an ON-NETWORK recipient → "Try internal" affordance appears */
    {
      id: 'TX-48550', recip: R('Mountain West Animal ER', 'er', 'on', 'Salt Lake City, UT'),
      doc: Doc('ER case summary — Cooper', 'records', 3),
      status: 'failed', sent: '2026-06-15T11:30:00', settled: '2026-06-15T12:05:00', retry: { n: 3, of: 3 }, internalEligible: true,
      caseId: null, caseSubject: null,
      events: [
        ['queued', '2026-06-15T11:29:30'], ['sent', '2026-06-15T11:30:00'],
        ['retry', '2026-06-15T11:42:00', 'Attempt 1 failed (no answer)'],
        ['retry', '2026-06-15T11:55:00', 'Attempt 2 failed (no answer)'],
        ['retry', '2026-06-15T12:03:00', 'Attempt 3 failed (no answer)'],
        ['failed', '2026-06-15T12:05:00', 'Fax failed — recipient is on Robin Dock; try internal delivery']
      ]
    },

    /* 7 · DELIVERED */
    {
      id: 'TX-48533', recip: R('Paws & Claws Clinic', 'gp', 'off', 'Sandy, UT'),
      doc: Doc('Vaccine history — Rocky', 'vaccine', 2),
      status: 'delivered', sent: '2026-06-15T10:15:00', settled: '2026-06-15T10:16:40', retry: null,
      caseId: 'C-2980', caseSubject: 'Vaccine records transfer',
      events: [['queued', '2026-06-15T10:14:40'], ['sent', '2026-06-15T10:15:00'], ['delivered', '2026-06-15T10:16:40', 'Confirmed received · 2 pages']]
    },

    /* 8 · DELIVERED */
    {
      id: 'TX-48520', recip: R('Intermountain Animal Cardiology', 'specialty', 'off', 'Salt Lake City, UT'),
      doc: Doc('Cardiology referral — Coco', 'referral', 2),
      status: 'delivered', sent: '2026-06-15T09:40:00', settled: '2026-06-15T09:43:02', retry: null,
      caseId: 'C-3104', caseSubject: 'Cardiology follow-up — echo report',
      events: [['queued', '2026-06-15T09:39:30'], ['sent', '2026-06-15T09:40:00'], ['delivered', '2026-06-15T09:43:02', 'Confirmed received · 2 pages']]
    },

    /* 9 · SENT but confirmation is SLOW — the honest "sent, not yet confirmed" window */
    {
      id: 'TX-48506', recip: R('IDEXX Reference Laboratories', 'lab', 'on', 'Regional · West'),
      doc: Doc('Records cover — lab order history', 'records', 6),
      status: 'sent', sent: '2026-06-15T09:05:00', settled: null, retry: null, slow: true,
      caseId: null, caseSubject: null,
      events: [['queued', '2026-06-15T09:04:30'], ['sent', '2026-06-15T09:05:00', 'Sent — delivery confirmation delayed by carrier (normal for some lines)']]
    },

    /* 10 · DELIVERED */
    {
      id: 'TX-48491', recip: R('Wasatch Veterinary Imaging', 'imaging', 'on', 'Murray, UT'),
      doc: Doc('Receipt acknowledgement — radiograph series', 'records', 1),
      status: 'delivered', sent: '2026-06-15T08:30:00', settled: '2026-06-15T08:31:12', retry: null,
      caseId: 'C-3120', caseSubject: 'Hip radiograph review',
      events: [['queued', '2026-06-15T08:29:40'], ['sent', '2026-06-15T08:30:00'], ['delivered', '2026-06-15T08:31:12', 'Confirmed received · 1 page']]
    },

    /* 11 · DELIVERED after a MANUAL RESEND (recovered) — yesterday */
    {
      id: 'TX-48455', recip: R('Red Rock Emergency Vet', 'er', 'off', 'St. George, UT'),
      doc: Doc('Records request — transfer of care', 'recreq', 1),
      status: 'delivered', sent: '2026-06-14T16:20:00', settled: '2026-06-14T16:41:00', retry: null, resent: true,
      caseId: null, caseSubject: null,
      events: [
        ['queued', '2026-06-14T16:02:00'], ['sent', '2026-06-14T16:03:00'],
        ['failed', '2026-06-14T16:15:00', 'Terminal failure after 3 attempts'],
        ['sent', '2026-06-14T16:20:00', 'Manual resend by Kai Sandoval'],
        ['delivered', '2026-06-14T16:41:00', 'Confirmed received · 1 page']
      ]
    },

    /* 12 · DELIVERED — yesterday */
    {
      id: 'TX-48430', recip: R('Bark City Veterinary', 'gp', 'off', 'Park City, UT'),
      doc: Doc('Wellness records — Max', 'records', 5),
      status: 'delivered', sent: '2026-06-14T11:10:00', settled: '2026-06-14T11:13:30', retry: null,
      caseId: 'C-3088', caseSubject: 'Annual wellness records transfer',
      events: [['queued', '2026-06-14T11:09:30'], ['sent', '2026-06-14T11:10:00'], ['delivered', '2026-06-14T11:13:30', 'Confirmed received · 5 pages']]
    },

    /* 13 · DELIVERED to an UNRESOLVED raw number — offer to resolve into a Contact */
    {
      id: 'TX-48402', recip: R('(385) 555-0148', 'other', 'off', 'Unrecognized number', '(385) 555-0148'),
      doc: Doc('Records request — transfer of care', 'recreq', 1),
      status: 'delivered', sent: '2026-06-14T09:20:00', settled: '2026-06-14T09:22:10', retry: null, unresolved: true,
      caseId: null, caseSubject: null,
      events: [['queued', '2026-06-14T09:19:40'], ['sent', '2026-06-14T09:20:00'], ['delivered', '2026-06-14T09:22:10', 'Confirmed received · 1 page']]
    }
  ];

  window.RD_OUTBOUND = { NOW: NOW, TYPES: TYPES, SRC: SRC, PRACTICE: PRACTICE, TX: TX };
})();
