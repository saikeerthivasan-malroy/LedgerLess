import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { tamilTranslations } from '../translations/tamil';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  Languages,
  Activity
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    industry,
    setIndustry,
    role,
    setRole,
    language,
    setLanguage,
    selectedWorkerId,
    setSelectedWorkerId,
    isMobileView,
    setIsMobileView,
    workers,
    currentWorker,
    resetToDemoData
  } = useApp();

  const isTamil = language === 'ta';

  return (
    <header className="relative bg-[#101A31] text-white overflow-hidden border-b border-slate-800/80 shadow-card">
      {/* Subtle, restrained ambient animated gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <div 
          className="absolute -top-24 left-1/4 w-[500px] h-[180px] bg-gradient-to-r from-[#4664F5]/20 via-[#6EE7D2]/15 to-transparent blur-3xl rounded-full animate-ambient-glow"
        />
        <div 
          className="absolute -bottom-20 right-1/4 w-[400px] h-[160px] bg-[#4664F5]/15 blur-3xl rounded-full"
        />
      </div>

      {/* Top Utility & SDG 8 Standard Ribbon */}
      <div className="relative z-10 border-b border-white/5 py-1.5 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 bg-[#6EE7D2]/15 text-[#6EE7D2] border border-[#6EE7D2]/30 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
              <Activity className="w-3 h-3 text-[#6EE7D2] animate-pulse" />
              SDG 8 FairShift Engine
            </span>
            <span className="text-slate-300 text-[11px] hidden md:inline">
              Target 8.5 Equal & Audited Pay • Target 8.8 Protected Worker Voice
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              DEMO MODE
            </span>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (window.confirm('Reset all demo shift, attendance and safety data back to initial state?')) {
                  resetToDemoData();
                }
              }}
              className="text-slate-300 hover:text-white text-[11px] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/5 transition-colors"
              title="Reset sample data"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Cinematic Branding & Control Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo & Vision Tagline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1A294A] to-[#101A31] border border-white/15 text-white flex items-center justify-center shadow-glow"
              >
                <ShieldCheck className="w-6 h-6 text-[#6EE7D2]" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                    LedgerLess
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-[#4664F5]/20 text-[#6EE7D2] rounded-full border border-[#4664F5]/30">
                    SaaS Core
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {isTamil ? tamilTranslations.tagline : 'Every shift accounted for. Every worker heard.'}
                </p>
              </div>
            </div>

            {/* Mobile Language Switcher button */}
            <div className="flex items-center gap-2 lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(isTamil ? 'en' : 'ta')}
                className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold flex items-center gap-1.5 text-slate-200"
              >
                <Languages className="w-3.5 h-3.5 text-[#6EE7D2]" />
                <span>{isTamil ? 'ENG' : 'தமிழ்'}</span>
              </motion.button>
            </div>
          </div>

          {/* Controls: Industry Pill, Role Switcher with Motion LayoutId, Language */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* 1. Industry Selector with animated sliding pill */}
            <div className="relative bg-[#0A1122]/80 p-1 rounded-2xl border border-white/10 flex items-center text-xs font-semibold backdrop-blur-md">
              <button
                onClick={() => setIndustry('construction')}
                className={`relative px-3 py-1.5 rounded-xl transition-colors z-10 flex items-center gap-1.5 ${
                  industry === 'construction' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {industry === 'construction' && (
                  <motion.div
                    layoutId="activeIndustryIndicator"
                    className="absolute inset-0 bg-[#4664F5] rounded-xl -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <Building2 className="w-3.5 h-3.5" />
                <span>Construction</span>
              </button>

              <button
                onClick={() => setIndustry('college')}
                className={`relative px-3 py-1.5 rounded-xl transition-colors z-10 flex items-center gap-1.5 ${
                  industry === 'college' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {industry === 'college' && (
                  <motion.div
                    layoutId="activeIndustryIndicator"
                    className="absolute inset-0 bg-[#4664F5] rounded-xl -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <GraduationCap className="w-3.5 h-3.5" />
                <span>College Campus</span>
              </button>
            </div>

            {/* 2. Role Switcher with Motion layoutId */}
            <div className="relative bg-[#0A1122]/80 p-1 rounded-2xl border border-white/10 flex items-center text-xs font-semibold backdrop-blur-md">
              <button
                onClick={() => setRole('manager')}
                className={`relative px-3 py-1.5 rounded-xl transition-colors z-10 flex items-center gap-1.5 ${
                  role === 'manager' ? 'text-[#101A31] font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'manager' && (
                  <motion.div
                    layoutId="activeRoleIndicator"
                    className="absolute inset-0 bg-white rounded-xl -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <UserCheck className="w-3.5 h-3.5" />
                <span>Manager</span>
              </button>

              <button
                onClick={() => setRole('worker')}
                className={`relative px-3 py-1.5 rounded-xl transition-colors z-10 flex items-center gap-1.5 ${
                  role === 'worker' ? 'text-[#101A31] font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'worker' && (
                  <motion.div
                    layoutId="activeRoleIndicator"
                    className="absolute inset-0 bg-[#6EE7D2] rounded-xl -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <Smartphone className="w-3.5 h-3.5" />
                <span>Worker Portal</span>
              </button>
            </div>

            {/* 3. Worker Dropdown (When in Worker Role) */}
            {role === 'worker' && (
              <div className="flex items-center gap-1.5 bg-[#0A1122]/90 border border-white/15 px-3 py-1.5 rounded-2xl text-xs">
                <span className="text-slate-400 text-[11px] font-medium hidden md:inline">
                  {isTamil ? 'தொழிலாளர்:' : 'Worker:'}
                </span>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="bg-transparent text-[#6EE7D2] font-bold focus:outline-none cursor-pointer py-0.5 text-xs"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id} className="bg-[#101A31] text-white">
                      {w.avatar} {isTamil ? w.tamilName : w.name} (₹{w.hourlyRate}/h)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Worker Portal Mobile Viewport Frame Toggle */}
            {role === 'worker' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMobileView(!isMobileView)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all ${
                  isMobileView 
                    ? 'bg-[#6EE7D2]/20 border-[#6EE7D2]/50 text-[#6EE7D2]' 
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
                title="Toggle Mobile Screen Frame"
              >
                {isMobileView ? <Smartphone className="w-3.5 h-3.5 text-[#6EE7D2]" /> : <Monitor className="w-3.5 h-3.5" />}
                <span>{isMobileView ? 'Mobile View' : 'Full View'}</span>
              </motion.button>
            )}

            {/* 5. English / Tamil Switcher */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLanguage(isTamil ? 'en' : 'ta')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-[#6EE7D2]" />
              <span>{isTamil ? 'English' : 'தமிழ் (Tamil)'}</span>
            </motion.button>
          </div>
        </div>

        {/* Worker Info Sub-bar when in Worker Mode */}
        {role === 'worker' && currentWorker && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentWorker.avatar}</span>
              <span className="font-bold text-white text-sm">
                {isTamil ? currentWorker.tamilName : currentWorker.name}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                {isTamil ? currentWorker.tamilRole : currentWorker.role}
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400 font-mono hidden sm:inline">{currentWorker.phone}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="text-[#6EE7D2] bg-[#6EE7D2]/10 px-2.5 py-0.5 rounded-full border border-[#6EE7D2]/20 font-semibold">
                {isTamil ? 'அடிப்படை' : 'Base Rate'}: ₹{currentWorker.hourlyRate}/h
              </span>
              <span className="text-[#4664F5] bg-[#4664F5]/10 px-2.5 py-0.5 rounded-full border border-[#4664F5]/20 font-semibold">
                {isTamil ? 'கூடுதல் பணி (OT)' : 'Overtime'}: 1.5× (₹{currentWorker.hourlyRate * 1.5}/h)
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
