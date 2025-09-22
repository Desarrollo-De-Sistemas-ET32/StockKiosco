// services/categorias.ts
import api from "@/lib/axios";

export type CreateCategoriaPayload = {
  nombre: string;
};

export type CreateCategoriaResponse = {
  message?: string;
  categoria?: { id?: string | number; nombre: string; [k: string]: any };
  error?: Record<string, string>;
};

export async function createCategoria(payload: CreateCategoriaPayload) {
  try {
    const res = await api.post<CreateCategoriaResponse>("/categorias/crearCategoria", payload);
    return res.data;
  } catch (err: any) {
    // Axios error handling
    if (err?.response?.data) {
      return err.response.data as CreateCategoriaResponse;
    }
    return { error: { general: err?.message ?? "Unknown error" } } as CreateCategoriaResponse;
  }
}
