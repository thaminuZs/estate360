import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Label = forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none text-[#1F3D2C] peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none',
        className,
      )}
      {...props}
    />
  );
});

Label.displayName = 'Label';
