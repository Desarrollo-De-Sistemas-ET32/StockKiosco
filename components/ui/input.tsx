'use client';

import * as React from 'react';
import { useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'bg-foreground text-muted-foreground text-sm border-2 border-accent px-3 block w-full py-2 rounded-md hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-black-400',
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
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  size,
  className,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-card-foreground mb-1"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(inputVariants({ className }))}
        {...props}
      />
    </div>
  );
};