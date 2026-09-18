# just4pets — pet shop storefront

Ελληνικό eshop για κατοικίδια, χτισμένο πάνω στο σύστημα του
[itdevecommerce](https://www.itdevecommerce.com) dashboard. Το κατάστημα διαβάζει
και γράφει στο **data plane** του πελάτη (Supabase project `pftflnyclrltzaeilwgz`),
ώστε ό,τι φαίνεται στο site να διαχειρίζεται από το dashboard.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Γλώσσα | TypeScript |
| Styling | Tailwind CSS v4 |
| Δεδομένα | Supabase (`store` schema) |
| Auth | Supabase Auth (πελάτες) |
| Tests | Playwright (e2e) |

## Ξεκίνημα

```bash
npm install
npm run dev        # http://localhost:3000
```

Το `.env.local` περιέχει `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
και `SUPABASE_SERVICE_ROLE_KEY`. **Το service-role key δεν φτάνει ποτέ στον
browser** — χρησιμοποιείται μόνο σε server-side routes.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run e2e        # Playwright (θέλει τον dev server σε λειτουργία)
```

## Αρχιτεκτονική

```
src/
├─ app/                    Routes (App Router)
│  ├─ api/
│  │  ├─ cart/quote/       Authoritative τιμολόγηση καλαθιού
│  │  ├─ checkout/         Δημιουργία παραγγελίας (create_order_v1)
│  │  └─ newsletter/       Εγγραφή στο newsletter
│  ├─ katigoria/[slug]/    Λίστα προϊόντων με φίλτρα
│  ├─ proion/[slug]/       Σελίδα προϊόντος
│  └─ …
├─ components/             UI (server components εκτός αν χρειάζεται interactivity)
├─ lib/
│  ├─ supabase/
│  │  ├─ server.ts         anon client → δημόσια reads του `store`
│  │  ├─ admin.ts          service-role client → ΜΟΝΟ server-side
│  │  └─ auth.ts           Supabase Auth με cookies
│  ├─ store/               queries, types, ΦΠΑ, μεταφορικά
│  └─ persistedStore.ts    Καλάθι & αγαπημένα στον localStorage
└─ proxy.ts                Ανανέωση session (Next 16: `proxy`, όχι `middleware`)
```

### Καλάθι και αγαπημένα

Ζουν στον `localStorage` του επισκέπτη και διαβάζονται με `useSyncExternalStore`,
όχι με `setState` μέσα σε effect: ο server δεν έχει `localStorage`, οπότε το
πρώτο render δίνει το κενό snapshot και η πραγματική τιμή έρχεται στο hydration
χωρίς επιπλέον κύκλο render. Το store συγχρονίζεται και μεταξύ καρτελών.

Οι τιμές που κρατάει το καλάθι είναι **μόνο για εμφάνιση** — κάθε σύνολο
επανυπολογίζεται από τη βάση στο `/api/cart/quote` και στο `/api/checkout`.

### Τιμές και ΦΠΑ

Το `store.product_variants.price` είναι **καθαρή τιμή** (προ ΦΠΑ) — έτσι το
ορίζει το συμβόλαιο του dashboard, και το `create_order_v1` υπολογίζει τον ΦΠΑ
ανά γραμμή από το `products.tax_class` (24% / 13% / 6%).

Ο ελληνικός νόμος απαιτεί λιανικές τιμές **με ΦΠΑ**, οπότε το storefront
εμφανίζει πάντα τη μεικτή τιμή. Η αριθμητική γίνεται σε **ακέραια λεπτά**
(`src/lib/store/vat.ts`) επειδή το `Math.round` σε δεκαδικά floats δεν
συμπίπτει με το `round(numeric, 2)` της Postgres — μια απόκλιση ενός λεπτού
ανάμεσα σε καλάθι και παραγγελία είναι ορατή στον πελάτη.

Επαληθευμένο: 84/84 συνδυασμοί συντελεστή × τιμής × ποσότητας δίνουν το ίδιο
αποτέλεσμα με την Postgres.

### Παραγγελίες

Το checkout περνάει αποκλειστικά από `POST /api/checkout`:

1. Τιμές, ΦΠΑ και μεταφορικά υπολογίζονται **από τη βάση** — τίποτα από το
   payload του browser δεν γίνεται δεκτό ως ποσό.
2. Κάθε απόπειρα φέρει `idempotencyKey`, που γίνεται `visitor_token` σε
   `store.carts`. Επανάληψη με το ίδιο κλειδί επιστρέφει την **ίδια**
   παραγγελία — προστασία από διπλό κλικ ή retry.
3. Η εγγραφή γίνεται με το ατομικό `store.create_order_v1`.

Τα δικαιώματα εκτέλεσης του RPC έχουν ανακληθεί από `PUBLIC`, `anon` και
`authenticated`: μόνο ο service-role μπορεί να δημιουργήσει παραγγελία.

Αν δεν υπάρχει ζώνη αποστολής για τη διεύθυνση, το checkout **σταματά** με
μήνυμα — ποτέ δεν πέφτει σιωπηλά σε μηδενικά μεταφορικά.

## Διαχείριση από το dashboard

Όλο το περιεχόμενο έρχεται από το `store` schema: προϊόντα, κατηγορίες,
hero slides, κύκλοι κατηγοριών, collections (τα tabs της αρχικής), brands,
mega menu, άρθρα, σελίδες, ζώνες και τιμές αποστολής.

Το editorial block κάθε προϊόντος (η ενότητα «Άνεση σε κάθε βήμα» στο PDP)
αποθηκεύεται ως JSON σε `store.pages` με slug `editorial/<product-slug>`.

## Seed δεδομένα

```
supabase/seed/
├─ pet_shop_seed.sql     Κατάλογος, κατηγορίες, περιεχόμενο αρχικής, blog, σελίδες
├─ prices_net.sql        Μετατροπή τιμών ραφιού σε καθαρές (gross → net)
└─ editorial_seed.sql    Editorial blocks ανά προϊόν
```

Ο κατάλογος και οι εικόνες είναι **demo** και αντικαθίστανται από το dashboard.

## Πριν το go-live

- [ ] **SMTP στο Supabase Auth**, και μετά `mailer_autoconfirm = false`. Τώρα
      είναι `true` ώστε οι εγγραφές να λειτουργούν χωρίς email provider· σε
      παραγωγή θέλουμε πραγματική επιβεβαίωση email.
- [ ] Πραγματικά προϊόντα, τιμές και φωτογραφίες από το dashboard.
- [ ] Πληρωμή με κάρτα (Viva Wallet ή Stripe) — τώρα υποστηρίζονται
      αντικαταβολή και τραπεζική κατάθεση.
- [ ] Στοιχεία επικοινωνίας, ΑΦΜ και πραγματικό κείμενο στις στατικές σελίδες.
- [ ] Domain, analytics, και έλεγχος myDATA τιμολόγησης από το dashboard.
