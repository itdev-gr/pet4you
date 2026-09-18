const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Public URL για εικόνα προϊόντος (bucket: product-images). */
export function productImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${BASE}/storage/v1/object/public/product-images/${path}`;
}

/** Public URL για dashboard-managed content (bucket: storefront-content). */
export function contentImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE}/storage/v1/object/public/storefront-content/${path}`;
}
