"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-teal-600">
        {t.appName}
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg text-gray-700 hover:text-teal-600">
          {t.home}
        </Link>
        <Link href="/chat" className="text-lg text-gray-700 hover:text-teal-600">
          {t.chat}
        </Link>
        <Link href="/dashboard" className="text-lg text-gray-700 hover:text-teal-600">
          {t.diary}
        </Link>
        <Link href="/upload" className="text-lg text-gray-700 hover:text-teal-600">
          {t.reports}
        </Link>
        <Link href="/medications" className="text-lg text-gray-700 hover:text-teal-600">
          {t.medicines}
        </Link>

        {/* Language Switcher */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
          className="text-lg border border-gray-300 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
    </nav>
  );
}