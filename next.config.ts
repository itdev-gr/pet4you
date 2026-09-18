import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pftflnyclrltzaeilwgz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],

    /* ══════════════════════════════════════════════════════════════════
       ⚠️  ΡΥΘΜΙΣΗ ΔΟΚΙΜΩΝ — ΠΡΕΠΕΙ ΝΑ ΑΛΛΑΞΕΙ ΠΡΙΝ ΤΟ LAUNCH
       ══════════════════════════════════════════════════════════════════

       Οι εικόνες παρακάμπτουν εντελώς τον optimizer του Next και έρχονται
       κατευθείαν από το Supabase, που στέλνει `no-cache`. Κάθε νέα
       φωτογραφία φαίνεται αμέσως, χωρίς hard refresh και χωρίς αναμονή.

       Το τίμημα: ο επισκέπτης κατεβάζει τα πρωτότυπα αρχεία. Μια φωτογραφία
       προϊόντος 1600×1600 (~200 KB) εμφανίζεται σε κάρτα 273 px — δηλαδή
       κατεβαίνει περίπου 30 φορές περισσότερα byte από όσα χρειάζονται.
       Χάνονται επίσης WebP/AVIF και το responsive srcset.

       ΠΡΙΝ ΤΟ LAUNCH: σβήσε το `unoptimized` και άφησε το
       `minimumCacheTTL: 300` (5 λεπτά) — αρκετά φρέσκο ώστε ο merchant να
       βλέπει τις αλλαγές του από το dashboard, αρκετά μεγάλο ώστε να μη
       χτυπάει το CDN σε κάθε επίσκεψη.
       ══════════════════════════════════════════════════════════════════ */
    unoptimized: true,
    minimumCacheTTL: 300,
  },
};

export default nextConfig;
