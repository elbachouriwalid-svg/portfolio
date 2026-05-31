"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, User, Briefcase, Wrench,
  Award, GraduationCap, Library, LogOut, ChevronRight,
  Settings, Zap, AlertTriangle, BookOpen, Menu, X,
  Home, TrendingUp, Factory, Smile, BarChart3
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Contenu Accueil", icon: Home },
  { href: "/admin/profile", label: "Profil & Contact", icon: User },
  { href: "/admin/cv", label: "CV & Carte", icon: FileText },
  { href: "/admin/experiences", label: "Expériences", icon: Briefcase },
  { href: "/admin/competencies", label: "Compétences", icon: TrendingUp },
  { href: "/admin/processes", label: "Processus Industriels", icon: Factory },
  { href: "/admin/troubleshooting", label: "Troubleshooting", icon: Wrench },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/diplomas", label: "Diplômes", icon: GraduationCap },
  { href: "/admin/library", label: "Bibliothèque", icon: Library },
  { href: "/admin/loisirs", label: "Loisirs & Skills", icon: Smile },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && pathname !== "/admin";

  return (
    <div className="min-h-screen flex" style={{ background: "#050D1A" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:flex`}
        style={{
          background: "rgba(10,15,28,0.98)",
          borderRight: "1px solid rgba(0,119,255,0.1)",
          backdropFilter: "blur(30px)",
        }}
      >
        {/* Brand */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(0,119,255,0.1)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)" }}
            >
              <Zap size={18} style={{ color: "white" }} />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
                Admin Panel
              </div>
              <div className="label-tag" style={{ color: "#00C3FF", fontSize: "0.6rem" }}>
                Walid El Bachouri
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  background: active ? "rgba(0,119,255,0.15)" : "transparent",
                  border: active ? "1px solid rgba(0,119,255,0.25)" : "1px solid transparent",
                  color: active ? "white" : "#64748B",
                }}
              >
                <Icon size={16} style={{ color: active ? "#00C3FF" : "#475569", flexShrink: 0 }} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={12} style={{ color: "#00C3FF" }} />}
              </Link>
            );
          })}
        </nav>

        {/* User & logout */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(0,119,255,0.1)" }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
            >
              W
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "white" }}>Walid El Bachouri</div>
              <div className="text-xs truncate" style={{ color: "#334155" }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:bg-red-500/10"
            style={{ color: "#64748B" }}
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 mt-1"
            style={{ color: "#334155" }}
          >
            <ChevronRight size={14} />
            Voir le site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-6 h-16"
          style={{
            background: "rgba(5,13,26,0.9)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,119,255,0.1)",
          }}
        >
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ border: "1px solid rgba(0,119,255,0.2)", color: "white" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="flex items-center gap-2" style={{ color: "#475569" }}>
            <Settings size={14} />
            <span className="text-sm">Administration</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
