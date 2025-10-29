// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import LoginInput from "@/components/loginInput";
import { BiKey } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { authService } from "@/app/Service/usuario/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Completa email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const resp = await authService.login({
        email: form.email,
        password: form.password,
      });

      // Guardar token si viene en la respuesta (opcional)
      const token = resp?.token ?? resp?.accessToken ?? null;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      // Guardar el objeto usuario (safeUser) si viene en la respuesta
      const usuario = resp?.usuario ?? resp?.user ?? resp?.usuario ?? null;
      if (usuario && typeof window !== "undefined") {
        try {
          localStorage.setItem("usuario", JSON.stringify(usuario));
        } catch (err) {
          console.warn("Error saving usuario to localStorage", err);
        }
      }

      // Redirigir al home (o a la ruta que prefieras)
      router.push("/");
    } catch (err: any) {
      console.error("Error en login:", err);
      const msg =
        err?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error al iniciar sesión";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <Image
        src="/background.avif"
        alt="fondo de kiosco"
        fill
        style={{
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "brightness(50%)",
        }}
      />
      <Card className="w-lg max-h-[50rem] h-[30rem] border-none bg-var6 dark:bg-var2 z-1 m-5 flex flex-col justify-evenly drop-shadow-xl/75">
        <CardHeader className="flex justify-center items-center text-center">
          <CardTitle className="text-3xl font-bold text-var text-black dark:text-white">
            INICIAR SESIÓN
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 px-3 py-2 rounded bg-red-100 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[2rem]">
            <LoginInput
              id="email"
              type="email"
              placeholder="tu_email@ejemplo.com"
              icon={<BiSolidUser className="text-background" />}
              label="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />

            <LoginInput
              id="password"
              type="password"
              placeholder="Contraseña"
              icon={<BiKey className="text-background" />}
              label="Contraseña"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="bg-foreground dark:bg-background font-bold cursor-pointer w-3/7 py-4 border-none text-white rounded-md drop-shadow-xl/10 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center items-center">
          <div className="text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <a href="/register" className="text-primary underline">
              Registrate
            </a>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
