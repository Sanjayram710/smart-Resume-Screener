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
      <Loader2 className={`animate-spin text-[#EA580C] ${sizeClasses[size]}`} />
      {message && <p className="text-sm font-medium text-[#6B553F] animate-pulse">{message}</p>}
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
    <div className="rounded-[28px] clay-card border border-[#FCA5A5] bg-[#FFFCF7] p-6 text-[#2A1B0F] flex items-start space-x-4">
      <div className="p-2 rounded-xl bg-[#FEE2E2] clay-icon-blob shrink-0">
        <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-extrabold text-[#991B1B] font-['Outfit']">{title}</h4>
        <p className="text-xs text-[#6B553F] mt-1 leading-relaxed font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 text-xs font-bold text-white clay-btn-primary"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
