import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { ESLint } from "eslint";

const root = path.resolve(__dirname, "..");
const eslint = new ESLint({ cwd: root });

async function hits(code: string, file: string, ruleId: string) {
  const [result] = await eslint.lintText(code, { filePath: path.join(root, file) });
  return result.messages.filter((m) => m.ruleId === ruleId).map((m) => m.severity);
}

const ERROR = 2;
const CLIENT = '"use client";\n';

test("console.log is an error in site code", { timeout: 60_000 }, async () => {
  for (const file of ["app/example.tsx", "components/Example.tsx", "lib/example.ts", "proxy.ts"]) {
    assert.deepEqual(await hits("console.log('x');\n", file, "no-console"), [ERROR], file);
  }
});

test("console.warn and console.error stay allowed in site code", async () => {
  assert.deepEqual(await hits("console.warn('x');\nconsole.error('y');\n", "lib/example.ts", "no-console"), []);
});

test("console.log is allowed in tests and scripts", async () => {
  assert.deepEqual(await hits("console.log('x');\n", "tests/example.test.ts", "no-console"), []);
  assert.deepEqual(await hits("console.log('x');\n", "scripts/example.mjs", "no-console"), []);
});

test("a client component can't read a server environment variable", async () => {
  const code = `${CLIENT}export const a = process.env.ADMIN_PASSWORD;\nexport const b = process.env.RESEND_API_KEY;\n`;
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), [ERROR, ERROR]);
});

test("a client component may read NEXT_PUBLIC_ variables", async () => {
  const code = `${CLIENT}export const a = process.env.NEXT_PUBLIC_SITE_URL;\n`;
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), []);
});

test("server code may read server environment variables", async () => {
  const code = "export const a = process.env.ADMIN_PASSWORD;\n";
  for (const file of ["lib/example.ts", "app/api/example/route.ts", "components/ServerThing.tsx"]) {
    assert.deepEqual(await hits(code, file, "no-restricted-syntax"), [], file);
  }
});

test("a client component can't destructure or alias process.env", async () => {
  // Next.js only inlines process.env.NEXT_PUBLIC_X written out in full, so these
  // forms are undefined in the browser even for NEXT_PUBLIC_ names.
  const code = [
    CLIENT,
    "const { ADMIN_PASSWORD } = process.env;",
    "const { NEXT_PUBLIC_SITE_URL } = process.env;",
    "const env = process.env;",
    "export { ADMIN_PASSWORD, NEXT_PUBLIC_SITE_URL, env };",
    "",
  ].join("\n");
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), [ERROR, ERROR, ERROR]);
});

test("a client component may read NODE_ENV, and NEXT_PUBLIC_ names in brackets", async () => {
  const code = `${CLIENT}export const a = process.env.NODE_ENV;\nexport const b = process.env["NEXT_PUBLIC_SITE_URL"];\n`;
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), []);
});

test("a client component can't read a server variable in brackets either", async () => {
  const code = `${CLIENT}export const a = process.env["ADMIN_PASSWORD"];\nexport const b = process.env[name];\n`;
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), [ERROR, ERROR]);
});

test("a name that only starts with NODE_ENV or NEXT_PUBLIC_ is still a server variable", async () => {
  const code = `${CLIENT}export const a = process.env.NODE_ENVIRONMENT;\nexport const b = process.env.NEXT_PUBLIC_;\n`;
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), [ERROR, ERROR]);
});

test("a client component can't read through process[\"env\"], which Next.js never fills in", async () => {
  const code = `${CLIENT}export const a = process["env"].ADMIN_PASSWORD;\nexport const b = process["env"].NEXT_PUBLIC_SITE_URL;\n`;
  assert.deepEqual(await hits(code, "components/Example.tsx", "no-restricted-syntax"), [ERROR, ERROR]);
});

test("structured data can't go into a script through a bare JSON.stringify", async () => {
  const bare = "export const S = () => <script dangerouslySetInnerHTML={{ __html: JSON.stringify({ a: 1 }) }} />;\n";
  for (const file of ["app/example.tsx", "components/Example.tsx"]) {
    assert.deepEqual(await hits(bare, file, "no-restricted-syntax"), [ERROR], file);
  }
  const safe = 'import { jsonLdHtml } from "@/lib/json-ld";\nexport const S = () => <script dangerouslySetInnerHTML={{ __html: jsonLdHtml({ a: 1 }) }} />;\n';
  assert.deepEqual(await hits(safe, "app/example.tsx", "no-restricted-syntax"), []);
  // JSON.stringify elsewhere is fine.
  assert.deepEqual(await hits("export const s = JSON.stringify({ a: 1 });\n", "lib/example.ts", "no-restricted-syntax"), []);
});

test("'use client' only counts as the file's directive, not as a string elsewhere", async () => {
  const code = 'const label = "use client";\nexport const a = process.env.ADMIN_PASSWORD + label;\n';
  assert.deepEqual(await hits(code, "lib/example.ts", "no-restricted-syntax"), []);
});
