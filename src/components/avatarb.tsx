"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  src?: string; // mantiene compatibilidad si antes pasabas src="/PrincessCard.png"
  className?: string;
};

export default function Icono({ src, className = "" }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; nombre?: string; email?: string } | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setOpen(false);
    setUser(null);
    router.push("/login");
  };

  // Si no hay usuario guardado, mostramos la imagen (princesa) como antes
  if (!user) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={src ?? "/PrincessCard.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full cursor-pointer object-cover"
          onClick={() => router.push("/login")}
        />
      </div>
    );
  }

  const name = (user.name ?? user.nombre ?? user.email ?? "").toString();
  const inicial = name.trim().length ? name.trim()[0].toUpperCase() : "U";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md focus:outline-none"
        aria-label="Abrir menú de usuario"
      >
        {inicial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-var2 text-sm rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2 border-b dark:border-gray-700">
            <div className="font-medium truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
