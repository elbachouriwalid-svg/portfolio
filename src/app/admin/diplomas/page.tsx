"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Plus, Edit2, Trash2, Save, X, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Diploma {
  id: string;
  title_fr: string;
  title_en: string;
  institution: string;
  period_start: string;
  period_end: string;
  knowledge: string[];
  sort_order: number;
}

const BLANK: Omit<Diploma, "id"> = {
  title_fr: "", title_en: "", institution: "",
  period_start: "", period_end: "", knowledge: [], sort_order: 0,
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" };

export default function AdminDiplomasPage() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Diploma, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [knowledgeInput, setKnowledgeInput] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("diplomas").select("*").order("sort_order", { ascending: true });
    if (data) setDiplomas(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title_fr || !form.institution) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("diplomas").update({ ...form }).eq("id", editId);
    } else {
      await supabase.from("diplomas").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setKnowledgeInput(""); setSaving(false);
  };

  const handleEdit = (d: Diploma) => {
    const { id, ...rest } = d;
    setForm(rest); setEditId(id); setShowForm(true); setKnowledgeInput("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce diplôme ?")) return;
    await createClient().from("diplomas").delete().eq("id", id);
    setDiplomas((prev) => prev.filter((d) => d.id !== id));
  };

  const addKnowledge = () => {
    const k = knowledgeInput.trim();
    if (k && !form.knowledge.includes(k)) {
      setForm({ ...form, knowledge: [...form.knowledge, k] });
      setKnowledgeInput("");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Diplômes</h1>
            <p className="text-sm mt-1" style={{ color: "#475569" }}>
              Pour les certifications, utilisez la section <strong style={{ color: "#FF6B00" }}>Certifications</strong> dans le menu.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); setKnowledgeInput(""); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
          >
            <Plus size={16} /> Nouveau diplôme
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
              {editId ? "Modifier le diplôme" : "Nouveau diplôme"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITRE (FRANÇAIS) *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                  placeholder="Ex: BTS Électromécanique Industrielle" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITLE (ENGLISH)</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  placeholder="Ex: HND Industrial Electromechanics" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>INSTITUTION *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  placeholder="Ex: OFPPT, Lycée Technique..." />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DÉBUT</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })}
                  placeholder="Ex: 2019" />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>FIN</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })}
                  placeholder="Ex: 2021" />
              </div>
            </div>

            {/* Knowledge tags */}
            <div className="mb-5">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>CONNAISSANCES ACQUISES</label>
              <div className="flex gap-2 mb-2">
                <input className="flex-1 px-4 py-2 rounded-xl text-sm outline-none" style={INPUT}
                  value={knowledgeInput} onChange={(e) => setKnowledgeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKnowledge())}
                  placeholder="Ex: Électrotechnique, Automatisme..." />
                <button onClick={addKnowledge} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(0,119,255,0.15)", border: "1px solid rgba(0,119,255,0.3)", color: "#00C3FF" }}>
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {form.knowledge.map((k) => (
                  <span key={k} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(0,119,255,0.1)", border: "1px solid rgba(0,119,255,0.2)", color: "#00C3FF" }}>
                    {k}
                    <button onClick={() => setForm({ ...form, knowledge: form.knowledge.filter((x) => x !== k) })}
                      style={{ color: "#EF4444" }}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.title_fr || !form.institution}
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
          <div className="text-center py-16" style={{ color: "#334155" }}>Chargement...</div>
        ) : diplomas.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(0,119,255,0.2)", color: "#334155" }}>
            <GraduationCap size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun diplôme ajouté</p>
          </div>
        ) : (
          <div className="space-y-3">
            {diplomas.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.1)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(0,119,255,0.1)", border: "1px solid rgba(0,119,255,0.2)" }}>
                    <GraduationCap size={18} style={{ color: "#0077FF" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ color: "white" }}>{d.title_fr}</div>
                    {d.title_en && <div className="text-xs mt-0.5" style={{ color: "#334155" }}>{d.title_en}</div>}
                    <div className="text-sm mt-1" style={{ color: "#475569" }}>
                      {d.institution}
                      {(d.period_start || d.period_end) && (
                        <span style={{ color: "#334155" }}> · {d.period_start}{d.period_end && ` — ${d.period_end}`}</span>
                      )}
                    </div>
                    {d.knowledge?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {d.knowledge.map((k) => (
                          <span key={k} className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: "rgba(0,119,255,0.08)", color: "#475569" }}>{k}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(d)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(0,119,255,0.1)", color: "#0077FF" }}><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(d.id)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
