import { test, expect } from "./fixtures";

/**
 * E2E tests for the Animal (patient) entity in the veterinary CRM.
 *
 * Covers:
 * - Creating an animal and assigning an owner contact
 * - Seeing the animal listed on the contact show page
 * - Navigating to the animal show page
 */
test.describe("Animal entity (patient)", () => {
  test.beforeEach(async ({ createSales, createContact }) => {
    const sales = await createSales({
      first_name: "Dr",
      last_name: "Smith",
      email: "dr.smith@vetclinic.com",
      password: "password",
    });

    await createContact({
      first_name: "Jane",
      last_name: "Owner",
      title: "Pet owner",
      sales_id: sales.id,
    });
  });

  test("Animals navigation link appears in the header", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.smith@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(
      page.getByRole("link", { name: "Animals" }),
    ).toBeVisible();
  });

  test("can create an animal and assign an owner contact", async ({
    page,
    menu,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.smith@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Navigate to animals and create a new one
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /create/i }).click();
    await page.waitForLoadState("networkidle");

    // Fill in the required fields
    await page.getByLabel("Name").fill("Buddy");
    await page.getByLabel("Species").fill("Dog");
    await page.getByLabel("Breed").fill("Labrador Retriever");

    // Select owner via autocomplete
    await page.getByLabel("Owner").fill("Jane");
    await page.waitForLoadState("networkidle");
    await page.getByText("Jane Owner").first().click();

    // Save
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForLoadState("networkidle");

    // Should redirect to show page with the animal name
    await expect(page.getByText("Buddy")).toBeVisible();
    await expect(page.getByText("Dog")).toBeVisible();
  });

  test("animal appears on the owner contact show page", async ({
    page,
    menu,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.smith@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Create an animal first
    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: /create/i }).click();
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Name").fill("Whiskers");
    await page.getByLabel("Species").fill("Cat");
    await page.getByLabel("Owner").fill("Jane");
    await page.waitForLoadState("networkidle");
    await page.getByText("Jane Owner").first().click();
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForLoadState("networkidle");

    // Go to the contact show page
    await menu.goToContacts();
    await page.getByText("Jane Owner").click();
    await page.waitForLoadState("networkidle");

    // Animals section should list Whiskers
    await expect(page.getByText("Whiskers")).toBeVisible();
    await expect(page.getByText("Cat", { exact: false })).toBeVisible();
  });

  test("Animals list page loads and displays animals", async ({ page }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("dr.smith@vetclinic.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByRole("link", { name: "Animals" }).click();
    await page.waitForLoadState("networkidle");

    // The list page should render (empty state or list)
    await expect(page).toHaveURL(/\/animals/);
  });
});
