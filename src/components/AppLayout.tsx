import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, Swords, BarChart3, Home } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/tournament/t1', icon: Trophy, label: 'Tournament' },
  { path: '/tournament/t1/teams', icon: Users, label: 'Teams' },
  { path: '/tournament/t1/matches', icon: Swords, label: 'Matches' },
  { path: '/tournament/t1/dashboard', icon: BarChart3, label: 'Stats' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="cricket-gradient px-4 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-lg">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center">
            <Trophy className="w-4 h-4 text-accent-foreground" />
          </div>
          <h1 className="text-lg font-display font-bold text-primary-foreground tracking-tight">
            CrickHub
          </h1>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50 bottom-nav-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
