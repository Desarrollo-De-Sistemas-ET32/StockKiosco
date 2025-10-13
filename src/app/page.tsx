"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/main"); // redirige sin dejar historial
  }, [router]);

  return null; // no muestra nada mientras redirige
}
