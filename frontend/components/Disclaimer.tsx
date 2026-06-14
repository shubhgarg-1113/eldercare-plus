"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Disclaimer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-base px-4 py-3 rounded-xl mb-6 text-center">
      {t.disclaimer}
    </div>
  );
}