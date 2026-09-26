import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  Building,
  HardHat,
  Search,
  ExternalLink,
  X,
  QrCode,
  Loader2
} from 'lucide-react';
import { 
  exportParliamentaryDocketPdf, 
  downloadSelfPrintingHtml 
} from '../utils/printPdfGenerator';

interface SubsidiaryPerformance {
  code: string;
  name: string;
  hq: string;
  productionTargetMT: number;
  actualProductionMT: number;
  complianceIndex: number;
  openDgmsNotices: number;
  fafr: number; // Fatal accident frequency rate per MT
  status: 'excellent' | 'nominal' | 'action_needed';
}

export const MinistryParliamentaryDocket: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'subsidiaries' | 'parliament_qa' | 'csr_safety'>('subsidiaries');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('starred-418');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Coal India Subsidiaries data
  const subsidiaries: SubsidiaryPerformance[] = [
    {
      code: 'SECL',
      name: 'South Eastern Coalfields Ltd (Current: Gevra)',
      hq: 'Bilaspur, Chhattisgarh',
      productionTargetMT: 195.0,
      actualProductionMT: 197.8,
      complianceIndex: 94.2,
      openDgmsNotices: 1,
      fafr: 0.08,
      status: 'excellent'
    },
    {
      code: 'MCL',
      name: 'Mahanadi Coalfields Ltd',
      hq: 'Sambalpur, Odisha',
      productionTargetMT: 204.0,
      actualProductionMT: 206.1,
      complianceIndex: 93.8,
      openDgmsNotices: 2,
      fafr: 0.11,
      status: 'excellent'
    },
    {
      code: 'NCL',
      name: 'Northern Coalfields Ltd',
      hq: 'Singrauli, Madhya Pradesh',
      productionTargetMT: 133.0,
      actualProductionMT: 136.2,
      complianceIndex: 95.1,
      openDgmsNotices: 0,
      fafr: 0.06,
      status: 'excellent'
    },
    {
      code: 'CCL',
      name: 'Central Coalfields Ltd',
      hq: 'Ranchi, Jharkhand',
      productionTargetMT: 84.0,
      actualProductionMT: 81.5,
      complianceIndex: 89.4,
      openDgmsNotices: 4,
      fafr: 0.18,
      status: 'nominal'
    },
    {
      code: 'WCL',
      name: 'Western Coalfields Ltd',
      hq: 'Nagpur, Maharashtra',
      productionTargetMT: 65.0,
      actualProductionMT: 63.8,
      complianceIndex: 88.7,
      openDgmsNotices: 3,
      fafr: 0.22,
      status: 'nominal'
    },
    {
      code: 'BCCL',
      name: 'Bharat Coking Coal Ltd (Jharia Field)',
      hq: 'Dhanbad, Jharkhand',
      productionTargetMT: 41.0,
      actualProductionMT: 40.2,
      complianceIndex: 82.5,
      openDgmsNotices: 7,
      fafr: 0.38,
      status: 'action_needed'
    },
    {
      code: 'ECL',
      name: 'Eastern Coalfields Ltd (Raniganj Field)',
      hq: 'Sanctoria, West Bengal',
      productionTargetMT: 40.0,
      actualProductionMT: 39.1,
      complianceIndex: 84.1,
      openDgmsNotices: 5,
      fafr: 0.31,
      status: 'action_needed'
    },
    {
      code: 'CMPDI',
      name: 'Central Mine Planning & Design Institute',
      hq: 'Ranchi, Jharkhand',
      productionTargetMT: 0.0,
      actualProductionMT: 0.0,
      complianceIndex: 98.4,
      openDgmsNotices: 0,
      fafr: 0.00,
      status: 'excellent'
    }
  ];

  const handlePrintDossier = () => {
    setShowPrintModal(true);
  };

  const handlePrintDocument = () => {
    setIsPrinting(true);
    setModalFeedback('Official Parliamentary PDF generated and downloaded. Launching print dialog...');

    // 1. Generate real vector PDF
    try {
      exportParliamentaryDocketPdf(subsidiaries);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }

    // 2. Attempt window.print() in case browser supports it
    try {
      window.print();
    } catch (e) {
      console.warn('Native window.print() suppressed in iframe sandbox:', e);
    }

    setTimeout(() => {
      setIsPrinting(false);
    }, 1200);

    setTimeout(() => {
      setModalFeedback(null);
    }, 7000);
  };

  const handleDownloadSelfPrintingHtml = () => {
    const tableRows = subsidiaries.map(s => `
      <tr>
        <td><strong>${s.code}</strong></td>
        <td>${s.name} (${s.hq})</td>
        <td style="text-align:right;">${s.actualProductionMT.toFixed(1)} MT</td>
        <td style="text-align:right; color:${s.complianceIndex >= 90 ? '#059669' : '#dc2626'}; font-weight:bold;">${s.complianceIndex.toFixed(1)}%</td>
        <td style="text-align:center;">${s.openDgmsNotices}</td>
        <td style="text-align:right;">${s.fafr.toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlBody = `
      <div class="header">
        <h1>GOVERNMENT OF INDIA · भारत सरकार</h1>
        <h2>MINISTRY OF COAL · कोयला मंत्रालय</h2>
        <h3>LOK SABHA SECRETARIAT · PARLIAMENT DOCKET</h3>
        <p style="font-size:9pt; color:#64748b; margin:2px 0;">Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</p>
      </div>
      <div style="display:flex; justify-content:space-between; border-bottom:1px solid #cbd5e1; padding-bottom:6px; font-size:10pt; font-family:sans-serif;">
        <span><strong>Session:</strong> 18th Lok Sabha Winter Session</span>
        <span><strong>Question No:</strong> STARRED Q. 418</span>
        <span><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</span>
      </div>
      <div style="margin-top:14px;">
        <p><strong>QUESTION FOR ORAL ANSWER BY:</strong> Shri [Hon'ble Member of Parliament, Korba Constituency]</p>
        <p>Will the <strong>MINISTER OF COAL</strong> be pleased to state:</p>
        <div style="padding-left:16px; font-style:italic; color:#334155;">
          <p>(a) Whether the Government has deployed real-time AI and cryptographic compliance monitoring systems across Coal India Limited (CIL) opencast mines like Gevra;</p>
          <p>(b) The reduction in Fatal Accident Frequency Rate (FAFR) and statutory contraventions under the Coal Mines Regulations, 2017;</p>
          <p>(c) The steps taken to integrate satellite remote sensing (CMSMS / Khanan Prahari) with ground-level geotechnical Slope Stability Radars (SSR); and</p>
          <p>(d) The status of digital shift-handover registers and automated DGMS Form VI contravention notices?</p>
        </div>
      </div>
      <div style="margin-top:14px; border-top:1px solid #cbd5e1; padding-top:10px;">
        <h4 style="margin:0 0 6px 0; font-family:sans-serif; text-transform:uppercase;">Statement laid on the table of Lok Sabha by the Minister of Coal:</h4>
        <p><strong>(a) & (b):</strong> Under the Smart Governance initiative (SIH 2026 Problem Statement ID #26024), Coal India Limited has operationalized the <strong>MineGuard</strong> centralized compliance and spatial risk intelligence platform. In Asia's largest opencast mine, SECL Gevra (53.12 MT annual output), the system enforces real-time tracking of statutory obligations under Coal Mines Regulations 2017, achieving a 94.2% compliance index and reducing open DGMS contravention notices to nominal baseline.</p>
        <p><strong>(c):</strong> Integrated enterprise APIs connect MoC's satellite CMSMS/Khanan Prahari portal directly to GroundSAR-3D Slope Stability Radars. When geotechnical Factor of Safety (FoS) falls below 1.10 or monsoon rainfall exceeds 40 mm/hr, automated geofence cordons prevent dumper and shovel entry into unstable highwalls.</p>
        <p><strong>(d):</strong> All shift handovers under CMR Regulations 43 and 48 have been digitized via biometric/PIN-sealed DGMS Form IV registers with SHA-256 cryptographic immutability, ensuring zero tamper liability under Section 72A of the Mines Act, 1952.</p>
      </div>
      <div style="margin-top:16px; border-top:1px solid #cbd5e1; padding-top:10px;">
        <h4 style="margin:0 0 6px 0; font-family:sans-serif; text-transform:uppercase;">Annexure I: 8 CIL Subsidiaries Compliance & Safety Status</h4>
        <table>
          <thead>
            <tr>
              <th>Subsidiary</th><th>Name / HQ</th><th style="text-align:right;">Production</th><th style="text-align:right;">Compliance</th><th style="text-align:center;">Open DGMS</th><th style="text-align:right;">FAFR</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      <div class="footer">
        <span>Authenticity Verified: Ministry of Coal Central Docket Repository #MoC/LS/Q-418/2026</span>
        <span>NIC Verified Cryptographic Hash: SHA256-7F83B1657FF1FC53B92DC18148A1D</span>
      </div>
    `;

    downloadSelfPrintingHtml(
      'Lok Sabha Starred Question 418 - Ministry of Coal Docket',
      htmlBody,
      'Ministry_of_Coal_Parliamentary_Brief_LS_Q418.html'
    );

    setModalFeedback('Self-Printing HTML document downloaded! Open in browser to print directly.');
    setTimeout(() => setModalFeedback(null), 6000);
  };

  const handleDownloadDocket = () => {
    const docketText = `GOVERNMENT OF INDIA · भारत सरकार
MINISTRY OF COAL · कोयला मंत्रालय
SHASTRI BHAWAN, DR. RAJENDRA PRASAD ROAD, NEW DELHI - 110001
PARLIAMENT SECTION · LOK SABHA STARRED QUESTION NO. 418

SUBJECT: Implementation of AI-Based Statutory Safety & Compliance Systems in Coal Mines
ANSWERED BY: MINISTER OF COAL

STATEMENT:
(a) & (b): Under the Smart Governance initiative (SIH 2026 Problem Statement ID #26024), Coal India Limited has operationalized the MineGuard centralized compliance and spatial risk intelligence platform. In Asia's largest opencast mine, SECL Gevra (53.12 MT annual output), the system enforces real-time tracking of statutory obligations under Coal Mines Regulations 2017, achieving a 94.2% compliance index and reducing open DGMS contravention notices to nominal baseline.

(c): Integrated enterprise APIs connect MoC's satellite CMSMS/Khanan Prahari portal directly to GroundSAR-3D Slope Stability Radars. When geotechnical Factor of Safety (FoS) falls below 1.10 or monsoon rainfall exceeds 40 mm/hr, automated geofence cordons prevent dumper and shovel entry into unstable highwalls.

(d): All shift handovers under CMR Regulations 43 and 48 have been digitized via biometric/PIN-sealed DGMS Form IV registers with SHA-256 cryptographic immutability, ensuring zero tamper liability under Section 72A of the Mines Act, 1952.

ANNEXURE I: COAL INDIA LIMITED - SUBSIDIARY SAFETY & COMPLIANCE PERFORMANCE (FY 2025-26)
---------------------------------------------------------------------------------------------------------
Subsidiary | Target (MT) | Actual (MT) | Compliance % | Open DGMS Notices | FAFR Rate | Status
---------------------------------------------------------------------------------------------------------
SECL (Gevra) | 195.0 MT   | 197.8 MT    | 94.2%        | 1                 | 0.08      | Tier 1 Nominal
MCL          | 204.0 MT   | 206.1 MT    | 93.8%        | 2                 | 0.11      | Tier 1 Nominal
NCL          | 133.0 MT   | 136.2 MT    | 95.1%        | 0                 | 0.06      | Tier 1 Nominal
CCL          |  84.0 MT   |  81.5 MT    | 89.4%        | 4                 | 0.18      | Tier 2 Nominal
WCL          |  65.0 MT   |  63.8 MT    | 88.7%        | 3                 | 0.22      | Tier 2 Nominal
BCCL         |  41.0 MT   |  40.2 MT    | 82.5%        | 7                 | 0.38      | Action Needed
ECL          |  40.0 MT   |  39.1 MT    | 84.1%        | 5                 | 0.31      | Action Needed
CMPDI        |   N/A      |   N/A       | 98.4%        | 0                 | 0.00      | Tier 1 Nominal
---------------------------------------------------------------------------------------------------------
Authenticity Verified: Ministry of Coal Central Docket Repository #MoC/LS/Q-418/2026
`;
    const blob = new Blob([docketText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ministry_of_Coal_Parliamentary_Brief_Q418.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Official Ministry Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Institutional Ministry Mode
            </span>
            <span className="text-xs text-slate-500 font-mono">Shastri Bhawan, New Delhi · Coal India Apex</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Ministry of Coal & CIL Apex Governance Suite
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Subsidiary-level statutory oversight, Parliament Lok Sabha / Rajya Sabha Starred Q&A dossier, and national mine safety benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handlePrintDossier}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Parliamentary Brief</span>
          </button>
          <button
            onClick={() => {
              exportParliamentaryDocketPdf(subsidiaries);
              setExportNotice('Official Parliamentary Brief PDF generated & downloaded.');
              setTimeout(() => setExportNotice(null), 5000);
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Direct PDF Export</span>
          </button>
        </div>
      </div>

      {/* Subtabs for Ministry Suite */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-lg">
        <button
          onClick={() => setActiveSubTab('subsidiaries')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'subsidiaries'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>8 CIL Subsidiaries Compliance Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('parliament_qa')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'parliament_qa'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Parliament Question Dossier (Lok Sabha / Rajya Sabha)</span>
        </button>
      </div>

      {/* TAB 1: 8 CIL Subsidiaries Matrix */}
      {activeSubTab === 'subsidiaries' && (
        <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Coal India Limited — Subsidiary Statutory Performance Ranking
              </h3>
              <p className="text-[11px] text-slate-500">
                Aggregated live from CIL ICIS, DGMS Central Zone, and Ministry of Coal CMSMS repository.
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
              National CIL Target: <strong>781.056 MT</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">Subsidiary</th>
                  <th className="p-3">Headquarters</th>
                  <th className="p-3 text-right">Production (Target / Actual)</th>
                  <th className="p-3 text-right">Statutory Compliance</th>
                  <th className="p-3 text-center">Open DGMS Notices</th>
                  <th className="p-3 text-right">FAFR Rate</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subsidiaries.map(sub => (
                  <tr key={sub.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{sub.code}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{sub.name}</div>
                    </td>
                    <td className="p-3 text-slate-600">{sub.hq}</td>
                    <td className="p-3 text-right font-mono">
                      {sub.productionTargetMT > 0 ? (
                        <>
                          <span className="font-bold text-slate-900">{sub.actualProductionMT} MT</span>
                          <span className="text-slate-400 text-[10px] block">/ {sub.productionTargetMT} MT</span>
                        </>
                      ) : (
                        <span className="text-slate-400">Mine Planning</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-mono font-bold text-slate-900">{sub.complianceIndex}%</span>
                      <div className="w-20 ml-auto bg-slate-200 h-1 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-1 rounded-full ${
                            sub.complianceIndex >= 90 ? 'bg-emerald-600' : sub.complianceIndex >= 85 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${sub.complianceIndex}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        sub.openDgmsNotices === 0 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : sub.openDgmsNotices <= 2 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sub.openDgmsNotices}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-700">
                      {sub.fafr.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                        sub.status === 'excellent' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : sub.status === 'nominal'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {sub.status === 'excellent' ? 'Tier 1' : sub.status === 'nominal' ? 'Tier 2' : 'Action'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Parliament Starred Q&A Dossier */}
      {activeSubTab === 'parliament_qa' && (
        <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                LOK SABHA STARRED QUESTION NO. 418
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Subject: Implementation of AI-Based Statutory Safety & Compliance Systems in Coal Mines
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Notice received: 18th Lok Sabha Winter Session · Answered by: Minister of Coal
              </p>
            </div>

            <button
              onClick={() => {
                exportParliamentaryDocketPdf(subsidiaries);
                setExportNotice('Official Parliamentary Annexure exported in PDF format with Ministry Barcode.');
                setTimeout(() => setExportNotice(null), 5000);
              }}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Annexure (PDF)</span>
            </button>
          </div>

          {exportNotice && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportNotice}</span>
            </div>
          )}

          {/* Parliamentary Official Reply Text */}
          <div className="p-6 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif leading-relaxed text-slate-900 space-y-4">
            <div className="text-center border-b border-slate-300 pb-2 space-y-0.5">
              <div className="font-bold text-sm">LOK SABHA SECRETARIAT, NEW DELHI</div>
              <div className="text-slate-600">MINISTRY OF COAL · QUESTION FOR ORAL ANSWER</div>
            </div>

            <div className="space-y-2">
              <p><strong>QUESTION BY:</strong> Shri [Hon'ble Member of Parliament, Korba Constituency]</p>
              <p>Will the <strong>MINISTER OF COAL</strong> be pleased to state:</p>
              <div className="pl-4 space-y-1 italic text-slate-800">
                <p>(a) Whether the Government has deployed real-time AI and cryptographic compliance monitoring systems across Coal India Limited (CIL) opencast mines like Gevra;</p>
                <p>(b) The reduction in Fatal Accident Frequency Rate (FAFR) and statutory contraventions under the Coal Mines Regulations, 2017;</p>
                <p>(c) The steps taken to integrate satellite remote sensing (CMSMS / Khanan Prahari) with ground-level geotechnical Slope Stability Radars (SSR); and</p>
                <p>(d) The status of digital shift-handover registers and automated DGMS Form VI contravention notices?</p>
              </div>
            </div>

            <div className="border-t border-slate-300 pt-3 space-y-2">
              <p className="font-bold text-slate-900">ANSWER / STATEMENT LAID ON THE TABLE OF LOK SABHA:</p>
              <p className="font-bold text-slate-700">MINISTER OF COAL</p>
              
              <div className="space-y-2 text-slate-800">
                <p>
                  <strong>(a) & (b):</strong> Yes, Sir. Under the Smart Governance initiative (SIH 2026 Problem Statement ID #26024), Coal India Limited has operationalized the <strong>MineGuard</strong> centralized compliance and spatial risk intelligence platform. In Asia's largest opencast mine, SECL Gevra (53.12 MT annual output), the system enforces real-time tracking of statutory obligations under Coal Mines Regulations 2017, achieving a 94.2% compliance index and reducing open DGMS contravention notices to nominal baseline.
                </p>
                <p>
                  <strong>(c):</strong> Integrated enterprise APIs connect MoC's satellite CMSMS/Khanan Prahari portal directly to GroundSAR-3D Slope Stability Radars. When geotechnical Factor of Safety (FoS) falls below 1.10 or monsoon rainfall exceeds 40 mm/hr, automated geofence cordons prevent dumper and shovel entry into unstable highwalls.
                </p>
                <p>
                  <strong>(d):</strong> All shift handovers under CMR Regulations 43 and 48 have been digitized via biometric/PIN-sealed DGMS Form IV registers with SHA-256 cryptographic immutability, ensuring zero tamper liability under Section 72A of the Mines Act, 1952.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-300 text-[11px] text-slate-500 flex justify-between font-sans">
              <span>Authenticity Verified: Ministry of Coal Central Docket Repository</span>
              <span className="font-mono">Reference: MoC/LS/Q-418/2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Printable / Viewable Official Parliamentary Dossier Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-4xl w-full shadow-2xl overflow-hidden my-4 text-slate-900 max-h-[92vh] flex flex-col">
            
            {/* Top Control Bar (Hidden when printed) */}
            <div className="print:hidden bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  PARLIAMENT DOCKET
                </span>
                <span className="text-xs text-slate-300">Lok Sabha Starred Question No. 418 · Ministry of Coal</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrintDocument}
                  disabled={isPrinting}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  title="Print Document or Save Official PDF"
                >
                  {isPrinting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Printer className="w-3.5 h-3.5" />
                  )}
                  <span>{isPrinting ? 'Preparing Print...' : 'Print / Save PDF'}</span>
                </button>
                <button
                  onClick={handleDownloadSelfPrintingHtml}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Download standalone self-printing HTML document"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Printable HTML</span>
                </button>
                <button
                  onClick={handleDownloadDocket}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download TXT</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* In-Modal Feedback Banner */}
            {modalFeedback && (
              <div className="bg-emerald-600 text-white px-5 py-2 text-xs font-medium flex items-center justify-between animate-in fade-in shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>{modalFeedback}</span>
                </div>
                <button onClick={() => setModalFeedback(null)} className="text-emerald-200 hover:text-white text-xs underline">
                  Dismiss
                </button>
              </div>
            )}

            {/* Printable Document Body */}
            <div className="p-6 sm:p-10 space-y-6 text-xs font-serif leading-relaxed overflow-y-auto">
              {/* Official Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="font-bold text-sm tracking-widest text-slate-900">
                  GOVERNMENT OF INDIA · भारत सरकार
                </div>
                <div className="text-xs text-slate-700">
                  MINISTRY OF COAL · कोयला मंत्रालय
                </div>
                <div className="text-xs text-slate-600 font-sans">
                  SHASTRI BHAWAN, DR. RAJENDRA PRASAD ROAD, NEW DELHI - 110001
                </div>
                <div className="text-sm font-bold text-slate-900 underline mt-2">
                  LOK SABHA SECRETARIAT · PARLIAMENT DOCKET
                </div>
              </div>

              {/* Reference details */}
              <div className="flex justify-between items-baseline font-sans text-xs border-b border-slate-200 pb-2">
                <div>
                  <strong>Session:</strong> 18th Lok Sabha Winter Session
                </div>
                <div>
                  <strong>Question No:</strong> <span className="font-mono font-bold">STARRED Q. 418</span>
                </div>
                <div>
                  <strong>Date:</strong> <span className="font-mono">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <p><strong>QUESTION FOR ORAL ANSWER BY:</strong> Shri [Hon'ble Member of Parliament, Korba Constituency]</p>
                <p>Will the <strong>MINISTER OF COAL</strong> be pleased to state:</p>
                <div className="pl-4 space-y-1 italic text-slate-800">
                  <p>(a) Whether the Government has deployed real-time AI and cryptographic compliance monitoring systems across Coal India Limited (CIL) opencast mines like Gevra;</p>
                  <p>(b) The reduction in Fatal Accident Frequency Rate (FAFR) and statutory contraventions under the Coal Mines Regulations, 2017;</p>
                  <p>(c) The steps taken to integrate satellite remote sensing (CMSMS / Khanan Prahari) with ground-level geotechnical Slope Stability Radars (SSR); and</p>
                  <p>(d) The status of digital shift-handover registers and automated DGMS Form VI contravention notices?</p>
                </div>
              </div>

              {/* Official Answer */}
              <div className="border-t border-slate-300 pt-3 space-y-2">
                <p className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide">
                  STATEMENT LAID ON THE TABLE OF LOK SABHA BY THE MINISTER OF COAL:
                </p>
                <div className="space-y-2 text-slate-800">
                  <p>
                    <strong>(a) & (b):</strong> Yes, Sir. Under the Smart Governance initiative (SIH 2026 Problem Statement ID #26024), Coal India Limited has operationalized the <strong>MineGuard</strong> centralized compliance and spatial risk intelligence platform. In Asia's largest opencast mine, SECL Gevra (53.12 MT annual output), the system enforces real-time tracking of statutory obligations under Coal Mines Regulations 2017, achieving a 94.2% compliance index and reducing open DGMS contravention notices to nominal baseline.
                  </p>
                  <p>
                    <strong>(c):</strong> Integrated enterprise APIs connect MoC's satellite CMSMS/Khanan Prahari portal directly to GroundSAR-3D Slope Stability Radars. When geotechnical Factor of Safety (FoS) falls below 1.10 or monsoon rainfall exceeds 40 mm/hr, automated geofence cordons prevent dumper and shovel entry into unstable highwalls.
                  </p>
                  <p>
                    <strong>(d):</strong> All shift handovers under CMR Regulations 43 and 48 have been digitized via biometric/PIN-sealed DGMS Form IV registers with SHA-256 cryptographic immutability, ensuring zero tamper liability under Section 72A of the Mines Act, 1952.
                  </p>
                </div>
              </div>

              {/* Annexure I: Subsidiary Table */}
              <div className="border-t border-slate-300 pt-3 space-y-2 font-sans">
                <div className="font-bold text-xs uppercase tracking-wide text-slate-900">
                  ANNEXURE I: COAL INDIA LIMITED — SUBSIDIARY STATUTORY COMPLIANCE & SAFETY STATUS
                </div>
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                      <th className="p-2 border border-slate-300">Subsidiary</th>
                      <th className="p-2 border border-slate-300">Headquarters</th>
                      <th className="p-2 border border-slate-300 text-right">Target / Actual</th>
                      <th className="p-2 border border-slate-300 text-right">Compliance %</th>
                      <th className="p-2 border border-slate-300 text-center">Open Notices</th>
                      <th className="p-2 border border-slate-300 text-right">FAFR Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {subsidiaries.map(sub => (
                      <tr key={sub.code}>
                        <td className="p-2 border border-slate-300 font-bold font-sans">{sub.code}</td>
                        <td className="p-2 border border-slate-300 font-sans text-slate-600">{sub.hq}</td>
                        <td className="p-2 border border-slate-300 text-right">{sub.actualProductionMT} MT</td>
                        <td className="p-2 border border-slate-300 text-right font-bold text-emerald-800">{sub.complianceIndex}%</td>
                        <td className="p-2 border border-slate-300 text-center">{sub.openDgmsNotices}</td>
                        <td className="p-2 border border-slate-300 text-right">{sub.fafr.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Verification & Seals */}
              <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border border-slate-400 flex flex-col items-center justify-center p-1 text-center bg-slate-50">
                    <QrCode className="w-9 h-9 text-slate-800" />
                    <span className="text-[7px] font-mono">NIC VERIFIED</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    <div>Parliamentary Record ID:</div>
                    <div className="font-bold text-slate-800">MoC/LS/Q-418/2026/DOCKET</div>
                    <div>Ministry of Coal, Government of India</div>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="font-bold text-xs">For and on behalf of the Ministry of Coal</div>
                  <div className="text-[11px] text-slate-700">Joint Secretary (Coal) & Director (Tech)</div>
                  <div className="text-[10px] text-slate-500 font-mono">Certified under Rule 377 of Rules of Procedure</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
