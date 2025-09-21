// [AI]
import { test, expect } from "@playwright/test";

test.describe("Income Tracking Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");
  });

  test("should navigate from home to dashboard", async ({ page }) => {
    // Check that we're on the home page
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();

    // Click on Dashboard link
    await page.getByRole("link", { name: "Dashboard" }).click();

    // Check that we're on the dashboard
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("should add a new income entry", async ({ page }) => {
    // Navigate to add income page
    await page.getByRole("link", { name: "Add income" }).click();

    // Fill out the form
    await page.getByLabel("Amount (RM)").fill("150.00");
    await page.getByLabel("Notes (optional)").fill("Test income entry");

    // Submit the form
    await page.getByRole("button", { name: "Save Income" }).click();

    // Check for success message
    await expect(
      page.getByText("Income entry saved successfully!")
    ).toBeVisible();

    // Navigate to dashboard to verify the entry was added
    await page.getByRole("link", { name: "Dashboard" }).click();

    // Check that the entry appears in the table
    await expect(page.getByText("150.00")).toBeVisible();
    await expect(page.getByText("Test income entry")).toBeVisible();
  });

  test("should validate form fields", async ({ page }) => {
    // Navigate to add income page
    await page.getByRole("link", { name: "Add income" }).click();

    // Try to submit empty form
    await page.getByRole("button", { name: "Save Income" }).click();

    // Check for validation error
    await expect(page.getByText("Amount is required")).toBeVisible();

    // Fill invalid amount
    await page.getByLabel("Amount (RM)").fill("-50");
    await page.getByRole("button", { name: "Save Income" }).click();

    // Check for validation error
    await expect(page.getByText("Amount cannot be negative")).toBeVisible();
  });

  test("should display loading states", async ({ page }) => {
    // Navigate to dashboard
    await page.getByRole("link", { name: "Dashboard" }).click();

    // Check that loading indicator appears
    await expect(page.getByText("Loading your income data...")).toBeVisible();
  });

  test("should be accessible", async ({ page }) => {
    // Navigate to add income page
    await page.getByRole("link", { name: "Add income" }).click();

    // Check that form fields have proper labels
    await expect(page.getByLabel("Date")).toBeVisible();
    await expect(page.getByLabel("Amount (RM)")).toBeVisible();
    await expect(page.getByLabel("Notes (optional)")).toBeVisible();

    // Check keyboard navigation
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Date")).toBeFocused();
  });

  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to dashboard
    await page.getByRole("link", { name: "Dashboard" }).click();

    // Check that dashboard is responsive
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();

    // Navigate to add income
    await page.getByRole("link", { name: "Add income" }).click();

    // Check that form is mobile-friendly
    await expect(page.getByLabel("Amount (RM)")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save Income" })
    ).toBeVisible();
  });
});
// [/AI]
