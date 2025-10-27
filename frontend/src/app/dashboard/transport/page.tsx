'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { transportAPI } from '@/lib/api';
import { Bus, MapPin, Calendar, Clock } from 'lucide-react';

export default function TransportPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching transport data...');
        const result = await transportAPI.getRegistration(user.sessionId);
        console.log('Transport API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching transport data:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Transport Details</h1>
        <p className="text-gray-600 mt-1">Your bus route and transport information</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">University Transport</p>
            <p className="text-2xl font-bold mt-1">Bus Route Information</p>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Bus className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bus Number</p>
              <p className="font-semibold text-gray-900">Check Details Below</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-semibold text-gray-900">Check Details Below</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Timing</p>
              <p className="font-semibold text-gray-900">Check Details Below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Details */}
      {data?.html && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Complete Route Information
          </h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data?.html && !loading && (
        <div className="card text-center py-12">
          <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transport Data Found</h3>
          <p className="text-gray-500">
            {!data ? 'Failed to load transport details. Please try again.' : 
             'You may not be registered for university transport or transport data is not available.'}
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-yellow-50 border border-yellow-200">
        <div className="flex gap-3">
          <Bus className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Transport Guidelines</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Please be at your pickup point 5 minutes before the scheduled time. 
              For any transport-related queries or route changes, contact the transport office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
