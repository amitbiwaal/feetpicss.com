// Shared by the server (validation) and the editor: recognises URLs of images that went through
// the upload route — a local /uploads path in development, a Vercel Blob URL in production.

const LOCAL_UPLOAD = /^\/uploads\/[a-z0-9/-]+\.webp$/;
const BLOB_UPLOAD = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/uploads\/[a-z0-9/-]+\.webp$/;

export function isUploadedImageUrl(url: unknown): url is string {
  return typeof url === "string" && (LOCAL_UPLOAD.test(url) || BLOB_UPLOAD.test(url));
}

/** Largest file the upload route accepts. Vercel rejects request bodies over 4.5 MB before they reach the app. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
