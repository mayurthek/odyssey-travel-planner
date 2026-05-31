import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

interface ToastContextProps {
  toast: (message: string, type?: ToastMessage['type']) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Core individual toast bubble
const Toast: React.FC<{
  message: ToastMessage;
  onClose: (id: string) => void;
}> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [message.id, onClose]);

  const icons = {
    success: <CheckCircle2 size={15} className="text-emerald-600" />,
    warning: <AlertTriangle size={15} className="text-amber-600" />,
    error: <AlertCircle size={15} className="text-rose-600" />,
    info: <CheckCircle2 size={15} className="text-stone-600" />,
  };

  const bgColors = {
    success: 'bg-emerald-50/95 border-emerald-100 text-emerald-950',
    warning: 'bg-amber-50/95 border-amber-100 text-amber-950',
    error: 'bg-rose-50/95 border-rose-100 text-rose-950',
    info: 'bg-stone-50/95 border-stone-200 text-stone-900',
  };

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3.5 border rounded-xl shadow-premium backdrop-blur-[4px] select-none text-xs font-medium transition-all duration-300 animate-slide-in pointer-events-auto w-72 max-w-sm border-stone-200/50 ${bgColors[message.type || 'success']}`}
    >
      <span className="flex-shrink-0">{icons[message.type || 'success']}</span>
      <span className="flex-1 font-sans leading-relaxed">{message.message}</span>
      <button 
        onClick={() => onClose(message.id)}
        className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-all duration-150"
        aria-label="Dismiss toast"
      >
        <X size={13} />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container overlay overlay */}
      <div 
        className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none"
        role="live"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <Toast key={item.id} message={item} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be utilized within a ToastProvider');
  }
  return context;
};
