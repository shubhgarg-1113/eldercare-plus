"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import Disclaimer from "@/components/Disclaimer";
import EmergencyModal from "@/components/EmergencyModal";

export default function ChatPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userId: "user1",
          language: language,
          history: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const aiReply = data.response;

      setMessages([...newMessages, { role: "assistant", content: aiReply }]);

      const utterance = new SpeechSynthesisUtterance(aiReply);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);

      const emergencyKeywords = ["chest pain", "can't breathe", "cannot breathe", "stroke", "unconscious", "heart attack", "severe headache"];
      if (emergencyKeywords.some((kw) => text.toLowerCase().includes(kw))) {
        setShowEmergency(true);
      }

    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognition.start();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {t.chatTitle}
        </h1>
        <Disclaimer />

        <div className="flex-1 flex flex-col gap-4 mb-6 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-lg mt-12">
              {t.chatEmptyState}
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-md px-5 py-4 rounded-2xl text-lg leading-relaxed ${
                msg.role === "user"
                  ? "bg-teal-600 text-white self-end"
                  : "bg-white text-gray-800 self-start shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="bg-white text-gray-400 self-start shadow-sm px-5 py-4 rounded-2xl text-lg">
              {t.thinking}
            </div>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={startListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition ${
              listening ? "bg-red-500 text-white" : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            🎙️
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={t.chatPlaceholder}
            className="flex-1 text-lg px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={() => sendMessage(input)}
            className="bg-teal-600 text-white text-lg font-semibold px-6 py-4 rounded-xl hover:bg-teal-700 transition"
          >
            {t.send}
          </button>
        </div>
      </div>
      <EmergencyModal show={showEmergency} onClose={() => setShowEmergency(false)} />
    </main>
  );
}