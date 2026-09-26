import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Wind, 
  Gauge, 
  Printer, 
  Lock, 
  Unlock, 
  FileText, 
  Clock, 
  Sparkles, 
  Radio, 
  X,
  Droplet,
  HardHat
} from 'lucide-react';
import { syncHash } from '../utils/crypto';

export interface GasReading {
  gas: string;
  chemicalFormula: string;
  currentValue: number;
  unit: string;
  permissibleLimit: number;
  comparison: '<' | '>';
  status: 'safe' | 'warning' | 'breach';
  location: string;
  sensorId: string;
}

export const ShiftHandoverLog: React.FC = () => {
  const [currentShift, setCurrentShift] = useState<'Shift I (06:00 - 14:00)' | 'Shift II (14:00 - 22:00)' | 'Shift III (22:00 - 06:00)'>('Shift I (06:00 - 14:00)');
  const [selectedSeam, setSelectedSeam] = useState<string>('Bottom Seam Working Face (RL -120m)');
  
  // Real-time gas readings with interactive slider / simulation
  const [gasReadings, setGasReadings] = useState<GasReading[]>([
    {
      gas: 'Methane (CH₄)',
      chemicalFormula: 'CH₄',
      currentValue: 0.12,
      unit: '% v/v',
      permissibleLimit: 0.50,
      comparison: '<',
      status: 'safe',
      location: 'Face Return / Dragline Cut 4',
      sensorId: 'CH4-TEL-081'
    },
    {
      gas: 'Carbon Monoxide (CO)',
      chemicalFormula: 'CO',
      currentValue: 14.0,
      unit: 'ppm',
      permissibleLimit: 50.0,
      comparison: '<',
      status: 'safe',
      location: 'Spontaneous Heating Sump Zone',
      sensorId: 'CO-TEL-042'
    },
    {
      gas: 'Oxygen (O₂)',
      chemicalFormula: 'O₂',
      currentValue: 20.8,
      unit: '% v/v',
      permissibleLimit: 19.0,
      comparison: '>',
      status: 'safe',
      location: 'Main Intake Haulage Cut',
      sensorId: 'O2-TEL-019'
    },
    {
      gas: 'Respirable Dust (PM10)',
      chemicalFormula: 'Dust',
      currentValue: 1.45,
      unit: 'mg/m³',
      permissibleLimit: 2.00,
      comparison: '<',
      status: 'safe',
      location: 'In-Pit Primary Crusher Discharge',
      sensorId: 'DUST-CAAQ-003'
    },
    {
      gas: 'Air Velocity',
      chemicalFormula: 'v',
      currentValue: 1.80,
      unit: 'm/s',
      permissibleLimit: 0.50,
      comparison: '>',
      status: 'safe',
      location: 'Main Pit Ventilation Chute',
      sensorId: 'ANEMO-014'
    }
  ]);

  // Physical statutory checklist under CMR 2017
  const [statutoryChecks, setStatutoryChecks] = useState([
    { id: 'chk-1', reg: 'CMR Reg. 106', label: 'Benches height/width ratio inspected; no overhangs or loose boulders detected.', checked: true },
    { id: 'chk-2', reg: 'CMR Reg. 85', label: 'Haul road berms maintained at minimum 2.40m height along pit crest & dump edges.', checked: true },
    { id: 'chk-3', reg: 'CMR Reg. 123', label: 'Water mist spraying active along coal transfer routes; 100% suppression online.', checked: true },
    { id: 'chk-4', reg: 'CMR Reg. 182', label: 'Blasting fumes cleared; all misfires inspected and logged before crew entry.', checked: true },
    { id: 'chk-5', reg: 'CMR Reg. 73', label: 'Emergency warning siren & communication hotline tested operational.', checked: true }
  ]);

  // Sirdar / Overman signoff state
  const [officerPin, setOfficerPin] = useState('');
  const [signoffRemarks, setSignoffRemarks] = useState('All mining faces inspected. Atmospheric gas concentrations normal. Haul road watering in progress.');
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [signedOffBlock, setSignedOffBlock] = useState<{
    hash: string;
    timestamp: string;
    officer: string;
    certNo: string;
  } | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [simulationWarning, setSimulationWarning] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  const handlePrintFormIv = () => {
    setPrintFeedback('Initiating print dialog for DGMS Form IV Statutory Register...');
    try {
      window.print();
    } catch (e) {
      console.warn('window.print() suppressed in iframe sandbox:', e);
    }
    setTimeout(() => {
      setPrintFeedback(null);
    }, 5000);
  };

  // Check if any gas breaches statutory limit
  const hasGasBreach = gasReadings.some(g => g.status === 'breach');

  const toggleCheck = (id: string) => {
    if (isSignedOff) return;
    setStatutoryChecks(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  // Gas simulation triggers
  const handleSimulateGasAnomaly = () => {
    setGasReadings(prev => prev.map(g => {
      if (g.chemicalFormula === 'CO') {
        return {
          ...g,
          currentValue: 68.5, // Exceeds 50 ppm
          status: 'breach'
        };
      }
      return g;
    }));
    setSimulationWarning('ALERT: Carbon Monoxide (CO) concentration elevated to 68.5 ppm (Permissible limit: 50 ppm). Statutory interlock active: Shift sign-off locked!');
  };

  const handleResetGasToNormal = () => {
    setGasReadings(prev => prev.map(g => {
      if (g.chemicalFormula === 'CO') {
        return {
          ...g,
          currentValue: 14.0,
          status: 'safe'
        };
      }
      return g;
    }));
    setSimulationWarning(null);
  };

  const handleSignOffShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasGasBreach) {
      setFormError('CANNOT SIGN OFF: Atmospheric gas exceeds statutory permissible limits under CMR 2017!');
      setTimeout(() => setFormError(null), 4000);
      return;
    }

    const allChecked = statutoryChecks.every(c => c.checked);
    if (!allChecked) {
      setFormError('CANNOT SIGN OFF: All statutory safety examination checkpoints under CMR 2017 must be verified.');
      setTimeout(() => setFormError(null), 4000);
      return;
    }

    if (officerPin !== '8821' && officerPin.length < 4) {
      setFormError('Invalid Statutory Officer PIN. Please enter your 4-digit DGMS authorization PIN (Demo: 8821).');
      setTimeout(() => setFormError(null), 4000);
      return;
    }

    setFormError(null);

    const payload = JSON.stringify({
      shift: currentShift,
      seam: selectedSeam,
      gasReadings,
      statutoryChecks,
      remarks: signoffRemarks,
      officer: 'Er. Rajeshwar Nath',
      cert: 'OVM-2016-8821',
      date: new Date().toISOString()
    });

    const sealHash = syncHash(payload);
    setSignedOffBlock({
      hash: sealHash,
      timestamp: new Date().toLocaleTimeString() + ', ' + new Date().toLocaleDateString(),
      officer: 'Er. Rajeshwar Nath (Overman / Sirdar In-Charge)',
      certNo: 'DGMS First Class Competency #8821'
    });
    setIsSignedOff(true);
  };

  return (
    <div className="space-y-6">
      {/* Official Section Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Statutory Register: CMR 2017 Reg. 43 & 48
            </span>
            <span className="text-xs text-slate-500 font-mono">DGMS Form IV · Daily Examination</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Statutory Shift Handover & Atmospheric Gas Register
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Mandatory shift-wise atmospheric safety examination, environmental gas telemetry, and statutory Overman / Mining Sirdar digital sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isSignedOff && (
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form IV Register</span>
            </button>
          )}

          {simulationWarning ? (
            <button
              onClick={handleResetGasToNormal}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-md text-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ventilate & Reset Gas</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateGasAnomaly}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-medium rounded-md text-xs transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate CO Gas Breach</span>
            </button>
          )}
        </div>
      </div>

      {/* Warning Alert Banner if Gas is in Breach */}
      {simulationWarning && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg shadow-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
              Statutory Interlock Activated · CMR 2017 Regulation 141
            </h4>
            <p className="text-xs text-rose-800 mt-1 font-sans">
              {simulationWarning}
            </p>
            <div className="mt-2 text-[11px] text-rose-700 flex items-center gap-4">
              <span>Automated Siren: <strong>Sounded (Sector 4)</strong></span>
              <span>Evacuation Notice: <strong>Dispatched to Shift In-Charge</strong></span>
              <span>Mine Manager Alert: <strong>Transmitted</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Shift & Seam Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Operating Shift (8-Hour Cycle)
          </label>
          <select
            value={currentShift}
            onChange={(e) => setCurrentShift(e.target.value as any)}
            disabled={isSignedOff}
            className="w-full text-xs font-medium border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white text-slate-900"
          >
            <option value="Shift I (06:00 - 14:00)">Shift I (06:00 - 14:00) · General Morning</option>
            <option value="Shift II (14:00 - 22:00)">Shift II (14:00 - 22:00) · Afternoon</option>
            <option value="Shift III (22:00 - 06:00)">Shift III (22:00 - 06:00) · Night Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Working Seam & Bench Location
          </label>
          <select
            value={selectedSeam}
            onChange={(e) => setSelectedSeam(e.target.value)}
            disabled={isSignedOff}
            className="w-full text-xs font-medium border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white text-slate-900"
          >
            <option value="Bottom Seam Working Face (RL -120m)">Bottom Seam Working Face (RL -120m)</option>
            <option value="Upper Coal Seam Top Cut (RL -40m)">Upper Coal Seam Top Cut (RL -40m)</option>
            <option value="North Pit OB Bench 3 (Shovel Excavation)">North Pit OB Bench 3 (Shovel Excavation)</option>
            <option value="In-Pit Crusher Sump Trench">In-Pit Crusher Sump Trench</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Statutory Competent Official
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded text-xs">
            <HardHat className="w-4 h-4 text-blue-900 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900">Er. Rajeshwar Nath</div>
              <div className="text-[10px] text-slate-500 font-mono">Overman Cert: OVM-2016-8821</div>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Gas Telemetry Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-900" />
            <span>Atmospheric Environmental Telemetry (Continuous Online Monitoring)</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Sensors Calibrated: Today 05:30 IST · NABL Traceable
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {gasReadings.map((reading) => {
            const isBreach = reading.status === 'breach';
            return (
              <div
                key={reading.chemicalFormula}
                className={`p-3.5 rounded-lg border transition-all ${
                  isBreach 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold truncate">{reading.gas}</span>
                  {isBreach ? (
                    <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded text-[10px] font-bold font-mono">
                      BREACH
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold font-mono">
                      SAFE
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <span className={`text-xl font-bold font-mono tabular-nums ${isBreach ? 'text-rose-700' : 'text-slate-900'}`}>
                    {reading.currentValue}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{reading.unit}</span>
                </div>

                <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5 mt-1 flex flex-col gap-0.5">
                  <div className="flex justify-between font-mono">
                    <span>Permissible:</span>
                    <span>{reading.comparison} {reading.permissibleLimit} {reading.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Sensor: {reading.sensorId}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split: Checklist on Left, Official Digital Sign-off on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Statutory Inspection Checkpoints (CMR 2017) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Statutory Physical Verification Checkpoints
              </h3>
              <p className="text-[11px] text-slate-500">
                Mandatory under Coal Mines Regulations 2017. All must be verified before shift clearance.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
              {statutoryChecks.filter(c => c.checked).length} / {statutoryChecks.length} Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {statutoryChecks.map((chk) => (
              <label
                key={chk.id}
                className={`flex items-start gap-3 p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                  chk.checked 
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={chk.checked}
                  disabled={isSignedOff}
                  onChange={() => toggleCheck(chk.id)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-100/70 px-1.5 py-0.2 rounded">
                      {chk.reg}
                    </span>
                    {chk.checked && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Inspected
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-800">
                    {chk.label}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Sirdar / Overman Handover Notes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Statutory Shift Handover Observations & Specific Instructions for Relieving Shift
            </label>
            <textarea
              rows={3}
              value={signoffRemarks}
              disabled={isSignedOff}
              onChange={(e) => setSignoffRemarks(e.target.value)}
              placeholder="Enter remarks regarding equipment position, blasting status, pumping, or unstable zones..."
              className="w-full text-xs border border-slate-300 rounded p-2.5 bg-slate-50 focus:bg-white text-slate-900 focus:ring-1 focus:ring-blue-900 outline-hidden"
            />
          </div>
        </div>

        {/* Right: Digital Signature & Sealing Box */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  DGMS Statutory Digital Endorsement
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Authenticates shift handover into the tamper-proof CIL compliance ledger.
              </p>
            </div>

            {isSignedOff && signedOffBlock ? (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SHIFT HANDOVER STATUTORILY SEALED</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 font-mono">
                  <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-semibold">{signedOffBlock.timestamp}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                    <span className="text-slate-500">Endorser:</span>
                    <span className="font-semibold text-right">{signedOffBlock.officer}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                    <span className="text-slate-500">DGMS Cert:</span>
                    <span className="font-semibold">{signedOffBlock.certNo}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 text-[10px] block">Cryptographic SHA-256 Ledger Hash:</span>
                    <span className="text-[10px] font-mono text-emerald-800 break-all select-all font-bold">
                      {signedOffBlock.hash}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View & Print Official Form IV</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignOffShift} className="mt-4 space-y-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-2">
                  <div className="text-slate-700 font-medium">
                    Legal Undertaking under Section 72A of the Mines Act, 1952:
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    "I hereby certify that I have personally inspected the above mine working faces and equipment benches, measured the atmospheric gas concentrations, and found them compliant with the statutory parameters."
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter DGMS Officer Authorization PIN
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={6}
                      value={officerPin}
                      onChange={(e) => setOfficerPin(e.target.value)}
                      placeholder="Enter 4-digit PIN (Demo: 8821)"
                      className="flex-1 text-xs border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:bg-white text-slate-900 tracking-widest font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setOfficerPin('8821')}
                      className="px-2.5 py-2 text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-mono font-medium"
                    >
                      Fill Demo (8821)
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tied to Statutory Overman Certificate OVM-2016-8821.
                  </p>
                </div>

                {formError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={hasGasBreach}
                  className={`w-full py-2.5 rounded font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors ${
                    hasGasBreach
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Statutorily Sign-Off & Seal Shift Handover</span>
                </button>
              </form>
            )}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
            <span>DGMS Coal Mines Regulations 2017</span>
            <span className="font-mono">Standard Operating Procedure SECL/SOP/41</span>
          </div>
        </div>
      </div>

      {/* Printable Form IV Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-3xl w-full shadow-2xl overflow-hidden my-6 text-slate-900">
            {/* Top Control Bar */}
            <div className="print:hidden bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  DGMS FORM IV
                </span>
                <span className="text-xs text-slate-300">Daily Statutory Shift Inspection Record (CMR 2017)</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintFormIv}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Register</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Print Feedback Banner */}
            {printFeedback && (
              <div className="bg-emerald-600 text-white px-5 py-2 text-xs font-medium flex items-center justify-between animate-in fade-in shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>{printFeedback}</span>
                </div>
                <button onClick={() => setPrintFeedback(null)} className="text-emerald-200 hover:text-white text-xs underline">
                  Dismiss
                </button>
              </div>
            )}

            {/* Official Printable Register Document */}
            <div className="p-8 sm:p-10 space-y-5 text-xs font-serif leading-relaxed">
              <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                <div className="font-bold text-sm tracking-widest text-slate-900">
                  GOVERNMENT OF INDIA · भारत सरकार
                </div>
                <div className="text-xs text-slate-700">
                  DIRECTORATE GENERAL OF MINES SAFETY · खान सुरक्षा महानिदेशालय
                </div>
                <div className="text-sm font-bold text-slate-900 underline mt-1">
                  FORM IV: STATUTORY REGISTER OF DAILY SHIFT EXAMINATION
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  [See Regulations 43(1) and 48(1) of the Coal Mines Regulations, 2017]
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border border-slate-300 p-3 bg-slate-50 font-sans">
                <div><strong>Mine Name:</strong> Gevra Mega Opencast Project</div>
                <div><strong>Subsidiary:</strong> South Eastern Coalfields Ltd (SECL)</div>
                <div><strong>Operating Shift:</strong> {currentShift}</div>
                <div><strong>Bench / Seam:</strong> {selectedSeam}</div>
                <div><strong>Examining Officer:</strong> Er. Rajeshwar Nath (Overman)</div>
                <div><strong>DGMS Competency Cert:</strong> OVM-2016-8821</div>
              </div>

              {/* Gas Table */}
              <div>
                <div className="font-bold text-xs uppercase tracking-wide mb-1 font-sans">
                  1. Atmospheric Gas Concentration Record
                </div>
                <table className="w-full text-xs border-collapse border border-slate-300 text-left font-sans">
                  <thead>
                    <tr className="bg-slate-200">
                      <th className="border border-slate-300 p-2">Parameter</th>
                      <th className="border border-slate-300 p-2">Observed Value</th>
                      <th className="border border-slate-300 p-2">DGMS Statutory Limit</th>
                      <th className="border border-slate-300 p-2">Finding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gasReadings.map(g => (
                      <tr key={g.chemicalFormula}>
                        <td className="border border-slate-300 p-2 font-medium">{g.gas}</td>
                        <td className="border border-slate-300 p-2 font-mono">{g.currentValue} {g.unit}</td>
                        <td className="border border-slate-300 p-2 font-mono">{g.comparison} {g.permissibleLimit} {g.unit}</td>
                        <td className="border border-slate-300 p-2">
                          <span className={g.status === 'breach' ? 'text-red-700 font-bold' : 'text-emerald-700 font-semibold'}>
                            {g.status === 'breach' ? 'CONTRAVENTION' : 'COMPLIANT'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Verification items */}
              <div>
                <div className="font-bold text-xs uppercase tracking-wide mb-1 font-sans">
                  2. Physical Examination Findings under CMR 2017
                </div>
                <ul className="list-disc pl-5 space-y-1 text-xs font-sans">
                  {statutoryChecks.map(c => (
                    <li key={c.id}>
                      <strong>{c.reg}:</strong> {c.label} — <span className="text-emerald-700 font-semibold">Verified Safe</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remarks */}
              <div>
                <div className="font-bold text-xs uppercase tracking-wide mb-1 font-sans">
                  3. Overman Shift Remarks & Relieving Instructions
                </div>
                <p className="p-2 border border-slate-300 bg-slate-50 font-sans text-xs italic">
                  "{signoffRemarks}"
                </p>
              </div>

              {/* Signature Seal */}
              <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end font-sans">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Digital Signature Hash:</div>
                  <div className="text-[9px] font-mono text-slate-800 font-bold max-w-sm break-all">
                    {signedOffBlock?.hash || 'PENDING_SIGNOFF_HASH'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    System: MineGuard Government Compliance Control Engine
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-bold text-xs">Er. Rajeshwar Nath</div>
                  <div className="text-[11px] text-slate-600">Statutory Overman / Mining Sirdar</div>
                  <div className="text-[10px] text-slate-500 font-mono">DGMS Reg. #8821 · SECL Gevra Project</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
