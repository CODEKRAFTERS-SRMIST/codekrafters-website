export const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/ysfz8n1no/public";

/**
 * Returns the full ImageKit URL for a relative public asset path.
 * Example: "/hero-img/core.jpeg" -> "https://ik.imagekit.io/ysfz8n1no/public/hero-img/core.jpeg"
 */
export function getImageKitUrl(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  const cleanPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${IMAGEKIT_BASE_URL}${encodeURI(cleanPath)}`;
}
