import { useEffect } from 'react';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'destructive',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!loading) onCancel();
        }}
      />
      <Card className="relative z-10 w-full max-w-md rounded-none border border-[#D7E6DD] bg-white shadow-xl">
        <CardHeader className="p-5 pb-3 border-b border-[#D7E6DD]/60 flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 flex items-center justify-center border shrink-0 ${
                variant === 'destructive'
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-[#D7E6DD]/60 text-[#1F3D2C] border-[#D7E6DD]'
              }`}
            >
              {variant === 'destructive' ? (
                <Trash2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#8C6239]" />
              )}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#1F3D2C] font-heading">
                {title}
              </CardTitle>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="text-[#9CA3AF] hover:text-[#1F2937] cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <CardContent className="p-5 text-xs text-[#4B5563] leading-relaxed">
          {description}
        </CardContent>

        <CardFooter className="p-4 bg-[#F8F9FA] border-t border-[#D7E6DD] flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onCancel}
            className="rounded-none border-[#D7E6DD] text-[#4B5563] hover:text-[#1F2937] text-xs h-8 px-4 cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-none text-xs h-8 px-5 cursor-pointer font-medium gap-1.5 ${
              variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#1F3D2C] hover:bg-[#162D20] text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white border-t-transparent animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
