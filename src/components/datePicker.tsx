"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 1. Definimos las props que nuestro componente aceptará
type DatePickerProps = {
  id?: string;
  // Acepta el valor (string, Date, null o undefined)
  value: string | Date | null | undefined; 
  // Devuelve un string (ISO) o undefined
  onChange: (dateString: string | undefined) => void;
  placeholder?: string;
  className?: string; // Para pasar clases como 'col-span-3'
};

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className,
}: DatePickerProps) {

  const [open, setOpen] = React.useState(false);

  // 2. Convertimos el valor (string o Date) a un objeto Date
  // que el componente <Calendar> pueda entender
  const date = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          // 3. Aplicamos el className que nos pasan
          className={`w-full justify-between font-normal ${className}`}
        >
          {date ? date.toLocaleDateString("es-AR") : placeholder}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 bg-light-30 dark:bg-dark-30" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(newDate) => {
            onChange(newDate ? newDate.toISOString() : undefined);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}