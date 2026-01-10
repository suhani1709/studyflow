import { useState } from 'react';
import { format } from 'date-fns';
import { BookOpen, Target, Clock, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { ProductivityChart } from '@/components/dashboard/ProductivityChart';
import { TaskList } from '@/components/dashboard/TaskList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AddTaskDialog } from '@/components/dashboard/AddTaskDialog';
import { useTaskStore } from '@/hooks/useTaskStore';

export default function Dashboard() {
  const [showAddTask, setShowAddTask] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const { 
    streak, 
    getTasksForDate, 
    addTask, 
    toggleTask, 
    deleteTask,
    getStatsForDate 
  } = useTaskStore();

  const todayTasks = getTasksForDate(today);
  const stats = getStatsForDate(today);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <AppLayout streak={streak.current}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}! 👋
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Study Time"
            value={formatTime(stats.study)}
            variant="study"
          />
          <StatsCard
            icon={<Target className="w-5 h-5" />}
            label="Tasks Done"
            value={stats.completedTasks}
            subValue={`of ${stats.totalTasks} tasks`}
            variant="default"
          />
          <StatsCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Time"
            value={formatTime(stats.totalMinutes)}
            variant="work"
          />
          <StatsCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Completion"
            value={stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : '0%'}
            variant="personal"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <TaskList
              tasks={todayTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onAddTask={() => setShowAddTask(true)}
            />
          </div>

          {/* Right Column - Streak & Chart */}
          <div className="space-y-6">
            <StreakCard current={streak.current} best={streak.best} />
            <ProductivityChart stats={stats} />
          </div>
        </div>
      </div>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onAdd={addTask}
        date={today}
      />
    </AppLayout>
  );
}
