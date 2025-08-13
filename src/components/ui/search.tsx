'use client';

import * as React from 'react';
import { useId } from 'react';

export interface SearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Search: React.FC<SearchProps> = ({
  id,
  className,
  ...props
}) => {
  const generatedId = useId();
  const searchId = id ?? generatedId;

  return (
    <div className="w-full">
      <input
        id={searchId}
        className={`bg-foreground text-background text-sm h-10 border-2 border-accent px-3 block w-full py-2 rounded-md hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-black-400 ${className ?? ''}`}
        {...props}
      />
    </div>
  );
};

// <SlMagnifier />