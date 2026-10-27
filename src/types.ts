export type IndustryType = 'construction' | 'college';
export type RoleType = 'manager' | 'worker';
export type Language = 'en' | 'ta';

export interface Worker {
  id: string;
  name: string;
  tamilName: string;
  role: string;
  tamilRole: string;
  phone: string;
  hourlyRate: number; // in INR ₹ / hr
  industry: IndustryType;
  experienceYears: number;
  avatar: string;
}

export type ShiftStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Shift {
  id: string;
  workerId: string;
  title: string;
  tamilTitle: string;
  industry: IndustryType;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "17:00"
  scheduledHours: number;
  location: string;
  tamilLocation: string;
  status: ShiftStatus;
  notes?: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AttendanceRecord {
  id: string;
  shiftId: string;
  workerId: string;
  industry: IndustryType;
  date: string;
  checkInTime: string; // e.g. "08:02 AM"
  checkOutTime?: string; // e.g. "05:15 PM"
  actualHours?: number; // total duration in hours
  regularHours?: number; // up to 8 hours
  overtimeHours?: number; // hours exceeding 8
  hourlyRate: number;
  regularPay?: number; // regularHours * hourlyRate
  overtimePay?: number; // overtimeHours * hourlyRate * 1.5
  totalPay?: number; // regularPay + overtimePay
  approvalStatus: ApprovalStatus;
  approvedAt?: string;
  managerNotes?: string;
  verificationMethod: 'GPS Geofence + Verified QR' | 'Biometric Face Token';
}

export type SafetySeverity = 'low' | 'medium' | 'high' | 'critical';
export type SafetyStatus = 'reported' | 'investigating' | 'action_taken' | 'resolved';

export interface SafetyReport {
  id: string;
  workerId: string;
  workerName: string;
  industry: IndustryType;
  category: 
    | 'Missing PPE'
    | 'Hazardous Working Condition'
    | 'Excessive Heat / Fatigue'
    | 'Faulty Equipment'
    | 'Harassment / Wage Dispute'
    | 'Unsafe Sanitation / Water'
    | 'Other';
  tamilCategory: string;
  severity: SafetySeverity;
  location: string;
  description: string;
  reportedAt: string;
  status: SafetyStatus;
  resolutionNotes?: string;
  isAnonymous: boolean;
}

