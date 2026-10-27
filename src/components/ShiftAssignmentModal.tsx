import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { X, CalendarPlus, Clock, MapPin, User, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftAssignmentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { workers, assignShift, industry } = useApp();

  const [workerId, setWorkerId] = useState(workers[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Compute duration
  const startHour = parseInt(startTime.split(':')[0] || '8', 10);
  const endHour = parseInt(endTime.split(':')[0] || '17', 10);
  const scheduledHours = Math.max(1, endHour - startHour);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) {
      alert('Please enter shift title and work location.');
      return;
    }

    assignShift({
      workerId: workerId || workers[0]?.id || '',
      title,
      date,
      startTime,
      endTime,
      scheduledHours,
      location,
      notes
    });

    onClose();
  };

  const defaultLocations = industry === 'construction' 
    ? ['Metro Pier #142 (Zone A)', 'Tower B - Exterior North Face', 'Material Yard & Siding #3', 'Basement Substation Area']
    : ['Central Library Block A', 'Sir CV Raman Science Block 3', 'Kaveri Hostel Dining Hall', 'North Campus Main Gate'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with motion fade */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#101A31]/60 backdrop-blur-sm"
          />

          {/* Modal Container with motion pop */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-floating border border-slate-200 z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4664F5] flex items-center justify-center shadow-xs">
                  <CalendarPlus className="w-5 h-5 text-[#4664F5]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-[#121D33]">Assign New Shift</h3>
                  <p className="text-xs text-slate-500 capitalize">{industry} Workforce Roster</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {/* Worker Select */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Assign Worker
                </label>
                <select
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none transition-all"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.avatar} {w.name} — {w.role} (₹{w.hourlyRate}/hr)
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Shift Title / Assignment Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={industry === 'construction' ? 'e.g., Pillar Reinforcement & Concrete Pour' : 'e.g., Campus Library Archive Audit'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none transition-all"
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Start
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> End
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#F7F9FC] p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600 text-[11px]">
                <span>Scheduled Shift Duration:</span>
                <span className="font-bold text-[#121D33]">{scheduledHours} Hours {scheduledHours > 8 ? `(${scheduledHours - 8}h Overtime eligible)` : ''}</span>
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Designated Work Site / Location
                </label>
                <input
                  type="text"
                  required
                  list="location-suggestions-modal"
                  placeholder="Enter exact location or geofence tag"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                />
                <datalist id="location-suggestions-modal">
                  {defaultLocations.map((loc, idx) => (
                    <option key={idx} value={loc} />
                  ))}
                </datalist>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Safety & Operational Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mandatory safety harness check; PPE kit required."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-[#4664F5] focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4664F5] hover:bg-[#3550D6] text-white font-semibold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Publish Shift</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
