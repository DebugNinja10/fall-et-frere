/*
# Create full schema for quincaillerie/menuiserie/maconnerie/location camions

This migration creates the complete database for a construction/hardware business website:
- Admin authentication via Supabase auth
- Products catalog (quincaillerie)
- Services catalog (menuiserie, maconnerie)
- Trucks for rental
- Orders (product purchases)
- Quote requests
- Truck reservations

## Tables created:
1. `products` — hardware products catalog with name, description, price, category, stock, image_url
2. `services` — service offerings with name, description, price, category, image_url
3. `trucks` — rental trucks with name, description, daily_rate, capacity, availability, image_url
4. `orders` — customer orders with status tracking
5. `order_items` — individual items within an order
6. `quotes` — quote requests from customers
7. `reservations` — truck rental reservations with dates and status

## Security:
- Admin tables (products, services, trucks): public READ, admin-only WRITE via authenticated
- Orders/Quotes/Reservations: public can INSERT (customers submit), admin can READ/UPDATE/DELETE
- RLS enabled on all tables

## Notes:
- Admin access is controlled via Supabase auth — only authenticated admin users can modify catalog data
- The frontend uses anon key for public reads and customer submissions
- Admin dashboard authenticates via email/password
*/

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'quincaillerie',
  stock int NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pièce',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'menuiserie',
  duration text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- TRUCKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  daily_rate numeric(10,2) NOT NULL DEFAULT 0,
  capacity text,
  plate_number text,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_trucks" ON trucks;
CREATE POLICY "public_read_trucks" ON trucks FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_trucks" ON trucks;
CREATE POLICY "admin_insert_trucks" ON trucks FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_trucks" ON trucks;
CREATE POLICY "admin_update_trucks" ON trucks FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_trucks" ON trucks;
CREATE POLICY "admin_delete_trucks" ON trucks FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  customer_address text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_orders" ON orders;
CREATE POLICY "admin_read_orders" ON orders FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- ORDER_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_order_items" ON order_items;
CREATE POLICY "admin_read_order_items" ON order_items FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_order_items" ON order_items;
CREATE POLICY "admin_update_order_items" ON order_items FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "admin_delete_order_items" ON order_items FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- QUOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  customer_address text,
  service_type text,
  project_description text NOT NULL,
  budget numeric(10,2),
  status text NOT NULL DEFAULT 'pending',
  admin_response text,
  estimated_price numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_quotes" ON quotes;
CREATE POLICY "public_insert_quotes" ON quotes FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_quotes" ON quotes;
CREATE POLICY "admin_read_quotes" ON quotes FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_quotes" ON quotes;
CREATE POLICY "admin_update_quotes" ON quotes FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_quotes" ON quotes;
CREATE POLICY "admin_delete_quotes" ON quotes FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- RESERVATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  customer_address text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  total_cost numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_reservations" ON reservations;
CREATE POLICY "public_insert_reservations" ON reservations FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_reservations" ON reservations;
CREATE POLICY "admin_read_reservations" ON reservations FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_reservations" ON reservations;
CREATE POLICY "admin_update_reservations" ON reservations FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_reservations" ON reservations;
CREATE POLICY "admin_delete_reservations" ON reservations FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_trucks_available ON trucks(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_reservations_truck_id ON reservations(truck_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(start_date, end_date);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO products (name, description, price, category, stock, unit) VALUES
('Ciment Portland 50kg', 'Sac de ciment Portland de haute qualité pour tous vos travaux de maçonnerie', 8.50, 'maconnerie', 200, 'sac'),
('Brique creuse 20', 'Brique creuse en terre cuite, dimension 20x20x50', 1.20, 'maconnerie', 5000, 'pièce'),
('Fer à béton 12mm', 'Barre de fer à béton diamètre 12mm, longueur 12m', 8.00, 'maconnerie', 300, 'barre'),
('Quincaillerie poignée de porte', 'Poignée de porte en inox brossé, jeu de 2', 15.00, 'quincaillerie', 100, 'paire'),
('Serrure 3 points', 'Serrure de sécurité 3 points avec cylindre européen', 45.00, 'quincaillerie', 50, 'pièce'),
('Chevilles à béton M8', 'Boîte de 50 chevilles à béton M8', 12.00, 'quincaillerie', 80, 'boîte'),
('Planche de bois 22mm', 'Planche de bois massif 22mm, 15cm de largeur, 2m de long', 12.50, 'menuiserie', 150, 'planche'),
('Porte intérieure bois', 'Porte intérieure en bois prête à poser, 80x210cm', 85.00, 'menuiserie', 30, 'pièce')
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, price, category, duration) VALUES
('Fabrication de portes sur mesure', 'Conception et fabrication de portes en bois sur mesure selon vos dimensions et préférences', 250.00, 'menuiserie', '5-10 jours'),
('Pose de fenêtres', 'Installation de fenêtres en bois, aluminium ou PVC par nos menuisiers qualifiés', 120.00, 'menuiserie', '1-2 jours'),
('Construction de meubles', 'Fabrication de meubles sur mesure: cuisines, placards, bureaux', 500.00, 'menuiserie', '2-3 semaines'),
('Gros œuvre maçonnerie', 'Construction de fondations, murs et structures en béton armé', 150.00, 'maconnerie', 'Variable'),
('Création de dallage', 'Réalisation de dalles en béton pour terrasses, garages, parkings', 80.00, 'maconnerie', '3-5 jours'),
('Rénovation de façade', 'Rénovation complète de façade: nettoyage, réparation et finition', 200.00, 'maconnerie', '1-2 semaines')
ON CONFLICT DO NOTHING;

INSERT INTO trucks (name, description, daily_rate, capacity, plate_number) VALUES
('Camion 3.5T Plateau', 'Camion plateau 3.5 tonnes, idéal pour le transport de matériaux de construction', 85.00, '3.5 tonnes', 'AB-123-CD'),
('Camion 7T Benne', 'Camion benne 7 tonnes pour évacuation de gravats et transport de sable/gravier', 120.00, '7 tonnes', 'EF-456-GH'),
('Fourgon 12m³', 'Fourgon utilitaire 12m³, parfait pour déménagement et livraison', 70.00, '12 m³', 'IJ-789-KL'),
('Camion 19T Grue', 'Camion 19 tonnes équipé d''une grue pour le levage de charges lourdes', 180.00, '19 tonnes', 'MN-012-OP')
ON CONFLICT DO NOTHING;