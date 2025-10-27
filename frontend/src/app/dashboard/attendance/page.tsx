'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { ClipboardList, AlertCircle, CheckCircle, Calculator, TrendingUp, TrendingDown } from 'lucide-react';

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

  // Bunk Planner Calculator
  const calculateBunkPlanner = (present: number, absent: number, odml: number) => {
    const totalClasses = present + absent + odml;
    const currentAttendance = totalClasses > 0 ? (present / totalClasses) * 100 : 0;
    
    // Calculate classes that can be bunked while maintaining 75%
    let canBunk = 0;
    if (currentAttendance >= 75) {
      // Formula: Can bunk = (Present - 0.75 * Total) / 0.75
      canBunk = Math.floor((present - 0.75 * totalClasses) / 0.75);
    }
    
    // Calculate classes needed to attend to reach 75%
    let needToAttend = 0;
    if (currentAttendance < 75) {
      // Formula: Need to attend = (0.75 * Total - Present) / 0.25
      needToAttend = Math.ceil((0.75 * totalClasses - present) / 0.25);
    }
    
    // Calculate what happens if they bunk next class
    const afterBunkAttendance = totalClasses > 0 ? (present / (totalClasses + 1)) * 100 : 0;
    
    // Calculate what happens if they attend next class
    const afterAttendAttendance = totalClasses > 0 ? ((present + 1) / (totalClasses + 1)) * 100 : 0;
    
    return {
      canBunk,
      needToAttend,
      currentAttendance,
      afterBunkAttendance,
      afterAttendAttendance,
      totalClasses
    };
  };

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
            Subject-wise Attendance & Bunk Planner
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Conducted</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Present</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Absent</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">OD/ML</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Attendance %</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calculator className="w-4 h-4" />
                      Bunk Planner
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.attendance.map((item: any, index: number) => {
                  const percentage = parseFloat(item.attendance_percentage) || 0;
                  const present = parseInt(item.present) || 0;
                  const absent = parseInt(item.absent) || 0;
                  const odml = parseInt(item.od_ml_taken) || 0;
                  
                  const bunkPlan = calculateBunkPlanner(present, absent, odml);
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-primary-600">{item.subject_code}</div>
                        <div className="text-xs text-gray-500">{item.subject_name}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-center font-medium">{item.classes_conducted}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-green-600">{item.present}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-red-600">{item.absent}</td>
                      <td className="py-3 px-4 text-sm text-center font-medium text-blue-600">{item.od_ml_taken}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
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
                      <td className="py-3 px-4">
                        {percentage >= 75 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-green-700">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold">Can bunk {bunkPlan.canBunk} {bunkPlan.canBunk === 1 ? 'class' : 'classes'}</span>
                            </div>
                            <div className="text-xs text-gray-500 pl-5">
                              After bunk: {bunkPlan.afterBunkAttendance.toFixed(1)}%
                            </div>
                          </div>
                        ) : percentage >= 65 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-yellow-700">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold">Attend {bunkPlan.needToAttend} {bunkPlan.needToAttend === 1 ? 'class' : 'classes'}</span>
                            </div>
                            <div className="text-xs text-gray-500 pl-5">
                              To reach 75%
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-red-700">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-xs font-semibold">Must attend {bunkPlan.needToAttend} classes</span>
                            </div>
                            <div className="text-xs text-red-600 pl-5 font-medium">
                              Critical! Reach 75%
                            </div>
                          </div>
                        )}
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

      {/* How to Maintain 75% Guide */}
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-900">
          <Calculator className="w-5 h-5" />
          How to Maintain 75% Attendance
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Understanding the Math */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Understanding the Math
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Formula:</span> Attendance % = (Present / Total Classes) × 100</p>
              <p><span className="font-semibold">Target:</span> You need 75% to be eligible for exams</p>
              <p className="pt-2 border-t border-gray-200">
                <span className="font-semibold">Example:</span><br/>
                If you have 40 total classes and attended 30:<br/>
                Attendance = (30/40) × 100 = <span className="text-green-600 font-bold">75%</span> ✓
              </p>
            </div>
          </div>

          {/* Bunk Calculator Logic */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-600" />
              Bunk Calculator Logic
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Classes you can skip:</span><br/>
                Formula: (Present - 0.75 × Total) ÷ 0.75
              </p>
              <p className="pt-2 border-t border-gray-200">
                <span className="font-semibold">Classes needed to reach 75%:</span><br/>
                Formula: (0.75 × Total - Present) ÷ 0.25
              </p>
              <p className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                The bunk planner automatically calculates these values for each subject above.
              </p>
            </div>
          </div>

          {/* Tips to Maintain Attendance */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Tips to Maintain 75%
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>Monitor your attendance regularly</li>
              <li>Don't skip classes when you're close to 75%</li>
              <li>Use OD/ML wisely - they count as absences</li>
              <li>Attend all classes after medical leave</li>
              <li>Plan bunks strategically using the planner</li>
            </ul>
          </div>

          {/* Recovery Strategy */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Below 75%? Recovery Strategy
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li className="text-red-600 font-semibold">Do NOT skip any more classes</li>
              <li>Check "Bunk Planner" for classes needed</li>
              <li>Attend continuously until you reach 75%</li>
              <li>Talk to faculty if you have valid reasons</li>
              <li>Consider medical documentation for absences</li>
            </ul>
          </div>
        </div>

        {/* Color Code Guide */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Status Color Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">Good</span>
              <span className="text-gray-700">≥ 75% - Safe zone, can plan bunks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">Low</span>
              <span className="text-gray-700">65-74% - Attend more classes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs">Critical</span>
              <span className="text-gray-700">&lt; 65% - Immediate action needed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
