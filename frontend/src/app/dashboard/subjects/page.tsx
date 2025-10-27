'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function SubjectsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching subjects data...');
        const result = await studentAPI.getSubjects(user.sessionId);
        console.log('Subjects API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching subjects:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Registered Subjects</h1>
        <p className="text-gray-600 mt-1">Current semester course registration</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Total Registered Subjects</p>
            <p className="text-3xl font-bold mt-1">{data?.subjects?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      {data?.subjects && data.subjects.length > 0 ? (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Subject Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject Name</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((subject: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 text-sm font-medium text-primary-600">{subject.code}</td>
                    <td className="py-3 px-4 text-sm">{subject.name}</td>
                    <td className="py-3 px-4 text-sm text-center font-medium">{subject.credits || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {subject.type || 'Theory'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* HTML Data Display */}
      {data?.html && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Complete Subject Details</h3>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data?.html && !loading && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Subjects Data Found</h3>
          <p className="text-gray-500">Failed to load subjects data. Please try again.</p>
        </div>
      )}
    </div>
  );
}
