/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ComplianceTwin } from './components/ComplianceTwin';
import { GisRiskMap } from './components/GisRiskMap';
import { FieldAppSimulator } from './components/FieldAppSimulator';
import { WorkflowEscalation } from './components/WorkflowEscalation';
import { RecordsAudits } from './components/RecordsAudits';

import { 
  INITIAL_OBSERVATIONS, 
  INITIAL_CAPAS, 
  INITIAL_AUDIT_BLOCKS, 
  MINE_ZONES 
} from './data/mockData';
import { 
  UserRole, 
  InspectionObservation, 
  CorrectiveAction, 
  AuditLedgerBlock, 
  OcrDocumentSample 
} from './types/mineguard';
import { syncHash } from './utils/crypto';
import { Language } from './utils/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserRole>('mine_agent');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('en');

  // Core application state
  const [observations, setObservations] = useState<InspectionObservation[]>(INITIAL_OBSERVATIONS);
  const [capas, setCapas] = useState<CorrectiveAction[]>(INITIAL_CAPAS);
  const [auditBlocks, setAuditBlocks] = useState<AuditLedgerBlock[]>(INITIAL_AUDIT_BLOCKS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-north-pit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler for new observation from Field App
  const handleNewObservation = (obs: InspectionObservation) => {
    setObservations(prev => [obs, ...prev]);

    // Automatically create a corresponding Corrective Action (CAPA)
    const newCapaId = `CAPA-2026-${Math.floor(Math.random() * 900) + 100}`;
    const newCapa: CorrectiveAction = {
      id: newCapaId,
      observationId: obs.id,
      ticketNumber: obs.ticketNumber,
      title: `Remediate: ${obs.title}`,
      description: obs.description,
      assignedTo: 'Er. A. K. Banerjee (Mine Agent)',
      assignedRole: 'Mine Agent / GM Gevra Project',
      contractorName: obs.contractorName,
      priority: obs.severity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      hoursRemaining: 24.0,
      escalationTier: 1,
      escalationChain: [
        { tier: 1, title: 'Shift Safety Lead', authority: 'Field Office', slaHours: 12, contact: '+91-7752-240112' },
        { tier: 2, title: 'Mine Agent & General Manager', authority: 'Gevra Project Office', slaHours: 24, contact: '+91-7752-240890' },
        { tier: 3, title: 'Director (Tech) SECL & DGMS', authority: 'Corporate & Regional HQ', slaHours: 48, contact: '+91-7752-246001' }
      ]
    };
    setCapas(prev => [newCapa, ...prev]);

    // Append block to SHA-256 Audit Trail
    const lastBlock = auditBlocks[auditBlocks.length - 1];
    const newBlockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1001;
    const payloadStr = JSON.stringify({ obsId: obs.id, ticket: obs.ticketNumber, hash: obs.evidenceHash });
    const newBlockHash = syncHash(payloadStr + (lastBlock ? lastBlock.blockHash : '0x00'));

    const newBlock: AuditLedgerBlock = {
      blockNumber: newBlockNumber,
      timestamp: new Date().toISOString(),
      eventType: 'INSPECTION_SUBMITTED',
      officerId: obs.officerId,
      officerName: obs.officerName,
      zone: obs.zoneName,
      summary: `Logged ${obs.severity} observation: ${obs.title}. Cryptographic evidence sealed.`,
      payloadHash: obs.evidenceHash,
      previousHash: lastBlock ? lastBlock.blockHash : '0x00000000',
      blockHash: newBlockHash,
      verified: true
    };
    setAuditBlocks(prev => [...prev, newBlock]);

    showToast(`✓ Field observation ${obs.ticketNumber} logged and sealed into Audit Block #${newBlockNumber}!`);
  };

  // Handler for CAPA closure
  const handleVerifyCloseCapa = (capaId: string, notes: string) => {
    setCapas(prev => prev.map(c => {
      if (c.id === capaId) {
        return {
          ...c,
          status: 'closed',
          verifiedBy: 'Er. Rajeshwar Nath (DGMS Cert #8821)',
          verifiedAt: new Date().toLocaleDateString(),
          hoursRemaining: 0
        };
      }
      return c;
    }));

    // Append verification block to audit ledger
    const lastBlock = auditBlocks[auditBlocks.length - 1];
    const newBlockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1001;
    const payloadStr = JSON.stringify({ capaId, notes, verifier: 'Er. Rajeshwar Nath' });
    const newBlockHash = syncHash(payloadStr + (lastBlock ? lastBlock.blockHash : '0x00'));

    const newBlock: AuditLedgerBlock = {
      blockNumber: newBlockNumber,
      timestamp: new Date().toISOString(),
      eventType: 'CLOSURE_APPROVED',
      officerId: 'INSP-SECL-4108',
      officerName: 'Er. Rajeshwar Nath (DGMS Inspector)',
      zone: 'Mine Working Face',
      summary: `Verified closure of Corrective Action ${capaId}. Compliance restored under CMR 2017.`,
      payloadHash: syncHash(notes),
      previousHash: lastBlock ? lastBlock.blockHash : '0x00000000',
      blockHash: newBlockHash,
      verified: true
    };
    setAuditBlocks(prev => [...prev, newBlock]);

    showToast(`✓ CAPA ${capaId} verified and closed! Audit Block #${newBlockNumber} permanently committed.`);
  };

  // Handler for OCR Ingestion
  const handleIngestOcrDocument = (doc: OcrDocumentSample) => {
    const lastBlock = auditBlocks[auditBlocks.length - 1];
    const newBlockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1001;
    const payloadStr = JSON.stringify({ docId: doc.id, type: doc.documentType, issuer: doc.issuingAuthority });
    const newBlockHash = syncHash(payloadStr + (lastBlock ? lastBlock.blockHash : '0x00'));

    const newBlock: AuditLedgerBlock = {
      blockNumber: newBlockNumber,
      timestamp: new Date().toISOString(),
      eventType: 'OCR_DIGITIZED',
      officerId: 'SYS-OCR-ENGINE',
      officerName: 'MineGuard OCR Pipeline',
      zone: 'Central Records Archive',
      summary: `Digitized ${doc.title}. Key statutory entities mapped to Compliance Knowledge Graph.`,
      payloadHash: syncHash(doc.rawTextExcerpt),
      previousHash: lastBlock ? lastBlock.blockHash : '0x00000000',
      blockHash: newBlockHash,
      verified: true
    };
    setAuditBlocks(prev => [...prev, newBlock]);

    showToast(`✓ Document ${doc.title} ingested and sealed into Block #${newBlockNumber}!`);
  };

  const handleDispatchInspection = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setActiveTab('inspections');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Universal Government Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-3 text-xs border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <OverviewDashboard
            userRole={userRole}
            setActiveTab={setActiveTab}
            onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
            observations={observations}
            capas={capas}
          />
        )}

        {activeTab === 'inspections' && (
          <FieldAppSimulator
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            onNewObservationSubmitted={handleNewObservation}
            observations={observations}
          />
        )}

        {activeTab === 'twin' && (
          <ComplianceTwin />
        )}

        {activeTab === 'gis' && (
          <GisRiskMap
            selectedZoneId={selectedZoneId}
            onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
            onDispatchInspection={handleDispatchInspection}
          />
        )}

        {activeTab === 'workflow' && (
          <WorkflowEscalation
            capas={capas}
            onVerifyCloseCapa={handleVerifyCloseCapa}
            observations={observations}
          />
        )}

        {activeTab === 'records' && (
          <RecordsAudits
            auditBlocks={auditBlocks}
            onIngestDocument={handleIngestOcrDocument}
          />
        )}
      </main>

      {/* Official Government of India Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">MineGuard</span>
            <span>·</span>
            <span>Ministry of Coal, Government of India & Coal India Limited</span>
            <span>·</span>
            <span className="font-mono text-slate-600">SIH 2026 PS ID #26024</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>DGMS Coal Mines Regulations 2017 Compliant</span>
            <span>·</span>
            <span>NIC Standards Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
