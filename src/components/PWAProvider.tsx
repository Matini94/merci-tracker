// [AI]
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Smartphone, AlertTriangle } from "lucide-react";

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installPWA: () => Promise<boolean>;
  updateServiceWorker: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | null>(null);

export function usePWAContext() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWAContext must be used within a PWAProvider");
  }
  return context;
}

interface PWAProviderProps {
  children: React.ReactNode;
}

export default function PWAProvider({ children }: PWAProviderProps) {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    installPWA,
    updateServiceWorker,
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);

  // Show install prompt after delay if app is installable
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000); // Show after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  // Show offline notice when going offline
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotice(true);
      const timer = setTimeout(() => {
        setShowOfflineNotice(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowInstallPrompt(false);
    }
  };

  const contextValue: PWAContextType = {
    isInstallable,
    isInstalled,
    isOnline,
    installPWA,
    updateServiceWorker,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Install Merci Tracker</h3>
                <p className="text-sm text-blue-100 mt-1">
                  Add to home screen for quick access
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-blue-100 hover:text-white text-sm"
                >
                  Later
                </button>
                <button
                  onClick={handleInstall}
                  className="bg-white text-blue-600 px-3 py-1 rounded font-medium text-sm hover:bg-blue-50 transition-colors"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm">
          <div className="bg-orange-500 text-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">
                You're offline. Some features may be limited.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Online Status Indicator */}
      <div
        className={`fixed bottom-4 right-4 z-40 transition-opacity ${
          isOnline ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="bg-gray-800 text-white p-2 rounded-full shadow-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </PWAContext.Provider>
  );
}
// [/AI]
