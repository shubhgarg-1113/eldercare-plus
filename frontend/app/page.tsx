"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
          {t.heroSubtitle}
        </p>
        <div className="flex gap-6">
          <Link
            href="/chat"
            className="bg-teal-600 text-white text-xl font-semibold px-10 py-5 rounded-xl hover:bg-teal-700 transition"
          >
            {t.startTalking}
          </Link>
          <Link
            href="/dashboard"
            className="border-2 border-teal-600 text-teal-600 text-xl font-semibold px-10 py-5 rounded-xl hover:bg-teal-50 transition"
          >
            {t.viewDiary}
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
          {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.voiceCompanionTitle}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">{t.voiceCompanionDesc}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.healthDiaryTitle}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">{t.healthDiaryDesc}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-4">🔬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.reportAnalyzerTitle}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">{t.reportAnalyzerDesc}</p>
          </div>
        </div>
      </div>

      <footer className="text-center py-8 text-gray-400 text-lg">
        {t.footer}
      </footer>
    </main>
  );
}