"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/expertise", key: "expertise" },
  { href: "/troubleshooting", key: "troubleshooting" },
  { href: "/academic", key: "academic" },
  { href: "/library", key: "library" },
  { href: "/loisirs", key: "loisirs" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const t = getTranslation(language);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(5, 13, 26, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0, 119, 255, 0.15)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0, 0, 0, 0.3)"
            : "none",
        }}
      >
        <div className="container-portfolio flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0077FF, #00C3FF)",
                  boxShadow: "0 0 20px rgba(0,119,255,0.4)",
                }}
              >
                <span className="text-white font-bold text-sm">W</span>
              </div>
            </div>
            <div>
              <div
                className="font-bold text-sm leading-none"
                style={{ fontFamily: "var(--font-manrope)", color: "white" }}
              >
                Walid El Bachouri
              </div>
              <div className="label-tag" style={{ color: "#00C3FF", fontSize: "0.6rem" }}>
                Industrial Technician
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, key }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group"
                  style={{
                    color: isActive ? "white" : "rgba(148,163,184,0.8)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "rgba(0,119,255,0.15)",
                        border: "1px solid rgba(0,119,255,0.3)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                    {t.nav[key as keyof typeof t.nav]}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div
              className="flex items-center rounded-full p-0.5"
              style={{
                background: "rgba(0,119,255,0.1)",
                border: "1px solid rgba(0,119,255,0.2)",
              }}
            >
              {(["fr", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                  style={{
                    background: language === lang
                      ? "linear-gradient(135deg, #0077FF, #00C3FF)"
                      : "transparent",
                    color: language === lang ? "white" : "rgba(148,163,184,0.7)",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300"
              style={{ border: "1px solid rgba(0,119,255,0.2)", color: "white" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-72 lg:hidden"
            style={{
              background: "rgba(5,13,26,0.97)",
              backdropFilter: "blur(30px)",
              borderLeft: "1px solid rgba(0,119,255,0.2)",
            }}
          >
            <div className="flex flex-col pt-20 pb-8 px-6 h-full">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map(({ href, key }) => {
                  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                      style={{
                        background: isActive ? "rgba(0,119,255,0.15)" : "transparent",
                        border: isActive ? "1px solid rgba(0,119,255,0.3)" : "1px solid transparent",
                        color: isActive ? "white" : "rgba(148,163,184,0.8)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isActive ? "#00C3FF" : "rgba(148,163,184,0.3)" }}
                      />
                      {t.nav[key as keyof typeof t.nav]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
