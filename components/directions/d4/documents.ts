// d4-local vet-document overlay (DR-004d-p). The shared @/lib/designMock is the
// single source of truth and stays UNTOUCHED — this module reads its faxes and
// overlays veterinary document metadata (name, pet patient, source lab/clinic,
// folder, type, tags) so D4 can speak to its real ICP: veterinary clinics. Each
// document borrows its timestamp + page count from a real mock fax (by id), so
// times/counts stay consistent with every other screen. Fully deterministic —
// no Math.random / Date — so static prerender draws identically every time.
import { designMock, type Fax } from '@/lib/designMock';

export interface VetDocument {
  id: string;
  name: string;        // document title, incl. the pet's name
  patient: string;     // the pet
  owner: string;       // the pet's family name (for the detail panel)
  source: string;      // sending lab / clinic / service
  folder: VetFolderName;
  type: string;        // human label: Lab Result, Referral, Imaging, …
  tags: readonly string[];
  pageCount: number;   // from the mock fax
  time: string;        // received time, formatted from the mock fax timestamp
  dateOfService: string; // formatted date, from the mock fax timestamp
  unread?: boolean;
  starred?: boolean;
  needsReview?: boolean;
}

export type VetFolderName =
  | 'Lab Results'
  | 'Referrals'
  | 'Radiology'
  | 'DVM Letters'
  | 'Finance';

/** +12125550144 → "May 29, 2026" / "8:47 AM" helpers. d4-local, deterministic. */
function fmtTime(iso: string): string {
  const [, time] = iso.split('T');
  const [h, min] = time.slice(0, 5).split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${ampm}`;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

function fmtDate(iso: string): string {
  const [date] = iso.split('T');
  const [y, m, d] = date.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function fax(id: string): Fax {
  return designMock.faxes.find((f) => f.id === id)!;
}

// Vet overlay, keyed to real mock faxes for time + page count. The order here is
// the order documents appear in the center inbox list (most recent first).
interface OverlaySeed {
  faxId: string;
  name: string;
  patient: string;
  owner: string;
  source: string;
  folder: VetFolderName;
  type: string;
  tags: readonly string[];
  unread?: boolean;
  starred?: boolean;
  needsReview?: boolean;
}

const SEEDS: readonly OverlaySeed[] = [
  {
    faxId: 'fx-002',
    name: 'CBC Results — Bella',
    patient: 'Bella',
    owner: 'Bella Hartman (Canine)',
    source: 'Antech Diagnostics',
    folder: 'Lab Results',
    type: 'Lab Result',
    tags: ['Hematology', 'Routine'],
    unread: true,
  },
  {
    faxId: 'fx-004',
    name: 'Cardiology Referral — Max',
    patient: 'Max',
    owner: 'Max Delgado (Canine)',
    source: 'Lakeside Veterinary',
    folder: 'Referrals',
    type: 'Referral',
    tags: ['Cardiology', 'Needs review'],
    unread: true,
    needsReview: true,
  },
  {
    faxId: 'fx-006',
    name: 'Radiology Report — Luna',
    patient: 'Luna',
    owner: 'Luna Whitfield (Feline)',
    source: 'Vet Imaging Center',
    folder: 'Radiology',
    type: 'Imaging',
    tags: ['Thorax'],
  },
  {
    faxId: 'fx-011',
    name: 'Histopathology — Daisy',
    patient: 'Daisy',
    owner: 'Daisy Brooks (Canine)',
    source: 'IDEXX Reference Labs',
    folder: 'Lab Results',
    type: 'Lab Result',
    tags: ['Cytology', 'Needs review'],
    needsReview: true,
  },
  {
    faxId: 'fx-009',
    name: 'DVM Letter — Cooper',
    patient: 'Cooper',
    owner: 'Cooper Ramos (Canine)',
    source: 'Cedar Creek Veterinary',
    folder: 'DVM Letters',
    type: 'Letter',
    tags: ['Follow-up'],
    starred: true,
  },
  {
    faxId: 'fx-001',
    name: 'Spay Records — Milo',
    patient: 'Milo',
    owner: 'Milo Hayes (Feline)',
    source: 'Brightwood Animal Care',
    folder: 'Referrals',
    type: 'Records',
    tags: ['Surgical'],
  },
  {
    faxId: 'fx-012',
    name: 'Ultrasound — Sadie',
    patient: 'Sadie',
    owner: 'Sadie Nguyen (Canine)',
    source: 'Vet Imaging Center',
    folder: 'Radiology',
    type: 'Imaging',
    tags: ['Abdomen'],
  },
  {
    faxId: 'fx-007',
    name: 'Vaccine History — Charlie',
    patient: 'Charlie',
    owner: 'Charlie Okafor (Canine)',
    source: 'County Animal Services',
    folder: 'DVM Letters',
    type: 'Records',
    tags: ['Rabies'],
  },
];

export const vetDocuments: readonly VetDocument[] = SEEDS.map((s) => {
  const f = fax(s.faxId);
  return {
    id: f.id,
    name: s.name,
    patient: s.patient,
    owner: s.owner,
    source: s.source,
    folder: s.folder,
    type: s.type,
    tags: s.tags,
    pageCount: f.pageCount,
    time: fmtTime(f.timestamp),
    dateOfService: fmtDate(f.timestamp),
    unread: s.unread,
    starred: s.starred,
    needsReview: s.needsReview,
  };
});

export const needsReviewCount = vetDocuments.filter((d) => d.needsReview).length;
export const starredCount = vetDocuments.filter((d) => d.starred).length;

// Sidebar "Folders" group — counts are deterministic folder totals (a hair above
// the visible docs so the inbox reads like a real, fuller account).
export const inboxFolders: readonly { name: VetFolderName; count: number }[] = [
  { name: 'Lab Results', count: 24 },
  { name: 'Referrals', count: 16 },
  { name: 'Radiology', count: 9 },
  { name: 'DVM Letters', count: 7 },
  { name: 'Finance', count: 5 },
];

// Routing-diagram data: the "new this morning" counts the robin hub has routed.
export const routedFolders: readonly { name: VetFolderName; newCount: number }[] = [
  { name: 'Lab Results', newCount: 12 },
  { name: 'Referrals', newCount: 8 },
  { name: 'Radiology', newCount: 5 },
  { name: 'DVM Letters', newCount: 3 },
];

// Routing-diagram inputs: where a clinic's documents arrive from.
export const inputSources: readonly {
  id: string;
  label: string;
  detail: string;
}[] = [
  { id: 'fax', label: 'Fax', detail: '+1 (415) 555-0182' },
  { id: 'email', label: 'Email', detail: 'records@clinic.vet' },
  { id: 'portal', label: 'Portal Upload', detail: 'Referrals, labs, forms' },
];
