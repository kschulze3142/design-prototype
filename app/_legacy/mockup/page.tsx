'use client';

import React, { useState, useMemo } from 'react';
import { FileText, Check, X, AlertCircle, Search, Bell, ChevronRight, Edit2, Clock, ArrowRight, Inbox, Send, FileCheck, AlertTriangle, ChevronDown, MapPin, Phone, Mail, User } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────
// Sample data — two cases (home health + DME) to demonstrate the workspace
// handles both verticals through the same UI.
// ──────────────────────────────────────────────────────────────────────────

const initialCases = {
  'CASE-2451': {
    id: 'CASE-2451',
    workflow: 'Home Health Intake',
    documentType: 'New Referral',
    classification: { value: 'New Home Health Referral', confidence: 0.94 },
    source: { name: 'St. Mary\'s Medical Center', faxNumber: '+1 (555) 412-9080', type: 'Hospital — Discharge Planning' },
    receivedAt: 'Today, 9:42 AM',
    sla: { dueIn: '38h 12m', state: 'on_track' },
    priority: 'High',
    queue: 'New Referrals',
    docPages: 4,
    extractedFields: [
      { key: 'patient_name', label: 'Patient name', value: 'Margaret E. Holloway', confidence: 0.98, critical: true, page: 1 },
      { key: 'dob', label: 'Date of birth', value: '1948-03-14', confidence: 0.96, critical: true, page: 1 },
      { key: 'insurance', label: 'Insurance', value: 'Medicare Part A — 4XG9-K2L-A8', confidence: 0.91, critical: true, page: 1 },
      { key: 'primary_dx', label: 'Primary diagnosis', value: 'CHF exacerbation (I50.23)', confidence: 0.78, critical: true, page: 2, needsReview: true },
      { key: 'ordering_md', label: 'Ordering physician', value: 'Dr. James Reyes, MD', confidence: 0.95, critical: false, page: 2 },
      { key: 'npi', label: 'Physician NPI', value: '1457823109', confidence: 0.99, critical: false, page: 2 },
      { key: 'f2f_date', label: 'F2F encounter date', value: '2026-05-21', confidence: 0.88, critical: true, page: 3 },
      { key: 'soc_requested', label: 'Requested SOC', value: '2026-05-26', confidence: 0.93, critical: false, page: 1 },
    ],
    patientCandidates: [
      {
        id: 'pt-001',
        rank: 1,
        confidence: 0.94,
        name: 'Margaret E. Holloway',
        dob: '1948-03-14',
        insurance: 'Medicare Part A — 4XG9-K2L-A8',
        address: '2847 Linden St, Hartford CT',
        matchReasons: ['Exact DOB', 'Exact name match', 'Insurance ID match'],
        lastCase: 'Recert completed Jan 2026',
      },
      {
        id: 'pt-002',
        rank: 2,
        confidence: 0.42,
        name: 'Margaret Holloway-Briggs',
        dob: '1948-03-14',
        insurance: 'Aetna PPO — 88-441-K',
        address: '14 Oakhurst Pl, West Hartford CT',
        matchReasons: ['Exact DOB', 'Partial name match'],
        lastCase: null,
      },
    ],
    referralSourceMatch: { type: 'auto_linked', confidence: 0.98, name: 'St. Mary\'s Medical Center' },
    gates: [
      { key: 'f2f_present', label: 'F2F note present', status: 'pass' },
      { key: 'f2f_recent', label: 'F2F within 90 days', status: 'pass' },
      { key: 'npi_verified', label: 'Physician NPI verified', status: 'pass' },
      { key: 'dx_documented', label: 'Primary diagnosis documented', status: 'warning', note: 'Needs human verification (78% confidence)' },
      { key: 'insurance_verified', label: 'Insurance verified', status: 'pending', note: 'Eligibility check queued' },
      { key: 'poc_in_scope', label: 'Plan of care within scope', status: 'pass' },
      { key: 'signature_present', label: 'Physician signature present', status: 'pass' },
    ],
    outboundDrafts: [
      {
        id: 'ob-1',
        channel: 'fax',
        recipient: 'St. Mary\'s Medical Center — Discharge Planning',
        recipientNumber: '+1 (555) 412-9080',
        subject: 'Referral received — confirmation pending eligibility',
        preview: 'Dear St. Mary\'s discharge team,\n\nWe have received the referral for Margaret E. Holloway (DOB 03/14/1948). Eligibility verification is in progress; we anticipate admit confirmation within 24 hours.\n\nThank you,\nFaxGrid Intake',
        template: 'Acknowledgment with eligibility pending',
      }
    ],
    timeline: [
      { id: 1, type: 'system', label: 'Fax received via Telnyx', time: '9:42:18 AM', detail: '4 pages from +1 (555) 412-9080' },
      { id: 2, type: 'system', label: 'OCR completed', time: '9:42:31 AM', detail: 'Textract — 4 pages processed' },
      { id: 3, type: 'system', label: 'Classified as New Home Health Referral', time: '9:42:42 AM', detail: 'Confidence 94%' },
      { id: 4, type: 'system', label: 'Extraction completed', time: '9:42:58 AM', detail: '14 of 14 fields captured, 1 below threshold' },
      { id: 5, type: 'system', label: 'Patient candidates identified', time: '9:43:02 AM', detail: '2 candidates ranked' },
      { id: 6, type: 'system', label: 'Referral source auto-linked', time: '9:43:03 AM', detail: 'St. Mary\'s Medical Center (98% confidence)' },
      { id: 7, type: 'system', label: 'Gates evaluated', time: '9:43:08 AM', detail: '6 pass, 1 warning, 1 pending' },
      { id: 8, type: 'system', label: 'Placed in New Referrals queue', time: '9:43:09 AM', detail: 'Workflow: Home Health Intake' },
      { id: 9, type: 'system', label: 'Outbound acknowledgment drafted', time: '9:43:11 AM', detail: 'Awaiting approval' },
    ],
    pendingConfirmations: [
      { id: 'pc-1', type: 'patient_assignment', label: 'Confirm patient identity', status: 'pending', detail: '2 candidates found' },
      { id: 'pc-2', type: 'critical_field', label: 'Verify primary diagnosis', status: 'pending', detail: '78% confidence — below threshold', fieldKey: 'primary_dx' },
      { id: 'pc-3', type: 'outbound', label: 'Approve acknowledgment fax-back', status: 'pending', detail: 'Drafted for St. Mary\'s' },
    ],
  },
  'CASE-2452': {
    id: 'CASE-2452',
    workflow: 'DME Orders',
    documentType: 'New Order',
    classification: { value: 'DME New Order (SWO)', confidence: 0.91 },
    source: { name: 'Hartford Pulmonary Associates', faxNumber: '+1 (555) 778-2210', type: 'Physician Practice' },
    receivedAt: 'Today, 10:15 AM',
    sla: { dueIn: '23h 47m', state: 'on_track' },
    priority: 'Normal',
    queue: 'New Orders',
    docPages: 2,
    extractedFields: [
      { key: 'patient_name', label: 'Patient name', value: 'Thomas A. Vega', confidence: 0.99, critical: true, page: 1 },
      { key: 'dob', label: 'Date of birth', value: '1956-08-02', confidence: 0.98, critical: true, page: 1 },
      { key: 'insurance', label: 'Insurance', value: 'Medicare Part B — 9K2-T48-X1', confidence: 0.94, critical: true, page: 1 },
      { key: 'hcpcs', label: 'HCPCS code', value: 'E0601 — CPAP device', confidence: 0.97, critical: true, page: 1 },
      { key: 'rental_purchase', label: 'Rental / Purchase', value: 'Rental (capped)', confidence: 0.92, critical: true, page: 1 },
      { key: 'ordering_md', label: 'Ordering physician', value: 'Dr. Aisha Patel, MD', confidence: 0.96, critical: false, page: 1 },
      { key: 'npi', label: 'Physician NPI', value: '1882144607', confidence: 0.99, critical: false, page: 1 },
      { key: 'medical_necessity', label: 'Medical necessity documented', value: 'Yes — sleep study attached', confidence: 0.86, critical: true, page: 2 },
    ],
    patientCandidates: [
      {
        id: 'pt-101',
        rank: 1,
        confidence: 0.32,
        name: 'Thomas Vega-Castillo',
        dob: '1956-08-02',
        insurance: 'BCBS PPO',
        address: '991 Asylum Ave, Hartford CT',
        matchReasons: ['Exact DOB', 'Partial name match'],
        lastCase: null,
      },
    ],
    referralSourceMatch: { type: 'pending_confirmation', confidence: 0.71, name: 'Hartford Pulmonary Associates' },
    gates: [
      { key: 'swo_present', label: 'SWO present', status: 'pass' },
      { key: 'hcpcs_valid', label: 'HCPCS code valid', status: 'pass' },
      { key: 'medical_necessity', label: 'Medical necessity documented', status: 'pass' },
      { key: 'prior_auth', label: 'Prior authorization status', status: 'fail', note: 'No prior auth on file — required for this HCPCS' },
      { key: 'sleep_study', label: 'Sleep study attached', status: 'pass' },
    ],
    outboundDrafts: [
      {
        id: 'ob-2',
        channel: 'fax',
        recipient: 'Hartford Pulmonary Associates',
        recipientNumber: '+1 (555) 778-2210',
        subject: 'Prior auth required — request for submission',
        preview: 'Dear Dr. Patel\'s office,\n\nWe received the CPAP order for Thomas A. Vega (DOB 08/02/1956). To proceed, we need a copy of the prior authorization from Medicare. Please submit at your earliest convenience.\n\nThank you,\nFaxGrid Intake',
        template: 'Prior auth request',
      }
    ],
    timeline: [
      { id: 1, type: 'system', label: 'Fax received via Telnyx', time: '10:15:02 AM', detail: '2 pages from +1 (555) 778-2210' },
      { id: 2, type: 'system', label: 'OCR completed', time: '10:15:14 AM', detail: 'Textract — 2 pages processed' },
      { id: 3, type: 'system', label: 'Classified as DME New Order', time: '10:15:21 AM', detail: 'Confidence 91%' },
      { id: 4, type: 'system', label: 'Extraction completed', time: '10:15:33 AM', detail: '8 of 8 fields captured' },
      { id: 5, type: 'system', label: 'Patient candidates identified', time: '10:15:34 AM', detail: '1 weak candidate (32%)' },
      { id: 6, type: 'system', label: 'Gates evaluated', time: '10:15:38 AM', detail: '4 pass, 1 fail (prior auth)' },
      { id: 7, type: 'system', label: 'Placed in New Orders queue', time: '10:15:39 AM', detail: 'Workflow: DME Orders' },
      { id: 8, type: 'system', label: 'Prior auth request drafted', time: '10:15:41 AM', detail: 'Awaiting approval' },
    ],
    pendingConfirmations: [
      { id: 'pc-1', type: 'patient_assignment', label: 'Confirm or create patient', status: 'pending', detail: 'Only 1 weak match (32%)' },
      { id: 'pc-2', type: 'source_attribution', label: 'Confirm referral source', status: 'pending', detail: '71% match — needs confirmation' },
      { id: 'pc-3', type: 'gate_resolution', label: 'Address missing prior auth', status: 'pending', detail: 'Request drafted to ordering MD' },
      { id: 'pc-4', type: 'outbound', label: 'Approve prior auth request fax', status: 'pending', detail: 'Drafted for Hartford Pulmonary' },
    ],
  },
};

const queueData = [
  { id: 'home_health', label: 'Home Health Intake', queues: [
    { key: 'triage', label: 'Triage', count: 3 },
    { key: 'new_referrals', label: 'New Referrals', count: 12, active: true },
    { key: 'in_progress', label: 'In Progress', count: 8 },
    { key: 'awaiting_docs', label: 'Awaiting Documents', count: 5 },
    { key: 'ready_decision', label: 'Ready for Decision', count: 2 },
    { key: 'resolved', label: 'Resolved (today)', count: 14 },
  ]},
  { id: 'dme', label: 'DME Orders', queues: [
    { key: 'triage_dme', label: 'Triage', count: 1 },
    { key: 'new_orders', label: 'New Orders', count: 6 },
    { key: 'awaiting_pa', label: 'Awaiting Prior Auth', count: 4 },
    { key: 'ready_delivery', label: 'Ready for Delivery', count: 3 },
  ]},
];

const queueCases = [
  { id: 'CASE-2451', patient: 'Margaret E. Holloway', source: 'St. Mary\'s Medical Center', received: '9:42 AM', sla: '38h', priority: 'high', confirmationCount: 3, type: 'New Referral' },
  { id: 'CASE-2449', patient: 'Robert Sinclair', source: 'Hartford Hospital', received: '8:31 AM', sla: '36h', priority: 'normal', confirmationCount: 1, type: 'New Referral' },
  { id: 'CASE-2447', patient: 'Eleanor Ng', source: 'St. Francis Hospital', received: '8:12 AM', sla: '35h', priority: 'normal', confirmationCount: 2, type: 'New Referral' },
  { id: 'CASE-2444', patient: 'James O\'Connor', source: 'Manchester Memorial', received: '7:48 AM', sla: '34h', priority: 'urgent', confirmationCount: 4, type: 'New Referral' },
  { id: 'CASE-2441', patient: 'Patricia Hwang', source: 'St. Mary\'s Medical Center', received: 'Yesterday', sla: '14h', priority: 'high', confirmationCount: 2, type: 'New Referral' },
  { id: 'CASE-2452', patient: 'Thomas A. Vega', source: 'Hartford Pulmonary Associates', received: '10:15 AM', sla: '23h', priority: 'normal', confirmationCount: 4, type: 'New Order', workflow: 'dme' },
];

// ──────────────────────────────────────────────────────────────────────────
// Atomic UI bits
// ──────────────────────────────────────────────────────────────────────────

const ConfidenceBar = ({ value }) => {
  const pct = Math.round(value * 100);
  let color = 'bg-emerald-400';
  if (value < 0.85) color = 'bg-amber-400';
  if (value < 0.7) color = 'bg-rose-400';
  return (
    <div className="flex items-center gap-2 min-w-[64px]">
      <div className="flex-1 h-1 bg-stone-700/60 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] tabular-nums text-stone-400 font-medium">{pct}%</span>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    high:   'bg-amber-500/15 text-amber-300 border-amber-500/30',
    High:   'bg-amber-500/15 text-amber-300 border-amber-500/30',
    normal: 'bg-stone-600/30 text-stone-300 border-stone-600/40',
    Normal: 'bg-stone-600/30 text-stone-300 border-stone-600/40',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${styles[priority] || styles.normal}`}>
      {priority}
    </span>
  );
};

const GateIcon = ({ status }) => {
  if (status === 'pass') return <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-emerald-400" /></div>;
  if (status === 'warning') return <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center"><AlertTriangle className="w-2.5 h-2.5 text-amber-400" /></div>;
  if (status === 'fail') return <div className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center"><X className="w-2.5 h-2.5 text-rose-400" /></div>;
  return <div className="w-4 h-4 rounded-full bg-stone-600/30 flex items-center justify-center"><Clock className="w-2.5 h-2.5 text-stone-400" /></div>;
};

// ──────────────────────────────────────────────────────────────────────────
// Faux document preview — a stylized fax rendering so the mockup feels real
// without needing a PDF. Adapts content per case.
// ──────────────────────────────────────────────────────────────────────────

const DocumentPreview = ({ caseData, page, onPageChange, highlightField }) => {
  const isHomeHealth = caseData.id === 'CASE-2451';

  return (
    <div className="h-full flex flex-col bg-stone-900/40">
      {/* Doc toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-800/60">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <FileText className="w-3.5 h-3.5" />
          <span>Original fax — {caseData.docPages} pages</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: caseData.docPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-6 h-6 text-[10px] rounded transition-colors ${
                p === page
                  ? 'bg-stone-700 text-stone-100'
                  : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/60'
              }`}
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Doc page */}
      <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
        <div className="w-full max-w-md bg-stone-100 text-stone-900 shadow-2xl shadow-black/50 aspect-[8.5/11] p-8 font-mono text-[10px] leading-relaxed relative">
          {/* Fax header band */}
          <div className="border-b-2 border-stone-900 pb-2 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-xs">{caseData.source.name.toUpperCase()}</div>
                <div className="text-[9px] text-stone-600">{caseData.source.type}</div>
              </div>
              <div className="text-right text-[9px]">
                <div>FAX</div>
                <div>Page {page} of {caseData.docPages}</div>
              </div>
            </div>
          </div>

          {isHomeHealth ? (
            <HomeHealthFaxPage page={page} highlightField={highlightField} />
          ) : (
            <DMEFaxPage page={page} highlightField={highlightField} />
          )}
        </div>
      </div>
    </div>
  );
};

const FieldMark = ({ children, highlight }) => (
  <span className={`px-1 rounded transition-colors duration-300 ${highlight ? 'bg-amber-300/80 ring-2 ring-amber-500' : ''}`}>{children}</span>
);

const HomeHealthFaxPage = ({ page, highlightField }) => {
  if (page === 1) return (
    <div className="space-y-2">
      <div className="text-center font-bold text-xs mb-3">HOME HEALTH REFERRAL</div>
      <div className="grid grid-cols-2 gap-2 text-[9px]">
        <div><span className="text-stone-600">Patient:</span> <FieldMark highlight={highlightField === 'patient_name'}>Margaret E. Holloway</FieldMark></div>
        <div><span className="text-stone-600">DOB:</span> <FieldMark highlight={highlightField === 'dob'}>03/14/1948</FieldMark></div>
        <div className="col-span-2"><span className="text-stone-600">Address:</span> 2847 Linden St, Hartford CT 06105</div>
        <div className="col-span-2"><span className="text-stone-600">Insurance:</span> <FieldMark highlight={highlightField === 'insurance'}>Medicare Part A — 4XG9-K2L-A8</FieldMark></div>
        <div><span className="text-stone-600">Phone:</span> (860) 555-3392</div>
        <div><span className="text-stone-600">Requested SOC:</span> <FieldMark highlight={highlightField === 'soc_requested'}>05/26/2026</FieldMark></div>
      </div>
      <div className="border-t border-stone-300 mt-3 pt-2">
        <div className="text-[9px] font-bold mb-1">DISCHARGE SUMMARY</div>
        <div className="text-[8px] text-stone-700 leading-relaxed">
          71yo female admitted 5/18/26 for acute CHF exacerbation w/ pulmonary edema.
          Stabilized on IV diuretics, transitioning to oral. Patient ambulatory but
          requires home health services for IV antibiotic completion, weight monitoring,
          medication management, and cardiac assessment...
        </div>
      </div>
      <div className="border-t border-stone-300 mt-3 pt-2 text-[8px]">
        <div className="font-bold">Discharge Planner: Sarah Chen, RN</div>
        <div className="text-stone-600">Direct: (860) 555-3300 ext. 4129</div>
      </div>
    </div>
  );
  if (page === 2) return (
    <div className="space-y-2">
      <div className="text-center font-bold text-xs mb-3">DIAGNOSIS & PHYSICIAN ORDERS</div>
      <div className="space-y-2 text-[9px]">
        <div>
          <span className="text-stone-600">Primary Dx:</span>{' '}
          <FieldMark highlight={highlightField === 'primary_dx'}>CHF exacerbation, acute on chronic (I50.23)</FieldMark>
        </div>
        <div><span className="text-stone-600">Secondary:</span> HTN (I10), CKD Stage 3 (N18.3), T2DM (E11.9)</div>
        <div className="border-t border-stone-300 pt-2 mt-2">
          <div className="font-bold mb-1">ORDERING PHYSICIAN</div>
          <div><FieldMark highlight={highlightField === 'ordering_md'}>James Reyes, MD</FieldMark></div>
          <div><span className="text-stone-600">NPI:</span> <FieldMark highlight={highlightField === 'npi'}>1457823109</FieldMark></div>
          <div className="text-stone-600">Internal Medicine — St. Mary's Medical Group</div>
        </div>
        <div className="border-t border-stone-300 pt-2 mt-2">
          <div className="font-bold mb-1">PLAN OF CARE</div>
          <div className="text-[8px] leading-relaxed">
            SN x 3 weeks for assessment, medication reconciliation, vital monitoring.
            Weight daily AM, report gain &gt;2lb/day. PT eval and treat. OT for ADL training.
            HHA 2x/week for personal care assist.
          </div>
        </div>
      </div>
    </div>
  );
  if (page === 3) return (
    <div className="space-y-2">
      <div className="text-center font-bold text-xs mb-3">FACE-TO-FACE ENCOUNTER NOTE</div>
      <div className="text-[9px] space-y-2">
        <div><span className="text-stone-600">Encounter date:</span> <FieldMark highlight={highlightField === 'f2f_date'}>05/21/2026</FieldMark></div>
        <div><span className="text-stone-600">Provider:</span> James Reyes, MD</div>
        <div className="border-t border-stone-300 pt-2 text-[8px] leading-relaxed">
          Patient seen at bedside on 5/21/26 prior to discharge. Discussed home health needs
          including skilled nursing for IV antibiotic completion, cardiac monitoring, and
          medication management. Patient is homebound due to fatigue, dyspnea on minimal
          exertion, and post-hospitalization deconditioning. Skilled services are reasonable
          and necessary to achieve treatment goals safely in the home environment...
        </div>
        <div className="border-t border-stone-300 pt-2 mt-3 text-[8px]">
          <div>______________________</div>
          <div className="italic">James Reyes, MD — 05/21/2026</div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-2">
      <div className="text-center font-bold text-xs mb-3">MEDICATION LIST</div>
      <div className="text-[9px] space-y-1 leading-relaxed">
        <div>• Furosemide 40mg PO daily</div>
        <div>• Lisinopril 10mg PO daily</div>
        <div>• Metoprolol succinate 50mg PO daily</div>
        <div>• Atorvastatin 40mg PO QHS</div>
        <div>• Metformin 500mg PO BID</div>
        <div>• Potassium chloride 20mEq PO daily</div>
        <div>• Aspirin 81mg PO daily</div>
      </div>
    </div>
  );
};

const DMEFaxPage = ({ page, highlightField }) => {
  if (page === 1) return (
    <div className="space-y-2">
      <div className="text-center font-bold text-xs mb-3">STANDARD WRITTEN ORDER (SWO) — DME</div>
      <div className="grid grid-cols-2 gap-2 text-[9px]">
        <div><span className="text-stone-600">Patient:</span> <FieldMark highlight={highlightField === 'patient_name'}>Thomas A. Vega</FieldMark></div>
        <div><span className="text-stone-600">DOB:</span> <FieldMark highlight={highlightField === 'dob'}>08/02/1956</FieldMark></div>
        <div className="col-span-2"><span className="text-stone-600">Address:</span> 412 Whitney Ave, Hartford CT 06105</div>
        <div className="col-span-2"><span className="text-stone-600">Insurance:</span> <FieldMark highlight={highlightField === 'insurance'}>Medicare Part B — 9K2-T48-X1</FieldMark></div>
      </div>
      <div className="border-t border-stone-300 mt-3 pt-2">
        <div className="text-[9px] font-bold mb-1">EQUIPMENT ORDERED</div>
        <div className="text-[9px] space-y-1">
          <div><span className="text-stone-600">HCPCS:</span> <FieldMark highlight={highlightField === 'hcpcs'}>E0601 — CPAP device, continuous airway pressure</FieldMark></div>
          <div><span className="text-stone-600">Type:</span> <FieldMark highlight={highlightField === 'rental_purchase'}>Rental (capped, 13-month)</FieldMark></div>
          <div><span className="text-stone-600">Pressure setting:</span> 8 cmH₂O</div>
          <div><span className="text-stone-600">Diagnosis:</span> Obstructive sleep apnea (G47.33)</div>
        </div>
      </div>
      <div className="border-t border-stone-300 mt-3 pt-2 text-[9px]">
        <div className="font-bold mb-1">ORDERING PHYSICIAN</div>
        <div><FieldMark highlight={highlightField === 'ordering_md'}>Aisha Patel, MD</FieldMark></div>
        <div><span className="text-stone-600">NPI:</span> <FieldMark highlight={highlightField === 'npi'}>1882144607</FieldMark></div>
        <div className="text-stone-600">Hartford Pulmonary Associates</div>
        <div className="mt-2 text-[8px]">______________________</div>
        <div className="italic text-[8px]">Aisha Patel, MD — 05/22/2026</div>
      </div>
    </div>
  );
  return (
    <div className="space-y-2">
      <div className="text-center font-bold text-xs mb-3">SLEEP STUDY RESULTS</div>
      <div className="text-[9px] space-y-2">
        <div><span className="text-stone-600">Study date:</span> 04/18/2026</div>
        <div><span className="text-stone-600">Type:</span> In-lab polysomnography</div>
        <div className="border-t border-stone-300 pt-2 text-[8px] leading-relaxed">
          AHI: 32.4 events/hour (severe OSA). Lowest SpO₂: 81%. Time below 90% SpO₂: 47 minutes.
          REM-related obstructive events predominant. Recommendation: CPAP titration completed
          successfully at 8 cmH₂O with AHI reduction to 2.1.
        </div>
        <div className="border-t border-stone-300 pt-2 mt-2">
          <div className="font-bold">MEDICAL NECESSITY</div>
          <div className="text-[8px] mt-1"><FieldMark highlight={highlightField === 'medical_necessity'}>Patient meets Medicare criteria for CPAP: AHI ≥ 15 with documented OSA symptoms.</FieldMark></div>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Pending Confirmations panel — the visual hero of the workspace
// ──────────────────────────────────────────────────────────────────────────

const PendingConfirmationsPanel = ({ confirmations, onResolve, onJumpTo }) => {
  const pendingCount = confirmations.filter(c => c.status === 'pending').length;
  const resolvedCount = confirmations.filter(c => c.status === 'resolved').length;
  const total = confirmations.length;

  return (
    <div className="rounded-lg border border-stone-700/70 bg-gradient-to-b from-stone-800/60 to-stone-900/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-700/50 bg-stone-900/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Pending confirmations</div>
            <div className="font-serif text-lg text-stone-100 mt-0.5">
              {pendingCount > 0
                ? <>You have <span className="text-amber-300">{pendingCount}</span> {pendingCount === 1 ? 'item' : 'items'} to confirm</>
                : <>All confirmations resolved</>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-stone-500">Progress</div>
            <div className="font-mono text-sm text-stone-300 mt-0.5">{resolvedCount}/{total}</div>
          </div>
        </div>
        <div className="mt-3 h-1 bg-stone-900/60 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${(resolvedCount/total)*100}%` }} />
        </div>
      </div>

      <div className="divide-y divide-stone-800/50">
        {confirmations.map(c => (
          <button
            key={c.id}
            onClick={() => c.status === 'pending' && onJumpTo(c)}
            disabled={c.status === 'resolved'}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group ${
              c.status === 'resolved' ? 'opacity-50' : 'hover:bg-stone-800/40'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
              c.status === 'resolved'
                ? 'bg-emerald-500/30 border-emerald-500/60'
                : 'border-stone-600 group-hover:border-stone-400'
            }`}>
              {c.status === 'resolved' && <Check className="w-3 h-3 text-emerald-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${c.status === 'resolved' ? 'line-through text-stone-500' : 'text-stone-200'}`}>{c.label}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{c.detail}</div>
            </div>
            {c.status === 'pending' && (
              <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-stone-400 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Extracted fields panel
// ──────────────────────────────────────────────────────────────────────────

const ExtractedFieldsPanel = ({ fields, onFieldHover, onFieldEdit, highlightedField, verifiedFields }) => (
  <div className="rounded-lg border border-stone-800/60 bg-stone-900/30">
    <div className="px-4 py-2.5 border-b border-stone-800/60 flex items-center justify-between">
      <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Extracted fields</div>
      <div className="text-[10px] text-stone-500">{verifiedFields.size}/{fields.length} verified</div>
    </div>
    <div className="divide-y divide-stone-800/40">
      {fields.map(f => (
        <div
          key={f.key}
          onMouseEnter={() => onFieldHover(f.key)}
          onMouseLeave={() => onFieldHover(null)}
          className={`px-4 py-2 transition-colors ${
            highlightedField === f.key ? 'bg-stone-800/40' : 'hover:bg-stone-800/20'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wide text-stone-500">{f.label}</span>
                {f.critical && <span className="text-[9px] text-amber-400/80">●</span>}
                {verifiedFields.has(f.key) && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className={`text-sm mt-0.5 truncate ${f.needsReview && !verifiedFields.has(f.key) ? 'text-amber-200' : 'text-stone-100'}`}>
                {f.value}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">Page {f.page}</div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <ConfidenceBar value={f.confidence} />
              <button
                onClick={() => onFieldEdit(f.key)}
                className="text-stone-500 hover:text-stone-300 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Patient candidates panel
// ──────────────────────────────────────────────────────────────────────────

const PatientPanel = ({ candidates, confirmedPatient, onConfirm, extractedName, extractedDob }) => {
  if (confirmedPatient) {
    const p = candidates.find(c => c.id === confirmedPatient);
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5">
        <div className="px-4 py-2.5 border-b border-emerald-500/20 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-medium">Patient confirmed</div>
        </div>
        <div className="px-4 py-3">
          <div className="font-serif text-base text-stone-100">{p.name}</div>
          <div className="text-xs text-stone-400 mt-1 space-y-0.5">
            <div>DOB: {p.dob}</div>
            <div>{p.insurance}</div>
            <div>{p.address}</div>
            {p.lastCase && <div className="text-emerald-300/80 mt-1.5">{p.lastCase}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-800/60 bg-stone-900/30">
      <div className="px-4 py-2.5 border-b border-stone-800/60">
        <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Patient assignment pending</div>
        <div className="text-xs text-stone-400 mt-0.5">Extracted: <span className="text-stone-200">{extractedName}</span> · DOB <span className="text-stone-200">{extractedDob}</span></div>
      </div>
      <div className="p-2 space-y-2">
        {candidates.map(p => (
          <button
            key={p.id}
            onClick={() => onConfirm(p.id)}
            className={`w-full text-left rounded-md border p-3 transition-all group ${
              p.confidence > 0.85
                ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                : 'border-stone-700/60 bg-stone-800/30 hover:bg-stone-800/60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-stone-500">#{p.rank}</span>
                  <div className="font-medium text-stone-100">{p.name}</div>
                </div>
                <div className="text-[11px] text-stone-400 mt-1 space-y-0.5">
                  <div>DOB {p.dob} · {p.insurance}</div>
                  <div className="text-stone-500">{p.address}</div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.matchReasons.map((r, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-stone-700/50 text-stone-300">{r}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-mono ${p.confidence > 0.85 ? 'text-emerald-300' : 'text-stone-400'}`}>
                  {Math.round(p.confidence*100)}%
                </div>
              </div>
            </div>
          </button>
        ))}
        <button className="w-full text-left rounded-md border border-dashed border-stone-700/60 p-3 hover:bg-stone-800/30 transition-colors">
          <div className="text-xs text-stone-400">＋ Search existing patients or create new</div>
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Gates panel
// ──────────────────────────────────────────────────────────────────────────

const GatesPanel = ({ gates }) => {
  const pass = gates.filter(g => g.status === 'pass').length;
  const fail = gates.filter(g => g.status === 'fail').length;
  const warn = gates.filter(g => g.status === 'warning').length;

  return (
    <div className="rounded-lg border border-stone-800/60 bg-stone-900/30">
      <div className="px-4 py-2.5 border-b border-stone-800/60 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Gates</div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-emerald-400">{pass} pass</span>
          {warn > 0 && <span className="text-amber-400">{warn} warn</span>}
          {fail > 0 && <span className="text-rose-400">{fail} fail</span>}
        </div>
      </div>
      <div className="divide-y divide-stone-800/40">
        {gates.map(g => (
          <div key={g.key} className="px-4 py-2 flex items-start gap-2.5">
            <div className="mt-0.5"><GateIcon status={g.status} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-stone-200">{g.label}</div>
              {g.note && <div className="text-[10px] text-stone-500 mt-0.5">{g.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Outbound drafts panel
// ──────────────────────────────────────────────────────────────────────────

const OutboundPanel = ({ drafts, approvedDrafts, onApprove }) => (
  <div className="rounded-lg border border-stone-800/60 bg-stone-900/30">
    <div className="px-4 py-2.5 border-b border-stone-800/60 flex items-center justify-between">
      <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Outbound drafts</div>
      <div className="text-[10px] text-stone-500">{approvedDrafts.size}/{drafts.length} approved</div>
    </div>
    <div className="p-3 space-y-2">
      {drafts.map(d => {
        const approved = approvedDrafts.has(d.id);
        return (
          <div key={d.id} className={`rounded-md border ${approved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-stone-700/60 bg-stone-800/30'}`}>
            <div className="px-3 py-2 border-b border-stone-700/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-3 h-3 text-stone-500" />
                <span className="text-[10px] uppercase tracking-wide text-stone-400">{d.channel} · {d.template}</span>
              </div>
              {approved && <span className="text-[10px] text-emerald-300 flex items-center gap-1"><Check className="w-3 h-3" />Sent</span>}
            </div>
            <div className="px-3 py-2">
              <div className="text-[11px] text-stone-400 mb-1">To: <span className="text-stone-200">{d.recipient}</span></div>
              <div className="text-[10px] text-stone-500 mb-2">{d.recipientNumber}</div>
              <div className="text-xs text-stone-300 whitespace-pre-line bg-stone-950/40 p-2 rounded font-mono leading-relaxed border border-stone-800/40">
                {d.preview}
              </div>
              {!approved && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onApprove(d.id)} className="flex-1 px-2 py-1.5 rounded text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors">Approve & Send</button>
                  <button className="px-2 py-1.5 rounded text-[11px] bg-stone-700/40 hover:bg-stone-700/60 text-stone-300 border border-stone-700/40 transition-colors">Edit</button>
                  <button className="px-2 py-1.5 rounded text-[11px] text-stone-500 hover:text-stone-300 transition-colors">Reject</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Decision panel
// ──────────────────────────────────────────────────────────────────────────

const DecisionPanel = ({ allResolved, decided, onDecide, gatesPassed }) => {
  if (decided) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="font-serif text-lg text-stone-100">Case admitted</div>
            <div className="text-xs text-stone-400">Handoff to EMR initiated. Referrer confirmation sent.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 transition-all ${
      allResolved && gatesPassed
        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5'
        : 'border-stone-700/60 bg-stone-900/30'
    }`}>
      <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium mb-3">Decision</div>
      {!allResolved ? (
        <div className="text-xs text-stone-400 italic">Complete pending confirmations to enable decision.</div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onDecide('admit')} className="px-3 py-2.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all hover:scale-[1.02] font-medium text-sm">
            Admit
          </button>
          <button onClick={() => onDecide('decline')} className="px-3 py-2.5 rounded-md bg-stone-700/40 hover:bg-stone-700/60 text-stone-300 border border-stone-700/40 transition-colors font-medium text-sm">
            Decline
          </button>
          <button onClick={() => onDecide('escalate')} className="px-3 py-2.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 transition-colors font-medium text-sm">
            Escalate
          </button>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Activity timeline (drawer)
// ──────────────────────────────────────────────────────────────────────────

const TimelineDrawer = ({ timeline, open, onToggle }) => (
  <div className={`border-t border-stone-800/60 bg-stone-950/60 transition-all duration-300 ${open ? 'h-64' : 'h-10'}`}>
    <button onClick={onToggle} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-stone-900/40 transition-colors">
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-stone-500" />
        <span className="text-[11px] uppercase tracking-wider text-stone-400">Activity timeline</span>
        <span className="text-[10px] text-stone-600">{timeline.length} events</span>
      </div>
      <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && (
      <div className="px-4 pb-3 overflow-auto h-[calc(100%-2.5rem)]">
        <div className="space-y-1.5">
          {timeline.slice().reverse().map(e => (
            <div key={e.id} className="flex items-start gap-3 text-[11px] py-1 border-b border-stone-900/60 last:border-0">
              <span className="font-mono text-stone-600 w-20 flex-shrink-0">{e.time}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                e.type === 'system' ? 'bg-stone-800/60 text-stone-400' : 'bg-teal-500/15 text-teal-300'
              }`}>{e.type}</span>
              <div className="flex-1 min-w-0">
                <div className="text-stone-300">{e.label}</div>
                <div className="text-stone-600 text-[10px]">{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Queue view
// ──────────────────────────────────────────────────────────────────────────

const QueueView = ({ onSelectCase }) => (
  <div className="flex-1 overflow-auto">
    <div className="px-8 py-6 border-b border-stone-800/60">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Home Health Intake</div>
          <h1 className="font-serif text-3xl text-stone-100 mt-1">New Referrals</h1>
        </div>
        <div className="flex items-center gap-6 text-xs text-stone-400">
          <div><span className="text-stone-100 font-mono text-base">12</span> open</div>
          <div><span className="text-amber-300 font-mono text-base">3</span> SLA &lt; 24h</div>
          <div><span className="text-emerald-300 font-mono text-base">7</span> processed today</div>
        </div>
      </div>
    </div>
    <div className="px-8 py-4">
      <div className="rounded-lg border border-stone-800/60 bg-stone-900/30 overflow-hidden">
        <div className="px-4 py-2 border-b border-stone-800/60 grid grid-cols-12 gap-3 text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          <div className="col-span-1">Case</div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-3">Source</div>
          <div className="col-span-1">Received</div>
          <div className="col-span-1">SLA</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2 text-right">Confirmations</div>
        </div>
        <div className="divide-y divide-stone-800/40">
          {queueCases.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className="w-full px-4 py-3 grid grid-cols-12 gap-3 items-center text-sm hover:bg-stone-800/30 transition-colors text-left group"
            >
              <div className="col-span-1 font-mono text-[11px] text-stone-500 group-hover:text-stone-300">{c.id.replace('CASE-', '')}</div>
              <div className="col-span-3 text-stone-100 font-medium">{c.patient}</div>
              <div className="col-span-3 text-stone-400 text-xs">{c.source}</div>
              <div className="col-span-1 text-stone-500 text-xs">{c.received}</div>
              <div className="col-span-1 text-stone-400 text-xs font-mono">{c.sla}</div>
              <div className="col-span-1"><PriorityBadge priority={c.priority} /></div>
              <div className="col-span-2 text-right flex items-center justify-end gap-2">
                <span className="text-xs text-amber-300">{c.confirmationCount} pending</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Left nav
// ──────────────────────────────────────────────────────────────────────────

const LeftNav = ({ activeView, onChange }) => (
  <div className="w-60 border-r border-stone-800/60 bg-stone-950/40 flex flex-col">
    <div className="px-4 py-5 border-b border-stone-800/60">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
          <span className="font-serif text-stone-900 text-sm font-bold">F</span>
        </div>
        <div>
          <div className="font-serif text-stone-100 text-base leading-none">FaxGrid</div>
          <div className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">Heritage Home Health</div>
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-auto py-4 px-2 space-y-4">
      {queueData.map(group => (
        <div key={group.id}>
          <div className="px-3 mb-1.5 text-[9px] uppercase tracking-wider text-stone-600 font-semibold">{group.label}</div>
          {group.queues.map(q => (
            <button
              key={q.key}
              onClick={() => onChange('queue')}
              className={`w-full px-3 py-1.5 rounded text-left flex items-center justify-between text-xs transition-colors ${
                q.active && activeView !== 'case'
                  ? 'bg-teal-500/10 text-teal-200 border-l-2 border-teal-400'
                  : 'text-stone-400 hover:bg-stone-800/40 hover:text-stone-200 border-l-2 border-transparent'
              }`}
            >
              <span>{q.label}</span>
              <span className="font-mono text-[10px] text-stone-500">{q.count}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
    <div className="px-4 py-3 border-t border-stone-800/60 text-[10px] text-stone-600">
      <div className="flex items-center justify-between">
        <span>Kai Schulze</span>
        <span className="text-stone-700">Admin</span>
      </div>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Case workspace
// ──────────────────────────────────────────────────────────────────────────

const CaseWorkspace = ({ caseData, onBack, otherCaseId, onSwitchCase }) => {
  const [page, setPage] = useState(1);
  const [highlightedField, setHighlightedField] = useState(null);
  const [verifiedFields, setVerifiedFields] = useState(new Set());
  const [confirmedPatient, setConfirmedPatient] = useState(null);
  const [approvedDrafts, setApprovedDrafts] = useState(new Set());
  const [decided, setDecided] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);

  // Track which pending confirmations are resolved
  const confirmations = useMemo(() => {
    return caseData.pendingConfirmations.map(c => {
      let resolved = false;
      if (c.type === 'patient_assignment' && confirmedPatient) resolved = true;
      if (c.type === 'critical_field' && verifiedFields.has(c.fieldKey)) resolved = true;
      if (c.type === 'outbound' && [...approvedDrafts].length > 0) resolved = true;
      if (c.type === 'source_attribution' && confirmedPatient) resolved = true; // bundled
      if (c.type === 'gate_resolution' && [...approvedDrafts].length > 0) resolved = true; // bundled with outbound
      return { ...c, status: resolved ? 'resolved' : 'pending' };
    });
  }, [caseData, confirmedPatient, verifiedFields, approvedDrafts]);

  const allResolved = confirmations.every(c => c.status === 'resolved');
  const gatesPassed = caseData.gates.every(g => g.status === 'pass' || g.status === 'warning');

  const handleFieldEdit = (key) => {
    setVerifiedFields(prev => new Set([...prev, key]));
  };

  const handlePatientConfirm = (id) => {
    setConfirmedPatient(id);
  };

  const handleDraftApprove = (id) => {
    setApprovedDrafts(prev => new Set([...prev, id]));
  };

  const handleJumpTo = (confirmation) => {
    if (confirmation.type === 'critical_field') {
      setHighlightedField(confirmation.fieldKey);
      const field = caseData.extractedFields.find(f => f.key === confirmation.fieldKey);
      if (field) setPage(field.page);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Case header */}
      <div className="px-8 py-4 border-b border-stone-800/60 bg-stone-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-stone-500 hover:text-stone-300 text-xs flex items-center gap-1">
              ← Back to queue
            </button>
            <div className="h-4 w-px bg-stone-800"></div>
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-stone-500">{caseData.id}</span>
                  <PriorityBadge priority={caseData.priority} />
                </div>
                <div className="font-serif text-xl text-stone-100 mt-0.5">
                  {confirmedPatient ? caseData.patientCandidates.find(c => c.id === confirmedPatient)?.name : caseData.extractedFields.find(f => f.key === 'patient_name')?.value}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-stone-500">Workflow</div>
              <div className="text-stone-200 mt-0.5">{caseData.workflow}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-stone-500">Source</div>
              <div className="text-stone-200 mt-0.5">{caseData.source.name}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-stone-500">SLA</div>
              <div className="text-emerald-300 mt-0.5 font-mono">{caseData.sla.dueIn}</div>
            </div>
            <button
              onClick={() => onSwitchCase(otherCaseId)}
              className="ml-2 px-2.5 py-1.5 rounded text-[11px] bg-stone-800/60 hover:bg-stone-700/60 text-stone-300 border border-stone-700/40 transition-colors"
            >
              Switch to {otherCaseId === 'CASE-2452' ? 'DME order' : 'HH referral'} →
            </button>
          </div>
        </div>
      </div>

      {/* Main two-column area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: document preview */}
        <div className="w-[42%] border-r border-stone-800/60 overflow-hidden">
          <DocumentPreview
            caseData={caseData}
            page={page}
            onPageChange={setPage}
            highlightField={highlightedField}
          />
        </div>

        {/* Right: work panel */}
        <div className="flex-1 overflow-auto bg-stone-950/20">
          <div className="p-5 space-y-4 max-w-2xl">
            <PendingConfirmationsPanel
              confirmations={confirmations}
              onResolve={() => {}}
              onJumpTo={handleJumpTo}
            />

            <PatientPanel
              candidates={caseData.patientCandidates}
              confirmedPatient={confirmedPatient}
              onConfirm={handlePatientConfirm}
              extractedName={caseData.extractedFields.find(f => f.key === 'patient_name')?.value}
              extractedDob={caseData.extractedFields.find(f => f.key === 'dob')?.value}
            />

            <ExtractedFieldsPanel
              fields={caseData.extractedFields}
              onFieldHover={setHighlightedField}
              onFieldEdit={handleFieldEdit}
              highlightedField={highlightedField}
              verifiedFields={verifiedFields}
            />

            <GatesPanel gates={caseData.gates} />

            <OutboundPanel
              drafts={caseData.outboundDrafts}
              approvedDrafts={approvedDrafts}
              onApprove={handleDraftApprove}
            />

            <DecisionPanel
              allResolved={allResolved}
              decided={decided}
              onDecide={() => setDecided(true)}
              gatesPassed={gatesPassed}
            />
          </div>
        </div>
      </div>

      {/* Timeline drawer */}
      <TimelineDrawer
        timeline={caseData.timeline}
        open={timelineOpen}
        onToggle={() => setTimelineOpen(o => !o)}
      />
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Top bar (universal)
// ──────────────────────────────────────────────────────────────────────────

const TopBar = () => (
  <div className="h-12 border-b border-stone-800/60 bg-stone-950/60 flex items-center justify-between px-6">
    <div className="flex items-center gap-3 flex-1 max-w-md">
      <Search className="w-3.5 h-3.5 text-stone-500" />
      <input
        type="text"
        placeholder="Search patients, cases, sources…"
        className="flex-1 bg-transparent border-0 outline-none text-sm text-stone-300 placeholder:text-stone-600"
      />
      <span className="text-[10px] text-stone-600 font-mono px-1.5 py-0.5 bg-stone-800/60 rounded">⌘K</span>
    </div>
    <div className="flex items-center gap-3">
      <button className="text-stone-500 hover:text-stone-300 relative">
        <Bell className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full"></span>
      </button>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-600 to-stone-800 flex items-center justify-center text-[10px] text-stone-200 font-medium">KS</div>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Root
// ──────────────────────────────────────────────────────────────────────────

export default function FaxGridMockup() {
  const [view, setView] = useState('queue'); // 'queue' or 'case'
  const [activeCaseId, setActiveCaseId] = useState('CASE-2451');

  const activeCase = initialCases[activeCaseId];
  const otherCaseId = activeCaseId === 'CASE-2451' ? 'CASE-2452' : 'CASE-2451';

  return (
    <div
      className="h-screen w-full flex flex-col bg-stone-950 text-stone-200 overflow-hidden"
      style={{
        fontFamily: '"Söhne", "Inter Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        background: 'radial-gradient(ellipse at top left, rgba(20, 20, 18, 1) 0%, rgba(10, 10, 9, 1) 70%)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Instrument Serif', Georgia, serif; letter-spacing: -0.01em; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(120, 113, 108, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(120, 113, 108, 0.4); }
      `}</style>

      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <LeftNav activeView={view} onChange={setView} />
        {view === 'queue' ? (
          <QueueView
            onSelectCase={(id) => {
              setActiveCaseId(id);
              setView('case');
            }}
          />
        ) : (
          <CaseWorkspace
            caseData={activeCase}
            onBack={() => setView('queue')}
            otherCaseId={otherCaseId}
            onSwitchCase={(id) => setActiveCaseId(id)}
          />
        )}
      </div>
    </div>
  );
}
