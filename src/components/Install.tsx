import { useEffect, useState } from 'react';

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = (window.navigator as any).standalone === true;

    setIsIOS(isIosDevice);
    setIsInStandaloneMode(isStandalone);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
                   hover:border-primary dark:hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                   transition-all duration-200 cursor-pointer
                   text-gray-700 dark:text-gray-200 bg-white/10 dark:bg-slate-800/10"
    >
      <div className="flex items-center">
        <span>📲</span>
      </div>
    </button>
  ) : null;
};
