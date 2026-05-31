"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Users, Dumbbell, BrainCircuit } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Types ── */
interface SoftSkill { id: string; label_fr: string; label_en: string; description_fr: string; description_en: string; icon: string; sort_order: number; }
interface Club { id: string; name_fr: string; name_en: string; role_fr: string; description_fr: string; color: string; icon: string; sort_order: number; }
interface Sport { id: string; name_fr: string; name_en: string; description_fr: string; color: string; icon: string; sort_order: number; }

type IconComponent = React.ComponentType<{ size?: number; style?: React.CSSProperties }>;

const ICONS_SS = ["Users", "MessageSquare", "Shuffle", "Search", "FolderClosed", "BrainCircuit", "Lightbulb", "Shield", "Target"];
const ICONS_C = ["BrainCircuit", "BookOpen", "Cpu", "Globe", "Zap", "Star"];
const COLORS = ["#0077FF", "#00C3FF", "#FF6B00", "#22C55E", "#A78BFA", "#F59E0B"];
const INPUT = { background: "rgba(5,13,26,0.8)", border: "1px solid rgba(0,119,255,0.2)", color: "white" };

/* ── Reusable CRUD Section ── */
function CrudSection<T extends { id: string }>({
  title, color, icon: Icon, items, loading, form, setForm, blank, onSave, onEdit, onDelete, saving, editId, showForm, setShowForm, fields
}: {
  title: string; color: string; icon: IconComponent; items: T[]; loading: boolean;
  form: Omit<T, "id">; setForm: (f: Omit<T, "id">) => void; blank: Omit<T, "id">;
  onSave: () => void; onEdit: (item: T) => void; onDelete: (id: string) => void;
  saving: boolean; editId: string | null; showForm: boolean; setShowForm: (v: boolean) => void;
  fields: { key: string; label: string; type?: "text" | "select"; options?: string[]; rows?: number }[];
}) {
  return (
    <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: `1px solid ${color}20` }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color }} />
          <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{title}</h2>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(blank); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl mb-4" style={{ background: "rgba(5,13,26,0.8)", border: `1px solid ${color}25` }}>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            {fields.map(({ key, label, type, options, rows }) => (
              <div key={key} className={rows && rows > 1 ? "sm:col-span-2" : ""}>
                <label className="label-tag block mb-1" style={{ color: "#475569" }}>{label}</label>
                {type === "select" ? (
                  <select className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={INPUT}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                    {options?.map((o) => <option key={o} value={o} style={{ background: "#0A0F1C" }}>{o}</option>)}
                  </select>
                ) : rows && rows > 1 ? (
                  <textarea rows={rows} className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none" style={INPUT}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                ) : (
                  <input className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={INPUT}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={onSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: `${color}25`, border: `1px solid ${color}50`, color }}>
              <Save size={13} /> {saving ? "..." : "Enregistrer"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748B" }}>
              <X size={13} /> Annuler
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center py-8" style={{ color: "#334155" }}>Chargement...</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(5,13,26,0.5)", border: `1px solid ${color}12` }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "white" }}>
                  {(item as Record<string, unknown>).label_fr as string || (item as Record<string, unknown>).name_fr as string}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => onEdit(item)} className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ background: `${color}15`, color }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={() => onDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: "#334155" }}>Aucun élément — cliquez sur Ajouter</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function AdminLoisIrsPage() {
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Forms */
  const [ssForm, setSsForm] = useState<Omit<SoftSkill, "id">>({ label_fr: "", label_en: "", description_fr: "", description_en: "", icon: "Users", sort_order: 0 });
  const [clubForm, setClubForm] = useState<Omit<Club, "id">>({ name_fr: "", name_en: "", role_fr: "", description_fr: "", color: "#0077FF", icon: "BrainCircuit", sort_order: 0 });
  const [sportForm, setSportForm] = useState<Omit<Sport, "id">>({ name_fr: "", name_en: "", description_fr: "", color: "#FF6B00", icon: "Dumbbell", sort_order: 0 });
  const [ssEditId, setSsEditId] = useState<string | null>(null);
  const [clubEditId, setClubEditId] = useState<string | null>(null);
  const [sportEditId, setSportEditId] = useState<string | null>(null);
  const [ssShowForm, setSsShowForm] = useState(false);
  const [clubShowForm, setClubShowForm] = useState(false);
  const [sportShowForm, setSportShowForm] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const sb = createClient();
    const [ss, cl, sp] = await Promise.all([
      sb.from("soft_skills").select("*").order("sort_order"),
      sb.from("clubs").select("*").order("sort_order"),
      sb.from("sports").select("*").order("sort_order"),
    ]);
    if (ss.data) setSoftSkills(ss.data);
    if (cl.data) setClubs(cl.data);
    if (sp.data) setSports(sp.data);
    setLoading(false);
  };

  /* ── Soft Skills ── */
  const saveSS = async () => {
    setSaving(true);
    const sb = createClient();
    if (ssEditId) await sb.from("soft_skills").update({ ...ssForm }).eq("id", ssEditId);
    else await sb.from("soft_skills").insert({ ...ssForm });
    await fetchAll(); setSsForm({ label_fr: "", label_en: "", description_fr: "", description_en: "", icon: "Users", sort_order: 0 });
    setSsEditId(null); setSsShowForm(false); setSaving(false);
  };
  const editSS = (s: SoftSkill) => { const { id, ...r } = s; setSsForm(r); setSsEditId(id); setSsShowForm(true); };
  const deleteSS = async (id: string) => { if (!confirm("Supprimer ?")) return; await createClient().from("soft_skills").delete().eq("id", id); setSoftSkills((p) => p.filter((x) => x.id !== id)); };

  /* ── Clubs ── */
  const saveClub = async () => {
    setSaving(true);
    const sb = createClient();
    if (clubEditId) await sb.from("clubs").update({ ...clubForm }).eq("id", clubEditId);
    else await sb.from("clubs").insert({ ...clubForm });
    await fetchAll(); setClubForm({ name_fr: "", name_en: "", role_fr: "", description_fr: "", color: "#0077FF", icon: "BrainCircuit", sort_order: 0 });
    setClubEditId(null); setClubShowForm(false); setSaving(false);
  };
  const editClub = (c: Club) => { const { id, ...r } = c; setClubForm(r); setClubEditId(id); setClubShowForm(true); };
  const deleteClub = async (id: string) => { if (!confirm("Supprimer ?")) return; await createClient().from("clubs").delete().eq("id", id); setClubs((p) => p.filter((x) => x.id !== id)); };

  /* ── Sports ── */
  const saveSport = async () => {
    setSaving(true);
    const sb = createClient();
    if (sportEditId) await sb.from("sports").update({ ...sportForm }).eq("id", sportEditId);
    else await sb.from("sports").insert({ ...sportForm });
    await fetchAll(); setSportForm({ name_fr: "", name_en: "", description_fr: "", color: "#FF6B00", icon: "Dumbbell", sort_order: 0 });
    setSportEditId(null); setSportShowForm(false); setSaving(false);
  };
  const editSport = (s: Sport) => { const { id, ...r } = s; setSportForm(r); setSportEditId(id); setSportShowForm(true); };
  const deleteSport = async (id: string) => { if (!confirm("Supprimer ?")) return; await createClient().from("sports").delete().eq("id", id); setSports((p) => p.filter((x) => x.id !== id)); };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ GESTION</div>
          <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Loisirs & Soft Skills</h1>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>Tout le contenu de la page Loisirs est géré ici.</p>
        </div>

        <div className="space-y-6">
          <CrudSection
            title="Soft Skills" color="#0077FF" icon={Users}
            items={softSkills} loading={loading}
            form={ssForm} setForm={setSsForm as (f: Omit<SoftSkill, "id">) => void}
            blank={{ label_fr: "", label_en: "", description_fr: "", description_en: "", icon: "Users", sort_order: 0 }}
            onSave={saveSS} onEdit={editSS} onDelete={deleteSS}
            saving={saving} editId={ssEditId} showForm={ssShowForm} setShowForm={setSsShowForm}
            fields={[
              { key: "label_fr", label: "LIBELLÉ (FR)" },
              { key: "label_en", label: "LABEL (EN)" },
              { key: "description_fr", label: "DESCRIPTION (FR)", rows: 2 },
              { key: "icon", label: "ICÔNE", type: "select", options: ICONS_SS },
              { key: "sort_order", label: "ORDRE" },
            ]}
          />

          <CrudSection
            title="Clubs & Associations" color="#00C3FF" icon={BrainCircuit}
            items={clubs} loading={loading}
            form={clubForm} setForm={setClubForm as (f: Omit<Club, "id">) => void}
            blank={{ name_fr: "", name_en: "", role_fr: "", description_fr: "", color: "#0077FF", icon: "BrainCircuit", sort_order: 0 }}
            onSave={saveClub} onEdit={editClub} onDelete={deleteClub}
            saving={saving} editId={clubEditId} showForm={clubShowForm} setShowForm={setClubShowForm}
            fields={[
              { key: "name_fr", label: "NOM (FR)" },
              { key: "name_en", label: "NAME (EN)" },
              { key: "role_fr", label: "RÔLE" },
              { key: "color", label: "COULEUR", type: "select", options: COLORS },
              { key: "description_fr", label: "DESCRIPTION (FR)", rows: 3 },
              { key: "icon", label: "ICÔNE", type: "select", options: ICONS_C },
            ]}
          />

          <CrudSection
            title="Sports" color="#FF6B00" icon={Dumbbell}
            items={sports} loading={loading}
            form={sportForm} setForm={setSportForm as (f: Omit<Sport, "id">) => void}
            blank={{ name_fr: "", name_en: "", description_fr: "", color: "#FF6B00", icon: "Dumbbell", sort_order: 0 }}
            onSave={saveSport} onEdit={editSport} onDelete={deleteSport}
            saving={saving} editId={sportEditId} showForm={sportShowForm} setShowForm={setSportShowForm}
            fields={[
              { key: "name_fr", label: "NOM (FR)" },
              { key: "name_en", label: "NAME (EN)" },
              { key: "description_fr", label: "DESCRIPTION (FR)", rows: 2 },
              { key: "color", label: "COULEUR", type: "select", options: COLORS },
              { key: "icon", label: "ICÔNE", type: "select", options: ["Dumbbell", "Waves", "Activity", "Bike", "Mountain"] },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
