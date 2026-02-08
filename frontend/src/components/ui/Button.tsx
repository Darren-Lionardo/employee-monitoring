import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  isLoading?: boolean;
  className?: string;
};

export function Button({
  children,
  onClick,
  type = "button",
  isLoading = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-md font-medium
        bg-cyan-600 text-white
        hover:bg-cyan-800
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
        ${className}
      `}
    >
      {isLoading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
}
