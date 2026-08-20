import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: {
    text: string;
    color: string;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-400',
  iconBg = 'bg-emerald-500/10',
  badge,
}) => {
  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-100 font-['Outfit'] mt-1 tracking-tight">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} border border-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {badge && (
            <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
