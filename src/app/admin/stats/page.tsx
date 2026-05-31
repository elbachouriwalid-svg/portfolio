"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Save, BarChart3, TrendingUp, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stat {
  id: string;
  key: string;
  value: number;
  label_fr: string;
  label_en: string;
  suffix: string;
  sort_order: number;
}

const STAT_COLORS: Record<string, string> = {
  incidents_resolved: "#EF4444",
  certifications: "#00C3FF",
  experience_years: "#FF6B00",
  technologies: "#22C55E",
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await createClient().from("stats").select("*").order("sort_order", { ascending: true });
    if (data) setStats(data);
    setLoading(false);
  };

  const handleSave = async (stat: Stat) => {
    setSaving(stat.id);
    await createClient()
      .from("stats")
      .update({ value: stat.value, label_fr: stat.label_fr, label_en: stat.label_en, suffix: stat.suffix, updated_at: new Date().toISOString() })
      .eq("id", stat.id);
    setSaving(null);
    setSaved(stat.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const updateStat = (id: string, field: keyof Stat, value: string | number) => {
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ GESTION</div>
          <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Statistiques</h1>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>
            Ces chiffres apparaissent sur la page d&apos;accueil du portfolio.
          </p>
        </div>

        {/* Preview */}
        {!loading && stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.id} className="p-4 rounded-xl text-center"
                style={{ background: "rgba(13,21,37,0.7)", border: `1px solid ${STAT_COLORS[s.key] || "#0077FF"}25` }}>
                <div className="text-2xl font-bold mb-1" style={{ color: STAT_COLORS[s.key] || "#0077FF", fontFamily: "var(--font-manrope)" }}>
                  {s.value}{s.suffix}
                </div>
                <div className="text-xs" style={{ color: "#64748B" }}>{s.label_fr}</div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Cards */}
        {loading ? (
          <div className="text-center py-16" style={{ color: "#334155" }}>Chargement...</div>
        ) : stats.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed rgba(0,119,255,0.2)", color: "#334155" }}>
            <BarChart3 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune statistique trouvée</p>
            <p className="text-xs mt-1" style={{ color: "#1e293b" }}>Exécutez d&apos;abord le schéma SQL dans Supabase</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl"
                style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.1)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: STAT_COLORS[s.key] || "#0077FF" }} />
                  <TrendingUp size={14} style={{ color: STAT_COLORS[s.key] || "#0077FF" }} />
                  <span className="label-tag" style={{ color: "#475569" }}>{s.key}</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>VALEUR</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-bold"
                      style={{ background: "rgba(5,13,26,0.8)", border: `1px solid ${STAT_COLORS[s.key] || "#0077FF"}40`, color: STAT_COLORS[s.key] || "white" }}
                      value={s.value}
                      onChange={(e) => updateStat(s.id, "value", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>LIBELLÉ (FR)</label>
                    <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" }}
                      value={s.label_fr} onChange={(e) => updateStat(s.id, "label_fr", e.target.value)} />
                  </div>
                  <div>
                    <label className="label-tag block mb-1.5" style={{ color: "#475569" }}>SUFFIXE</label>
                    <input className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" }}
                      value={s.suffix} onChange={(e) => updateStat(s.id, "suffix", e.target.value)}
                      placeholder="Ex: + ou %" />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleSave(s)}
                    disabled={saving === s.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                    style={{
                      background: saved === s.id ? "rgba(34,197,94,0.15)" : `${STAT_COLORS[s.key] || "#0077FF"}20`,
                      border: `1px solid ${saved === s.id ? "rgba(34,197,94,0.4)" : (STAT_COLORS[s.key] || "#0077FF") + "40"}`,
                      color: saved === s.id ? "#22C55E" : (STAT_COLORS[s.key] || "#00C3FF"),
                    }}
                  >
                    {saved === s.id ? <CheckCircle size={13} /> : <Save size={13} />}
                    {saved === s.id ? "Enregistré !" : saving === s.id ? "Sauvegarde..." : "Enregistrer"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(0,119,255,0.05)", border: "1px solid rgba(0,119,255,0.15)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
            <strong style={{ color: "#00C3FF" }}>Conseil :</strong> Les statistiques sont affichées avec un compteur animé sur la page d&apos;accueil.
            Modifiez les valeurs ici et elles seront mises à jour automatiquement sur le site.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
