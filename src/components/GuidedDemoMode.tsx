import React, { useState, useEffect } from 'react';
import { 
  Play, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Sparkles, 
  Eye, 
  HelpCircle, 
  ExternalLink, 
  Award, 
  Activity, 
  FileCheck2, 
  Radio, 
  ShieldAlert, 
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../types/mineguard';

export interface GuidedTourStep {
  stepNumber: number;
  title: string;
  targetTab: string;
  targetRole?: UserRole;
  badge: string;
  headline: string;
  instructions: string[];
  keyHighlight: string;
  actionPrompt?: string;
}

export const TOUR_STEPS: GuidedTourStep[] = [
  {
    stepNumber: 1,
    title: 'Apex Governance & Ministry Docket',
    targetTab: 'overview',
    targetRole: 'ministry_official',
    badge: 'Ministry of Coal / CIL Apex',
    headline: 'High-Level National Compliance Oversight & Parliamentary Q&A',
    instructions: [
      'Notice the real-time Statutory Compliance Index (94.2%) and FAFR metrics calculated across SECL Gevra operations.',
      'Click the golden banner "Apex Ministry Docket (8 CIL Subsidiaries & Parliament Q&A)" to view automated Lok Sabha Starred Question 418 answers and live CIL subsidiary risk matrices.',
      'Try clicking "Export PDF Docket" to see an official parliamentary briefing document rendered client-side.'
    ],
    keyHighlight: 'Bridges ground pit data directly to Lok Sabha parliamentary oversight with zero manual aggregation delay.'
  },
  {
    stepNumber: 2,
    title: 'Slope Stability Radar & Evacuation Siren',
    targetTab: 'radar',
    badge: 'Geotechnical Early-Warning',
    headline: 'GroundSAR-3D & Fukuzono Inverse-Velocity Prediction (1/v → 0)',
    instructions: [
      'Look at the top action bar and click the red button "Simulate Cloudburst (78 mm/hr)".',
      'Listen to the realistic synthesized industrial evacuation siren sound through your speakers (sweeping 430Hz to 870Hz).',
      'Click the pulsing "Mute Siren" button to silence or unmute the audio alarm instantly.',
      'Notice the Factor of Safety (FoS) drop to critical levels (<1.10) and observe the Fukuzono 1/v curve estimate time-to-collapse (tf).'
    ],
    keyHighlight: 'Predictive acoustic and geotechnical physics replacing reactive slope monitoring under CMR 2017 Reg. 106.'
  },
  {
    stepNumber: 3,
    title: 'CMR Shift Handover & Gas Lockout',
    targetTab: 'inspections',
    targetRole: 'mine_safety_officer',
    badge: 'CMR 2017 Reg. 43/48 Form IV',
    headline: 'Tamper-Proof Gas Interlock & Biometric Sealing',
    instructions: [
      'Scroll down to the "Statutory Shift Handover & Atmospheric Log (Form IV)" card.',
      'Click "Simulate CO Gas Spike (>50 ppm)" to trigger dangerous carbon monoxide levels.',
      'Observe how the Shift Sign-off button is immediately locked out by statutory safety interlocks.',
      'Click "Reset Gas Sensors", check the statutory safety inspection boxes, enter PIN 4491, and sign off the shift into a cryptographic SHA-256 block.'
    ],
    keyHighlight: 'Eliminates forged paper handover books and enforces personal statutory accountability under Mines Act Section 72A.'
  },
  {
    stepNumber: 4,
    title: 'Offline Field App & Form IX PDF Dossier',
    targetTab: 'inspections',
    badge: 'Field Inspections & Audits',
    headline: 'Offline-First Logging & Government-Standard PDF Generation',
    instructions: [
      'Toggle the "Online/Offline" indicator switch in the top-right header to test offline field queueing.',
      'Examine the field observation form with automatic GPS, bench elevation, and AI regulation mapping (e.g. CMR Reg 106).',
      'Click the "Generate PDF Report" button in the table header.',
      'Preview the official DGMS Form IX Statutory Incident Dossier and click "Print / Save PDF" to test instant vector PDF generation.'
    ],
    keyHighlight: 'Guarantees zero data loss in deep pit zones (-120m RL) with publication-ready DGMS reports.'
  },
  {
    stepNumber: 5,
    title: 'GIS Spatial Twin & In-Pit Telemetry',
    targetTab: 'gis',
    badge: 'Spatial Intelligence & Sensors',
    headline: 'Bench Geometry, Real-Time Piezometers & Drone Flyovers',
    instructions: [
      'Click on different mining benches (e.g., North Pit Bench 3 or West Pit Face 4) to view spatial telemetry.',
      'Inspect live sensor readings: Piezometer pore pressure (kPa), extensometer displacement (mm), and GroundSAR radar vectors.',
      'Click "Dispatch Inspection" on any high-risk zone to automatically pre-populate a field inspection order.'
    ],
    keyHighlight: 'Interactive spatial twin correlates ground sensors directly to geocoded DGMS compliance boundaries.'
  },
  {
    stepNumber: 6,
    title: '3-Tier CAPA Escalation & Blockchain Ledger',
    targetTab: 'workflow',
    badge: 'Autonomous SLAs & Cryptography',
    headline: 'Automated Regulatory Escalation & SHA-256 Audit Trail',
    instructions: [
      'Click "Advance SLA (+12 Hours)" to simulate passage of time and watch statutory SLAs count down.',
      'Notice how unresolved critical hazards escalate up the chain: Shift Overman → Mine Agent → DGMS / CIL Technical Director.',
      'Switch to the "Records & Audits" tab to verify the cryptographic SHA-256 Merkle blockchain ledger securing every inspection record against tampering.'
    ],
    keyHighlight: 'Closes the loop between hazard identification, corrective action enforcement, and immutable forensic auditability.'
  }
];

interface GuidedDemoModeProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setUserRole: (role: UserRole) => void;
}

export const GuidedDemoMode: React.FC<GuidedDemoModeProps> = ({
  activeTab,
  setActiveTab,
  setUserRole
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);

  const step = TOUR_STEPS[currentStepIndex];

  // Auto-switch tabs when advancing steps if tour is active
  const navigateToStep = (index: number) => {
    setCurrentStepIndex(index);
    const target = TOUR_STEPS[index];
    if (target.targetTab) {
      setActiveTab(target.targetTab);
    }
    if (target.targetRole) {
      setUserRole(target.targetRole);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      navigateToStep(currentStepIndex + 1);
    } else {
      setHasCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      navigateToStep(currentStepIndex - 1);
    }
  };

  const handleStartTour = () => {
    setIsOpen(true);
    setMinimized(false);
    setHasCompleted(false);
    navigateToStep(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button (Always visible on all screens) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 animate-bounce duration-1000">
          <button
            onClick={handleStartTour}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-full shadow-2xl border-2 border-white ring-4 ring-amber-500/20 transition-all transform hover:scale-105"
            title="Start Interactive Platform Walkthrough"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Walkthrough</span>
            <span className="bg-slate-950 text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded-full">
              {TOUR_STEPS.length} Steps
            </span>
          </button>
        </div>
      )}

      {/* Guided Tour Modal / Card */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full p-2 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-950 text-slate-100 border-2 border-amber-500/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] font-mono font-bold tracking-wider text-amber-400 uppercase">
                  Platform Feature Tour · Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800 font-mono"
                  title={minimized ? 'Expand guide' : 'Minimize guide'}
                >
                  {minimized ? 'Expand' : 'Minimize'}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  title="Exit tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minimized View */}
            {minimized ? (
              <div className="p-3 flex items-center justify-between bg-slate-900/90 text-xs">
                <div>
                  <span className="font-bold text-amber-300">{step.title}</span>
                  <span className="text-slate-400 text-[11px] block">Currently viewing {step.badge}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNext}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : hasCompleted ? (
              /* Completion Screen */
              <div className="p-5 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Full Platform Tour Complete!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    You have reviewed all 5 pillars of the MineGuard platform: Geotechnical Radar, Atmospheric Handover, Offline Field Audits, GIS Spatial Twin, and Apex Parliamentary Oversight.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setHasCompleted(false);
                      navigateToStep(0);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded font-medium flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restart Tour</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded"
                  >
                    Explore Freely
                  </button>
                </div>
              </div>
            ) : (
              /* Step Details */
              <div className="p-4 space-y-3.5">
                {/* Step Title & Pill */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                      {step.badge}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      Tab: {step.targetTab.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {step.title}
                  </h3>
                  <div className="text-xs text-amber-300 font-medium">
                    {step.headline}
                  </div>
                </div>

                {/* Instructions List */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>What to try right now:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                    {step.instructions.map((inst, i) => (
                      <li key={i} className="leading-relaxed">
                        <span className="text-slate-200">{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statutory / Technical Value Highlight */}
                <div className="bg-amber-500/10 border-l-2 border-amber-500 p-2.5 rounded-r text-[11px] text-amber-200 leading-relaxed">
                  <strong className="text-amber-300">Statutory & Operational Impact:</strong> {step.keyHighlight}
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-1.5 pt-1">
                  {TOUR_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => navigateToStep(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentStepIndex 
                          ? 'w-6 bg-amber-400' 
                          : i < currentStepIndex 
                            ? 'w-2 bg-emerald-500' 
                            : 'w-2 bg-slate-700'
                      }`}
                      title={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 ${
                      currentStepIndex === 0 
                        ? 'text-slate-600 cursor-not-allowed' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Re-trigger navigation to current step tab if user navigated away
                        setActiveTab(step.targetTab);
                        if (step.targetRole) setUserRole(step.targetRole);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-300 underline font-mono"
                    >
                      Focus Tab
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1 shadow-md transition-colors"
                    >
                      <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
