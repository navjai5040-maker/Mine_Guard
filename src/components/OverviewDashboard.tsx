import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  ArrowUpRight, 
  ChevronRight,
  ClipboardCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  CURRENT_SUBSIDIARY, 
  MINE_ZONES, 
  STATUTORY_CONTROLS 
} from '../data/mockData';
import { 
  UserRole, 
  InspectionObservation, 
  CorrectiveAction 
} from '../types/mineguard';
import { MinistryParliamentaryDocket } from './MinistryParliamentaryDocket';
import { DgmsFormViModal } from './DgmsFormViModal';

interface OverviewProps {
  userRole: UserRole;
  setActiveTab: (tab: string) => void;
  onSelectZone: (zoneId: string) => void;
  observations: InspectionObservation[];
  capas: CorrectiveAction[];
}

export const OverviewDashboard: React.FC<OverviewProps> = ({
  userRole,
  setActiveTab,
  onSelectZone,
  observations,
  capas
}) => {
  const [showMinistrySuite, setShowMinistrySuite] = React.useState<boolean>(
    userRole === 'ministry_official' || userRole === 'cil_corporate'
  );
  const [selectedNoticeObs, setSelectedNoticeObs] = React.useState<InspectionObservation | null>(null);

  // Sync state if user changes role in header
  React.useEffect(() => {
    if (userRole === 'ministry_official' || userRole === 'cil_corporate') {
      setShowMinistrySuite(true);
    }
  }, [userRole]);
  const activeCapasCount = capas.filter(c => c.status !== 'closed').length;
  const criticalObsCount = observations.filter(o => o.severity === 'critical').length;
  const compliantControlsCount = STATUTORY_CONTROLS.filter(c => c.complianceStatus === 'compliant').length;
  const compliancePercentage = Math.round((compliantControlsCount / STATUTORY_CONTROLS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Official Government Project Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              SECL Korba Area
            </span>
            <span className="text-xs text-slate-500 font-mono">DGMS Central Zone · Bilaspur</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Gevra Mega Opencast Project — Statutory Governance Overview
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time compliance monitoring, geo-tagged field observations, and corrective action workflows under Coal Mines Regulations 2017.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowMinistrySuite(!showMinistrySuite)}
            className={`px-3.5 py-2 font-semibold rounded-md text-xs border transition-colors flex items-center gap-1.5 shadow-xs ${
              showMinistrySuite
                ? 'bg-amber-500 text-slate-950 border-amber-600'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 ${showMinistrySuite ? 'text-slate-950' : 'text-blue-900'}`} />
            <span>{showMinistrySuite ? 'Hide Ministry Docket' : 'Apex Ministry Docket (8 CIL Subsidiaries & Parliament Q&A)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('inspections')}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Log Field Inspection</span>
          </button>
          <button
            onClick={() => setActiveTab('gis')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md text-xs transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>View GIS Map</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render Ministry Parliamentary & Subsidiary Suite */}
      {showMinistrySuite && (
        <div className="animate-in fade-in duration-200">
          <MinistryParliamentaryDocket />
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Statutory Compliance Index</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {CURRENT_SUBSIDIARY.complianceIndex}%
            </span>
            <span className="text-xs text-emerald-600 font-medium font-mono">Nominal</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${CURRENT_SUBSIDIARY.complianceIndex}%` }}></div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>DGMS & MoEFCC benchmark</span>
            <span className="font-mono text-slate-700 font-medium">Target &ge; 90%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Active Field Observations</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {observations.length}
            </span>
            <span className="text-xs text-rose-600 font-medium">
              ({criticalObsCount} critical)
            </span>
          </div>
          <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between">
            <span>Pending CAPAs:</span>
            <span className="font-mono font-semibold text-amber-700">{activeCapasCount} active</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>SLA Monitoring:</span>
            <span className="text-rose-600 font-medium">1 Escalation Flagged</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Annual Production Scale</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              53.12
            </span>
            <span className="text-xs text-slate-500">MT / year</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between">
            <span>National CIL Baseline:</span>
            <span className="font-mono font-medium text-slate-800">781.056 MT</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Workforce:</span>
            <span className="font-mono text-slate-700">8,420 registered</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Cryptographic Audit Chain</span>
            <ShieldAlert className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              #1,045
            </span>
            <span className="text-xs text-emerald-600 font-medium">Verified</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between">
            <span>Algorithm:</span>
            <span className="font-mono text-slate-700">SHA-256 Ledger</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Status:</span>
            <span className="text-slate-700 font-mono">Tamper-Evident</span>
          </div>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mine Working Zones Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Mine Working Zones & Live Status</h2>
              <p className="text-xs text-slate-500">Gevra Opencast Project spatial working zones and telemetry status</p>
            </div>
            <button
              onClick={() => setActiveTab('gis')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {MINE_ZONES.map((zone) => {
              const riskPill = {
                critical: 'bg-rose-50 text-rose-700 border-rose-200',
                high: 'bg-amber-50 text-amber-700 border-amber-200',
                medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }[zone.currentRisk];

              return (
                <div 
                  key={zone.id}
                  onClick={() => {
                    onSelectZone(zone.id);
                    setActiveTab('gis');
                  }}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{zone.name}</span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${riskPill}`}>
                        {zone.currentRisk}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Contractor: <span className="font-medium text-slate-700">{zone.activeContractor || 'Direct SECL'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-mono pt-1">
                      {zone.sensors.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="truncate max-w-[200px]">
                          {s.name.split(' ')[0]}: <strong className={s.status === 'alert' ? 'text-rose-600' : 'text-slate-800'}>{s.reading}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {zone.activeObservationsCount} Open Issues
                    </span>
                    <div className="text-[11px] text-blue-900 hover:underline mt-0.5 font-medium">
                      Inspect Telemetry &rarr;
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Safety Observations (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Field Violations</h2>
              <p className="text-xs text-slate-500">Geo-tagged inspection observations requiring action</p>
            </div>
            <button
              onClick={() => setActiveTab('workflow')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View CAPAs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[460px]">
            {observations.slice(0, 4).map((obs) => (
              <div 
                key={obs.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/60 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    obs.severity === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {obs.severity}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">{obs.ticketNumber}</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{obs.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{obs.description}</p>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/80 pt-1.5 font-mono">
                  <span>Zone: {obs.zoneName.split(' ')[0]}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNoticeObs(obs);
                      }}
                      className="text-blue-900 hover:text-blue-700 font-semibold underline text-[10px]"
                    >
                      DGMS Form VI &rarr;
                    </button>
                    <span className="text-blue-900 font-semibold">{obs.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => setActiveTab('inspections')}
              className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors"
            >
              + Log New Inspection / Violation
            </button>
          </div>
        </div>
      </div>

      {/* DGMS Form VI Notice Modal from Dashboard */}
      {selectedNoticeObs && (
        <DgmsFormViModal
          observation={selectedNoticeObs}
          onClose={() => setSelectedNoticeObs(null)}
        />
      )}
    </div>
  );
};
