import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type } = notification;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const bgMap = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-900/30',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/30',
    info: 'bg-sky-950/90 border-sky-500/40 text-sky-100 shadow-sky-900/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all ${
          bgMap[type] || bgMap.info
        }`}
      >
        {iconMap[type] || iconMap.info}
        <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded-lg"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
