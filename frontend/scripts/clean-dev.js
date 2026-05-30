const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function rm(target) {
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

rm(path.join(root, ".next"));

const publicDir = path.join(root, "public");
if (fs.existsSync(publicDir)) {
  for (const file of fs.readdirSync(publicDir)) {
    if (
      file === "sw.js" ||
      file.startsWith("workbox-") ||
      file.startsWith("swe-worker-") ||
      file.startsWith("fallback-")
    ) {
      rm(path.join(publicDir, file));
    }
  }
}

console.log("Cache de desenvolvimento limpo.");
