'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { LogIn, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuth, isAuthenticated } = useAuthStore();
  
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const loadCaptcha = async () => {
    try {
      setError('');
      const { image, sessionId: newSessionId } = await authAPI.getCaptcha();
      const imageUrl = URL.createObjectURL(image);
      setCaptchaImage(imageUrl);
      setSessionId(newSessionId);
      setFormData(prev => ({ ...prev, captcha: '' }));
      console.log('Captcha loaded, session ID:', newSessionId);
    } catch (err: any) {
      console.error('Captcha load error:', err);
      setError('Failed to load captcha. Please refresh the page.');
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== Login Form Submit ===');
    console.log('Form data:', { username: formData.username, captcha: formData.captcha });
    console.log('Session ID:', sessionId);

    // Validate session ID exists
    if (!sessionId) {
      console.error('No session ID available');
      setError('Session expired. Please refresh the captcha.');
      setLoading(false);
      await loadCaptcha();
      return;
    }

    try {
      console.log('Calling authAPI.login...');
      const result = await authAPI.login({
        username: formData.username,
        password: formData.password,
        captcha: formData.captcha.toUpperCase(),
        session_id: sessionId,
      });

      console.log('Login API response:', result);

      if (result.success) {
        console.log('Login successful, redirecting to dashboard...');
        setAuth(formData.username, sessionId);
        router.push('/dashboard');
      } else {
        console.warn('Login failed:', result.message);
        setError(result.message || 'Login failed. Please check your credentials.');
        await loadCaptcha();
      }
    } catch (err: any) {
      console.error('Login error (full):', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      const errorMsg = err.response?.data?.detail || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      await loadCaptcha();
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full mb-4">
            <LogIn className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SRMAP Student Portal</h1>
          <p className="text-primary-100">SRM University AP - Andhra Pradesh</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Login</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number / Application Number
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
                placeholder="e.g., AP24110012177"
                required
                maxLength={13}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Captcha
              </label>
              <div className="flex gap-3 items-end">
                <div className="flex-shrink-0">
                  {captchaImage ? (
                    <img
                      src={captchaImage}
                      alt="Captcha"
                      className="h-16 w-40 object-contain border-2 border-gray-300 rounded-lg bg-white"
                    />
                  ) : (
                    <div className="h-16 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={loadCaptcha}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh captcha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={formData.captcha}
                  onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                  className="input flex-1"
                  placeholder="Enter captcha (5 chars)"
                  required
                  maxLength={5}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                console.log('Login button clicked!');
                console.log('Loading state:', loading);
                console.log('Form will submit...');
              }}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>First time login? Use your date of birth (DDMMYYYY) as password</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-primary-100 text-sm">
          <p>For technical support: itkm.helpdesk@srmap.edu.in</p>
        </div>
      </div>
    </div>
  );
}
