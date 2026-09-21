#!/usr/bin/env node
// Standalone OG thumbnail generator for local testing.
//
// Usage:
//   node scripts/generate-og.mjs <folder-or-slug> [output.png]
//
// Examples:
//   node scripts/generate-og.mjs serra-do-japi-trilha-circular-cachoeiras
//   node scripts/generate-og.mjs src/content/blog/aquabus-ilhabela /tmp/og.png

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { renderOgImage } from "../src/lib/og-image.js";

const WIDTH = 1200;
const HEIGHT = 630;

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: node scripts/generate-og.mjs <folder-or-slug> [output.png]");
  process.exit(1);
}

// Resolve the publication folder: accept a direct path or a slug under src/content/blog.
const candidates = [path.resolve(arg), path.resolve("src/content/blog", arg)];
const dir = candidates.find((candidate) => fs.existsSync(path.join(candidate, "index.mdx")));
if (!dir) {
  console.error(`Could not find an index.mdx in any of:\n  ${candidates.join("\n  ")}`);
  process.exit(1);
}

const slug = path.basename(dir);

// Minimal frontmatter reader for the fields we need.
const readFrontmatter = (file) => {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const block = match ? match[1] : "";
  const field = (name) => {
    const line = block.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
    if (!line) return "";
    return line[1].trim().replace(/^["']|["']$/g, "");
  };
  return { title: field("title"), excerpt: field("excerpt") };
};

const readSiteName = () => {
  try {
    const config = fs.readFileSync(path.resolve("src/config/theme.config.ts"), "utf8");
    const match = config.match(/name:\s*["']([^"']+)["']/);
    return match ? match[1] : "Perdido no Mato";
  } catch {
    return "Perdido no Mato";
  }
};

const { title, excerpt } = readFrontmatter(path.join(dir, "index.mdx"));
const siteName = readSiteName();

const coverFile = fs.readdirSync(dir).find((file) => /^cover\./i.test(file));
if (!coverFile) {
  console.error(`No cover.* image found in ${dir}`);
  process.exit(1);
}

console.log("cover file getted:", coverFile);

const coverBuffer = await sharp(path.join(dir, coverFile))
  .resize(WIDTH, HEIGHT, { fit: "cover" })
  .png()
  .toBuffer();

console.log("cover buffer created, size:", coverBuffer.length);

const coverDataUri = `data:image/png;base64,${coverBuffer.toString("base64")}`;
console.log("cover data URI created, length:", coverDataUri.length);

console.log("Rendering OG image...");
const png = await renderOgImage({ title, description: excerpt, siteName, coverDataUri });
console.log("OG image rendered, size:", png.length);

console.log("Writing OG image to file...");
const output = path.resolve(process.argv[3] || `og-preview-${slug}.jpg`);
fs.writeFileSync(output, png);
console.log("OG image written to file:", output);

console.log("Generated OG thumbnail:");
console.log(`  slug:    ${slug}`);
console.log(`  title:   ${title}`);
console.log(`  excerpt: ${excerpt}`);
console.log(`  cover:   ${coverFile}`);
console.log(`  output:  ${output}`);
