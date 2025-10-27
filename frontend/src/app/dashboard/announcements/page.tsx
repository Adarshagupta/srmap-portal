'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const announcements = [
    {
      id: 1,
      type: 'important',
      title: 'End Semester Examinations',
      message: 'End semester examinations will commence from December 1st, 2025. Exam schedule has been uploaded.',
      date: '2025-10-25',
      icon: AlertCircle,
      color: 'red',
    },
    {
      id: 2,
      type: 'info',
      title: 'Library Hours Extended',
      message: 'Library will remain open until 11 PM during examination period.',
      date: '2025-10-24',
      icon: Info,
      color: 'blue',
    },
    {
      id: 3,
      type: 'success',
      title: 'Scholarship Applications Open',
      message: 'Merit-based scholarship applications are now open. Last date to apply: November 15th, 2025.',
      date: '2025-10-20',
      icon: CheckCircle,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-600 mt-1">Latest updates and notifications</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Latest Updates</p>
            <p className="text-2xl font-bold mt-1">{announcements.length} New Announcements</p>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => {
          const Icon = announcement.icon;
          const colorClasses = {
            red: 'bg-red-50 border-red-200 text-red-800',
            blue: 'bg-blue-50 border-blue-200 text-blue-800',
            green: 'bg-green-50 border-green-200 text-green-800',
          };
          const iconColorClasses = {
            red: 'text-red-600',
            blue: 'text-blue-600',
            green: 'text-green-600',
          };

          return (
            <div
              key={announcement.id}
              className={`card border-l-4 ${colorClasses[announcement.color as keyof typeof colorClasses]}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Icon className={`w-6 h-6 ${iconColorClasses[announcement.color as keyof typeof iconColorClasses]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(announcement.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{announcement.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="card bg-gray-50 border border-gray-200">
        <div className="flex gap-3">
          <Bell className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900">Stay Updated</h3>
            <p className="text-sm text-gray-600 mt-1">
              Check this page regularly for important announcements, notifications, and updates from the university. 
              You can also check the official portal and your university email for detailed communications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
