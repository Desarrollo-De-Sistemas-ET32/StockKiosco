import { NextResponse } from "next/server";
import { filterUser } from "@/actions/filtrarUsuario";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await filterUser(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });

    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Error interno con el servidor" }, { status: 500 });
}}