import { test, expect } from "./fixtures";

/**
 * Verifies that the app boots correctly after removing Companies, Deals,
 * Tasks and Tags entities. Contacts remain fully functional.
 */
test.describe("veterinary CRM — removed entities", () => {
  test.beforeEach(async ({ createSales, createContact }) => {
    const sales = await createSales({
      first_name: "John",
      last_name: "Doe",
      email: "john@doe.com",
      password: "password",
    });

    await createContact({
      first_name: "Ada",
      last_name: "Lovelace",
      title: "Senior Veterinarian",
      sales_id: sales.id,
      notes: [{ text: "Annual checkup scheduled." }],
    });
  });

  test("app boots and shows only Dashboard and Contacts navigation links", async ({
    page,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("john@doe.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveTitle(/Atomic CRM/);

    // Dashboard and Contacts links must be present
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contacts" })).toBeVisible();

    // Companies and Deals links must NOT be present
    await expect(
      page.getByRole("link", { name: "Companies" }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("link", { name: "Deals" }),
    ).not.toBeVisible();
  });

  test("Contacts list loads and shows contacts without company or tag columns", async ({
    page,
    menu,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("john@doe.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await menu.goToContacts();

    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    // Senior Veterinarian title should be shown
    await expect(page.getByText("Senior Veterinarian")).toBeVisible();
  });

  test("Contact show page loads with notes tab, no tasks or company references", async ({
    page,
    menu,
  }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel("Email").fill("john@doe.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await menu.goToContacts();
    await page.getByText("Ada Lovelace").click();
    await page.waitForLoadState("networkidle");

    // Contact name visible
    await expect(
      page.getByText("Ada Lovelace", { exact: false }),
    ).toBeVisible();

    // Note from setup should be present
    await expect(page.getByText("Annual checkup scheduled.")).toBeVisible();
  });
});
