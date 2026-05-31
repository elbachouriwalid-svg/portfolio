"use client";
import { motion } from "framer-motion";
import { ParticleField } from "@/components/ui/ParticleField";
import { Calendar, Award, CheckCircle, BookOpen, GraduationCap } from "lucide-react";

const DIPLOMAS = [
  {
    id: 1,
    title_fr: "Brevet de Technicien Supérieur — Électromécanique Industrielle",
    institution: "OFPPT — Maroc",
    period: "2019 — 2021",
    knowledge: [
      "Électrotechnique & Machines tournantes",
      "Automatismes industriels & API",
      "Pneumatique & Hydraulique industrielle",
      "Maintenance préventive & corrective",
      "Schémas électriques industriels",
      "Gestion de la maintenance GMAO",
    ],
  },
  {
    id: 2,
    title_fr: "Baccalauréat Sciences & Technologies Électriques",
    institution: "Lycée Technique — Maroc",
    period: "2017 — 2019",
    knowledge: [
      "Électricité générale",
      "Mathématiques appliquées",
      "Physique & Sciences de l'ingénieur",
      "Technologie des systèmes automatisés",
    ],
  },
];

const CERTIFICATIONS = [
  {
    id: 1,
    title_fr: "Formation Siemens TIA Portal S7-1200/1500",
    organization: "OFPPT / Siemens",
    date: "2022",
    skills: ["Programmation ladder & FBD", "Configuration Profinet", "Diagnostic à distance", "Safety intégré"],
  },
  {
    id: 2,
    title_fr: "Habilitation Électrique BR/BC",
    organization: "CRAM",
    date: "2021",
    skills: ["Consignation / déconsignation", "Travaux hors tension", "Travaux au voisinage", "Vérification d'absence de tension"],
  },
  {
    id: 3,
    title_fr: "Formation Variateurs de Fréquence — Schneider Altivar",
    organization: "Schneider Electric",
    date: "2023",
    skills: ["Paramétrage ATV12/312/320", "Diagnostic codes défauts", "Réglages PID", "Communication Modbus"],
  },
];

const CONTINUOUS = [
  "Analyse vibratoire des équipements rotatifs (auto-formation)",
  "IIoT & maintenance prédictive — Coursera",
  "Réseaux Ethernet industriels EtherCAT (documentation Beckhoff)",
  "Lean Manufacturing & 5S en environnement industriel",
  "Sécurité fonctionnelle SIL — documentation IEC 62061",
];

export default function AcademicPage() {
  return (
    <div style={{ background: "var(--color-bg-primary)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-25" />
        <ParticleField count={25} />
        <div className="container-portfolio relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="label-tag mb-4" style={{ color: "#0077FF" }}>◆ FORMATION</div>
            <h1 className="heading-hero mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
              Académique &amp; Certifications
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: "#64748B" }}>
              Formation officielle, certifications professionnelles et développement continu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Diplomas */}
      <section className="section-pad">
        <div className="container-portfolio">
          <div className="label-tag mb-3" style={{ color: "#0077FF" }}>◆ DIPLÔMES OFFICIELS</div>
          <h2 className="heading-xl mb-12" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
            Formation Académique
          </h2>

          <div className="space-y-8">
            {DIPLOMAS.map((dip, i) => (
              <motion.div
                key={dip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="grid lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(0,119,255,0.2)" }}
              >
                {/* Left accent */}
                <div
                  className="lg:col-span-1 p-8 flex flex-col items-center justify-center text-center"
                  style={{ background: "linear-gradient(135deg, rgba(0,119,255,0.15), rgba(0,195,255,0.08))" }}
                >
                  <GraduationCap size={36} className="mb-3" style={{ color: "#0077FF" }} />
                  <div className="label-tag" style={{ color: "#00C3FF" }}>{dip.period}</div>
                  <div className="text-xs mt-1" style={{ color: "#334155" }}>{dip.institution}</div>
                </div>

                {/* Content */}
                <div className="lg:col-span-4 p-8" style={{ background: "rgba(13,21,37,0.6)" }}>
                  <h3 className="font-bold text-xl mb-5" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
                    {dip.title_fr}
                  </h3>
                  <div className="label-tag mb-4" style={{ color: "#475569" }}>CONNAISSANCES ACQUISES</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {dip.knowledge.map((k) => (
                      <div key={k} className="flex items-center gap-2">
                        <CheckCircle size={13} style={{ color: "#22D3EE", flexShrink: 0 }} />
                        <span className="text-sm" style={{ color: "#94A3B8" }}>{k}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-pad" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="container-portfolio">
          <div className="label-tag mb-3" style={{ color: "#FF6B00" }}>◆ CERTIFICATIONS</div>
          <h2 className="heading-xl mb-12" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
            Certifications Professionnelles
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(13,21,37,0.7)",
                  border: "1px solid rgba(255,107,0,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)" }}
                  >
                    <Award size={18} style={{ color: "#FF6B00" }} />
                  </div>
                  <div>
                    <div className="label-tag" style={{ color: "#FF6B00" }}>{cert.date}</div>
                    <div className="text-xs" style={{ color: "#334155" }}>{cert.organization}</div>
                  </div>
                </div>

                <h3 className="font-semibold mb-4" style={{ color: "white" }}>{cert.title_fr}</h3>

                <div className="space-y-1.5">
                  {cert.skills.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#FF6B00" }} />
                      <span className="text-xs" style={{ color: "#64748B" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Continuous learning */}
      <section className="section-pad">
        <div className="container-portfolio max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl"
            style={{
              background: "rgba(13,21,37,0.7)",
              border: "1px solid rgba(0,119,255,0.15)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={24} style={{ color: "#0077FF" }} />
              <div>
                <div className="label-tag" style={{ color: "#0077FF" }}>◆ FORMATION CONTINUE</div>
                <h2 className="heading-md" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
                  Apprentissage Autonome
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {CONTINUOUS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: "rgba(0,119,255,0.04)" }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(0,119,255,0.15)", border: "1px solid rgba(0,119,255,0.3)" }}
                  >
                    <span className="text-xs font-bold" style={{ color: "#0077FF" }}>{i + 1}</span>
                  </div>
                  <span className="text-sm" style={{ color: "#94A3B8" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
