"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Library, Upload, FileText, Lock, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Document {
  id: string;
  title_fr: string;
  title_en: string;
  section: string;
  domain: string;
  file_url: string;
  file_size: string;
  access_type: string;
  description_fr: string;
  tags: string[];
}

const SECTIONS = ["Mes Recherches", "Livres", "Catalogues Machines", "Documents Formation"];
const DOMAINS = ["Automatisation", "Électrique", "Mécanique", "Électromécanique", "Hydraulique", "Pneumatique", "Réseaux Industriels", "Instrumentation", "Utilitaires"];

const BLANK: Omit<Document, "id"> = {
  title_fr: "", title_en: "", section: "Mes Recherches", domain: "Automatisation",
  file_url: "", file_size: "", access_type: "public", description_fr: "", tags: [],
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" };

export default function AdminLibraryPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Document, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filterSection, setFilterSection] = useState("Tous");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("documents").select("*").order("created_at", { ascending: false });
    if (data) setDocs(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title_fr) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("documents").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editId);
    } else {
      await supabase.from("documents").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setTagInput(""); setSaving(false);
  };

  const handleEdit = (d: Document) => {
    const { id, ...rest } = d;
    setForm(rest); setEditId(id); setShowForm(true); setTagInput("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce document ?")) return;
    await createClient().from("documents").delete().eq("id", id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setForm((f) => ({ ...f, file_url: publicUrl, file_size: `${sizeMB} MB` }));
    }
    setUploading(false);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
      setTagInput("");
    }
  };

  const filtered = filterSection === "Tous" ? docs : docs.filter((d) => d.section === filterSection);

  const SECTION_COLOR: Record<string, string> = {
    "Mes Recherches": "#0077FF",
    "Livres": "#00C3FF",
    "Catalogues Machines": "#FF6B00",
    "Documents Formation": "#22C55E",
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#22C55E" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Bibliothèque</h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); setTagInput(""); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
          >
            <Plus size={16} /> Nouveau document
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
              {editId ? "Modifier le document" : "Nouveau document"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITRE *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                  placeholder="Titre du document..." />
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>SECTION</label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                  {SECTIONS.map((s) => <option key={s} value={s} style={{ background: "#0A0F1C" }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DOMAINE TECHNIQUE</label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                  {DOMAINS.map((d) => <option key={d} value={d} style={{ background: "#0A0F1C" }}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>ACCÈS</label>
                <div className="flex gap-2">
                  {[{ val: "public", label: "Public", icon: Globe, color: "#22C55E" },
                    { val: "restricted", label: "Restreint", icon: Lock, color: "#FF6B00" }].map(({ val, label, icon: Icon, color }) => (
                    <button key={val} onClick={() => setForm({ ...form, access_type: val })}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: form.access_type === val ? `${color}20` : "rgba(5,13,26,0.8)",
                        border: `1px solid ${form.access_type === val ? color + "50" : "rgba(0,119,255,0.2)"}`,
                        color: form.access_type === val ? color : "#64748B",
                      }}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>FICHIER</label>
              {form.file_url ? (
                <div className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <FileText size={16} style={{ color: "#22C55E", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate" style={{ color: "#22C55E" }}>Fichier chargé ({form.file_size})</div>
                  </div>
                  <button onClick={() => setForm({ ...form, file_url: "", file_size: "" })} style={{ color: "#EF4444" }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:opacity-80"
                  style={{ borderColor: "rgba(0,119,255,0.3)" }}
                  onClick={() => document.getElementById("doc-upload")?.click()}
                >
                  <Upload size={24} className="mx-auto mb-2" style={{ color: "#334155" }} />
                  <p className="text-sm" style={{ color: "#64748B" }}>
                    {uploading ? "Upload en cours..." : "Cliquer pour uploader le fichier"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#334155" }}>PDF, ZIP, DOCX — Max 50 MB</p>
                </div>
              )}
              <input id="doc-upload" type="file" accept=".pdf,.zip,.docx,.xlsx,.pptx" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            </div>

            <div className="mb-4">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>DESCRIPTION</label>
              <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={INPUT}
                value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
                placeholder="Description du document..." />
            </div>

            {/* Tags */}
            <div className="mb-5">
              <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TAGS</label>
              <div className="flex gap-2 mb-2">
                <input className="flex-1 px-4 py-2 rounded-xl text-sm outline-none" style={INPUT}
                  value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Ajouter un tag..." />
                <button onClick={addTag} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(0,119,255,0.15)", border: "1px solid rgba(0,119,255,0.3)", color: "#00C3FF" }}>
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                    style={{ background: "rgba(0,119,255,0.1)", color: "#00C3FF", border: "1px solid rgba(0,119,255,0.2)" }}>
                    {t}
                    <button onClick={() => setForm({ ...form, tags: form.tags.filter((x) => x !== t) })} style={{ color: "#EF4444" }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.title_fr}
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

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["Tous", ...SECTIONS].map((s) => (
            <button key={s} onClick={() => setFilterSection(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filterSection === s ? "rgba(0,119,255,0.2)" : "rgba(13,21,37,0.7)",
                border: `1px solid ${filterSection === s ? "rgba(0,119,255,0.4)" : "rgba(0,119,255,0.1)"}`,
                color: filterSection === s ? "#00C3FF" : "#475569",
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16" style={{ color: "#334155" }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(0,119,255,0.2)", color: "#334155" }}>
            <Library size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun document dans cette section</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((d) => (
              <div key={d.id} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.1)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${SECTION_COLOR[d.section] || "#0077FF"}15`, border: `1px solid ${SECTION_COLOR[d.section] || "#0077FF"}25` }}>
                  <FileText size={15} style={{ color: SECTION_COLOR[d.section] || "#0077FF" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "white" }}>{d.title_fr}</div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="label-tag" style={{ color: SECTION_COLOR[d.section] || "#0077FF" }}>{d.section}</span>
                    <span className="label-tag" style={{ color: "#334155" }}>·</span>
                    <span className="label-tag" style={{ color: "#475569" }}>{d.domain}</span>
                    {d.file_size && <><span className="label-tag" style={{ color: "#334155" }}>·</span>
                      <span className="label-tag" style={{ color: "#334155" }}>{d.file_size}</span></>}
                    <span className="flex items-center gap-1 label-tag" style={{ color: d.access_type === "public" ? "#22C55E" : "#FF6B00" }}>
                      {d.access_type === "public" ? <Globe size={9} /> : <Lock size={9} />}
                      {d.access_type === "public" ? "Public" : "Restreint"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(d)} className="w-8 h-8 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(0,119,255,0.1)", color: "#0077FF" }}><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(d.id)} className="w-8 h-8 flex items-center justify-center rounded-lg"
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
