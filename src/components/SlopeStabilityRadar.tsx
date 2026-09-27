import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Droplet, 
  Maximize2, 
  Radio, 
  RefreshCw, 
  ShieldAlert, 
  TrendingUp, 
  Volume2, 
  VolumeX,
  Wind,
  Layers,
  ArrowRight,
  Flame,
  Zap,
  Info,
  BellRing
} from 'lucide-react';
import { sirenPlayer } from '../utils/sirenAudio';

export interface SlopeSensor {
  id: string;
  benchName: string;
  rlElevation: string;
  velocityMmHr: number;
  cumulativeDisplacementMm: number;
  poreWaterPressureKPa: number;
  factorOfSafety: number;
  status: 'stable' | 'advisory' | 'critical';
  radarBearing: string;
}

export const SlopeStabilityRadar: React.FC = () => {
  // Environmental simulation inputs
  const [rainfallMmHr, setRainfallMmHr] = useState<number>(12); // mm/hr
  const [poreWaterOffset, setPoreWaterOffset] = useState<number>(0);
  const [activeAlarm, setActiveAlarm] = useState<boolean>(false);
  const [evacuationOrdered, setEvacuationOrdered] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isSirenMuted, setIsSirenMuted] = useState<boolean>(false);
  const [sirenAudible, setSirenAudible] = useState<boolean>(false);

  // Time-series data points for Inverse Velocity (Fukuzono model)
  const [radarSensors, setRadarSensors] = useState<SlopeSensor[]>([
    {
      id: 'SSR-NORTH-01',
      benchName: 'North Pit Highwall Bench 4 (Coal Cut)',
      rlElevation: 'RL +180m to +210m',
      velocityMmHr: 1.4,
      cumulativeDisplacementMm: 14.2,
      poreWaterPressureKPa: 85,
      factorOfSafety: 1.48,
      status: 'stable',
      radarBearing: '042° NE · Range 480m'
    },
    {
      id: 'SSR-OB-DUMP-03',
      benchName: 'West External Overburden (OB) Dump Bench 6',
      rlElevation: 'RL +240m (Dump Crest)',
      velocityMmHr: 4.8,
      cumulativeDisplacementMm: 48.5,
      poreWaterPressureKPa: 145,
      factorOfSafety: 1.28,
      status: 'advisory',
      radarBearing: '285° WNW · Range 720m'
    },
    {
      id: 'SSR-HIGHWALL-CRITICAL',
      benchName: 'South-East Faulted Highwall Cut (Tension Crack)',
      rlElevation: 'RL +120m to +160m',
      velocityMmHr: 9.2,
      cumulativeDisplacementMm: 112.0,
      poreWaterPressureKPa: 210,
      factorOfSafety: 1.14,
      status: 'advisory',
      radarBearing: '135° SE · Range 340m'
    }
  ]);

  const [selectedSensorId, setSelectedSensorId] = useState<string>('SSR-HIGHWALL-CRITICAL');
  const selectedSensor = radarSensors.find(s => s.id === selectedSensorId) || radarSensors[0];

  // Dynamic calculation when rainfall changes
  useEffect(() => {
    setRadarSensors(prev => prev.map(s => {
      // Rainfall increases pore pressure and decreases Factor of Safety (FoS)
      const addedPressure = rainfallMmHr * 3.5;
      const basePressure = s.id === 'SSR-HIGHWALL-CRITICAL' ? 180 : s.id === 'SSR-OB-DUMP-03' ? 110 : 70;
      const totalPore = basePressure + addedPressure;

      // Base FoS reduction
      const foSDrop = (rainfallMmHr / 100) * 0.45;
      const baseFoS = s.id === 'SSR-HIGHWALL-CRITICAL' ? 1.35 : s.id === 'SSR-OB-DUMP-03' ? 1.48 : 1.65;
      const newFoS = Math.max(0.92, Number((baseFoS - foSDrop).toFixed(2)));

      // Velocity acceleration
      const velMultiplier = newFoS < 1.15 ? 2.8 : newFoS < 1.30 ? 1.5 : 1.0;
      const newVelocity = Number((s.velocityMmHr * velMultiplier).toFixed(1));

      let newStatus: 'stable' | 'advisory' | 'critical' = 'stable';
      if (newFoS < 1.10 || newVelocity > 15.0) {
        newStatus = 'critical';
      } else if (newFoS < 1.30 || newVelocity > 4.0) {
        newStatus = 'advisory';
      }

      return {
        ...s,
        poreWaterPressureKPa: totalPore,
        factorOfSafety: newFoS,
        velocityMmHr: newVelocity,
        status: newStatus
      };
    }));
  }, [rainfallMmHr]);

  const hasCriticalBench = radarSensors.some(s => s.status === 'critical');

  // Control siren audio automatically when alarms/evacuation trigger
  useEffect(() => {
    if (activeAlarm || evacuationOrdered) {
      sirenPlayer.startSiren();
      setSirenAudible(true);
    } else {
      sirenPlayer.stopSiren();
      setSirenAudible(false);
    }

    return () => {
      sirenPlayer.stopSiren();
    };
  }, [activeAlarm, evacuationOrdered]);

  const toggleSirenMute = () => {
    const muted = sirenPlayer.toggleMute();
    setIsSirenMuted(muted);
  };

  const handleSimulateCloudburst = () => {
    setRainfallMmHr(78); // Monsoon cloudburst 78mm/hr
    setActiveAlarm(true);
  };

  const handleResetWeather = () => {
    setRainfallMmHr(12);
    setActiveAlarm(false);
    setEvacuationOrdered(false);
    sirenPlayer.stopSiren();
    setSirenAudible(false);
  };

  const handleDispatchEvacuation = () => {
    setEvacuationOrdered(true);
    sirenPlayer.startSiren();
  };

  return (
    <div className="space-y-6">
      {/* Official Section Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              DGMS Technical Circular 02/2020 & CMR Reg. 106
            </span>
            <span className="text-xs text-slate-500 font-mono">GroundSAR Radar 3D Interconnect</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Geotechnical Slope Stability & Real-Time Radar Monitoring
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Interferometric sub-millimeter pit wall displacement tracking, piezometric pore pressure analysis, and Fukuzono inverse velocity failure prediction.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Siren Mute / Unmute Toggle Button */}
          {sirenAudible && (
            <button
              onClick={toggleSirenMute}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
                isSirenMuted 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 animate-pulse'
              }`}
              title={isSirenMuted ? 'Unmute evacuation siren audio' : 'Mute evacuation siren audio'}
            >
              {isSirenMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span>Unmute Siren</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Mute Siren</span>
                </>
              )}
            </button>
          )}

          {hasCriticalBench && !evacuationOrdered ? (
            <button
              onClick={handleDispatchEvacuation}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5 animate-pulse"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Broadcast Evacuation Siren (Bench SE-Cut)</span>
            </button>
          ) : evacuationOrdered ? (
            <div className="px-3.5 py-2 bg-rose-100 border border-rose-300 text-rose-900 font-semibold rounded-md text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>EVACUATION TRANSMITTED · HEAVY EQUIPMENT STOPPED</span>
            </div>
          ) : null}

          {rainfallMmHr > 40 ? (
            <button
              onClick={handleResetWeather}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-medium rounded-md text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Monsoon Simulation</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateCloudburst}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium rounded-md text-xs transition-colors flex items-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate Cloudburst (78 mm/hr)</span>
            </button>
          )}
        </div>
      </div>

      {/* Critical Alarm Banner */}
      {hasCriticalBench && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg shadow-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                CRITICAL SLOPE INSTABILITY WARNING · FACTOR OF SAFETY &lt; 1.10
              </h4>
              <span className="text-[10px] font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold">
                RADAR TRIGGER: VELOCITY ACCELERATING
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-1">
              SSR-HIGHWALL-CRITICAL has recorded inverse velocity drop approaching failure threshold ({selectedSensor.velocityMmHr} mm/hr). Pore pressure at {selectedSensor.poreWaterPressureKPa} kPa. Immediate cordon of all dumper traffic required under CMR 106(4).
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls & Real-Time Weather Impact Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Simulated Rainfall Intensity (Korba AWS)
            </label>
            <span className="text-xs font-mono font-bold text-blue-900">
              {rainfallMmHr} mm/hr
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="2"
            value={rainfallMmHr}
            onChange={(e) => setRainfallMmHr(Number(e.target.value))}
            className="w-full accent-blue-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0 mm/hr (Dry)</span>
            <span>40 mm/hr (Heavy)</span>
            <span>100 mm/hr (Extreme)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Active Radar Transceiver
          </label>
          <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
            <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />
            <div className="flex-1">
              <div className="font-semibold text-slate-800">GroundSAR-3D #04 (Gevra South)</div>
              <div className="text-[10px] text-slate-500 font-mono">Ku-Band 17.2 GHz · Scan Cycle: 4 mins</div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
              ONLINE
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Geotechnical Benchmark Limit
          </label>
          <div className="p-2 bg-slate-50 border border-slate-200 rounded text-xs space-y-0.5 font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Statutory Min. FoS:</span>
              <span className="font-bold text-slate-800">&ge; 1.30 (DGMS Standard)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Failure Trigger Limit:</span>
              <span className="font-bold text-rose-700">&lt; 1.10 (Immediate Stop)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Target Bench Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {radarSensors.map(sensor => {
          const isSelected = sensor.id === selectedSensorId;
          const isCrit = sensor.status === 'critical';
          const isAdv = sensor.status === 'advisory';

          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensorId(sensor.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-blue-900 border-blue-900 bg-blue-50/20 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-slate-700">{sensor.id}</span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                  isCrit 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : isAdv 
                    ? 'bg-amber-100 text-amber-900' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {sensor.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mb-2 truncate">
                {sensor.benchName}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-100 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Factor of Safety</span>
                  <span className={`text-base font-bold tabular-nums ${
                    sensor.factorOfSafety < 1.15 ? 'text-rose-600' : sensor.factorOfSafety < 1.30 ? 'text-amber-600' : 'text-emerald-700'
                  }`}>
                    {sensor.factorOfSafety}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Velocity</span>
                  <span className={`text-base font-bold tabular-nums ${
                    sensor.velocityMmHr > 10 ? 'text-rose-600' : sensor.velocityMmHr > 4 ? 'text-amber-600' : 'text-slate-800'
                  }`}>
                    {sensor.velocityMmHr} mm/hr
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1.5">
                <span>Pore Press: {sensor.poreWaterPressureKPa} kPa</span>
                <span>Disp: {sensor.cumulativeDisplacementMm} mm</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis View of Selected Bench */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Bench Geotechnical Profile: {selectedSensor.benchName}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Elevation: {selectedSensor.rlElevation} · Line-of-Sight Bearing: {selectedSensor.radarBearing}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            Fukuzono Inversion Model: <strong>1/v = {(1 / Math.max(0.01, selectedSensor.velocityMmHr)).toFixed(3)} hr/mm</strong>
          </div>
        </div>

        {/* Visual Bench Cross-Section & Displacement Waveform */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bench Geometric Cross-Section (SVG) */}
          <div className="lg:col-span-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Bench Slope Cross-Section & Potential Slip Surface</span>
              <span className="text-[10px] font-mono text-slate-500">CMR 106 Compliance</span>
            </div>

            <div className="relative h-56 w-full flex items-center justify-center bg-white rounded border border-slate-200 p-2 overflow-hidden">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Geological layers */}
                <polygon points="0,200 400,200 400,160 280,160 220,100 160,100 100,40 0,40" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                
                {/* Coal Seam */}
                <polygon points="0,150 400,150 400,120 250,120 200,80 0,80" fill="#334155" opacity="0.85" />
                <text x="20" y="110" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Gevra Seam Coal Face (22m)</text>

                {/* Overburden strata */}
                <polygon points="0,75 180,75 140,40 0,40" fill="#cbd5e1" />
                <text x="20" y="60" fill="#475569" fontSize="9" fontFamily="sans-serif">Sandstone & Shale OB</text>

                {/* Critical Shear Slip Circle */}
                <path
                  d="M 80,40 Q 180,140 280,160"
                  fill="none"
                  stroke={selectedSensor.factorOfSafety < 1.15 ? '#e11d48' : '#d97706'}
                  strokeWidth={selectedSensor.factorOfSafety < 1.15 ? '3.5' : '2'}
                  strokeDasharray={selectedSensor.factorOfSafety < 1.15 ? 'none' : '4 2'}
                />

                {/* Slip circle label */}
                <text 
                  x="160" 
                  y="150" 
                  fill={selectedSensor.factorOfSafety < 1.15 ? '#e11d48' : '#b45309'} 
                  fontSize="10" 
                  fontWeight="bold" 
                  fontFamily="sans-serif"
                >
                  Critical Failure Surface (FoS: {selectedSensor.factorOfSafety})
                </text>

                {/* Tension Crack indicator */}
                <line x1="80" y1="30" x2="80" y2="45" stroke="#e11d48" strokeWidth="2.5" />
                <text x="70" y="25" fill="#e11d48" fontSize="8" fontWeight="bold">Tension Crack</text>

                {/* Ground Water table / Pore Pressure */}
                <path d="M 0,90 Q 150,110 320,170" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="240" y="185" fill="#2563eb" fontSize="8">Phreatic Line (Pore Press: {selectedSensor.poreWaterPressureKPa} kPa)</text>

                {/* Radar Line of Sight Beam */}
                <line x1="390" y1="20" x2="160" y2="100" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="390" cy="20" r="5" fill="#10b981" />
                <text x="320" y="15" fill="#047857" fontSize="8" fontWeight="bold">SSR Radar Head</text>
              </svg>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
              <span>Bench Height: 12m</span>
              <span>Bench Width: 24m</span>
              <span>Slope Angle: 38°</span>
            </div>
          </div>

          {/* Inverse Velocity Curve & Estimated Time to Failure */}
          <div className="lg:col-span-6 border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                <span>Inverse Velocity Failure Analysis (Fukuzono Method)</span>
                <span className="text-[10px] font-mono text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                  Voight 1988 Model
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <div className="flex justify-between items-center text-slate-700 font-mono">
                    <span>Displacement Velocity (v):</span>
                    <strong className="text-sm text-slate-900">{selectedSensor.velocityMmHr} mm/hr</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 font-mono mt-1">
                    <span>Inverse Velocity (1/v):</span>
                    <strong className="text-sm text-blue-900">{(1 / Math.max(0.01, selectedSensor.velocityMmHr)).toFixed(4)} hr/mm</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 font-mono mt-1 border-t border-slate-100 pt-1.5">
                    <span>Estimated Time of Failure (T_f):</span>
                    <strong className={`text-sm ${
                      selectedSensor.factorOfSafety < 1.10 ? 'text-rose-700 font-bold' : 'text-slate-800'
                    }`}>
                      {selectedSensor.factorOfSafety < 1.10 ? '≈ 3.5 Hours (CRITICAL EVACUATION)' : '> 72 Hours (Monitoring Required)'}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200 text-slate-700 space-y-1.5">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-900" />
                    <span>Statutory Action Thresholds (DGMS Circular 02/2020)</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-600 list-disc pl-4">
                    <li><strong className="text-emerald-700">FoS &ge; 1.30:</strong> Unrestricted shovel & dumper operations permitted.</li>
                    <li><strong className="text-amber-700">1.10 &le; FoS &lt; 1.30:</strong> Continuous radar telemetry; haul trucks restricted to 15 km/h.</li>
                    <li><strong className="text-rose-700">FoS &lt; 1.10:</strong> Immediate total evacuation of all personnel & heavy machinery.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-mono text-[10px]">
                NABL Geotechnical Verification Docket #SECL-GEO-8819
              </span>
              <button
                onClick={() => {
                  setExportNotice(`Official Geotechnical Slope Report for ${selectedSensor.benchName} exported to DGMS Central Zone repository with digital cryptographic seal.`);
                  setTimeout(() => setExportNotice(null), 4000);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Export DGMS Dossier</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {exportNotice && (
              <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{exportNotice}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
