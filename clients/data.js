/* ============================================================
   RobinDock — Clients prototype · MOCK DATA
   Client = household/account (NOT a person).
   Patient = animal (flat child). Insurance is PER-PATIENT.
   Signers = account contact fields. Case = comms thread.
   ============================================================ */
(function () {
  'use strict';

  /* helper: build a patient */
  function P(id, name, species, breed, sex, age, insurer, lastCase, openTasks, status) {
    return { id, name, species, breed, sex, age, insurer: insurer || null, lastCase, openTasks: openTasks || 0, status: status || 'active' };
  }
  /* helper: build a case */
  function C(id, subject, patients, status, other, date) {
    return { id, subject, patients, status, other, date };
  }

  const CLIENTS = [
    /* ---- 1 · Smith household A (near-dup #1) — has a Labrador "Bella" ---- */
    {
      id: 'c1', name: 'Smith Household', accountId: 'CL-1009', status: 'active',
      location: 'Provo, UT', address: '218 Maple Ridge Rd, Provo, UT 84604',
      phone: '(801) 555-0142', email: 'daniel.smith@email.com',
      created: '2023-02-11', lastActivity: '2026-05-30',
      signers: {
        primary: { name: 'Daniel Smith', phone: '(801) 555-0142', email: 'daniel.smith@email.com', relationship: 'Account holder' },
        secondary: [{ name: 'Erin Smith', phone: '(801) 555-0143', email: 'erin.smith@email.com', relationship: 'Spouse' }]
      },
      patients: [
        P('c1-p1', 'Bella', 'Canine', 'Labrador Retriever', 'FS', '4y', 'Trupanion', '2026-05-30', 1, 'active'),
        P('c1-p2', 'Max', 'Canine', 'Beagle', 'MN', '7y', null, '2026-04-08', 1, 'active')
      ],
      cases: [
        C('C-3120', 'Hip x-ray review', ['Bella'], 'in progress', 'Wasatch Imaging', '2026-05-30'),
        C('C-3061', 'Orthopedic consult — left stifle', ['Bella'], 'in progress', 'Mountain West Vet Specialists', '2026-05-13'),
        C('C-3088', 'Annual wellness exam', ['Max'], 'complete', 'Mountain West Veterinary', '2026-04-08'),
        C('C-3002', 'Annual wellness exam', ['Bella'], 'complete', 'Mountain West Veterinary', '2026-04-30'),
        C('C-2904', 'Vaccination update — Rabies, DHPP', ['Bella'], 'archived', 'Bark City Veterinary', '2025-03-12')
      ]
    },

    /* ---- 2 · Smith household B (near-dup #2) — different address/signer/patients ---- */
    {
      id: 'c2', name: 'Smith Household', accountId: 'CL-1126', status: 'active',
      location: 'Orem, UT', address: '74 Cottonwood Ln, Orem, UT 84057',
      phone: '(801) 555-0317', email: 'karen.smith@email.com',
      created: '2022-08-19', lastActivity: '2026-05-21',
      signers: {
        primary: { name: 'Karen Smith', phone: '(801) 555-0317', email: 'karen.smith@email.com', relationship: 'Account holder' },
        secondary: []
      },
      patients: [
        P('c2-p1', 'Rocky', 'Canine', 'Boxer', 'MN', '5y', 'Nationwide', '2026-05-21', 0, 'active'),
        P('c2-p2', 'Daisy', 'Feline', 'Domestic Shorthair', 'FS', '9y', null, '2026-03-14', 0, 'active'),
        P('c2-p3', 'Luna', 'Feline', 'Ragdoll', 'FS', '3y', 'Trupanion', '2026-02-28', 0, 'active'),
        P('c2-p4', 'Cosmo', 'Canine', 'Vizsla', 'MN', '6y', null, '2025-12-10', 0, 'active'),
        P('c2-p5', 'Pepper', 'Feline', 'Bengal', 'FS', '2y', null, '2025-11-02', 0, 'active')
      ],
      cases: [
        C('C-2980', 'Vaccine records transfer', ['Rocky'], 'complete', 'Paws & Claws Clinic', '2026-05-21')
      ]
    },

    /* ---- 3 · Nguyen — the OTHER "Bella" (a Poodle), single patient ---- */
    {
      id: 'c3', name: 'Nguyen Household', accountId: 'CL-1204', status: 'active',
      location: 'Lehi, UT', address: '1190 Silverleaf Way, Lehi, UT 84043',
      phone: '(385) 555-0461', email: 'linh.nguyen@email.com',
      created: '2024-09-03', lastActivity: '2026-06-01',
      signers: {
        primary: { name: 'Linh Nguyen', phone: '(385) 555-0461', email: 'linh.nguyen@email.com', relationship: 'Account holder' },
        secondary: []
      },
      patients: [
        P('c3-p1', 'Bella', 'Canine', 'Standard Poodle', 'MN', '2y', null, '2026-06-01', 2, 'active')
      ],
      cases: [
        C('C-3142', 'Spay surgery pre-op labs', ['Bella'], 'open', 'Mountain West Veterinary', '2026-06-01')
      ]
    },

    /* ---- 4 · Alvarez — SHOWCASE household (4 patients, mixed insurance, 1 deceased, 5 cases) ---- */
    {
      id: 'c4', name: 'Alvarez Household', accountId: 'CL-1042', status: 'active',
      location: 'Sandy, UT', address: '4821 Creekside Dr, Sandy, UT 84094',
      phone: '(801) 555-0188', email: 'marco.alvarez@email.com',
      created: '2021-06-14', lastActivity: '2026-05-28',
      signers: {
        primary: { name: 'Marco Alvarez', phone: '(801) 555-0188', email: 'marco.alvarez@email.com', relationship: 'Account holder' },
        secondary: [
          { name: 'Renata Alvarez', phone: '(801) 555-0190', email: 'renata.a@email.com', relationship: 'Spouse' },
          { name: 'Diego Alvarez', phone: '(801) 555-0191', email: 'diego.a@email.com', relationship: 'Authorized contact' }
        ]
      },
      patients: [
        P('c4-p1', 'Coco', 'Canine', 'Miniature Poodle', 'FS', '5y', 'Trupanion', '2026-05-28', 2, 'active'),
        P('c4-p2', 'Mango', 'Feline', 'Maine Coon', 'MN', '3y', null, '2026-05-12', 1, 'active'),
        P('c4-p3', 'Kiwi', 'Avian', 'African Grey Parrot', 'F', '7y', 'Nationwide', '2026-03-02', 0, 'active'),
        P('c4-p4', 'Olive', 'Canine', 'Labrador Retriever', 'FS', '13y', null, '2025-11-20', 0, 'deceased')
      ],
      cases: [
        C('C-2041', 'Dental cleaning follow-up', ['Coco'], 'in progress', 'Sandy Animal Dental', '2026-05-28'),
        C('C-2033', 'Allergy panel results', ['Mango'], 'open', 'Antech Diagnostics', '2026-05-12'),
        C('C-2027', 'Multi-pet wellness visit', ['Coco', 'Mango'], 'complete', 'Mountain West Veterinary', '2026-04-30'),
        C('C-2009', 'Wing trim referral', ['Kiwi'], 'complete', 'Avian Specialists of Utah', '2026-03-02'),
        C('C-1988', 'End-of-life care', ['Olive'], 'archived', 'Mountain West Veterinary', '2025-11-20')
      ]
    },

    /* ---- 5 · Okafor — NEW account, 0 patients, 0 cases (empty states on detail) ---- */
    {
      id: 'c5', name: 'Okafor Household', accountId: 'CL-1310', status: 'active',
      location: 'Draper, UT', address: '903 Highland Park Cir, Draper, UT 84020',
      phone: '(385) 555-0727', email: 'ada.okafor@email.com',
      created: '2026-05-29', lastActivity: '2026-05-29',
      signers: {
        primary: { name: 'Ada Okafor', phone: '(385) 555-0727', email: 'ada.okafor@email.com', relationship: 'Account holder' },
        secondary: []
      },
      patients: [],
      cases: []
    },

    /* ---- 6 · Patel ---- */
    {
      id: 'c6', name: 'Patel Household', accountId: 'CL-1078', status: 'active',
      location: 'American Fork, UT', address: '356 Birchwood Ave, American Fork, UT 84003',
      phone: '(801) 555-0512', email: 'riya.patel@email.com',
      created: '2022-01-27', lastActivity: '2026-05-09',
      signers: {
        primary: { name: 'Riya Patel', phone: '(801) 555-0512', email: 'riya.patel@email.com', relationship: 'Account holder' },
        secondary: [{ name: 'Anil Patel', phone: '(801) 555-0513', email: 'anil.patel@email.com', relationship: 'Spouse' }]
      },
      patients: [
        P('c6-p1', 'Simba', 'Feline', 'Abyssinian', 'MN', '4y', 'Trupanion', '2026-05-09', 0, 'active'),
        P('c6-p2', 'Nala', 'Feline', 'Abyssinian', 'FS', '4y', 'Trupanion', '2026-05-09', 0, 'active')
      ],
      cases: [
        C('C-2864', 'Microchip registration', ['Simba'], 'complete', 'Mountain West Veterinary', '2026-05-09'),
        C('C-2851', 'Dietary consult', ['Nala'], 'complete', 'Mountain West Veterinary', '2026-04-22')
      ]
    },

    /* ---- 7 · Johansson ---- */
    {
      id: 'c7', name: 'Johansson Household', accountId: 'CL-1155', status: 'active',
      location: 'Salt Lake City, UT', address: '88 Federal Heights Dr, Salt Lake City, UT 84103',
      phone: '(801) 555-0640', email: 'erik.johansson@email.com',
      created: '2023-11-15', lastActivity: '2026-05-26',
      signers: {
        primary: { name: 'Erik Johansson', phone: '(801) 555-0640', email: 'erik.johansson@email.com', relationship: 'Account holder' },
        secondary: []
      },
      patients: [
        P('c7-p1', 'Thor', 'Canine', 'Bernese Mountain Dog', 'MN', '3y', 'Nationwide', '2026-05-26', 1, 'active')
      ],
      cases: [
        C('C-3050', 'Lameness evaluation', ['Thor'], 'open', 'Wasatch Imaging', '2026-05-26')
      ]
    },

    /* ---- 8 · Brennan ---- */
    {
      id: 'c8', name: 'Brennan Household', accountId: 'CL-1098', status: 'active',
      location: 'Park City, UT', address: '512 Aspen Hollow, Park City, UT 84060',
      phone: '(435) 555-0288', email: 'maeve.brennan@email.com',
      created: '2021-10-08', lastActivity: '2026-04-17',
      signers: {
        primary: { name: 'Maeve Brennan', phone: '(435) 555-0288', email: 'maeve.brennan@email.com', relationship: 'Account holder' },
        secondary: [{ name: 'Sean Brennan', phone: '(435) 555-0289', email: 'sean.brennan@email.com', relationship: 'Spouse' }]
      },
      patients: [
        P('c8-p1', 'Finn', 'Canine', 'Border Collie', 'MN', '6y', 'Trupanion', '2026-04-17', 0, 'active'),
        P('c8-p2', 'Willow', 'Canine', 'Australian Shepherd', 'FS', '4y', 'Trupanion', '2026-03-30', 0, 'active'),
        P('c8-p3', 'Birch', 'Feline', 'Siberian', 'MN', '8y', null, '2025-10-12', 0, 'active')
      ],
      cases: [
        C('C-2790', 'Heartworm prevention refill', ['Finn'], 'complete', 'Mountain West Veterinary', '2026-04-17'),
        C('C-2742', 'Vaccination update', ['Willow'], 'complete', 'Paws & Claws Clinic', '2026-03-30')
      ]
    },

    /* ---- 9 · Delgado — large household, has open tasks ---- */
    {
      id: 'c9', name: 'Delgado Household', accountId: 'CL-1187', status: 'active',
      location: 'Murray, UT', address: '2207 Vine Street, Murray, UT 84107',
      phone: '(801) 555-0934', email: 'sofia.delgado@email.com',
      created: '2020-04-22', lastActivity: '2026-06-02',
      signers: {
        primary: { name: 'Sofia Delgado', phone: '(801) 555-0934', email: 'sofia.delgado@email.com', relationship: 'Account holder' },
        secondary: [{ name: 'Mateo Delgado', phone: '(801) 555-0935', email: 'mateo.delgado@email.com', relationship: 'Authorized contact' }]
      },
      patients: [
        P('c9-p1', 'Pixel', 'Canine', 'Corgi', 'FS', '2y', 'Nationwide', '2026-06-02', 2, 'active'),
        P('c9-p2', 'Mochi', 'Feline', 'Scottish Fold', 'MN', '3y', null, '2026-05-19', 1, 'active'),
        P('c9-p3', 'Biscuit', 'Canine', 'Golden Retriever', 'MN', '9y', 'Trupanion', '2026-04-05', 0, 'active'),
        P('c9-p4', 'Ginger', 'Feline', 'Tabby', 'FS', '11y', null, '2026-02-11', 0, 'active'),
        P('c9-p5', 'Pepper', 'Avian', 'Cockatiel', 'F', '5y', null, '2025-12-20', 0, 'active')
      ],
      cases: [
        C('C-3160', 'Post-op recheck', ['Pixel'], 'in progress', 'Mountain West Veterinary', '2026-06-02'),
        C('C-3101', 'Ear infection treatment', ['Mochi'], 'open', 'Mountain West Veterinary', '2026-05-19'),
        C('C-2998', 'Senior bloodwork panel', ['Biscuit', 'Ginger'], 'complete', 'Antech Diagnostics', '2026-04-05')
      ]
    },

    /* ---- 10 · Carter — ARCHIVED household (de-emphasized in roster) ---- */
    {
      id: 'c10', name: 'Carter Household', accountId: 'CL-0967', status: 'archived',
      location: 'Bountiful, UT', address: '640 Orchard Ave, Bountiful, UT 84010',
      phone: '(801) 555-0205', email: 'james.carter@email.com',
      created: '2019-07-30', lastActivity: '2024-09-14',
      signers: {
        primary: { name: 'James Carter', phone: '(801) 555-0205', email: 'james.carter@email.com', relationship: 'Account holder' },
        secondary: []
      },
      patients: [
        P('c10-p1', 'Duke', 'Canine', 'German Shepherd', 'MN', '10y', null, '2024-09-14', 0, 'active'),
        P('c10-p2', 'Scout', 'Canine', 'Australian Cattle Dog', 'FS', '12y', null, '2023-06-02', 0, 'deceased')
      ],
      cases: [
        C('C-1740', 'Records archive request', ['Duke'], 'archived', 'Bountiful Pet Hospital', '2024-09-14')
      ]
    }
  ];

  /* derived helpers ------------------------------------------------ */
  CLIENTS.forEach(function (c) {
    c.patientCount = c.patients.length;
    c.openTasks = c.patients.reduce(function (n, p) { return n + (p.openTasks || 0); }, 0);
  });

  window.RD_CLIENTS = CLIENTS;
})();
