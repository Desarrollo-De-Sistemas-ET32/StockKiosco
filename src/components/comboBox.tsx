"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// 1. Props genéricas: un array de { value, label }
interface ComboboxItem {
  value: number;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[]; // El array de items
  value: number | string;  // El ID seleccionado (viene del formulario)
  onSelect: (selectedValue: string) => void; // Función para avisar al formulario
  placeholder: string; // Texto (ej: "Seleccionar marca")
}

export function ComboboxDemo({ items, value, onSelect, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  // 2. ELIMINAMOS el 'useState' para 'value'. Usamos la prop.

  // Convertimos el value (que puede ser 0 o "0") a string para comparar
  const currentValueStr = String(value);

  // Buscamos el label del item seleccionado
  const selectedLabel = items.find(
    (item) => item.value.toString() === currentValueStr
  )?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="justify-between dark:bg-dark-30 bg-light-30 w-full"
        >
          {/* 3. Mostramos el label o el placeholder */}
          {selectedLabel ? selectedLabel : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 dark:bg-dark-30 bg-light-30 w-full">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {/* 4. Mapeamos los 'items' genéricos */}
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value.toString()} // El valor de 'Command' debe ser string
                  onSelect={(selectedValue) => {
                    // 5. Llamamos a la función 'onSelect' del padre
                    onSelect(selectedValue === currentValueStr ? "" : selectedValue);
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      // 6. Comparamos los strings
                      currentValueStr === item.value.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}