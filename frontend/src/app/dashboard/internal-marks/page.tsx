'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { FileText, BookOpen, TrendingUp } from 'lucide-react';

export default function InternalMarksPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching internal marks data...');
        const result = await studentAPI.getInternalMarks(user.sessionId);
        console.log('Internal marks API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching internal marks:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Internal Assessment Marks</h1>
        <p className="text-gray-600 mt-1">View your internal assessment scores</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Internal Assessment</p>
            <p className="text-2xl font-bold mt-1">Current Semester Marks</p>
          </div>
        </div>
      </div>

      {/* Internal Marks Data */}
      {data?.html && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assessment Details
          </h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data?.html && !loading && (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Internal Marks Data Found</h3>
          <p className="text-gray-500">Failed to load internal marks. Please try again.</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">About Internal Assessments</h3>
            <p className="text-sm text-blue-700 mt-1">
              Internal assessments include quizzes, assignments, mid-term exams, and class participation. 
              These marks contribute to your overall semester grade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
