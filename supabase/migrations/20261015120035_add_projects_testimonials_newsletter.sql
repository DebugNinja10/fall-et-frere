/*
# Add projects, testimonials, and newsletter tables

1. New Tables:
- `projects` — gallery of completed work with title, description, category, before/after image_url, completion date
- `testimonials` — customer reviews with name, rating, comment, approved status
- `newsletter` — email subscriptions for marketing

2. Security:
- projects: public read, admin write (TO authenticated)
- testimonials: public read (only approved), public insert, admin update/delete
- newsletter: public insert, admin read/delete
- RLS enabled on all tables
*/

-- ============================================================
-- PROJECTS TABLE (Galerie de réalisations)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'menuiserie',
  client_name text,
  location text,
  image_url text,
  completed_date date,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects" ON projects FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- TESTIMONIALS TABLE (Avis clients)
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  service_type text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
TO anon, authenticated USING (is_approved = true);

DROP POLICY IF EXISTS "public_insert_testimonials" ON testimonials;
CREATE POLICY "public_insert_testimonials" ON testimonials FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- NEWSLETTER TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter;
CREATE POLICY "public_insert_newsletter" ON newsletter FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_newsletter" ON newsletter;
CREATE POLICY "admin_read_newsletter" ON newsletter FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_delete_newsletter" ON newsletter;
CREATE POLICY "admin_delete_newsletter" ON newsletter FOR DELETE
TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO projects (title, description, category, client_name, location, completed_date, is_featured) VALUES
('Rénovation complète d''une maison', 'Rénovation complète incluant maçonnerie, menuiserie et installation de toutes les menuiseries extérieures et intérieures.', 'maconnerie', 'Famille Diop', 'Dakar, Plateau', '2025-09-15', true),
('Construction d''un escalier en bois', 'Fabrication et pose d''un escalier en bois massif sur mesure pour une villa moderne.', 'menuiserie', 'M. Sow', 'Dakar, Almadies', '2025-08-20', true),
('Aménagement d''un atelier', 'Création sur mesure de rangements, établis et cloisons pour un atelier professionnel.', 'menuiserie', 'Atelier Fall', 'Dakar, Médina', '2025-07-10', false),
('Dallage terrasse 200m²', 'Réalisation d''un dallage en béton armé pour une terrasse de 200m² avec finition lisse.', 'maconnerie', 'Résidence Les Baobabs', 'Thiès', '2025-06-05', true)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (customer_name, rating, comment, service_type, is_approved) VALUES
('Aminata Diallo', 5, 'Travail impeccable et dans les délais. L''équipe de FALL & frere est très professionnelle. Je recommande vivement !', 'Menuiserie', true),
('Mamadou Sow', 5, 'Excellent service pour la location de camion. Véhicule en parfait état et tarif très correct.', 'Location de camions', true),
('Fatou Ndiaye', 4, 'Bonne qualité de matériel et conseils utiles. La livraison a été un peu en retard mais tout s''est bien terminé.', 'Quincaillerie', true),
('Ibrahima Ba', 5, 'Maçonnerie de qualité pour la construction de notre maison. Très satisfaits du résultat final.', 'Maçonnerie', true)
ON CONFLICT DO NOTHING;