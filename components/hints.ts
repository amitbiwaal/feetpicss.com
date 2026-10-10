import { preconnect } from "react-dom";

/**
 * Uploaded images live on the Blob CDN, a different origin from the site. Asking the browser to
 * open that connection while it is still parsing the page saves a DNS + TLS round trip before
 * the main image can start downloading — most noticeable on mobile networks.
 */
export function preconnectToImageHost(url: string | undefined): void {
  if (url && /^https:\/\//.test(url)) preconnect(new URL(url).origin);
}
