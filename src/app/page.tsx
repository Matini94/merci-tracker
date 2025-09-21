import Link from "next/link";
import {
  Plus,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Smartphone,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative px-4 sm:px-8 py-8 sm:py-12 lg:py-16 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 leading-tight">
            Welcome to Merci Tracker
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            Your personal income tracking companion. Monitor your daily
            earnings, analyze trends, and achieve your financial goals with
            beautiful, intuitive tools.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
            <Link
              href="/income/new"
              className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 flex-shrink-0" />
              <span className="truncate">Add Your First Entry</span>
            </Link>

            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-xl sm:rounded-2xl font-semibold shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="truncate">View Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Feature 1 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm card-hover text-center">
            <div className="inline-flex p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Track Daily Income
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Easily log your daily earnings with our intuitive interface. Keep
              accurate records of all your income sources.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm card-hover text-center">
            <div className="inline-flex p-3 sm:p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Beautiful Analytics
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Visualize your income trends with stunning charts and insights.
              Make informed financial decisions.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="group relative sm:col-span-2 lg:col-span-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm card-hover text-center">
            <div className="inline-flex p-3 sm:p-4 bg-green-100 dark:bg-green-900/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Progressive Web App
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Install on your device for offline access. Works seamlessly across
              all your devices and platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
