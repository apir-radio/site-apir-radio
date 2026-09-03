import config from "../site.config.json";

// Adaptateurs de chemin utilisés par le domaine personnalisé ou GitHub Pages.
export const siteConfig = config;
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: string) {
  return `${basePath}${path}`;
}

export function assetPath(path: string) {
  return sitePath(path);
}
