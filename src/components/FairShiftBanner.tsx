import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronDown, ChevronUp, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const FairShiftBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-card mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDFB] border border-[#CCFBF4] flex items-center justify-center text-[#0F766E] shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#121D33]">
                UN SDG 8 FairShift Verification Standard
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDFB] text-[#0F766E] border border-[#6EE7D2]">
                Target 8.5 & 8.8
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographic shift audit • 1.5× statutory overtime calculation • Zero-retaliation worker voice
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-[#4664F5] hover:text-[#3550D6] transition-colors py-1 px-2 rounded-lg hover:bg-[#EEF2FF]"
        >
          <span>{expanded ? 'Hide Principles' : 'View SDG 8 Principles'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#F7F9FC] p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#121D33] mb-1">
                  <Scale className="w-4 h-4 text-[#4664F5]" />
                  <span>Target 8.5: Wage Transparency</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Eliminates informal underpayment and paper ledger manipulation. Wages are strictly computed only from approved completed attendance with full visibility into hours, rates, and verified pay.
                </p>
              </div>

              <div className="bg-[#F7F9FC] p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#121D33] mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>Fair Overtime Rule (1.5×)</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Any shift exceeding the statutory 8-hour workday automatically logs overtime hours. Overtime is paid at 1.5× base wage rate and marked in the permanent digital ledger to prevent exploitation.
                </p>
              </div>

              <div className="bg-[#F7F9FC] p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#121D33] mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Target 8.8: Safe Working Environments</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Provides frontline workers a direct, protected voice. Workers can submit safety hazards anonymously. Managers must acknowledge, investigate, and record corrective actions in a transparent log.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
