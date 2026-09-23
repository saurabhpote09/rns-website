import type { NextConfig } from "next";

// Set by the GitHub Pages workflow only — local dev and other deploy
// targets are unaffected. Keep this in sync with the repo name.
const repoName = "rns-website";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
