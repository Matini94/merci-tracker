// [AI]
import { validateIncomeForm, formatCurrency, formatDate } from "../validation";
import { IncomeFormData } from "@/types/database";

describe("validateIncomeForm", () => {
  const validFormData: IncomeFormData = {
    date: "2023-12-01",
    amount: "100.50",
    notes: "Test income",
  };

  test("should validate correct form data", () => {
    const result = validateIncomeForm(validFormData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("should reject empty date", () => {
    const result = validateIncomeForm({ ...validFormData, date: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "date",
      message: "Date is required",
    });
  });

  test("should reject future date", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const result = validateIncomeForm({
      ...validFormData,
      date: futureDate.toISOString().slice(0, 10),
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "date",
      message: "Date cannot be in the future",
    });
  });

  test("should reject empty amount", () => {
    const result = validateIncomeForm({ ...validFormData, amount: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "amount",
      message: "Amount is required",
    });
  });

  test("should reject negative amount", () => {
    const result = validateIncomeForm({ ...validFormData, amount: "-10" });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "amount",
      message: "Amount cannot be negative",
    });
  });

  test("should reject invalid amount", () => {
    const result = validateIncomeForm({ ...validFormData, amount: "abc" });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "amount",
      message: "Amount must be a valid number",
    });
  });

  test("should reject amount over limit", () => {
    const result = validateIncomeForm({ ...validFormData, amount: "1000000" });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "amount",
      message: "Amount is too large (max: 999,999.99)",
    });
  });

  test("should reject notes over 500 characters", () => {
    const longNotes = "a".repeat(501);
    const result = validateIncomeForm({ ...validFormData, notes: longNotes });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "notes",
      message: "Notes must be less than 500 characters",
    });
  });
});

describe("formatCurrency", () => {
  test("should format currency correctly", () => {
    expect(formatCurrency(100)).toBe("RM 100.00");
    expect(formatCurrency(0)).toBe("RM 0.00");
    expect(formatCurrency(999.99)).toBe("RM 999.99");
    expect(formatCurrency(1000.5)).toBe("RM 1000.50");
  });
});

describe("formatDate", () => {
  test("should format date correctly", () => {
    const formatted = formatDate("2023-12-01");
    expect(formatted).toMatch(/Dec/); // Should contain month abbreviation
    expect(formatted).toMatch(/2023/); // Should contain year
    expect(formatted).toMatch(/1/); // Should contain day
  });

  test("should handle invalid date gracefully", () => {
    expect(formatDate("invalid-date")).toBe("Invalid Date");
  });
});
// [/AI]
