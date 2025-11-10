// src/app/logs/page.tsx  (o donde tengas la vista)
"use client";

import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { logService } from "@/app/Service/logs/LogsService";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Log } from "@/app/Service/logs/logs";

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Registros | Kiosco";
    setLoading(true);
    logService
      .getAll()
      .then((data) => {
        setLogs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error cargando logs:", err);
        setError(String(err?.message ?? err));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6 lg:mx-50">
      <div className="bg-light-60 dark:bg-dark-60 rounded-md w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
          Última actividad
        </h1>

        <div className="w-full">
          <div className="mb-4">
            {loading && (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            )}
            {error && <p className="text-sm text-red-500">Error: {error}</p>}
          </div>

          <div className="bg-light-30 dark:bg-dark-30 rounded-xl p-3 sm:p-4 w-full ">
            <ScrollArea className="h-96 w-full rounded-md">
              <div className="flex flex-col gap-3 sm:gap-4">
                {logs.length === 0 && !loading ? (
                  <p className="text-sm text-muted-foreground">
                    No hay actividad reciente.
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={`${log.fecha ?? "nofecha"}-${index}`}
                      className="bg-light-60 dark:bg-dark-60 dark:text-foreground rounded-md px-3 sm:px-4 py-2 flex items-start sm:items-center gap-3 sm:gap-4 text-sm sm:text-base"
                    >
                      <FaUser className="text-lg sm:text-xl mt-1 sm:mt-0" />
                      <span>
                        <strong>{log.usuario}</strong> - {log.accion}
                        {log.producto && (
                          <>
                            {" "}
                            <strong>{log.producto}</strong>
                            {log.cantidad !== undefined
                              ? ` (Cantidad: ${log.cantidad})`
                              : ""}
                          </>
                        )}
                        {log.ip && <> (IP: {log.ip})</>}
                        {log.hora ? (
                          <>
                            {" "}
                            a las <strong>{log.hora}</strong>
                          </>
                        ) : (
                          log.fecha && (
                            <> - {new Date(log.fecha).toLocaleString()}</>
                          )
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Button
          type="button"
          className="mt-6 sm:mt-10 bg-light-30 hover:bg-light-30/70 dark:bg-dark-30 hover:dark:bg-dark-30/70 text-foreground px-6 sm:px-8 py-2 text-sm sm:text-base"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </div>
    </main>
  );
}
