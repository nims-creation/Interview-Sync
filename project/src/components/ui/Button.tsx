import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl focus:outline-none transition-all duration-300 ease-in-out hover:transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl';

  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-accent-500/50 dark:bg-primary-700 dark:hover:bg-primary-800 animate-button-hover',
    secondary: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-4 focus:ring-accent-500/50 dark:bg-accent-700 dark:hover:bg-accent-800 animate-button-hover',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-4 focus:ring-success-500/50 dark:bg-success-700 dark:hover:bg-success-800 animate-button-hover',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-500/50 dark:bg-red-700 dark:hover:bg-red-800 animate-button-hover',
    outline: 'border-2 border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-4 focus:ring-accent-500/50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5'
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const disabledStyles = disabled || isLoading ? 'opacity-60 cursor-not-allowed scale-100' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;