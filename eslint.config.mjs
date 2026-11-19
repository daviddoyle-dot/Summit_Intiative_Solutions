import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js only puts NEXT_PUBLIC_ variables (and NODE_ENV) into the browser
// bundle, and only when each one is read by name from process.env (or
// process["env"]). Any other read in a "use client" file is undefined there at
// runtime, and is a sign server-only code (passwords, tokens, API keys) is in
// the wrong file.
//
// Flat config replaces no-restricted-syntax options wholesale: a later block
// that sets no-restricted-syntax for these files must repeat these entries.
const IN_CLIENT_FILE = "Program:has(> ExpressionStatement[directive='use client'])";
// The two ways of writing process.env: .env and ["env"]. Not covered (nothing
// here uses them): process[key] with a variable key, process[`env`], and
// globalThis.process.env.
const ENV_KEY_FORMS = ["[computed=false][property.name='env']", "[computed=true][property.value='env']"];
// process.env, as the object of a further member access (process.env.NAME).
const PROCESS_ENV_FORMS = ENV_KEY_FORMS.map(
  (form) => `[object.object.name='process']${form.replaceAll("[", "[object.")}`,
);
const BROWSER_SAFE = "/^(NEXT_PUBLIC_\\w+|NODE_ENV)$/";
const SERVER_ENV_MESSAGE =
  "Client components can't read server environment variables. Read it in server-only code (lib/github.ts, lib/admin-auth.ts, app/api/) and pass down only what the page needs.";
const SERVER_ENV_IN_CLIENT = PROCESS_ENV_FORMS.flatMap((env) => [
  // process.env.NAME
  `${IN_CLIENT_FILE} MemberExpression${env}[computed=false][property.name!=${BROWSER_SAFE}]`,
  // process.env["NAME"] or process.env[name]
  `${IN_CLIENT_FILE} MemberExpression${env}[computed=true]:not([property.value=${BROWSER_SAFE}])`,
]).map((selector) => ({ selector, message: SERVER_ENV_MESSAGE }));
// process.env on its own. Destructured or passed around, it is never filled
// in, so even NEXT_PUBLIC_ names read that way are undefined. A simple const
// alias is filled in today, but a reassigned one only by webpack, so aliases
// are flagged too. This also
// flags TypeScript wrappers such as (process.env as Env).NEXT_PUBLIC_X, which
// do work; write process.env.NEXT_PUBLIC_X instead.
const WHOLE_ENV_IN_CLIENT = {
  selector: `${IN_CLIENT_FILE} MemberExpression[object.name='process']:matches(${ENV_KEY_FORMS.join(", ")}):not(MemberExpression > MemberExpression.object)`,
  message:
    "In a client component, write each variable out as process.env.NEXT_PUBLIC_NAME. Next.js doesn't fill in destructured process.env, and an alias isn't reliably filled in.",
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
        BARE_JSON_IN_HTML,
      ],
    },
  },
]);

export default eslintConfig;
