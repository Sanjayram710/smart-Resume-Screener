import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`animate-spin text-emerald-400 ${sizeClasses[size]}`} />
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );
};

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
}) => {
  return (
    <div className="rounded-[28px] clay-card border border-rose-500/30 bg-rose-950/20 p-6 text-slate-100 flex items-start space-x-4">
      <div className="p-2 rounded-xl bg-rose-500/20 clay-icon-blob shrink-0">
        <AlertCircle className="w-5 h-5 text-rose-400" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-extrabold text-rose-300 font-['Outfit']">{title}</h4>
        <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-full shadow-[4px_4px_12px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
