// [AI]
import "./globals.css";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/navigation/Navigation";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import OnboardingProvider from "@/components/OnboardingProvider";

export const metadata = {
  title: "Merci Tracker",
  description: "Daily income tracker - Track your daily income with ease",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white"
        suppressHydrationWarning={true}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-primary text-white px-6 py-3 rounded-xl shadow-lg z-50 font-medium btn-hover"
        >
          Skip to main content
        </a>

        <OnboardingProvider>
          {/* Modern Glass Header */}
          <header className="sticky top-0 z-40 glass border-b border-white/20 shadow-lg">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 sm:flex-initial">
                  <div className="min-w-0">
                    <h1 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <Link
                        href="/"
                        className="hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg block"
                        aria-label="Merci Tracker - Go to homepage"
                      >
                        <span className="hidden sm:inline">
                          Merci Pastries & Coffee
                        </span>
                        <span className="sm:hidden">Merci Tracker</span>
                      </Link>
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                      <span className="hidden sm:inline">
                        Daily Income Tracker
                      </span>
                      <span className="sm:hidden">Income Tracker</span>
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-shrink-0">
                  <Navigation />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content with improved spacing */}
          <main
            id="main-content"
            className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-8 pb-safe min-h-screen-safe"
            role="main"
            aria-label="Main content"
          >
            {/* Breadcrumbs with modern styling */}
            <div className="mb-4 sm:mb-8">
              <Breadcrumbs />
            </div>

            {/* Content Container */}
            <div className="space-y-4 sm:space-y-8">
              <ErrorBoundary>{children}</ErrorBoundary>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  © 2025 Merci Tracker. Built with ❤️
                </p>
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full font-medium dark:bg-green-900/30 dark:text-green-400 text-xs">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </OnboardingProvider>
      </body>
    </html>
  );
}
// [/AI]
