import test from "node:test";
import assert from "node:assert/strict";
import { isCountryAllowed } from "../lib/geo";

test("allows the United States and its territories", () => {
  for (const code of ["US", "us", "PR", "GU"]) assert.equal(isCountryAllowed(code), true);
});

test("blocks other countries", () => {
  for (const code of ["CN", "RU", "IR", "KP", "CA", "GB"]) assert.equal(isCountryAllowed(code), false);
});

test("lets requests through when the country is unknown", () => {
  assert.equal(isCountryAllowed(null), true);
  assert.equal(isCountryAllowed(""), true);
});
