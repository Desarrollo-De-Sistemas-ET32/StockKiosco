import api from "../API";
import { MarcaPayload, MarcaWithId } from "./marca";

export const marcaService = {
    // Obtener todas las marcas
    getAll: async (): Promise<MarcaWithId[]> => {
        try {
            console.log('Obteniendo marcas...');
            const response = await api.get('/marcas/leerMarcas');
            const data = response.data;
            let marcas: any[] = [];
            if (Array.isArray(data)) marcas = data;
            else if (Array.isArray(data.marcas)) marcas = data.marcas;
            else if (data && data.marca && typeof data.marca === 'object') marcas = [data.marca];
            const marcasNormalizadas = marcas.map((m) => ({
                ...m,
            }));
            return marcasNormalizadas;
        } catch (error) {
            console.error('Error obteniendo marcas', error);
            throw error;
        }
    },

    // Obtener una marca por id
    getById: async (id: number): Promise<MarcaWithId | null> => {
        try {
            const response = await api.get(`/marca/${id}`);
            return response.data ?? null;
        } catch (error: any) {
            if (error?.response?.status === 404) return null;
            console.error(`Error obteniendo marca ${id}`, error);
            throw error;
        }
    },

    // Crear una nueva marca
    create: async (data: MarcaPayload): Promise<MarcaWithId> => {
        try {
            const response = await api.post<MarcaWithId>('/marca/crearMarca', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creando marca', error);
            throw error;
        }
    },
};