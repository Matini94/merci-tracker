"use client";

import { useState, useRef } from "react";
import { useIncome } from "@/hooks/useIncome";
import { IncomeInsert } from "@/types/database";
import { validateIncomeForm } from "@/lib/validation";
import { Upload, File, Loader2, Check, X } from "lucide-react";
import * as Papa from "papaparse";

// [AI]
interface ImportDataProps {
  onImportComplete?: (imported: number, errors: number) => void;
}

interface ImportValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  errors: ImportValidationError[];
  duplicates: number;
}

interface ParsedRow {
  date?: string;
  amount?: string;
  notes?: string;
  [key: string]: any;
}

export default function ImportData({ onImportComplete }: ImportDataProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ParsedRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    ImportValidationError[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEntry, entries } = useIncome();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as ParsedRow[];
        setPreviewData(data.slice(0, 31)); // Show first 10 rows for preview
        setShowPreview(true);
        validateImportData(data);
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        alert("Error parsing CSV file. Please check the file format.");
      },
    });
  };

  const validateImportData = (data: ParsedRow[]) => {
    const errors: ImportValidationError[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 1;

      // Validate date
      if (!row.date && !row.Date) {
        errors.push({
          row: rowNumber,
          field: "date",
          value: row.date || row.Date,
          message: "Date is required",
        });
      } else {
        const dateValue = row.date || row.Date;
        const date = new Date(dateValue!);
        if (isNaN(date.getTime())) {
          errors.push({
            row: rowNumber,
            field: "date",
            value: dateValue,
            message: "Invalid date format. Use YYYY-MM-DD",
          });
        }
      }

      // Validate amount
      if (!row.amount && !row.Amount) {
        errors.push({
          row: rowNumber,
          field: "amount",
          value: row.amount || row.Amount,
          message: "Amount is required",
        });
      } else {
        const amountValue = row.amount || row.Amount;
        const amount = parseFloat(String(amountValue).replace(/[^\d.-]/g, ""));
        if (isNaN(amount) || amount < 0) {
          errors.push({
            row: rowNumber,
            field: "amount",
            value: amountValue,
            message: "Amount must be a positive number",
          });
        }
      }
    });

    setValidationErrors(errors);
  };

  const normalizeRowData = (row: ParsedRow): IncomeInsert => {
    // Handle case-insensitive column names
    const date = row.date || row.Date || row.DATE || "";
    const amount = row.amount || row.Amount || row.AMOUNT || "0";
    const notes =
      row.notes || row.Notes || row.NOTES || row.note || row.Note || "";

    return {
      date: new Date(date).toISOString().split("T")[0],
      amount: parseFloat(String(amount).replace(/[^\d.-]/g, "")),
      notes: String(notes).trim() || null,
    };
  };

  const checkForDuplicates = (importEntries: IncomeInsert[]): number => {
    let duplicateCount = 0;
    const existingEntries = new Set(
      entries.map((entry) => `${entry.date}-${entry.amount}`)
    );

    importEntries.forEach((entry) => {
      const key = `${entry.date}-${entry.amount}`;
      if (existingEntries.has(key)) {
        duplicateCount++;
      }
    });

    return duplicateCount;
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      alert(
        `Please fix ${validationErrors.length} validation errors before importing.`
      );
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const validEntries: IncomeInsert[] = [];
      const errors: ImportValidationError[] = [];

      // Process and validate each row
      previewData.forEach((row, index) => {
        try {
          const normalizedEntry = normalizeRowData(row);

          // Additional validation using existing validation functions
          const validation = validateIncomeForm({
            date: normalizedEntry.date,
            amount: normalizedEntry.amount.toString(),
            notes: normalizedEntry.notes || "",
          });

          if (validation.isValid) {
            validEntries.push(normalizedEntry);
          } else {
            validation.errors.forEach((error) => {
              errors.push({
                row: index + 1,
                field: error.field,
                value: (normalizedEntry as any)[error.field],
                message: error.message,
              });
            });
          }
        } catch (error) {
          errors.push({
            row: index + 1,
            field: "general",
            value: "",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      });

      // Check for duplicates
      const duplicateCount = checkForDuplicates(validEntries);

      // Import valid entries
      let importedCount = 0;
      for (const entry of validEntries) {
        try {
          const success = await addEntry(entry);
          if (success) {
            importedCount++;
          } else {
            errors.push({
              row: validEntries.indexOf(entry) + 1,
              field: "general",
              value: "",
              message: "Failed to save entry to database",
            });
          }
        } catch (error) {
          errors.push({
            row: validEntries.indexOf(entry) + 1,
            field: "general",
            value: "",
            message: error instanceof Error ? error.message : "Database error",
          });
        }
      }

      const result: ImportResult = {
        success: importedCount > 0,
        imported: importedCount,
        errors,
        duplicates: duplicateCount,
      };

      setImportResult(result);
      onImportComplete?.(importedCount, errors.length);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setPreviewData([]);
      setShowPreview(false);
    } catch (error) {
      console.error("Import error:", error);
      alert("Import failed. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    setPreviewData([]);
    setShowPreview(false);
    setValidationErrors([]);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl inline-block mb-4">
          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Import Income Data
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto">
          Upload a CSV file to import your income entries. The file should have
          columns for Date, Amount, and optionally Notes.
        </p>
      </div>

      {!showPreview && !importResult && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <File className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Choose CSV File
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                or drag and drop here
              </span>
            </label>
          </div>

          {/* CSV Format Guide */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              CSV Format Requirements:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>
                Required columns:{" "}
                <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                  Date
                </code>
                ,{" "}
                <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                  Amount
                </code>
              </li>
              <li>
                Optional column:{" "}
                <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">
                  Notes
                </code>
              </li>
              <li>Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
              <li>
                Amount: Positive numbers (currency symbols will be stripped)
              </li>
              <li>First row should contain column headers</li>
            </ul>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Preview ({previewData.length} rows shown)
            </h4>
            {validationErrors.length > 0 && (
              <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                {validationErrors.length} validation errors
              </span>
            )}
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                {previewData.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      validationErrors.some((e) => e.row === index + 1)
                        ? "bg-red-50 dark:bg-red-900/20"
                        : ""
                    }
                  >
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {row.date || row.Date}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {row.amount || row.Amount}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">
                      {row.notes || row.Notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">
                Validation Errors:
              </h5>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {validationErrors.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm text-red-800 dark:text-red-200"
                  >
                    Row {error.row}, {error.field}: {error.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={isImporting || validationErrors.length > 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                isImporting || validationErrors.length > 0
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import Data ({previewData.length -
                    validationErrors.length}{" "}
                  valid entries)
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isImporting}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <div
          className={`border rounded-lg p-4 ${
            importResult.success
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {importResult.success ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <h5
              className={`font-medium ${
                importResult.success
                  ? "text-green-900 dark:text-green-100"
                  : "text-red-900 dark:text-red-100"
              }`}
            >
              Import {importResult.success ? "Completed" : "Failed"}
            </h5>
          </div>

          <div
            className={`text-sm space-y-1 ${
              importResult.success
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            <p>✓ Successfully imported: {importResult.imported} entries</p>
            {importResult.errors.length > 0 && (
              <p>✗ Failed to import: {importResult.errors.length} entries</p>
            )}
            {importResult.duplicates > 0 && (
              <p>
                ⚠ Potential duplicates detected: {importResult.duplicates}{" "}
                entries
              </p>
            )}
          </div>

          {importResult.errors.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium">
                View error details
              </summary>
              <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                {importResult.errors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-xs">
                    Row {error.row}: {error.message}
                  </p>
                ))}
                {importResult.errors.length > 10 && (
                  <p className="text-xs">
                    ...and {importResult.errors.length - 10} more errors
                  </p>
                )}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
// [/AI]
