"use client";

import { useState, useEffect } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function SemanaChart() {
  const [data, setData] = useState<{ day: string; value: number }[]>([]);

  useEffect(() => {
    const hoy = new Date();
    const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 }); // lunes

    const dias = Array.from({ length: 7 }).map((_, i) => {
      const fecha = addDays(inicioSemana, i);
      return {
        day: format(fecha, "EEE"), // Lun, Mar, Mié...
        value: Math.floor(Math.random() * 100), // aquí pondrías tus datos reales
      };
    });

    setData(dias);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Semana actual</h2>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </div>
  );
}