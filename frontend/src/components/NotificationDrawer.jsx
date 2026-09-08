import React from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAsRead }) {
  if (!isOpen) return null;

  const getIcon = (priority, type) => {
    if (priority === 'EMERGENCY' || type === 'FOOD_SPOILED') {
      return <ShieldAlert className="w-5 h-5 text-red-600" />;
    }
    if (priority === 'HIGH' || type === 'URGENT_EXPIRY') {
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
    return <Info className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-emerald-300" />
              <h3 className="font-bold text-lg">Notifications Center</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && onMarkAsRead(n.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    !n.read ? 'bg-emerald-50/60 border-emerald-200 shadow-xs' : 'bg-white border-slate-100 opacity-75'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getIcon(n.priority, n.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
