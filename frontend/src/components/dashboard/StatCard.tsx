import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-emerald-50',
  iconColor = 'text-emerald-600',
  trend,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
            {value}
          </h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${iconBgColor} ${iconColor} shrink-0`}>
          <Icon size={26} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600">
          <span>{subtitle}</span>
          {trend && (
            <span
              className={`font-bold ${
                trend.isPositive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
