"use client";

import { useState } from "react";
import { IncomeEntry } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/validation";
import * as Papa from "papaparse";
import jsPDF from "jspdf";
import { Loader2, Download } from "lucide-react";
import "jspdf-autotable";

// [AI]
// Extend jsPDF type to include autoTable and lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface ExportDataProps {
  entries: IncomeEntry[];
  analyticsData: {
    totalIncome: number;
    averageDaily: number;
    highestDay: number;
    entriesCount: number;
    monthlyTotals: { month: string; total: number }[];
    dailyTrends: { date: string; amount: number }[];
    weekdayAverages: { day: string; average: number }[];
  };
  dateRange: { start: string; end: string };
}

interface ExportOptions {
  includeNotes: boolean;
  includeAnalytics: boolean;
  format: "csv" | "json" | "pdf";
}

export default function ExportData({
  entries,
  analyticsData,
  dateRange,
}: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeNotes: true,
    includeAnalytics: true,
    format: "csv",
  });

  const generateCSV = () => {
    const data = entries.map((entry) => ({
      Date: formatDate(entry.date),
      Amount: entry.amount,
      "Amount (Formatted)": formatCurrency(entry.amount),
      ...(exportOptions.includeNotes && { Notes: entry.notes || "" }),
      "Created At": new Date(entry.created_at).toLocaleString(),
    }));

    if (exportOptions.includeAnalytics) {
      // Add analytics summary as additional rows
      const analyticsRows = [
        {},
        {
          Date: "=== ANALYTICS SUMMARY ===",
          Amount: "",
          "Amount (Formatted)": "",
        },
        {
          Date: "Total Income",
          Amount: analyticsData.totalIncome,
          "Amount (Formatted)": formatCurrency(analyticsData.totalIncome),
        },
        {
          Date: "Daily Average",
          Amount: analyticsData.averageDaily,
          "Amount (Formatted)": formatCurrency(analyticsData.averageDaily),
        },
        {
          Date: "Highest Day",
          Amount: analyticsData.highestDay,
          "Amount (Formatted)": formatCurrency(analyticsData.highestDay),
        },
        {
          Date: "Total Entries",
          Amount: analyticsData.entriesCount,
          "Amount (Formatted)": analyticsData.entriesCount.toString(),
        },
        {},
        {
          Date: "=== MONTHLY TOTALS ===",
          Amount: "",
          "Amount (Formatted)": "",
        },
        ...analyticsData.monthlyTotals.map((item) => ({
          Date: item.month,
          Amount: item.total,
          "Amount (Formatted)": formatCurrency(item.total),
        })),
      ];
      data.push(...(analyticsRows as any));
    }

    const csv = Papa.unparse(data);
    return csv;
  };

  const generateJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        dateRange,
        totalEntries: entries.length,
      },
      entries: entries.map((entry) => ({
        id: entry.id,
        date: entry.date,
        amount: entry.amount,
        ...(exportOptions.includeNotes && { notes: entry.notes }),
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      })),
      ...(exportOptions.includeAnalytics && {
        analytics: {
          summary: {
            totalIncome: analyticsData.totalIncome,
            averageDaily: analyticsData.averageDaily,
            highestDay: analyticsData.highestDay,
            entriesCount: analyticsData.entriesCount,
          },
          monthlyTotals: analyticsData.monthlyTotals,
          weekdayAverages: analyticsData.weekdayAverages,
        },
      }),
    };

    return JSON.stringify(exportData, null, 2);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Income Report", 20, 20);

    // Date range
    doc.setFontSize(12);
    doc.text(
      `Report Period: ${formatDate(dateRange.start)} - ${formatDate(
        dateRange.end
      )}`,
      20,
      30
    );
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 38);

    let yPosition = 50;

    // Analytics summary
    if (exportOptions.includeAnalytics) {
      doc.setFontSize(16);
      doc.text("Summary Statistics", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      const summaryData = [
        ["Total Income", formatCurrency(analyticsData.totalIncome)],
        ["Daily Average", formatCurrency(analyticsData.averageDaily)],
        ["Highest Day", formatCurrency(analyticsData.highestDay)],
        ["Total Entries", analyticsData.entriesCount.toString()],
      ];

      doc.autoTable({
        startY: yPosition,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Monthly totals
      if (analyticsData.monthlyTotals.length > 0) {
        doc.setFontSize(16);
        doc.text("Monthly Breakdown", 20, yPosition);
        yPosition += 10;

        const monthlyData = analyticsData.monthlyTotals.map((item) => [
          item.month,
          formatCurrency(item.total),
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Month", "Total"]],
          body: monthlyData,
          theme: "striped",
          headStyles: { fillColor: [16, 185, 129] },
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }
    }

    // Income entries table
    if (entries.length > 0) {
      doc.setFontSize(16);
      doc.text("Income Entries", 20, yPosition);
      yPosition += 10;

      const tableData = entries.map((entry) => [
        formatDate(entry.date),
        formatCurrency(entry.amount),
        ...(exportOptions.includeNotes ? [entry.notes || "-"] : []),
      ]);

      const columns = [
        "Date",
        "Amount",
        ...(exportOptions.includeNotes ? ["Notes"] : []),
      ];

      doc.autoTable({
        startY: yPosition,
        head: [columns],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 30 }, // Date
          1: { cellWidth: 25 }, // Amount
          ...(exportOptions.includeNotes && { 2: { cellWidth: "auto" } }), // Notes
        },
      });
    }

    return doc;
  };

  const downloadFile = (
    content: string | jsPDF,
    filename: string,
    mimeType: string
  ) => {
    if (content instanceof jsPDF) {
      content.save(filename);
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const datePrefix = `income-report-${dateRange.start}-to-${dateRange.end}`;

      switch (exportOptions.format) {
        case "csv":
          const csv = generateCSV();
          downloadFile(csv, `${datePrefix}.csv`, "text/csv");
          break;

        case "json":
          const json = generateJSON();
          downloadFile(json, `${datePrefix}.json`, "application/json");
          break;

        case "pdf":
          const pdf = generatePDF();
          downloadFile(pdf, `${datePrefix}.pdf`, "application/pdf");
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800/50">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Export Format
        </label>
        <div className="flex flex-wrap gap-4">
          {(["csv", "json", "pdf"] as const).map((format) => (
            <label key={format} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="format"
                value={format}
                checked={exportOptions.format === format}
                onChange={(e) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    format: e.target.value as any,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
                {format}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Export Options
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportOptions.includeNotes}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeNotes: e.target.checked,
                }))
              }
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Include Notes
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={exportOptions.includeAnalytics}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeAnalytics: e.target.checked,
                }))
              }
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Include Analytics Summary
            </span>
          </label>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting || entries.length === 0}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
          isExporting || entries.length === 0
            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export Data ({entries.length} entries)
          </>
        )}
      </button>

      {/* Export Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• CSV: Spreadsheet format for Excel/Google Sheets</p>
        <p>• JSON: Structured data format for technical use</p>
        <p>• PDF: Formatted report for printing/sharing</p>
      </div>
    </div>
  );
}
// [/AI]
