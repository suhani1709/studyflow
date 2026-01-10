export type TaskCategory = 'study' | 'work' | 'play' | 'personal';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  subject?: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
  completed: boolean;
  date: string;
}

export interface DayStats {
  study: number;
  work: number;
  play: number;
  personal: number;
  totalMinutes: number;
  completedTasks: number;
  totalTasks: number;
}

export interface StreakData {
  current: number;
  best: number;
  lastActiveDate: string;
}
