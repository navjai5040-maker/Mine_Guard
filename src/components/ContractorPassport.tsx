import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Building, 
  UserCheck, 
  Briefcase,
  AlertOctagon
} from 'lucide-react';
import { CONTRACTORS_DATA } from '../data/mockData';
import { ContractorProfile } from '../types/mineguard';

export const ContractorPassport: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorProfile[]>(CONTRACTORS_DATA);
  const [selectedContractor, setSelectedContractor] = useState<ContractorProfile>(CONTRACTORS_DATA[0]);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const handleIssueNotice = (contractorId: string) => {
    setActionAlert(`Statutory Show Cause Notice dispatched under CMR 2017 to ${selectedContractor.name} via CIL ICIS.`);
    setContractors(prev => prev.map(c => {
      if (c.id === contractorId) {
        return { ...c, status: 'show_cause_issued' };
      }
      return c;
    }));
    setTimeout(() => setActionAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Ecosystem Accountability
              </span>
              <span className="text-xs text-slate-400 font-mono">CIL ICIS Integrated Governance</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Contractor Risk Passport & Statutory Profiler
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Moving beyond siloed vendor lists: every mining contractor holds a live digital passport 
              tracking safety demerits, recurring violations, overdue CAPAs, and PF/ESIC statutory compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-300 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
            <span>Contractual Workforce: <strong className="text-amber-400">5,300</strong> Active</span>
          </div>
        </div>
      </div>

      {actionAlert && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Grid: Contractor Cards (5 Cols) + Selected Profile Deep-Dive (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contractor Passport Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Active Contractual Entities ({contractors.length})</span>
            <span>Risk Tier Sorted</span>
          </div>

          <div className="space-y-3">
            {contractors.map((c) => {
              const isSelected = selectedContractor.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractor(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-slate-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/30' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{c.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{c.vendorCode}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${
                      c.riskTier === 'high_risk' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      c.riskTier === 'elevated' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {c.riskTier.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Safety Score</span>
                      <span className={`font-bold ${c.safetyScore < 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {c.safetyScore}/100
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Workforce</span>
                      <span className="font-bold text-slate-200">{c.workforceCount}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">PF/ESIC</span>
                      <span className="font-bold text-emerald-400">{c.pfEsicCompliance}%</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{c.activeViolations} Active Violations ({c.repeatViolations} repeat)</span>
                    <span className="text-amber-400 hover:underline">View Passport &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Contractor Detailed Risk Passport */}
        <div className="lg:col-span-7">
          {selectedContractor && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">
                    VENDOR PASSPORT: {selectedContractor.vendorCode}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedContractor.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Work Order: {selectedContractor.workOrderNumber}</p>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase ${
                    selectedContractor.status === 'show_cause_issued' ? 'bg-rose-950 text-rose-300 border-rose-700' :
                    selectedContractor.status === 'watch_list' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                    'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {selectedContractor.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Score Breakdown Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Safety Index</span>
                  <span className="text-xl font-bold font-mono text-amber-400">{selectedContractor.safetyScore}%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Mines Act Criteria</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Active Workforce</span>
                  <span className="text-xl font-bold font-mono text-white">{selectedContractor.workforceCount}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Form B Biometric</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Repeat Violations</span>
                  <span className="text-xl font-bold font-mono text-rose-400">{selectedContractor.repeatViolations}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">CMR 104 / 106</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Overdue Actions</span>
                  <span className="text-xl font-bold font-mono text-rose-400">{selectedContractor.overdueActions}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Past 24h SLA</span>
                </div>
              </div>

              {/* Critical Safety Issues Flagged by AI */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Flagged Governance Concerns & Historical Infractions
                </h4>

                {selectedContractor.criticalIssues.length > 0 ? (
                  <div className="space-y-2">
                    {selectedContractor.criticalIssues.map((issue, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
                    No active critical issues flagged. Contractor maintains high statutory compliance.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400 font-mono">
                  Last Statutory Audit: {selectedContractor.lastAuditDate}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleIssueNotice(selectedContractor.id)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1.5"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    <span>Issue Statutory Show Cause Notice</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
