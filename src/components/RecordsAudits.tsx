import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileSearch, 
  Users, 
  Lock, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Building2, 
  Database, 
  Radio, 
  Cpu, 
  Check, 
  Zap,
  Globe,
  Share2
} from 'lucide-react';
import { INITIAL_AUDIT_BLOCKS, OCR_SAMPLES, CONTRACTORS_DATA } from '../data/mockData';
import { AuditLedgerBlock, OcrDocumentSample } from '../types/mineguard';

interface RecordsAuditsProps {
  auditBlocks: AuditLedgerBlock[];
  onIngestDocument: (sample: OcrDocumentSample) => void;
}

export const RecordsAudits: React.FC<RecordsAuditsProps> = ({
  auditBlocks,
  onIngestDocument
}) => {
  const [subTab, setSubTab] = useState<'integrations' | 'audit' | 'ocr' | 'contractors'>('integrations');
  
  // Audit Verification
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<string | null>(new Date().toLocaleTimeString());

  // OCR state
  const [selectedDoc, setSelectedDoc] = useState<OcrDocumentSample>(OCR_SAMPLES[0]);
  const [isIngested, setIsIngested] = useState(false);

  // Enterprise Integrations Sync State
  const [isSyncingIntegrations, setIsSyncingIntegrations] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2 mins ago');
  const [syncConfirmationToast, setSyncConfirmationToast] = useState<string | null>(null);

  const [enterpriseSystems, setEnterpriseSystems] = useState([
    {
      id: 'sap-erp',
      name: 'Coal India SAP ERP (Production & HEMM)',
      org: 'Coal India Ltd Corporate Enterprise Server',
      endpoint: 'https://erp.coalindia.in/api/v2/secl/gevra/telemetry',
      protocol: 'REST / SAP NetWeaver Gateway (RFC 7159)',
      status: 'connected',
      syncCadence: '5 seconds (Real-time telemetry)',
      payloadSummary: '42 Heavy Dump Trucks (CAT 793D / 240T), 8 Electric Rope Shovels, 3 In-Pit Crushers, Weighbridge Net Dispatch: 148,210 Tonnes (FY 24-25 quota nominal)',
      recordsSynced: '14,820 transactions today'
    },
    {
      id: 'cmsms',
      name: 'CMSMS & Khanan Prahari (Satellite Remote Sensing)',
      org: 'Ministry of Coal / MeitY NCOG / SAC ISRO',
      endpoint: 'https://cmsms.ncog.gov.in/api/gateway/cil/boundary-audit',
      protocol: 'Webhooks / GeoJSON Vector Feed (WGS 84)',
      status: 'connected',
      syncCadence: '6 hours (Cartosat-3 Imagery pass)',
      payloadSummary: '0 unauthorized boundary breaches detected along Gevra Project 4,800-hectare mining lease perimeter. Forest buffer zone compliant.',
      recordsSynced: '4 Daily Vector passes'
    },
    {
      id: 'parivesh',
      name: 'MoEFCC PARIVESH 2.0 (Environmental Clearances)',
      org: 'Ministry of Environment, Forest & Climate Change',
      endpoint: 'https://cpc.parivesh.nic.in/api/v1/compliance/returns',
      protocol: 'REST JSON / NABL Data Interconnect',
      status: 'connected',
      syncCadence: 'Daily (Nightly sync 23:59 IST)',
      payloadSummary: '48 Environmental Clearance (EC) conditions active: CAAQMS ambient PM10/PM2.5 stream, industrial mine water sump zero toxic discharge.',
      recordsSynced: '48 Conditions Audited'
    },
    {
      id: 'icis',
      name: 'CIL ICIS (Integrated Contractual Information System)',
      org: 'Coal India Human Resources & Labour Governance',
      endpoint: 'https://coalindiaicis.com/api/v3/vendor-compliance',
      protocol: 'HTTPS / EPFO Electronic Challan Return (ECR)',
      status: 'connected',
      syncCadence: 'Shift-wise (Every 8 hours)',
      payloadSummary: '5,300 contractual workers verified. Form B biometric attendance synchronized. 100% EPF/ESIC electronic remittance challans authenticated.',
      recordsSynced: '5,300 Active Workers'
    }
  ]);

  const handleTriggerWebhookSync = () => {
    setIsSyncingIntegrations(true);
    setTimeout(() => {
      setIsSyncingIntegrations(false);
      setLastSyncTime('Just now');
      setSyncConfirmationToast('All 4 Enterprise Adapters (SAP ERP, CMSMS, PARIVESH, ICIS) synchronized successfully.');
      setTimeout(() => setSyncConfirmationToast(null), 4000);
    }, 900);
  };

  const handleVerifyLedger = () => {
    setIsVerifyingChain(true);
    setTimeout(() => {
      setIsVerifyingChain(false);
      setVerifiedAt(new Date().toLocaleTimeString());
    }, 600);
  };

  const handleIngest = () => {
    onIngestDocument(selectedDoc);
    setIsIngested(true);
    setTimeout(() => setIsIngested(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Sub-tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Institutional Records & Connectors
            </span>
            <span className="text-xs text-slate-500 font-mono">Enterprise Interoperability</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Enterprise Integrations, Audit Ledger & Statutory Records
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Connective governance layer interfacing with CIL's SAP ERP, Ministry CMSMS satellite surveillance, and DGMS audit logs.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
          {[
            { id: 'integrations', label: 'CIL System Adapters', icon: Share2 },
            { id: 'audit', label: 'Audit Trail (SHA-256)', icon: ShieldCheck },
            { id: 'ocr', label: 'OCR Document Studio', icon: FileSearch },
            { id: 'contractors', label: 'Contractor Profiles', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  subTab === tab.id ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {syncConfirmationToast && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <span className="font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {syncConfirmationToast}
          </span>
        </div>
      )}

      {/* Sub-Tab 0: Enterprise System Adapters (NEW - Option 1) */}
      {subTab === 'integrations' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900">Governance Connective Architecture: </span>
              <span className="text-slate-600">
                MineGuard integrates over existing enterprise software—it does not require replacing CIL's operational infrastructure.
              </span>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Gateway Sync Status: 4 of 4 Services Active · Last Packet: <strong className="text-slate-800">{lastSyncTime}</strong>
              </div>
            </div>

            <button
              onClick={handleTriggerWebhookSync}
              disabled={isSyncingIntegrations}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-2 shrink-0 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingIntegrations ? 'animate-spin' : ''}`} />
              <span>{isSyncingIntegrations ? 'Synchronizing API Packets...' : 'Trigger Webhook Sync'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enterpriseSystems.map((sys) => (
              <div key={sys.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{sys.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        Active
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{sys.org}</div>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">API Endpoint:</span>
                    <span className="text-blue-900 font-semibold truncate max-w-[220px]">{sys.endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Protocol / Schema:</span>
                    <span className="text-slate-700">{sys.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Sync Interval:</span>
                    <span className="text-slate-800 font-bold">{sys.syncCadence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Volume:</span>
                    <span className="text-emerald-700 font-semibold">{sys.recordsSynced}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                  <strong className="text-slate-900 block mb-0.5">Ingested Payload Data:</strong>
                  {sys.payloadSummary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 1: SHA-256 Audit Trail */}
      {subTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Ledger Status:</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Cryptographic Continuity ({auditBlocks.length} Blocks)
              </span>
              {verifiedAt && <span className="text-slate-400 font-mono">· Verified at {verifiedAt}</span>}
            </div>

            <button
              onClick={handleVerifyLedger}
              disabled={isVerifyingChain}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-medium shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isVerifyingChain ? 'animate-spin' : ''}`} />
              <span>Verify Hashes</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <tr>
                    <th className="p-3">Block #</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">Summary & Signer</th>
                    <th className="p-3">Zone</th>
                    <th className="p-3">Block Hash (SHA-256)</th>
                    <th className="p-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditBlocks.map((b) => (
                    <tr key={b.blockNumber} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900">#{b.blockNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {b.eventType}
                        </span>
                      </td>
                      <td className="p-3 max-w-[260px] font-sans">
                        <div className="font-semibold text-slate-900">{b.summary}</div>
                        <div className="text-[11px] text-slate-500">{b.officerName}</div>
                      </td>
                      <td className="p-3 font-sans text-slate-700">{b.zone}</td>
                      <td className="p-3 text-slate-500 truncate max-w-[180px]">{b.blockHash}</td>
                      <td className="p-3 text-right">
                        <span className="text-emerald-700 text-[11px] font-semibold flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> Sealed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: OCR Document Studio */}
      {subTab === 'ocr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Scanned Document Samples</h3>
            <div className="space-y-2">
              {OCR_SAMPLES.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors text-xs ${
                    selectedDoc.id === doc.id ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-900">{doc.title}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{doc.issuingAuthority}</div>
                  <div className="text-[10px] font-mono text-blue-900 mt-1">{doc.documentType}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {selectedDoc.documentType}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDoc.title}</h3>
                <div className="text-slate-500 mt-0.5">{selectedDoc.issuingAuthority} · {selectedDoc.sampleDate}</div>
              </div>
              <button
                onClick={handleIngest}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs"
              >
                {isIngested ? '✓ Ingested!' : 'Ingest Document'}
              </button>
            </div>

            {/* Extracted Parameters Table */}
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                OCR Extracted Statutory Parameters (Confidence: {Math.round(selectedDoc.aiExtractionConfidence * 100)}%)
              </label>
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Observed Value</th>
                      <th className="p-2.5">Statutory Limit</th>
                      <th className="p-2.5 text-right">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedDoc.extractedParameters.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-sans font-medium text-slate-900">{p.label}</td>
                        <td className={`p-2.5 font-bold ${p.compliant ? 'text-slate-800' : 'text-rose-700'}`}>{p.value}</td>
                        <td className="p-2.5 text-slate-500">{p.benchmark}</td>
                        <td className="p-2.5 text-right font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.compliant ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {p.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Raw Text Excerpt */}
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                Raw Scanned Document Excerpt
              </label>
              <pre className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                {selectedDoc.rawTextExcerpt}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Contractor Directory */}
      {subTab === 'contractors' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="p-3">Contractor Name & Code</th>
                  <th className="p-3">Work Order</th>
                  <th className="p-3">Safety Score</th>
                  <th className="p-3">Active Workforce</th>
                  <th className="p-3">PF/ESIC Compliance</th>
                  <th className="p-3">Active Violations</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CONTRACTORS_DATA.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.vendorCode}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{c.workOrderNumber}</td>
                    <td className="p-3 font-mono">
                      <span className={`font-bold text-sm ${c.safetyScore < 70 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {c.safetyScore}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-800">{c.workforceCount} workers</td>
                    <td className="p-3 font-mono text-emerald-700 font-semibold">{c.pfEsicCompliance}%</td>
                    <td className="p-3 font-mono text-slate-800">{c.activeViolations} ({c.repeatViolations} repeat)</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.riskTier === 'high_risk' ? 'bg-rose-100 text-rose-800' :
                        c.riskTier === 'elevated' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.riskTier.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
