import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  AppWindow,
  UserCircle,
  ScrollText,
  Settings,
  Brain,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Providers', href: '/providers', icon: Brain },
  { name: 'Apps', href: '/apps', icon: AppWindow },
  { name: 'Profiles', href: '/profiles', icon: UserCircle },
  { name: 'Logs', href: '/logs', icon: ScrollText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800">
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <Cpu className="h-8 w-8 text-primary-500" />
          <span className="ml-3 text-xl font-bold">CC-Switch</span>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="text-sm text-slate-500">
            <p>Universal AI CLI</p>
            <p>Configuration Orchestrator</p>
            <p className="text-xs mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
