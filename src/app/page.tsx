"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  Download, Phone, Mail, Linkedin, MapPin,
  ArrowRight, ChevronRight, Zap, Settings, Cpu, Network,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { IndustrialBadge } from "@/components/ui/IndustrialBadge";
import { ParticleField } from "@/components/ui/ParticleField";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

const IndustrialScene = dynamic(
  () => import("@/components/three/IndustrialScene").then((m) => m.IndustrialScene),
  { ssr: false }
);

/* ── Role typing ── */
const ROLES = [
  "Technicien Électromécanique Industriel",
  "Expert en Maintenance Industrielle",
  "Spécialiste Automatisation Industrielle",
  "Technicien Réseaux Industriels",
];

function RoleTyping() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = ROLES[roleIndex];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 50);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 2500);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }
  }, [displayed, deleting, roleIndex]);
  return (
    <span className="gradient-text-blue">
      {displayed}
      <span className="inline-block w-0.5 h-8 ml-1 align-middle" style={{ background: "#00C3FF", animation: "glow-pulse 1s ease-in-out infinite" }} />
    </span>
  );
}

/* ── Static fallbacks ── */
const STATIC_STATS = [
  { value: 120, label: "Incidents Résolus", suffix: "+" },
  { value: 8, label: "Certifications", suffix: "" },
  { value: 4, label: "Années d'Expérience", suffix: "" },
  { value: 15, label: "Technologies Maîtrisées", suffix: "+" },
];
const STATIC_INCIDENTS = [
  { id: "1", title_fr: "Court-circuit armoire électrique L3", category: "Électrique", criticality: "critical", status: "resolved" },
  { id: "2", title_fr: "Défaut variateur Schneider ATV312", category: "Automatisation", criticality: "major", status: "resolved" },
  { id: "3", title_fr: "Vibrations excessives moteur pompe hydraulique", category: "Mécanique", criticality: "medium", status: "resolved" },
  { id: "4", title_fr: "Perte communication Profinet capteur pression", category: "Réseaux", criticality: "major", status: "resolved" },
  { id: "5", title_fr: "Surchauffe compresseur air instrument", category: "Utilitaires", criticality: "critical", status: "resolved" },
  { id: "6", title_fr: "Erreur encodeur axe 3 robot KUKA", category: "Automatisation", criticality: "major", status: "resolved" },
];

/* ── Industrial Portrait Frame ── */
function PortraitFrame({ src }: { src: string | null }) {
  return (
    <div className="relative select-none">
      {/* Outer glow */}
      <div className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,119,255,0.18) 0%, transparent 70%)", filter: "blur(20px)" }} />

      {/* Main frame */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,195,255,0.35)", boxShadow: "0 0 0 1px rgba(0,119,255,0.08), 0 25px 60px rgba(0,0,0,0.5)" }}>

        {/* Corner brackets */}
        {[
          { pos: "top-0 left-0", bt: "2px solid #00C3FF", bl: "2px solid #00C3FF", br: "none", bb: "none" },
          { pos: "top-0 right-0", bt: "2px solid #00C3FF", br: "2px solid #00C3FF", bl: "none", bb: "none" },
          { pos: "bottom-0 left-0", bb: "2px solid #00C3FF", bl: "2px solid #00C3FF", bt: "none", br: "none" },
          { pos: "bottom-0 right-0", bb: "2px solid #00C3FF", br: "2px solid #00C3FF", bt: "none", bl: "none" },
        ].map(({ pos, ...s }, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 z-20`}
            style={{ borderTop: s.bt, borderLeft: s.bl, borderRight: s.br, borderBottom: s.bb, borderRadius: "2px" }} />
        ))}

        {/* Animated scan line */}
        <motion.div className="absolute left-0 right-0 h-px z-20 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,195,255,0.7) 50%, transparent 100%)" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

        {/* Portrait or Placeholder */}
        {src ? (
          <Image src={src} alt="Walid El Bachouri — Technicien Électromécanique"
            width={560} height={680} priority
            className="w-full object-cover object-top"
            style={{ aspectRatio: "4/5", filter: "brightness(0.92) contrast(1.08) saturate(0.95)" }} />
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-4"
            style={{ aspectRatio: "4/5", background: "linear-gradient(145deg, rgba(0,119,255,0.08), rgba(13,21,37,1))" }}>
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold"
              style={{ background: "linear-gradient(135deg, rgba(0,119,255,0.15), rgba(0,195,255,0.05))", border: "1px solid rgba(0,119,255,0.25)", color: "#0077FF", fontFamily: "var(--font-manrope)" }}>
              WB
            </div>
            <p className="text-xs text-center px-8 leading-relaxed" style={{ color: "#334155" }}>
              Ajoutez votre photo depuis<br />Admin → Profil & Contact
            </p>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(5,13,26,0.75) 0%, transparent 45%)" }} />

        {/* Status badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg z-20"
          style={{ background: "rgba(5,13,26,0.9)", border: "1px solid rgba(0,195,255,0.3)", backdropFilter: "blur(12px)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22D3EE", animation: "glow-pulse 2s infinite" }} />
          <span className="label-tag" style={{ color: "#22D3EE" }}>TECHNICIEN ACTIF — MAROC</span>
        </div>

        {/* Company tag */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(5,13,26,0.88)", border: "1px solid rgba(0,119,255,0.2)", backdropFilter: "blur(10px)" }}>
          <span className="label-tag" style={{ color: "#475569" }}>IMACAB · 2023–</span>
        </div>
      </div>

      {/* Floating card */}
      <motion.div className="absolute -right-5 top-16 p-4 rounded-xl z-30 hidden lg:block"
        animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "rgba(13,21,37,0.97)", border: "1px solid rgba(0,119,255,0.35)", backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
        <div className="text-2xl font-bold gradient-text-blue" style={{ fontFamily: "var(--font-manrope)" }}>4+</div>
        <div className="text-xs" style={{ color: "#475569" }}>Années terrain</div>
      </motion.div>

      {/* Second floating card */}
      <motion.div className="absolute -left-5 bottom-20 p-4 rounded-xl z-30 hidden lg:block"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ background: "rgba(13,21,37,0.97)", border: "1px solid rgba(255,107,0,0.3)", backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
        <div className="text-2xl font-bold" style={{ color: "#FF6B00", fontFamily: "var(--font-manrope)" }}>120+</div>
        <div className="text-xs" style={{ color: "#475569" }}>Incidents résolus</div>
      </motion.div>
    </div>
  );
}

/* ══ Main Page ══ */
export default function HomePage() {
  const { language } = useAppStore();

  /* Supabase data */
  const [portrait, setPortrait] = useState<string | null>(null);
  const [heroIntro, setHeroIntro] = useState("Opérant à l'intersection de la maintenance, de l'automatisation et de l'intelligence industrielle. Spécialiste des environnements de production modernes et des technologies Industrie 4.0.");
  const [visionTitle, setVisionTitle] = useState("Vision Professionnelle");
  const [visionText, setVisionText] = useState("Technicien électromécanique industriel avec une expertise terrain acquise dans des environnements de production exigeants. Spécialisé dans la maintenance préventive et corrective, l'automatisation des processus industriels et le diagnostic des systèmes complexes.");
  const [objectivesText, setObjectivesText] = useState("Mon objectif : contribuer à l'évolution vers l'Industrie 4.0 en combinant expertise technique traditionnelle et adoption des technologies intelligentes — IIoT, maintenance prédictive, réseaux industriels avancés.");
  const [stats, setStats] = useState(STATIC_STATS);
  const [incidents, setIncidents] = useState(STATIC_INCIDENTS);
  const [contactInfo, setContactInfo] = useState({ phone: "+212 6XX XXX XXX", email: "walid.elbachouri@email.com", linkedin: "linkedin.com/in/walid-el-bachouri", location: "Maroc" });

  useEffect(() => {
    const sb = createClient();

    // Load profile
    sb.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (!data) return;
      if (data.portrait_url) setPortrait(data.portrait_url);
      if (data.hero_intro_fr) setHeroIntro(language === "en" ? (data.hero_intro_en || data.hero_intro_fr) : data.hero_intro_fr);
      if (data.vision_title_fr) setVisionTitle(language === "en" ? (data.vision_title_en || data.vision_title_fr) : data.vision_title_fr);
      if (data.vision_fr) setVisionText(language === "en" ? (data.vision_en || data.vision_fr) : data.vision_fr);
      if (data.objectives_fr) setObjectivesText(language === "en" ? (data.objectives_en || data.objectives_fr) : data.objectives_fr);
      setContactInfo({ phone: data.phone || contactInfo.phone, email: data.email || contactInfo.email, linkedin: data.linkedin || contactInfo.linkedin, location: data.location || contactInfo.location });
    });

    // Load stats
    sb.from("stats").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setStats(data.map((s: { value: number; label_fr: string; label_en: string; suffix: string }) => ({
          value: s.value,
          label: language === "en" ? (s.label_en || s.label_fr) : s.label_fr,
          suffix: s.suffix,
        })));
      }
    });

    // Load incidents
    sb.from("incidents").select("id,title_fr,domain,criticality,status").order("created_at", { ascending: false }).limit(8).then(({ data }) => {
      if (data && data.length > 0) {
        setIncidents(data.map((i: { id: string; title_fr: string; domain: string; criticality: string; status: string }) => ({
          id: i.id, title_fr: i.title_fr, category: i.domain, criticality: i.criticality, status: i.status,
        })));
      }
    });
  }, [language]);

  const displayIncidents = incidents.length > 0 ? incidents : STATIC_INCIDENTS;

  return (
    <div style={{ background: "var(--color-bg-primary)" }}>
      {/* ══════════════════════════════════════════════ HERO ══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-40" />
        <ParticleField count={60} />
        <IndustrialScene />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,119,255,0.06) 0%, transparent 70%)" }} />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--color-bg-primary), transparent)" }} />

        <div className="container-portfolio relative z-10 pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── LEFT : Portrait ── */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <PortraitFrame src={portrait} />
            </motion.div>

            {/* ── RIGHT : Content ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
              className="order-1 lg:order-2"
            >
              {/* Status pill */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(0,119,255,0.08)", border: "1px solid rgba(0,119,255,0.25)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#22D3EE", boxShadow: "0 0 8px #22D3EE", animation: "glow-pulse 2s ease-in-out infinite" }} />
                <span className="label-tag" style={{ color: "#22D3EE" }}>DISPONIBLE — MAROC</span>
              </motion.div>

              {/* Name */}
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
                className="heading-hero mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
                Walid<br />El Bachouri
              </motion.h1>

              {/* Role typing */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}
                className="heading-md mb-6 min-h-[2.5rem]" style={{ fontFamily: "var(--font-manrope)" }}>
                <RoleTyping />
              </motion.div>

              {/* Intro */}
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }}
                className="text-base mb-8 leading-relaxed max-w-lg" style={{ color: "#64748B" }}>
                {heroIntro}
              </motion.p>

              {/* Expertise badges */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
                className="flex flex-wrap gap-2 mb-8">
                {[
                  { icon: Zap, label: "Systèmes Électriques" },
                  { icon: Settings, label: "Maintenance" },
                  { icon: Cpu, label: "Automatisation" },
                  { icon: Network, label: "Réseaux Industriels" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(0,119,255,0.08)", border: "1px solid rgba(0,119,255,0.18)" }}>
                    <Icon size={13} style={{ color: "#00C3FF" }} />
                    <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}
                className="flex flex-wrap gap-4">
                <a href="/cv.pdf" download
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white", boxShadow: "0 8px 30px rgba(0,119,255,0.35)" }}>
                  <Download size={16} /> Télécharger CV
                </a>
                <Link href="/troubleshooting"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                  style={{ background: "rgba(13,21,37,0.6)", border: "1px solid rgba(0,119,255,0.3)", color: "white", backdropFilter: "blur(10px)" }}>
                  Voir mes interventions <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "#334155" }}>
          <span className="label-tag text-xs">SCROLL</span>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(0,119,255,0.5), transparent)" }} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════ VISION ══ */}
      <section className="section-pad relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-20" />
        <div className="container-portfolio relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
              <div className="label-tag mb-4" style={{ color: "#0077FF" }}>◆ VISION & IDENTITÉ</div>
              <h2 className="heading-xl mb-8" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{visionTitle}</h2>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-5 mb-10" style={{ color: "#64748B", lineHeight: 1.85 }}>
              <p className="text-base">{visionText}</p>
              <p className="text-base" style={{ color: "#475569" }}>{objectivesText}</p>
            </motion.div>

            {/* Key domains */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {["Maintenance Industrielle", "Automatisation & API", "Réseaux Industriels", "Industrie 4.0", "Électromécanique", "Troubleshooting"].map((domain) => (
                <div key={domain} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(0,119,255,0.06)", border: "1px solid rgba(0,119,255,0.12)" }}>
                  <ChevronRight size={12} style={{ color: "#0077FF" }} />
                  <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{domain}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Link href="/expertise" className="inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 hover:gap-3" style={{ color: "#00C3FF" }}>
                Découvrir mon parcours terrain <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ CARDS ══ */}
      <section className="section-pad-sm relative">
        <div className="section-divider mb-16" />
        <div className="container-portfolio">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* CV Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              whileHover={{ y: -6, scale: 1.01 }} className="relative p-8 rounded-2xl overflow-hidden group"
              style={{ background: "linear-gradient(135deg, rgba(0,119,255,0.12) 0%, rgba(0,195,255,0.06) 100%)", border: "1px solid rgba(0,119,255,0.25)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,119,255,0.08), transparent)" }} />
              <Download size={32} className="mb-4" style={{ color: "#0077FF" }} />
              <h3 className="heading-md mb-2" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Curriculum Vitae</h3>
              <p className="text-sm mb-6" style={{ color: "#64748B" }}>Télécharger mon CV complet au format PDF — Mise à jour 2025</p>
              <a href="/cv.pdf" download className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white", boxShadow: "0 4px 20px rgba(0,119,255,0.3)" }}>
                <Download size={14} /> Télécharger CV
              </a>
            </motion.div>

            {/* Contact Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }} className="relative p-8 rounded-2xl overflow-hidden group"
              style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(255,140,51,0.04) 100%)", border: "1px solid rgba(255,107,0,0.2)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,107,0,0.06), transparent)" }} />
              <Mail size={32} className="mb-4" style={{ color: "#FF6B00" }} />
              <h3 className="heading-md mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Contact</h3>
              <div className="space-y-3 mb-6">
                {[
                  { icon: Phone, label: contactInfo.phone },
                  { icon: Mail, label: contactInfo.email },
                  { icon: Linkedin, label: contactInfo.linkedin },
                  { icon: MapPin, label: contactInfo.location },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon size={14} style={{ color: "#FF6B00", flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: "#64748B" }}>{label}</span>
                  </div>
                ))}
              </div>
              <a href="/business-card.pdf" download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ background: "rgba(255,107,0,0.12)", border: "1px solid rgba(255,107,0,0.3)", color: "#FF8C33" }}>
                <Download size={14} /> Carte de visite PDF
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ INCIDENT STREAM ══ */}
      <section className="section-pad-sm overflow-hidden">
        <div className="container-portfolio mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ LIVE FEED</div>
              <h2 className="heading-lg" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Dernières Interventions</h2>
            </div>
            <Link href="/troubleshooting" className="flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3" style={{ color: "#00C3FF" }}>
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden py-2">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-4 w-max">
            {[...displayIncidents, ...displayIncidents].map((incident, i) => (
              <Link href="/troubleshooting" key={`${incident.id}-${i}`}
                className="flex-shrink-0 w-72 p-5 rounded-xl card-hover group"
                style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.12)", backdropFilter: "blur(10px)" }}>
                <div className="flex items-start justify-between mb-3">
                  <IndustrialBadge variant="criticality" value={incident.criticality}>
                    {incident.criticality === "critical" ? "Critique" : incident.criticality === "major" ? "Majeur" : incident.criticality === "medium" ? "Modéré" : "Mineur"}
                  </IndustrialBadge>
                  <IndustrialBadge variant="status" value={incident.status}>✓ Résolu</IndustrialBadge>
                </div>
                <h4 className="text-sm font-semibold mb-2 group-hover:text-white transition-colors line-clamp-2" style={{ color: "#CBD5E1" }}>
                  {incident.title_fr}
                </h4>
                <div className="label-tag" style={{ color: "#475569" }}>{incident.category}</div>
              </Link>
            ))}
          </motion.div>
          <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to right, var(--color-bg-primary), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to left, var(--color-bg-primary), transparent)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════ STATS ══ */}
      <section className="section-pad relative">
        <div className="section-divider mb-16" />
        <div className="container-portfolio">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <div className="label-tag mb-3" style={{ color: "#0077FF" }}>◆ IMPACT</div>
            <h2 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>En chiffres</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} suffix={stat.suffix} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
