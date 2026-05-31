import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDowntime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getCriticalityColor(criticality: string): string {
  const map: Record<string, string> = {
    critical: "badge-critical",
    major: "badge-major",
    medium: "badge-medium",
    minor: "badge-minor",
  };
  return map[criticality] || "badge-blue";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    resolved: "badge-resolved",
    in_progress: "badge-progress",
    observation: "badge-blue",
  };
  return map[status] || "badge-blue";
}
