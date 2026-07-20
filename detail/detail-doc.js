/* ============================================================
   RobinDock — Document Detail · SOURCE-DOC RENDERER
   Renders each fax page as evidence. Extracted values are wrapped
   in <mark class="dd-src" data-region> so a provenance click on a
   field can reveal exactly where a value came from (B: provenance
   marker → source-region reveal).
   ============================================================ */
window.DD_DOC = (function () {
  'use strict';

  function m(region, text) { return '<mark class="dd-src" data-region="' + region + '">' + text + '</mark>'; }

  function head(org, addr, kicker, fax, page, total) {
    return '<div class="rlhd"><div><div class="rorg">' + org + '</div><div class="raddr">' + addr + '</div></div>' +
      '<div class="rmeta"><div class="rkick">' + kicker + '</div><div>FAX ' + fax + '</div><div>PAGE ' + page + ' / ' + total + '</div></div></div>';
  }
  function rf(k, v) { return '<div class="rf"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>'; }
  function sec(t) { return '<div class="rsec">' + t + '</div>'; }

  /* ---------------- Scenario: referral (+lab attachment) ---------------- */
  var BH_ADDR = '2210 Bear Hollow Dr, Park City, UT 84060<br/>Tel (435) 615-2200 \u00b7 Fax (435) 615-2280';

  function refPage1() {
    return head('Bear Hollow Animal Clinic', BH_ADDR, 'Referral', '(435) 615-2280', 1, 4) +
      '<div class="rtitle">Referral / Consultation Request</div>' +
      '<div class="rdate">To: Mountain West Veterinary Specialists \u00b7 Attn: Surgery \u00b7 Date: ' + m('r-docdate', 'July 2, 2026') + '</div>' +
      sec('Patient information') +
      '<div class="rgrid">' +
        rf('Patient', m('r-patient', 'Biscuit')) +
        rf('Species / breed', m('r-species', 'Canine \u2014 Golden Retriever')) +
        rf('Sex / age', 'MN \u00b7 6 years') +
        rf('Weight', '34.2 kg') +
        rf('Owner', m('r-owner', 'Marta Reyes')) +
        rf('Owner phone', '(435) 649-8821') +
      '</div>' +
      sec('Referring practice') +
      '<div class="rgrid">' +
        rf('Referring veterinarian', m('r-refvet', 'Dr. Alan Voss, DVM')) +
        rf('Practice', m('r-refclinic', 'Bear Hollow Animal Clinic')) +
        rf('Preferred contact', 'Fax \u00b7 (435) 615-2280') +
        rf('Records enclosed', '<span class="rchk on"></span>History <span class="rchk on"></span>Labs <span class="rchk"></span>Imaging') +
      '</div>' +
      sec('Reason for referral') +
      '<p class="rp">' + m('r-reason', 'Progressive right forelimb lameness of 6 weeks\u2019 duration, worsening despite NSAID trial and rest. Suspect elbow dysplasia; radiographs enclosed.') + ' Owner reports reluctance on stairs and after exercise. No prior orthopedic history.</p>' +
      sec('Requested service') +
      '<p class="rp">' + m('r-service', 'Ortho\u2500\u2500 s\u2584rg\u2584\u2584\u2584 c\u2584ns\u2584lt \u2584\u2584\u2584') + ' <em style="color:#9a9db0">(line degraded in transmission)</em></p>' +
      '<div class="rsig"><div class="sline"><div class="scr">A. Voss</div>Referring veterinarian signature</div>' +
      '<div class="sline" style="min-width:110px"><div style="height:17px"></div>Date</div></div>' +
      '<div class="rfoot"><span>BHAC-REF-0702</span><span>Confidential veterinary record</span></div>';
  }

  function refPage2() {
    return head('Bear Hollow Animal Clinic', BH_ADDR, 'History', '(435) 615-2280', 2, 4) +
      '<div class="rtitle">Pertinent Clinical History</div>' +
      '<div class="rdate">Biscuit \u00b7 Reyes \u00b7 Canine, Golden Retriever</div>' +
      sec('Visit summary \u2014 May 19, 2026') +
      '<p class="rp">Presented for intermittent right forelimb lameness, grade 2/5, noted after off-leash exercise. Pain on elbow flexion. Started carprofen 2.2 mg/kg BID \u00d7 14 d; strict rest advised.</p>' +
      sec('Visit summary \u2014 Jun 12, 2026') +
      '<p class="rp">Recheck: lameness now grade 3/5 and consistent. Effusion palpable, decreased ROM right elbow. Radiographs taken (2 views) \u2014 subtle subchondral sclerosis at medial coronoid region. Recommend surgical consult.</p>' +
      sec('Current medications') +
      '<p class="rp">Carprofen 75 mg PO BID \u00b7 Gabapentin 300 mg PO BID PRN \u00b7 Omega-3 supplement</p>' +
      sec('Vaccination status') +
      '<p class="rp">Rabies current through Mar 2028 \u00b7 DHPP current \u00b7 Bordetella Nov 2025</p>' +
      '<div class="rfoot"><span>BHAC-REF-0702</span><span>Page 2 of 4</span></div>';
  }

  function labRows(rows) {
    return rows.map(function (r) {
      var fl = r.flag === 'high' ? '<span class="fl">H \u25b2</span>' : r.flag === 'low' ? '<span class="fl">L \u25bc</span>' : '';
      return '<tr><td>' + r.an + '</td><td class="num">' + r.val + '</td><td>' + r.unit + '</td><td>' + r.rng + '</td><td>' + fl + '</td></tr>';
    }).join('');
  }

  function refPage3() {
    return head('Bear Hollow Animal Clinic', 'In-house laboratory<br/>IDEXX Catalyst One \u00b7 ProCyte Dx', 'Lab report', '(435) 615-2280', 3, 4) +
      '<div class="rtitle">Laboratory Results \u2014 ' + m('r-panel', 'CBC + Chem 17') + '</div>' +
      '<div class="rdate">Collected ' + m('r-collected', 'July 1, 2026') + ' \u00b7 Ordering: ' + m('r-ordvet', 'Dr. Alan Voss, DVM') + '</div>' +
      sec('Patient') +
      '<div class="rgrid">' + rf('Patient', 'Biscuit') + rf('Owner', 'Reyes') + rf('Species', 'Canine') + rf('Specimen', 'Serum / EDTA whole blood') + '</div>' +
      sec('Chemistry') +
      '<table class="rtable"><thead><tr><th>Analyte</th><th class="num">Result</th><th>Units</th><th>Reference</th><th>Flag</th></tr></thead><tbody>' +
      labRows([
        { an: 'ALP', val: '312', unit: 'U/L', rng: '23\u2013212', flag: 'high' },
        { an: 'ALT', val: '118', unit: 'U/L', rng: '10\u2013125', flag: '' },
        { an: 'AST', val: '31', unit: 'U/L', rng: '0\u201350', flag: '' },
        { an: 'BUN', val: '18', unit: 'mg/dL', rng: '7\u201327', flag: '' },
        { an: 'Creatinine', val: '1.1', unit: 'mg/dL', rng: '0.5\u20131.8', flag: '' },
        { an: 'Glucose', val: '94', unit: 'mg/dL', rng: '74\u2013143', flag: '' },
        { an: 'Total protein', val: '6.6', unit: 'g/dL', rng: '5.2\u20138.2', flag: '' }
      ]) + '</tbody></table>' +
      '<p class="rp" style="font-size:10px;color:#6c6f85">Mild ALP elevation \u2014 consistent with chronic NSAID administration; recommend recheck in 4\u20136 weeks.</p>' +
      '<div class="rfoot"><span>ACC 26-18821</span><span>Page 3 of 4</span></div>';
  }

  function refPage4() {
    return head('Bear Hollow Animal Clinic', 'In-house laboratory<br/>IDEXX Catalyst One \u00b7 ProCyte Dx', 'Lab report', '(435) 615-2280', 4, 4) +
      '<div class="rtitle">Laboratory Results \u2014 Hematology</div>' +
      '<div class="rdate">Collected July 1, 2026 \u00b7 Biscuit \u00b7 Reyes</div>' +
      sec('Complete blood count') +
      '<table class="rtable"><thead><tr><th>Analyte</th><th class="num">Result</th><th>Units</th><th>Reference</th><th>Flag</th></tr></thead><tbody>' +
      labRows([
        { an: 'WBC', val: '14.9', unit: 'K/\u00b5L', rng: '5.05\u201316.76', flag: '' },
        { an: 'RBC', val: '6.21', unit: 'M/\u00b5L', rng: '5.65\u20138.87', flag: '' },
        { an: 'HCT', val: '39.1', unit: '%', rng: '37.3\u201361.7', flag: '' },
        { an: 'HGB', val: '14.2', unit: 'g/dL', rng: '13.1\u201320.5', flag: '' },
        { an: 'Platelets', val: '288', unit: 'K/\u00b5L', rng: '148\u2013484', flag: '' },
        { an: 'Neutrophils', val: '10.1', unit: 'K/\u00b5L', rng: '2.95\u201311.64', flag: '' },
        { an: 'Lymphocytes', val: '3.2', unit: 'K/\u00b5L', rng: '1.05\u20135.10', flag: '' }
      ]) + '</tbody></table>' +
      '<div class="rsig"><div class="sline"><div class="scr">P. Ortega</div>Reviewed \u2014 clinical pathology</div></div>' +
      '<div class="rfoot"><span>ACC 26-18821</span><span>End of report</span></div>';
  }

  /* ---------------- Scenario: vaccine cert ---------------- */
  function vaxPage1() {
    return head('Timpanogos Mobile Vet', '480 W 800 N, Provo, UT 84604<br/>Tel (801) 494-1100 \u00b7 Fax (801) 494-1180', 'Certificate', '(801) 494-1180', 1, 1) +
      '<div class="rtitle">Rabies Vaccination Certificate</div>' +
      '<div class="rdate">Certificate No. UT-26-08812 \u00b7 Issued ' + m('r-docdate', 'July 3, 2026') + '</div>' +
      sec('Patient') +
      '<div class="rgrid">' +
        rf('Animal name', m('r-patient', 'Juniper')) +
        rf('Species / breed', m('r-species', 'Canine \u2014 Australian Shepherd')) +
        rf('Sex / age', 'FS \u00b7 3 years') +
        rf('Color / markings', 'Blue merle') +
        rf('Owner', m('r-owner', 'Sam Whitaker')) +
        rf('Owner address', '1120 Alpine Loop Rd, Provo, UT') +
      '</div>' +
      sec('Vaccination') +
      '<div class="rgrid">' +
        rf('Product', m('r-vaccine', 'RABVAC 3 \u2014 Rabies, 3 year')) +
        rf('Lot number', m('r-lot', 'A0412-88C')) +
        rf('Route / site', 'SQ \u00b7 right hind') +
        rf('Date administered', 'July 3, 2026') +
        rf('Expiration / due', m('r-expiry', 'July 3, 2029')) +
        rf('Tag number', 'UT-44810') +
      '</div>' +
      sec('Administering veterinarian') +
      '<p class="rp">' + m('r-advet', 'Dr. Priya Shah, DVM') + ' \u00b7 UT license 10884-2201</p>' +
      '<div class="rsig"><div class="sline"><div class="scr">Priya Shah</div>Veterinarian signature</div>' +
      '<div class="sline" style="min-width:110px"><div style="height:17px"></div>USDA accreditation</div></div>' +
      '<div class="rfoot"><span>UT-26-08812</span><span>Retain for county licensing</span></div>';
  }

  /* ---------------- Scenario: partial / noisy ---------------- */
  function partPage1() {
    return head('\u2588\u2588\u2588\u2588 Veterinary Gr\u2584up', 'Los Angeles, CA \u00b7 sender ID unreadable', 'Unknown', '(213) 555-0177', 1, 2) +
      '<div class="rtitle">Rec\u2584rds Requ\u2584st (?)</div>' +
      '<div class="rdate">Header partially legible \u00b7 skew + banding artifacts</div>' +
      sec('Legible content') +
      '<p class="rp">\u2026requesting c\u2584pies of medical rec\u2584rds for patient <b>\u201cR\u2584cky\u201d</b>, canine, seen at your practice betw\u2584\u2584n 2024\u20132026\u2026</p>' +
      '<p class="rp">\u2026please f\u2584x to the number ab\u2584ve or c\u2584ll to arr\u2584nge\u2026</p>' +
      sec('Degraded region') +
      '<div class="rnoise" style="height:150px"></div>' +
      '<div class="rnoise-cap">~40% of page 1 below legibility threshold</div>' +
      '<div class="rfoot"><span>\u2014</span><span>Page 1 of 2</span></div>';
  }
  function partPage2() {
    return '<div class="rnoise"></div><div class="rnoise-cap">Page 2 \u2014 failed legibility pre-screen (transmission noise) \u00b7 skipped by extraction</div>';
  }

  /* ---------------- page maps ---------------- */
  var PAGES = {
    referral: [
      { render: refPage1, mark: 'ref' },
      { render: refPage2, mark: 'ref' },
      { render: refPage3, mark: 'lab' },
      { render: refPage4, mark: 'lab' }
    ],
    vaccine: [{ render: vaxPage1, mark: 'vax' }],
    partial: [{ render: partPage1, mark: null }, { render: partPage2, mark: null, bad: true }]
  };

  var REGION_PAGE = {
    referral: {
      'r-patient': 0, 'r-species': 0, 'r-owner': 0, 'r-docdate': 0, 'r-refvet': 0, 'r-refclinic': 0,
      'r-reason': 0, 'r-service': 0, 'r-panel': 2, 'r-collected': 2, 'r-ordvet': 2
    },
    vaccine: {
      'r-patient': 0, 'r-species': 0, 'r-owner': 0, 'r-docdate': 0, 'r-vaccine': 0, 'r-lot': 0,
      'r-advet': 0, 'r-expiry': 0
    },
    partial: {}
  };

  return {
    pages: function (scenario) { return PAGES[scenario] || []; },
    renderPage: function (scenario, i) { var p = (PAGES[scenario] || [])[i]; return p ? p.render() : ''; },
    regionPage: function (scenario, region) {
      var mp = REGION_PAGE[scenario] || {}; return (region in mp) ? mp[region] : -1;
    }
  };
})();
