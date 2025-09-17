// app/api/proveedor/leerProveedor/route.ts
import { NextResponse } from "next/server";
import { readProveedor } from "@/actions/readProveedor";

export async function GET() {
  try {
    const result = await readProveedor();
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        proveedores: result.proveedores 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error in GET /api/proveedores:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}