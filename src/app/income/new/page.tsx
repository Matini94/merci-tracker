"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useIncome } from "@/hooks/useIncome";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAutoSave } from "@/hooks/useAutoSave";
import { IncomeFormData } from "@/types/database";
import EnhancedFormInput from "@/components/forms/EnhancedFormInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Plus, ArrowLeft, AlertCircle, Check } from "lucide-react";

// Form validation configuration
const validationConfig = {
  date: {
    required: true,
    requiredMessage: "Date is required",
    rules: [
      {
        validator: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          return date >= oneYearAgo && date <= today;
        },
        message: "Date must be within the last year and not in the future",
        trigger: "onBlur" as const,
      },
    ],
  },
  amount: {
    required: true,
    requiredMessage: "Amount is required",
    rules: [
      {
        validator: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num > 0;
        },
        message: "Amount must be a positive number",
        trigger: "onChange" as const,
      },
      {
        validator: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num <= 999999.99;
        },
        message: "Amount cannot exceed RM 999,999.99",
        trigger: "onBlur" as const,
      },
    ],
  },
  notes: {
    rules: [
      {
        validator: (value: string) => !value || value.length <= 500,
        message: "Notes cannot exceed 500 characters",
        trigger: "onChange" as const,
      },
    ],
  },
};

export default function NewIncomePage() {
  const router = useRouter();
  const { addEntry } = useIncome();

  const initialData: IncomeFormData = {
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    notes: "",
  };

  const {
    formData,
    errors,
    isValid,
    hasErrors,
    getFieldError,
    hasFieldError,
    validateForm,
    updateField,
    handleFieldBlur,
    resetForm,
    setIsValidating,
  } = useFormValidation(validationConfig, initialData);

  // Auto-save functionality
  const { hasAutoSavedData, restoreAutoSavedData, clearAutoSave } = useAutoSave(
    {
      key: "income-form-draft",
      data: formData,
      enabled: true,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Handle field changes
  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      updateField(field, value);

      // Clear submit status when user starts typing
      if (submitStatus !== "idle") {
        setSubmitStatus("idle");
        setSubmitMessage("");
      }
    },
    [updateField, submitStatus]
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsValidating(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    // Validate form
    const isFormValid = validateForm();
    setIsValidating(false);

    if (!isFormValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await addEntry({
        date: formData.date,
        amount: Number(formData.amount),
        notes: formData.notes.trim() || null,
      });

      if (success) {
        setSubmitStatus("success");
        setSubmitMessage("Income entry saved successfully!");

        // Clear auto-save data on successful submission
        clearAutoSave();

        // Reset form but keep date
        resetForm({
          date: formData.date,
          amount: "",
          notes: "",
        });

        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setSubmitStatus("error");
        setSubmitMessage("Failed to save income entry. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative px-4 sm:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-gradient-success rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent dark:from-white dark:via-green-200 dark:to-blue-200 leading-tight">
                  Add Income Entry
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-0">
                  Record your daily earnings and track your financial progress
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex-shrink-0 self-start sm:self-center"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 flex-shrink-0" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Form Container */}
      <div className="max-w-2xl mx-auto">
        <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-800 dark:to-slate-900/50"></div>

          <form
            onSubmit={handleSubmit}
            className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
          >
            {/* Form Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Income Details
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Fill in the information below to record your income
              </p>
            </div>

            {/* Enhanced Form Fields */}
            <div className="space-y-4 sm:space-y-6">
              <EnhancedFormInput
                label="Date"
                type="date"
                value={formData.date}
                onChange={(value) => handleFieldChange("date", value)}
                onBlur={() => handleFieldBlur("date")}
                required
                error={getFieldError("date")}
                success={!hasFieldError("date") && formData.date !== ""}
                hint="Select the date when you earned this income"
              />

              <EnhancedFormInput
                label="Amount (RM)"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                max="999999.99"
                value={formData.amount}
                onChange={(value) => handleFieldChange("amount", value)}
                onBlur={() => handleFieldBlur("amount")}
                placeholder="0.00"
                required
                error={getFieldError("amount")}
                success={
                  !hasFieldError("amount") &&
                  formData.amount !== "" &&
                  parseFloat(formData.amount) > 0
                }
                hint="Enter the amount in Malaysian Ringgit"
                icon={<span className="text-sm font-medium">RM</span>}
              />

              {/* Modern Notes Field */}
              <div className="space-y-2">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Notes (optional)
                    </span>
                    <div className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-md text-xs text-gray-500 dark:text-gray-400">
                      Optional
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleFieldChange("notes", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("notes")}
                      className={`w-full rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 bg-gray-50/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 resize-none focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm sm:text-base ${
                        getFieldError("notes")
                          ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 hover:border-gray-300 dark:hover:border-slate-500"
                      }`}
                      placeholder="Add any additional notes about this income entry..."
                      rows={3}
                      maxLength={500}
                      aria-describedby={
                        getFieldError("notes") ? "notes-error" : "notes-hint"
                      }
                      aria-invalid={!!getFieldError("notes")}
                    />
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                      {formData.notes.length}/500
                    </div>
                  </div>
                  {getFieldError("notes") ? (
                    <p
                      id="notes-error"
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {getFieldError("notes")}
                    </p>
                  ) : (
                    <p
                      id="notes-hint"
                      className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                    >
                      Add context, source, or any other details about this
                      income
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Modern Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={isSubmitting || hasErrors}
                className="group relative w-full bg-gradient-primary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:active:scale-100 text-sm sm:text-base"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="text-white" />
                      <span className="hidden sm:inline">
                        Saving Income Entry...
                      </span>
                      <span className="sm:hidden">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
                      <span className="hidden sm:inline">
                        Save Income Entry
                      </span>
                      <span className="sm:hidden">Save Entry</span>
                    </>
                  )}
                </div>
                {!isSubmitting && !hasErrors && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-400/0 via-blue-400/0 to-purple-400/0 group-hover:from-green-400/20 group-hover:via-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
                )}
              </button>
            </div>

            {/* Enhanced Status Messages */}
            {submitStatus === "success" && (
              <div className="relative overflow-hidden bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
                <div className="relative p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-green-900 dark:text-green-100 text-sm sm:text-base">
                        Success!
                      </p>
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                        {submitMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="relative overflow-hidden bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
                <div className="relative p-4 sm:p-6">
                  <ErrorMessage message={submitMessage} />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
