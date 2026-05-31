"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Save, Eye, Target, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface HomeContent {
  id?: string;
  vision_title_fr: string;
  vision_title_en: string;
  vision_fr: string;
  vision_en: string;
  objectives_fr: string;
  objectives_en: string;
  hero_intro_fr: string;
  hero_intro_en: string;
}

const DEFAULTS: HomeContent = {
  vision_title_fr: "Vision Professionnelle",
  vision_title_en: "Professional Vision",
  vision_fr: "Technicien électromécanique industriel avec une expertise terrain acquise dans des environnements de production exigeants. Spécialisé dans la maintenance préventive et corrective, l'automatisation des processus industriels et le diagnostic des systèmes complexes.",
  vision_en: "Industrial electromechanical technician with field expertise acquired in demanding production environments.",
  objectives_fr: "Contribuer à l'évolution vers l'Industrie 4.0 en combinant expertise technique traditionnelle et adoption des technologies intelligentes.",
  objectives_en: "Contribute to the evolution towards Industry 4.0 by combining traditional technical expertise with smart technology adoption.",
  hero_intro_fr: "Opérant à l'intersection de la maintenance, de l'automatisation et de l'intelligence industrielle. Spécialiste des environnements de production modernes et des technologies Industrie 4.0.",
  hero_intro_en: "Operating at the intersection of maintenance, automation and industrial intelligence.",
};

const TA = "w-full px-4 py-3 rounded-xl text-sm outline-none resize-none";
const IS = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white", lineHeight: 1.7 };

export default function AdminHomePage() {
  const [form, setForm] = useState<HomeContent>(DEFAULTS);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("profile").select("*").limit(1).maybeSingle();
    if (data) {
      setProfileId(data.id);
      setForm({
        vision_title_fr: data.vision_title_fr || DEFAULTS.vision_title_fr,
        vision_title_en: data.vision_title_en || DEFAULTS.vision_title_en,
        vision_fr: data.vision_fr || DEFAULTS.vision_fr,
        vision_en: data.vision_en || DEFAULTS.vision_en,
        objectives_fr: data.objectives_fr || DEFAULTS.objectives_fr,
        objectives_en: data.objectives_en || DEFAULTS.objectives_en,
        hero_intro_fr: data.hero_intro_fr || DEFAULTS.hero_intro_fr,
        hero_intro_en: data.hero_intro_en || DEFAULTS.hero_intro_en,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true); setStatus("idle");
    const supabase = createClient();
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } = profileId
      ? await supabase.from("profile").update(payload).eq("id", profileId)
      : await supabase.from("profile").insert(payload);
    setStatus(error ? "error" : "success");
    setSaving(false);
    if (!error) { await fetchData(); setTimeout(() => setStatus("idle"), 3000); }
  };

  const Section = ({ icon: Icon, title, color, children }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; title: string; color: string; children: React.ReactNode }) => (
    <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} style={{ color }} />
        <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, field, rows = 3 }: { label: string; field: keyof HomeContent; rows?: number }) => (
    <div>
      <label className="label-tag block mb-2" style={{ color: "#475569" }}>{label}</label>
      <textarea rows={rows} className={TA} style={IS}
        value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
    </div>
  );

  if (loading) return <AdminLayout><div className="text-center py-20" style={{ color: "#334155" }}>Chargement...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ CONTENU</div>
          <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Contenu Page d&apos;Accueil</h1>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>
            Tous les textes modifiables ici s&apos;affichent immédiatement sur le site.
          </p>
        </div>

        <div className="space-y-6">
          {/* Hero Intro */}
          <Section icon={Sparkles} title="Introduction Hero (sous le nom)" color="#00C3FF">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="INTRODUCTION (FRANÇAIS)" field="hero_intro_fr" rows={3} />
              <Field label="INTRODUCTION (ENGLISH)" field="hero_intro_en" rows={3} />
            </div>
          </Section>

          {/* Vision */}
          <Section icon={Eye} title="Vision Professionnelle" color="#0077FF">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-tag block mb-2" style={{ color: "#475569" }}>TITRE (FRANÇAIS)</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={IS}
                  value={form.vision_title_fr} onChange={(e) => setForm({ ...form, vision_title_fr: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-2" style={{ color: "#475569" }}>TITLE (ENGLISH)</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={IS}
                  value={form.vision_title_en} onChange={(e) => setForm({ ...form, vision_title_en: e.target.value })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="DESCRIPTION VISION (FRANÇAIS)" field="vision_fr" rows={5} />
              <Field label="VISION DESCRIPTION (ENGLISH)" field="vision_en" rows={5} />
            </div>
          </Section>

          {/* Objectives */}
          <Section icon={Target} title="Objectifs" color="#FF6B00">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="OBJECTIFS (FRANÇAIS)" field="objectives_fr" rows={3} />
              <Field label="OBJECTIVES (ENGLISH)" field="objectives_en" rows={3} />
            </div>
          </Section>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
            style={{
              background: status === "success" ? "rgba(34,197,94,0.2)" : status === "error" ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg, #0077FF, #00C3FF)",
              border: status === "success" ? "1px solid rgba(34,197,94,0.4)" : status === "error" ? "1px solid rgba(239,68,68,0.4)" : "none",
              color: status === "success" ? "#22C55E" : status === "error" ? "#EF4444" : "white",
            }}
          >
            {status === "success" ? <CheckCircle size={16} /> : status === "error" ? <AlertCircle size={16} /> : <Save size={16} />}
            {saving ? "Enregistrement..." : status === "success" ? "Enregistré !" : status === "error" ? "Erreur" : "Enregistrer tout"}
          </motion.button>
        </div>
      </div>
    </AdminLayout>
  );
}
