import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { TaskList } from '@/components/dashboard/TaskList';
import { AddTaskDialog } from '@/components/dashboard/AddTaskDialog';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/hooks/useTaskStore';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddTask, setShowAddTask] = useState(false);

  const { 
    streak, 
    getDayStatus, 
    getTasksForDate, 
    addTask, 
    toggleTask, 
    deleteTask 
  } = useTaskStore();

  const selectedTasks = getTasksForDate(selectedDate);

  return (
    <AppLayout streak={streak.current}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground">Plan your month ahead</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(new Date());
                    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                  }}
                >
                  Today
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CalendarGrid
              currentMonth={currentMonth}
              getDayStatus={getDayStatus}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>

          {/* Selected Day Tasks */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {format(new Date(selectedDate), 'EEEE, MMM d')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} scheduled
              </p>
            </div>

            <TaskList
              tasks={selectedTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onAddTask={() => setShowAddTask(true)}
            />
          </div>
        </div>
      </div>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onAdd={addTask}
        date={selectedDate}
      />
    </AppLayout>
  );
}
