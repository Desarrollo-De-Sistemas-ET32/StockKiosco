// app/Service/logs/logs.ts
export interface Log {
  id_log?: number;
  id_usuario?: number | null;
  usuario: string;
  accion: string;
  descripcion?: string | null;
  fecha?: string | null; 
  hora?: string | null; 
  raw?: any;
}

export function normalizeValue(v: any): any {
  if (typeof v === 'bigint') return v.toString();
  if (v && v.constructor?.name === 'Decimal') return Number(v.toString());
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(normalizeValue);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, normalizeValue(val)]));
  }
  return v;
}

export function deriveHoraFromFecha(fecha: any, hora?: any): string | null {
  if (hora && typeof hora === 'string' && hora.trim() !== '') return hora;
  if (!fecha) return null;
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return null;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}


export function extractUsuario(logRaw: any): string {
  if (!logRaw) return 'desconocido';

  const direct =
    logRaw.usuario ??
    logRaw.user ??
    logRaw.username ??
    logRaw.name ??
    logRaw.usuario_nombre ??
    null;
  if (direct && typeof direct === 'string' && direct.trim() !== '') return direct;

  const u = logRaw.usuarios ?? logRaw.usuario_obj ?? logRaw.userData ?? null;
  if (u) {
    if (Array.isArray(u) && u.length > 0) {
      const cand = u[0]?.name ?? u[0]?.username ?? u[0]?.email ?? null;
      if (cand) return String(cand);
    } else if (typeof u === 'object') {
      const cand = u?.name ?? u?.username ?? u?.email ?? u?.id ?? null;
      if (cand) return String(cand);
    }
  }

  if (logRaw.id_usuario != null) return String(logRaw.id_usuario);

  const stack = [logRaw];
  const seen = new Set();
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== 'object') continue;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const [k, v] of Object.entries(cur)) {
      if (typeof v === 'string' && (v.includes('@') || v.length > 2 || /\s/.test(v))) return v;
      if (typeof v === 'object') stack.push(v);
    }
  }

  return 'desconocido';
}

export function mapRawToLog(raw: any): Log {
  const r = normalizeValue(raw);

  const fechaRaw =
    r.fecha ??
    r.fecha_creacion ??
    r.fecha_creada ??
    r.createdAt ??
    r.fecha_creacion_log ??
    null;

  const fecha = fechaRaw ? new Date(fechaRaw).toISOString() : null;
  const hora = deriveHoraFromFecha(fechaRaw, r.hora) ?? null;

  const usuario = extractUsuario(r);
  const accion = r.accion ?? r.action ?? r.type ?? '';
  const descripcion = r.descripcion ?? r.description ?? null;

  return {
    id_log: r.id_log ?? r.id ?? undefined,
    id_usuario: r.id_usuario ?? undefined,
    usuario,
    accion,
    descripcion,
    fecha,
    hora,
    raw: r,
  };
}
