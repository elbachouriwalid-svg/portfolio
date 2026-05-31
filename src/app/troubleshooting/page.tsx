"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleField } from "@/components/ui/ParticleField";
import { IndustrialBadge } from "@/components/ui/IndustrialBadge";
import { X, Clock, AlertTriangle, Wrench, BookOpen, ChevronRight } from "lucide-react";

const DOMAINS = ["Tous", "Électrique", "Automatisation", "Réseaux", "Mécanique", "Pneumatique", "Utilitaires"];
const CRITICALITIES = ["Tous", "Critique", "Majeur", "Modéré", "Mineur"];
const SITES = ["Tous", "SICDA", "IMACAB"];
const STATUSES = ["Tous", "Résolu", "En cours", "Observation"];

const INCIDENTS = [
  {
    id: 1,
    title_fr: "Court-circuit armoire électrique ligne 3",
    domain: "Électrique",
    criticality: "critical",
    status: "resolved",
    site: "IMACAB",
    downtime: 180,
    symptoms_fr: "Disjoncteur principal déclenche immédiatement à la remise sous tension. Odeur de brûlé dans l'armoire.",
    root_cause_fr: "Câble de puissance dénudé en contact avec la carcasse métallique suite à une vibration prolongée ayant usé l'isolation.",
    solution_fr: "Remplacement du câble endommagé, vérification de l'ensemble du câblage de l'armoire, remise en service progressive avec test d'isolement.",
    lessons_fr: "Mise en place d'inspections mensuelles des câbles dans les zones à forte vibration. Ajout de colliers de fixation supplémentaires.",
  },
  {
    id: 2,
    title_fr: "Défaut variateur Schneider ATV312 — Défaut de phase",
    domain: "Électrique",
    criticality: "major",
    status: "resolved",
    site: "SICDA",
    downtime: 95,
    symptoms_fr: "Alarme PHF sur IHM. Moteur refuse de démarrer. Ligne d'extrusion arrêtée.",
    root_cause_fr: "Contacteur de puissance amont avec contact usé créant une résistance élevée sur la phase R.",
    solution_fr: "Remplacement du contacteur. Test des phases sous charge. Reprise production.",
    lessons_fr: "Intégration du contrôle des contacteurs dans le plan de maintenance préventive trimestrielle.",
  },
  {
    id: 3,
    title_fr: "Perte communication Profinet capteur pression",
    domain: "Réseaux",
    criticality: "major",
    status: "resolved",
    site: "IMACAB",
    downtime: 45,
    symptoms_fr: "Alarme réseau sur TIA Portal. Capteur IO-Link non détecté par le master Siemens.",
    root_cause_fr: "Connecteur RJ45 corrodé sur le switch industriel Hirschmann suite à une infiltration d'humidité.",
    solution_fr: "Remplacement du connecteur, nettoyage des contacts, étanchéification du coffret réseau.",
    lessons_fr: "Vérification trimestrielle de l'étanchéité de tous les coffrets réseau. Utilisation de connecteurs IP67.",
  },
  {
    id: 4,
    title_fr: "Vibrations excessives moteur pompe hydraulique",
    domain: "Mécanique",
    criticality: "medium",
    status: "resolved",
    site: "SICDA",
    downtime: 240,
    symptoms_fr: "Vibrations anormales détectées visuellement et par analyse vibratoire. Bruit mécanique inhabituel.",
    root_cause_fr: "Palier à roulement défaillant côté accouplement. Jeu excessif dû à une lubrification insuffisante.",
    solution_fr: "Remplacement des roulements, réalignement laser de l'accouplement, ajustement du plan de graissage.",
    lessons_fr: "Mise en place d'analyse vibratoire mensuelle sur les équipements rotatifs critiques.",
  },
  {
    id: 5,
    title_fr: "Surchauffe compresseur air instrument",
    domain: "Utilitaires",
    criticality: "critical",
    status: "resolved",
    site: "IMACAB",
    downtime: 320,
    symptoms_fr: "Température huile > 110°C. Arrêt sécurité automatique. Toute la production pneumatique affectée.",
    root_cause_fr: "Échangeur thermique colmaté. Filtre à air encrassé réduisant le débit de refroidissement de 60%.",
    solution_fr: "Nettoyage chimique de l'échangeur, remplacement du filtre, vidange huile, remise en service.",
    lessons_fr: "Plan de nettoyage des échangeurs tous les 6 mois. Remplacement filtres selon heures de fonctionnement.",
  },
  {
    id: 6,
    title_fr: "Erreur encodeur axe 3 robot KUKA",
    domain: "Automatisation",
    criticality: "major",
    status: "resolved",
    site: "IMACAB",
    downtime: 150,
    symptoms_fr: "Erreur E1063 sur contrôleur KRC4. Robot en défaut position axe 3. Arrêt cellule robotisée.",
    root_cause_fr: "Câble encodeur pincé lors d'un mouvement extrême. Rupture partielle des conducteurs de données.",
    solution_fr: "Remplacement faisceau encodeur KUKA d'origine, recalibration de l'axe, tests de validation.",
    lessons_fr: "Inspection des câbles robot lors des maintenances trimestrielles. Respect des rayons de courbure min.",
  },
];

const CRIT_MAP: Record<string, string> = {
  critical: "Critique",
  major: "Majeur",
  medium: "Modéré",
  minor: "Mineur",
};

const STATUS_MAP: Record<string, string> = {
  resolved: "Résolu",
  in_progress: "En cours",
  observation: "Observation",
};

export default function TroubleshootingPage() {
  const [selectedDomain, setSelectedDomain] = useState("Tous");
  const [selectedCrit, setSelectedCrit] = useState("Tous");
  const [selectedSite, setSelectedSite] = useState("Tous");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [openIncident, setOpenIncident] = useState<typeof INCIDENTS[0] | null>(null);

  const filtered = INCIDENTS.filter((inc) => {
    if (selectedDomain !== "Tous" && inc.domain !== selectedDomain) return false;
    if (selectedCrit !== "Tous" && CRIT_MAP[inc.criticality] !== selectedCrit) return false;
    if (selectedSite !== "Tous" && inc.site !== selectedSite) return false;
    if (selectedStatus !== "Tous" && STATUS_MAP[inc.status] !== selectedStatus) return false;
    return true;
  });

  return (
    <div style={{ background: "var(--color-bg-primary)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-30" />
        <ParticleField count={30} />
        <div className="container-portfolio relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="label-tag mb-4" style={{ color: "#FF6B00" }}>◆ BASE DE DONNÉES MAINTENANCE</div>
            <h1 className="heading-hero mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              Troubleshooting
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: "#64748B" }}>
              Interventions techniques documentées — diagnostic, causes racines, solutions implémentées.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 py-4" style={{ background: "rgba(5,13,26,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,119,255,0.1)" }}>
        <div className="container-portfolio">
          <div className="flex flex-wrap gap-4 items-center">
            {[
              { label: "Domaine", options: DOMAINS, value: selectedDomain, set: setSelectedDomain },
              { label: "Criticité", options: CRITICALITIES, value: selectedCrit, set: setSelectedCrit },
              { label: "Site", options: SITES, value: selectedSite, set: setSelectedSite },
              { label: "Statut", options: STATUSES, value: selectedStatus, set: setSelectedStatus },
            ].map(({ label, options, value, set }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="label-tag text-xs" style={{ color: "#475569" }}>{label}:</span>
                <div className="flex gap-1 flex-wrap">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => set(opt)}
                      className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: value === opt ? "rgba(0,119,255,0.2)" : "transparent",
                        border: `1px solid ${value === opt ? "rgba(0,119,255,0.5)" : "rgba(255,255,255,0.05)"}`,
                        color: value === opt ? "#00C3FF" : "#475569",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-pad">
        <div className="container-portfolio">
          <div className="label-tag mb-6" style={{ color: "#475569" }}>
            {filtered.length} intervention{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((inc, i) => (
                <motion.div
                  key={inc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="p-5 rounded-2xl card-hover cursor-pointer group"
                  style={{
                    background: "rgba(13,21,37,0.7)",
                    border: "1px solid rgba(0,119,255,0.12)",
                  }}
                  onClick={() => setOpenIncident(inc)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <IndustrialBadge variant="criticality" value={inc.criticality}>
                      {CRIT_MAP[inc.criticality]}
                    </IndustrialBadge>
                    <IndustrialBadge variant="status" value={inc.status}>
                      {STATUS_MAP[inc.status]}
                    </IndustrialBadge>
                  </div>

                  <h3
                    className="font-semibold mb-3 group-hover:text-white transition-colors leading-snug"
                    style={{ color: "#CBD5E1" }}
                  >
                    {inc.title_fr}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      <IndustrialBadge>{inc.domain}</IndustrialBadge>
                      <IndustrialBadge>{inc.site}</IndustrialBadge>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: "#475569" }}>
                      <Clock size={12} />
                      <span className="text-xs">{inc.downtime} min</span>
                    </div>
                  </div>

                  <div
                    className="mt-3 pt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ borderTop: "1px solid rgba(0,119,255,0.1)", color: "#0077FF" }}
                  >
                    Voir le détail <ChevronRight size={12} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Incident detail modal */}
      <AnimatePresence>
        {openIncident && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpenIncident(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-20 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-50 overflow-y-auto rounded-2xl"
              style={{
                background: "rgba(10,15,28,0.98)",
                border: "1px solid rgba(0,119,255,0.25)",
                backdropFilter: "blur(40px)",
              }}
            >
              {/* Header */}
              <div
                className="sticky top-0 flex items-start justify-between p-6 gap-4"
                style={{
                  background: "rgba(10,15,28,0.95)",
                  borderBottom: "1px solid rgba(0,119,255,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex-1">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <IndustrialBadge variant="criticality" value={openIncident.criticality}>
                      {CRIT_MAP[openIncident.criticality]}
                    </IndustrialBadge>
                    <IndustrialBadge variant="status" value={openIncident.status}>
                      {STATUS_MAP[openIncident.status]}
                    </IndustrialBadge>
                    <IndustrialBadge>{openIncident.domain}</IndustrialBadge>
                    <IndustrialBadge>{openIncident.site}</IndustrialBadge>
                  </div>
                  <h2 className="heading-md" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
                    {openIncident.title_fr}
                  </h2>
                </div>
                <button
                  onClick={() => setOpenIncident(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#64748B" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Downtime */}
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)" }}
                >
                  <Clock size={20} style={{ color: "#FF6B00", flexShrink: 0 }} />
                  <div>
                    <div className="label-tag mb-0.5" style={{ color: "#FF6B00" }}>TEMPS D'ARRÊT</div>
                    <div className="font-bold text-xl" style={{ color: "white" }}>
                      {openIncident.downtime} minutes
                    </div>
                  </div>
                </div>

                {[
                  { icon: AlertTriangle, label: "SYMPTÔMES OBSERVÉS", color: "#EF4444", content: openIncident.symptoms_fr },
                  { icon: Wrench, label: "CAUSE RACINE IDENTIFIÉE", color: "#F97316", content: openIncident.root_cause_fr },
                  { icon: Wrench, label: "SOLUTION IMPLÉMENTÉE", color: "#22D3EE", content: openIncident.solution_fr },
                  { icon: BookOpen, label: "LEÇONS APPRISES", color: "#22C55E", content: openIncident.lessons_fr },
                ].map(({ icon: Icon, label, color, content }) => (
                  <div
                    key={label}
                    className="p-5 rounded-xl"
                    style={{
                      background: "rgba(13,21,37,0.6)",
                      border: `1px solid ${color}22`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} style={{ color }} />
                      <span className="label-tag" style={{ color }}>{label}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
