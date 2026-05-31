"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Save, Upload, User, Phone, Mail, Linkedin, MapPin, Eye, Target, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ProfileData {
  id?: string;
  vision_fr: string;
  vision_en: string;
  objectives_fr: string;
  objectives_en: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
  portrait_url: string;
}

const DEFAULTS: ProfileData = {
  vision_fr: "Technicien électromécanique industriel avec une expertise terrain acquise dans des environnements de production exigeants. Spécialisé dans la maintenance préventive et corrective, l'automatisation des processus industriels et le diagnostic des systèmes complexes.",
  vision_en: "Industrial electromechanical technician with field expertise acquired in demanding production environments.",
  objectives_fr: "Contribuer à l'évolution vers l'Industrie 4.0 en combinant expertise technique traditionnelle et adoption des technologies intelligentes.",
  objectives_en: "Contribute to the evolution towards Industry 4.0 by combining traditional technical expertise with smart technology adoption.",
  phone: "+212 6XX XXX XXX",
  email: "walid.elbachouri@email.com",
  linkedin: "linkedin.com/in/walid-el-bachouri",
  location: "Maroc",
  portrait_url: "",
};

const INPUT = "w-full px-4 py-3 rounded-xl text-sm outline-none";
const INPUT_STYLE = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white", lineHeight: 1.7 };

export default function AdminProfilePage() {
  const [form, setForm] = useState<ProfileData>(DEFAULTS);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await createClient().from("profile").select("*").limit(1).maybeSingle();
    if (data) {
      setProfileId(data.id);
      setForm({
        vision_fr: data.vision_fr || DEFAULTS.vision_fr,
        vision_en: data.vision_en || DEFAULTS.vision_en,
        objectives_fr: data.objectives_fr || DEFAULTS.objectives_fr,
        objectives_en: data.objectives_en || DEFAULTS.objectives_en,
        phone: data.phone || DEFAULTS.phone,
        email: data.email || DEFAULTS.email,
        linkedin: data.linkedin || DEFAULTS.linkedin,
        location: data.location || DEFAULTS.location,
        portrait_url: data.portrait_url || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    const supabase = createClient();
    let error;

    if (profileId) {
      const res = await supabase.from("profile").update({ ...form, updated_at: new Date().toISOString() }).eq("id", profileId);
      error = res.error;
    } else {
      const res = await supabase.from("profile").insert({ ...form });
      error = res.error;
      if (!error) await fetchProfile();
    }

    setStatus(error ? "error" : "success");
    setSaving(false);
    if (!error) setTimeout(() => setStatus("idle"), 3000);
  };

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    const supabase = createClient();
    const { error } = await supabase.storage.from("images").upload("portrait/portrait.jpg", file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl("portrait/portrait.jpg");
      setForm((f) => ({ ...f, portrait_url: publicUrl }));
    }
    setUploadingPhoto(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20" style={{ color: "#334155" }}>Chargement du profil...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ GESTION</div>
          <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Profil & Vision</h1>
        </div>

        <div className="space-y-6">
          {/* Vision */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Eye size={18} style={{ color: "#0077FF" }} />
              <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Vision Professionnelle</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-tag block mb-2" style={{ color: "#475569" }}>VISION (FRANÇAIS)</label>
                <textarea rows={5} className={INPUT} style={INPUT_STYLE}
                  value={form.vision_fr} onChange={(e) => setForm({ ...form, vision_fr: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-2" style={{ color: "#475569" }}>VISION (ENGLISH)</label>
                <textarea rows={5} className={INPUT} style={INPUT_STYLE}
                  value={form.vision_en} onChange={(e) => setForm({ ...form, vision_en: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Target size={18} style={{ color: "#FF6B00" }} />
              <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Objectifs</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-tag block mb-2" style={{ color: "#475569" }}>OBJECTIFS (FRANÇAIS)</label>
                <textarea rows={3} className={INPUT} style={{ ...INPUT_STYLE, lineHeight: 1.6 }}
                  value={form.objectives_fr} onChange={(e) => setForm({ ...form, objectives_fr: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-2" style={{ color: "#475569" }}>OBJECTIVES (ENGLISH)</label>
                <textarea rows={3} className={INPUT} style={{ ...INPUT_STYLE, lineHeight: 1.6 }}
                  value={form.objectives_en} onChange={(e) => setForm({ ...form, objectives_en: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-5">
              <User size={18} style={{ color: "#00C3FF" }} />
              <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Informations de Contact</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "phone", label: "TÉLÉPHONE", icon: Phone },
                { key: "email", label: "EMAIL", icon: Mail },
                { key: "linkedin", label: "LINKEDIN", icon: Linkedin },
                { key: "location", label: "LOCALISATION", icon: MapPin },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <label className="label-tag flex items-center gap-1.5 mb-2" style={{ color: "#475569" }}>
                    <Icon size={11} /> {label}
                  </label>
                  <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" }}
                    value={form[key as keyof ProfileData]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>

          {/* Photo Portrait */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Upload size={18} style={{ color: "#22C55E" }} />
              <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Photo Portrait</h2>
            </div>
            {form.portrait_url ? (
              <div className="flex items-center gap-4 mb-4">
                <img src={form.portrait_url} alt="Portrait" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#22C55E" }}>Photo chargée ✓</div>
                  <button onClick={() => document.getElementById("photo-upload")?.click()}
                    className="text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(0,119,255,0.1)", color: "#00C3FF", border: "1px solid rgba(0,119,255,0.2)" }}>
                    Changer la photo
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-500 mb-4"
                style={{ borderColor: "rgba(0,119,255,0.3)" }}
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <Upload size={28} className="mx-auto mb-3" style={{ color: "#334155" }} />
                <p className="text-sm mb-1" style={{ color: "#64748B" }}>
                  {uploadingPhoto ? "Upload en cours..." : "Cliquer pour uploader votre photo"}
                </p>
                <p className="text-xs" style={{ color: "#334155" }}>JPG, PNG — Max 5 MB</p>
              </div>
            )}
            <input id="photo-upload" type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
              style={{
                background: status === "success" ? "rgba(34,197,94,0.2)" : status === "error" ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg, #0077FF, #00C3FF)",
                border: status === "success" ? "1px solid rgba(34,197,94,0.4)" : status === "error" ? "1px solid rgba(239,68,68,0.4)" : "none",
                color: status === "success" ? "#22C55E" : status === "error" ? "#EF4444" : "white",
              }}
            >
              {status === "success" ? <CheckCircle size={16} /> : status === "error" ? <AlertCircle size={16} /> : <Save size={16} />}
              {saving ? "Enregistrement..." : status === "success" ? "Enregistré !" : status === "error" ? "Erreur — Réessayer" : "Enregistrer les modifications"}
            </motion.button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
