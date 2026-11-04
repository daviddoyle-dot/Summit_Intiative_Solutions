import test from "node:test";
import assert from "node:assert/strict";
import {
  SESSION_SECONDS,
  clearAttempts,
  createSessionToken,
  isSameOrigin,
  recordFailedAttempt,
  safeEqual,
  tooManyAttempts,
  verifySessionToken,
} from "../lib/admin-session";

const secret = "a-long-random-secret-for-tests-1234567890";

test("a fresh token verifies; a wrong secret, empty token, or short secret does not", () => {
  const token = createSessionToken(secret);
  assert.equal(verifySessionToken(token, secret), true);
  assert.equal(verifySessionToken(token, secret + "x"), false);
  assert.equal(verifySessionToken(undefined, secret), false);
  assert.equal(verifySessionToken("", secret), false);
  assert.equal(verifySessionToken(token, "short"), false);
});

test("a token expires after a week", () => {
  const start = 1_000_000_000_000;
  const token = createSessionToken(secret, start);
  assert.equal(verifySessionToken(token, secret, start + 1000), true);
  assert.equal(verifySessionToken(token, secret, start + SESSION_SECONDS * 1000 + 1), false);
});

test("a tampered token is rejected", () => {
  const token = createSessionToken(secret);
  const [payload, signature] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ exp: Date.now() + 10 ** 12 })).toString("base64url");
  assert.equal(verifySessionToken(`${forged}.${signature}`, secret), false);
  assert.equal(verifySessionToken(`${payload}.${signature}x`, secret), false);
  assert.equal(verifySessionToken(`${payload}.${signature}.extra`, secret), false);
  assert.equal(verifySessionToken(`${payload}`, secret), false);
});

test("password comparison", () => {
  assert.equal(safeEqual("correct horse", "correct horse"), true);
  assert.equal(safeEqual("correct horse", "correct hors"), false);
  assert.equal(safeEqual("", "x"), false);
});

test("requests must come from this site's own pages", () => {
  assert.equal(isSameOrigin("https://summitinitiativesolutions.com", "summitinitiativesolutions.com"), true);
  assert.equal(isSameOrigin("http://localhost:3000", "localhost:3000"), true);
  assert.equal(isSameOrigin("https://evil.test", "summitinitiativesolutions.com"), false);
  assert.equal(isSameOrigin(null, "summitinitiativesolutions.com"), false);
  assert.equal(isSameOrigin("https://summitinitiativesolutions.com", null), false);
  assert.equal(isSameOrigin("garbage", "x"), false);
});

test("too many wrong passwords locks out for a while, then lets up", () => {
  const key = "1.2.3.4";
  clearAttempts(key);
  const now = 5_000_000;
  for (let i = 0; i < 7; i++) recordFailedAttempt(key, now);
  assert.equal(tooManyAttempts(key, now), false);
  recordFailedAttempt(key, now);
  assert.equal(tooManyAttempts(key, now), true);
  assert.equal(tooManyAttempts(key, now + 16 * 60 * 1000), false);
  clearAttempts(key);
  assert.equal(tooManyAttempts(key, now), false);
});
