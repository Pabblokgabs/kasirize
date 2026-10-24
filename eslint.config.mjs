import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // In Next.js App Router (app/layout.tsx), root fonts load globally across all routes.
      // The Pages Router rule `@next/next/no-page-custom-font` expects `pages/_document.js`,
      // which does not apply to the App Router layout.
      "@next/next/no-page-custom-font": "off",
    },
  },
]);

export default eslintConfig;
