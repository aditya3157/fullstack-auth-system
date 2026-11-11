import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { Database, RefreshCw, CheckCircle, Table, Code, ShieldCheck, User } from 'lucide-react';

export const DatabaseView = () => {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('table'); // 'table' | 'json'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, healthRes] = await Promise.allSettled([
        authAPI.getUsers(),
        authAPI.getHealth(),
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.users || []);
      }
      if (healthRes.status === 'fulfilled') {
        setHealth(healthRes.value);
      }
    } catch (err) {
      console.error('Failed to load database records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
            <Database className="w-4 h-4" />
            <span>SQLite 3 Live Database Inspector</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Connected Database: <code className="text-indigo-400 font-mono text-xl sm:text-2xl">auth.db</code>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Inspect all user records currently stored in the backend SQLite relational database.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start md:self-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Info Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Engine</span>
          <div className="text-slate-200 font-bold text-sm mt-0.5">SQLite 3 (better-sqlite3)</div>
          <span className="text-[11px] text-emerald-400">WAL Concurrency Mode</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Users</span>
          <div className="text-slate-200 font-bold text-sm mt-0.5">{users.length} Users in Database</div>
          <span className="text-[11px] text-indigo-400">Synchronized</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Server Status</span>
          <div className="text-slate-200 font-bold text-sm mt-0.5">API Port 5000</div>
          <span className="text-[11px] text-emerald-400">Online & Accepting Queries</span>
        </div>
      </div>

      {/* Database View Content */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'table'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setActiveSubTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'json'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>
          <span className="text-xs text-slate-400">
            {users.length} {users.length === 1 ? 'record' : 'records'} found
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Querying database...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <User className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No user accounts registered yet. Use the <strong>Sign Up</strong> tab to create one!
          </div>
        ) : activeSubTab === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Bio</th>
                  <th className="py-3 px-3">Created At</th>
                  <th className="py-3 px-3">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-indigo-400 font-bold">#{u.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{u.name}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3 text-slate-400">{u.phone || '—'}</td>
                    <td className="py-3 px-3 text-slate-400">{u.location || '—'}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate" title={u.bio}>
                      {u.bio || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                      {u.created_at}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                      {u.updated_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto">
            <pre className="text-[11px] font-mono text-emerald-400">
              {JSON.stringify(users, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};
