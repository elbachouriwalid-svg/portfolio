"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

interface Certification {
  id: string;
  title_fr: string;
  title_en: string;
  organization: string;
  date: string;
  image_url: string;
  skills: string[];
  sort_order: number;
}

const BLANK: Omit<Certification, "id"> = {
  title_fr: "", title_en: "", organization: "", date: "",
  image_url: "", skills: [], sort_order: 0,
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(255,107,0,0.2)", color: "white" };

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Certification, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("certifications").select("*").order("sort_order", { ascending: true });
    if (data) setCerts(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title_fr || !form.organization) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("certifications").update({ ...form }).eq("id", editId);
    } else {
      await supabase.from("certifications").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setSkillInput(""); setSaving(false);
  };

  const handleEdit = (c: Certification) => {
    const { id, ...rest } = c;
    setForm(rest); setEditId(id); setShowForm(true); setSkillInput("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette certification ?")) return;
    await createClient().from("certifications").delete().eq("id", id);
    setCerts((prev) => prev.filter((c) => c.id !== id));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput("");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#FF6B00" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Certifications</h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); setSkillInput(""); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C33)", color: "white" }}
          >
            <Plus size={16} /> Nouvelle certification
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl mb-6"
            style={{ background: "rgba(13,21,37,0.9)", border: "1px solid rgba(255,107,0,0.2)" }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              {editId ? "Modifier" : "Nouvelle certification"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITRE *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                  placeholder="Ex: Formation TIA Portal S7-1200/1500" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITLE (ENGLISH)</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>ORGANISME *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Ex: Siemens, Schneider Electric..." />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DATE / ANNÉE</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="Ex: 2022 ou Janvier 2023" />
              </div>
            </div>

            {/* Image upload */}
            <div className="mb-4">
              <label className="label-tag block mb-2" style={{ color: "#475569" }}>IMAGE DU CERTIFICAT</label>
              <FileUpload
                bucket="certifications"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                maxSizeMB={5}
                currentUrl={form.image_url || null}
                label="Cliquer ou glisser l'image du certificat"
                hint="JPG, PNG, WebP · Max 5 MB"
                accentColor="#FF6B00"
                previewType="image"
                onUploadComplete={(url) => setForm(f => ({ ...f, image_url: url }))}
              />
            </div>

            {/* Skills */}
            <div className="mb-5">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>COMPÉTENCES VALIDÉES</label>
              <div className="flex gap-2 mb-2">
                <input className="flex-1 px-4 py-2 rounded-xl text-sm outline-none" style={INPUT}
                  value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Ajouter une compétence..." />
                <button onClick={addSkill} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)", color: "#FF8C33" }}>Ajouter</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)", color: "#FF8C33" }}>
                    {s}
                    <button onClick={() => setForm({ ...form, skills: form.skills.filter((x) => x !== s) })} style={{ color: "#EF4444" }}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.title_fr || !form.organization}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C33)", color: "white" }}>
                <Save size={14} /> {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748B" }}>
                <X size={14} /> Annuler
              </button>
            </div>
          </motion.div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-16" style={{ color: "#334155" }}>Chargement...</div>
        ) : certs.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(255,107,0,0.2)", color: "#334155" }}>
            <Award size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune certification ajoutée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certs.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(255,107,0,0.12)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)" }}>
                  {c.image_url
                    ? <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                    : <Award size={18} style={{ color: "#FF6B00" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "white" }}>{c.title_fr}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#475569" }}>{c.organization} · {c.date}</div>
                  {c.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {c.skills.slice(0, 4).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,107,0,0.08)", color: "#FF8C33" }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(c)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(255,107,0,0.1)", color: "#FF6B00" }}><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
