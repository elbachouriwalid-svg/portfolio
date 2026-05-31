import type { Metadata } from "next";
import "../../app/globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard — Walid El Bachouri",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
