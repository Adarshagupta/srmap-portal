'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { hostelAPI } from '@/lib/api';
import { Building, BedDouble, MapPin, Users } from 'lucide-react';

export default function HostelPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching hostel data...');
        const result = await hostelAPI.getRoomDetails(user.sessionId);
        console.log('Hostel API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching hostel data:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Hostel Details</h1>
        <p className="text-gray-600 mt-1">Your hostel and room information</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Hostel Accommodation</p>
            <p className="text-2xl font-bold mt-1">Room Details</p>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Building className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hostel Name</p>
              <p className="font-semibold text-gray-900">Check Details Below</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BedDouble className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Room Number</p>
              <p className="font-semibold text-gray-900">Check Details Below</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Room Type</p>
              <p className="font-semibold text-gray-900">Check Details Below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hostel Details */}
      {data?.html && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Complete Hostel Information
          </h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data?.html && !loading && (
        <div className="card text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Hostel Data Found</h3>
          <p className="text-gray-500">
            {!data ? 'Failed to load hostel details. Please try again.' : 
             'You may not be assigned to a hostel or hostel data is not available.'}
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <Building className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Hostel Guidelines</h3>
            <p className="text-sm text-blue-700 mt-1">
              Please follow all hostel rules and regulations. For any issues or room changes, 
              contact the hostel warden or administration office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
