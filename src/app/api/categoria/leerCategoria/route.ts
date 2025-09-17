// app/api/categorias/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCategoria } from "@/actions/addCategoria";
import { readCategoria } from "@/actions/readCategoria";

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

export async function GET() {
  try {
    const result = await readCategoria();
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        categorias: result.categorias 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in GET /api/categorias:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}