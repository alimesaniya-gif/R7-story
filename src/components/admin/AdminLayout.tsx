import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, Settings, LogOut, 
  Home, ExternalLink, ChevronRight, ShieldAlert, User 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export const AdminLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const { pathname } = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Stories', path: '/admin/stories', icon: BookOpen },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">StoryWorld</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors uppercase tracking-widest text-xs">
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-bottom border-slate-100 px-8 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{auth.currentUser?.email}</p>
              <p className="text-[10px] font-black text-blue-600 flex items-center justify-end gap-1 uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" /> System Admin
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
