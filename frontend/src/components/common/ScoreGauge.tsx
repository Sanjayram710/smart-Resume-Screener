import React from 'react';
import { getScoreColor } from '../../utils/scoreColors';
import { formatScore } from '../../utils/formatters';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const color = getScoreColor(score);
  const percentage = Math.min(100, Math.max(0, (score / 10) * 100));

  // Circular gauge dimensions
  const dims = {
    sm: { radius: 18, stroke: 3.5, size: 44, textSize: 'text-xs', labelSize: 'text-[9px]' },
    md: { radius: 28, stroke: 4.5, size: 68, textSize: 'text-base', labelSize: 'text-[10px]' },
    lg: { radius: 42, stroke: 6, size: 104, textSize: 'text-2xl', labelSize: 'text-xs' },
  };

  const { radius, stroke, size: svgSize, textSize, labelSize } = dims[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center rounded-full clay-inset p-1.5" style={{ width: svgSize + 12, height: svgSize + 12 }}>
        <svg className="transform -rotate-90" width={svgSize} height={svgSize}>
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-800/80"
            fill="transparent"
          />
          {/* Progress stroke */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={color.ring}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold font-['Outfit'] leading-none ${color.text} ${textSize}`}>
            {formatScore(score)}
          </span>
          {size === 'lg' && (
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">/ 10</span>
          )}
        </div>
      </div>
      {showLabel && size !== 'sm' && (
        <span className={`font-bold text-slate-300 mt-1.5 ${labelSize}`}>Match Score</span>
      )}
    </div>
  );
};
