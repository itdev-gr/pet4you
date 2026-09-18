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
    /**
     * Οι φωτογραφίες αλλάζουν από το dashboard και το path τους μένει ίδιο
     * (`products/<slug>/0.jpg`), οπότε δεν υπάρχει νέο URL να σπάσει το cache.
     * Η προεπιλογή των 4 ωρών φτάνει και στον browser του επισκέπτη: ο
     * merchant θα άλλαζε φωτογραφία και δεν θα την έβλεπε μέχρι να λήξει.
     * Τα 5 λεπτά ταιριάζουν με το revalidate των σελίδων· το CDN εξακολουθεί
     * να σερβίρει από cache, απλώς επαληθεύει συχνότερα.
     */
    minimumCacheTTL: 300,
  },
};

export default nextConfig;
