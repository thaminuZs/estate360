import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Button = forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      type = 'button',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#1F3D2C] disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-none';

    const variants = {
      default: 'bg-[#1F3D2C] text-white hover:bg-[#162D20] active:bg-[#0f1f16] border border-[#1F3D2C]',
      outline:
        'border border-[#1F3D2C] text-[#1F3D2C] bg-white hover:bg-[#D7E6DD]/40',
      secondary:
        'bg-[#D7E6DD] text-[#1F3D2C] hover:bg-[#c3d8cc] border border-[#c3d8cc]',
      earth: 'bg-[#8C6239] text-white hover:bg-[#724e2c] border border-[#8C6239]',
      ghost: 'text-[#1F3D2C] hover:bg-[#D7E6DD]/40 border border-transparent',
      link: 'text-[#1F3D2C] underline-offset-4 hover:underline p-0 h-auto border-none',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-11 px-6 text-base',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
