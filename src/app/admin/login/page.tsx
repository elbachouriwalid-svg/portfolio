"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--color-bg-primary)" }}
    >
      {/* BG */}
      <div className="absolute inset-0 industrial-grid opacity-30" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,119,255,0.06) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", boxShadow: "0 0 30px rgba(0,119,255,0.4)" }}
          >
            <Zap size={26} style={{ color: "white" }} />
          </div>
          <h1 className="heading-lg mb-1" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>
            Admin Dashboard
          </h1>
          <p className="text-sm" style={{ color: "#475569" }}>Accès sécurisé — Walid El Bachouri</p>
        </div>

        {/* Form */}
        <div
          className="p-8 rounded-2xl"
          style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.2)", backdropFilter: "blur(20px)" }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-tag block mb-2" style={{ color: "#475569" }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
                style={{
                  background: "rgba(5,13,26,0.8)",
                  border: "1px solid rgba(0,119,255,0.2)",
                  color: "white",
                }}
                placeholder="admin@email.com"
              />
            </div>
            <div>
              <label className="label-tag block mb-2" style={{ color: "#475569" }}>MOT DE PASSE</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl outline-none transition-all duration-300 text-sm"
                  style={{
                    background: "rgba(5,13,26,0.8)",
                    border: "1px solid rgba(0,119,255,0.2)",
                    color: "white",
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#475569" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
              >
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #0077FF, #00C3FF)", color: "white" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
