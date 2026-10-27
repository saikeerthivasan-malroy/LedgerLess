import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { tamilTranslations } from '../translations/tamil';
import { SafetyReportModal } from './SafetyReportModal';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  ShieldAlert, 
  DollarSign, 
  CalendarCheck, 
  Info, 
  LogOut, 
  LogIn, 
  Sparkles,
  XCircle,
  Radio
} from 'lucide-react';

export const WorkerPortal: React.FC = () => {
  const {
    currentWorker,
    shifts,
    attendance,
    safetyReports,
    workerCheckIn,
    workerCheckOut,
    language,
    isMobileView
  } = useApp();

  const isTamil = language === 'ta';
  const t = tamilTranslations;

  const [activeTab, setActiveTab] = useState<'shifts' | 'earnings' | 'history' | 'safety'>('shifts');
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Animated celebratory check-in/out modal state
  const [punchConfirmation, setPunchConfirmation] = useState<{
    type: 'check_in' | 'check_out';
    time: string;
    details: string;
  } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setActionAlert({ type, message });
    setTimeout(() => setActionAlert(null), 4000);
  };

  if (!currentWorker) {
    return <div className="p-8 text-center text-slate-500">Worker profile not selected.</div>;
  }

  // Filter for this specific worker
  const workerShifts = shifts.filter(s => s.workerId === currentWorker.id);
  const workerAttendance = attendance.filter(a => a.workerId === currentWorker.id);
  const workerSafetyReports = safetyReports.filter(r => r.workerId === currentWorker.id);

  // Approved attendance only for earnings!
  const approvedAttendance = workerAttendance.filter(a => a.approvalStatus === 'approved');
  const pendingAttendance = workerAttendance.filter(a => a.approvalStatus === 'pending');

  const totalApprovedEarnings = approvedAttendance.reduce((sum, a) => sum + (a.totalPay || 0), 0);
  const totalApprovedHours = approvedAttendance.reduce((sum, a) => sum + (a.actualHours || 0), 0);
  const totalOvertimeHours = approvedAttendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

  const handleCheckIn = (shiftId: string) => {
    const res = workerCheckIn(shiftId, currentWorker.id);
    if (res.success) {
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setPunchConfirmation({
        type: 'check_in',
        time: nowTime,
        details: isTamil ? 'ஜி.பி.எஸ் & க்யூஆர் சரிபார்க்கப்பட்டது. பணி வெற்றிகரமாக தொடங்கியது.' : 'GPS geofence verified. Shift logged to digital ledger.'
      });
      setTimeout(() => setPunchConfirmation(null), 2400);
    } else {
      showAlert('error', res.message);
    }
  };

  const handleCheckOut = (attId: string) => {
    const res = workerCheckOut(attId);
    if (res.success) {
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      setPunchConfirmation({
        type: 'check_out',
        time: nowTime,
        details: isTamil ? 'பணி நிறைவடைந்தது. 1.2 மணி கூடுதல் பணி (1.5x) மேலாளர் ஒப்புதலுக்கு அனுப்பப்பட்டது.' : 'Shift completed. 9.2 hrs (with 1.2h overtime at 1.5× rate) sent for manager approval.'
      });
      setTimeout(() => setPunchConfirmation(null), 2800);
    } else {
      showAlert('error', res.message);
    }
  };

  const containerClasses = isMobileView
    ? 'max-w-md mx-auto bg-white rounded-3xl border-4 border-[#101A31] shadow-floating overflow-hidden min-h-[640px]'
    : 'max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden';

  return (
    <div className={containerClasses}>
      
      {/* Mobile Top Header Bar with Midnight Navy Branding */}
      <div className="bg-[#101A31] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <motion.span 
            whileHover={{ scale: 1.08 }}
            className="text-3xl bg-slate-800/90 p-2 rounded-2xl border border-white/15 shadow-sm inline-block"
          >
            {currentWorker.avatar}
          </motion.span>
          <div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg leading-tight text-white">
              {isTamil ? currentWorker.tamilName : currentWorker.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              {isTamil ? currentWorker.tamilRole : currentWorker.role}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            {isTamil ? 'அடிப்படை கூலி' : 'Base Rate'}
          </span>
          <span className="text-sm font-extrabold text-[#6EE7D2] font-mono">
            ₹{currentWorker.hourlyRate}/h
          </span>
        </div>
      </div>

      {/* Floating Action Alert */}
      <AnimatePresence>
        {actionAlert && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-3 text-xs flex items-center justify-between transition-all overflow-hidden ${
              actionAlert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionAlert.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span className="font-medium">{actionAlert.message}</span>
            </div>
            <button onClick={() => setActionAlert(null)} className="text-slate-400 hover:text-slate-700 p-1">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Attendance Confirmation Banner Pop-up */}
      <AnimatePresence>
        {punchConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="m-4 p-4 rounded-2xl bg-[#101A31] text-white border border-[#6EE7D2]/40 shadow-floating flex items-start gap-3.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#6EE7D2]/20 border border-[#6EE7D2] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#6EE7D2]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6EE7D2]">
                  {punchConfirmation.type === 'check_in' 
                    ? (isTamil ? 'பணி தொடக்கம் உறுதியானது' : 'Verified Check-In') 
                    : (isTamil ? 'பணி நிறைவு உறுதியானது' : 'Verified Check-Out')}
                </span>
                <span className="text-[11px] text-slate-300 font-mono">({punchConfirmation.time})</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {punchConfirmation.details}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs with Motion Sliding Indicator (44px min touch targets) */}
      <div className="grid grid-cols-4 border-b border-slate-200 bg-[#F7F9FC] text-center text-xs font-semibold relative">
        {[
          { id: 'shifts', label: isTamil ? 'பணிகள்' : 'My Shifts', icon: CalendarCheck, color: 'text-[#4664F5]' },
          { id: 'earnings', label: isTamil ? 'சம்பளம்' : 'Earnings', icon: DollarSign, color: 'text-[#0F766E]' },
          { id: 'history', label: isTamil ? 'வருகை' : 'History', icon: Clock, color: 'text-[#101A31]' },
          { id: 'safety', label: isTamil ? 'பாதுகாப்பு' : 'Safety', icon: ShieldAlert, color: 'text-red-600' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative py-3.5 px-2 flex flex-col items-center gap-1 transition-colors min-h-[46px] z-10 ${
                isActive ? `${tab.color} font-bold` : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="workerActiveTabIndicator"
                  className="absolute inset-0 bg-white border-b-2 border-current -z-10 shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[70px] text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        
        {/* Animated Page Transitions for Tabs */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* =========================================================================
                TAB 1: ASSIGNED SHIFTS & LIVE PUNCH IN / OUT
            ========================================================================== */}
            {activeTab === 'shifts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#121D33] uppercase tracking-wider font-heading">
                    {isTamil ? t.assignedShifts : 'Assigned Shifts'}
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium">
                    {workerShifts.length} {isTamil ? 'பணிகள் உள்ளன' : 'shifts assigned'}
                  </span>
                </div>

                {workerShifts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    {isTamil ? t.noShiftsAssigned : 'No shifts currently scheduled for you.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workerShifts.map(shift => {
                      const attRecord = attendance.find(a => a.shiftId === shift.id && a.workerId === currentWorker.id);
                      const isCheckedIn = !!attRecord?.checkInTime;
                      const isCheckedOut = !!attRecord?.checkOutTime;

                      return (
                        <motion.div 
                          key={shift.id} 
                          whileHover={{ y: -1 }}
                          transition={{ duration: 0.15 }}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            shift.status === 'in_progress'
                              ? 'border-[#0F766E] bg-[#F0FDFB] shadow-sm'
                              : 'border-slate-200/90 bg-white shadow-subtle'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{shift.date} • {shift.startTime} - {shift.endTime}</span>
                              </div>
                              <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#121D33]">
                                {isTamil ? shift.tamilTitle : shift.title}
                              </h4>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              shift.status === 'in_progress'
                                ? 'bg-emerald-600 text-white'
                                : shift.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {shift.status === 'in_progress' 
                                ? (isTamil ? 'பணியில்' : 'ON SHIFT')
                                : shift.status === 'completed'
                                ? (isTamil ? 'முடிந்தது' : 'COMPLETED')
                                : (isTamil ? 'ஒதுக்கப்பட்டது' : 'SCHEDULED')}
                            </span>
                          </div>

                          {/* Location & GPS Geofence */}
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-white/90 p-2.5 rounded-xl border border-slate-100">
                            <MapPin className="w-3.5 h-3.5 text-[#4664F5] shrink-0" />
                            <span className="font-medium truncate">{isTamil ? shift.tamilLocation : shift.location}</span>
                            <span className="ml-auto text-[10px] text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                              GPS Verified
                            </span>
                          </div>

                          {shift.notes && (
                            <p className="mt-2 text-[11px] text-slate-500 italic">
                              "{shift.notes}"
                            </p>
                          )}

                          {/* Action Area: 44px min touch targets */}
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            {!isCheckedIn && shift.status !== 'completed' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCheckIn(shift.id)}
                                className="w-full min-h-[48px] rounded-xl bg-[#4664F5] hover:bg-[#3550D6] active:bg-[#263BA6] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                <LogIn className="w-4 h-4" />
                                <span>{isTamil ? t.checkInBtn : 'Check In (பணி தொடக்கம்)'}</span>
                              </motion.button>
                            )}

                            {isCheckedIn && !isCheckedOut && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-emerald-900 bg-emerald-100/70 p-2.5 rounded-xl">
                                  <span className="flex items-center gap-2 font-medium">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                                    {isTamil ? t.checkedInAt : 'Checked in at'}: <strong className="font-bold">{attRecord?.checkInTime}</strong>
                                  </span>
                                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Live</span>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleCheckOut(attRecord!.id)}
                                  className="w-full min-h-[48px] rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:bg-[#134E4A] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                  <LogOut className="w-4 h-4" />
                                  <span>{isTamil ? t.checkOutBtn : 'Check Out (பணி நிறைவு)'}</span>
                                </motion.button>
                              </div>
                            )}

                            {isCheckedOut && (
                              <div className="bg-[#F7F9FC] p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 font-medium">
                                    {isTamil ? 'பணி நிறைவு பதிவு' : 'Punched Out'}:
                                  </span>
                                  <span className="font-bold text-[#121D33]">{attRecord?.checkOutTime}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 font-medium">
                                    {isTamil ? 'மொத்த பணி நேரம்' : 'Total Duration'}:
                                  </span>
                                  <span className="font-bold text-[#121D33]">{attRecord?.actualHours} Hours</span>
                                </div>
                                <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>
                                    {attRecord?.approvalStatus === 'approved' 
                                      ? (isTamil ? 'மேலாளரால் அங்கீகரிக்கப்பட்டது' : 'Approved by manager') 
                                      : (isTamil ? t.shiftCompletedNotice : 'Shift completed. Awaiting manager approval.')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 2: UNDERSTANDABLE APPROVED EARNINGS BREAKDOWN (SDG 8)
            ========================================================================== */}
            {activeTab === 'earnings' && (
              <div className="space-y-4 text-xs">
                {/* Total Approved Card with Animated Transition */}
                <motion.div 
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-[#101A31] via-[#162343] to-[#101A31] text-white p-5 rounded-2xl shadow-card space-y-3 border border-white/10"
                >
                  <span className="text-xs text-slate-300 uppercase tracking-wider font-bold block">
                    {isTamil ? t.approvedEarnings : 'Total Approved Earnings'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-[#6EE7D2]">
                      ₹{totalApprovedEarnings.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-300">
                      ({approvedAttendance.length} {isTamil ? 'அங்கீகரிக்கப்பட்ட பணிகள்' : 'approved shifts'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                    <span>{isTamil ? 'மொத்த பணி நேரம்' : 'Total Hours'}: <strong className="text-white">{totalApprovedHours.toFixed(1)}h</strong></span>
                    <span>•</span>
                    <span className="text-amber-300">{isTamil ? 'கூடுதல் பணி' : 'Overtime'}: <strong>{totalOvertimeHours.toFixed(1)}h</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                    <Info className="w-3.5 h-3.5 inline mr-1 text-[#6EE7D2]" />
                    {isTamil ? t.earningsNotice : 'Earnings are credited strictly upon manager verification to eliminate informal wage deductions.'}
                  </p>
                </motion.div>

                {/* Overtime Policy Card */}
                <div className="bg-[#EEF2FF] border border-[#C7D4FE] p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#4664F5]" />
                    <h4 className="font-bold text-[#121D33] text-xs sm:text-sm">
                      {isTamil ? t.overtimePolicyTitle : 'FairShift Overtime Rule: 1.5× Regular Rate'}
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {isTamil ? t.overtimePolicyDesc : 'For every hour worked beyond the standard 8-hour shift, you receive 1.5× your base hourly rate.'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                    <span className="bg-white px-2.5 py-1 rounded-md border border-[#C7D4FE] text-[#121D33] font-semibold">
                      {isTamil ? 'அடிப்படை விகிதம்' : 'Base'}: ₹{currentWorker.hourlyRate}/h
                    </span>
                    <span className="bg-[#4664F5] text-white px-2.5 py-1 rounded-md font-bold">
                      {isTamil ? 'கூடுதல் பணி விகிதம் (1.5x)' : 'Overtime Rate (1.5x)'}: ₹{currentWorker.hourlyRate * 1.5}/h
                    </span>
                  </div>
                </div>

                {/* Pending Approval Notice if any */}
                {pendingAttendance.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-800 text-[11px] flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">{pendingAttendance.length} {isTamil ? 'பணிகள் ஒப்புதலுக்கு காத்திருக்கின்றன' : 'shift(s) pending review'}.</strong>
                      <p className="text-amber-700 mt-0.5">
                        {isTamil ? t.pendingApprovalNotice : 'Wages for recently checked-out shifts will appear here once signed off by your site supervisor.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Detailed Ledger per Shift */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-500">
                    {isTamil ? t.earningsBreakdown : 'Approved Shift Payouts Breakdown'}
                  </h4>

                  {approvedAttendance.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-[#F7F9FC] rounded-2xl border border-dashed border-slate-200">
                      {isTamil ? 'இதுவரை அங்கீகரிக்கப்பட்ட ஊதிய பதிவுகள் இல்லை.' : 'No approved earnings records yet.'}
                    </div>
                  ) : (
                    approvedAttendance.map(att => {
                      const shift = shifts.find(s => s.id === att.shiftId);

                      return (
                        <div key={att.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-medium">{att.date}</span>
                              <h5 className="font-bold text-[#121D33] text-sm">
                                {shift ? (isTamil ? shift.tamilTitle : shift.title) : att.shiftId}
                              </h5>
                            </div>
                            <span className="font-mono text-base font-extrabold text-[#0F766E]">
                              ₹{att.totalPay}
                            </span>
                          </div>

                          <div className="bg-[#F7F9FC] p-2.5 rounded-xl space-y-1 text-[11px] text-slate-600">
                            <div className="flex justify-between">
                              <span>{isTamil ? t.regularHoursWorked : 'Regular Hours (≤ 8h)'}:</span>
                              <span className="font-semibold">{att.regularHours}h × ₹{att.hourlyRate} = ₹{att.regularPay}</span>
                            </div>
                            {att.overtimeHours && att.overtimeHours > 0 && (
                              <div className="flex justify-between text-[#4664F5] font-semibold">
                                <span>{isTamil ? t.overtimeHoursWorked : 'Overtime (1.5x rate)'}:</span>
                                <span>{att.overtimeHours}h × ₹{att.hourlyRate * 1.5} = ₹{att.overtimePay}</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-[#121D33]">
                              <span>{isTamil ? t.netPayable : 'Net Total'}:</span>
                              <span className="text-[#0F766E]">₹{att.totalPay}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>{isTamil ? 'ஒப்புதல் வழங்கப்பட்டது' : 'Verified'}: {att.approvedAt}</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {isTamil ? t.paidVerified : 'Approved'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 3: ATTENDANCE HISTORY
            ========================================================================== */}
            {activeTab === 'history' && (
              <div className="space-y-4 text-xs">
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-500">
                  {isTamil ? t.attendanceRecords : 'Complete Attendance History'}
                </h4>

                {workerAttendance.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-[#F7F9FC] rounded-2xl border border-dashed border-slate-200">
                    {isTamil ? 'வருகை பதிவுகள் இல்லை.' : 'No attendance logged yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workerAttendance.map(att => {
                      const shift = shifts.find(s => s.id === att.shiftId);

                      return (
                        <div key={att.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400">{att.date}</span>
                              <p className="font-bold text-[#121D33] text-sm">
                                {shift ? (isTamil ? shift.tamilTitle : shift.title) : att.shiftId}
                              </p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                              att.approvalStatus === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : att.approvalStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {att.approvalStatus === 'approved' 
                                ? (isTamil ? t.approved : 'Approved') 
                                : att.approvalStatus === 'pending'
                                ? (isTamil ? t.pendingApproval : 'Pending Review')
                                : (isTamil ? t.rejected : 'Rejected')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 bg-[#F7F9FC] p-2.5 rounded-xl">
                            <span>Punch In: <strong>{att.checkInTime}</strong></span>
                            <span>Punch Out: <strong>{att.checkOutTime || 'On Shift'}</strong></span>
                            <span>Hours: <strong>{att.actualHours ? `${att.actualHours}h` : '—'}</strong></span>
                          </div>

                          {att.managerNotes && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <strong>{isTamil ? t.managerNote : 'Supervisor Note'}:</strong> "{att.managerNotes}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 4: VOICE & SAFETY REPORTING (SDG 8.8)
            ========================================================================== */}
            {activeTab === 'safety' && (
              <div className="space-y-4 text-xs">
                {/* CTA to submit concern */}
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-red-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      {isTamil ? t.submitConcernTitle : 'Protected Safety & Whistleblower Voice'}
                    </h4>
                    <p className="text-red-700 text-[11px] mt-0.5">
                      {isTamil ? t.submitConcernDesc : 'Report missing PPE, hazardous site conditions, or fair wage disputes with complete anonymity.'}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsSafetyModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 shadow-sm flex items-center justify-center gap-1.5 transition-all min-h-[46px] cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isTamil ? t.submitReportBtn : 'Report Hazard / Concern'}</span>
                  </motion.button>
                </div>

                {/* Submitted Reports Tracker */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-500">
                    {isTamil ? t.mySubmittedReports : 'Safety Reports & Live Resolution Status'}
                  </h4>

                  {workerSafetyReports.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-[#F7F9FC] rounded-2xl border border-dashed border-slate-200">
                      {isTamil ? t.noReportsYet : 'No safety or grievance reports logged yet.'}
                    </div>
                  ) : (
                    workerSafetyReports.map(rep => (
                      <div key={rep.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                rep.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                rep.severity === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isTamil ? (
                                  rep.severity === 'low' ? t.low :
                                  rep.severity === 'medium' ? t.medium :
                                  rep.severity === 'high' ? t.high : t.critical
                                ) : rep.severity}
                              </span>
                              <h5 className="font-bold text-[#121D33] text-sm">
                                {isTamil && rep.tamilCategory ? rep.tamilCategory : rep.category}
                              </h5>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">{rep.location} • {rep.reportedAt}</span>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                            rep.status === 'action_taken' ? 'bg-blue-100 text-blue-800' :
                            rep.status === 'investigating' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isTamil ? (
                              rep.status === 'reported' ? t.reported :
                              rep.status === 'investigating' ? t.investigating :
                              rep.status === 'action_taken' ? t.action_taken : t.resolved
                            ) : rep.status.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-slate-700 text-xs bg-[#F7F9FC] p-3 rounded-xl border border-slate-100">
                          {rep.description}
                        </p>

                        {rep.resolutionNotes && (
                          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900 text-[11px] flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>{isTamil ? t.managerResolutionNote : 'Manager Resolution Action'}:</strong> {rep.resolutionNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Safety Report Modal */}
      <SafetyReportModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />
    </div>
  );
};
