"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface EmergencyModalProps {
  show: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ show, onClose }: EmergencyModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-red-600 z-50 flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl mb-6">EMERGENCY</div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {t.emergencyTitle}
      </h1>
      <p className="text-2xl text-white mb-10 max-w-xl">
        {t.emergencyMessage}
      </p>

      <a href="tel:112" className="bg-white text-red-600 text-2xl font-bold px-12 py-6 rounded-2xl mb-4 hover:bg-gray-100 transition">
        {t.callEmergency}
      </a>

      <button onClick={onClose} className="text-white text-lg underline opacity-80 hover:opacity-100">
        {t.dismiss}
      </button>
    </div>
  );
}
