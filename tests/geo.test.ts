import test from "node:test";
import assert from "node:assert/strict";
import { isCountryAllowed } from "../lib/geo";

test("allows the US, Canada, Australia and Europe", () => {
  for (const code of ["US", "us", "PR", "GU", "CA", "AU", "NZ", "GB", "DE", "FR", "IE", "CH", "NO"]) assert.equal(isCountryAllowed(code), true);
});

test("blocks other countries", () => {
  for (const code of ["CN", "RU", "BY", "IR", "KP", "IN", "BR"]) assert.equal(isCountryAllowed(code), false);
});

test("lets requests through when the country is unknown", () => {
  assert.equal(isCountryAllowed(null), true);
  assert.equal(isCountryAllowed(""), true);
});
