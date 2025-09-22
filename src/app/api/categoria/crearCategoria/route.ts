// app/api/categorias/crearCategoria/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCategoria } from "@/actions/addCategoria";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await createCategoria(body);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Categoría creada exitosamente", 
        categoria: result.categoria 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error in POST /api/categorias:", error);
    return NextResponse.json(
      { error: { general: "Error interno del servidor" } },
      { status: 500 }
    );
  }
}