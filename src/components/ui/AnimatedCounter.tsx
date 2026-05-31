"use client";
import { useEffect, useRef } from "react";
import CountUp from "react-countup";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

export function AnimatedCounter({ value, label, suffix = "", prefix = "", delay = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="text-center p-6 rounded-2xl card-hover"
      style={{
        background: "rgba(13,21,37,0.6)",
        border: "1px solid rgba(0,119,255,0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="text-4xl font-bold mb-2"
        style={{
          fontFamily: "var(--font-manrope)",
          background: "linear-gradient(135deg, #0077FF, #00C3FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {prefix}
        {inView ? <CountUp end={value} duration={2} delay={delay} /> : "0"}
        {suffix}
      </div>
      <div className="text-sm" style={{ color: "#64748B", fontWeight: 500 }}>
        {label}
      </div>
    </motion.div>
  );
}
