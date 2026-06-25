import { test, expect } from "./fixtures";

/**
 * E2E tests for the Consultation entity (clinic visit) in the veterinary CRM.
 *
 * Covers:
 * - Creating a consultation from an animal's show page
 * - Seeing the new consultation in the animal's consultation list
 * - Navigating to the consultation show page
 */
test.describe("Consultation entity (clinic visit)", () => {
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
        name: "Fluffy",
        species: "Cat",
        owner_id: contact.id,
      });
    },
  );

  test("can create a consultation from the animal show page", async ({
    page,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.vet@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Navigate to the animal show page
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Fluffy").first().click();
    await page.waitForLoadState("networkidle");

    // Use the "Add consultation" link in the aside panel
    await page.getByRole("link", { name: /add consultation/i }).click();
    await page.waitForLoadState("networkidle");

    // Fill in the consultation form
    const today = new Date().toISOString().substring(0, 10);
    await page.getByLabel("Date").fill(today);
    await page.getByLabel("Reason").fill("Annual check-up");
    await page.getByLabel("Diagnosis").fill("Healthy — no concerns");

    // Save
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForLoadState("networkidle");

    // Should redirect to the consultation show page
    await expect(page.getByText("Annual check-up")).toBeVisible();
    await expect(page.getByText("Healthy — no concerns")).toBeVisible();
  });

  test("consultation appears in the animal show page list", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.vet@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Navigate to the animal show page
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Fluffy").first().click();
    await page.waitForLoadState("networkidle");

    // Create a consultation via the add link
    await page.getByRole("link", { name: /add consultation/i }).click();
    await page.waitForLoadState("networkidle");

    const today = new Date().toISOString().substring(0, 10);
    await page.getByLabel("Date").fill(today);
    await page.getByLabel("Reason").fill("Vaccination");
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForLoadState("networkidle");

    // Navigate back to the animal show page
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByText("Fluffy").first().click();
    await page.waitForLoadState("networkidle");

    // The consultation should appear in the aside panel
    await expect(page.getByText("Vaccination")).toBeVisible();
  });

  test("consultations list page loads", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.vet@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.goto("http://localhost:5175/consultations");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/consultations/);
  });
});
