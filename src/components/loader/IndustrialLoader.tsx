"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

const BOOT_SEQUENCE = [
  { id: "power", label: "POWER SYSTEM", delay: 400 },
  { id: "automation", label: "AUTOMATION NETWORK", delay: 900 },
  { id: "maintenance", label: "MAINTENANCE CENTER", delay: 1400 },
  { id: "database", label: "TECHNICAL DATABASE", delay: 1900 },
  { id: "identity", label: "INDUSTRIAL IDENTITY", delay: 2400 },
];

export function IndustrialLoader() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const setLoaderDone = useAppStore((s) => s.setLoaderDone);

  useEffect(() => {
    if (sessionStorage.getItem("loader_done")) {
      setVisible(false);
      setLoaderDone(true);
      return;
    }

    BOOT_SEQUENCE.forEach((item, i) => {
      setTimeout(() => setPhase(i + 1), item.delay);
    });

    setTimeout(() => setAccessGranted(true), 2900);
    setTimeout(() => {
      setVisible(false);
      setLoaderDone(true);
      sessionStorage.setItem("loader_done", "1");
    }, 4200);
  }, [setLoaderDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#050D1A" }}
        >
          {/* Animated background grid */}
          <div
            className="absolute inset-0 industrial-grid opacity-30"
            style={{ backgroundSize: "40px 40px" }}
          />

          {/* Glow orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,119,255,0.12) 0%, transparent 70%)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,195,255,0.08) 0%, transparent 70%)",
              animation: "glow-pulse 4s ease-in-out infinite 1s",
            }}
          />

          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,195,255,0.4), transparent)",
              animation: "scan 6s linear infinite",
            }}
          />

          {/* Main content */}
          <div className="relative z-10 text-center px-8 max-w-lg w-full">
            {/* Logo / Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div
                className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full"
                style={{ border: "1px solid rgba(0,119,255,0.3)", background: "rgba(0,119,255,0.05)" }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#0077FF", animation: "glow-pulse 1.5s ease-in-out infinite" }}
                />
                <span className="label-tag" style={{ color: "#00C3FF" }}>
                  INDUSTRIAL IDENTITY PLATFORM
                </span>
              </div>
              <h1
                className="heading-lg"
                style={{ fontFamily: "var(--font-manrope, Manrope)", color: "white" }}
              >
                WALID EL BACHOURI
              </h1>
            </motion.div>

            {/* Boot sequence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-left"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(0,119,255,0.2)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p
                className="loader-text mb-4"
                style={{ color: "#00C3FF", opacity: 0.7, marginBottom: "1rem" }}
              >
                INITIALIZING INDUSTRIAL SYSTEMS...
              </p>
              {BOOT_SEQUENCE.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={phase > i ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3 }}
                  className="loader-text flex items-center justify-between mb-2"
                  style={{ color: phase > i ? "#FFFFFF" : "transparent" }}
                >
                  <span>{item.label}</span>
                  <span
                    style={{
                      color: "#22D3EE",
                      fontWeight: 600,
                    }}
                  >
                    {phase > i ? "OK ✓" : "..."}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Progress bar */}
            <div
              style={{
                height: "2px",
                background: "rgba(0,119,255,0.15)",
                borderRadius: "1px",
                overflow: "hidden",
                marginBottom: "1.5rem",
              }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${(phase / BOOT_SEQUENCE.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #0077FF, #00C3FF)",
                  boxShadow: "0 0 10px rgba(0,195,255,0.6)",
                }}
              />
            </div>

            {/* Access granted */}
            <AnimatePresence>
              {accessGranted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="loader-text text-center"
                  style={{ color: "#22D3EE", letterSpacing: "0.2em", fontSize: "1rem", fontWeight: 700 }}
                >
                  ◆ ACCESS GRANTED ◆
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
