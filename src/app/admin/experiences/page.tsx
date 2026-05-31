"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Experience {
  id: string;
  title_fr: string;
  company: string;
  location: string;
  period_start: string;
  period_end: string;
  is_current: boolean;
  description_fr: string;
  skills: string[];
  sort_order: number;
}

const BLANK: Omit<Experience, "id"> = {
  title_fr: "",
  company: "",
  location: "",
  period_start: "",
  period_end: "",
  is_current: false,
  description_fr: "",
  skills: [],
  sort_order: 0,
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" };

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(BLANK);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient()
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setExperiences(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title_fr || !form.company) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("experiences").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editId);
    } else {
      await supabase.from("experiences").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setSkillInput(""); setSaving(false);
  };

  const handleEdit = (exp: Experience) => {
    const { id, ...rest } = exp;
    setForm(rest); setEditId(id); setShowForm(true); setSkillInput("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette expérience ?")) return;
    await createClient().from("experiences").delete().eq("id", id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#FF6B00" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Expériences</h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); setSkillInput(""); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
          >
            <Plus size={16} /> Nouvelle expérience
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl mb-6"
            style={{ background: "rgba(13,21,37,0.9)", border: "1px solid rgba(0,119,255,0.25)" }}
          >
            <h2 className="font-bold text-lg mb-5" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              {editId ? "Modifier l'expérience" : "Nouvelle expérience"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITRE DU POSTE *</label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={INPUT}
                  value={form.title_fr}
                  onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                  placeholder="Ex: Technicien de Maintenance Industrielle"
                />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>ENTREPRISE *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nom de l'entreprise" />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>LOCALISATION</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ville, Pays" />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DATE DE DÉBUT</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DATE DE FIN</label>
                <input type="date" disabled={form.is_current} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none disabled:opacity-40" style={INPUT}
                  value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <input type="checkbox" id="is_current" className="w-4 h-4 accent-blue-500"
                  checked={form.is_current}
                  onChange={(e) => setForm({ ...form, is_current: e.target.checked, period_end: e.target.checked ? "" : form.period_end })} />
                <label htmlFor="is_current" className="text-sm cursor-pointer" style={{ color: "#94A3B8" }}>Poste actuel</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DESCRIPTION DES MISSIONS</label>
              <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={INPUT}
                value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
                placeholder="Décrivez les missions et responsabilités..." />
            </div>

            <div className="mb-5">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>COMPÉTENCES ACQUISES</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                  style={INPUT}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Taper une compétence et appuyer sur Entrée..."
                />
                <button onClick={addSkill} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(0,119,255,0.15)", border: "1px solid rgba(0,119,255,0.3)", color: "#00C3FF" }}>
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {form.skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(0,119,255,0.12)", border: "1px solid rgba(0,119,255,0.25)", color: "#00C3FF" }}>
                    {s}
                    <button onClick={() => setForm({ ...form, skills: form.skills.filter((x) => x !== s) })}
                      className="hover:opacity-70" style={{ color: "#EF4444" }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.title_fr || !form.company}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}>
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
          <div className="text-center py-16" style={{ color: "#334155" }}>Chargement des expériences...</div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(0,119,255,0.2)", color: "#334155" }}>
            <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune expérience ajoutée</p>
            <p className="text-xs mt-1" style={{ color: "#1e293b" }}>Cliquez sur "Nouvelle expérience" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.1)" }}>
                <div className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: exp.is_current ? "#22C55E" : "#0077FF" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: "white" }}>{exp.title_fr}</div>
                    <div className="flex gap-2 mt-0.5 flex-wrap">
                      <span className="label-tag" style={{ color: "#475569" }}>{exp.company}</span>
                      {exp.location && <><span className="label-tag" style={{ color: "#475569" }}>·</span>
                        <span className="label-tag" style={{ color: "#475569" }}>{exp.location}</span></>}
                      {exp.is_current && <span className="label-tag" style={{ color: "#22C55E" }}>● Actuel</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(exp); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                      style={{ background: "rgba(0,119,255,0.1)", color: "#0077FF" }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(exp.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                      <Trash2 size={13} />
                    </button>
                    {expandedId === exp.id
                      ? <ChevronUp size={14} style={{ color: "#475569" }} />
                      : <ChevronDown size={14} style={{ color: "#475569" }} />}
                  </div>
                </div>

                {expandedId === exp.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 pb-4 space-y-3"
                    style={{ borderTop: "1px solid rgba(0,119,255,0.08)" }}
                  >
                    <div className="pt-3">
                      <div className="label-tag mb-1" style={{ color: "#334155" }}>PÉRIODE</div>
                      <p className="text-sm" style={{ color: "#64748B" }}>
                        {exp.period_start || "—"} → {exp.is_current ? "Présent" : (exp.period_end || "—")}
                      </p>
                    </div>
                    {exp.description_fr && (
                      <div>
                        <div className="label-tag mb-1" style={{ color: "#334155" }}>DESCRIPTION</div>
                        <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{exp.description_fr}</p>
                      </div>
                    )}
                    {exp.skills?.length > 0 && (
                      <div>
                        <div className="label-tag mb-2" style={{ color: "#334155" }}>COMPÉTENCES</div>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-full text-xs"
                              style={{ background: "rgba(0,119,255,0.1)", color: "#00C3FF" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
