"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-12">Bienvenido</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login">
          <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition">
            Iniciar sesión
          </button>
        </Link>

        <Link href="/main">
          <button className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-800 transition">
            Menu principal
          </button>
        </Link>
      </div>
    </div>
  );
}
