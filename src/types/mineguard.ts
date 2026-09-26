export type UserRole = 
  | 'ministry_official' // Ministry of Coal
  | 'cil_corporate'     // Coal India HQ (Chairman / Director Tech)
  | 'mine_agent'        // Mine General Manager / Agent
  | 'mine_safety_officer' // Field Safety Officer / Inspector
  | 'dgms_regulator';   // Directorate General of Mines Safety

export type ComplianceCategory = 
  | 'safety'       // DGMS CMR 2017
  | 'environment'  // MoEFCC / SPCB / Water & Air Act
  | 'labour'       // Mines Act 1952 / Minimum Wages / PF
  | 'production'   // Dispatch / Weighbridge / Grade monitoring
  | 'contractor';  // CIL ICIS / Sub-contractor statutory compliance

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  elevationMeters: number;
  accuracyMeters: number;
  locationName: string;
}

export interface StatutoryComplianceControl {
  id: string; // e.g. CMR-SAF-104
  title: string;
  statute: string; // e.g. "Coal Mines Regulations 2017"
  regulationNumber: string; // e.g. "Regulation 104"
  category: ComplianceCategory;
  description: string;
  mandatoryEvidence: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'per_blast';
  responsibleEntity: string;
  applicableZone: string;
  lastEvidenceDate: string;
  nextDueDate: string;
  complianceStatus: 'compliant' | 'due_soon' | 'overdue' | 'violation_reported';
  riskWeight: number; // 1 to 10
  associatedIncidentsCount: number;
}

export interface MineZone {
  id: string;
  name: string;
  type: 'pit' | 'dump' | 'haul_road' | 'magazine' | 'chp' | 'water_sump' | 'weighbridge';
  coordinates: { x: number; y: number; width?: number; height?: number };
  activeContractor?: string;
  currentRisk: RiskLevel;
  riskScore: number; // 0 - 100
  activeObservationsCount: number;
  sensors: {
    name: string;
    reading: string;
    status: 'normal' | 'warning' | 'alert';
    statutoryLimit: string;
  }[];
}

export interface InspectionObservation {
  id: string;
  ticketNumber: string;
  controlId: string;
  zoneId: string;
  zoneName: string;
  category: ComplianceCategory;
  severity: RiskLevel;
  title: string;
  description: string;
  gps: GpsCoordinates;
  timestamp: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  evidencePhoto: string;
  aiAssistance: {
    detectedAnomaly: string;
    confidenceScore: number; // e.g. 0.94
    suggestedRegulation: string;
    riskScoreContribution: number;
  };
  contractorId?: string;
  contractorName?: string;
  correctiveActionId?: string;
  status: 'reported' | 'action_assigned' | 'under_review' | 'verified_closed' | 'escalated';
  evidenceHash: string;
  syncStatus: 'synced' | 'pending_local_sync';
}

export interface CorrectiveAction {
  id: string;
  observationId: string;
  ticketNumber: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedRole: string;
  contractorName?: string;
  priority: RiskLevel;
  status: 'pending' | 'in_progress' | 'submitted_for_verification' | 'closed' | 'escalated';
  createdAt: string;
  slaDeadline: string;
  hoursRemaining: number;
  escalationTier: 1 | 2 | 3;
  escalationChain: {
    tier: number;
    title: string;
    authority: string;
    slaHours: number;
    escalatedAt?: string;
    contact: string;
  }[];
  closureEvidence?: {
    photoUrl: string;
    notes: string;
    submittedAt: string;
    submittedBy: string;
    aiVerificationMatch: number; // e.g. 96%
  };
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ContractorProfile {
  id: string;
  name: string;
  vendorCode: string;
  workOrderNumber: string;
  subsidiary: string;
  workforceCount: number;
  safetyScore: number; // 0 - 100
  riskTier: 'low_risk' | 'moderate' | 'elevated' | 'high_risk';
  activeViolations: number;
  repeatViolations: number;
  overdueActions: number;
  pfEsicCompliance: number; // percentage, e.g. 98%
  lastAuditDate: string;
  status: 'active' | 'watch_list' | 'show_cause_issued' | 'suspended';
  criticalIssues: string[];
}

export interface AuditLedgerBlock {
  blockNumber: number;
  timestamp: string;
  eventType: 'INSPECTION_SUBMITTED' | 'CAPA_ASSIGNED' | 'ESCALATION_TRIGGERED' | 'EVIDENCE_VERIFIED' | 'CLOSURE_APPROVED' | 'OCR_DIGITIZED';
  officerId: string;
  officerName: string;
  zone: string;
  summary: string;
  payloadHash: string;
  previousHash: string;
  blockHash: string;
  verified: boolean;
}

export interface OcrDocumentSample {
  id: string;
  title: string;
  documentType: 'DGMS_FORM_VI' | 'EFFLUENT_TEST_REPORT' | 'BLAST_VIBRATION_REPORT' | 'CONTRACTOR_WAGE_RETURN';
  issuingAuthority: string;
  sampleDate: string;
  fileSnippet: string;
  rawTextExcerpt: string;
  extractedParameters: {
    label: string;
    value: string;
    benchmark: string;
    compliant: boolean;
  }[];
  linkedControlId: string;
  aiExtractionConfidence: number;
  riskImpact: string;
}
