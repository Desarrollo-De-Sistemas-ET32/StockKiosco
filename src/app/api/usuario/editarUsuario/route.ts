import { editUser } from "@/actions/actualizarUsuario";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result = await editUser(body); 

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
