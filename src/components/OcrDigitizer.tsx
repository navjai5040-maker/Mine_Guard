import React, { useState } from 'react';
import { 
  FileSearch, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  GitBranch,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { OCR_SAMPLES } from '../data/mockData';
import { OcrDocumentSample } from '../types/mineguard';

interface OcrDigitizerProps {
  onIngestDocument: (sample: OcrDocumentSample) => void;
}

export const OcrDigitizer: React.FC<OcrDigitizerProps> = ({ onIngestDocument }) => {
  const [selectedDoc, setSelectedDoc] = useState<OcrDocumentSample>(OCR_SAMPLES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedParameters, setExtractedParameters] = useState(selectedDoc.extractedParameters);
  const [ingestedStatus, setIngestedStatus] = useState<Record<string, boolean>>({});

  const handleSelectDoc = (doc: OcrDocumentSample) => {
    setSelectedDoc(doc);
    setIsProcessing(true);
    setTimeout(() => {
      setExtractedParameters(doc.extractedParameters);
      setIsProcessing(false);
    }, 600);
  };

  const handleRunOcrExtraction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 800);
  };

  const handleIngest = () => {
    onIngestDocument(selectedDoc);
    setIngestedStatus(prev => ({ ...prev, [selectedDoc.id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Paperless Digital Governance
              </span>
              <span className="text-xs text-slate-400 font-mono">OCR + Key-Value Entity Extractor</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              OCR Statutory Document Digitization Studio
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Eliminating paper bottlenecks: Ingest DGMS Form VI inspection memos, SPCB environmental lab returns, 
              and blast vibration records into machine-readable compliance objects linked to the digital twin.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Avg OCR Confidence: 98.2%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Document Shelf (4 Cols) + OCR Extraction Workbench (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Statutory Document Samples Shelf */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Official Scanned Documents ({OCR_SAMPLES.length})</span>
            <span>Select to Ingest</span>
          </div>

          <div className="space-y-3">
            {OCR_SAMPLES.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              const isIngested = ingestedStatus[doc.id];

              return (
                <div
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-slate-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/30' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono text-amber-400 font-bold">{doc.documentType}</span>
                    <span className="text-[10px] font-mono text-slate-500">{doc.sampleDate}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 mt-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono line-clamp-1">{doc.issuingAuthority}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-slate-400">Control: {doc.linkedControlId}</span>
                    {isIngested ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ingested
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 hover:underline">Inspect OCR &rarr;</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paperless Governance Impact Note */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-amber-400">DGMS & CIL Digital Transformation:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Previously, paper inspection memos took 7–14 days to circulate from the field to the GM office. 
              MineGuard parses statutory violations within seconds, creating automated alerts and tamper-evident ledger records.
            </p>
          </div>
        </div>

        {/* Right Column: OCR Extraction Workbench & Raw Text */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">
                  {selectedDoc.documentType}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Issuing Body: {selectedDoc.issuingAuthority}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunOcrExtraction}
                  disabled={isProcessing}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Re-run OCR</span>
                </button>
                <button
                  onClick={handleIngest}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Ingest to Twin</span>
                </button>
              </div>
            </div>

            {/* Structured Key-Value Parameter Table */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-semibold uppercase tracking-wider text-[11px]">
                <span>Extracted Statutory Parameters ({extractedParameters.length})</span>
                <span className="font-mono text-amber-400">Confidence: {Math.round(selectedDoc.aiExtractionConfidence * 100)}%</span>
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">Statutory Parameter</th>
                      <th className="p-3">Observed Value</th>
                      <th className="p-3">Statutory Benchmark</th>
                      <th className="p-3 text-right">Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {extractedParameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-sans text-slate-200 font-medium">{param.label}</td>
                        <td className={`p-3 font-bold ${param.compliant ? 'text-slate-200' : 'text-rose-400'}`}>
                          {param.value}
                        </td>
                        <td className="p-3 text-slate-400">{param.benchmark}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            param.compliant 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {param.compliant ? 'COMPLIANT' : 'VIOLATION'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Risk Impact Analysis */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-800/40 text-xs space-y-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Risk Impact & Compliance Twin Linkage:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedDoc.riskImpact}
              </p>
              <div className="pt-1 text-[11px] text-slate-400 font-mono">
                Linked Control ID: <strong className="text-white">{selectedDoc.linkedControlId}</strong>
              </div>
            </div>

            {/* Raw OCR Text Terminal */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span>Raw OCR Extracted Text Buffer</span>
                <span>Language: English (Statutory Legal Form)</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selectedDoc.rawTextExcerpt}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
