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
    <header className="sticky top-0 z-50 bg-[#FAF3E7]/90 backdrop-blur-md border-b border-[#F0E4D3] shadow-[0_4px_20px_rgba(180,110,40,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 clay-icon-blob bg-gradient-to-br from-[#FB923C] to-[#EA580C] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-200 shadow-md">
              <Bot className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-[#2A1B0F] font-['Outfit'] tracking-tight">
                Smart Resume Screener
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74] clay-badge">
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
                  ? 'clay-btn-secondary text-[#2A1B0F] border-[#DFCCA8]'
                  : 'text-[#6B553F] hover:text-[#2A1B0F] hover:bg-[#F5EAD9]/60 rounded-full'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#EA580C]" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/jobs/create"
              className={`px-4 py-2 text-xs font-bold transition-all duration-150 flex items-center space-x-2 rounded-full ${
                isActive('/jobs/create')
                  ? 'clay-btn-primary'
                  : 'clay-btn-secondary text-[#C2410C] hover:text-[#9A3412]'
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
