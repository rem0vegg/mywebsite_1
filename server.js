"use strict";

const http = require("node:http");
const path = require("node:path");
const { readFile } = require("node:fs/promises");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const PUBLIC_FILES = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
]);

const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, { ...SECURITY_HEADERS, ...headers });
  response.end(body);
}

async function handleRequest(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    send(response, 405, "Method Not Allowed\n", { Allow: "GET, HEAD" });
    return;
  }

  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/healthz") {
    const body = request.method === "HEAD" ? "" : JSON.stringify({ status: "ok" });
    send(response, 200, body, { "Content-Type": "application/json; charset=utf-8" });
    return;
  }

  const publicFile = PUBLIC_FILES.get(pathname);
  if (!publicFile) {
    send(response, 404, "Not Found\n", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  try {
    const body = request.method === "HEAD"
      ? ""
      : await readFile(path.join(__dirname, publicFile[0]));
    send(response, 200, body, { "Content-Type": publicFile[1] });
  } catch (error) {
    console.error("Unable to serve static file:", error.message);
    send(response, 500, "Internal Server Error\n", {
      "Content-Type": "text/plain; charset=utf-8",
    });
  }
}

function createAppServer() {
  return http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      console.error("Unhandled request error:", error);
      if (!response.headersSent) {
        send(response, 500, "Internal Server Error\n");
      } else {
        response.destroy();
      }
    });
  });
}

if (require.main === module) {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  createAppServer().listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

module.exports = { createAppServer };
