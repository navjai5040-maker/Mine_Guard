import { 
  StatutoryComplianceControl, 
  MineZone, 
  InspectionObservation, 
  CorrectiveAction, 
  ContractorProfile, 
  AuditLedgerBlock, 
  OcrDocumentSample 
} from '../types/mineguard';

export const CURRENT_SUBSIDIARY = {
  name: 'South Eastern Coalfields Limited (SECL)',
  holding: 'Coal India Limited (CIL) / Ministry of Coal',
  project: 'Gevra Mega Opencast Project',
  area: 'Korba Coalfield, Chhattisgarh',
  annualProductionTarget: '52.50 Million Tonnes',
  currentYearOutput: '53.12 Million Tonnes',
  complianceIndex: 94.2,
  activeWorkforce: '8,420 (Dept: 3,120 | Contractual: 5,300)',
  dgmsRegion: 'Bilaspur Region (Central Zone)'
};

export const MINE_ZONES: MineZone[] = [
  {
    id: 'zone-north-pit',
    name: 'North Pit Highwall & Coal Face (Seam VI & VII)',
    type: 'pit',
    coordinates: { x: 120, y: 140, width: 220, height: 160 },
    activeContractor: 'Eastern Earthmovers Corp.',
    currentRisk: 'critical',
    riskScore: 88,
    activeObservationsCount: 3,
    sensors: [
      { name: 'Ground Stability Seismograph', reading: '0.42 mm/hr creep', status: 'alert', statutoryLimit: '< 0.15 mm/hr' },
      { name: 'In-Pit Gas Monitor (CH4/CO)', reading: '0.02% CH4 / 4 ppm CO', status: 'normal', statutoryLimit: '< 0.5% CH4 / < 50 ppm CO' },
      { name: 'CAAQMS Dust Station 01', reading: '215 µg/m³ PM10', status: 'alert', statutoryLimit: '< 100 µg/m³' }
    ]
  },
  {
    id: 'zone-ob-dump-4',
    name: 'South Overburden Dump Bench 4 (Level +340m)',
    type: 'dump',
    coordinates: { x: 420, y: 90, width: 210, height: 150 },
    activeContractor: 'Sainik Mining Infrastructure',
    currentRisk: 'high',
    riskScore: 74,
    activeObservationsCount: 2,
    sensors: [
      { name: 'Dump Toe Piezometer (Water Table)', reading: '18.4 m below crest', status: 'normal', statutoryLimit: '> 15.0 m' },
      { name: 'Drone Slope InSAR Incline', reading: '37.8° slope angle', status: 'warning', statutoryLimit: '≤ 37.5° max angle' },
      { name: 'Bench Berm Height Laser Radar', reading: '1.45m bunding', status: 'alert', statutoryLimit: '≥ 2.40m (> dumper tire)' }
    ]
  },
  {
    id: 'zone-haul-road-east',
    name: 'Main Haul Road C-East (Ch. 1+200 to 2+800)',
    type: 'haul_road',
    coordinates: { x: 260, y: 270, width: 240, height: 80 },
    activeContractor: 'VPR Haulage Logistics',
    currentRisk: 'medium',
    riskScore: 54,
    activeObservationsCount: 1,
    sensors: [
      { name: 'Mist Cannon Water Pressure', reading: '4.2 bar (Sprinkling active)', status: 'normal', statutoryLimit: '> 3.5 bar' },
      { name: 'Vehicle Radar Speed Radar', reading: '28 km/h peak', status: 'warning', statutoryLimit: '≤ 30 km/h (Mines SOP)' },
      { name: 'Berm Edge Continuity Sensor', reading: '96% verified', status: 'normal', statutoryLimit: '100% continuous' }
    ]
  },
  {
    id: 'zone-water-lagoon',
    name: 'Industrial Mine Water Sump & ETP Lagoon',
    type: 'water_sump',
    coordinates: { x: 670, y: 250, width: 170, height: 130 },
    activeContractor: 'EcoClear Engineering Ltd',
    currentRisk: 'high',
    riskScore: 68,
    activeObservationsCount: 2,
    sensors: [
      { name: 'Total Suspended Solids (TSS)', reading: '134 mg/L discharge', status: 'alert', statutoryLimit: '≤ 100 mg/L (MoEFCC)' },
      { name: 'Effluent pH Meter', reading: '7.42 pH', status: 'normal', statutoryLimit: '6.5 - 8.5' },
      { name: 'Oil & Grease Skimmer Sensor', reading: '6.2 mg/L', status: 'normal', statutoryLimit: '≤ 10.0 mg/L' }
    ]
  },
  {
    id: 'zone-chp-siding',
    name: 'Coal Handling Plant & Railway Siding 02',
    type: 'chp',
    coordinates: { x: 490, y: 390, width: 200, height: 130 },
    activeContractor: 'Gayatri Coal Transporters',
    currentRisk: 'low',
    riskScore: 28,
    activeObservationsCount: 0,
    sensors: [
      { name: 'Crusher Belt Acoustic Sensor', reading: '72 dB (Vibration OK)', status: 'normal', statutoryLimit: '< 85 dB' },
      { name: 'CAAQMS Dust Extraction Hood', reading: '68 µg/m³ PM10', status: 'normal', statutoryLimit: '< 100 µg/m³' },
      { name: 'Electronic Weighbridge Calibration', reading: 'Active Valid Stamp', status: 'normal', statutoryLimit: 'Valid stamp' }
    ]
  },
  {
    id: 'zone-magazine-explosives',
    name: 'Central Explosive Magazine & Ammonium Nitrate Store',
    type: 'magazine',
    coordinates: { x: 100, y: 360, width: 150, height: 120 },
    activeContractor: 'SECL Blasting Dept (Direct)',
    currentRisk: 'low',
    riskScore: 18,
    activeObservationsCount: 0,
    sensors: [
      { name: 'Magazine Thermal Sensor', reading: '24.2°C ambient', status: 'normal', statutoryLimit: '< 32.0°C' },
      { name: 'Security Perimeter Laser Barrier', reading: 'Armed / Active', status: 'normal', statutoryLimit: '24x7 Armed' },
      { name: 'Daily Blasting Log Form IV', reading: 'Digitized & Signed', status: 'normal', statutoryLimit: 'Mandatory Daily' }
    ]
  }
];

export const STATUTORY_CONTROLS: StatutoryComplianceControl[] = [
  {
    id: 'CMR-SAF-104',
    title: 'Bench Height & Width Geometry in Opencast Mine',
    statute: 'Coal Mines Regulations 2017 (DGMS)',
    regulationNumber: 'CMR Reg. 104(1)(b)',
    category: 'safety',
    description: 'Bench height in overburden shall not exceed the digging height of excavator; bench width shall not be less than bench height.',
    mandatoryEvidence: 'Monthly 3D Drone Photogrammetry Bench Survey + Shift In-charge Physical Measurement Log',
    frequency: 'monthly',
    responsibleEntity: 'Survey & Pit Safety Department',
    applicableZone: 'North Pit Highwall & Coal Face',
    lastEvidenceDate: '2026-08-28',
    nextDueDate: '2026-09-28',
    complianceStatus: 'violation_reported',
    riskWeight: 9.5,
    associatedIncidentsCount: 2
  },
  {
    id: 'CMR-SAF-106',
    title: 'Overburden Spoil Bank Stability & Berm Protection',
    statute: 'Coal Mines Regulations 2017 (DGMS)',
    regulationNumber: 'CMR Reg. 106(3)',
    category: 'safety',
    description: 'Toe of dump shall not approach within 100m of mine workings; parapet bund / berm height must exceed largest dumper tyre height (2.4m minimum for 240T dumpers).',
    mandatoryEvidence: 'Daily Shift In-charge Berm Inspection Certificate & Geo-tagged Video Log',
    frequency: 'daily',
    responsibleEntity: 'Overburden Dump In-charge / Sainik Mining',
    applicableZone: 'South Overburden Dump Bench 4',
    lastEvidenceDate: '2026-09-24',
    nextDueDate: '2026-09-25',
    complianceStatus: 'overdue',
    riskWeight: 9.0,
    associatedIncidentsCount: 3
  },
  {
    id: 'MOEF-ENV-WATER-02',
    title: 'Mine Water Sump Effluent Discharge Standards (CTO)',
    statute: 'Water (Prevention & Control of Pollution) Act 1974 & CPCB Guidelines',
    regulationNumber: 'Schedule VI / Consent to Operate',
    category: 'environment',
    description: 'Effluent discharge from sedimentation ponds to outside nallahs shall maintain TSS < 100 mg/L, pH 6.5–8.5, and Zero toxic discharge.',
    mandatoryEvidence: 'NABL Accredited Lab Fortnightly Water Quality Test Certificate + Real-time Online TSS Sensor Log',
    frequency: 'weekly',
    responsibleEntity: 'Environment Dept / EcoClear Engineering',
    applicableZone: 'Industrial Mine Water Sump & ETP Lagoon',
    lastEvidenceDate: '2026-09-12',
    nextDueDate: '2026-09-26',
    complianceStatus: 'violation_reported',
    riskWeight: 8.5,
    associatedIncidentsCount: 1
  },
  {
    id: 'CMR-SAF-128',
    title: 'Haul Road Dust Suppression & Heavy Water Spraying',
    statute: 'Coal Mines Regulations 2017 (DGMS)',
    regulationNumber: 'CMR Reg. 128(2)',
    category: 'safety',
    description: 'Adequate mist spraying or pressurized water bowsers to maintain airborne respirable dust below prescribed DGMS and CPCB limits.',
    mandatoryEvidence: 'Continuous Fixed Sprinkler Log & Water Bowser GPS Deployment Track',
    frequency: 'daily',
    responsibleEntity: 'Civil & Haulage Maintenance Dept',
    applicableZone: 'Main Haul Road C-East',
    lastEvidenceDate: '2026-09-25',
    nextDueDate: '2026-09-26',
    complianceStatus: 'due_soon',
    riskWeight: 7.0,
    associatedIncidentsCount: 1
  },
  {
    id: 'MINES-LAB-ACT-48',
    title: 'Contractual Workforce Statutory EPF, ESIC & Form B Register',
    statute: 'Mines Act 1952 & CIL Integrated Contractual Info System (ICIS)',
    regulationNumber: 'Section 48 / Rule 77',
    category: 'labour',
    description: 'Digital verification of biometric attendance mapped to Form B register, payment of High Power Committee (HPC) wages, and 100% PF/ESIC electronic remittance challans.',
    mandatoryEvidence: 'Monthly Bank Wage Disbursal Statement + EPFO Electronic Challan Return (ECR)',
    frequency: 'monthly',
    responsibleEntity: 'Personnel & Industrial Relations Dept',
    applicableZone: 'All Mine Working Zones & Gates',
    lastEvidenceDate: '2026-09-10',
    nextDueDate: '2026-10-07',
    complianceStatus: 'compliant',
    riskWeight: 8.0,
    associatedIncidentsCount: 0
  },
  {
    id: 'DGMS-EXP-BLAST-182',
    title: 'Controlled Blasting Ground Vibration Peak Particle Velocity (PPV)',
    statute: 'Coal Mines Regulations 2017 (DGMS)',
    regulationNumber: 'CMR Reg. 182 & DGMS Circular 07 of 1997',
    category: 'safety',
    description: 'Ground vibration measured at closest village boundary structure (Gevra Basti) shall not exceed 10.0 mm/s PPV for frequency < 8 Hz.',
    mandatoryEvidence: 'Tri-axial Seismograph Digital Waveform Record signed by 1st Class Mine Manager',
    frequency: 'per_blast',
    responsibleEntity: 'Blasting & Explosive Safety Officer',
    applicableZone: 'North Pit Highwall & Coal Face',
    lastEvidenceDate: '2026-09-25',
    nextDueDate: '2026-09-27',
    complianceStatus: 'compliant',
    riskWeight: 9.0,
    associatedIncidentsCount: 0
  }
];

export const CONTRACTORS_DATA: ContractorProfile[] = [
  {
    id: 'cont-01',
    name: 'Eastern Earthmovers Corp.',
    vendorCode: 'VND-SECL-2023-8841',
    workOrderNumber: 'WO/SECL/GEV/OB-EXC/2024/912',
    subsidiary: 'SECL',
    workforceCount: 1420,
    safetyScore: 61,
    riskTier: 'high_risk',
    activeViolations: 4,
    repeatViolations: 2,
    overdueActions: 2,
    pfEsicCompliance: 92.4,
    lastAuditDate: '2026-09-04',
    status: 'watch_list',
    criticalIssues: [
      'Repeated non-provision of highwall berm bunding at North Pit Level 3',
      '2 overdue corrective action notices issued by DGMS Regional Inspectorate',
      'Unresolved dumper operator shift overspeeding alarms'
    ]
  },
  {
    id: 'cont-02',
    name: 'Sainik Mining & Allied Services',
    vendorCode: 'VND-SECL-2022-4410',
    workOrderNumber: 'WO/SECL/GEV/DUMP-MGT/2023/118',
    subsidiary: 'SECL',
    workforceCount: 980,
    safetyScore: 72,
    riskTier: 'elevated',
    activeViolations: 2,
    repeatViolations: 1,
    overdueActions: 1,
    pfEsicCompliance: 97.8,
    lastAuditDate: '2026-09-15',
    status: 'active',
    criticalIssues: [
      'Dump bench 4 crest crack monitoring pending geotechnical review',
      'Night-shift lighting lux levels below DGMS standard near dump hopper'
    ]
  },
  {
    id: 'cont-03',
    name: 'EcoClear Engineering & Treatment Ltd',
    vendorCode: 'VND-SECL-2024-3019',
    workOrderNumber: 'WO/SECL/GEV/ENV-ETP/2024/055',
    subsidiary: 'SECL',
    workforceCount: 160,
    safetyScore: 78,
    riskTier: 'moderate',
    activeViolations: 1,
    repeatViolations: 0,
    overdueActions: 0,
    pfEsicCompliance: 99.2,
    lastAuditDate: '2026-09-20',
    status: 'active',
    criticalIssues: [
      'Sump filter press cloth replacement delayed by 4 days'
    ]
  },
  {
    id: 'cont-04',
    name: 'VPR Haulage Logistics & Equipment',
    vendorCode: 'VND-SECL-2023-1192',
    workOrderNumber: 'WO/SECL/GEV/HAUL-TRN/2023/402',
    subsidiary: 'SECL',
    workforceCount: 640,
    safetyScore: 91,
    riskTier: 'low_risk',
    activeViolations: 0,
    repeatViolations: 0,
    overdueActions: 0,
    pfEsicCompliance: 99.8,
    lastAuditDate: '2026-09-22',
    status: 'active',
    criticalIssues: []
  }
];

export const INITIAL_OBSERVATIONS: InspectionObservation[] = [
  {
    id: 'OBS-2026-09-001',
    ticketNumber: 'SECL/GEV/SAF/2026/089',
    controlId: 'CMR-SAF-106',
    zoneId: 'zone-ob-dump-4',
    zoneName: 'South Overburden Dump Bench 4',
    category: 'safety',
    severity: 'critical',
    title: 'Sub-standard Parapet Berm Bund & Longitudinal Crest Crack',
    description: 'Berm height measured at only 1.45 meters along 180m dump crest. Statutory requirement for 240T dumpers is 2.40m (> dumper tyre radius). Noticeable 40mm wide tension crack detected along dump edge.',
    gps: {
      latitude: 22.349210,
      longitude: 82.684120,
      elevationMeters: 342.5,
      accuracyMeters: 1.8,
      locationName: 'SECL Gevra OB Dump 4 - North-West Face'
    },
    timestamp: '2026-09-25T11:42:00Z',
    officerId: 'INSP-SECL-4108',
    officerName: 'Er. Rajeshwar Nath',
    officerDesignation: 'Senior Inspector of Mines Safety',
    evidencePhoto: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    aiAssistance: {
      detectedAnomaly: 'Deficient berm bunding (< 2.4m height) + visible surface tension fracture on haul crest',
      confidenceScore: 0.96,
      suggestedRegulation: 'CMR 2017 Reg. 106(3) & DGMS Technical Circular 02/2020',
      riskScoreContribution: 38
    },
    contractorId: 'cont-02',
    contractorName: 'Sainik Mining & Allied Services',
    correctiveActionId: 'CAPA-2026-0041',
    status: 'escalated',
    evidenceHash: '0x8f7d9c42b8e31289a05b38209e7c541094dfa189ec32918237e190ba3291ca82',
    syncStatus: 'synced'
  },
  {
    id: 'OBS-2026-09-002',
    ticketNumber: 'SECL/GEV/ENV/2026/044',
    controlId: 'MOEF-ENV-WATER-02',
    zoneId: 'zone-water-lagoon',
    zoneName: 'Industrial Mine Water Sump & ETP Lagoon',
    category: 'environment',
    severity: 'high',
    title: 'Mine Water Sump Effluent Exceeds TSS Threshold (134 mg/L)',
    description: 'Continuous telemetry and field grab sample revealed Total Suspended Solids (TSS) at 134 mg/L being discharged toward public drainage canal. Statutory ceiling is 100 mg/L.',
    gps: {
      latitude: 22.351420,
      longitude: 82.691200,
      elevationMeters: 288.1,
      accuracyMeters: 2.1,
      locationName: 'Gevra Mine Sedimentation Pond Discharge Weir #2'
    },
    timestamp: '2026-09-25T14:15:00Z',
    officerId: 'ENV-SECL-1102',
    officerName: 'Smt. Priya Sharma',
    officerDesignation: 'Environmental Engineer (Nodal Officer)',
    evidencePhoto: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    aiAssistance: {
      detectedAnomaly: 'High turbidity slurry discharge; flocculant dosing pump trip suspected',
      confidenceScore: 0.92,
      suggestedRegulation: 'Water Act 1974 Section 25/26 & MoEFCC EC Condition IV(b)',
      riskScoreContribution: 26
    },
    contractorId: 'cont-03',
    contractorName: 'EcoClear Engineering & Treatment Ltd',
    correctiveActionId: 'CAPA-2026-0042',
    status: 'action_assigned',
    evidenceHash: '0x4e21a87c9082bc319208e671239aa812f847120aef381923058c492193bca910',
    syncStatus: 'synced'
  },
  {
    id: 'OBS-2026-09-003',
    ticketNumber: 'SECL/GEV/SAF/2026/091',
    controlId: 'CMR-SAF-104',
    zoneId: 'zone-north-pit',
    zoneName: 'North Pit Highwall & Coal Face',
    category: 'safety',
    severity: 'high',
    title: 'Excavator Working Face Undercutting & Over-steepened Bench',
    description: 'Shovel face height exceeds 15.2m without proper sub-benching. Overhang observed directly above heavy dump truck loading route.',
    gps: {
      latitude: 22.346890,
      longitude: 82.680450,
      elevationMeters: 245.0,
      accuracyMeters: 3.2,
      locationName: 'North Pit Bench #6 Coal Face'
    },
    timestamp: '2026-09-26T08:30:00Z',
    officerId: 'INSP-SECL-4108',
    officerName: 'Er. Rajeshwar Nath',
    officerDesignation: 'Senior Inspector of Mines Safety',
    evidencePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    aiAssistance: {
      detectedAnomaly: 'Bench overhang angle 78° exceeding statutory bench slope safety envelope',
      confidenceScore: 0.94,
      suggestedRegulation: 'CMR 2017 Reg. 104(1)(b) Opencast bench design',
      riskScoreContribution: 32
    },
    contractorId: 'cont-01',
    contractorName: 'Eastern Earthmovers Corp.',
    correctiveActionId: 'CAPA-2026-0043',
    status: 'action_assigned',
    evidenceHash: '0x99281ba3c78e1245089201948ba1209348e71829034871230985102934871209',
    syncStatus: 'synced'
  }
];

export const INITIAL_CAPAS: CorrectiveAction[] = [
  {
    id: 'CAPA-2026-0041',
    observationId: 'OBS-2026-09-001',
    ticketNumber: 'SECL/GEV/SAF/2026/089',
    title: 'Re-construct Dump Crest Berm Bund to 2.40m Height & Seal Tension Crack',
    description: 'Deploy 2 dozers immediately to raise edge bunding to minimum 2.4m along 200m stretch. Geotechnical team must install surface crack tell-tales and submit slope stability verification report.',
    assignedTo: 'Er. A. K. Banerjee (Mine Manager)',
    assignedRole: 'Mine Agent / First Class Mine Manager',
    contractorName: 'Sainik Mining & Allied Services',
    priority: 'critical',
    status: 'escalated',
    createdAt: '2026-09-25T12:00:00Z',
    slaDeadline: '2026-09-26T12:00:00Z',
    hoursRemaining: 3.5,
    escalationTier: 2,
    escalationChain: [
      { tier: 1, title: 'Mine Safety Officer', authority: 'Shift Safety Lead', slaHours: 12, escalatedAt: '2026-09-25T12:00:00Z', contact: '+91-7752-240112' },
      { tier: 2, title: 'Mine Agent & General Manager', authority: 'GM Gevra Project', slaHours: 24, escalatedAt: '2026-09-26T00:01:00Z', contact: '+91-7752-240890' },
      { tier: 3, title: 'Director (Technical) SECL & DGMS', authority: 'Corporate SECL HQ & DGMS Bilaspur', slaHours: 48, contact: '+91-7752-246001' }
    ]
  },
  {
    id: 'CAPA-2026-0042',
    observationId: 'OBS-2026-09-002',
    ticketNumber: 'SECL/GEV/ENV/2026/044',
    title: 'Flush Sump Settling Chambers & Restore Flocculant Dosing Rate',
    description: 'Rectify automated alum/polyelectrolyte dosing pump on Lagoon 2 weir. Divert excess sedimented runoff to secondary sump until TSS readings normalize below 80 mg/L.',
    assignedTo: 'Sri Vivek Sahu',
    assignedRole: 'ETP Plant Lead / EcoClear Engineering',
    contractorName: 'EcoClear Engineering & Treatment Ltd',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-09-25T14:30:00Z',
    slaDeadline: '2026-09-26T14:30:00Z',
    hoursRemaining: 5.8,
    escalationTier: 1,
    escalationChain: [
      { tier: 1, title: 'Environmental In-charge', authority: 'Nodal Environment Officer', slaHours: 24, escalatedAt: '2026-09-25T14:30:00Z', contact: '+91-7752-241288' },
      { tier: 2, title: 'Project Officer / GM', authority: 'Area GM Korba', slaHours: 48, contact: '+91-7752-240890' }
    ]
  },
  {
    id: 'CAPA-2026-0043',
    observationId: 'OBS-2026-09-003',
    ticketNumber: 'SECL/GEV/SAF/2026/091',
    title: 'Doze Down Overhang at Bench 6 & Re-establish 45° Safe Angle',
    description: 'Suspend truck spotting beneath Shovel Face #4 until highwall dozer dresses down overhang. Establish 10m safety exclusion zone demarcated with red danger cones.',
    assignedTo: 'Er. Sandeep Mohanty',
    assignedRole: 'Pit Safety Supervisor / Eastern Earthmovers',
    contractorName: 'Eastern Earthmovers Corp.',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-09-26T09:00:00Z',
    slaDeadline: '2026-09-27T09:00:00Z',
    hoursRemaining: 24.0,
    escalationTier: 1,
    escalationChain: [
      { tier: 1, title: 'Pit Safety Supervisor', authority: 'Shift Lead', slaHours: 24, escalatedAt: '2026-09-26T09:00:00Z', contact: '+91-7752-248190' },
      { tier: 2, title: 'Mine Agent & General Manager', authority: 'GM Gevra Project', slaHours: 48, contact: '+91-7752-240890' }
    ]
  }
];

export const INITIAL_AUDIT_BLOCKS: AuditLedgerBlock[] = [
  {
    blockNumber: 1042,
    timestamp: '2026-09-25T11:42:00Z',
    eventType: 'INSPECTION_SUBMITTED',
    officerId: 'INSP-SECL-4108',
    officerName: 'Er. Rajeshwar Nath (DGMS Cert #8821)',
    zone: 'South Overburden Dump Bench 4',
    summary: 'Logged critical sub-standard berm bund (1.45m) with tension crack. SHA-256 evidence package created.',
    payloadHash: '0x3a89f41b209e7c10b42918ef3910ca8b9918204918e904b71239857102934871',
    previousHash: '0x0000001a9f8b417e290812cf8912804b99812734bca812739812903847192837',
    blockHash: '0x7e8b912a4c102938471928347109283471092834719028347109283471092834',
    verified: true
  },
  {
    blockNumber: 1043,
    timestamp: '2026-09-25T12:00:00Z',
    eventType: 'CAPA_ASSIGNED',
    officerId: 'SYS-AI-WORKFLOW',
    officerName: 'MineGuard Workflow Engine',
    zone: 'South Overburden Dump Bench 4',
    summary: 'Generated CAPA-2026-0041 assigned to Er. A. K. Banerjee (Mine Manager) with 24h SLA.',
    payloadHash: '0x1928374a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    previousHash: '0x7e8b912a4c102938471928347109283471092834719028347109283471092834',
    blockHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    verified: true
  },
  {
    blockNumber: 1044,
    timestamp: '2026-09-26T00:01:00Z',
    eventType: 'ESCALATION_TRIGGERED',
    officerId: 'SYS-AI-ESCALATION',
    officerName: 'MineGuard Autonomous Governance Clock',
    zone: 'South Overburden Dump Bench 4',
    summary: 'CAPA-2026-0041 reached Tier-2 escalation threshold (12h elapsed without closure evidence). Dispatched emergency SMS/App alert to GM Gevra.',
    payloadHash: '0x5b4a3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b',
    previousHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockHash: '0x3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d',
    verified: true
  },
  {
    blockNumber: 1045,
    timestamp: '2026-09-26T08:30:00Z',
    eventType: 'INSPECTION_SUBMITTED',
    officerId: 'INSP-SECL-4108',
    officerName: 'Er. Rajeshwar Nath',
    zone: 'North Pit Highwall & Coal Face',
    summary: 'Logged bench undercut overhang (78° angle) at Shovel Face #4 under CMR Reg 104(1)(b).',
    payloadHash: '0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
    previousHash: '0x3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d',
    blockHash: '0x4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e',
    verified: true
  }
];

export const OCR_SAMPLES: OcrDocumentSample[] = [
  {
    id: 'doc-dgms-01',
    title: 'DGMS Form VI Statutory Inspection Memo (Central Zone)',
    documentType: 'DGMS_FORM_VI',
    issuingAuthority: 'Directorate General of Mines Safety, Bilaspur Region',
    sampleDate: '2026-09-18',
    fileSnippet: 'MEMORANDUM OF INSPECTION UNDER SECTION 22 OF THE MINES ACT 1952',
    rawTextExcerpt: `GOVERNMENT OF INDIA
MINISTRY OF LABOUR & EMPLOYMENT
DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
BILASPUR REGION - INSPECTION MEMORANDUM NO. BZP/SECL/GEV/2026/419

To: The Agent / General Manager, Gevra Opencast Project, SECL.
Subject: Inspection of Opencast Workings under Coal Mines Regulations 2017.

During my statutory inspection of North Pit Highwall on 18.09.2026 accompanied by Agent Er. A. K. Banerjee:
1. Bench Width Violation: Under CMR Reg 104(1)(b), the width of bench in Overburden Seam VI was observed to be 9.8 meters against a bench face height of 14.2 meters. This contravenes the statutory ratio (Width >= Height).
2. Spoil Bank Slope: Dump bench 4 crest exhibited slope angle of 37.8 degrees with inadequate safety bunding.
Action Required: Stop coal extraction on Bench 6 until width is widened to minimum 14.5 meters. Compliance return within 15 days.`,
    extractedParameters: [
      { label: 'Issuing Authority', value: 'DGMS Bilaspur Region', benchmark: 'Central Inspectorate', compliant: true },
      { label: 'Referenced Regulation', value: 'CMR 2017 Reg. 104(1)(b) & Reg 106', benchmark: 'DGMS Statues', compliant: true },
      { label: 'Observed Bench Width', value: '9.8 meters', benchmark: '≥ 14.2 m (Face Height)', compliant: false },
      { label: 'Dump Slope Angle', value: '37.8 degrees', benchmark: '≤ 37.5 degrees max', compliant: false },
      { label: 'Statutory Notice Level', value: 'Section 22 Warning Order', benchmark: 'Immediate CAPA', compliant: false }
    ],
    linkedControlId: 'CMR-SAF-104',
    aiExtractionConfidence: 0.97,
    riskImpact: 'High compliance exposure. Automatic trigger of priority verification audit in Knowledge Graph.'
  },
  {
    id: 'doc-water-02',
    title: 'SPCB / NABL Fortnightly Mine Sump Effluent Water Analysis',
    documentType: 'EFFLUENT_TEST_REPORT',
    issuingAuthority: 'Chhattisgarh Environment Conservation Board (CECB) Certified Lab',
    sampleDate: '2026-09-22',
    fileSnippet: 'TEST REPORT OF INDUSTRIAL MINE SUMP DISCHARGE (NABL TC-8192)',
    rawTextExcerpt: `CHHATTISGARH ENVIRONMENT CONSERVATION BOARD
REGIONAL LABORATORY - KORBA (ACCREDITED NABL TC-8192)
SAMPLE ID: GEV-ETP-DISCHARGE-SEP-W3
Sample Date: 20-09-2026 | Analysis Completion: 22-09-2026

Parameters Tested:
- pH: 7.42 (Permissible: 6.5 - 8.5) -> COMPLIANT
- Total Suspended Solids (TSS): 134.0 mg/L (Permissible: 100.0 mg/L) -> NON-COMPLIANT (+34%)
- Oil & Grease: 6.2 mg/L (Permissible: 10.0 mg/L) -> COMPLIANT
- Chemical Oxygen Demand (COD): 88.0 mg/L (Permissible: 250.0 mg/L) -> COMPLIANT
Remarks: TSS concentration exceeds standard ceiling. Heavy siltation observed from OB Dump runoff settling weir.`,
    extractedParameters: [
      { label: 'Total Suspended Solids (TSS)', value: '134.0 mg/L', benchmark: '≤ 100.0 mg/L', compliant: false },
      { label: 'Discharge pH', value: '7.42', benchmark: '6.5 - 8.5', compliant: true },
      { label: 'Oil & Grease', value: '6.2 mg/L', benchmark: '≤ 10.0 mg/L', compliant: true },
      { label: 'Lab Accreditation', value: 'NABL TC-8192', benchmark: 'Certified SPCB', compliant: true }
    ],
    linkedControlId: 'MOEF-ENV-WATER-02',
    aiExtractionConfidence: 0.99,
    riskImpact: 'Statutory non-compliance under Water Act 1974. Environmental surcharge penalty risk if not mitigated within 48h.'
  },
  {
    id: 'doc-blast-03',
    title: 'Seismograph Controlled Blasting PPV Waveform Record',
    documentType: 'BLAST_VIBRATION_REPORT',
    issuingAuthority: 'SECL Blasting & Explosives R&D Cell',
    sampleDate: '2026-09-25',
    fileSnippet: 'INSTANTEL MINIMATE BLAST VIBRATION EVENT REPORT #8812',
    rawTextExcerpt: `SECL GEVRA MEGA PROJECT - BLAST SAFETY CELL
INSTRUMENT: Instantel Micromate Triaxial Seismograph #UM11982
Sensor Location: Gevra Basti Boundary (Distance: 640m from Blast Pit North)
Date/Time: 25-09-2026 13:42:15 IST
Total Explosives: 14,200 kg (Emulsion) | Maximum Charge Per Delay (MCPD): 420 kg

Results:
- Radial PPV: 4.82 mm/s (Freq: 14.2 Hz)
- Transverse PPV: 5.12 mm/s (Freq: 18.0 Hz)
- Vertical PPV: 6.84 mm/s (Freq: 22.4 Hz)
- Peak Vector Sum (PVS): 8.92 mm/s
- Air Overpressure: 114.2 dB(L) (Limit: 120.0 dB)
DGMS Circular 07/1997 Status: Within safe permissible threshold (Limit 10.0 mm/s for structures).`,
    extractedParameters: [
      { label: 'Peak Particle Velocity (PPV)', value: '6.84 mm/s', benchmark: '≤ 10.0 mm/s', compliant: true },
      { label: 'Dominant Frequency', value: '22.4 Hz', benchmark: '> 8.0 Hz', compliant: true },
      { label: 'Air Overpressure', value: '114.2 dB(L)', benchmark: '≤ 120.0 dB(L)', compliant: true },
      { label: 'Max Charge Per Delay (MCPD)', value: '420 kg', benchmark: '≤ 450 kg permitted', compliant: true }
    ],
    linkedControlId: 'DGMS-EXP-BLAST-182',
    aiExtractionConfidence: 0.98,
    riskImpact: 'Compliant blast record. Digitally archived and linked to DGMS explosive audit trail with cryptographic hash.'
  }
];

export const DAILY_GOVERNANCE_DELTA = {
  date: '2026-09-26',
  summary: 'Active governance delta comparison over the past 24 hours across Gevra Project',
  metrics: [
    { label: 'New Field Observations', change: '+3', current: '6 active', status: 'warning' },
    { label: 'Critical Risk Violations', change: '+1', current: '1 critical (Dump 4)', status: 'alert' },
    { label: 'Contractor Risk Escalation', change: '+1', current: 'Eastern Earthmovers on Watch List', status: 'alert' },
    { label: 'Overdue Compliance SLA', change: '-1', current: '2 overdue', status: 'normal' },
    { label: 'AI Anomaly Lead Time', change: '8.4 hrs', current: 'Prior to manual discovery', status: 'normal' }
  ],
  aiInsightNote: 'Risk concentration detected along the North Pit excavation axis. Concurrence of sub-standard bench width (CMR 104) and haulage delay indicates overburden stripping congestion. Contractor Eastern Earthmovers has accumulated 4 violations in 30 days.'
};
