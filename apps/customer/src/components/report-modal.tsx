'use client';

import { useState } from 'react';
import { X, Flag, CheckCircle } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-md border border-border shadow-elevated">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" />
            <h3 className="font-bold text-text-primary">
              Report {reportedType === 'vendor' ? 'Vendor' : 'Customer'}
            </h3>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
            <h4 className="font-bold text-text-primary mb-2">Report submitted</h4>
            <p className="text-sm text-text-secondary mb-5">
              Thank you. We review all reports within 24 hours and take action on confirmed violations.
            </p>
            <button onClick={handleClose} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-sm text-text-secondary">
              Reporting <span className="font-semibold text-text-primary">{reportedName}</span>. What happened?
            </p>

            <div className="space-y-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    reason === r
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : 'border-border hover:border-border-strong text-text-secondary'
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
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:border-destructive focus:outline-none resize-none"
            />

            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-3 border border-border text-text-secondary rounded-xl text-sm font-semibold hover:bg-surface-hover transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || submitting}
                className="flex-1 py-3 bg-destructive text-white rounded-xl text-sm font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
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
