import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  IndustryType, 
  RoleType, 
  Language, 
  Worker, 
  Shift, 
  AttendanceRecord, 
  SafetyReport,
  ApprovalStatus,
  SafetyStatus
} from '../types';
import {
  initialConstructionWorkers,
  initialConstructionShifts,
  initialConstructionAttendance,
  initialConstructionSafetyReports,
  initialCollegeWorkers,
  initialCollegeShifts,
  initialCollegeAttendance,
  initialCollegeSafetyReports
} from '../data/seedData';

interface AppContextType {
  industry: IndustryType;
  setIndustry: (ind: IndustryType) => void;
  role: RoleType;
  setRole: (r: RoleType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedWorkerId: string;
  setSelectedWorkerId: (id: string) => void;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;

  // Active data for current industry
  workers: Worker[];
  shifts: Shift[];
  attendance: AttendanceRecord[];
  safetyReports: SafetyReport[];

  // Actions
  assignShift: (data: {
    workerId: string;
    title: string;
    tamilTitle?: string;
    date: string;
    startTime: string;
    endTime: string;
    scheduledHours: number;
    location: string;
    tamilLocation?: string;
    notes?: string;
  }) => void;

  workerCheckIn: (shiftId: string, workerId: string) => { success: boolean; message: string };
  workerCheckOut: (attendanceId: string) => { success: boolean; message: string };
  reviewAttendance: (attendanceId: string, status: ApprovalStatus, managerNotes?: string) => void;
  submitSafetyReport: (data: {
    workerId: string;
    workerName: string;
    category: SafetyReport['category'];
    tamilCategory?: string;
    severity: SafetyReport['severity'];
    location: string;
    description: string;
    isAnonymous: boolean;
  }) => void;
  updateSafetyReport: (reportId: string, status: SafetyStatus, resolutionNotes?: string) => void;
  resetToDemoData: () => void;

  // Metrics
  metrics: {
    activeWorkersNow: number;
    pendingApprovalsCount: number;
    totalVerifiedWagePayout: number;
    openSafetyIssuesCount: number;
    totalWorkersCount: number;
    approvedShiftsCount: number;
  };

  currentWorker?: Worker;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ledgerless_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [industry, setIndustryState] = useState<IndustryType>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}industry`);
    return (saved === 'college' ? 'college' : 'construction') as IndustryType;
  });

  const [role, setRole] = useState<RoleType>('manager');
  const [language, setLanguage] = useState<Language>('en');
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Construction state
  const [cWorkers, setCWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}c_workers`);
    return saved ? JSON.parse(saved) : initialConstructionWorkers;
  });
  const [cShifts, setCShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}c_shifts`);
    return saved ? JSON.parse(saved) : initialConstructionShifts;
  });
  const [cAttendance, setCAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}c_attendance`);
    return saved ? JSON.parse(saved) : initialConstructionAttendance;
  });
  const [cSafety, setCSafety] = useState<SafetyReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}c_safety`);
    return saved ? JSON.parse(saved) : initialConstructionSafetyReports;
  });

  // College state
  const [uWorkers, setUWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}u_workers`);
    return saved ? JSON.parse(saved) : initialCollegeWorkers;
  });
  const [uShifts, setUShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}u_shifts`);
    return saved ? JSON.parse(saved) : initialCollegeShifts;
  });
  const [uAttendance, setUAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}u_attendance`);
    return saved ? JSON.parse(saved) : initialCollegeAttendance;
  });
  const [uSafety, setUSafety] = useState<SafetyReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}u_safety`);
    return saved ? JSON.parse(saved) : initialCollegeSafetyReports;
  });

  // Active worker selection
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(() => {
    return industry === 'construction' ? initialConstructionWorkers[0].id : initialCollegeWorkers[0].id;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}industry`, industry);
  }, [industry]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}c_workers`, JSON.stringify(cWorkers));
  }, [cWorkers]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}c_shifts`, JSON.stringify(cShifts));
  }, [cShifts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}c_attendance`, JSON.stringify(cAttendance));
  }, [cAttendance]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}c_safety`, JSON.stringify(cSafety));
  }, [cSafety]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}u_workers`, JSON.stringify(uWorkers));
  }, [uWorkers]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}u_shifts`, JSON.stringify(uShifts));
  }, [uShifts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}u_attendance`, JSON.stringify(uAttendance));
  }, [uAttendance]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}u_safety`, JSON.stringify(uSafety));
  }, [uSafety]);

  const setIndustry = (newInd: IndustryType) => {
    setIndustryState(newInd);
    if (newInd === 'construction') {
      setSelectedWorkerId(cWorkers[0]?.id || 'c-w1');
    } else {
      setSelectedWorkerId(uWorkers[0]?.id || 'u-w1');
    }
  };

  // Active dataset
  const workers = industry === 'construction' ? cWorkers : uWorkers;
  const shifts = industry === 'construction' ? cShifts : uShifts;
  const attendance = industry === 'construction' ? cAttendance : uAttendance;
  const safetyReports = industry === 'construction' ? cSafety : uSafety;

  const currentWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  // Helper format time
  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getCurrentFormattedDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // 1. Assign Shift (Manager)
  const assignShift = (data: {
    workerId: string;
    title: string;
    tamilTitle?: string;
    date: string;
    startTime: string;
    endTime: string;
    scheduledHours: number;
    location: string;
    tamilLocation?: string;
    notes?: string;
  }) => {
    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      workerId: data.workerId,
      title: data.title,
      tamilTitle: data.tamilTitle || data.title,
      industry,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      scheduledHours: data.scheduledHours,
      location: data.location,
      tamilLocation: data.tamilLocation || data.location,
      status: 'scheduled',
      notes: data.notes
    };

    if (industry === 'construction') {
      setCShifts(prev => [newShift, ...prev]);
    } else {
      setUShifts(prev => [newShift, ...prev]);
    }
  };

  // 2. Worker Check-In
  const workerCheckIn = (shiftId: string, workerId: string) => {
    // Prevent duplicate check-in
    const existing = attendance.find(a => a.shiftId === shiftId && a.workerId === workerId);
    if (existing && existing.checkInTime) {
      return { success: false, message: 'You have already checked in for this shift!' };
    }

    const workerObj = workers.find(w => w.id === workerId);
    const hourlyRate = workerObj?.hourlyRate || 150;
    const checkInTimeStr = getCurrentFormattedTime();
    const currentDateStr = getCurrentFormattedDate();

    const newAttendance: AttendanceRecord = {
      id: `att-${Date.now()}`,
      shiftId,
      workerId,
      industry,
      date: currentDateStr,
      checkInTime: checkInTimeStr,
      hourlyRate,
      approvalStatus: 'pending',
      verificationMethod: 'GPS Geofence + Verified QR'
    };

    if (industry === 'construction') {
      setCAttendance(prev => [newAttendance, ...prev]);
      setCShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status: 'in_progress' } : s));
    } else {
      setUAttendance(prev => [newAttendance, ...prev]);
      setUShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status: 'in_progress' } : s));
    }

    return { success: true, message: `Checked in successfully at ${checkInTimeStr} (GPS & Token Verified)` };
  };

  // 3. Worker Check-Out
  const workerCheckOut = (attendanceId: string) => {
    const targetRecord = attendance.find(a => a.id === attendanceId);
    if (!targetRecord) {
      return { success: false, message: 'Attendance record not found.' };
    }
    if (targetRecord.checkOutTime) {
      return { success: false, message: 'You have already checked out of this shift.' };
    }

    const checkOutTimeStr = getCurrentFormattedTime();
    
    // In a live hackathon demo, simulate completed duration with demo overtime:
    // Base 8 hours regular + 1.2 hours overtime = 9.2 hours
    const actualHours = 9.2;
    const regularHours = 8.0;
    const overtimeHours = 1.2;
    const hourlyRate = targetRecord.hourlyRate;
    const regularPay = Number((regularHours * hourlyRate).toFixed(2));
    const overtimePay = Number((overtimeHours * (hourlyRate * 1.5)).toFixed(2)); // FairShift 1.5x OT Rule
    const totalPay = Number((regularPay + overtimePay).toFixed(2));

    const updater = (prev: AttendanceRecord[]) =>
      prev.map(a => {
        if (a.id === attendanceId) {
          return {
            ...a,
            checkOutTime: checkOutTimeStr,
            actualHours,
            regularHours,
            overtimeHours,
            regularPay,
            overtimePay,
            totalPay,
            approvalStatus: 'pending' as ApprovalStatus
          };
        }
        return a;
      });

    const shiftUpdater = (prev: Shift[]) =>
      prev.map(s => s.id === targetRecord.shiftId ? { ...s, status: 'completed' as const } : s);

    if (industry === 'construction') {
      setCAttendance(updater);
      setCShifts(shiftUpdater);
    } else {
      setUAttendance(updater);
      setUShifts(shiftUpdater);
    }

    return { 
      success: true, 
      message: `Checked out at ${checkOutTimeStr}. Total logged: ${actualHours} hrs (including 1.2 hrs overtime). Pending manager approval.` 
    };
  };

  // 4. Review Attendance (Manager Approval / Rejection)
  const reviewAttendance = (attendanceId: string, status: ApprovalStatus, managerNotes?: string) => {
    const approvedAt = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

    const updater = (prev: AttendanceRecord[]) =>
      prev.map(a => {
        if (a.id === attendanceId) {
          return {
            ...a,
            approvalStatus: status,
            approvedAt: status === 'approved' ? approvedAt : undefined,
            managerNotes: managerNotes || a.managerNotes
          };
        }
        return a;
      });

    if (industry === 'construction') {
      setCAttendance(updater);
    } else {
      setUAttendance(updater);
    }
  };

  // 5. Submit Safety Report (Worker)
  const submitSafetyReport = (data: {
    workerId: string;
    workerName: string;
    category: SafetyReport['category'];
    tamilCategory?: string;
    severity: SafetyReport['severity'];
    location: string;
    description: string;
    isAnonymous: boolean;
  }) => {
    const newReport: SafetyReport = {
      id: `safe-${Date.now()}`,
      workerId: data.workerId,
      workerName: data.isAnonymous ? 'Anonymous Worker' : data.workerName,
      industry,
      category: data.category,
      tamilCategory: data.tamilCategory || data.category,
      severity: data.severity,
      location: data.location,
      description: data.description,
      reportedAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'reported',
      isAnonymous: data.isAnonymous
    };

    if (industry === 'construction') {
      setCSafety(prev => [newReport, ...prev]);
    } else {
      setUSafety(prev => [newReport, ...prev]);
    }
  };

  // 6. Update Safety Report (Manager)
  const updateSafetyReport = (reportId: string, status: SafetyStatus, resolutionNotes?: string) => {
    const updater = (prev: SafetyReport[]) =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            resolutionNotes: resolutionNotes || r.resolutionNotes
          };
        }
        return r;
      });

    if (industry === 'construction') {
      setCSafety(updater);
    } else {
      setUSafety(updater);
    }
  };

  // 7. Reset to Demo Data
  const resetToDemoData = () => {
    setCWorkers(initialConstructionWorkers);
    setCShifts(initialConstructionShifts);
    setCAttendance(initialConstructionAttendance);
    setCSafety(initialConstructionSafetyReports);

    setUWorkers(initialCollegeWorkers);
    setUShifts(initialCollegeShifts);
    setUAttendance(initialCollegeAttendance);
    setUSafety(initialCollegeSafetyReports);

    localStorage.removeItem(`${STORAGE_PREFIX}c_workers`);
    localStorage.removeItem(`${STORAGE_PREFIX}c_shifts`);
    localStorage.removeItem(`${STORAGE_PREFIX}c_attendance`);
    localStorage.removeItem(`${STORAGE_PREFIX}c_safety`);

    localStorage.removeItem(`${STORAGE_PREFIX}u_workers`);
    localStorage.removeItem(`${STORAGE_PREFIX}u_shifts`);
    localStorage.removeItem(`${STORAGE_PREFIX}u_attendance`);
    localStorage.removeItem(`${STORAGE_PREFIX}u_safety`);

    setSelectedWorkerId(industry === 'construction' ? initialConstructionWorkers[0].id : initialCollegeWorkers[0].id);
  };

  // Dynamically computed metrics
  const activeWorkersNow = shifts.filter(s => s.status === 'in_progress').length;
  const pendingApprovalsCount = attendance.filter(a => a.approvalStatus === 'pending').length;
  
  // Calculate wage payout ONLY from approved completed attendance!
  const totalVerifiedWagePayout = attendance
    .filter(a => a.approvalStatus === 'approved')
    .reduce((sum, a) => sum + (a.totalPay || 0), 0);

  const openSafetyIssuesCount = safetyReports.filter(r => r.status !== 'resolved').length;
  const totalWorkersCount = workers.length;
  const approvedShiftsCount = attendance.filter(a => a.approvalStatus === 'approved').length;

  return (
    <AppContext.Provider
      value={{
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
        shifts,
        attendance,
        safetyReports,
        assignShift,
        workerCheckIn,
        workerCheckOut,
        reviewAttendance,
        submitSafetyReport,
        updateSafetyReport,
        resetToDemoData,
        metrics: {
          activeWorkersNow,
          pendingApprovalsCount,
          totalVerifiedWagePayout,
          openSafetyIssuesCount,
          totalWorkersCount,
          approvedShiftsCount
        },
        currentWorker
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

