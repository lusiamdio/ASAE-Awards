import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  subtext?: string;
  type: 'success' | 'alert' | 'info';
}

interface ToastContextType {
  toast: (text: string, subtext?: string, type?: 'success' | 'alert' | 'info') => void;
  success: (text: string, subtext?: string) => void;
  alert: (text: string, subtext?: string) => void;
  info: (text: string, subtext?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, subtext?: string, type: 'success' | 'alert' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, subtext, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const success = useCallback((text: string, subtext?: string) => addToast(text, subtext, 'success'), [addToast]);
  const alert = useCallback((text: string, subtext?: string) => addToast(text, subtext, 'alert'), [addToast]);
  const info = useCallback((text: string, subtext?: string) => addToast(text, subtext, 'info'), [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast, success, alert, info }}>
      {children}
      {/* Toast Portal Container */}
      <div id="toast-root" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-dark-card border border-gold/20 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-3 backdrop-blur-md relative overflow-hidden"
            >
              {/* Left-accent color bar based on type */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  msg.type === 'success' 
                    ? 'bg-sa-green' 
                    : msg.type === 'alert' 
                    ? 'bg-angola-red' 
                    : 'bg-gold'
                }`}
              />
              
              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {msg.type === 'success' && <CheckCircle2 className="text-sa-green" size={20} />}
                {msg.type === 'alert' && <AlertCircle className="text-angola-red" size={20} />}
                {msg.type === 'info' && <Info className="text-gold" size={20} />}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-display font-semibold text-sm text-ivory tracking-wide leading-tight">
                  {msg.text}
                </h4>
                {msg.subtext && (
                  <p className="font-sans text-xs text-dim mt-1 leading-normal">
                    {msg.subtext}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={() => removeToast(msg.id)}
                className="text-dim hover:text-ivory transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
