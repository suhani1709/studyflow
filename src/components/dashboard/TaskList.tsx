import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTask: () => void;
}

export function TaskList({ tasks, onToggle, onDelete, onAddTask }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Today's Tasks</h3>
        <Button size="sm" onClick={onAddTask} className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">No tasks for today</p>
          <Button variant="outline" size="sm" onClick={onAddTask}>
            Add your first task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {tasks.filter(t => t.completed).length} of {tasks.length} completed
            </span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ 
                  width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
