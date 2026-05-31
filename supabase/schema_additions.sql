-- =====================================================
-- ADDITIONS AU SCHÉMA — v2
-- Coller dans Supabase SQL Editor et cliquer Run
-- =====================================================

-- ── Nouvelles colonnes dans profile ───────────────
ALTER TABLE profile ADD COLUMN IF NOT EXISTS vision_title_fr TEXT DEFAULT 'Vision Professionnelle';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS vision_title_en TEXT DEFAULT 'Professional Vision';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_intro_fr TEXT DEFAULT 'Opérant à l''intersection de la maintenance, de l''automatisation et de l''intelligence industrielle. Spécialiste des environnements de production modernes et des technologies Industrie 4.0.';
ALTER TABLE profile ADD COLUMN IF NOT EXISTS hero_intro_en TEXT DEFAULT 'Operating at the intersection of maintenance, automation and industrial intelligence. Specialist in modern production environments and Industry 4.0 technologies.';

-- ── Compétences ────────────────────────────────────
CREATE TABLE IF NOT EXISTS competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL DEFAULT '',
  name_en TEXT DEFAULT '',
  current_level INT DEFAULT 0,
  target_level INT DEFAULT 0,
  category TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO competencies (name_fr, name_en, current_level, target_level, category, sort_order) VALUES
  ('Électrotechnique', 'Electrotechnics', 90, 95, 'Électrique', 1),
  ('Automatisation API', 'PLC Automation', 70, 90, 'Automatisation', 2),
  ('Réseaux Industriels', 'Industrial Networks', 65, 85, 'Réseaux', 3),
  ('Maintenance Préventive', 'Preventive Maintenance', 85, 95, 'Maintenance', 4),
  ('Pneumatique / Hydraulique', 'Pneumatics / Hydraulics', 75, 85, 'Mécanique', 5),
  ('Industrie 4.0 / IIoT', 'Industry 4.0 / IIoT', 45, 80, 'Numérique', 6)
ON CONFLICT DO NOTHING;

-- ── Processus Industriels ──────────────────────────
CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL DEFAULT '',
  name_en TEXT DEFAULT '',
  company TEXT DEFAULT '',
  description_fr TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO processes (name_fr, name_en, company, description_fr, sort_order) VALUES
  ('Injection Plastique', 'Plastic Injection', 'SICDA', 'Maintenance des presses à injection plastique, gestion des alarmes, réglage des paramètres process (température, pression, vitesse).', 1),
  ('Extrusion Plastique', 'Plastic Extrusion', 'SICDA', 'Maintenance des lignes d''extrusion, changement de filières, contrôle des variateurs de fréquence et des systèmes de régulation thermique.', 2),
  ('Tréfilage Cuivre', 'Copper Drawing', 'IMACAB', 'Maintenance des bancs de tréfilage cuivre, réglage des filières, contrôle des systèmes de lubrification et des capteurs de tension.', 3),
  ('Tréfilage Aluminium', 'Aluminium Drawing', 'IMACAB', 'Maintenance des lignes de tréfilage aluminium, gestion des systèmes de recuit et contrôle des paramètres mécaniques.', 4),
  ('Fabrication de Câbles', 'Cable Manufacturing', 'IMACAB', 'Maintenance des machines d''assemblage et de toronnage, contrôle qualité des câbles, gestion des paramètres de fabrication.', 5),
  ('Gainage', 'Sheathing', 'IMACAB', 'Maintenance des lignes de gainage, contrôle des extrudeuses de gainage, gestion des paramètres d''adhérence et d''épaisseur.', 6),
  ('AGS', 'AGS', 'IMACAB', 'Maintenance du système AGS (Armement Gaine Spirale), contrôle des automates de séquençage et des capteurs de position.', 7),
  ('Utilités Industrielles', 'Industrial Utilities', 'Les deux', 'Maintenance des utilités (air comprimé, eau de refroidissement, éclairage industriel, HVAC), gestion des tableaux électriques.', 8)
ON CONFLICT DO NOTHING;

-- ── Soft Skills ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS soft_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_fr TEXT NOT NULL DEFAULT '',
  label_en TEXT DEFAULT '',
  description_fr TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  icon TEXT DEFAULT 'Users',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO soft_skills (label_fr, label_en, description_fr, description_en, icon, sort_order) VALUES
  ('Esprit d''équipe', 'Team Spirit', 'Collaboration efficace dans des équipes pluridisciplinaires.', 'Effective collaboration in multidisciplinary teams.', 'Users', 1),
  ('Communication', 'Communication', 'Clarté dans le reporting technique et la transmission de savoir.', 'Clarity in technical reporting and knowledge sharing.', 'MessageSquare', 2),
  ('Adaptabilité', 'Adaptability', 'Réactivité face aux imprévus et aux environnements changeants.', 'Responsiveness to unforeseen events and changing environments.', 'Shuffle', 3),
  ('Curiosité Technique', 'Technical Curiosity', 'Veille technologique permanente et apprentissage autonome.', 'Permanent technological watch and autonomous learning.', 'Search', 4),
  ('Organisation', 'Organization', 'Gestion rigoureuse des plans de maintenance et interventions.', 'Rigorous management of maintenance plans and interventions.', 'FolderClosed', 5),
  ('Problem Solving', 'Problem Solving', 'Diagnostic méthodique et résolution créative des pannes complexes.', 'Methodical diagnosis and creative resolution of complex failures.', 'BrainCircuit', 6)
ON CONFLICT DO NOTHING;

-- ── Clubs ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL DEFAULT '',
  name_en TEXT DEFAULT '',
  role_fr TEXT DEFAULT '',
  role_en TEXT DEFAULT '',
  description_fr TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  color TEXT DEFAULT '#0077FF',
  icon TEXT DEFAULT 'BrainCircuit',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO clubs (name_fr, name_en, role_fr, role_en, description_fr, description_en, color, icon, sort_order) VALUES
  ('Club Intelligence & Technologies', 'Intelligence & Technologies Club', 'Membre actif', 'Active member', 'Exploration des technologies émergentes : IA industrielle, robotique, IIoT, automatisation avancée. Partage de connaissances et veille technologique collective.', 'Exploration of emerging technologies: industrial AI, robotics, IIoT, advanced automation.', '#0077FF', 'BrainCircuit', 1),
  ('Activités Éducatives', 'Educational Activities', 'Participant', 'Participant', 'Implication dans des activités de transmission des savoirs techniques. Support aux étudiants et partage d''expérience terrain.', 'Involvement in technical knowledge sharing activities. Student support and field experience sharing.', '#00C3FF', 'BookOpen', 2)
ON CONFLICT DO NOTHING;

-- ── Sports ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL DEFAULT '',
  name_en TEXT DEFAULT '',
  description_fr TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  color TEXT DEFAULT '#FF6B00',
  icon TEXT DEFAULT 'Dumbbell',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO sports (name_fr, name_en, description_fr, description_en, color, icon, sort_order) VALUES
  ('Athlétisme', 'Athletics', 'Course de fond et sprint. Discipline et dépassement de soi.', 'Long distance and sprint. Discipline and self-surpassing.', '#FF6B00', 'Dumbbell', 1),
  ('Natation', 'Swimming', 'Endurance et maîtrise technique. Sport complet pour l''équilibre physique.', 'Endurance and technical mastery. Complete sport for physical balance.', '#00C3FF', 'Waves', 2)
ON CONFLICT DO NOTHING;

-- ── RLS pour les nouvelles tables ─────────────────
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE soft_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_competencies" ON competencies FOR SELECT USING (true);
CREATE POLICY "read_processes"    ON processes    FOR SELECT USING (true);
CREATE POLICY "read_soft_skills"  ON soft_skills  FOR SELECT USING (true);
CREATE POLICY "read_clubs"        ON clubs        FOR SELECT USING (true);
CREATE POLICY "read_sports"       ON sports       FOR SELECT USING (true);

CREATE POLICY "write_competencies" ON competencies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_processes"    ON processes    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_soft_skills"  ON soft_skills  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_clubs"        ON clubs        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "write_sports"       ON sports       FOR ALL USING (auth.role() = 'authenticated');
