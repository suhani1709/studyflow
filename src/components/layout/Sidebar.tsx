import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings,
  BookOpen,
  Flame
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  streak: number;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

export function Sidebar({ streak }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">StudyFlow</h1>
            <p className="text-xs text-muted-foreground">Stay focused</p>
          </div>
        </div>
      </div>

      {/* Streak Badge */}
      <div className="p-4">
        <div className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-xl",
          streak > 0 
            ? "bg-gradient-to-r from-streak-fire/10 to-streak-glow/10 border border-streak-fire/20" 
            : "bg-muted"
        )}>
          <Flame className={cn(
            "w-5 h-5",
            streak > 0 ? "text-streak-fire" : "text-muted-foreground"
          )} />
          <div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
            <p className={cn(
              "font-bold text-lg leading-tight",
              streak > 0 ? "text-streak-fire" : "text-muted-foreground"
            )}>
              {streak} {streak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'nav-link',
                isActive && 'nav-link-active'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Focus on what matters 📚
        </p>
      </div>
    </aside>
  );
}
