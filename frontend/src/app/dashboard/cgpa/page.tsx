'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { Award, TrendingUp } from 'lucide-react';

export default function CGPAPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        const result = await studentAPI.getCGPA(user.sessionId);
        setData(result);
      } catch (error) {
        console.error('Error fetching CGPA:', error);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CGPA & Exam Marks</h1>
        <p className="text-gray-600 mt-1">Your academic performance overview</p>
      </div>

      {/* CGPA Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium uppercase tracking-wide">Cumulative GPA</p>
            <p className="text-5xl font-bold mt-3">{data?.cgpa || 'N/A'}</p>
            <p className="text-primary-100 mt-2">Out of 10.0</p>
          </div>
          <Award className="w-24 h-24 text-primary-200" />
        </div>
      </div>

      {/* Subjects Table */}
      {data?.subjects && data.subjects.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Semester-wise Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sem</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month & Year</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Credit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Grade</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Points</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Result</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((subject: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{subject.semester}</td>
                    <td className="py-3 px-4 text-sm">{subject.month_year}</td>
                    <td className="py-3 px-4 text-sm font-medium text-primary-600">{subject.subject_code}</td>
                    <td className="py-3 px-4 text-sm">{subject.subject_name}</td>
                    <td className="py-3 px-4 text-sm">{subject.credit}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        subject.grade === 'A+' ? 'bg-green-500 text-white' :
                        subject.grade === 'A' ? 'bg-green-400 text-white' :
                        subject.grade === 'B+' ? 'bg-blue-500 text-white' :
                        subject.grade === 'B' ? 'bg-blue-400 text-white' :
                        subject.grade === 'C' ? 'bg-yellow-400 text-white' :
                        'bg-gray-400 text-white'
                      }`}>
                        {subject.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold">{subject.grade_points}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        subject.result === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subject.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
