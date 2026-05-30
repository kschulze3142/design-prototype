// Shared mock-data types for the Robin Dock design-prototype.
// Single source of truth: every direction renders the SAME data, so
// comparisons isolate visual/structural decisions rather than content.

export type FaxDirection = 'inbound' | 'outbound';

export type FaxStatus =
  | 'delivered' // outbound success
  | 'sending'   // outbound in-flight
  | 'failed'    // outbound failure
  | 'received'; // inbound success

export interface PatientRef {
  id: string;
  name: string;
  mrn: string;
}

export interface Fax {
  id: string;
  direction: FaxDirection;
  status: FaxStatus;
  fromNumber: string;          // E.164
  toNumber: string;            // E.164
  pageCount: number;
  timestamp: string;           // ISO 8601
  patientRef?: PatientRef;
  routingRuleId?: string;
}

export type PatientStatus = 'active' | 'pending-review' | 'archived';

export interface PatientRecord {
  id: string;
  name: string;
  mrn: string;
  status: PatientStatus;
  linkedFaxIds: string[];
}

export type RoutingRuleMatchKind = 'from-number' | 'keyword' | 'recipient-line';
export type RoutingRuleDestinationKind = 'inbox' | 'patient' | 'department';

export interface RoutingRule {
  id: string;
  name: string;
  match: { kind: RoutingRuleMatchKind; value: string };
  destination: { kind: RoutingRuleDestinationKind; value: string };
  enabled: boolean;
}

export type ActivityKind =
  | 'fax-sent'
  | 'fax-received'
  | 'fax-failed'
  | 'rule-applied'
  | 'patient-linked';

export interface ActivityFeedItem {
  id: string;
  timestamp: string; // ISO 8601
  kind: ActivityKind;
  description: string;
  faxId?: string;
}

export interface DashboardStats {
  faxesSentThisMonth: number;
  faxesReceivedThisMonth: number;
  deliverySuccessRate: number; // 0–1
  pagesUsed: number;
  pagesCap: number;
  recentActivity: ActivityFeedItem[];
}

export interface DesignMock {
  faxes: readonly Fax[];
  patients: readonly PatientRecord[];
  routingRules: readonly RoutingRule[];
  stats: DashboardStats;
}
