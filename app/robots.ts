import type { MetadataRoute } from "next";

// Private areas stay out of search results. /uploads/enquiries holds
// photographs sent in by visitors, so it is excluded too.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/checkout",
        "/cart",
        "/login",
        "/register",
        "/uploads/enquiries",
      ],
    },
    sitemap: "https://balzacantiques.ch/sitemap.xml",
  };
}
