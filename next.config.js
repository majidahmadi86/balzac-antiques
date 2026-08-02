/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Photo uploads (admin Step C) — 15 MB images + multipart overhead
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
  // The Objects and Design collections were live and in the sitemap before the
  // client replaced them, so their URLs are redirected rather than left to 404.
  async redirects() {
    return [
      { source: "/collection/objects", destination: "/collection", permanent: true },
      { source: "/collection/design", destination: "/collection", permanent: true },
      { source: "/fr/collection/objects", destination: "/fr/collection", permanent: true },
      { source: "/fr/collection/design", destination: "/fr/collection", permanent: true },
    ];
  },
  images: {
    // Our placeholder assets are local SVGs bundled in the repo (not
    // user-uploaded), so this is safe. Real client photography will be
    // JPG/PNG and won't need this — safe to remove once placeholders
    // are swapped out.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
