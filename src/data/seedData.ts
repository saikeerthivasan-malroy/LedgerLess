import { Worker, Shift, AttendanceRecord, SafetyReport } from '../types';

export const initialConstructionWorkers: Worker[] = [
  {
    id: 'c-w1',
    name: 'Ramesh Kumar',
    tamilName: 'ரமேஷ் குமார்',
    role: 'Senior Mason & Shuttering',
    tamilRole: 'மூத்த கொத்தனார் & ஷட்டரிங்',
    phone: '+91 98401 23451',
    hourlyRate: 180, // ₹180 / hr
    industry: 'construction',
    experienceYears: 7,
    avatar: '👷‍♂️'
  },
  {
    id: 'c-w2',
    name: 'Murugan S.',
    tamilName: 'முருகன் எஸ்.',
    role: 'Scaffold Erector Lead',
    tamilRole: 'சாரக்கட்டு முன்னணி பணியாளர்',
    phone: '+91 98402 34562',
    hourlyRate: 160, // ₹160 / hr
    industry: 'construction',
    experienceYears: 5,
    avatar: '🏗️'
  },
  {
    id: 'c-w3',
    name: 'Priya Selvam',
    tamilName: 'பிரியா செல்வம்',
    role: 'Site Safety Helper & Rebar',
    tamilRole: 'தள பாதுகாப்பு & கம்பி கட்டும் பணி',
    phone: '+91 98403 45673',
    hourlyRate: 150, // ₹150 / hr
    industry: 'construction',
    experienceYears: 3,
    avatar: '🦺'
  },
  {
    id: 'c-w4',
    name: 'Kannan V.',
    tamilName: 'கண்ணன் வி.',
    role: 'Heavy Concrete Mixer Operator',
    tamilRole: 'கான்கிரீட் கலவை இயந்திர ஆப்பரேட்டர்',
    phone: '+91 98404 56784',
    hourlyRate: 200, // ₹200 / hr
    industry: 'construction',
    experienceYears: 9,
    avatar: '🚜'
  }
];

export const initialConstructionShifts: Shift[] = [
  {
    id: 'c-s1',
    workerId: 'c-w1',
    title: 'Metro Line 4 - Pier Reinforcement',
    tamilTitle: 'மெட்ரோ பாதை 4 - தூண் வலுவூட்டல்',
    industry: 'construction',
    date: '2026-10-26',
    startTime: '08:00',
    endTime: '17:30',
    scheduledHours: 9.5,
    location: 'Metro Pier #142 (Zone A)',
    tamilLocation: 'மெட்ரோ தூண் #142 (மண்டலம் A)',
    status: 'completed',
    notes: 'Reinforced pillar shuttering complete before concrete pour.'
  },
  {
    id: 'c-s2',
    workerId: 'c-w2',
    title: 'Tower B Level 8 - Safety Perimeter Scaffolding',
    tamilTitle: 'டவர் B தளம் 8 - பாதுகாப்பு சாரக்கட்டு',
    industry: 'construction',
    date: '2026-10-27',
    startTime: '08:00',
    endTime: '17:00',
    scheduledHours: 9,
    location: 'Tower B - Exterior North Face',
    tamilLocation: 'டவர் B - வடக்கு வெளிப்புற பகுதி',
    status: 'in_progress',
    notes: 'Wind velocity check required before assembly.'
  },
  {
    id: 'c-s3',
    workerId: 'c-w3',
    title: 'Rebar Inspection & Hazard Screening',
    tamilTitle: 'கம்பி ஆய்வு மற்றும் அபாய தணிக்கை',
    industry: 'construction',
    date: '2026-10-27',
    startTime: '08:30',
    endTime: '17:30',
    scheduledHours: 9,
    location: 'Material Yard & Siding #3',
    tamilLocation: 'பொருட்கள் முற்றம் & பகுதி #3',
    status: 'scheduled',
    notes: 'PPE compliance inspection across crew.'
  },
  {
    id: 'c-s4',
    workerId: 'c-w4',
    title: 'High-Strength Deck Slab Pouring',
    tamilTitle: 'மேல் தள கான்கிரீட் வார்ப்பு பணி',
    industry: 'construction',
    date: '2026-10-26',
    startTime: '07:30',
    endTime: '18:00',
    scheduledHours: 10.5,
    location: 'Flyover Ramp Section 4',
    tamilLocation: 'மேம்பால சாய்வுதளம் பகுதி 4',
    status: 'completed',
    notes: 'Continuous pour with temperature monitoring.'
  }
];

export const initialConstructionAttendance: AttendanceRecord[] = [
  {
    id: 'c-att-1',
    shiftId: 'c-s1',
    workerId: 'c-w1',
    industry: 'construction',
    date: '2026-10-26',
    checkInTime: '07:58 AM',
    checkOutTime: '05:32 PM',
    actualHours: 9.5,
    regularHours: 8.0,
    overtimeHours: 1.5,
    hourlyRate: 180,
    regularPay: 1440, // 8 * 180
    overtimePay: 405, // 1.5 * (180 * 1.5) = 1.5 * 270 = 405
    totalPay: 1845,
    approvalStatus: 'approved',
    approvedAt: '2026-10-26 06:15 PM',
    managerNotes: 'Overtime authorized due to batch cement delivery delay.',
    verificationMethod: 'GPS Geofence + Verified QR'
  },
  {
    id: 'c-att-2',
    shiftId: 'c-s4',
    workerId: 'c-w4',
    industry: 'construction',
    date: '2026-10-26',
    checkInTime: '07:25 AM',
    checkOutTime: '06:05 PM',
    actualHours: 10.6,
    regularHours: 8.0,
    overtimeHours: 2.6,
    hourlyRate: 200,
    regularPay: 1600, // 8 * 200
    overtimePay: 780, // 2.6 * 300 = 780
    totalPay: 2380,
    approvalStatus: 'pending', // Pending manager approval so tester can click Approve/Reject!
    managerNotes: 'Awaiting site supervisor confirmation on overtime log.',
    verificationMethod: 'Biometric Face Token'
  }
];

export const initialConstructionSafetyReports: SafetyReport[] = [
  {
    id: 'c-safe-1',
    workerId: 'c-w2',
    workerName: 'Murugan S.',
    industry: 'construction',
    category: 'Missing PPE',
    tamilCategory: 'விடுபட்ட பாதுகாப்பு உபகரணங்கள்',
    severity: 'high',
    location: 'Tower B - 8th Floor Scaffolding',
    description: 'Double lanyard safety harnesses are short by 3 units for the afternoon exterior crew.',
    reportedAt: '2026-10-27 08:45 AM',
    status: 'investigating',
    resolutionNotes: 'Safety officer dispatched to procure additional harnesses from central tool shed.',
    isAnonymous: false
  },
  {
    id: 'c-safe-2',
    workerId: 'c-w3',
    workerName: 'Priya Selvam',
    industry: 'construction',
    category: 'Excessive Heat / Fatigue',
    tamilCategory: 'கடுமையான வெயில் / சோர்வு',
    severity: 'medium',
    location: 'Flyover Ramp Open Yard',
    description: 'Electrolyte drinking water station ran out at 11 AM in direct 37°C sunlight. Workers feeling dizzy.',
    reportedAt: '2026-10-26 11:30 AM',
    status: 'action_taken',
    resolutionNotes: 'Restocked with 4 commercial water coolers and instituted a mandatory 15-min shade rotation.',
    isAnonymous: false
  }
];

// College Campus Data
export const initialCollegeWorkers: Worker[] = [
  {
    id: 'u-w1',
    name: 'Anitha Raman',
    tamilName: 'அனிதா ராமன்',
    role: 'Central Library & Archive Attendant',
    tamilRole: 'மத்திய நூலக கண்காணிப்பாளர்',
    phone: '+91 97890 12345',
    hourlyRate: 140, // ₹140 / hr
    industry: 'college',
    experienceYears: 4,
    avatar: '📚'
  },
  {
    id: 'u-w2',
    name: 'Suresh K.',
    tamilName: 'சுரேஷ் கே.',
    role: 'Senior Campus Security Officer',
    tamilRole: 'முதுநிலை வளாக பாதுகாப்பு அதிகாரி',
    phone: '+91 97891 23456',
    hourlyRate: 165, // ₹165 / hr
    industry: 'college',
    experienceYears: 6,
    avatar: '👮'
  },
  {
    id: 'u-w3',
    name: 'David Raj',
    tamilName: 'டேவிட் ராஜ்',
    role: 'Science Laboratory Facilities Lead',
    tamilRole: 'அறிவியல் ஆய்வக பராமரிப்பாளர்',
    phone: '+91 97892 34567',
    hourlyRate: 155, // ₹155 / hr
    industry: 'college',
    experienceYears: 5,
    avatar: '🧪'
  },
  {
    id: 'u-w4',
    name: 'Meena B.',
    tamilName: 'மீனா பி.',
    role: 'Hostel Sanitation & Hygiene Lead',
    tamilRole: 'விடுதி தூய்மை & சுகாதார பொறுப்பாளர்',
    phone: '+91 97893 45678',
    hourlyRate: 135, // ₹135 / hr
    industry: 'college',
    experienceYears: 3,
    avatar: '🧹'
  }
];

export const initialCollegeShifts: Shift[] = [
  {
    id: 'u-s1',
    workerId: 'u-w1',
    title: 'Semester Exam Hall & Archive Custody',
    tamilTitle: 'பருவத் தேர்வு அரங்கு & காப்பக பொறுப்பு',
    industry: 'college',
    date: '2026-10-26',
    startTime: '08:00',
    endTime: '17:00',
    scheduledHours: 9,
    location: 'Central Library Block A (Floors 1-3)',
    tamilLocation: 'மத்திய நூலக பிரிவு A (தளங்கள் 1-3)',
    status: 'completed',
    notes: 'Exam answer sheets intake protocol observed.'
  },
  {
    id: 'u-s2',
    workerId: 'u-w2',
    title: 'Main Gate & Night Perimeter Patrol',
    tamilTitle: 'முக்கிய நுழைவாயில் & இரவு ரோந்து பணி',
    industry: 'college',
    date: '2026-10-27',
    startTime: '18:00',
    endTime: '03:00',
    scheduledHours: 9,
    location: 'North Campus Main Gate & Parking',
    tamilLocation: 'வடக்கு வளாக நுழைவாயில் & வாகன நிறுத்துமிடம்',
    status: 'in_progress',
    notes: 'Visitor registration log maintenance.'
  },
  {
    id: 'u-s3',
    workerId: 'u-w3',
    title: 'Chemistry Lab Hazardous Chemical Protocol',
    tamilTitle: 'வேதியியல் ஆய்வக அபாயப் பொருட்கள் பாதுகாப்பு',
    industry: 'college',
    date: '2026-10-27',
    startTime: '09:00',
    endTime: '17:00',
    scheduledHours: 8,
    location: 'Sir CV Raman Science Block 3',
    tamilLocation: 'சர் சி.வி.ராமன் அறிவியல் வளாகம் 3',
    status: 'scheduled',
    notes: 'Acid spill neutralizer check before student practicals.'
  },
  {
    id: 'u-s4',
    workerId: 'u-w4',
    title: 'Hostel Dining Hall Deep Sanitation',
    tamilTitle: 'மாணவர் விடுதி உணவக தீவிர தூய்மை பணி',
    industry: 'college',
    date: '2026-10-26',
    startTime: '06:00',
    endTime: '15:30',
    scheduledHours: 9.5,
    location: 'Kaveri Hostel Dining Hall',
    tamilLocation: 'காவிரி விடுதி உணவு கூடம்',
    status: 'completed',
    notes: 'Food safety grade disinfection completed.'
  }
];

export const initialCollegeAttendance: AttendanceRecord[] = [
  {
    id: 'u-att-1',
    shiftId: 'u-s1',
    workerId: 'u-w1',
    industry: 'college',
    date: '2026-10-26',
    checkInTime: '07:55 AM',
    checkOutTime: '05:10 PM',
    actualHours: 9.2,
    regularHours: 8.0,
    overtimeHours: 1.2,
    hourlyRate: 140,
    regularPay: 1120, // 8 * 140
    overtimePay: 252, // 1.2 * 210 = 252
    totalPay: 1372,
    approvalStatus: 'approved',
    approvedAt: '2026-10-26 05:40 PM',
    managerNotes: 'Exam confidential material sealing extended shift.',
    verificationMethod: 'GPS Geofence + Verified QR'
  },
  {
    id: 'u-att-2',
    shiftId: 'u-s4',
    workerId: 'u-w4',
    industry: 'college',
    date: '2026-10-26',
    checkInTime: '05:50 AM',
    checkOutTime: '03:45 PM',
    actualHours: 9.9,
    regularHours: 8.0,
    overtimeHours: 1.9,
    hourlyRate: 135,
    regularPay: 1080, // 8 * 135
    overtimePay: 384.75, // 1.9 * (135 * 1.5 = 202.5) = 384.75
    totalPay: 1464.75,
    approvalStatus: 'pending', // Pending approval for manager testing
    managerNotes: 'Kitchen sanitization log under review.',
    verificationMethod: 'GPS Geofence + Verified QR'
  }
];

export const initialCollegeSafetyReports: SafetyReport[] = [
  {
    id: 'u-safe-1',
    workerId: 'u-w2',
    workerName: 'Suresh K.',
    industry: 'college',
    category: 'Hazardous Working Condition',
    tamilCategory: 'அபாயகரமான பணி சூழல்',
    severity: 'critical',
    location: 'Hostel Block B Outer Pathway',
    description: 'High-voltage floodlight bracket corroded and hanging loose above main pedestrian walkway.',
    reportedAt: '2026-10-27 07:15 AM',
    status: 'investigating',
    resolutionNotes: 'Electrical engineering team barricaded the pathway and scheduled immediate crane repair.',
    isAnonymous: false
  },
  {
    id: 'u-safe-2',
    workerId: 'u-w3',
    workerName: 'David Raj',
    industry: 'college',
    category: 'Faulty Equipment',
    tamilCategory: 'பழுதுபட்ட உபகரணங்கள்',
    severity: 'high',
    location: 'Science Block Lab 204',
    description: 'Fume hood exhaust motor is failing intermittently during acid distillation experiments.',
    reportedAt: '2026-10-26 02:20 PM',
    status: 'action_taken',
    resolutionNotes: 'Lab sealed for hazardous experiments until exhaust blower belt replacement is complete.',
    isAnonymous: true
  }
];

