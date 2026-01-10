import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: ReactNode;
  streak: number;
}

export function AppLayout({ children, streak }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar streak={streak} />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
