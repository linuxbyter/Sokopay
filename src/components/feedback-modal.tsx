'use client';

import { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
  type: 'customer' | 'vendor';
  vendorName?: string;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, type, vendorName }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    await onSubmit({ rating, comment });
    setSubmitting(false);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">
              {type === 'customer' ? 'Rate Your Experience' : 'Rate This Customer'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
          {vendorName && (
            <p className="text-sm text-neutral-500 mt-1">{vendorName}</p>
          )}
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-neutral-600 mb-4">
              {type === 'customer' 
                ? 'How was your experience with this vendor?' 
                : 'How was this customer?'}
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                type === 'customer'
                  ? 'Tell us about your experience...'
                  : 'Any notes about this transaction...'
              }
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-neutral-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-800 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
