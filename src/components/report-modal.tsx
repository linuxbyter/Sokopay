'use client';

import { useState } from 'react';
import { X, Flag } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedId: string;
  reportedType: 'vendor' | 'customer';
  reportedName: string;
  referenceId?: string;
}

const REASONS = [
  'Fraud or scam',
  'Fake shop or profile',
  'Harassment or threatening behaviour',
  'Did not deliver goods/service',
  'Requested payment then disappeared',
  'Inappropriate content or photos',
  'Other',
];

export default function ReportModal({
  isOpen, onClose, reportedId, reportedType, reportedName, referenceId
}: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reported_id: reportedId, reported_type: reportedType, reason, notes, reference_id: referenceId }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setNotes('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-neutral-900">
              Report {reportedType === 'vendor' ? 'Vendor' : 'Customer'}
            </h3>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h4 className="font-bold text-neutral-900 mb-2">Report submitted</h4>
            <p className="text-sm text-neutral-500 mb-5">
              Thank you. We review all reports within 24 hours and take action on confirmed violations.
            </p>
            <button onClick={handleClose} className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-sm text-neutral-600">
              Reporting <span className="font-semibold text-neutral-900">{reportedName}</span>. What happened?
            </p>

            <div className="space-y-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    reason === r
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details (optional)..."
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
            />

            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-3 border border-neutral-200 text-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || submitting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
