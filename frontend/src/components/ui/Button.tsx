import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  isLoading,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent-cyan text-bg-deep hover:shadow-glow-cyan disabled:bg-text-tertiary disabled:shadow-none',
    secondary: 'border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 active:bg-accent-cyan/20 disabled:border-text-tertiary disabled:text-text-tertiary',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated active:bg-border-subtle disabled:text-text-tertiary'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : children}
    </button>
  );
}
