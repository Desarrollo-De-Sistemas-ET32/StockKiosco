// app/Service/usuario/localUser.ts
export function getLocalUsuario(): { id_usuario?: number; name?: string; email?: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem('usuario');
    if (!s) return null;
    console.log("Usuario cargado desde localStorage:", s);
    return JSON.parse(s);
  } catch {
    return null;
  }
}
