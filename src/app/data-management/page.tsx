"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import ImportData from "@/components/analytics/ImportData";
import ExportData from "@/components/analytics/ExportData";
import BackupData from "@/components/analytics/BackupData";
import { useIncome } from "@/hooks/useIncome";
import {
  CloudDownload,
  Download,
  CloudCheck,
  Database,
  FileText,
  Check,
  X,
  Info,
} from "lucide-react";

// [AI]
type ActiveTab = "import" | "export" | "backup";

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("import");
  const [notifications, setNotifications] = useState<
    {
      type: "success" | "error" | "info";
      message: string;
      timestamp: number;
    }[]
  >([]);
  const { entries } = useIncome();

  const addNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    const notification = {
      type,
      message,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [...prev.slice(-4), notification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.timestamp !== notification.timestamp)
      );
    }, 5000);
  };

  const handleImportComplete = (imported: number, errors: number) => {
    if (imported > 0) {
      addNotification(
        "success",
        `Successfully imported ${imported} entries${
          errors > 0 ? ` (${errors} errors)` : ""
        }`
      );
    } else {
      addNotification(
        "error",
        `Import failed${errors > 0 ? ` with ${errors} errors` : ""}`
      );
    }
  };

  const handleBackupComplete = (success: boolean, message: string) => {
    addNotification(success ? "success" : "error", message);
  };

  const tabs = [
    {
      id: "import" as const,
      label: "Import Data",
      icon: <CloudDownload className="w-5 h-5" />,
    },
    {
      id: "export" as const,
      label: "Export Data",
      icon: <Download className="w-5 h-5" />,
    },
    {
      id: "backup" as const,
      label: "Backup & Manage",
      icon: <CloudCheck className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative px-4 sm:px-8 py-6 sm:py-8 lg:py-12 text-center">
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-purple-200">
              Data Management
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-0">
            Import, export, and manage your income data with powerful tools for
            backup, validation, and data integrity
          </p>
          {entries.length > 0 && (
            <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/50 dark:bg-slate-800/50 rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-300 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{entries.length}</span> entries
              available
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.timestamp}
              className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-lg border ${
                notification.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                  : notification.type === "error"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
              }`}
            >
              {notification.type === "success" && (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              )}
              {notification.type === "error" && (
                <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              )}
              {notification.type === "info" && (
                <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {notification.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg">
        <div className="flex border-b border-gray-200/50 dark:border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-slate-700/30"
              }`}
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                {tab.icon}
              </span>
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden hidden sm:inline text-xs sm:text-sm">
                {tab.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "import" && (
            <ImportData onImportComplete={handleImportComplete} />
          )}

          {activeTab === "export" && (
            <ExportData
              entries={entries}
              analyticsData={{
                totalIncome: entries.reduce(
                  (sum, entry) => sum + Number(entry.amount || 0),
                  0
                ),
                averageDaily:
                  entries.length > 0
                    ? entries.reduce(
                        (sum, entry) => sum + Number(entry.amount || 0),
                        0
                      ) / entries.length
                    : 0,
                highestDay: Math.max(
                  ...entries.map((e) => Number(e.amount || 0)),
                  0
                ),
                entriesCount: entries.length,
                monthlyTotals: [],
                dailyTrends: [],
                weekdayAverages: [],
              }}
              dateRange={{
                start:
                  entries.length > 0
                    ? Math.min(
                        ...entries.map((e) => new Date(e.date).getTime())
                      )
                        .toString()
                        .split("T")[0] || new Date().toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                end: new Date().toISOString().split("T")[0],
              }}
            />
          )}

          {activeTab === "backup" && (
            <BackupData onBackupComplete={handleBackupComplete} />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 text-center">
          <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl inline-block mb-3 sm:mb-4">
            <CloudDownload className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Import Data
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
            Upload CSV files to bulk import your income entries with validation
          </p>
          <button
            onClick={() => setActiveTab("import")}
            className="text-green-600 dark:text-green-400 font-medium hover:underline text-sm sm:text-base"
          >
            Get Started →
          </button>
        </Card>

        <Card className="p-4 sm:p-6 text-center">
          <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl inline-block mb-3 sm:mb-4">
            <Download className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Export Data
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
            Download your data in CSV, JSON, or PDF format with analytics
          </p>
          <button
            onClick={() => setActiveTab("export")}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm sm:text-base"
          >
            Export Now →
          </button>
        </Card>

        <Card className="p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
          <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl inline-block mb-3 sm:mb-4">
            <CloudCheck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Backup & Manage
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
            Create backups, verify data integrity, and manage your data
          </p>
          <button
            onClick={() => setActiveTab("backup")}
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline text-sm sm:text-base"
          >
            Backup Data →
          </button>
        </Card>
      </div>
    </div>
  );
}
// [/AI]
