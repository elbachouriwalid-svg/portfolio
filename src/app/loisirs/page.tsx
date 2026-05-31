"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ParticleField } from "@/components/ui/ParticleField";
import { Users, MessageSquare, Shuffle, Search, FolderClosed, BrainCircuit, BookOpen, Dumbbell, Waves, Lightbulb, Shield, Target, Cpu, Globe, Zap, Star, Activity, Bike, Mountain } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Icon map ── */
const ICON_MAP: Record<string, React.ElementType> = {
  Users, MessageSquare, Shuffle, Search, FolderClosed, BrainCircuit, BookOpen,
  Dumbbell, Waves, Lightbulb, Shield, Target, Cpu, Globe, Zap, Star, Activity, Bike, Mountain,
};
function Icon({ name, size = 22, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  const Comp = (ICON_MAP[name] || Zap) as React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  return <Comp size={size} style={style} />;
}

/* ── Static fallbacks ── */
const STATIC_SS = [
  { id: "1", label_fr: "Esprit d'équipe", description_fr: "Collaboration efficace dans des équipes pluridisciplinaires.", icon: "Users" },
  { id: "2", label_fr: "Communication", description_fr: "Clarté dans le reporting technique et la transmission de savoir.", icon: "MessageSquare" },
  { id: "3", label_fr: "Adaptabilité", description_fr: "Réactivité face aux imprévus et aux environnements changeants.", icon: "Shuffle" },
  { id: "4", label_fr: "Curiosité Technique", description_fr: "Veille technologique permanente et apprentissage autonome.", icon: "Search" },
  { id: "5", label_fr: "Organisation", description_fr: "Gestion rigoureuse des plans de maintenance et interventions.", icon: "FolderClosed" },
  { id: "6", label_fr: "Problem Solving", description_fr: "Diagnostic méthodique et résolution créative des pannes complexes.", icon: "BrainCircuit" },
];
const STATIC_CLUBS = [
  { id: "1", name_fr: "Club Intelligence & Technologies", role_fr: "Membre actif", description_fr: "Exploration des technologies émergentes : IA industrielle, robotique, IIoT, automatisation avancée. Partage de connaissances et veille technologique collective.", color: "#0077FF", icon: "BrainCircuit" },
  { id: "2", name_fr: "Activités Éducatives", role_fr: "Participant", description_fr: "Implication dans des activités de transmission des savoirs techniques. Support aux étudiants et partage d'expérience terrain.", color: "#00C3FF", icon: "BookOpen" },
];
const STATIC_SPORTS = [
  { id: "1", name_fr: "Athlétisme", description_fr: "Course de fond et sprint. Discipline et dépassement de soi.", color: "#FF6B00", icon: "Dumbbell" },
  { id: "2", name_fr: "Natation", description_fr: "Endurance et maîtrise technique. Sport complet pour l'équilibre physique.", color: "#00C3FF", icon: "Waves" },
];

export default function LoisIrsPage() {
  const [softSkills, setSoftSkills] = useState(STATIC_SS);
  const [clubs, setClubs] = useState(STATIC_CLUBS);
  const [sports, setSports] = useState(STATIC_SPORTS);

  useEffect(() => {
    const sb = createClient();
    sb.from("soft_skills").select("*").order("sort_order").then(({ data }) => { if (data && data.length > 0) setSoftSkills(data); });
    sb.from("clubs").select("*").order("sort_order").then(({ data }) => { if (data && data.length > 0) setClubs(data); });
    sb.from("sports").select("*").order("sort_order").then(({ data }) => { if (data && data.length > 0) setSports(data); });
  }, []);

  return (
    <div style={{ background: "var(--color-bg-primary)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-20" />
        <ParticleField count={20} />
        <div className="container-portfolio relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="label-tag mb-4" style={{ color: "#0077FF" }}>◆ DIMENSION HUMAINE</div>
            <h1 className="heading-hero mb-4" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Loisirs & Soft Skills</h1>
            <p className="text-lg max-w-2xl" style={{ color: "#64748B" }}>L&apos;excellence technique naît aussi d&apos;un équilibre humain solide.</p>
          </motion.div>
        </div>
      </section>

      {/* Soft Skills */}
      <section className="section-pad">
        <div className="container-portfolio">
          <div className="label-tag mb-3" style={{ color: "#0077FF" }}>◆ COMPÉTENCES RELATIONNELLES</div>
          <h2 className="heading-xl mb-10" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Soft Skills</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {softSkills.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }} whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.7)", border: "1px solid rgba(0,119,255,0.12)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0,119,255,0.1)", border: "1px solid rgba(0,119,255,0.2)" }}>
                  <Icon name={s.icon} size={22} style={{ color: "#00C3FF" }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{s.label_fr}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{s.description_fr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs */}
      <section className="section-pad" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="container-portfolio">
          <div className="label-tag mb-3" style={{ color: "#00C3FF" }}>◆ ENGAGEMENT</div>
          <h2 className="heading-xl mb-10" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Clubs & Associations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {clubs.map((club, i) => (
              <motion.div key={club.id} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
                className="p-7 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${club.color}0D 0%, transparent 100%)`, border: `1px solid ${club.color}22` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${club.color}15`, border: `1px solid ${club.color}30` }}>
                    <Icon name={club.icon} size={22} style={{ color: club.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{club.name_fr}</h3>
                    <div className="label-tag" style={{ color: club.color }}>{club.role_fr}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{club.description_fr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="section-pad">
        <div className="container-portfolio">
          <div className="label-tag mb-3" style={{ color: "#FF6B00" }}>◆ SPORTS</div>
          <h2 className="heading-xl mb-10" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Activités Sportives</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            {sports.map((sport, i) => (
              <motion.div key={sport.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} whileHover={{ y: -4 }}
                className="p-6 rounded-2xl flex items-start gap-4"
                style={{ background: `${sport.color}0F`, border: `1px solid ${sport.color}20` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${sport.color}12`, border: `1px solid ${sport.color}25` }}>
                  <Icon name={sport.icon} size={22} style={{ color: sport.color }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{sport.name_fr}</h3>
                  <p className="text-sm" style={{ color: "#64748B" }}>{sport.description_fr}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
