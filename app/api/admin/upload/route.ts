import { randomUUID } from "node:crypto";
import sharp, { type OutputInfo } from "sharp";
import { isAdmin, isSameOrigin } from "@/lib/auth";
import { storeImage } from "@/lib/media";
import { MAX_UPLOAD_BYTES } from "@/lib/media-url";

const MAX_WIDTH = 1600;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return error("Sign in to upload images.", 401);
  if (!isSameOrigin(request)) return error("Cross-site uploads are not allowed.", 403);

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return error("Upload could not be read.", 400);
  }
  if (!(file instanceof File)) return error("No image was attached.", 400);
  if (file.size === 0) return error("That file is empty.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return error("That image is too large. Use one under 4 MB.", 413);

  // The file is decoded and re-encoded rather than stored as sent: anything that is not a real
  // image fails here, and EXIF data (including GPS location) is dropped from the output.
  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 60_000_000 })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return error("That file is not a supported image. Use JPG, PNG, WebP or GIF.", 415);
  }

  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  let url: string;
  try {
    url = await storeImage(output.data, folder, `${randomUUID()}.webp`);
  } catch (cause) {
    console.error("Could not store uploaded image", cause);
    return error("The image could not be saved. Try again in a moment.", 502);
  }

  return Response.json({ url, width: output.info.width, height: output.info.height });
}
