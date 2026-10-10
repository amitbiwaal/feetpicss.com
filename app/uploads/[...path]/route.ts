import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/storage";

// Uploads are served from here instead of /public because files added to /public
// after `next build` are not picked up by a running production server.

const SEGMENT = /^[a-z0-9-]+$/;
const FILE = /^[a-z0-9-]+\.webp$/;

function notFound() {
  return new Response("Not found", { status: 404 });
}

export async function GET(_request: Request, context: RouteContext<"/uploads/[...path]">) {
  const segments = (await context.params).path;
  const fileName = segments[segments.length - 1];
  const folders = segments.slice(0, -1);
  if (!FILE.test(fileName) || folders.length > 4 || !folders.every((segment) => SEGMENT.test(segment))) {
    return notFound();
  }

  try {
    const data = await readFile(path.join(UPLOADS_DIR, ...folders, fileName));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        // File names are random and never reused, so the response can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return notFound();
  }
}
