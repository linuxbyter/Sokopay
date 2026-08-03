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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-elevated w-full max-w-md border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">
              {type === 'customer' ? 'Rate Your Experience' : 'Rate This Customer'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          {vendorName && (
            <p className="text-sm text-text-secondary mt-1">{vendorName}</p>
          )}
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-text-secondary mb-4">
              {type === 'customer' 
                ? 'How was your experience with this vendor?' 
                : 'How was this customer?'}
            </p>
            
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
                        ? 'fill-copper-400 text-copper-400'
                        : 'text-text-tertiary'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-text-secondary mt-2">
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
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
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-surface-hover text-text-secondary rounded-lg font-medium hover:bg-surface transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
