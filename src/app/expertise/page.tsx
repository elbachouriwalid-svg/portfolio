"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleField } from "@/components/ui/ParticleField";
import { IndustrialBadge } from "@/components/ui/IndustrialBadge";
import { ChevronDown, ChevronUp, MapPin, Calendar, Factory, FileText, StickyNote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Types ── */
interface Competency { id: string; name_fr: string; name_en: string; current_level: number; target_level: number; category: string; sort_order: number; }
interface Process { id: string; name_fr: string; company: string; description_fr: string; notes: string; sort_order: number; }

/* ── Hardcoded experiences (fetched from DB when available) ── */
const STATIC_EXPERIENCES = [
  {
    id: 1, title_fr: "Technicien Électromécanique", company: "IMACAB", location: "Maroc",
    period_start: "2023", period_end: null, status: "current",
    description_fr: "Maintenance préventive et corrective des équipements de production de câbles industriels. Intervention sur les systèmes électriques, automates programmables et réseaux industriels. Participation aux projets d'amélioration continue et d'automatisation des lignes de production.",
    skills: ["Maintenance Préventive", "Automates Siemens S7", "Profinet", "Câblage industriel", "Pneumatique", "Hydraulique"],
  },
  {
    id: 2, title_fr: "Technicien de Maintenance Industrielle", company: "SICDA", location: "Maroc",
    period_start: "2021", period_end: "2023", status: "completed",
    description_fr: "Maintenance des lignes de production (injection plastique, extrusion). Diagnostic et résolution des pannes électromécaniques. Gestion des plans de maintenance préventive. Participation aux projets d'optimisation des processus industriels.",
    skills: ["Injection Plastique", "Extrusion", "Variateurs de fréquence", "Électrotechnique", "Schémas électriques", "Sécurité industrielle"],
  },
];

const STATIC_COMPETENCIES: Competency[] = [
  { id: "1", name_fr: "Électrotechnique", name_en: "Electrotechnics", current_level: 90, target_level: 95, category: "Électrique", sort_order: 1 },
  { id: "2", name_fr: "Automatisation API", name_en: "PLC Automation", current_level: 70, target_level: 90, category: "Automatisation", sort_order: 2 },
  { id: "3", name_fr: "Réseaux Industriels", name_en: "Industrial Networks", current_level: 65, target_level: 85, category: "Réseaux", sort_order: 3 },
  { id: "4", name_fr: "Maintenance Préventive", name_en: "Preventive Maintenance", current_level: 85, target_level: 95, category: "Maintenance", sort_order: 4 },
  { id: "5", name_fr: "Pneumatique / Hydraulique", name_en: "Pneumatics / Hydraulics", current_level: 75, target_level: 85, category: "Mécanique", sort_order: 5 },
  { id: "6", name_fr: "Industrie 4.0 / IIoT", name_en: "Industry 4.0 / IIoT", current_level: 45, target_level: 80, category: "Numérique", sort_order: 6 },
];

const STATIC_PROCESSES: Process[] = [
  { id: "1", name_fr: "Injection Plastique", company: "SICDA", description_fr: "Maintenance des presses à injection plastique, gestion des alarmes, réglage des paramètres process (température, pression, vitesse d'injection).", notes: "", sort_order: 1 },
  { id: "2", name_fr: "Extrusion Plastique", company: "SICDA", description_fr: "Maintenance des lignes d'extrusion, changement de filières, contrôle des variateurs de fréquence et des systèmes de régulation thermique.", notes: "", sort_order: 2 },
  { id: "3", name_fr: "Tréfilage Cuivre", company: "IMACAB", description_fr: "Maintenance des bancs de tréfilage cuivre, réglage des filières, contrôle des systèmes de lubrification et des capteurs de tension du fil.", notes: "", sort_order: 3 },
  { id: "4", name_fr: "Tréfilage Aluminium", company: "IMACAB", description_fr: "Maintenance des lignes de tréfilage aluminium, gestion des systèmes de recuit et contrôle des paramètres mécaniques de déformation.", notes: "", sort_order: 4 },
  { id: "5", name_fr: "Fabrication de Câbles", company: "IMACAB", description_fr: "Maintenance des machines d'assemblage et de toronnage, contrôle qualité des câbles, gestion des paramètres de fabrication.", notes: "", sort_order: 5 },
  { id: "6", name_fr: "Gainage", company: "IMACAB", description_fr: "Maintenance des lignes de gainage, contrôle des extrudeuses de gainage, gestion des paramètres d'adhérence et d'épaisseur.", notes: "", sort_order: 6 },
  { id: "7", name_fr: "AGS", company: "IMACAB", description_fr: "Maintenance du système AGS (Armement Gaine Spirale), contrôle des automates de séquençage et des capteurs de position.", notes: "", sort_order: 7 },
  { id: "8", name_fr: "Utilités Industrielles", company: "Les deux", description_fr: "Maintenance des utilités (air comprimé, eau de refroidissement, éclairage industriel, HVAC), gestion des tableaux électriques de distribution.", notes: "", sort_order: 8 },
];

/* ── SkillBar ── */
function SkillBar({ item, delay }: { item: Competency; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.6 }} className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: "#CBD5E1" }}>{item.name_fr}</span>
        <div className="flex gap-3 text-xs" style={{ color: "#475569" }}>
          <span style={{ color: "#0077FF" }}>Actuel: {item.current_level}%</span>
          <span style={{ color: "#FF6B00" }}>Cible: {item.target_level}%</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.target_level}%` }} viewport={{ once: true }} transition={{ delay: delay + 0.1, duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full opacity-20" style={{ background: "#FF6B00" }} />
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.current_level}%` }} viewport={{ once: true }} transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full" style={{ background: "linear-gradient(90deg, #0077FF, #00C3FF)", boxShadow: "0 0 8px rgba(0,195,255,0.5)" }} />
      </div>
    </motion.div>
  );
}

/* ── ProcessModule ── */
function ProcessModule({ proc, index }: { proc: Process; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(13,21,37,0.7)", border: `1px solid ${open ? "rgba(255,107,0,0.3)" : "rgba(255,107,0,0.12)"}`, transition: "border-color 0.3s" }}
    >
      <button className="w-full flex items-center gap-4 p-5 text-left" onClick={() => setOpen(!open)}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: open ? "rgba(255,107,0,0.2)" : "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)", transition: "background 0.3s" }}>
          <Factory size={18} style={{ color: "#FF6B00" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm" style={{ color: "white" }}>{proc.name_fr}</div>
          <div className="label-tag mt-0.5" style={{ color: "#475569" }}>{proc.company}</div>
        </div>
        <div style={{ color: open ? "#FF6B00" : "#475569", transition: "color 0.3s" }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ borderTop: "1px solid rgba(255,107,0,0.1)" }}
          >
            <div className="p-5 space-y-4">
              {proc.description_fr && (
                <div>
                  <div className="label-tag mb-2 flex items-center gap-1.5" style={{ color: "#FF6B00" }}>
                    <FileText size={10} /> DESCRIPTION TECHNIQUE
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{proc.description_fr}</p>
                </div>
              )}
              {proc.notes && (
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,107,0,0.05)", border: "1px solid rgba(255,107,0,0.1)" }}>
                  <div className="label-tag mb-1 flex items-center gap-1.5" style={{ color: "#FF8C33" }}>
                    <StickyNote size={10} /> NOTES
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{proc.notes}</p>
                </div>
              )}
              <div className="p-3 rounded-xl" style={{ background: "rgba(0,119,255,0.04)", border: "1px solid rgba(0,119,255,0.08)" }}>
                <p className="text-xs" style={{ color: "#334155" }}>
                  📁 Documents, photos et schémas techniques peuvent être ajoutés depuis le tableau de bord admin.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ExpertisePage() {
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>(STATIC_COMPETENCIES);
  const [processes, setProcesses] = useState<Process[]>(STATIC_PROCESSES);

  useEffect(() => {
    const sb = createClient();
    sb.from("competencies").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setCompetencies(data);
    });
    sb.from("processes").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setProcesses(data);
    });
  }, []);

  return (
    <div style={{ background: "var(--color-bg-primary)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(0,119,255,0.05) 0%, transparent 100%)" }}>
        <div className="absolute inset-0 industrial-grid opacity-30" />
        <ParticleField count={40} />
        <div className="container-portfolio relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="label-tag mb-4" style={{ color: "#0077FF" }}>◆ TERRAIN</div>
            <h1 className="heading-hero mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Expertise Terrain</h1>
            <p className="text-lg max-w-2xl" style={{ color: "#64748B" }}>
              Parcours professionnel, compétences acquises et processus industriels maîtrisés dans des environnements de production exigeants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad">
        <div className="container-portfolio">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="label-tag mb-3" style={{ color: "#0077FF" }}>◆ PARCOURS</div>
            <h2 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Expériences Professionnelles</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, #0077FF, rgba(0,119,255,0.1))" }} />
            <div className="space-y-8">
              {STATIC_EXPERIENCES.map((exp, i) => (
                <motion.div key={exp.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7 }} className="relative md:pl-20">
                  <div className="absolute left-6 top-6 w-4 h-4 rounded-full hidden md:flex items-center justify-center"
                    style={{ background: exp.status === "current" ? "#0077FF" : "#1A2A4A", border: "2px solid #0077FF", boxShadow: exp.status === "current" ? "0 0 12px rgba(0,119,255,0.7)" : "none" }}>
                    {exp.status === "current" && <div className="w-2 h-2 rounded-full" style={{ background: "#00C3FF", animation: "glow-pulse 2s infinite" }} />}
                  </div>
                  <div className="p-6 rounded-2xl card-hover cursor-pointer"
                    style={{ background: "rgba(13,21,37,0.7)", border: `1px solid ${exp.status === "current" ? "rgba(0,119,255,0.3)" : "rgba(0,119,255,0.1)"}` }}
                    onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-bold text-lg" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{exp.title_fr}</h3>
                          {exp.status === "current" && <IndustrialBadge>En poste</IndustrialBadge>}
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-semibold" style={{ color: "#0077FF" }}>{exp.company}</span>
                          <div className="flex items-center gap-1.5" style={{ color: "#475569" }}><MapPin size={12} /><span className="text-xs">{exp.location}</span></div>
                          <div className="flex items-center gap-1.5" style={{ color: "#475569" }}><Calendar size={12} /><span className="text-xs">{exp.period_start} — {exp.period_end ?? "Présent"}</span></div>
                        </div>
                      </div>
                      <div style={{ color: "#475569" }}>{expandedExp === exp.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                    </div>
                    {expandedExp === exp.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.4 }} className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(0,119,255,0.1)" }}>
                        <p className="text-sm mb-5 leading-relaxed" style={{ color: "#64748B" }}>{exp.description_fr}</p>
                        <div className="label-tag mb-3" style={{ color: "#475569" }}>COMPÉTENCES ACQUISES</div>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 rounded-lg text-xs font-medium"
                              style={{ background: "rgba(0,119,255,0.1)", border: "1px solid rgba(0,119,255,0.2)", color: "#94A3B8" }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Evolution — full width, no networks */}
      <section className="section-pad" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="container-portfolio">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="label-tag mb-3" style={{ color: "#0077FF" }}>◆ ÉVOLUTION</div>
            <h2 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Maîtrise des Compétences</h2>
          </motion.div>

          <div className="max-w-3xl">
            {competencies.map((c, i) => <SkillBar key={c.id} item={c} delay={i * 0.08} />)}
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 rounded-full" style={{ background: "linear-gradient(90deg, #0077FF, #00C3FF)" }} />
                <span className="text-xs" style={{ color: "#475569" }}>Niveau actuel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 rounded-full" style={{ background: "#FF6B00", opacity: 0.4 }} />
                <span className="text-xs" style={{ color: "#475569" }}>Objectif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Processes — expandable modules */}
      <section className="section-pad">
        <div className="container-portfolio">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="label-tag mb-3" style={{ color: "#FF6B00" }}>◆ PROCESSUS</div>
            <h2 className="heading-xl mb-2" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Processus Industriels Maîtrisés</h2>
            <p className="text-sm" style={{ color: "#475569" }}>
              Cliquez sur un processus pour explorer la description technique, les notes et les ressources associées.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {processes.map((proc, i) => <ProcessModule key={proc.id} proc={proc} index={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
