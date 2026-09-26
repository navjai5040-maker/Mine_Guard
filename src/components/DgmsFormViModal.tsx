import React, { useState } from 'react';
import { Printer, X, Download, ShieldCheck, QrCode, CheckCircle2, Loader2 } from 'lucide-react';
import { InspectionObservation } from '../types/mineguard';
import { exportDgmsFormViPdf } from '../utils/printPdfGenerator';

interface DgmsFormViModalProps {
  observation: InspectionObservation;
  onClose: () => void;
}

export const DgmsFormViModal: React.FC<DgmsFormViModalProps> = ({
  observation,
  onClose
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setFeedback('Official DGMS Form VI Notice PDF generated & downloaded. Initiating print dialog...');

    try {
      exportDgmsFormViPdf(observation);
    } catch (err) {
      console.error('Error generating Form VI PDF:', err);
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

  const handleExportPdfOnly = () => {
    exportDgmsFormViPdf(observation);
    setFeedback('Official Form VI PDF generated & downloaded to device.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 max-w-3xl w-full shadow-2xl overflow-hidden my-6 text-slate-900">
        
        {/* Top Control Bar (Hidden when printed) */}
        <div className="print:hidden bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
              DGMS FORM VI
            </span>
            <span className="text-xs text-slate-300">Statutory Notice of Contravention (Mines Act 1952 / CMR 2017)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              title="Print Notice or Save Official PDF"
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5" />
              )}
              <span>{isPrinting ? 'Preparing Print...' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={handleExportPdfOnly}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
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

        {/* Printable Official Notice Document */}
        <div className="p-8 sm:p-10 space-y-6 text-xs font-serif leading-relaxed">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="font-bold text-sm tracking-widest text-slate-900">
              GOVERNMENT OF INDIA · भारत सरकार
            </div>
            <div className="text-xs text-slate-700">
              MINISTRY OF LABOUR & EMPLOYMENT · श्रम एवं रोजगार मंत्रालय
            </div>
            <div className="text-sm font-bold text-slate-900">
              DIRECTORATE GENERAL OF MINES SAFETY · खान सुरक्षा महानिदेशालय
            </div>
            <div className="text-[11px] text-slate-600 font-sans">
              Central Zone — Bilaspur Regional Inspectorate, Seepat Road, Bilaspur, Chhattisgarh - 495006
            </div>
          </div>

          {/* Reference & Notice Title */}
          <div className="flex justify-between items-baseline font-sans text-xs">
            <div>
              <strong>Ref. No:</strong> <span className="font-mono">DGMS/BZP/SECL/GEV/2026/089</span>
            </div>
            <div>
              <strong>Date:</strong> <span className="font-mono">{new Date(observation.timestamp).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="text-center py-2">
            <span className="inline-block border-y-2 border-slate-900 py-1 font-bold tracking-wider text-sm">
              FORM VI — NOTICE OF CONTRAVENTIONS OBSERVED DURING INSPECTION
            </span>
            <div className="text-[11px] italic text-slate-700 mt-0.5">
              [Issued under Section 22 of the Mines Act, 1952 read with Coal Mines Regulations, 2017]
            </div>
          </div>

          {/* Addressee */}
          <div className="font-sans space-y-0.5">
            <div><strong>To:</strong> The Agent / General Manager,</div>
            <div>Gevra Mega Opencast Project, South Eastern Coalfields Limited (SECL),</div>
            <div>Korba Coalfield, Post - Gevra Project, District - Korba (C.G.) - 495452.</div>
          </div>

          {/* Inspection Background Paragraph */}
          <div className="space-y-2">
            <p>
              Sir, during my statutory inspection of <strong>{observation.zoneName}</strong> of the 
              Gevra Opencast Coal Mine on <strong>{new Date(observation.timestamp).toLocaleString()}</strong>, 
              accompanied by the Shift In-charge and Mine Safety Lead, the following serious contraventions 
              of the Coal Mines Regulations, 2017 were observed:
            </p>
          </div>

          {/* Observed Violations Table */}
          <div className="border border-slate-400 font-sans text-[11px]">
            <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-400 p-2 font-bold text-slate-900">
              <div className="col-span-3">Statutory Provision</div>
              <div className="col-span-6">Contravention Observed by Inspector</div>
              <div className="col-span-3 text-right">Compliance Due Date</div>
            </div>
            <div className="grid grid-cols-12 p-3 items-start gap-2">
              <div className="col-span-3 font-mono font-bold text-blue-900">
                {observation.aiAssistance.suggestedRegulation}
              </div>
              <div className="col-span-6 space-y-1">
                <div className="font-bold text-slate-900">{observation.title}</div>
                <div className="text-slate-700 text-xs">{observation.description}</div>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  GPS: {observation.gps.latitude.toFixed(6)}° N, {observation.gps.longitude.toFixed(6)}° E (±{observation.gps.accuracyMeters}m)
                </div>
              </div>
              <div className="col-span-3 text-right font-mono text-rose-700 font-bold">
                Within 24 Hours
              </div>
            </div>
          </div>

          {/* Photographic Evidence Attachment */}
          <div className="font-sans space-y-1">
            <div className="font-bold text-slate-900">Annexure A: Certified Field Photographic Evidence</div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-300 rounded">
              <img 
                src={observation.evidencePhoto} 
                alt="Evidence" 
                className="w-36 h-24 object-cover rounded border border-slate-400"
              />
              <div className="space-y-1 text-[11px] text-slate-700">
                <div><strong>Ticket ID:</strong> <span className="font-mono">{observation.ticketNumber}</span></div>
                <div><strong>Responsible Contractor:</strong> {observation.contractorName || 'Direct SECL'}</div>
                <div><strong>AI Defect Extraction:</strong> {observation.aiAssistance.detectedAnomaly}</div>
                <div className="font-mono text-[10px] text-slate-500 truncate max-w-md">
                  Cryptographic SHA-256 Seal: {observation.evidenceHash}
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Directive Order */}
          <div className="p-3 bg-rose-50/60 border-l-4 border-rose-600 font-sans text-xs space-y-1">
            <div className="font-bold text-rose-900 uppercase">Immediate Statutory Order under Section 22(1):</div>
            <div className="text-slate-800">
              You are hereby directed to rectify the above sub-standard conditions immediately. Deploy heavy earthmoving equipment to raise parapet bunds to minimum 2.40 meters and dress bench overhangs. Submit certified Form VI compliance report along with photographic evidence within the stipulated SLA timeline.
            </div>
          </div>

          {/* Signatures & Seal Box */}
          <div className="pt-6 font-sans flex items-end justify-between border-t border-slate-300 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-slate-400 flex flex-col items-center justify-center p-1 text-center bg-slate-50">
                <QrCode className="w-10 h-10 text-slate-800" />
                <span className="text-[8px] font-mono">VERIFY HASH</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                <div>Digital Verification ID:</div>
                <div className="font-bold text-slate-800">SHA-256 / MINEGUARD-LEDGER</div>
                <div>Coal India Digital Governance</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-bold text-slate-900">{observation.officerName}</div>
              <div className="text-slate-600 text-[11px]">{observation.officerDesignation}</div>
              <div className="text-[10px] text-slate-500">DGMS Central Zone · Bilaspur Inspectorate</div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold">Digitally Signed & Certified</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
