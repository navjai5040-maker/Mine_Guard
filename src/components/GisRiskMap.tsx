import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Radio, 
  Compass, 
  ClipboardCheck,
  ChevronRight,
  Flame,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldAlert,
  Volume2
} from 'lucide-react';
import { MINE_ZONES, INITIAL_OBSERVATIONS } from '../data/mockData';
import { MineZone, RiskLevel } from '../types/mineguard';
import { SlopeStabilityRadar } from './SlopeStabilityRadar';

interface GisRiskMapProps {
  selectedZoneId?: string;
  onSelectZone: (zoneId: string) => void;
  onDispatchInspection: (zoneId: string) => void;
}

export const GisRiskMap: React.FC<GisRiskMapProps> = ({
  selectedZoneId,
  onSelectZone,
  onDispatchInspection
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'radar'>('map');
  const [focusedZone, setFocusedZone] = useState<MineZone>(
    MINE_ZONES.find(z => z.id === selectedZoneId) || MINE_ZONES[0]
  );

  React.useEffect(() => {
    if (selectedZoneId) {
      const match = MINE_ZONES.find(z => z.id === selectedZoneId);
      if (match) setFocusedZone(match);
    }
  }, [selectedZoneId]);
  const [activeLayer, setActiveLayer] = useState<'all' | 'sensors' | 'violations' | 'blasting'>('all');

  // Controlled Blasting Protocol State (CMR 2017 Reg. 182)
  const [isBlastingCordonActive, setIsBlastingCordonActive] = useState(false);
  const [isVehicleInsideCordon, setIsVehicleInsideCordon] = useState(true);
  const [blastingSignedOff, setBlastingSignedOff] = useState(false);
  const [blastingSeismographLog, setBlastingSeismographLog] = useState<{
    ppv: string;
    distance: string;
    status: string;
    timestamp: string;
  } | null>(null);

  const handleZoneClick = (zone: MineZone) => {
    setFocusedZone(zone);
    onSelectZone(zone.id);
  };

  const handleEvacuateCordon = () => {
    setIsVehicleInsideCordon(false);
  };

  const handleAuthorizeBlasting = () => {
    setBlastingSignedOff(true);
    setBlastingSeismographLog({
      ppv: '6.84 mm/s Peak Particle Velocity',
      distance: '640m from Gevra Basti Boundary',
      status: 'Within Safe DGMS Threshold (Limit < 10.0 mm/s)',
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleResetBlasting = () => {
    setIsVehicleInsideCordon(true);
    setBlastingSignedOff(false);
    setBlastingSeismographLog(null);
  };

  const zoneObservations = INITIAL_OBSERVATIONS.filter(o => o.zoneId === focusedZone.id);

  return (
    <div className="space-y-6">
      {/* Title & Coordinates Strip */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Feature 3: Working Module
            </span>
            <span className="text-xs text-slate-500 font-mono">22.3481° N, 82.6842° E · Korba Coalfield</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Gevra Opencast Mine — GIS Spatial Risk & Blasting Protocol
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Vector cartographic map connecting pit working faces, overburden dumps, sensor telemetry, and CMR 182 blasting clearance cordons.
          </p>
        </div>

        {/* Layer Filters & Blasting Protocol Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Blasting Protocol Button */}
          <button
            onClick={() => {
              const nextState = !isBlastingCordonActive;
              setIsBlastingCordonActive(nextState);
              if (nextState) setActiveLayer('blasting');
              else setActiveLayer('all');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isBlastingCordonActive
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
            title="Toggle 500m controlled blasting safety evacuation protocol under CMR 2017 Reg. 182"
          >
            <Flame className={`w-3.5 h-3.5 ${isBlastingCordonActive ? 'text-amber-300' : 'text-rose-600'}`} />
            <span>CMR 182 Blasting Protocol {isBlastingCordonActive ? '(Active)' : ''}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
            {[
              { id: 'all', label: 'All Zones' },
              { id: 'sensors', label: 'Sensors' },
              { id: 'violations', label: 'Violations' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveLayer(tab.id as any);
                  if (isBlastingCordonActive && tab.id !== 'blasting') {
                    setIsBlastingCordonActive(false);
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeLayer === tab.id && !isBlastingCordonActive ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GIS Spatial Mode Switcher */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-lg shadow-xs overflow-x-auto">
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            viewMode === 'map'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>2D Cartographic Vector Map & Blasting Cordon (CMR 182)</span>
        </button>

        <button
          onClick={() => setViewMode('radar')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            viewMode === 'radar'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Geotechnical Slope Stability Radar & Fukuzono Model (DGMS 02/2020)</span>
        </button>
      </div>

      {viewMode === 'radar' ? (
        <SlopeStabilityRadar />
      ) : (
        <>
          {/* Blasting Alert Warning Strip (When Active) */}
      {isBlastingCordonActive && (
        <div className={`p-4 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in ${
          isVehicleInsideCordon
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : blastingSignedOff
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-2 text-sm">
              <ShieldAlert className={`w-4 h-4 ${isVehicleInsideCordon ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`} />
              <span>
                {isVehicleInsideCordon 
                  ? 'CMR 2017 Reg. 182: 500m Safety Perimeter Compromised — Firing Circuit Interlocked' 
                  : blastingSignedOff
                  ? 'Blasting Authorized: Clearance Certificate Signed & Seismograph Armed'
                  : '500m Danger Zone Cleared: Ready for Blasting Officer Digital Authorization'}
              </span>
            </div>
            <p className="text-[11px] text-slate-700">
              {isVehicleInsideCordon
                ? 'Dump Truck #DT-240-881 (VPR Logistics) detected by GPS radar at 380m from blast face. All personnel and vehicles must be outside 500m radius before warning siren.'
                : 'All GPS tags, vehicle telemetry, and field personnel confirmed outside the 500m danger cordon. Seismograph stations at Gevra Basti calibrated.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isVehicleInsideCordon ? (
              <button
                onClick={handleEvacuateCordon}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs shadow-xs"
              >
                Evacuate Vehicle & Clear Cordon
              </button>
            ) : !blastingSignedOff ? (
              <button
                onClick={handleAuthorizeBlasting}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs shadow-xs flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Authorize Siren & Sign-Off</span>
              </button>
            ) : (
              <button
                onClick={handleResetBlasting}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded text-xs"
              >
                Reset Protocol
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: SVG Map on Left (8 Cols) + Zone Inspector / Blasting Panel on Right (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-lg border border-slate-700 shadow-xs p-4 flex flex-col justify-between min-h-[520px]">
          {/* Legend */}
          <div className="flex items-center justify-between z-10 mb-2 bg-slate-800/80 px-3 py-1.5 rounded text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-100">Status:</span>
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</span>
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Compliant</span>
              {isBlastingCordonActive && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 font-mono font-bold">
                  <span className="w-2.5 h-2.5 rounded-full border border-rose-400 border-dashed animate-spin"></span> 500m Cordon
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400">Scale: 1:25,000 (Survey of India datum)</span>
          </div>

          {/* SVG Visual */}
          <div className="flex-1 flex items-center justify-center">
            <svg viewBox="0 0 900 500" className="w-full h-full max-h-[460px] select-none">
              <defs>
                <pattern id="danger-stripes" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(244,63,94,0.15)" strokeWidth="2" />
                </pattern>
              </defs>

              {/* Mine Boundary */}
              <rect x="20" y="20" width="860" height="460" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              
              {/* Pit Benches */}
              <path d="M 80,80 Q 250,50 400,90 T 420,300 T 180,320 T 70,200 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" />
              <path d="M 100,100 Q 240,80 370,110 T 390,270 T 170,290 T 90,190 Z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              
              {/* Haul Roads */}
              <path d="M 100,450 C 200,400 300,340 370,290 C 450,240 520,200 600,180" fill="none" stroke="#64748b" strokeWidth="10" strokeLinecap="round" strokeDasharray="6 6" />
              <path d="M 370,290 L 780,440" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

              {/* CMR 182 Blasting 500m Safety Exclusion Zone (Rendered when active) */}
              {isBlastingCordonActive && (
                <g className="blasting-cordon">
                  {/* 500m Radius Outer Circle */}
                  <circle 
                    cx="220" 
                    cy="190" 
                    r="150" 
                    fill="url(#danger-stripes)" 
                    stroke={isVehicleInsideCordon ? '#f43f5e' : '#10b981'} 
                    strokeWidth="2.5" 
                    strokeDasharray="6 4" 
                    className="animate-pulse"
                  />
                  {/* 300m Inner Alert Ring */}
                  <circle cx="220" cy="190" r="90" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  
                  {/* Blast Center Face Marker */}
                  <circle cx="220" cy="190" r="8" fill="#e11d48" />
                  <circle cx="220" cy="190" r="16" fill="none" stroke="#e11d48" strokeWidth="1.5" opacity="0.7" />
                  <text x="235" y="194" fill="#fecdd3" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    BLAST HOLE ARRAY #B-14
                  </text>
                  <text x="235" y="208" fill="#fda4af" fontSize="9" fontFamily="monospace">
                    Total Emulsion: 14,200 kg
                  </text>

                  {/* 500m Radius Label */}
                  <line x1="220" y1="190" x2="370" y2="190" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="260" y="184" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    500m Cordon Radius
                  </text>

                  {/* Vehicle Marker Inside / Outside Cordon */}
                  {isVehicleInsideCordon ? (
                    <g transform="translate(300, 240)">
                      <circle cx="0" cy="0" r="7" fill="#f43f5e" className="animate-ping" />
                      <circle cx="0" cy="0" r="6" fill="#f43f5e" />
                      <rect x="10" y="-12" width="135" height="24" rx="4" fill="#881337" stroke="#f43f5e" />
                      <text x="16" y="4" fill="#fff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        ⚠️ Dump Truck #881 (380m)
                      </text>
                    </g>
                  ) : (
                    <g transform="translate(420, 290)">
                      <circle cx="0" cy="0" r="6" fill="#10b981" />
                      <rect x="10" y="-12" width="135" height="24" rx="4" fill="#064e3b" stroke="#10b981" />
                      <text x="16" y="4" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
                        ✓ Dump Truck #881 (580m)
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Zone 1: North Pit Highwall */}
              <g onClick={() => handleZoneClick(MINE_ZONES[0])} className="cursor-pointer">
                <polygon 
                  points="110,120 330,120 350,250 280,280 120,260" 
                  fill={focusedZone.id === 'zone-north-pit' ? 'rgba(225, 29, 72, 0.45)' : 'rgba(225, 29, 72, 0.25)'}
                  stroke={focusedZone.id === 'zone-north-pit' ? '#fb7185' : '#e11d48'} 
                  strokeWidth={focusedZone.id === 'zone-north-pit' ? 3 : 1.5}
                />
                <text x="135" y="155" fill="#ffffff" fontWeight="bold" fontSize="13">North Pit Highwall</text>
                <text x="135" y="175" fill="#fecdd3" fontSize="11" fontFamily="monospace">Risk: 88 (CRITICAL)</text>
              </g>

              {/* Zone 2: South Overburden Dump 4 */}
              <g onClick={() => handleZoneClick(MINE_ZONES[1])} className="cursor-pointer">
                <polygon 
                  points="430,80 640,80 660,200 440,220" 
                  fill={focusedZone.id === 'zone-ob-dump-4' ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.25)'}
                  stroke={focusedZone.id === 'zone-ob-dump-4' ? '#fde047' : '#f59e0b'} 
                  strokeWidth={focusedZone.id === 'zone-ob-dump-4' ? 3 : 1.5}
                />
                <text x="450" y="115" fill="#ffffff" fontWeight="bold" fontSize="13">South OB Dump Bench 4</text>
                <text x="450" y="135" fill="#fef3c7" fontSize="11" fontFamily="monospace">Risk: 74 (HIGH)</text>
              </g>

              {/* Zone 3: Main Haul Road C-East */}
              <g onClick={() => handleZoneClick(MINE_ZONES[2])} className="cursor-pointer">
                <polygon 
                  points="260,270 500,270 520,340 240,340" 
                  fill={focusedZone.id === 'zone-haul-road-east' ? 'rgba(234, 179, 8, 0.45)' : 'rgba(234, 179, 8, 0.22)'}
                  stroke={focusedZone.id === 'zone-haul-road-east' ? '#fde047' : '#eab308'} 
                  strokeWidth={focusedZone.id === 'zone-haul-road-east' ? 3 : 1.5}
                />
                <text x="275" y="300" fill="#ffffff" fontWeight="bold" fontSize="12">Main Haul Road C-East</text>
                <text x="275" y="318" fill="#fef08a" fontSize="10" fontFamily="monospace">Risk: 54 (MEDIUM)</text>
              </g>

              {/* Zone 4: Water Sump Lagoon */}
              <g onClick={() => handleZoneClick(MINE_ZONES[3])} className="cursor-pointer">
                <polygon 
                  points="680,230 850,230 860,360 670,350" 
                  fill={focusedZone.id === 'zone-water-lagoon' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.22)'}
                  stroke={focusedZone.id === 'zone-water-lagoon' ? '#38bdf8' : '#0284c7'} 
                  strokeWidth={focusedZone.id === 'zone-water-lagoon' ? 3 : 1.5}
                />
                <text x="695" y="265" fill="#ffffff" fontWeight="bold" fontSize="12">Water Sump & ETP Lagoon</text>
                <text x="695" y="285" fill="#bae6fd" fontSize="10" fontFamily="monospace">TSS: 134 mg/L</text>
              </g>

              {/* Zone 5: Coal Handling Plant */}
              <g onClick={() => handleZoneClick(MINE_ZONES[4])} className="cursor-pointer">
                <polygon 
                  points="490,380 710,380 720,490 480,490" 
                  fill={focusedZone.id === 'zone-chp-siding' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.22)'}
                  stroke={focusedZone.id === 'zone-chp-siding' ? '#34d399' : '#10b981'} 
                  strokeWidth={focusedZone.id === 'zone-chp-siding' ? 3 : 1.5}
                />
                <text x="510" y="415" fill="#ffffff" fontWeight="bold" fontSize="12">CHP & Railway Siding 02</text>
                <text x="510" y="435" fill="#a7f3d0" fontSize="10" fontFamily="monospace">Risk: 28 (COMPLIANT)</text>
              </g>

              {/* Zone 6: Explosive Magazine */}
              <g onClick={() => handleZoneClick(MINE_ZONES[5])} className="cursor-pointer">
                <polygon 
                  points="80,360 230,360 230,470 70,460" 
                  fill={focusedZone.id === 'zone-magazine-explosives' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.22)'}
                  stroke={focusedZone.id === 'zone-magazine-explosives' ? '#34d399' : '#10b981'} 
                  strokeWidth={focusedZone.id === 'zone-magazine-explosives' ? 3 : 1.5}
                />
                <text x="95" y="395" fill="#ffffff" fontWeight="bold" fontSize="12">Explosive Magazine</text>
                <text x="95" y="415" fill="#a7f3d0" fontSize="10" fontFamily="monospace">CMR 182 · Secure</text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
            <span>Coordinate System: WGS 84 / UTM Zone 44N</span>
            <span>Click any zone above to inspect live readings</span>
          </div>
        </div>

        {/* Right Column: Zone Inspector or Blasting Safety Dossier */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          {isBlastingCordonActive ? (
            /* Blasting Safety Dossier Mode */
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-mono text-rose-700 uppercase font-bold">
                  CMR 2017 Regulation 182 Safety Protocol
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Controlled Blasting 500m Exclusion Monitor
                </h2>
                <div className="text-slate-500 mt-0.5">
                  Blasting Shift: 13:00 - 14:00 IST · North Pit Seam VI/VII Face
                </div>
              </div>

              {/* Perimeter Status Breakdown */}
              <div className="space-y-2 font-mono">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Statutory Radius:</span>
                  <span className="font-bold text-slate-900">500.0 Meters (Reg. 182)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Tracked Vehicles:</span>
                  <span className="font-bold text-slate-900">14 Active in Pit</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Personnel in Cordon:</span>
                  <span className="font-bold text-emerald-700">0 Workers (100% Cleared)</span>
                </div>
                <div className={`p-2.5 rounded border flex items-center justify-between ${
                  isVehicleInsideCordon ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <span className="font-sans font-semibold">Cordon Clear Status:</span>
                  <span className="font-bold">{isVehicleInsideCordon ? '⚠️ 1 Vehicle Inside (380m)' : '✓ 100% Cleared'}</span>
                </div>
              </div>

              {/* Seismograph Ground Vibration Log (Rendered when signed off) */}
              {blastingSeismographLog && (
                <div className="p-3 rounded bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>Seismograph Instantel Record Captured:</span>
                  </div>
                  <div className="font-mono text-[11px] space-y-0.5">
                    <div>• Ground PPV: <strong>{blastingSeismographLog.ppv}</strong></div>
                    <div>• Sensor Station: <strong>{blastingSeismographLog.distance}</strong></div>
                    <div>• Statutory Result: <strong className="text-emerald-700">{blastingSeismographLog.status}</strong></div>
                    <div>• Timestamp: {blastingSeismographLog.timestamp}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                {isVehicleInsideCordon ? (
                  <button
                    onClick={handleEvacuateCordon}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs shadow-xs"
                  >
                    Simulate Cordon Evacuation
                  </button>
                ) : !blastingSignedOff ? (
                  <button
                    onClick={handleAuthorizeBlasting}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Authorize Warning Siren & Sign-Off</span>
                  </button>
                ) : (
                  <button
                    onClick={handleResetBlasting}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-xs"
                  >
                    Reset Blasting Simulation
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Normal Zone Inspector Mode */
            <>
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-mono text-blue-900 uppercase font-bold">Selected Mine Zone</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{focusedZone.name}</h2>
                <div className="text-slate-500 mt-0.5">
                  Contractor: <strong className="text-slate-700">{focusedZone.activeContractor || 'Direct SECL'}</strong>
                </div>
              </div>

              {/* Telemetry Sensor List */}
              <div>
                <label className="font-semibold text-slate-700 uppercase tracking-wider block mb-2 text-[11px]">
                  Live Sensor Telemetry
                </label>
                <div className="space-y-2">
                  {focusedZone.sensors.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800">{s.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Limit: {s.statutoryLimit}</div>
                      </div>
                      <span className={`font-mono font-bold text-xs ${
                        s.status === 'alert' ? 'text-rose-600' : s.status === 'warning' ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {s.reading}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Violations in this Zone */}
              <div>
                <label className="font-semibold text-slate-700 uppercase tracking-wider block mb-2 text-[11px]">
                  Open Field Observations ({zoneObservations.length})
                </label>
                {zoneObservations.length > 0 ? (
                  <div className="space-y-2">
                    {zoneObservations.map(obs => (
                      <div key={obs.id} className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900">
                        <div className="font-semibold">{obs.title}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{obs.description}</div>
                        <div className="mt-1 font-mono text-[10px] text-slate-500">Ticket: {obs.ticketNumber}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-500 text-center">
                    All parameters nominal in this zone.
                  </div>
                )}
              </div>

              {/* Dispatch Inspection Button */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => onDispatchInspection(focusedZone.id)}
                  className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Log Inspection for this Zone</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
