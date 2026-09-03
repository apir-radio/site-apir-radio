// Active l’export statique et le chemin de base nécessaires à GitHub Pages.
import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild
    ? {
        output: "export",
        trailingSlash: true,
        basePath: pagesBasePath,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
