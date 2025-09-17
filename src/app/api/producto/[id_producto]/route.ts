import { NextResponse } from "next/server";
import { updateProduct } from "@/actions/actualizarProducto";
import { deleteProduct } from "@/actions/deleteProductos"; 

// Define un serializador personalizado para BigInt
function replacer(key: any, value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

export async function PUT(
  request: Request,
  { params }: { params: { id_producto: string } }
) {
  try {
    const idNumber = Number(params.id_producto);
    if (isNaN(idNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de producto inválido.",
        },
        { status: 400 }
      );
    }
    const data = await request.json();
    const result = await updateProduct(idNumber, data);

    if (result.success) {
      // Usa el serializador al devolver la respuesta
      return new NextResponse(JSON.stringify(result, replacer), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la solicitud.",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id_producto } = await req.json();
    const result = await deleteProduct({ id_producto });
    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Producto eliminado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return NextResponse.json({ success: false, message: "Error al eliminar el producto" }, { status: 500 });
  }
}
