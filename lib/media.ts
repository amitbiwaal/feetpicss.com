import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { UPLOADS_DIR } from "./storage";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function usesBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Stores a processed WebP image and returns the URL to use in pages.
 * With Vercel Blob configured the file goes to the Blob store (public CDN URL); otherwise it is
 * written under content/uploads and served by app/uploads/[...path] (local development).
 */
export async function storeImage(data: Buffer, folder: string, fileName: string): Promise<string> {
  const pathname = `uploads/${folder}/${fileName}`;

  if (usesBlob()) {
    const blob = await put(pathname, data, {
      access: "public",
      contentType: "image/webp",
      // File names are random UUIDs that are never reused, so no suffix and a long cache lifetime.
      addRandomSuffix: false,
      cacheControlMaxAge: ONE_YEAR_SECONDS,
    });
    return blob.url;
  }

  const directory = path.join(UPLOADS_DIR, folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), data);
  return `/${pathname}`;
}
