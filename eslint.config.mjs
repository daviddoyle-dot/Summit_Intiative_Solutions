import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js only puts NEXT_PUBLIC_ variables (and NODE_ENV) into the browser
// bundle, and only when written out as process.env.NAME. Any other read in a
// "use client" file is undefined there at runtime, and is a sign server-only
// code (passwords, tokens, API keys) is in the wrong file.
//
// Flat config replaces no-restricted-syntax options wholesale: a later block
// that sets no-restricted-syntax for these files must repeat these entries.
const IN_CLIENT_FILE = "Program:has(> ExpressionStatement[directive='use client'])";
const PROCESS_ENV = "[object.object.name='process'][object.property.name='env']";
const BROWSER_SAFE = "/^(NEXT_PUBLIC_\\w+|NODE_ENV)$/";
const SERVER_ENV_MESSAGE =
  "Client components can't read server environment variables. Read it in server-only code (lib/github.ts, lib/admin-auth.ts, app/api/) and pass down only what the page needs.";
const SERVER_ENV_IN_CLIENT = [
  // process.env.NAME
  `${IN_CLIENT_FILE} MemberExpression${PROCESS_ENV}[computed=false][property.name!=${BROWSER_SAFE}]`,
  // process.env["NAME"] or process.env[name]
  `${IN_CLIENT_FILE} MemberExpression${PROCESS_ENV}[computed=true]:not([property.value=${BROWSER_SAFE}])`,
].map((selector) => ({ selector, message: SERVER_ENV_MESSAGE }));
// process.env on its own (destructured, aliased or passed around) is never
// inlined, so even NEXT_PUBLIC_ names read that way are undefined.
const WHOLE_ENV_IN_CLIENT = {
  selector: `${IN_CLIENT_FILE} MemberExpression[object.name='process'][property.name='env']:not(MemberExpression > MemberExpression.object)`,
  message:
    "In a client component, write each variable out as process.env.NEXT_PUBLIC_NAME. Next.js doesn't fill in destructured or aliased process.env.",
};
// process["env"] is never filled in either, whatever follows it.
const BRACKET_ENV_IN_CLIENT = {
  selector: `${IN_CLIENT_FILE} MemberExpression[object.name='process'][computed=true][property.value='env']`,
  message: "In a client component, write each variable out as process.env.NEXT_PUBLIC_NAME, not process[\"env\"].",
};
// Structured data must go into its <script> through jsonLdHtml (lib/json-ld.ts):
// a bare JSON.stringify lets "</script>" in a post title end the tag early.
const BARE_JSON_IN_HTML = {
  selector:
    "JSXAttribute[name.name='dangerouslySetInnerHTML'] CallExpression[callee.object.name='JSON'][callee.property.name='stringify']",
  message: "Use jsonLdHtml from lib/json-ld.ts here: JSON.stringify doesn't escape \"<\", so text can end the script tag.",
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
      "no-restricted-syntax": [
        "error",
        ...SERVER_ENV_IN_CLIENT,
        WHOLE_ENV_IN_CLIENT,
        BRACKET_ENV_IN_CLIENT,
        BARE_JSON_IN_HTML,
      ],
    },
  },
]);

export default eslintConfig;
