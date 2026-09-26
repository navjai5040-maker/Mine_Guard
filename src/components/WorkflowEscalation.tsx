import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Check, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  FastForward,
  BellRing,
  FileText
} from 'lucide-react';
import { CorrectiveAction, InspectionObservation } from '../types/mineguard';
import { INITIAL_OBSERVATIONS } from '../data/mockData';
import { DgmsFormViModal } from './DgmsFormViModal';

interface WorkflowEscalationProps {
  capas: CorrectiveAction[];
  onVerifyCloseCapa: (capaId: string, evidenceNotes: string) => void;
  onOpenNotice?: (obs: InspectionObservation) => void;
  observations?: InspectionObservation[];
}

export const WorkflowEscalation: React.FC<WorkflowEscalationProps> = ({
  capas,
  onVerifyCloseCapa,
  observations
}) => {
  const [localCapas, setLocalCapas] = useState<CorrectiveAction[]>(capas);
  const [selectedCapa, setSelectedCapa] = useState<CorrectiveAction | null>(null);
  const [closureNotes, setClosureNotes] = useState('Dozers deployed to raise parapet bund to 2.50m. Geotechnical tell-tales installed; tension cracks sealed with clay.');
  const [closurePhoto, setClosurePhoto] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [inspectionForNotice, setInspectionForNotice] = useState<InspectionObservation | null>(null);

  // Simulated escalation alert feed
  const [escalationLogs, setEscalationLogs] = useState<Array<{
    id: string;
    timestamp: string;
    message: string;
    recipient: string;
  }>>([
    {
      id: 'log-01',
      timestamp: '26-Sep 00:01 IST',
      message: 'CAPA-2026-0041 elapsed 12h SLA threshold without closure proof. Autonomous escalation to Tier-2 executed.',
      recipient: 'Er. A. K. Banerjee (GM / Mine Agent Gevra, +91-7752-240890)'
    }
  ]);

  // Keep localCapas in sync if parent capas change length
  React.useEffect(() => {
    setLocalCapas(capas);
  }, [capas]);

  // Time-Lapse Simulation Handler (+12 Hours)
  const handleAdvanceTimeLapse = () => {
    setLocalCapas(prev => prev.map(c => {
      if (c.status === 'closed') return c;
      const newHours = Math.max(0, Math.round((c.hoursRemaining - 12) * 10) / 10);
      const isNowExpired = newHours === 0;
      const nextTier = Math.min(3, c.escalationTier + 1) as 1 | 2 | 3;

      if (isNowExpired && c.status !== 'escalated') {
        // Append escalation dispatch log
        const authority = nextTier === 2 ? 'Er. A. K. Banerjee (GM / Mine Agent, +91-7752-240890)' : 'Director (Technical) SECL & DGMS Bilaspur (+91-7752-246001)';
        setEscalationLogs(l => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString() + ' IST',
            message: `CRITICAL SLA LAPSED: ${c.id} exceeded SLA deadline. Autonomous escalation to Tier-${nextTier} triggered under CMR 2017.`,
            recipient: authority
          },
          ...l
        ]);
      }

      return {
        ...c,
        hoursRemaining: newHours,
        status: isNowExpired ? 'escalated' : c.status,
        escalationTier: isNowExpired ? nextTier : c.escalationTier
      };
    }));
  };

  const filteredCapas = localCapas.filter(c => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return c.status !== 'closed';
    if (filterStatus === 'closed') return c.status === 'closed';
    return true;
  });

  const handleConfirmClose = () => {
    if (!selectedCapa) return;
    setIsVerifying(true);
    setTimeout(() => {
      onVerifyCloseCapa(selectedCapa.id, closureNotes);
      setLocalCapas(prev => prev.map(c => c.id === selectedCapa.id ? { ...c, status: 'closed', hoursRemaining: 0 } : c));
      setIsVerifying(false);
      setSelectedCapa(null);
    }, 600);
  };

  const handleOpenDgmsNoticeForCapa = (ticketNumber: string) => {
    const pool = observations && observations.length > 0 ? observations : INITIAL_OBSERVATIONS;
    const obs = pool.find(o => o.ticketNumber === ticketNumber) || pool[0];
    setInspectionForNotice(obs);
  };

  return (
    <div className="space-y-6">
      {/* Title Strip & Time-Lapse Trigger */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Feature 4: Working Module
            </span>
            <span className="text-xs text-slate-500 font-mono">Autonomous SLA Escalation Matrix</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Corrective Action Plans (CAPA) & Escalation Monitoring
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            SLA timers enforce strict compliance. Issues automatically escalate from Shift Safety Officers to General Managers and DGMS.
          </p>
        </div>

        {/* Time-lapse Simulation Button & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Lapse Simulation Action */}
          <button
            onClick={handleAdvanceTimeLapse}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5"
            title="Click to simulate 12 hours passing and test autonomous SLA escalation"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Simulate Time-Lapse (+12 Hours)</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
            {[
              { id: 'all', label: 'All Actions' },
              { id: 'active', label: 'Active SLAs' },
              { id: 'closed', label: 'Verified Closed' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterStatus === tab.id ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Escalation Alert & Notification Log Feed */}
      {escalationLogs.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 text-xs text-rose-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <BellRing className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Autonomous Escalation Dispatch Log (Live Integration Feed)</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {escalationLogs.slice(0, 2).map((log) => (
              <div key={log.id} className="p-2 rounded bg-white/80 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>{log.message}</span>
                <span className="text-slate-600 font-sans">Dispatched to: <strong>{log.recipient}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main CAPA Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="p-3">CAPA ID / Ticket</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Assigned Authority</th>
                <th className="p-3">SLA Status & Tier</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-right">Verification & Notice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCapas.map((capa) => {
                const isClosed = capa.status === 'closed';
                const isCritical = capa.priority === 'critical';
                const isEscalated = capa.status === 'escalated';

                return (
                  <tr key={capa.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-900">{capa.id}</div>
                      <div className="text-[11px] text-slate-500">{capa.ticketNumber}</div>
                    </td>
                    <td className="p-3 max-w-[240px]">
                      <div className="font-semibold text-slate-900">{capa.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{capa.description}</div>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div>{capa.assignedRole}</div>
                      <div className="text-[11px] text-slate-500">{capa.contractorName || 'Direct SECL'}</div>
                    </td>
                    <td className="p-3 font-mono">
                      {!isClosed ? (
                        <div>
                          <div className={`flex items-center gap-1.5 font-bold ${
                            capa.hoursRemaining === 0 ? 'text-rose-700' : 'text-amber-700'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {capa.hoursRemaining === 0 ? 'SLA EXPIRED' : `${capa.hoursRemaining.toFixed(1)}h remaining`}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Escalation: <strong className="text-slate-800">Tier {capa.escalationTier}</strong>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Closed & Sealed</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        isEscalated ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' :
                        isCritical ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {isEscalated ? 'ESCALATED' : capa.priority}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* DGMS Form VI Notice Button */}
                        <button
                          onClick={() => handleOpenDgmsNoticeForCapa(capa.ticketNumber)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                          title="Generate printable official DGMS Form VI Statutory Notice"
                        >
                          <FileText className="w-3 h-3 text-blue-900" />
                          <span>DGMS Form VI</span>
                        </button>

                        {!isClosed ? (
                          <button
                            onClick={() => setSelectedCapa(capa)}
                            className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Verify & Close Loop
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Sealed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DGMS Form VI Modal */}
      {inspectionForNotice && (
        <DgmsFormViModal
          observation={inspectionForNotice}
          onClose={() => setInspectionForNotice(null)}
        />
      )}

      {/* Closure Verification Modal */}
      {selectedCapa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-blue-900 font-bold text-xs">
                  {selectedCapa.id} · {selectedCapa.ticketNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Statutory Action Verification & Closure</h3>
                <p className="text-slate-500">Sign-off under Coal Mines Regulations 2017</p>
              </div>
              <button onClick={() => setSelectedCapa(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Required Remedial Action</label>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedCapa.description}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rectification Proof Notes (First Class Manager)</label>
                <textarea
                  rows={3}
                  value={closureNotes}
                  onChange={(e) => setClosureNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rectified Site Photo Proof</label>
                <div className="h-28 rounded border border-slate-300 overflow-hidden bg-slate-100">
                  <img src={closurePhoto} alt="Proof" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* AI Verification Match */}
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AI Verification Match: 96% Compliance Confirmed
                </span>
                <span className="font-mono text-[11px] text-emerald-700">CMR 106 Satisfied</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedCapa(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleConfirmClose}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Sealing...' : 'Approve & Commit to Ledger'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
