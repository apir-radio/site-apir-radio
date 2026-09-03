// Sert l’export out/ sur localhost pour les tests Playwright.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDirectory = path.resolve(process.cwd(), process.argv[2] || "out");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function resolvePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath);
  const relativePath = decodedPath.replace(/^\/+/, "");
  const filePath = path.resolve(rootDirectory, relativePath);
  if (filePath !== rootDirectory && !filePath.startsWith(`${rootDirectory}${path.sep}`)) {
    return null;
  }
  return filePath;
}

async function findFile(urlPath) {
  const filePath = resolvePath(urlPath);
  if (!filePath) return null;

  try {
    const stats = await fs.stat(filePath);
    if (stats.isFile()) return filePath;
    if (stats.isDirectory()) return path.join(filePath, "index.html");
  } catch {
    // Try the trailing-slash route below.
  }

  try {
    const indexPath = path.join(filePath, "index.html");
    await fs.access(indexPath);
    return indexPath;
  } catch {
    return null;
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
    const filePath = await findFile(requestUrl.pathname);
    if (!filePath) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : String(error));
  }
});

server.listen(port, "127.0.0.1");
