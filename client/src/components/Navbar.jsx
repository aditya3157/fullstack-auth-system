import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, LogOut, Database, LayoutDashboard, Sparkles } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'login')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                AuthSphere
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SQLite Active
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">React + Node Auth System</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Dashboard Tab */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Dashboard</span>
              </button>

              {/* Profile Tab */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              {/* Database Live View */}
              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'database'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Inspect real-time SQLite database contents"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">DB Explorer</span>
              </button>

              <div className="h-6 w-px bg-slate-800 mx-1"></div>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-1">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white uppercase ring-2 ring-indigo-500/30">
                    {user?.name ? user.name.slice(0, 2) : 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-200 hidden lg:inline max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-all"
                  title="Log out from your account"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Database Explorer public view */}
              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'database'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">DB Explorer</span>
              </button>

              <button
                onClick={() => setActiveTab('login')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'register'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20 border border-indigo-500/30'
                }`}
              >
                Sign Up
              </button>
            </>
          )}
        </nav>

      </div>
    </header>
  );
};
