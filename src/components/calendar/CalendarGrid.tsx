import { useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  startOfWeek,
  endOfWeek,
  isBefore
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  currentMonth: Date;
  getDayStatus: (date: string) => 'completed' | 'partial' | 'missed' | 'empty';
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

const statusStyles = {
  completed: 'calendar-day-completed',
  partial: 'calendar-day-partial',
  missed: 'calendar-day-missed',
  empty: 'calendar-day-empty',
};

export function CalendarGrid({ currentMonth, getDayStatus, onSelectDate, selectedDate }: CalendarGridProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const today = new Date();

  return (
    <div className="card-elevated p-6">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateString = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isPast = isBefore(day, today) && !isTodayDate;
          const status = isPast || isTodayDate ? getDayStatus(dateString) : 'empty';
          const isSelected = dateString === selectedDate;

          return (
            <button
              key={dateString}
              onClick={() => onSelectDate(dateString)}
              disabled={!isCurrentMonth}
              className={cn(
                'calendar-day',
                isCurrentMonth ? statusStyles[status] : 'opacity-30 cursor-not-allowed bg-transparent',
                isTodayDate && 'calendar-day-today',
                isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
              )}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {status === 'completed' && isCurrentMonth && (
                <span className="text-xs">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-success/30" />
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-warning/30" />
          <span className="text-xs text-muted-foreground">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-danger/30" />
          <span className="text-xs text-muted-foreground">Missed</span>
        </div>
      </div>
    </div>
  );
}
