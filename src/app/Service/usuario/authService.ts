// app/Service/usuario/authService.ts
import api from "../API";
import axios from "axios";

export const authService = {
  login: async (payload: { email: string; password: string }) => {
    try {
      const res = await api.post("/usuario/login", payload);
      const data = res.data;

      if (data?.error) throw new Error(data.error);

      if (typeof window !== "undefined") {
        if (data?.token) localStorage.setItem("token", data.token);

        const user = data.user ?? data.usuario ?? data;
        const savedUser = user.usuario ?? user.user ?? user;
        try {
          localStorage.setItem("user", JSON.stringify(savedUser));
        } catch (e) {
          console.warn("Could not store user in localStorage", e);
        }
      }

      return data;
    } catch (err: any) {
      console.error("authService.login error:", err);
      if (axios.isAxiosError(err)) {
        if (!err.response) throw new Error("Network Error: no response from server");
        const backendMsg = err.response.data?.error || err.response.data?.message;
        if (backendMsg) throw new Error(backendMsg);
        throw new Error(`HTTP ${err.response.status} - ${err.response.statusText}`);
      }
      if (err instanceof Error) throw err;
      throw new Error("Error en login");
    }
  },
};

export default authService;
