import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializePrismaObject(obj: any): any {
  // Si es nulo o indefinido, devuélvelo tal cual
  if (obj === null || obj === undefined) {
    return obj;
  }

  // 1. Convierte BigInt a string
  if (typeof obj === "bigint") {
    return obj.toString();
  }

  // 2. Convierte Date a string (formato ISO)
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // 3. Convierte Decimal (de decimal.js) a string
  // Esta es la forma más segura de detectar un objeto Decimal de Prisma
  if (typeof obj === 'object' && obj !== null && 
        's' in obj && 'e' in obj && 'd' in obj && 
        typeof obj.toString === 'function') {
      return obj.toString();
    }

  // 4. Si es un Array, llama recursivamente a esta función para cada elemento
  if (Array.isArray(obj)) {
    return obj.map(serializePrismaObject);
  }

  // 5. Si es un Objeto, llama recursivamente a esta función para cada valor
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializePrismaObject(v)])
    );
  }

  // 6. Devuelve cualquier otro tipo (string, number, boolean) tal cual
  return obj;
}