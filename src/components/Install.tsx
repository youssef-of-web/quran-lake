import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') console.log('User accepted install');
      else console.log('User dismissed install');
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return isInstallable ? (
    <button
      onClick={handleInstallClick}
      className="appearance-none bg-transparent border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-[6px] 
                   hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   transition-all duration-200 cursor-pointer
                   text-gray-700 dark:text-gray-200 bg-white/10 dark:bg-slate-800/10"
    >
      <div className="flex items-center">
        <span>📲</span>
      </div>
    </button>
  ) : null;
};
