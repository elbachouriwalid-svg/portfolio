"use client";
import { create } from "zustand";
import type { Language } from "./i18n";

interface AppStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  loaderDone: boolean;
  setLoaderDone: (done: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  language: "fr",
  setLanguage: (lang) => set({ language: lang }),
  loaderDone: false,
  setLoaderDone: (done) => set({ loaderDone: done }),
}));
