"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

// 1. Definimos las props que un "campo de texto" genérico necesita
type FieldTextareaProps = {
  id: string; // Para el 'name' y el 'htmlFor'
  value: string | undefined; // El valor actual (del estado del formulario padre)
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // La función para actualizar el estado
  placeholder?: string;
  description?: string; // Texto de ayuda opcional
  rows?: number;
};

// 2. Usamos las nuevas props
export function FieldTextarea({
  id,
  value,
  onChange,
  placeholder,
  description,
  rows = 4,
}: FieldTextareaProps) {
  return (
    <div className="w-full h-fit">
      <FieldSet>
        <FieldGroup>
          <Field>
            <Textarea
              name={id}
              id={id}
              value={value ?? ""}
              onChange={onChange}
              placeholder={placeholder}
              rows={rows}
              className="border-none bg-light-30 dark:bg-dark-30 focus-visible:shadow-md"
            />
            {/* 6. Mostramos el texto de ayuda solo si existe */}
            {description && (
              <FieldDescription>
                {description}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}