import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { TrendingUp, Clock, BookOpen, Target } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WeeklyChart } from '@/components/reports/WeeklyChart';
import { ProductivityChart } from '@/components/dashboard/ProductivityChart';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useTaskStore } from '@/hooks/useTaskStore';

export default function ReportsPage() {
  const { streak, getStatsForDate } = useTaskStore();

  // Calculate weekly totals
  const weeklyStats = useMemo(() => {
    let totalStudy = 0;
    let totalWork = 0;
    let totalPlay = 0;
    let totalPersonal = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const stats = getStatsForDate(date);
      totalStudy += stats.study;
      totalWork += stats.work;
      totalPlay += stats.play;
      totalPersonal += stats.personal;
      totalTasks += stats.totalTasks;
      completedTasks += stats.completedTasks;
    }

    return {
      study: totalStudy,
      work: totalWork,
      play: totalPlay,
      personal: totalPersonal,
      totalMinutes: totalStudy + totalWork + totalPlay + totalPersonal,
      totalTasks,
      completedTasks,
    };
  }, [getStatsForDate]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const todayStats = getStatsForDate(format(new Date(), 'yyyy-MM-dd'));

  return (
    <AppLayout streak={streak.current}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track your productivity trends</p>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Weekly Study"
            value={formatTime(weeklyStats.study)}
            subValue="This week"
            variant="study"
          />
          <StatsCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Time"
            value={formatTime(weeklyStats.totalMinutes)}
            subValue="All activities"
            variant="work"
          />
          <StatsCard
            icon={<Target className="w-5 h-5" />}
            label="Tasks Completed"
            value={weeklyStats.completedTasks}
            subValue={`of ${weeklyStats.totalTasks} tasks`}
            variant="personal"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg. Per Day"
            value={formatTime(Math.round(weeklyStats.totalMinutes / 7))}
            subValue="Productive time"
            variant="play"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyChart getStatsForDate={getStatsForDate} />
          </div>
          <div>
            <ProductivityChart stats={todayStats} />
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 card-elevated p-6">
          <h3 className="font-semibold text-foreground mb-4">💡 Weekly Insights</h3>
          <div className="space-y-3">
            {weeklyStats.study > 0 && (
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-study">📚</span>
                You've studied for <span className="font-medium text-foreground">{formatTime(weeklyStats.study)}</span> this week.
                {weeklyStats.study >= 420 && " Great job maintaining consistency!"}
              </p>
            )}
            {streak.current > 0 && (
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <span>🔥</span>
                Your current streak is <span className="font-medium text-foreground">{streak.current} days</span>.
                {streak.current >= 7 && " You're on fire!"}
              </p>
            )}
            {weeklyStats.completedTasks > 0 && (
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-success">✓</span>
                You completed <span className="font-medium text-foreground">{weeklyStats.completedTasks}</span> tasks this week.
              </p>
            )}
            {weeklyStats.totalMinutes === 0 && (
              <p className="text-sm text-muted-foreground">
                Start adding and completing tasks to see your productivity insights here!
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
