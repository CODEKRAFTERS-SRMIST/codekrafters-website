export const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/ysfz8n1no/public";

/**
 * Returns the full ImageKit URL for a relative public asset path or remote image.
 * Supports transformation query parameters for optimal format (WebP/AVIF), resizing, and compression.
 * Example: getImageKitUrl("/manga_art/manga_page1.png", "tr=f-auto,q-80,w-1600")
 */
export function getImageKitUrl(relativePath: string, transform?: string): string {
  if (!relativePath) return "";
  let url = relativePath;
  if (!relativePath.startsWith("http://") && !relativePath.startsWith("https://")) {
    const cleanPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    url = `${IMAGEKIT_BASE_URL}${encodeURI(cleanPath)}`;
  }
  
  if (transform) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${transform}`;
  }
  return url;
}
