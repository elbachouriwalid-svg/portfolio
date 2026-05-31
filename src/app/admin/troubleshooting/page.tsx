"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Incident {
  id: string;
  title_fr: string;
  domain: string;
  criticality: string;
  status: string;
  site: string;
  downtime: number;
  symptoms_fr: string;
  root_cause_fr: string;
  solution_fr: string;
  lessons_fr: string;
}

const DOMAINS = ["Électrique", "Automatisation", "Réseaux", "Mécanique", "Électromécanique", "Pneumatique", "Hydraulique", "Instrumentation", "Utilitaires"];
const CRITS = ["critical", "major", "medium", "minor"];
const SITES = ["SICDA", "IMACAB"];
const STATUSES = ["resolved", "in_progress", "observation"];
const CRIT_COLOR: Record<string, string> = { critical: "#EF4444", major: "#F97316", medium: "#EAB308", minor: "#22C55E" };
const CRIT_LABEL: Record<string, string> = { critical: "Critique", major: "Majeur", medium: "Modéré", minor: "Mineur" };
const STATUS_LABEL: Record<string, string> = { resolved: "Résolu", in_progress: "En cours", observation: "Observation" };
const STATUS_COLOR: Record<string, string> = { resolved: "#22C55E", in_progress: "#0077FF", observation: "#EAB308" };

const BLANK: Omit<Incident, "id"> = {
  title_fr: "", domain: "Électrique", criticality: "major", status: "resolved",
  site: "IMACAB", downtime: 0, symptoms_fr: "", root_cause_fr: "", solution_fr: "", lessons_fr: "",
};

const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" };

export default function AdminTroubleshootingPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Incident, "id">>(BLANK);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("incidents").select("*").order("created_at", { ascending: false });
    if (data) setIncidents(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title_fr) return;
    setSaving(true);
    const supabase = createClient();
    if (editId) {
      await supabase.from("incidents").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editId);
    } else {
      await supabase.from("incidents").insert({ ...form });
    }
    await fetchData();
    setForm(BLANK); setEditId(null); setShowForm(false); setSaving(false);
  };

  const handleEdit = (inc: Incident) => {
    const { id, ...rest } = inc;
    setForm(rest); setEditId(id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette intervention ?")) return;
    await createClient().from("incidents").delete().eq("id", id);
    setIncidents((prev) => prev.filter((i) => i.id !== id));
  };

  const SELECT_FIELDS = [
    { key: "domain", label: "DOMAINE", options: DOMAINS, display: undefined },
    { key: "criticality", label: "CRITICITÉ", options: CRITS, display: CRIT_LABEL },
    { key: "site", label: "SITE", options: SITES, display: undefined },
    { key: "status", label: "STATUT", options: STATUSES, display: STATUS_LABEL },
  ];

  const TEXT_AREAS = [
    { key: "symptoms_fr", label: "SYMPTÔMES" },
    { key: "root_cause_fr", label: "CAUSE RACINE" },
    { key: "solution_fr", label: "SOLUTION IMPLÉMENTÉE" },
    { key: "lessons_fr", label: "LEÇONS APPRISES" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label-tag mb-2" style={{ color: "#FF6B00" }}>◆ GESTION</div>
            <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Troubleshooting</h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(BLANK); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
          >
            <Plus size={16} /> Nouvelle intervention
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
              {editId ? "Modifier l'intervention" : "Nouvelle intervention"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TITRE *</label>
                <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                  placeholder="Titre de l'intervention..." />
              </div>

              {SELECT_FIELDS.map(({ key, label, options, display }) => (
                <div key={key}>
                  <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>{label}</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                    {options.map((o) => (
                      <option key={o} value={o} style={{ background: "#0A0F1C" }}>
                        {display ? display[o] : o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>TEMPS D'ARRÊT (min)</label>
                <input type="number" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={INPUT}
                  value={form.downtime} onChange={(e) => setForm({ ...form, downtime: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            {TEXT_AREAS.map(({ key, label }) => (
              <div key={key} className="mb-4">
                <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>{label}</label>
                <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={INPUT}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={`Décrire...`} />
              </div>
            ))}

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

        {/* List */}
        {loading ? (
          <div className="text-center py-16" style={{ color: "#334155" }}>Chargement des interventions...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(0,119,255,0.2)", color: "#334155" }}>
            <Wrench size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune intervention documentée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.id} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.1)" }}>
                <div className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === inc.id ? null : inc.id)}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CRIT_COLOR[inc.criticality] }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: "white" }}>{inc.title_fr}</div>
                    <div className="flex gap-2 mt-0.5 flex-wrap">
                      <span className="label-tag" style={{ color: "#475569" }}>{inc.domain}</span>
                      <span className="label-tag" style={{ color: "#475569" }}>·</span>
                      <span className="label-tag" style={{ color: "#475569" }}>{inc.site}</span>
                      <span className="label-tag" style={{ color: "#475569" }}>·</span>
                      <span className="label-tag" style={{ color: CRIT_COLOR[inc.criticality] }}>{CRIT_LABEL[inc.criticality]}</span>
                      <span className="label-tag" style={{ color: "#475569" }}>·</span>
                      <span className="label-tag" style={{ color: STATUS_COLOR[inc.status] }}>{STATUS_LABEL[inc.status]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(inc); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(0,119,255,0.1)", color: "#0077FF" }}><Edit2 size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(inc.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}><Trash2 size={13} /></button>
                    {expandedId === inc.id
                      ? <ChevronUp size={14} style={{ color: "#475569" }} />
                      : <ChevronDown size={14} style={{ color: "#475569" }} />}
                  </div>
                </div>

                {expandedId === inc.id && (
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid rgba(0,119,255,0.08)" }}>
                    {[
                      { l: "Symptômes", v: inc.symptoms_fr },
                      { l: "Cause racine", v: inc.root_cause_fr },
                      { l: "Solution", v: inc.solution_fr },
                      { l: "Leçons apprises", v: inc.lessons_fr },
                    ].map(({ l, v }) => v ? (
                      <div key={l} className="pt-3">
                        <div className="label-tag mb-1" style={{ color: "#334155" }}>{l.toUpperCase()}</div>
                        <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{v}</p>
                      </div>
                    ) : null)}
                    <div className="pt-2">
                      <div className="label-tag mb-1" style={{ color: "#334155" }}>TEMPS D'ARRÊT</div>
                      <p className="text-sm" style={{ color: "#64748B" }}>{inc.downtime} minutes</p>
                    </div>
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
