import db from "@/lib/db";

export async function resetLogs() {
  try {
    const result = await db.logs.deleteMany({});
    console.log(`Logs reiniciados correctamente. Se eliminaron ${result.count} registros.`);
  } catch (error) {
    console.error("Error al reiniciar los logs:", error);
  }
}
