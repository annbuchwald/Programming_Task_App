import React, { useEffect } from 'react';
import {BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import {AuthProvider} from "./context/AuthContext";

const AppContent = () => {
    const { showToast } = useToast();

    useEffect(() => {
        const handleTokenExpired = () => {
            showToast('Twoja sesja wygasła. Zaloguj się ponownie.', 'error');
        };

        window.addEventListener('tokenExpired', handleTokenExpired);

        return () => {
            window.removeEventListener('tokenExpired', handleTokenExpired);
        };
    }, [showToast]);

    return <AppRoutes />;
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <AppContent />
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
