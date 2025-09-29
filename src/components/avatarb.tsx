"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Icono({ src }: { src?: string }) {
  const [initial, setInitial] = useState<string>("U");
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (!mounted) return;
        if (session?.user) {
          const user = session.user;
          const name =
            (user.user_metadata as any)?.full_name ||
            (user.user_metadata as any)?.name ||
            user.email ||
            "";
          setEmail(user.email ?? null);
          setInitial(name ? String(name).charAt(0).toUpperCase() : "U");
        } else {
          setEmail(null);
          setInitial("U");
        }
      } catch (e) {
        console.error("avatarb loadSession:", e);
      }
    }

    loadSession();

    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const name =
          (user.user_metadata as any)?.full_name ||
          (user.user_metadata as any)?.name ||
          user.email ||
          "";
        setEmail(user.email ?? null);
        setInitial(name ? String(name).charAt(0).toUpperCase() : "U");
      } else {
        setEmail(null);
        setInitial("U");
      }
    });

    return () => {
      mounted = false;
      // unsubscribe listener
      try {
        listener.data?.subscription?.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // redirige a login
      router.replace("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 focus:outline-none"
        aria-expanded={open}
      >
        <Avatar className="mr-2">
          {src ? (
            <AvatarImage src={src} alt="avatar" />
          ) : (
            <AvatarFallback>{initial || "U"}</AvatarFallback>
          )}
        </Avatar>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-var2 shadow rounded p-2 z-50">
          <div className="px-2 py-1 text-xs text-muted-foreground break-words">
            {email ?? "Usuario"}
          </div>
          <div className="mt-2">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-2 py-2 rounded hover:bg-var6/60 dark:hover:bg-var1/60"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
