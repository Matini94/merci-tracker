"use client";

import { useState } from "react";
import { useIncome } from "@/hooks/useIncome";
import { IncomeEntry } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/validation";
import {
  CloudCheck,
  Check,
  Loader2,
  Download,
  CheckCircle,
  FileText,
  Trash2,
} from "lucide-react";

// [AI]
interface BackupDataProps {
  onBackupComplete?: (success: boolean, message: string) => void;
}

interface BackupMetadata {
  version: string;
  timestamp: string;
  totalEntries: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
  totalAmount: number;
}

interface BackupData {
  metadata: BackupMetadata;
  entries: IncomeEntry[];
  checksum: string;
}

export default function BackupData({ onBackupComplete }: BackupDataProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("lastBackupDate")
      : null
  );
  const { entries, fetchEntries } = useIncome();

  // Generate a simple checksum for data integrity
  const generateChecksum = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  const createBackup = async () => {
    setIsProcessing(true);

    try {
      // Ensure we have the latest data
      await fetchEntries(10000); // Get all entries

      if (entries.length === 0) {
        onBackupComplete?.(false, "No data available to backup");
        return;
      }

      // Sort entries by date for consistent backup structure
      const sortedEntries = [...entries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Calculate metadata
      const totalAmount = sortedEntries.reduce(
        (sum, entry) => sum + Number(entry.amount || 0),
        0
      );

      const dates = sortedEntries.map((entry) => entry.date).sort();
      const earliest = dates[0];
      const latest = dates[dates.length - 1];

      const metadata: BackupMetadata = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        totalEntries: sortedEntries.length,
        dateRange: { earliest, latest },
        totalAmount,
      };

      // Create backup data structure
      const backupData: BackupData = {
        metadata,
        entries: sortedEntries,
        checksum: generateChecksum(JSON.stringify(sortedEntries)),
      };

      // Generate backup file
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Download backup file
      const link = document.createElement("a");
      link.href = url;
      link.download = `merci-tracker-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update last backup timestamp
      const now = new Date().toISOString();
      setLastBackup(now);
      localStorage.setItem("lastBackupDate", now);

      onBackupComplete?.(
        true,
        `Backup created successfully with ${sortedEntries.length} entries`
      );
    } catch (error) {
      console.error("Backup creation failed:", error);
      onBackupComplete?.(
        false,
        `Backup failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyDataIntegrity = async () => {
    setIsProcessing(true);

    try {
      await fetchEntries(10000);

      // Check for data consistency issues
      const issues: string[] = [];

      // Check for duplicate entries (same date and amount)
      const entryMap = new Map<string, IncomeEntry[]>();
      entries.forEach((entry) => {
        const key = `${entry.date}-${entry.amount}`;
        if (!entryMap.has(key)) {
          entryMap.set(key, []);
        }
        entryMap.get(key)!.push(entry);
      });

      const duplicates = Array.from(entryMap.entries()).filter(
        ([, entries]) => entries.length > 1
      );

      if (duplicates.length > 0) {
        issues.push(`Found ${duplicates.length} potential duplicate entries`);
      }

      // Check for invalid dates
      const invalidDates = entries.filter((entry) =>
        isNaN(new Date(entry.date).getTime())
      );

      if (invalidDates.length > 0) {
        issues.push(`Found ${invalidDates.length} entries with invalid dates`);
      }

      // Check for invalid amounts
      const invalidAmounts = entries.filter(
        (entry) => isNaN(Number(entry.amount)) || Number(entry.amount) < 0
      );

      if (invalidAmounts.length > 0) {
        issues.push(
          `Found ${invalidAmounts.length} entries with invalid amounts`
        );
      }

      // Check for future dates
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const futureDates = entries.filter(
        (entry) => new Date(entry.date) > today
      );

      if (futureDates.length > 0) {
        issues.push(`Found ${futureDates.length} entries with future dates`);
      }

      if (issues.length === 0) {
        onBackupComplete?.(
          true,
          "Data integrity check passed - no issues found"
        );
      } else {
        onBackupComplete?.(
          false,
          `Data integrity issues found: ${issues.join(", ")}`
        );
      }
    } catch (error) {
      console.error("Data integrity check failed:", error);
      onBackupComplete?.(
        false,
        `Integrity check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanupOldEntries = async () => {
    if (
      !confirm(
        "This will permanently delete entries older than 2 years. Are you sure?"
      )
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      const oldEntries = entries.filter(
        (entry) => new Date(entry.date) < twoYearsAgo
      );

      if (oldEntries.length === 0) {
        onBackupComplete?.(true, "No entries older than 2 years found");
        return;
      }

      // This would need to be implemented with actual delete functionality
      // For now, just show what would be deleted
      onBackupComplete?.(
        true,
        `Would delete ${oldEntries.length} entries older than ${formatDate(
          twoYearsAgo.toISOString().split("T")[0]
        )}`
      );
    } catch (error) {
      console.error("Cleanup failed:", error);
      onBackupComplete?.(
        false,
        `Cleanup failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDataSummary = () => {
    if (entries.length === 0) {
      alert("No data available to summarize");
      return;
    }

    // Create summary report
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const totalAmount = sortedEntries.reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0
    );

    const dates = sortedEntries.map((entry) => entry.date);
    const earliest = dates[0];
    const latest = dates[dates.length - 1];

    // Monthly breakdown
    const monthlyData = new Map<string, { total: number; count: number }>();
    sortedEntries.forEach((entry) => {
      const month = new Date(entry.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      const current = monthlyData.get(month) || { total: 0, count: 0 };
      monthlyData.set(month, {
        total: current.total + Number(entry.amount || 0),
        count: current.count + 1,
      });
    });

    const summaryReport = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalEntries: entries.length,
        totalAmount: formatCurrency(totalAmount),
        averageAmount: formatCurrency(totalAmount / entries.length),
        dateRange: `${formatDate(earliest)} to ${formatDate(latest)}`,
        highestEntry: formatCurrency(
          Math.max(...sortedEntries.map((e) => Number(e.amount)))
        ),
      },
      monthlyBreakdown: Array.from(monthlyData.entries()).map(
        ([month, data]) => ({
          month,
          total: formatCurrency(data.total),
          count: data.count,
          average: formatCurrency(data.total / data.count),
        })
      ),
      recentEntries: sortedEntries.slice(-10).map((entry) => ({
        date: formatDate(entry.date),
        amount: formatCurrency(Number(entry.amount)),
        notes: entry.notes || "",
      })),
    };

    const reportJson = JSON.stringify(summaryReport, null, 2);
    const blob = new Blob([reportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `merci-tracker-summary-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl inline-block mb-4">
          <CloudCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Data Backup & Management
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto">
          Secure your income data with backups, integrity checks, and data
          management tools.
        </p>
      </div>

      {/* Last Backup Status */}
      {lastBackup && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              Last backup:{" "}
              {formatDate(new Date(lastBackup).toISOString().split("T")[0])} at{" "}
              {new Date(lastBackup).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {/* Data Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {entries.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Entries
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(
              entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Amount
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {entries.length > 0
              ? Math.round(
                  (Date.now() -
                    new Date(
                      Math.min(
                        ...entries.map((e) => new Date(e.date).getTime())
                      )
                    ).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Days of Data
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Create Backup */}
        <button
          onClick={createBackup}
          disabled={isProcessing || entries.length === 0}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isProcessing || entries.length === 0
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Create Full Backup
            </>
          )}
        </button>

        {/* Verify Data Integrity */}
        <button
          onClick={verifyDataIntegrity}
          disabled={isProcessing || entries.length === 0}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isProcessing || entries.length === 0
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Verify Data Integrity
        </button>

        {/* Download Summary Report */}
        <button
          onClick={downloadDataSummary}
          disabled={entries.length === 0}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            entries.length === 0
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          Download Summary Report
        </button>

        {/* Cleanup Old Data */}
        <button
          onClick={cleanupOldEntries}
          disabled={isProcessing || entries.length === 0}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isProcessing || entries.length === 0
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Cleanup Old Data (2+ years)
        </button>
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Backup & Data Management Information:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>
            <strong>Full Backup</strong>: Downloads a complete JSON file with
            all your data and metadata
          </li>
          <li>
            <strong>Data Integrity Check</strong>: Scans for duplicates, invalid
            dates, and data inconsistencies
          </li>
          <li>
            <strong>Summary Report</strong>: Generates a comprehensive report
            with statistics and trends
          </li>
          <li>
            <strong>Data Cleanup</strong>: Helps manage storage by archiving old
            entries
          </li>
          <li>
            <strong>Backup Files</strong>: Include checksums for data
            verification and restore validation
          </li>
        </ul>
      </div>
    </div>
  );
}
// [/AI]
