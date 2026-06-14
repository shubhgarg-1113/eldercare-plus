"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import Disclaimer from "@/components/Disclaimer";

export default function UploadPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setAnalysis([]);
    }
  };

  const analyzeReport = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch("http://localhost:8000/api/report/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setAnalysis(data.lines || []);
    } catch (err) {
      setAnalysis(["Error | 🔴 | Could not analyze the report. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.uploadTitle}</h1>
        <Disclaimer />
        <p className="text-lg text-gray-600 mb-8">{t.uploadSubtitle}</p>

        <label className="block border-2 border-dashed border-teal-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-teal-50 transition mb-6">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {preview ? (
            <img src={preview} alt="Report preview" className="max-h-64 mx-auto rounded-lg" />
          ) : (
            <div>
              <div className="text-5xl mb-3">📄</div>
              <p className="text-lg text-gray-600">{t.uploadPrompt}</p>
            </div>
          )}
        </label>

        {file && (
          <button
            onClick={analyzeReport}
            disabled={loading}
            className="w-full bg-teal-600 text-white text-xl font-semibold px-6 py-4 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
          >
            {loading ? t.analyzing : t.analyzeButton}
          </button>
        )}

        {analysis.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.resultsTitle}</h2>
            {analysis.map((line, i) => {
              const parts = line.split("|").map((p) => p.trim());
              const [name, status, explanation] = parts;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{status}</span>
                    <span className="text-xl font-bold text-gray-900">{name}</span>
                  </div>
                  <p className="text-lg text-gray-700">{explanation}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}