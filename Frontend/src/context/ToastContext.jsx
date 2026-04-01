import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        // Mark as exiting for fade-out animation
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
        // Remove after animation completes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            if (timersRef.current[id]) {
                clearTimeout(timersRef.current[id]);
                delete timersRef.current[id];
            }
        }, 300);
    }, []);

    const showToast = useCallback((message, type = 'info') => {
        const id = ++toastIdCounter;
        setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

        // Auto-dismiss after 4 seconds
        timersRef.current[id] = setTimeout(() => {
            removeToast(id);
        }, 4000);

        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type}${toast.exiting ? ' toast-exit' : ''}`}
                    >
                        <span className="toast-message">{toast.message}</span>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
