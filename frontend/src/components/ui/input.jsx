import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(
  ({ className, type = 'text', disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-none border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:border-[#1F3D2C] focus:ring-1 focus:ring-[#1F3D2C] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 transition-colors',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
