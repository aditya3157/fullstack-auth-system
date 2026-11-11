import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { DatabaseView } from './pages/DatabaseView';
import { ShieldCheck, Database, Lock, UserCheck } from 'lucide-react';

const MainContent = () => {
  const { isAuthenticated, isLoading, notification, clearNotification } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  // Sync activeTab when auth state changes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (activeTab === 'login' || activeTab === 'register') {
          setActiveTab('dashboard');
        }
      } else {
        if (activeTab === 'dashboard' || activeTab === 'profile') {
          setActiveTab('login');
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-400">Verifying security session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'login' && (
          <Login onSwitchToRegister={() => setActiveTab('register')} />
        )}
        {activeTab === 'register' && (
          <Register onSwitchToLogin={() => setActiveTab('login')} />
        )}
        {activeTab === 'dashboard' && isAuthenticated && (
          <Dashboard setActiveTab={setActiveTab} />
        )}
        {activeTab === 'profile' && isAuthenticated && <Profile />}
        {activeTab === 'database' && <DatabaseView />}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>AuthSphere Authentication & Profile System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              SQLite 3
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              bcrypt + JWT
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              React 19
            </span>
          </div>
        </div>
      </footer>

      {/* Global Toast */}
      <Toast notification={notification} onClose={clearNotification} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
