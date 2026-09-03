import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // TypeScript 7 is checked by tsc; the Next/Babel parser still covers TS syntax.
  // Avoid eslint-plugin-react auto-detection, which uses a removed ESLint 10 context API.
  { settings: { react: { version: "19.2.8" } } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
