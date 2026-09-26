import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Search,
  Eye,
  FileCheck,
  FileText,
  Video,
  X
} from 'lucide-react';
import { MINE_ZONES, STATUTORY_CONTROLS } from '../data/mockData';
import { InspectionObservation, GpsCoordinates, RiskLevel } from '../types/mineguard';
import { sha256, syncHash } from '../utils/crypto';
import { DgmsFormViModal } from './DgmsFormViModal';
import { ShiftHandoverLog } from './ShiftHandoverLog';
import { FieldIncidentReportModal } from './FieldIncidentReportModal';
import { exportFieldIncidentReportPdf } from '../utils/printPdfGenerator';
import { Printer, Download } from 'lucide-react';

interface FieldAppProps {
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  onNewObservationSubmitted: (obs: InspectionObservation) => void;
  observations: InspectionObservation[];
}

export const FieldAppSimulator: React.FC<FieldAppProps> = ({
  isOnline,
  setIsOnline,
  onNewObservationSubmitted,
  observations
}) => {
  // Sub-mode state for Field Operations
  const [subMode, setSubMode] = useState<'inspections' | 'shift_handover'>('inspections');

  // Form State
  const [selectedZoneId, setSelectedZoneId] = useState(MINE_ZONES[1].id);
  const [selectedControlId, setSelectedControlId] = useState('CMR-SAF-106');
  const [title, setTitle] = useState('Sub-standard Berm Bund on Dump Crest');
  const [description, setDescription] = useState('Berm height measured at 1.45m along 180m dump crest. Statutory requirement for 240T dumpers is >= 2.40m.');
  const [severity, setSeverity] = useState<RiskLevel>('critical');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80');
  
  // Real GPS state
  const [gps, setGps] = useState<GpsCoordinates>({
    latitude: 22.349210,
    longitude: 82.684120,
    elevationMeters: 342.5,
    accuracyMeters: 2.1,
    locationName: 'Gevra South OB Dump 4 (Fixed RTK)'
  });
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  // Live Camera Capture State
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // AI Assist State
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiOutput, setAiOutput] = useState<{
    anomaly: string;
    confidence: number;
    regulation: string;
    riskAddition: number;
  } | null>({
    anomaly: 'Berm bund height < 2.40m + visible tension fracture along dump edge',
    confidence: 0.96,
    regulation: 'CMR 2017 Reg. 106(3)',
    riskAddition: 38
  });

  // Offline queue state
  const [offlineQueue, setOfflineQueue] = useState<InspectionObservation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter for table & DGMS notice preview
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [activeNoticeObservation, setActiveNoticeObservation] = useState<InspectionObservation | null>(null);
  const [showIncidentReportModal, setShowIncidentReportModal] = useState<boolean>(false);

  const handleQuickExportPdfReport = () => {
    try {
      exportFieldIncidentReportPdf(filteredObservations);
      setSuccessToast(`Government-Standard Incident Report PDF exported (${filteredObservations.length} observations).`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  // Start Live Camera
  const startCamera = async () => {
    setIsLiveCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // Fallback if camera permission is denied
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraOpen(false);
  };

  const captureCameraFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUrl(dataUrl);
        triggerAiAssist();
      }
    }
    stopCamera();
  };

  // Attempt real browser geolocation on mount or refresh
  const fetchLiveGps = () => {
    setIsFetchingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGps({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            elevationMeters: position.coords.altitude || 342.0,
            accuracyMeters: Math.round(position.coords.accuracy * 10) / 10,
            locationName: 'Current Field Device GPS'
          });
          setIsFetchingGps(false);
        },
        () => {
          setIsFetchingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsFetchingGps(false);
    }
  };

  // Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          triggerAiAssist();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiAssist = () => {
    setIsAiRunning(true);
    setTimeout(() => {
      setIsAiRunning(false);
      setAiOutput({
        anomaly: 'Visual anomaly flagged: Geometric bunding height sub-standard under CMR regulations',
        confidence: 0.95,
        regulation: selectedControlId,
        riskAddition: severity === 'critical' ? 38 : 24
      });
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedZone = MINE_ZONES.find(z => z.id === selectedZoneId) || MINE_ZONES[0];
    const ticket = `SECL/GEV/SAF/2026/${Math.floor(Math.random() * 800) + 100}`;

    // Cryptographic Evidence Payload
    const evidencePayload = JSON.stringify({
      ticket,
      timestamp: new Date().toISOString(),
      gps,
      officer: 'Er. Rajeshwar Nath',
      photoUrl,
      aiOutput
    });

    let hash = '';
    try {
      hash = await sha256(evidencePayload);
    } catch {
      hash = syncHash(evidencePayload);
    }

    const newObs: InspectionObservation = {
      id: `OBS-${Date.now()}`,
      ticketNumber: ticket,
      controlId: selectedControlId,
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      category: 'safety',
      severity,
      title,
      description,
      gps,
      timestamp: new Date().toISOString(),
      officerId: 'INSP-SECL-4108',
      officerName: 'Er. Rajeshwar Nath',
      officerDesignation: 'Safety Officer (DGMS #8821)',
      evidencePhoto: photoUrl,
      aiAssistance: {
        detectedAnomaly: aiOutput?.anomaly || 'Field observation logged',
        confidenceScore: aiOutput?.confidence || 0.95,
        suggestedRegulation: aiOutput?.regulation || 'CMR 2017 Reg. 106',
        riskScoreContribution: aiOutput?.riskAddition || 30
      },
      contractorName: selectedZone.activeContractor || 'Direct SECL',
      status: isOnline ? 'action_assigned' : 'reported',
      evidenceHash: `0x${hash}`,
      syncStatus: isOnline ? 'synced' : 'pending_local_sync'
    };

    if (!isOnline) {
      setOfflineQueue(prev => [newObs, ...prev]);
      setSuccessToast(`Saved locally to Offline Queue (Ticket: ${ticket}). Ready to sync.`);
    } else {
      onNewObservationSubmitted(newObs);
      setSuccessToast(`Observation ${ticket} logged and published to Central Monitoring.`);
    }

    setIsSubmitting(false);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleFlushOfflineQueue = () => {
    offlineQueue.forEach(item => {
      onNewObservationSubmitted({
        ...item,
        syncStatus: 'synced',
        status: 'action_assigned'
      });
    });
    setOfflineQueue([]);
    setSuccessToast(`Synchronized ${offlineQueue.length} offline records to central database.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filteredObservations = observations.filter(o => {
    if (filterSeverity === 'all') return true;
    return o.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Title & Status Strip */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Feature 1: Working Module
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time Field Reporting</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Field Inspection & Safety Observation Logging
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Log time-stamped, geo-tagged statutory observations with camera proof and offline-first queue support.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowIncidentReportModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            title="Open Government-Standard Incident Report Preview & Print"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate PDF Report</span>
          </button>

          {offlineQueue.length > 0 && isOnline && (
            <button
              onClick={handleFlushOfflineQueue}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-md shadow-xs flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync {offlineQueue.length} Offline Items</span>
            </button>
          )}
        </div>
      </div>

      {successToast && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Sub-mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-lg shadow-xs overflow-x-auto">
        <button
          onClick={() => setSubMode('inspections')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            subMode === 'inspections'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Field Observation & AI Incident Logging (CMR 2017)</span>
        </button>

        <button
          onClick={() => setSubMode('shift_handover')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            subMode === 'shift_handover'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Statutory Shift Handover & Gas Register (DGMS Form IV / Reg. 43 & 48)</span>
        </button>
      </div>

      {subMode === 'shift_handover' ? (
        <ShiftHandoverLog />
      ) : (
        <>
          {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Logging Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">New Inspection Record</h2>
            <span className="text-xs font-mono text-slate-500">DGMS Form VI format</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* GPS Auto-Lock Banner */}
            <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>GPS Geotag Locked</span>
                </div>
                <div className="font-mono text-slate-600 text-[11px]">
                  {gps.latitude.toFixed(6)}° N, {gps.longitude.toFixed(6)}° E (±{gps.accuracyMeters}m)
                </div>
              </div>
              <button
                type="button"
                onClick={fetchLiveGps}
                disabled={isFetchingGps}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium"
              >
                {isFetchingGps ? 'Locking...' : 'Refresh GPS'}
              </button>
            </div>

            {/* Mine Zone & Regulation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Mine Working Zone</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                >
                  {MINE_ZONES.map(z => (
                    <option key={z.id} value={z.id}>{z.name.split(' ')[0]} - {z.name.slice(0, 22)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Statute & Regulation</label>
                <select
                  value={selectedControlId}
                  onChange={(e) => setSelectedControlId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                >
                  {STATUTORY_CONTROLS.map(c => (
                    <option key={c.id} value={c.id}>{c.regulationNumber}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <label className="font-medium text-slate-700 block mb-1">Observation Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                placeholder="Brief summary of observed condition..."
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Field Observations & Measurements</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
                placeholder="Include bench height, bund width, or sensor readings..."
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className="font-medium text-slate-700 block mb-1">Severity & SLA Level</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSeverity('critical')}
                  className={`py-1.5 px-3 rounded-md font-semibold border text-xs transition-colors ${
                    severity === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Critical (24h SLA)
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('high')}
                  className={`py-1.5 px-3 rounded-md font-semibold border text-xs transition-colors ${
                    severity === 'high' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  High (48h SLA)
                </button>
              </div>
            </div>

            {/* Photo Evidence with Real File Upload & Live Camera Capture */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">Photographic Evidence</label>
                <button
                  type="button"
                  onClick={triggerAiAssist}
                  className="text-blue-800 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Run AI Assist</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 h-18 rounded border border-slate-300 overflow-hidden shrink-0 bg-slate-100">
                  <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Live Camera Snapshot Button */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-medium shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Take Live Photo</span>
                    </button>

                    {/* File Upload Button */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-medium cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="text-[11px] text-slate-500">Live webcam / camera capture or JPG/PNG upload</div>
                </div>
              </div>

              {/* AI Detection Banner */}
              {aiOutput && (
                <div className="mt-2.5 p-2 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span>AI Detection Assist ({Math.round(aiOutput.confidence * 100)}% confidence):</span>
                    <span className="text-amber-800 font-mono">+{aiOutput.riskAddition} Risk Pts</span>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-0.5">{aiOutput.anomaly}</div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isOnline ? 'Submit & Create Corrective Action' : 'Save to Offline Field Queue'}
              </span>
            </button>
          </form>
        </div>

        {/* Right Column: Submitted Field Observations Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recorded Field Observations ({filteredObservations.length})</h2>
              <p className="text-xs text-slate-500">Statutory inspection logbook for Gevra Project</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Severity Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
                {['all', 'critical', 'high'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterSeverity(f)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors uppercase ${
                      filterSeverity === f ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Generate PDF Report Button */}
              <button
                type="button"
                onClick={() => setShowIncidentReportModal(true)}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-md text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                title="Generate printable government-standard incident report PDF"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate PDF Report</span>
              </button>

              <button
                type="button"
                onClick={handleQuickExportPdfReport}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs shadow-xs flex items-center gap-1 transition-colors"
                title="Quick export PDF directly to device"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="p-3">Ticket / Date</th>
                  <th className="p-3">Zone & Title</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Statutory Notice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredObservations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono">
                      <div className="font-semibold text-slate-900">{obs.ticketNumber}</div>
                      <div className="text-[11px] text-slate-500">{new Date(obs.timestamp).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3 max-w-[220px]">
                      <div className="font-medium text-slate-900 truncate">{obs.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{obs.zoneName}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        obs.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {obs.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-700 font-medium text-[11px] capitalize">
                        {obs.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveNoticeObservation(obs)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-blue-900 font-medium rounded text-[11px] border border-slate-200 transition-colors inline-flex items-center gap-1"
                        title="Generate official DGMS Form VI Notice"
                      >
                        <FileText className="w-3 h-3 text-amber-600" />
                        <span>Form VI</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DGMS Form VI Modal */}
      {activeNoticeObservation && (
        <DgmsFormViModal
          observation={activeNoticeObservation}
          onClose={() => setActiveNoticeObservation(null)}
        />
      )}

      {/* Government-Standard Field Incident Report Modal */}
      {showIncidentReportModal && (
        <FieldIncidentReportModal
          observations={filteredObservations}
          onClose={() => setShowIncidentReportModal(false)}
        />
      )}

      {/* Live Camera Modal */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 max-w-md w-full text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold text-xs flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" /> Live Field Camera Feed
              </span>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                REC · LIVE GPS
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureCameraFrame}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs shadow-xs flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
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
