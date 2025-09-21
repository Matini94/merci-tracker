// [AI]
import {
  FormValidationError,
  ValidationResult,
  IncomeFormData,
} from "@/types/database";

export function validateIncomeForm(data: IncomeFormData): ValidationResult {
  const errors: FormValidationError[] = [];

  // Date validation
  if (!data.date) {
    errors.push({ field: "date", message: "Date is required" });
  } else {
    const date = new Date(data.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (isNaN(date.getTime())) {
      errors.push({ field: "date", message: "Invalid date format" });
    } else if (date > today) {
      errors.push({ field: "date", message: "Date cannot be in the future" });
    }
  }

  // Amount validation
  if (!data.amount) {
    errors.push({ field: "amount", message: "Amount is required" });
  } else {
    const amount = Number(data.amount);
    if (isNaN(amount)) {
      errors.push({
        field: "amount",
        message: "Amount must be a valid number",
      });
    } else if (amount < 0) {
      errors.push({ field: "amount", message: "Amount cannot be negative" });
    } else if (amount > 999999.99) {
      errors.push({
        field: "amount",
        message: "Amount is too large (max: 999,999.99)",
      });
    }
  }

  // Notes validation (optional but length check)
  if (data.notes && data.notes.length > 500) {
    errors.push({
      field: "notes",
      message: "Notes must be less than 500 characters",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}
// [/AI]
