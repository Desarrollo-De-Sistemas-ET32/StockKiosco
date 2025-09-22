import { NextResponse } from "next/server";
import { updateDescuento } from "@/actions/updateDescuento";

async function handleUpdate(req: Request) {
  try {
    const body = await req.json();
    const result = await updateDescuento(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error: any) {
    console.error("PUT/PATCH /api/descuento/editarDescuento error:", error?.message ?? error);
    return NextResponse.json({ success: false, error: error?.message ?? "Error" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  return handleUpdate(req);
}

export async function PATCH(req: Request) {
  return handleUpdate(req);
}
