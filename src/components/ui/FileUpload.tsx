"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle, FileText, Image as ImageIcon, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export interface FileUploadProps {
  bucket: string;
  storagePath?: string;           // Fixed path (e.g. "portrait/portrait.jpg")
  accept?: string;                // e.g. "image/*" or ".pdf" or "image/*,.pdf"
  maxSizeMB?: number;
  onUploadComplete?: (url: string, fileName: string) => void;
  currentUrl?: string | null;
  label?: string;
  hint?: string;
  accentColor?: string;
  previewType?: "image" | "pdf" | "none" | "auto";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  bucket,
  storagePath,
  accept = "*",
  maxSizeMB = 10,
  onUploadComplete,
  currentUrl,
  label = "Uploader un fichier",
  hint,
  accentColor = "#0077FF",
  previewType = "auto",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedSize, setUploadedSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = (url: string | null) => url ? /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url) : false;
  const isPdf = (url: string | null) => url ? /\.pdf(\?|$)/i.test(url) : false;

  const resolvePreviewType = (url: string | null) => {
    if (previewType !== "auto") return previewType;
    if (isImage(url)) return "image";
    if (isPdf(url)) return "pdf";
    return "none";
  };

  const handleFile = useCallback(async (file: File) => {
    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setStatus("error");
      setErrorMsg(`Fichier trop volumineux. Taille max : ${maxSizeMB} MB (actuel : ${formatBytes(file.size)})`);
      return;
    }

    setUploading(true);
    setProgress(5);
    setStatus("idle");
    setErrorMsg("");

    // Simulated progress animation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 88) { clearInterval(interval); return p; }
        return p + Math.random() * 12;
      });
    }, 180);

    try {
      const supabase = createClient();

      // Determine upload path
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const filePath = storagePath || `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type || "application/octet-stream",
        });

      clearInterval(interval);

      if (uploadError) {
        throw new Error(uploadError.message || "Erreur Supabase Storage");
      }

      setProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Impossible d'obtenir l'URL publique");

      setUploadedUrl(publicUrl);
      setUploadedFileName(file.name);
      setUploadedSize(formatBytes(file.size));
      setStatus("success");
      onUploadComplete?.(publicUrl, file.name);

    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Erreur inconnue lors de l'upload";
      setErrorMsg(msg);
      console.error("[FileUpload]", err);
    } finally {
      setUploading(false);
    }
  }, [bucket, storagePath, maxSizeMB, onUploadComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset so same file can be re-uploaded
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    setUploadedFileName("");
    setStatus("idle");
    setProgress(0);
  };

  const pt = resolvePreviewType(uploadedUrl);
  const accent = accentColor;

  return (
    <div className="space-y-3">
      {/* Current / Preview */}
      <AnimatePresence mode="wait">
        {uploadedUrl && status !== "error" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative rounded-xl overflow-hidden"
            style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}
          >
            {/* Image preview */}
            {pt === "image" && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedUrl}
                  alt="Aperçu"
                  className="w-full max-h-56 object-contain rounded-xl"
                  style={{ background: "rgba(5,13,26,0.6)" }}
                  onError={() => setStatus("error")}
                />
                <div className="absolute inset-0 flex items-end justify-between p-3 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(5,13,26,0.7) 0%, transparent 60%)" }}>
                  <div className="flex items-center gap-2">
                    <ImageIcon size={13} style={{ color: accent }} />
                    <span className="text-xs font-medium" style={{ color: "white" }}>{uploadedFileName || "Image"}</span>
                    {uploadedSize && <span className="text-xs" style={{ color: "#64748B" }}>{uploadedSize}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* PDF / file preview */}
            {(pt === "pdf" || pt === "none") && (
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                  <FileText size={18} style={{ color: accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: "white" }}>
                    {uploadedFileName || "Fichier uploadé"}
                  </div>
                  {uploadedSize && <div className="text-xs" style={{ color: "#64748B" }}>{uploadedSize}</div>}
                </div>
                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-opacity hover:opacity-70"
                  style={{ background: `${accent}15`, color: accent }}>
                  <Eye size={14} />
                </a>
              </div>
            )}

            {/* Remove button */}
            {!uploading && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}
                title="Supprimer"
              >
                <X size={13} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      {(!uploadedUrl || status === "error") && !uploading && (
        <div
          className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300"
          style={{
            borderColor: isDragging ? accent : status === "error" ? "#EF4444" : `${accent}40`,
            background: isDragging ? `${accent}08` : "transparent",
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
            <Upload size={22} style={{ color: isDragging ? accent : "#475569" }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: isDragging ? accent : "#94A3B8" }}>
            {isDragging ? "Relâche pour uploader" : label}
          </p>
          <p className="text-xs" style={{ color: "#334155" }}>
            {hint || `Glisser-déposer ou cliquer · Max ${maxSizeMB} MB`}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 rounded-xl" style={{ background: "rgba(13,21,37,0.8)", border: `1px solid ${accent}25` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>Upload en cours...</span>
              <span className="text-xs font-bold" style={{ color: accent }}>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}99)` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "#334155" }}>
              Ne fermez pas cette fenêtre pendant l&apos;upload...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status messages */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <CheckCircle size={16} style={{ color: "#22C55E", flexShrink: 0 }} />
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: "#22C55E" }}>Upload réussi !</p>
              <p className="text-xs" style={{ color: "#475569" }}>Le fichier est maintenant accessible publiquement.</p>
            </div>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} style={{ color: "#EF4444", flexShrink: 0, marginTop: "1px" }} />
              <div className="flex-1">
                <p className="text-xs font-semibold mb-0.5" style={{ color: "#EF4444" }}>Erreur d&apos;upload</p>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{errorMsg}</p>
              </div>
            </div>
            <button onClick={() => inputRef.current?.click()}
              className="mt-3 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}>
              Réessayer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden input */}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleInputChange} />

      {/* Upload button (when file exists, to replace) */}
      {uploadedUrl && status !== "error" && !uploading && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent }}>
          <Upload size={12} /> Remplacer le fichier
        </button>
      )}
    </div>
  );
}
