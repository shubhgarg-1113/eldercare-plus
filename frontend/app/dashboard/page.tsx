"use client";
import Disclaimer from "@/components/Disclaimer";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function DashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [diary, setDiary] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diaryRes = await fetch("http://localhost:8000/api/diary/?userId=user1");
        const diaryData = await diaryRes.json();
        setDiary(diaryData.entries || []);

        const summaryRes = await fetch(`http://localhost:8000/api/diary/summary?userId=user1&language=${language}`);
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.diaryTitle}</h1>
        <Disclaimer />
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-teal-800 mb-2">{t.weeklySummary}</h2>
          <p className="text-lg text-teal-900 leading-relaxed">
            {loading ? t.loadingSummary : summary || t.noSummary}
          </p>
        </div>

        {loading ? (
          <p className="text-lg text-gray-500">{t.loadingDiary}</p>
        ) : diary.length === 0 ? (
          <p className="text-lg text-gray-500">{t.noEntries}</p>
        ) : (
          <div className="space-y-6">
            {diary.map((day, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{day.date}</h3>
                <ul className="space-y-2">
                  {day.entries.map((entry: any, j: number) => (
                    <li key={j} className="text-lg text-gray-700">
                      <span className="font-semibold">{t.youSaid}</span> {entry.message}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}