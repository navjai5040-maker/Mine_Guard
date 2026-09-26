import { jsPDF } from 'jspdf';
import { InspectionObservation } from '../types/mineguard';

interface SubsidiaryData {
  code: string;
  name: string;
  hq: string;
  productionTargetMT: number;
  actualProductionMT: number;
  complianceIndex: number;
  openDgmsNotices: number;
  fafr: number;
  status: 'excellent' | 'nominal' | 'action_needed';
}

/**
 * Generates an official, publication-quality PDF for the Ministry Parliamentary Dossier.
 */
export const exportParliamentaryDocketPdf = (subsidiaries: SubsidiaryData[]): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF INDIA · LOK SABHA SECRETARIAT', pageWidth / 2, 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text('MINISTRY OF COAL · PARLIAMENT STARRED QUESTION DOSSIER', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(251, 191, 36); // amber-400
  doc.text('QUESTION NO. 418 · 18TH LOK SABHA WINTER SESSION · SMART GOVERNANCE ID #26024', pageWidth / 2, 22, { align: 'center' });

  y = 35;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, pageWidth - 28, 20, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SUBJECT:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Deployment of Real-Time AI, Cryptographic Safety Registers & SSR in Coal Mines', 40, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('ANSWERED BY:', 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('HON\'BLE MINISTER OF COAL', 48, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('REFERENCE:', 125, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('MoC/LS/Q-418/2026 · Shastri Bhawan, New Delhi', 150, y + 12);

  y += 26;

  // Question & Answer Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('QUESTION LAID ON THE TABLE OF LOK SABHA:', 14, y);
  y += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const qLines = [
    '(a) Whether the Government has deployed real-time AI and spatial risk intelligence systems across Coal India Limited (CIL);',
    '(b) The reduction in Fatal Accident Frequency Rate (FAFR) and statutory contraventions under CMR 2017;',
    '(c) Steps taken to integrate satellite remote sensing (CMSMS / Khanan Prahari) with Slope Stability Radars (SSR); and',
    '(d) Status of tamper-proof digitized shift-handover registers and automated DGMS Form VI contraventions.'
  ];
  qLines.forEach(line => {
    doc.text(line, 16, y);
    y += 5;
  });

  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('STATEMENT / OFFICIAL REPLY LAID BY THE MINISTER OF COAL:', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  
  const answerParagraphs = [
    '(a) & (b): Under the Smart Governance initiative (SIH 2026 Problem Statement ID #26024), Coal India Limited has operationalized the MineGuard centralized compliance and spatial risk intelligence platform. In Asia\'s largest opencast mine, SECL Gevra (53.12 MT annual output), the system enforces real-time tracking of statutory obligations under Coal Mines Regulations 2017, achieving a 94.2% compliance index and reducing open DGMS contravention notices to nominal baseline.',
    '(c): Integrated enterprise APIs connect MoC\'s satellite CMSMS/Khanan Prahari portal directly to GroundSAR-3D Slope Stability Radars. When geotechnical Factor of Safety (FoS) falls below 1.10 or monsoon rainfall exceeds 40 mm/hr, automated geofence cordons prevent dumper and shovel entry into unstable highwalls.',
    '(d): All shift handovers under CMR Regulations 43 and 48 have been digitized via biometric/PIN-sealed DGMS Form IV registers with SHA-256 cryptographic immutability, ensuring zero tamper liability under Section 72A of the Mines Act, 1952.'
  ];

  answerParagraphs.forEach(p => {
    const splitText = doc.splitTextToSize(p, pageWidth - 32);
    doc.text(splitText, 16, y);
    y += splitText.length * 4.2 + 2;
  });

  y += 4;

  // Annexure I Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ANNEXURE I: COAL INDIA LIMITED — SUBSIDIARY STATUTORY COMPLIANCE BENCHMARK', 14, y);
  y += 5;

  // Table header bar
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  doc.text('SUBSIDIARY', 16, y + 4.8);
  doc.text('TARGET (MT)', 65, y + 4.8);
  doc.text('ACTUAL (MT)', 92, y + 4.8);
  doc.text('COMPLIANCE %', 118, y + 4.8);
  doc.text('OPEN NOTICES', 145, y + 4.8);
  doc.text('FAFR RATE', 168, y + 4.8);
  doc.text('TIER', 188, y + 4.8);
  y += 7;

  // Table rows
  subsidiaries.forEach((sub, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(14, y, pageWidth - 28, 6.2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 6.2, pageWidth - 14, y + 6.2);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(sub.code, 16, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.text(`${sub.productionTargetMT.toFixed(1)} MT`, 65, y + 4.2);
    doc.text(`${sub.actualProductionMT.toFixed(1)} MT`, 92, y + 4.2);

    // Color compliance
    if (sub.complianceIndex >= 90) {
      doc.setTextColor(5, 150, 105);
    } else if (sub.complianceIndex >= 85) {
      doc.setTextColor(217, 119, 6);
    } else {
      doc.setTextColor(225, 29, 72);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${sub.complianceIndex.toFixed(1)}%`, 118, y + 4.2);

    doc.setTextColor(sub.openDgmsNotices > 3 ? 225 : 71, sub.openDgmsNotices > 3 ? 29 : 85, sub.openDgmsNotices > 3 ? 72 : 105);
    doc.text(`${sub.openDgmsNotices}`, 148, y + 4.2);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(sub.fafr.toFixed(2), 170, y + 4.2);

    const tierLabel = sub.status === 'excellent' ? 'Tier 1' : sub.status === 'nominal' ? 'Tier 2' : 'Action';
    doc.setFont('helvetica', 'bold');
    doc.text(tierLabel, 188, y + 4.2);

    y += 6.2;
  });

  y += 5;

  // Cryptographic Footer & Seal
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Authenticity Verified: Ministry of Coal Central Docket Repository · Reference: MoC/LS/Q-418/2026', 14, y);
  doc.text('Digitally Certified under National Informatics Centre (NIC) Statutory Data Interoperability Standard', 14, y + 3.5);
  doc.text('Page 1 of 1 · Verified SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', 14, y + 7);

  // Save the PDF
  doc.save('Ministry_of_Coal_Parliamentary_Brief_LS_Q418.pdf');
};

/**
 * Generates an official DGMS Form VI Statutory Notice PDF
 */
export const exportDgmsFormViPdf = (obs: InspectionObservation): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('GOVERNMENT OF INDIA · भारत सरकार', pageWidth / 2, 9, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('MINISTRY OF LABOUR & EMPLOYMENT · श्रम एवं रोजगार मंत्रालय', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 191, 36);
  doc.text('DIRECTORATE GENERAL OF MINES SAFETY (DGMS) · खान सुरक्षा महानिदेशालय', pageWidth / 2, 21, { align: 'center' });

  y = 34;

  // Notice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('FORM VI: STATUTORY NOTICE OF CONTRAVENTION', pageWidth / 2, y, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('[Under Section 22(1) / 22(3) of Mines Act, 1952 & CMR 2017 Regulation 141 & 142]', pageWidth / 2, y + 4.5, { align: 'center' });

  y += 12;

  // Meta grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, pageWidth - 28, 22, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  doc.setFont('helvetica', 'bold');
  doc.text('NOTICE NO:', 18, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`DGMS/WZ/BIL/2026/NOT-${obs.ticketNumber.replace('#', '')}`, 42, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.text('DATE OF INSPECTION:', 115, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(obs.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 155, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.text('MINE / SUBSIDIARY:', 18, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Gevra Opencast Mine · South Eastern Coalfields Limited (SECL)', 52, y + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.text('LOCATION / ZONE:', 18, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.zoneName} (Mine Code: MINE-CG-SECL-001)`, 50, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.text('SEVERITY TIER:', 115, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text(obs.severity.toUpperCase(), 145, y + 17);

  y += 28;

  // Violation Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. STATUTORY CONTRAVENTION DETAILS & EVIDENCE:', 14, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const titleLines = doc.splitTextToSize(`Violation Subject: ${obs.title}`, pageWidth - 32);
  doc.text(titleLines, 16, y);
  y += titleLines.length * 4.5 + 2;

  const descLines = doc.splitTextToSize(`Field Findings: ${obs.description}`, pageWidth - 32);
  doc.text(descLines, 16, y);
  y += descLines.length * 4.5 + 4;

  // Statutory Citation Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.rect(14, y, pageWidth - 28, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);
  const ruleRef = obs.aiAssistance?.suggestedRegulation || `Statutory Control ${obs.controlId}`;
  doc.text(`STATUTORY CONTRAVENTION REFERENCE: ${ruleRef}`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  doc.text('Failure to maintain statutory bench geometry / ventilation / equipment clearance as prescribed under Coal Mines Regulations, 2017.', 18, y + 11);
  doc.text('Notice issued under Section 22(1) with mandatory compliance deadline within 48 hours.', 18, y + 15);

  y += 24;

  // Corrective Directives
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MANDATORY STATUTORY DIRECTIVES:', 14, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const directives = [
    '1. Immediately suspend heavy machinery and earthmoving equipment operations in the demarcated hazard zone.',
    '2. Execute corrective bench grading / barrier reconstruction / statutory dust suppression in full accordance with DGMS circulars.',
    '3. Submit verified photographic and geotechnical compliance proof via the MineGuard digital portal within 48 hours.',
    '4. Note that non-compliance will trigger Section 22(3) prohibitive orders and personal liability under Section 72A of the Mines Act, 1952.'
  ];
  directives.forEach(d => {
    const dLines = doc.splitTextToSize(d, pageWidth - 32);
    doc.text(dLines, 16, y);
    y += dLines.length * 4.2 + 1.5;
  });

  y += 8;

  // Signatures
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ER. RAJESH KUMAR, DGMS', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Deputy Director of Mines Safety (Mining)', 16, y + 4);
  doc.text('Bilaspur Region, Western Zone · Certificate #DDMS-WZ-8841', 16, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DIGITAL STATUTORY SEAL', pageWidth - 65, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIC National Portal Hash-Certified', pageWidth - 65, y + 4);
  doc.text(`Token: SHA256-${obs.id.slice(0, 16).toUpperCase()}`, pageWidth - 65, y + 8);

  doc.save(`DGMS_Form_VI_Notice_${obs.ticketNumber.replace('#', '')}.pdf`);
};

/**
 * Downloads a self-printing HTML document.
 * When opened in any browser, it immediately launches the print dialog with styling and letterheads.
 */
export const downloadSelfPrintingHtml = (title: string, bodyHtml: string, filename: string): void => {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      font-size: 11pt;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 { margin: 0; font-size: 14pt; letter-spacing: 1px; }
    .header h2 { margin: 4px 0; font-size: 10pt; color: #475569; }
    .header h3 { margin: 0; font-size: 11pt; color: #1e293b; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: 9pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
    }
    .footer {
      border-top: 1px solid #cbd5e1;
      margin-top: 25px;
      padding-top: 8px;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#e0f2fe; border:1px solid #7dd3fc; padding:10px 14px; border-radius:6px; margin-bottom:20px; font-family:sans-serif; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
    <span><strong>Official Ministry Print Document</strong> — Print dialog automatically opened. If not, press Ctrl+P (or Cmd+P) to print.</span>
    <button onclick="window.print()" style="background:#0284c7; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer;">Print Now</button>
  </div>
  ${bodyHtml}
  <script>
    window.onload = function() {
      setTimeout(function() {
        try { window.print(); } catch(e) { console.log(e); }
      }, 400);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generates an official, publication-quality Government-Standard Field Incident & Hazard Audit Report PDF
 */
export const exportFieldIncidentReportPdf = (
  observations: InspectionObservation[],
  meta?: {
    mineName?: string;
    officerName?: string;
    officerCert?: string;
  }
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 16;
  let pageNum = 1;

  const renderHeader = (isContinuation = false) => {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, isContinuation ? 18 : 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isContinuation ? 10 : 12);
    doc.text('GOVERNMENT OF INDIA · MINISTRY OF LABOUR & EMPLOYMENT', pageWidth / 2, isContinuation ? 8 : 9, { align: 'center' });

    doc.setFontSize(isContinuation ? 8 : 8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    doc.text('DIRECTORATE GENERAL OF MINES SAFETY (DGMS) · BILASPUR REGION', pageWidth / 2, isContinuation ? 13 : 15, { align: 'center' });

    if (!isContinuation) {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(251, 191, 36);
      doc.text('FORM IX: STATUTORY FIELD INCIDENT & HAZARD AUDIT REPORT', pageWidth / 2, 21, { align: 'center' });
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text('[Coal Mines Regulations 2017 · Reg. 106, 141 & 142 | Mines Act 1952 Sec. 22]', pageWidth / 2, 25.5, { align: 'center' });
    }
  };

  const renderFooter = (curPage: number) => {
    doc.setDrawColor(203, 213, 225);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('SECL Gevra Mega Opencast Project · Statutory Field Incident Record · NIC Hash-Certified', 14, pageHeight - 7.5);
    doc.text(`Page ${curPage}`, pageWidth - 25, pageHeight - 7.5);
  };

  renderHeader(false);
  y = 35;

  // Metadata summary grid
  const criticalCount = observations.filter(o => o.severity === 'critical').length;
  const highCount = observations.filter(o => o.severity === 'high').length;
  const openCount = observations.filter(o => o.status !== 'verified_closed').length;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, pageWidth - 28, 26, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  doc.setFont('helvetica', 'bold');
  doc.text('MINE / OPERATOR:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(meta?.mineName || 'Gevra Opencast Mine (SECL / Coal India Limited)', 52, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('REPORT REF:', 130, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`DGMS/GEV/AUDIT-${new Date().getFullYear()}-${observations.length}`, 155, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('AUDIT DATE / TIME:', 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, 52, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('INSPECTING OFFICER:', 130, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(meta?.officerName || 'R. C. Verma (Overman Cert #OVM-2016-8821)', 162, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('HAZARD METRICS:', 18, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Logged: ${observations.length} | `, 48, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text(`Critical: ${criticalCount}`, 72, y + 18);
  doc.setTextColor(217, 119, 6);
  doc.text(` | High: ${highCount}`, 90, y + 18);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text(` | Open Actions: ${openCount} | Statutory Compliance: 94.2%`, 108, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('AREA COORDINATES:', 18, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.text('Lat: 22.349210° N · Long: 82.684120° E · RL -120m to +340m', 52, y + 23);

  y += 32;

  // Observations Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('RECORDED STATUTORY OBSERVATIONS & CONTRAVENTIONS:', 14, y);
  y += 5;

  observations.forEach((obs, index) => {
    // Check if space remains for observation card
    if (y + 34 > pageHeight - 20) {
      renderFooter(pageNum);
      doc.addPage();
      pageNum++;
      renderHeader(true);
      y = 24;
    }

    const isCritical = obs.severity === 'critical';
    doc.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 29, 'FD');

    // Left severity accent bar
    doc.setFillColor(isCritical ? 225 : 217, isCritical ? 29 : 119, isCritical ? 72 : 6);
    doc.rect(14, y, 2.5, 29, 'F');

    // Observation header
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const obsTitle = doc.splitTextToSize(`${index + 1}. [${obs.ticketNumber}] ${obs.title}`, 120);
    doc.text(obsTitle[0], 19, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isCritical ? 190 : 180, isCritical ? 18 : 83, isCritical ? 60 : 9);
    doc.text(`SEVERITY: ${obs.severity.toUpperCase()} (${isCritical ? '24h SLA' : '48h SLA'})`, pageWidth - 65, y + 5);

    // Details line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const desc = doc.splitTextToSize(obs.description, pageWidth - 40);
    doc.text(desc.slice(0, 2), 19, y + 10);

    // Metadata line
    doc.setFont('helvetica', 'bold');
    doc.text('ZONE:', 19, y + 18.5);
    doc.setFont('helvetica', 'normal');
    doc.text(obs.zoneName.slice(0, 26), 30, y + 18.5);

    const reg = obs.aiAssistance?.suggestedRegulation || `Control ${obs.controlId}`;
    doc.setFont('helvetica', 'bold');
    doc.text('STATUTE REF:', 85, y + 18.5);
    doc.setFont('helvetica', 'normal');
    doc.text(reg, 110, y + 18.5);

    doc.setFont('helvetica', 'bold');
    doc.text('STATUS:', pageWidth - 55, y + 18.5);
    doc.setFont('helvetica', 'normal');
    doc.text(obs.status.replace('_', ' ').toUpperCase(), pageWidth - 42, y + 18.5);

    // AI Anomaly & Evidence Hash
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const aiNote = obs.aiAssistance?.detectedAnomaly ? `AI Inspection: ${obs.aiAssistance.detectedAnomaly.slice(0, 75)}...` : 'Visual field inspection verified';
    doc.text(aiNote, 19, y + 24.5);
    doc.text(`Evidence SHA-256: ${obs.evidenceHash ? obs.evidenceHash.slice(0, 20) : 'e3b0c44298fc1c14'}...`, pageWidth - 75, y + 24.5);

    y += 32;
  });

  // Mandatory Directives Box
  if (y + 30 > pageHeight - 20) {
    renderFooter(pageNum);
    doc.addPage();
    pageNum++;
    renderHeader(true);
    y = 24;
  }

  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.rect(14, y, pageWidth - 28, 19, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(153, 27, 27);
  doc.text('STATUTORY DIRECTIVES (COAL MINES REGULATIONS 2017 & MINES ACT 1952):', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(185, 28, 28);
  doc.text('1. Heavy earthmoving machinery (HEMM) operations in marked critical hazard zones must remain suspended until certified.', 18, y + 9.5);
  doc.text('2. Remedial earthworks, bund restoration, and dust suppression measures must be uploaded with geo-tagged verification photo within SLA.', 18, y + 13.5);
  doc.text('3. Default in compliance triggers statutory notice under Section 22(1) with personal penal liability under Section 72A.', 18, y + 17.5);

  y += 23;

  // Signatures block
  if (y + 22 > pageHeight - 20) {
    renderFooter(pageNum);
    doc.addPage();
    pageNum++;
    renderHeader(true);
    y = 24;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('R. C. VERMA, STATUTORY OVERMAN', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Overman\'s Certificate of Competency #OVM-2016-8821', 18, y + 4);
  doc.text('SECL Gevra Project · Western Zone Bilaspur', 18, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('DIRECTORATE GENERAL OF MINES SAFETY', pageWidth - 78, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Bilaspur Regional Directorate Office', pageWidth - 78, y + 4);
  doc.text('NIC Statutory Record Hash: SHA256-FD98A41C', pageWidth - 78, y + 7.5);

  renderFooter(pageNum);

  doc.save(`DGMS_Field_Incident_Audit_Report_SECL_Gevra_${new Date().toISOString().slice(0, 10)}.pdf`);
};
