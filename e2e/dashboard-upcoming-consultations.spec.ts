import { test, expect } from "./fixtures";

/**
 * Returns an ISO date string that is `daysFromNow` days from today.
 */
function isoDateOffset(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

/**
 * Navigates to the app, signs in, adds a note to skip the dashboard stepper,
 * and returns to the dashboard.
 */
async function signInAndReachDashboard(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
  contactName: string,
) {
  await page.goto("http://localhost:5175/");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForLoadState("networkidle");

  // Add a contact note to clear the onboarding stepper guard
  await page.getByRole("link", { name: "Contacts" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByText(contactName).first().click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Add note" }).click();
  await page.getByPlaceholder("Add a note").fill("Onboarding note");
  await page.getByRole("button", { name: /add this note/i }).click();
  await page.waitForLoadState("networkidle");

  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.waitForLoadState("networkidle");
}

test.describe("Upcoming Consultations dashboard widget", () => {
  test.beforeEach(
    async ({ createSales, createContact, createAnimal, createConsultation }) => {
      const sales = await createSales({
        first_name: "Dr",
        last_name: "Smith",
        email: "dr.smith@vetclinic.com",
        password: "password",
      });

      const contact = await createContact({
        first_name: "Bob",
        last_name: "Petowner",
        title: "Pet owner",
        sales_id: sales.id,
      });

      const animal = await createAnimal({
        name: "Whiskers",
        species: "Cat",
        owner_id: contact.id,
      });

      // Consultation with next_appointment 5 days in the future
      await createConsultation({
        animal_id: animal.id,
        date: isoDateOffset(-3),
        reason: "Routine check",
        next_appointment: isoDateOffset(5),
      });
    },
  );

  test("upcoming consultations widget appears with one future appointment row", async ({
    page,
  }) => {
    await signInAndReachDashboard(
      page,
      "dr.smith@vetclinic.com",
      "password",
      "Bob Petowner",
    );

    // Widget heading must be visible
    await expect(page.getByText("Upcoming Consultations")).toBeVisible();

    // Row for Whiskers must appear in the widget
    await expect(page.getByText("Whiskers").first()).toBeVisible();

    // Owner name must appear
    await expect(page.getByText("Bob Petowner").first()).toBeVisible();
  });

  test("upcoming consultations widget shows empty state when no future appointments", async ({
    page,
    createSales,
    createContact,
    createAnimal,
    createConsultation,
  }) => {
    // Seed a consultation with next_appointment in the past — should NOT appear
    const sales = await createSales({
      first_name: "Dr",
      last_name: "Jones",
      email: "dr.jones@vetclinic.com",
      password: "password2",
    });

    const contact = await createContact({
      first_name: "Carol",
      last_name: "Catowner",
      title: "Cat owner",
      sales_id: sales.id,
    });

    const animal = await createAnimal({
      name: "Mittens",
      species: "Cat",
      owner_id: contact.id,
    });

    await createConsultation({
      animal_id: animal.id,
      date: isoDateOffset(-10),
      reason: "Past visit",
      next_appointment: isoDateOffset(-2),
    });

    await signInAndReachDashboard(
      page,
      "dr.jones@vetclinic.com",
      "password2",
      "Carol Catowner",
    );

    // Widget heading must be visible
    await expect(page.getByText("Upcoming Consultations")).toBeVisible();

    // Empty state message must appear
    await expect(page.getByText("No upcoming consultations")).toBeVisible();
  });

  test("upcoming consultation row links to the consultation show page", async ({
    page,
  }) => {
    await signInAndReachDashboard(
      page,
      "dr.smith@vetclinic.com",
      "password",
      "Bob Petowner",
    );

    await expect(page.getByText("Upcoming Consultations")).toBeVisible();

    // Click the Whiskers row
    await page.getByText("Whiskers").first().click();
    await page.waitForLoadState("networkidle");

    // Should land on a consultation show page
    await expect(page).toHaveURL(/\/consultations\/\d+\/show/);
  });
});
