import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { tamilTranslations } from '../translations/tamil';
import { SafetyReport } from '../types';
import { X, AlertOctagon, ShieldAlert, MapPin, EyeOff, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentWorker, submitSafetyReport, language, industry } = useApp();
  const isTamil = language === 'ta';

  const [category, setCategory] = useState<SafetyReport['category']>('Missing PPE');
  const [severity, setSeverity] = useState<SafetyReport['severity']>('high');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const categories: { label: string; tamil: string; value: SafetyReport['category'] }[] = [
    { label: 'Missing PPE / Protective Gear', tamil: 'விடுபட்ட பாதுகாப்பு உபகரணங்கள் (PPE)', value: 'Missing PPE' },
    { label: 'Hazardous Working Condition', tamil: 'அபாயகரமான பணி சூழல்', value: 'Hazardous Working Condition' },
    { label: 'Excessive Heat / Worker Fatigue', tamil: 'கடுமையான வெயில் / தொழிலாளர் சோர்வு', value: 'Excessive Heat / Fatigue' },
    { label: 'Faulty Equipment / Broken Tool', tamil: 'பழுதுபட்ட உபகரணம் / உடைந்த கருவி', value: 'Faulty Equipment' },
    { label: 'Harassment / Wage Dispute', tamil: 'நியாயமற்ற கூலி / தகாத நடத்தை', value: 'Harassment / Wage Dispute' },
    { label: 'Unsafe Sanitation / Drinking Water', tamil: 'சுகாதாரமற்ற குடிநீர் / கழிப்பறை வசதி', value: 'Unsafe Sanitation / Water' },
    { label: 'Other Safety Hazard', tamil: 'இதர பாதுகாப்பு பிரச்சனை', value: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      alert(isTamil ? 'தயவுசெய்து இடம் மற்றும் விவரங்களை உள்ளிடவும்.' : 'Please provide location and description.');
      return;
    }

    const catObj = categories.find(c => c.value === category);

    submitSafetyReport({
      workerId: currentWorker?.id || 'w-unknown',
      workerName: currentWorker?.name || 'Worker',
      category,
      tamilCategory: catObj?.tamil,
      severity,
      location,
      description,
      isAnonymous
    });

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setIsSubmittedSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#101A31]/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-floating border border-slate-200 z-10 overflow-hidden"
          >
            {isSubmittedSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="font-heading font-extrabold text-xl text-[#121D33]">
                  {isTamil ? 'புகார் பதிவு செய்யப்பட்டது!' : 'Safety Report Submitted!'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isTamil ? tamilTranslations.reportSuccessMsg : 'Your report has been logged to the management safety dashboard with zero retaliation.'}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-[#121D33]">
                        {isTamil ? tamilTranslations.submitConcernTitle : 'Submit Safety or Wage Concern'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isTamil ? 'SDG 8 பாதுகாப்பான பணி சூழல்' : 'Target 8.8 Protected Worker Voice'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                  {/* Category */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTamil ? tamilTranslations.reportCategory : 'Concern Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SafetyReport['category'])}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                    >
                      {categories.map((c, idx) => (
                        <option key={idx} value={c.value}>
                          {isTamil ? c.tamil : c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTamil ? tamilTranslations.severityLevel : 'Urgency / Severity Level'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                        <button
                          type="button"
                          key={sev}
                          onClick={() => setSeverity(sev)}
                          className={`py-2 px-2 rounded-xl text-center font-semibold capitalize transition-all border ${
                            severity === sev
                              ? sev === 'critical'
                                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                : sev === 'high'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : sev === 'medium'
                                ? 'bg-yellow-500 text-white border-yellow-500 shadow-sm'
                                : 'bg-slate-700 text-white border-slate-700 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isTamil ? (
                            sev === 'low' ? 'குறைந்தது' :
                            sev === 'medium' ? 'நடுத்தரம்' :
                            sev === 'high' ? 'அதிகம்' : 'அவசரம்'
                          ) : sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {isTamil ? tamilTranslations.specificLocation : 'Specific Worksite / Location'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={industry === 'construction' ? 'e.g., Tower B, 8th floor scaffolding corner' : 'e.g., Science Block Lab 204 or Hostel Pathway'}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTamil ? tamilTranslations.concernDescription : 'Describe the Hazard or Grievance'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={isTamil ? tamilTranslations.enterDescriptionPlaceholder : 'State the specific issue, equipment condition, or hazard clearly...'}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                    />
                  </div>

                  {/* Anonymous Option */}
                  <div className="bg-[#F7F9FC] p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-slate-500" />
                      <div>
                        <span className="font-semibold text-slate-800 block text-xs">
                          {isTamil ? 'பெயர் வெளியிடாமல் ரகசியமாக சமர்ப்பிக்கவும்' : 'Submit Anonymously'}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {isTamil ? 'உங்கள் அடையாளம் மேலாளருக்கு மறைக்கப்படும்' : 'Your name will not appear in the manager log'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      id="anonymous-toggle"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-[#4664F5] rounded border-slate-300 focus:ring-[#4664F5] cursor-pointer"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                    >
                      {isTamil ? 'ரத்து செய்க' : 'Cancel'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>{isTamil ? tamilTranslations.submitReportBtn : 'Submit Safety Report'}</span>
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
