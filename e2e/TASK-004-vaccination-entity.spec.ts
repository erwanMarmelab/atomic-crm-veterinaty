import { test, expect } from "./fixtures";

/**
 * E2E tests for the Vaccination entity in the veterinary CRM.
 *
 * Covers:
 * - Creating a vaccination from an animal's show page
 * - Seeing the computed expiry date in the vaccination list on the animal show page
 * - Expiry status badge visible (expired / expiring soon / valid)
 */
test.describe("Vaccination entity", () => {
  test.beforeEach(
    async ({ createSales, createContact, createAnimal }) => {
      const sales = await createSales({
        first_name: "Dr",
        last_name: "Vet",
        email: "dr.vet@vetclinic.com",
        password: "password",
      });

      const contact = await createContact({
        first_name: "Alice",
        last_name: "Owner",
        title: "Pet owner",
        sales_id: sales.id,
      });

      await createAnimal({
        name: "Buddy",
        species: "Dog",
        owner_id: contact.id,
      });
    },
  );

  test("can create a vaccination from the animal show page and see the computed expiry", async ({
    page,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.vet@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Navigate to the animal show page
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Buddy").first().click();
    await page.waitForLoadState("networkidle");

    // Use the "Add vaccination" link in the aside panel
    await page.getByRole("link", { name: /add vaccination/i }).click();
    await page.waitForLoadState("networkidle");

    // Fill in the vaccination form
    await page.getByLabel("Vaccine name").fill("Rabies");
    await page.getByLabel("Administered on").fill("2025-01-15");
    await page.getByLabel("Validity (months)").fill("12");

    // Save
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForLoadState("networkidle");

    // Should redirect to the vaccination show page
    await expect(page.getByText("Rabies")).toBeVisible();
    // The computed expiry date should be visible (Jan 2026 = 12 months after Jan 2025)
    await expect(page.getByText(/2026/)).toBeVisible();
  });

  test("vaccination appears in the animal show page with expiry status", async ({
    page,
    createAnimal,
    createVaccination,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.vet@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Navigate to the animal show page
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Buddy").first().click();
    await page.waitForLoadState("networkidle");

    // Create a vaccination via the add link
    await page.getByRole("link", { name: /add vaccination/i }).click();
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Vaccine name").fill("Distemper");
    await page.getByLabel("Administered on").fill("2024-01-01");
    await page.getByLabel("Validity (months)").fill("24");

    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForLoadState("networkidle");

    // Navigate back to the animal show page
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Buddy").first().click();
    await page.waitForLoadState("networkidle");

    // The vaccination should appear in the aside panel
    await expect(page.getByText("Distemper")).toBeVisible();

    // An expiry status badge should be visible
    const statusTexts = ["Valid", "Expiring soon", "Expired"];
    let statusFound = false;
    for (const statusText of statusTexts) {
      const elements = page.getByText(statusText);
      const count = await elements.count();
      if (count > 0) {
        statusFound = true;
        break;
      }
    }
    expect(statusFound).toBe(true);
  });

  test("vaccinations list page loads", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.vet@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.goto("http://localhost:5175/vaccinations");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/vaccinations/);
  });
});
