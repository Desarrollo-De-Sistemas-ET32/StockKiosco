'use client';

import * as React from 'react';
import { useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/40',
  {
    variants: {
      size: {
        default: 'h-10',
        sm: 'h-8',
        lg: 'h-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label: string;
  labelClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  variant,
  size,
  className,
  labelClassName,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium mb-1',
          'text-gray-700 dark:text-gray-200',
          labelClassName
        )}
      >
        {label}
      </label>

      <input
        id={inputId}
        name={props.name}
        className={cn(
          inputVariants({ variant, size }),
          // estilos para modo claro + overrides para modo oscuro
          'border-gray-300 bg-gray-100 text-black placeholder-gray-500',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;
