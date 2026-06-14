import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-teal-600">
        VoiceHealth
      </Link>
      <div className="flex gap-6">
        <Link href="/" className="text-lg text-gray-700 hover:text-teal-600">
          Home
        </Link>
        <Link href="/chat" className="text-lg text-gray-700 hover:text-teal-600">
          Chat
        </Link>
        <Link href="/dashboard" className="text-lg text-gray-700 hover:text-teal-600">
          Diary
        </Link>
        <Link href="/upload" className="text-lg text-gray-700 hover:text-teal-600">
          Reports
        </Link>
        <Link href="/medications" className="text-lg text-gray-700 hover:text-teal-600">
          Medicines
        </Link>
      </div>
    </nav>
  );
}