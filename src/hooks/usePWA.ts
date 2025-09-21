// [AI]
import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [serviceWorkerRegistration, setServiceWorkerRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    if (typeof window === "undefined") return false;

    // Check if running in standalone mode
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    return isStandalone || isIOSStandalone;
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered successfully:", registration);
      setServiceWorkerRegistration(registration);

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available
              console.log("New version available");
              // You could show a notification here
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("PWA installation accepted");
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log("PWA installation dismissed");
        return false;
      }
    } catch (error) {
      console.error("PWA installation failed:", error);
      return false;
    }
  }, [deferredPrompt]);

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if (!serviceWorkerRegistration) return;

    try {
      await serviceWorkerRegistration.update();
      console.log("Service Worker updated successfully");
    } catch (error) {
      console.error("Service Worker update failed:", error);
    }
  }, [serviceWorkerRegistration]);

  // Skip waiting and activate new service worker
  const skipWaiting = useCallback(() => {
    if (!serviceWorkerRegistration?.waiting) return;

    serviceWorkerRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
  }, [serviceWorkerRegistration]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed
    setIsInstalled(checkIfInstalled());

    // Register service worker
    registerServiceWorker();

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsInstallable(true);
      console.log("PWA install prompt available");
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log("PWA installed successfully");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      console.log("App is online");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("App is offline");
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [registerServiceWorker, checkIfInstalled]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    serviceWorkerRegistration,
    installPWA,
    updateServiceWorker,
    skipWaiting,
  };
}
// [/AI]
