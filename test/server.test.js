"use strict";
const test = require("node:test");
const assert = require("node:assert");
const { createAppServer } = require("../server.js");

test("healthz mengembalikan status ok", async () => {
  const server = createAppServer().listen(0);
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/healthz`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.status, "ok");
  server.close();
});

test("path tidak dikenal mengembalikan 404", async () => {
  const server = createAppServer().listen(0);
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/tidak-ada`);
  assert.strictEqual(res.status, 404);
  server.close();
});

test("method POST ditolak 405", async () => {
  const server = createAppServer().listen(0);
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/`, { method: "POST" });
  assert.strictEqual(res.status, 405);
  server.close();
});