import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export function Alert({ className, variant = 'info', title, children, ...props }) {
  const styles = {
    info: {
      box: 'border-[#D7E6DD] bg-[#D7E6DD]/30 text-[#1F3D2C]',
      icon: <Info className="h-4 w-4 text-[#1F3D2C] shrink-0 mt-0.5" />,
    },
    success: {
      box: 'border-[#BACFC2] bg-[#D7E6DD]/50 text-[#1F3D2C]',
      icon: <CheckCircle2 className="h-4 w-4 text-[#1F3D2C] shrink-0 mt-0.5" />,
    },
    error: {
      box: 'border-red-200 bg-red-50 text-red-800',
      icon: <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />,
    },
    warning: {
      box: 'border-[#F1C40F]/40 bg-[#F1C40F]/15 text-[#5C4800]',
      icon: <AlertCircle className="h-4 w-4 text-[#8C6239] shrink-0 mt-0.5" />,
    },
  };

  const current = styles[variant] || styles.info;

  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-none border p-3 flex items-start gap-2.5 text-sm',
        current.box,
        className,
      )}
      {...props}
    >
      {current.icon}
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5 leading-none">{title}</h5>}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
