import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryStyles = {
  study: 'category-study',
  work: 'category-work',
  play: 'category-play',
  personal: 'category-personal',
};

const priorityStyles = {
  low: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  high: 'bg-danger/20 text-danger',
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={cn(
      "task-item group",
      task.completed && "opacity-60"
    )}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="w-5 h-5"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-sm font-medium",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
          {task.subject && (
            <span className="text-xs text-muted-foreground">• {task.subject}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            categoryStyles[task.category]
          )}>
            {task.category}
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            priorityStyles[task.priority]
          )}>
            {task.priority}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {task.startTime} - {task.endTime}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-danger"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
