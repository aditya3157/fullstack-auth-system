import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Database, 
  ArrowRight, Sparkles, CheckCircle2, Clock, Activity 
} from 'lucide-react';

export const Dashboard = ({ setActiveTab }) => {
  const { user } = useAuth();

  // Calculate profile completion percentage
  const calculateCompleteness = () => {
    if (!user) return 0;
    const fields = [user.name, user.email, user.phone, user.location, user.bio];
    const filled = fields.filter((f) => f && f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Fullstack Authentication System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">{user?.name}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              You are signed in via JWT Bearer Token. All profile updates, registrations, and logins are synced directly to your SQLite database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Manage Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className="py-3 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>View DB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Account Status */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Account Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">Active & Verified</div>
          <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Authenticated via JWT
          </p>
        </div>

        {/* Metric 2: Profile Completeness */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Profile Status</span>
            <span className="text-xs font-bold text-indigo-400">{completeness}%</span>
          </div>
          <div className="text-xl font-bold text-white">
            {completeness === 100 ? 'Fully Complete' : 'In Progress'}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Database Engine */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Database</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">SQLite 3</div>
          <p className="text-[11px] text-slate-400 mt-1">auth.db in WAL mode</p>
        </div>

        {/* Metric 4: Security Standard */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Security</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">bcrypt + JWT</div>
          <p className="text-[11px] text-slate-400 mt-1">10 Salt Rounds Hashing</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Your Profile Snapshot
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current profile fields stored in SQLite database
            </p>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
          >
            Edit in Profile Tab
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-semibold uppercase">Full Name</span>
            <div className="text-slate-100 font-medium text-base mt-1">{user?.name}</div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-semibold uppercase">Email</span>
            <div className="text-slate-100 font-medium text-base mt-1">{user?.email}</div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-semibold uppercase">Phone</span>
            <div className="text-slate-100 font-medium text-base mt-1">
              {user?.phone || <span className="text-slate-500 italic">Not specified</span>}
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-semibold uppercase">Location</span>
            <div className="text-slate-100 font-medium text-base mt-1">
              {user?.location || <span className="text-slate-500 italic">Not specified</span>}
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 font-semibold uppercase">Bio / About</span>
            <div className="text-slate-100 font-normal text-sm mt-1 whitespace-pre-wrap">
              {user?.bio || <span className="text-slate-500 italic">No bio added yet. Click "Manage Profile" to add one!</span>}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
