import { MAX_UPLOAD_BYTES } from "@/lib/media-url";

const MAX_SIDE = 2400;

/**
 * Photos straight from a phone are often 5–12 MB, more than the server accepts in one request.
 * Files that are already small are sent untouched; larger ones are scaled down in the browser
 * first (the server then resizes to its final size and converts to WebP either way).
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (file.size <= MAX_UPLOAD_BYTES * 0.9) return file;

  const tooLarge = new Error("This image is too large and could not be resized here. Use a JPG or PNG under 4 MB.");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw tooLarge;
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw tooLarge;
  // JPEG has no transparency; without a white base, transparent areas would turn black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob || blob.size > MAX_UPLOAD_BYTES) throw tooLarge;
  return blob;
}
