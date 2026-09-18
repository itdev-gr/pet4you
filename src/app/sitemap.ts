import type { MetadataRoute } from "next";
import { createStoreClient } from "@/lib/supabase/server";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStoreClient();

  const [products, categories, posts, pages] = await Promise.all([
    supabase.from("products").select("slug,updated_at").eq("status", "active"),
    supabase.from("categories").select("slug"),
    supabase.from("blog_posts").select("slug,published_at").eq("status", "published"),
    supabase.from("pages").select("slug,updated_at").eq("status", "published"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/prosfores`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/nea-proionta`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/brands`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...(categories.data ?? []).map((c) => ({
      url: `${BASE}/katigoria/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...(products.data ?? []).map((p) => ({
      url: `${BASE}/proion/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...(posts.data ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    // Τα editorial blocks είναι δεδομένα προϊόντων, όχι σελίδες προς indexing.
    ...(pages.data ?? [])
      .filter((p) => !p.slug.startsWith("editorial/"))
      .map((p) => ({
        url: `${BASE}/selida/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })),
  ];
}
