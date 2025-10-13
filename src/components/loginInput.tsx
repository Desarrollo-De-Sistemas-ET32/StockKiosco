// components/loginInput.tsx
import React from "react";

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const LoginInput: React.FC<Props> = ({
  id,
  label,
  placeholder,
  type = "text",
  icon,
  value,
  disabled = false,
  onChange,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}

        <input
          id={id}
          name={id} 
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          disabled={disabled}
          onChange={onChange}
          className="w-full h-12 pl-12 pr-3 rounded-lg border-none bg-var5 dark:bg-var1 text-sm"
          aria-label={label ?? id}
        />
      </div>
    </div>
  );
};

export default LoginInput;
