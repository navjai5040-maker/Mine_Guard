import React, { useState } from 'react';
import { 
  Cpu, 
  Sliders, 
  AlertCircle, 
  TrendingUp, 
  HelpCircle, 
  GitMerge, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import { MINE_ZONES, STATUTORY_CONTROLS, CONTRACTORS_DATA } from '../data/mockData';

export const AiRiskEngine: React.FC = () => {
  // Configurable Weights for Explainable Risk Engine
  const [weights, setWeights] = useState({
    severity: 0.30,
    recurrence: 0.25,
    overdue: 0.20,
    contractorHistory: 0.15,
    evidenceGap: 0.10
  });

  const [activeZoneId, setActiveZoneId] = useState<string>('zone-north-pit');
  const [selectedAnomalyIndex, setSelectedAnomalyIndex] = useState<number>(0);

  const anomalies = [
    {
      id: 'ANOM-2026-08',
      title: 'Haulage Cycle Time Anomaly (+42% Variance)',
      zone: 'North Pit Shovel #4 to In-pit Crusher',
      metric: 'Haul Cycle Duration',
      baseline: '18.2 minutes',
      observed: '25.8 minutes',
      zScore: 3.4,
      severity: 'high',
      rootCauseHypothesis: 'Bench width narrowing (CMR 104) has forced dump trucks to slow down and wait for one-way traffic passing.',
      recommendedAction: 'Issue immediate bench widening order to Eastern Earthmovers; deploy traffic spotter at Ch. 1+400.'
    },
    {
      id: 'ANOM-2026-09',
      title: 'Discharge Turbidity Surge (TSS Outlier)',
      zone: 'Sedimentation Pond Weir #2',
      metric: 'Total Suspended Solids',
      baseline: '68 mg/L (Historical Sept Avg)',
      observed: '134 mg/L (+97% surge)',
      zScore: 4.1,
      severity: 'critical',
      rootCauseHypothesis: 'Heavy sudden silt runoff from unbunded dump slope bench 4 bypassed settling lagoon due to dosing pump failure.',
      recommendedAction: 'Divert effluent to reserve storage lagoon; activate secondary flocculant injection.'
    },
    {
      id: 'ANOM-2026-10',
      title: 'Monsoon Shift Operator Absenteeism Spike',
      zone: 'Dump Truck Operators (Eastern Earthmovers)',
      metric: 'Biometric Attendance Form B',
      baseline: '94.2% Attendance',
      observed: '78.5% Attendance',
      zScore: 2.8,
      severity: 'medium',
      rootCauseHypothesis: 'Contractor delayed statutory HPC wage disbursement by 5 days, causing localized workforce discontent.',
      recommendedAction: 'Trigger CIL ICIS contractor wage verification notice with 24h compliance demand.'
    }
  ];

  // Dynamically calculate explainable risk for selected zone
  const calculateExplainableRisk = (zoneId: string) => {
    let s = 80;
    let r = 75;
    let o = 85;
    let c = 82;
    let e = 90;

    if (zoneId === 'zone-ob-dump-4') {
      s = 85; r = 70; o = 80; c = 75; e = 60;
    } else if (zoneId === 'zone-water-lagoon') {
      s = 70; r = 60; o = 70; c = 65; e = 75;
    } else if (zoneId === 'zone-chp-siding') {
      s = 20; r = 25; o = 30; c = 35; e = 25;
    }

    const compositeScore = Math.round(
      s * weights.severity +
      r * weights.recurrence +
      o * weights.overdue +
      c * weights.contractorHistory +
      e * weights.evidenceGap
    );

    return {
      compositeScore,
      breakdown: [
        { label: 'Statutory Severity', rawScore: s, weight: weights.severity, contribution: Math.round(s * weights.severity), desc: 'CMR 2017 highwall slope stability danger (Reg 104)' },
        { label: 'Recurrence Pattern', rawScore: r, weight: weights.recurrence, contribution: Math.round(r * weights.recurrence), desc: '2 identical bench width observations in past 45 days' },
        { label: 'Overdue SLA Delay', rawScore: o, weight: weights.overdue, contribution: Math.round(o * weights.overdue), desc: 'Corrective action overdue by 11 days past statutory window' },
        { label: 'Contractor Demerits', rawScore: c, weight: weights.contractorHistory, contribution: Math.round(c * weights.contractorHistory), desc: 'Eastern Earthmovers has 4 active safety notices on CIL ICIS' },
        { label: 'Evidence Gap', rawScore: e, weight: weights.evidenceGap, contribution: Math.round(e * weights.evidenceGap), desc: 'Missing required monthly 3D drone photogrammetry log' }
      ]
    };
  };

  const currentRiskResult = calculateExplainableRisk(activeZoneId);
  const selectedZone = MINE_ZONES.find(z => z.id === activeZoneId) || MINE_ZONES[0];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Transparent Governance Analytics
              </span>
              <span className="text-xs text-slate-400 font-mono">Deterministic Rules + Isolation Forest Statistical ML</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Risk Engine & Operational Anomaly Detector
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Transparent, explainable risk scoring without black-box hallucinations. 
              Every risk score answers <em>"Why am I seeing this score?"</em> with mathematical attribution.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            Formula: Risk = ∑ (Weight_i × Factor_i)
          </div>
        </div>
      </div>

      {/* Main Grid: Explainable Calculator on Left (7 cols), Anomaly Detection on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Explainable Risk Calculator & Factor Weights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Zone Risk Attribution & Weight Tuning
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a mine zone and inspect or re-calibrate the governance risk model weights.
                </p>
              </div>

              {/* Zone Selector */}
              <select
                value={activeZoneId}
                onChange={(e) => setActiveZoneId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
              >
                {MINE_ZONES.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>

            {/* Giant Explainable Score Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">Current Computed Risk Index</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-4xl font-extrabold font-mono tabular-nums ${
                    currentRiskResult.compositeScore >= 80 ? 'text-rose-400' :
                    currentRiskResult.compositeScore >= 60 ? 'text-amber-400' :
                    'text-emerald-400'
                  }`}>
                    {currentRiskResult.compositeScore}
                    <span className="text-xl text-slate-500 font-normal"> / 100</span>
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    currentRiskResult.compositeScore >= 80 ? 'bg-rose-950 text-rose-300 border-rose-800' :
                    currentRiskResult.compositeScore >= 60 ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {currentRiskResult.compositeScore >= 80 ? 'Critical Risk' : currentRiskResult.compositeScore >= 60 ? 'High Risk' : 'Compliant'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Zone: <strong className="text-white">{selectedZone.name}</strong>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 text-right font-mono hidden sm:block">
                <div>Model: Hybrid Deterministic + ML</div>
                <div>Confidence: 96.4%</div>
                <div>Status: High Escalation Priority</div>
              </div>
            </div>

            {/* Factor Weight Sliders & Live Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-400">
                  Mathematical Attribution Factors (Weights Sum = 1.0)
                </span>
                <button
                  onClick={() => setWeights({ severity: 0.30, recurrence: 0.25, overdue: 0.20, contractorHistory: 0.15, evidenceGap: 0.10 })}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-3">
                {currentRiskResult.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{item.label}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400">Raw: {item.rawScore}</span>
                        <span className="text-slate-500">×</span>
                        <span className="text-amber-400 font-semibold">{item.weight.toFixed(2)} wt</span>
                        <span className="text-slate-500">=</span>
                        <span className="text-white font-bold font-mono">+{item.contribution} pts</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          item.rawScore >= 80 ? 'bg-rose-500' : item.rawScore >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${item.rawScore}%` }}
                      ></div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-amber-400">↳</span>
                      <span>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Propagation Graph Explanation */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-800/30 text-xs space-y-2">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <GitMerge className="w-3.5 h-3.5" />
                Cross-System Risk Propagation Note
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The AI Risk Engine correlated a <strong>CMR 104 bench width deficiency</strong> with a 
                <strong>+42% haulage delay</strong> and <strong>Contractor Eastern Earthmovers' prior demerit points</strong>. 
                Instead of treating these as three isolated events in different software, MineGuard propagates them into a single heightened operational safety hazard.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Operational Anomaly Detector (Isolation Forest / Outliers) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <h3 className="font-semibold text-white text-sm">Real-time Operational Anomalies</h3>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                3 Statistical Outliers
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Statistical anomaly detection flags operational deviations before they manifest as statutory safety violations or disasters.
            </p>

            <div className="space-y-3">
              {anomalies.map((anomaly, idx) => {
                const isSelected = selectedAnomalyIndex === idx;
                return (
                  <div
                    key={anomaly.id}
                    onClick={() => setSelectedAnomalyIndex(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-slate-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/30' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-100">{anomaly.title}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold text-rose-300 bg-rose-950 border border-rose-800">
                        Z = {anomaly.zScore}σ
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Baseline Mean</span>
                        <span className="text-slate-300 font-medium">{anomaly.baseline}</span>
                      </div>
                      <div className="p-1.5 rounded bg-rose-950/40 border border-rose-900/60">
                        <span className="text-[10px] text-rose-400 block">Observed Outlier</span>
                        <span className="text-rose-200 font-bold">{anomaly.observed}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 text-[11px] text-slate-400">
                      Location: <strong className="text-slate-300">{anomaly.zone}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Anomaly Deep-Dive Root Cause */}
            {anomalies[selectedAnomalyIndex] && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Root-Cause Hypothesis ({anomalies[selectedAnomalyIndex].id}):
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {anomalies[selectedAnomalyIndex].rootCauseHypothesis}
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-emerald-400 font-semibold">Recommended Intervention:</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {anomalies[selectedAnomalyIndex].recommendedAction}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
