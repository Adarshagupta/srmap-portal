'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { studentAPI } from '@/lib/api';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching profile data...');
        const result = await studentAPI.getProfile(user.sessionId);
        console.log('Profile API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching profile:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mt-1">Your personal and academic information</p>
      </div>

      {/* Profile Header Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-6 rounded-full">
            <User className="w-16 h-16" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{user?.username || 'Student'}</h2>
            <p className="text-white/80 mt-1">SRM University AP - Student Portal</p>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <ProfileField icon={User} label="Roll Number" value={user?.username || 'N/A'} />
            <ProfileField icon={Mail} label="Email" value="Check portal for email" />
            <ProfileField icon={Phone} label="Phone" value="Check portal for phone" />
            <ProfileField icon={Calendar} label="Date of Birth" value="Check portal for DOB" />
            <ProfileField icon={MapPin} label="Address" value="Check portal for address" />
          </div>
        </div>

        {/* Academic Information */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            Academic Information
          </h3>
          <div className="space-y-3">
            <ProfileField icon={Award} label="Program" value="Check portal for program" />
            <ProfileField icon={BookOpen} label="Department" value="Check portal for department" />
            <ProfileField icon={Calendar} label="Batch" value="Check portal for batch" />
            <ProfileField icon={Award} label="Section" value="Check portal for section" />
          </div>
        </div>
      </div>

      {/* HTML Data Display */}
      {data?.html && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Complete Profile Data</h3>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data && !loading && (
        <div className="card text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Profile Data Found</h3>
          <p className="text-gray-500">Failed to load profile data. Please try again.</p>
        </div>
      )}
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}
