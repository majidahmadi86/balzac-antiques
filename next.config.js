/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
