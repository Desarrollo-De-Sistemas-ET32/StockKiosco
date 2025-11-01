import { addMarca } from "@/actions/addMarca";
import { NextResponse } from "next/server";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(" Datos recibidos en POST /marcas/crearMarcas:", body);
        const result = await addMarca(body);

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: 400, headers: CORS_HEADERS }
            );
        }
        await db.logs.create({
            data: {
                id_usuario: body.id_usuario || null,
                accion: "Creación de marca",
                descripcion: `Se creó una marca con nombre ${result.marca?.nombre || "desconocido"} por el usuario ${body.id_usuario || "desconocido"}.`,
            },
        });
        console.log(" Marca creada exitosamente:", result.marca);
        return NextResponse.json(
            { marca: result.marca },
            { status: 201, headers: CORS_HEADERS }
        );
    } catch (err) {
        console.error(" Error en API (crearMarcas):", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}