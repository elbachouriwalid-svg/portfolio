"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Factory, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Process {
  id: string;
  name_fr: string;
  name_en: string;
  company: string;
  description_fr: string;
  description_en: string;
  notes: string;
  sort_order: number;
}

const BLANK: Omit<Process, "id"> = {
  name_fr: "", name_en: "", company: "", description_fr: "", description_en: "", notes: "", sort_order: 0,
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(255,107,0,0.2)", color: "white" };

export default function AdminProcessesPage() {
  const [items, setItems] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Process, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("processes").select("*").order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name_fr) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("processes").update({ ...form }).eq("id", editId);
    } else {
      await supabase.from("processes").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setSaving(false);
  };

  const handleEdit = (p: Process) => {
    const { id, ...rest } = p;
    setForm(rest); setEditId(id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce processus ?")) return;
    await createClient().from("processes").delete().eq("id", id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#FF6B00" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Processus Industriels</h1>
            <p className="text-sm mt-1" style={{ color: "#475569" }}>Modules interactifs affichés sur la page Expertise.</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C33)", color: "white" }}
          >
            <Plus size={16} /> Nouveau processus
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl mb-6"
            style={{ background: "rgba(13,21,37,0.9)", border: "1px solid rgba(255,107,0,0.2)" }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              {editId ? "Modifier le processus" : "Nouveau processus"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>NOM (FRANÇAIS) *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })}
                  placeholder="Ex: Injection Plastique" />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>NAME (ENGLISH)</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>SITE / ENTREPRISE</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="SICDA, IMACAB, Les deux..." />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>ORDRE D&apos;AFFICHAGE</label>
                <input type="number" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="mb-4">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DESCRIPTION TECHNIQUE (FRANÇAIS)</label>
              <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={INPUT}
                value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
                placeholder="Décrire le processus, les équipements, les interventions de maintenance..." />
            </div>
            <div className="mb-4">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TECHNICAL DESCRIPTION (ENGLISH)</label>
              <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={INPUT}
                value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
            </div>
            <div className="mb-5">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>NOTES TECHNIQUES (VISIBLES VISITEURS)</label>
              <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={INPUT}
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observations, particularités, points d'attention..." />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.name_fr}
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
        ) : items.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(255,107,0,0.2)", color: "#334155" }}>
            <Factory size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun processus ajouté</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((p) => (
              <div key={p.id} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(255,107,0,0.12)" }}>
                <div className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#FF6B00" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: "white" }}>{p.name_fr}</div>
                    <span className="label-tag" style={{ color: "#475569" }}>{p.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(255,107,0,0.1)", color: "#FF6B00" }}><Edit2 size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}><Trash2 size={13} /></button>
                    {expandedId === p.id ? <ChevronUp size={14} style={{ color: "#475569" }} /> : <ChevronDown size={14} style={{ color: "#475569" }} />}
                  </div>
                </div>
                {expandedId === p.id && p.description_fr && (
                  <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,107,0,0.08)" }}>
                    <p className="text-sm pt-3 leading-relaxed" style={{ color: "#64748B" }}>{p.description_fr}</p>
                    {p.notes && <p className="text-xs mt-2 pt-2 italic" style={{ color: "#475569", borderTop: "1px solid rgba(255,255,255,0.04)" }}>📝 {p.notes}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
