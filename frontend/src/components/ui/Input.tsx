import React from "react";

type InputProps = {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export function Input({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  name,
  disabled = false,
  error,
  className = "",
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`
          px-3 py-2 rounded-md border
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          }
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
