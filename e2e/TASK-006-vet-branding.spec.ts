import { test, expect } from "@playwright/test";

/**
 * E2E tests for Vet CRM veterinary branding.
 *
 * Covers:
 * - Document title is "Vet CRM" on first load
 * - The page background reflects the sage-green primary brand palette
 *   (CSS custom property --primary is set to the veterinary sage green)
 */
test.describe("Vet CRM branding", () => {
  test("document title is Vet CRM on first load", async ({ page }) => {
    await page.goto("http://localhost:5175/");

    await expect(page).toHaveTitle(/Vet CRM/);
  });

  test("primary brand color token is applied to the document root", async ({
    page,
  }) => {
    await page.goto("http://localhost:5175/");

    // The CSS variable --primary must reflect the sage-green palette.
    // OKLCH(0.66 0.12 160) is the tokenized form of #4CAF7D.
    // We check the raw CSS variable value rather than a computed pixel color
    // so the assertion is theme-mode-independent.
    const primaryValue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
    });

    // The value should contain both the chroma (0.12) and hue (160) components
    // that uniquely identify the sage-green primary token.
    expect(primaryValue).toMatch(/0\.12/);
    expect(primaryValue).toMatch(/160/);
  });
});
