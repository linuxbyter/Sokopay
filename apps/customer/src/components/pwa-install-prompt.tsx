'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (isIOSDevice && !(window.navigator as any).standalone) {
      setTimeout(() => setShow(true), 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-lg mx-auto bg-surface rounded-2xl border border-border shadow-elevated p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary text-sm mb-1">
              Install SökoPay
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              {isIOS
                ? 'Tap the share button and "Add to Home Screen" for the best experience.'
                : 'Add to your home screen for quick access and a better experience.'}
            </p>
            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary-hover transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Install
                </button>
              )}
              <button
                onClick={dismiss}
                className="px-3 py-1.5 text-text-tertiary hover:text-text-secondary text-xs font-medium transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-text-tertiary" />
          </button>
        </div>
      </div>
    </div>
  );
}
