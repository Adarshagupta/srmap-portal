'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { Calendar, Clock, BookOpen } from 'lucide-react';

export default function TimetablePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching timetable and attendance data...');
        const [timetableResult, attendanceResult] = await Promise.all([
          studentAPI.getTimetable(user.sessionId),
          studentAPI.getAttendance(user.sessionId)
        ]);
        console.log('Timetable API response:', timetableResult);
        console.log('Attendance API response:', attendanceResult);
        setData(timetableResult);
        setAttendanceData(attendanceResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Helper function to get attendance for a subject
  const getAttendanceForSubject = (subjectName: string) => {
    if (!attendanceData?.attendance) {
      return null;
    }
    
    if (!subjectName || subjectName === '-') return null;
    
    // Clean the subject name from timetable
    const cleanSubjectName = subjectName.trim().toLowerCase();
    
    // Find matching subject in attendance data with strict matching
    const attendance = attendanceData.attendance.find((item: any) => {
      const itemSubject = (item.subject || '').trim().toLowerCase();
      const itemCode = (item.subject_code || '').trim().toLowerCase();
      
      // Skip empty entries
      if (!itemSubject && !itemCode) return false;
      
      // Try exact match first
      if (itemSubject === cleanSubjectName) return true;
      if (itemCode === cleanSubjectName) return true;
      
      // Try matching if timetable has code and attendance has full name
      // For example: timetable has "CS101" and attendance has "Computer Science - CS101"
      if (itemCode && cleanSubjectName.includes(itemCode)) return true;
      if (itemSubject.includes(cleanSubjectName) && cleanSubjectName.length > 3) return true;
      
      // Try matching words (for multi-word subjects)
      const subjectWords = cleanSubjectName.split(/[\s\-_]+/).filter(w => w.length > 2);
      const itemWords = itemSubject.split(/[\s\-_]+/).filter(w => w.length > 2);
      
      // If timetable subject has significant words that match attendance subject
      if (subjectWords.length > 0) {
        const matchCount = subjectWords.filter(word => 
          itemWords.some(iw => iw.includes(word) || word.includes(iw))
        ).length;
        
        // Require at least 50% of words to match for multi-word subjects
        if (matchCount >= Math.ceil(subjectWords.length * 0.5) && matchCount > 0) {
          return true;
        }
      }
      
      return false;
    });
    
    if (!attendance) {
      return null;
    }
    
    const present = parseInt(attendance.present) || 0;
    const absent = parseInt(attendance.absent) || 0;
    const odml = parseInt(attendance.od_ml) || 0;
    const total = present + absent + odml;
    
    if (total === 0) return null;
    
    const percentage = ((present + odml) / total) * 100;
    
    return {
      percentage: percentage.toFixed(1),
      present,
      total,
      isLow: percentage < 75
    };
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periodLabels = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'];

  // Map timetable data by day
  const timetableByDay = data?.timetable?.reduce((acc: any, item: any) => {
    acc[item.day] = item.periods;
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Timetable</h1>
        <p className="text-gray-600 mt-1">Your weekly class schedule</p>
      </div>

      {/* Current Day Highlight */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Today</p>
            <p className="text-2xl font-bold mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      {data?.timetable && data.timetable.length > 0 ? (
        <div className="card overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Weekly Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-2 border-gray-300 py-3 px-4 text-left font-semibold text-gray-700 min-w-[120px]">
                    Day
                  </th>
                  {periodLabels.map((label, index) => (
                    <th key={index} className="border-2 border-gray-300 py-3 px-4 text-center font-semibold text-gray-700 min-w-[180px]">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const periods = timetableByDay[day] || [];
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                  
                  return (
                    <tr key={day} className={isToday ? 'bg-primary-50' : 'hover:bg-gray-50'}>
                      <td className={`border-2 border-gray-300 py-4 px-4 font-semibold ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                        {day}
                        {isToday && <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded-full">Today</span>}
                      </td>
                      {periodLabels.map((_, periodIndex) => {
                        const periodContent = periods[periodIndex] || '';
                        const isEmpty = !periodContent || periodContent === '-';
                        const attendance = !isEmpty ? getAttendanceForSubject(periodContent) : null;
                        
                        return (
                          <td 
                            key={periodIndex} 
                            className={`border-2 border-gray-300 py-4 px-4 text-center ${
                              isEmpty ? 'bg-gray-50 text-gray-400' : isToday ? 'bg-primary-50' : ''
                            }`}
                          >
                            {isEmpty ? (
                              <span className="text-sm">-</span>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                  <BookOpen className="w-4 h-4 text-primary-600" />
                                  <span className="font-medium text-sm text-gray-900">
                                    {periodContent}
                                  </span>
                                </div>
                                {attendance && (
                                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                                    attendance.isLow 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {attendance.percentage}% ({attendance.present}/{attendance.total})
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Timetable Data Found</h3>
          <p className="text-gray-500">
            {!data ? 'Failed to load timetable. Please try again.' : 
             'No timetable available for this semester.'}
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Timetable with Attendance</h3>
            <p className="text-sm text-blue-700 mt-1">
              This timetable shows your regular weekly class schedule with attendance percentages for each subject. 
              Subjects with attendance below 75% are highlighted in red.
              Please check official notices for any special classes, exams, or schedule changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
