import { createStoreClient } from "@/lib/supabase/server";
import { grossUnit, vatRate } from "./vat";
import type {
  BlogPostCard,
  Category,
  CollectionWithProducts,
  HeroSlide,
  HomepageCategory,
  MenuCategory,
  Partner,
  Product,
  ProductCard,
} from "./types";

const PRODUCT_CARD_SELECT =
  "id,title,slug,vendor,tax_class,tags,product_variants(id,title,options,price,compare_at_price,inventory_quantity,inventory_policy,position),product_images(storage_path,alt_text,position)";

type RawCardProduct = {
  id: string;
  title: string;
  slug: string;
  vendor: string | null;
  tax_class: string;
  tags: string[];
  product_variants: {
    id: string;
    title: string | null;
    options: Record<string, string> | null;
    price: number;
    compare_at_price: number | null;
    inventory_quantity: number;
    inventory_policy: string;
    position: number;
  }[];
  product_images: { storage_path: string; alt_text: string | null; position: number }[];
};

export function toProductCard(p: RawCardProduct): ProductCard {
  const variants = [...(p.product_variants ?? [])].sort((a, b) => a.position - b.position);
  const image = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position)[0];
  const cheapest = variants.reduce(
    (min, v) => (min === null || v.price < min.price ? v : min),
    null as (typeof variants)[number] | null,
  );
  const rate = vatRate(p.tax_class);
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    vendor: p.vendor,
    price: cheapest ? grossUnit(cheapest.price, rate) : 0,
    compareAtPrice: cheapest?.compare_at_price
      ? grossUnit(cheapest.compare_at_price, rate)
      : null,
    imagePath: image?.storage_path ?? null,
    imageAlt: image?.alt_text ?? p.title,
    isNew: (p.tags ?? []).includes("νέο"),
    inStock: variants.some(
      (v) => v.inventory_quantity > 0 || v.inventory_policy === "continue",
    ),
    defaultVariantId: variants.length === 1 ? variants[0].id : null,
    hasOptions: variants.length > 1,
  };
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await createStoreClient()
    .from("hero_slides")
    .select("id,image_path,alt_text,heading,subheading,cta_label,cta_url")
    .eq("active", true)
    .order("position");
  if (error) throw new Error(`hero_slides: ${error.message}`);
  return data ?? [];
}

export async function getHomepageCategories(): Promise<HomepageCategory[]> {
  const { data, error } = await createStoreClient()
    .from("homepage_categories")
    .select("id,label,eyebrow,image_path,url")
    .eq("active", true)
    .order("position");
  if (error) throw new Error(`homepage_categories: ${error.message}`);
  return data ?? [];
}

export async function getCollectionsWithProducts(): Promise<CollectionWithProducts[]> {
  const { data, error } = await createStoreClient()
    .from("collections")
    .select(`id,title,position,collection_products(position,products(${PRODUCT_CARD_SELECT}))`)
    .eq("active", true)
    .order("position");
  if (error) throw new Error(`collections: ${error.message}`);
  return (data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    products: [...(c.collection_products ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((cp) => cp.products as unknown as RawCardProduct)
      .filter(Boolean)
      .map(toProductCard),
  }));
}

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await createStoreClient()
    .from("partners")
    .select("id,name,logo_path")
    .eq("active", true)
    .order("position");
  if (error) throw new Error(`partners: ${error.message}`);
  return data ?? [];
}

export async function getMenu(): Promise<MenuCategory[]> {
  const { data, error } = await createStoreClient()
    .from("menu_categories")
    .select(
      "id,label,url,position,menu_columns(id,title,url,position,menu_links(id,label,url,position))",
    )
    .eq("active", true)
    .order("position");
  if (error) throw new Error(`menu: ${error.message}`);
  return (data ?? []).map((m) => ({
    id: m.id,
    label: m.label,
    url: m.url,
    columns: [...(m.menu_columns ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((col) => ({
        id: col.id,
        title: col.title,
        url: col.url,
        links: [...(col.menu_links ?? [])].sort((a, b) => a.position - b.position),
      })),
  }));
}

export async function getNavCategories(): Promise<Category[]> {
  const { data, error } = await createStoreClient()
    .from("categories")
    .select("id,parent_id,name,slug,description,position,image_path,show_in_nav")
    .is("parent_id", null)
    .order("position");
  if (error) throw new Error(`categories: ${error.message}`);
  return data ?? [];
}

export async function getLatestPosts(limit = 3): Promise<BlogPostCard[]> {
  const { data, error } = await createStoreClient()
    .from("blog_posts")
    .select("slug,title,excerpt,cover_image,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`blog_posts: ${error.message}`);
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await createStoreClient()
    .from("categories")
    .select("id,parent_id,name,slug,description,position,image_path,show_in_nav")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`category ${slug}: ${error.message}`);
  return data;
}

export async function getChildCategories(parentId: string): Promise<Category[]> {
  const { data, error } = await createStoreClient()
    .from("categories")
    .select("id,parent_id,name,slug,description,position,image_path,show_in_nav")
    .eq("parent_id", parentId)
    .order("position");
  if (error) throw new Error(`child categories: ${error.message}`);
  return data ?? [];
}

export interface CatalogFilters {
  categoryIds?: string[];
  search?: string;
  vendors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
}

export interface CatalogResult {
  products: ProductCard[];
  vendors: string[];
  priceRange: { min: number; max: number };
  total: number;
}

/**
 * Κατάλογος με φίλτρα. Τα φίλτρα τιμής/αποθέματος/ταξινόμησης εφαρμόζονται
 * στον server μετά το mapping, γιατί τιμή και απόθεμα ζουν στα variants.
 */
export async function getCatalog(filters: CatalogFilters): Promise<CatalogResult> {
  const supabase = createStoreClient();
  let productIds: string[] | null = null;

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    const { data, error } = await supabase
      .from("product_categories")
      .select("product_id")
      .in("category_id", filters.categoryIds);
    if (error) throw new Error(`catalog links: ${error.message}`);
    productIds = [...new Set((data ?? []).map((r) => r.product_id))];
    if (productIds.length === 0) {
      return { products: [], vendors: [], priceRange: { min: 0, max: 0 }, total: 0 };
    }
  }

  let query = supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("status", "active");
  if (productIds) query = query.in("id", productIds);
  if (filters.search) {
    const term = filters.search.replace(/[%,()]/g, " ").trim();
    if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error } = await query.limit(200);
  if (error) throw new Error(`catalog: ${error.message}`);

  let cards = (data ?? []).map((p) => toProductCard(p as unknown as RawCardProduct));

  const vendors = [...new Set(cards.map((c) => c.vendor).filter(Boolean))].sort() as string[];
  const prices = cards.map((c) => c.price);
  const priceRange = {
    min: prices.length ? Math.floor(Math.min(...prices)) : 0,
    max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
  };

  if (filters.vendors && filters.vendors.length > 0) {
    cards = cards.filter((c) => c.vendor && filters.vendors!.includes(c.vendor));
  }
  if (typeof filters.minPrice === "number") {
    cards = cards.filter((c) => c.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    cards = cards.filter((c) => c.price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) cards = cards.filter((c) => c.inStock);

  switch (filters.sort) {
    case "price_asc":
      cards.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      cards.sort((a, b) => b.price - a.price);
      break;
    case "name":
      cards.sort((a, b) => a.title.localeCompare(b.title, "el"));
      break;
    case "newest":
      cards.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      break;
  }

  return { products: cards, vendors, priceRange, total: cards.length };
}

/** Κατηγορίες στις οποίες ανήκει ένα προϊόν, με τη γονική τους (για breadcrumbs). */
export async function getProductCategories(productId: string): Promise<Category[]> {
  const { data, error } = await createStoreClient()
    .from("product_categories")
    .select("categories(id,parent_id,name,slug,description,position,image_path,show_in_nav)")
    .eq("product_id", productId);
  if (error) throw new Error(`product_categories: ${error.message}`);
  return (data ?? [])
    .map((r) => r.categories as unknown as Category)
    .filter(Boolean);
}

/**
 * Σχετικά προϊόντα.
 *
 * Σκέτη κατηγορία δεν αρκεί: όλα τα είδη σκύλου μοιράζονται τη «Σκύλος», οπότε
 * ένα σαμαράκι έφερνε σαμπουάν και κρεβατάκι. Κατατάσσουμε πρώτα με βάση κοινά
 * tags (π.χ. «βόλτα»), μετά με κοινές κατηγορίες — έτσι προκύπτει πραγματικό
 * cross-sell. Τα tags τα ορίζει ο merchant από το dashboard.
 */
export async function getRelatedProducts(
  productId: string,
  categoryIds: string[],
  tags: string[] = [],
  limit = 4,
): Promise<ProductCard[]> {
  if (categoryIds.length === 0) return [];
  const supabase = createStoreClient();
  const { data: links, error: linkError } = await supabase
    .from("product_categories")
    .select("product_id,category_id")
    .in("category_id", categoryIds)
    .neq("product_id", productId)
    .limit(200);
  if (linkError) throw new Error(`related links: ${linkError.message}`);

  const sharedCategories = new Map<string, number>();
  for (const l of links ?? []) {
    sharedCategories.set(l.product_id, (sharedCategories.get(l.product_id) ?? 0) + 1);
  }
  if (sharedCategories.size === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("status", "active")
    .in("id", [...sharedCategories.keys()]);
  if (error) throw new Error(`related products: ${error.message}`);

  // Τα γενικά tags είδους ζώου δεν δηλώνουν συνάφεια — τα αγνοούμε στη βαθμολογία.
  const GENERIC = new Set(["σκύλος", "γάτα", "νέο", "δημοφιλή", "μικρά-ζώα", "πτηνά", "ψάρια", "ερπετά"]);
  const meaningful = tags.filter((t) => !GENERIC.has(t));

  return (data ?? [])
    .map((p) => {
      const raw = p as unknown as RawCardProduct;
      const shared = (raw.tags ?? []).filter((t) => meaningful.includes(t)).length;
      return {
        card: toProductCard(raw),
        score: shared * 10 + (sharedCategories.get(raw.id) ?? 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.card.title.localeCompare(b.card.title, "el"))
    .slice(0, limit)
    .map((r) => r.card);
}

export interface ProductEditorial {
  heading: string;
  body: string;
  image?: string;
  features?: { label: string; icon: string }[];
  sections?: { title: string; body: string }[];
}

/**
 * Προαιρετικό editorial block ανά προϊόν, αποθηκευμένο ως JSON στο
 * store.pages με slug `editorial/<product-slug>` — επεξεργάσιμο από το dashboard.
 */
export async function getProductEditorial(slug: string): Promise<ProductEditorial | null> {
  const { data, error } = await createStoreClient()
    .from("pages")
    .select("content")
    .eq("slug", `editorial/${slug}`)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data?.content) return null;
  try {
    const parsed = JSON.parse(data.content) as ProductEditorial;
    return parsed.heading && parsed.body ? parsed : null;
  } catch {
    return null;
  }
}

export interface BlogPost extends BlogPostCard {
  content: string | null;
  author: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
}

export async function getAllPosts(): Promise<BlogPostCard[]> {
  const { data, error } = await createStoreClient()
    .from("blog_posts")
    .select("slug,title,excerpt,cover_image,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(`blog_posts: ${error.message}`);
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await createStoreClient()
    .from("blog_posts")
    .select(
      "slug,title,excerpt,content,cover_image,author,tags,published_at,seo_title,seo_description",
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`blog_post ${slug}: ${error.message}`);
  return data;
}

export interface StaticPage {
  slug: string;
  title: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string | null;
}

export async function getPageBySlug(slug: string): Promise<StaticPage | null> {
  // Τα editorial blocks ζουν κι αυτά στο pages με πρόθεμα `editorial/`·
  // δεν είναι δημόσιες σελίδες.
  if (slug.startsWith("editorial/")) return null;
  const { data, error } = await createStoreClient()
    .from("pages")
    .select("slug,title,content,seo_title,seo_description,updated_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`page ${slug}: ${error.message}`);
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await createStoreClient()
    .from("products")
    .select(
      "id,title,slug,description,vendor,product_type,tax_class,tags,product_variants(id,sku,title,options,price,compare_at_price,inventory_quantity,inventory_policy,position),product_images(storage_path,alt_text,position)",
    )
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`product ${slug}: ${error.message}`);
  if (!data) return null;
  data.product_variants.sort((a, b) => a.position - b.position);
  data.product_images.sort((a, b) => a.position - b.position);
  return data as Product;
}

/** Published CMS content only; errors stay errors rather than becoming false 404s. */
export async function getPublishedPosts(): Promise<BlogPostCard[]> {
  const { data, error } = await createStoreClient()
    .from("blog_posts")
    .select("slug,title,excerpt,cover_image,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("slug");
  if (error) throw new Error(`blog_posts: ${error.message}`);
  return data ?? [];
}

export async function getPublishedPostBySlug(slug: string) {
  const { data, error } = await createStoreClient()
    .from("blog_posts")
    .select("slug,title,excerpt,content,cover_image,author,published_at,seo_title,seo_description")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`blog post: ${error.message}`);
  return data;
}

export async function getPublishedPageBySlug(slug: string) {
  if (slug.includes("/")) return null;
  const { data, error } = await createStoreClient()
    .from("pages")
    .select("slug,title,content,seo_title,seo_description")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`page: ${error.message}`);
  return data;
}
