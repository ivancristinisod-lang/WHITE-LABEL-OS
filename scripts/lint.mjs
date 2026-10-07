import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components", "lib"];
const allowed = new Set([".ts", ".tsx", ".js", ".mjs"]);
const issues = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (allowed.has(path.extname(entry.name))) {
      const text = fs.readFileSync(full, "utf8");
      if (/\t/.test(text)) issues.push(`${full}: tabs are not allowed`);
      if (/TODO|FIXME/.test(text)) issues.push(`${full}: unfinished marker left in source`);
      if (/console\.log\(/.test(text)) issues.push(`${full}: console.log left in source`);
    }
  }
}

for (const root of roots) walk(root);
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log("lint: ok");
