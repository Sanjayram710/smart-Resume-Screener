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
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-slate-100 flex items-start space-x-3.5">
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-rose-300">{title}</h4>
        <p className="text-xs text-rose-200/80 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-xs font-medium text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
