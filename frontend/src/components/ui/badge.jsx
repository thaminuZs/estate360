import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'yellow', ...props }) {
  const variants = {
    yellow:
      'bg-[#F1C40F] text-[#3D2F00] font-semibold border border-[#DDB30D]',
    primary:
      'bg-[#1F3D2C] text-white font-medium border border-[#162D20]',
    light:
      'bg-[#D7E6DD] text-[#1F3D2C] font-medium border border-[#BACFC2]',
    brown:
      'bg-[#8C6239] text-white font-medium border border-[#74502d]',
    outline:
      'border border-[#1F3D2C] text-[#1F3D2C] bg-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-none px-2 py-0.5 text-xs transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
