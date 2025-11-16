"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

type Props = {
  src?: string;
  className?: string;
};

export default function Icono({ src, className = "" }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<{
    id_usuario?: number;
    name?: string;
    nombre?: string;
    email?: string;
    usuarios_roles?: string;
  } | null>(null);
  const [open, setOpen] = useState(false);

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
          alt="Avatar"
          className="w-10 h-10 rounded-full cursor-pointer object-cover"
          onClick={() => router.push("/login")}
        />
      </div>
    );
  }

const name = (
  user.name ??
  user.nombre ??
  user.email ??
  user.usuarios_roles ??
  ""
).toString();

  const inicial = name.trim().length ? name.trim()[0].toUpperCase() : "U";

  const isAdmin = user?.usuarios_roles?.includes("administrador") ?? false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-lg font-semibold text-primary-foreground cursor-pointer select-none ${className} `}
        >
          {inicial}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`z-40 w-full bg-light-60 dark:bg-dark-60 p-4 rounded-md shadow-md`
        }
      >
        <DropdownMenuLabel className="font-semibold text-foreground mb-2">
          {name.length > 20 ? name.slice(0, 17) + "..." : name}
        </DropdownMenuLabel>
        <DropdownMenuGroup className="flex flex-col gap-2">
          {isAdmin && (
            <DropdownMenuItem className="cursor-pointer p-2 rounded-md hover:bg-dark-30/70 hover:text-accent-foreground border-none outline-none">
              Panel de Administración
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={handleLogout}
            className="cursor-pointer p-2 rounded-md hover:bg-dark-30/70 hover:text-accent-foreground border-none outline-none"
          >
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
