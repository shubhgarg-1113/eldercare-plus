"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function MedicationsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [medications, setMedications] = useState<any[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const [time, setTime] = useState("");
  const [dosage, setDosage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMedications = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/medications/?userId=user1");
      const data = await res.json();
      setMedications(data.medications || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedications();

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      medications.forEach((med) => {
        if (med.time === currentTime && !med.taken) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("💊 Medicine Reminder", {
              body: `Time to take ${med.medicineName} (${med.dosage})`,
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [medications]);

  const addMedication = async () => {
    if (!medicineName || !time || !dosage) return;
    setLoading(true);

    try {
      await fetch("http://localhost:8000/api/medications/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user1",
          medicineName,
          time,
          dosage,
        }),
      });

      setMedicineName("");
      setTime("");
      setDosage("");
      fetchMedications();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/medications/${id}`, {
        method: "DELETE",
      });
      fetchMedications();
    } catch (err) {
      console.error(err);
    }
  };

  const markTaken = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/medications/${id}/taken`, {
        method: "PATCH",
      });
      fetchMedications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.medicationsTitle}</h1>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.addMedicine}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t.medicineNamePlaceholder}
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="w-full text-lg px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              placeholder={t.dosagePlaceholder}
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full text-lg px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-lg px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={addMedication}
              disabled={loading}
              className="w-full bg-teal-600 text-white text-xl font-semibold px-6 py-4 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading ? t.adding : t.addButton}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.yourList}</h2>
        {medications.length === 0 ? (
          <p className="text-lg text-gray-500">{t.noMedications}</p>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <div
                key={med._id}
                className={`bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center ${
                  med.taken ? "opacity-50" : ""
                }`}
              >
                <div>
                  <p className="text-xl font-bold text-gray-900">{med.medicineName}</p>
                  <p className="text-lg text-gray-600">{med.dosage}</p>
                  {med.taken && <p className="text-sm text-green-600 font-semibold">✅ {t.takenToday}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-teal-600">{med.time}</div>
                  {!med.taken && (
                    <button
                      onClick={() => markTaken(med._id)}
                      className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-green-200"
                    >
                      {t.markTaken}
                    </button>
                  )}
                  <button
                    onClick={() => deleteMedication(med._id)}
                    className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-red-200"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}