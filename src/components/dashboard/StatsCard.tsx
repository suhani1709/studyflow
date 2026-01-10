import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: 'default' | 'study' | 'work' | 'play' | 'personal';
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  study: 'bg-study-light text-study',
  work: 'bg-work-light text-work',
  play: 'bg-play-light text-play',
  personal: 'bg-personal-light text-personal',
};

export function StatsCard({ icon, label, value, subValue, variant = 'default' }: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
        variantStyles[variant]
      )}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subValue && (
        <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
      )}
    </div>
  );
}
