import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  glowColor?: 'cyan' | 'purple' | 'blue' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  glowColor = 'cyan'
}) => {
  const glowStyles = {
    cyan: 'border-cyan-500/30 dark:border-cyan-500/25 shadow-cyan-500/5 dark:shadow-cyan-500/10 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20',
    purple: 'border-purple-500/30 dark:border-purple-500/25 shadow-purple-500/5 dark:shadow-purple-500/10 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/20',
    blue: 'border-blue-500/30 dark:border-blue-500/25 shadow-blue-500/5 dark:shadow-blue-500/10 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20',
    emerald: 'border-emerald-500/30 dark:border-emerald-500/25 shadow-emerald-500/5 dark:shadow-emerald-500/10 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
  };

  const iconBg = {
    cyan: 'bg-cyan-100/80 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30',
    purple: 'bg-purple-100/80 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    blue: 'bg-blue-100/80 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    emerald: 'bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
  };

  return (
    <div
      className={`relative p-5 rounded-2xl glass-panel transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${glowStyles[glowColor]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl border ${iconBg[glowColor]} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400">Live Backend Metric</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{trend}</span>
        </div>
      )}
    </div>
  );
};
