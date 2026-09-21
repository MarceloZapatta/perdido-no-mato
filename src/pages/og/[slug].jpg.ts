import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getCollection } from "astro:content";
import { SITE, normalizePost } from "../../lib/blog-data.js";
import { renderOgImage } from "../../lib/og-image.js";

const WIDTH = 1200;
const HEIGHT = 630;

export async function getStaticPaths() {
  const entries = await getCollection("blog", ({ data }) => !data.draft);
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET = async ({ props }) => {
  const { entry } = props;
  const post = normalizePost(entry);

  const dir = path.join(process.cwd(), "src/content/blog", entry.id);
  const coverFile = fs.readdirSync(dir).find((file) => /^cover\./i.test(file));
  if (!coverFile) {
    return new Response("Cover not found", { status: 404 });
  }

  const coverBuffer = await sharp(path.join(dir, coverFile))
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .png()
    .toBuffer();
  const coverDataUri = `data:image/png;base64,${coverBuffer.toString("base64")}`;

  const png = await renderOgImage({
    title: post.title,
    description: post.excerpt,
    siteName: SITE.name,
    coverDataUri,
  });

  return new Response(png, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
