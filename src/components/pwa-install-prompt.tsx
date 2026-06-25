'use client';

import { useState, useEffect } from 'react';
import { X, Download, Store } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Check if already dismissed this session
    if (sessionStorage.getItem('pwa-prompt-dismissed')) return;

    // iOS detection — Safari shows its own UI, we guide them manually
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    const safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);

    if (ios && safari) {
      // Show iOS instructions after a short delay on second page interaction
      const timer = setTimeout(() => setIsIos(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome — capture the browser's install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      // Show our banner after a small delay so it doesn't pop up on first load
      setTimeout(() => setVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setIsIos(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', '1');
  };

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setPrompt(null);
  };

  // iOS guide banner
  if (isIos && !dismissed) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-neutral-900 text-white rounded-2xl p-4 shadow-elevated flex gap-3 items-start">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
            🏪
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm mb-0.5">Add SökoPay to your home screen</p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tap <span className="text-white font-medium">Share</span> then{' '}
              <span className="text-white font-medium">"Add to Home Screen"</span> for the full app experience.
            </p>
          </div>
          <button onClick={dismiss} className="p-1 text-neutral-400 hover:text-white flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Android / Chrome install banner
  if (visible && prompt && !dismissed) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-neutral-900 text-white rounded-2xl p-4 shadow-elevated flex gap-3 items-center">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
            🏪
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Install SökoPay</p>
            <p className="text-xs text-neutral-400">Works offline, opens instantly</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={install}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button onClick={dismiss} className="p-1 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
