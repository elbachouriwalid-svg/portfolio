"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FileText, Download, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

export default function AdminCVPage() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [cvSaved, setCvSaved] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);

  useEffect(() => {
    const sb = createClient();
    // Check if CV exists
    sb.storage.from("cv").list("", { search: "cv.pdf" }).then(({ data: files }) => {
      if (files && files.length > 0) {
        const { data } = sb.storage.from("cv").getPublicUrl("cv.pdf");
        setCvUrl(data.publicUrl);
      }
    });
    // Check if business card exists
    sb.storage.from("cv").list("", { search: "business-card.pdf" }).then(({ data: files }) => {
      if (files && files.length > 0) {
        const { data } = sb.storage.from("cv").getPublicUrl("business-card.pdf");
        setCardUrl(data.publicUrl);
      }
    });
  }, []);

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
          {/* CV */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(0,119,255,0.15)" }}>
            <div className="flex items-center gap-3 mb-5">
              <FileText size={18} style={{ color: "#0077FF" }} />
              <div>
                <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Curriculum Vitae</h2>
                <p className="text-xs" style={{ color: "#475569" }}>PDF téléchargeable sur la page d&apos;accueil · Max 10 MB</p>
              </div>
              {cvUrl && <CheckCircle size={16} style={{ color: "#22C55E", marginLeft: "auto" }} />}
            </div>

            <FileUpload
              bucket="cv"
              storagePath="cv.pdf"
              accept=".pdf,application/pdf"
              maxSizeMB={10}
              currentUrl={cvUrl}
              label="Cliquer ou glisser le CV (PDF)"
              hint="Format PDF uniquement · Max 10 MB"
              accentColor="#0077FF"
              onUploadComplete={(url) => {
                setCvUrl(url);
                setCvSaved(true);
                setTimeout(() => setCvSaved(false), 4000);
              }}
            />

            {cvUrl && (
              <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,119,255,0.08)" }}>
                <a href={cvUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                  style={{ background: "rgba(0,119,255,0.1)", border: "1px solid rgba(0,119,255,0.2)", color: "#00C3FF" }}>
                  <Download size={12} /> Voir le CV actuel
                </a>
                {cvSaved && <span className="text-xs" style={{ color: "#22C55E" }}>✓ Mis à jour sur le site</span>}
              </div>
            )}
          </div>

          {/* Business Card */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(13,21,37,0.8)", border: "1px solid rgba(255,107,0,0.15)" }}>
            <div className="flex items-center gap-3 mb-5">
              <FileText size={18} style={{ color: "#FF6B00" }} />
              <div>
                <h2 className="font-bold" style={{ color: "white", fontFamily: "var(--font-manrope)" }}>Carte de Visite</h2>
                <p className="text-xs" style={{ color: "#475569" }}>PDF téléchargeable depuis la carte Contact · Max 5 MB</p>
              </div>
              {cardUrl && <CheckCircle size={16} style={{ color: "#22C55E", marginLeft: "auto" }} />}
            </div>

            <FileUpload
              bucket="cv"
              storagePath="business-card.pdf"
              accept=".pdf,application/pdf"
              maxSizeMB={5}
              currentUrl={cardUrl}
              label="Cliquer ou glisser la carte de visite (PDF)"
              hint="Format PDF uniquement · Max 5 MB"
              accentColor="#FF6B00"
              onUploadComplete={(url) => {
                setCardUrl(url);
                setCardSaved(true);
                setTimeout(() => setCardSaved(false), 4000);
              }}
            />

            {cardUrl && (
              <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,107,0,0.08)" }}>
                <a href={cardUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                  style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)", color: "#FF8C33" }}>
                  <Download size={12} /> Voir la carte actuelle
                </a>
                {cardSaved && <span className="text-xs" style={{ color: "#22C55E" }}>✓ Mis à jour sur le site</span>}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="p-4 rounded-xl" style={{ background: "rgba(0,119,255,0.04)", border: "1px solid rgba(0,119,255,0.12)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
              <strong style={{ color: "#00C3FF" }}>Comment ça fonctionne :</strong> Après l&apos;upload, les visiteurs qui cliquent
              &quot;Télécharger CV&quot; ou &quot;Carte de visite PDF&quot; sur la page d&apos;accueil reçoivent automatiquement ces fichiers.
            </p>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
