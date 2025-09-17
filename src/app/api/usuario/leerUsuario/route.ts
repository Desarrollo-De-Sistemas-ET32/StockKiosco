// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { readUsuarios } from "@/actions/readUsuario";

export async function GET() {
  try {
    const result = await readUsuarios();
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        usuarios: result.usuarios 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in GET /api/usuarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}