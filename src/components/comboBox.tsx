"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxItem { value: number; label: string; }
interface ComboboxProps {
  items: ComboboxItem[];
  value: number | string;
  onSelect: (selectedValue: string) => void;
  placeholder: string;
}

export function ComboboxDemo({ items, value, onSelect, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const currentValueStr = String(value);
  const selectedLabel = items.find((item) => item.value.toString() === currentValueStr)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" aria-expanded={open} className="justify-between w-full dark:bg-dark-30 bg-light-30 focus:shadow-md">
          {selectedLabel || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full dark:bg-dark-30 bg-light-30">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem key={item.value} value={item.value.toString()} onSelect={(val) => { onSelect(val === currentValueStr ? "" : val); setOpen(false); }}>
                  {item.label}
                  <Check className={cn("ml-auto", currentValueStr === item.value.toString() ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}