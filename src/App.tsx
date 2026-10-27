import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FairShiftBanner } from './components/FairShiftBanner';
import { ManagerDashboard } from './components/ManagerDashboard';
import { WorkerPortal } from './components/WorkerPortal';
import { ShieldCheck, Scale } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, industry, language } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* SDG 8 FairShift Verification Banner */}
          <FairShiftBanner />

          {/* Smooth Page / Role Transition (180-250ms subtle fade & slide) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {role === 'manager' ? (
                <ManagerDashboard />
              ) : (
                <WorkerPortal />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Accessible, Premium Modern Footer */}
      <footer className="mt-14 bg-white border-t border-slate-200/80 py-7 text-xs text-slate-500 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#101A31] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
              <span className="text-[#6EE7D2]">L</span>
            </div>
            <div>
              <span className="font-extrabold text-[#121D33] text-sm font-heading">LedgerLess</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-slate-500 text-xs font-medium">Every shift accounted for. Every worker heard.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#0F766E] font-semibold bg-[#F0FDFB] px-2.5 py-1 rounded-full border border-[#CCFBF4]">
              <Scale className="w-3.5 h-3.5" />
              Target 8.5 Equal & Audited Pay
            </span>
            <span className="flex items-center gap-1.5 text-[#4664F5] font-semibold bg-[#EEF2FF] px-2.5 py-1 rounded-full border border-[#C7D4FE]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Target 8.8 Protected Worker Safety
            </span>
            <span className="text-slate-400 font-medium">
              Industry: <strong className="text-slate-700 capitalize">{industry}</strong> | Lang: <strong className="text-slate-700 uppercase">{language}</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
