"use client";
import Link from "next/link";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: "rgba(0,119,255,0.1)",
        background: "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)",
      }}
    >
      {/* Top divider glow */}
      <div className="section-divider" />

      <div className="container-portfolio py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div
              className="font-bold text-lg mb-1"
              style={{ fontFamily: "var(--font-manrope)", color: "white" }}
            >
              Walid El Bachouri
            </div>
            <div className="label-tag" style={{ color: "#00C3FF" }}>
              Technicien Électromécanique Industriel
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/walid-el-bachouri"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                border: "1px solid rgba(0,119,255,0.3)",
                background: "rgba(0,119,255,0.08)",
                color: "#94A3B8",
              }}
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:walid.elbachouri@email.com"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                border: "1px solid rgba(0,119,255,0.3)",
                background: "rgba(0,119,255,0.08)",
                color: "#94A3B8",
              }}
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href="tel:+212600000000"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                border: "1px solid rgba(0,119,255,0.3)",
                background: "rgba(0,119,255,0.08)",
                color: "#94A3B8",
              }}
              aria-label="Phone"
            >
              <Phone size={16} />
            </a>
          </div>

          {/* Location + copyright */}
          <div className="text-center md:text-right">
            <div className="flex items-center gap-1.5 justify-center md:justify-end mb-2" style={{ color: "#475569" }}>
              <MapPin size={12} />
              <span className="text-xs">Maroc</span>
            </div>
            <div className="text-xs" style={{ color: "#334155" }}>
              © 2025 Walid El Bachouri. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
