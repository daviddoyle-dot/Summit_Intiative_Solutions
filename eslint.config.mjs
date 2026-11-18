import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js only sends NEXT_PUBLIC_ variables to the browser. Any other
// process.env read in a "use client" file is undefined there at runtime, and
// is a sign server-only code (passwords, tokens, API keys) is in the wrong file.
const SERVER_ENV_IN_CLIENT = {
  selector:
    "Program:has(> ExpressionStatement[directive='use client']) MemberExpression[object.object.name='process'][object.property.name='env'][property.name!=/^NEXT_PUBLIC_/]",
  message:
    "Client components can't read server environment variables. Read it in a server file (lib/, app/api/) and pass down only what the page needs.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Rules from CLAUDE.md, enforced so nobody has to remember them.
    files: ["app/**", "components/**", "lib/**", "proxy.ts"],
    rules: {
      // No console.log in site code; console.warn and console.error stay
      // allowed for the server logs Vercel keeps.
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-restricted-syntax": ["error", SERVER_ENV_IN_CLIENT],
    },
  },
]);

export default eslintConfig;
