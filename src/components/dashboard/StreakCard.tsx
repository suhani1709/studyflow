import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  current: number;
  best: number;
}

export function StreakCard({ current, best }: StreakCardProps) {
  const isActive = current > 0;

  return (
    <div className={cn(
      "card-elevated p-6 relative overflow-hidden",
      isActive && "bg-gradient-to-br from-streak-fire/5 to-streak-glow/10"
    )}>
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-streak-glow/20 to-transparent rounded-bl-full" />
      )}
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            isActive 
              ? "bg-gradient-to-br from-streak-fire to-streak-glow" 
              : "bg-muted"
          )}>
            <Flame className={cn(
              "w-6 h-6",
              isActive ? "text-white" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className={cn(
              "text-3xl font-bold",
              isActive ? "text-streak-fire" : "text-muted-foreground"
            )}>
              {current} <span className="text-lg font-medium">days</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">Best:</span>
          <span className="font-semibold text-foreground">{best} days</span>
        </div>

        {isActive ? (
          <p className="mt-4 text-sm text-success flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            🔥 Keep going! You're on a roll!
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Complete a study task today to start your streak!
          </p>
        )}
      </div>
    </div>
  );
}
