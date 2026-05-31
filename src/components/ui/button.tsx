import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-stone-900 text-stone-50 hover:bg-stone-800 active:bg-stone-950 border border-stone-900 shadow-sm',
    secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200/80 active:bg-stone-200 border border-transparent',
    outline: 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50 hover:text-stone-950 active:bg-stone-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    text: 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50 active:bg-stone-100',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 active:bg-rose-200',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
