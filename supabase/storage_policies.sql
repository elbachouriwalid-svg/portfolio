-- =====================================================
-- STORAGE POLICIES — Fix complet uploads
-- Coller dans Supabase SQL Editor → Run
-- =====================================================

-- S'assurer que les buckets existent et sont publics
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('cv',             'cv',             true, 52428800,  ARRAY['application/pdf']),
  ('images',         'images',         true, 10485760,  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']),
  ('documents',      'documents',      true, 52428800,  NULL),
  ('certifications', 'certifications', true, 10485760,  ARRAY['image/jpeg','image/jpg','image/png','image/webp']),
  ('diplomas',       'diplomas',       true, 10485760,  ARRAY['image/jpeg','image/jpg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- ── Supprime les anciennes policies conflictuelles ────
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- ── Lecture publique (tout le monde peut voir les fichiers) ──
CREATE POLICY "storage_public_read"
ON storage.objects FOR SELECT
USING (true);

-- ── Upload : utilisateurs authentifiés seulement ─────
CREATE POLICY "storage_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (true);

-- ── Mise à jour : utilisateurs authentifiés seulement ─
CREATE POLICY "storage_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (true);

-- ── Suppression : utilisateurs authentifiés seulement ─
CREATE POLICY "storage_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (true);
