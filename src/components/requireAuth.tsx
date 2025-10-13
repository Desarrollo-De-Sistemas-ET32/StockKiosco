"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  /**
   * Si querés validar token además de user, poné true y pasá tu verificación en checkToken()
   * (la versión simple solo comprueba existencia de `user` en localStorage).
   */
  validateToken?: boolean;
};

export default function RequireAuth({ children, validateToken = false }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Este hook siempre se ejecuta en el mismo orden (no condicional) — safe para hooks
    try {
      if (typeof window === "undefined") {
        router.replace("/login");
        return;
      }

      const raw = localStorage.getItem("user");
      if (!raw) {
        // no user -> redirect
        router.replace("/login");
        return;
      }

      const user = JSON.parse(raw);

      // validación mínima del objeto usuario
      if (!user || (!user.name && !user.nombre && !user.email)) {
        router.replace("/login");
        return;
      }

      // Si querés chequear token de forma adicional, podés implementar algo aquí.
      if (validateToken) {
        // Ejemplo simple (no verifica expiración). Para validación real llamar a tu backend.
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }
        // Si querés, podés hacer fetch('/api/auth/validate') aquí y decidir.
      }

      setAllowed(true);
    } catch (err) {
      console.error("RequireAuth error:", err);
      router.replace("/login");
    } finally {
      setChecking(false);
    }
  }, [router, validateToken]);

  // Loader mientras verificamos (evita flicker)
  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="text-sm">Verificando sesión...</span>
      </div>
    );
  }

  if (!allowed) {
    // Si llegamos aquí, ya hicimos router.replace en useEffect; no renderizamos children.
    return null;
  }

  return <>{children}</>;
}
