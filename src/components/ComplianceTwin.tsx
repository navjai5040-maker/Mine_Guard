import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Radio,
  Sliders
} from 'lucide-react';
import { STATUTORY_CONTROLS } from '../data/mockData';
import { StatutoryComplianceControl } from '../types/mineguard';
import { SlopeStabilityRadar } from './SlopeStabilityRadar';

export const ComplianceTwin: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'registry' | 'radar'>('registry');
  const [controls, setControls] = useState<StatutoryComplianceControl[]>(STATUTORY_CONTROLS);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedControl, setSelectedControl] = useState<StatutoryComplianceControl | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredControls = controls.filter(control => {
    const matchesCat = selectedCategory === 'all' || control.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || control.complianceStatus === selectedStatus;
    const matchesSearch = control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          control.regulationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          control.statute.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStat && matchesSearch;
  });

  const handleUpdateStatus = (newStatus: StatutoryComplianceControl['complianceStatus']) => {
    if (!selectedControl) return;
    setControls(prev => prev.map(c => {
      if (c.id === selectedControl.id) {
        return {
          ...c,
          complianceStatus: newStatus,
          lastEvidenceDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    setToastMessage(`Updated ${selectedControl.regulationNumber} to ${newStatus.replace('_', ' ').toUpperCase()}`);
    setSelectedControl(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs: Statutory Registry vs Slope Stability Radar */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubView('registry')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 transition-colors ${
            activeSubView === 'registry'
              ? 'border-blue-900 text-blue-900 bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Statutory Compliance Registry</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {controls.length} Regulations
          </span>
        </button>

        <button
          onClick={() => setActiveSubView('radar')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 transition-colors ${
            activeSubView === 'radar'
              ? 'border-rose-600 text-rose-700 bg-white shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
          <span>Slope Stability Radar (GroundSAR-3D & Evacuation Siren)</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
            CMR 106 Siren Live
          </span>
        </button>
      </div>

      {activeSubView === 'radar' ? (
        <SlopeStabilityRadar />
      ) : (
        <>
          {/* Title & Stats */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Feature 2: Statutory Registry
            </span>
            <span className="text-xs text-slate-500 font-mono">DGMS CMR 2017 & MoEFCC</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Statutory Compliance Obligations & Controls
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Machine-readable statutory controls governing safety bench geometry, slope stability, dust control, and effluent standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
            {controls.filter(c => c.complianceStatus === 'compliant').length} / {controls.length} Compliant
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <span className="font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {toastMessage}
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-medium mr-1">Category:</span>
          {[
            { id: 'all', label: 'All Statutes' },
            { id: 'safety', label: 'DGMS Safety (CMR 2017)' },
            { id: 'environment', label: 'MoEFCC / Water & Air' },
            { id: 'labour', label: 'Mines Act / Labour' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedCategory === tab.id
                  ? 'bg-blue-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search regulations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* Main Compliance Ledger Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="p-3">Regulation No.</th>
                <th className="p-3">Statutory Title & Description</th>
                <th className="p-3">Responsible Department</th>
                <th className="p-3">Cadence & Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredControls.map((ctrl) => {
                const statusBadge = {
                  compliant: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  due_soon: 'bg-yellow-50 text-yellow-800 border-yellow-200',
                  overdue: 'bg-rose-50 text-rose-800 border-rose-200',
                  violation_reported: 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                }[ctrl.complianceStatus];

                return (
                  <tr key={ctrl.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-900">{ctrl.regulationNumber}</div>
                      <div className="text-[11px] text-slate-500">{ctrl.id}</div>
                    </td>
                    <td className="p-3 max-w-[280px]">
                      <div className="font-semibold text-slate-900">{ctrl.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{ctrl.description}</div>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div>{ctrl.responsibleEntity}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ctrl.applicableZone.split(' ')[0]}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="text-slate-900 capitalize">{ctrl.frequency}</div>
                      <div className="text-[11px] text-slate-500">Due: {ctrl.nextDueDate}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded border text-[11px] uppercase font-semibold font-mono ${statusBadge}`}>
                        {ctrl.complianceStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedControl(ctrl)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                      >
                        Inspect / Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control Detail & Update Modal */}
      {selectedControl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-xl w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-blue-900 font-bold text-xs">
                  {selectedControl.id} · {selectedControl.regulationNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedControl.title}</h3>
                <p className="text-slate-500">{selectedControl.statute}</p>
              </div>
              <button onClick={() => setSelectedControl(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Statutory Requirement</label>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedControl.description}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mandatory Evidentiary Proof</label>
                <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900 leading-relaxed font-medium">
                  {selectedControl.mandatoryEvidence}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Update Evidence / Compliance Notes</label>
                <textarea
                  rows={2}
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder="Enter photogrammetry survey date or lab report ID..."
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Change Statutory Compliance Status</label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('compliant')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-xs"
                  >
                    ✓ Mark Compliant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('due_soon')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-medium shadow-xs"
                  >
                    Mark Due Soon
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('violation_reported')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium shadow-xs"
                  >
                    Flag Violation
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedControl(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
