import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import { DayStats } from '@/types/task';

interface WeeklyChartProps {
  getStatsForDate: (date: string) => DayStats;
}

export function WeeklyChart({ getStatsForDate }: WeeklyChartProps) {
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateString = format(date, 'yyyy-MM-dd');
    const stats = getStatsForDate(dateString);
    
    return {
      day: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      Study: Math.round(stats.study / 60 * 10) / 10,
      Work: Math.round(stats.work / 60 * 10) / 10,
      Play: Math.round(stats.play / 60 * 10) / 10,
      Personal: Math.round(stats.personal / 60 * 10) / 10,
    };
  });

  return (
    <div className="card-elevated p-6">
      <h3 className="font-semibold text-foreground mb-4">Weekly Overview (Hours)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value}h`, '']}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
            />
            <Legend />
            <Bar dataKey="Study" fill="hsl(195, 70%, 40%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Work" fill="hsl(270, 50%, 50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Play" fill="hsl(35, 90%, 55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Personal" fill="hsl(150, 50%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
