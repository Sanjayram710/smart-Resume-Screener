import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, FileSpreadsheet, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0e1626]/90 backdrop-blur-md border-b border-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 clay-icon-blob bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-200">
              <Bot className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white font-['Outfit'] tracking-tight">
                Smart Resume Screener
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 clay-badge">
                AI Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/"
              className={`px-4 py-2 text-xs font-bold transition-all duration-150 flex items-center space-x-2 rounded-full ${
                isActive('/') && location.pathname === '/'
                  ? 'clay-btn-secondary text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-full'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/jobs/create"
              className={`px-4 py-2 text-xs font-bold transition-all duration-150 flex items-center space-x-2 rounded-full ${
                isActive('/jobs/create')
                  ? 'clay-btn-primary'
                  : 'clay-btn-secondary text-emerald-300 hover:text-emerald-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
