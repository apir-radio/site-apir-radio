// Configuration des tests navigateur contre l’export statique local.
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      testIgnore: "**/*.webkit.spec.mjs",
      use: { browserName: "chromium" },
    },
    {
      name: "webkit-smoke",
      testMatch: "**/*.webkit.spec.mjs",
      use: { browserName: "webkit" },
    },
  ],
  webServer: {
    command: "node tests/static-server.mjs out",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
