export type Language = 'en' | 'hi';

export interface Translations {
  ministryName: string;
  cilName: string;
  subsidiaryName: string;
  projectName: string;
  navDashboard: string;
  navInspections: string;
  navCompliance: string;
  navRadar: string;
  navGis: string;
  navCapa: string;
  navRecords: string;
  complianceIndex: string;
  activeObservations: string;
  annualProduction: string;
  auditChain: string;
  logInspection: string;
  viewGis: string;
  mineZones: string;
  activeViolations: string;
  critical: string;
  high: string;
  medium: string;
  compliant: string;
  overdue: string;
  dueSoon: string;
  statuteNumber: string;
  responsibleDept: string;
  dueDate: string;
  actionInspect: string;
  generateNotice: string;
  simulateTimeLapse: string;
  verifiedClosed: string;
  offlineMode: string;
  onlineMode: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    ministryName: 'MINISTRY OF COAL',
    cilName: 'COAL INDIA LIMITED',
    subsidiaryName: 'South Eastern Coalfields Ltd (SECL)',
    projectName: 'Gevra Mega Opencast Project',
    navDashboard: 'Dashboard',
    navInspections: 'Field Inspections',
    navCompliance: 'Statutory Compliance',
    navRadar: 'Slope Radar & Siren',
    navGis: 'GIS Mine Map',
    navCapa: 'Corrective Actions (CAPA)',
    navRecords: 'Records & Audits',
    complianceIndex: 'Statutory Compliance Index',
    activeObservations: 'Active Field Observations',
    annualProduction: 'Annual Production Scale',
    auditChain: 'Cryptographic Audit Chain',
    logInspection: 'Log Field Inspection',
    viewGis: 'View GIS Map',
    mineZones: 'Mine Working Zones & Live Status',
    activeViolations: 'Active Field Violations',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    compliant: 'Compliant',
    overdue: 'Overdue',
    dueSoon: 'Due Soon',
    statuteNumber: 'Regulation No.',
    responsibleDept: 'Responsible Dept',
    dueDate: 'Due Date',
    actionInspect: 'Inspect / Update',
    generateNotice: 'Official DGMS Form VI',
    simulateTimeLapse: 'Advance SLA (+12 Hours)',
    verifiedClosed: 'Verified Closed',
    offlineMode: 'Offline Mode',
    onlineMode: 'Online',
  },
  hi: {
    ministryName: 'कोयला मंत्रालय, भारत सरकार',
    cilName: 'कोल इंडिया लिमिटेड (CIL)',
    subsidiaryName: 'साउथ ईस्टर्न कोलफील्ड्स लिमिटेड (एसईसीएल)',
    projectName: 'गेवरा मेगा ओपनकास्ट परियोजना',
    navDashboard: 'मुख्य पृष्ठ',
    navInspections: 'क्षेत्रीय निरीक्षण',
    navCompliance: 'सांविधिक अनुपालन',
    navRadar: 'स्लोप रडार एवं सायरन',
    navGis: 'जीआईएस खदान मानचित्र',
    navCapa: 'सुधारात्मक कार्रवाई (CAPA)',
    navRecords: 'अभिलेख एवं ऑडिट',
    complianceIndex: 'सांविधिक अनुपालन सूचकांक',
    activeObservations: 'सक्रिय क्षेत्रीय निरीक्षण',
    annualProduction: 'वार्षिक कोयला उत्पादन पैमाना',
    auditChain: 'क्रिप्टोग्राफिक ऑडिट लेजर',
    logInspection: 'निरीक्षण दर्ज करें',
    viewGis: 'जीआईएस मानचित्र देखें',
    mineZones: 'खदान कार्य क्षेत्र एवं स्थिति',
    activeViolations: 'सक्रिय सुरक्षा उल्लंघन',
    critical: 'अति-गंभीर',
    high: 'गंभीर',
    medium: 'मध्यम',
    compliant: 'अनुपालन पूर्ण',
    overdue: 'अतिदेय',
    dueSoon: 'शीघ्र देय',
    statuteNumber: 'विनियम संख्या',
    responsibleDept: 'उत्तरदायी विभाग',
    dueDate: 'नियत तिथि',
    actionInspect: 'समीक्षा / अद्यतन',
    generateNotice: 'डीजीएमएस फॉर्म-VI नोटिस',
    simulateTimeLapse: 'समय आगे बढ़ाएं (+12 घंटे)',
    verifiedClosed: 'सत्यापित एवं बंद',
    offlineMode: 'ऑफ़लाइन मोड',
    onlineMode: 'ऑनलाइन',
  }
};
