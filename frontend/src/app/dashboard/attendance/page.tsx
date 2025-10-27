'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { ClipboardList, AlertCircle, CheckCircle } from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching attendance data...');
        const result = await studentAPI.getAttendance(user.sessionId);
        console.log('Attendance API response:', result);
        console.log('Attendance data:', result.attendance);
        setData(result);
      } catch (error) {
        console.error('Error fetching attendance:', error);
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

  // Calculate overall attendance properly
  const calculateOverallAttendance = () => {
    if (!data?.attendance || data.attendance.length === 0) return 0;
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalODML = 0;
    
    data.attendance.forEach((item: any) => {
      const present = parseInt(item.present) || 0;
      const absent = parseInt(item.absent) || 0;
      const odml = parseInt(item.od_ml_taken) || 0;
      totalPresent += present;
      totalAbsent += absent;
      totalODML += odml;
    });
    
    const total = totalPresent + totalAbsent + totalODML;
    return total > 0 ? (totalPresent / total) * 100 : 0;
  };

  const avgAttendance = calculateOverallAttendance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Details</h1>
        <p className="text-gray-600 mt-1">Track your class attendance</p>
      </div>

      {/* Average Attendance Card */}
      <div className={`card bg-gradient-to-br ${
        avgAttendance >= 75 ? 'from-green-500 to-green-700' :
        avgAttendance >= 65 ? 'from-yellow-500 to-yellow-700' :
        'from-red-500 to-red-700'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Average Attendance</p>
            <p className="text-5xl font-bold mt-3">{avgAttendance.toFixed(1)}%</p>
            <p className="text-white/80 mt-2">
              {avgAttendance >= 75 ? 'Good Standing' : avgAttendance >= 65 ? 'Below Average' : 'Critical - Requires Attention'}
            </p>
          </div>
          {avgAttendance >= 75 ? (
            <CheckCircle className="w-24 h-24 text-white/50" />
          ) : (
            <AlertCircle className="w-24 h-24 text-white/50" />
          )}
        </div>
      </div>

      {/* Subject-wise Attendance */}
      {data?.attendance && data.attendance.length > 0 ? (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Subject-wise Attendance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject Name</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Classes Conducted</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Present</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Absent</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">OD/ML</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Attendance %</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.attendance.map((item: any, index: number) => {
                  // Use the attendance percentage from the portal
                  const percentage = parseFloat(item.attendance_percentage) || 0;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-primary-600">{item.subject_code}</td>
                      <td className="py-3 px-4 text-sm">{item.subject_name}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium">{item.classes_conducted}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-green-600">{item.present}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-red-600">{item.absent}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-blue-600">{item.od_ml_taken}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage >= 75 ? 'bg-green-500' :
                                percentage >= 65 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          percentage >= 75 ? 'bg-green-100 text-green-800' :
                          percentage >= 65 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {percentage >= 75 ? 'Good' : percentage >= 65 ? 'Low' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Attendance Data Found</h3>
          <p className="text-gray-500">
            {!data ? 'Failed to load attendance data. Please try again.' : 
             'No attendance records available for this semester.'}
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Attendance Policy</h3>
            <p className="text-sm text-blue-700 mt-1">
              Minimum 75% attendance is required to be eligible for end-semester examinations. 
              Students below 65% may face academic penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
