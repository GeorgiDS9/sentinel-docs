import { expect, test } from "@playwright/test";

test.describe("Governance Dashboard", () => {
  test("renders core governance sections", async ({ page }) => {
    await page.goto("/dashboard/governance");

    await expect(
      page.getByRole("heading", { name: "NIST AI RMF Governance Dashboard" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Compliance Health" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Compliance Matrix" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Redaction Counter" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Audit Actions" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Integrity Heatmap" }),
    ).toBeVisible();

    const economic = page.getByRole("heading", {
      name: "Economic Shield Metrics",
    });
    await economic.scrollIntoViewIfNeeded();
    await expect(economic).toBeVisible();

    const benchmarking = page.getByRole("heading", {
      name: "Model Benchmarking",
    });
    await benchmarking.scrollIntoViewIfNeeded();
    await expect(benchmarking).toBeVisible();
  });

  test("has navigation back to home", async ({ page }) => {
    await page.goto("/dashboard/governance");

    const backLink = page.getByRole("link", {
      name: "Back to Secure RAG Shell",
    });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });
});
