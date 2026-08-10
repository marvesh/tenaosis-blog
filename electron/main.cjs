const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const http = require("node:http");
const fs = require("node:fs");

const ROOT = path.join(__dirname, "..", "dist-electron-renderer");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Serving over localhost (instead of file://) so ES modules and fonts load correctly.
// Everything is read from disk, so the app stays fully offline.
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      let filePath = path.join(ROOT, urlPath === "/" ? "electron/index.html" : urlPath);
      if (!filePath.startsWith(ROOT)) {
        res.writeHead(403).end("Forbidden");
        return;
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(ROOT, "electron/index.html");
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

async function createWindow() {
  const port = await startServer();
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    backgroundColor: "#faf7f0",
    title: "Tenaosis",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  win.loadURL(`http://127.0.0.1:${port}/`);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
