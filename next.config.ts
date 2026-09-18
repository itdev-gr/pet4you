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
     * ⚠️ ΡΥΘΜΙΣΗ ΔΟΚΙΜΩΝ — ΝΑ ΑΛΛΑΞΕΙ ΠΡΙΝ ΤΟ LAUNCH
     *
     * Στο 0 κάθε εικόνα επαληθεύεται σε κάθε αίτημα, ώστε μια νέα φωτογραφία
     * να φαίνεται αμέσως χωρίς hard refresh. Κοστίζει σε ταχύτητα και σε
     * κλήσεις προς το Supabase.
     *
     * Πριν βγει στον αέρα βάλε **300** (5 λεπτά): αρκετά φρέσκο ώστε ο
     * merchant να βλέπει τις αλλαγές του, αρκετά μεγάλο ώστε να μη χτυπάει
     * το CDN σε κάθε επίσκεψη. Η προεπιλογή του Next (4 ώρες) είναι πολύ
     * μεγάλη εδώ, γιατί το path της φωτογραφίας μένει ίδιο όταν
     * αντικαθίσταται και δεν υπάρχει νέο URL να σπάσει το cache.
     */
    minimumCacheTTL: 0,
  },
};

export default nextConfig;
