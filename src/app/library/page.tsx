"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleField } from "@/components/ui/ParticleField";
import { IndustrialBadge } from "@/components/ui/IndustrialBadge";
import { Search, Download, Lock, FileText, Book, Folder, BookOpen, Mail } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

const SECTIONS = ["Tous", "Mes Recherches", "Livres", "Catalogues Machines", "Documents de Formation"];
const DOMAINS = ["Tous", "Automatisation", "Électrique", "Mécanique", "Hydraulique", "Pneumatique", "Réseaux", "Utilitaires"];

const DOCUMENTS = [
  {
    id: 1,
    title_fr: "Guide de maintenance préventive — Moteurs asynchrones",
    section: "Mes Recherches",
    domain: "Électrique",
    size: 2400000,
    date: "2024-03",
    access: "public",
    description_fr: "Guide complet des procédures de maintenance préventive des moteurs asynchrones triphasés.",
    tags: ["moteurs", "maintenance", "électrique"],
  },
  {
    id: 2,
    title_fr: "Manuel TIA Portal V17 — Siemens",
    section: "Documents de Formation",
    domain: "Automatisation",
    size: 15800000,
    date: "2023-09",
    access: "public",
    description_fr: "Manuel d'utilisation complet de TIA Portal V17 pour la programmation S7-1200/1500.",
    tags: ["Siemens", "TIA Portal", "automatisation", "API"],
  },
  {
    id: 3,
    title_fr: "Catalogue ATV312 — Schneider Electric",
    section: "Catalogues Machines",
    domain: "Électrique",
    size: 8200000,
    date: "2023-06",
    access: "public",
    description_fr: "Documentation technique complète du variateur de fréquence Schneider Altivar 312.",
    tags: ["variateur", "Schneider", "ATV312"],
  },
  {
    id: 4,
    title_fr: "Réseaux Industriels Profinet — Analyse approfondie",
    section: "Mes Recherches",
    domain: "Réseaux",
    size: 3600000,
    date: "2024-01",
    access: "restricted",
    description_fr: "Analyse technique des protocoles Profinet IO, configuration et diagnostic.",
    tags: ["Profinet", "réseaux", "Siemens"],
  },
  {
    id: 5,
    title_fr: "Maintenance Industrielle — Livres de référence",
    section: "Livres",
    domain: "Mécanique",
    size: 22000000,
    date: "2022-11",
    access: "restricted",
    description_fr: "Collection de références sur la maintenance industrielle et la fiabilité des équipements.",
    tags: ["maintenance", "mécanique", "fiabilité"],
  },
  {
    id: 6,
    title_fr: "Hydraulique industrielle — Schémas & circuits",
    section: "Mes Recherches",
    domain: "Hydraulique",
    size: 5100000,
    date: "2023-12",
    access: "public",
    description_fr: "Compilation de schémas hydrauliques et circuits types rencontrés en production.",
    tags: ["hydraulique", "schémas", "circuits"],
  },
];

const SECTION_ICONS: Record<string, typeof FileText> = {
  "Mes Recherches": FileText,
  "Livres": Book,
  "Catalogues Machines": Folder,
  "Documents de Formation": BookOpen,
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Tous");
  const [domain, setDomain] = useState("Tous");

  const filtered = DOCUMENTS.filter((doc) => {
    if (section !== "Tous" && doc.section !== section) return false;
    if (domain !== "Tous" && doc.domain !== domain) return false;
    if (search && !doc.title_fr.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: "var(--color-bg-primary)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-25" />
        <ParticleField count={25} />
        <div className="container-portfolio relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="label-tag mb-4" style={{ color: "#0077FF" }}>◆ DOCUMENTATION</div>
            <h1 className="heading-hero mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              Ma Bibliothèque Technique
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: "#64748B" }}>
              Recherches personnelles, manuels techniques, catalogues et ressources de formation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 py-4" style={{ background: "rgba(5,13,26,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,119,255,0.1)" }}>
        <div className="container-portfolio space-y-3">
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-300"
              style={{
                background: "rgba(13,21,37,0.8)",
                border: "1px solid rgba(0,119,255,0.2)",
                color: "white",
              }}
            />
          </div>
          {/* Section / Domain filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1 flex-wrap">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: section === s ? "rgba(0,119,255,0.2)" : "transparent",
                    border: `1px solid ${section === s ? "rgba(0,119,255,0.5)" : "rgba(255,255,255,0.05)"}`,
                    color: section === s ? "#00C3FF" : "#475569",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="flex gap-1 flex-wrap">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: domain === d ? "rgba(255,107,0,0.15)" : "transparent",
                    border: `1px solid ${domain === d ? "rgba(255,107,0,0.4)" : "rgba(255,255,255,0.05)"}`,
                    color: domain === d ? "#FF8C33" : "#475569",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-pad">
        <div className="container-portfolio">
          <div className="label-tag mb-6" style={{ color: "#475569" }}>
            {filtered.length} document{filtered.length > 1 ? "s" : ""}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((doc, i) => {
                const SectionIcon = SECTION_ICONS[doc.section] ?? FileText;
                return (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="flex items-center gap-4 p-4 rounded-xl card-hover"
                    style={{
                      background: "rgba(13,21,37,0.6)",
                      border: "1px solid rgba(0,119,255,0.1)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,119,255,0.1)", border: "1px solid rgba(0,119,255,0.2)" }}
                    >
                      <SectionIcon size={16} style={{ color: "#0077FF" }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1 truncate" style={{ color: "white" }}>
                        {doc.title_fr}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <IndustrialBadge>{doc.section}</IndustrialBadge>
                        <IndustrialBadge>{doc.domain}</IndustrialBadge>
                        <span className="text-xs" style={{ color: "#334155" }}>
                          {formatFileSize(doc.size)} · {doc.date}
                        </span>
                      </div>
                    </div>

                    {/* Access */}
                    {doc.access === "public" ? (
                      <a
                        href={`/library/${doc.id}`}
                        download
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 flex-shrink-0"
                        style={{
                          background: "rgba(0,119,255,0.12)",
                          border: "1px solid rgba(0,119,255,0.3)",
                          color: "#00C3FF",
                        }}
                      >
                        <Download size={13} />
                        Télécharger
                      </a>
                    ) : (
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium flex-shrink-0"
                        style={{
                          background: "rgba(255,107,0,0.06)",
                          border: "1px solid rgba(255,107,0,0.2)",
                          color: "#FF6B00",
                        }}
                      >
                        <Lock size={13} />
                        Accès restreint
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
