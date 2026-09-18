-- ============================================================================
-- just4pets — pet shop demo seed (repeatable)
-- Catalog: on conflict do nothing. Content tables (hero, tiles, collections,
-- partners, menu, shipping, pages, blog): delete + reinsert (dashboard-owned,
-- safe while in demo phase).
-- Εικόνες: paths σε product-images / storefront-content buckets (ανεβαίνουν χωριστά).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Κατηγορίες (top level: 6 ζώα, όπως οι κύκλοι του design)
-- ----------------------------------------------------------------------------
insert into store.categories (name, slug, position, image_path) values
  ('Σκύλος',     'skylos',    1, 'categories/skylos.jpg'),
  ('Γάτα',       'gata',      2, 'categories/gata.jpg'),
  ('Μικρά ζώα',  'mikra-zoa', 3, 'categories/mikra-zoa.jpg'),
  ('Πτηνά',      'ptina',     4, 'categories/ptina.jpg'),
  ('Ψάρια',      'psaria',    5, 'categories/psaria.jpg'),
  ('Ερπετά',     'erpeta',    6, 'categories/erpeta.jpg')
on conflict (slug) do nothing;

-- Ερπετά: εκτός κύριου nav (όπως στο design), ορατά στους κύκλους
update store.categories set show_in_nav = false where slug = 'erpeta';

insert into store.categories (name, slug, parent_id, position)
select v.name, v.slug, c.id, v.pos from (values
  ('Τροφές σκύλου',    'trofes-skylou',   'skylos', 1),
  ('Σαμαράκια',        'samarakia',       'skylos', 2),
  ('Αξεσουάρ βόλτας',  'aksesouar-voltas','skylos', 3),
  ('Παιχνίδια',        'paixnidia-skylou','skylos', 4),
  ('Μπολ & ταΐστρες',  'bol-taistres',    'skylos', 5),
  ('Περιποίηση',       'peripoiisi',      'skylos', 6),
  ('Κρεβατάκια',       'krevatakia',      'skylos', 7),
  ('Τροφές γάτας',     'trofes-gatas',    'gata',   1),
  ('Ονυχοδρόμια',      'onyxodromia',     'gata',   2),
  ('Άμμος υγιεινής',   'ammos',           'gata',   3),
  ('Συντριβάνια',      'syntrivania',     'gata',   4),
  ('Λιχουδιές',        'lixoudies',       'skylos', 8)
) as v(name, slug, parent, pos)
join store.categories c on c.slug = v.parent
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Προϊόντα
-- ----------------------------------------------------------------------------
insert into store.products (title, slug, description, status, vendor, product_type, tags) values
  ('Royal Canin Adult Medium', 'royal-canin-adult-medium',
   'Πλήρης ξηρά τροφή για ενήλικους σκύλους μεσαίου μεγέθους (11–25 kg). Ισορροπημένη σύνθεση για υγιή πέψη, λαμπερό τρίχωμα και καθημερινή ζωτικότητα.',
   'active', 'Royal Canin', 'Τροφή σκύλου', '{δημοφιλή,σκύλος}'),
  ('Applaws Chicken', 'applaws-chicken',
   'Πλήρης τροφή για γάτες με 75% φρέσκο κοτόπουλο. Χωρίς σιτηρά, πλούσια σε πρωτεΐνη, για γεύμα που λατρεύουν ακόμα και οι πιο απαιτητικές γάτες.',
   'active', 'Applaws', 'Τροφή γάτας', '{δημοφιλή,γάτα}'),
  ('Κεραμικό μπολ', 'keramiko-bol',
   'Κεραμικό μπολ φαγητού σε απαλό πράσινο της ελιάς με σχέδιο πατούσας. Βαρύ και σταθερό, δεν γλιστράει, πλένεται στο πλυντήριο πιάτων.',
   'active', 'Petshop', 'Μπολ & ταΐστρες', '{δημοφιλή,σκύλος}'),
  ('Παιχνίδι σχοινί', 'paixnidi-sxoini',
   'Ανθεκτικό πλεκτό παιχνίδι από βαμβακερό σχοινί σε ζωηρό πορτοκαλί. Ιδανικό για τράβηγμα και μάσημα — καθαρίζει απαλά τα δόντια στο παιχνίδι.',
   'active', 'Petshop', 'Παιχνίδια', '{δημοφιλή,σκύλος}'),
  ('Σαμαράκι άνεσης', 'samaraki-anesis',
   'Για μικρές βόλτες και μεγάλες περιπέτειες. Κατασκευασμένο από ανθεκτικό και αναπνεύσιμο ύφασμα, με μαλακή επένδυση που αγκαλιάζει απαλά το σώμα του σκύλου σου. Διαθέτει ρυθμιζόμενους ιμάντες για σταθερή και άνετη εφαρμογή, καθώς και πρακτικό κρίκο για τον οδηγό. Ιδανικό για καθημερινή χρήση, από τις σύντομες βόλτες στη γειτονιά μέχρι τις μεγαλύτερες περιπέτειες στη φύση.',
   'active', 'Petshop', 'Σαμαράκια', '{νέο,σκύλος,βόλτα}'),
  ('Συντριβάνι νερού', 'syntrivani-nerou',
   'Συντριβάνι νερού 2L με αθόρυβη αντλία και φίλτρο άνθρακα. Το τρεχούμενο νερό ενθαρρύνει τη γάτα να πίνει περισσότερο — καλύτερη ενυδάτωση κάθε μέρα.',
   'active', 'Petshop', 'Συντριβάνια', '{νέο,γάτα}'),
  ('Ονυχοδρόμιο γάτας', 'onyxodromio-gatas',
   'Ονυχοδρόμιο δύο επιπέδων με επένδυση σιζάλ και βελούδινη πλατφόρμα. Προστατεύει τα έπιπλα και χαρίζει στη γάτα το δικό της σημείο ξεκούρασης.',
   'active', 'Petshop', 'Ονυχοδρόμια', '{νέο,γάτα}'),
  ('Λιχουδιές επιβράβευσης', 'lixoudies-epivravefsis',
   'Barkly Training Treats — μαλακές λιχουδιές εκπαίδευσης με κοτόπουλο, σε πρακτική επαναδιπλούμενη συσκευασία. Μικρές μπουκιές, μεγάλη παρακίνηση.',
   'active', 'Barkly', 'Λιχουδιές', '{νέο,σκύλος,βόλτα}'),
  ('Οδηγός βόλτας', 'odigos-voltas',
   'Οδηγός βόλτας 120 cm από μαλακό υφασμάτινο ιμάντα με ενισχυμένο μεταλλικό κρίκο. Συνδυάζεται ιδανικά με το σαμαράκι άνεσης.',
   'active', 'Petshop', 'Αξεσουάρ βόλτας', '{σκύλος,βόλτα}'),
  ('Θήκη για σακουλάκια', 'thiki-sakoulakia',
   'Θήκη σιλικόνης για σακουλάκια υγιεινής με καραμπίνερ για το λουρί. Περιλαμβάνει ένα ρολό — πάντα έτοιμος για τη βόλτα.',
   'active', 'Petshop', 'Αξεσουάρ βόλτας', '{σκύλος,βόλτα}'),
  ('Royal Canin Kitten', 'royal-canin-kitten',
   'Πλήρης τροφή για γατάκια έως 12 μηνών. Στηρίζει το ανοσοποιητικό και την υγιή ανάπτυξη με ισορροπημένα θρεπτικά συστατικά.',
   'active', 'Royal Canin', 'Τροφή γάτας', '{γάτα}'),
  ('Κρεβατάκι donut', 'krevataki-donut',
   'Αφράτο κρεβατάκι σε σχήμα donut από απαλό βελούδο. Αγκαλιάζει το σώμα και προσφέρει αίσθηση ασφάλειας — το τέλειο happy place.',
   'active', 'Petshop', 'Κρεβατάκια', '{σκύλος,γάτα}'),
  ('Άμμος υγιεινής clumping', 'ammos-clumping',
   'Συγκολλητική άμμος υγιεινής 10L χωρίς άρωμα. Γρήγορη απορρόφηση, εύκολος καθαρισμός, λιγότερη σκόνη.',
   'active', 'Petshop', 'Άμμος υγιεινής', '{γάτα}'),
  ('Τροφή για κουνέλια', 'trofi-kounelia',
   'Ισορροπημένο μείγμα με χόρτα λιβαδιού και λαχανικά για κουνέλια και τρωκτικά. Πλούσιο σε φυτικές ίνες για υγιή πέψη.',
   'active', 'Petshop', 'Τροφή μικρών ζώων', '{μικρά-ζώα}'),
  ('Κλουβί πτηνών', 'klouvi-ptinon',
   'Ευρύχωρο κλουβί για παπαγαλάκια και καναρίνια με δύο ξύλινες πατήθρες, ταΐστρες και συρόμενο δίσκο καθαρισμού.',
   'active', 'Petshop', 'Κλουβιά', '{πτηνά}'),
  ('Νιφάδες τροπικών ψαριών', 'nifades-psarion',
   'Πλήρης τροφή σε νιφάδες για τροπικά ψάρια ενυδρείου. Ενισχύει τα φυσικά χρώματα και δεν θολώνει το νερό.',
   'active', 'Petshop', 'Τροφή ψαριών', '{ψάρια}'),
  ('Λάμπα θέρμανσης ερπετών', 'lampa-thermansis',
   'Λάμπα θέρμανσης 50W για terrarium με σταθερή απόδοση θερμότητας. Απαραίτητη για τη σωστή θερμορύθμιση ερπετών.',
   'active', 'Petshop', 'Εξοπλισμός terrarium', '{ερπετά}'),
  ('Σαμπουάν απαλής φροντίδας', 'sampouan-frontidas',
   'Σαμπουάν με βρώμη και aloe vera για ευαίσθητο δέρμα. Απαλό καθάρισμα, λαμπερό τρίχωμα, ουδέτερο pH για σκύλους.',
   'active', 'Petshop', 'Περιποίηση', '{σκύλος,grooming}')
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Variants
-- ----------------------------------------------------------------------------
-- Σαμαράκι άνεσης: 3 χρώματα × 4 μεγέθη
insert into store.product_variants (product_id, sku, title, options, price, compare_at_price, inventory_quantity, position)
select p.id,
       'HARN-' || c.code || '-' || s.size,
       c.name || ' / ' || s.size,
       jsonb_build_object('Χρώμα', c.name, 'Μέγεθος', s.size),
       22.90, null, 8,
       (c.pos - 1) * 4 + s.pos
from store.products p
cross join (values ('LIL', 'Λιλά', 1), ('SAG', 'Φυστικί', 2), ('CHA', 'Ανθρακί', 3)) as c(code, name, pos)
cross join (values ('XS', 1), ('S', 2), ('M', 3), ('L', 4)) as s(size, pos)
where p.slug = 'samaraki-anesis'
on conflict (sku) do nothing;

-- Οδηγός βόλτας: 3 χρώματα
insert into store.product_variants (product_id, sku, title, options, price, inventory_quantity, position)
select p.id, 'LEASH-' || c.code, c.name, jsonb_build_object('Χρώμα', c.name), 14.90, 12, c.pos
from store.products p
cross join (values ('LIL', 'Λιλά', 1), ('GRN', 'Πράσινο', 2), ('ORN', 'Πορτοκαλί', 3)) as c(code, name, pos)
where p.slug = 'odigos-voltas'
on conflict (sku) do nothing;

-- Υπόλοιπα: ένα default variant το καθένα
insert into store.product_variants (product_id, sku, price, compare_at_price, inventory_quantity)
select p.id, v.sku, v.price, v.cmp, v.qty
from (values
  ('royal-canin-adult-medium', 'RC-ADULT-MED',  24.90, null::numeric, 25),
  ('applaws-chicken',          'APL-CHICK',     19.90, null,          30),
  ('keramiko-bol',             'BOWL-CER-GRN',  14.50, null,          18),
  ('paixnidi-sxoini',          'TOY-ROPE-ORN',   8.90, null,          40),
  ('syntrivani-nerou',         'FOUNT-2L',      39.90, null,          10),
  ('onyxodromio-gatas',        'SCRATCH-2LVL',  34.50, null,           7),
  ('lixoudies-epivravefsis',   'BRK-TREATS',     5.90, null,          60),
  ('thiki-sakoulakia',         'BAG-HOLDER',     6.90, null,          35),
  ('royal-canin-kitten',       'RC-KITTEN',     21.90, null,          20),
  ('krevataki-donut',          'BED-DONUT',     44.90, 49.90,          9),
  ('ammos-clumping',           'LITTER-10L',    12.90, null,          22),
  ('trofi-kounelia',           'RABBIT-FOOD',    9.90, null,          15),
  ('klouvi-ptinon',            'BIRD-CAGE',     49.90, null,           5),
  ('nifades-psarion',          'FISH-FLAKES',    7.90, null,          28),
  ('lampa-thermansis',         'REPT-LAMP-50',  29.90, null,           8),
  ('sampouan-frontidas',       'SHAMP-OAT',     11.90, null,          26)
) as v(slug, sku, price, cmp, qty)
join store.products p on p.slug = v.slug
on conflict (sku) do nothing;

-- ----------------------------------------------------------------------------
-- Εικόνες προϊόντων (paths στο bucket product-images)
-- ----------------------------------------------------------------------------
delete from store.product_images where product_id in (select id from store.products);
insert into store.product_images (product_id, storage_path, alt_text, position)
select p.id, 'products/' || p.slug || '/' || v.n || '.jpg', p.title, v.n
from store.products p
cross join (values (0), (1), (2), (3)) as v(n)
where p.slug = 'samaraki-anesis'
union all
select p.id, 'products/' || p.slug || '/0.jpg', p.title, 0
from store.products p
where p.slug <> 'samaraki-anesis';

-- ----------------------------------------------------------------------------
-- Σύνδεση προϊόντων ↔ κατηγοριών
-- ----------------------------------------------------------------------------
insert into store.product_categories (product_id, category_id)
select p.id, c.id from (values
  ('royal-canin-adult-medium', 'trofes-skylou'),
  ('royal-canin-adult-medium', 'skylos'),
  ('applaws-chicken',          'trofes-gatas'),
  ('applaws-chicken',          'gata'),
  ('keramiko-bol',             'bol-taistres'),
  ('keramiko-bol',             'skylos'),
  ('paixnidi-sxoini',          'paixnidia-skylou'),
  ('paixnidi-sxoini',          'skylos'),
  ('samaraki-anesis',          'samarakia'),
  ('samaraki-anesis',          'skylos'),
  ('syntrivani-nerou',         'syntrivania'),
  ('syntrivani-nerou',         'gata'),
  ('onyxodromio-gatas',        'onyxodromia'),
  ('onyxodromio-gatas',        'gata'),
  ('lixoudies-epivravefsis',   'lixoudies'),
  ('lixoudies-epivravefsis',   'skylos'),
  ('odigos-voltas',            'aksesouar-voltas'),
  ('odigos-voltas',            'skylos'),
  ('thiki-sakoulakia',         'aksesouar-voltas'),
  ('thiki-sakoulakia',         'skylos'),
  ('royal-canin-kitten',       'trofes-gatas'),
  ('royal-canin-kitten',       'gata'),
  ('krevataki-donut',          'krevatakia'),
  ('krevataki-donut',          'skylos'),
  ('ammos-clumping',           'ammos'),
  ('ammos-clumping',           'gata'),
  ('trofi-kounelia',           'mikra-zoa'),
  ('klouvi-ptinon',            'ptina'),
  ('nifades-psarion',          'psaria'),
  ('lampa-thermansis',         'erpeta'),
  ('sampouan-frontidas',       'peripoiisi'),
  ('sampouan-frontidas',       'skylos')
) as v(pslug, cslug)
join store.products p on p.slug = v.pslug
join store.categories c on c.slug = v.cslug
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Collections (homepage tabs + New Products)
-- ----------------------------------------------------------------------------
delete from store.collection_products;
delete from store.collections;
insert into store.collections (title, position, active) values
  ('Δημοφιλή',     1, true),
  ('Σκύλος',       2, true),
  ('Γάτα',         3, true),
  ('Νέα προϊόντα', 4, true);

insert into store.collection_products (collection_id, product_id, position)
select col.id, p.id, v.pos from (values
  ('Δημοφιλή', 'royal-canin-adult-medium', 1),
  ('Δημοφιλή', 'applaws-chicken',          2),
  ('Δημοφιλή', 'keramiko-bol',             3),
  ('Δημοφιλή', 'paixnidi-sxoini',          4),
  ('Σκύλος',   'royal-canin-adult-medium', 1),
  ('Σκύλος',   'samaraki-anesis',          2),
  ('Σκύλος',   'krevataki-donut',          3),
  ('Σκύλος',   'lixoudies-epivravefsis',   4),
  ('Γάτα',     'applaws-chicken',          1),
  ('Γάτα',     'syntrivani-nerou',         2),
  ('Γάτα',     'onyxodromio-gatas',        3),
  ('Γάτα',     'royal-canin-kitten',       4),
  ('Νέα προϊόντα', 'samaraki-anesis',        1),
  ('Νέα προϊόντα', 'syntrivani-nerou',       2),
  ('Νέα προϊόντα', 'onyxodromio-gatas',      3),
  ('Νέα προϊόντα', 'lixoudies-epivravefsis', 4)
) as v(ctitle, pslug, pos)
join store.collections col on col.title = v.ctitle
join store.products p on p.slug = v.pslug;

-- ----------------------------------------------------------------------------
-- Hero, homepage tiles, partners
-- ----------------------------------------------------------------------------
delete from store.hero_slides;
insert into store.hero_slides (image_path, alt_text, heading, subheading, cta_label, cta_url, position, active) values
  ('hero/hero-main.jpg', 'Σκύλος και γάτα αγκαλιά',
   'Η ευτυχία τους, ξεκινά εδώ.',
   'Όλα όσα χρειάζεται ο καλύτερός σου φίλος.',
   'Βρες τα αγαπημένα του', '/katigoria/skylos', 1, true);

delete from store.homepage_categories;
insert into store.homepage_categories (label, image_path, url, position, active) values
  ('Σκύλος',    'categories/skylos.jpg',    '/katigoria/skylos',    1, true),
  ('Γάτα',      'categories/gata.jpg',      '/katigoria/gata',      2, true),
  ('Μικρά ζώα', 'categories/mikra-zoa.jpg', '/katigoria/mikra-zoa', 3, true),
  ('Πτηνά',     'categories/ptina.jpg',     '/katigoria/ptina',     4, true),
  ('Ψάρια',     'categories/psaria.jpg',    '/katigoria/psaria',    5, true),
  ('Ερπετά',    'categories/erpeta.jpg',    '/katigoria/erpeta',    6, true);

delete from store.partners;
insert into store.partners (name, logo_path, position, active) values
  ('Royal Canin',     'partners/royal-canin.svg', 1, true),
  ('Hill''s',         'partners/hills.svg',       2, true),
  ('Purina Pro Plan', 'partners/proplan.svg',     3, true),
  ('Acana',           'partners/acana.svg',       4, true),
  ('Kong',            'partners/kong.svg',        5, true),
  ('Trixie',          'partners/trixie.svg',      6, true);

-- ----------------------------------------------------------------------------
-- Mega menu (top nav: Σκύλος, Γάτα, Μικρά ζώα, Πτηνά, Ψάρια, Brands)
-- ----------------------------------------------------------------------------
delete from store.menu_links;
delete from store.menu_columns;
delete from store.menu_categories;
insert into store.menu_categories (label, url, position, active) values
  ('Σκύλος',    '/katigoria/skylos',    1, true),
  ('Γάτα',      '/katigoria/gata',      2, true),
  ('Μικρά ζώα', '/katigoria/mikra-zoa', 3, true),
  ('Πτηνά',     '/katigoria/ptina',     4, true),
  ('Ψάρια',     '/katigoria/psaria',    5, true),
  ('Brands',    '/brands',              6, true);

insert into store.menu_columns (category_id, title, url, position)
select m.id, v.title, v.url, v.pos from (values
  ('Σκύλος', 'Τροφές',            '/katigoria/trofes-skylou',    1),
  ('Σκύλος', 'Βόλτα & αξεσουάρ',  '/katigoria/aksesouar-voltas', 2),
  ('Σκύλος', 'Παιχνίδια & άνεση', '/katigoria/paixnidia-skylou', 3),
  ('Γάτα',   'Τροφές',            '/katigoria/trofes-gatas',     1),
  ('Γάτα',   'Σπίτι & άνεση',     '/katigoria/onyxodromia',      2)
) as v(mlabel, title, url, pos)
join store.menu_categories m on m.label = v.mlabel;

insert into store.menu_links (column_id, label, url, position)
select col.id, v.label, v.url, v.pos from (values
  ('Τροφές',            '/katigoria/trofes-skylou',    'Ξηρά τροφή',        '/katigoria/trofes-skylou',   1),
  ('Τροφές',            '/katigoria/trofes-skylou',    'Λιχουδιές',         '/katigoria/lixoudies',       2),
  ('Βόλτα & αξεσουάρ',  '/katigoria/aksesouar-voltas', 'Σαμαράκια',         '/katigoria/samarakia',       1),
  ('Βόλτα & αξεσουάρ',  '/katigoria/aksesouar-voltas', 'Οδηγοί & λουριά',   '/katigoria/aksesouar-voltas',2),
  ('Παιχνίδια & άνεση', '/katigoria/paixnidia-skylou', 'Παιχνίδια',         '/katigoria/paixnidia-skylou',1),
  ('Παιχνίδια & άνεση', '/katigoria/paixnidia-skylou', 'Κρεβατάκια',        '/katigoria/krevatakia',      2),
  ('Παιχνίδια & άνεση', '/katigoria/paixnidia-skylou', 'Περιποίηση',        '/katigoria/peripoiisi',      3),
  ('Τροφές',            '/katigoria/trofes-gatas',     'Ξηρά & υγρή τροφή', '/katigoria/trofes-gatas',    1),
  ('Σπίτι & άνεση',     '/katigoria/onyxodromia',      'Ονυχοδρόμια',       '/katigoria/onyxodromia',     1),
  ('Σπίτι & άνεση',     '/katigoria/onyxodromia',      'Άμμος υγιεινής',    '/katigoria/ammos',           2),
  ('Σπίτι & άνεση',     '/katigoria/onyxodromia',      'Συντριβάνια',       '/katigoria/syntrivania',     3)
) as v(ctitle, curl, label, url, pos)
join store.menu_columns col on col.title = v.ctitle and col.url = v.curl;

-- ----------------------------------------------------------------------------
-- Μεταφορικά: Ελλάδα, courier 3,50€, δωρεάν άνω των 39€
-- ----------------------------------------------------------------------------
delete from store.shipping_rates;
delete from store.shipping_zones;
insert into store.shipping_zones (name, country_codes, position) values ('Ελλάδα', '{GR}', 1);
insert into store.shipping_rates (zone_id, name, carrier, rate_type, price, modifier_value, active, position)
select z.id, 'Παράδοση με courier', 'acs', 'by_cart_value', 3.50, 39.00, true, 1
from store.shipping_zones z where z.name = 'Ελλάδα';

-- ----------------------------------------------------------------------------
-- Σελίδες & blog
-- ----------------------------------------------------------------------------
delete from store.pages;
insert into store.pages (slug, title, content, status) values
  ('sxetika-me-emas', 'Σχετικά με εμάς', E'## Μαζί, σε κάθε πατούσα.\n\nΤο pet shop ξεκίνησε από την αγάπη μας για τα ζώα. Επιλέγουμε προσεκτικά κάθε προϊόν ώστε κάθε κατοικίδιο να έχει ό,τι χρειάζεται για μια χαρούμενη, υγιή ζωή.', 'published'),
  ('apostoles', 'Αποστολές', E'Παράδοση με courier σε όλη την Ελλάδα σε 1–3 εργάσιμες. Κόστος 3,50 € — **δωρεάν από 39 € και πάνω**.', 'published'),
  ('epistrofes', 'Επιστροφές & αλλαγές', E'Έχεις 14 ημέρες για επιστροφή ή αλλαγή, αρκεί το προϊόν να είναι στην αρχική του κατάσταση. Επικοινώνησε μαζί μας και θα το τακτοποιήσουμε άμεσα.', 'published'),
  ('syxnes-erotiseis', 'Συχνές ερωτήσεις', E'**Πότε θα παραλάβω την παραγγελία μου;** Σε 1–3 εργάσιμες.\n\n**Πώς πληρώνω;** Με αντικαταβολή ή τραπεζική κατάθεση.\n\n**Κάνετε αλλαγές;** Ναι, εντός 14 ημερών.', 'published'),
  ('oroi-xrisis', 'Όροι χρήσης', 'Οι παρόντες όροι διέπουν τη χρήση του ηλεκτρονικού καταστήματος pet shop.', 'published'),
  ('politiki-aporritou', 'Πολιτική απορρήτου', 'Σεβόμαστε τα προσωπικά σας δεδομένα και τα επεξεργαζόμαστε σύμφωνα με τον GDPR.', 'published'),
  ('epikoinonia', 'Επικοινωνία', E'Τηλέφωνο: 210 000 0000\n\nEmail: hello@petshop.gr\n\nΔευτέρα–Παρασκευή 9:00–17:00', 'published');

delete from store.blog_posts;
insert into store.blog_posts (slug, title, excerpt, content, cover_image, author, status, published_at) values
  ('pos-epilego-ti-sosti-trofi', 'Πώς επιλέγω τη σωστή τροφή;',
   'Όσα πρέπει να ξέρεις για ηλικία, μέγεθος και διατροφικές ανάγκες πριν γεμίσεις το μπολ.',
   E'Η σωστή τροφή εξαρτάται από την ηλικία, το μέγεθος και το επίπεδο δραστηριότητας του κατοικιδίου σου. Ένα κουτάβι μεγαλόσωμης φυλής έχει εντελώς διαφορετικές ανάγκες από έναν ηλικιωμένο σκύλο μικρού μεγέθους.\n\nΣυμβουλέψου πάντα τον κτηνίατρό σου πριν από μεγάλες αλλαγές στη διατροφή, και κάνε τη μετάβαση σταδιακά μέσα σε 7–10 ημέρες.',
   'blog/trofi.jpg', 'Ομάδα pet shop', 'published', now() - interval '3 days'),
  ('ena-spiti-sta-metra-tis-gatas', 'Ένα σπίτι στα μέτρα της γάτας σου',
   'Πρακτικές ιδέες για ένα σπίτι που σέβεται τις ανάγκες της — από το ονυχοδρόμιο ως τη γωνιά ηρεμίας.',
   E'Οι γάτες χρειάζονται κάθετο χώρο, σημεία απόσυρσης και σταθερή ρουτίνα. Ένα ονυχοδρόμιο σε κεντρικό σημείο, ένα κρεβατάκι σε ήσυχη γωνιά και καθαρή άμμος μακριά από το φαγητό κάνουν τη διαφορά.\n\nΘυμήσου: η γάτα δεν είναι μικρός σκύλος — έχει τους δικούς της κανόνες.',
   'blog/gata-spiti.jpg', 'Ομάδα pet shop', 'published', now() - interval '7 days'),
  ('i-kathimerini-volta-ginetai-apolafsi', 'Η καθημερινή βόλτα γίνεται απόλαυση',
   'Tips για ασφαλείς και διασκεδαστικές εξορμήσεις με τον σκύλο σου, με το σωστό εξοπλισμό.',
   E'Ένα σαμαράκι που εφαρμόζει σωστά, ένας γερός οδηγός και σακουλάκια πάντα πρόχειρα — αυτή είναι η βασική εξάρτυση. Μέτρησε την περίμετρο του στήθους πριν επιλέξεις μέγεθος και άφησε χώρο για δύο δάχτυλα κάτω από τους ιμάντες.\n\nΞεκίνα με κοντινές διαδρομές και επιβράβευσε ήρεμη συμπεριφορά με λιχουδιές.',
   'blog/volta.jpg', 'Ομάδα pet shop', 'published', now() - interval '12 days');
