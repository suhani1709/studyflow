import { useState, useEffect, useCallback } from 'react';
import { Task, DayStats, StreakData, TaskCategory } from '@/types/task';
import { format, parseISO, differenceInMinutes, isToday, isYesterday, differenceInDays } from 'date-fns';

const STORAGE_KEY = 'studyPlanner_tasks';
const STREAK_KEY = 'studyPlanner_streak';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [streak, setStreak] = useState<StreakData>(() => {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored ? JSON.parse(stored) : { current: 0, best: 0, lastActiveDate: '' };
  });

  // Persist tasks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Persist streak
  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  }, [streak]);

  // Check and update streak
  const updateStreak = useCallback((tasksForToday: Task[]) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const productiveTasks = tasksForToday.filter(
      t => t.completed && (t.category === 'study' || t.category === 'work')
    );

    if (productiveTasks.length > 0) {
      setStreak(prev => {
        if (prev.lastActiveDate === today) {
          return prev;
        }

        const lastDate = prev.lastActiveDate ? parseISO(prev.lastActiveDate) : null;
        let newCurrent = 1;

        if (lastDate && isYesterday(lastDate)) {
          newCurrent = prev.current + 1;
        } else if (lastDate && differenceInDays(new Date(), lastDate) > 1) {
          newCurrent = 1;
        }

        return {
          current: newCurrent,
          best: Math.max(newCurrent, prev.best),
          lastActiveDate: today,
        };
      });
    }
  }, []);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  // Add task
  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: generateId() };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  // Update task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      const todayTasks = updated.filter(t => t.date === format(new Date(), 'yyyy-MM-dd'));
      updateStreak(todayTasks);
      return updated;
    });
  }, [updateStreak]);

  // Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const todayTasks = updated.filter(t => t.date === format(new Date(), 'yyyy-MM-dd'));
      updateStreak(todayTasks);
      return updated;
    });
  }, [updateStreak]);

  // Calculate stats for a date
  const getStatsForDate = useCallback((date: string): DayStats => {
    const dayTasks = getTasksForDate(date);
    const stats: DayStats = {
      study: 0,
      work: 0,
      play: 0,
      personal: 0,
      totalMinutes: 0,
      completedTasks: 0,
      totalTasks: dayTasks.length,
    };

    dayTasks.forEach(task => {
      if (task.completed) {
        stats.completedTasks++;
        const duration = differenceInMinutes(
          parseISO(`${task.date}T${task.endTime}`),
          parseISO(`${task.date}T${task.startTime}`)
        );
        stats[task.category] += duration;
        stats.totalMinutes += duration;
      }
    });

    return stats;
  }, [getTasksForDate]);

  // Get day status for calendar
  const getDayStatus = useCallback((date: string): 'completed' | 'partial' | 'missed' | 'empty' => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return 'empty';
    
    const productiveTasks = dayTasks.filter(t => t.category === 'study' || t.category === 'work');
    const completedProductive = productiveTasks.filter(t => t.completed);
    
    if (completedProductive.length === 0) return 'missed';
    if (completedProductive.length === productiveTasks.length) return 'completed';
    return 'partial';
  }, [getTasksForDate]);

  return {
    tasks,
    streak,
    getTasksForDate,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getStatsForDate,
    getDayStatus,
  };
}
