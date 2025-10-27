'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { feedbackAPI } from '@/lib/api';
import { MessageSquare, Star, Send, CheckCircle, Zap, Sparkles } from 'lucide-react';

const ratingOptions = [
  { value: 5, label: 'Excellent (5/5)', description: 'Outstanding teaching and course' },
  { value: 4, label: 'Very Good (4/5)', description: 'Good teaching with minor improvements' },
  { value: 3, label: 'Good (3/5)', description: 'Satisfactory but needs improvement' },
  { value: 2, label: 'Fair (2/5)', description: 'Below average, needs attention' },
  { value: 1, label: 'Poor (1/5)', description: 'Significant improvements needed' },
];

const commentTemplates = {
  5: [
    'Excellent teaching methodology and clear explanations.',
    'Very engaging lectures with practical examples.',
    'Great course content and well-organized materials.',
    'Highly interactive and student-friendly approach.',
  ],
  4: [
    'Good teaching with room for minor improvements.',
    'Well-structured course with helpful resources.',
    'Clear explanations and good student interaction.',
    'Effective teaching methods overall.',
  ],
  3: [
    'Satisfactory teaching, could be more engaging.',
    'Course content is okay but needs better organization.',
    'Adequate teaching but can improve communication.',
    'Meets basic requirements with scope for improvement.',
  ],
  2: [
    'Teaching methods need significant improvement.',
    'Course content lacks clarity and organization.',
    'Limited student engagement and interaction.',
    'More practical examples would be helpful.',
  ],
  1: [
    'Requires major improvements in teaching approach.',
    'Course structure and content need complete revision.',
    'Very limited student support and guidance.',
    'Significant changes needed for better learning.',
  ],
};

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [showAutoFill, setShowAutoFill] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedComment, setSelectedComment] = useState('');
  const [customComment, setCustomComment] = useState('');
  const [autoFilling, setAutoFilling] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.sessionId) return;
      
      try {
        console.log('Fetching feedback data...');
        const result = await feedbackAPI.getEndSemesterFeedback(user.sessionId);
        console.log('Feedback API response:', result);
        setData(result);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.sessionId]);

  // Check if form is already filled
  useEffect(() => {
    const checkFormFilled = () => {
      // Check if the HTML contains indicators of filled feedback
      const htmlContent = data?.html || '';
      
      // Look for common indicators in the HTML that feedback is filled
      const hasFilledIndicators = 
        htmlContent.includes('checked') || 
        htmlContent.includes('selected') ||
        htmlContent.includes('Feedback already submitted') ||
        htmlContent.includes('Thank you for your feedback');
      
      // Also check form elements in the DOM
      const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
      const textareas = document.querySelectorAll('textarea');
      
      let hasCheckedRadios = radioButtons.length > 0;
      let hasFilledTextareas = false;
      
      textareas.forEach((textarea: any) => {
        if (textarea.value && textarea.value.trim().length > 10) {
          hasFilledTextareas = true;
        }
      });
      
      setIsFormFilled(hasFilledIndicators || hasCheckedRadios || hasFilledTextareas);
    };

    // Check initially after a delay to let form load
    const timer = setTimeout(checkFormFilled, 1500);
    
    // Check on any form change
    const intervalTimer = setInterval(checkFormFilled, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalTimer);
    };
  }, [data]);

  const autoFillFeedback = () => {
    setAutoFilling(true);
    const comment = customComment || selectedComment;

    // Find all radio buttons and select the rating
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: any) => {
      const value = radio.value;
      // Select ratings based on selected rating (5, 4, 3, etc.)
      if (value === selectedRating.toString() || value === String(selectedRating)) {
        radio.checked = true;
        radio.click();
      }
    });

    // Find all textareas and fill with comment
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea: any) => {
      textarea.value = comment;
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    });

    // Find all text inputs (for comments)
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach((input: any) => {
      if (input.placeholder?.toLowerCase().includes('comment') || 
          input.name?.toLowerCase().includes('comment')) {
        input.value = comment;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
    });

    setTimeout(() => {
      setAutoFilling(false);
      alert('Feedback form auto-filled! Please review before submitting.');
    }, 1000);
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Course Feedback</h1>
        <p className="text-gray-600 mt-1">Provide feedback for your courses</p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-pink-500 to-pink-700 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">End Semester Feedback</p>
            <p className="text-2xl font-bold mt-1">Your Opinion Matters</p>
          </div>
        </div>
      </div>

      {/* Auto-Fill Controls - Only show if form is not filled */}
      {!isFormFilled && (
        <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Auto-Fill Feedback</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAutoFill(!showAutoFill)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                {showAutoFill ? 'Hide Options' : 'Show Options'}
              </button>
              <button
                onClick={() => setIsFormFilled(true)}
                className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors text-sm"
                title="Hide auto-fill panel"
              >
                ✕
              </button>
            </div>
          </div>

          {showAutoFill && (
            <div className="bg-white/10 rounded-lg p-4 space-y-4">
              {/* Rating Selection */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Select Rating to Apply:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ratingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedRating(option.value);
                        setSelectedComment(commentTemplates[option.value as keyof typeof commentTemplates][0]);
                      }}
                      className={`text-left p-3 rounded-lg transition-colors ${
                        selectedRating === option.value
                          ? 'bg-white text-purple-700 font-semibold'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4" fill={selectedRating === option.value ? 'currentColor' : 'none'} />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs opacity-80">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Template Selection */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Select Comment Template:
                </label>
                <div className="space-y-2">
                  {commentTemplates[selectedRating as keyof typeof commentTemplates].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedComment(template)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedComment === template
                          ? 'bg-white text-purple-700 font-medium'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Comment */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Or Write Custom Comment:
                </label>
                <textarea
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Enter your custom feedback comment..."
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  rows={3}
                />
              </div>

              {/* Auto-Fill Button */}
              <button
                onClick={autoFillFeedback}
                disabled={autoFilling || (!selectedComment && !customComment)}
                className="w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {autoFilling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700"></div>
                    Auto-Filling...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Auto-Fill All Fields
                  </>
                )}
              </button>

              <p className="text-white/70 text-xs text-center">
                ⚠️ This will fill all rating fields with {selectedRating}/5 and all comment fields with the selected comment.
                Please review before submitting!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Form Already Filled Notice */}
      {isFormFilled && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Feedback Form Already Filled</h3>
              <p className="text-sm text-green-700 mt-1">
                Your feedback form has already been filled. You can review and modify your responses below if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Rate Courses</h3>
          <p className="text-sm text-gray-600 mt-1">Provide ratings for teaching quality and course content</p>
        </div>

        <div className="card text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Share Comments</h3>
          <p className="text-sm text-gray-600 mt-1">Write detailed feedback and suggestions</p>
        </div>

        <div className="card text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Send className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Submit Feedback</h3>
          <p className="text-sm text-gray-600 mt-1">Review and submit your responses</p>
        </div>
      </div>

      {/* Feedback Form */}
      {data?.html && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Feedback Form
          </h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.html }} className="overflow-x-auto" />
          </div>
        </div>
      )}

      {!data?.html && !loading && (
        <div className="card text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Feedback Period Not Active</h3>
          <p className="text-gray-500">
            The feedback form is currently not available. Feedback collection typically opens before the end of each semester.
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="card bg-purple-50 border border-purple-200">
        <div className="flex gap-3">
          <Star className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900">Why Feedback Matters</h3>
            <p className="text-sm text-purple-700 mt-1">
              Your feedback helps improve the quality of education and teaching methods. 
              Please provide honest and constructive feedback for each course and faculty member.
            </p>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Feedback Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Be honest and objective in your ratings</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Provide specific examples when giving feedback</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Focus on constructive criticism rather than personal attacks</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Submit your feedback before the deadline</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Your responses are anonymous and confidential</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
