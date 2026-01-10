import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DayStats } from '@/types/task';

interface ProductivityChartProps {
  stats: DayStats;
}

const COLORS = {
  study: 'hsl(195, 70%, 40%)',
  work: 'hsl(270, 50%, 50%)',
  play: 'hsl(35, 90%, 55%)',
  personal: 'hsl(150, 50%, 45%)',
};

const LABELS = {
  study: 'Study',
  work: 'Work',
  play: 'Play',
  personal: 'Personal',
};

export function ProductivityChart({ stats }: ProductivityChartProps) {
  const data = Object.entries(COLORS)
    .filter(([key]) => stats[key as keyof typeof COLORS] > 0)
    .map(([key, color]) => ({
      name: LABELS[key as keyof typeof LABELS],
      value: stats[key as keyof typeof COLORS],
      color,
    }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (data.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="font-semibold text-foreground mb-4">Today's Breakdown</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          <p className="text-center">
            No completed tasks yet.<br />
            <span className="text-sm">Complete tasks to see your productivity!</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <h3 className="font-semibold text-foreground mb-4">Today's Breakdown</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatTime(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend 
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-foreground">
          {formatTime(stats.totalMinutes)}
        </p>
        <p className="text-sm text-muted-foreground">Total productive time</p>
      </div>
    </div>
  );
}
