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
  iconColor = 'text-emerald-300',
  iconBg = 'bg-emerald-500/20',
  badge,
}) => {
  return (
    <div className="clay-card-interactive p-6 rounded-[28px] flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-300 tracking-wide">{title}</p>
          <p className="text-3xl font-extrabold text-white font-['Outfit'] mt-1.5 tracking-tight">
            {value}
          </p>
        </div>
        <div className={`p-3.5 clay-icon-blob ${iconBg} ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
      {(subtitle || badge) && (
        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
          {subtitle && <span className="text-slate-300 text-[11px] font-medium">{subtitle}</span>}
          {badge && (
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider clay-badge ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
