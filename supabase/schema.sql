-- =====================================================
-- PORTFOLIO WALID EL BACHOURI — SCHÉMA SUPABASE
-- Copier-coller dans l'éditeur SQL de Supabase
-- =====================================================

-- ── 1. PROFIL (1 seule ligne) ─────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_fr TEXT DEFAULT '',
  vision_en TEXT DEFAULT '',
  objectives_fr TEXT DEFAULT '',
  objectives_en TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  location TEXT DEFAULT 'Maroc',
  portrait_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. EXPÉRIENCES ────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  location TEXT DEFAULT '',
  period_start TEXT DEFAULT '',
  period_end TEXT DEFAULT '',
  is_current BOOLEAN DEFAULT false,
  description_fr TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 3. INCIDENTS (TROUBLESHOOTING) ───────────────
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  domain TEXT NOT NULL DEFAULT 'Électrique',
  criticality TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'resolved',
  site TEXT NOT NULL DEFAULT 'IMACAB',
  downtime INT DEFAULT 0,
  symptoms_fr TEXT DEFAULT '',
  symptoms_en TEXT DEFAULT '',
  root_cause_fr TEXT DEFAULT '',
  root_cause_en TEXT DEFAULT '',
  solution_fr TEXT DEFAULT '',
  solution_en TEXT DEFAULT '',
  lessons_fr TEXT DEFAULT '',
  lessons_en TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 4. DIPLÔMES ───────────────────────────────────
CREATE TABLE IF NOT EXISTS diplomas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  period_start TEXT DEFAULT '',
  period_end TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  knowledge TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 5. CERTIFICATIONS ─────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  date TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 6. DOCUMENTS (BIBLIOTHÈQUE) ───────────────────
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  section TEXT NOT NULL DEFAULT 'Mes Recherches',
  domain TEXT NOT NULL DEFAULT 'Automatisation',
  file_url TEXT DEFAULT '',
  file_size TEXT DEFAULT '',
  access_type TEXT DEFAULT 'public',
  description_fr TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 7. STATISTIQUES ───────────────────────────────
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value INT DEFAULT 0,
  label_fr TEXT DEFAULT '',
  label_en TEXT DEFAULT '',
  suffix TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Données initiales ─────────────────────────────
INSERT INTO stats (key, value, label_fr, label_en, suffix, sort_order) VALUES
  ('incidents_resolved', 120, 'Incidents Résolus', 'Resolved Incidents', '+', 1),
  ('certifications',       8, 'Certifications',    'Certifications',     '',  2),
  ('experience_years',     4, 'Années d''Expérience', 'Years of Experience', '', 3),
  ('technologies',        15, 'Technologies Maîtrisées', 'Technologies Mastered', '+', 4)
ON CONFLICT (key) DO NOTHING;

INSERT INTO profile (vision_fr, vision_en, objectives_fr, objectives_en, phone, email, linkedin, location)
VALUES (
  'Technicien électromécanique industriel avec une expertise terrain acquise dans des environnements de production exigeants. Spécialisé dans la maintenance préventive et corrective, l''automatisation des processus industriels et le diagnostic des systèmes complexes.',
  'Industrial electromechanical technician with field expertise acquired in demanding production environments. Specialized in preventive and corrective maintenance, industrial process automation and complex systems diagnostics.',
  'Contribuer à l''évolution vers l''Industrie 4.0 en combinant expertise technique traditionnelle et adoption des technologies intelligentes.',
  'Contribute to the evolution towards Industry 4.0 by combining traditional technical expertise with smart technology adoption.',
  '+212 6XX XXX XXX',
  'walid.elbachouri@email.com',
  'linkedin.com/in/walid-el-bachouri',
  'Maroc'
);

-- ── RLS (Row Level Security) ──────────────────────
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE diplomas ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Lecture publique (visiteurs du site)
CREATE POLICY "read_profile"        ON profile        FOR SELECT USING (true);
CREATE POLICY "read_experiences"    ON experiences    FOR SELECT USING (true);
CREATE POLICY "read_incidents"      ON incidents      FOR SELECT USING (true);
CREATE POLICY "read_diplomas"       ON diplomas       FOR SELECT USING (true);
CREATE POLICY "read_certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "read_documents"      ON documents      FOR SELECT USING (true);
CREATE POLICY "read_stats"          ON stats          FOR SELECT USING (true);

-- Écriture admin (utilisateur authentifié uniquement)
CREATE POLICY "write_profile"        ON profile        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_experiences"    ON experiences    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_incidents"      ON incidents      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_diplomas"       ON diplomas       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_documents"      ON documents      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_stats"          ON stats          FOR ALL USING (auth.role() = 'authenticated');

-- ══════════════════════════════════════════════════
-- STORAGE — Créer ces buckets manuellement dans
-- Supabase > Storage > New bucket (Public = true)
-- ══════════════════════════════════════════════════
-- • cv            → CV et carte de visite PDF
-- • images        → Photo portrait
-- • documents     → Fichiers bibliothèque technique
-- • certifications → Images des certifications
-- • diplomas      → Images des diplômes
