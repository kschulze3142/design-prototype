/* ============================================================
   RobinDock — Contacts (External Directory) prototype · MOCK DATA
   A Contact is an EXTERNAL party Robin Dock exchanges documents
   with — a referring GP, specialty/ER hospital, lab, imaging
   center, pharmacy. NOT a pet-owner household (that's a Client).

   Each Contact is a first-class directory NODE (fax number(s) are
   the primary identifier). Some nodes are auto-created by ingress
   for an unrecognized sender and remain UNIDENTIFIED until a human
   names them (§6) — those live in UNIDENTIFIED below.

   on/off-network ("Flock") status is modeled from day 1 but is
   latent at v1 — informational only (§7).
   Mock data only. "Today" ≈ 2026-06-11.
   ============================================================ */
(function () {
  'use strict';

  /* Contact type taxonomy (§ open item) */
  var TYPES = {
    gp:        { label: 'Referring GP',    short: 'GP',        cls: 'gp'    },
    specialty: { label: 'Specialty',       short: 'Specialty', cls: 'spec'  },
    er:        { label: 'Emergency / ER',  short: 'ER',        cls: 'er'    },
    lab:       { label: 'Lab',             short: 'Lab',       cls: 'lab'   },
    imaging:   { label: 'Imaging',         short: 'Imaging',   cls: 'img'   },
    pharmacy:  { label: 'Pharmacy',        short: 'Pharmacy',  cls: 'pharm' },
    other:     { label: 'Other',           short: 'Other',     cls: 'other' }
  };
  var TYPE_ORDER = ['gp', 'specialty', 'er', 'lab', 'imaging', 'pharmacy', 'other'];

  var _id = 0;
  /* C(name, type, location, faxes[], email, phone, network, active, docs30, lastISO, weeks[])
       network 'on' (also a Robin Dock org) | 'off' (fax/email only) | null (unknown)
       active  false = relationship gone quiet (shown, de-emphasized)
       docs30  documents exchanged in the last 30 days
       weeks   8-week volume (oldest→newest) for the activity sparkline */
  function C(name, type, location, faxes, email, phone, network, active, docs30, lastISO, weeks) {
    return {
      id: 'CT-' + String(++_id).padStart(3, '0'),
      kind: 'contact',
      name: name, type: type, location: location,
      faxes: faxes, email: email || '', phone: phone || '',
      network: network, active: active !== false,
      docs30: docs30, last: lastISO, weeks: weeks || []
    };
  }

  var CONTACTS = [
    /* ---- Referring GP ---- */
    C('Cottonwood Animal Clinic', 'gp', 'Murray, UT', ['(801) 555-0182'], 'records@cottonwoodvet.com', '(801) 555-0180', 'on', true, 34, '2026-06-10', [22, 19, 25, 28, 24, 31, 29, 34]),
    C('Valley Veterinary Clinic', 'gp', 'Sandy, UT', ['(801) 555-0147'], 'frontdesk@valleyvetclinic.com', '(801) 555-0145', 'off', true, 18, '2026-06-09', [12, 15, 11, 14, 16, 13, 17, 18]),
    C('Riverbend Pet Hospital', 'gp', 'Provo, UT', ['(801) 555-0203'], '', '(801) 555-0201', 'off', true, 9, '2026-06-05', [6, 8, 5, 7, 9, 6, 8, 9]),
    C('Foothill Family Veterinary', 'gp', 'Bountiful, UT', ['(385) 555-0119'], 'hello@foothillfamilyvet.com', '(385) 555-0117', 'on', true, 14, '2026-06-08', [9, 11, 8, 12, 10, 13, 11, 14]),
    C('Parkway Animal Hospital', 'gp', 'Orem, UT', ['(801) 555-0164'], '', '(801) 555-0162', 'off', true, 7, '2026-06-03', [5, 6, 4, 7, 5, 6, 7, 7]),
    C('Wasatch Companion Care', 'gp', 'Layton, UT', ['(801) 555-0288'], 'office@wasatchcompanion.com', '(801) 555-0286', 'off', false, 0, '2026-01-22', [4, 3, 2, 1, 0, 0, 0, 0]),

    /* ---- Specialty ---- */
    C('Mountain West Veterinary Specialists', 'specialty', 'Salt Lake City, UT', ['(801) 555-0100'], 'referrals@mwvetspecialists.com', '(801) 555-0101', 'on', true, 41, '2026-06-11', [30, 33, 29, 36, 34, 38, 37, 41]),
    C('Wasatch Veterinary Surgical', 'specialty', 'Murray, UT', ['(801) 555-0211'], 'surgery@wasatchvetsurgical.com', '(801) 555-0210', 'off', true, 16, '2026-06-07', [11, 13, 10, 14, 12, 15, 14, 16]),
    C('Intermountain Animal Cardiology', 'specialty', 'Salt Lake City, UT', ['(801) 555-0176'], '', '(801) 555-0174', 'off', true, 8, '2026-06-04', [5, 6, 7, 5, 8, 6, 7, 8]),
    C('Canyon Oncology for Pets', 'specialty', 'Sandy, UT', ['(385) 555-0142'], 'intake@canyonpetonc.com', '(385) 555-0140', 'off', true, 6, '2026-05-30', [4, 5, 3, 6, 4, 5, 6, 6]),

    /* ---- Emergency / ER ---- */
    C('Mountain West Animal ER', 'er', 'Salt Lake City, UT', ['(801) 555-0911', '(801) 555-0912'], 'records@mwanimaler.com', '(801) 555-0910', 'on', true, 27, '2026-06-11', [19, 22, 18, 24, 21, 25, 23, 27]),
    C('After Hours Veterinary Emergency', 'er', 'Ogden, UT', ['(801) 555-0099'], '', '(801) 555-0097', 'off', true, 11, '2026-06-06', [7, 9, 6, 10, 8, 11, 9, 11]),
    C('Red Rock Emergency Vet', 'er', 'St. George, UT', ['(435) 555-0150'], 'er@redrockvet.com', '(435) 555-0148', 'off', true, 4, '2026-05-28', [3, 2, 4, 3, 5, 2, 4, 4]),

    /* ---- Lab ---- */
    C('IDEXX Reference Laboratories', 'lab', 'Regional · West', ['(888) 555-0123'], 'results@idexx.example', '(888) 555-0120', 'on', true, 96, '2026-06-11', [78, 84, 80, 88, 85, 91, 89, 96]),
    C('Antech Diagnostics', 'lab', 'Regional · West', ['(800) 555-0456'], 'results@antech.example', '(800) 555-0454', 'off', true, 52, '2026-06-11', [40, 44, 41, 47, 45, 49, 48, 52]),
    C('Zoetis Reference Labs', 'lab', 'Regional', ['(855) 555-0178'], '', '(855) 555-0176', 'off', true, 13, '2026-06-07', [9, 10, 8, 11, 10, 12, 11, 13]),
    C('University Veterinary Diagnostic Lab', 'lab', 'Logan, UT', ['(435) 555-0190'], 'uvdl@usu.example', '(435) 555-0188', 'off', true, 5, '2026-06-02', [3, 4, 5, 3, 4, 5, 4, 5]),

    /* ---- Imaging ---- */
    C('Mountain Radiology for Animals', 'imaging', 'Salt Lake City, UT', ['(801) 555-0233'], 'reads@mtnradiologyanimals.com', '(801) 555-0231', 'off', true, 12, '2026-06-08', [8, 9, 7, 10, 9, 11, 10, 12]),
    C('Wasatch Veterinary Imaging', 'imaging', 'Murray, UT', ['(801) 555-0244'], 'mri@wasatchvetimaging.com', '(801) 555-0242', 'on', true, 9, '2026-06-06', [6, 7, 5, 8, 7, 8, 7, 9]),
    C('SoundVet Mobile Ultrasound', 'imaging', 'Mobile · Wasatch Front', ['(385) 555-0267'], '', '(385) 555-0265', 'off', true, 6, '2026-06-01', [4, 5, 3, 6, 4, 5, 5, 6]),

    /* ---- Pharmacy ---- */
    C('Wedgewood Compounding Pharmacy', 'pharmacy', 'Regional', ['(800) 555-0301'], 'rx@wedgewood.example', '(800) 555-0300', 'off', true, 23, '2026-06-10', [16, 18, 15, 20, 18, 21, 20, 23]),
    C('Chewy Pharmacy', 'pharmacy', 'Regional', ['(888) 555-0322'], 'vetrx@chewy.example', '(888) 555-0320', 'off', true, 10, '2026-06-05', [7, 8, 6, 9, 8, 9, 9, 10]),
    C('Roadrunner Compounding Pharmacy', 'pharmacy', 'Regional', ['(877) 555-0333'], '', '(877) 555-0331', 'off', false, 0, '2026-02-14', [3, 2, 1, 1, 0, 0, 0, 0]),

    /* ---- Other ---- */
    C('Utah Veterinary Medical Association', 'other', 'Murray, UT', ['(801) 555-0400'], 'admin@uvma.example', '(801) 555-0398', 'off', true, 2, '2026-05-20', [1, 0, 1, 0, 1, 1, 0, 2]),
    C('Pet Cremation Services of Utah', 'other', 'Salt Lake City, UT', ['(801) 555-0411'], 'care@petcremationut.example', '(801) 555-0409', 'off', true, 3, '2026-06-02', [2, 1, 3, 2, 1, 2, 2, 3]),
    C('Mountain West Pet Blood Bank', 'other', 'Salt Lake City, UT', ['(801) 555-0422'], '', '(801) 555-0420', 'off', true, 1, '2026-05-26', [0, 1, 0, 1, 0, 1, 0, 1])
  ];

  var _uid = 0;
  /* U(number, docsReceived, firstISO, lastISO, channelHint)
     An UNCLAIMED node auto-created by ingress for an unrecognized
     sender. No name yet — a human resolves it into a Contact (§6).
     This is the same resolution offered at triage. */
  function U(number, docs, firstISO, lastISO, hint) {
    return {
      id: 'UN-' + String(++_uid).padStart(3, '0'),
      kind: 'unidentified',
      number: number, docs: docs,
      first: firstISO, last: lastISO, hint: hint || ''
    };
  }

  var UNIDENTIFIED = [
    U('(385) 555-0521', 5, '2026-05-29', '2026-06-11', 'Referral cover sheets'),
    U('(801) 555-0142', 3, '2026-06-02', '2026-06-10', 'Lab-style results'),
    U('(801) 555-0267', 2, '2026-06-04', '2026-06-09', ''),
    U('(435) 555-0388', 1, '2026-06-08', '2026-06-08', 'Single fax')
  ];

  window.RD_CONTACTS = CONTACTS;
  window.RD_UNIDENTIFIED = UNIDENTIFIED;
  window.RD_CONTACT_TYPES = TYPES;
  window.RD_TYPE_ORDER = TYPE_ORDER;
})();
