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

interface ComboboxProps {
  marcas: { id_marca: number; nombre_marca: string }[];
}

export function ComboboxDemo({ marcas }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="justify-between dark:bg-var1 bg-var6 w-full"
        >
          {value
            ? marcas.find((marca) => marca.id_marca.toString() === value)?.nombre_marca
            : "Seleccionar marca"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 dark:bg-var1 bg-var6 w-full">
        <Command>
          <CommandList>
            <CommandGroup>
              {marcas.map((marca) => (
                <CommandItem
                  key={marca.id_marca}
                  value={marca.id_marca.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {marca.nombre_marca}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === marca.id_marca.toString() ? "opacity-100" : "opacity-0"
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