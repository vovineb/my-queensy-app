import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Context
const ToastContext = React.createContext(null);

// Toast Types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const contextValue = {
    addToast,
    removeToast,
    success: (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration),
    error: (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration),
    info: (message, duration) => addToast(message, TOAST_TYPES.INFO, duration),
    warning: (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Component
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  // Icon based on type
  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case TOAST_TYPES.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case TOAST_TYPES.WARNING:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case TOAST_TYPES.INFO:
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Background color based on type
  const getBgColor = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case TOAST_TYPES.ERROR:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case TOAST_TYPES.WARNING:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case TOAST_TYPES.INFO:
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center w-full max-w-sm p-4 mb-4 rounded-lg shadow-lg border ${getBgColor()} backdrop-blur-sm`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      <div className="ml-3 text-sm font-normal text-gray-800 dark:text-gray-200">
        {toast.message}
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white/20 dark:bg-navy-800/20 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
        onClick={() => onClose(toast.id)}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;