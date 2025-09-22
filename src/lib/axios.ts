// lib/axios.ts
import axios from "axios";

const api = axios.create({
  // En Next.js, usar ruta relativa permite que funcione en dev y producción
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
