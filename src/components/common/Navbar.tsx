import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useData';

export const Navbar = () => {
  const { isDark, toggleDarkMode, config } = useTheme();
  const { user, isAdmin } = useAuth();
  const { categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-100'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-8 h-8 ${config.accent} rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform`}>
            S
          </div>
          <span className="text-xl font-bold tracking-tight">StoryWorld</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <form onSubmit={handleSearch} className="w-full">
            <input 
              type="text" 
              placeholder="Search stories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all outline-none ${isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-400 focus:bg-white'}`}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-600 transition-colors" title="Admin Dashboard">
              <ShieldCheck className="w-5 h-5" />
            </Link>
          )}
          <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 md:hidden">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t dark:border-slate-800 p-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Search stories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </form>
          
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`} 
                onClick={() => setIsOpen(false)}
                className={`p-3 rounded-xl border transition-all text-center font-medium ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800">
            <button onClick={toggleDarkMode} className="flex items-center gap-2 font-medium">
              {isDark ? <><Sun className="w-5 h-5" /> Light Mode</> : <><Moon className="w-5 h-5" /> Dark Mode</>}
            </button>
            {isAdmin && <Link to="/admin" className="text-blue-600 font-bold">Admin Panel</Link>}
          </div>
        </div>
      )}
    </nav>
  );
};
