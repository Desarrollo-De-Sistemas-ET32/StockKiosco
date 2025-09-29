import { createDescuento } from "@/actions/addDescuento";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Body recibido en API:", body);
    const result = await createDescuento(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    // If successful, return the created discount
    if (result.success) {
    return NextResponse.json(result.descuento, { status: 201 });
    }


    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
