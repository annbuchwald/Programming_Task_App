import React, { createContext, useContext, useState } from 'react';
import Toast from '../features/auth/components/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info', duration = 5000) => {
        setToast({ message, type, duration });
    };

    const hideToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={hideToast}
                />
            )}
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
