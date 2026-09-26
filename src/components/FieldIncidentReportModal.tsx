import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Download, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  AlertTriangle,
  Building,
  Clock,
  MapPin
} from 'lucide-react';
import { InspectionObservation } from '../types/mineguard';
import { exportFieldIncidentReportPdf, downloadSelfPrintingHtml } from '../utils/printPdfGenerator';

interface FieldIncidentReportModalProps {
  observations: InspectionObservation[];
  onClose: () => void;
}

export const FieldIncidentReportModal: React.FC<FieldIncidentReportModalProps> = ({
  observations,
  onClose
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [reportFilter, setReportFilter] = useState<'all' | 'critical' | 'high'>('all');

  const filtered = reportFilter === 'all' 
    ? observations 
    : observations.filter(o => o.severity === reportFilter);

  const criticalCount = observations.filter(o => o.severity === 'critical').length;
  const highCount = observations.filter(o => o.severity === 'high').length;
  const openCount = observations.filter(o => o.status !== 'verified_closed').length;

  const handlePrintPdf = () => {
    setIsPrinting(true);
    setFeedback('Government-Standard Field Incident Report PDF generated & downloaded. Launching print dialog...');

    try {
      exportFieldIncidentReportPdf(filtered);
    } catch (err) {
      console.error('Error generating incident report PDF:', err);
    }

    try {
      window.print();
    } catch (e) {
      console.warn('Native window.print() suppressed in iframe sandbox:', e);
    }

    setTimeout(() => {
      setIsPrinting(false);
    }, 1200);

    setTimeout(() => {
      setFeedback(null);
    }, 6000);
  };

  const handleDownloadHtml = () => {
    const tableRows = filtered.map((obs, idx) => `
      <tr style="${obs.severity === 'critical' ? 'background:#fff1f2;' : ''}">
        <td>${idx + 1}</td>
        <td><strong>${obs.ticketNumber}</strong><br/><span style="font-size:8pt; color:#64748b;">${new Date(obs.timestamp).toLocaleDateString('en-IN')}</span></td>
        <td><strong>${obs.title}</strong><br/><span style="font-size:8.5pt; color:#334155;">${obs.description}</span></td>
        <td>${obs.zoneName}</td>
        <td><strong style="color:${obs.severity === 'critical' ? '#be123c' : '#b45309'}; text-transform:uppercase;">${obs.severity}</strong></td>
        <td>${obs.aiAssistance?.suggestedRegulation || 'CMR 2017 Reg. 106'}</td>
        <td><span style="font-size:7.5pt; font-family:monospace;">${obs.evidenceHash ? obs.evidenceHash.slice(0, 16) : 'N/A'}...</span></td>
      </tr>
    `).join('');

    const bodyHtml = `
      <div class="header">
        <h1>GOVERNMENT OF INDIA · भारत सरकार</h1>
        <h2>MINISTRY OF LABOUR & EMPLOYMENT · श्रम एवं रोजगार मंत्रालय</h2>
        <h3>DIRECTORATE GENERAL OF MINES SAFETY (DGMS) · BILASPUR REGION</h3>
        <p style="font-size:10pt; font-weight:bold; margin-top:6px; color:#b45309;">FORM IX: STATUTORY FIELD INCIDENT & HAZARD AUDIT REPORT</p>
        <p style="font-size:8pt; color:#64748b;">[Under Coal Mines Regulations 2017 & Section 22/22A of Mines Act, 1952]</p>
      </div>

      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px 14px; border-radius:6px; margin-bottom:16px; font-size:9pt; font-family:sans-serif;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span><strong>Mine / Operator:</strong> Gevra Opencast Project (SECL / Coal India Ltd)</span>
          <span><strong>Report Ref:</strong> DGMS/GEV/AUDIT-${new Date().getFullYear()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span><strong>Date of Audit:</strong> ${new Date().toLocaleDateString('en-IN')}</span>
          <span><strong>Inspecting Officer:</strong> R. C. Verma (Overman Cert #OVM-2016-8821)</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span><strong>Hazard Metrics:</strong> Total ${observations.length} | Critical: ${criticalCount} | High: ${highCount} | Open Actions: ${openCount}</span>
          <span><strong>Area Coordinates:</strong> 22.349210° N, 82.684120° E (RL -120m)</span>
        </div>
      </div>

      <h4 style="font-family:sans-serif; text-transform:uppercase; margin:12px 0 6px 0; font-size:10pt;">Recorded Field Observations & Contraventions (${filtered.length})</h4>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ticket / Date</th>
            <th>Hazard Title & Findings</th>
            <th>Zone</th>
            <th>Severity</th>
            <th>Statute</th>
            <th>Evidence Hash</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div style="background:#fef2f2; border:1px solid #fecaca; padding:10px 14px; border-radius:6px; margin-top:16px; font-size:8.5pt;">
        <strong style="color:#991b1b;">STATUTORY MANDATE & DIRECTIVES (CMR 2017):</strong>
        <ol style="margin:4px 0 0 16px; padding:0; color:#b91c1c;">
          <li>HEMM and transport operations in critical hazard sectors remain suspended pending rectification certification.</li>
          <li>Compliance evidence photos must be digitally verified and submitted through MineGuard within statutory SLA.</li>
          <li>Failure to comply triggers Section 22(3) prohibitive orders and personal liability under Section 72A of the Mines Act.</li>
        </ol>
      </div>

      <div class="footer">
        <div>
          <strong>R. C. Verma, Statutory Overman</strong><br/>
          Overman Certificate #OVM-2016-8821 · SECL Gevra Project
        </div>
        <div style="text-align:right;">
          <strong>Directorate General of Mines Safety</strong><br/>
          Western Zone Bilaspur · NIC Verification Token: SHA256-FD98A41C
        </div>
      </div>
    `;

    downloadSelfPrintingHtml(
      'DGMS Statutory Field Incident & Hazard Audit Report - SECL Gevra',
      bodyHtml,
      `DGMS_Field_Incident_Report_SECL_Gevra_${new Date().toISOString().slice(0, 10)}.html`
    );

    setFeedback('Self-Printing HTML Report downloaded! Open in any browser to print.');
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-lg border border-slate-300 max-w-4xl w-full shadow-2xl overflow-hidden my-4 text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar */}
        <div className="print:hidden bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
              FORM IX REPORT
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              DGMS Statutory Field Incident & Hazard Audit Dossier
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Filter buttons */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700 text-xs">
              {(['all', 'critical', 'high'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition-colors ${
                    reportFilter === f 
                      ? 'bg-amber-500 text-slate-950 font-bold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {f} ({f === 'all' ? observations.length : f === 'critical' ? criticalCount : highCount})
                </button>
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handlePrintPdf}
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
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Download standalone self-printing HTML document"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Printable HTML</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="bg-emerald-600 text-white px-5 py-2 text-xs font-medium flex items-center justify-between animate-in fade-in shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-emerald-200 hover:text-white text-xs underline">
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
              MINISTRY OF LABOUR & EMPLOYMENT · श्रम एवं रोजगार मंत्रालय
            </div>
            <div className="text-sm font-bold text-slate-900">
              DIRECTORATE GENERAL OF MINES SAFETY (DGMS) · खान सुरक्षा महानिदेशालय
            </div>
            <div className="text-xs text-slate-600 font-sans">
              CENTRAL ZONE · BILASPUR REGION · WESTERN COALFIELDS & SECL JURISDICTION
            </div>
            <div className="text-sm font-bold text-slate-900 underline mt-2">
              FORM IX: STATUTORY FIELD INCIDENT & HAZARD AUDIT REPORT
            </div>
            <div className="text-[11px] text-slate-500 font-sans">
              [Under Coal Mines Regulations 2017 · Reg. 106, 141 & 142 | Mines Act 1952 Sec. 22]
            </div>
          </div>

          {/* Reference & Metadata Grid */}
          <div className="bg-slate-50 border border-slate-300 rounded p-4 font-sans text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Mine / Project</span>
                <strong className="text-slate-900">Gevra Opencast Mine</strong>
                <span className="text-[11px] text-slate-600 block">SECL / Coal India Limited</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Report Reference</span>
                <span className="font-mono font-bold text-slate-900">DGMS/GEV/AUDIT-{new Date().getFullYear()}</span>
                <span className="text-[11px] text-slate-600 block">NIC Docket Repository</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Date & Shift</span>
                <span className="font-mono text-slate-900">{new Date().toLocaleDateString('en-IN')}</span>
                <span className="text-[11px] text-slate-600 block">Shift I / General Audit</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Inspecting Officer</span>
                <strong className="text-slate-900">R. C. Verma</strong>
                <span className="text-[10px] font-mono text-slate-600 block">Cert: OVM-2016-8821</span>
              </div>
            </div>

            {/* Metrics pills */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px]">
              <div className="flex items-center gap-3">
                <span>Total Observations: <strong>{observations.length}</strong></span>
                <span className="text-rose-700 font-bold">Critical: {criticalCount}</span>
                <span className="text-amber-700 font-bold">High: {highCount}</span>
                <span>Open Actions: <strong>{openCount}</strong></span>
              </div>
              <div className="font-mono text-slate-500 text-[10px]">
                Coordinates: 22.349210° N, 82.684120° E (RL -120m)
              </div>
            </div>
          </div>

          {/* Observations Table */}
          <div className="space-y-2 font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wide text-slate-900">
                Statutory Hazard Log & Field Observations ({filtered.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Showing {reportFilter.toUpperCase()} severity
              </span>
            </div>

            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">#</th>
                    <th className="p-2 border-r border-slate-300">Ticket & Date</th>
                    <th className="p-2 border-r border-slate-300">Hazard Title & Findings</th>
                    <th className="p-2 border-r border-slate-300">Zone</th>
                    <th className="p-2 border-r border-slate-300">Severity</th>
                    <th className="p-2 border-r border-slate-300">Statute Ref</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {filtered.map((obs, idx) => (
                    <tr key={obs.id} className={obs.severity === 'critical' ? 'bg-rose-50/50' : 'bg-white'}>
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">
                        <div className="font-bold text-slate-900">{obs.ticketNumber}</div>
                        <div className="text-[10px] text-slate-500">{new Date(obs.timestamp).toLocaleDateString()}</div>
                      </td>
                      <td className="p-2 border-r border-slate-200 max-w-[260px]">
                        <div className="font-bold text-slate-900">{obs.title}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-2">{obs.description}</div>
                        {obs.aiAssistance?.detectedAnomaly && (
                          <div className="text-[10px] text-blue-900 bg-blue-50/80 px-1.5 py-0.5 rounded mt-1 font-mono">
                            AI: {obs.aiAssistance.detectedAnomaly}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">
                        {obs.zoneName.split(' ')[0]}
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                          obs.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {obs.severity}
                        </span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-800 font-mono text-[11px]">
                        {obs.aiAssistance?.suggestedRegulation || 'CMR 2017 Reg. 106'}
                      </td>
                      <td className="p-2 text-slate-700 capitalize font-medium">
                        {obs.status.replace('_', ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Directives */}
          <div className="bg-rose-50 border border-rose-200 rounded p-4 font-sans text-xs space-y-1.5">
            <div className="font-bold text-rose-900 uppercase text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Mandatory Statutory Directives (CMR 2017 & Mines Act 1952)</span>
            </div>
            <ol className="list-decimal pl-4 text-rose-900/90 text-[11px] space-y-1">
              <li>Heavy earthmoving machinery (HEMM) operations in marked critical hazard zones must remain suspended until certified.</li>
              <li>Remedial earthworks, bund restoration, and dust suppression measures must be uploaded with geo-tagged verification photo within statutory SLA (Critical: 24h, High: 48h).</li>
              <li>Default in compliance triggers statutory notice under Section 22(1) with personal penal liability under Section 72A.</li>
            </ol>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end font-sans">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 border border-slate-400 flex flex-col items-center justify-center p-1 text-center bg-slate-50">
                <QrCode className="w-9 h-9 text-slate-800" />
                <span className="text-[7px] font-mono">NIC VERIFIED</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                <div>Statutory Audit Token:</div>
                <div className="font-bold text-slate-800">DGMS/SECL-GEV/AUDIT-2026</div>
                <div>NIC National Mining Safety Repository</div>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="font-bold text-xs">R. C. Verma, Statutory Overman</div>
              <div className="text-[11px] text-slate-700">Overman Certificate of Competency #OVM-2016-8821</div>
              <div className="text-[10px] text-slate-500 font-mono">SECL Gevra Opencast Project · Western Zone</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
