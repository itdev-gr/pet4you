export interface ProductVariant {
  id: string;
  sku: string | null;
  title: string | null;
  options: Record<string, string> | null;
  /** Καθαρή τιμή (προ ΦΠΑ) — όπως αποθηκεύεται στη βάση. */
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  inventory_policy: "deny" | "continue";
  position: number;
}

export interface ProductImage {
  storage_path: string;
  alt_text: string | null;
  position: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  vendor: string | null;
  product_type: string | null;
  tax_class: string;
  tags: string[];
  product_variants: ProductVariant[];
  product_images: ProductImage[];
}

/** Ελαφριά μορφή για κάρτες προϊόντος σε λίστες — τιμές ΜΕ ΦΠΑ. */
export interface ProductCard {
  id: string;
  title: string;
  slug: string;
  vendor: string | null;
  /** Μεικτή τιμή (με ΦΠΑ), έτοιμη για εμφάνιση. */
  price: number;
  compareAtPrice: number | null;
  imagePath: string | null;
  imageAlt: string | null;
  isNew: boolean;
  inStock: boolean;
  defaultVariantId: string | null;
  hasOptions: boolean;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  image_path: string | null;
  show_in_nav: boolean;
}

export interface HeroSlide {
  id: string;
  image_path: string | null;
  alt_text: string | null;
  heading: string | null;
  subheading: string | null;
  cta_label: string | null;
  cta_url: string | null;
}

export interface HomepageCategory {
  id: string;
  label: string;
  eyebrow: string | null;
  image_path: string | null;
  url: string | null;
}

export interface CollectionWithProducts {
  id: string;
  title: string;
  products: ProductCard[];
}

export interface Partner {
  id: string;
  name: string;
  logo_path: string | null;
}

export interface MenuCategory {
  id: string;
  label: string;
  url: string | null;
  columns: {
    id: string;
    title: string;
    url: string | null;
    links: { id: string; label: string; url: string }[];
  }[];
}

export interface BlogPostCard {
  slug: string;
  title: string | null;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
}

export interface ShippingRate {
  id: string;
  name: string;
  rate_type: "flat" | "by_weight" | "by_cart_value";
  price: number;
  modifier_value: number | null;
}
