import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ShiftAssignmentModal } from './ShiftAssignmentModal';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  CalendarPlus, 
  ShieldAlert, 
  DollarSign, 
  FileSpreadsheet, 
  Check, 
  UserCheck,
  TrendingUp
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const {
    industry,
    workers,
    shifts,
    attendance,
    safetyReports,
    reviewAttendance,
    updateSafetyReport,
    metrics
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'wage_ledger' | 'shifts' | 'safety' | 'directory'>('attendance');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Filters
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  // Manager action state
  const [managerNoteInput, setManagerNoteInput] = useState<{ [id: string]: string }>({});
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Animated wage total highlight pulse
  const [wageHighlight, setWageHighlight] = useState(false);
  useEffect(() => {
    setWageHighlight(true);
    const t = setTimeout(() => setWageHighlight(false), 800);
    return () => clearTimeout(t);
  }, [metrics.totalVerifiedWagePayout]);

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  const handleApprove = (attId: string) => {
    const note = managerNoteInput[attId] || 'Shift attendance and hours verified with geofence audit.';
    reviewAttendance(attId, 'approved', note);
    showToast('Shift approved! Wage ledger updated automatically with verified payout.');
  };

  const handleReject = (attId: string) => {
    const note = managerNoteInput[attId] || 'Attendance verification failed or hours mismatch.';
    reviewAttendance(attId, 'rejected', note);
    showToast('Shift marked rejected. No wages will be released from ledger.');
  };

  // Filtered lists
  const filteredAttendance = attendance.filter(a => {
    if (attendanceFilter === 'all') return true;
    return a.approvalStatus === attendanceFilter;
  });

  const filteredSafety = safetyReports.filter(r => {
    if (safetyFilter === 'unresolved') return r.status !== 'resolved';
    if (safetyFilter === 'resolved') return r.status === 'resolved';
    return true;
  });

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toast Alert with AnimatePresence */}
      <AnimatePresence>
        {actionSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-[#101A31] text-white px-4 py-3 rounded-2xl border border-slate-700 shadow-floating flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#6EE7D2] animate-ping" />
              <CheckCircle2 className="w-4 h-4 text-[#6EE7D2]" />
              <span className="font-medium text-slate-100">{actionSuccessToast}</span>
            </div>
            <button onClick={() => setActionSuccessToast(null)} className="text-slate-400 hover:text-white p-1">
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Level Dynamic Workforce Metrics (Staggered Fade-Up) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {/* Metric 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active on Shift</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#121D33] mt-2 font-heading">
            {metrics.activeWorkersNow}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GPS geofenced & live</span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#121D33] mt-2 font-heading">
            {metrics.pendingApprovalsCount}
          </p>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            {metrics.pendingApprovalsCount > 0 ? 'Requires manager review' : 'All shifts up to date'}
          </p>
        </motion.div>

        {/* Metric 3 (Animated Wage Total Highlight) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-subtle hover:shadow-card ${
            wageHighlight ? 'border-[#6EE7D2] ring-2 ring-[#6EE7D2]/40 bg-[#F0FDFB]' : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verified Wage Payout</span>
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4664F5] flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4 text-[#4664F5]" />
            </div>
          </div>
          <motion.p 
            key={metrics.totalVerifiedWagePayout}
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl sm:text-3xl font-extrabold text-[#121D33] mt-2 font-heading flex items-center gap-1"
          >
            <span>₹{metrics.totalVerifiedWagePayout.toLocaleString('en-IN')}</span>
            {wageHighlight && (
              <span className="text-[10px] text-[#0F766E] font-bold bg-[#6EE7D2]/20 px-1.5 py-0.5 rounded-full animate-bounce">
                Updated
              </span>
            )}
          </motion.p>
          <p className="text-xs text-[#0F766E] font-semibold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#0F766E]" />
            <span>From {metrics.approvedShiftsCount} approved shifts only</span>
          </p>
        </motion.div>

        {/* Metric 4 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Safety Concerns</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#121D33] mt-2 font-heading">
            {metrics.openSafetyIssuesCount}
          </p>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            SDG 8.8 protected worker log
          </p>
        </motion.div>
      </motion.div>

      {/* Main Tabs Navigation & Action Bar with Sliding Pill */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Animated Tab Bar with motion layoutId */}
          <div className="flex flex-wrap items-center bg-[#F7F9FC] p-1 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            {[
              { id: 'attendance', label: 'Attendance Approvals', count: metrics.pendingApprovalsCount, icon: UserCheck },
              { id: 'wage_ledger', label: 'FairShift Wage Ledger', icon: Scale },
              { id: 'shifts', label: `Shift Roster (${shifts.length})`, icon: Clock },
              { id: 'safety', label: 'Safety & Grievance Log', count: metrics.openSafetyIssuesCount, countRed: true, icon: ShieldAlert },
              { id: 'directory', label: `Worker Directory (${workers.length})`, icon: Users },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-3.5 py-2 rounded-xl transition-colors z-10 flex items-center gap-2 ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="managerActiveTabIndicator"
                      className="absolute inset-0 bg-[#101A31] rounded-xl -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count && tab.count > 0 ? (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      tab.countRed ? 'bg-red-500 text-white' : 'bg-amber-400 text-[#101A31]'
                    }`}>
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Quick CTA button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#4664F5] hover:bg-[#3550D6] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Assign New Shift</span>
          </motion.button>
        </div>

        {/* Tab Content with AnimatePresence Page Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* =========================================================================
                TAB 1: ATTENDANCE APPROVALS
            ========================================================================== */}
            {activeTab === 'attendance' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-[#121D33]">Shift Attendance Review & Verification</h4>
                    <p className="text-slate-500 text-xs">Review worker check-ins and check-outs before wage disbursement.</p>
                  </div>

                  {/* Status filter buttons */}
                  <div className="flex items-center bg-[#F7F9FC] p-1 rounded-xl border border-slate-200">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setAttendanceFilter(st)}
                        className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                          attendanceFilter === st ? 'bg-white text-[#121D33] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredAttendance.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No attendance records matching the "{attendanceFilter}" filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-[#F7F9FC] text-slate-500 font-semibold uppercase text-[11px]">
                          <th className="py-3 px-3">Worker</th>
                          <th className="py-3 px-3">Date & Shift ID</th>
                          <th className="py-3 px-3">Punch In / Out</th>
                          <th className="py-3 px-3">Hours (Base + OT)</th>
                          <th className="py-3 px-3">Computed Pay</th>
                          <th className="py-3 px-3">Verification</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAttendance.map(record => {
                          const worker = workers.find(w => w.id === record.workerId);
                          const shift = shifts.find(s => s.id === record.shiftId);

                          return (
                            <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{worker?.avatar || '👷'}</span>
                                  <div>
                                    <p className="font-bold text-[#121D33]">{worker?.name || 'Worker'}</p>
                                    <p className="text-[11px] text-slate-500">{worker?.role}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <p className="font-medium text-slate-800">{record.date}</p>
                                <p className="text-[11px] text-slate-500 truncate max-w-[160px]" title={shift?.title}>
                                  {shift?.title || record.shiftId}
                                </p>
                              </td>

                              <td className="py-3 px-3">
                                <p className="text-slate-800 font-medium">In: {record.checkInTime}</p>
                                <p className="text-slate-500 text-[11px]">
                                  Out: {record.checkOutTime || <span className="text-emerald-600 font-semibold">Currently on Shift</span>}
                                </p>
                              </td>

                              <td className="py-3 px-3">
                                {record.actualHours ? (
                                  <div>
                                    <p className="font-bold text-[#121D33]">{record.actualHours} hrs</p>
                                    <p className="text-[10px] text-slate-500">
                                      Reg: {record.regularHours}h | <span className="text-[#4664F5] font-semibold">OT: {record.overtimeHours}h</span>
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">In Progress</span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {record.totalPay ? (
                                  <div>
                                    <p className="font-bold text-[#121D33]">₹{record.totalPay}</p>
                                    <p className="text-[10px] text-slate-500">
                                      Base: ₹{record.regularPay} + OT: ₹{record.overtimePay}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Pending Out</span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium">
                                  {record.verificationMethod}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                {record.approvalStatus === 'approved' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
                                  </span>
                                )}
                                {record.approvalStatus === 'pending' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                                  </span>
                                )}
                                {record.approvalStatus === 'rejected' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                    <XCircle className="w-3.5 h-3.5 text-red-600" /> Rejected
                                  </span>
                                )}
                                {record.managerNotes && (
                                  <p className="text-[10px] text-slate-500 mt-1 italic max-w-[150px] truncate" title={record.managerNotes}>
                                    "{record.managerNotes}"
                                  </p>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right">
                                {record.approvalStatus === 'pending' ? (
                                  <div className="flex flex-col items-end gap-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleApprove(record.id)}
                                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 shadow-xs transition-colors"
                                        title="Approve shift & commit to wage ledger"
                                      >
                                        <Check className="w-3.5 h-3.5" /> Approve
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleReject(record.id)}
                                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors"
                                        title="Reject invalid shift"
                                      >
                                        Reject
                                      </motion.button>
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Note (optional)"
                                      value={managerNoteInput[record.id] || ''}
                                      onChange={(e) => setManagerNoteInput({ ...managerNoteInput, [record.id]: e.target.value })}
                                      className="px-2 py-0.5 border border-slate-200 rounded text-[11px] w-36 text-slate-700 focus:outline-none focus:border-[#4664F5]"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400">
                                    Reviewed {record.approvedAt?.split(' ')[0]}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 2: FAIRSHIFT WAGE LEDGER
            ========================================================================== */}
            {activeTab === 'wage_ledger' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="bg-[#EEF2FF] border border-[#C7D4FE] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-[#121D33] flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#4664F5]" />
                      SDG 8 Immutable Wage Ledger
                    </h4>
                    <p className="text-slate-600 mt-0.5">
                      Anti-wage theft policy: Payouts are computed <strong className="text-[#121D33]">ONLY from approved completed attendance</strong>. Overtime (&gt;8h) is automatically audited and paid at 1.5× base wage.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 block">Total Verified Disbursement:</span>
                    <span className="text-xl font-extrabold text-[#4664F5] font-heading">
                      ₹{metrics.totalVerifiedWagePayout.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-[#F7F9FC] text-slate-500 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Worker Name</th>
                        <th className="py-3 px-3">Base Rate</th>
                        <th className="py-3 px-3">Actual Hours</th>
                        <th className="py-3 px-3">Reg Hours (≤8h)</th>
                        <th className="py-3 px-3">OT Hours (&gt;8h)</th>
                        <th className="py-3 px-3">Reg Pay</th>
                        <th className="py-3 px-3">OT Pay (1.5×)</th>
                        <th className="py-3 px-3 font-bold text-[#121D33]">Net Verified Pay</th>
                        <th className="py-3 px-3">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendance
                        .filter(a => a.approvalStatus === 'approved')
                        .map(att => {
                          const worker = workers.find(w => w.id === att.workerId);

                          return (
                            <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-medium text-slate-800">{att.date}</td>
                              <td className="py-3 px-3 font-bold text-[#121D33]">
                                <div className="flex items-center gap-1.5">
                                  <span>{worker?.avatar}</span>
                                  <span>{worker?.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono">₹{att.hourlyRate}/h</td>
                              <td className="py-3 px-3 font-semibold text-slate-800">{att.actualHours}h</td>
                              <td className="py-3 px-3">{att.regularHours}h</td>
                              <td className="py-3 px-3 text-[#4664F5] font-bold">
                                {att.overtimeHours && att.overtimeHours > 0 ? `${att.overtimeHours}h` : '0h'}
                              </td>
                              <td className="py-3 px-3 font-mono">₹{att.regularPay}</td>
                              <td className="py-3 px-3 font-mono text-[#4664F5] font-semibold">₹{att.overtimePay || 0}</td>
                              <td className="py-3 px-3 font-mono font-extrabold text-[#0F766E] text-sm">
                                ₹{att.totalPay}
                              </td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Audit Verified
                                </span>
                                <span className="block text-[10px] text-slate-400 mt-0.5">{att.approvedAt}</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {attendance.filter(a => a.approvalStatus === 'approved').length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No approved attendance records yet. Approve shifts in the "Attendance Approvals" tab to generate wage ledger entries.
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span>Showing tamper-resistant payroll records conforming to FairShift Standard.</span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Simulated Export: Digital Audit CSV containing 256-bit hash records successfully generated for labor audit inspection.')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#4664F5]" />
                    <span>Export Audit CSV</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 3: SHIFT ROSTER
            ========================================================================== */}
            {activeTab === 'shifts' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-[#121D33]">Scheduled Shifts Roster</h4>
                    <p className="text-slate-500 text-xs">Manage assignments across {industry} sites.</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAssignModalOpen(true)}
                    className="px-3.5 py-2 bg-[#4664F5] hover:bg-[#3550D6] text-white rounded-xl font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Assign New Shift</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shifts.map(shift => {
                    const worker = workers.find(w => w.id === shift.workerId);

                    return (
                      <motion.div 
                        key={shift.id} 
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15 }}
                        className="bg-[#F7F9FC] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{shift.id}</span>
                            <h5 className="font-bold text-[#121D33] text-sm leading-tight mt-0.5">{shift.title}</h5>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            shift.status === 'in_progress'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : shift.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {shift.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Worker:</span>
                            <span className="font-semibold text-slate-800">{worker?.avatar} {worker?.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Date & Schedule:</span>
                            <span className="font-medium text-slate-800">{shift.date} ({shift.startTime} - {shift.endTime})</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[10px]">Location:</span>
                            <span className="font-medium text-slate-800">{shift.location}</span>
                          </div>
                        </div>

                        {shift.notes && (
                          <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                            "{shift.notes}"
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 4: SAFETY & WHISTLEBLOWING LOG
            ========================================================================== */}
            {activeTab === 'safety' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-[#121D33] flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      SDG 8.8 Safety Hazard & Worker Voice Log
                    </h4>
                    <p className="text-slate-500 text-xs">
                      Zero-retaliation hazard tracking. Update statuses and record corrective mitigation actions.
                    </p>
                  </div>

                  <div className="flex items-center bg-[#F7F9FC] p-1 rounded-xl border border-slate-200">
                    {(['all', 'unresolved', 'resolved'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setSafetyFilter(st)}
                        className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                          safetyFilter === st ? 'bg-white text-[#121D33] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredSafety.map(report => (
                    <motion.div 
                      key={report.id} 
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#F7F9FC] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            report.severity === 'critical'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : report.severity === 'high'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {report.severity}
                          </span>
                          <h5 className="font-bold text-[#121D33] text-sm">{report.category}</h5>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-500 text-xs">{report.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">{report.reportedAt}</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-semibold text-slate-700">
                            {report.isAnonymous ? '🔒 Anonymous Worker' : `By ${report.workerName}`}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {report.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-700">Update Status:</span>
                          {(['reported', 'investigating', 'action_taken', 'resolved'] as const).map(statusOpt => (
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              key={statusOpt}
                              onClick={() => {
                                updateSafetyReport(report.id, statusOpt);
                                showToast(`Safety issue marked as ${statusOpt.replace('_', ' ')}.`);
                              }}
                              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                                report.status === statusOpt
                                  ? 'bg-[#101A31] text-white shadow-xs font-bold'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {statusOpt.replace('_', ' ')}
                            </motion.button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add mitigation action note..."
                            defaultValue={report.resolutionNotes || ''}
                            onBlur={(e) => {
                              if (e.target.value !== report.resolutionNotes) {
                                updateSafetyReport(report.id, report.status, e.target.value);
                                showToast('Mitigation action recorded.');
                              }
                            }}
                            className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs w-64 focus:outline-none focus:border-[#4664F5]"
                          />
                        </div>
                      </div>

                      {report.resolutionNotes && (
                        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold">Manager Mitigation Action:</strong> {report.resolutionNotes}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {filteredSafety.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No safety issues reported matching this filter.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 5: WORKER DIRECTORY
            ========================================================================== */}
            {activeTab === 'directory' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-[#121D33]">
                    {industry === 'construction' ? 'Construction Workforce Roster' : 'Campus Support Staff Directory'}
                  </h4>
                  <p className="text-slate-500 text-xs">Official employment records with transparent base hourly wage rates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workers.map(w => (
                    <motion.div 
                      key={w.id} 
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#F7F9FC] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">{w.avatar}</span>
                        <div>
                          <h5 className="font-bold text-[#121D33] text-sm">{w.name}</h5>
                          <p className="text-xs text-slate-500">{w.role}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tamil Name:</span>
                          <span className="font-medium text-slate-800">{w.tamilName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="font-mono text-slate-700">{w.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Base Wage:</span>
                          <span className="font-bold text-[#0F766E]">₹{w.hourlyRate}/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Overtime Rate:</span>
                          <span className="font-bold text-[#4664F5]">₹{w.hourlyRate * 1.5}/hour (1.5×)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Experience:</span>
                          <span>{w.experienceYears} Years</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal for Assigning Shift */}
      <ShiftAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />
    </div>
  );
};
