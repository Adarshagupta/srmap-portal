'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI, financeAPI } from '@/lib/api';
import { GraduationCap, Calendar, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.sessionId) return;
      
      try {
        const [cgpaData, attendanceData] = await Promise.all([
          studentAPI.getCGPA(user.sessionId),
          studentAPI.getAttendance(user.sessionId),
        ]);
        
        setData({ cgpa: cgpaData, attendance: attendanceData });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const avgAttendance = data.attendance?.attendance?.length > 0
    ? data.attendance.attendance.reduce((sum: number, item: any) => {
        const percentage = parseFloat(item.percentage) || 0;
        return sum + percentage;
      }, 0) / data.attendance.attendance.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.username}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">CGPA</p>
              <p className="text-3xl font-bold mt-2">{data.cgpa?.cgpa || 'N/A'}</p>
            </div>
            <GraduationCap className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Attendance</p>
              <p className="text-3xl font-bold mt-2">{avgAttendance.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Subjects</p>
              <p className="text-3xl font-bold mt-2">{data.cgpa?.subjects?.length || 0}</p>
            </div>
            <Calendar className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Semester</p>
              <p className="text-3xl font-bold mt-2">Current</p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Recent Subjects */}
      {data.cgpa?.subjects && data.cgpa.subjects.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Subjects</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subject Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subject Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Credit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Grade</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {data.cgpa.subjects.slice(0, 5).map((subject: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{subject.subject_code}</td>
                    <td className="py-3 px-4 text-sm">{subject.subject_name}</td>
                    <td className="py-3 px-4 text-sm">{subject.credit}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        subject.grade === 'A+' || subject.grade === 'A' ? 'bg-green-100 text-green-800' :
                        subject.grade === 'B+' || subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subject.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{subject.grade_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="card hover:shadow-lg transition-shadow text-left">
          <h3 className="font-semibold text-lg mb-2">View Timetable</h3>
          <p className="text-sm text-gray-600">Check your class schedule</p>
        </button>
        <button className="card hover:shadow-lg transition-shadow text-left">
          <h3 className="font-semibold text-lg mb-2">Fee Details</h3>
          <p className="text-sm text-gray-600">View fee payment status</p>
        </button>
        <button className="card hover:shadow-lg transition-shadow text-left">
          <h3 className="font-semibold text-lg mb-2">Announcements</h3>
          <p className="text-sm text-gray-600">Latest updates and notices</p>
        </button>
      </div>
    </div>
  );
}
