// app/Service/logs/clientLogs.ts
import api from '../API';
import { getLocalUsuario } from '@/app/Service/usuario/LocalUser';

export async function createClientLog(accion: string, descripcion?: string) {
  const usuario = getLocalUsuario();
  const payload = {
    id_usuario: usuario?.id_usuario ?? null,
    accion,
    descripcion: descripcion ?? null,
  };

  const resp = await api.post('/logs/addLogs', payload);
  return resp.data;
}
