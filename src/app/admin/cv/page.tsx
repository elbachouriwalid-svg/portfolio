"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Upload, FileText, Trash2, CheckCircle, Download, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface FileEntry {
  name: string;
  url: string;
  updatedAt?: string;
}

export default function AdminCVPage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [currentCv, setCurrentCv] = useState<FileEntry | null>(null);
  const [currentCard, setCurrentCard] = useState<FileEntry | null>(null);
  const [uploading, setUploading] = useState<"cv" | "card" | null>(null);
  const [status, setStatus] = useState<Record<string, "success" | "error" | "idle">>({ cv: "idle", card: "idle" });

  useEffect(() => { fetchCurrentFiles(); }, []);

  const fetchCurrentFiles = async () => {
    const supabase = createClient();
    const { data: cvData } = await supabase.storage.from("cv").list("", { limit: 10 });
    if (cvData) {
      const cv = cvData.find((f) => f.name === "cv.pdf");
      const card = cvData.find((f) => f.name === "business-card.pdf");
      if (cv) {
        const { data: { publicUrl } } = supabase.storage.from("cv").getPublicUrl("cv.pdf");
        setCurrentCv({ name: "cv.pdf", url: publicUrl, updatedAt: cv.updated_at ?? undefined });
      }
      if (card) {
        const { data: { publicUrl } } = supabase.storage.from("cv").getPublicUrl("business-card.pdf");
        setCurrentCard({ name: "business-card.pdf", url: publicUrl, updatedAt: card.updated_at ?? undefined });
      }
    }
  };

  const handleUpload = async (type: "cv" | "card") => {
    const file = type === "cv" ? cvFile : cardFile;
    if (!file) return;
    setUploading(type);
    const supabase = createClient();
    const fileName = type === "cv" ? "cv.pdf" : "business-card.pdf";
    const { error } = await supabase.storage.from("cv").upload(fileName, file, { upsert: true, contentType: "application/pdf" });
    if (!error) {
      setStatus((s) => ({ ...s, [type]: "success" }));
      await fetchCurrentFiles();
      if (type === "cv") setCvFile(null);
      else setCardFile(null);
      setTimeout(() => setStatus((s) => ({ ...s, [type]: "idle" })), 3000);
    } else {
      setStatus((s) => ({ ...s, [type]: "error" }));
      setTimeout(() => setStatus((s) => ({ ...s, [type]: "idle" })), 3000);
    }
    setUploading(null);
  };

  const FileUploadCard = ({
    type, label, subtitle, file, current, onFileSelect,
  }: {
    type: "cv" | "card";
    label: string;
    subtitle: string;
    file: File | null;
    current: FileEntry | null;
    onFileSelect: (f: File) => void;
  }) => {
    const inputId = `${type}-upload`;
    const isUploading = uploading === type;
    const st = status[type];

    return (
      <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
        <div className="flex items-center gap-3 mb-5">
          <FileText size={18} style={{ color: "#0077FF" }} />
          <div>
            <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>{label}</h2>
            <p className="text-xs" style={{ color: "#475569" }}>{subtitle}</p>
          </div>
        </div>

        {/* Current file */}
        {current && (
          <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
            style={{ background: "rgba(0,119,255,0.06)", border: "1px solid rgba(0,119,255,0.15)" }}>
            <CheckCircle size={15} style={{ color: "#22C55E", flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium" style={{ color: "#94A3B8" }}>Fichier actuel</div>
              <div className="text-xs truncate" style={{ color: "#475569" }}>{current.name}</div>
            </div>
            <a href={current.url} target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(0,119,255,0.1)", color: "#0077FF" }}>
              <Download size={12} />
            </a>
          </div>
        )}

        {/* New file selected */}
        {file ? (
          <div className="flex items-center gap-4 p-4 rounded-xl mb-4"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <CheckCircle size={18} style={{ color: "#22C55E" }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "white" }}>{file.name}</div>
              <div className="text-xs" style={{ color: "#475569" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button onClick={() => { if (type === "cv") setCvFile(null); else setCardFile(null); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-500 mb-4"
            style={{ borderColor: "rgba(0,119,255,0.3)" }}
            onClick={() => document.getElementById(inputId)?.click()}
          >
            <Upload size={28} className="mx-auto mb-3" style={{ color: "#334155" }} />
            <p className="text-sm mb-1" style={{ color: "#64748B" }}>Cliquer pour sélectionner le PDF</p>
            <p className="text-xs" style={{ color: "#334155" }}>Format PDF uniquement — Max 10 MB</p>
          </div>
        )}

        <input id={inputId} type="file" accept=".pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />

        <div className="flex gap-2">
          {file && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => handleUpload(type)}
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
              style={{
                background: st === "success" ? "rgba(34,197,94,0.2)" : st === "error" ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg, #0077FF, #00C3FF)",
                border: st === "success" ? "1px solid rgba(34,197,94,0.4)" : st === "error" ? "1px solid rgba(239,68,68,0.4)" : "none",
                color: st === "success" ? "#22C55E" : st === "error" ? "#EF4444" : "white",
              }}
            >
              {st === "success" ? <CheckCircle size={14} /> : st === "error" ? <AlertCircle size={14} /> : <Upload size={14} />}
              {isUploading ? "Envoi en cours..." : st === "success" ? "Envoyé !" : st === "error" ? "Erreur" : "Envoyer sur le serveur"}
            </motion.button>
          )}
          <button onClick={() => document.getElementById(inputId)?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "rgba(0,119,255,0.08)", border: "1px solid rgba(0,119,255,0.2)", color: "#00C3FF" }}>
            <Upload size={14} />
            {file ? "Changer" : "Sélectionner"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="label-tag mb-2" style={{ color: "#0077FF" }}>◆ GESTION</div>
          <h1 className="heading-xl" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>CV & Carte de Visite</h1>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>
            Les fichiers uploadés remplacent automatiquement les PDF téléchargeables sur le site.
          </p>
        </div>

        <div className="space-y-6">
          <FileUploadCard
            type="cv" label="Curriculum Vitae" subtitle="PDF téléchargeable sur la page d'accueil"
            file={cvFile} current={currentCv}
            onFileSelect={setCvFile}
          />
          <FileUploadCard
            type="card" label="Carte de Visite" subtitle="PDF téléchargeable depuis la carte Contact"
            file={cardFile} current={currentCard}
            onFileSelect={setCardFile}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
