"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Competency {
  id: string;
  name_fr: string;
  name_en: string;
  current_level: number;
  target_level: number;
  category: string;
  sort_order: number;
}

const CATEGORIES = ["Électrique", "Automatisation", "Réseaux", "Maintenance", "Mécanique", "Numérique", "Autre"];

const BLANK: Omit<Competency, "id"> = {
  name_fr: "", name_en: "", current_level: 50, target_level: 80,
  category: "Électrique", sort_order: 0,
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" };

const CAT_COLOR: Record<string, string> = {
  Électrique: "#0077FF", Automatisation: "#00C3FF", Réseaux: "#22C55E",
  Maintenance: "#F97316", Mécanique: "#A78BFA", Numérique: "#F59E0B", Autre: "#64748B",
};

export default function AdminCompetenciesPage() {
  const [items, setItems] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Competency, "id">>(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("competencies").select("*").order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name_fr) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("competencies").update({ ...form }).eq("id", editId);
    } else {
      await supabase.from("competencies").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setSaving(false);
  };

  const handleEdit = (c: Competency) => {
    const { id, ...rest } = c;
    setForm(rest); setEditId(id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette compétence ?")) return;
    await createClient().from("competencies").delete().eq("id", id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Compétences</h1>
            <p className="text-sm mt-1" style={{ color: "#475569" }}>Évolution des compétences affichée sur la page Expertise.</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
          >
            <Plus size={16} /> Nouvelle compétence
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl mb-6"
            style={{ background: "rgba(13,21,37,0.9)", border: "1px solid rgba(0,119,255,0.25)" }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              {editId ? "Modifier" : "Nouvelle compétence"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>NOM (FRANÇAIS) *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })}
                  placeholder="Ex: Électrotechnique" />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>NAME (ENGLISH)</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>CATÉGORIE</label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0A0F1C" }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>ORDRE D&apos;AFFICHAGE</label>
                <input type="number" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            {/* Level sliders */}
            <div className="grid sm:grid-cols-2 gap-6 mb-5">
              <div>
                <label className="label-tag flex items-center justify-between mb-2" style={{ color: "#475569" }}>
                  <span>NIVEAU ACTUEL</span>
                  <span style={{ color: "#0077FF" }}>{form.current_level}%</span>
                </label>
                <input type="range" min="0" max="100" className="w-full h-2 rounded-full accent-blue-500"
                  style={{ accentColor: "#0077FF" }}
                  value={form.current_level} onChange={(e) => setForm({ ...form, current_level: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="label-tag flex items-center justify-between mb-2" style={{ color: "#475569" }}>
                  <span>NIVEAU CIBLE</span>
                  <span style={{ color: "#FF6B00" }}>{form.target_level}%</span>
                </label>
                <input type="range" min="0" max="100" className="w-full h-2 rounded-full"
                  style={{ accentColor: "#FF6B00" }}
                  value={form.target_level} onChange={(e) => setForm({ ...form, target_level: parseInt(e.target.value) })} />
              </div>
            </div>

            {/* Preview */}
            <div className="mb-5 p-4 rounded-xl" style={{ background: "rgba(5,13,26,0.6)", border: "1px solid rgba(0,119,255,0.1)" }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: "#CBD5E1" }}>{form.name_fr || "Nom de la compétence"}</span>
                <div className="flex gap-3 text-xs" style={{ color: "#475569" }}>
                  <span style={{ color: "#0077FF" }}>Actuel: {form.current_level}%</span>
                  <span style={{ color: "#FF6B00" }}>Cible: {form.target_level}%</span>
                </div>
              </div>
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full opacity-20" style={{ width: `${form.target_level}%`, background: "#FF6B00" }} />
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${form.current_level}%`, background: "linear-gradient(90deg, #0077FF, #00C3FF)" }} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.name_fr}
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
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.id} className="p-4 rounded-xl"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.1)" }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CAT_COLOR[c.category] || "#0077FF" }} />
                  <div className="flex-1">
                    <span className="text-sm font-semibold" style={{ color: "white" }}>{c.name_fr}</span>
                    <span className="label-tag ml-3" style={{ color: CAT_COLOR[c.category] || "#0077FF" }}>{c.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#0077FF" }}>{c.current_level}%</span>
                    <span className="text-xs" style={{ color: "#334155" }}>→</span>
                    <span className="text-xs" style={{ color: "#FF6B00" }}>{c.target_level}%</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(c)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(0,119,255,0.1)", color: "#0077FF" }}><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}><Trash2 size={13} /></button>
                  </div>
                </div>
                {/* Bar preview */}
                <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute inset-y-0 left-0 rounded-full opacity-20"
                    style={{ width: `${c.target_level}%`, background: "#FF6B00" }} />
                  <div className="absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${c.current_level}%`, background: "linear-gradient(90deg, #0077FF, #00C3FF)" }} />
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(0,119,255,0.2)", color: "#334155" }}>
                <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune compétence ajoutée</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
