import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClass = `btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`;
  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}
