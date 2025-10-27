'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { financeAPI } from '@/lib/api';
import { DollarSign, CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function FinancePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching finance data...');
        const result = await financeAPI.getFeePaid(user.sessionId);
        console.log('Finance API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching finance data:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Finance & Fee Details</h1>
        <p className="text-gray-600 mt-1">View your fee payment history and dues</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Payment Status</p>
              <p className="text-2xl font-bold mt-2">Check Portal</p>
            </div>
            <CheckCircle className="w-12 h-12 text-white/50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Fee Records</p>
              <p className="text-2xl font-bold mt-2">View Details Below</p>
            </div>
            <CreditCard className="w-12 h-12 text-white/50" />
          </div>
        </div>
      </div>

      {/* Fee Details */}
      {data?.html && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Fee Payment Details
          </h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data?.html && !loading && (
        <div className="card text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Finance Data Found</h3>
          <p className="text-gray-500">Failed to load fee details. Please try again.</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Payment Information</h3>
            <p className="text-sm text-yellow-700 mt-1">
              For any queries regarding fee payment or to make a new payment, please contact the finance office 
              or use the official payment portal provided by the university.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
