"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench, Briefcase, Award, GraduationCap, Library,
  FileText, User, BarChart3, ArrowRight, TrendingUp
} from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/admin/troubleshooting", label: "Ajouter une intervention", icon: Wrench, color: "#FF6B00", desc: "Documenter un nouvel incident" },
  { href: "/admin/experiences", label: "Gérer les expériences", icon: Briefcase, color: "#0077FF", desc: "Modifier le parcours professionnel" },
  { href: "/admin/certifications", label: "Ajouter une certification", icon: Award, color: "#00C3FF", desc: "Nouvelle certification obtenue" },
  { href: "/admin/library", label: "Uploader un document", icon: Library, color: "#22C55E", desc: "Ajouter à la bibliothèque" },
  { href: "/admin/cv", label: "Mettre à jour le CV", icon: FileText, color: "#A78BFA", desc: "Remplacer le PDF du CV" },
  { href: "/admin/profile", label: "Modifier le profil", icon: User, color: "#F59E0B", desc: "Vision, objectifs, contact" },
];

const OVERVIEW = [
  { label: "Interventions", value: "6", trend: "+2 ce mois", icon: Wrench, color: "#FF6B00" },
  { label: "Certifications", value: "3", trend: "À jour", icon: Award, color: "#00C3FF" },
  { label: "Documents", value: "6", trend: "+1 ce mois", icon: Library, color: "#22C55E" },
  { label: "Expériences", value: "2", trend: "Actif", icon: Briefcase, color: "#0077FF" },
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ TABLEAU DE BORD</div>
          <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
            Bienvenue, Walid
          </h1>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>
            Gérez votre portfolio industriel depuis ce dashboard.
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {OVERVIEW.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(13,21,37,0.8)",
                border: "1px solid rgba(0,119,255,0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <item.icon size={20} style={{ color: item.color }} />
                <TrendingUp size={12} style={{ color: "#334155" }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
                {item.value}
              </div>
              <div className="text-xs font-medium mb-0.5" style={{ color: "#94A3B8" }}>{item.label}</div>
              <div className="text-xs" style={{ color: "#334155" }}>{item.trend}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="heading-md mb-5" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
            Actions rapides
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center gap-4 p-5 rounded-xl group transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "rgba(13,21,37,0.7)",
                    border: "1px solid rgba(0,119,255,0.1)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${action.color}15`, border: `1px solid ${action.color}25` }}
                  >
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold mb-0.5" style={{ color: "white" }}>{action.label}</div>
                    <div className="text-xs truncate" style={{ color: "#475569" }}>{action.desc}</div>
                  </div>
                  <ArrowRight size={14} style={{ color: "#334155" }} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: "rgba(0,119,255,0.05)", border: "1px solid rgba(0,119,255,0.15)" }}
        >
          <div className="flex items-start gap-3">
            <BarChart3 size={18} style={{ color: "#0077FF", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: "white" }}>Connexion Supabase requise</div>
              <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
                Pour activer la gestion complète des données, configurez vos clés Supabase dans le fichier{" "}
                <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(0,119,255,0.1)", color: "#00C3FF" }}>
                  .env.local
                </code>
                . Consultez le fichier{" "}
                <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(0,119,255,0.1)", color: "#00C3FF" }}>
                  .env.example
                </code>
                {" "}pour les variables nécessaires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
