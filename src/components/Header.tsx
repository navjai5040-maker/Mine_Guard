import React from 'react';
import { 
  Building2, 
  Layers, 
  MapPin, 
  ClipboardCheck, 
  Clock, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Globe,
  Radio
} from 'lucide-react';
import { UserRole } from '../types/mineguard';
import { Language, translations } from '../utils/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  isOnline,
  setIsOnline,
  language,
  setLanguage
}) => {
  const t = translations[language];

  const roleLabels: Record<UserRole, { title: string; badge: string }> = {
    mine_safety_officer: { 
      title: language === 'hi' ? 'इंजी. राजेश्वर नाथ' : 'Er. Rajeshwar Nath', 
      badge: language === 'hi' ? 'सुरक्षा अधिकारी (DGMS #8821)' : 'Safety Officer (DGMS #8821)' 
    },
    mine_agent: { 
      title: language === 'hi' ? 'इंजी. ए. के. बनर्जी' : 'Er. A. K. Banerjee', 
      badge: language === 'hi' ? 'महाप्रबंधक / खदान एजेंट' : 'General Manager / Mine Agent' 
    },
    cil_corporate: { 
      title: language === 'hi' ? 'निदेशक (तकनीकी)' : 'Director (Technical)', 
      badge: language === 'hi' ? 'कोल इंडिया मुख्यालय, कोलकाता' : 'CIL Corporate HQ, Kolkata' 
    },
    ministry_official: { 
      title: language === 'hi' ? 'संयुक्त सचिव (कोयला)' : 'Joint Secretary (Coal)', 
      badge: language === 'hi' ? 'कोयला मंत्रालय, नई दिल्ली' : 'Ministry of Coal, New Delhi' 
    },
    dgms_regulator: { 
      title: language === 'hi' ? 'खान सुरक्षा निदेशक' : 'Director of Mines Safety', 
      badge: language === 'hi' ? 'डीजीएमएस सेंट्रल जोन, बिलासपुर' : 'DGMS Central Zone, Bilaspur' 
    },
  };

  const navItems = [
    { id: 'overview', label: t.navDashboard, icon: Building2 },
    { id: 'inspections', label: t.navInspections, icon: ClipboardCheck },
    { id: 'twin', label: t.navCompliance, icon: Layers },
    { id: 'radar', label: t.navRadar, icon: Radio },
    { id: 'gis', label: t.navGis, icon: MapPin },
    { id: 'workflow', label: t.navCapa, icon: Clock },
    { id: 'records', label: t.navRecords, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Tricolor Government Top Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Official Government of India Header Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 sm:px-6 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Official Emblem & Hierarchy */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
              🇮🇳
            </div>
            <div>
              <div className="font-semibold tracking-wide text-slate-100 flex items-center gap-2">
                <span>{t.ministryName}</span>
                <span className="text-slate-500">|</span>
                <span className="text-amber-400">{t.cilName}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {t.subsidiaryName} · {t.projectName}
              </div>
            </div>
          </div>

          {/* Right Controls: Language Toggle, Online Toggle & Official Role */}
          <div className="flex items-center gap-3">
            {/* Language Switcher (Rajbhasha) */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md p-0.5 text-[11px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'en' ? 'bg-blue-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="राजभाषा हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Connectivity Switch */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                isOnline 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900' 
                  : 'bg-rose-950/80 text-rose-300 border-rose-700/60 hover:bg-rose-900'
              }`}
              title="Toggle network connectivity to test offline field inspection mode"
            >
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
              <span>{isOnline ? t.onlineMode : t.offlineMode}</span>
            </button>

            {/* Officer Profile Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-slate-100">{roleLabels[userRole].title}</div>
                <div className="text-[10px] text-amber-400 font-mono">{roleLabels[userRole].badge}</div>
              </div>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="mine_agent" className="bg-slate-900 text-slate-200">GM / Mine Agent</option>
                <option value="mine_safety_officer" className="bg-slate-900 text-slate-200">Field Safety Officer</option>
                <option value="cil_corporate" className="bg-slate-900 text-slate-200">CIL Corporate HQ</option>
                <option value="dgms_regulator" className="bg-slate-900 text-slate-200">DGMS Regulator</option>
                <option value="ministry_official" className="bg-slate-900 text-slate-200">Ministry of Coal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2.5">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
              MG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">MINEGUARD</span>
                <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {language === 'hi' ? 'स्मार्ट अभिशासन प्रणाली' : 'Smart Governance System'}
                </span>
              </div>
              <div className="text-xs text-slate-500 hidden sm:block">
                {language === 'hi' ? 'सांविधिक अनुपालन एवं खदान निगरानी मंच (CMR 2017 / MoEFCC)' : 'Statutory Compliance & Field Activity Monitoring (CMR 2017 / MoEFCC)'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-900 text-white font-semibold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden flex items-center gap-1 py-1.5 border-t border-slate-200 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded whitespace-nowrap ${
                  isActive ? 'bg-blue-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
