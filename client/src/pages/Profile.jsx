import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, FileText, Lock, 
  Save, CheckCircle2, Shield, Calendar, Database, 
  RefreshCw, KeyRound, Sparkles, AlertCircle 
} from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile, changePassword, showNotification } = useAuth();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  // Sync profileData with current user state
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError('');
  };

  // Submit profile updates
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      showNotification('Name cannot be empty.', 'error');
      return;
    }

    setSavingProfile(true);
    const res = await updateProfile(profileData);
    setSavingProfile(false);

    if (res.success) {
      setLastSaved(new Date().toLocaleTimeString());
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Please provide both current and new password.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    setPasswordError('');

    const res = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    setChangingPassword(false);

    if (res.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      setPasswordError(res.error || 'Failed to update password.');
    }
  };

  // Avatar presets
  const avatarColors = [
    'from-indigo-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          {/* Avatar Badge */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-1 shadow-xl shadow-indigo-600/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-white text-3xl font-extrabold tracking-wider">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
          </div>

          {/* User Basic Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user?.name || 'User Profile'}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user?.role || 'Member'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Synced to SQLite
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-slate-500" />
              {user?.email}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                User ID #{user?.id}
              </span>
              {lastSaved && (
                <span className="text-emerald-400 font-medium">
                  Last saved at {lastSaved}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Edit Profile (Left) and Security / Password (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Edit Profile (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Update Profile Information
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Changes will be saved immediately to the SQLite database
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Email (Read-only Account Identifier) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Account Email
                </label>
                <span className="text-[11px] text-slate-500">Unique Identity</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    placeholder="City, Country"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bio / About */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Bio / About Me
              </label>
              <textarea
                name="bio"
                rows={4}
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Share a short bio or description..."
                className="w-full p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 focus:ring-2 focus:ring-indigo-500/40 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {savingProfile ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security (Password Change) & DB Overview */}
        <div className="space-y-8">
          {/* Change Password Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                Change Password
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Protect your account with a secure password
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repeat new password"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-amber-500/40"
              >
                {changingPassword ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Database Details Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 text-xs text-slate-400 space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database Sync Overview</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Engine:</span>
                <span className="text-emerald-400">SQLite3 (WAL Mode)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Storage File:</span>
                <span className="text-slate-300">server/auth.db</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Encryption:</span>
                <span className="text-slate-300">bcrypt (10 rounds)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="text-indigo-400">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
